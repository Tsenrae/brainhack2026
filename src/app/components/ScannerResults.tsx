import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Brain, TrendingUp, Flag, Link as LinkIcon, UserX, MessageSquareWarning, GraduationCap, ArrowLeft, Share2, Download, Zap, Target, Info } from 'lucide-react';
import { Link } from 'react-router';

export function ScannerResults() {
  const riskScore = 87;
  const threatLevel = 'High Risk';
  const confidenceScore = 96;

  const suspiciousElements = [
    { element: 'Urgent language', location: 'Message body', severity: 'CRITICAL', description: '"ACT NOW", "LIMITED TIME", "URGENT"' },
    { element: 'Suspicious URL', location: 'Link preview', severity: 'CRITICAL', description: 'Domain mimics official site but registered recently' },
    { element: 'Request for credentials', location: 'Form fields', severity: 'CRITICAL', description: 'Asks for password and banking details' },
    { element: 'Poor grammar', location: 'Throughout text', severity: 'MEDIUM', description: 'Multiple spelling and grammar errors' },
    { element: 'Generic greeting', location: 'Opening line', severity: 'LOW', description: 'Uses "Dear User" instead of your name' }
  ];

  const redFlags = [
    {
      icon: AlertTriangle,
      title: 'Urgency Pressure',
      description: 'Creates false sense of urgency to make you act without thinking',
      examples: ['"Act now or lose access"', '"Limited time only"', '"Account will be closed"'],
      severity: 'CRITICAL',
      color: 'red'
    },
    {
      icon: LinkIcon,
      title: 'Suspicious Link',
      description: 'URL does not match official domain and was recently registered',
      examples: ['Real: gov.sg', 'Fake: g0v-sg.xyz (registered 3 days ago)'],
      severity: 'CRITICAL',
      color: 'red'
    },
    {
      icon: Shield,
      title: 'Requests Sensitive Info',
      description: 'Legitimate organizations never ask for passwords via message',
      examples: ['Asks for: Password, PIN, Bank OTP', 'Red flag: Any request for credentials'],
      severity: 'CRITICAL',
      color: 'red'
    },
    {
      icon: MessageSquareWarning,
      title: 'Too Good to Be True',
      description: 'Offers unrealistic rewards or prizes to lure victims',
      examples: ['"You won $50,000!"', '"Free iPhone giveaway"', '"Guaranteed returns"'],
      severity: 'HIGH',
      color: 'orange'
    }
  ];

  const recommendedActions = [
    {
      icon: XCircle,
      action: 'Do Not Click Any Links',
      description: 'The links in this message lead to fraudulent websites designed to steal your information',
      priority: 'CRITICAL',
      color: 'red'
    },
    {
      icon: Shield,
      action: 'Do Not Share Personal Information',
      description: 'Never provide passwords, PINs, OTPs, or banking details through messages or links',
      priority: 'CRITICAL',
      color: 'red'
    },
    {
      icon: Eye,
      action: 'Verify the Source',
      description: 'Contact the organization directly using official channels (not links in the message)',
      priority: 'HIGH',
      color: 'orange'
    },
    {
      icon: Flag,
      action: 'Report to ScamShield',
      description: 'Forward suspicious messages to ScamShield at 1799 or report via the app',
      priority: 'HIGH',
      color: 'orange'
    },
    {
      icon: UserX,
      action: 'Block the Sender',
      description: 'Block this number/contact to prevent further scam attempts',
      priority: 'MEDIUM',
      color: 'yellow'
    },
    {
      icon: GraduationCap,
      action: 'Ask a Trusted Adult or Teacher',
      description: 'If you\'re unsure, talk to a parent, teacher, or trusted adult before taking any action',
      priority: 'RECOMMENDED',
      color: 'blue'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-500 bg-red-50';
      case 'HIGH': return 'border-orange-500 bg-orange-50';
      case 'MEDIUM': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/scanner"
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">New Scan</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium rounded-xl transition-all">
            <Share2 className="w-4 h-4" />
            <span>Share Results</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium rounded-xl transition-all">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Risk Score - Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Circular Gauge */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>

                {/* SVG Gauge */}
                <div className="relative w-64 h-64 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="#fee2e2"
                      strokeWidth="20"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="url(#riskGradient)"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${(riskScore / 100) * 691} 691`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-7xl font-black text-red-600 mb-2">{riskScore}</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Risk Score</div>
                    <div className="px-3 py-1 bg-red-100 border border-red-300 rounded-lg">
                      <span className="text-xs font-bold text-red-700">Out of 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Scale */}
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex justify-between text-xs font-medium text-gray-600 px-1">
                  <span>Safe</span>
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
                <div className="relative h-5 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 rounded-full shadow-inner">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-red-600 rounded-full shadow-xl flex items-center justify-center"
                    style={{ left: `${riskScore}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Threat Info */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 rounded-xl mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-700">Threat Detected</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-3">{threatLevel}</h1>
                <p className="text-lg text-gray-700 mb-4">This content shows strong indicators of being a scam or phishing attempt</p>
              </div>

              {/* Confidence Score */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI Confidence</h3>
                    <p className="text-sm text-gray-600">Model certainty level</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="bg-purple-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 rounded-full transition-all duration-1000"
                        style={{ width: `${confidenceScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-purple-600">{confidenceScore}%</div>
                </div>
                <p className="text-sm text-purple-800 mt-3">
                  Our AI is {confidenceScore}% confident this is a threat based on analyzing thousands of known scams
                </p>
              </div>

              {/* XP Earned */}
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                <Zap className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">XP Earned for Scanning</div>
                  <div className="text-xl font-black text-green-600">+30 XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Highlighted Suspicious Elements */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Suspicious Elements Detected</h2>
                <p className="text-sm text-gray-600">Our AI identified {suspiciousElements.length} warning signs in this content</p>
              </div>
            </div>

            <div className="space-y-3">
              {suspiciousElements.map((item, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border-2 ${getSeverityColor(item.severity)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        item.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                        item.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                        item.severity === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {item.severity}
                      </div>
                      <h3 className="font-bold text-gray-900">{item.element}</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      {item.location}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{item.description}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags - Explainable AI */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Understanding the Red Flags</h2>
                <p className="text-sm text-gray-600">Learn why these patterns indicate a scam</p>
              </div>
            </div>

            <div className="space-y-4">
              {redFlags.map((flag, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-red-300 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${flag.color}-500 to-${flag.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <flag.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{flag.title}</h3>
                        <div className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                          flag.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {flag.severity}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{flag.description}</p>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-gray-700">Examples found:</span>
                        </div>
                        <ul className="space-y-1">
                          {flag.examples.map((example, i) => (
                            <li key={i} className="text-xs text-gray-600 pl-4 border-l-2 border-gray-300">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">What You Should Do</h2>
                <p className="text-sm text-gray-600">Follow these steps to stay safe</p>
              </div>
            </div>

            <div className="space-y-3">
              {recommendedActions.map((action, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${
                      action.priority === 'CRITICAL' ? 'bg-red-100' :
                      action.priority === 'HIGH' ? 'bg-orange-100' :
                      action.priority === 'MEDIUM' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    } rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <action.icon className={`w-5 h-5 ${
                        action.priority === 'CRITICAL' ? 'text-red-600' :
                        action.priority === 'HIGH' ? 'text-orange-600' :
                        action.priority === 'MEDIUM' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{action.action}</h3>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid md:grid-cols-2 gap-3 mt-6 pt-6 border-t-2 border-blue-200">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                <Flag className="w-5 h-5" />
                <span>Report to ScamShield</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold rounded-xl transition-all">
                <Share2 className="w-5 h-5" />
                <span>Warn Friends & Family</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scanned Content Preview */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Scanned Content</h3>
            <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 mb-4 max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                🚨 <strong>URGENT NOTICE FROM SINGAPORE BANK</strong><br/><br/>

                Dear Valued Customer,<br/><br/>

                Your account has been FLAGGED for suspicious activity. You must verify your identity IMMEDIATELY or your account will be PERMANENTLY CLOSED within 24 hours!<br/><br/>

                Click here NOW to verify: www.sg-bank-verify.xyz/urgent<br/><br/>

                Provide your:<br/>
                - Full account number<br/>
                - Internet banking password<br/>
                - OTP code<br/><br/>

                ACT NOW! Limited time only!
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Scanned 2 minutes ago</span>
            </div>
          </div>

          {/* AI Analysis Breakdown */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">AI Analysis</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Visual Scan</span>
                </div>
                <div className="text-2xl font-black text-purple-600 mb-1">15</div>
                <div className="text-xs text-gray-600">Suspicious patterns</div>
                <div className="mt-2 w-full bg-purple-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-gray-700">Text Analysis</span>
                </div>
                <div className="text-2xl font-black text-pink-600 mb-1">11</div>
                <div className="text-xs text-gray-600">Manipulation tactics</div>
                <div className="mt-2 w-full bg-pink-100 rounded-full h-2">
                  <div className="bg-pink-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Match Rate</span>
                </div>
                <div className="text-2xl font-black text-blue-600 mb-1">99%</div>
                <div className="text-xs text-gray-600">Similar to known scams</div>
                <div className="mt-2 w-full bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Training Mission */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">Learn More</h3>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Related Training Mission</h4>
              <p className="text-sm text-gray-700 mb-4">
                Want to get better at spotting scams like this? Try our training mission:
              </p>
            </div>

            <Link
              to="/mission/digital-shield"
              className="block bg-white rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    Digital Shield
                  </h4>
                  <p className="text-xs text-gray-600">Mission 1</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Learn to identify phishing, scams, and misinformation through interactive challenges
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Beginner • 15 min</span>
                <span className="font-bold text-orange-600">+500 XP</span>
              </div>
            </Link>
          </div>

          {/* Scanner Stats */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Your Scanner Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Scans</span>
                <span className="font-bold text-gray-900">48</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Threats Detected</span>
                <span className="font-bold text-red-600">13</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Safe Content</span>
                <span className="font-bold text-green-600">35</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">XP Earned Today</span>
                <span className="font-bold text-blue-600">+150 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          to="/scanner"
          className="py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all text-center"
        >
          Scan Another Item
        </Link>
        <Link
          to="/community/submit"
          className="py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all text-center"
        >
          Report to Community
        </Link>
        <Link
          to="/dashboard"
          className="py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-all text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
