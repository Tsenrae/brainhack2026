export type QuizAnswerType = 'real' | 'misleading' | 'satire' | 'scam';
export type ModuleStatus = 'not_started' | 'in_progress' | 'completed';
export type QuestionType = 'post' | 'video';

export interface RedFlag {
  text: string;
  explanation: string;
  severity: 'high' | 'medium';
}

export interface ManipulationTactic {
  name: string;
  description: string;
  examples: string[];
}

export interface QuizQuestion {
  id: number;
  question_type: QuestionType;
  // Post fields (empty strings for video questions)
  content: string;
  likes: string;
  shares: string;
  comments: string;
  // Video fields (only set when question_type === 'video')
  video_url?: string;
  video_title?: string;
  video_description?: string;
  // Common
  hint: string;
  correct_answer: QuizAnswerType;
  explanation: string;
  red_flags: RedFlag[];
  manipulation_tactics: ManipulationTactic[];
}

export interface ModuleProgress {
  module_slug: string;
  status: ModuleStatus;
  correct_count: number;
  wrong_count: number;
  last_question_index: number;
  completed_at: string | null;
}

export interface MissionStatusResponse {
  modules: ModuleProgress[];
  overall_progress_pct: number;
  completed: boolean;
}

export interface QuizSessionResponse {
  question_index: number;
  total_questions: number;
  question: QuizQuestion;
  correct_count: number;
  wrong_count: number;
  session_xp: number;
  streak: number;
  status: ModuleStatus;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: QuizAnswerType;
  user_answer: QuizAnswerType;
  xp_awarded: number;
  new_total_xp: number;
  correct_count: number;
  wrong_count: number;
  next_question_index: number;
  session_complete: boolean;
  accuracy_pct: number;
  question: QuizQuestion;
  newly_earned_badges: string[];
}

export interface MissionBadge {
  badge_slug: string;
  badge_name: string;
  badge_icon: string;
  description: string;
  requirement: string;
  earned: boolean;
  earned_at: string | null;
}
