import { Heart, Upload, Shield, AlertCircle, Phone, MessageCircle, Users, CheckCircle, ArrowLeft, Eye, UserCheck, Hand, HeartHandshake, Book, Clock, Star, Info } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function CyberbullyingSupport() {
  const [userRole, setUserRole] = useState<'victim' | 'bystander' | 'offender' | null>(null);
  const [description, setDescription] = useState('');
  const [showSupport, setShowSupport] = useState(false);

  const handleGetSupport = () => {
    if (userRole && description) {
      setShowSupport(true);
    }
  };

  const roleOptions = [
    {
      value: 'victim',
      icon: Heart,
      title: 'I\'m experiencing cyberbullying',
      description: 'You\'re going through something difficult, and we\'re here to help',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      value: 'bystander',
      icon: Eye,
      title: 'I witnessed cyberbullying',
      description: 'You can make a difference by standing up for others',
      color: 'from-purple-500 to-blue-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      value: 'offender',
      icon: Hand,
      title: 'I want to make things right',
      description: 'It takes courage to recognize harm and seek to change',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    }
  ];

  const emergencyResources = [
    {
      name: 'Samaritans of Singapore (SOS)',
      phone: '1-767',
      available: '24/7',
      description: 'Emotional support hotline',
      icon: Phone,
      color: 'text-blue-600'
    },
    {
      name: 'TOUCHline (Cyber Wellness)',
      phone: '1800-377-2252',
      available: 'Mon-Fri, 9am-6pm',
      description: 'Youth cyber wellness helpline',
      icon: MessageCircle,
      color: 'text-purple-600'
    },
    {
      name: 'Singapore Police Force',
      phone: '999',
      available: 'Emergency',
      description: 'For serious threats or harassment',
      icon: Shield,
      color: 'text-red-600'
    }
  ];

  if (showSupport && userRole) {
    const roleConfig = roleOptions.find(r => r.value === userRole)!;

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSupport(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Support Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className={`w-20 h-20 bg-gradient-to-br ${roleConfig.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <roleConfig.icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">We're Here to Support You</h1>
          <p className="text-lg text-gray-600">Here's what we recommend based on your situation</p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Immediate Actions */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">What You Can Do Right Now</h2>
                  <p className="text-sm text-gray-600">Immediate steps to help your situation</p>
                </div>
              </div>

              <div className="space-y-4">
                {userRole === 'victim' && (
                  <>
                    <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Take a break and breathe</h3>
                          <p className="text-sm text-gray-700">It's okay to step away from your device. You're not alone, and this isn't your fault.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Don't respond or retaliate</h3>
                          <p className="text-sm text-gray-700">Responding might escalate the situation. It's better to stay calm and document what's happening.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Save evidence</h3>
                          <p className="text-sm text-gray-700 mb-3">Take screenshots with dates and times visible. Don't delete messages, even if they're hurtful.</p>
                          <div className="p-3 bg-white rounded-lg border border-blue-200">
                            <p className="text-xs text-gray-600 mb-2"><strong>How to take a screenshot:</strong></p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• iPhone: Press Side + Volume Up buttons</li>
                              <li>• Android: Press Power + Volume Down buttons</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Block and report</h3>
                          <p className="text-sm text-gray-700">Use the platform's block and report features. You have the right to feel safe online.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {userRole === 'bystander' && (
                  <>
                    <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Check in with the person being targeted</h3>
                          <p className="text-sm text-gray-700 mb-3">A simple "Are you okay?" or "I'm here if you need to talk" can mean a lot.</p>
                          <div className="p-3 bg-white rounded-lg border border-purple-200">
                            <p className="text-sm text-gray-700 italic">"Hey, I saw what happened online. Just wanted to check if you're okay. I'm here if you need someone to talk to."</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Don't share or like the hurtful content</h3>
                          <p className="text-sm text-gray-700">Even if you're trying to show support, sharing it can make things worse by spreading it further.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Report it to the platform</h3>
                          <p className="text-sm text-gray-700">Most social media platforms have reporting features. Use them to flag harmful content.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Tell a trusted adult</h3>
                          <p className="text-sm text-gray-700">If the situation is serious, let a teacher, parent, or counselor know. This isn't snitching—it's helping.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {userRole === 'offender' && (
                  <>
                    <div className="p-5 bg-teal-50 border-2 border-teal-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Acknowledge what happened</h3>
                          <p className="text-sm text-gray-700">Recognizing that your words or actions caused harm is an important first step. It shows maturity.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-teal-50 border-2 border-teal-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Stop the behavior immediately</h3>
                          <p className="text-sm text-gray-700">Delete harmful posts or messages. Stop engaging in any way that could continue the hurt.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-teal-50 border-2 border-teal-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Consider apologizing sincerely</h3>
                          <p className="text-sm text-gray-700 mb-3">A genuine apology can help repair harm. It should acknowledge what you did, show understanding of the impact, and express genuine regret.</p>
                          <div className="p-3 bg-white rounded-lg border border-teal-200">
                            <p className="text-sm text-gray-700 italic">"I'm sorry for what I said/posted. I realize it was hurtful and wrong. I'm working on being more thoughtful about how my words affect others."</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-teal-50 border-2 border-teal-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Talk to someone you trust</h3>
                          <p className="text-sm text-gray-700">A counselor, teacher, or parent can help you understand why it happened and how to change your behavior.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Safety Checklist */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Safety Checklist</h2>
                  <p className="text-sm text-gray-600">Protect yourself going forward</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-green-200 hover:bg-white transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">Review privacy settings on all social media accounts</span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-green-200 hover:bg-white transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">Block accounts that are causing harm</span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-green-200 hover:bg-white transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">Save screenshots and evidence with timestamps</span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-green-200 hover:bg-white transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">Talk to a trusted adult about what's happening</span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-green-200 hover:bg-white transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">Take breaks from social media if needed</span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-green-200 hover:bg-white transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700">Know how to report on each platform you use</span>
                </label>
              </div>
            </div>

            {/* When to Tell an Adult */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">When to Tell a Trusted Adult</h2>
                  <p className="text-sm text-gray-600">Some situations need adult help</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">If you feel unsafe or threatened</h3>
                      <p className="text-sm text-gray-700">Including threats of physical harm, sexual content, or blackmail</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">If the bullying continues or gets worse</h3>
                      <p className="text-sm text-gray-700">Despite blocking and reporting</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">If it's affecting your mental health</h3>
                      <p className="text-sm text-gray-700">Feeling anxious, depressed, or having trouble sleeping</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">If you're having thoughts of self-harm</h3>
                      <p className="text-sm text-gray-700">Please talk to an adult or call SOS (1-767) immediately</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">If personal information is being shared</h3>
                      <p className="text-sm text-gray-700">Address, phone number, school, or private photos/videos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Resources */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Need to Talk Now?</h3>
              </div>

              <div className="space-y-3">
                {emergencyResources.map((resource, index) => (
                  <div key={index} className="p-4 bg-white/60 backdrop-blur rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3 mb-2">
                      <resource.icon className={`w-5 h-5 ${resource.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{resource.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <a href={`tel:${resource.phone}`} className="text-lg font-black text-blue-600 hover:text-blue-700">
                            {resource.phone}
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{resource.available}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional Support */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake className="w-5 h-5 text-pink-600" />
                <h3 className="font-bold text-gray-900">Self-Care Tips</h3>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>Take breaks from screens and social media</span>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>Do activities that make you feel good</span>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>Talk to friends or family you trust</span>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>Write down your feelings in a journal</span>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>Remember: This isn't your fault</span>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Book className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-gray-900">Learn More</h3>
              </div>

              <div className="space-y-2">
                <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all">
                  Understanding Cyberbullying →
                </a>
                <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all">
                  Digital Wellness Guide →
                </a>
                <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all">
                  Building Resilience Online →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setShowSupport(false)}
            className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Get Help for Another Situation
          </button>
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Cyberbullying Support</h1>
          <p className="text-gray-600">We're here to help. You're not alone.</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Supportive Message */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-pink-200 text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">You're Safe Here</h2>
        <p className="text-gray-700 leading-relaxed">
          Whatever you're going through, we want to help. This is a judgment-free space where you can get support, guidance, and resources. Your feelings are valid, and there are people who care.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Selection */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 mb-2">First, tell us how we can help</h2>
            <p className="text-gray-600 mb-6">Choose the option that best describes your situation</p>

            <div className="space-y-4">
              {roleOptions.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setUserRole(role.value as any)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    userRole === role.value
                      ? `${role.bgColor} ${role.borderColor} shadow-lg scale-105`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <role.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{role.title}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                    {userRole === role.value && (
                      <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          {userRole && (
            <>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-2">Share what happened (optional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The more details you provide, the better we can help. Remember to keep personal information private.
                </p>

                <div className="space-y-4">
                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload a screenshot (optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 hover:border-pink-400 rounded-xl p-8 text-center transition-all bg-gray-50 hover:bg-pink-50 cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Drag & drop screenshot here</p>
                      <p className="text-xs text-gray-500">PNG, JPG (Max 10MB)</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe what happened
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Example: Someone from my class has been posting mean comments about me on Instagram for the past week. They're sharing embarrassing photos without my permission..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none resize-none"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2">
                      Your information is private and secure. We're here to help, not to judge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Get Support Button */}
              <button
                onClick={handleGetSupport}
                disabled={!description}
                className={`w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all ${
                  description
                    ? 'hover:from-pink-700 hover:to-purple-700 transform hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                Get Support & Guidance
              </button>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Helplines */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-gray-900">Need Help Right Now?</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white rounded-xl border border-red-200">
                <div className="font-bold text-gray-900 mb-1">Samaritans of Singapore</div>
                <a href="tel:1767" className="text-2xl font-black text-red-600 hover:text-red-700">1-767</a>
                <div className="text-xs text-gray-600 mt-1">24/7 Emotional Support</div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-red-200">
                <div className="font-bold text-gray-900 mb-1">Emergency</div>
                <a href="tel:999" className="text-2xl font-black text-red-600 hover:text-red-700">999</a>
                <div className="text-xs text-gray-600 mt-1">For immediate danger</div>
              </div>
            </div>
          </div>

          {/* Privacy & Safety */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Your Privacy Matters</h3>
            </div>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Your information is kept confidential</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>We never share screenshots publicly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>You can leave at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>No judgment, only support</span>
              </li>
            </ul>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-gray-700" />
              <h3 className="font-bold text-gray-900">Remember</h3>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                <strong>It's not your fault.</strong> No one deserves to be bullied, ever.
              </p>
              <p className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <strong>You're not alone.</strong> Many people have gone through this and come out stronger.
              </p>
              <p className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <strong>It gets better.</strong> With the right support and steps, things will improve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
