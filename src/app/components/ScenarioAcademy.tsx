import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, Volume2, Subtitles, Maximize2,
  ChevronRight, ChevronLeft, Zap, Trophy, Target, Clock,
  Shield, Star, Lock, CheckCircle, XCircle, Lightbulb,
  AlertTriangle, ArrowRight, Eye, MessageSquare, Newspaper,
  Heart, QrCode, Award, Flag, Sparkles, RotateCcw,
  BookOpen, TrendingUp, Info, Layers,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'hub' | 'video' | 'checkpoint' | 'feedback' | 'complete';
type QuestionType = 'mcq' | 'redflag' | 'whatnext' | 'confidence';
type Category = 'Deepfakes' | 'Scam Chats' | 'Fake News' | 'Cyberbullying' | 'QR Scams';

interface RedFlagWord { id: string; text: string; isFlag: boolean; }
interface CheckpointQuestion {
  id: number;
  at: number; // % through video
  type: QuestionType;
  prompt: string;
  subtext?: string;
  options?: string[];
  correctIndex?: number;
  redFlagText?: RedFlagWord[][];
  correctFlags?: string[];
  whatNextOptions?: { text: string; safe: boolean; explanation: string }[];
  confidenceLabel?: string;
  xpValue: number;
  explanation: string;
  tactics: string[];
  actions: string[];
}

interface Scenario {
  id: string;
  category: Category;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  duration: string;
  badge: string;
  badgeIcon: React.ElementType;
  color: string;
  bgGrad: string;
  iconBg: string;
  locked: boolean;
  checkpoints: CheckpointQuestion[];
  sceneLines: string[];  // simulated subtitle lines
}

// ── Scenario Data ─────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: 'deepfake-storm',
    category: 'Deepfakes',
    title: 'Operation: Face Swap',
    description: 'A viral video of a government official announcing emergency fund transfers is spreading fast. Analyse the footage and expose the AI manipulation before panic spreads.',
    difficulty: 'Hard',
    xpReward: 450,
    duration: '9 min',
    badge: 'Deepfake Detective',
    badgeIcon: Eye,
    color: 'text-purple-600',
    bgGrad: 'from-purple-600 to-violet-700',
    iconBg: 'bg-purple-100',
    locked: false,
    sceneLines: [
      'Breaking: Minister Chen announces emergency relief fund…',
      'Citizens urged to transfer S$50 to claim S$2,000 rebate.',
      'Share immediately — offer expires in 24 hours!',
    ],
    checkpoints: [
      {
        id: 1, at: 30, type: 'mcq', xpValue: 100,
        prompt: 'At 0:42, the official\'s face flickers near the jawline. What does this indicate?',
        subtext: 'Review the facial movements carefully before selecting.',
        options: [
          'Poor video compression from the upload platform',
          'An AI deepfake model struggling with facial boundary rendering',
          'Natural lighting changes in the room',
          'The video was filmed using a low-quality camera',
        ],
        correctIndex: 1,
        explanation: 'AI video synthesis models often struggle at facial boundaries — especially the jawline, hairline, and ears — producing a telltale "shimmer" or warp artefact. This is one of the strongest indicators of a deepfake.',
        tactics: ['Facial boundary warping', 'Unnatural blinking rhythm', 'Mismatched audio lip-sync'],
        actions: ['Pause and zoom into the jawline/hairline area', 'Check if lip movement matches audio precisely', 'Use tools like Deepware Scanner or Microsoft Video Authenticator'],
      },
      {
        id: 2, at: 60, type: 'redflag', xpValue: 120,
        prompt: 'The message below appears on screen. Tap all the red flags you can identify.',
        subtext: 'Select every phrase that signals manipulation or urgency.',
        redFlagText: [
          [
            { id: 'a1', text: 'URGENT:', isFlag: true },
            { id: 'a2', text: ' Minister Chen has ', isFlag: false },
            { id: 'a3', text: 'personally approved', isFlag: false },
            { id: 'a4', text: ' a limited-time relief grant.', isFlag: false },
          ],
          [
            { id: 'b1', text: 'Transfer S$50 NOW', isFlag: true },
            { id: 'b2', text: ' to claim your ', isFlag: false },
            { id: 'b3', text: 'S$2,000 rebate', isFlag: false },
            { id: 'b4', text: '.', isFlag: false },
          ],
          [
            { id: 'c1', text: 'Offer expires in ', isFlag: false },
            { id: 'c2', text: '24 hours', isFlag: true },
            { id: 'c3', text: '. ', isFlag: false },
            { id: 'c4', text: 'Do NOT share with others', isFlag: true },
            { id: 'c5', text: ' — government policy.', isFlag: false },
          ],
        ],
        correctFlags: ['a1', 'b1', 'c2', 'c4'],
        explanation: 'Four classic manipulation triggers: (1) Urgency words like "URGENT" bypass rational thinking. (2) Upfront payment demands are always scam signals — governments never ask you to pay to receive benefits. (3) Artificial deadlines ("24 hours") create panic. (4) "Do not share" prevents victims from seeking a second opinion.',
        tactics: ['Artificial urgency', 'Upfront payment scam', 'Secrecy instruction', 'Authority spoofing'],
        actions: ['Never pay to receive government benefits', 'Verify via official gov.sg channels only', 'Report to ScamShield or call 1800-722-6688'],
      },
      {
        id: 3, at: 85, type: 'confidence', xpValue: 80,
        prompt: 'How confident are you that this video is AI-generated?',
        subtext: 'Rate your confidence based on all the evidence you\'ve gathered.',
        confidenceLabel: 'AI-Generated Deepfake',
        explanation: 'Based on: facial boundary artefacts (0:42), audio-lip desync throughout, impossible government messaging, and urgent payment demand — this video scores 9.4/10 on deepfake probability. The correct answer is: very confident it is fake.',
        tactics: ['Multi-signal manipulation', 'Authority impersonation', 'Emotional urgency engineering'],
        actions: ['Flag the video on the platform', 'Report to IMDA or the police', 'Share a debunk, not the original video'],
      },
    ],
  },
  {
    id: 'scam-chat',
    category: 'Scam Chats',
    title: 'The Parcel Trap',
    description: 'You receive WhatsApp messages claiming your parcel is held at customs. The messages escalate from friendly to threatening. Identify every manipulation tactic.',
    difficulty: 'Medium',
    xpReward: 300,
    duration: '7 min',
    badge: 'Scam Slayer',
    badgeIcon: Shield,
    color: 'text-red-600',
    bgGrad: 'from-red-600 to-rose-700',
    iconBg: 'bg-red-100',
    locked: false,
    sceneLines: [
      '"Your SingPost parcel #SG8821 is held at customs."',
      '"Please pay S$3.50 processing fee within 2 hours."',
      '"Failure to pay will result in legal action."',
    ],
    checkpoints: [
      {
        id: 1, at: 40, type: 'whatnext', xpValue: 110,
        prompt: 'You\'ve received this message. What do you do next?',
        subtext: 'Choose the safest course of action.',
        whatNextOptions: [
          { text: 'Click the link in the message to check the parcel status', safe: false, explanation: 'The link is a phishing page designed to steal your banking credentials. Never click unsolicited links.' },
          { text: 'Call the number provided in the message to verify', safe: false, explanation: 'The phone number connects to the scammer. Always find official numbers from gov.sg or the company\'s official website.' },
          { text: 'Go directly to singpost.com.sg and check your tracking number', safe: true, explanation: 'Correct! Always navigate directly to the official website. If your parcel tracking number doesn\'t exist there, the message is a scam.' },
          { text: 'Pay the S$3.50 fee — it\'s a small amount so it\'s probably fine', safe: false, explanation: 'The low fee is intentional — it lowers your guard. Once you enter payment details, scammers drain your account.' },
        ],
        explanation: 'Parcel scams use small, believable fees to get you to enter banking details. The real goal is credential harvesting, not S$3.50.',
        tactics: ['Low-stakes entry fee', 'Official brand impersonation', 'Legal threat escalation'],
        actions: ['Check parcels only on official websites', 'Never pay fees via unsolicited message links', 'Report to scamalert.sg'],
      },
      {
        id: 2, at: 75, type: 'mcq', xpValue: 100,
        prompt: 'The message now threatens "legal action within 2 hours." Why do scammers use this tactic?',
        options: [
          'Because the scammer has genuine legal authority in Singapore',
          'To trigger fear and bypass your rational thinking with urgency',
          'Because a 2-hour window is standard in Singapore customs law',
          'To give you enough time to verify the claim safely',
        ],
        correctIndex: 1,
        explanation: 'Fear + time pressure = panic. When you\'re panicking, you stop verifying facts. Scammers engineer this emotional state deliberately. Real government agencies always provide written notices with days to respond — never 2-hour ultimatums over WhatsApp.',
        tactics: ['Fear induction', 'Time pressure manipulation', 'Authority fabrication'],
        actions: ['Pause and breathe before acting', 'Real legal notices come by post, not WhatsApp', 'Call the actual agency using numbers from official websites'],
      },
    ],
  },
  {
    id: 'fake-news-wave',
    category: 'Fake News',
    title: 'The Viral Lie',
    description: 'A Facebook post with an alarming health scare goes viral across community groups. Trace the misinformation chain and spot the emotional manipulation techniques used.',
    difficulty: 'Medium',
    xpReward: 320,
    duration: '7 min',
    badge: 'Spin Spotter',
    badgeIcon: Newspaper,
    color: 'text-amber-600',
    bgGrad: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100',
    locked: false,
    sceneLines: [
      '"DOCTORS DON\'T WANT YOU TO KNOW THIS!"',
      '"Local hospital quietly confirms new outbreak — share before deleted!"',
      '"Forward to 10 groups to protect your family."',
    ],
    checkpoints: [
      {
        id: 1, at: 45, type: 'redflag', xpValue: 120,
        prompt: 'Identify every misinformation red flag in this headline and caption.',
        subtext: 'Tap all phrases that signal fake news.',
        redFlagText: [
          [
            { id: 'a1', text: 'DOCTORS DON\'T WANT YOU TO KNOW', isFlag: true },
            { id: 'a2', text: ' — ', isFlag: false },
            { id: 'a3', text: 'MIRACLE CURE', isFlag: true },
            { id: 'a4', text: ' found in Singapore!', isFlag: false },
          ],
          [
            { id: 'b1', text: 'Local hospital', isFlag: false },
            { id: 'b2', text: ' quietly confirms ', isFlag: true },
            { id: 'b3', text: 'new outbreak', isFlag: false },
            { id: 'b4', text: '. Share ', isFlag: false },
            { id: 'b5', text: 'before it gets deleted!', isFlag: true },
          ],
        ],
        correctFlags: ['a1', 'a3', 'b2', 'b5'],
        explanation: '"Doctors don\'t want you to know" is a classic anti-establishment trigger. "Miracle cure" is unscientific language. "Quietly confirms" implies a cover-up. "Before it gets deleted" creates false urgency and discourages fact-checking.',
        tactics: ['Anti-establishment framing', 'False scarcity', 'Suppression narrative', 'Urgency to share without reading'],
        actions: ['Check Factually.sg or Snopes before sharing', 'Look for named sources and publication dates', 'If a post says "share before deleted", it\'s almost always fake'],
      },
    ],
  },
  {
    id: 'cyberbully-escape',
    category: 'Cyberbullying',
    title: 'The Group Chat',
    description: 'A student is targeted in a class group chat. Screenshots are shared without consent and the bullying escalates into coordinated exclusion. How do you respond?',
    difficulty: 'Easy',
    xpReward: 240,
    duration: '6 min',
    badge: 'Kindness Champion',
    badgeIcon: Heart,
    color: 'text-pink-600',
    bgGrad: 'from-pink-500 to-rose-600',
    iconBg: 'bg-pink-100',
    locked: true,
    sceneLines: [
      'Group chat: "Did you see what she posted? 😂"',
      '14 members react with laughing emojis.',
      'The targeted student has not replied in 3 days.',
    ],
    checkpoints: [],
  },
  {
    id: 'qr-trap',
    category: 'QR Scams',
    title: 'Scan at Your Own Risk',
    description: 'A sticker over a legitimate parking QR code redirects victims to a fake payment page. Analyse the scene and determine whether to scan.',
    difficulty: 'Easy',
    xpReward: 200,
    duration: '5 min',
    badge: 'QR Guardian',
    badgeIcon: QrCode,
    color: 'text-blue-600',
    bgGrad: 'from-blue-600 to-cyan-600',
    iconBg: 'bg-blue-100',
    locked: true,
    sceneLines: [
      'Car park ticket machine is "under maintenance."',
      'A handwritten sign directs you to scan a QR code.',
      'The QR leads to: carpark-sg-payments.web.app',
    ],
    checkpoints: [],
  },
];

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORIES: { label: Category; icon: React.ElementType; color: string }[] = [
  { label: 'Deepfakes', icon: Eye, color: 'text-purple-600' },
  { label: 'Scam Chats', icon: MessageSquare, color: 'text-red-600' },
  { label: 'Fake News', icon: Newspaper, color: 'text-amber-600' },
  { label: 'Cyberbullying', icon: Heart, color: 'text-pink-600' },
  { label: 'QR Scams', icon: QrCode, color: 'text-blue-600' },
];

// ── Helper: Difficulty badge ──────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const styles = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Hard: 'bg-red-100 text-red-700 border-red-200',
  }[level];
  return (
    <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${styles}`}>{level}</span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ScenarioAcademy() {
  const [view, setView] = useState<View>('hub');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [checkpointIdx, setCheckpointIdx] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitleLine, setSubtitleLine] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedFlags, setSelectedFlags] = useState<Set<string>>(new Set());
  const [selectedWhatNext, setSelectedWhatNext] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerActive, setTimerActive] = useState(false);
  const [checkpointsCompleted, setCheckpointsCompleted] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Video simulation
  useEffect(() => {
    if (view === 'video' && isPlaying && scenario) {
      videoRef.current = setInterval(() => {
        setVideoProgress(prev => {
          const next = prev + 0.4;
          // Check checkpoints
          const nextCP = scenario.checkpoints.find(
            cp => !checkpointsCompleted.includes(cp.id) && next >= cp.at
          );
          if (nextCP) {
            setIsPlaying(false);
            clearInterval(videoRef.current!);
            setTimeout(() => {
              setView('checkpoint');
              setTimerActive(true);
              setTimeLeft(45);
              setShowHint(false);
              setSelectedAnswer(null);
              setSelectedFlags(new Set());
              setSelectedWhatNext(null);
            }, 400);
            return cp.at;
          }
          if (next >= 100) {
            clearInterval(videoRef.current!);
            setView('complete');
            return 100;
          }
          return next;
        });
        setSubtitleLine(prev => (scenario ? (prev + 1) % scenario.sceneLines.length : 0));
      }, 150);
    }
    return () => { if (videoRef.current) clearInterval(videoRef.current); };
  }, [isPlaying, view, scenario]);

  // Timer
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current!);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft]);

  const currentCP = scenario?.checkpoints[checkpointIdx] ?? null;

  function startScenario(s: Scenario) {
    setScenario(s);
    setVideoProgress(0);
    setCheckpointIdx(0);
    setCheckpointsCompleted([]);
    setScore(0);
    setXpEarned(0);
    setIsPlaying(false);
    setSubtitleLine(0);
    setView('video');
  }

  function submitAnswer() {
    if (!currentCP) return;
    let correct = false;
    if (currentCP.type === 'mcq') correct = selectedAnswer === currentCP.correctIndex;
    if (currentCP.type === 'redflag') {
      const flags = currentCP.correctFlags ?? [];
      correct = flags.every(f => selectedFlags.has(f)) && selectedFlags.size === flags.length;
    }
    if (currentCP.type === 'whatnext') correct = currentCP.whatNextOptions?.[selectedWhatNext!]?.safe ?? false;
    if (currentCP.type === 'confidence') correct = true; // always award for confidence

    const pts = correct ? currentCP.xpValue : Math.floor(currentCP.xpValue * 0.3);
    setScore(s => s + pts);
    setXpEarned(x => x + pts);
    setCheckpointsCompleted(c => [...c, currentCP.id]);
    setTimerActive(false);
    setView('feedback');
  }

  function continueAfterFeedback() {
    if (!scenario) return;
    const nextIdx = checkpointIdx + 1;
    if (nextIdx >= scenario.checkpoints.length) {
      // Advance video to end
      setVideoProgress(100);
      setView('complete');
    } else {
      setCheckpointIdx(nextIdx);
      setView('video');
      setTimeout(() => setIsPlaying(true), 300);
    }
  }

  function reset() {
    setView('hub');
    setScenario(null);
    setCheckpointIdx(0);
    setVideoProgress(0);
    setScore(0);
    setXpEarned(0);
  }

  const filtered = activeCategory === 'All'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.category === activeCategory);

  // ── HUB ────────────────────────────────────────────────────────────────────

  if (view === 'hub') return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-gray-900">Scenario Academy</h1>
          </div>
          <p className="text-gray-500 text-sm">AI-generated threat scenarios · Learn by doing · Earn XP & badges</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center shadow-sm">
            <div className="text-red-600 font-black text-lg">2,450</div>
            <div className="text-gray-400 text-xs">Total XP</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center shadow-sm">
            <div className="text-gray-900 font-black text-lg">5/8</div>
            <div className="text-gray-400 text-xs">Badges</div>
          </div>
        </div>
      </div>

      {/* Progress banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="font-semibold text-sm">Continue where you left off</span>
            </div>
            <p className="font-bold text-lg">Operation: Face Swap</p>
            <p className="text-white/70 text-sm">Deepfake Detection · Checkpoint 2 of 3 reached</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-xs text-white/70">60% complete</span>
            </div>
          </div>
          <button
            onClick={() => startScenario(SCENARIOS[0])}
            className="flex items-center gap-2 bg-white text-red-600 font-bold px-5 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-sm flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-red-600" />
            Resume Mission
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['All', ...CATEGORIES.map(c => c.label)] as (Category | 'All')[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'
            }`}
          >
            {cat !== 'All' && (() => {
              const C = CATEGORIES.find(c => c.label === cat)!;
              return <C.icon className="w-3.5 h-3.5" />;
            })()}
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div
            key={s.id}
            className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group ${s.locked ? 'opacity-70' : ''}`}
          >
            {/* Card top */}
            <div className={`bg-gradient-to-br ${s.bgGrad} p-5 relative overflow-hidden`}>
              <div className="absolute right-3 top-3 opacity-15">
                <s.badgeIcon className="w-16 h-16 text-white" />
              </div>
              {s.locked && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur border border-white/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-white text-sm font-semibold">
                    <Lock className="w-4 h-4" /> Complete previous mission to unlock
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-white/20 rounded-lg px-2 py-0.5 text-white text-xs font-medium flex items-center gap-1">
                  {(() => { const C = CATEGORIES.find(c => c.label === s.category)!; return <C.icon className="w-3 h-3" />; })()}
                  {s.category}
                </div>
                <DifficultyBadge level={s.difficulty} />
              </div>
              <h3 className="text-white font-bold text-lg leading-tight mb-1">{s.title}</h3>
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration}</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-300" />{s.xpReward} XP</span>
                <span className="flex items-center gap-1"><Award className="w-3 h-3" />{s.badge}</span>
              </div>
            </div>
            {/* Card body */}
            <div className="p-4">
              <p className="text-gray-500 text-xs leading-relaxed mb-4">{s.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Array.from({ length: s.checkpoints.length || 2 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-200" />
                  ))}
                  {s.checkpoints.length === 0 && <span className="text-xs text-gray-400">Checkpoints TBA</span>}
                </div>
                <button
                  disabled={s.locked}
                  onClick={() => !s.locked && startScenario(s)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    s.locked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${s.bgGrad} text-white shadow-sm hover:shadow-md group-hover:scale-[1.02]`
                  }`}
                >
                  {s.locked ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  {s.locked ? 'Locked' : 'Start Mission'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── VIDEO PLAYER ────────────────────────────────────────────────────────────

  if (view === 'video' && scenario) {
    const progressPct = videoProgress;
    const currentSubtitle = scenario.sceneLines[subtitleLine % scenario.sceneLines.length];

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={reset} className="hover:text-red-600 transition-colors">Scenario Academy</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{scenario.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Video + controls */}
          <div className="lg:col-span-2 space-y-3">
            {/* Video area */}
            <div className="relative bg-gray-950 rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '16/9' }}>
              {/* Simulated cinematic scene */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
                {/* Scan lines aesthetic */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)' }} />
                {/* Simulated scene content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/50">
                      <scenario.badgeIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-white/40 text-xs uppercase tracking-widest mb-2 font-mono">AI-GENERATED SCENARIO · {scenario.category.toUpperCase()}</div>
                    <div className="text-white font-bold text-xl">{scenario.title}</div>
                    {!isPlaying && progressPct === 0 && (
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="mt-6 flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all mx-auto backdrop-blur"
                      >
                        <Play className="w-5 h-5 fill-white" /> Begin Scenario
                      </button>
                    )}
                    {isPlaying && (
                      <div className="mt-4 flex justify-center">
                        <div className="flex gap-1">
                          {[0,1,2].map(i => (
                            <div key={i} className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: `${16 + i * 8}px`, animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkpoint markers on timeline preview */}
                {scenario.checkpoints.map(cp => (
                  <div
                    key={cp.id}
                    className={`absolute top-3 w-2 h-2 rounded-full border-2 border-gray-950 ${checkpointsCompleted.includes(cp.id) ? 'bg-green-400' : 'bg-yellow-400'}`}
                    style={{ left: `${cp.at}%` }}
                  />
                ))}

                {/* LIVE badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 rounded-lg px-2 py-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-bold">AI SCENARIO</span>
                </div>

                {/* Subtitles */}
                {isPlaying && (
                  <div className="absolute bottom-14 left-0 right-0 flex justify-center px-8">
                    <div className="bg-black/70 backdrop-blur text-white text-sm px-4 py-2 rounded-lg text-center max-w-xl">
                      {currentSubtitle}
                    </div>
                  </div>
                )}
              </div>

              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                {/* Timeline */}
                <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer">
                  <div className="h-1.5 bg-red-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                  {/* Checkpoint marks */}
                  {scenario.checkpoints.map(cp => (
                    <div
                      key={cp.id}
                      className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-950 transition-colors ${checkpointsCompleted.includes(cp.id) ? 'bg-green-400' : 'bg-yellow-400'}`}
                      style={{ left: `${cp.at}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                      title={`Checkpoint ${cp.id}`}
                    />
                  ))}
                </div>
                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(p => !p)} className="text-white hover:text-red-400 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <span className="text-white/60 text-xs font-mono ml-1">
                    {Math.floor(progressPct * 0.08)}:{String(Math.floor((progressPct * 0.08 % 1) * 60)).padStart(2, '0')} / 8:00
                  </span>
                  <div className="flex-1" />
                  <button className="text-white/60 hover:text-white transition-colors"><Volume2 className="w-4 h-4" /></button>
                  <button className="text-white/60 hover:text-white transition-colors"><Subtitles className="w-4 h-4" /></button>
                  <button className="text-white/60 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Checkpoint legend */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Checkpoints:</span>
              {scenario.checkpoints.map(cp => (
                <div key={cp.id} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${
                  checkpointsCompleted.includes(cp.id) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                }`}>
                  {checkpointsCompleted.includes(cp.id) ? <CheckCircle className="w-3 h-3" /> : <Flag className="w-3 h-3" />}
                  CP {cp.id} · {cp.at}%
                </div>
              ))}
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400" /> Upcoming
                <div className="w-2 h-2 rounded-full bg-green-400 ml-2" /> Completed
              </div>
            </div>
          </div>

          {/* Mission sidebar */}
          <div className="space-y-4">
            {/* Mission info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 ${scenario.iconBg} rounded-xl flex items-center justify-center`}>
                  <scenario.badgeIcon className={`w-5 h-5 ${scenario.color}`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{scenario.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <DifficultyBadge level={scenario.difficulty} />
                    <span className={`text-xs font-medium ${scenario.color}`}>{scenario.category}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{scenario.description}</p>
            </div>

            {/* Live stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mission Stats</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Score', value: score.toString(), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { label: 'XP Earned', value: `+${xpEarned}`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Checkpoints', value: `${checkpointsCompleted.length}/${scenario.checkpoints.length}`, icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Progress', value: `${Math.round(progressPct)}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-2.5 flex items-center gap-2`}>
                    <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                    <div>
                      <div className={`font-bold text-sm ${color}`}>{value}</div>
                      <div className="text-gray-400 text-xs">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Overall progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Mission Progress</span><span>{Math.round(progressPct)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Checkpoint list */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Checkpoints</p>
              <div className="space-y-2">
                {scenario.checkpoints.map((cp, i) => (
                  <div key={cp.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${
                    checkpointsCompleted.includes(cp.id) ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      checkpointsCompleted.includes(cp.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {checkpointsCompleted.includes(cp.id) ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {['MCQ', 'Red Flag', 'What Next', 'Confidence'][['mcq','redflag','whatnext','confidence'].indexOf(cp.type)]}
                      </p>
                      <p className="text-xs text-gray-400">+{cp.xpValue} XP · at {cp.at}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CHECKPOINT ──────────────────────────────────────────────────────────────

  if (view === 'checkpoint' && scenario && currentCP) return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Checkpoint banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 flex items-center gap-4 shadow-md">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Flag className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white font-black text-lg">Checkpoint {currentCP.id} Reached!</div>
          <p className="text-white/70 text-sm">Video paused · Answer to continue</p>
        </div>
        <div className="flex gap-3 text-center">
          <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2">
            <div className={`font-black text-lg ${timeLeft <= 10 ? 'text-red-300' : 'text-white'}`}>{timeLeft}s</div>
            <div className="text-white/60 text-xs">Time</div>
          </div>
          <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2">
            <div className="font-black text-lg text-white">+{currentCP.xpValue}</div>
            <div className="text-white/60 text-xs">XP</div>
          </div>
        </div>
      </div>

      {/* Progress row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{checkpointsCompleted.length}/{scenario.checkpoints.length}</span> checkpoints done
        </div>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{ width: `${(checkpointsCompleted.length / scenario.checkpoints.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-orange-600">
          <Zap className="w-4 h-4" />+{xpEarned} XP
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
          <div className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            currentCP.type === 'mcq' ? 'bg-purple-50 text-purple-700 border-purple-200' :
            currentCP.type === 'redflag' ? 'bg-red-50 text-red-700 border-red-200' :
            currentCP.type === 'whatnext' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            'bg-green-50 text-green-700 border-green-200'
          }`}>
            {currentCP.type === 'mcq' ? '🧠 Multiple Choice' :
             currentCP.type === 'redflag' ? '🚩 Spot the Red Flag' :
             currentCP.type === 'whatnext' ? '🤔 What Would You Do?' :
             '📊 Confidence Rating'}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 hover:bg-amber-100 transition-colors font-medium"
            >
              <Lightbulb className="w-3.5 h-3.5" /> Hint (–20 XP)
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-gray-900 font-bold text-base leading-snug">{currentCP.prompt}</h2>
            {currentCP.subtext && <p className="text-gray-500 text-sm mt-1">{currentCP.subtext}</p>}
          </div>

          {/* Hint */}
          {showHint && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                {currentCP.type === 'mcq' && 'Look for the option that describes a technical AI artefact rather than a mundane explanation.'}
                {currentCP.type === 'redflag' && 'Focus on words that create urgency, demand secrecy, or request money.'}
                {currentCP.type === 'whatnext' && 'Always go directly to official sources — never use contact information provided in the suspicious message.'}
                {currentCP.type === 'confidence' && 'Consider all the signals you\'ve observed so far before rating your confidence.'}
              </span>
            </div>
          )}

          {/* MCQ */}
          {currentCP.type === 'mcq' && currentCP.options && (
            <div className="space-y-2">
              {currentCP.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${
                    selectedAnswer === i
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50/40'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold mr-3 ${
                    selectedAnswer === i ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Red Flag */}
          {currentCP.type === 'redflag' && currentCP.redFlagText && (
            <div className="bg-gray-900 rounded-xl p-4 space-y-2 border border-gray-200">
              <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-3">⚠ Tap the red-flag phrases</p>
              {currentCP.redFlagText.map((line, li) => (
                <p key={li} className="leading-8">
                  {line.map(word => (
                    <span
                      key={word.id}
                      onClick={() => {
                        const next = new Set(selectedFlags);
                        next.has(word.id) ? next.delete(word.id) : next.add(word.id);
                        setSelectedFlags(next);
                      }}
                      className={`cursor-pointer rounded px-1 py-0.5 transition-all text-sm ${
                        selectedFlags.has(word.id)
                          ? 'bg-red-500 text-white font-bold'
                          : word.isFlag
                          ? 'text-gray-100 hover:bg-gray-700'
                          : 'text-gray-300'
                      }`}
                    >
                      {word.text}
                    </span>
                  ))}
                </p>
              ))}
              <p className="text-gray-500 text-xs mt-2">{selectedFlags.size} phrases selected</p>
            </div>
          )}

          {/* What Next */}
          {currentCP.type === 'whatnext' && currentCP.whatNextOptions && (
            <div className="space-y-2">
              {currentCP.whatNextOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedWhatNext(i)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${
                    selectedWhatNext === i
                      ? 'bg-blue-50 border-blue-400 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold flex-shrink-0 mt-0.5 ${
                      selectedWhatNext === i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>{String.fromCharCode(65 + i)}</span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Confidence */}
          {currentCP.type === 'confidence' && (
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Not sure at all</span><span>Completely certain</span>
              </div>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(v => (
                  <button
                    key={v}
                    onClick={() => setConfidence(v)}
                    className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                      confidence === v
                        ? 'bg-red-600 border-red-600 text-white shadow-lg'
                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-red-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-center">
                  <p className="text-red-700 font-semibold text-sm">
                    {['', 'Not sure — more analysis needed', 'Slightly suspicious', 'Moderately confident it\'s fake', 'Very confident it\'s fake', 'Certain — this is a deepfake'][confidence]}
                  </p>
                  <p className="text-red-400 text-xs mt-0.5">{currentCP.confidenceLabel}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={submitAnswer}
            disabled={
              (currentCP.type === 'mcq' && selectedAnswer === null) ||
              (currentCP.type === 'redflag' && selectedFlags.size === 0) ||
              (currentCP.type === 'whatnext' && selectedWhatNext === null)
            }
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Answer <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // ── FEEDBACK ────────────────────────────────────────────────────────────────

  if (view === 'feedback' && scenario && currentCP) {
    const isCorrect =
      (currentCP.type === 'mcq' && selectedAnswer === currentCP.correctIndex) ||
      (currentCP.type === 'redflag' && (currentCP.correctFlags ?? []).every(f => selectedFlags.has(f)) && selectedFlags.size === (currentCP.correctFlags ?? []).length) ||
      (currentCP.type === 'whatnext' && (currentCP.whatNextOptions?.[selectedWhatNext!]?.safe ?? false)) ||
      currentCP.type === 'confidence';

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        {/* Result banner */}
        <div className={`rounded-2xl p-5 flex items-center gap-4 shadow-md ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            {isCorrect ? <CheckCircle className="w-7 h-7 text-white" /> : <XCircle className="w-7 h-7 text-white" />}
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-xl">{isCorrect ? 'Correct! Well spotted.' : 'Not quite — but here\'s the breakdown.'}</p>
            <p className="text-white/70 text-sm">
              {isCorrect ? `+${currentCP.xpValue} XP earned · Great detection instincts!` : `+${Math.floor(currentCP.xpValue * 0.3)} XP · Keep training to sharpen your eye.`}
            </p>
          </div>
          <div className="text-center bg-white/15 border border-white/20 rounded-xl px-4 py-2">
            <div className="text-white font-black text-2xl">+{isCorrect ? currentCP.xpValue : Math.floor(currentCP.xpValue * 0.3)}</div>
            <div className="text-white/60 text-xs">XP</div>
          </div>
        </div>

        {/* Correct answer (for MCQ/WhatNext) */}
        {currentCP.type === 'mcq' && currentCP.options && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Correct Answer</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 font-medium flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              {currentCP.options[currentCP.correctIndex!]}
            </div>
            {!isCorrect && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>You selected: {currentCP.options[selectedAnswer!]}</span>
              </div>
            )}
          </div>
        )}

        {/* What Next result */}
        {currentCP.type === 'whatnext' && currentCP.whatNextOptions && selectedWhatNext !== null && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Choice</p>
            <div className={`rounded-xl p-4 text-sm font-medium flex items-start gap-3 ${
              currentCP.whatNextOptions[selectedWhatNext].safe
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {currentCP.whatNextOptions[selectedWhatNext].safe
                ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                : <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold mb-1">{currentCP.whatNextOptions[selectedWhatNext].text}</p>
                <p className="font-normal opacity-80">{currentCP.whatNextOptions[selectedWhatNext].explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Explanation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">AI Analysis</span>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-gray-700 text-sm leading-relaxed">{currentCP.explanation}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tactics */}
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Manipulation Tactics Used
                </p>
                <div className="space-y-1.5">
                  {currentCP.tactics.map(t => (
                    <div key={t} className="flex items-center gap-2 text-xs text-gray-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              {/* Actions */}
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Recommended Actions
                </p>
                <div className="space-y-1.5">
                  {currentCP.actions.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={continueAfterFeedback}
          className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          {checkpointIdx + 1 >= (scenario?.checkpoints.length ?? 0)
            ? <><Trophy className="w-5 h-5" /> Complete Mission</>
            : <><Play className="w-5 h-5 fill-white" /> Continue Watching</>
          }
        </button>
      </div>
    );
  }

  // ── MISSION COMPLETE ────────────────────────────────────────────────────────

  if (view === 'complete' && scenario) {
    const accuracy = Math.round((xpEarned / (scenario.checkpoints.reduce((s, c) => s + c.xpValue, 0) || 1)) * 100);
    const rank = accuracy >= 90 ? 'S' : accuracy >= 75 ? 'A' : accuracy >= 60 ? 'B' : 'C';
    const rankColor = { S: 'text-yellow-500', A: 'text-green-500', B: 'text-blue-500', C: 'text-gray-500' }[rank];
    const nextScenario = SCENARIOS.find(s => !s.locked && s.id !== scenario.id);

    return (
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* Trophy header */}
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <Shield key={i} className="absolute text-white"
                style={{ width: 40 + i * 20, height: 40 + i * 20, left: `${i * 22}%`, top: `${(i % 2) * 40}%`, transform: `rotate(${i * 25}deg)` }} />
            ))}
          </div>
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 border-4 border-white/40 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-yellow-300" />
            </div>
            <p className="text-white/70 text-sm uppercase tracking-widest mb-1">Mission Complete</p>
            <h1 className="text-white mb-2">{scenario.title}</h1>
            <div className={`text-6xl font-black ${rankColor} mb-1`}>{rank}</div>
            <p className="text-white/60 text-sm">Rank</p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Final Score', value: xpEarned.toString(), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
            { label: 'XP Gained', value: `+${xpEarned}`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
            { label: 'Checkpoints', value: `${checkpointsCompleted.length}/${scenario.checkpoints.length}`, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-4 text-center`}>
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <div className={`font-black text-xl ${color}`}>{value}</div>
              <div className="text-gray-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Badge unlocked */}
        <div className="bg-white rounded-2xl border-2 border-yellow-300 p-5 flex items-center gap-4 shadow-sm">
          <div className={`w-14 h-14 bg-gradient-to-br ${scenario.bgGrad} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
            <scenario.badgeIcon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Badge Unlocked!</span>
            </div>
            <p className="font-bold text-gray-900">{scenario.badge}</p>
            <p className="text-gray-500 text-xs">Awarded for completing {scenario.title}</p>
          </div>
          <div className="text-3xl">🏅</div>
        </div>

        {/* Personalized recommendations */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="font-semibold text-gray-900 text-sm">Personalised Recommendations</p>
          </div>
          <div className="space-y-2">
            {[
              { text: `Your ${scenario.category} detection skills are developing well — aim for 85%+ on your next attempt.`, icon: '🎯' },
              { text: 'Practice the Red Flag question type more — it\'s your weakest checkpoint format this session.', icon: '🚩' },
              { text: 'Try the Scam Chats module next — it builds on the urgency-manipulation tactics you identified here.', icon: '📱' },
            ].map(({ text, icon }, i) => (
              <div key={i} className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => startScenario(scenario)}
            className="flex items-center justify-center gap-2 py-3.5 border-2 border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Replay Mission
          </button>
          {nextScenario ? (
            <button
              onClick={() => startScenario(nextScenario)}
              className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Next Mission <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <Layers className="w-4 h-4" /> Back to Academy
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
