import { TrendingUp, Users, Shield, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CommunityScoreSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-sm">Singapore's Digital Resilience</span>
            </div>

            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Community Defense Score
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Together, we're building Singapore's collective digital literacy. Every mission you complete strengthens our national defense.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-300">National Score</span>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                78.5
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 mb-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-400 h-4 rounded-full" style={{ width: '78.5%' }}></div>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+2.3 points this month</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-xs text-gray-400">Active Guardians</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-xs text-gray-400">Threats Blocked</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756798987926-67f510690d34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Singapore cityscape"
                className="w-full rounded-2xl"
              />
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-bold">Regional Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { region: 'Central', score: 82, color: 'bg-green-500' },
                    { region: 'East', score: 78, color: 'bg-blue-500' },
                    { region: 'North', score: 75, color: 'bg-yellow-500' },
                    { region: 'West', score: 80, color: 'bg-purple-500' },
                    { region: 'South', score: 77, color: 'bg-pink-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-gray-300 w-16">{item.region}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.score}%` }}></div>
                      </div>
                      <span className="text-sm font-bold w-8">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
