import { useState, useEffect } from 'react';
import {
  Shield, Zap, Target, Flame, Trophy, Star, Users, Calendar,
  ChevronRight, Lock, CheckCircle, TrendingUp, Award, Clock,
  Eye, QrCode, Heart, Search, Repeat, ShieldCheck, Sword, Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Frontend icon mapping — slug → visual metadata
const BADGE_VISUALS: Record<string, {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}> = {
  'spin-spotter':      { icon: Search,     color: 'from-amber-500 to-orange-600',   bgColor: 'bg-amber-50',   borderColor: 'border-amber-200',   textColor: 'text-amber-700' },
  'ripple-breaker':    { icon: Repeat,     color: 'from-teal-500 to-emerald-600',   bgColor: 'bg-teal-50',    borderColor: 'border-teal-200',    textColor: 'text-teal-700' },
  'truth-guardian':    { icon: ShieldCheck,color: 'from-green-500 to-emerald-600',  bgColor: 'bg-green-50',   borderColor: 'border-green-200',   textColor: 'text-green-700' },
  'squad-strategist':  { icon: Lightbulb,  color: 'from-indigo-500 to-blue-600',    bgColor: 'bg-indigo-50',  borderColor: 'border-indigo-200',  textColor: 'text-indigo-700' },
  'deepfake-detective':{ icon: Eye,        color: 'from-purple-500 to-violet-600',  bgColor: 'bg-purple-50',  borderColor: 'border-purple-200',  textColor: 'text-purple-700' },
  'scam-slayer':       { icon: Sword,      color: 'from-red-500 to-rose-600',       bgColor: 'bg-red-50',     borderColor: 'border-red-200',     textColor: 'text-red-700' },
  'qr-guardian':       { icon: QrCode,     color: 'from-blue-500 to-cyan-600',      bgColor: 'bg-blue-50',    borderColor: 'border-blue-200',    textColor: 'text-blue-700' },
  'kindness-champion': { icon: Heart,      color: 'from-pink-500 to-rose-500',      bgColor: 'bg-pink-50',    borderColor: 'border-pink-200',    textColor: 'text-pink-700' },
};

const DEFAULT_VISUAL = { icon: Award, color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-500' };

interface BadgeFromApi {
  badge_slug: string;
  badge_name: string;
  description: string;
  requirement: string;
  xp_reward: number;
  category: string;
  earned: boolean;
  earned_at: string | null;
}

const missionHistory = [
  { id: 1, name: 'Digital Shield', type: 'Campaign', result: 'Completed', xp: 450, accuracy: 94, date: '14 May 2026', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 2, name: 'Spot the Spin', type: 'Quiz', result: 'Perfect Score', xp: 220, accuracy: 100, date: '12 May 2026', icon: Search, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 3, name: 'QR Code Sweep', type: 'Scanner', result: 'Completed', xp: 180, accuracy: 90, date: '10 May 2026', icon: QrCode, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 4, name: 'Deepfake Drills', type: 'Training', result: 'Completed', xp: 300, accuracy: 88, date: '7 May 2026', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 5, name: 'Anti-Scam Blitz', type: 'Campaign', result: 'Completed', xp: 250, accuracy: 92, date: '3 May 2026', icon: Sword, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const leaderboard = [
  { rank: 1, name: 'SentinelAlex', xp: 4280, avatar: 'SA' },
  { rank: 2, name: 'GuardianMei',  xp: 3750, avatar: 'GM' },
  { rank: 3, name: 'ShieldRaj',    xp: 3120, avatar: 'SR' },
  { rank: 7, name: 'You',          xp: 0,    avatar: '',   isUser: true },
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

export function UserProfile() {
  const { session, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'badges' | 'history' | 'squad'>('badges');
  const [badges, setBadges] = useState<BadgeFromApi[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

  useEffect(() => {
    if (!session) { setBadgesLoading(false); return; }
    fetch(`${BACKEND_URL}/api/badges`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(({ data }) => { if (data) setBadges(data); })
      .catch(console.error)
      .finally(() => setBadgesLoading(false));
  }, [session]);

  const earnedCount = badges.filter(b => b.earned).length;

  // Compute avatar initials and gradient from real profile
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';
  const AVATAR_GRADIENTS: Record<string, string> = {
    red: 'from-red-500 to-orange-500', purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500', green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500',
  };
  const avatarGradient = AVATAR_GRADIENTS[profile?.avatar_color ?? 'red'];

  const levelRange = profile ? profile.next_level_xp - profile.current_level_xp : 1;
  const levelProgress = profile
    ? ((profile.xp - profile.current_level_xp) / levelRange) * 100
    : 0;

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })
    : '—';

  // Leaderboard row with real data
  const lbWithUser = leaderboard.map(e =>
    e.isUser
      ? { ...e, xp: profile?.xp ?? 0, avatar: initials, name: profile?.full_name ?? 'You' }
      : e,
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-28 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <Shield key={i} className="absolute text-white" style={{ width: `${30 + i * 12}px`, height: `${30 + i * 12}px`, top: `${(i % 3) * 40 - 10}%`, left: `${i * 18}%`, opacity: 0.3 + i * 0.05, transform: `rotate(${i * 20}deg)` }} />
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-white font-bold text-sm">
              Level {profile?.level ?? '—'} — {profile?.level_title ?? '...'}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4 relative z-10">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg flex-shrink-0`}>
              {initials}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-gray-900">{profile?.full_name ?? '...'}</h1>
              <p className="text-gray-500 text-sm">
                @{profile?.username ?? '...'} · Member since {memberSince}
              </p>
            </div>
            <div className="pb-1 flex gap-2">
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-red-700 font-bold text-sm">{profile?.streak_days || 1}-day streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-1.5">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-700 font-bold text-sm">
                  {profile?.leaderboard_rank ? `Rank #${profile.leaderboard_rank}` : 'Unranked'}
                </span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">
                  Level {profile?.level ?? '—'} Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-red-600">
                  {(profile?.xp ?? 0).toLocaleString()} XP
                </span>
                <span className="text-gray-400 text-sm">
                  / {(profile?.next_level_xp ?? 0).toLocaleString()} XP
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${Math.min(100, levelProgress)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {profile ? `${(profile.next_level_xp - profile.xp).toLocaleString()} XP until Level ${profile.level + 1}` : '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Accuracy Rate', value: profile ? `${Math.round(profile.accuracy_rate)}%` : '—', sub: 'Across all missions', icon: Target, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', trend: 'All time' },
          { label: 'Daily Streak', value: profile ? `${profile.streak_days} days` : '—', sub: 'Keep it going!', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', trend: 'Current streak' },
          { label: 'Missions Done', value: profile ? String(profile.missions_completed) : '—', sub: 'Total completed', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', trend: 'All time' },
          { label: 'Leaderboard', value: profile?.leaderboard_rank ? `#${profile.leaderboard_rank}` : '—', sub: 'National ranking', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', trend: 'Nationwide' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} p-4 shadow-sm`}>
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-gray-900 text-xl mb-0.5">{stat.value}</div>
            <div className="text-gray-500 text-xs mb-2">{stat.label}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stat.color}`}>
              <TrendingUp className="w-3 h-3" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'badges', label: 'Badge Collection', icon: Award },
            { key: 'history', label: 'Mission History', icon: Clock },
            { key: 'squad', label: 'Squad & Leaderboard', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
                activeTab === key
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {key === 'badges' && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${activeTab === key ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                  {badgesLoading ? '…' : `${earnedCount}/${badges.length}`}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* BADGES TAB */}
          {activeTab === 'badges' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm">
                  {badgesLoading ? 'Loading...' : `${earnedCount} earned · ${badges.length - earnedCount} locked`}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="w-3 h-3" />
                  Complete missions to unlock
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => {
                  const visual = BADGE_VISUALS[badge.badge_slug] ?? DEFAULT_VISUAL;
                  const BadgeIcon = visual.icon;
                  const earnedDate = badge.earned_at
                    ? new Date(badge.earned_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
                    : null;
                  return (
                    <div
                      key={badge.badge_slug}
                      className={`relative rounded-2xl border p-4 flex flex-col items-center text-center transition-all ${
                        badge.earned
                          ? `${visual.bgColor} ${visual.borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5`
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        {badge.earned
                          ? <CheckCircle className="w-4 h-4 text-green-500 fill-green-100" />
                          : <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${badge.earned ? `bg-gradient-to-br ${visual.color} shadow-lg` : 'bg-gray-200'}`}>
                        <BadgeIcon className={`w-7 h-7 ${badge.earned ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <p className={`font-semibold text-xs mb-1 leading-tight ${badge.earned ? visual.textColor : 'text-gray-400'}`}>
                        {badge.badge_name}
                      </p>
                      <p className="text-gray-400 text-xs leading-tight mb-2">{badge.description}</p>
                      <div className={`text-xs font-bold ${badge.earned ? visual.textColor : 'text-gray-400'}`}>
                        +{badge.xp_reward} XP
                      </div>
                      {earnedDate && (
                        <p className="text-gray-400 text-xs mt-1">{earnedDate}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <p className="text-gray-500 text-sm mb-4">
                {profile?.missions_completed ?? 0} missions completed
              </p>
              {missionHistory.map((mission) => (
                <div key={mission.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className={`w-11 h-11 ${mission.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <mission.icon className={`w-5 h-5 ${mission.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{mission.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{mission.type}</span>
                      {mission.result === 'Perfect Score' && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Perfect
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {mission.date}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Target className="w-3 h-3" /> {mission.accuracy}% accuracy
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-orange-50 rounded-lg px-2 py-1">
                      <Zap className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-orange-600 font-bold text-xs">+{mission.xp} XP</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SQUAD TAB */}
          {activeTab === 'squad' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 p-5 text-white relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-10"><Shield className="w-24 h-24" /></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Red Sentinels</p>
                    <p className="text-white/70 text-sm">6 members · Founded Mar 2026</p>
                  </div>
                  <div className="ml-auto bg-white/20 rounded-xl px-3 py-1 text-sm font-bold">Rank #4</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: 'Squad XP', value: '14,280' }, { label: 'Missions', value: '87' }, { label: 'Avg Accuracy', value: '91%' }].map(({ label, value }) => (
                    <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
                      <div className="font-bold text-lg">{value}</div>
                      <div className="text-white/70 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-700 font-semibold text-sm mb-3">National Leaderboard — Your Position</h3>
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  {lbWithUser.map((entry, idx) => (
                    <div key={entry.rank}>
                      {idx === 3 && (
                        <div className="py-2 px-4 flex items-center gap-2 text-gray-400 text-xs">
                          <div className="flex-1 border-t border-dashed border-gray-200" />
                          <span>···</span>
                          <div className="flex-1 border-t border-dashed border-gray-200" />
                        </div>
                      )}
                      <div className={`flex items-center gap-3 px-4 py-3 ${entry.isUser ? 'bg-red-50 border-l-4 border-red-500' : idx < 3 ? 'bg-yellow-50/50' : 'bg-white'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : entry.rank === 2 ? 'bg-gray-100 text-gray-600' : entry.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                        </div>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${entry.isUser ? `bg-gradient-to-br ${avatarGradient}` : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                          {entry.avatar}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${entry.isUser ? 'text-red-700' : 'text-gray-900'}`}>{entry.name}</span>
                          {entry.isUser && <span className="ml-2 text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">You</span>}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Zap className="w-4 h-4 text-orange-400" />
                          <span className={`font-bold ${entry.isUser ? 'text-red-600' : 'text-gray-700'}`}>{entry.xp.toLocaleString()} XP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
