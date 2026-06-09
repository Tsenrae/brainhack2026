import crypto from "node:crypto";
import { isMockMode, supabaseAdmin } from "../config/supabase.js";
import { analyseScanPreview } from "./scanner.service.js";
import { usersService } from "./users.service.js";
import type { UserProfile } from "../types/user.types.js";
import type {
  TelegramAnalyzeRequest,
  TelegramAnalysisResponse,
  TelegramBotCommand,
  TelegramBotInfo,
  TelegramLinkCodeResponse,
  TelegramLinkRequest,
  TelegramLinkStatus,
  TelegramMissionRecommendation,
  TelegramRecentScan,
  TelegramScanHistoryItem,
  TelegramStats,
} from "../types/telegram.types.js";
import type { ScanResult } from "../types/scanner.types.js";

const TELEGRAM_XP_PER_SCAN = 25;
const LINK_CODE_TTL_HOURS = 24;

const MOCK_LINK_STATUS: TelegramLinkStatus = {
  linked: true,
  profile_id: "mock-user-id-001",
  telegram_user_id: "123456789",
  telegram_username: "shieldverse_demo",
  telegram_link_code: "TGMOCK1",
  telegram_linked_at: new Date().toISOString(),
};

const MOCK_RECENT_SCANS: TelegramRecentScan[] = [
  {
    scan_id: "mock-telegram-scan-1",
    preview: "DBS: account suspended, verify now",
    risk_score: 94,
    classification: "Phishing Scam",
    threat_level: "critical",
    timestamp: "2 hours ago",
    color: "red",
  },
  {
    scan_id: "mock-telegram-scan-2",
    preview: "gov.sg public advisory on scams",
    risk_score: 8,
    classification: "Safe",
    threat_level: "safe",
    timestamp: "6 hours ago",
    color: "green",
  },
  {
    scan_id: "mock-telegram-scan-3",
    preview: "Part-time work from home, $300/day",
    risk_score: 71,
    classification: "Job Scam",
    threat_level: "high",
    timestamp: "1 day ago",
    color: "yellow",
  },
];

const MOCK_SCAN_HISTORY: TelegramScanHistoryItem[] = MOCK_RECENT_SCANS.map(
  (scan, index) => ({
    scan_id: scan.scan_id,
    telegram_user_id: MOCK_LINK_STATUS.telegram_user_id ?? "123456789",
    telegram_username: MOCK_LINK_STATUS.telegram_username,
    preview: scan.preview,
    risk_score: scan.risk_score,
    classification: scan.classification,
    threat_level: scan.threat_level,
    xp_awarded: TELEGRAM_XP_PER_SCAN,
    timestamp: new Date(Date.now() - index * 3_600_000).toISOString(),
  }),
);

const BOT_COMMANDS: TelegramBotCommand[] = [
  {
    command: "/start",
    description: "Open the bot and get a quick welcome message",
  },
  {
    command: "/link <code>",
    description: "Link your Telegram account to your ShieldVerse profile",
  },
  {
    command: "/help",
    description: "See how to use the bot and what it can scan",
  },
  { command: "/stats", description: "View your Telegram protection stats" },
  { command: "/missions", description: "Jump to a related training mission" },
];

function normalizeUsername(username?: string | null): string | null {
  if (!username) return null;
  const trimmed = username.trim().replace(/^@/, "");
  return trimmed.length > 0 ? trimmed : null;
}

function generateLinkCode(): string {
  return `TG-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function buildMissionRecommendation(
  analysis: ScanResult,
): TelegramMissionRecommendation {
  const lowerClassification = analysis.classification.toLowerCase();

  if (
    lowerClassification.includes("phishing") ||
    lowerClassification.includes("scam")
  ) {
    return {
      title: "Digital Shield",
      slug: "digital-shield",
      path: "/mission/digital-shield",
      reason: "Reinforce scam spotting and message verification skills.",
    };
  }

  if (
    lowerClassification.includes("misinformation") ||
    lowerClassification.includes("deepfake")
  ) {
    return {
      title: "Scenario Academy",
      slug: "scenario-academy",
      path: "/learn",
      reason: "Practice spotting manipulated media and misleading claims.",
    };
  }

  return {
    title: "Mission Hub",
    slug: "mission-hub",
    path: "/mission/digital-shield",
    reason: "Continue with the core training path for message verification.",
  };
}

function buildReplyText(
  analysis: ScanResult,
  relatedMission: TelegramMissionRecommendation,
): string {
  const redFlags =
    analysis.red_flags.length > 0
      ? analysis.red_flags
          .slice(0, 3)
          .map((flag) => `• ${flag.title}`)
          .join("\n")
      : "• No major red flags detected";

  const actions = analysis.recommended_actions
    .slice(0, 3)
    .map((action) => `• ${action.action}`)
    .join("\n");

  return [
    `⚠️ ${analysis.classification} (${analysis.risk_score}/100)`,
    "",
    `Risk score: ${analysis.risk_score}/100`,
    `Classification: ${analysis.classification}`,
    "",
    "Red flags detected:",
    redFlags,
    "",
    "Recommended actions:",
    actions,
    "",
    `Related training mission: ${relatedMission.title}`,
    `+${TELEGRAM_XP_PER_SCAN} XP earned`,
  ].join("\n");
}

function formatAnalysis(analysis: ScanResult): TelegramAnalysisResponse {
  const relatedMission = buildMissionRecommendation(analysis);
  return {
    risk_score: analysis.risk_score,
    threat_level: analysis.threat_level,
    classification: analysis.classification,
    confidence_score: analysis.confidence_score,
    suspicious_elements: analysis.suspicious_elements,
    red_flags: analysis.red_flags,
    recommended_actions: analysis.recommended_actions,
    analysis_breakdown: analysis.analysis_breakdown,
    related_mission: relatedMission,
    bot_reply: buildReplyText(analysis, relatedMission),
    xp_awarded: TELEGRAM_XP_PER_SCAN,
  };
}

function recentColor(riskScore: number): "red" | "yellow" | "green" {
  if (riskScore > 70) return "red";
  if (riskScore > 40) return "yellow";
  return "green";
}

async function fetchLinkedProfileByTelegramUserId(
  telegramUserId: string,
): Promise<UserProfile | null> {
  if (isMockMode) {
    return MOCK_LINK_STATUS.telegram_user_id === telegramUserId
      ? await usersService.getProfile(MOCK_LINK_STATUS.profile_id)
      : null;
  }

  const { data, error } = await supabaseAdmin!
    .from("profiles")
    .select("*")
    .eq("telegram_user_id", telegramUserId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error)
    throw new Error(`fetchLinkedProfileByTelegramUserId: ${error.message}`);
  return data as UserProfile;
}

async function fetchProfileById(
  profileId: string,
): Promise<UserProfile | null> {
  if (isMockMode) {
    return profileId === MOCK_LINK_STATUS.profile_id
      ? await usersService.getProfile(profileId)
      : null;
  }

  const { data, error } = await supabaseAdmin!
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(`fetchProfileById: ${error.message}`);
  return data as UserProfile;
}

async function persistTelegramScan(
  profile: UserProfile,
  telegramUserId: string,
  analysis: TelegramAnalysisResponse,
  request: TelegramAnalyzeRequest,
): Promise<TelegramScanHistoryItem> {
  const scannedAt = new Date().toISOString();
  const scanId = `telegram-${crypto.randomUUID()}`;
  const preview =
    request.content.length > 90
      ? `${request.content.slice(0, 87)}...`
      : request.content;

  if (!isMockMode) {
    const { error } = await supabaseAdmin!
      .from("telegram_scan_history")
      .insert({
        id: scanId,
        profile_id: profile.id,
        telegram_user_id: telegramUserId,
        telegram_username: normalizeUsername(request.telegram_username),
        telegram_message_id: request.message_id?.toString() ?? null,
        source_chat_id: request.chat_id?.toString() ?? null,
        source_chat_title: request.chat_title ?? null,
        content_preview: preview,
        content_text: request.content,
        risk_score: analysis.risk_score,
        classification: analysis.classification,
        threat_level: analysis.threat_level,
        confidence_score: analysis.confidence_score,
        result_data: {
          suspicious_elements: analysis.suspicious_elements,
          red_flags: analysis.red_flags,
          recommended_actions: analysis.recommended_actions,
          analysis_breakdown: analysis.analysis_breakdown,
          related_mission: analysis.related_mission,
        },
        xp_awarded: TELEGRAM_XP_PER_SCAN,
        scanned_at: scannedAt,
      });

    if (error) throw new Error(`persistTelegramScan: ${error.message}`);
  }

  return {
    scan_id: scanId,
    telegram_user_id: telegramUserId,
    telegram_username: normalizeUsername(request.telegram_username),
    preview,
    risk_score: analysis.risk_score,
    classification: analysis.classification,
    threat_level: analysis.threat_level,
    xp_awarded: TELEGRAM_XP_PER_SCAN,
    timestamp: scannedAt,
  };
}

export const telegramService = {
  getBotInfo(): TelegramBotInfo {
    return {
      username: "@ShieldVerseSG_bot",
      url: "https://t.me/ShieldVerseSG_bot",
    };
  },

  getCommands(): TelegramBotCommand[] {
    return BOT_COMMANDS;
  },

  async getStatus(userId: string): Promise<TelegramLinkStatus> {
    if (isMockMode) return MOCK_LINK_STATUS;

    const profile = await fetchProfileById(userId);
    if (!profile) throw new Error("Profile not found");

    return {
      linked: profile.telegram_user_id !== null,
      profile_id: profile.id,
      telegram_user_id: profile.telegram_user_id,
      telegram_username: profile.telegram_username,
      telegram_link_code: profile.telegram_link_code,
      telegram_linked_at: profile.telegram_linked_at,
    };
  },

  async createLinkCode(userId: string): Promise<TelegramLinkCodeResponse> {
    const linkCode = generateLinkCode();
    const expiresAt = new Date(
      Date.now() + LINK_CODE_TTL_HOURS * 60 * 60 * 1000,
    ).toISOString();

    if (!isMockMode) {
      const { error } = await supabaseAdmin!
        .from("profiles")
        .update({
          telegram_link_code: linkCode,
          telegram_link_code_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw new Error(`createLinkCode: ${error.message}`);
    }

    return { link_code: linkCode, expires_at: expiresAt };
  },

  async linkTelegramAccount(
    payload: TelegramLinkRequest,
  ): Promise<TelegramLinkStatus> {
    const telegramUsername = normalizeUsername(payload.telegram_username);

    if (isMockMode) {
      if (payload.link_code !== MOCK_LINK_STATUS.telegram_link_code) {
        throw new Error("Invalid or expired Telegram link code");
      }
      return {
        ...MOCK_LINK_STATUS,
        telegram_user_id: payload.telegram_user_id,
        telegram_username: telegramUsername,
        linked: true,
      };
    }

    const { data: profile, error: lookupError } = await supabaseAdmin!
      .from("profiles")
      .select("*")
      .eq("telegram_link_code", payload.link_code)
      .single();

    if (lookupError?.code === "PGRST116" || !profile) {
      throw new Error("Invalid or expired Telegram link code");
    }
    if (lookupError)
      throw new Error(`linkTelegramAccount lookup: ${lookupError.message}`);

    const { data: existing, error: conflictError } = await supabaseAdmin!
      .from("profiles")
      .select("id")
      .eq("telegram_user_id", payload.telegram_user_id)
      .maybeSingle();

    if (conflictError)
      throw new Error(`linkTelegramAccount conflict: ${conflictError.message}`);
    if (existing && existing.id !== profile.id) {
      throw new Error(
        "This Telegram account is already linked to another profile",
      );
    }

    const linkedAt = new Date().toISOString();
    const { data: updated, error: updateError } = await supabaseAdmin!
      .from("profiles")
      .update({
        telegram_user_id: payload.telegram_user_id,
        telegram_username: telegramUsername,
        telegram_link_code: null,
        telegram_link_code_expires_at: null,
        telegram_linked_at: linkedAt,
        updated_at: linkedAt,
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (updateError)
      throw new Error(`linkTelegramAccount update: ${updateError.message}`);

    return {
      linked: true,
      profile_id: updated.id,
      telegram_user_id: updated.telegram_user_id,
      telegram_username: updated.telegram_username,
      telegram_link_code: updated.telegram_link_code,
      telegram_linked_at: updated.telegram_linked_at,
    };
  },

  async analyzeMessage(
    request: TelegramAnalyzeRequest,
  ): Promise<TelegramAnalysisResponse> {
    const rawAnalysis = await analyseScanPreview("text", request.content);
    const analysis = formatAnalysis(rawAnalysis as ScanResult);

    const profile = request.profile_id
      ? await fetchProfileById(request.profile_id)
      : request.telegram_user_id
        ? await fetchLinkedProfileByTelegramUserId(request.telegram_user_id)
        : null;

    if (!profile) {
      throw new Error("Telegram account is not linked to a profile yet");
    }

    const telegramUserId = request.telegram_user_id ?? profile.telegram_user_id;
    if (!telegramUserId) {
      throw new Error("Telegram account is not linked to a profile yet");
    }

    const persistedScan = await persistTelegramScan(
      profile,
      telegramUserId,
      analysis,
      request,
    );
    const updatedProfile = await usersService.awardXp(profile.id, {
      amount: TELEGRAM_XP_PER_SCAN,
      reason: "Telegram bot scan",
    });

    return {
      ...analysis,
      xp_awarded: TELEGRAM_XP_PER_SCAN,
      bot_reply: `${analysis.bot_reply}\n\nLinked to ${updatedProfile.username} • Scan saved as ${persistedScan.scan_id}`,
    };
  },

  async getStats(
    userId?: string,
    telegramUserId?: string,
  ): Promise<TelegramStats> {
    if (isMockMode) {
      return {
        messages_scanned: 23,
        threats_blocked: 8,
        xp_earned: 575,
      };
    }

    const profile = userId
      ? await fetchProfileById(userId)
      : telegramUserId
        ? await fetchLinkedProfileByTelegramUserId(telegramUserId)
        : null;

    if (!profile) {
      return { messages_scanned: 0, threats_blocked: 0, xp_earned: 0 };
    }

    const { data, error } = await supabaseAdmin!
      .from("telegram_scan_history")
      .select("risk_score, xp_awarded")
      .eq("profile_id", profile.id);

    if (error) throw new Error(`getStats: ${error.message}`);
    const rows = data ?? [];

    return {
      messages_scanned: rows.length,
      threats_blocked: rows.filter((row) => Number(row.risk_score) > 50).length,
      xp_earned: rows.reduce(
        (sum, row) => sum + Number(row.xp_awarded ?? 0),
        0,
      ),
    };
  },

  async getRecentScans(
    userId?: string,
    telegramUserId?: string,
  ): Promise<TelegramRecentScan[]> {
    if (isMockMode) return MOCK_RECENT_SCANS;

    const profile = userId
      ? await fetchProfileById(userId)
      : telegramUserId
        ? await fetchLinkedProfileByTelegramUserId(telegramUserId)
        : null;

    if (!profile) return [];

    const { data, error } = await supabaseAdmin!
      .from("telegram_scan_history")
      .select(
        "id, content_preview, risk_score, classification, threat_level, scanned_at",
      )
      .eq("profile_id", profile.id)
      .order("scanned_at", { ascending: false })
      .limit(3);

    if (error) throw new Error(`getRecentScans: ${error.message}`);

    return (data ?? []).map((row) => ({
      scan_id: row.id,
      preview: row.content_preview,
      risk_score: row.risk_score,
      classification: row.classification,
      threat_level: row.threat_level,
      timestamp: row.scanned_at,
      color: recentColor(row.risk_score),
    }));
  },

  async getScanHistory(
    userId?: string,
    telegramUserId?: string,
  ): Promise<TelegramScanHistoryItem[]> {
    if (isMockMode) return MOCK_SCAN_HISTORY;

    const profile = userId
      ? await fetchProfileById(userId)
      : telegramUserId
        ? await fetchLinkedProfileByTelegramUserId(telegramUserId)
        : null;

    if (!profile) return [];

    const { data, error } = await supabaseAdmin!
      .from("telegram_scan_history")
      .select(
        "id, telegram_user_id, telegram_username, content_preview, risk_score, classification, threat_level, xp_awarded, scanned_at",
      )
      .eq("profile_id", profile.id)
      .order("scanned_at", { ascending: false })
      .limit(10);

    if (error) throw new Error(`getScanHistory: ${error.message}`);

    return (data ?? []).map((row) => ({
      scan_id: row.id,
      telegram_user_id: row.telegram_user_id,
      telegram_username: row.telegram_username,
      preview: row.content_preview,
      risk_score: row.risk_score,
      classification: row.classification,
      threat_level: row.threat_level,
      xp_awarded: row.xp_awarded,
      timestamp: row.scanned_at,
    }));
  },
};
