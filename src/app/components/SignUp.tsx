import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import {
  Shield, Eye, EyeOff, ArrowRight, CheckCircle,
  Zap, User, Mail, Lock, GraduationCap, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { CreateProfilePayload } from '../context/AuthContext';

const AGE_GROUPS = ['13–15 (Secondary)', '16–18 (JC / Poly)', '19–25 (Young Adult)', '26+ (Adult)'] as const;
const SCHOOLS = [
  'Raffles Institution', 'Hwa Chong Institution', 'NUS High School',
  'Temasek Junior College', 'Anglo-Chinese School (Ind)', 'Dunman High School',
  'Victoria Junior College', 'Meridian Secondary School', 'Other / Not applicable',
];

const AVATAR_OPTIONS: Array<{ color: CreateProfilePayload['avatar_color']; gradient: string }> = [
  { color: 'red',    gradient: 'from-red-500 to-orange-500' },
  { color: 'purple', gradient: 'from-purple-500 to-violet-600' },
  { color: 'blue',   gradient: 'from-blue-500 to-cyan-500' },
  { color: 'green',  gradient: 'from-green-500 to-emerald-500' },
  { color: 'pink',   gradient: 'from-pink-500 to-rose-500' },
];

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter',       test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number',                 test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character',      test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

type Step = 1 | 2 | 3;

export function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, createProfile, user } = useAuth();

  // When arriving from Google OAuth (?complete=1), skip account step
  const isOAuthComplete = searchParams.get('complete') === '1';
  const [step, setStep] = useState<Step>(isOAuthComplete ? 2 : 1);

  // Step 1 — account details
  const [name, setName]           = useState(user?.user_metadata?.full_name ?? '');
  const [email, setEmail]         = useState(user?.email ?? '');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2 — profile details
  const [ageGroup, setAgeGroup]   = useState('');
  const [school, setSchool]       = useState('');
  const [username, setUsername]   = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);

  // Step 3 — consent
  const [agreeTerms, setAgreeTerms]         = useState(false);
  const [agreePrivacy, setAgreePrivacy]     = useState(false);
  const [subscribeUpdates, setSubscribeUpdates] = useState(true);

  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const pwRules    = PASSWORD_RULES.map(r => ({ ...r, ok: r.test(password) }));
  const pwStrength = pwRules.filter(r => r.ok).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'][pwStrength];

  function validateStep1() {
    if (!name.trim())           return 'Please enter your name.';
    if (!email.includes('@'))   return 'Please enter a valid email.';
    if (pwStrength < 2)         return 'Please choose a stronger password.';
    if (password !== confirm)   return 'Passwords do not match.';
    return '';
  }

  function validateStep2() {
    if (!ageGroup)              return 'Please select your age group.';
    if (!username.trim())       return 'Please choose a username.';
    return '';
  }

  function handleNext() {
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : '';
    if (err) { setError(err); return; }
    setError('');
    setStep(s => (s + 1) as Step);
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();

    if (step < 3) { handleNext(); return; }

    if (!agreeTerms || !agreePrivacy) {
      setError('Please accept the Terms and Privacy Policy.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      let accessToken: string | undefined;

      if (!isOAuthComplete) {
        const { session } = await signUp(email, password);
        if (!session) {
          // Email confirmation is enabled — account created, no session yet.
          // User must confirm their email before we can create the profile.
          setConfirmationSent(true);
          setLoading(false);
          return;
        }
        accessToken = session.access_token;
      }

      const payload: CreateProfilePayload = {
        full_name:         name,
        username,
        age_group:         ageGroup,
        school:            school || undefined,
        avatar_color:      AVATAR_OPTIONS[selectedAvatar].color,
        subscribe_updates: subscribeUpdates,
      };
      await createProfile(payload, accessToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = isOAuthComplete
    ? ['Profile', 'Confirm']
    : ['Account', 'Profile', 'Confirm'];

  const displayStep = isOAuthComplete ? step - 1 : step;

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[
            { size: 300, right: -60, top: -60, opacity: 0.07 },
            { size: 180, right: 100, bottom: 80, opacity: 0.06 },
          ].map((s, i) => (
            <Shield key={i} className="absolute text-white"
              style={{ width: s.size, height: s.size, right: s.right, top: s.top, bottom: (s as any).bottom, opacity: s.opacity }} />
          ))}
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl leading-none">ShieldVerse</p>
            <p className="text-white/60 text-xs">Smart Nation SG</p>
          </div>
        </div>

        <div className="relative space-y-7">
          <div>
            <h1 className="text-white text-4xl font-black leading-tight mb-3">
              Join 82,400<br />Digital Defenders
            </h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Create your free account and start earning XP by detecting scams, deepfakes, and online harms across Singapore.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">What you'll get</p>
            {[
              { icon: '🎓', title: 'Scenario Academy',  desc: 'AI video training missions' },
              { icon: '🏆', title: 'XP & Badges',       desc: 'Earn rewards for every mission' },
              { icon: '🛡️', title: 'Shield Scanner',    desc: 'Real-time threat detection tool' },
              { icon: '👥', title: 'Shield Squad',       desc: 'Team up with other defenders' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
                <span className="text-lg">{icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-white/60 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
            <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0" />
            <p className="text-white/80 text-sm">
              <span className="font-bold text-white">+100 XP</span> welcome bonus on sign-up
            </p>
          </div>
        </div>

        <p className="relative text-white/40 text-xs">Free forever · No credit card required</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <p className="font-black text-gray-900">ShieldVerse</p>
          </div>

          {confirmationSent && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-gray-900 font-black text-2xl mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-6">
                We sent a confirmation link to <span className="font-semibold text-gray-800">{email}</span>.
                Click it to activate your account, then sign in to complete your profile.
              </p>
              <p className="text-xs text-gray-400 mb-5">Didn't receive it? Check your spam folder.</p>
              <a href="/signin" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all text-sm">
                <Shield className="w-4 h-4" /> Go to Sign In
              </a>
            </div>
          )}

          {!confirmationSent && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-7">
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const done   = displayStep > n;
                const active = displayStep === n;
                return (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      done   ? 'bg-green-500 text-white' :
                      active ? 'bg-red-600 text-white'   :
                               'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : n}
                    </div>
                    <span className={`text-xs font-semibold ${active ? 'text-gray-900' : done ? 'text-green-600' : 'text-gray-400'}`}>
                      {label}
                    </span>
                    {i < stepLabels.length - 1 && (
                      <div className={`flex-1 h-0.5 rounded-full ml-1 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mb-6">
              <h2 className="text-gray-900 font-black text-2xl mb-1">
                {step === 1 ? 'Create your account' : step === 2 ? 'Build your profile' : 'Almost there!'}
              </h2>
              <p className="text-gray-500 text-sm">
                {step === 1 ? 'Enter your details to get started' :
                 step === 2 ? 'Personalise your ShieldVerse experience' :
                              'Review and confirm your registration'}
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Step 1: Account ── */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 flex-1">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColor : 'bg-gray-200'}`} />
                            ))}
                          </div>
                          <span className={`text-xs font-semibold ${pwStrength === 4 ? 'text-green-600' : pwStrength >= 2 ? 'text-amber-600' : 'text-red-500'}`}>
                            {strengthLabel}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {pwRules.map(r => (
                            <div key={r.label} className={`flex items-center gap-1.5 text-xs ${r.ok ? 'text-green-600' : 'text-gray-400'}`}>
                              {r.ok ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                              {r.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                        placeholder="Re-enter your password"
                        className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                          confirm && confirm !== password ? 'border-red-300 focus:ring-red-400' :
                          confirm && confirm === password ? 'border-green-300 focus:ring-green-400' :
                                                           'border-gray-200 focus:ring-red-500'
                        }`} />
                      <button type="button" onClick={() => setShowConfirm(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirm && confirm === password && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />Passwords match
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* ── Step 2: Profile ── */}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                      <input value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
                        placeholder="johndoe_sg"
                        className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Shown on leaderboards and your profile</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age Group</label>
                    <div className="grid grid-cols-2 gap-2">
                      {AGE_GROUPS.map(ag => (
                        <button key={ag} type="button" onClick={() => setAgeGroup(ag)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-left ${
                            ageGroup === ag
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-red-300'
                          }`}>
                          {ag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      School / Institution <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select value={school} onChange={e => setSchool(e.target.value)}
                        className="w-full appearance-none border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white">
                        <option value="">Select your school</option>
                        {SCHOOLS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Contributes to your school's leaderboard ranking</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Choose Avatar</label>
                    <div className="flex gap-2">
                      {AVATAR_OPTIONS.map((av, i) => (
                        <button key={i} type="button" onClick={() => setSelectedAvatar(i)}
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${av.gradient} flex items-center justify-center text-white font-bold text-sm transition-all ring-2 ring-offset-2 ${
                            selectedAvatar === i ? 'ring-red-600' : 'ring-transparent hover:ring-gray-300'
                          }`}>
                          {name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'JD'}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Step 3: Confirm ─��� */}
              {step === 3 && (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account Summary</p>
                    {[
                      { label: 'Name',       value: name },
                      { label: 'Email',      value: isOAuthComplete ? (user?.email ?? '') : email },
                      { label: 'Username',   value: `@${username}` },
                      { label: 'Age Group',  value: ageGroup },
                      { label: 'School',     value: school || 'Not specified' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-400">{label}</span>
                        <span className="font-semibold text-gray-800 text-right max-w-[55%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-orange-800 text-sm">Welcome Bonus: +100 XP</p>
                      <p className="text-orange-600 text-xs">Awarded instantly on your first login</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {[
                      { state: agreeTerms,        set: setAgreeTerms,        label: <>I agree to the <a href="#" className="text-red-600 font-semibold underline">Terms of Service</a></>,     required: true },
                      { state: agreePrivacy,       set: setAgreePrivacy,      label: <>I have read the <a href="#" className="text-red-600 font-semibold underline">Privacy Policy</a></>,      required: true },
                      { state: subscribeUpdates,   set: setSubscribeUpdates,  label: 'Send me mission updates and platform news',                                                                required: false },
                    ].map(({ state, set, label, required }, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <button type="button" onClick={() => set(s => !s)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            state ? 'bg-red-600 border-red-600' : 'border-gray-300 hover:border-red-400'
                          }`}>
                          {state && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </button>
                        <span className="text-sm text-gray-600 leading-snug">
                          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-2">
                {step > 1 && !isOAuthComplete && (
                  <button type="button" onClick={() => { setStep(s => (s - 1) as Step); setError(''); }}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Back
                  </button>
                )}
                <button type="submit" disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-70 text-sm">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : step === 3 ? (
                    <><Shield className="w-4 h-4" /> Create Account</>
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/signin" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            Free forever · No credit card required · Made for Singapore ��🇬
          </p>
        </div>
      </div>
    </div>
  );
}
