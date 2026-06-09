import { Home, BookOpen, Scan, HeadphonesIcon, Users, User, Shield, Zap, Bell, ArrowLeft, Trophy, BarChart2, Film, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

const AVATAR_GRADIENTS: Record<string, string> = {
  red: 'from-red-500 to-orange-500',
  purple: 'from-purple-500 to-pink-500',
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  pink: 'from-pink-500 to-rose-500',
};

export function Sidebar() {
  const { pathname } = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Scan, label: 'Scan', path: '/scanner' },
    { icon: HeadphonesIcon, label: 'Support', path: '/support/cyberbullying' },
    { icon: MessageCircle, label: 'Telegram Bot', path: '/integrations/telegram' },
    { icon: Users, label: 'Community', path: '/community/submit' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Users, label: 'Squads', path: '/squads' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: Film, label: 'Video Studio', path: '/admin/video-studio' }
  ];

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';
  const gradient = AVATAR_GRADIENTS[profile?.avatar_color ?? 'red'];
  // current_level_xp and next_level_xp are absolute XP thresholds (floor of each level)
  const levelRange = profile ? profile.next_level_xp - profile.current_level_xp : 1;
  const progressPct = profile
    ? Math.min(100, Math.round(((profile.xp - profile.current_level_xp) / levelRange) * 100))
    : 0;
  const xpToNext = profile ? profile.next_level_xp - profile.xp : 0;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-red-600 w-10 h-10 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-gray-900">ShieldVerse</div>
            <div className="text-xs text-gray-500">Smart Nation SG</div>
          </div>
          <ArrowLeft className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* XP Progress */}
      <div className="p-6 border-b border-gray-200">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-900">
                Level {profile?.level ?? '—'}
              </span>
            </div>
            <span className="text-sm font-bold text-red-600">
              {(profile?.xp ?? 0).toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-red-100 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {xpToNext.toLocaleString()} XP to Level {(profile?.level ?? 0) + 1}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-bold`}>
            {initials}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{profile?.full_name ?? '...'}</div>
            <div className="text-xs text-gray-500">{profile?.level_title ?? '...'}</div>
          </div>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
