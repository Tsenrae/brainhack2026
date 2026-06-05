import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, Subtitles, Maximize2, RotateCcw,
  ChevronDown, Plus, Trash2, CheckCircle, XCircle, AlertTriangle,
  Clock, Zap, Award, Eye, MessageSquare, Newspaper, Heart, QrCode,
  Shield, Sparkles, Send, Save, BookOpen, Flag, FileText,
  Layers, Settings, ToggleLeft, ToggleRight, RefreshCw,
  List, Film, Mic, Users, BarChart2, ArrowRight, Info,
  Star, Wand2, Loader, Check, Circle, GripVertical,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Category = 'Deepfakes' | 'Scam Chats' | 'Fake News' | 'Cyberbullying' | 'QR Scams';
type Tone = 'serious' | 'friendly' | 'dramatic' | 'classroom';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type QuestionType = 'mcq' | 'redflag' | 'whatnext' | 'dragdrop';
type GenPhase = 'idle' | 'scripting' | 'script-done' | 'generating' | 'video-done';
type CenterTab = 'preview' | 'transcript' | 'scenes';
type PublishStatus = 'draft' | 'review' | 'approved' | 'published';
type CheckStatus = 'pending' | 'pass' | 'warn' | 'fail';

interface Checkpoint {
  id: number;
  timestamp: string;
  label: string;
  type: QuestionType;
  question: string;
  xp: number;
  badge: string;
}

interface SafetyCheck {
  id: string;
  label: string;
  description: string;
  status: CheckStatus;
  note?: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = ['Deepfakes', 'Scam Chats', 'Fake News', 'Cyberbullying', 'QR Scams'];
const AGE_GROUPS = ['13–15 (Secondary)', '16–18 (JC / Poly)', '19–25 (Young Adults)', 'All ages'];
const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: 'serious', label: 'Serious', desc: 'Authoritative & informative' },
  { value: 'friendly', label: 'Friendly', desc: 'Approachable & conversational' },
  { value: 'dramatic', label: 'Dramatic', desc: 'High-stakes tension' },
  { value: 'classroom', label: 'Classroom', desc: 'Guided & educational' },
];
const BADGES = ['Deepfake Detective', 'Scam Slayer', 'QR Guardian', 'Kindness Champion', 'Spin Spotter', 'Ripple Breaker', 'Truth Guardian', 'Squad Strategist'];
const Q_TYPES: { value: QuestionType; label: string; icon: React.ElementType }[] = [
  { value: 'mcq', label: 'Multiple Choice', icon: List },
  { value: 'redflag', label: 'Spot the Red Flag', icon: Flag },
  { value: 'whatnext', label: 'What Would You Do?', icon: ArrowRight },
  { value: 'dragdrop', label: 'Drag & Drop Evidence', icon: GripVertical },
];

const GENERATED_SCRIPT = `SCENE 1 — OPEN (0:00–0:18)
A social media feed scrolls rapidly. A viral video of "Minister Chen" appears — shot in an official-looking office. He speaks urgently about an "emergency relief grant."

NARRATOR (V.O.): "It's 7:42 PM. You scroll past something alarming — a government minister, on camera, urging Singaporeans to act immediately..."

SCENE 2 — ZOOM IN (0:18–0:45)
Close-up on the minister's face. A subtle shimmer appears at the jawline. The voice continues — but the lip movements are slightly ahead of the words.

CAPTION ON SCREEN: "Transfer S$50 NOW to claim your S$2,000 relief grant. Offer expires in 24 hours. DO NOT share this message."

SCENE 3 — CHECKPOINT PAUSE (0:45)
[MISSION CHECKPOINT 1]
The video freezes. Red brackets highlight the jawline. The question panel appears.

SCENE 4 — REVEAL (0:46–1:20)
Expert analysis overlays appear — highlighting the facial boundary artefact, audio-video desync markers, and the impossibility of the government messaging pattern.

SCENE 5 — OUTRO (1:20–1:35)
Infographic: "3 Signs of a Deepfake." Official ScamShield hotline appears. Mission summary loads.`;

const TRANSCRIPT_LINES = [
  { time: '0:00', speaker: 'Narrator', text: "It's 7:42 PM. You scroll past something alarming..." },
  { time: '0:08', speaker: 'Narrator', text: 'A government minister, on camera, urging Singaporeans to act immediately.' },
  { time: '0:18', speaker: 'Minister (AI)', text: 'Citizens, the government has approved an emergency relief package.' },
  { time: '0:28', speaker: 'Minister (AI)', text: 'Transfer S$50 to verify your account and receive S$2,000 within 24 hours.' },
  { time: '0:38', speaker: 'Caption', text: 'DO NOT share this message. Government policy.' },
  { time: '0:45', speaker: '[CHECKPOINT 1]', text: '— Mission pause triggered —' },
  { time: '0:46', speaker: 'Analyst', text: 'Notice the shimmer at the jawline? That\'s a deepfake boundary artefact.' },
  { time: '1:00', speaker: 'Analyst', text: 'The lip movements are 3 frames ahead of the audio track.' },
  { time: '1:15', speaker: 'Narrator', text: 'Real governments never request payments via social media.' },
  { time: '1:25', speaker: 'Narrator', text: 'If you see this — report it to ScamShield or call 1800-722-6688.' },
];

const SCENES = [
  { id: 1, label: 'OPEN', start: '0:00', end: '0:18', desc: 'Social feed scroll — viral deepfake video appears', hasCheckpoint: false },
  { id: 2, label: 'ZOOM IN', start: '0:18', end: '0:45', desc: 'Close-up reveals jawline shimmer and lip-sync desync', hasCheckpoint: false },
  { id: 3, label: 'CHECKPOINT', start: '0:45', end: '0:46', desc: 'Mission pause — Question 1 triggered', hasCheckpoint: true },
  { id: 4, label: 'REVEAL', start: '0:46', end: '1:20', desc: 'Expert analysis overlays — red flags annotated', hasCheckpoint: false },
  { id: 5, label: 'OUTRO', start: '1:20', end: '1:35', desc: 'Infographic summary + hotline + XP reward', hasCheckpoint: false },
];

const INITIAL_CHECKS: SafetyCheck[] = [
  { id: 'factual', label: 'Factual Accuracy', description: 'Claims verified against MHA, CSA, and IMDA guidelines', status: 'pending' },
  { id: 'harmful', label: 'Harmful Content', description: 'No instructions enabling real scams or harms', status: 'pending' },
  { id: 'pii', label: 'Privacy & PII', description: 'No real personal data, faces, or identifiers used', status: 'pending' },
  { id: 'bias', label: 'Bias & Fairness', description: 'No racial, gender, or socioeconomic stereotyping', status: 'pending' },
  { id: 'age', label: 'Age Appropriateness', description: 'Content suitable for selected age group', status: 'pending' },
  { id: 'sensitivity', label: 'Cyberbullying Sensitivity', description: 'Supportive framing — does not trivialise impact', status: 'pending' },
  { id: 'realism', label: 'Scam Realism Safety', description: 'Realistic enough to teach — not enough to replicate', status: 'pending' },
  { id: 'a11y', label: 'Accessibility', description: 'Captions, transcript, and audio descriptions present', status: 'pending' },
];

const CHECKED_RESULTS: Partial<Record<string, CheckStatus>> = {
  factual: 'pass', harmful: 'pass', pii: 'warn', bias: 'pass',
  age: 'pass', sensitivity: 'pass', realism: 'warn', a11y: 'pass',
};
const CHECK_NOTES: Partial<Record<string, string>> = {
  pii: 'AI face model resembles a public figure — recommend replacing with synthetic character.',
  realism: 'Payment flow is convincing — watermark "TRAINING ONLY" overlay recommended.',
};

// ── Small helpers ─────────────────────────────────────────────────────────────

function Select({ label, value, onChange, options }: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-8"
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, rows }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      )}
    </div>
  );
}

function StatusChip({ status }: { status: CheckStatus }) {
  const map = {
    pending: { label: 'Pending', cls: 'bg-gray-100 text-gray-500 border-gray-200', icon: Circle },
    pass: { label: 'Pass', cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
    warn: { label: 'Warning', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle },
    fail: { label: 'Fail', cls: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  }[status];
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${map.cls}`}>
      <map.icon className="w-3 h-3" />
      {map.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AdminVideoStudio() {
  // Form state
  const [title, setTitle] = useState('Operation: Face Swap');
  const [category, setCategory] = useState<Category>('Deepfakes');
  const [ageGroup, setAgeGroup] = useState(AGE_GROUPS[1]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Hard');
  const [objective, setObjective] = useState('Identify AI deepfake artefacts in a viral video and apply the correct reporting procedure.');
  const [prompt, setPrompt] = useState('A viral deepfake video of a Singapore government official spreads on social media, urging citizens to transfer money for a fake relief grant. Show the AI face-swap artefacts, audio desync, and urgent-payment red flags.');
  const [tone, setTone] = useState<Tone>('dramatic');
  const [duration, setDuration] = useState('90 seconds');

  // Generation state
  const [phase, setPhase] = useState<GenPhase>('idle');
  const [scriptProgress, setScriptProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Center tabs
  const [centerTab, setCenterTab] = useState<CenterTab>('preview');

  // Checkpoints
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { id: 1, timestamp: '0:45', label: 'Deepfake Detection', type: 'mcq', question: 'What does the jawline shimmer indicate?', xp: 100, badge: 'Deepfake Detective' },
    { id: 2, timestamp: '1:05', label: 'Red Flags in Text', type: 'redflag', question: 'Tap all manipulation phrases in the on-screen caption.', xp: 120, badge: 'Spin Spotter' },
  ]);
  const [editingCP, setEditingCP] = useState<number | null>(null);

  // Safety checks
  const [checks, setChecks] = useState<SafetyCheck[]>(INITIAL_CHECKS);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [humanRequired, setHumanRequired] = useState(true);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('draft');

  // Video playback sim
  useEffect(() => {
    if (isPlaying && phase === 'video-done') {
      progressRef.current = setInterval(() => {
        setPlayhead(p => {
          if (p >= 100) { clearInterval(progressRef.current!); setIsPlaying(false); return 100; }
          return p + 0.5;
        });
      }, 75);
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [isPlaying, phase]);

  function runScriptGen() {
    setPhase('scripting');
    setScriptProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 4 + Math.random() * 6;
      setScriptProgress(Math.min(p, 100));
      if (p >= 100) { clearInterval(iv); setPhase('script-done'); }
    }, 120);
  }

  function runVideoGen() {
    setPhase('generating');
    setVideoProgress(0);
    setChecks(INITIAL_CHECKS);
    setAiScore(null);
    let p = 0;
    const iv = setInterval(() => {
      p += 1.5 + Math.random() * 2.5;
      setVideoProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setPhase('video-done');
        setPlayhead(0);
        // Run safety checks with staggered reveals
        INITIAL_CHECKS.forEach((c, i) => {
          setTimeout(() => {
            setChecks(prev => prev.map(ch =>
              ch.id === c.id
                ? { ...ch, status: CHECKED_RESULTS[c.id] ?? 'pass', note: CHECK_NOTES[c.id] }
                : ch
            ));
            if (i === INITIAL_CHECKS.length - 1) setAiScore(87);
          }, 400 + i * 350);
        });
      }
    }, 80);
  }

  function addCheckpoint() {
    const id = Date.now();
    setCheckpoints(prev => [...prev, {
      id, timestamp: '1:10', label: 'New Checkpoint',
      type: 'mcq', question: '', xp: 80, badge: BADGES[0],
    }]);
    setEditingCP(id);
  }

  function removeCheckpoint(id: number) {
    setCheckpoints(prev => prev.filter(c => c.id !== id));
    if (editingCP === id) setEditingCP(null);
  }

  function updateCP(id: number, patch: Partial<Checkpoint>) {
    setCheckpoints(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }

  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const allDone = checks.every(c => c.status !== 'pending');

  const catIcon: Record<Category, React.ElementType> = {
    'Deepfakes': Eye, 'Scam Chats': MessageSquare,
    'Fake News': Newspaper, 'Cyberbullying': Heart, 'QR Scams': QrCode,
  };
  const CatIcon = catIcon[category];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full overflow-hidden bg-gray-50">

      {/* ══ LEFT PANEL — Generation Form ══════════════════════════════════════ */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Video Generator</p>
            <p className="text-gray-400 text-xs">AI scenario studio</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <Field label="Scenario Title" placeholder="e.g. Operation: Face Swap" value={title} onChange={setTitle} />

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
            <div className="grid grid-cols-1 gap-1.5">
              {CATEGORIES.map(c => {
                const Icon = catIcon[c];
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all text-left ${
                      category === c
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <Select label="Target Age Group" value={ageGroup} onChange={setAgeGroup} options={AGE_GROUPS} />
          <Select label="Difficulty Level" value={difficulty} onChange={v => setDifficulty(v as Difficulty)} options={['Easy', 'Medium', 'Hard']} />

          <Field label="Learning Objective" placeholder="What should users be able to do after this scenario?" value={objective} onChange={setObjective} rows={3} />

          <Field label="Scenario Prompt" placeholder="Describe the scene, threat, characters, and what happens..." value={prompt} onChange={setPrompt} rows={5} />

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tone</label>
            <div className="grid grid-cols-2 gap-1.5">
              {TONES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`text-left p-2.5 rounded-xl border transition-all ${
                    tone === t.value
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-red-200'
                  }`}
                >
                  <p className="font-semibold text-xs">{t.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Select label="Estimated Duration" value={duration} onChange={setDuration}
            options={['30 seconds', '60 seconds', '90 seconds', '2 minutes', '3 minutes', '5 minutes']} />

          {/* Script gen progress */}
          {phase === 'scripting' && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2 text-purple-700 text-xs font-semibold">
                <Loader className="w-3.5 h-3.5 animate-spin" /> Generating script…
              </div>
              <div className="w-full bg-purple-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${scriptProgress}%` }} />
              </div>
              <p className="text-purple-500 text-xs mt-1">{Math.round(scriptProgress)}% complete</p>
            </div>
          )}
          {(phase === 'script-done' || phase === 'generating' || phase === 'video-done') && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" /> Script generated
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-4 border-t border-gray-100 space-y-2 flex-shrink-0">
          <button
            onClick={runScriptGen}
            disabled={phase === 'scripting'}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
          >
            {phase === 'scripting' ? <Loader className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Script
          </button>
          <button
            onClick={runVideoGen}
            disabled={phase === 'idle' || phase === 'scripting' || phase === 'generating'}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {phase === 'generating'
              ? <><Loader className="w-4 h-4 animate-spin" /> Generating… {Math.round(videoProgress)}%</>
              : <><Film className="w-4 h-4" /> Generate Video</>
            }
          </button>
        </div>
      </div>

      {/* ══ CENTER PANEL — Preview + Mission Builder ═══════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Center panel header */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {([
              { key: 'preview', label: 'Preview', icon: Play },
              { key: 'transcript', label: 'Transcript', icon: Mic },
              { key: 'scenes', label: 'Scenes', icon: Layers },
            ] as { key: CenterTab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCenterTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  centerTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {phase === 'video-done' && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-400">{title}</span>
              <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Video Ready
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── Video player ── */}
          <div className="bg-gray-950 rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '16/9', maxHeight: '340px' }}>
            {phase === 'idle' || phase === 'scripting' || phase === 'script-done' ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-8 gap-3">
                {phase === 'idle' && (
                  <>
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Film className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-white/40 text-sm">Fill in the form and generate a script to begin</p>
                  </>
                )}
                {phase === 'scripting' && (
                  <>
                    <Loader className="w-10 h-10 text-purple-400 animate-spin" />
                    <p className="text-white/60 text-sm">Writing scenario script…</p>
                    <div className="w-48 bg-white/10 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${scriptProgress}%` }} />
                    </div>
                  </>
                )}
                {phase === 'script-done' && (
                  <>
                    <CheckCircle className="w-10 h-10 text-green-400" />
                    <p className="text-white/70 text-sm font-semibold">Script ready — click Generate Video</p>
                    <p className="text-white/40 text-xs">AI will render 5 scenes · ~{duration}</p>
                  </>
                )}
              </div>
            ) : phase === 'generating' ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-8 gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin" />
                  <Wand2 className="absolute inset-0 m-auto w-7 h-7 text-white/60" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-semibold mb-1">Rendering AI scenario video…</p>
                  <p className="text-white/40 text-xs">Generating faces · Compositing scenes · Adding subtitles</p>
                </div>
                <div className="w-64">
                  <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                    <div className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                  </div>
                  <p className="text-white/40 text-xs">{Math.round(videoProgress)}% complete</p>
                </div>
              </div>
            ) : (
              // video-done — simulated player
              <div className="h-full relative flex flex-col">
                {/* Scene bg */}
                <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.3) 2px,rgba(255,255,255,.3) 4px)' }} />
                  <div className="text-center px-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <CatIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-mono mb-1">AI SCENARIO · {category.toUpperCase()}</p>
                    <p className="text-white font-bold">{title}</p>
                  </div>
                  {/* Checkpoint markers on scene */}
                  {checkpoints.map(cp => (
                    <div key={cp.id} className="absolute top-2 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-gray-950"
                      style={{ left: `${(parseInt(cp.timestamp.split(':')[1]) / 90) * 100}%` }} />
                  ))}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 rounded-lg px-2 py-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-xs font-bold">AI GENERATED</span>
                  </div>
                  {isPlaying && (
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center px-6">
                      <div className="bg-black/70 backdrop-blur text-white text-xs px-4 py-1.5 rounded-lg">
                        {TRANSCRIPT_LINES[Math.floor((playhead / 100) * TRANSCRIPT_LINES.length)]?.text ?? ''}
                      </div>
                    </div>
                  )}
                </div>
                {/* Controls */}
                <div className="bg-gray-950 px-4 pb-3 pt-2">
                  <div className="w-full h-1.5 bg-white/10 rounded-full mb-2 cursor-pointer relative">
                    <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${playhead}%` }} />
                    {checkpoints.map(cp => (
                      <div key={cp.id} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-950 -translate-x-1/2 cursor-pointer"
                        style={{ left: `${(parseInt(cp.timestamp.split(':')[1]) / 90) * 100}%` }} title={`CP: ${cp.label}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(p => !p)} className="text-white hover:text-red-400 transition-colors">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <span className="text-white/50 text-xs font-mono">{Math.floor(playhead * 0.9)}s / 90s</span>
                    <div className="flex-1" />
                    <button className="text-white/50 hover:text-white transition-colors"><Volume2 className="w-4 h-4" /></button>
                    <button className="text-white/50 hover:text-white transition-colors"><Subtitles className="w-4 h-4" /></button>
                    <button onClick={() => { setPlayhead(0); setIsPlaying(false); }} className="text-white/50 hover:text-white transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="text-white/50 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Regenerate bar */}
          {phase === 'video-done' && (
            <div className="flex gap-2">
              {SCENES.map(s => (
                <button key={s.id} className="flex-1 bg-white border border-gray-200 rounded-xl px-2 py-2 text-center hover:border-red-300 hover:bg-red-50 transition-colors group">
                  <p className="text-xs font-bold text-gray-700 group-hover:text-red-700">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.start}</p>
                  <RefreshCw className="w-3 h-3 text-gray-300 group-hover:text-red-500 mx-auto mt-1 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* ── Transcript tab ── */}
          {centerTab === 'transcript' && phase === 'video-done' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="font-semibold text-gray-900 text-sm flex items-center gap-2"><Mic className="w-4 h-4 text-red-600" />Full Transcript</p>
                <button className="text-xs text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"><FileText className="w-3 h-3" />Export</button>
              </div>
              <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
                {TRANSCRIPT_LINES.map((l, i) => (
                  <div key={i} className={`flex gap-3 text-sm ${l.speaker.startsWith('[') ? 'opacity-50' : ''}`}>
                    <span className="text-gray-400 font-mono text-xs w-10 flex-shrink-0 pt-0.5">{l.time}</span>
                    <span className="font-semibold text-red-600 text-xs w-24 flex-shrink-0 pt-0.5">{l.speaker}</span>
                    <span className="text-gray-700 flex-1">{l.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Scenes tab ── */}
          {centerTab === 'scenes' && phase === 'video-done' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900 text-sm flex items-center gap-2"><Layers className="w-4 h-4 text-red-600" />Scene Breakdown</p>
              </div>
              <div className="divide-y divide-gray-50">
                {SCENES.map(s => (
                  <div key={s.id} className="flex items-center gap-4 px-4 py-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${s.hasCheckpoint ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                      {s.hasCheckpoint ? <Flag className="w-4 h-4" /> : s.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{s.label}</span>
                        {s.hasCheckpoint && <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5 font-semibold">Checkpoint</span>}
                      </div>
                      <p className="text-gray-400 text-xs">{s.desc}</p>
                    </div>
                    <div className="text-xs text-gray-400 font-mono flex-shrink-0">{s.start} – {s.end}</div>
                    <button className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-mono">{GENERATED_SCRIPT}</pre>
              </div>
            </div>
          )}

          {/* ── Mission Builder ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-600" />
                <p className="font-bold text-gray-900 text-sm">Mission Checkpoints</p>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{checkpoints.length}</span>
              </div>
              <button
                onClick={addCheckpoint}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Checkpoint
              </button>
            </div>

            {/* Timeline visual */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 rounded-full" />
                {checkpoints.map((cp, i) => {
                  const pct = (parseInt(cp.timestamp.split(':')[1]) / 90) * 100;
                  return (
                    <div key={cp.id} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: `${pct}%` }}>
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow">{i + 1}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0:00</span><span>0:45</span><span>1:30</span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {checkpoints.map((cp, idx) => (
                <div key={cp.id} className={`border rounded-2xl overflow-hidden transition-all ${editingCP === cp.id ? 'border-red-300 shadow-sm' : 'border-gray-200'}`}>
                  {/* CP header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setEditingCP(editingCP === cp.id ? null : cp.id)}
                  >
                    <div className="w-7 h-7 bg-red-600 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{cp.label}</span>
                        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{cp.timestamp}</span>
                        <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                          cp.type === 'mcq' ? 'bg-purple-100 text-purple-700' :
                          cp.type === 'redflag' ? 'bg-red-100 text-red-700' :
                          cp.type === 'whatnext' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {Q_TYPES.find(q => q.value === cp.type)?.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs truncate">{cp.question || 'No question yet'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs text-orange-600 font-semibold"><Zap className="w-3 h-3" />+{cp.xp}</span>
                      <button onClick={e => { e.stopPropagation(); removeCheckpoint(cp.id); }}
                        className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* CP editor */}
                  {editingCP === cp.id && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Checkpoint Label" placeholder="e.g. Deepfake Detection" value={cp.label} onChange={v => updateCP(cp.id, { label: v })} />
                        <Field label="Timestamp" placeholder="0:45" value={cp.timestamp} onChange={v => updateCP(cp.id, { timestamp: v })} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Question Type</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {Q_TYPES.map(qt => (
                            <button key={qt.value} onClick={() => updateCP(cp.id, { type: qt.value })}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${cp.type === qt.value ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-red-200'}`}>
                              <qt.icon className="w-3.5 h-3.5 flex-shrink-0" />{qt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Field label="Question" placeholder="What does the user need to identify?" value={cp.question} onChange={v => updateCP(cp.id, { question: v })} rows={2} />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">XP Reward</label>
                          <div className="flex items-center gap-2">
                            <input type="range" min={20} max={300} step={10} value={cp.xp}
                              onChange={e => updateCP(cp.id, { xp: Number(e.target.value) })}
                              className="flex-1 accent-red-600" />
                            <span className="text-sm font-bold text-orange-600 w-10 text-right">+{cp.xp}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Badge Reward</label>
                          <div className="relative">
                            <select value={cp.badge} onChange={e => updateCP(cp.id, { badge: e.target.value })}
                              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 pr-6">
                              {BADGES.map(b => <option key={b}>{b}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {checkpoints.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <Flag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No checkpoints yet — click Add Checkpoint
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Safety Checks + Publishing ═══════════════════════════ */}
      <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Safety & Quality</p>
            <p className="text-gray-400 text-xs">Review before publish</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          {/* AI Confidence score */}
          <div className={`rounded-2xl p-4 border ${aiScore !== null ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600">AI Confidence Score</p>
              {aiScore !== null && (
                <span className="text-xs font-bold text-green-600 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">
                  {aiScore}/100
                </span>
              )}
            </div>
            {aiScore !== null ? (
              <>
                <div className="w-full bg-green-200 rounded-full h-2.5 mb-1.5">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all" style={{ width: `${aiScore}%` }} />
                </div>
                <p className="text-xs text-green-700 font-medium">Strong — ready for human review</p>
              </>
            ) : (
              <p className="text-xs text-gray-400">Generate video to run analysis</p>
            )}
          </div>

          {/* Check summary */}
          {allDone && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl p-2">
                <p className="font-black text-green-600 text-lg">{passCount}</p>
                <p className="text-green-600 text-xs">Pass</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2">
                <p className="font-black text-amber-600 text-lg">{warnCount}</p>
                <p className="text-amber-600 text-xs">Warn</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-2">
                <p className="font-black text-red-600 text-lg">{failCount}</p>
                <p className="text-red-600 text-xs">Fail</p>
              </div>
            </div>
          )}

          {/* Safety checklist */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Safety Checks</p>
            <div className="space-y-2">
              {checks.map(c => (
                <div key={c.id} className={`rounded-xl border p-3 transition-all ${
                  c.status === 'pass' ? 'bg-green-50 border-green-200' :
                  c.status === 'warn' ? 'bg-amber-50 border-amber-200' :
                  c.status === 'fail' ? 'bg-red-50 border-red-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">{c.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.description}</p>
                      {c.note && (
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed flex items-start gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          {c.note}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 mt-0.5">
                      <StatusChip status={c.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Human review toggle */}
          <div className={`rounded-2xl border p-4 ${humanRequired ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Human Review Required</p>
                <p className="text-xs text-gray-500 mt-0.5">Requires approval before publish</p>
              </div>
              <button onClick={() => setHumanRequired(r => !r)} className="flex-shrink-0">
                {humanRequired
                  ? <ToggleRight className="w-8 h-8 text-red-600" />
                  : <ToggleLeft className="w-8 h-8 text-gray-400" />}
              </button>
            </div>
            {humanRequired && (
              <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                <Info className="w-3 h-3" /> Assigned to: admin@shieldverse.sg
              </p>
            )}
          </div>

          {/* Video metadata summary */}
          {phase === 'video-done' && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Video Summary</p>
              {[
                { label: 'Title', value: title },
                { label: 'Category', value: category },
                { label: 'Age Group', value: ageGroup },
                { label: 'Difficulty', value: difficulty },
                { label: 'Duration', value: duration },
                { label: 'Checkpoints', value: `${checkpoints.length} missions` },
                { label: 'Tone', value: tone.charAt(0).toUpperCase() + tone.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-semibold text-gray-700 text-right max-w-[55%] truncate">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Publishing workflow ── */}
        <div className="p-4 border-t border-gray-100 space-y-2 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Publishing Workflow</p>

          {/* Status pills */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {(['draft', 'review', 'approved', 'published'] as PublishStatus[]).map((s, i) => {
              const reached = ['draft', 'review', 'approved', 'published'].indexOf(publishStatus) >= i;
              return (
                <div key={s} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${
                  publishStatus === s
                    ? 'bg-red-600 border-red-600 text-white'
                    : reached
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                  {reached ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setPublishStatus('draft')}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition-colors text-sm"
          >
            <Save className="w-4 h-4" /> Save as Draft
          </button>
          <button
            onClick={() => setPublishStatus('review')}
            disabled={phase !== 'video-done'}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-semibold rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" /> Send for Review
          </button>
          <button
            onClick={() => setPublishStatus('approved')}
            disabled={publishStatus !== 'review' && publishStatus !== 'approved'}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-blue-400 text-blue-700 hover:bg-blue-50 font-semibold rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
          <button
            onClick={() => setPublishStatus('published')}
            disabled={publishStatus !== 'approved'}
            className={`w-full flex items-center justify-center gap-2 py-2.5 font-bold rounded-xl transition-all text-sm ${
              publishStatus === 'approved'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Publish to Scenario Academy
          </button>

          {publishStatus === 'published' && (
            <div className="bg-green-50 border border-green-300 rounded-xl p-3 flex items-center gap-2 text-green-700 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Live in Scenario Academy!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
