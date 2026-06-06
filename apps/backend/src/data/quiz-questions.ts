import type { QuizQuestion } from '../types/mission.types.js';

export const SPOT_THE_SPIN_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
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
  {
    id: 2,
    content:
      '⚠️ Important Notice: Your CPF account has been flagged for suspicious activity. Your withdrawal privileges will be suspended in 24 hours. Verify your identity immediately at: cpf-verify-sg.com',
    likes: '2.1K',
    shares: '4.7K',
    comments: '892',
    correct_answer: 'scam',
    hint:
      'Official CPF communications come from cpf.gov.sg only. Check the URL in the post — does it end in .gov.sg?',
    explanation:
      'This is a phishing scam impersonating CPF. The URL "cpf-verify-sg.com" is not a government domain. CPF only communicates through cpf.gov.sg, official letters, and the CPF mobile app. The 24-hour deadline is a classic pressure tactic.',
    red_flags: [
      { text: 'cpf-verify-sg.com', explanation: 'Not a government domain — real CPF links end in cpf.gov.sg', severity: 'high' },
      { text: 'suspended in 24 hours', explanation: '24-hour deadline creates panic to prevent careful verification', severity: 'high' },
      { text: 'Verify your identity immediately', explanation: 'Urgent directive to click a fraudulent link', severity: 'high' },
    ],
    manipulation_tactics: [
      { name: 'Authority Spoofing', description: 'Mimics official government agency branding and tone', examples: ['CPF account', 'Important Notice'] },
      { name: 'Fear Induction', description: 'Threatens loss of access to create panic', examples: ['suspended', 'flagged for suspicious activity'] },
      { name: 'Deadline Pressure', description: 'Forces immediate action within a tight window', examples: ['24 hours', 'immediately'] },
    ],
  },
  {
    id: 3,
    content:
      'New survey reveals 99% of Singaporeans want the government to increase cash rebates by 500%. Citizens are "deeply unhappy" with current policies, says unnamed political analyst.',
    likes: '5.3K',
    shares: '3.1K',
    comments: '2.2K',
    correct_answer: 'misleading',
    hint:
      'Who conducted this survey? How many people were surveyed? Who is the "unnamed analyst"? Real surveys cite methodology and sample size.',
    explanation:
      'This is misleading content. The 99% figure has no sourcing — no survey name, no methodology, no sample size. "Unnamed political analyst" is not a credible citation. Statistics this extreme without a verifiable source are a red flag for manipulated or fabricated data.',
    red_flags: [
      { text: '99% of Singaporeans', explanation: 'Suspiciously round, extreme number with no citation', severity: 'high' },
      { text: 'unnamed political analyst', explanation: 'Anonymous sources cannot be verified or challenged', severity: 'high' },
      { text: '"deeply unhappy"', explanation: 'Emotional framing with no supporting evidence', severity: 'medium' },
    ],
    manipulation_tactics: [
      { name: 'False Consensus', description: 'Exaggerates the extent of public opinion to appear mainstream', examples: ['99%', 'citizens are deeply unhappy'] },
      { name: 'Anonymous Authority', description: 'Cites experts who cannot be held accountable', examples: ['unnamed political analyst'] },
    ],
  },
  {
    id: 4,
    content:
      '📰 The Onion SG: "Government to mandate that all HDB flats install mandatory AI mood sensors to detect unhappy residents and deploy happiness drones." — New Smart Nation initiative announced.',
    likes: '18.9K',
    shares: '11.2K',
    comments: '4.6K',
    correct_answer: 'satire',
    hint:
      'Look for absurd premises and the source of the post. Is this a parody publication?',
    explanation:
      'This is satire. The Onion SG is a satirical publication known for exaggerated, fictional "news" about Singapore. Happiness drones and mood sensors are intentionally absurd. Satire uses humour and exaggeration to comment on society — it is not meant to be taken literally.',
    red_flags: [],
    manipulation_tactics: [],
  },
  {
    id: 5,
    content:
      '🦟 NEA Alert: A new dengue cluster has been identified in Tampines Street 45. Residents are advised to remove stagnant water from flower pots, pails, and roof gutters. Check NEA\'s myENV app for updates.',
    likes: '3.2K',
    shares: '9.8K',
    comments: '1.1K',
    correct_answer: 'real',
    hint:
      'Does this look like an official advisory with specific, actionable advice and a reference to a verifiable government source?',
    explanation:
      'This is real, accurate public health information. NEA regularly publishes dengue cluster alerts with precise locations and practical prevention steps. The reference to the official myENV app for verification is consistent with genuine NEA communications.',
    red_flags: [],
    manipulation_tactics: [],
  },
  {
    id: 6,
    content:
      'LEAKED: Internal documents show Singapore ERP gantry rates will TRIPLE next month affecting ALL expressways. Government hiding this from public! Share before they delete this post! 🚗💸',
    likes: '7.4K',
    shares: '15.6K',
    comments: '5.8K',
    correct_answer: 'misleading',
    hint:
      'ERP rate changes are always announced publicly through the LTA website. Has there been any official statement? What does "leaked internal documents" mean with no link or attachment?',
    explanation:
      'This is misleading content. ERP rate changes require public announcement by LTA with adequate notice — they cannot be secretly tripled. The phrase "share before they delete this" is a classic viral manipulation tactic. No leaked document is attached or cited.',
    red_flags: [
      { text: 'LEAKED: Internal documents', explanation: 'Unverifiable source designed to add false credibility', severity: 'high' },
      { text: 'Government hiding this from public', explanation: 'Conspiracy framing to make the content feel like forbidden knowledge', severity: 'high' },
      { text: 'Share before they delete this post!', explanation: 'Urgency tactic to trigger sharing before fact-checking', severity: 'high' },
    ],
    manipulation_tactics: [
      { name: 'Conspiracy Framing', description: 'Positions the claim as secret information being suppressed', examples: ['Government hiding this', 'leaked documents'] },
      { name: 'Viral Seeding', description: 'Instructs readers to share before the content is supposedly removed', examples: ['Share before they delete this'] },
    ],
  },
  {
    id: 7,
    content:
      '🚨 URGENT: Grab is giving FREE rides all weekend to celebrate 10M users! Claim your 5 FREE rides now — valid this weekend only! Click here to activate: grab-rewards-sg.net 🚗',
    likes: '21.4K',
    shares: '33.7K',
    comments: '8.9K',
    correct_answer: 'scam',
    hint:
      'Check the URL. Official Grab promotions come from grab.com or the Grab app — not third-party websites. Extremely generous free offers are often bait.',
    explanation:
      'This is a scam. The domain "grab-rewards-sg.net" is not affiliated with Grab. Legitimate Grab promotions are activated through the official app or grab.com only. This site is designed to steal your Grab account credentials or payment details.',
    red_flags: [
      { text: 'grab-rewards-sg.net', explanation: 'Not an official Grab domain — real promotions use grab.com or the app', severity: 'high' },
      { text: '5 FREE rides', explanation: 'Overly generous offer used as bait to get you to click a malicious link', severity: 'high' },
      { text: 'valid this weekend only!', explanation: 'Artificial deadline prevents you from verifying before acting', severity: 'medium' },
    ],
    manipulation_tactics: [
      { name: 'Brand Impersonation', description: 'Copies logos and language of a trusted brand to gain credibility', examples: ['Grab', 'grab-rewards-sg.net'] },
      { name: 'Reward Bait', description: 'Promises free gifts to lower your guard and get personal information', examples: ['5 FREE rides', '10M users celebration'] },
    ],
  },
  {
    id: 8,
    content:
      '😂 NParks announces MRT stations will now be planted with 500 trees each, with birds\' nests provided at every seat. "Green Singapore has entered the tunnel," says spokesperson. 🌳🚇',
    likes: '26.3K',
    shares: '19.1K',
    comments: '7.4K',
    correct_answer: 'satire',
    hint:
      'Is the premise physically possible? Is the tone humorous or absurd? Satire often takes real-world trends to an extreme.',
    explanation:
      'This is satire commenting on Singapore\'s real push for greenery in urban spaces. The idea of 500 trees per MRT station and bird nests on every seat is intentionally absurd. The pun "Green Singapore has entered the tunnel" signals this is parody, not news.',
    red_flags: [],
    manipulation_tactics: [],
  },
  {
    id: 9,
    content:
      'Research: Screen time above 2 hours/day is permanently destroying Singaporean teenagers\' eyesight. Local doctors confirm 80% of students will need glasses by 2030 and there\'s NO cure.',
    likes: '9.6K',
    shares: '12.4K',
    comments: '3.7K',
    correct_answer: 'misleading',
    hint:
      'Are these statistics backed by a specific study? "Local doctors" is vague — which doctors, from which hospitals? "NO cure" is an extreme claim.',
    explanation:
      'This is misleading content. While screen time can contribute to myopia, the claim of "permanently destroying" vision and "no cure" is medically exaggerated. The 80% figure is unsubstantiated. Myopia is manageable. Real research cites authors, institutions, and methodology.',
    red_flags: [
      { text: 'permanently destroying', explanation: 'Extreme, permanent framing unsupported by cited research', severity: 'high' },
      { text: '80% of students will need glasses', explanation: 'Very precise statistic with no source attribution', severity: 'high' },
      { text: 'there\'s NO cure', explanation: 'Absolute claim — myopia management exists and is well-established medically', severity: 'medium' },
    ],
    manipulation_tactics: [
      { name: 'Health Fearmongering', description: 'Uses exaggerated medical claims to trigger parental fear and sharing', examples: ['permanently destroying', 'NO cure'] },
      { name: 'Vague Authority', description: 'Attributes claims to unnamed experts to avoid fact-checking', examples: ['Local doctors confirm'] },
    ],
  },
  {
    id: 10,
    content:
      '⚠️ Advisory from MAS: The Monetary Authority of Singapore warns the public about unlicensed cryptocurrency investment platforms promising guaranteed returns. Always check if platforms are licensed at mas.gov.sg/investor-alert-list.',
    likes: '4.1K',
    shares: '7.3K',
    comments: '892',
    correct_answer: 'real',
    hint:
      'Does this come from a verifiable government source? Is the advice actionable and does it reference an official website you can independently check?',
    explanation:
      'This is real, official information. MAS regularly issues advisories about investment scams. The specific reference to mas.gov.sg/investor-alert-list is a verifiable, real resource. The cautious, advisory tone — rather than urgent action — is consistent with genuine government communications.',
    red_flags: [],
    manipulation_tactics: [],
  },
];

export const TOTAL_QUESTIONS = SPOT_THE_SPIN_QUESTIONS.length;

export const MISSION_BADGES = [
  {
    badge_slug: 'spin-spotter',
    badge_name: 'Spin Spotter',
    badge_icon: '🎯',
    description: 'Complete Module 1',
    requirement: 'Classify all 10 posts correctly',
  },
  {
    badge_slug: 'ripple-breaker',
    badge_name: 'Ripple Breaker',
    badge_icon: '⛓️',
    description: 'Complete Module 2',
    requirement: 'Trace 5 misinformation chains',
  },
  {
    badge_slug: 'truth-guardian',
    badge_name: 'Truth Guardian',
    badge_icon: '🛡️',
    description: 'Complete all modules',
    requirement: 'Finish all 3 modules',
  },
  {
    badge_slug: 'squad-strategist',
    badge_name: 'Squad Strategist',
    badge_icon: '👥',
    description: 'Complete Module 3',
    requirement: 'Fact-check with 3 teammates',
  },
];

export const MODULE_SLUGS = ['spot-the-spin', 'chain-reaction', 'shield-squad'] as const;
export type ModuleSlug = typeof MODULE_SLUGS[number];

// XP awarded per question
export const XP_CORRECT = 50;
export const XP_WRONG = 40;
// XP bonus on module completion
export const MODULE_COMPLETION_XP: Record<ModuleSlug, number> = {
  'spot-the-spin': 200,
  'chain-reaction': 150,
  'shield-squad': 150,
};
