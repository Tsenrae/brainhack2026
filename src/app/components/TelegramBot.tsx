import { useEffect, useState } from 'react';
import {
  MessageCircle,
  QrCode,
  CheckCircle,
  Shield,
  Zap,
  Clock,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Send,
  User,
  Bot,
  Link as LinkIcon,
  Copy,
} from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-qr-code';

interface TelegramBotInfo {
  username: string;
  url: string;
}

interface TelegramLinkStatus {
  linked: boolean;
  profile_id: string;
  telegram_user_id: string | null;
  telegram_username: string | null;
  telegram_link_code: string | null;
  telegram_linked_at: string | null;
}

interface TelegramLinkCodeResponse {
  link_code: string;
  expires_at: string;
}

interface TelegramRecentScan {
  scan_id: string;
  preview: string;
  risk_score: number;
  classification: string;
  threat_level: 'safe' | 'low' | 'suspicious' | 'high' | 'critical';
  timestamp: string;
  color: 'red' | 'yellow' | 'green';
}

interface TelegramBotCommand {
  command: string;
  description: string;
}

interface TelegramStats {
  messages_scanned: number;
  threats_blocked: number;
  xp_earned: number;
}

const SCAN_THEME: Record<TelegramRecentScan['color'], { panel: string; border: string; accent: string }> = {
  red: { panel: 'bg-red-50', border: 'border-red-200', accent: 'text-red-600' },
  yellow: { panel: 'bg-yellow-50', border: 'border-yellow-200', accent: 'text-yellow-600' },
  green: { panel: 'bg-green-50', border: 'border-green-200', accent: 'text-green-600' },
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

const SAMPLE_RECENT_SCANS: TelegramRecentScan[] = [
  {
    scan_id: 'sample-1',
    preview: 'Lottery winner scam',
    risk_score: 98,
    classification: 'Scam',
    threat_level: 'critical',
    timestamp: '2 hours ago',
    color: 'red',
  },
  {
    scan_id: 'sample-2',
    preview: 'gov.sg official notice',
    risk_score: 3,
    classification: 'Safe',
    threat_level: 'safe',
    timestamp: '1 day ago',
    color: 'green',
  },
  {
    scan_id: 'sample-3',
    preview: 'Job offer from unknown sender',
    risk_score: 72,
    classification: 'Suspicious',
    threat_level: 'high',
    timestamp: '3 days ago',
    color: 'yellow',
  },
];

const SAMPLE_COMMANDS: TelegramBotCommand[] = [
  { command: '/start', description: 'Activate the bot' },
  { command: '/link <code>', description: 'Link your profile' },
  { command: '/help', description: 'Get usage instructions' },
  { command: '/stats', description: 'View your scanning stats' },
  { command: '/missions', description: 'See recommended missions' },
];

const SAMPLE_STATS: TelegramStats = {
  messages_scanned: 23,
  threats_blocked: 8,
  xp_earned: 575,
};

const SAMPLE_BOT_INFO: TelegramBotInfo = {
  username: '@ShieldVerseSG_bot',
  url: 'https://t.me/ShieldVerseSG_bot',
};

const BOT_QR_SIZE = 176;

const exampleConversation = [
  {
    type: 'user',
    message: 'Started bot',
    timestamp: '10:23 AM',
    system: true,
  },
  {
    type: 'bot',
    message: '👋 Welcome to ShieldVerse SG!\n\nForward suspicious messages to me after linking your profile with /link <code>. I will analyze them instantly and save scans to your account.',
    timestamp: '10:23 AM',
  },
  {
    type: 'user',
    message: '🚨 URGENT: Your DBS account has been locked! Click here immediately to unlock: dbs-sg-secure.xyz/unlock',
    timestamp: '10:25 AM',
    forwarded: true,
  },
  {
    type: 'bot',
    message: '⚠️ HIGH RISK DETECTED (Score: 94/100)\n\n🚫 Classification: Phishing Scam\n\nRed Flags Found:\n• Urgency tactics\n• Suspicious URL\n• Sensitive information request\n\n✅ What to do:\n1. Do NOT click the link\n2. Block and report the sender\n3. Verify with official DBS channels\n\n📚 Related mission: Digital Shield\n\n+25 XP earned for scanning!',
    timestamp: '10:25 AM',
    analysis: true,
  },
  {
    type: 'user',
    message: 'Thanks! That was helpful 👍',
    timestamp: '10:26 AM',
  },
];

export function TelegramBot() {
  const { session, profile } = useAuth();
  const [botInfo, setBotInfo] = useState<TelegramBotInfo>(SAMPLE_BOT_INFO);
  const [commands, setCommands] = useState<TelegramBotCommand[]>(SAMPLE_COMMANDS);
  const [stats, setStats] = useState<TelegramStats>(SAMPLE_STATS);
  const [recentScans, setRecentScans] = useState<TelegramRecentScan[]>(SAMPLE_RECENT_SCANS);
  const [linkStatus, setLinkStatus] = useState<TelegramLinkStatus | null>(null);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [linkExpiresAt, setLinkExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apiFetch<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Request failed');
    }

    const { data } = await res.json();
    return data as T;
  }

  useEffect(() => {
    let cancelled = false;

    async function loadPageData() {
      try {
        setError(null);
        const publicInfo = await apiFetch<TelegramBotInfo>('/api/integrations/telegram/info');
        const publicCommands = await apiFetch<TelegramBotCommand[]>('/api/integrations/telegram/commands');

        if (cancelled) return;
        setBotInfo(publicInfo);
        setCommands(publicCommands);

        if (session?.access_token) {
          const [status, userStats, scans] = await Promise.all([
            apiFetch<TelegramLinkStatus>('/api/integrations/telegram/status', undefined, session.access_token),
            apiFetch<TelegramStats>('/api/integrations/telegram/stats', undefined, session.access_token),
            apiFetch<TelegramRecentScan[]>('/api/integrations/telegram/scans', undefined, session.access_token),
          ]);

          if (cancelled) return;
          setLinkStatus(status);
          setStats(userStats);
          setRecentScans(scans.length > 0 ? scans : []);
          setLinkCode(status.linked ? null : status.telegram_link_code);
        } else {
          setLinkStatus(null);
          setStats(SAMPLE_STATS);
          setRecentScans(SAMPLE_RECENT_SCANS);
          setLinkCode(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load Telegram page');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPageData();
    return () => {
      cancelled = true;
    };
  }, [session?.access_token]);

  async function handleGenerateLinkCode() {
    if (!session?.access_token) return;

    setGeneratingCode(true);
    setError(null);
    try {
      const data = await apiFetch<TelegramLinkCodeResponse>(
        '/api/integrations/telegram/link-code',
        { method: 'POST' },
        session.access_token,
      );
      setLinkCode(data.link_code);
      setLinkExpiresAt(data.expires_at);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate link code');
    } finally {
      setGeneratingCode(false);
    }
  }

  const linkedLabel = linkStatus?.linked
    ? `Linked as ${linkStatus.telegram_username ? `@${linkStatus.telegram_username}` : 'your Telegram account'}`
    : session
      ? 'Not linked yet'
      : 'Sign in to generate a link code';

  const linkCodeHint = session
    ? 'Generate a temporary code on this page, then send /link <code> in Telegram to attach your Telegram account to this ShieldVerse profile.'
    : 'Sign in first to generate your personal link code.';

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Telegram Bot Integration</h1>
          <p className="text-gray-600">Forward messages to Telegram for instant threat analysis and saved XP.</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Telegram Integration</span>
            </div>
            <h2 className="text-4xl font-black">Meet Your Personal Scam Detector</h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Forward suspicious messages, links, or images to {botInfo.username} and get instant AI-powered analysis.
              When your profile is linked, scans and XP are saved automatically.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={botInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Open Telegram Bot</span>
              </a>
              <div className="flex items-center gap-2 text-blue-100">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Earn +25 XP per scan</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm text-gray-900">
              <div className="text-center mb-4">
                <h3 className="font-bold text-gray-900 text-xl mb-2">Scan to Connect</h3>
                <p className="text-sm text-gray-600">Scan the QR code to open the bot instantly</p>
              </div>
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-4 border-gray-300 mb-4 overflow-hidden">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <QRCode
                    value={botInfo.url}
                    size={BOT_QR_SIZE}
                    fgColor="#1f2937"
                    bgColor="#ffffff"
                    level="M"
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    aria-label={`QR code for ${botInfo.url}`}
                  />
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-mono text-sm text-blue-700">{botInfo.username}</span>
                </div>
                <p className="text-xs text-gray-500">{linkedLabel}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{linkCodeHint}</p>
                {linkCode && (
                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 text-left">
                    <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-2">Link code</div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-mono text-lg font-bold text-gray-900">{linkCode}</div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(linkCode)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-800"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Send <span className="font-mono">/link {linkCode}</span> in Telegram to connect your profile.</p>
                    {linkExpiresAt && <p className="text-[11px] text-gray-500 mt-1">Expires: {new Date(linkExpiresAt).toLocaleString()}</p>}
                  </div>
                )}
                {!linkCode && session && !linkStatus?.linked && (
                  <button
                    type="button"
                    onClick={handleGenerateLinkCode}
                    disabled={generatingCode}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-60"
                  >
                    {generatingCode ? 'Generating...' : 'Generate link code'}
                  </button>
                )}
                {!session && (
                  <Link
                    to="/signin"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Sign in to link Telegram
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-500">Loading Telegram integration...</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Quick Setup Guide</h2>
                  <p className="text-sm text-gray-600">Get started in 3 easy steps</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Scan QR Code or Search Bot',
                    description: `Open Telegram and search for ${botInfo.username}`,
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    step: 2,
                    title: 'Start the Bot',
                    description: session ? 'Tap Start, then link your account with the generated code' : 'Sign in here first so you can generate a link code',
                    color: 'from-purple-500 to-pink-500',
                  },
                  {
                    step: 3,
                    title: 'Forward Suspicious Messages',
                    description: 'Forward any suspicious message for instant AI analysis and saved XP',
                    color: 'from-red-500 to-orange-500',
                  },
                ].map(step => (
                  <div key={step.step} className="relative">
                    {step.step < 3 && <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent" />}
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg relative z-10`}>
                        <span className="text-white font-black text-xl">{step.step}</span>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Privacy & Security</h4>
                    <p className="text-sm text-gray-700">
                      Your scans are tied to your linked profile, so XP and recent history follow you across Telegram sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">How It Works</h2>
                  <p className="text-sm text-gray-600">Example conversation with the bot</p>
                </div>
              </div>

              <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-white">ShieldVerse SG Bot</div>
                      <div className="text-xs text-blue-100">{botInfo.username}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  {exampleConversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                        {msg.type === 'bot' && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">ShieldVerse Bot</span>
                          </div>
                        )}
                        {msg.type === 'user' && !msg.system && (
                          <div className="flex items-center gap-2 mb-2 justify-end">
                            <span className="text-xs font-medium text-gray-600">You</span>
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        <div
                          className={`rounded-2xl p-4 ${
                            msg.system
                              ? 'bg-gray-100 text-gray-600 text-center text-sm'
                              : msg.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : msg.analysis
                                  ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
                                  : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {msg.forwarded && (
                            <div className="flex items-center gap-1 text-xs mb-2 opacity-80">
                              <Send className="w-3 h-3" />
                              <span>Forwarded message</span>
                            </div>
                          )}
                          <div className={`text-sm whitespace-pre-wrap ${msg.analysis ? 'text-gray-900' : ''}`}>
                            {msg.message}
                          </div>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <strong>Pro Tip:</strong> Forward messages from any chat to get instant analysis. Once linked, your scans are saved to your profile.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-black text-gray-900 mb-6">What You Can Do</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Forward Messages</h3>
                      <p className="text-sm text-gray-700">Get instant analysis of suspicious texts, emails, or social media posts</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Link Your Profile</h3>
                      <p className="text-sm text-gray-700">Generate a code on the web page and send <span className="font-mono">/link CODE</span> in Telegram</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Get Recommendations</h3>
                      <p className="text-sm text-gray-700">Receive step-by-step guidance on what to do next</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Earn XP</h3>
                      <p className="text-sm text-gray-700">Get +25 XP for each scan and unlock related training missions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">Telegram Stats</h3>
              </div>

              <div className="space-y-4">
                <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                  <div className="text-4xl font-black text-green-600 mb-1">{stats.messages_scanned}</div>
                  <div className="text-sm text-gray-600">Messages Scanned</div>
                </div>
                <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                  <div className="text-4xl font-black text-red-600 mb-1">{stats.threats_blocked}</div>
                  <div className="text-sm text-gray-600">Threats Blocked</div>
                </div>
                <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                  <div className="text-4xl font-black text-blue-600 mb-1">+{stats.xp_earned} XP</div>
                  <div className="text-sm text-gray-600">Earned via Bot</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Scans</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                {recentScans.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                    No Telegram scans yet. Forward a suspicious message after linking your profile.
                  </div>
                ) : (
                  recentScans.map(scan => (
                    <div key={scan.scan_id} className={`p-4 ${SCAN_THEME[scan.color].panel} border-2 ${SCAN_THEME[scan.color].border} rounded-xl hover:shadow-md transition-all`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">{scan.preview}</div>
                          <div className="text-xs text-gray-500">{scan.timestamp}</div>
                        </div>
                        <div className={`text-2xl font-black ${SCAN_THEME[scan.color].accent}`}>{scan.risk_score}</div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                        scan.risk_score > 70 ? 'bg-red-100 text-red-700' : scan.risk_score > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${scan.risk_score > 70 ? 'bg-red-500' : scan.risk_score > 40 ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                        <span>{scan.classification}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/scanner"
                className="block w-full mt-4 py-2 text-center text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                View All Scans →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Bot Commands</h3>
              </div>

              <div className="space-y-2 text-sm">
                {commands.map(command => (
                  <div key={command.command} className="p-3 bg-white/60 rounded-lg">
                    <code className="font-mono text-purple-700">{command.command}</code>
                    <p className="text-gray-600 text-xs mt-1">{command.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-xl mb-3">Ready to Get Protected?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Start using the Telegram bot today and protect yourself from scams instantly.
              </p>
              <a
                href={botInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-center shadow-lg"
              >
                Open Bot in Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}