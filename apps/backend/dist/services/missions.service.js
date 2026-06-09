import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { usersService } from './users.service.js';
import { badgesService } from './badges.service.js';
import { SPOT_THE_SPIN_QUESTIONS, TOTAL_QUESTIONS, MODULE_SLUGS, XP_CORRECT, XP_WRONG, MODULE_COMPLETION_XP, } from '../data/quiz-questions.js';
const DEFAULT_MODULE_PROGRESS = (slug) => ({
    module_slug: slug,
    status: 'not_started',
    correct_count: 0,
    wrong_count: 0,
    last_question_index: 0,
    completed_at: null,
});
// Determines lock/unlock based on sequential completion
function computeModuleStatuses(rows) {
    return MODULE_SLUGS.map((slug, idx) => {
        const row = rows.find(r => r.module_slug === slug) ?? DEFAULT_MODULE_PROGRESS(slug);
        if (idx === 0)
            return row;
        const previous = rows.find(r => r.module_slug === MODULE_SLUGS[idx - 1]);
        if (!previous || previous.status !== 'completed') {
            return { ...row, status: 'not_started' };
        }
        return row;
    });
}
function overallProgress(modules) {
    const completedModules = modules.filter(m => m.status === 'completed').length;
    return Math.round((completedModules / MODULE_SLUGS.length) * 100);
}
// Mutable mock state so the quiz advances on each answer in mock/dev mode
let mockSpotTheSpinProgress = {
    module_slug: 'spot-the-spin',
    status: 'in_progress',
    correct_count: 0,
    wrong_count: 0,
    last_question_index: 0,
    completed_at: null,
};
const MOCK_MODULES = [
    mockSpotTheSpinProgress,
    DEFAULT_MODULE_PROGRESS('chain-reaction'),
    DEFAULT_MODULE_PROGRESS('shield-squad'),
];
export const missionsService = {
    async getMissionStatus(userId) {
        if (isMockMode) {
            const modules = computeModuleStatuses(MOCK_MODULES);
            return {
                modules,
                overall_progress_pct: overallProgress(modules),
                completed: modules.every(m => m.status === 'completed'),
            };
        }
        const { data, error } = await supabaseAdmin
            .from('mission_progress')
            .select('*')
            .eq('user_id', userId);
        if (error)
            throw new Error(`getMissionStatus: ${error.message}`);
        const rows = (data ?? []);
        const modules = computeModuleStatuses(rows);
        return {
            modules,
            overall_progress_pct: overallProgress(modules),
            completed: modules.every(m => m.status === 'completed'),
        };
    },
    async getQuizSession(userId) {
        if (isMockMode) {
            const idx = Math.min(mockSpotTheSpinProgress.last_question_index, TOTAL_QUESTIONS - 1);
            const question = SPOT_THE_SPIN_QUESTIONS[idx];
            return {
                question_index: idx,
                total_questions: TOTAL_QUESTIONS,
                question,
                correct_count: mockSpotTheSpinProgress.correct_count,
                wrong_count: mockSpotTheSpinProgress.wrong_count,
                session_xp: mockSpotTheSpinProgress.correct_count * XP_CORRECT + mockSpotTheSpinProgress.wrong_count * XP_WRONG,
                streak: 0,
                status: mockSpotTheSpinProgress.status,
            };
        }
        const { data, error } = await supabaseAdmin
            .from('mission_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('module_slug', 'spot-the-spin')
            .single();
        const progress = error?.code === 'PGRST116'
            ? DEFAULT_MODULE_PROGRESS('spot-the-spin')
            : data;
        // Upsert to in_progress if first visit
        if (progress.status === 'not_started') {
            await supabaseAdmin
                .from('mission_progress')
                .upsert({ user_id: userId, module_slug: 'spot-the-spin', status: 'in_progress' }, { onConflict: 'user_id,module_slug' });
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
    async submitAnswer(userId, questionIndex, answer) {
        const question = SPOT_THE_SPIN_QUESTIONS[questionIndex];
        if (!question)
            throw new Error('Invalid question index');
        const isCorrect = question.correct_answer === answer;
        const xpAwarded = isCorrect ? XP_CORRECT : XP_WRONG;
        if (isMockMode) {
            const newCorrect = mockSpotTheSpinProgress.correct_count + (isCorrect ? 1 : 0);
            const newWrong = mockSpotTheSpinProgress.wrong_count + (isCorrect ? 0 : 1);
            const nextIdx = questionIndex + 1;
            const sessionComplete = nextIdx >= TOTAL_QUESTIONS;
            const accuracy = Math.round((newCorrect / (newCorrect + newWrong)) * 100);
            // Persist state so the next getQuizSession call returns the right question
            mockSpotTheSpinProgress.correct_count = newCorrect;
            mockSpotTheSpinProgress.wrong_count = newWrong;
            mockSpotTheSpinProgress.last_question_index = sessionComplete ? TOTAL_QUESTIONS : nextIdx;
            if (sessionComplete) {
                mockSpotTheSpinProgress.status = 'completed';
                mockSpotTheSpinProgress.completed_at = new Date().toISOString();
            }
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
                newly_earned_badges: sessionComplete ? ['spin-spotter'] : [],
            };
        }
        // Fetch current progress
        const { data: existingData } = await supabaseAdmin
            .from('mission_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('module_slug', 'spot-the-spin')
            .single();
        const existing = existingData ?? DEFAULT_MODULE_PROGRESS('spot-the-spin');
        const newCorrect = existing.correct_count + (isCorrect ? 1 : 0);
        const newWrong = existing.wrong_count + (isCorrect ? 0 : 1);
        const nextIdx = questionIndex + 1;
        const sessionComplete = nextIdx >= TOTAL_QUESTIONS;
        const accuracy = Math.round((newCorrect / (newCorrect + newWrong)) * 100);
        const updates = {
            user_id: userId,
            module_slug: 'spot-the-spin',
            status: sessionComplete ? 'completed' : 'in_progress',
            correct_count: newCorrect,
            wrong_count: newWrong,
            last_question_index: sessionComplete ? TOTAL_QUESTIONS : nextIdx,
            updated_at: new Date().toISOString(),
        };
        if (sessionComplete)
            updates.completed_at = new Date().toISOString();
        await supabaseAdmin.from('mission_progress').upsert(updates, { onConflict: 'user_id,module_slug' });
        // Award XP
        const updatedProfile = await usersService.awardXp(userId, { amount: xpAwarded });
        // On completion: award module completion XP, update profile stats, unlock badge
        const newlyEarnedBadges = [];
        if (sessionComplete) {
            await usersService.awardXp(userId, {
                amount: MODULE_COMPLETION_XP['spot-the-spin'],
                reason: 'Module 1 completion bonus',
            });
            await missionsService.incrementMissionsCompleted(userId, accuracy);
            const isNew = await badgesService.awardBadge(userId, 'spin-spotter');
            if (isNew)
                newlyEarnedBadges.push('spin-spotter');
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
            newly_earned_badges: newlyEarnedBadges,
        };
    },
    async incrementMissionsCompleted(userId, moduleAccuracy) {
        const { data } = await supabaseAdmin
            .from('profiles')
            .select('missions_completed, accuracy_rate')
            .eq('id', userId)
            .single();
        if (!data)
            return;
        const newCount = (data.missions_completed ?? 0) + 1;
        const prevAccuracy = data.accuracy_rate ?? 0;
        const newAccuracy = Math.round((prevAccuracy * (newCount - 1) + moduleAccuracy) / newCount);
        await supabaseAdmin
            .from('profiles')
            .update({
            missions_completed: newCount,
            accuracy_rate: newAccuracy,
            updated_at: new Date().toISOString(),
        })
            .eq('id', userId);
    },
};
