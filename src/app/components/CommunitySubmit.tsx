import {
  Upload, Link as LinkIcon, QrCode, MessageSquare, AlertCircle, Shield,
  CheckCircle, Users, Clock, TrendingUp, Eye, EyeOff, Info, ArrowLeft,
  Zap, FileImage, Loader2, X,
} from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ── Types ──────────────────────────────────────────────────────────────────────
type ReportType   = 'screenshot' | 'url' | 'text' | 'qr';
type ReportStatus = 'pending' | 'ai_reviewing' | 'community_verified' | 'shield_squad' | 'rejected';

interface CommunityReport {
  id: string;
  type: ReportType;
  content_preview: string;
  description: string | null;
  screenshot_url: string | null;
  status: ReportStatus;
  helped_protect_count: number;
  xp_awarded: number;
  created_at: string;
}

interface ReportStats {
  total_submissions: number;
  people_protected: number;
  total_xp_earned: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const STATUS_META: Record<ReportStatus, { label: string; color: string; dot: string }> = {
  pending:            { label: 'Pending AI Review',    color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  ai_reviewing:       { label: 'AI Reviewing',         color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  community_verified: { label: 'Community Verified',   color: 'bg-green-100 text-green-700',   dot: 'bg-green-500'  },
  shield_squad:       { label: 'Sent to Shield Squad', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  rejected:           { label: 'Not a Threat',         color: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400'   },
};

const TYPE_ICON: Record<ReportType, typeof MessageSquare> = {
  text:       MessageSquare,
  url:        LinkIcon,
  screenshot: FileImage,
  qr:         QrCode,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)    return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Status info for the success timeline ─────────────────────────────────────
const STATUS_TIMELINE = [
  { status: 'Pending AI Review',    icon: Clock,       color: 'yellow', description: 'Our AI is analysing your submission for threat patterns' },
  { status: 'Sent to Shield Squad', icon: Users,       color: 'purple', description: 'Community experts are reviewing and verifying the threat' },
  { status: 'Community Verified',   icon: CheckCircle, color: 'green',  description: 'Verified as a threat and added to our protection database' },
  { status: 'Added to Threat Trends', icon: TrendingUp, color: 'blue', description: 'Helping protect the Singapore community from similar scams' },
];

const privacyTips = [
  { tip: 'Cover or blur out your name, phone number, and address', icon: EyeOff },
  { tip: 'Remove bank account numbers and credit card details', icon: Shield },
  { tip: 'Hide profile pictures and personal photos', icon: Eye },
  { tip: 'Blur out names of friends and family members', icon: Users },
];

// ── Component ──────────────────────────────────────────────────────────────────
export function CommunitySubmit() {
  const { session } = useAuth();

  const [activeTab, setActiveTab]     = useState<ReportType>('screenshot');
  const [urlInput, setUrlInput]       = useState('');
  const [textInput, setTextInput]     = useState('');
  const [description, setDescription] = useState('');
  const [agreedToPrivacy, setAgreed]  = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver]       = useState(false);

  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted]     = useState(false);
  const [lastXpAwarded, setLastXpAwarded] = useState(50);

  const [reports, setReports]         = useState<CommunityReport[]>([]);
  const [stats, setStats]             = useState<ReportStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const authHeader: Record<string, string> = session
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};

  const fetchData = useCallback(async () => {
    if (!session) { setLoadingData(false); return; }
    setLoadingData(true);
    try {
      const [mineRes, statsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/reports/mine`,  { headers: authHeader }),
        fetch(`${BACKEND_URL}/api/reports/stats`, { headers: authHeader }),
      ]);
      const mine  = await mineRes.json();
      const stats = await statsRes.json();
      if (mine.data)  setReports(mine.data);
      if (stats.data) setStats(stats.data);
    } catch { /* silently ignore */ }
    finally { setLoadingData(false); }
  }, [session]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset file when tab changes
  useEffect(() => { setSelectedFile(null); setDragOver(false); }, [activeTab]);

  function handleFileSelect(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setSubmitError('Please select an image file.'); return; }
    if (file.size > 10 * 1024 * 1024)   { setSubmitError('File must be under 10 MB.'); return; }
    setSubmitError(null);
    setSelectedFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0] ?? null);
  }

  async function handleSubmit() {
    if (!agreedToPrivacy || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const body: Record<string, string> = { type: activeTab };
      if (description.trim()) body.description = description.trim();

      if (activeTab === 'url')  body.content = urlInput.trim();
      if (activeTab === 'text') body.content = textInput.trim();

      if ((activeTab === 'screenshot' || activeTab === 'qr') && selectedFile) {
        body.screenshot_base64 = await fileToBase64(selectedFile);
        body.screenshot_mime   = selectedFile.type;
        body.screenshot_name   = selectedFile.name;
      }

      const res = await fetch(`${BACKEND_URL}/api/reports`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body:    JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error ?? 'Submission failed. Please try again.'); return; }

      setLastXpAwarded(data.data?.xp_awarded ?? 50);
      await fetchData();
      setSubmitted(true);
    } catch { setSubmitError('Network error. Please try again.'); }
    finally { setSubmitting(false); }
  }

  function resetForm() {
    setSubmitted(false);
    setUrlInput(''); setTextInput(''); setDescription('');
    setAgreed(false); setSelectedFile(null); setSubmitError(null);
  }

  // ── Success view ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">Submission Received!</h1>
            <p className="text-lg text-gray-600">Thank you for helping protect our community</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-green-600" />
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">+{lastXpAwarded} XP</div>
                <div className="text-sm text-gray-600">Community Contribution Bonus</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">What happens next?</h2>
            <div className="space-y-4">
              {STATUS_TIMELINE.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gray-100'}`}>
                    <item.icon className={`w-6 h-6 ${index === 0 ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold ${index === 0 ? 'text-gray-900' : 'text-gray-400'}`}>{item.status}</h3>
                      {index === 0 && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg">Current</span>}
                    </div>
                    <p className={`text-sm ${index === 0 ? 'text-gray-600' : 'text-gray-400'}`}>{item.description}</p>
                  </div>
                  {index === 0 && <div className="w-6 h-6 bg-yellow-500 rounded-full animate-pulse mt-3"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={resetForm} className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all">
              Submit Another
            </button>
            <Link to="/dashboard" className="px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-bold rounded-xl transition-all">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────────
  const canSubmit = agreedToPrivacy && !submitting && (
    activeTab === 'url'  ? urlInput.trim().length > 0 :
    activeTab === 'text' ? textInput.trim().length > 0 :
    selectedFile !== null
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Submit Suspicious Content</h1>
          <p className="text-gray-600">Help protect the Singapore community by reporting threats you've encountered</p>
        </div>
        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium rounded-xl transition-all">
          <ArrowLeft className="w-4 h-4" /><span>Dashboard</span>
        </Link>
      </div>

      {/* Privacy Warning */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 mb-2">Important: Privacy First!</h3>
            <p className="text-gray-700 mb-4 font-medium">
              Before submitting, please <strong>remove all personal information</strong> to protect your privacy and others'.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {privacyTips.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <item.icon className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-2xl p-2 border-2 border-gray-200 grid grid-cols-4 gap-2">
            {(['screenshot', 'url', 'text', 'qr'] as ReportType[]).map((tab) => {
              const Icon = TYPE_ICON[tab];
              const label = tab === 'screenshot' ? 'Screenshot' : tab === 'url' ? 'URL' : tab === 'text' ? 'Text' : 'QR Code';
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${activeTab === tab ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-5 h-5" /><span className="text-sm">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Input area */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            {(activeTab === 'screenshot' || activeTab === 'qr') && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">{activeTab === 'qr' ? 'Upload QR Code Photo' : 'Upload Screenshot'}</h3>
                <input
                  ref={fileInputRef}
                  type="file" accept="image/*" className="hidden"
                  onChange={e => handleFileSelect(e.target.files?.[0] ?? null)}
                />
                {selectedFile ? (
                  <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-6 flex items-center gap-4">
                    <FileImage className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${dragOver ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400 bg-gray-50 hover:bg-red-50'}`}
                  >
                    {activeTab === 'qr' ? <QrCode className="w-16 h-16 text-purple-400 mx-auto mb-4" /> : <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
                    <p className="text-gray-700 font-medium mb-2">Drag & drop your image here</p>
                    <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                    <span className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl">Choose File</span>
                    <p className="text-xs text-gray-500 mt-4">PNG, JPG, JPEG — max 10 MB</p>
                    {activeTab === 'qr' && <p className="text-xs text-orange-600 mt-1 font-medium">Do not scan the QR code — just photograph it</p>}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">Suspicious URL</h3>
                <input
                  type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com/suspicious-link"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500">Do not click on the link — just copy and paste it here.</p>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">Suspicious Message</h3>
                <textarea
                  value={textInput} onChange={e => setTextInput(e.target.value)}
                  placeholder="Paste the suspicious WhatsApp message, SMS, email, or social media post here..."
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500">Remember to remove names, phone numbers, and other personal details!</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Tell us more <span className="font-normal text-gray-400 text-sm">(optional)</span></h3>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Where did you encounter this? What made you suspicious?"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          {/* Privacy checkbox */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreedToPrivacy} onChange={e => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500" />
              <p className="text-sm text-gray-700">
                <strong>I confirm that:</strong> I have removed all personal information from this submission to protect my privacy and the privacy of others.
              </p>
            </label>
          </div>

          {/* Error */}
          {submitError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />{submitError}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${canSubmit ? 'hover:from-red-700 hover:to-orange-700' : 'opacity-50 cursor-not-allowed'}`}
          >
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</> : 'Submit to Community'}
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Impact Stats */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Your Impact</h3>
            </div>
            {loadingData ? (
              <div className="flex items-center justify-center py-6 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />Loading…
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                  <div className="text-4xl font-black text-green-600 mb-1">{stats?.total_submissions ?? 0}</div>
                  <div className="text-sm text-gray-600">Submissions</div>
                </div>
                <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                  <div className="text-4xl font-black text-green-600 mb-1">{stats?.people_protected ?? 0}</div>
                  <div className="text-sm text-gray-600">People Protected</div>
                </div>
                <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                  <div className="text-4xl font-black text-blue-600 mb-1">+{stats?.total_xp_earned ?? 0} XP</div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </div>
              </div>
            )}
          </div>

          {/* My Recent Submissions */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">My Recent Submissions</h3>
            {loadingData ? (
              <div className="flex items-center justify-center py-4 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />Loading…
              </div>
            ) : reports.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 5).map((r) => {
                  const Icon  = TYPE_ICON[r.type];
                  const meta  = STATUS_META[r.status];
                  return (
                    <div key={r.id} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all">
                      <div className="flex items-start gap-3 mb-2">
                        <Icon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate mb-1">{r.content_preview}</div>
                          <div className="text-xs text-gray-400">{timeAgo(r.created_at)}</div>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${meta.color}`}>
                        <div className={`w-2 h-2 rounded-full ${meta.dot} animate-pulse`}></div>
                        <span>{meta.label}</span>
                      </div>
                      {r.helped_protect_count > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          <Shield className="w-3 h-3 inline mr-1" />
                          Helped protect {r.helped_protect_count} people
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Guidelines</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Submit only real suspicious content you encountered',
                'Always remove personal information before submitting',
                "Don't click on suspicious links — just copy them",
                'If unsure, ask a trusted adult before submitting',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
