import { useState, useEffect } from 'react';
import {
  Trophy, Zap, TrendingUp, TrendingDown, Minus, Shield,
  Users, GraduationCap, CalendarDays, Globe, Flame,
  Star, ChevronRight, Crown, Target, ArrowUp, Sparkles,
  Medal, BarChart3, Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ── API types ─────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  full_name: string;
  avatar_color: string;
  level: number;
  level_title: string;
  xp: number;
  accuracy_rate: number;
  streak_days: number;
  is_me: boolean;
}

interface SquadLeaderboardEntry {
  rank: number;
  squad_id: string;
  name: string;
  emblem: string;
  member_count: number;
  total_xp: number;
  captain_username: string | null;
  is_my_squad: boolean;
}

// ── Static data for non-live tabs ─────────────────────────────────────────────
const schoolData = [
  { rank: 1, name: 'Raffles Institution',         abbreviation: 'RI',     students: 2840, avgXp: 3420, avgAccuracy: 94, literacy: 96, change: 0  },
  { rank: 2, name: 'Hwa Chong Institution',        abbreviation: 'HCI',    students: 2610, avgXp: 3180, avgAccuracy: 93, literacy: 94, change: 1  },
  { rank: 3, name: 'NUS High School',              abbreviation: 'NUSHS',  students: 1450, avgXp: 3050, avgAccuracy: 93, literacy: 93, change: -1 },
  { rank: 4, name: 'Temasek Junior College',       abbreviation: 'TJC',    students: 2200, avgXp: 2780, avgAccuracy: 91, literacy: 91, change: 2  },
  { rank: 5, name: 'Anglo-Chinese School (Ind)',   abbreviation: 'ACS(I)', students: 3100, avgXp: 2650, avgAccuracy: 90, literacy: 90, change: 0  },
  { rank: 6, name: 'Dunman High School',           abbreviation: 'DHS',    students: 1890, avgXp: 2540, avgAccuracy: 89, literacy: 88, change: 3  },
  { rank: 7, name: 'Victoria Junior College',      abbreviation: 'VJC',    students: 2050, avgXp: 2420, avgAccuracy: 88, literacy: 87, change: -2 },
  { rank: 8, name: 'Meridian Secondary',           abbreviation: 'MSS',    students: 1670, avgXp: 2110, avgAccuracy: 86, literacy: 85, change: 1  },
];

const weeklyChallenge = {
  name: 'Operation Deepfake Storm',
  ends: '2 days 14 hours',
  theme: 'Deepfake Detection Blitz',
  totalParticipants: 18420,
  description: 'Identify AI-generated media across 5 escalating rounds. The top 100 earn the Deepfake Storm badge.',
  rankings: [
    { rank: 1,  name: 'SentinelAlex', avatar: 'SA', score: 9800, round: 5, accuracy: 99, isUser: false },
    { rank: 2,  name: 'NovaPriya',    avatar: 'NP', score: 9450, round: 5, accuracy: 97, isUser: false },
    { rank: 3,  name: 'GuardianMei',  avatar: 'GM', score: 9120, round: 5, accuracy: 96, isUser: false },
    { rank: 41, name: 'You',          avatar: '??', score: 7340, round: 4, accuracy: 91, isUser: true  },
  ],
  milestones: [
    { label: 'Top 100',   reward: 'Deepfake Storm Badge', icon: '🏅', achieved: false },
    { label: 'Top 500',   reward: '+500 Bonus XP',        icon: '⚡', achieved: false },
    { label: 'Top 10%',   reward: '+200 XP',              icon: '🎯', achieved: true  },
    { label: 'Participated', reward: '+50 XP',            icon: '✅', achieved: true  },
  ],
};

const nationalScore = {
  score: 78, label: 'Digitally Resilient', prev: 71, trend: '+7 pts from last quarter',
  breakdown: [
    { category: 'Scam Awareness',         score: 84, color: 'bg-red-500',    prev: 76 },
    { category: 'Deepfake Detection',      score: 72, color: 'bg-purple-500', prev: 61 },
    { category: 'Misinformation Literacy', score: 79, color: 'bg-amber-500',  prev: 73 },
    { category: 'Cyberbullying Response',  score: 81, color: 'bg-pink-500',   prev: 75 },
    { category: 'QR Code Safety',          score: 76, color: 'bg-blue-500',   prev: 70 },
  ],
  participatingSchools: 284, activeUsers: 82400, missionsCompleted: 1240000, globalRank: 3,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_GRADIENTS: Record<string, string> = {
  red: 'from-red-500 to-orange-500', purple: 'from-purple-500 to-pink-500',
  blue: 'from-blue-500 to-cyan-500', green: 'from-green-500 to-emerald-500',
  pink: 'from-pink-500 to-rose-500',
};

function avatarInitials(entry: LeaderboardEntry) {
  return entry.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function RankChange({ change }: { change: number }) {
  if (change > 0) return <span className="flex items-center gap-0.5 text-green-600 text-xs font-semibold"><TrendingUp className="w-3 h-3" />+{change}</span>;
  if (change < 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-semibold"><TrendingDown className="w-3 h-3" />{change}</span>;
  return <Minus className="w-3 h-3 text-gray-300" />;
}

function PodiumCard({ entry }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) {
  const styles = {
    1: { height: 'h-32', gradient: 'from-yellow-400 to-amber-500', ring: 'ring-yellow-300', label: '🥇', size: 'w-16 h-16', text: 'text-xl', mt: '-mt-4' },
    2: { height: 'h-24', gradient: 'from-slate-300 to-slate-400',  ring: 'ring-slate-300',  label: '🥈', size: 'w-14 h-14', text: 'text-lg', mt: '' },
    3: { height: 'h-20', gradient: 'from-orange-300 to-amber-400', ring: 'ring-orange-200', label: '🥉', size: 'w-12 h-12', text: 'text-base', mt: '' },
  }[entry.rank as 1 | 2 | 3] ?? { height: 'h-20', gradient: 'from-gray-300 to-gray-400', ring: 'ring-gray-200', label: `#${entry.rank}`, size: 'w-12 h-12', text: 'text-base', mt: '' };

  return (
    <div className={`flex flex-col items-center gap-2 ${styles.mt}`}>
      <div className="relative">
        <div className={`${styles.size} rounded-2xl bg-gradient-to-br ${entry.is_me ? 'from-red-500 to-orange-500' : styles.gradient} flex items-center justify-center text-white font-bold ${styles.text} ring-4 ${entry.is_me ? 'ring-red-300' : styles.ring} shadow-lg`}>
          {avatarInitials(entry)}
        </div>
        <div className="absolute -bottom-1 -right-1 text-lg">{styles.label}</div>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-900 text-sm">{entry.full_name}</p>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <Zap className="w-3 h-3 text-orange-400" />{entry.xp.toLocaleString()} XP
        </div>
        <div className="text-xs text-gray-400">Lv {entry.level}</div>
      </div>
      <div className={`w-full ${styles.height} bg-gradient-to-t ${styles.gradient} rounded-t-xl opacity-30 mt-auto`} />
    </div>
  );
}

type Tab = 'individual' | 'squad' | 'school' | 'weekly' | 'national';

// ── Main component ────────────────────────────────────────────────────────────
export function Leaderboard() {
  const { session, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('individual');

  const [individuals, setIndividuals] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [squads, setSquads] = useState<SquadLeaderboardEntry[]>([]);
  const [mySquadEntry, setMySquadEntry] = useState<SquadLeaderboardEntry | null>(null);
  const [loadingIndividual, setLoadingIndividual] = useState(false);
  const [loadingSquads, setLoadingSquads] = useState(false);

  useEffect(() => {
    if (!session || loadingIndividual || individuals.length > 0) return;
    setLoadingIndividual(true);
    fetch(`${BACKEND_URL}/api/leaderboard/individual`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(({ data }) => {
        if (data) { setIndividuals(data.entries); setMyEntry(data.my_entry); }
      })
      .catch(console.error)
      .finally(() => setLoadingIndividual(false));
  }, [session]);

  useEffect(() => {
    if (activeTab !== 'squad' || !session || loadingSquads || squads.length > 0) return;
    setLoadingSquads(true);
    fetch(`${BACKEND_URL}/api/leaderboard/squads`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(({ data }) => {
        if (data) { setSquads(data.entries); setMySquadEntry(data.my_entry); }
      })
      .catch(console.error)
      .finally(() => setLoadingSquads(false));
  }, [activeTab, session]);

  const top3 = individuals.slice(0, 3);
  const rest  = individuals.slice(3);

  const myXp     = myEntry?.xp ?? profile?.xp ?? 0;
  const myRank   = myEntry?.rank ?? null;
  const nextRank = myEntry ? individuals.find(e => e.rank === myEntry.rank - 1) : null;
  const xpToNext = nextRank ? nextRank.xp - myXp : null;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'individual', label: 'Individual',       icon: Trophy       },
    { key: 'squad',      label: 'Squads',           icon: Users        },
    { key: 'school',     label: 'Schools',          icon: GraduationCap },
    { key: 'weekly',     label: 'Weekly Challenge', icon: CalendarDays  },
    { key: 'national',   label: 'SG Score',         icon: Globe        },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Season 3 · Resets 1 Sep 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <Flame className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-600">Season ends in</span>
          <span className="font-bold text-red-600 text-sm">87d 6h</span>
        </div>
      </div>

      {/* My rank banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
          {[0,1,2].map(i => (
            <Shield key={i} className="absolute text-white" style={{ width: 60 + i*20, height: 60 + i*20, right: 10 + i*15, top: '50%', transform: `translateY(-50%) rotate(${i*15}deg)` }} />
          ))}
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center font-bold text-xl border border-white/30">
              {profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Your Rank</p>
              <p className="text-3xl font-black">{myRank ? `#${myRank}` : '—'}</p>
              <p className="text-white/80 text-sm">{profile?.full_name ?? '...'} · Level {profile?.level ?? '—'} {profile?.level_title ?? ''}</p>
            </div>
          </div>

          {xpToNext !== null && nextRank ? (
            <div className="flex-1 md:ml-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide">Progress to Rank #{nextRank.rank}</p>
                  <p className="text-white font-semibold text-sm">Need <span className="font-black">{xpToNext.toLocaleString()} XP</span> more to overtake {nextRank.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">{myXp.toLocaleString()} / {nextRank.xp.toLocaleString()} XP</p>
                  <div className="flex items-center gap-1 text-green-300 text-xs font-bold mt-0.5">
                    <ArrowUp className="w-3 h-3" /> Climbing!
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div className="bg-white h-3 rounded-full relative overflow-hidden transition-all" style={{ width: `${Math.min(100, (myXp / nextRank.xp) * 100)}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          ) : myRank === 1 ? (
            <div className="flex-1 md:ml-8 text-center">
              <p className="text-white font-bold text-lg">👑 You're #1 — defend your throne!</p>
            </div>
          ) : null}

          <div className="flex gap-2 md:flex-col">
            <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-center">
              <Flame className="w-4 h-4 text-orange-300 mx-auto mb-0.5" />
              <p className="font-bold text-sm">{profile?.streak_days ?? 0}</p>
              <p className="text-white/60 text-xs">Day Streak</p>
            </div>
            <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-center">
              <Target className="w-4 h-4 text-green-300 mx-auto mb-0.5" />
              <p className="font-bold text-sm">{profile?.accuracy_rate ?? 0}%</p>
              <p className="text-white/60 text-xs">Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === key ? 'text-red-600 border-b-2 border-red-600 bg-red-50/40' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── INDIVIDUAL ── */}
          {activeTab === 'individual' && (
            <div className="space-y-5">
              {loadingIndividual ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading rankings…
                </div>
              ) : (
                <>
                  {/* Podium */}
                  {top3.length === 3 && (
                    <div className="flex items-end justify-center gap-6 py-4 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 mb-2">
                      <PodiumCard entry={{ ...top3[1], rank: 2 }} place={2} />
                      <PodiumCard entry={{ ...top3[0], rank: 1 }} place={1} />
                      <PodiumCard entry={{ ...top3[2], rank: 3 }} place={3} />
                    </div>
                  )}

                  {/* Full list */}
                  <div className="space-y-1.5">
                    {individuals.map((entry) => (
                      <div key={entry.user_id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          entry.is_me ? 'bg-red-50 border-2 border-red-300 shadow-sm'
                          : entry.rank <= 3 ? 'bg-yellow-50/60 border border-yellow-100'
                          : 'border border-gray-100 hover:bg-gray-50'
                        }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                          entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          entry.is_me ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-500'
                        }`}>
                          {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
                        </div>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 bg-gradient-to-br ${
                          entry.is_me ? 'from-red-500 to-orange-500' : (AVATAR_GRADIENTS[entry.avatar_color] ?? 'from-gray-400 to-gray-500')
                        }`}>
                          {avatarInitials(entry)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-semibold text-sm ${entry.is_me ? 'text-red-700' : 'text-gray-900'}`}>{entry.full_name}</span>
                            {entry.is_me && <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">You</span>}
                            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 hidden sm:inline">Lv {entry.level}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400 flex items-center gap-0.5"><Target className="w-3 h-3" />{entry.accuracy_rate}%</span>
                            <span className="text-xs text-gray-400 flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" />{entry.streak_days}d</span>
                            <span className="hidden sm:inline text-xs text-gray-400">{entry.level_title}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-1 justify-end">
                              <Zap className="w-3.5 h-3.5 text-orange-400" />
                              <span className={`font-bold text-sm ${entry.is_me ? 'text-red-600' : 'text-gray-800'}`}>{entry.xp.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-gray-400">XP</span>
                          </div>
                          <RankChange change={0} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {xpToNext !== null && nextRank && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
                      <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-500" />
                      <span>You are <strong>{xpToNext.toLocaleString()} XP</strong> away from Rank #{nextRank.rank}. Complete more missions to climb!</span>
                      <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── SQUADS ── */}
          {activeTab === 'squad' && (
            <div className="space-y-4">
              {loadingSquads ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading squad rankings…
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">{squads.length} active squads this season</p>
                    <a href="/squads" className="text-sm text-red-600 font-medium hover:underline">Manage your squad →</a>
                  </div>
                  <div className="space-y-2">
                    {squads.map((squad) => (
                      <div key={squad.squad_id}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                          squad.is_my_squad ? 'bg-red-50 border-2 border-red-300 shadow-sm'
                          : squad.rank <= 3 ? 'bg-yellow-50/60 border border-yellow-100'
                          : 'border border-gray-100 hover:bg-gray-50'
                        }`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          squad.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          squad.rank === 2 ? 'bg-gray-100 text-gray-600' :
                          squad.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          squad.is_my_squad ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-500'
                        }`}>
                          {squad.rank <= 3 ? ['🥇','🥈','🥉'][squad.rank - 1] : `#${squad.rank}`}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                          {squad.emblem}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${squad.is_my_squad ? 'text-red-700' : 'text-gray-900'}`}>{squad.name}</span>
                            {squad.is_my_squad && <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">Your Squad</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-400 flex items-center gap-0.5"><Users className="w-3 h-3" />{squad.member_count} members</span>
                            {squad.captain_username && <span className="text-xs text-gray-400">Captain: {squad.captain_username}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-1 justify-end">
                              <Zap className="w-3.5 h-3.5 text-orange-400" />
                              <span className={`font-bold text-sm ${squad.is_my_squad ? 'text-red-600' : 'text-gray-800'}`}>{squad.total_xp.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-gray-400">Squad XP</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {mySquadEntry && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-700">
                      <Crown className="w-4 h-4 flex-shrink-0 text-orange-500" />
                      <span>{mySquadEntry.name} is ranked <strong>#{mySquadEntry.rank}</strong> with <strong>{mySquadEntry.total_xp.toLocaleString()} XP</strong>.</span>
                    </div>
                  )}
                  {!mySquadEntry && squads.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
                      <Users className="w-4 h-4 flex-shrink-0 text-blue-500" />
                      <span>You're not in a squad yet. <a href="/squads" className="font-bold underline">Join or create one</a> to appear on the Squad Leaderboard!</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── SCHOOLS ── */}
          {activeTab === 'school' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">{nationalScore.participatingSchools} schools participating · ranked by avg XP per student</p>
              <div className="space-y-2">
                {schoolData.map((school) => (
                  <div key={school.rank} className={`flex items-center gap-3 p-4 rounded-xl transition-all ${school.rank <= 3 ? 'bg-yellow-50/60 border border-yellow-100' : 'border border-gray-100 hover:bg-gray-50'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${school.rank === 1 ? 'bg-yellow-100 text-yellow-700' : school.rank === 2 ? 'bg-gray-100 text-gray-600' : school.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
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
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${school.literacy}%` }} />
                        </div>
                        <span className="text-xs text-blue-600 font-semibold w-8 text-right">{school.literacy}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 justify-end"><Zap className="w-3.5 h-3.5 text-orange-400" /><span className="font-bold text-sm text-gray-800">{school.avgXp.toLocaleString()}</span></div>
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
              <div className="rounded-2xl overflow-hidden border border-purple-200">
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1"><CalendarDays className="w-4 h-4 text-purple-300" /><span className="text-purple-200 text-xs font-medium uppercase tracking-wide">Active Challenge</span></div>
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
                <div className="bg-white p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Milestones</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weeklyChallenge.milestones.map((m) => (
                      <div key={m.label} className={`flex flex-col items-center text-center p-3 rounded-xl border ${m.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                        <span className="text-2xl mb-1">{m.icon}</span>
                        <span className={`font-bold text-xs ${m.achieved ? 'text-green-700' : 'text-gray-500'}`}>{m.label}</span>
                        <span className={`text-xs mt-0.5 ${m.achieved ? 'text-green-600' : 'text-gray-400'}`}>{m.reward}</span>
                        {m.achieved && <span className="mt-1.5 text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 font-semibold">Achieved</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                      <div className={`flex items-center gap-3 p-3 rounded-xl ${entry.isUser ? 'bg-red-50 border-2 border-red-300' : entry.rank <= 3 ? 'bg-yellow-50/60 border border-yellow-100' : 'border border-gray-100'}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : entry.rank === 2 ? 'bg-gray-100 text-gray-600' : entry.rank === 3 ? 'bg-orange-100 text-orange-700' : entry.isUser ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
                          {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
                        </div>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${entry.isUser ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-purple-400 to-violet-500'}`}>{entry.avatar}</div>
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
                  <span>Complete Round 5 to enter the Top 100 zone.</span>
                </div>
              </div>
            </div>
          )}

          {/* ── NATIONAL SG SCORE ── */}
          {activeTab === 'national' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-shrink-0 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 text-white text-center shadow-lg min-w-[180px]">
                  <Globe className="w-8 h-8 text-white/60 mx-auto mb-2" />
                  <div className="text-6xl font-black mb-1">{nationalScore.score}</div>
                  <div className="text-white/80 text-sm mb-3">/100</div>
                  <div className="bg-white/20 rounded-xl px-3 py-1.5 inline-block"><span className="font-bold text-sm">{nationalScore.label}</span></div>
                  <div className="mt-3 flex items-center justify-center gap-1 text-green-300 text-xs font-semibold"><TrendingUp className="w-3 h-3" />{nationalScore.trend}</div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Score Tiers</p>
                    <div className="flex gap-1 rounded-xl overflow-hidden border border-gray-200">
                      {[{ label:'At Risk',range:'0–49',color:'bg-red-100 text-red-700' },{ label:'Developing',range:'50–64',color:'bg-orange-100 text-orange-700' },{ label:'Capable',range:'65–79',color:'bg-yellow-100 text-yellow-700' },{ label:'Resilient',range:'80–89',color:'bg-green-100 text-green-700' },{ label:'Exemplary',range:'90–100',color:'bg-emerald-100 text-emerald-700' }].map(tier => (
                        <div key={tier.label} className={`flex-1 py-2 px-1 text-center ${tier.color} ${tier.label === 'Capable' ? 'ring-2 ring-red-400 ring-inset' : ''}`}>
                          <div className="font-bold text-xs">{tier.label}</div>
                          <div className="text-xs opacity-70">{tier.range}</div>
                          {tier.label === 'Capable' && <div className="text-xs font-black mt-0.5">← SG Now</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><BarChart3 className="w-5 h-5 text-blue-600" /></div>
                    <div><p className="text-sm font-semibold text-blue-900">Global Ranking</p><p className="text-xs text-blue-600">Singapore is ranked <strong>#3 globally</strong> in youth digital literacy.</p></div>
                    <div className="ml-auto text-3xl font-black text-blue-400">#3</div>
                  </div>
                </div>
              </div>
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
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{cat.score - cat.prev}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 relative overflow-hidden">
                        <div className={`h-2.5 rounded-full ${cat.color} transition-all`} style={{ width: `${cat.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:'Active Users',          value:'82,400', icon: Users,          color:'text-blue-600',   bg:'bg-blue-50',   border:'border-blue-200'   },
                  { label:'Participating Schools',  value:'284',    icon: GraduationCap,  color:'text-indigo-600', bg:'bg-indigo-50', border:'border-indigo-200' },
                  { label:'Missions Completed',     value:'1.24M',  icon: Shield,         color:'text-red-600',    bg:'bg-red-50',    border:'border-red-200'    },
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
