import { CheckCircle, AlertTriangle, Brain, Shield, Zap, ArrowRight, Lightbulb, Target, TrendingUp, Award } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

type QuizAnswerType = 'real' | 'misleading' | 'satire' | 'scam';

interface RedFlag { text: string; explanation: string; severity: string; }
interface ManipulationTactic { name: string; description: string; examples: string[]; }
interface QuizQuestion {
  id: number;
  content: string;
  hint: string;
  correct_answer: QuizAnswerType;
  explanation: string;
  red_flags: RedFlag[];
  manipulation_tactics: ManipulationTactic[];
}

interface AnswerResult {
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
  newly_earned_badges?: string[];
}

const BADGE_NAMES: Record<string, string> = {
  'spin-spotter':       'Spin Spotter',
  'ripple-breaker':     'Ripple Breaker',
  'truth-guardian':     'Truth Guardian',
  'squad-strategist':   'Squad Strategist',
  'deepfake-detective': 'Deepfake Detective',
  'scam-slayer':        'Scam Slayer',
  'qr-guardian':        'QR Guardian',
  'kindness-champion':  'Kindness Champion',
};

const ANSWER_LABELS: Record<QuizAnswerType, string> = {
  real: 'Real',
  misleading: 'Misleading',
  satire: 'Satire',
  scam: 'Scam',
};

export function QuizFeedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshMissionStatus, refreshProfile } = useAuth();
  const result = location.state as AnswerResult | null;

  // Fallback if navigated here directly without state
  if (!result) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 h-64 text-center">
        <p className="text-gray-600">No quiz result found. Please answer a question first.</p>
        <Link to="/mission/digital-shield/spot-the-spin" className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
          Go to Quiz
        </Link>
      </div>
    );
  }

  const { is_correct, correct_answer, user_answer, xp_awarded, new_total_xp, correct_count, wrong_count, next_question_index, session_complete, accuracy_pct, question, newly_earned_badges = [] } = result;
  const totalAnswered = correct_count + wrong_count;
  const xpPenalty = 50 - xp_awarded;

  async function handleContinue() {
    if (session_complete) {
      await Promise.all([
        refreshMissionStatus(),
        refreshProfile(),
      ]);
      navigate('/mission/digital-shield/complete');
    } else {
      navigate('/mission/digital-shield/spot-the-spin');
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Result Header */}
      <div className={`rounded-3xl p-8 ${
        is_correct
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'
          : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300'
      }`}>
        <div className="flex items-start gap-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            is_correct ? 'bg-green-500' : 'bg-orange-500'
          }`}>
            {is_correct ? (
              <CheckCircle className="w-12 h-12 text-white" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-white" />
            )}
          </div>

          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 ${is_correct ? 'text-green-900' : 'text-orange-900'}`}>
              {is_correct ? 'Great Job! ✅' : 'Not Quite Right'}
            </h1>
            <p className={`text-lg mb-4 ${is_correct ? 'text-green-800' : 'text-orange-800'}`}>
              {is_correct
                ? `You correctly identified this as ${ANSWER_LABELS[correct_answer]}! Your critical thinking is improving.`
                : `This was actually ${ANSWER_LABELS[correct_answer]}, not ${ANSWER_LABELS[user_answer]}. Let's learn why together.`}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div className="text-sm text-gray-600 mb-1">Your Answer</div>
                <div className={`text-xl font-bold ${is_correct ? 'text-green-700' : 'text-orange-700'}`}>
                  {ANSWER_LABELS[user_answer]}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div className="text-sm text-gray-600 mb-1">Correct Answer</div>
                <div className="text-xl font-bold text-gray-900">{ANSWER_LABELS[correct_answer]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge unlocked notification */}
      {newly_earned_badges.length > 0 && session_complete && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
            🏅
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg leading-tight">
              Badge Unlocked!
            </p>
            <p className="text-white/90 text-sm">
              You earned: {newly_earned_badges.map(slug => BADGE_NAMES[slug] ?? slug).join(', ')}
            </p>
          </div>
          <Award className="w-8 h-8 text-white/60 flex-shrink-0" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Explanation */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-sm text-gray-600">Confidence Score:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '98%' }} />
                    </div>
                    <span className="font-bold text-blue-600">98%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-gray-800 leading-relaxed">{question.explanation}</p>
            </div>
          </div>

          {/* Red Flags — only shown for scam/misleading */}
          {question.red_flags.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Red Flags Detected</h2>
              </div>

              <div className="space-y-3">
                {question.red_flags.map((flag, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 ${
                    flag.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`px-2 py-1 rounded-md text-xs font-bold flex-shrink-0 ${
                        flag.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                      }`}>
                        {flag.severity === 'high' ? 'HIGH RISK' : 'MEDIUM RISK'}
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-sm font-bold text-gray-900 mb-1 bg-white px-2 py-1 rounded inline-block">
                          "{flag.text}"
                        </div>
                        <p className="text-sm text-gray-700">{flag.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manipulation Tactics */}
          {question.manipulation_tactics.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Manipulation Tactics Used</h2>
              </div>

              <div className="space-y-4">
                {question.manipulation_tactics.map((tactic, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎭</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-purple-900 mb-2">{tactic.name}</h3>
                        <p className="text-sm text-purple-800 mb-3">{tactic.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {tactic.examples.map((example, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-200 text-purple-900 text-xs font-medium rounded-full">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Tips */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">How to Verify Next Time</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Check Official Sources', description: 'Government announcements are always published on gov.sg first' },
                { title: 'Verify Through Multiple Channels', description: 'Cross-reference with news outlets and official social media accounts' },
                { title: 'Look for Official Domains', description: 'Real government links end in .gov.sg, not suspicious shortened URLs' },
                { title: 'Check ScamShield App', description: "Singapore's official app can verify suspicious messages and links" },
              ].map((tip) => (
                <div key={tip.title} className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-green-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-green-800">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* XP Earned */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300 shadow-lg">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">+{xp_awarded} XP</div>
              <div className="text-sm text-gray-600">
                {is_correct ? 'Correct Answer!' : 'Learning Bonus'}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base XP:</span>
                <span className="font-bold text-gray-900">+50</span>
              </div>
              {!is_correct && (
                <div className="flex justify-between text-orange-600">
                  <span>Incorrect Answer:</span>
                  <span className="font-bold">-{xpPenalty}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total Earned:</span>
                <span className="font-bold text-yellow-600">+{xp_awarded} XP</span>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-600">
              New Total: {new_total_xp.toLocaleString()} XP
            </div>
          </div>

          {/* Badge Progress */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-gray-900">Badge Progress</h3>
            </div>

            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🎯</div>
              <div className="font-bold text-purple-900">Spin Spotter</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-purple-900">{correct_count}/10</span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  style={{ width: `${Math.min(100, (correct_count / 10) * 100)}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {correct_count >= 10
                    ? 'Badge unlocked! 🎉'
                    : `${10 - correct_count} more correct to unlock!`}
                </span>
              </div>
            </div>
          </div>

          {/* Session Progress */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Questions Answered</span>
                  <span className="font-bold text-gray-900">{totalAnswered}/10</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                    style={{ width: `${(totalAnswered / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy Rate:</span>
                  <span className="font-bold text-blue-600">{accuracy_pct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="font-bold text-orange-600">{correct_count}</span>
                </div>
              </div>
            </div>
          </div>

          {session_complete ? (
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Module Complete!</h3>
              <p className="text-sm text-green-100 mb-4">Amazing work! You've finished Spot the Spin.</p>
              <button
                onClick={handleContinue}
                className="w-full py-3 bg-white hover:bg-green-50 text-green-600 font-bold rounded-xl transition-all text-center"
              >
                View Results
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg text-center">
              <div className="text-4xl mb-3">⛓️</div>
              <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
              <p className="text-sm text-blue-100 mb-4">
                Question {next_question_index + 1} of 10 is next
              </p>
              <button
                onClick={handleContinue}
                className="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Next Question</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleContinue}
          className="px-12 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>{session_complete ? 'View Mission Results' : 'Continue Quiz'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
