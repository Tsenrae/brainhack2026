import { Home, BookOpen, Scan, HeadphonesIcon, Users, User, Shield, Zap, Bell, ArrowLeft, Trophy, BarChart2, Film } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function Sidebar() {
  const { pathname } = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Scan, label: 'Scan', path: '/scanner' },
    { icon: HeadphonesIcon, label: 'Support', path: '/support/cyberbullying' },
    { icon: Users, label: 'Community', path: '/community/submit' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: Film, label: 'Video Studio', path: '/admin/video-studio' }
  ];

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
              <span className="text-sm font-medium text-gray-900">Level 8</span>
            </div>
            <span className="text-sm font-bold text-red-600">2,450 XP</span>
          </div>
          <div className="w-full bg-red-100 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="text-xs text-gray-600">550 XP to Level 9</div>
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
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">Guardian Elite</div>
          </div>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
