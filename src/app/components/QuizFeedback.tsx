import { CheckCircle, XCircle, AlertTriangle, Brain, Shield, Zap, ArrowRight, Lightbulb, Target, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router';

export function QuizFeedback() {
  const isCorrect = false; // User selected "Misleading" but correct answer was "Scam"
  const userAnswer = "Misleading";
  const correctAnswer = "Scam";

  const redFlags = [
    {
      text: "🚨 BREAKING:",
      explanation: "Creates false urgency to pressure quick action without verification",
      severity: "high"
    },
    {
      text: "FREE cash handout of $5,000",
      explanation: "Unrealistic promise - government handouts follow official procedures",
      severity: "high"
    },
    {
      text: "Click link to claim NOW",
      explanation: "Urgent call-to-action designed to bypass critical thinking",
      severity: "high"
    },
    {
      text: "Limited time only!",
      explanation: "Scarcity tactic to create fear of missing out (FOMO)",
      severity: "medium"
    },
    {
      text: "before slots run out!",
      explanation: "False scarcity - government programs don't have 'slots'",
      severity: "medium"
    }
  ];

  const manipulationTactics = [
    {
      name: "Urgency Pressure",
      description: "Creates artificial time pressure to prevent fact-checking",
      examples: ["NOW", "Limited time", "Before slots run out"]
    },
    {
      name: "Authority Impersonation",
      description: "Falsely claims government backing to appear legitimate",
      examples: ["Singapore government announces"]
    },
    {
      name: "Unrealistic Promises",
      description: "Offers benefits that are too good to be true",
      examples: ["FREE $5,000 cash handout"]
    }
  ];

  const verificationTips = [
    {
      title: "Check Official Sources",
      description: "Government announcements are always published on gov.sg first",
      actionable: true
    },
    {
      title: "Verify Through Multiple Channels",
      description: "Cross-reference with news outlets and official social media accounts",
      actionable: true
    },
    {
      title: "Look for Official Domains",
      description: "Real government links end in .gov.sg, not suspicious shortened URLs",
      actionable: true
    },
    {
      title: "Check ScamShield App",
      description: "Singapore's official app can verify suspicious messages and links",
      actionable: true
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Result Header */}
      <div className={`rounded-3xl p-8 ${
        isCorrect
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'
          : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300'
      }`}>
        <div className="flex items-start gap-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            isCorrect ? 'bg-green-500' : 'bg-orange-500'
          }`}>
            {isCorrect ? (
              <CheckCircle className="w-12 h-12 text-white" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-white" />
            )}
          </div>

          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 ${
              isCorrect ? 'text-green-900' : 'text-orange-900'
            }`}>
              {isCorrect ? 'Great Job! ✅' : 'Not Quite Right'}
            </h1>
            <p className={`text-lg mb-4 ${
              isCorrect ? 'text-green-800' : 'text-orange-800'
            }`}>
              {isCorrect
                ? 'You correctly identified this as a scam! Your critical thinking is improving.'
                : 'This was actually a scam, not misleading content. Let\'s learn why together.'}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div className="text-sm text-gray-600 mb-1">Your Answer</div>
                <div className={`text-xl font-bold ${
                  isCorrect ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {userAnswer}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div className="text-sm text-gray-600 mb-1">Correct Answer</div>
                <div className="text-xl font-bold text-gray-900">{correctAnswer}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Explanation */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-sm text-gray-600">Confidence Score:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <span className="font-bold text-blue-600">98%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-5 mb-4">
              <p className="text-gray-800 leading-relaxed">
                This post exhibits <strong>classic scam characteristics</strong> designed to steal money or personal information.
                The combination of government impersonation, unrealistic promises, and high-pressure tactics are hallmarks of
                financial fraud, not just misleading information.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-900">Key Differences:</h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="font-medium text-gray-900">Misleading vs Scam</div>
                    <div className="text-sm text-gray-600">Misleading content bends facts. Scams <strong>fabricate entire scenarios</strong> to steal from victims.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-medium text-gray-900">Intent Matters</div>
                    <div className="text-sm text-gray-600">This post's sole purpose is <strong>financial theft</strong>, not just spreading misinformation.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Red Flags Detected */}
          <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Red Flags Detected</h2>
            </div>

            <div className="space-y-3">
              {redFlags.map((flag, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 ${
                  flag.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-1 rounded-md text-xs font-bold flex-shrink-0 ${
                      flag.severity === 'high'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-orange-200 text-orange-800'
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

          {/* Manipulation Tactics */}
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Manipulation Tactics Used</h2>
            </div>

            <div className="space-y-4">
              {manipulationTactics.map((tactic, index) => (
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

          {/* Verification Tips */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">How to Verify Next Time</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {verificationTips.map((tip, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-xl border border-green-200">
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
              <div className="text-4xl font-bold text-gray-900 mb-1">+40 XP</div>
              <div className="text-sm text-gray-600">
                {isCorrect ? 'Correct Answer!' : 'Learning Bonus'}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base XP:</span>
                <span className="font-bold text-gray-900">+50</span>
              </div>
              {!isCorrect && (
                <div className="flex justify-between text-orange-600">
                  <span>Incorrect Answer:</span>
                  <span className="font-bold">-10</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total Earned:</span>
                <span className="font-bold text-yellow-600">+40 XP</span>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-600">
              New Total: 890 XP
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
                <span className="font-bold text-purple-900">5/10</span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <TrendingUp className="w-4 h-4" />
                <span>5 more correct answers to unlock!</span>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Questions Answered</span>
                  <span className="font-bold text-gray-900">6/10</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy Rate:</span>
                  <span className="font-bold text-blue-600">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct Streak:</span>
                  <span className="font-bold text-orange-600">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Module CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">⛓️</div>
              <h3 className="text-xl font-bold mb-2">Ready for Module 2?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Learn how misinformation spreads through networks
              </p>
            </div>
            <Link
              to="/mission/digital-shield/chain-reaction"
              className="block w-full py-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl transition-all text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <span>View Chain Reaction</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <Link
          to="/mission/digital-shield/spot-the-spin"
          className="px-12 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>Continue Quiz</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
