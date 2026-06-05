import { Upload, Link as LinkIcon, QrCode, MessageSquare, AlertCircle, Shield, CheckCircle, Users, Clock, TrendingUp, Eye, EyeOff, Info, ArrowLeft, Zap, FileImage } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function CommunitySubmit() {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'url' | 'text' | 'qr'>('screenshot');
  const [textInput, setTextInput] = useState('');
  const [description, setDescription] = useState('');
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (agreedToPrivacy) {
      setSubmitted(true);
    }
  };

  const mySubmissions = [
    {
      id: 1,
      type: 'Text Message',
      preview: 'Free iPhone giveaway scam...',
      status: 'community_verified',
      statusLabel: 'Community Verified',
      submittedAt: '2 days ago',
      icon: MessageSquare,
      statusColor: 'green',
      helpedProtect: 234
    },
    {
      id: 2,
      type: 'URL',
      preview: 'fake-gov-sg.xyz',
      status: 'shield_squad',
      statusLabel: 'Sent to Shield Squad',
      submittedAt: '5 days ago',
      icon: LinkIcon,
      statusColor: 'purple',
      helpedProtect: 89
    },
    {
      id: 3,
      type: 'Screenshot',
      preview: 'WhatsApp phishing attempt',
      status: 'pending',
      statusLabel: 'Pending AI Review',
      submittedAt: '1 week ago',
      icon: FileImage,
      statusColor: 'yellow',
      helpedProtect: 0
    }
  ];

  const statusInfo = [
    {
      status: 'Pending AI Review',
      icon: Clock,
      color: 'yellow',
      description: 'Our AI is analyzing your submission for threat patterns'
    },
    {
      status: 'Sent to Shield Squad',
      icon: Users,
      color: 'purple',
      description: 'Community experts are reviewing and verifying the threat'
    },
    {
      status: 'Community Verified',
      icon: CheckCircle,
      color: 'green',
      description: 'Verified as a threat and added to our protection database'
    },
    {
      status: 'Added to Threat Trends',
      icon: TrendingUp,
      color: 'blue',
      description: 'Helping protect the Singapore community from similar scams'
    }
  ];

  const privacyTips = [
    { tip: 'Cover or blur out your name, phone number, and address', icon: EyeOff },
    { tip: 'Remove bank account numbers and credit card details', icon: Shield },
    { tip: 'Hide profile pictures and personal photos', icon: Eye },
    { tip: 'Blur out names of friends and family members', icon: Users }
  ];

  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">Submission Received!</h1>
            <p className="text-lg text-gray-600">Thank you for helping protect our community</p>
          </div>

          {/* XP Earned */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-green-600" />
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">+50 XP</div>
                <div className="text-sm text-gray-600">Community Contribution Bonus</div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Submission Status</h2>

            <div className="space-y-4">
              {statusInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                      : 'bg-gray-100'
                  }`}>
                    <item.icon className={`w-6 h-6 ${index === 0 ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold ${index === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.status}
                      </h3>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg">
                          Current
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${index === 0 ? 'text-gray-600' : 'text-gray-400'}`}>
                      {item.description}
                    </p>
                  </div>
                  {index === 0 && (
                    <div className="w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>What happens next?</strong> Our AI will review your submission within 24 hours. If verified as a threat, it will be sent to Shield Squad for community verification and added to our protection database.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Submit Another
            </button>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Submit Suspicious Content</h1>
          <p className="text-gray-600">Help protect the Singapore community by reporting threats you've encountered</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Privacy Warning - Prominent */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 mb-2">Important: Privacy First!</h3>
            <p className="text-gray-700 mb-4 font-medium">
              Before submitting, please <strong>remove all personal information</strong> to protect your privacy and the privacy of others.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {privacyTips.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <item.icon className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl p-2 border-2 border-gray-200 grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('screenshot')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${
                activeTab === 'screenshot'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm">Screenshot</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LinkIcon className="w-5 h-5" />
              <span className="text-sm">URL</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">Text</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${
                activeTab === 'qr'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-sm">QR Code</span>
            </button>
          </div>

          {/* Upload Areas */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            {activeTab === 'screenshot' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">Upload Screenshot</h3>
                <div className="border-2 border-dashed border-gray-300 hover:border-red-400 rounded-2xl p-12 text-center transition-all bg-gray-50 hover:bg-red-50">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">Drag & drop screenshot here</p>
                  <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all">
                    Choose File
                  </button>
                  <p className="text-xs text-gray-500 mt-4">Supported: PNG, JPG, JPEG (Max 10MB)</p>
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">Suspicious URL</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter the suspicious link
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/suspicious-link"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    ⚠️ Do not click on the link! Just copy and paste it here.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">Suspicious Message</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste the message you received
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste the suspicious WhatsApp message, SMS, email, or social media post here..."
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2">
                    Remember to remove names, phone numbers, and other personal details!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 mb-4">Suspicious QR Code</h3>
                <div className="border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-2xl p-12 text-center transition-all bg-purple-50">
                  <QrCode className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">Upload photo of the QR code</p>
                  <p className="text-sm text-gray-500 mb-4">Do not scan it! Just take a photo</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all">
                    Choose File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Tell us more (Optional)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where did you encounter this? What made you suspicious?
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: I received this WhatsApp message claiming to be from my bank. It asked me to click a link and enter my password, which seemed suspicious..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">
                This helps our AI and community understand the context better
              </p>
            </div>
          </div>

          {/* Privacy Agreement */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <strong>I confirm that:</strong> I have removed all personal information (names, phone numbers, addresses, photos) from this submission to protect my privacy and the privacy of others.
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!agreedToPrivacy}
            className={`w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all ${
              agreedToPrivacy
                ? 'hover:from-red-700 hover:to-orange-700 transform hover:scale-105'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {agreedToPrivacy ? 'Submit to Community' : 'Check Privacy Agreement to Submit'}
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Impact Stats */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Your Impact</h3>
            </div>
            <div className="space-y-4">
              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                <div className="text-4xl font-black text-green-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Submissions</div>
              </div>
              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                <div className="text-4xl font-black text-green-600 mb-1">323</div>
                <div className="text-sm text-gray-600">People Protected</div>
              </div>
              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-green-200">
                <div className="text-4xl font-black text-blue-600 mb-1">+150 XP</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
            </div>
          </div>

          {/* My Recent Submissions */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">My Recent Submissions</h3>
            <div className="space-y-3">
              {mySubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <submission.icon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate mb-1">
                        {submission.preview}
                      </div>
                      <div className="text-xs text-gray-500">{submission.submittedAt}</div>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                    submission.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                    submission.statusColor === 'purple' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      submission.statusColor === 'green' ? 'bg-green-500' :
                      submission.statusColor === 'purple' ? 'bg-purple-500' :
                      'bg-yellow-500'
                    } animate-pulse`}></div>
                    <span>{submission.statusLabel}</span>
                  </div>
                  {submission.helpedProtect > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Helped protect {submission.helpedProtect} people
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Guidelines */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Guidelines</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Submit only real suspicious content you encountered</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Always remove personal information before submitting</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Don't click on suspicious links - just copy them</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>If unsure, ask a trusted adult before submitting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
