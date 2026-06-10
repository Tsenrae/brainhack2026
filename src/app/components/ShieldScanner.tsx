import { useState, useEffect, useRef } from 'react';
import {
  Upload, Link as LinkIcon, QrCode, MessageSquare,
  Image as ImageIcon, Shield, AlertTriangle, CheckCircle,
  Zap, Brain, Clock, X, FileImage, Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

type ScanTab = 'text' | 'url' | 'upload' | 'qr';

interface ScanHistoryItem {
  scan_id: string;
  type: 'text' | 'url' | 'qr' | 'upload';
  content_preview: string;
  risk_score: number;
  classification: string;
  scanned_at: string;
}

interface ScannerStats {
  total_scans: number;
  threats_found: number;
  safe_count: number;
  xp_earned: number;
}

const DEMO_CONTENT = {
  phishing: `URGENT NOTICE FROM DBS BANK\n\nDear Valued Customer,\n\nYour account has been FLAGGED for suspicious activity. You must verify your identity IMMEDIATELY or your account will be PERMANENTLY CLOSED within 24 hours!\n\nClick here NOW to verify: www.dbs-sg-verify.xyz/urgent\n\nProvide your:\n- Internet banking password\n- OTP code\n- PIN\n\nACT NOW! Limited time only!`,
  giveaway: `CONGRATULATIONS! You have been specially selected!\n\nYou won our Singapore National Day Lucky Draw! Claim your FREE iPhone 16 Pro before it expires in 1 hour!\n\nVisit: free-iphone-sg.xyz/claim\n\nIMPORTANT: Provide your credit card details for $2 shipping. LIMITED SLOTS REMAINING! ACT NOW!`,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';
const MAX_SCAN_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_SCAN_IMAGE_MB = MAX_SCAN_IMAGE_BYTES / (1024 * 1024);

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function riskColor(score: number) {
  if (score > 70) return { text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-300' };
  if (score > 40) return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' };
  return               { text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-300' };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ShieldScanner() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<ScanTab>('text');
  const [isScanning, setIsScanning]   = useState(false);
  const [scanError, setScanError]     = useState<string | null>(null);
  const [textInput, setTextInput]     = useState('');
  const [urlInput, setUrlInput]       = useState('');
  const [qrUrlInput, setQrUrlInput]   = useState('');
  const [uploadFile, setUploadFile]   = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [qrFile, setQrFile]           = useState<File | null>(null);
  const [qrPreview, setQrPreview]     = useState<string | null>(null);
  const [dragOver, setDragOver]       = useState(false);
  const [stats, setStats]             = useState<ScannerStats>({ total_scans: 0, threats_found: 0, safe_count: 0, xp_earned: 0 });
  const [history, setHistory]         = useState<ScanHistoryItem[]>([]);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef     = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) return;
    const headers = { Authorization: `Bearer ${session.access_token}` };
    Promise.all([
      fetch(`${BACKEND_URL}/api/scanner/stats`,   { headers }).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/scanner/history`, { headers }).then(r => r.json()),
    ]).then(([s, h]) => {
      if (s.data) setStats(s.data);
      if (h.data) setHistory(h.data);
    }).catch(console.error);
  }, [session]);

  // Revoke preview URLs on tab change
  useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview);
      if (qrPreview)     URL.revokeObjectURL(qrPreview);
    };
  }, []);

  function selectUploadFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setScanError('Please select an image file.'); return; }
    if (file.size > MAX_SCAN_IMAGE_BYTES) { setScanError(`File must be under ${MAX_SCAN_IMAGE_MB} MB.`); return; }
    setScanError(null);
    setUploadFile(file);
    setUploadPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
  }

  function selectQrFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setScanError('Please select an image file.'); return; }
    if (file.size > MAX_SCAN_IMAGE_BYTES) { setScanError(`File must be under ${MAX_SCAN_IMAGE_MB} MB.`); return; }
    setScanError(null);
    setQrFile(file);
    setQrPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
  }

  async function runScan(type: ScanTab) {
    if (!session) { setScanError('You must be logged in to scan.'); return; }
    setScanError(null);
    setIsScanning(true);
    try {
      const body: Record<string, string> = { type };

      if (type === 'text') {
        if (!textInput.trim()) { setScanError('Please enter text to scan.'); setIsScanning(false); return; }
        body.content = textInput.trim();
      } else if (type === 'url') {
        if (!urlInput.trim()) { setScanError('Please enter a URL to scan.'); setIsScanning(false); return; }
        body.content = urlInput.trim();
      } else if (type === 'upload') {
        if (!uploadFile) { setScanError('Please select an image to scan.'); setIsScanning(false); return; }
        body.image_base64 = await fileToBase64(uploadFile);
        body.image_mime   = uploadFile.type;
        body.image_name   = uploadFile.name;
      } else if (type === 'qr') {
        if (!qrFile && !qrUrlInput.trim()) { setScanError('Upload a QR image or paste the URL from a QR code.'); setIsScanning(false); return; }
        if (qrFile) {
          body.image_base64 = await fileToBase64(qrFile);
          body.image_mime   = qrFile.type;
          body.image_name   = qrFile.name;
        }
        if (qrUrlInput.trim()) body.content = qrUrlInput.trim();
      }

      const res = await fetch(`${BACKEND_URL}/api/scanner/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(body),
      });
      const { data, error } = await res.json();
      if (error) throw new Error(error);
      navigate('/scanner/results', { state: data });
    } catch (err) {
      setIsScanning(false);
      setScanError((err as Error).message ?? 'Scan failed. Please try again.');
      console.error(err);
    }
  }

  if (isScanning) {
    const typeLabel = activeTab === 'url' ? 'URL' : activeTab === 'upload' ? 'image' : activeTab === 'qr' ? 'QR code' : 'text';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-8 border-purple-500/30 rounded-full" />
              <div className="absolute inset-0 border-8 border-transparent border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-4 border-8 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-12 h-12 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white">Analyzing {typeLabel}…</h2>
            <p className="text-purple-300">AI Shield is scanning for threats</p>
          </div>
          <div className="max-w-md mx-auto space-y-3">
            {[
              { label: activeTab === 'url' || activeTab === 'qr' ? 'Fetching page and following redirects' : 'Extracting text and metadata', done: true },
              { label: 'Running pattern recognition', done: true },
              { label: 'Checking against threat database', done: false },
              { label: 'Calculating risk score', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500' : 'bg-purple-500/30'}`}>
                  {step.done ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />}
                </div>
                <span className={`text-sm ${step.done ? 'text-green-300' : 'text-purple-300'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Shield Scanner</h1>
          <p className="text-gray-600">Submit suspicious content for instant AI threat analysis</p>
        </div>
        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all">
          ← Dashboard
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans',   value: stats.total_scans.toLocaleString(),   icon: Shield,        gradient: 'from-blue-500 to-cyan-500',    border: 'border-blue-200' },
          { label: 'Threats Found', value: stats.threats_found.toLocaleString(), icon: AlertTriangle, gradient: 'from-red-500 to-pink-500',     border: 'border-red-200' },
          { label: 'Safe Content',  value: stats.safe_count.toLocaleString(),    icon: CheckCircle,   gradient: 'from-green-500 to-emerald-500', border: 'border-green-200' },
          { label: 'XP Earned',     value: stats.xp_earned.toLocaleString(),     icon: Zap,           gradient: 'from-purple-500 to-pink-500',  border: 'border-purple-200' },
        ].map(({ label, value, icon: Icon, gradient, border }) => (
          <div key={label} className={`bg-white rounded-xl p-4 border-2 ${border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600">{label}</div>
                <div className="text-xl font-black text-gray-900">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl p-2 border-2 border-gray-200 flex gap-2">
            {([
              { key: 'text',   label: 'Text',    Icon: MessageSquare },
              { key: 'url',    label: 'URL',     Icon: LinkIcon },
              { key: 'upload', label: 'Upload',  Icon: Upload },
              { key: 'qr',     label: 'QR Code', Icon: QrCode },
            ] as const).map(({ key, label, Icon }) => (
              <button key={key} onClick={() => { setActiveTab(key); setScanError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === key ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="w-5 h-5" /><span>{label}</span>
              </button>
            ))}
          </div>

          {/* Text */}
          {activeTab === 'text' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Paste suspicious text or message</label>
                <textarea
                  value={textInput} onChange={e => setTextInput(e.target.value)}
                  placeholder="Paste a WhatsApp message, email, or any suspicious text here..."
                  rows={8} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
                />
                {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
                <button onClick={() => runScan('text')} disabled={!textInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all">
                  Analyze Text
                </button>
              </div>
            </div>
          )}

          {/* URL */}
          {activeTab === 'url' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Enter URL to scan</label>
                <p className="text-xs text-gray-500">The scanner will visit the page, follow all redirects, and extract the visible content for analysis.</p>
                <input
                  type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://suspicious-site.xyz or paste any link"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                />
                {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
                <button onClick={() => runScan('url')} disabled={!urlInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 hidden" /> Scan URL
                </button>
              </div>
            </div>
          )}

          {/* Upload */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Upload Screenshot or Image</h3>
                <p className="text-xs text-gray-500">Our AI vision model will read the visible text and analyse it for threats.</p>
              </div>
              <input ref={uploadInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => selectUploadFile(e.target.files?.[0] ?? null)} />

              {uploadFile && uploadPreview ? (
                <div className="rounded-2xl border-2 border-green-300 overflow-hidden">
                  <div className="bg-gray-900 flex items-center justify-center relative" style={{ maxHeight: 280 }}>
                    <img src={uploadPreview} alt="Preview" className="max-w-full object-contain" style={{ maxHeight: 280 }} />
                    <button onClick={() => { setUploadFile(null); setUploadPreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 flex items-center gap-3 bg-green-50">
                    <FileImage className="w-5 h-5 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{uploadFile.name}</p>
                      <p className="text-xs text-gray-500">{(uploadFile.size / 1024).toFixed(0)} KB · ready to scan</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); selectUploadFile(e.dataTransfer.files[0] ?? null); }}
                  onClick={() => uploadInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${dragOver ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400 bg-gray-50 hover:bg-red-50/40'}`}
                >
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">Drag & drop your screenshot here</p>
                  <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                  <span className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl">Choose Image</span>
                  <p className="text-xs text-gray-400 mt-4">PNG, JPG, WEBP — max {MAX_SCAN_IMAGE_MB} MB</p>
                </div>
              )}

              {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
              <button onClick={() => runScan('upload')} disabled={!uploadFile}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all">
                Analyse Image
              </button>
            </div>
          )}

          {/* QR */}
          {activeTab === 'qr' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 space-y-5">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">QR Code Scanner</h3>
                <p className="text-xs text-gray-500">Upload a photo of the QR code — we'll decode the URL and scrape the destination for threats. Or paste the URL manually if you already have it.</p>
              </div>

              {/* QR image upload */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Option 1: Upload QR code photo</p>
                <input ref={qrInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => selectQrFile(e.target.files?.[0] ?? null)} />
                {qrFile && qrPreview ? (
                  <div className="rounded-xl border-2 border-purple-300 overflow-hidden">
                    <div className="bg-gray-900 flex items-center justify-center relative" style={{ maxHeight: 200 }}>
                      <img src={qrPreview} alt="QR preview" className="max-w-full object-contain" style={{ maxHeight: 200 }} />
                      <button onClick={() => { setQrFile(null); setQrPreview(null); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 bg-purple-50 flex items-center gap-2 text-sm text-purple-700">
                      <QrCode className="w-4 h-4" />
                      <span className="truncate font-medium">{qrFile.name}</span>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => qrInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50 rounded-xl p-6 text-center transition-all">
                    <QrCode className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Upload QR code image</p>
                    <p className="text-xs text-gray-400 mt-1">Do not scan it in real life — just photograph it</p>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-200" /><span className="text-xs text-gray-400 font-medium">OR</span><div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Manual URL fallback */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Option 2: Paste URL from QR code</p>
                <input type="text" value={qrUrlInput} onChange={e => setQrUrlInput(e.target.value)}
                  placeholder="e.g. https://carpark-sg-payments.web.app/pay"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm" />
              </div>

              {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
              <button onClick={() => runScan('qr')} disabled={!qrFile && !qrUrlInput.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all">
                Scan QR Code
              </button>
            </div>
          )}

          {/* Quick Scan Demos */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Quick Scan Demos</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Try the scanner with pre-loaded sample scam content.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setActiveTab('text'); setTextInput(DEMO_CONTENT.phishing); }}
                className="p-4 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all text-left">
                <div className="font-bold text-gray-900 mb-1">Demo: Phishing Email</div>
                <div className="text-xs text-gray-600">Fake bank urgency + credential request</div>
              </button>
              <button onClick={() => { setActiveTab('text'); setTextInput(DEMO_CONTENT.giveaway); }}
                className="p-4 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all text-left">
                <div className="font-bold text-gray-900 mb-1">Demo: Fake Giveaway</div>
                <div className="text-xs text-gray-600">Free prize lure + card details request</div>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Scans</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No scans yet — try a demo above.</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map(scan => {
                  const c = riskColor(scan.risk_score);
                  return (
                    <div key={scan.scan_id} className={`w-full p-4 ${c.bg} border-2 ${c.border} rounded-xl`}>
                      <div className="flex items-start gap-3 mb-2">
                        <MessageSquare className={`w-5 h-5 ${c.text} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{scan.content_preview}</div>
                          <div className="text-xs text-gray-500">{relativeTime(scan.scanned_at)}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${c.text}`}>{scan.classification}</span>
                        <span className={`text-lg font-black ${c.text}`}>{scan.risk_score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-gray-900">Scanner Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Paste the full URL — the scanner follows all redirects',
                'Upload a screenshot to scan visible text with AI vision',
                'For QR codes, photograph the code instead of scanning it',
                'Report high-risk content to ScamShield at 1799',
              ].map(tip => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
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
