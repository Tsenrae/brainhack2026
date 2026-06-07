import {
  Shield, AlertTriangle, CheckCircle, XCircle, Eye, Brain, TrendingUp, Flag,
  Link as LinkIcon, UserX, MessageSquareWarning, GraduationCap, ArrowLeft,
  Share2, Zap, Target, Award,
  type LucideIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';

type ScanType = 'text' | 'url' | 'qr';

interface SuspiciousElement {
  element: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

interface ScanRedFlag {
  title: string;
  description: string;
  examples: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface RecommendedAction {
  action: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RECOMMENDED';
}

interface ScanResult {
  scan_id: string;
  type: ScanType;
  content_preview: string;
  risk_score: number;
  threat_level: string;
  classification: string;
  confidence_score: number;
  suspicious_elements: SuspiciousElement[];
  red_flags: ScanRedFlag[];
  recommended_actions: RecommendedAction[];
  analysis_breakdown: { pattern_matches: number; manipulation_tactics: number; match_rate_pct: number };
  xp_awarded: number;
  newly_earned_badges?: string[];
  scanned_at: string;
}

const THREAT_LEVEL_LABELS: Record<string, string> = {
  safe: 'Safe', low: 'Low Risk', suspicious: 'Suspicious', high: 'High Risk', critical: 'Critical',
};

const FLAG_ICON_MAP: Record<string, { icon: LucideIcon; bg: string }> = {
  'Urgency Pressure':               { icon: AlertTriangle,       bg: 'bg-gradient-to-br from-red-500 to-red-600' },
  'Suspicious Link':                { icon: LinkIcon,             bg: 'bg-gradient-to-br from-red-500 to-red-600' },
  'Requests Sensitive Information': { icon: Shield,               bg: 'bg-gradient-to-br from-red-500 to-rose-600' },
  'Too Good to Be True':            { icon: MessageSquareWarning, bg: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  'Authority Impersonation':        { icon: UserX,                bg: 'bg-gradient-to-br from-red-600 to-pink-600' },
};
const DEFAULT_FLAG = { icon: AlertTriangle, bg: 'bg-gradient-to-br from-red-500 to-red-600' };

const ACTION_ICON_MAP: Record<string, LucideIcon> = {
  'Do Not Click Any Links':           XCircle,
  'Do Not Share Personal Information': Shield,
  'Verify the Source':                Eye,
  'Report to ScamShield':             Flag,
  'Block the Sender':                 UserX,
  'Ask a Trusted Adult or Teacher':   GraduationCap,
};
const DEFAULT_ACTION_ICON = CheckCircle;

const SEVERITY_BORDER: Record<string, string> = {
  CRITICAL: 'border-red-500 bg-red-50',
  HIGH:     'border-orange-500 bg-orange-50',
  MEDIUM:   'border-yellow-500 bg-yellow-50',
  LOW:      'border-gray-300 bg-gray-50',
};

const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL:    'bg-red-600 text-white',
  HIGH:        'bg-orange-500 text-white',
  MEDIUM:      'bg-yellow-500 text-white',
  RECOMMENDED: 'bg-blue-500 text-white',
};

const PRIORITY_ICON_BG: Record<string, string> = {
  CRITICAL: 'bg-red-100', HIGH: 'bg-orange-100', MEDIUM: 'bg-yellow-100', RECOMMENDED: 'bg-blue-100',
};
const PRIORITY_ICON_COLOR: Record<string, string> = {
  CRITICAL: 'text-red-600', HIGH: 'text-orange-600', MEDIUM: 'text-yellow-600', RECOMMENDED: 'text-blue-600',
};

const BADGE_NAMES: Record<string, string> = {
  'scam-slayer':    'Scam Slayer',
  'qr-guardian':   'QR Guardian',
  'spin-spotter':  'Spin Spotter',
};

const RISK_GRADIENT: Record<string, string> = {
  safe:       'bg-green-500',
  low:        'bg-yellow-400',
  suspicious: 'bg-orange-500',
  high:       'bg-red-500',
  critical:   'bg-red-700',
};

function riskStrokeColor(level: string): string {
  return level === 'safe' ? '#22c55e' : level === 'low' ? '#facc15' : level === 'suspicious' ? '#f97316' : '#dc2626';
}

export function ScannerResults() {
  const location = useLocation();
  const result = location.state as ScanResult | null;

  if (!result) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 h-64 text-center">
        <Shield className="w-12 h-12 text-gray-300" />
        <p className="text-gray-600">No scan result found. Please submit content to scan first.</p>
        <Link to="/scanner" className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
          Go to Scanner
        </Link>
      </div>
    );
  }

  const {
    type, content_preview, risk_score, threat_level, classification,
    confidence_score, suspicious_elements, red_flags, recommended_actions,
    analysis_breakdown, xp_awarded, newly_earned_badges = [], scanned_at,
  } = result;

  const isThreating = risk_score > 50;
  const levelLabel = THREAT_LEVEL_LABELS[threat_level] ?? threat_level;
  const scannedDate = new Date(scanned_at).toLocaleString('en-SG', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/scanner" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">New Scan</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Scanned {scannedDate}</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium rounded-xl transition-all">
            <Share2 className="w-4 h-4" />
            <span>Share Results</span>
          </button>
        </div>
      </div>

      {/* Badge unlocked notification */}
      {newly_earned_badges.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">🏅</div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg">Badge Unlocked!</p>
            <p className="text-white/90 text-sm">
              You earned: {newly_earned_badges.map(s => BADGE_NAMES[s] ?? s).join(', ')}
            </p>
          </div>
          <Award className="w-8 h-8 text-white/60 flex-shrink-0" />
        </div>
      )}

      {/* Risk Score — Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Circular Gauge */}
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="128" cy="128" r="110" stroke="#fee2e2" strokeWidth="20" fill="none" />
                  <circle
                    cx="128" cy="128" r="110"
                    stroke={riskStrokeColor(threat_level)}
                    strokeWidth="20" fill="none"
                    strokeDasharray={`${(risk_score / 100) * 691} 691`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-7xl font-black mb-2 ${isThreating ? 'text-red-600' : 'text-green-600'}`}>{risk_score}</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Risk Score</div>
                  <div className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-600">Out of 100</span>
                  </div>
                </div>
              </div>
              {/* Risk Scale */}
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex justify-between text-xs font-medium text-gray-600 px-1">
                  <span>Safe</span><span>Low</span><span>Medium</span><span>High</span><span>Critical</span>
                </div>
                <div className="relative h-5 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 rounded-full shadow-inner">
                  <div
                    className="absolute top-1/2 w-8 h-8 bg-white border-4 border-red-600 rounded-full shadow-xl flex items-center justify-center"
                    style={{ left: `${risk_score}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isThreating ? 'bg-red-600' : 'bg-green-600'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Threat Info */}
            <div className="space-y-6">
              <div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 border-2 rounded-xl mb-4 ${isThreating ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  {isThreating
                    ? <AlertTriangle className="w-5 h-5 text-red-600" />
                    : <CheckCircle className="w-5 h-5 text-green-600" />}
                  <span className={`font-bold ${isThreating ? 'text-red-700' : 'text-green-700'}`}>
                    {isThreating ? 'Threat Detected' : 'No Threats Found'}
                  </span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-3">{levelLabel}</h1>
                <p className="text-lg text-gray-700">
                  {isThreating
                    ? `This ${type} shows strong indicators of ${classification.toLowerCase()}.`
                    : `This ${type} appears safe based on our analysis.`}
                </p>
              </div>

              {/* Confidence Score */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI Confidence</h3>
                    <p className="text-sm text-gray-600">Model certainty level</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-purple-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 rounded-full transition-all duration-1000" style={{ width: `${confidence_score}%` }} />
                  </div>
                  <div className="text-3xl font-black text-purple-600">{confidence_score}%</div>
                </div>
                <p className="text-sm text-purple-800 mt-3">
                  Our AI is {confidence_score}% confident in this classification
                </p>
              </div>

              {/* XP Earned */}
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                <Zap className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">XP Earned for Scanning</div>
                  <div className="text-xl font-black text-green-600">+{xp_awarded} XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Suspicious Elements */}
          {suspicious_elements.length > 0 && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Suspicious Elements Detected</h2>
                  <p className="text-sm text-gray-600">Our AI identified {suspicious_elements.length} warning sign{suspicious_elements.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="space-y-3">
                {suspicious_elements.map((item, i) => (
                  <div key={i} className={`p-5 rounded-xl border-2 ${SEVERITY_BORDER[item.severity] ?? 'border-gray-300 bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          item.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                          item.severity === 'HIGH'     ? 'bg-orange-500 text-white' :
                          item.severity === 'MEDIUM'   ? 'bg-yellow-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>{item.severity}</div>
                        <h3 className="font-bold text-gray-900">{item.element}</h3>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-200">{item.location}</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{item.description}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags */}
          {red_flags.length > 0 && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Understanding the Red Flags</h2>
                  <p className="text-sm text-gray-600">Learn why these patterns indicate a threat</p>
                </div>
              </div>
              <div className="space-y-4">
                {red_flags.map((flag, i) => {
                  const visual = FLAG_ICON_MAP[flag.title] ?? DEFAULT_FLAG;
                  const FlagIcon = visual.icon;
                  return (
                    <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-red-300 transition-all">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 ${visual.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <FlagIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{flag.title}</h3>
                            <div className={`px-2 py-0.5 rounded-lg text-xs font-bold ${flag.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              {flag.severity}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{flag.description}</p>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs font-bold text-gray-700 mb-2">Examples found:</p>
                            <ul className="space-y-1">
                              {flag.examples.map((ex, j) => (
                                <li key={j} className="text-xs text-gray-600 pl-4 border-l-2 border-gray-300">{ex}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">What You Should Do</h2>
                <p className="text-sm text-gray-600">Follow these steps to stay safe</p>
              </div>
            </div>
            <div className="space-y-3">
              {recommended_actions.map((action, i) => {
                const ActionIcon = ACTION_ICON_MAP[action.action] ?? DEFAULT_ACTION_ICON;
                return (
                  <div key={i} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-300 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${PRIORITY_ICON_BG[action.priority] ?? 'bg-gray-100'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <ActionIcon className={`w-5 h-5 ${PRIORITY_ICON_COLOR[action.priority] ?? 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{action.action}</h3>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${PRIORITY_BADGE[action.priority] ?? 'bg-gray-500 text-white'}`}>
                            {action.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{action.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {isThreating && (
              <div className="grid md:grid-cols-2 gap-3 mt-6 pt-6 border-t-2 border-blue-200">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                  <Flag className="w-5 h-5" />
                  <span>Report to ScamShield</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold rounded-xl transition-all">
                  <Share2 className="w-5 h-5" />
                  <span>Warn Friends & Family</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scanned Content Preview */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Scanned Content</h3>
            <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 mb-4 max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content_preview}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Scanned {scannedDate}</span>
            </div>
          </div>

          {/* AI Analysis Breakdown */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">AI Analysis</h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: Eye,       color: 'purple', label: 'Pattern Matches',       value: analysis_breakdown.pattern_matches,       sub: 'Suspicious patterns', pct: Math.min(100, analysis_breakdown.pattern_matches * 12) },
                { icon: Target,    color: 'pink',   label: 'Manipulation Tactics',  value: analysis_breakdown.manipulation_tactics,   sub: 'Tactics identified',  pct: Math.min(100, analysis_breakdown.manipulation_tactics * 12) },
                { icon: TrendingUp,color: 'blue',   label: 'Match Rate',            value: `${analysis_breakdown.match_rate_pct}%`, sub: 'Similar to known threats', pct: analysis_breakdown.match_rate_pct },
              ].map(({ icon: Icon, color, label, value, sub, pct }) => (
                <div key={label} className={`bg-white/60 backdrop-blur rounded-xl p-4 border border-${color}-200`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <div className={`text-2xl font-black text-${color}-600 mb-1`}>{value}</div>
                  <div className="text-xs text-gray-600 mb-2">{sub}</div>
                  <div className={`w-full bg-${color}-100 rounded-full h-2`}>
                    <div className={`bg-${color}-600 h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Training Mission */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">Learn More</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Want to get better at spotting threats like this? Try our training mission:
            </p>
            <Link
              to="/mission/digital-shield"
              className="block bg-white rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Digital Shield</h4>
                  <p className="text-xs text-gray-600">Mission 1</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Learn to identify phishing, scams, and misinformation through interactive challenges
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Beginner · 15 min</span>
                <span className="font-bold text-orange-600">+500 XP</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          to="/scanner"
          className="py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:scale-105 transition-all text-center"
        >
          Scan Another Item
        </Link>
        <Link
          to="/community/submit"
          className="py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:scale-105 transition-all text-center"
        >
          Report to Community
        </Link>
        <Link
          to="/dashboard"
          className="py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-all text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
