import { Shield, Clock, Zap, Trophy, Target, Link2, Users, CheckCircle, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

type ModuleStatus = 'not_started' | 'in_progress' | 'completed';

interface ModuleProgress {
  module_slug: string;
  status: ModuleStatus;
  correct_count: number;
  wrong_count: number;
  last_question_index: number;
  completed_at: string | null;
}

interface MissionStatusResponse {
  modules: ModuleProgress[];
  overall_progress_pct: number;
  completed: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

const MODULE_META = [
  {
    slug: 'spot-the-spin',
    number: 1,
    title: 'Spot the Spin',
    description: 'Classify viral posts as Real, Misleading, Satire, or Scam.',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    xp: 200,
    time: '5 min',
    path: '/mission/digital-shield/spot-the-spin',
  },
  {
    slug: 'chain-reaction',
    number: 2,
    title: 'Chain Reaction',
    description: 'Visualize how misinformation spreads through networks.',
    icon: Link2,
    color: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    xp: 150,
    time: '5 min',
    path: '/mission/digital-shield/chain-reaction',
  },
  {
    slug: 'shield-squad',
    number: 3,
    title: 'Shield Squad',
    description: 'Collaborate with peers to fact-check content.',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    xp: 150,
    time: '5 min',
    path: '/mission/digital-shield/shield-squad',
  },
];

const BADGE_META = [
  { slug: 'spin-spotter', name: 'Spin Spotter', description: 'Complete Module 1', icon: '🎯', requirement: 'Classify 10 posts correctly' },
  { slug: 'ripple-breaker', name: 'Ripple Breaker', description: 'Complete Module 2', icon: '⛓️', requirement: 'Trace 5 misinformation chains' },
  { slug: 'truth-guardian', name: 'Truth Guardian', description: 'Complete all modules', icon: '🛡️', requirement: 'Finish all 3 modules' },
  { slug: 'squad-strategist', name: 'Squad Strategist', description: 'Complete Module 3', icon: '👥', requirement: 'Fact-check with 3 teammates' },
];

export function MissionHub() {
  const { session } = useAuth();
  const [missionStatus, setMissionStatus] = useState<MissionStatusResponse | null>(null);
  const [badgesEarned, setBadgesEarned] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { setLoading(false); return; }

    const headers = { Authorization: `Bearer ${session.access_token}` };

    Promise.all([
      fetch(`${BACKEND_URL}/api/missions/digital-shield`, { headers }).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/missions/digital-shield/badges`, { headers }).then(r => r.json()),
    ]).then(([missionRes, badgesRes]) => {
      if (missionRes.data) setMissionStatus(missionRes.data);
      if (badgesRes.data) {
        setBadgesEarned(new Set(
          (badgesRes.data as Array<{ badge_slug: string; earned: boolean }>)
            .filter(b => b.earned)
            .map(b => b.badge_slug),
        ));
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [session]);

  const getModuleProgress = (slug: string): ModuleProgress | null =>
    missionStatus?.modules.find(m => m.module_slug === slug) ?? null;

  const getModuleStatus = (slug: string): ModuleStatus => {
    const p = getModuleProgress(slug);
    return p?.status ?? 'not_started';
  };

  const getProgressPct = (slug: string): number => {
    const p = getModuleProgress(slug);
    if (!p || p.status === 'not_started') return 0;
    if (p.status === 'completed') return 100;
    const total = p.correct_count + p.wrong_count;
    return total === 0 ? 0 : Math.min(99, Math.round((p.last_question_index / 10) * 100));
  };

  const overallProgress = missionStatus?.overall_progress_pct ?? 0;
  const completedModules = missionStatus?.modules.filter(m => m.status === 'completed').length ?? 0;

  return (
    <div className="p-8 space-y-8">
      <RouterLink to="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </RouterLink>

      {/* Large Mission Card */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 text-white shadow-2xl border-4 border-red-200">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-bold">MISSION 1</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">Digital Shield</h1>
              <p className="text-2xl text-red-100">Spot the Spin</p>
            </div>

            <p className="text-lg text-red-50 leading-relaxed">
              Analyze viral posts, trace misinformation spread, and work with your squad to stop harmful content.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm text-red-100">Difficulty</span>
                </div>
                <div className="text-xl font-bold">Beginner</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm text-red-100">Est. Time</span>
                </div>
                <div className="text-xl font-bold">15 min</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm text-red-100">XP Reward</span>
                </div>
                <div className="text-xl font-bold">+500 XP</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm text-red-100">Badges</span>
                </div>
                <div className="text-xl font-bold">4 Available</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-red-100">Overall Progress</span>
                <span className="text-2xl font-bold">
                  {loading ? '...' : `${overallProgress}%`}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
              </div>
              <div className="text-sm text-red-100">
                {loading ? '...' : `${completedModules} of 3 modules completed`}
              </div>
            </div>

            <RouterLink
              to="/mission/digital-shield/spot-the-spin"
              className="w-full py-4 bg-white hover:bg-red-50 text-red-600 font-bold text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              <span>
                {getModuleStatus('spot-the-spin') === 'completed'
                  ? 'Review Mission'
                  : getModuleStatus('spot-the-spin') === 'in_progress'
                  ? 'Continue Mission'
                  : 'Start Mission'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </RouterLink>

            <div className="text-center text-sm text-red-100">
              Complete all 3 modules to earn the full 500 XP reward
            </div>
          </div>
        </div>
      </div>

      {/* Mission Modules */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mission Modules</h2>
          <div className="text-sm text-gray-500">Complete in sequence</div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MODULE_META.map((module, index) => {
            const status = getModuleStatus(module.slug);
            const progress = getProgressPct(module.slug);
            const isLocked = status === 'not_started' && index > 0 && getModuleStatus(MODULE_META[index - 1].slug) !== 'completed';

            return (
              <div
                key={module.slug}
                className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${
                  status === 'in_progress'
                    ? 'border-red-300 shadow-lg'
                    : status === 'completed'
                    ? 'border-green-300'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {module.number}
                </div>

                {isLocked && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm font-bold text-gray-600">Complete Module {index}</div>
                      <div className="text-xs text-gray-500">to unlock</div>
                    </div>
                  </div>
                )}

                <div className={`w-16 h-16 ${module.iconBg} rounded-2xl flex items-center justify-center mb-4 mt-4`}>
                  <module.icon className={`w-8 h-8 ${module.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{module.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-red-600">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">+{module.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{module.time}</span>
                  </div>
                </div>

                {status === 'in_progress' && progress > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${module.color} h-2 rounded-full`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {status === 'in_progress' && (
                  <RouterLink
                    to={module.path}
                    className="block w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-center"
                  >
                    Continue
                  </RouterLink>
                )}

                {status === 'completed' && (
                  <div className="w-full py-2.5 bg-green-100 text-green-700 font-medium rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                )}

                {status === 'not_started' && !isLocked && (
                  <RouterLink
                    to={module.path}
                    className="block w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-center"
                  >
                    Start
                  </RouterLink>
                )}

                {isLocked && (
                  <button disabled className="w-full py-2.5 bg-gray-200 text-gray-400 font-medium rounded-xl cursor-not-allowed">
                    Locked
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mission Badges</h2>
          <div className="text-sm text-gray-500">{badgesEarned.size}/4 earned</div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGE_META.map((badge) => {
            const earned = badgesEarned.has(badge.slug);
            return (
              <div
                key={badge.slug}
                className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                  earned ? 'border-yellow-300 shadow-lg' : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="text-center">
                  <div className={`text-6xl mb-3 ${earned ? '' : 'grayscale opacity-50'}`}>
                    {badge.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

                  {earned ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-bold">Unlocked</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">{badge.requirement}</div>
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-bold">Locked</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Identify Misinformation Patterns', desc: 'Recognize common tactics used to spread false information' },
            { title: 'Collaborative Fact-Checking', desc: 'Work with teammates to verify content accuracy' },
            { title: 'Verify Sources', desc: 'Learn techniques to fact-check and validate information sources' },
            { title: 'Critical Thinking Skills', desc: 'Develop analytical skills to question and evaluate content' },
            { title: 'Understand Information Spread', desc: 'Visualize how false narratives propagate through networks' },
            { title: 'Community Protection', desc: 'Help protect your community from harmful misinformation' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
