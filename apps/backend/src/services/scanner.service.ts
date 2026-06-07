import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { usersService } from './users.service.js';
import { badgesService } from './badges.service.js';
import type {
  ScanType, ScanResult, ScanHistoryItem, ScannerStats,
  SuspiciousElement, ScanRedFlag, RecommendedAction,
} from '../types/scanner.types.js';

const XP_PER_SCAN = 30;
const XP_THREAT_BONUS = 20;

// ── Pattern libraries ──────────────────────────────────────────────────────────

interface Pattern { pattern: RegExp; weight: number; label: string; location: string; }

const URGENCY: Pattern[] = [
  { pattern: /\b(urgent|urgently)\b/i,                                   weight: 15, label: 'Urgent language',          location: 'Message body' },
  { pattern: /\bact now\b/i,                                             weight: 20, label: 'Act now pressure',          location: 'Message body' },
  { pattern: /\blimited time\b/i,                                        weight: 15, label: 'Limited time pressure',     location: 'Message body' },
  { pattern: /\bimmediately\b/i,                                         weight: 10, label: 'Immediacy pressure',        location: 'Message body' },
  { pattern: /\bwithin \d+ hours?\b/i,                                   weight: 15, label: 'Deadline pressure',         location: 'Message body' },
  { pattern: /\baccount.{0,20}(closed|suspended|blocked|terminated)\b/i, weight: 25, label: 'Account suspension threat', location: 'Message body' },
  { pattern: /\bwill be (permanently|automatically) (closed|blocked|deleted)\b/i, weight: 30, label: 'Permanent consequence', location: 'Message body' },
];

const CREDENTIALS: Pattern[] = [
  { pattern: /\b(password|passcode)\b/i,             weight: 35, label: 'Password request',         location: 'Form fields' },
  { pattern: /\b(OTP|one.time.pass)\b/i,             weight: 40, label: 'OTP request',              location: 'Form fields' },
  { pattern: /\b(PIN|personal identification)\b/i,   weight: 30, label: 'PIN request',              location: 'Form fields' },
  { pattern: /\bbank.{0,20}(account|number|detail)\b/i, weight: 35, label: 'Bank account details', location: 'Form fields' },
  { pattern: /\bcredit card\b/i,                     weight: 30, label: 'Credit card request',      location: 'Form fields' },
  { pattern: /\binternet banking\b/i,                weight: 25, label: 'Internet banking request', location: 'Form fields' },
  { pattern: /\b(cvv|card.{0,5}number)\b/i,          weight: 35, label: 'Card details request',     location: 'Form fields' },
];

const REWARDS: Pattern[] = [
  { pattern: /\byou.{0,10}(have won|won)\b/i,                     weight: 25, label: 'Prize claim',          location: 'Message body' },
  { pattern: /\bfree (iphone|samsung|laptop|gift|voucher|prize)\b/i, weight: 30, label: 'Free prize offer',  location: 'Message body' },
  { pattern: /\bgiveaway\b/i,                                      weight: 20, label: 'Giveaway claim',       location: 'Message body' },
  { pattern: /\bguaranteed (return|profit|income)\b/i,             weight: 30, label: 'Guaranteed returns',   location: 'Message body' },
  { pattern: /\$[\d,]+.{0,20}(prize|reward|claim|won)\b/i,         weight: 25, label: 'Large monetary prize', location: 'Message body' },
  { pattern: /\bcongratulations.{0,30}(won|selected|chosen)\b/i,   weight: 20, label: 'Fake congratulations', location: 'Message body' },
];

const URLS: Pattern[] = [
  { pattern: /https?:\/\/\d+\.\d+\.\d+\.\d+/i,                    weight: 50, label: 'IP address URL',       location: 'Link / URL' },
  { pattern: /\b(g0v|gov-sg|govsg|sgbank|s1ng4pore)\b/i,           weight: 45, label: 'Domain impersonation', location: 'Link / URL' },
  { pattern: /\.(xyz|tk|ml|ga|cf|pw|top)\b/i,                      weight: 40, label: 'Suspicious TLD',       location: 'Link / URL' },
  { pattern: /\bbit\.ly\b|\btinyurl\b|\bgoo\.gl\b/i,               weight: 20, label: 'Shortened URL',        location: 'Link / URL' },
  // Negative weight: trust signals that lower the score
  { pattern: /\b(gov\.sg|mom\.gov\.sg|iras\.gov\.sg|cpf\.gov\.sg)\b/i, weight: -30, label: 'Official Singapore domain', location: 'Link / URL' },
];

const AUTHORITY: Pattern[] = [
  { pattern: /\b(singapore police force|SPF)\b/i,          weight: 20, label: 'Police impersonation',        location: 'Sender / header' },
  { pattern: /\b(ministry of manpower|MOM)\b/i,            weight: 15, label: 'Government impersonation',    location: 'Sender / header' },
  { pattern: /\b(IRAS|inland revenue)\b/i,                 weight: 15, label: 'Tax authority impersonation', location: 'Sender / header' },
  { pattern: /\b(CPF board|CPF)\b/i,                       weight: 15, label: 'CPF impersonation',           location: 'Sender / header' },
  { pattern: /\b(DBS|OCBC|UOB|Standard Chartered).{0,20}verify\b/i, weight: 25, label: 'Bank impersonation', location: 'Sender / header' },
];

const ALL_PATTERNS = [...URGENCY, ...CREDENTIALS, ...REWARDS, ...URLS, ...AUTHORITY];

// ── Analysis helpers ───────────────────────────────────────────────────────────

interface Match { label: string; weight: number; location: string; }

function analyzeContent(content: string): { score: number; matches: Match[] } {
  const matches: Match[] = [];
  for (const { pattern, weight, label, location } of ALL_PATTERNS) {
    if (pattern.test(content)) matches.push({ label, weight, location });
  }
  const raw = matches.reduce((s, m) => s + m.weight, 0);
  return { score: Math.min(100, Math.max(0, raw)), matches };
}

function threatLevel(score: number): string {
  if (score <= 20) return 'safe';
  if (score <= 40) return 'low';
  if (score <= 60) return 'suspicious';
  if (score <= 80) return 'high';
  return 'critical';
}

function classification(score: number, matches: Match[]): string {
  if (score <= 20) return 'Safe';
  if (score <= 40) return 'Low Risk';
  const hasCredentials = matches.some(m => CREDENTIALS.some(p => p.label === m.label));
  const hasRewards = matches.some(m => REWARDS.some(p => p.label === m.label));
  const hasUrl = matches.some(m => URLS.filter(p => p.weight > 0).some(p => p.label === m.label));
  if (hasCredentials) return 'Phishing';
  if (hasRewards) return 'Scam';
  if (hasUrl) return 'Phishing';
  return score > 60 ? 'Scam' : 'Suspicious';
}

const DESCRIPTIONS: Record<string, string> = {
  'Urgent language':           '"URGENT", "ACT NOW", "IMMEDIATELY"',
  'Act now pressure':          'Demands immediate action to bypass careful thinking',
  'Limited time pressure':     'False scarcity used to rush the target',
  'Deadline pressure':         'Artificial deadline within hours to create panic',
  'Account suspension threat': 'Threatens account closure to trigger fear response',
  'Permanent consequence':     'Threatens irreversible action to maximise pressure',
  'Password request':          'Asks for account password — no legitimate service ever does this',
  'OTP request':               'Requests One-Time Password — only scammers need your OTP',
  'PIN request':               'Asks for personal identification number',
  'Bank account details':      'Solicits bank account number or financial details',
  'Credit card request':       'Asks for credit or debit card information',
  'Internet banking request':  'References internet banking credentials',
  'Card details request':      'Asks for CVV or card number',
  'Prize claim':               'Claims you won a prize you never entered',
  'Free prize offer':          'Unrealistic free item used as lure to click',
  'Giveaway claim':            'Fake giveaway — usually requires personal info to "claim"',
  'Guaranteed returns':        'Promises guaranteed profit — hallmark of investment scam',
  'Large monetary prize':      'Unrealistic monetary prize claim',
  'Fake congratulations':      'Fake congratulations message to build false excitement',
  'IP address URL':            'Link uses raw IP address instead of a domain name',
  'Domain impersonation':      'Domain mimics official site (e.g. g0v-sg.xyz vs gov.sg)',
  'Suspicious TLD':            'Unusual top-level domain (.xyz, .tk, .ml) common in scam sites',
  'Shortened URL':             'URL shortener hides actual destination',
  'Police impersonation':      'Pretends to be from Singapore Police Force',
  'Government impersonation':  'Impersonates a Singapore government ministry',
  'Tax authority impersonation': 'Impersonates IRAS — common in tax scam calls',
  'CPF impersonation':         'Impersonates CPF Board to access retirement savings',
  'Bank impersonation':        'Spoofs a local bank to steal banking credentials',
};

function suspiciousElements(matches: Match[]): SuspiciousElement[] {
  return matches
    .filter(m => m.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map(m => ({
      element: m.label,
      location: m.location,
      severity: (m.weight >= 35 ? 'CRITICAL' : m.weight >= 25 ? 'HIGH' : m.weight >= 15 ? 'MEDIUM' : 'LOW') as SuspiciousElement['severity'],
      description: DESCRIPTIONS[m.label] ?? m.label,
    }));
}

function redFlags(matches: Match[]): ScanRedFlag[] {
  const flags: ScanRedFlag[] = [];
  const has = (group: Pattern[]) => matches.some(m => group.some(p => p.label === m.label));

  if (has(URGENCY)) flags.push({
    title: 'Urgency Pressure',
    description: 'Creates a false sense of urgency to make you act without thinking carefully',
    examples: ['"Act now or lose access"', '"Limited time only"', '"Account will be closed in 24 hours"'],
    severity: 'CRITICAL',
  });

  if (has(URLS.filter(p => p.weight > 0))) flags.push({
    title: 'Suspicious Link',
    description: 'URL does not match any official domain and may lead to a fraudulent website',
    examples: ['Uses IP addresses or suspicious TLDs (.xyz, .tk)', 'Domain name mimics official sites', 'Recently registered domains'],
    severity: 'CRITICAL',
  });

  if (has(CREDENTIALS)) flags.push({
    title: 'Requests Sensitive Information',
    description: 'Legitimate organisations never ask for passwords, OTPs, or PINs via message',
    examples: ['Asks for password or PIN', 'Requests OTP code', 'Asks for internet banking credentials'],
    severity: 'CRITICAL',
  });

  if (has(REWARDS)) flags.push({
    title: 'Too Good to Be True',
    description: 'Offers unrealistic rewards or prizes — classic lure used by scammers',
    examples: ['"You won $50,000!"', '"Free iPhone giveaway"', '"Guaranteed investment returns"'],
    severity: 'HIGH',
  });

  if (has(AUTHORITY)) flags.push({
    title: 'Authority Impersonation',
    description: 'Pretends to be a government agency, bank, or authority figure to gain trust',
    examples: ['Fake SPF / MOM / IRAS messages', 'Spoofed bank sender names', 'Government logo misuse'],
    severity: 'CRITICAL',
  });

  return flags;
}

function recommendedActions(score: number): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (score > 40) actions.push({
    action: 'Do Not Click Any Links',
    description: 'The links in this content may lead to fraudulent websites designed to steal your information',
    priority: 'CRITICAL',
  });

  if (score > 60) actions.push({
    action: 'Do Not Share Personal Information',
    description: 'Never provide passwords, PINs, OTPs, or banking details through messages or links',
    priority: 'CRITICAL',
  });

  actions.push({
    action: 'Verify the Source',
    description: 'Contact the organisation directly using official channels — not links in the message',
    priority: score > 50 ? 'HIGH' : 'MEDIUM',
  });

  if (score > 50) {
    actions.push({
      action: 'Report to ScamShield',
      description: 'Forward suspicious messages to ScamShield at 1799 or report via the ScamShield app',
      priority: 'HIGH',
    });
    actions.push({
      action: 'Block the Sender',
      description: 'Block this number or contact to prevent further scam attempts',
      priority: 'MEDIUM',
    });
  }

  actions.push({
    action: 'Ask a Trusted Adult or Teacher',
    description: "If you're unsure, talk to a parent, teacher, or trusted adult before taking any action",
    priority: 'RECOMMENDED',
  });

  return actions;
}

function confidence(score: number, positiveMatches: number): number {
  const base = score > 70 ? 90 : score > 40 ? 75 : score > 20 ? 65 : 95;
  return Math.min(99, base + Math.min(9, positiveMatches * 2));
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_HISTORY: ScanHistoryItem[] = [
  { scan_id: 'mock-1', type: 'text', content_preview: 'BREAKING: Free iPhone giveaway! Click now...', risk_score: 92, classification: 'Scam', scanned_at: new Date(Date.now() - 7200000).toISOString() },
  { scan_id: 'mock-2', type: 'url',  content_preview: 'gov.sg/digital-safety-tips', risk_score: 5, classification: 'Safe', scanned_at: new Date(Date.now() - 86400000).toISOString() },
  { scan_id: 'mock-3', type: 'text', content_preview: 'Screenshot of WhatsApp message — suspicious activity', risk_score: 67, classification: 'Suspicious', scanned_at: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_STATS: ScannerStats = { total_scans: 47, threats_found: 12, safe_count: 35, xp_earned: 1175 };

// ── Service ────────────────────────────────────────────────────────────────────

export const scannerService = {
  async scan(userId: string, type: ScanType, content: string): Promise<ScanResult> {
    const { score, matches } = analyzeContent(content);
    const level = threatLevel(score);
    const cls = classification(score, matches);
    const positiveMatches = matches.filter(m => m.weight > 0);
    const conf = confidence(score, positiveMatches.length);
    const elements = suspiciousElements(matches);
    const flags = redFlags(matches);
    const actions = recommendedActions(score);
    const preview = content.length > 80 ? content.slice(0, 77) + '...' : content;

    const manipTactics = matches.filter(m =>
      [...URGENCY, ...CREDENTIALS, ...REWARDS].some(p => p.label === m.label)
    ).length;

    const breakdown = {
      pattern_matches: positiveMatches.length,
      manipulation_tactics: manipTactics,
      match_rate_pct: Math.min(99, score + 10),
    };

    const isThreat = score > 50;
    const xpAwarded = XP_PER_SCAN + (isThreat ? XP_THREAT_BONUS : 0);
    const scannedAt = new Date().toISOString();

    if (isMockMode) {
      return {
        scan_id: `scan-${Date.now()}`,
        type, content_preview: preview, risk_score: score,
        threat_level: level as ScanResult['threat_level'],
        classification: cls, confidence_score: conf,
        suspicious_elements: elements, red_flags: flags,
        recommended_actions: actions, analysis_breakdown: breakdown,
        xp_awarded: xpAwarded, newly_earned_badges: [], scanned_at: scannedAt,
      };
    }

    const { data: row, error: insertErr } = await supabaseAdmin!
      .from('scan_history')
      .insert({
        user_id: userId,
        type,
        content_preview: preview,
        risk_score: score,
        classification: cls,
        threat_level: level,
        confidence_score: conf,
        result_data: { suspicious_elements: elements, red_flags: flags, recommended_actions: actions, analysis_breakdown: breakdown },
        xp_awarded: xpAwarded,
        scanned_at: scannedAt,
      })
      .select('id')
      .single();

    if (insertErr) throw new Error(`scan insert: ${insertErr.message}`);

    await usersService.awardXp(userId, { amount: xpAwarded });

    const newlyEarnedBadges: string[] = [];

    if (isThreat) {
      const isNew = await badgesService.awardBadge(userId, 'scam-slayer');
      if (isNew) newlyEarnedBadges.push('scam-slayer');
    }

    if (type === 'url' || type === 'qr') {
      const isNew = await badgesService.awardBadge(userId, 'qr-guardian');
      if (isNew) newlyEarnedBadges.push('qr-guardian');
    }

    return {
      scan_id: row.id,
      type, content_preview: preview, risk_score: score,
      threat_level: level as ScanResult['threat_level'],
      classification: cls, confidence_score: conf,
      suspicious_elements: elements, red_flags: flags,
      recommended_actions: actions, analysis_breakdown: breakdown,
      xp_awarded: xpAwarded, newly_earned_badges: newlyEarnedBadges, scanned_at: scannedAt,
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
      total_scans: rows.length,
      threats_found: rows.filter(r => r.risk_score > 50).length,
      safe_count: rows.filter(r => r.risk_score <= 50).length,
      xp_earned: rows.reduce((s, r) => s + (r.xp_awarded ?? 0), 0),
    };
  },
};
