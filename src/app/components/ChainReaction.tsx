import { ArrowLeft, Share2, Users, TrendingUp, Clock, AlertTriangle, Shield, CheckCircle, XCircle, Zap, Target, Brain, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function ChainReaction() {
  const [currentTime, setCurrentTime] = useState(6); // hours
  const [showSimulator, setShowSimulator] = useState(false);
  const [wouldShare, setWouldShare] = useState<boolean | null>(null);

  const timelineData = [
    { hour: 0, shares: 1, reach: 500, nodes: 1 },
    { hour: 1, shares: 8, reach: 4000, nodes: 8 },
    { hour: 2, shares: 45, reach: 22500, nodes: 45 },
    { hour: 3, shares: 180, reach: 90000, nodes: 180 },
    { hour: 4, shares: 520, reach: 260000, nodes: 520 },
    { hour: 5, shares: 1200, reach: 600000, nodes: 1200 },
    { hour: 6, shares: 2800, reach: 1400000, nodes: 2800 },
  ];

  const breakPoints = [
    { time: "15 min", action: "First fact-checker flags post", impact: "-80% potential reach" },
    { time: "1 hour", action: "Platform adds warning label", impact: "-60% share rate" },
    { time: "3 hours", action: "News outlet debunks claim", impact: "-40% credibility" },
  ];

  const currentData = timelineData.find(d => d.hour === currentTime) || timelineData[timelineData.length - 1];

  const simulatorData = {
    withoutYou: {
      reach: 1400000,
      harm: "High",
      trustImpact: 0
    },
    ifYouShare: {
      reach: 1402350, // +2350 from your network
      harm: "Very High",
      trustImpact: -15 // % decrease in your credibility
    },
    ifYouReport: {
      reach: 1320000, // -80000 from early flagging
      harm: "Medium",
      trustImpact: +5 // % increase in community trust
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/mission/digital-shield" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Mission</span>
        </Link>
        <div className="text-sm text-gray-500">Module 2: Chain Reaction</div>
      </div>

      {/* Title Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chain Reaction</h1>
            <p className="text-purple-700">Visualize how misinformation spreads</p>
          </div>
        </div>
        <p className="text-gray-700">
          Watch how a single false post can reach millions. Learn where intervention points could have stopped the spread.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Network Visualization */}
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 border-2 border-purple-300 shadow-2xl relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.3) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Network Spread Visualization</h2>
                <p className="text-purple-200 text-sm">Showing spread at {currentTime} hours</p>
              </div>

              {/* Central Visualization Area */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 mb-6">
                <div className="relative h-96 flex items-center justify-center">
                  {/* Center Node - Original Post */}
                  <div className="absolute z-30">
                    <div className="relative">
                      {/* Pulsing ripple effect */}
                      <div className="absolute inset-0 animate-ping">
                        <div className="w-24 h-24 bg-red-500 rounded-full opacity-20"></div>
                      </div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                        <AlertTriangle className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          ORIGIN
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* First Ring - Direct Shares (8 nodes) */}
                  {currentTime >= 1 && [...Array(8)].map((_, i) => {
                    const angle = (i / 8) * 2 * Math.PI;
                    const x = Math.cos(angle) * 100;
                    const y = Math.sin(angle) * 100;
                    return (
                      <div
                        key={`ring1-${i}`}
                        className="absolute z-20"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 animate-pulse">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Second Ring - Secondary Shares (16 nodes) */}
                  {currentTime >= 3 && [...Array(16)].map((_, i) => {
                    const angle = (i / 16) * 2 * Math.PI;
                    const x = Math.cos(angle) * 160;
                    const y = Math.sin(angle) * 160;
                    return (
                      <div
                        key={`ring2-${i}`}
                        className="absolute z-10"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Outer Ring - Viral Spread (24 nodes) */}
                  {currentTime >= 5 && [...Array(24)].map((_, i) => {
                    const angle = (i / 24) * 2 * Math.PI;
                    const x = Math.cos(angle) * 180;
                    const y = Math.sin(angle) * 180;
                    return (
                      <div
                        key={`ring3-${i}`}
                        className="absolute z-0"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-md border border-white/10"></div>
                      </div>
                    );
                  })}

                  {/* Connection lines effect */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'blur(1px)' }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: 'rgb(239, 68, 68)', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: 'rgb(147, 51, 234)', stopOpacity: 0.1 }} />
                      </linearGradient>
                    </defs>
                    {currentTime >= 1 && [...Array(8)].map((_, i) => {
                      const angle = (i / 8) * 2 * Math.PI;
                      const x = Math.cos(angle) * 100 + 192;
                      const y = Math.sin(angle) * 100 + 192;
                      return (
                        <line
                          key={`line-${i}`}
                          x1="192"
                          y1="192"
                          x2={x}
                          y2={y}
                          stroke="url(#lineGradient)"
                          strokeWidth="2"
                          className="animate-pulse"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-cyan-200">Total Reach</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{currentData.reach.toLocaleString()}</div>
                  <div className="text-xs text-cyan-300 mt-1">+{Math.round(currentData.reach / currentTime).toLocaleString()}/hour</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-200">Total Shares</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{currentData.shares.toLocaleString()}</div>
                  <div className="text-xs text-purple-300 mt-1">Exponential growth</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span className="text-xs text-pink-200">Active Nodes</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{currentData.nodes.toLocaleString()}</div>
                  <div className="text-xs text-pink-300 mt-1">Network size</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Time-Based Spread</h3>
              </div>
              <span className="text-sm text-gray-500">Hour {currentTime}</span>
            </div>

            <div className="mb-6">
              <input
                type="range"
                min="0"
                max="6"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0h</span>
                <span>1h</span>
                <span>2h</span>
                <span>3h</span>
                <span>4h</span>
                <span>5h</span>
                <span>6h</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-purple-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900 mb-1">Spread Analysis</div>
                  <p className="text-sm text-gray-700">
                    {currentTime === 0 && "Original post created. Initial reach of 500 followers."}
                    {currentTime === 1 && "First wave: 8 users share. Reach multiplies 8x to 4,000 people."}
                    {currentTime === 2 && "Going viral: 45 shares. Critical mass reached at 22,500 views."}
                    {currentTime === 3 && "Exponential growth: 180 shares, 90,000 reached. News outlets picking up."}
                    {currentTime === 4 && "Mass spread: 520 shares. Quarter million people exposed."}
                    {currentTime === 5 && "Viral peak: 1,200 shares. 600K reached. Platform intervention needed."}
                    {currentTime === 6 && "Full viral: 2,800 shares, 1.4M reach. Damage control phase."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Break Points */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Chain Could Have Been Broken Here</h3>
            </div>

            <div className="space-y-3">
              {breakPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-900">{point.time}</span>
                    </div>
                    <div className="text-sm text-gray-900 mb-1">{point.action}</div>
                    <div className="text-xs text-green-700 font-medium">{point.impact}</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simulator Sidebar */}
        <div className="space-y-6">
          {/* Simulator Card */}
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6" />
              <h3 className="text-xl font-bold">Your Impact</h3>
            </div>
            <p className="text-sm text-orange-100 mb-4">
              What if YOU saw this post? Your choice matters.
            </p>
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="w-full py-3 bg-white hover:bg-orange-50 text-orange-600 font-bold rounded-xl transition-all"
            >
              {showSimulator ? 'Hide Simulator' : 'Run Simulation'}
            </button>
          </div>

          {showSimulator && (
            <>
              {/* Choice Buttons */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">What would you do?</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setWouldShare(false)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      wouldShare === false
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-gray-900">Don't Share</span>
                    </div>
                    <p className="text-sm text-gray-600">Stop the spread, protect others</p>
                  </button>

                  <button
                    onClick={() => setWouldShare(true)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      wouldShare === true
                        ? 'bg-red-50 border-red-500'
                        : 'bg-gray-50 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-gray-900">Share It</span>
                    </div>
                    <p className="text-sm text-gray-600">Add to the viral spread</p>
                  </button>
                </div>
              </div>

              {/* Impact Results */}
              {wouldShare !== null && (
                <div className={`rounded-2xl p-6 border-2 ${
                  wouldShare
                    ? 'bg-red-50 border-red-300'
                    : 'bg-green-50 border-green-300'
                }`}>
                  <h3 className="font-bold text-gray-900 mb-4">
                    {wouldShare ? 'Impact if You Share' : 'Impact if You Don\'t Share'}
                  </h3>

                  <div className="space-y-4">
                    {/* Reach Impact */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Potential Reach</span>
                        <span className={`font-bold ${wouldShare ? 'text-red-700' : 'text-green-700'}`}>
                          {wouldShare
                            ? `+${(simulatorData.ifYouShare.reach - simulatorData.withoutYou.reach).toLocaleString()}`
                            : `-${(simulatorData.withoutYou.reach - simulatorData.ifYouReport.reach).toLocaleString()}`
                          }
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${wouldShare ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: wouldShare ? '98%' : '15%' }}
                        ></div>
                      </div>
                    </div>

                    {/* Harm Level */}
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Harm Level</span>
                        <span className={`font-bold ${
                          wouldShare ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {wouldShare ? simulatorData.ifYouShare.harm : simulatorData.ifYouReport.harm}
                        </span>
                      </div>
                    </div>

                    {/* Trust Impact */}
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Your Credibility</span>
                        <span className={`font-bold ${
                          wouldShare ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {wouldShare ? simulatorData.ifYouShare.trustImpact : simulatorData.ifYouReport.trustImpact}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {wouldShare
                          ? 'Sharing misinformation damages your reputation'
                          : 'Reporting helps protect your community'
                        }
                      </div>
                    </div>
                  </div>

                  {!wouldShare && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                      <div className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-green-900 mb-1">Great Choice!</div>
                          <div className="text-sm text-green-800">
                            You prevented 2,350 people from seeing false information. Earn +50 XP bonus!
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Key Insights */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Misinformation spreads 6x faster than accurate information</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Each share can reach 500+ people on average</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Early intervention is 10x more effective than late correction</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
            <div className="text-center mb-4">
              <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">+150 XP</div>
              <div className="text-sm text-gray-600">Module Progress</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completion</span>
                <span className="font-bold text-gray-900">100%</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Module CTA */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <div className="text-5xl mb-4">👥</div>
        <h2 className="text-2xl font-bold mb-2">Ready for Module 3?</h2>
        <p className="text-green-100 mb-6">Team up with your Shield Squad to fact-check content together</p>
        <Link
          to="/mission/digital-shield/shield-squad"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-green-50 text-green-600 font-bold rounded-xl transition-all"
        >
          <span>Continue to Shield Squad</span>
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
