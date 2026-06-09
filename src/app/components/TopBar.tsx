import { useState } from 'react';
import { Bell, Search, Settings, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const AVATAR_GRADIENTS: Record<string, string> = {
  red: 'from-red-500 to-orange-500',
  purple: 'from-purple-500 to-pink-500',
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  pink: 'from-pink-500 to-rose-500',
};

const SEARCH_ITEMS = [
  { label: 'Dashboard', description: 'Home overview and mission progress', path: '/dashboard', keywords: ['home', 'dashboard', 'overview'] },
  { label: 'Digital Shield', description: 'Mission hub for misinformation defense', path: '/mission/digital-shield', keywords: ['mission', 'digital shield', 'learn'] },
  { label: 'Spot the Spin', description: 'Module 1 quiz mission', path: '/mission/digital-shield/spot-the-spin', keywords: ['spot the spin', 'quiz', 'module 1'] },
  { label: 'Chain Reaction', description: 'Module 2 mission', path: '/mission/digital-shield/chain-reaction', keywords: ['chain reaction', 'module 2'] },
  { label: 'Shield Squad', description: 'Module 3 squad mission', path: '/mission/digital-shield/shield-squad', keywords: ['shield squad', 'module 3', 'squad mission'] },
  { label: 'Shield Scanner', description: 'Scan messages, links, and QR codes', path: '/scanner', keywords: ['scanner', 'scan', 'qr', 'url'] },
  { label: 'Community Reports', description: 'Submit suspicious content', path: '/community/submit', keywords: ['community', 'report', 'submit'] },
  { label: 'Cyberbullying Support', description: 'Get support and resources', path: '/support/cyberbullying', keywords: ['support', 'cyberbullying', 'help'] },
  { label: 'Leaderboard', description: 'See player and squad rankings', path: '/leaderboard', keywords: ['leaderboard', 'rankings', 'ranking'] },
  { label: 'Squads', description: 'Manage your squad', path: '/squads', keywords: ['squad', 'team', 'members'] },
  { label: 'Profile', description: 'View profile, badges, and mission history', path: '/profile', keywords: ['profile', 'achievements', 'badges', 'history'] },
  { label: 'Scenario Academy', description: 'Training and learn scenarios', path: '/learn', keywords: ['learn', 'academy', 'training'] },
  { label: 'Guardian Heatmap', description: 'Community threat map', path: '/heatmap', keywords: ['heatmap', 'map', 'guardian'] },
  { label: 'Telegram Bot', description: 'Telegram integration', path: '/integrations/telegram', keywords: ['telegram', 'bot', 'integration'] },
  { label: 'Analytics', description: 'Admin analytics dashboard', path: '/admin/analytics', keywords: ['analytics', 'admin'] },
  { label: 'Video Studio', description: 'Admin video studio tools', path: '/admin/video-studio', keywords: ['video', 'studio', 'admin'] },
];

export function TopBar() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';
  const gradient = AVATAR_GRADIENTS[profile?.avatar_color ?? 'red'];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? SEARCH_ITEMS.filter((item) => {
        const haystack = `${item.label} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      }).slice(0, 6)
    : [];

  async function handleSignOut() {
    await signOut();
    navigate('/signin');
  }

  function goToSearchResult(path: string) {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(path);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchResults.length > 0) {
      goToSearchResult(searchResults[0].path);
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div
          className="relative"
          onBlur={() => {
            window.setTimeout(() => setIsSearchOpen(false), 120);
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search missions, achievements..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </form>

          {isSearchOpen && normalizedQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onMouseDown={() => goToSearchResult(item.path)}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500">
                  No matching pages found.
                </div>
              )}
            </div>
          )}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-2xl border-gray-200 p-2">
            <DropdownMenuLabel className="px-3 py-2 text-gray-900">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-3 py-6 text-center text-sm text-gray-500">
              No notifications yet.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <button
          type="button"
          className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-700" />
        </button>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 pl-4 border-l border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{profile?.full_name ?? '...'}</div>
                <div className="text-xs text-gray-500">
                  Level {profile?.level ?? '—'} • {profile?.level_title ?? '...'}
                </div>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-bold ring-2 ring-red-100`}>
                {initials}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl border-gray-200 p-2">
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-gray-50" onSelect={() => navigate('/profile')}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700" onSelect={() => void handleSignOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
