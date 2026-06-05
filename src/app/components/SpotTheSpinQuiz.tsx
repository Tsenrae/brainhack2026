import { Clock, Lightbulb, Flag, SkipForward, ArrowLeft, Zap, Target, Flame, Trophy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function SpotTheSpinQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const post = {
    content: "🚨 BREAKING: Singapore government announces FREE cash handout of $5,000 to all citizens! Click link to claim NOW before slots run out! Limited time only! 💰💸",
    image: null,
    likes: "12.5K",
    shares: "8.2K",
    comments: "3.4K"
  };

  const hint = "Look for urgency tactics, unrealistic promises, and lack of official sources. Government announcements are always made through official channels like gov.sg.";

  const options = [
    {
      value: "real",
      label: "Real",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      hoverBorder: "hover:border-green-500",
      icon: "✅",
      description: "Verified and accurate"
    },
    {
      value: "misleading",
      label: "Misleading",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      hoverBorder: "hover:border-yellow-500",
      icon: "⚠️",
      description: "Contains partial truths"
    },
    {
      value: "satire",
      label: "Satire",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      hoverBorder: "hover:border-blue-500",
      icon: "😄",
      description: "Humor or parody"
    },
    {
      value: "scam",
      label: "Scam",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      hoverBorder: "hover:border-red-500",
      icon: "🚫",
      description: "Fraudulent content"
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/mission/digital-shield" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Mission</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
            <Clock className="w-5 h-5 text-orange-600" />
            <div className="text-sm">
              <div className="text-xs text-orange-600 font-medium">Time Left</div>
              <div className="text-lg font-bold text-orange-700">0:45</div>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
            <Zap className="w-5 h-5 text-blue-600" />
            <div className="text-sm">
              <div className="text-xs text-blue-600 font-medium">Score</div>
              <div className="text-lg font-bold text-blue-700">850 XP</div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
            <Flame className="w-5 h-5 text-red-600" />
            <div className="text-sm">
              <div className="text-xs text-red-600 font-medium">Streak</div>
              <div className="text-lg font-bold text-red-700">5 🔥</div>
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
                <span className="font-bold text-gray-900">Question 6 of 10</span>
              </div>
              <span className="text-sm text-gray-600">60% Complete</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Social Media Post Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="space-y-4">
              {/* Post Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  ?
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">[User Identity Hidden]</div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </div>

              {/* Post Content */}
              <div className="py-4">
                <p className="text-lg text-gray-900 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Engagement */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>❤️</span>
                  <span className="font-medium">{post.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span className="font-medium">{post.shares} shares</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span className="font-medium">{post.comments} comments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hint Card */}
          {showHint ? (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-purple-900 mb-2">💡 Hint</h3>
                  <p className="text-sm text-purple-800 leading-relaxed">{hint}</p>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">How would you classify this post?</h3>
            <div className="grid grid-cols-2 gap-4">
              {options.map((option) => (
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
            <Link
              to="/mission/digital-shield/spot-the-spin/feedback"
              className={`flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all text-center ${
                !selectedAnswer ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Submit Answer
            </Link>
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
                <span className="font-bold text-gray-900">5 / 10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Correct Answers</span>
                <span className="font-bold text-green-600">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Wrong Answers</span>
                <span className="font-bold text-red-600">1</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-bold text-blue-600">80%</span>
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
              <div className="text-sm text-gray-700">
                Classify 10 posts correctly to unlock
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-gray-900">4/10</span>
                </div>
                <div className="w-full bg-yellow-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="pt-3 border-t border-yellow-200">
                <div className="text-center text-4xl mb-2">🎯</div>
                <div className="text-xs text-center text-gray-600">6 more correct to unlock!</div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4">💡 Quick Tips</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Check for verified sources and official channels</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Look for urgency tactics and emotional manipulation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Verify claims with fact-checking websites</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Question too-good-to-be-true offers</span>
              </li>
            </ul>
          </div>

          {/* Streak Bonus */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-gray-900">Streak Bonus</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-700 mb-3">
                Get 3 more correct in a row for +50 XP bonus!
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${
                      i <= 5 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="text-xs text-center text-gray-600 mt-2">
                Current streak: 5 🔥
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
