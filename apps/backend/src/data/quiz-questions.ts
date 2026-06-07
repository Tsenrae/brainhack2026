import type { QuizQuestion } from '../types/mission.types.js';

// 10 questions for Module 1: Spot the Spin
// Layout: 7 social-media post questions + 3 video scenario questions
// Video positions: index 1, 5, 8  (evenly distributed across the set)
export const SPOT_THE_SPIN_QUESTIONS: QuizQuestion[] = [
  // ── Q0 ── post / scam ────────────────────────────────────────────────────────
  {
    id: 1,
    question_type: 'post',
    content:
      '🚨 BREAKING: Singapore government announces FREE cash handout of $5,000 to all citizens! Click link to claim NOW before slots run out! Limited time only! 💰💸',
    likes: '12.5K',
    shares: '8.2K',
    comments: '3.4K',
    correct_answer: 'scam',
    hint:
      'Look for urgency tactics, unrealistic promises, and lack of official sources. Government announcements are always made through official channels like gov.sg.',
    explanation:
      'This post is a financial scam. Real government disbursements are announced through gov.sg, official press releases, and CNA — never via viral social media links with countdown timers. The goal is to steal your personal information or money.',
    red_flags: [
      { text: '🚨 BREAKING:', explanation: 'Creates false urgency to pressure quick action without verification', severity: 'high' },
      { text: 'FREE cash handout of $5,000', explanation: 'Unrealistic promise — government payouts follow official documented procedures', severity: 'high' },
      { text: 'Click link to claim NOW', explanation: 'Urgent call-to-action designed to bypass critical thinking', severity: 'high' },
      { text: 'before slots run out!', explanation: 'False scarcity — government programmes do not have "slots" for citizens', severity: 'medium' },
    ],
    manipulation_tactics: [
      { name: 'Urgency Pressure', description: 'Creates artificial time pressure to prevent fact-checking', examples: ['NOW', 'Limited time only'] },
      { name: 'Authority Impersonation', description: 'Falsely claims government backing to appear legitimate', examples: ['Singapore government announces'] },
      { name: 'Unrealistic Promises', description: 'Offers too-good-to-be-true financial rewards', examples: ['FREE cash handout of $5,000'] },
    ],
  },

  // ── Q1 ── VIDEO / scam ───────────────────────────────────────────────────────
  {
    id: 2,
    question_type: 'video',
    content: 'Watch the video below, then answer: what type of content is this?',
    likes: '',
    shares: '',
    comments: '',
    video_url: '',
    video_title: 'Incoming Call: "CPF Board Officer" About Suspicious Transactions',
    video_description:
      'A young man receives an unexpected call from an "Officer from the CPF Board Operations Centre" who informs him that $47,500 in suspicious transactions have been detected on his CPF account. The officer says his funds must be immediately transferred to a "CPF Safe Account" to prevent further losses — and asks him to confirm his NRIC and SingPass password to freeze the fraudulent activity.',
    correct_answer: 'scam',
    hint:
      'No government agency — including CPF — will ever ask for your SingPass password or request you to transfer money over a phone call. Any call asking for credentials or fund transfers is a scam.',
    explanation:
      'This is a government impersonation scam (commonly called a "CPF Safe Account scam"). Real CPF officers never ask for your SingPass password, NRIC over the phone for "verification", or request fund transfers. The tactic relies on fear of financial loss and authority pressure. If you receive such a call, hang up and call CPF directly at 1800-227-1188 to verify.',
    red_flags: [
      { text: 'Transfer to a "CPF Safe Account"', explanation: 'No such account exists — this is a tactic to steal your savings', severity: 'high' },
      { text: 'Confirm your SingPass password', explanation: 'No legitimate agency ever asks for passwords over the phone', severity: 'high' },
      { text: 'Immediate action required', explanation: 'Urgency is designed to prevent you from calling the real CPF to verify', severity: 'high' },
    ],
    manipulation_tactics: [
      { name: 'Authority Impersonation', description: 'Poses as a government officer to gain immediate trust and compliance', examples: ['CPF Board Operations Centre', 'Officer Badge Number'] },
      { name: 'Fear Induction', description: 'Triggers panic about financial loss to override careful thinking', examples: ['$47,500 in suspicious transactions', 'identity theft'] },
      { name: 'Urgency Pressure', description: 'Demands immediate action to prevent the target from verifying', examples: ['transfer immediately', 'freeze the activity now'] },
    ],
  },

  // ── Q2 ── post / misleading ──────────────────────────────────────────────────
  {
    id: 3,
    question_type: 'post',
    content:
      'New survey reveals 99% of Singaporeans want the government to increase cash rebates by 500%. Citizens are "deeply unhappy" with current policies, says unnamed political analyst.',
    likes: '5.3K',
    shares: '3.1K',
    comments: '2.2K',
    correct_answer: 'misleading',
    hint:
      'Who conducted this survey? How many people were surveyed? Who is the "unnamed analyst"? Real surveys always cite methodology, sample size, and the institution that ran them.',
    explanation:
      'This is misleading content. The 99% figure has no sourcing — no survey name, methodology, or sample size. "Unnamed political analyst" is not a credible citation. Statistics this extreme without a verifiable source are a red flag for fabricated or heavily manipulated data.',
    red_flags: [
      { text: '99% of Singaporeans', explanation: 'Suspiciously extreme number with zero citation', severity: 'high' },
      { text: 'unnamed political analyst', explanation: 'Anonymous sources cannot be verified or challenged', severity: 'high' },
      { text: '"deeply unhappy"', explanation: 'Emotional framing with no supporting evidence', severity: 'medium' },
    ],
    manipulation_tactics: [
      { name: 'False Consensus', description: 'Exaggerates the extent of public opinion to appear mainstream', examples: ['99%', 'citizens are deeply unhappy'] },
      { name: 'Anonymous Authority', description: 'Cites experts who cannot be held accountable', examples: ['unnamed political analyst'] },
    ],
  },

  // ── Q3 ── post / satire ──────────────────────────────────────────────────────
  {
    id: 4,
    question_type: 'post',
    content:
      '📰 The Onion SG: "Government to mandate that all HDB flats install mandatory AI mood sensors to detect unhappy residents and deploy happiness drones." — New Smart Nation initiative announced.',
    likes: '18.9K',
    shares: '11.2K',
    comments: '4.6K',
    correct_answer: 'satire',
    hint:
      'Look at the source name and the absurdity of the premise. Is this content from a known parody publication?',
    explanation:
      'This is satire. The Onion SG is a satirical publication known for exaggerated, fictional news about Singapore. Happiness drones and AI mood sensors are intentionally absurd. Satire uses humour and exaggeration to comment on society — it is not meant to be taken literally, even when it mimics a real news format.',
    red_flags: [],
    manipulation_tactics: [],
  },

  // ── Q4 ── post / real ────────────────────────────────────────────────────────
  {
    id: 5,
    question_type: 'post',
    content:
      '🦟 NEA Alert: A new dengue cluster has been identified in Tampines Street 45. Residents are advised to remove stagnant water from flower pots, pails, and roof gutters. Check NEA\'s myENV app for updates.',
    likes: '3.2K',
    shares: '9.8K',
    comments: '1.1K',
    correct_answer: 'real',
    hint:
      'Does this look like an official advisory with a specific location, practical actionable steps, and a reference to a verifiable government source you can independently check?',
    explanation:
      'This is real, accurate public health information. NEA regularly publishes dengue cluster alerts with precise locations and practical prevention steps. The reference to the official myENV app for verification is consistent with genuine NEA communications. Notice the absence of urgency, fear-mongering, or suspicious links.',
    red_flags: [],
    manipulation_tactics: [],
  },

  // ── Q5 ── VIDEO / misleading ─────────────────────────────────────────────────
  {
    id: 6,
    question_type: 'video',
    content: 'Watch the video below, then answer: what type of content is this?',
    likes: '',
    shares: '',
    comments: '',
    video_url: '',
    video_title: 'VIRAL: "Ministry of Finance" Announces $1,500 Recovery Package for All Singaporeans',
    video_description:
      'A smartly-dressed person sits at a professional-looking desk with a Singapore flag visible in the background. Speaking in an authoritative tone, they introduce themselves as representing the Ministry of Finance and announce a "$1,500 Singapore Recovery Assistance Package" available to all eligible Singaporeans. The video shows an official-looking graphic and asks viewers to visit a link to claim their payment — but warns that slots are limited and the offer closes in 48 hours.',
    correct_answer: 'misleading',
    hint:
      'Real government grants are announced on official government websites like mof.gov.sg and budget.gov.sg — never via viral videos with countdown timers. Check: does the URL shown end in .gov.sg?',
    explanation:
      'This is misleading content — specifically a government impersonation video. The URL shown (sg-recovery-gov.xyz) is not a government domain. Real Ministry of Finance announcements appear on mof.gov.sg and are reported by CNA, The Straits Times, and other mainstream media. The artificial 48-hour deadline and "limited slots" language are classic manipulation tactics not used in legitimate government communications.',
    red_flags: [
      { text: 'sg-recovery-gov.xyz', explanation: 'Not a .gov.sg domain — legitimate Singapore government sites always end in .gov.sg', severity: 'high' },
      { text: 'slots are filling up fast', explanation: 'Government entitlements do not have "limited slots" — this creates false urgency', severity: 'high' },
      { text: 'Prepare your SingPass credentials', explanation: 'A video requesting SingPass credentials is always a red flag — never share these', severity: 'high' },
    ],
    manipulation_tactics: [
      { name: 'Authority Impersonation', description: 'Uses professional staging (office, flag, business attire) to mimic official government communications', examples: ['Ministry of Finance', 'official-looking seal and graphics'] },
      { name: 'Urgency & Scarcity', description: 'Combines a tight deadline with limited availability to rush victims into acting without verifying', examples: ['closes in 48 hours', 'slots are filling up fast'] },
      { name: 'Credential Harvesting', description: 'Asks for sensitive login details under the guise of an official verification process', examples: ['SingPass credentials', 'NRIC and bank account details'] },
    ],
  },

  // ── Q6 ── post / scam ────────────────────────────────────────────────────────
  {
    id: 7,
    question_type: 'post',
    content:
      '🌟 HIRING NOW! Work from home, earn $300–$500/DAY! No experience needed! Just like & share social media posts for brands. WhatsApp us NOW: +65 8888 7777. Limited slots available! 🌟',
    likes: '4.2K',
    shares: '6.8K',
    comments: '1.9K',
    correct_answer: 'scam',
    hint:
      'Would any legitimate company pay $300–$500 per day just for liking and sharing posts? What would they need your personal details or payment for after you contact them?',
    explanation:
      'This is a job scam — specifically a "like and share" or task-based scam. Victims are initially paid small amounts to build trust, then asked to make larger "investments" to unlock bigger payouts, which are never received. No legitimate employer offers $300–$500/day for liking posts with zero experience or qualifications required.',
    red_flags: [
      { text: '$300–$500/DAY', explanation: 'Unrealistic pay for zero-skill work — far exceeds Singapore\'s median daily wage', severity: 'high' },
      { text: 'Just like & share social media posts', explanation: 'No company pays hundreds of dollars for social media likes — this hides the actual scam mechanics', severity: 'high' },
      { text: 'Limited slots available!', explanation: 'False scarcity tactic used to rush you into contact before you can research', severity: 'medium' },
    ],
    manipulation_tactics: [
      { name: 'Too-Good-To-Be-True Offer', description: 'Extremely high pay for minimal effort lowers critical thinking and attracts desperate targets', examples: ['$300–$500/DAY', 'No experience needed'] },
      { name: 'Urgency & Scarcity', description: 'Creates pressure to act immediately before researching the opportunity', examples: ['WhatsApp NOW', 'Limited slots'] },
    ],
  },

  // ── Q7 ── post / satire ──────────────────────────────────────────────────────
  {
    id: 8,
    question_type: 'post',
    content:
      '😂 NParks announces MRT stations will now be planted with 500 trees each, with birds\' nests provided at every seat. "Green Singapore has entered the tunnel," says spokesperson. 🌳🚇',
    likes: '26.3K',
    shares: '19.1K',
    comments: '7.4K',
    correct_answer: 'satire',
    hint:
      'Is this premise physically possible? Is the tone humorous and the scenario deliberately absurd? Satire often takes a real-world trend (like Singapore\'s greenery push) to an extreme.',
    explanation:
      'This is satire commenting on Singapore\'s genuine efforts to green its urban infrastructure. The idea of 500 trees per MRT station and birds\' nests on every seat is deliberately impossible. The pun "Green Singapore has entered the tunnel" signals this is parody. Recognising satire prevents you from spreading fictional stories as news.',
    red_flags: [],
    manipulation_tactics: [],
  },

  // ── Q8 ── VIDEO / scam ───────────────────────────────────────────────────────
  {
    id: 9,
    question_type: 'video',
    content: 'Watch the video below, then answer: what type of content is this?',
    likes: '',
    shares: '',
    comments: '',
    video_url: '',
    video_title: 'He Made $8,200 in 14 Days — Singapore Trading Group Exposed?',
    video_description:
      'An enthusiastic young Singaporean in his 20s films himself talking directly to camera in a casual home setting. He shows his phone screen displaying a trading app with a $8,247 profit balance and excitedly explains how he achieved it through a Telegram channel run by a "trading sifu" from Hong Kong. He says the basic channel is free to join, but premium signals — which he credits for all his profits — cost $200/month, with a "100% guaranteed returns or refund" promise. He urges viewers to join quickly as only 50 new members are accepted per month.',
    correct_answer: 'scam',
    hint:
      'In Singapore, investment advisory services must be licensed by MAS. Anyone offering "guaranteed returns" on investments is either lying or operating illegally. Would a genuinely profitable trader share their edge publicly?',
    explanation:
      'This is an investment scam recruitment video — specifically a Telegram trading group scam. The "guaranteed returns" claim is illegal under MAS regulations and is always false. The urgency tactic ("50 members/month") and the show of large profits are designed to lower your guard. Victims who join and pay for premium signals typically receive losing trades and eventually cannot withdraw their funds. Always verify investment platforms on the MAS Investor Alert List at mas.gov.sg.',
    red_flags: [
      { text: '100% guaranteed returns or refund', explanation: 'No legitimate investment guarantees returns — this promise is always a lie', severity: 'high' },
      { text: 'Sifu Kenny — 15 years experience', explanation: 'Unverifiable anonymous expert used to build false credibility', severity: 'high' },
      { text: 'Only 50 new members per month', explanation: 'False scarcity tactic to rush victims into paying before researching', severity: 'medium' },
    ],
    manipulation_tactics: [
      { name: 'Social Proof via Testimony', description: 'Uses a peer testimonial with visible "proof" to make the scam feel credible and relatable', examples: ['shows phone screen with profits', 'I\'m not sponsored, just sharing'] },
      { name: 'Guaranteed Returns Fraud', description: 'Makes an illegal promise of guaranteed profits to attract victims who fear missing out', examples: ['100% guaranteed returns', '$8,200 in 14 days'] },
      { name: 'Scarcity Pressure', description: 'Limits membership artificially to manufacture urgency and exclusivity', examples: ['only 50 members/month', '12 spots left'] },
    ],
  },

  // ── Q9 ── post / real ────────────────────────────────────────────────────────
  {
    id: 10,
    question_type: 'post',
    content:
      '⚠️ Advisory from MAS: The Monetary Authority of Singapore warns the public about unlicensed cryptocurrency investment platforms promising guaranteed returns. Always check if platforms are licensed at mas.gov.sg/investor-alert-list.',
    likes: '4.1K',
    shares: '7.3K',
    comments: '892',
    correct_answer: 'real',
    hint:
      'Does this come from a verifiable government source? Is the advice cautious and actionable, and does it reference an official website you can independently check right now?',
    explanation:
      'This is real, official information from the Monetary Authority of Singapore. MAS regularly issues advisories about investment scams. The specific reference to mas.gov.sg/investor-alert-list is a verifiable, real resource you can visit. Notice the tone is advisory — no urgency, no suspicious links, no requests for personal information.',
    red_flags: [],
    manipulation_tactics: [],
  },
];

export const TOTAL_QUESTIONS = SPOT_THE_SPIN_QUESTIONS.length; // 10

export const MISSION_BADGES = [
  { badge_slug: 'spin-spotter',   badge_name: 'Spin Spotter',    badge_icon: '🎯', description: 'Complete Module 1',      requirement: 'Finish all 10 questions in Spot the Spin' },
  { badge_slug: 'ripple-breaker', badge_name: 'Ripple Breaker',  badge_icon: '⛓️', description: 'Complete Module 2',      requirement: 'Trace 5 misinformation chains' },
  { badge_slug: 'truth-guardian', badge_name: 'Truth Guardian',  badge_icon: '🛡️', description: 'Complete all modules',   requirement: 'Finish all 3 modules' },
  { badge_slug: 'squad-strategist', badge_name: 'Squad Strategist', badge_icon: '👥', description: 'Complete Module 3', requirement: 'Fact-check with 3 teammates' },
];

export const MODULE_SLUGS = ['spot-the-spin', 'chain-reaction', 'shield-squad'] as const;
export type ModuleSlug = typeof MODULE_SLUGS[number];

export const XP_CORRECT = 50;
export const XP_WRONG = 40;

export const MODULE_COMPLETION_XP: Record<ModuleSlug, number> = {
  'spot-the-spin': 200,
  'chain-reaction': 150,
  'shield-squad': 150,
};
