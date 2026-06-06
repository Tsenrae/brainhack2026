export interface BadgeDefinition {
  badge_slug: string;
  badge_name: string;
  description: string;
  requirement: string;
  xp_reward: number;
  category: 'mission' | 'scanner' | 'community' | 'social';
}

// Single source of truth for all platform badges
export const ALL_BADGES: BadgeDefinition[] = [
  // Mission badges
  {
    badge_slug: 'spin-spotter',
    badge_name: 'Spin Spotter',
    description: 'Aced the Spot the Spin quiz with 90%+',
    requirement: 'Complete Module 1 of Digital Shield',
    xp_reward: 220,
    category: 'mission',
  },
  {
    badge_slug: 'ripple-breaker',
    badge_name: 'Ripple Breaker',
    description: 'Stopped a misinformation chain in Chain Reaction',
    requirement: 'Complete Module 2 of Digital Shield',
    xp_reward: 280,
    category: 'mission',
  },
  {
    badge_slug: 'truth-guardian',
    badge_name: 'Truth Guardian',
    description: 'Maintained 95%+ accuracy across 20 missions',
    requirement: 'Complete all 3 modules of Digital Shield',
    xp_reward: 400,
    category: 'mission',
  },
  {
    badge_slug: 'squad-strategist',
    badge_name: 'Squad Strategist',
    description: 'Led your squad to a Top 3 leaderboard finish',
    requirement: 'Complete Module 3 of Digital Shield',
    xp_reward: 350,
    category: 'mission',
  },
  // Scanner badges
  {
    badge_slug: 'deepfake-detective',
    badge_name: 'Deepfake Detective',
    description: 'Identified 10 AI-generated deepfake media',
    requirement: 'Scan and correctly identify 10 deepfake items',
    xp_reward: 300,
    category: 'scanner',
  },
  {
    badge_slug: 'scam-slayer',
    badge_name: 'Scam Slayer',
    description: 'Neutralised 15 scam attempts successfully',
    requirement: 'Scan and flag 15 scam messages or links',
    xp_reward: 250,
    category: 'scanner',
  },
  {
    badge_slug: 'qr-guardian',
    badge_name: 'QR Guardian',
    description: 'Scanned and verified 20 QR codes',
    requirement: 'Submit 20 QR code scans via Shield Scanner',
    xp_reward: 200,
    category: 'scanner',
  },
  // Community badges
  {
    badge_slug: 'kindness-champion',
    badge_name: 'Kindness Champion',
    description: 'Completed all anti-cyberbullying modules',
    requirement: 'Finish all content in Cyberbullying Support',
    xp_reward: 180,
    category: 'community',
  },
];

export const BADGE_SLUGS_BY_CATEGORY = {
  mission: ALL_BADGES.filter(b => b.category === 'mission').map(b => b.badge_slug),
  scanner: ALL_BADGES.filter(b => b.category === 'scanner').map(b => b.badge_slug),
  community: ALL_BADGES.filter(b => b.category === 'community').map(b => b.badge_slug),
  social: ALL_BADGES.filter(b => b.category === 'social').map(b => b.badge_slug),
};

export const BADGE_MAP = new Map(ALL_BADGES.map(b => [b.badge_slug, b]));
