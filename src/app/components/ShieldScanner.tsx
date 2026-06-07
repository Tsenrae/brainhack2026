import { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, QrCode, MessageSquare, Image as ImageIcon, Video, FileText, Shield, AlertTriangle, CheckCircle, Zap, Brain, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ScanHistoryItem {
  scan_id: string;
  type: 'text' | 'url' | 'qr';
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

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function riskColor(score: number): { text: string; bg: string; border: string } {
  if (score > 70) return { text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-300' };
  if (score > 40) return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' };
  return               { text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-300' };
}

export function ShieldScanner() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'text' | 'qr'>('text');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [stats, setStats] = useState<ScannerStats>({ total_scans: 0, threats_found: 0, safe_count: 0, xp_earned: 0 });
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    if (!session) return;
    const headers = { Authorization: `Bearer ${session.access_token}` };
    Promise.all([
      fetch(`${BACKEND_URL}/api/scanner/stats`, { headers }).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/scanner/history`, { headers }).then(r => r.json()),
    ]).then(([statsRes, histRes]) => {
      if (statsRes.data) setStats(statsRes.data);
      if (histRes.data) setHistory(histRes.data);
    }).catch(console.error);
  }, [session]);

  async function runScan(type: 'text' | 'url' | 'qr', content: string) {
    if (!content.trim()) { setScanError('Please enter content to scan.'); return; }
    if (!session) { setScanError('You must be logged in to scan.'); return; }
    setScanError(null);
    setIsScanning(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/scanner/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ type, content }),
      });
      const { data, error } = await res.json();
      if (error) throw new Error(error);
      navigate('/scanner/results', { state: data });
    } catch (err) {
      setIsScanning(false);
      setScanError('Scan failed. Please try again.');
      console.error(err);
    }
  }

  if (isScanning) {
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
            <h2 className="text-3xl font-black text-white">Analyzing Content...</h2>
            <p className="text-purple-300">AI Shield is scanning for threats</p>
          </div>
          <div className="max-w-md mx-auto space-y-3">
            {[
              { label: 'Extracting text and metadata', done: true },
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
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans',    value: stats.total_scans.toLocaleString(),   icon: Shield,        gradient: 'from-blue-500 to-cyan-500',   border: 'border-blue-200' },
          { label: 'Threats Found',  value: stats.threats_found.toLocaleString(), icon: AlertTriangle, gradient: 'from-red-500 to-pink-500',    border: 'border-red-200' },
          { label: 'Safe Content',   value: stats.safe_count.toLocaleString(),    icon: CheckCircle,   gradient: 'from-green-500 to-emerald-500', border: 'border-green-200' },
          { label: 'XP Earned',      value: stats.xp_earned.toLocaleString(),     icon: Zap,           gradient: 'from-purple-500 to-pink-500', border: 'border-purple-200' },
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
        {/* Main Scanner Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl p-2 border-2 border-gray-200 flex gap-2">
            {([
              { key: 'text',   label: 'Text',    Icon: MessageSquare },
              { key: 'url',    label: 'URL',     Icon: LinkIcon },
              { key: 'upload', label: 'Upload',  Icon: Upload },
              { key: 'qr',     label: 'QR Code', Icon: QrCode },
            ] as const).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Text Input */}
          {activeTab === 'text' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Paste suspicious text or message
                </label>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Paste a WhatsApp message, email, or any suspicious text here..."
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
                />
                {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
                <button
                  onClick={() => runScan('text', textInput)}
                  disabled={!textInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                >
                  Analyze Text
                </button>
              </div>
            </div>
          )}

          {/* URL Input */}
          {activeTab === 'url' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter URL to scan
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com or paste a suspicious link"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                />
                {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
                <button
                  onClick={() => runScan('url', urlInput)}
                  disabled={!urlInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                >
                  Scan URL
                </button>
              </div>
            </div>
          )}

          {/* Upload (static — file scanning not yet implemented) */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-300">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <Upload className="w-12 h-12 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">File Scanning Coming Soon</h3>
                  <p className="text-gray-500 text-sm">Image and screenshot analysis will be available in a future update. Try the Text or URL tabs for now.</p>
                </div>
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200 opacity-40">
                  <div className="flex items-center gap-2 text-sm text-gray-600"><ImageIcon className="w-5 h-5" /><span>Images</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Video className="w-5 h-5" /><span>Videos</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><FileText className="w-5 h-5" /><span>Screenshots</span></div>
                </div>
              </div>
            </div>
          )}

          {/* QR (paste URL from QR) */}
          {activeTab === 'qr' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Paste the URL extracted from a QR code
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="e.g. https://free-iphone.xyz/claim?ref=SG123"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
                {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
                <button
                  onClick={() => runScan('qr', urlInput)}
                  disabled={!urlInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                >
                  Check QR Link
                </button>
              </div>
            </div>
          )}

          {/* Quick Scan Demo Buttons */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Quick Scan Demos</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Try the scanner with pre-loaded sample scam content.</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => runScan('text', DEMO_CONTENT.phishing)}
                className="p-4 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all text-left"
              >
                <div className="font-bold text-gray-900 mb-1">Demo: Phishing Email</div>
                <div className="text-xs text-gray-600">Fake bank urgency + credential request</div>
              </button>
              <button
                onClick={() => runScan('text', DEMO_CONTENT.giveaway)}
                className="p-4 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all text-left"
              >
                <div className="font-bold text-gray-900 mb-1">Demo: Fake Giveaway</div>
                <div className="text-xs text-gray-600">Free prize lure + card details request</div>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Scans */}
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
                    <div
                      key={scan.scan_id}
                      className={`w-full p-4 ${c.bg} border-2 ${c.border} rounded-xl text-left`}
                    >
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

          {/* Scanner Tips */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-gray-900">Scanner Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Scan before clicking any suspicious links',
                'Paste the full message for better accuracy',
                'Check QR codes before scanning them in real life',
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
