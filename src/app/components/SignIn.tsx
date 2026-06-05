import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Shield, Eye, EyeOff, Zap, Trophy, Target, ArrowRight, CheckCircle } from 'lucide-react';

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1200);
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background shield pattern */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { size: 320, right: -80, top: -80, opacity: 0.07 },
            { size: 200, right: 120, bottom: 60, opacity: 0.06 },
            { size: 120, left: 40, top: '40%', opacity: 0.05 },
          ].map((s, i) => (
            <Shield key={i} className="absolute text-white"
              style={{ width: s.size, height: s.size, right: s.right, top: s.top, bottom: (s as any).bottom, left: s.left, opacity: s.opacity }} />
          ))}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl leading-none">ShieldVerse</p>
            <p className="text-white/60 text-xs">Smart Nation SG</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative space-y-6">
          <div>
            <h1 className="text-white text-4xl font-black leading-tight mb-4">
              Defend Singapore's<br />Digital Future
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Learn to detect scams, deepfakes, and misinformation through AI-powered scenario training. Earn XP, unlock badges, and protect your community.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Zap, value: '82,400', label: 'Active Users' },
              { icon: Trophy, value: '1.24M', label: 'Missions Done' },
              { icon: Target, value: '84%', label: 'Avg Accuracy' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
                <Icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
                <p className="text-white font-black text-lg leading-none">{value}</p>
                <p className="text-white/60 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Feature bullets */}
          <div className="space-y-2">
            {[
              'AI-generated scenario training videos',
              'Gamified XP, badges & leaderboards',
              'Real-time threat detection scanner',
              'Shield Squad team challenges',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">© 2026 ShieldVerse SG · A Smart Nation Initiative</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900">ShieldVerse</p>
              <p className="text-gray-400 text-xs">Smart Nation SG</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <div className="mb-7">
              <h2 className="text-gray-900 font-black text-2xl mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm">Sign in to continue your training mission</p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">Password</label>
                  <a href="#" className="text-xs text-red-600 hover:text-red-700 font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setRemember(r => !r)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    remember ? 'bg-red-600 border-red-600' : 'border-gray-300 hover:border-red-400'
                  }`}
                >
                  {remember && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </button>
                <span className="text-sm text-gray-600">Remember me for 30 days</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or continue with</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Google',
                  logo: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  label: 'Singpass',
                  logo: <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs font-black leading-none">S</div>,
                },
              ].map(({ label, logo }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  {logo}
                  {label}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in you agree to our{' '}
            <a href="#" className="underline hover:text-gray-600">Terms</a> and{' '}
            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
