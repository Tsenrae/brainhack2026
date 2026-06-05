import { Bell, Search, Settings, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';

export function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search missions, achievements..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Telegram Bot */}
        <Link
          to="/integrations/telegram"
          className="relative p-2 hover:bg-blue-50 rounded-xl transition-colors group"
          title="Telegram Bot Integration"
        >
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <Settings className="w-5 h-5 text-gray-700" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">Level 8 • Guardian</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer ring-2 ring-red-100">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
