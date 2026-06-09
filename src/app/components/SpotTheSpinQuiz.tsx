import { Clock, Lightbulb, Flag, SkipForward, ArrowLeft, Zap, Target, Flame, Trophy, CheckCircle, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

type QuizAnswerType = 'real' | 'misleading' | 'satire' | 'scam';
type QuestionType = 'post' | 'video';

interface QuizQuestion {
  id: number;
  question_type: QuestionType;
  content: string;
  likes: string;
  shares: string;
  comments: string;
  video_url?: string;
  video_title?: string;
  video_description?: string;
  hint: string;
  correct_answer: QuizAnswerType;
  explanation: string;
  red_flags: Array<{ text: string; explanation: string; severity: string }>;
  manipulation_tactics: Array<{ name: string; description: string; examples: string[] }>;
}

interface QuizSession {
  question_index: number;
  total_questions: number;
  question: QuizQuestion;
  correct_count: number;
  wrong_count: number;
  session_xp: number;
  streak: number;
  status: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

const ANSWER_OPTIONS = [
  { value: 'real' as QuizAnswerType, label: 'Real', bgColor: 'bg-green-50', borderColor: 'border-green-300', hoverBorder: 'hover:border-green-500', icon: '✅', description: 'Verified and accurate' },
  { value: 'misleading' as QuizAnswerType, label: 'Misleading', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300', hoverBorder: 'hover:border-yellow-500', icon: '⚠️', description: 'Contains partial truths' },
  { value: 'satire' as QuizAnswerType, label: 'Satire', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', hoverBorder: 'hover:border-blue-500', icon: '😄', description: 'Humor or parody' },
  { value: 'scam' as QuizAnswerType, label: 'Scam', bgColor: 'bg-red-50', borderColor: 'border-red-300', hoverBorder: 'hover:border-red-500', icon: '🚫', description: 'Fraudulent content' },
];

export function SpotTheSpinQuiz() {
  const { session, refreshProfile, refreshMissionStatus } = useAuth();
  const navigate = useNavigate();

  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswerType | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const fetchSession = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setSelectedAnswer(null);
    setShowHint(false);
    setTimeLeft(60);
    try {
      const res = await fetch(`${BACKEND_URL}/api/missions/digital-shield/spot-the-spin/session`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const { data } = await res.json();
      setQuizSession(data);
    } catch (err) {
      console.error('Failed to load quiz session', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  // Countdown timer
  useEffect(() => {
    if (loading || !quizSession) return;
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, loading, quizSession]);

  async function handleSubmit() {
    if (!selectedAnswer || !quizSession || !session || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/missions/digital-shield/spot-the-spin/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          question_index: quizSession.question_index,
          answer: selectedAnswer,
        }),
      });
      const { data } = await res.json();
      await refreshProfile();
      if (data?.session_complete) {
        await refreshMissionStatus();
      }
      navigate('/mission/digital-shield/spot-the-spin/feedback', { state: data });
    } catch (err) {
      console.error('Failed to submit answer', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !quizSession) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-gray-500">Loading question...</div>
      </div>
    );
  }

  const { question, question_index, total_questions, correct_count, wrong_count, session_xp, streak } = quizSession;
  const questionNumber = question_index + 1;
  const progressPct = Math.round((questionNumber / total_questions) * 100);
  const accuracy = correct_count + wrong_count > 0
    ? Math.round((correct_count / (correct_count + wrong_count)) * 100)
    : 0;

  const timerWarning = timeLeft <= 20;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/mission/digital-shield" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Mission</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${timerWarning ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
            <Clock className={`w-5 h-5 ${timerWarning ? 'text-red-600' : 'text-orange-600'}`} />
            <div className="text-sm">
              <div className={`text-xs font-medium ${timerWarning ? 'text-red-600' : 'text-orange-600'}`}>Time Left</div>
              <div className={`text-lg font-bold ${timerWarning ? 'text-red-700' : 'text-orange-700'}`}>
                0:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
            <Zap className="w-5 h-5 text-blue-600" />
            <div className="text-sm">
              <div className="text-xs text-blue-600 font-medium">Score</div>
              <div className="text-lg font-bold text-blue-700">{session_xp} XP</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
            <Flame className="w-5 h-5 text-red-600" />
            <div className="text-sm">
              <div className="text-xs text-red-600 font-medium">Streak</div>
              <div className="text-lg font-bold text-red-700">{streak} 🔥</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Quiz Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                <span className="font-bold text-gray-900">
                  Question {questionNumber} of {total_questions}
                </span>
              </div>
              <span className="text-sm text-gray-600">{progressPct}% Complete</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Card — post or video */}
          {question.question_type === 'video' ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              {/* Video Player Placeholder */}
              <div className="relative bg-gray-900 aspect-video flex flex-col items-center justify-center gap-3">
                {question.video_url ? (
                  <iframe
                    src={question.video_url}
                    title={question.video_title ?? 'Scenario video'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                    <p className="text-white/60 text-sm">Video coming soon</p>
                  </>
                )}
              </div>
              <div className="p-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Play className="w-3 h-3" /> Video Scenario
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{question.video_title}</h3>
                {question.video_description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{question.video_description}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                    ?
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">[User Identity Hidden]</div>
                    <div className="text-sm text-gray-500">2 hours ago</div>
                  </div>
                </div>

                <div className="py-4">
                  <p className="text-lg text-gray-900 leading-relaxed">{question.content}</p>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>❤️</span>
                    <span className="font-medium">{question.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔄</span>
                    <span className="font-medium">{question.shares} shares</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💬</span>
                    <span className="font-medium">{question.comments} comments</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint ? (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-purple-900 mb-2">💡 Hint</h3>
                  <p className="text-sm text-purple-800 leading-relaxed">{question.hint}</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="w-full py-3 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 text-purple-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Show Hint (-10 XP)</span>
            </button>
          )}

          {/* Classification Options */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              How would you classify this {question.question_type === 'video' ? 'video' : 'post'}?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {ANSWER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedAnswer(option.value)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedAnswer === option.value
                      ? `${option.bgColor} ${option.borderColor} shadow-lg scale-105`
                      : `bg-white border-gray-200 ${option.hoverBorder} hover:shadow-md`
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-1">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                  {selectedAnswer === option.value && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || submitting}
              className={`flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all ${
                !selectedAnswer || submitting ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>
            <button className="px-6 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all flex items-center gap-2">
              <SkipForward className="w-5 h-5" />
              <span>Skip</span>
            </button>
            <button className="px-6 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all flex items-center gap-2">
              <Flag className="w-5 h-5" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Current Session</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Questions Answered</span>
                <span className="font-bold text-gray-900">{correct_count + wrong_count} / {total_questions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Correct Answers</span>
                <span className="font-bold text-green-600">{correct_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Wrong Answers</span>
                <span className="font-bold text-red-600">{wrong_count}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-bold text-blue-600">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Badge Progress */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h3 className="font-bold text-gray-900">Spin Spotter Badge</h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-700">Classify all 10 posts correctly to unlock</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-gray-900">{correct_count}/10</span>
                </div>
                <div className="w-full bg-yellow-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
                    style={{ width: `${Math.min(100, (correct_count / 10) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-yellow-200">
                <div className="text-center text-4xl mb-2">🎯</div>
                <div className="text-xs text-center text-gray-600">
                  {correct_count >= 10 ? 'Badge unlocked!' : `${10 - correct_count} more correct to unlock!`}
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4">💡 Quick Tips</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Check for verified sources and official channels',
                'Look for urgency tactics and emotional manipulation',
                'Verify claims with fact-checking websites',
                'Question too-good-to-be-true offers',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
