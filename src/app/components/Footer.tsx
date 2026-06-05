import { Shield, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-red-600 to-red-700 w-10 h-10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-xl text-white">ShieldVerse SG</div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering Singapore's youth with digital literacy and protection against online harms.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Missions</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Shield Scanner</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Safety Guide</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Report a Scam</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <a href="mailto:hello@shieldverse.sg" className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors">
              <Mail className="w-4 h-4" />
              <span>hello@shieldverse.sg</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2026 ShieldVerse SG. A Smart Nation Initiative. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-400 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
