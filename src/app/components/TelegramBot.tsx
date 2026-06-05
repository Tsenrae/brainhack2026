import { MessageCircle, QrCode, CheckCircle, Shield, Zap, Clock, AlertTriangle, ExternalLink, ArrowLeft, Send, User, Bot, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router';

export function TelegramBot() {
  const setupSteps = [
    {
      step: 1,
      title: 'Scan QR Code or Search Bot',
      description: 'Open Telegram and scan the QR code, or search for @ShieldVerseSG_bot',
      icon: QrCode,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: 'Start the Bot',
      description: 'Tap "Start" to activate ShieldVerse Bot and link it to your account',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 3,
      title: 'Forward Suspicious Messages',
      description: 'Simply forward any suspicious message to the bot for instant AI analysis',
      icon: Shield,
      color: 'from-red-500 to-orange-500'
    }
  ];

  const exampleConversation = [
    {
      type: 'user',
      message: 'Started bot',
      timestamp: '10:23 AM',
      system: true
    },
    {
      type: 'bot',
      message: '👋 Welcome to ShieldVerse SG!\n\nI\'m your personal scam detector. Forward me any suspicious messages, links, or images and I\'ll analyze them instantly.\n\nTry it now by forwarding a message!',
      timestamp: '10:23 AM'
    },
    {
      type: 'user',
      message: '🚨 URGENT: Your DBS account has been locked! Click here immediately to unlock: dbs-sg-secure.xyz/unlock',
      timestamp: '10:25 AM',
      forwarded: true
    },
    {
      type: 'bot',
      message: '⚠️ HIGH RISK DETECTED (Score: 94/100)\n\n🚫 Classification: Phishing Scam\n\nRed Flags Found:\n• Urgency tactics ("URGENT", "immediately")\n• Suspicious URL (dbs-sg-secure.xyz)\n• Requests sensitive action\n\n✅ What to do:\n1. Do NOT click the link\n2. Block and report the sender\n3. Verify with official DBS channels\n\n📚 Learn more: Complete "Digital Shield" mission\n\n+25 XP earned for scanning!',
      timestamp: '10:25 AM',
      analysis: true
    },
    {
      type: 'user',
      message: 'Thanks! That was helpful 👍',
      timestamp: '10:26 AM'
    }
  ];

  const recentScans = [
    {
      id: 1,
      preview: 'Lottery winner scam',
      riskScore: 98,
      classification: 'Scam',
      timestamp: '2 hours ago',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300'
    },
    {
      id: 2,
      preview: 'gov.sg official notice',
      riskScore: 3,
      classification: 'Safe',
      timestamp: '1 day ago',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    },
    {
      id: 3,
      preview: 'Job offer from unknown sender',
      riskScore: 72,
      classification: 'Suspicious',
      timestamp: '3 days ago',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Telegram Bot Integration</h1>
          <p className="text-gray-600">Get instant threat analysis right in your Telegram chats</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Telegram Integration</span>
            </div>
            <h2 className="text-4xl font-black mb-4">Meet Your Personal Scam Detector</h2>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              Forward suspicious messages, links, or images to our Telegram bot and get instant AI-powered threat analysis. No app switching needed!
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/ShieldVerseSG_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Open Telegram Bot</span>
              </a>
              <div className="flex items-center gap-2 text-blue-100">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Earn +25 XP per scan</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-4">
                <h3 className="font-bold text-gray-900 text-xl mb-2">Scan to Connect</h3>
                <p className="text-sm text-gray-600">Open camera on Telegram app</p>
              </div>
              <div className="w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-4 border-gray-300 mb-4">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-mono text-sm text-blue-700">@ShieldVerseSG_bot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Setup Guide */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Quick Setup Guide</h2>
                <p className="text-sm text-gray-600">Get started in 3 easy steps</p>
              </div>
            </div>

            <div className="space-y-6">
              {setupSteps.map((step) => (
                <div key={step.step} className="relative">
                  {step.step < setupSteps.length && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg relative z-10`}>
                      <span className="text-white font-black text-xl">{step.step}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Privacy & Security</h4>
                  <p className="text-sm text-gray-700">
                    Your messages are analyzed securely and never stored permanently. We only keep threat patterns to improve our AI, with all personal information removed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Conversation */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">How It Works</h2>
                <p className="text-sm text-gray-600">Example conversation with the bot</p>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-white">ShieldVerse SG Bot</div>
                    <div className="text-xs text-blue-100">@ShieldVerseSG_bot</div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {exampleConversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      {msg.type === 'bot' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">ShieldVerse Bot</span>
                        </div>
                      )}
                      {msg.type === 'user' && !msg.system && (
                        <div className="flex items-center gap-2 mb-2 justify-end">
                          <span className="text-xs font-medium text-gray-600">You</span>
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl p-4 ${
                          msg.system
                            ? 'bg-gray-100 text-gray-600 text-center text-sm'
                            : msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : msg.analysis
                            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.forwarded && (
                          <div className="flex items-center gap-1 text-xs mb-2 opacity-80">
                            <Send className="w-3 h-3" />
                            <span>Forwarded message</span>
                          </div>
                        )}
                        <div className={`text-sm whitespace-pre-wrap ${msg.analysis ? 'text-gray-900' : ''}`}>
                          {msg.message}
                        </div>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <strong>Pro Tip:</strong> You can forward messages from any chat, including group chats, to get instant analysis. The bot will only see the forwarded message, not your entire conversation.
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6">What You Can Do</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Forward Messages</h3>
                    <p className="text-sm text-gray-700">Get instant analysis of suspicious texts, emails, or social media posts</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Check URLs</h3>
                    <p className="text-sm text-gray-700">Send suspicious links to verify if they're safe or malicious</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Get Recommendations</h3>
                    <p className="text-sm text-gray-700">Receive step-by-step guidance on what to do next</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Earn XP</h3>
                    <p className="text-sm text-gray-700">Get +25 XP for each scan and unlock related training missions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Telegram Stats</h3>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                <div className="text-4xl font-black text-green-600 mb-1">23</div>
                <div className="text-sm text-gray-600">Messages Scanned</div>
              </div>
              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                <div className="text-4xl font-black text-red-600 mb-1">8</div>
                <div className="text-sm text-gray-600">Threats Blocked</div>
              </div>
              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                <div className="text-4xl font-black text-blue-600 mb-1">+575 XP</div>
                <div className="text-sm text-gray-600">Earned via Bot</div>
              </div>
            </div>
          </div>

          {/* Recent Scans */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Scans</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className={`p-4 ${scan.bgColor} border-2 ${scan.borderColor} rounded-xl hover:shadow-md transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">{scan.preview}</div>
                      <div className="text-xs text-gray-500">{scan.timestamp}</div>
                    </div>
                    <div className={`text-2xl font-black ${scan.color}`}>{scan.riskScore}</div>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                    scan.riskScore > 70 ? 'bg-red-100 text-red-700' :
                    scan.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      scan.riskScore > 70 ? 'bg-red-500' :
                      scan.riskScore > 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                    } animate-pulse`}></div>
                    <span>{scan.classification}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/scanner"
              className="block w-full mt-4 py-2 text-center text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              View All Scans →
            </Link>
          </div>

          {/* Bot Commands */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Bot Commands</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="p-3 bg-white/60 rounded-lg">
                <code className="font-mono text-purple-700">/start</code>
                <p className="text-gray-600 text-xs mt-1">Activate the bot</p>
              </div>
              <div className="p-3 bg-white/60 rounded-lg">
                <code className="font-mono text-purple-700">/help</code>
                <p className="text-gray-600 text-xs mt-1">Get usage instructions</p>
              </div>
              <div className="p-3 bg-white/60 rounded-lg">
                <code className="font-mono text-purple-700">/stats</code>
                <p className="text-gray-600 text-xs mt-1">View your scanning stats</p>
              </div>
              <div className="p-3 bg-white/60 rounded-lg">
                <code className="font-mono text-purple-700">/missions</code>
                <p className="text-gray-600 text-xs mt-1">See recommended missions</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-xl mb-3">Ready to Get Protected?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Start using the Telegram bot today and protect yourself from scams instantly
            </p>
            <a
              href="https://t.me/ShieldVerseSG_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-center shadow-lg"
            >
              Open Bot in Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
