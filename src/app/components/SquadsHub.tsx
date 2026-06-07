import { useState, useEffect, useCallback } from 'react';
import {
  Users, Trophy, Crown, Zap, Plus, LogOut, Search,
  Loader2, Shield, CheckCircle, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Squad {
  id: string;
  name: string;
  emblem: string;
  description: string | null;
  captain_id: string | null;
  captain_username: string | null;
  member_count: number;
  total_xp: number;
  created_at: string;
}

interface SquadMember {
  user_id: string;
  username: string;
  full_name: string;
  avatar_color: string;
  level: number;
  level_title: string;
  xp: number;
  is_captain: boolean;
}

interface MySquadResponse {
  squad: Squad;
  members: SquadMember[];
  my_rank: number | null;
}

const AVATAR_GRADIENTS: Record<string, string> = {
  red: 'from-red-500 to-orange-500', purple: 'from-purple-500 to-pink-500',
  blue: 'from-blue-500 to-cyan-500', green: 'from-green-500 to-emerald-500',
  pink: 'from-pink-500 to-rose-500',
};

const EMBLEM_OPTIONS = ['🛡️','⚔️','🔥','⚡','🦅','🌐','🎯','🔴','🏆','💎','🌟','🚀'];

// ── Main component ────────────────────────────────────────────────────────────
export function SquadsHub() {
  const { session, profile } = useAuth();

  const [mySquad, setMySquad] = useState<MySquadResponse | null | undefined>(undefined);
  const [allSquads, setAllSquads] = useState<Squad[]>([]);
  const [loadingMy, setLoadingMy] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmblem, setCreateEmblem] = useState('🛡️');
  const [createDesc, setCreateDesc] = useState('');

  // Leave confirmation
  const [confirmLeave, setConfirmLeave] = useState(false);

  const authHeader: Record<string, string> = session ? { Authorization: `Bearer ${session.access_token}` } : {};

  const fetchMySquad = useCallback(async () => {
    if (!session) return;
    setLoadingMy(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/squads/me`, { headers: authHeader });
      const { data } = await res.json();
      setMySquad(data ?? null);
    } catch { setMySquad(null); }
    finally { setLoadingMy(false); }
  }, [session]);

  const fetchAllSquads = useCallback(async () => {
    setLoadingAll(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/squads`);
      const { data } = await res.json();
      setAllSquads(data ?? []);
    } catch { setAllSquads([]); }
    finally { setLoadingAll(false); }
  }, []);

  useEffect(() => { fetchMySquad(); }, [fetchMySquad]);
  useEffect(() => { fetchAllSquads(); }, [fetchAllSquads]);

  function flash(msg: string, isError = false) {
    if (isError) { setError(msg); setTimeout(() => setError(null), 4000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(null), 4000); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createName.trim() || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/squads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ name: createName.trim(), emblem: createEmblem, description: createDesc.trim() || undefined }),
      });
      const body = await res.json();
      if (!res.ok) { flash(body.error ?? 'Failed to create squad', true); return; }
      flash(`Squad "${body.data.name}" created!`);
      setShowCreate(false);
      setCreateName(''); setCreateDesc(''); setCreateEmblem('🛡️');
      await fetchMySquad();
      await fetchAllSquads();
    } catch { flash('Network error', true); }
    finally { setActionLoading(false); }
  }

  async function handleJoin(squadId: string, squadName: string) {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/squads/${squadId}/join`, {
        method: 'POST', headers: authHeader,
      });
      const body = await res.json();
      if (!res.ok) { flash(body.error ?? 'Failed to join squad', true); return; }
      flash(`Joined ${squadName}!`);
      await fetchMySquad();
      await fetchAllSquads();
    } catch { flash('Network error', true); }
    finally { setActionLoading(false); }
  }

  async function handleLeave() {
    if (!mySquad || actionLoading) return;
    setActionLoading(true);
    setConfirmLeave(false);
    try {
      const res = await fetch(`${BACKEND_URL}/api/squads/${mySquad.squad.id}/leave`, {
        method: 'POST', headers: authHeader,
      });
      if (!res.ok) { const b = await res.json(); flash(b.error ?? 'Failed to leave', true); return; }
      flash('You left the squad.');
      setMySquad(null);
      await fetchAllSquads();
    } catch { flash('Network error', true); }
    finally { setActionLoading(false); }
  }

  const filteredSquads = allSquads.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-red-600" />
          Squads
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Form a squad, climb the leaderboard together, earn shared XP.</p>
      </div>

      {/* Toast messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-2xl text-red-700 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-300 rounded-2xl text-green-700 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />{success}
        </div>
      )}

      {/* ── My Squad ── */}
      {loadingMy ? (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading your squad…
        </div>
      ) : mySquad ? (
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
          {/* Squad header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-4xl">
                {mySquad.squad.emblem}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black">{mySquad.squad.name}</h2>
                  {mySquad.my_rank && (
                    <span className="bg-white/20 border border-white/30 rounded-full px-3 py-0.5 text-sm font-bold">
                      Rank #{mySquad.my_rank}
                    </span>
                  )}
                </div>
                {mySquad.squad.description && <p className="text-white/80 text-sm mt-0.5">{mySquad.squad.description}</p>}
                <div className="flex items-center gap-3 mt-1 text-white/70 text-xs">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{mySquad.squad.member_count} members</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{mySquad.squad.total_xp.toLocaleString()} Squad XP</span>
                  {mySquad.squad.captain_username && (
                    <span className="flex items-center gap-1"><Crown className="w-3 h-3 text-yellow-300" />Captain: {mySquad.squad.captain_username}</span>
                  )}
                </div>
              </div>
            </div>

            {confirmLeave ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setConfirmLeave(false)} className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-all">Cancel</button>
                <button onClick={handleLeave} disabled={actionLoading} className="px-3 py-2 bg-white text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all flex items-center gap-1 disabled:opacity-50">
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Confirm Leave
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmLeave(true)} className="flex items-center gap-2 px-3 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-sm font-medium transition-all">
                <LogOut className="w-4 h-4" /> Leave
              </button>
            )}
          </div>

          {/* Members grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {mySquad.members.map((member) => {
              const isMe = member.user_id === profile?.id || member.username === profile?.username;
              const initials = member.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div key={member.user_id} className={`bg-white/10 border rounded-2xl p-3 text-center ${isMe ? 'border-yellow-300 bg-white/20' : 'border-white/20'}`}>
                  <div className="relative inline-block mb-2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[member.avatar_color] ?? 'from-gray-400 to-gray-500'} flex items-center justify-center font-bold text-sm text-white mx-auto`}>
                      {initials}
                    </div>
                    {member.is_captain && (
                      <Crown className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <p className="font-semibold text-sm truncate">{isMe ? 'You' : member.full_name}</p>
                  <p className="text-white/60 text-xs">Lv {member.level} · {member.xp.toLocaleString()} XP</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* No squad — show create prompt */
        <div className="bg-gradient-to-br from-gray-50 to-red-50 border-2 border-dashed border-red-200 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">You're not in a squad yet</h3>
          <p className="text-gray-500 text-sm mb-5">Join an existing squad or create your own to compete on the Squad Leaderboard.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> Create a Squad
          </button>
        </div>
      )}

      {/* ── Create Squad Form ── */}
      {showCreate && !mySquad && (
        <div className="bg-white rounded-3xl border-2 border-red-200 shadow-lg p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-600" /> Create a New Squad
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Squad Name *</label>
                <input
                  type="text" value={createName} onChange={e => setCreateName(e.target.value)}
                  maxLength={30} placeholder="e.g. Red Sentinels"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 text-sm"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">{createName.length}/30 characters</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Emblem</label>
                <div className="flex flex-wrap gap-2">
                  {EMBLEM_OPTIONS.map(e => (
                    <button key={e} type="button" onClick={() => setCreateEmblem(e)}
                      className={`w-10 h-10 rounded-xl text-xl border-2 transition-all ${createEmblem === e ? 'border-red-400 bg-red-50 scale-110' : 'border-gray-200 hover:border-gray-300'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (optional)</label>
              <textarea
                value={createDesc} onChange={e => setCreateDesc(e.target.value)}
                maxLength={200} rows={2} placeholder="What does your squad stand for?"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={actionLoading || createName.trim().length < 3}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Squad
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Browse All Squads ── */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> All Squads
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">{allSquads.length} squads active</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search squads…"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-300 w-40"
              />
            </div>
            <button onClick={() => { fetchAllSquads(); fetchMySquad(); }}
              className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-red-600 hover:border-red-300 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loadingAll ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading squads…
          </div>
        ) : filteredSquads.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {searchQuery ? 'No squads match your search.' : 'No squads yet — be the first to create one!'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSquads.map((squad, idx) => {
              const isMySquad = mySquad?.squad.id === squad.id;
              const rankLabel = idx + 1 <= 3 ? ['🥇','🥈','🥉'][idx] : `#${idx + 1}`;

              return (
                <div key={squad.id} className={`flex items-center gap-4 px-5 py-4 transition-all ${isMySquad ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  <div className={`w-8 text-center font-bold text-sm ${idx < 3 ? 'text-lg' : 'text-gray-400'}`}>{rankLabel}</div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-2xl flex-shrink-0">
                    {squad.emblem}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{squad.name}</span>
                      {isMySquad && <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">Your Squad</span>}
                    </div>
                    {squad.description && <p className="text-xs text-gray-400 truncate mt-0.5">{squad.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{squad.member_count} members</span>
                      <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-orange-400" />{squad.total_xp.toLocaleString()} XP</span>
                      {squad.captain_username && <span className="flex items-center gap-0.5"><Crown className="w-3 h-3 text-yellow-500" />{squad.captain_username}</span>}
                    </div>
                  </div>

                  {isMySquad ? (
                    <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Joined
                    </span>
                  ) : !mySquad ? (
                    <button
                      onClick={() => handleJoin(squad.id, squad.name)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Join
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(squad.id, squad.name)}
                      disabled={actionLoading}
                      className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-red-300 hover:text-red-600 transition-all disabled:opacity-50"
                    >
                      Switch
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create CTA at the bottom if not in a squad and form is not open */}
      {!mySquad && !showCreate && (
        <div className="text-center">
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-red-300 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all text-sm">
            <Plus className="w-4 h-4" /> Don't see the right squad? Create your own
          </button>
        </div>
      )}
    </div>
  );
}
