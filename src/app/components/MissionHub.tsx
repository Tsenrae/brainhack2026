import { Shield, Clock, Zap, Trophy, Target, Link2, Users, CheckCircle, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router';

export function MissionHub() {
  const modules = [
    {
      number: 1,
      title: "Spot the Spin",
      description: "Classify viral posts as Real, Misleading, Satire, or Scam.",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      status: "in-progress",
      progress: 65,
      xp: 200,
      time: "5 min",
      completed: false
    },
    {
      number: 2,
      title: "Chain Reaction",
      description: "Visualize how misinformation spreads through networks.",
      icon: Link2,
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      status: "locked",
      progress: 0,
      xp: 150,
      time: "5 min",
      completed: false
    },
    {
      number: 3,
      title: "Shield Squad",
      description: "Collaborate with peers to fact-check content.",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      status: "locked",
      progress: 0,
      xp: 150,
      time: "5 min",
      completed: false
    }
  ];

  const badges = [
    {
      name: "Spin Spotter",
      description: "Complete Module 1",
      icon: "🎯",
      unlocked: false,
      requirement: "Classify 10 posts correctly"
    },
    {
      name: "Ripple Breaker",
      description: "Complete Module 2",
      icon: "⛓️",
      unlocked: false,
      requirement: "Trace 5 misinformation chains"
    },
    {
      name: "Truth Guardian",
      description: "Complete all modules",
      icon: "🛡️",
      unlocked: false,
      requirement: "Finish all 3 modules"
    },
    {
      name: "Squad Strategist",
      description: "Complete Module 3",
      icon: "👥",
      unlocked: false,
      requirement: "Fact-check with 3 teammates"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Back Button */}
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
            {/* Progress Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-red-100">Overall Progress</span>
                <span className="text-2xl font-bold">65%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="text-sm text-red-100">1 of 3 modules completed</div>
            </div>

            {/* Start Button */}
            <RouterLink to="/mission/digital-shield/spot-the-spin" className="w-full py-4 bg-white hover:bg-red-50 text-red-600 font-bold text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Start Mission</span>
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
          {modules.map((module, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${
                module.status === 'in-progress'
                  ? 'border-red-300 shadow-lg'
                  : module.status === 'locked'
                  ? 'border-gray-200 opacity-60'
                  : 'border-green-300'
              }`}
            >
              {/* Module Number Badge */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {module.number}
              </div>

              {/* Locked Overlay */}
              {module.status === 'locked' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm font-bold text-gray-600">Complete Module {index}</div>
                    <div className="text-xs text-gray-500">to unlock</div>
                  </div>
                </div>
              )}

              {/* Module Icon */}
              <div className={`w-16 h-16 ${module.iconBg} rounded-2xl flex items-center justify-center mb-4 mt-4`}>
                <module.icon className={`w-8 h-8 ${module.iconColor}`} />
              </div>

              {/* Module Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{module.description}</p>

              {/* Stats */}
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

              {/* Progress */}
              {module.status === 'in-progress' && module.progress > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-bold text-gray-900">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${module.color} h-2 rounded-full`}
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {module.status === 'in-progress' && (
                <RouterLink to="/mission/digital-shield/spot-the-spin" className="block w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-center">
                  Continue
                </RouterLink>
              )}

              {module.status === 'locked' && (
                <button disabled className="w-full py-2.5 bg-gray-200 text-gray-400 font-medium rounded-xl cursor-not-allowed">
                  Locked
                </button>
              )}

              {module.completed && (
                <button className="w-full py-2.5 bg-green-100 text-green-700 font-medium rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Badges Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mission Badges</h2>
          <div className="text-sm text-gray-500">0/4 earned</div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                badge.unlocked
                  ? 'border-yellow-300 shadow-lg'
                  : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="text-center">
                <div className={`text-6xl mb-3 ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {badge.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

                {badge.unlocked ? (
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
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Identify Misinformation Patterns</div>
                <div className="text-sm text-gray-600">Recognize common tactics used to spread false information</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Verify Sources</div>
                <div className="text-sm text-gray-600">Learn techniques to fact-check and validate information sources</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Understand Information Spread</div>
                <div className="text-sm text-gray-600">Visualize how false narratives propagate through networks</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Collaborative Fact-Checking</div>
                <div className="text-sm text-gray-600">Work with teammates to verify content accuracy</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Critical Thinking Skills</div>
                <div className="text-sm text-gray-600">Develop analytical skills to question and evaluate content</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Community Protection</div>
                <div className="text-sm text-gray-600">Help protect your community from harmful misinformation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
