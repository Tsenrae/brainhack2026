import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play, Pause, SkipForward, Volume2, Subtitles, Maximize2,
  ChevronRight, Zap, Trophy, Target, Clock,
  Shield, Star, Lock, CheckCircle, XCircle, Lightbulb,
  AlertTriangle, ArrowRight, Eye, MessageSquare, Newspaper,
  Heart, QrCode, Award, Flag, Sparkles, RotateCcw,
  BookOpen, TrendingUp, Info, Layers, Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'hub' | 'video' | 'checkpoint' | 'feedback' | 'complete';
type QuestionType = 'mcq' | 'redflag' | 'whatnext' | 'confidence';
type Category = 'Deepfakes' | 'Scam Chats' | 'Fake News' | 'Cyberbullying' | 'QR Scams';
type ScenarioRank = 'S' | 'A' | 'B' | 'C';

interface RedFlagWord { id: string; text: string; isFlag: boolean; }
interface CheckpointQuestion {
  id: number;
  at: number;
  type: QuestionType;
  prompt: string;
  subtext?: string;
  hint: string;
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
  badgeSlug: string;
  badgeIcon: React.ElementType;
  color: string;
  bgGrad: string;
  iconBg: string;
  requiresCompleted: string[];
  checkpoints: CheckpointQuestion[];
  sceneLines: string[];
}

interface ScenarioProgress {
  scenario_id: string;
  status: 'in_progress' | 'completed';
  best_rank: ScenarioRank | null;
  best_xp: number;
  best_accuracy_pct: number;
  attempts: number;
  last_played_at: string;
  first_completed_at: string | null;
}

interface QuestionResult { type: QuestionType; correct: boolean; }

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
    badgeSlug: 'deepfake-detective',
    badgeIcon: Eye,
    color: 'text-purple-600',
    bgGrad: 'from-purple-600 to-violet-700',
    iconBg: 'bg-purple-100',
    requiresCompleted: [],
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
        hint: 'AI synthesis models are weakest at facial boundaries — look for where the generated face meets the neck and hairline.',
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
        hint: 'Focus on words that demand immediate action, request upfront payment, create a time deadline, or instruct secrecy.',
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
        hint: 'Weigh all the signals: facial artefacts, audio-lip sync, the financial demand, and the urgency framing together.',
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
    badgeSlug: 'scam-slayer',
    badgeIcon: Shield,
    color: 'text-red-600',
    bgGrad: 'from-red-600 to-rose-700',
    iconBg: 'bg-red-100',
    requiresCompleted: [],
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
        hint: 'Never use any contact information, links, or phone numbers from a suspicious message. Always go to the official source directly.',
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
        hint: 'Think about what emotional state the threat creates and how that affects decision-making.',
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
    badgeSlug: 'spin-spotter',
    badgeIcon: Newspaper,
    color: 'text-amber-600',
    bgGrad: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100',
    requiresCompleted: [],
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
        hint: 'Watch for language attacking institutions, claiming suppressed information, or creating social pressure to share quickly.',
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
    badgeSlug: 'kindness-champion',
    badgeIcon: Heart,
    color: 'text-pink-600',
    bgGrad: 'from-pink-500 to-rose-600',
    iconBg: 'bg-pink-100',
    requiresCompleted: ['deepfake-storm', 'scam-chat', 'fake-news-wave'],
    sceneLines: [
      'Group chat: "Did you see what she posted? 😂"',
      '14 members react with laughing emojis.',
      'The targeted student has not replied in 3 days.',
    ],
    checkpoints: [
      {
        id: 1, at: 35, type: 'whatnext', xpValue: 100,
        prompt: 'You\'re in the group chat. Private photos of a classmate are being shared and mocked. What\'s the right first step?',
        subtext: 'Choose the action that best protects the targeted student.',
        hint: 'The goal is to support the person being harmed AND stop it from continuing. Silence or participation both make it worse.',
        whatNextOptions: [
          { text: 'Screenshot and share to your own group to show people how wrong it is', safe: false, explanation: 'Even with good intentions, resharing the content amplifies it and causes more harm to the targeted student.' },
          { text: 'React with emojis so the bullies don\'t target you next', safe: false, explanation: 'Joining in — even passively — validates the bullying and increases the harm. Bystanders who stay silent also contribute to the hostile environment.' },
          { text: 'Privately message the targeted student to offer support, then report to a teacher', safe: true, explanation: 'Correct. Reaching out privately shows the student they\'re not alone, while reporting ensures an adult can intervene to stop it.' },
          { text: 'Leave the group chat so you\'re not involved', safe: false, explanation: 'Leaving without acting abandons the targeted student. You witnessed the harm — reporting it to a trusted adult is the responsible action.' },
        ],
        explanation: 'The most effective bystander response combines: (1) direct emotional support to the target, and (2) involving a trusted adult to intervene and stop the behaviour at its source.',
        tactics: ['Peer pressure normalisation', 'Bystander effect exploitation', 'Social exclusion as punishment'],
        actions: ['Reach out privately to the targeted student', 'Report to a teacher or school counsellor', 'Document the evidence (screenshots with timestamps) before reporting'],
      },
      {
        id: 2, at: 70, type: 'mcq', xpValue: 90,
        prompt: 'The targeted student has withdrawn from all CCAs and their grades have dropped significantly. What does this most likely indicate?',
        hint: 'Think about the cumulative psychological impact of sustained social exclusion and online humiliation on a young person.',
        options: [
          'They chose to focus on personal priorities away from school activities',
          'Cyberbullying can cause significant anxiety, depression, and withdrawal from activities they once enjoyed',
          'They are taking a planned break and will return soon',
          'They are simply bored with their current CCAs',
        ],
        correctIndex: 1,
        explanation: 'Withdrawal from activities, declining academic performance, and social isolation are documented signs of psychological harm from cyberbullying. These are not choices — they are symptoms. Early intervention from counsellors and trusted adults is critical.',
        tactics: ['Prolonged social exclusion', 'Public humiliation', 'Coordinated targeting across platforms'],
        actions: ['Alert the school counsellor immediately', 'Encourage the targeted student to seek adult support', 'Remind peers that sharing private images without consent may be illegal under POHA'],
      },
    ],
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
    badgeSlug: 'qr-guardian',
    badgeIcon: QrCode,
    color: 'text-blue-600',
    bgGrad: 'from-blue-600 to-cyan-600',
    iconBg: 'bg-blue-100',
    requiresCompleted: ['deepfake-storm', 'scam-chat'],
    sceneLines: [
      'Car park ticket machine is "under maintenance."',
      'A handwritten sign directs you to scan a QR code.',
      'The QR leads to: carpark-sg-payments.web.app',
    ],
    checkpoints: [
      {
        id: 1, at: 40, type: 'mcq', xpValue: 90,
        prompt: 'The QR code links to "carpark-sg-payments.web.app". What is the strongest indicator that this is fraudulent?',
        hint: 'Look at the domain. What would a legitimate Singapore carpark operator\'s URL look like compared to this?',
        options: [
          'Legitimate Singapore carpark or government payment portals use official domains (.gov.sg or the operator\'s verified domain) — not generic app-hosting platforms',
          'The URL is too long to be a real payment page',
          'Payment URLs should never contain the word "carpark"',
          'QR codes in public places are always safe to scan',
        ],
        correctIndex: 0,
        explanation: '"carpark-sg-payments.web.app" uses Firebase\'s free hosting platform. Any scammer can create this in minutes. Legitimate operators (HDB, URA, private operators) have registered domains. When the URL doesn\'t match the brand\'s official domain, treat it as fraudulent.',
        tactics: ['Brand impersonation via subdomain', 'Urgency via broken infrastructure ("under maintenance")', 'Physical world deception (sticker over legitimate QR)'],
        actions: ['Never scan QR codes placed over or next to official signage', 'Look up the carpark operator\'s official app or website directly', 'Report suspicious QR stickers to building management or the police'],
      },
      {
        id: 2, at: 75, type: 'whatnext', xpValue: 80,
        prompt: 'You need to pay for parking and only this QR sticker is available. What do you do?',
        hint: 'The safest principle: always navigate to the official source yourself rather than using any infrastructure provided to you in a suspicious context.',
        whatNextOptions: [
          { text: 'Scan the QR code — the parking fee is small so the risk is low', safe: false, explanation: 'The fee amount is irrelevant. Once you enter payment details on a fake page, scammers can drain your entire account or sell your card details.' },
          { text: 'Open your browser and search for the official carpark operator\'s app or payment website directly', safe: true, explanation: 'Correct. Navigate to the official source yourself. Most Singapore carpark operators have official apps (e.g. HDB, Autopay) — find them through official channels, not QR codes.' },
          { text: 'Scan the QR but only enter your name — not your card details', safe: false, explanation: 'Even partial information (name, phone number) can be combined with other data for identity fraud. Don\'t interact with fraudulent pages at all.' },
          { text: 'Let another person scan it first to see if it\'s safe', safe: false, explanation: 'This puts another person at risk. Neither of you should scan it — report it and find an alternative.' },
        ],
        explanation: 'QR code scams exploit the split-second habit of scanning without verifying the destination URL first. Always check the URL after scanning but BEFORE entering any information. Better still, use official apps and websites directly.',
        tactics: ['Physical world infiltration', 'Habitual action exploitation', 'Low-stakes framing to lower guard'],
        actions: ['Always check the URL destination before entering any details', 'Install official carpark apps and use them instead of random QR codes', 'Report suspicious QR stickers to building management or call the police at 999'],
      },
    ],
  },
];

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORIES: { label: Category; icon: React.ElementType; color: string }[] = [
  { label: 'Deepfakes',     icon: Eye,         color: 'text-purple-600' },
  { label: 'Scam Chats',    icon: MessageSquare, color: 'text-red-600'  },
  { label: 'Fake News',     icon: Newspaper,   color: 'text-amber-600'  },
  { label: 'Cyberbullying', icon: Heart,        color: 'text-pink-600'  },
  { label: 'QR Scams',      icon: QrCode,       color: 'text-blue-600'  },
];

const RANK_COLORS: Record<string, string> = {
  S: 'text-yellow-500 bg-yellow-50 border-yellow-300',
  A: 'text-green-600 bg-green-50 border-green-300',
  B: 'text-blue-600 bg-blue-50 border-blue-300',
  C: 'text-gray-500 bg-gray-50 border-gray-300',
};

function DifficultyBadge({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const styles = {
    Easy:   'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Hard:   'bg-red-100 text-red-700 border-red-200',
  }[level];
  return <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${styles}`}>{level}</span>;
}

function generateRecommendations(results: QuestionResult[], category: Category): string[] {
  const recs: string[] = [];
  const byType = (t: QuestionType) => results.filter(r => r.type === t);
  const accuracy = (arr: QuestionResult[]) => arr.length === 0 ? null : arr.filter(r => r.correct).length / arr.length;

  const rfAcc  = accuracy(byType('redflag'));
  const wnAcc  = accuracy(byType('whatnext'));
  const mcqAcc = accuracy(byType('mcq'));
  const overall = accuracy(results);

  if (rfAcc !== null && rfAcc < 1)
    recs.push('Red flag spotting needs work — in real threats, urgency words, secrecy demands, and upfront payment requests are the most reliable signals. Replay to practise.');
  if (wnAcc !== null && wnAcc < 1)
    recs.push('For decision questions: always navigate to official sources yourself — never use contact info, links, or phone numbers from a suspicious message.');
  if (mcqAcc !== null && mcqAcc < 0.5)
    recs.push(`Reinforce your ${category} knowledge — review the AI Analysis cards and try again. Pattern recognition improves quickly with repetition.`);
  if (overall !== null && overall >= 0.9 && results.length >= 2)
    recs.push(`Excellent detection instincts for ${category}! Push to S rank with a clean run — aim for all flags correct with no false positives.`);

  const next = category === 'Deepfakes' ? 'Scam Chats' : category === 'Scam Chats' ? 'Fake News' : 'Deepfakes';
  if (recs.length < 2)
    recs.push(`Try the ${next} module next — cross-training across threat types builds a broader mental model that transfers to real-world threat detection.`);

  return recs.slice(0, 3);
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ScenarioAcademy() {
  const { profile, session } = useAuth();

  const [view, setView]               = useState<View>('hub');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [scenario, setScenario]       = useState<Scenario | null>(null);
  const [checkpointIdx, setCheckpointIdx] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [subtitleLine, setSubtitleLine] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedFlags, setSelectedFlags]   = useState<Set<string>>(new Set());
  const [selectedWhatNext, setSelectedWhatNext] = useState<number | null>(null);
  const [confidence, setConfidence]   = useState(3);
  const [score, setScore]             = useState(0);
  const [xpEarned, setXpEarned]       = useState(0);
  const [showHint, setShowHint]       = useState(false);
  const [timeLeft, setTimeLeft]       = useState(45);
  const [timerActive, setTimerActive] = useState(false);
  const [timedOut, setTimedOut]       = useState(false);
  const [checkpointsCompleted, setCheckpointsCompleted] = useState<number[]>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);

  // Progress state
  const [scenarioProgress, setScenarioProgress] = useState<Record<string, ScenarioProgress>>({});
  const [loadingProgress, setLoadingProgress]   = useState(true);
  const [savingComplete, setSavingComplete]      = useState(false);
  const [completeResult, setCompleteResult]      = useState<{ xp_awarded: number; badge_awarded: string | null; is_first_completion: boolean } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const authHeader = useMemo(
    (): Record<string, string> => session ? { Authorization: `Bearer ${session.access_token}` } : {},
    [session],
  );

  // ── Fetch progress on mount ─────────────────────────────────────────────────
  const fetchProgress = useCallback(async () => {
    if (!session) { setLoadingProgress(false); return; }
    try {
      const res  = await fetch(`${BACKEND_URL}/api/scenarios/progress`, { headers: authHeader });
      const body = await res.json();
      const map: Record<string, ScenarioProgress> = {};
      for (const p of body.data ?? []) map[p.scenario_id] = p;
      setScenarioProgress(map);
    } catch { /* ignore */ }
    finally { setLoadingProgress(false); }
  }, [session]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  // ── Derived: unlock logic ───────────────────────────────────────────────────
  const completedIds = useMemo(
    () => Object.entries(scenarioProgress).filter(([, p]) => p.status === 'completed').map(([id]) => id),
    [scenarioProgress],
  );

  const isUnlocked = useCallback((s: Scenario): boolean => {
    if (s.requiresCompleted.length === 0) return true;
    if (s.id === 'cyberbully-escape') return s.requiresCompleted.some(id => completedIds.includes(id));
    if (s.id === 'qr-trap')           return s.requiresCompleted.filter(id => completedIds.includes(id)).length >= 2;
    return s.requiresCompleted.every(id => completedIds.includes(id));
  }, [completedIds]);

  // ── Derived: continue banner ─────────────────────────────────────────────────
  const continueBanner = useMemo(() => {
    const entries = Object.entries(scenarioProgress)
      .sort(([, a], [, b]) => new Date(b.last_played_at).getTime() - new Date(a.last_played_at).getTime());
    if (!entries.length) return null;
    const found = SCENARIOS.find(s => s.id === entries[0][0]);
    if (!found) return null;
    return { scenario: found, progress: entries[0][1] };
  }, [scenarioProgress]);

  // ── Video simulation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (view === 'video' && isPlaying && scenario) {
      videoRef.current = setInterval(() => {
        setVideoProgress(prev => {
          const next = prev + 0.4;
          const nextCP = scenario.checkpoints.find(
            cp => !checkpointsCompleted.includes(cp.id) && next >= cp.at,
          );
          if (nextCP) {
            setIsPlaying(false);
            clearInterval(videoRef.current!);
            setTimeout(() => {
              setView('checkpoint');
              setTimerActive(true);
              setTimeLeft(45);
              setShowHint(false);
              setTimedOut(false);
              setSelectedAnswer(null);
              setSelectedFlags(new Set());
              setSelectedWhatNext(null);
            }, 400);
            return nextCP.at;
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
  }, [isPlaying, view, scenario, checkpointsCompleted]);

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timerActive && timeLeft === 0) {
      clearInterval(timerRef.current!);
      setTimerActive(false);
      setTimedOut(true);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft]);

  // ── Save completion when view hits 'complete' ────────────────────────────────
  useEffect(() => {
    if (view !== 'complete' || !scenario || !session || savingComplete) return;
    setSavingComplete(true);
    const totalPossible = scenario.checkpoints.reduce((s, c) => s + c.xpValue, 0) || 1;
    const accuracy = Math.round((xpEarned / totalPossible) * 100);
    const rank: 'S'|'A'|'B'|'C' = accuracy >= 90 ? 'S' : accuracy >= 75 ? 'A' : accuracy >= 60 ? 'B' : 'C';
    fetch(`${BACKEND_URL}/api/scenarios/${scenario.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ xp_earned: xpEarned, rank, accuracy_pct: accuracy }),
    })
      .then(r => r.json())
      .then(body => {
        if (body.data) setCompleteResult(body.data);
        fetchProgress();
      })
      .catch(() => {})
      .finally(() => setSavingComplete(false));
  }, [view]);

  const currentCP = scenario?.checkpoints[checkpointIdx] ?? null;

  function startScenario(s: Scenario) {
    setScenario(s);
    setVideoProgress(0);
    setCheckpointIdx(0);
    setCheckpointsCompleted([]);
    setScore(0);
    setXpEarned(0);
    setQuestionResults([]);
    setCompleteResult(null);
    setIsPlaying(false);
    setSubtitleLine(0);
    setTimedOut(false);
    setView('video');
  }

  // ── Manual submit ─────────────────────────────────────────────────────────────
  function submitAnswer() {
    if (!currentCP) return;
    let correct = false;
    let pts     = 0;

    if (currentCP.type === 'confidence') {
      correct = true;
      pts = currentCP.xpValue;
    } else if (currentCP.type === 'mcq') {
      correct = selectedAnswer === currentCP.correctIndex;
      pts = correct ? currentCP.xpValue : Math.floor(currentCP.xpValue * 0.3);
    } else if (currentCP.type === 'redflag') {
      const flags = currentCP.correctFlags ?? [];
      const tp = flags.filter(f => selectedFlags.has(f)).length;
      const fp = [...selectedFlags].filter(f => !flags.includes(f)).length;
      correct = tp === flags.length && fp === 0;
      const ratio = flags.length > 0 ? tp / flags.length : 0;
      pts = Math.max(0, Math.round(currentCP.xpValue * Math.max(0, ratio - fp * 0.15)));
    } else if (currentCP.type === 'whatnext') {
      correct = currentCP.whatNextOptions?.[selectedWhatNext!]?.safe ?? false;
      pts = correct ? currentCP.xpValue : Math.floor(currentCP.xpValue * 0.3);
    }

    setScore(s => s + pts);
    setXpEarned(x => x + pts);
    setCheckpointsCompleted(c => [...c, currentCP.id]);
    setQuestionResults(r => [...r, { type: currentCP.type, correct }]);
    setTimerActive(false);
    setView('feedback');
  }

  // ── Timeout submit (partial credit for whatever was selected) ────────────────
  function autoSubmit() {
    if (!currentCP) return;
    let correct = false;
    let pts     = 0;

    if (currentCP.type === 'confidence') {
      correct = true;
      pts = currentCP.xpValue;
    } else if (currentCP.type === 'mcq' && selectedAnswer !== null) {
      correct = selectedAnswer === currentCP.correctIndex;
      pts = correct ? Math.floor(currentCP.xpValue * 0.7) : 0;
    } else if (currentCP.type === 'redflag' && selectedFlags.size > 0) {
      const flags = currentCP.correctFlags ?? [];
      const tp = flags.filter(f => selectedFlags.has(f)).length;
      pts = Math.max(0, Math.round(currentCP.xpValue * 0.5 * (tp / Math.max(1, flags.length))));
      correct = tp === flags.length && [...selectedFlags].filter(f => !flags.includes(f)).length === 0;
    } else if (currentCP.type === 'whatnext' && selectedWhatNext !== null) {
      correct = currentCP.whatNextOptions?.[selectedWhatNext]?.safe ?? false;
      pts = correct ? Math.floor(currentCP.xpValue * 0.7) : 0;
    }

    setScore(s => s + pts);
    setXpEarned(x => x + pts);
    setCheckpointsCompleted(c => [...c, currentCP.id]);
    setQuestionResults(r => [...r, { type: currentCP.type, correct }]);
    setTimedOut(false);
    setTimerActive(false);
    setView('feedback');
  }

  function continueAfterFeedback() {
    if (!scenario) return;
    const nextIdx = checkpointIdx + 1;
    if (nextIdx >= scenario.checkpoints.length) {
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
    setQuestionResults([]);
    setCompleteResult(null);
    setSavingComplete(false);
  }

  const filtered = activeCategory === 'All'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.category === activeCategory);

  // ── HUB ──────────────────────────────────────────────────────────────────────

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
            <div className="text-red-600 font-black text-lg">{(profile?.xp ?? 0).toLocaleString()}</div>
            <div className="text-gray-400 text-xs">Total XP</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center shadow-sm">
            <div className="text-gray-900 font-black text-lg">{completedIds.length}/{SCENARIOS.length}</div>
            <div className="text-gray-400 text-xs">Completed</div>
          </div>
        </div>
      </div>

      {/* Continue / Intro banner */}
      {loadingProgress ? (
        <div className="bg-gray-100 rounded-2xl p-5 flex items-center gap-3 text-gray-400 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" /><span>Loading your progress…</span>
        </div>
      ) : continueBanner ? (
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold text-sm">Continue where you left off</span>
              </div>
              <p className="font-bold text-lg">{continueBanner.scenario.title}</p>
              <p className="text-white/70 text-sm">
                {continueBanner.scenario.category} · {continueBanner.progress.attempts} attempt{continueBanner.progress.attempts !== 1 ? 's' : ''}
                {continueBanner.progress.best_rank && (
                  <span className="ml-2 bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold">
                    Best: {continueBanner.progress.best_rank} rank
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => startScenario(continueBanner.scenario)}
              className="flex items-center gap-2 bg-white text-red-600 font-bold px-5 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-sm flex-shrink-0"
            >
              <Play className="w-4 h-4 fill-red-600" />
              {continueBanner.progress.status === 'completed' ? 'Replay Mission' : 'Resume Mission'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <p className="font-bold text-lg">Welcome to Scenario Academy</p>
              <p className="text-white/70 text-sm">Pick any unlocked scenario below to start earning XP and badges.</p>
            </div>
          </div>
        </div>
      )}

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
        {filtered.map(s => {
          const unlocked = isUnlocked(s);
          const prog     = scenarioProgress[s.id];
          return (
            <div key={s.id} className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group ${!unlocked ? 'opacity-60' : ''}`}>
              <div className={`bg-gradient-to-br ${s.bgGrad} p-5 relative overflow-hidden`}>
                <div className="absolute right-3 top-3 opacity-15">
                  <s.badgeIcon className="w-16 h-16 text-white" />
                </div>
                {!unlocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur border border-white/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-white text-sm font-semibold">
                      <Lock className="w-4 h-4" />
                      Complete {s.requiresCompleted.length === 1 ? '1' : 'any 1'} previous scenario
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-white/20 rounded-lg px-2 py-0.5 text-white text-xs font-medium flex items-center gap-1">
                    {(() => { const C = CATEGORIES.find(c => c.label === s.category)!; return <C.icon className="w-3 h-3" />; })()}
                    {s.category}
                  </div>
                  <DifficultyBadge level={s.difficulty} />
                  {prog?.best_rank && (
                    <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${RANK_COLORS[prog.best_rank]}`}>
                      {prog.best_rank} rank
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">{s.title}</h3>
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration}</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-300" />{s.xpReward} XP</span>
                  <span className="flex items-center gap-1"><Award className="w-3 h-3" />{s.badge}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{s.description}</p>
                {prog && (
                  <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>{prog.attempts} play{prog.attempts !== 1 ? 's' : ''}</span>
                    {prog.best_accuracy_pct > 0 && <span>· Best accuracy: {prog.best_accuracy_pct}%</span>}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: s.checkpoints.length || 2 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-gray-200" />
                    ))}
                  </div>
                  <button
                    disabled={!unlocked}
                    onClick={() => unlocked && startScenario(s)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      !unlocked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${s.bgGrad} text-white shadow-sm hover:shadow-md group-hover:scale-[1.02]`
                    }`}
                  >
                    {!unlocked ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    {!unlocked ? 'Locked' : prog?.status === 'completed' ? 'Replay' : 'Start Mission'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── VIDEO PLAYER ─────────────────────────────────────────────────────────────

  if (view === 'video' && scenario) {
    const currentSubtitle = scenario.sceneLines[subtitleLine % scenario.sceneLines.length];
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={reset} className="hover:text-red-600 transition-colors">Scenario Academy</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{scenario.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            {/* Video area */}
            <div className="relative bg-gray-950 rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/50">
                      <scenario.badgeIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-white/40 text-xs uppercase tracking-widest mb-2 font-mono">AI-GENERATED SCENARIO · {scenario.category.toUpperCase()}</div>
                    <div className="text-white font-bold text-xl">{scenario.title}</div>
                    {!isPlaying && videoProgress === 0 && (
                      <button onClick={() => setIsPlaying(true)}
                        className="mt-6 flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all mx-auto backdrop-blur">
                        <Play className="w-5 h-5 fill-white" /> Begin Scenario
                      </button>
                    )}
                    {isPlaying && (
                      <div className="mt-4 flex justify-center">
                        <div className="flex gap-1">
                          {[0,1,2].map(i => <div key={i} className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: `${16 + i * 8}px`, animationDelay: `${i * 0.15}s` }} />)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {scenario.checkpoints.map(cp => (
                  <div key={cp.id} className={`absolute top-3 w-2 h-2 rounded-full border-2 border-gray-950 ${checkpointsCompleted.includes(cp.id) ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ left: `${cp.at}%` }} />
                ))}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 rounded-lg px-2 py-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-bold">AI SCENARIO</span>
                </div>
                {isPlaying && (
                  <div className="absolute bottom-14 left-0 right-0 flex justify-center px-8">
                    <div className="bg-black/70 backdrop-blur text-white text-sm px-4 py-2 rounded-lg text-center max-w-xl">{currentSubtitle}</div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer">
                  <div className="h-1.5 bg-red-500 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                  {scenario.checkpoints.map(cp => (
                    <div key={cp.id} className={`absolute top-1/2 w-3 h-3 rounded-full border-2 border-gray-950 transition-colors ${checkpointsCompleted.includes(cp.id) ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ left: `${cp.at}%`, transform: 'translateX(-50%) translateY(-50%)' }} title={`Checkpoint ${cp.id}`} />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(p => !p)} className="text-white hover:text-red-400 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors"><SkipForward className="w-4 h-4" /></button>
                  <span className="text-white/60 text-xs font-mono ml-1">
                    {Math.floor(videoProgress * 0.08)}:{String(Math.floor((videoProgress * 0.08 % 1) * 60)).padStart(2, '0')} / 8:00
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
                <div key={cp.id} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${checkpointsCompleted.includes(cp.id) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
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

          {/* Sidebar */}
          <div className="space-y-4">
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

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mission Stats</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Score', value: score.toString(), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { label: 'XP Earned', value: `+${xpEarned}`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Checkpoints', value: `${checkpointsCompleted.length}/${scenario.checkpoints.length}`, icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Progress', value: `${Math.round(videoProgress)}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
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
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{Math.round(videoProgress)}%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Checkpoints</p>
              <div className="space-y-2">
                {scenario.checkpoints.map((cp, i) => (
                  <div key={cp.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${checkpointsCompleted.includes(cp.id) ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${checkpointsCompleted.includes(cp.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
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

  // ── CHECKPOINT ───────────────────────────────────────────────────────────────

  if (view === 'checkpoint' && scenario && currentCP) return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Banner */}
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
            <div className={`font-black text-lg ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
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
          <span className="font-semibold text-gray-900">{checkpointsCompleted.length}/{scenario.checkpoints.length}</span> done
        </div>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{ width: `${(checkpointsCompleted.length / scenario.checkpoints.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-orange-600"><Zap className="w-4 h-4" />+{xpEarned} XP</div>
      </div>

      {/* Question card */}
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Time's up overlay */}
        {timedOut && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
            <div className="bg-white rounded-2xl p-6 text-center shadow-xl mx-4">
              <Clock className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="font-black text-gray-900 text-xl mb-1">Time's Up!</p>
              <p className="text-gray-500 text-sm mb-5">
                {selectedAnswer !== null || selectedFlags.size > 0 || selectedWhatNext !== null
                  ? 'Partial credit awarded for your selection.'
                  : 'No answer selected — 0 XP this checkpoint.'}
              </p>
              <button onClick={autoSubmit} className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                See Explanation
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
          <div className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            currentCP.type === 'mcq'        ? 'bg-purple-50 text-purple-700 border-purple-200' :
            currentCP.type === 'redflag'    ? 'bg-red-50 text-red-700 border-red-200' :
            currentCP.type === 'whatnext'   ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                              'bg-green-50 text-green-700 border-green-200'
          }`}>
            {currentCP.type === 'mcq' ? '🧠 Multiple Choice' :
             currentCP.type === 'redflag' ? '🚩 Spot the Red Flag' :
             currentCP.type === 'whatnext' ? '🤔 What Would You Do?' :
             '📊 Confidence Rating'}
          </div>
          {currentCP.type === 'redflag' && (
            <div className="text-xs text-gray-400 bg-gray-100 rounded-lg px-2 py-1">Partial credit applies</div>
          )}
          <div className="ml-auto">
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

          {showHint && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>{currentCP.hint}</span>
            </div>
          )}

          {/* MCQ */}
          {currentCP.type === 'mcq' && currentCP.options && (
            <div className="space-y-2">
              {currentCP.options.map((opt, i) => (
                <button key={i} onClick={() => setSelectedAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${selectedAnswer === i ? 'bg-red-50 border-red-400 text-red-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50/40'}`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold mr-3 ${selectedAnswer === i ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{String.fromCharCode(65 + i)}</span>
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
                    <span key={word.id}
                      onClick={() => { const n = new Set(selectedFlags); n.has(word.id) ? n.delete(word.id) : n.add(word.id); setSelectedFlags(n); }}
                      className={`cursor-pointer rounded px-1 py-0.5 transition-all text-sm ${selectedFlags.has(word.id) ? 'bg-red-500 text-white font-bold' : word.isFlag ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-300'}`}>
                      {word.text}
                    </span>
                  ))}
                </p>
              ))}
              <p className="text-gray-500 text-xs mt-2">{selectedFlags.size} phrase{selectedFlags.size !== 1 ? 's' : ''} selected</p>
            </div>
          )}

          {/* What Next */}
          {currentCP.type === 'whatnext' && currentCP.whatNextOptions && (
            <div className="space-y-2">
              {currentCP.whatNextOptions.map((opt, i) => (
                <button key={i} onClick={() => setSelectedWhatNext(i)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${selectedWhatNext === i ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/40'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold flex-shrink-0 mt-0.5 ${selectedWhatNext === i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{String.fromCharCode(65 + i)}</span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Confidence */}
          {currentCP.type === 'confidence' && (
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Not sure at all</span><span>Completely certain</span></div>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setConfidence(v)}
                    className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all ${confidence === v ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-red-300'}`}>
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
              timedOut ||
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

  // ── FEEDBACK ─────────────────────────────────────────────────────────────────

  if (view === 'feedback' && scenario && currentCP) {
    const isCorrect =
      (currentCP.type === 'mcq' && selectedAnswer === currentCP.correctIndex) ||
      (currentCP.type === 'redflag' && (currentCP.correctFlags ?? []).every(f => selectedFlags.has(f)) && selectedFlags.size === (currentCP.correctFlags ?? []).length) ||
      (currentCP.type === 'whatnext' && (currentCP.whatNextOptions?.[selectedWhatNext!]?.safe ?? false)) ||
      currentCP.type === 'confidence';

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        <div className={`rounded-2xl p-5 flex items-center gap-4 shadow-md ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            {isCorrect ? <CheckCircle className="w-7 h-7 text-white" /> : <XCircle className="w-7 h-7 text-white" />}
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-xl">{isCorrect ? 'Correct! Well spotted.' : 'Not quite — here\'s the breakdown.'}</p>
            <p className="text-white/70 text-sm">
              {isCorrect ? `+${currentCP.xpValue} XP earned` : 'Partial XP awarded · Keep training to sharpen your eye'}
            </p>
          </div>
          <div className="text-center bg-white/15 border border-white/20 rounded-xl px-4 py-2">
            <div className="text-white font-black text-2xl">+{questionResults[questionResults.length - 1] !== undefined ? (isCorrect ? currentCP.xpValue : '—') : 0}</div>
            <div className="text-white/60 text-xs">XP</div>
          </div>
        </div>

        {currentCP.type === 'mcq' && currentCP.options && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Correct Answer</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 font-medium flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              {currentCP.options[currentCP.correctIndex!]}
            </div>
            {!isCorrect && selectedAnswer !== null && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>You selected: {currentCP.options[selectedAnswer]}</span>
              </div>
            )}
          </div>
        )}

        {currentCP.type === 'redflag' && currentCP.correctFlags && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Red Flags Breakdown</p>
            {(() => {
              const flags = currentCP.correctFlags ?? [];
              const tp = flags.filter(f => selectedFlags.has(f)).length;
              const fp = [...selectedFlags].filter(f => !flags.includes(f)).length;
              return (
                <div className="flex gap-3 text-sm">
                  <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <div className="font-black text-green-600 text-xl">{tp}/{flags.length}</div>
                    <div className="text-gray-600 text-xs">Correct flags</div>
                  </div>
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                    <div className="font-black text-red-600 text-xl">{fp}</div>
                    <div className="text-gray-600 text-xs">False positives</div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {currentCP.type === 'whatnext' && currentCP.whatNextOptions && selectedWhatNext !== null && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Choice</p>
            <div className={`rounded-xl p-4 text-sm font-medium flex items-start gap-3 ${currentCP.whatNextOptions[selectedWhatNext].safe ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {currentCP.whatNextOptions[selectedWhatNext].safe ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold mb-1">{currentCP.whatNextOptions[selectedWhatNext].text}</p>
                <p className="font-normal opacity-80">{currentCP.whatNextOptions[selectedWhatNext].explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">AI Analysis</span>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-gray-700 text-sm leading-relaxed">{currentCP.explanation}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Manipulation Tactics</p>
                <div className="space-y-1.5">
                  {currentCP.tactics.map(t => <div key={t} className="flex items-center gap-2 text-xs text-gray-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />{t}</div>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Recommended Actions</p>
                <div className="space-y-1.5">
                  {currentCP.actions.map((a, i) => <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />{a}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={continueAfterFeedback}
          className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all">
          {checkpointIdx + 1 >= (scenario?.checkpoints.length ?? 0)
            ? <><Trophy className="w-5 h-5" /> Complete Mission</>
            : <><Play className="w-5 h-5 fill-white" /> Continue Watching</>}
        </button>
      </div>
    );
  }

  // ── MISSION COMPLETE ─────────────────────────────────────────────────────────

  if (view === 'complete' && scenario) {
    const totalPossible = scenario.checkpoints.reduce((s, c) => s + c.xpValue, 0) || 1;
    const accuracy = Math.round((xpEarned / totalPossible) * 100);
    const rank: 'S'|'A'|'B'|'C' = accuracy >= 90 ? 'S' : accuracy >= 75 ? 'A' : accuracy >= 60 ? 'B' : 'C';
    const rankColor = { S: 'text-yellow-500', A: 'text-green-500', B: 'text-blue-500', C: 'text-gray-400' }[rank];
    const nextScenario = SCENARIOS.find(s => isUnlocked(s) && s.id !== scenario.id && !scenarioProgress[s.id]?.first_completed_at);
    const recs = generateRecommendations(questionResults, scenario.category);

    return (
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* Trophy header */}
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => <Shield key={i} className="absolute text-white" style={{ width: 40 + i * 20, height: 40 + i * 20, left: `${i * 22}%`, top: `${(i % 2) * 40}%`, transform: `rotate(${i * 25}deg)` }} />)}
          </div>
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 border-4 border-white/40 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-yellow-300" />
            </div>
            <p className="text-white/70 text-sm uppercase tracking-widest mb-1">Mission Complete</p>
            <h1 className="text-white mb-2">{scenario.title}</h1>
            <div className={`text-6xl font-black ${rankColor} mb-1`}>{rank}</div>
            <p className="text-white/60 text-sm">Rank</p>
            {savingComplete && <div className="flex items-center justify-center gap-2 mt-3 text-white/60 text-xs"><Loader2 className="w-3 h-3 animate-spin" />Saving progress…</div>}
            {completeResult?.is_first_completion && !savingComplete && (
              <div className="mt-3 bg-white/15 border border-white/20 rounded-xl px-4 py-2 inline-flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>+{completeResult.xp_awarded} XP awarded to your profile!</span>
              </div>
            )}
            {!completeResult?.is_first_completion && completeResult !== null && !savingComplete && (
              <div className="mt-3 bg-white/10 border border-white/15 rounded-xl px-4 py-2 inline-flex items-center gap-2 text-sm text-white/60">
                <RotateCcw className="w-4 h-4" />
                <span>Replay — XP already awarded on first completion</span>
              </div>
            )}
          </div>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Score', value: xpEarned.toString(), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
            { label: 'XP Gained', value: completeResult?.is_first_completion ? `+${completeResult.xp_awarded}` : `+0`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
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
        {completeResult?.is_first_completion && (
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
              <p className="text-gray-500 text-xs">Awarded for completing {scenario.title} for the first time</p>
            </div>
            <div className="text-3xl">🏅</div>
          </div>
        )}

        {/* Personalised recommendations based on session results */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="font-semibold text-gray-900 text-sm">Personalised Recommendations</p>
          </div>
          <div className="space-y-2">
            {recs.map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800">
                <span>{['🎯','🚩','📱'][i]}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => startScenario(scenario)}
            className="flex items-center justify-center gap-2 py-3.5 border-2 border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> Replay Mission
          </button>
          {nextScenario ? (
            <button onClick={() => startScenario(nextScenario)}
              className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">
              Next Mission <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={reset}
              className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">
              <Layers className="w-4 h-4" /> Back to Academy
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
