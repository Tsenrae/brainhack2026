import { Trophy, Target, Shield, Users, Link as LinkIcon, RotateCcw, Flag, ArrowRight, Zap, TrendingUp, Award, Star, Crown, Flame } from 'lucide-react';
import { Link } from 'react-router';

export function MissionComplete() {
  const badges = [
    { name: 'Spin Spotter', icon: '🎯', unlocked: true, description: 'Classified 10 posts correctly' },
    { name: 'Ripple Breaker', icon: '🌊', unlocked: true, description: 'Stopped misinformation chain' },
    { name: 'Truth Guardian', icon: '🛡️', unlocked: true, description: 'Verified 5 fact-checks' },
    { name: 'Squad Strategist', icon: '🤝', unlocked: true, description: 'Achieved squad consensus' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        {/* Celebration Header */}
        <div className="text-center mb-12 space-y-6">
          {/* Trophy Icon with Glow */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/50">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Mission Complete Title */}
          <div className="space-y-2">
            <div className="text-sm font-bold text-red-400 tracking-wider uppercase">Mission Complete</div>
            <h1 className="text-5xl font-black text-white mb-2">Digital Shield Mastered!</h1>
            <p className="text-xl text-gray-300">You've leveled up your digital literacy skills</p>
          </div>

          {/* XP Gained - Large Display */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl px-12 py-6 border-2 border-red-400/30">
              <div className="flex items-center gap-4">
                <Zap className="w-12 h-12 text-yellow-300" />
                <div className="text-left">
                  <div className="text-sm font-medium text-red-100">Total XP Gained</div>
                  <div className="text-5xl font-black text-white">+1,250 XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Final Score */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-red-400/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-300">Final Score</div>
            </div>
            <div className="text-3xl font-black text-white">2,450</div>
            <div className="text-xs text-green-400 mt-1">+850 from start</div>
          </div>

          {/* Accuracy Rate */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-red-400/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-300">Accuracy</div>
            </div>
            <div className="text-3xl font-black text-white">94%</div>
            <div className="text-xs text-green-400 mt-1">Excellent performance</div>
          </div>

          {/* Misinformation Prevented */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-red-400/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-300">Chains Broken</div>
            </div>
            <div className="text-3xl font-black text-white">12</div>
            <div className="text-xs text-red-400 mt-1">1.4M people protected</div>
          </div>

          {/* Squad Contribution */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-red-400/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-300">Squad Score</div>
            </div>
            <div className="text-3xl font-black text-white">12,450</div>
            <div className="text-xs text-purple-400 mt-1">Top 5% contribution</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Badges Unlocked */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-black text-white">Badges Unlocked</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={badge.name}
                    className="relative group"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>

                    {/* Badge Card */}
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-5 border-2 border-yellow-400/30 group-hover:border-yellow-400/60 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl group-hover:scale-110 transition-transform">
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-lg">{badge.name}</h3>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          </div>
                          <p className="text-sm text-gray-300">{badge.description}</p>
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-green-300">Unlocked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Badges Count */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Badges Earned</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white">4 / 4</span>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Position */}
          <div className="space-y-6">
            {/* Your Rank */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400/30">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-black text-white">Your Rank</h3>
              </div>

              <div className="text-center mb-6">
                <div className="text-6xl font-black text-white mb-2">#8</div>
                <div className="text-sm text-yellow-300">Out of 2,847 players</div>
              </div>

              <div className="space-y-3 pt-4 border-t border-yellow-400/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Points to #7</span>
                  <span className="font-bold text-white">125 XP</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Top 1% Threshold</span>
                  <span className="font-bold text-white">450 XP</span>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-black text-white">Performance</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Spot the Spin</span>
                    <span className="font-bold text-green-400">90%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Chain Reaction</span>
                    <span className="font-bold text-blue-400">95%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Shield Squad</span>
                    <span className="font-bold text-purple-400">98%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/mission/cyber-warriors"
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl p-6 border-2 border-red-400/30 hover:border-red-400/60 transition-all text-center"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <div className="relative">
              <ArrowRight className="w-8 h-8 text-white mx-auto mb-3" />
              <div className="font-bold text-white text-lg mb-1">Next Mission</div>
              <div className="text-sm text-red-100">Cyber Warriors</div>
            </div>
          </Link>

          <button className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl p-6 border-2 border-white/20 hover:border-purple-400/60 transition-all text-center">
            <div className="absolute inset-0 bg-purple-500/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <div className="relative">
              <LinkIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="font-bold text-white text-lg mb-1">Challenge Friends</div>
              <div className="text-sm text-gray-300">Share your score</div>
            </div>
          </button>

          <Link
            to="/mission/digital-shield/review"
            className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl p-6 border-2 border-white/20 hover:border-blue-400/60 transition-all text-center"
          >
            <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <div className="relative">
              <RotateCcw className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="font-bold text-white text-lg mb-1">Review Mistakes</div>
              <div className="text-sm text-gray-300">Learn from errors</div>
            </div>
          </Link>

          <button className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl p-6 border-2 border-white/20 hover:border-yellow-400/60 transition-all text-center">
            <div className="absolute inset-0 bg-yellow-500/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <div className="relative">
              <Flag className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="font-bold text-white text-lg mb-1">Submit Content</div>
              <div className="text-sm text-gray-300">Report suspicious</div>
            </div>
          </button>
        </div>

        {/* Impact Summary */}
        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-400/30">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Your Impact on Singapore</h2>
            <p className="text-gray-300">By completing this mission, you've helped make our digital space safer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">1.4M</div>
              <div className="text-sm text-gray-300">People Protected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">12</div>
              <div className="text-sm text-gray-300">Chains Broken</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">98%</div>
              <div className="text-sm text-gray-300">Squad Consensus</div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
