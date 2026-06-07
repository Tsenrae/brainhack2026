export type ScanType = 'text' | 'url' | 'qr';
export type ThreatLevel = 'safe' | 'low' | 'suspicious' | 'high' | 'critical';

export interface SuspiciousElement {
  element: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface ScanRedFlag {
  title: string;
  description: string;
  examples: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RecommendedAction {
  action: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RECOMMENDED';
}

export interface AnalysisBreakdown {
  pattern_matches: number;
  manipulation_tactics: number;
  match_rate_pct: number;
}

export interface ScanResult {
  scan_id: string;
  type: ScanType;
  content_preview: string;
  risk_score: number;
  threat_level: ThreatLevel;
  classification: string;
  confidence_score: number;
  suspicious_elements: SuspiciousElement[];
  red_flags: ScanRedFlag[];
  recommended_actions: RecommendedAction[];
  analysis_breakdown: AnalysisBreakdown;
  xp_awarded: number;
  newly_earned_badges: string[];
  scanned_at: string;
}

export interface ScanHistoryItem {
  scan_id: string;
  type: ScanType;
  content_preview: string;
  risk_score: number;
  classification: string;
  scanned_at: string;
}

export interface ScannerStats {
  total_scans: number;
  threats_found: number;
  safe_count: number;
  xp_earned: number;
}
