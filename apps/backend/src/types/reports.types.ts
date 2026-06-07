export type ReportType   = 'screenshot' | 'url' | 'text' | 'qr';
export type ReportStatus = 'pending' | 'ai_reviewing' | 'community_verified' | 'shield_squad' | 'rejected';

export interface CommunityReport {
  id: string;
  type: ReportType;
  content_preview: string;
  description: string | null;
  screenshot_url: string | null;
  status: ReportStatus;
  helped_protect_count: number;
  xp_awarded: number;
  created_at: string;
}

export interface ReportStats {
  total_submissions: number;
  people_protected: number;
  total_xp_earned: number;
}

export interface SubmitReportPayload {
  type: ReportType;
  content?: string;
  description?: string;
  screenshot_base64?: string;
  screenshot_mime?: string;
  screenshot_name?: string;
}

export interface SubmitReportResult {
  report: CommunityReport;
  xp_awarded: number;
}
