import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { groqClient, isGroqEnabled, GROQ_MODEL } from '../config/groq.js';
import { usersService } from './users.service.js';
import { badgesService } from './badges.service.js';
import type {
  ScanType, ThreatLevel, ScanResult, ScanHistoryItem, ScannerStats,
  SuspiciousElement, ScanRedFlag, RecommendedAction, AnalysisBreakdown,
} from '../types/scanner.types.js';

const XP_PER_SCAN = 30;
const XP_THREAT_BONUS = 20;

// ── System prompt ──────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a cybersecurity threat analyst specialising in Singapore digital threats. Analyse the provided content for scams, phishing, misinformation, deepfakes, and other threats targeting Singapore users.

Return ONLY a valid JSON object with this exact structure — no markdown, no commentary, just raw JSON:
{
  "risk_score": <integer 0–100>,
  "threat_level": <"safe"|"low"|"suspicious"|"high"|"critical">,
  "classification": <"Safe"|"Low Risk"|"Suspicious"|"Phishing"|"Scam"|"Misinformation"|"Deepfake">,
  "confidence_score": <integer 50–99>,
  "suspicious_elements": [
    {
      "element": <string: name of the suspicious element>,
      "location": <string: where in the content — e.g. "Message body", "URL", "Sender field">,
      "severity": <"CRITICAL"|"HIGH"|"MEDIUM"|"LOW">,
      "description": <string: concise description of what was found, max 100 chars>
    }
  ],
  "red_flags": [
    {
      "title": <string: category name, e.g. "Urgency Pressure">,
      "description": <string: why this pattern is dangerous>,
      "examples": [<string: quoted text or pattern found in the content, 2–4 items>],
      "severity": <"CRITICAL"|"HIGH"|"MEDIUM"|"LOW">
    }
  ],
  "recommended_actions": [
    {
      "action": <string: short action title>,
      "description": <string: specific guidance>,
      "priority": <"CRITICAL"|"HIGH"|"MEDIUM"|"RECOMMENDED">
    }
  ],
  "analysis_breakdown": {
    "pattern_matches": <integer: number of suspicious patterns found>,
    "manipulation_tactics": <integer: number of psychological manipulation tactics found>,
    "match_rate_pct": <integer 0–99: how closely this resembles known threats>
  }
}

Risk score calibration:
- 0–20: Safe — no meaningful threat signals
- 21–40: Low — minor signals, likely benign
- 41–60: Suspicious — multiple warning signs, investigate further
- 61–80: High — strong threat indicators, likely malicious
- 81–100: Critical — clear scam, phishing, or fraud

Singapore-specific threats to detect:
- CPF / HDB / IRAS / MOM / MOH government impersonation
- DBS / OCBC / UOB / POSB / Standard Chartered bank phishing
- Telegram or WhatsApp investment scams ("guaranteed returns", "trading group")
- Job scams ("part-time work from home", "$300/day", "click like to earn")
- Love scams (building emotional trust before requesting money)
- SingPass / Myinfo credential phishing
- Fake GST voucher, CDC voucher, or government grant claims
- Misinformation about local news, policies, or public figures
- URLs impersonating gov.sg domains (g0v.sg, gov-sg.xyz, etc.)

Rules:
- suspicious_elements: include up to 5, sorted by severity descending
- red_flags: include only categories that actually apply (0–5)
- recommended_actions: always include at least 2, max 6
- If content is clearly safe, return risk_score ≤ 20 and empty suspicious_elements and red_flags arrays
- Never hallucinate threat signals that are not present in the content`;

// ── Groq analysis ──────────────────────────────────────────────────────────────

interface LLMAnalysis {
  risk_score: number;
  threat_level: ThreatLevel;
  classification: string;
  confidence_score: number;
  suspicious_elements: SuspiciousElement[];
  red_flags: ScanRedFlag[];
  recommended_actions: RecommendedAction[];
  analysis_breakdown: AnalysisBreakdown;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function coerceSeverity(s: unknown): SuspiciousElement['severity'] {
  return ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(s as string)
    ? (s as SuspiciousElement['severity'])
    : 'MEDIUM';
}

function coercePriority(p: unknown): RecommendedAction['priority'] {
  return ['CRITICAL', 'HIGH', 'MEDIUM', 'RECOMMENDED'].includes(p as string)
    ? (p as RecommendedAction['priority'])
    : 'MEDIUM';
}

function validateLLMResponse(raw: unknown): LLMAnalysis {
  const r = raw as Record<string, unknown>;

  const riskScore = clamp(Number(r.risk_score ?? 0), 0, 100);

  const validLevels = ['safe', 'low', 'suspicious', 'high', 'critical'];
  const threatLevel = validLevels.includes(r.threat_level as string)
    ? (r.threat_level as string)
    : riskScore <= 20 ? 'safe' : riskScore <= 40 ? 'low' : riskScore <= 60 ? 'suspicious' : riskScore <= 80 ? 'high' : 'critical';

  const elements: SuspiciousElement[] = Array.isArray(r.suspicious_elements)
    ? (r.suspicious_elements as Record<string, unknown>[]).slice(0, 5).map(e => ({
        element:     String(e.element     ?? 'Suspicious element'),
        location:    String(e.location    ?? 'Content'),
        severity:    coerceSeverity(e.severity),
        description: String(e.description ?? ''),
      }))
    : [];

  const flags: ScanRedFlag[] = Array.isArray(r.red_flags)
    ? (r.red_flags as Record<string, unknown>[]).slice(0, 5).map(f => ({
        title:       String(f.title       ?? 'Red flag'),
        description: String(f.description ?? ''),
        examples:    Array.isArray(f.examples) ? (f.examples as unknown[]).map(String) : [],
        severity:    coerceSeverity(f.severity),
      }))
    : [];

  const actions: RecommendedAction[] = Array.isArray(r.recommended_actions)
    ? (r.recommended_actions as Record<string, unknown>[]).slice(0, 6).map(a => ({
        action:      String(a.action      ?? 'Stay vigilant'),
        description: String(a.description ?? ''),
        priority:    coercePriority(a.priority),
      }))
    : [{ action: 'Stay vigilant', description: 'Exercise caution with this content.', priority: 'RECOMMENDED' }];

  const bd = (r.analysis_breakdown ?? {}) as Record<string, unknown>;

  return {
    risk_score:       riskScore,
    threat_level:     threatLevel as ThreatLevel,
    classification:   String(r.classification ?? (riskScore <= 20 ? 'Safe' : 'Suspicious')),
    confidence_score: clamp(Number(r.confidence_score ?? 75), 50, 99),
    suspicious_elements: elements,
    red_flags:        flags,
    recommended_actions: actions,
    analysis_breakdown: {
      pattern_matches:     clamp(Number(bd.pattern_matches     ?? elements.length), 0, 50),
      manipulation_tactics: clamp(Number(bd.manipulation_tactics ?? 0), 0, 20),
      match_rate_pct:      clamp(Number(bd.match_rate_pct      ?? riskScore + 5), 0, 99),
    },
  };
}

async function analyzeWithGroq(type: ScanType, content: string): Promise<LLMAnalysis> {
  const typeLabels: Record<ScanType, string> = {
    text: 'text message or written content',
    url:  'URL or web link',
    qr:   'URL extracted from a QR code',
  };

  console.log(`[groq] calling ${GROQ_MODEL} for ${type} scan (${content.length} chars)`);

  const completion = await groqClient!.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: `Analyse this ${typeLabels[type]}:\n\n${content}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 2048,
  });

  const raw = completion.choices[0]?.message?.content;
  const usage = completion.usage;
  console.log(`[groq] response received — risk_score will parse from JSON | tokens: ${usage?.prompt_tokens ?? '?'} in / ${usage?.completion_tokens ?? '?'} out`);
  if (!raw) throw new Error('Groq returned empty response');

  return validateLLMResponse(JSON.parse(raw));
}

// ── Regex fallback ─────────────────────────────────────────────────────────────
// Used when GROQ_API_KEY is absent or the LLM call fails.

interface Pattern { pattern: RegExp; weight: number; label: string; location: string; }

const URGENCY: Pattern[] = [
  { pattern: /\b(urgent|urgently)\b/i,                                    weight: 15, label: 'Urgent language',          location: 'Message body' },
  { pattern: /\bact now\b/i,                                              weight: 20, label: 'Act now pressure',          location: 'Message body' },
  { pattern: /\blimited time\b/i,                                         weight: 15, label: 'Limited time pressure',     location: 'Message body' },
  { pattern: /\bimmediately\b/i,                                          weight: 10, label: 'Immediacy pressure',        location: 'Message body' },
  { pattern: /\bwithin \d+ hours?\b/i,                                    weight: 15, label: 'Deadline pressure',         location: 'Message body' },
  { pattern: /\baccount.{0,20}(closed|suspended|blocked|terminated)\b/i,  weight: 25, label: 'Account suspension threat', location: 'Message body' },
  { pattern: /\bwill be (permanently|automatically) (closed|blocked|deleted)\b/i, weight: 30, label: 'Permanent consequence', location: 'Message body' },
];
const CREDENTIALS: Pattern[] = [
  { pattern: /\b(password|passcode)\b/i,              weight: 35, label: 'Password request',         location: 'Form fields' },
  { pattern: /\b(OTP|one.time.pass)\b/i,              weight: 40, label: 'OTP request',              location: 'Form fields' },
  { pattern: /\b(PIN|personal identification)\b/i,    weight: 30, label: 'PIN request',              location: 'Form fields' },
  { pattern: /\bbank.{0,20}(account|number|detail)\b/i, weight: 35, label: 'Bank account details',  location: 'Form fields' },
  { pattern: /\bcredit card\b/i,                      weight: 30, label: 'Credit card request',      location: 'Form fields' },
  { pattern: /\binternet banking\b/i,                 weight: 25, label: 'Internet banking request', location: 'Form fields' },
];
const REWARDS: Pattern[] = [
  { pattern: /\byou.{0,10}(have won|won)\b/i,                      weight: 25, label: 'Prize claim',          location: 'Message body' },
  { pattern: /\bfree (iphone|samsung|laptop|gift|voucher|prize)\b/i, weight: 30, label: 'Free prize offer',  location: 'Message body' },
  { pattern: /\bgiveaway\b/i,                                       weight: 20, label: 'Giveaway claim',       location: 'Message body' },
  { pattern: /\bguaranteed (return|profit|income)\b/i,              weight: 30, label: 'Guaranteed returns',   location: 'Message body' },
];
const URLS: Pattern[] = [
  { pattern: /https?:\/\/\d+\.\d+\.\d+\.\d+/i,                    weight: 50, label: 'IP address URL',       location: 'Link / URL' },
  { pattern: /\b(g0v|gov-sg|govsg|sgbank)\b/i,                     weight: 45, label: 'Domain impersonation', location: 'Link / URL' },
  { pattern: /\.(xyz|tk|ml|ga|cf|pw|top)\b/i,                      weight: 40, label: 'Suspicious TLD',       location: 'Link / URL' },
  { pattern: /\bbit\.ly\b|\btinyurl\b/i,                            weight: 20, label: 'Shortened URL',        location: 'Link / URL' },
  { pattern: /\b(gov\.sg|mom\.gov\.sg|iras\.gov\.sg)\b/i,           weight: -30, label: 'Official SG domain', location: 'Link / URL' },
];
const AUTHORITY: Pattern[] = [
  { pattern: /\b(singapore police force|SPF)\b/i, weight: 20, label: 'Police impersonation',    location: 'Sender / header' },
  { pattern: /\b(IRAS|inland revenue)\b/i,         weight: 15, label: 'IRAS impersonation',      location: 'Sender / header' },
  { pattern: /\b(CPF board|CPF)\b/i,               weight: 15, label: 'CPF impersonation',       location: 'Sender / header' },
  { pattern: /\b(DBS|OCBC|UOB).{0,20}verify\b/i,  weight: 25, label: 'Bank impersonation',      location: 'Sender / header' },
];
const ALL_PATTERNS = [...URGENCY, ...CREDENTIALS, ...REWARDS, ...URLS, ...AUTHORITY];

interface Match { label: string; weight: number; location: string; }

function analyzeWithRegex(content: string): LLMAnalysis {
  const matches: Match[] = [];
  for (const { pattern, weight, label, location } of ALL_PATTERNS) {
    if (pattern.test(content)) matches.push({ label, weight, location });
  }
  const raw = matches.reduce((s, m) => s + m.weight, 0);
  const riskScore = Math.min(100, Math.max(0, raw));
  const positiveMatches = matches.filter(m => m.weight > 0);

  const levelMap = (s: number) =>
    s <= 20 ? 'safe' : s <= 40 ? 'low' : s <= 60 ? 'suspicious' : s <= 80 ? 'high' : 'critical';
  const clsMap = (s: number) =>
    s <= 20 ? 'Safe' : s <= 40 ? 'Low Risk' :
    matches.some(m => CREDENTIALS.some(p => p.label === m.label)) ? 'Phishing' :
    matches.some(m => REWARDS.some(p => p.label === m.label)) ? 'Scam' : 'Suspicious';

  const elements: SuspiciousElement[] = positiveMatches
    .sort((a, b) => b.weight - a.weight).slice(0, 5)
    .map(m => ({
      element: m.label, location: m.location,
      severity: (m.weight >= 35 ? 'CRITICAL' : m.weight >= 25 ? 'HIGH' : m.weight >= 15 ? 'MEDIUM' : 'LOW') as SuspiciousElement['severity'],
      description: m.label,
    }));

  const hasGroup = (group: Pattern[]) => matches.some(m => group.some(p => p.label === m.label));
  const flags: ScanRedFlag[] = [];
  if (hasGroup(URGENCY)) flags.push({ title: 'Urgency Pressure', description: 'Creates false urgency to bypass careful thinking.', examples: ['"Act now"', '"Limited time"'], severity: 'CRITICAL' });
  if (hasGroup(CREDENTIALS)) flags.push({ title: 'Requests Sensitive Information', description: 'Legitimate organisations never ask for passwords or OTPs via message.', examples: ['Password', 'OTP', 'PIN'], severity: 'CRITICAL' });
  if (hasGroup(REWARDS)) flags.push({ title: 'Too Good to Be True', description: 'Unrealistic rewards used to lure victims.', examples: ['"Free prize"', '"Guaranteed returns"'], severity: 'HIGH' });
  if (hasGroup(URLS.filter(p => p.weight > 0))) flags.push({ title: 'Suspicious Link', description: 'URL shows signs of domain impersonation or suspicious hosting.', examples: ['Suspicious TLD', 'IP address URL'], severity: 'CRITICAL' });
  if (hasGroup(AUTHORITY)) flags.push({ title: 'Authority Impersonation', description: 'Pretends to be a government agency or bank.', examples: ['Government agency name', 'Bank name'], severity: 'CRITICAL' });

  const actions: RecommendedAction[] = [];
  if (riskScore > 40) actions.push({ action: 'Do Not Click Any Links', description: 'Links may lead to fraudulent websites.', priority: 'CRITICAL' });
  if (riskScore > 60) actions.push({ action: 'Do Not Share Personal Information', description: 'Never provide passwords, PINs, or OTPs through messages.', priority: 'CRITICAL' });
  actions.push({ action: 'Verify the Source', description: 'Contact the organisation via official channels.', priority: riskScore > 50 ? 'HIGH' : 'MEDIUM' });
  if (riskScore > 50) actions.push({ action: 'Report to ScamShield', description: 'Forward to ScamShield at 1799 or via the app.', priority: 'HIGH' });
  actions.push({ action: 'Ask a Trusted Adult or Teacher', description: "If unsure, talk to a parent or teacher before acting.", priority: 'RECOMMENDED' });

  const manipTactics = matches.filter(m => [...URGENCY, ...CREDENTIALS, ...REWARDS].some(p => p.label === m.label)).length;

  return {
    risk_score: riskScore,
    threat_level: levelMap(riskScore),
    classification: clsMap(riskScore),
    confidence_score: Math.min(99, (riskScore > 70 ? 88 : riskScore > 40 ? 74 : 93) + Math.min(8, positiveMatches.length * 2)),
    suspicious_elements: elements,
    red_flags: flags,
    recommended_actions: actions,
    analysis_breakdown: {
      pattern_matches: positiveMatches.length,
      manipulation_tactics: manipTactics,
      match_rate_pct: Math.min(99, riskScore + 10),
    },
  };
}

// ── Core analysis dispatcher ───────────────────────────────────────────────────

async function analyse(type: ScanType, content: string): Promise<LLMAnalysis> {
  if (isGroqEnabled) {
    try {
      return await analyzeWithGroq(type, content);
    } catch (err) {
      console.warn('[scanner] Groq failed, falling back to regex:', (err as Error).message);
    }
  }
  return analyzeWithRegex(content);
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_HISTORY: ScanHistoryItem[] = [
  { scan_id: 'mock-1', type: 'text', content_preview: 'BREAKING: Free iPhone giveaway! Click now...', risk_score: 92, classification: 'Scam', scanned_at: new Date(Date.now() - 7200000).toISOString() },
  { scan_id: 'mock-2', type: 'url',  content_preview: 'gov.sg/digital-safety-tips', risk_score: 5, classification: 'Safe', scanned_at: new Date(Date.now() - 86400000).toISOString() },
  { scan_id: 'mock-3', type: 'text', content_preview: 'Suspicious WhatsApp message about account', risk_score: 67, classification: 'Suspicious', scanned_at: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_STATS: ScannerStats = { total_scans: 47, threats_found: 12, safe_count: 35, xp_earned: 1175 };

// ── Service ────────────────────────────────────────────────────────────────────

export const scannerService = {
  async scan(userId: string, type: ScanType, content: string): Promise<ScanResult> {
    const analysis = await analyse(type, content);
    const preview = content.length > 80 ? content.slice(0, 77) + '...' : content;
    const isThreat = analysis.risk_score > 50;
    const xpAwarded = XP_PER_SCAN + (isThreat ? XP_THREAT_BONUS : 0);
    const scannedAt = new Date().toISOString();

    if (isMockMode) {
      return {
        scan_id: `scan-${Date.now()}`,
        type, content_preview: preview,
        ...analysis,
        xp_awarded: xpAwarded,
        newly_earned_badges: [],
        scanned_at: scannedAt,
      };
    }

    const { data: row, error: insertErr } = await supabaseAdmin!
      .from('scan_history')
      .insert({
        user_id: userId, type, content_preview: preview,
        risk_score: analysis.risk_score,
        classification: analysis.classification,
        threat_level: analysis.threat_level,
        confidence_score: analysis.confidence_score,
        result_data: {
          suspicious_elements: analysis.suspicious_elements,
          red_flags: analysis.red_flags,
          recommended_actions: analysis.recommended_actions,
          analysis_breakdown: analysis.analysis_breakdown,
        },
        xp_awarded: xpAwarded,
        scanned_at: scannedAt,
      })
      .select('id')
      .single();

    if (insertErr) throw new Error(`scan insert: ${insertErr.message}`);

    await usersService.awardXp(userId, { amount: xpAwarded });

    const newlyEarnedBadges: string[] = [];
    if (isThreat) {
      if (await badgesService.awardBadge(userId, 'scam-slayer')) newlyEarnedBadges.push('scam-slayer');
    }
    if (type === 'url' || type === 'qr') {
      if (await badgesService.awardBadge(userId, 'qr-guardian')) newlyEarnedBadges.push('qr-guardian');
    }

    return {
      scan_id: row.id,
      type, content_preview: preview,
      ...analysis,
      xp_awarded: xpAwarded,
      newly_earned_badges: newlyEarnedBadges,
      scanned_at: scannedAt,
    };
  },

  async getHistory(userId: string): Promise<ScanHistoryItem[]> {
    if (isMockMode) return MOCK_HISTORY;

    const { data, error } = await supabaseAdmin!
      .from('scan_history')
      .select('id, type, content_preview, risk_score, classification, scanned_at')
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false })
      .limit(10);

    if (error) throw new Error(`getHistory: ${error.message}`);
    return (data ?? []).map(r => ({
      scan_id: r.id, type: r.type, content_preview: r.content_preview,
      risk_score: r.risk_score, classification: r.classification, scanned_at: r.scanned_at,
    }));
  },

  async getStats(userId: string): Promise<ScannerStats> {
    if (isMockMode) return MOCK_STATS;

    const { data, error } = await supabaseAdmin!
      .from('scan_history')
      .select('risk_score, xp_awarded')
      .eq('user_id', userId);

    if (error) throw new Error(`getStats: ${error.message}`);
    const rows = data ?? [];
    return {
      total_scans:   rows.length,
      threats_found: rows.filter(r => r.risk_score > 50).length,
      safe_count:    rows.filter(r => r.risk_score <= 50).length,
      xp_earned:     rows.reduce((s, r) => s + (r.xp_awarded ?? 0), 0),
    };
  },
};
