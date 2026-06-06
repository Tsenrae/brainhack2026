import { Flame, ArrowRight, Shield, Zap, CheckCircle, Target, ScanLine, Heart, MapPin, Users, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const recentScans = [
  { type: "WhatsApp Message", result: "Safe", time: "2 hours ago", confidence: 98 },
  { type: "QR Code", result: "Warning", time: "5 hours ago", confidence: 75 },
  { type: "Email Link", result: "Safe", time: "1 day ago", confidence: 95 }
];

const badges = [
  { icon: "🛡️", name: "First Defense", unlocked: true },
  { icon: "🎯", name: "Sharp Eye", unlocked: true },
  { icon: "⚡", name: "Quick Learner", unlocked: true },
  { icon: "🔥", name: "7-Day Streak", unlocked: true },
  { icon: "👁️", name: "Deepfake Hunter", unlocked: false },
  { icon: "🏆", name: "Top 10%", unlocked: false }
];

export function DashboardHome() {
  const { profile } = useAuth();

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  // current_level_xp and next_level_xp are absolute XP thresholds (floor of each level)
  const levelRange = profile ? profile.next_level_xp - profile.current_level_xp : 1;
  const progressPct = profile
    ? Math.min(100, Math.round(((profile.xp - profile.current_level_xp) / levelRange) * 100))
    : 0;
  const xpToNext = profile ? profile.next_level_xp - profile.xp : 0;

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
              <div className="text-2xl font-bold text-gray-900">{profile?.streak_days ?? 0}</div>
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
              <div className="text-2xl font-bold text-gray-900">{profile?.missions_completed ?? 0}</div>
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
          <Link to="/mission/digital-shield" className="bg-white rounded-2xl p-6 border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all cursor-pointer group block">
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
                <span className="font-bold text-gray-900">65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-center">
              Continue Mission
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
            <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-3">
            {recentScans.map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    scan.result === 'Safe' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {scan.result === 'Safe' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Shield className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{scan.type}</div>
                    <div className="text-xs text-gray-500">{scan.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    scan.result === 'Safe' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {scan.result}
                  </div>
                  <div className="text-xs text-gray-500">{scan.confidence}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Showcase */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Badges</h3>
            <span className="text-sm text-gray-500">4/6</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
                    : 'bg-gray-50 border border-gray-200 opacity-50'
                }`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="text-xs text-center font-medium text-gray-700 leading-tight">
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 text-sm text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors">
            View All Badges
          </button>
        </div>
      </div>
    </div>
  );
}
