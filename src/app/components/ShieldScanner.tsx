import { Upload, Link as LinkIcon, QrCode, MessageSquare, Image as ImageIcon, Video, FileText, Shield, AlertTriangle, CheckCircle, XCircle, Zap, Brain, Eye, TrendingUp, Clock, Share2, Flag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

export function ShieldScanner() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'text' | 'qr'>('upload');
  const [isScanning, setIsScanning] = useState(false);
  const [textInput, setTextInput] = useState('');

  const recentScans = [
    {
      id: 1,
      type: 'text',
      preview: 'BREAKING: Free iPhone giveaway! Click now...',
      riskScore: 92,
      classification: 'Scam',
      timestamp: '2 hours ago',
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      type: 'url',
      preview: 'gov.sg/digital-safety-tips',
      riskScore: 5,
      classification: 'Safe',
      timestamp: '1 day ago',
      icon: LinkIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'image',
      preview: 'Screenshot of WhatsApp message',
      riskScore: 67,
      classification: 'Suspicious',
      timestamp: '2 days ago',
      icon: ImageIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      navigate('/scanner/results');
    }, 3000);
  };

  if (isScanning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated scanning overlay */}
        <div className="text-center space-y-8">
          {/* Scanning animation */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-8 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-8 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-12 h-12 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white">Analyzing Content...</h2>
            <p className="text-purple-300">AI Shield is scanning for threats</p>
          </div>

          {/* Progress steps */}
          <div className="max-w-md mx-auto space-y-3">
            {[
              { label: 'Extracting text and metadata', done: true },
              { label: 'Running pattern recognition', done: true },
              { label: 'Checking against threat database', done: false },
              { label: 'Calculating risk score', done: false }
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.done ? 'bg-green-500' : 'bg-purple-500/30'
                }`}>
                  {step.done ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className={`text-sm ${step.done ? 'text-green-300' : 'text-purple-300'}`}>
                  {step.label}
                </span>
              </div>
            ))}
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">Shield Scanner</h1>
          <p className="text-gray-600">Upload suspicious content for instant AI analysis</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Total Scans</div>
              <div className="text-xl font-black text-gray-900">47</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Threats Found</div>
              <div className="text-xl font-black text-gray-900">12</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Safe Content</div>
              <div className="text-xl font-black text-gray-900">35</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">XP Earned</div>
              <div className="text-xl font-black text-gray-900">1,175</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Scanner Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl p-2 border-2 border-gray-200 flex gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LinkIcon className="w-5 h-5" />
              <span>URL</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'qr'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>QR Code</span>
            </button>
          </div>

          {/* Upload Zone */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-300 hover:border-red-400 transition-all">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <Upload className="w-12 h-12 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop Files Here</h3>
                  <p className="text-gray-600 mb-4">or click to browse</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all">
                    Choose File
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ImageIcon className="w-5 h-5" />
                    <span>Images</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Video className="w-5 h-5" />
                    <span>Videos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-5 h-5" />
                    <span>Screenshots</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* URL Input */}
          {activeTab === 'url' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter URL to scan
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleScan}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all"
                >
                  Scan URL
                </button>
              </div>
            </div>
          )}

          {/* Text Input */}
          {activeTab === 'text' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste suspicious text or message
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste WhatsApp message, email, or any suspicious text here..."
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
                <button
                  onClick={handleScan}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all"
                >
                  Analyze Text
                </button>
              </div>
            </div>
          )}

          {/* QR Scanner */}
          {activeTab === 'qr' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-center space-y-6">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center border-4 border-dashed border-purple-300">
                  <QrCode className="w-32 h-32 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code</h3>
                  <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all">
                    Activate Camera
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Scan Buttons */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4">🚀 Quick Scan</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleScan}
                className="p-4 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all text-left"
              >
                <div className="font-bold text-gray-900 mb-1">Demo: Phishing Email</div>
                <div className="text-xs text-gray-600">Test the scanner with sample content</div>
              </button>
              <button
                onClick={handleScan}
                className="p-4 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all text-left"
              >
                <div className="font-bold text-gray-900 mb-1">Demo: Fake Giveaway</div>
                <div className="text-xs text-gray-600">See how AI detects scams</div>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Recent Scans */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Scans</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  className={`w-full p-4 ${scan.bgColor} border-2 ${
                    scan.riskScore > 70 ? 'border-red-300' :
                    scan.riskScore > 40 ? 'border-yellow-300' :
                    'border-green-300'
                  } rounded-xl text-left hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <scan.icon className={`w-5 h-5 ${scan.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate mb-1">
                        {scan.preview}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{scan.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${scan.color}`}>
                      {scan.classification}
                    </span>
                    <span className={`text-lg font-black ${scan.color}`}>
                      {scan.riskScore}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors">
              View All Scans →
            </button>
          </div>

          {/* Scanner Tips */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-gray-900">Scanner Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>Scan before clicking any suspicious links</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>Upload full screenshots for better accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>Check QR codes before scanning them</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>Report high-risk content to authorities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
