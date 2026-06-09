import { useState, useEffect } from 'react';
import { Flame, ArrowRight, Shield, Zap, CheckCircle, Target, ScanLine, Heart, MapPin, Users, Clock, Lock } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface BadgeFromApi {
  badge_slug: string;
  badge_name: string;
  description: string;
  xp_reward: number;
  earned: boolean;
}

interface ScanHistoryItem {
  scan_id: string;
  type: 'text' | 'url' | 'qr' | 'upload';
  content_preview: string;
  risk_score: number;
  classification: string;
  scanned_at: string;
}

// Emoji fallback for dashboard mini-grid
const BADGE_EMOJI: Record<string, string> = {
  'spin-spotter':       '🎯',
  'ripple-breaker':     '🔄',
  'truth-guardian':     '🛡️',
  'squad-strategist':   '💡',
  'deepfake-detective': '👁️',
  'scam-slayer':        '⚔️',
  'qr-guardian':        '📱',
  'kindness-champion':  '💖',
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function scanVisual(scan: ScanHistoryItem) {
  if (scan.risk_score > 70) {
    return {
      result: 'Threat',
      bg: 'bg-red-100',
      text: 'text-red-600',
      icon: Shield,
    };
  }
  if (scan.risk_score > 40) {
    return {
      result: 'Warning',
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      icon: Shield,
    };
  }
  return {
    result: 'Safe',
    bg: 'bg-green-100',
    text: 'text-green-600',
    icon: CheckCircle,
  };
}

export function DashboardHome() {
  const { profile, session, missionStatus } = useAuth();
  const [apiBadges, setApiBadges] = useState<BadgeFromApi[]>([]);
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [recentScansLoading, setRecentScansLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    fetch(`${BACKEND_URL}/api/badges`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Badges request failed: ${r.status}`);
        return r.json();
      })
      .then(({ data }) => { if (data) setApiBadges(data as BadgeFromApi[]); })
      .catch(console.error);
  }, [session]);

  useEffect(() => {
    if (!session) {
      setRecentScans([]);
      setRecentScansLoading(false);
      return;
    }

    setRecentScansLoading(true);
    fetch(`${BACKEND_URL}/api/scanner/history`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Scanner history request failed: ${r.status}`);
        return r.json();
      })
      .then(({ data }) => {
        setRecentScans((data as ScanHistoryItem[] | undefined) ?? []);
      })
      .catch((error) => {
        console.error(error);
        setRecentScans([]);
      })
      .finally(() => setRecentScansLoading(false));
  }, [session]);

  // Show earned first, then locked; cap to 6 for the mini grid
  const sortedBadges = [...apiBadges].sort((a, b) => Number(b.earned) - Number(a.earned)).slice(0, 6);
  const earnedCount = apiBadges.filter(b => b.earned).length;

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  // current_level_xp and next_level_xp are absolute XP thresholds (floor of each level)
  const levelRange = profile ? profile.next_level_xp - profile.current_level_xp : 1;
  const progressPct = profile
    ? Math.min(100, Math.round(((profile.xp - profile.current_level_xp) / levelRange) * 100))
    : 0;
  const xpToNext = profile ? profile.next_level_xp - profile.xp : 0;

  const modules = missionStatus?.modules ?? [];
  const completedModules = modules.filter((m) => m.status === 'completed').length;
  const overallMissionProgress = missionStatus?.overall_progress_pct ?? 0;

  const nextMissionPath =
    modules.find((m) => m.status !== 'completed')?.module_slug === 'chain-reaction'
      ? '/mission/digital-shield/chain-reaction'
      : modules.find((m) => m.status !== 'completed')?.module_slug === 'shield-squad'
      ? '/mission/digital-shield/shield-squad'
      : '/mission/digital-shield/spot-the-spin';

  const missionButtonLabel =
    missionStatus?.completed
      ? 'Review Mission'
      : overallMissionProgress > 0
      ? 'Continue Mission'
      : 'Start Mission';

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-gray-600">Ready to protect Singapore's digital space?</p>
            </div>

            {/* XP Progress */}
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {profile?.level ?? '—'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Level {profile?.level ?? '—'}</div>
                    <div className="text-xs text-gray-500">{profile?.level_title ?? '...'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {(profile?.xp ?? 0).toLocaleString()} / {(profile?.next_level_xp ?? 0).toLocaleString()} XP
                  </div>
                  <div className="text-xs text-gray-500">
                    {xpToNext.toLocaleString()} XP to Level {(profile?.level ?? 0) + 1}
                  </div>
                </div>
              </div>
              <div className="w-full bg-red-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 ml-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profile?.streak_days || 1}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm">
                <Target className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {profile ? `${Math.round(profile.accuracy_rate)}%` : '—'}
              </div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{completedModules}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Start Your Mission</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mission 1: Digital Shield */}
          <Link to={nextMissionPath} className="bg-white rounded-2xl p-6 border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all cursor-pointer group block">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                ACTIVE
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Mission 1: Digital Shield</h3>
            <p className="text-sm text-gray-600 mb-1 font-medium">Spot the Spin</p>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Analyze viral posts, trace misinformation spread, and work with your squad to stop harmful content.
            </p>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-1 text-red-600">
                <Zap className="w-4 h-4" />
                <span className="font-bold">+500 XP</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>15 min</span>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-gray-900">{overallMissionProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${overallMissionProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {completedModules} of 3 modules completed
              </div>
            </div>
            <div className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-center">
              {missionButtonLabel}
            </div>
          </Link>

          {/* Shield Scanner */}
          <Link to="/scanner" className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group block">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ScanLine className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Shield Scanner</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              AI-powered tool to instantly verify messages, images, QR codes, and URLs for potential threats.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Real-time threat detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>98% accuracy rate</span>
              </div>
            </div>
            <div className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-center">
              Scan Now
            </div>
          </Link>

          {/* Cyberbullying Support */}
          <Link to="/support/cyberbullying" className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group block">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cyberbullying Support</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Safe space to report incidents, get support, and learn strategies to stand up against online harassment.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>24/7 support available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Confidential reporting</span>
              </div>
            </div>
            <div className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-center">
              Get Support
            </div>
          </Link>

          {/* Guardian Heatmap */}
          <Link to="/heatmap" className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group block">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Guardian Heatmap</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Real-time map showing scam hotspots and community alerts across Singapore.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Live threat updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Community alerts</span>
              </div>
            </div>
            <div className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-center">
              View Map
            </div>
          </Link>

          {/* Community Reports */}
          <Link to="/community/submit" className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group block">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Community Reports</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Submit suspicious content you've encountered and help protect the Singapore community.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Report threats safely</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Earn +50 XP per submission</span>
              </div>
            </div>
            <div className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-center">
              Submit Content
            </div>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Scans */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Scans</h3>
            <Link to="/scanner" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentScansLoading ? (
            <div className="py-8 text-sm text-gray-500 text-center">Loading scans...</div>
          ) : recentScans.length === 0 ? (
            <div className="py-8 text-sm text-gray-500 text-center">No scans yet.</div>
          ) : (
            <div className="space-y-3">
              {recentScans.slice(0, 5).map((scan) => {
                const visual = scanVisual(scan);
                const Icon = visual.icon;

                return (
                  <div key={scan.scan_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${visual.bg}`}>
                        <Icon className={`w-5 h-5 ${visual.text}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{scan.content_preview}</div>
                        <div className="text-xs text-gray-500">
                          {scan.type.toUpperCase()} · {relativeTime(scan.scanned_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-bold ${visual.text}`}>{visual.result}</div>
                      <div className="text-xs text-gray-500">{scan.risk_score}% risk</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badge Showcase */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Badges</h3>
            <span className="text-sm text-gray-500">
              {apiBadges.length > 0 ? `${earnedCount}/${apiBadges.length}` : '…'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {sortedBadges.map((badge) => (
              <div
                key={badge.badge_slug}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 relative ${
                  badge.earned
                    ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
                    : 'bg-gray-50 border border-gray-200 opacity-50'
                }`}
              >
                {!badge.earned && (
                  <Lock className="absolute top-1.5 right-1.5 w-3 h-3 text-gray-400" />
                )}
                <div className="text-3xl mb-1">
                  {BADGE_EMOJI[badge.badge_slug] ?? '🏅'}
                </div>
                <div className="text-xs text-center font-medium text-gray-700 leading-tight">
                  {badge.badge_name}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/profile"
            className="mt-4 w-full py-2 text-sm text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors block text-center"
          >
            View All Badges
          </Link>
        </div>
      </div>
    </div>
  );
}
