import { useState } from 'react';
import {
  Trophy, Zap, TrendingUp, TrendingDown, Minus, Shield,
  Users, GraduationCap, CalendarDays, Globe, Flame,
  Star, ChevronRight, Crown, Target, ArrowUp, Sparkles,
  Medal, BarChart3,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const individualData = [
  { rank: 1, name: 'SentinelAlex', avatar: 'SA', level: 12, xp: 8420, accuracy: 97, streak: 42, badge: 'Truth Guardian', change: 0 },
  { rank: 2, name: 'GuardianMei', avatar: 'GM', level: 11, xp: 7350, accuracy: 96, streak: 38, badge: 'Scam Slayer', change: 1 },
  { rank: 3, name: 'ShieldRaj', avatar: 'SR', level: 10, xp: 6810, accuracy: 94, streak: 29, badge: 'Deepfake Detective', change: -1 },
  { rank: 4, name: 'NovaPriya', avatar: 'NP', level: 10, xp: 5990, accuracy: 93, streak: 21, badge: 'QR Guardian', change: 2 },
  { rank: 5, name: 'CipherKai', avatar: 'CK', level: 9, xp: 5340, accuracy: 91, streak: 17, badge: 'Ripple Breaker', change: -1 },
  { rank: 6, name: 'TruthAna', avatar: 'TA', level: 9, xp: 4880, accuracy: 90, streak: 14, badge: 'Spin Spotter', change: 0 },
  { rank: 7, name: 'John Doe', avatar: 'JD', level: 8, xp: 2450, accuracy: 92, streak: 14, badge: 'Scam Slayer', change: 4, isUser: true },
  { rank: 8, name: 'VeilSam', avatar: 'VS', level: 8, xp: 2380, accuracy: 88, streak: 9, badge: 'QR Guardian', change: -2 },
  { rank: 9, name: 'DigitalDan', avatar: 'DD', level: 7, xp: 2120, accuracy: 87, streak: 6, badge: 'Kindness Champion', change: 1 },
  { rank: 10, name: 'SafetyLin', avatar: 'SL', level: 7, xp: 1970, accuracy: 85, streak: 5, badge: 'Spin Spotter', change: -1 },
];

const squadData = [
  { rank: 1, name: 'Iron Shields', members: 8, xp: 48200, accuracy: 95, wins: 14, emblem: '🛡️', change: 0 },
  { rank: 2, name: 'Cyber Sentinels', members: 7, xp: 41750, accuracy: 93, wins: 11, emblem: '⚡', change: 2 },
  { rank: 3, name: 'Truth Blazers', members: 6, xp: 38900, accuracy: 92, wins: 10, emblem: '🔥', change: -1 },
  { rank: 4, name: 'Red Sentinels', members: 6, xp: 14280, accuracy: 91, wins: 7, emblem: '🔴', change: 1, isUser: true },
  { rank: 5, name: 'Digital Hawks', members: 5, xp: 11430, accuracy: 89, wins: 5, emblem: '🦅', change: -2 },
  { rank: 6, name: 'SafeNet Crew', members: 5, xp: 9870, accuracy: 87, wins: 4, emblem: '🌐', change: 0 },
  { rank: 7, name: 'QR Busters', members: 4, xp: 8200, accuracy: 86, wins: 3, emblem: '📱', change: 3 },
  { rank: 8, name: 'Scam Hunters', members: 4, xp: 7640, accuracy: 84, wins: 2, emblem: '🎯', change: -1 },
];

const schoolData = [
  { rank: 1, name: 'Raffles Institution', abbreviation: 'RI', students: 2840, avgXp: 3420, avgAccuracy: 94, literacy: 96, change: 0 },
  { rank: 2, name: 'Hwa Chong Institution', abbreviation: 'HCI', students: 2610, avgXp: 3180, avgAccuracy: 93, literacy: 94, change: 1 },
  { rank: 3, name: 'NUS High School', abbreviation: 'NUSHS', students: 1450, avgXp: 3050, avgAccuracy: 93, literacy: 93, change: -1 },
  { rank: 4, name: 'Temasek Junior College', abbreviation: 'TJC', students: 2200, avgXp: 2780, avgAccuracy: 91, literacy: 91, change: 2 },
  { rank: 5, name: 'Anglo-Chinese School (Ind)', abbreviation: 'ACS(I)', students: 3100, avgXp: 2650, avgAccuracy: 90, literacy: 90, change: 0 },
  { rank: 6, name: 'Dunman High School', abbreviation: 'DHS', students: 1890, avgXp: 2540, avgAccuracy: 89, literacy: 88, change: 3 },
  { rank: 7, name: 'Victoria Junior College', abbreviation: 'VJC', students: 2050, avgXp: 2420, avgAccuracy: 88, literacy: 87, change: -2 },
  { rank: 8, name: 'Meridian Secondary', abbreviation: 'MSS', students: 1670, avgXp: 2110, avgAccuracy: 86, literacy: 85, change: 1 },
];

const weeklyChallenge = {
  name: 'Operation Deepfake Storm',
  ends: '2 days 14 hours',
  theme: 'Deepfake Detection Blitz',
  totalParticipants: 18420,
  description: 'Identify AI-generated media across 5 escalating rounds. The top 100 earn the Deepfake Storm badge.',
  rankings: [
    { rank: 1, name: 'SentinelAlex', avatar: 'SA', score: 9800, round: 5, accuracy: 99 },
    { rank: 2, name: 'NovaPriya', avatar: 'NP', score: 9450, round: 5, accuracy: 97 },
    { rank: 3, name: 'GuardianMei', avatar: 'GM', score: 9120, round: 5, accuracy: 96 },
    { rank: 41, name: 'John Doe', avatar: 'JD', score: 7340, round: 4, accuracy: 91, isUser: true },
  ],
  milestones: [
    { label: 'Top 100', reward: 'Deepfake Storm Badge', icon: '🏅', threshold: 100, achieved: false },
    { label: 'Top 500', reward: '+500 Bonus XP', icon: '⚡', threshold: 500, achieved: false },
    { label: 'Top 10%', reward: '+200 XP', icon: '🎯', threshold: 1842, achieved: true },
    { label: 'Participated', reward: '+50 XP', icon: '✅', threshold: 18420, achieved: true },
  ],
};

const nationalScore = {
  score: 78,
  label: 'Digitally Resilient',
  prev: 71,
  trend: '+7 pts from last quarter',
  breakdown: [
    { category: 'Scam Awareness', score: 84, color: 'bg-red-500', prev: 76 },
    { category: 'Deepfake Detection', score: 72, color: 'bg-purple-500', prev: 61 },
    { category: 'Misinformation Literacy', score: 79, color: 'bg-amber-500', prev: 73 },
    { category: 'Cyberbullying Response', score: 81, color: 'bg-pink-500', prev: 75 },
    { category: 'QR Code Safety', score: 76, color: 'bg-blue-500', prev: 70 },
  ],
  participatingSchools: 284,
  activeUsers: 82400,
  missionsCompleted: 1240000,
  globalRank: 3,
};

// ── Sub-components ────────────────────────────────────────────────────────────

type ChangeDir = { change: number };

function RankChange({ change }: ChangeDir) {
  if (change > 0)
    return (
      <span className="flex items-center gap-0.5 text-green-600 text-xs font-semibold">
        <TrendingUp className="w-3 h-3" />+{change}
      </span>
    );
  if (change < 0)
    return (
      <span className="flex items-center gap-0.5 text-red-500 text-xs font-semibold">
        <TrendingDown className="w-3 h-3" />{change}
      </span>
    );
  return <Minus className="w-3 h-3 text-gray-300" />;
}

function PodiumCard({ entry, place }: { entry: typeof individualData[0]; place: 1 | 2 | 3 }) {
  const styles = {
    1: { height: 'h-32', gradient: 'from-yellow-400 to-amber-500', ring: 'ring-yellow-300', label: '🥇', size: 'w-16 h-16', text: 'text-xl' },
    2: { height: 'h-24', gradient: 'from-slate-300 to-slate-400', ring: 'ring-slate-300', label: '🥈', size: 'w-14 h-14', text: 'text-lg' },
    3: { height: 'h-20', gradient: 'from-orange-300 to-amber-400', ring: 'ring-orange-200', label: '🥉', size: 'w-13 h-13', text: 'text-base' },
  }[place];

  return (
    <div className={`flex flex-col items-center gap-2 ${place === 1 ? '-mt-4' : ''}`}>
      <div className="relative">
        <div className={`${styles.size} rounded-2xl bg-gradient-to-br ${styles.gradient} flex items-center justify-center text-white font-bold ${styles.text} ring-4 ${styles.ring} shadow-lg`}>
          {entry.avatar}
        </div>
        <div className="absolute -bottom-1 -right-1 text-lg">{styles.label}</div>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-900 text-sm">{entry.name}</p>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <Zap className="w-3 h-3 text-orange-400" />
          {entry.xp.toLocaleString()} XP
        </div>
        <div className="text-xs text-gray-400">Lv {entry.level}</div>
      </div>
      <div className={`w-full ${styles.height} bg-gradient-to-t ${styles.gradient} rounded-t-xl opacity-30 mt-auto`} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type Tab = 'individual' | 'squad' | 'school' | 'weekly' | 'national';

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>('individual');

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'individual', label: 'Individual', icon: Trophy },
    { key: 'squad', label: 'Squads', icon: Users },
    { key: 'school', label: 'Schools', icon: GraduationCap },
    { key: 'weekly', label: 'Weekly Challenge', icon: CalendarDays },
    { key: 'national', label: 'SG Score', icon: Globe },
  ];

  // User rank data for "next tier" progress banner
  const userRank = 7;
  const nextTierRank = 5;
  const xpToNextTier = 4880 - 2450; // TruthAna's XP minus John's XP

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Season 3 · Resets 1 Jun 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <Flame className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-600">Season ends in</span>
          <span className="font-bold text-red-600 text-sm">13d 6h</span>
        </div>
      </div>

      {/* User's current rank + next-tier progress */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
          {[0,1,2].map(i => (
            <Shield key={i} className="absolute text-white" style={{ width: 60 + i*20, height: 60 + i*20, right: 10 + i*15, top: '50%', transform: `translateY(-50%) rotate(${i*15}deg)` }} />
          ))}
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center font-bold text-xl border border-white/30">
              JD
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Your Rank</p>
              <p className="text-3xl font-black">#7</p>
              <p className="text-white/80 text-sm">John Doe · Level 8 Guardian</p>
            </div>
          </div>

          <div className="flex-1 md:ml-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wide">Progress to Rank #{nextTierRank}</p>
                <p className="text-white font-semibold text-sm">Need <span className="font-black">{xpToNextTier.toLocaleString()} XP</span> more to overtake TruthAna</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">2,450 / 4,880 XP</p>
                <div className="flex items-center gap-1 text-green-300 text-xs font-bold mt-0.5">
                  <ArrowUp className="w-3 h-3" /> Up 4 places this week
                </div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full relative overflow-hidden transition-all"
                style={{ width: `${(2450 / 4880) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white animate-pulse rounded-full" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1.5">
              <span>Your XP: 2,450</span>
              <span>Target: 4,880 (Rank #5 threshold)</span>
            </div>
          </div>

          <div className="flex gap-2 md:flex-col">
            <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-center">
              <Flame className="w-4 h-4 text-orange-300 mx-auto mb-0.5" />
              <p className="font-bold text-sm">14</p>
              <p className="text-white/60 text-xs">Day Streak</p>
            </div>
            <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-center">
              <Target className="w-4 h-4 text-green-300 mx-auto mb-0.5" />
              <p className="font-bold text-sm">92%</p>
              <p className="text-white/60 text-xs">Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === key
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50/40'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── INDIVIDUAL ── */}
          {activeTab === 'individual' && (
            <div className="space-y-5">
              {/* Podium */}
              <div className="flex items-end justify-center gap-6 py-4 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 mb-2">
                <PodiumCard entry={individualData[1]} place={2} />
                <PodiumCard entry={individualData[0]} place={1} />
                <PodiumCard entry={individualData[2]} place={3} />
              </div>

              {/* Full list */}
              <div className="space-y-1.5">
                {individualData.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      entry.isUser
                        ? 'bg-red-50 border-2 border-red-300 shadow-sm'
                        : entry.rank <= 3
                        ? 'bg-yellow-50/60 border border-yellow-100'
                        : 'border border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                      entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      entry.isUser ? 'bg-red-100 text-red-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
                    </div>

                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${
                      entry.isUser ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {entry.avatar}
                    </div>

                    {/* Name + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${entry.isUser ? 'text-red-700' : 'text-gray-900'}`}>{entry.name}</span>
                        {entry.isUser && <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">You</span>}
                        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 hidden sm:inline">Lv {entry.level}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 flex items-center gap-0.5"><Target className="w-3 h-3" />{entry.accuracy}%</span>
                        <span className="text-xs text-gray-400 flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" />{entry.streak}d</span>
                        <span className="hidden sm:inline text-xs text-gray-400">{entry.badge}</span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 justify-end">
                          <Zap className="w-3.5 h-3.5 text-orange-400" />
                          <span className={`font-bold text-sm ${entry.isUser ? 'text-red-600' : 'text-gray-800'}`}>{entry.xp.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-gray-400">XP</span>
                      </div>
                      <RankChange change={entry.change} />
                    </div>
                  </div>
                ))}
              </div>

              {/* user gap notice */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span>You are <strong>2,430 XP</strong> away from Rank #5. Complete 2 more missions this week to climb!</span>
                <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
              </div>
            </div>
          )}

          {/* ── SQUADS ── */}
          {activeTab === 'squad' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">{squadData.length} active squads this season</p>
              <div className="space-y-2">
                {squadData.map((squad) => (
                  <div
                    key={squad.rank}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      squad.isUser
                        ? 'bg-red-50 border-2 border-red-300 shadow-sm'
                        : squad.rank <= 3
                        ? 'bg-yellow-50/60 border border-yellow-100'
                        : 'border border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      squad.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      squad.rank === 2 ? 'bg-gray-100 text-gray-600' :
                      squad.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      squad.isUser ? 'bg-red-100 text-red-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {squad.rank <= 3 ? ['🥇','🥈','🥉'][squad.rank - 1] : `#${squad.rank}`}
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                      {squad.emblem}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${squad.isUser ? 'text-red-700' : 'text-gray-900'}`}>{squad.name}</span>
                        {squad.isUser && <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">Your Squad</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400 flex items-center gap-0.5"><Users className="w-3 h-3" />{squad.members} members</span>
                        <span className="text-xs text-gray-400 flex items-center gap-0.5"><Target className="w-3 h-3" />{squad.accuracy}% avg accuracy</span>
                        <span className="text-xs text-gray-400 flex items-center gap-0.5"><Trophy className="w-3 h-3 text-yellow-500" />{squad.wins} wins</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 justify-end">
                          <Zap className="w-3.5 h-3.5 text-orange-400" />
                          <span className={`font-bold text-sm ${squad.isUser ? 'text-red-600' : 'text-gray-800'}`}>{squad.xp.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-gray-400">Squad XP</span>
                      </div>
                      <RankChange change={squad.change} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-700">
                <Crown className="w-4 h-4 flex-shrink-0 text-orange-500" />
                <span>Red Sentinels needs <strong>24,620 more Squad XP</strong> to reach Rank #3. Recruit 2 active members to accelerate!</span>
              </div>
            </div>
          )}

          {/* ── SCHOOLS ── */}
          {activeTab === 'school' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">{nationalScore.participatingSchools} schools participating · ranked by avg XP per student</p>
              <div className="space-y-2">
                {schoolData.map((school) => (
                  <div
                    key={school.rank}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      school.rank <= 3 ? 'bg-yellow-50/60 border border-yellow-100' : 'border border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      school.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      school.rank === 2 ? 'bg-gray-100 text-gray-600' :
                      school.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {school.rank <= 3 ? ['🥇','🥈','🥉'][school.rank - 1] : `#${school.rank}`}
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900">{school.name}</span>
                        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2 py-0.5 font-medium">{school.abbreviation}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400 flex items-center gap-0.5"><Users className="w-3 h-3" />{school.students.toLocaleString()} students</span>
                        <span className="text-xs text-gray-400 flex items-center gap-0.5"><Target className="w-3 h-3" />{school.avgAccuracy}% avg accuracy</span>
                      </div>
                      {/* Literacy bar */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: `${school.literacy}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-600 font-semibold w-8 text-right">{school.literacy}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 justify-end">
                          <Zap className="w-3.5 h-3.5 text-orange-400" />
                          <span className="font-bold text-sm text-gray-800">{school.avgXp.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-gray-400">Avg XP</span>
                      </div>
                      <RankChange change={school.change} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">Rankings update daily. Digital Literacy % = weighted score across all 5 modules.</p>
            </div>
          )}

          {/* ── WEEKLY CHALLENGE ── */}
          {activeTab === 'weekly' && (
            <div className="space-y-5">
              {/* Challenge banner */}
              <div className="rounded-2xl overflow-hidden border border-purple-200">
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarDays className="w-4 h-4 text-purple-300" />
                        <span className="text-purple-200 text-xs font-medium uppercase tracking-wide">Active Challenge</span>
                      </div>
                      <h2 className="text-white mb-1">{weeklyChallenge.name}</h2>
                      <p className="text-purple-200 text-sm">{weeklyChallenge.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-center bg-white/15 border border-white/20 rounded-2xl px-4 py-3">
                      <p className="text-white/70 text-xs">Ends in</p>
                      <p className="font-black text-lg leading-tight">{weeklyChallenge.ends}</p>
                      <p className="text-white/70 text-xs">{weeklyChallenge.totalParticipants.toLocaleString()} participants</p>
                    </div>
                  </div>
                </div>
                {/* Milestones */}
                <div className="bg-white p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Milestones</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weeklyChallenge.milestones.map((m) => (
                      <div
                        key={m.label}
                        className={`flex flex-col items-center text-center p-3 rounded-xl border ${
                          m.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <span className="text-2xl mb-1">{m.icon}</span>
                        <span className={`font-bold text-xs ${m.achieved ? 'text-green-700' : 'text-gray-500'}`}>{m.label}</span>
                        <span className={`text-xs mt-0.5 ${m.achieved ? 'text-green-600' : 'text-gray-400'}`}>{m.reward}</span>
                        {m.achieved && <span className="mt-1.5 text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 font-semibold">Achieved</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rankings */}
              <div>
                <p className="text-gray-700 font-semibold text-sm mb-3">Challenge Rankings</p>
                <div className="space-y-2">
                  {weeklyChallenge.rankings.map((entry, idx) => (
                    <div key={entry.rank}>
                      {idx === 3 && (
                        <div className="py-2 px-4 flex items-center gap-2 text-gray-400 text-xs">
                          <div className="flex-1 border-t border-dashed border-gray-200" />
                          <span>··· Rank #38, #39, #40 ···</span>
                          <div className="flex-1 border-t border-dashed border-gray-200" />
                        </div>
                      )}
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          entry.isUser
                            ? 'bg-red-50 border-2 border-red-300'
                            : entry.rank <= 3
                            ? 'bg-yellow-50/60 border border-yellow-100'
                            : 'border border-gray-100'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                          entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          entry.isUser ? 'bg-red-100 text-red-600' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
                        </div>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${
                          entry.isUser ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-purple-400 to-violet-500'
                        }`}>
                          {entry.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${entry.isUser ? 'text-red-700' : 'text-gray-900'}`}>{entry.name}</span>
                            {entry.isUser && <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">You</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-400">Round {entry.round}/5</span>
                            <span className="text-xs text-gray-400 flex items-center gap-0.5"><Target className="w-3 h-3" />{entry.accuracy}%</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`font-bold text-sm ${entry.isUser ? 'text-red-600' : 'text-gray-800'}`}>{entry.score.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">pts</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200 text-sm text-purple-700 mt-3">
                  <Medal className="w-4 h-4 flex-shrink-0 text-purple-500" />
                  <span>Complete Round 5 to enter the Top 100 zone. You need <strong>2,460 more pts</strong> to reach the Top 10% milestone reward.</span>
                </div>
              </div>
            </div>
          )}

          {/* ── NATIONAL SG SCORE ── */}
          {activeTab === 'national' && (
            <div className="space-y-6">
              {/* Big score */}
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-shrink-0 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 text-white text-center shadow-lg min-w-[180px]">
                  <Globe className="w-8 h-8 text-white/60 mx-auto mb-2" />
                  <div className="text-6xl font-black mb-1">{nationalScore.score}</div>
                  <div className="text-white/80 text-sm mb-3">/100</div>
                  <div className="bg-white/20 rounded-xl px-3 py-1.5 inline-block">
                    <span className="font-bold text-sm">{nationalScore.label}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1 text-green-300 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    {nationalScore.trend}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {/* Score tiers */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Score Tiers</p>
                    <div className="flex gap-1 rounded-xl overflow-hidden border border-gray-200">
                      {[
                        { label: 'At Risk', range: '0–49', color: 'bg-red-100 text-red-700' },
                        { label: 'Developing', range: '50–64', color: 'bg-orange-100 text-orange-700' },
                        { label: 'Capable', range: '65–79', color: 'bg-yellow-100 text-yellow-700' },
                        { label: 'Resilient', range: '80–89', color: 'bg-green-100 text-green-700' },
                        { label: 'Exemplary', range: '90–100', color: 'bg-emerald-100 text-emerald-700' },
                      ].map((tier) => (
                        <div
                          key={tier.label}
                          className={`flex-1 py-2 px-1 text-center ${tier.color} ${
                            tier.label === 'Capable' ? 'ring-2 ring-red-400 ring-inset' : ''
                          }`}
                        >
                          <div className="font-bold text-xs">{tier.label}</div>
                          <div className="text-xs opacity-70">{tier.range}</div>
                          {tier.label === 'Capable' && (
                            <div className="text-xs font-black mt-0.5">← SG Now</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Singapore is 2 pts away from entering the <strong className="text-green-600">Resilient</strong> tier.</p>
                  </div>

                  {/* Global rank */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Global Ranking</p>
                      <p className="text-xs text-blue-600">Singapore is ranked <strong>#3 globally</strong> in youth digital literacy among Smart Nation initiative countries.</p>
                    </div>
                    <div className="ml-auto text-3xl font-black text-blue-400">#3</div>
                  </div>
                </div>
              </div>

              {/* Breakdown bars */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Category Breakdown</p>
                <div className="space-y-3">
                  {nationalScore.breakdown.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 font-medium">{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Prev: {cat.prev}</span>
                          <span className="font-bold text-sm text-gray-900">{cat.score}</span>
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />+{cat.score - cat.prev}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 relative overflow-hidden">
                        {/* Previous score ghost */}
                        <div
                          className="h-2.5 rounded-full opacity-30 absolute top-0 left-0"
                          style={{ width: `${cat.prev}%`, background: cat.color.replace('bg-', '').includes('-') ? 'currentColor' : '#aaa' }}
                        />
                        <div
                          className={`h-2.5 rounded-full ${cat.color} transition-all`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Scores computed from {nationalScore.activeUsers.toLocaleString()} active users · {nationalScore.missionsCompleted.toLocaleString()} missions completed.</p>
              </div>

              {/* Nation stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Active Users', value: '82,400', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
                  { label: 'Participating Schools', value: '284', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
                  { label: 'Missions Completed', value: '1.24M', icon: Shield, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 text-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                    <div className={`font-black text-xl ${stat.color}`}>{stat.value}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                <Star className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>Your missions directly contribute to Singapore's collective score. Every accurate submission raises the national literacy index.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
