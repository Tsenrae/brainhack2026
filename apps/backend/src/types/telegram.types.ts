import type {
  AnalysisBreakdown,
  RecommendedAction,
  ScanRedFlag,
  SuspiciousElement,
  ThreatLevel,
} from './scanner.types.js';

export interface TelegramMissionRecommendation {
  title: string;
  slug: string;
  path: string;
  reason: string;
}

export interface TelegramBotInfo {
  username: string;
  url: string;
}

export interface TelegramLinkStatus {
  linked: boolean;
  profile_id: string;
  telegram_user_id: string | null;
  telegram_username: string | null;
  telegram_link_code: string | null;
  telegram_linked_at: string | null;
}

export interface TelegramLinkCodeResponse {
  link_code: string;
  expires_at: string;
}

export interface TelegramLinkRequest {
  link_code: string;
  telegram_user_id: string;
  telegram_username?: string | null;
}

export interface TelegramAnalyzeRequest {
  content: string;
  telegram_user_id?: string;
  telegram_username?: string | null;
  profile_id?: string;
  message_id?: string | number | null;
  chat_id?: string | number | null;
  chat_title?: string | null;
  source?: 'bot' | 'web';
}

export interface TelegramAnalysisResponse {
  risk_score: number;
  threat_level: ThreatLevel;
  classification: string;
  confidence_score: number;
  suspicious_elements: SuspiciousElement[];
  red_flags: ScanRedFlag[];
  recommended_actions: RecommendedAction[];
  analysis_breakdown: AnalysisBreakdown;
  related_mission: TelegramMissionRecommendation;
  bot_reply: string;
  xp_awarded: number;
}

export interface TelegramRecentScan {
  scan_id: string;
  preview: string;
  risk_score: number;
  classification: string;
  threat_level: ThreatLevel;
  timestamp: string;
  color: 'red' | 'yellow' | 'green';
}

export interface TelegramScanHistoryItem {
  scan_id: string;
  telegram_user_id: string;
  telegram_username: string | null;
  preview: string;
  risk_score: number;
  classification: string;
  threat_level: ThreatLevel;
  xp_awarded: number;
  timestamp: string;
}

export interface TelegramStats {
  messages_scanned: number;
  threats_blocked: number;
  xp_earned: number;
}

export interface TelegramBotCommand {
  command: string;
  description: string;
}