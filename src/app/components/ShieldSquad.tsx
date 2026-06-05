import { ArrowLeft, Users, Trophy, Shield, CheckCircle, MessageSquare, ThumbsUp, Crown, Zap, Target, TrendingUp, Award, Brain } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function ShieldSquad() {
  const [myVote, setMyVote] = useState<string | null>(null);
  const [myReasoning, setMyReasoning] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const squad = {
    name: "Digital Defenders SG",
    score: 12450,
    rank: 3,
    members: [
      { id: 1, name: "You", avatar: "JD", isYou: true, expertise: ["Tech", "Scam"], level: 8, status: "voting" },
      { id: 2, name: "Sarah_Tech", avatar: "ST", isYou: false, expertise: ["Science", "Social Media"], level: 12, status: "voted", vote: "Scam" },
      { id: 3, name: "Mike_Fact", avatar: "MF", isYou: false, expertise: ["Finance", "Scam"], level: 10, status: "voted", vote: "Scam" },
      { id: 4, name: "Lisa_Guard", avatar: "LG", isYou: false, expertise: ["Social Media"], level: 9, status: "voting" },
      { id: 5, name: "Alex_Shield", avatar: "AS", isYou: false, expertise: ["Tech"], level: 11, status: "voted", vote: "Misleading" }
    ]
  };

  const currentMission = {
    title: "Viral Investment Scheme",
    content: "🚀 EXCLUSIVE: Invest just $100 in this NEW cryptocurrency and turn it into $10,000 in 30 days! My friend's cousin made $50K last week! Limited spots - DM me now! 💰💎🔥",
    likes: "8.9K",
    shares: "2.3K",
    urgency: "High",
    timeLeft: "12 min"
  };

  const votes = [
    { type: "Real", count: 0, percentage: 0, color: "green" },
    { type: "Misleading", count: 1, percentage: 20, color: "yellow" },
    { type: "Satire", count: 0, percentage: 0, color: "blue" },
    { type: "Scam", count: 2, percentage: 40, color: "red" }
  ];

  const votingOptions = [
    { value: "real", label: "Real", icon: "✅", color: "from-green-500 to-emerald-500", bg: "bg-green-50", border: "border-green-300" },
    { value: "misleading", label: "Misleading", icon: "⚠️", color: "from-yellow-500 to-orange-500", bg: "bg-yellow-50", border: "border-yellow-300" },
    { value: "satire", label: "Satire", icon: "😄", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", border: "border-blue-300" },
    { value: "scam", label: "Scam", icon: "🚫", color: "from-red-500 to-pink-500", bg: "bg-red-50", border: "border-red-300" }
  ];

  const teamReasons = [
    { member: "Sarah_Tech", vote: "Scam", reasoning: "Classic crypto pump scheme. Unrealistic returns (100x in 30 days) and pressure tactics.", expertise: "Social Media", verified: true },
    { member: "Mike_Fact", vote: "Scam", reasoning: "Financial red flags: guaranteed returns, testimonial without proof, DM pressure = scam playbook.", expertise: "Finance", verified: true }
  ];

  const leaderboard = [
    { rank: 1, name: "Truth Seekers", score: 15200, trend: "up", members: 5 },
    { rank: 2, name: "Fact Checkers Elite", score: 13800, trend: "up", members: 5 },
    { rank: 3, name: "Digital Defenders SG", score: 12450, trend: "same", members: 5, isYours: true },
    { rank: 4, name: "Scam Busters", score: 11900, trend: "down", members: 4 },
    { rank: 5, name: "Guardian Squad", score: 10300, trend: "up", members: 5 }
  ];

  const expertiseColors: { [key: string]: string } = {
    "Science": "bg-purple-100 text-purple-700 border-purple-300",
    "Tech": "bg-blue-100 text-blue-700 border-blue-300",
    "Finance": "bg-green-100 text-green-700 border-green-300",
    "Scam": "bg-red-100 text-red-700 border-red-300",
    "Social Media": "bg-orange-100 text-orange-700 border-orange-300"
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/mission/digital-shield" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Mission</span>
        </Link>
        <div className="text-sm text-gray-500">Module 3: Shield Squad</div>
      </div>

      {/* Squad Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 text-white shadow-2xl border-4 border-red-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{squad.name}</h1>
              <div className="flex items-center gap-3 text-red-100">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {squad.members.length} Members
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Rank #{squad.rank}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{squad.score.toLocaleString()}</div>
            <div className="text-red-100">Squad Score</div>
          </div>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center gap-3">
          {squad.members.map((member) => (
            <div key={member.id} className="relative group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg border-3 ${
                member.isYou
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 ring-4 ring-white/40'
                  : 'bg-white/20 backdrop-blur-sm border-white/30'
              }`}>
                {member.avatar}
              </div>
              {member.status === "voted" && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              {member.isYou && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  YOU
                </div>
              )}

              {/* Hover Card */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl whitespace-nowrap">
                  <div className="font-bold mb-1">{member.name}</div>
                  <div className="text-gray-300 mb-2">Level {member.level}</div>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((exp, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Verification Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Mission */}
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Active Verification</h2>
                  <div className="text-sm text-gray-500">Squad consensus required</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{currentMission.timeLeft}</div>
                <div className="text-xs text-gray-500">Time Left</div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 mb-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                  ?
                </div>
                <div>
                  <div className="font-bold text-gray-900">[User Identity Hidden]</div>
                  <div className="text-sm text-gray-500">Posted 3 hours ago</div>
                </div>
              </div>

              <p className="text-lg text-gray-900 mb-4 leading-relaxed">
                {currentMission.content}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>❤️ {currentMission.likes} likes</span>
                <span>🔄 {currentMission.shares} shares</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium text-xs">
                  {currentMission.urgency} Urgency
                </span>
              </div>
            </div>

            {/* Your Vote */}
            {!hasSubmitted ? (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Cast Your Vote</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {votingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMyVote(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        myVote === option.value
                          ? `${option.bg} ${option.border} shadow-lg scale-105`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="text-left">
                          <div className="font-bold text-gray-900">{option.label}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Your Reasoning (Optional)
                  </label>
                  <textarea
                    value={myReasoning}
                    onChange={(e) => setMyReasoning(e.target.value)}
                    placeholder="Share your analysis with the squad..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={3}
                  ></textarea>
                  <div className="text-xs text-gray-500 mt-1">
                    Detailed reasoning earns bonus XP and helps your squad learn
                  </div>
                </div>

                <button
                  onClick={() => setHasSubmitted(true)}
                  disabled={!myVote}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Vote
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-900">Your vote has been submitted!</span>
                </div>
                <p className="text-sm text-green-800">
                  Waiting for squad consensus... {squad.members.filter(m => m.status === "voting").length} members still voting.
                </p>
              </div>
            )}
          </div>

          {/* Team Votes & Reasoning */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Squad Analysis</h3>
            </div>

            {/* Vote Distribution */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-600 mb-3">Current Votes (3/5)</div>
              <div className="space-y-2">
                {votes.map((vote, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium text-gray-700">{vote.type}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className={`h-8 bg-gradient-to-r ${votingOptions.find(o => o.label === vote.type)?.color} rounded-full transition-all flex items-center justify-end px-3`}
                        style={{ width: `${vote.percentage || 5}%` }}
                      >
                        {vote.count > 0 && (
                          <span className="text-white font-bold text-sm">{vote.count}</span>
                        )}
                      </div>
                    </div>
                    <div className="w-12 text-sm text-gray-500">{vote.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Reasoning */}
            <div className="space-y-3">
              <div className="text-sm font-bold text-gray-900 mb-3">Expert Analysis</div>
              {teamReasons.map((reason, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {reason.member.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">{reason.member}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${expertiseColors[reason.expertise]}`}>
                          {reason.expertise}
                        </span>
                        {reason.verified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{reason.reasoning}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className={`font-bold ${votingOptions.find(o => o.label === reason.vote)?.border.replace('border-', 'text-')}`}>
                          Voted: {reason.vote}
                        </span>
                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful (2)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasSubmitted && myReasoning && (
                <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">You</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${expertiseColors["Tech"]}`}>
                          Tech
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{myReasoning}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className={`font-bold ${votingOptions.find(o => o.value === myVote)?.border.replace('border-', 'text-')}`}>
                          Voted: {votingOptions.find(o => o.value === myVote)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Consensus Result (shown when all voted) */}
          {hasSubmitted && (
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Waiting for Consensus</h3>
                  <p className="text-green-100">2 more votes needed for squad decision</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-sm text-green-100 mb-2">Trending towards:</div>
                <div className="text-3xl font-bold">🚫 Scam (67%)</div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Squad Stats */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Squad Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Missions Completed</span>
                <span className="font-bold text-gray-900">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accuracy Rate</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Consensus Speed</span>
                <span className="font-bold text-blue-600">8.5 min</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Weekly Streak</span>
                <span className="font-bold text-orange-600">12 🔥</span>
              </div>
            </div>
          </div>

          {/* Squad Leaderboard */}
          <div className="bg-white rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-gray-900">Squad Leaderboard</h3>
            </div>

            <div className="space-y-2">
              {leaderboard.map((team) => (
                <div
                  key={team.rank}
                  className={`p-3 rounded-xl transition-all ${
                    team.isYours
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      team.rank === 1
                        ? 'bg-yellow-500 text-white'
                        : team.rank === 2
                        ? 'bg-gray-400 text-white'
                        : team.rank === 3
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {team.rank === 1 ? <Crown className="w-4 h-4" /> : team.rank}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold ${team.isYours ? 'text-yellow-900' : 'text-gray-900'}`}>
                        {team.name}
                      </div>
                      <div className="text-xs text-gray-500">{team.members} members</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{team.score.toLocaleString()}</div>
                      <div className="flex items-center gap-1 justify-end">
                        <TrendingUp className={`w-3 h-3 ${
                          team.trend === 'up' ? 'text-green-600' : team.trend === 'down' ? 'text-red-600 rotate-180' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP Rewards */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Potential Rewards</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Vote Submission</span>
                <span className="font-bold text-purple-600">+30 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Detailed Reasoning</span>
                <span className="font-bold text-purple-600">+20 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Consensus Match</span>
                <span className="font-bold text-purple-600">+50 XP</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                <span className="text-gray-700">Squad Bonus</span>
                <span className="font-bold text-purple-600">+25 XP</span>
              </div>
              <div className="pt-3 border-t border-purple-200">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900">Total Possible</span>
                  <span className="text-2xl text-purple-600">+125 XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Squad Tips */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Squad Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Share detailed reasoning to help squad members learn</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Leverage your expertise tags for bonus credibility</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Higher consensus accuracy = better squad ranking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mission Complete CTA */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Module Complete!</h2>
        <p className="text-green-100 mb-6">You've mastered collaborative fact-checking. Ready to claim your mission badge?</p>
        <Link
          to="/mission/digital-shield/complete"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-green-50 text-green-600 font-bold rounded-xl transition-all"
        >
          <Award className="w-5 h-5" />
          <span>Complete Mission & Claim Badge</span>
        </Link>
      </div>
    </div>
  );
}
