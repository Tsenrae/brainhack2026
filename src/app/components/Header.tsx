import { Shield, Menu } from 'lucide-react';
import { Link } from 'react-router';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-600 to-red-700 w-10 h-10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-gray-900">ShieldVerse SG</div>
              <div className="text-xs text-gray-500">Smart Nation Initiative</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#missions" className="text-gray-700 hover:text-red-600 transition-colors">Missions</a>
            <a href="#features" className="text-gray-700 hover:text-red-600 transition-colors">Features</a>
            <a href="#community" className="text-gray-700 hover:text-red-600 transition-colors">Community</a>
            <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/signin" className="hidden md:block text-gray-700 hover:text-red-600 font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium">
              Get Started
            </Link>
            <button className="md:hidden text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
