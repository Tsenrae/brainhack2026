import { Trophy, Zap, Flame, TrendingUp } from 'lucide-react';

export function GamificationSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Level Up Your Digital Defense
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Earn rewards, compete with friends, and track your progress
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-yellow-700">Total XP</div>
                <div className="text-2xl font-bold text-yellow-900">2,450</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-yellow-700">Level 8</span>
                <span className="text-yellow-700">550 to Level 9</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-purple-700">Badges</div>
                <div className="text-2xl font-bold text-purple-900">12</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-purple-300 rounded-lg flex items-center justify-center text-lg">🛡️</div>
              <div className="w-10 h-10 bg-purple-300 rounded-lg flex items-center justify-center text-lg">🎯</div>
              <div className="w-10 h-10 bg-purple-300 rounded-lg flex items-center justify-center text-lg">⭐</div>
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center text-xs text-purple-600">+9</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-red-700">Streak</div>
                <div className="text-2xl font-bold text-red-900">7 days</div>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex-1 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-green-700">Rank</div>
                <div className="text-2xl font-bold text-green-900">#42</div>
              </div>
            </div>
            <div className="text-sm text-green-700">
              Top 5% in Singapore
            </div>
            <div className="mt-2 text-xs text-green-600">
              ↑ 8 positions this week
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Weekly Challenge</h3>
              <p className="text-red-100">Complete 5 missions to unlock the "Guardian Elite" badge</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">3/5</div>
              <div className="text-sm text-red-100">Missions Complete</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
