import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { usersService } from './users.service.js';
import {
  SPOT_THE_SPIN_QUESTIONS,
  TOTAL_QUESTIONS,
  MISSION_BADGES,
  MODULE_SLUGS,
  XP_CORRECT,
  XP_WRONG,
  MODULE_COMPLETION_XP,
  type ModuleSlug,
} from '../data/quiz-questions.js';
import type {
  ModuleProgress,
  MissionStatusResponse,
  QuizSessionResponse,
  AnswerResult,
  MissionBadge,
  QuizAnswerType,
} from '../types/mission.types.js';

const DEFAULT_MODULE_PROGRESS = (slug: string): ModuleProgress => ({
  module_slug: slug,
  status: 'not_started',
  correct_count: 0,
  wrong_count: 0,
  last_question_index: 0,
  completed_at: null,
});

// Determines lock/unlock based on sequential completion
function computeModuleStatuses(rows: ModuleProgress[]): ModuleProgress[] {
  return MODULE_SLUGS.map((slug, idx) => {
    const row = rows.find(r => r.module_slug === slug) ?? DEFAULT_MODULE_PROGRESS(slug);
    if (idx === 0) return row;
    const previous = rows.find(r => r.module_slug === MODULE_SLUGS[idx - 1]);
    if (!previous || previous.status !== 'completed') {
      return { ...row, status: 'not_started' };
    }
    return row;
  });
}

function overallProgress(modules: ModuleProgress[]): number {
  const completedModules = modules.filter(m => m.status === 'completed').length;
  return Math.round((completedModules / MODULE_SLUGS.length) * 100);
}

// Mock session state — module 1 in-progress at question 5
const MOCK_MODULES: ModuleProgress[] = [
  {
    module_slug: 'spot-the-spin',
    status: 'in_progress',
    correct_count: 4,
    wrong_count: 1,
    last_question_index: 5,
    completed_at: null,
  },
  DEFAULT_MODULE_PROGRESS('chain-reaction'),
  DEFAULT_MODULE_PROGRESS('shield-squad'),
];

export const missionsService = {
  async getMissionStatus(userId: string): Promise<MissionStatusResponse> {
    if (isMockMode) {
      const modules = computeModuleStatuses(MOCK_MODULES);
      return {
        modules,
        overall_progress_pct: overallProgress(modules),
        completed: modules.every(m => m.status === 'completed'),
      };
    }

    const { data, error } = await supabaseAdmin!
      .from('mission_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(`getMissionStatus: ${error.message}`);

    const rows = (data ?? []) as ModuleProgress[];
    const modules = computeModuleStatuses(rows);
    return {
      modules,
      overall_progress_pct: overallProgress(modules),
      completed: modules.every(m => m.status === 'completed'),
    };
  },

  async getQuizSession(userId: string): Promise<QuizSessionResponse> {
    if (isMockMode) {
      const idx = MOCK_MODULES[0].last_question_index;
      const question = SPOT_THE_SPIN_QUESTIONS[idx];
      return {
        question_index: idx,
        total_questions: TOTAL_QUESTIONS,
        question,
        correct_count: MOCK_MODULES[0].correct_count,
        wrong_count: MOCK_MODULES[0].wrong_count,
        session_xp: MOCK_MODULES[0].correct_count * XP_CORRECT + MOCK_MODULES[0].wrong_count * XP_WRONG,
        streak: 3,
        status: MOCK_MODULES[0].status,
      };
    }

    const { data, error } = await supabaseAdmin!
      .from('mission_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_slug', 'spot-the-spin')
      .single();

    const progress: ModuleProgress = error?.code === 'PGRST116'
      ? DEFAULT_MODULE_PROGRESS('spot-the-spin')
      : (data as ModuleProgress);

    // Upsert to in_progress if first visit
    if (progress.status === 'not_started') {
      await supabaseAdmin!
        .from('mission_progress')
        .upsert({ user_id: userId, module_slug: 'spot-the-spin', status: 'in_progress' });
    }

    const idx = Math.min(progress.last_question_index, TOTAL_QUESTIONS - 1);
    const question = SPOT_THE_SPIN_QUESTIONS[idx];
    const sessionXp = progress.correct_count * XP_CORRECT + progress.wrong_count * XP_WRONG;

    return {
      question_index: idx,
      total_questions: TOTAL_QUESTIONS,
      question,
      correct_count: progress.correct_count,
      wrong_count: progress.wrong_count,
      session_xp: sessionXp,
      streak: 0,
      status: progress.status === 'not_started' ? 'in_progress' : progress.status,
    };
  },

  async submitAnswer(
    userId: string,
    questionIndex: number,
    answer: QuizAnswerType,
  ): Promise<AnswerResult> {
    const question = SPOT_THE_SPIN_QUESTIONS[questionIndex];
    if (!question) throw new Error('Invalid question index');

    const isCorrect = question.correct_answer === answer;
    const xpAwarded = isCorrect ? XP_CORRECT : XP_WRONG;

    if (isMockMode) {
      const mockProgress = MOCK_MODULES[0];
      const newCorrect = mockProgress.correct_count + (isCorrect ? 1 : 0);
      const newWrong = mockProgress.wrong_count + (isCorrect ? 0 : 1);
      const nextIdx = questionIndex + 1;
      const sessionComplete = nextIdx >= TOTAL_QUESTIONS;
      const accuracy = Math.round((newCorrect / (newCorrect + newWrong)) * 100);

      return {
        is_correct: isCorrect,
        correct_answer: question.correct_answer,
        user_answer: answer,
        xp_awarded: xpAwarded,
        new_total_xp: 2450 + xpAwarded,
        correct_count: newCorrect,
        wrong_count: newWrong,
        next_question_index: sessionComplete ? TOTAL_QUESTIONS - 1 : nextIdx,
        session_complete: sessionComplete,
        accuracy_pct: accuracy,
        question,
      };
    }

    // Fetch current progress
    const { data: existingData } = await supabaseAdmin!
      .from('mission_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_slug', 'spot-the-spin')
      .single();

    const existing: ModuleProgress = existingData ?? DEFAULT_MODULE_PROGRESS('spot-the-spin');

    const newCorrect = existing.correct_count + (isCorrect ? 1 : 0);
    const newWrong = existing.wrong_count + (isCorrect ? 0 : 1);
    const nextIdx = questionIndex + 1;
    const sessionComplete = nextIdx >= TOTAL_QUESTIONS;
    const accuracy = Math.round((newCorrect / (newCorrect + newWrong)) * 100);

    const updates: Record<string, unknown> = {
      user_id: userId,
      module_slug: 'spot-the-spin',
      status: sessionComplete ? 'completed' : 'in_progress',
      correct_count: newCorrect,
      wrong_count: newWrong,
      last_question_index: sessionComplete ? TOTAL_QUESTIONS : nextIdx,
      updated_at: new Date().toISOString(),
    };
    if (sessionComplete) updates.completed_at = new Date().toISOString();

    await supabaseAdmin!.from('mission_progress').upsert(updates);

    // Award XP
    const updatedProfile = await usersService.awardXp(userId, { amount: xpAwarded });

    // On completion: award module completion XP, update profile stats, unlock badge
    if (sessionComplete) {
      await usersService.awardXp(userId, {
        amount: MODULE_COMPLETION_XP['spot-the-spin'],
        reason: 'Module 1 completion bonus',
      });

      await missionsService.incrementMissionsCompleted(userId, accuracy);

      await supabaseAdmin!
        .from('user_badges')
        .upsert({ user_id: userId, badge_slug: 'spin-spotter' });
    }

    return {
      is_correct: isCorrect,
      correct_answer: question.correct_answer,
      user_answer: answer,
      xp_awarded: xpAwarded,
      new_total_xp: updatedProfile.xp,
      correct_count: newCorrect,
      wrong_count: newWrong,
      next_question_index: sessionComplete ? TOTAL_QUESTIONS - 1 : nextIdx,
      session_complete: sessionComplete,
      accuracy_pct: accuracy,
      question,
    };
  },

  async getBadges(userId: string): Promise<MissionBadge[]> {
    if (isMockMode) {
      return MISSION_BADGES.map((b, idx) => ({
        ...b,
        earned: idx === 0,
        earned_at: idx === 0 ? new Date().toISOString() : null,
      }));
    }

    const { data } = await supabaseAdmin!
      .from('user_badges')
      .select('badge_slug, earned_at')
      .eq('user_id', userId);

    const earned = new Map((data ?? []).map((r: { badge_slug: string; earned_at: string }) => [r.badge_slug, r.earned_at]));

    return MISSION_BADGES.map(b => ({
      ...b,
      earned: earned.has(b.badge_slug),
      earned_at: earned.get(b.badge_slug) ?? null,
    }));
  },

  async incrementMissionsCompleted(userId: string, moduleAccuracy: number): Promise<void> {
    const { data } = await supabaseAdmin!
      .from('profiles')
      .select('missions_completed, accuracy_rate')
      .eq('id', userId)
      .single();

    if (!data) return;

    const newCount = (data.missions_completed ?? 0) + 1;
    const prevAccuracy = data.accuracy_rate ?? 0;
    const newAccuracy = Math.round(
      (prevAccuracy * (newCount - 1) + moduleAccuracy) / newCount,
    );

    await supabaseAdmin!
      .from('profiles')
      .update({
        missions_completed: newCount,
        accuracy_rate: newAccuracy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  },
};
