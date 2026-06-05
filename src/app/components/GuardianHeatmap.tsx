import { MapPin, Shield, AlertTriangle, TrendingUp, TrendingDown, Filter, Calendar, Layers, MessageSquare, QrCode, Radio, UserX, Video, ArrowLeft, Eye, Users, Target, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function GuardianHeatmap() {
  const [selectedThreat, setSelectedThreat] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('24h');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const threatTypes = [
    { id: 'all', label: 'All Threats', icon: Shield, color: 'text-gray-700', count: 847 },
    { id: 'scam', label: 'Scam Messages', icon: MessageSquare, color: 'text-red-600', count: 423 },
    { id: 'qr', label: 'Fake QR Codes', icon: QrCode, color: 'text-orange-600', count: 156 },
    { id: 'misinfo', label: 'Misinformation', icon: Radio, color: 'text-yellow-600', count: 134 },
    { id: 'cyberbully', label: 'Cyberbullying', icon: UserX, color: 'text-purple-600', count: 89 },
    { id: 'deepfake', label: 'Deepfake Content', icon: Video, color: 'text-pink-600', count: 45 }
  ];

  const timeframes = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const severities = [
    { value: 'all', label: 'All Severity', color: 'bg-gray-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-600' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'low', label: 'Low', color: 'bg-green-500' }
  ];

  const regions = [
    { value: 'all', label: 'All Singapore' },
    { value: 'central', label: 'Central Region' },
    { value: 'north', label: 'North Region' },
    { value: 'northeast', label: 'North-East Region' },
    { value: 'east', label: 'East Region' },
    { value: 'west', label: 'West Region' }
  ];

  const trendCards = [
    {
      title: 'Active Threats',
      value: '847',
      change: '+12%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Reports Today',
      value: '234',
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Community Response',
      value: '2.4 min',
      change: '-15%',
      trend: 'down',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Threats Blocked',
      value: '1,523',
      change: '+24%',
      trend: 'up',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const recentReports = [
    {
      id: 1,
      type: 'Scam Messages',
      location: 'Jurong West',
      severity: 'critical',
      description: 'Banking phishing attempt via WhatsApp',
      time: '5 min ago',
      reports: 23,
      icon: MessageSquare,
      color: 'text-red-600'
    },
    {
      id: 2,
      type: 'Fake QR Codes',
      location: 'Orchard',
      severity: 'high',
      description: 'Malicious QR code on parking coupon',
      time: '12 min ago',
      reports: 8,
      icon: QrCode,
      color: 'text-orange-600'
    },
    {
      id: 3,
      type: 'Misinformation',
      location: 'Tampines',
      severity: 'medium',
      description: 'False health claims circulating on Telegram',
      time: '28 min ago',
      reports: 15,
      icon: Radio,
      color: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'Cyberbullying',
      location: 'Ang Mo Kio',
      severity: 'high',
      description: 'Coordinated harassment on social media',
      time: '1 hour ago',
      reports: 6,
      icon: UserX,
      color: 'text-purple-600'
    }
  ];

  const hotspots = [
    { region: 'Central', count: 234, percentage: 28 },
    { region: 'East', count: 189, percentage: 22 },
    { region: 'West', count: 167, percentage: 20 },
    { region: 'North', count: 145, percentage: 17 },
    { region: 'North-East', count: 112, percentage: 13 }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Guardian Heatmap</h1>
          <p className="text-gray-600">Real-time community intelligence across Singapore</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Singapore Digital Literacy Score */}
      <div className="bg-gradient-to-br from-red-600 via-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
              <Target className="w-5 h-5" />
              <span className="font-medium">Singapore Digital Literacy</span>
            </div>
            <div className="flex items-baseline gap-4 mb-4">
              <div className="text-7xl font-black">87</div>
              <div className="text-2xl font-bold opacity-80">/100</div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-300" />
              <span className="text-lg font-medium text-green-300">+3 points this month</span>
            </div>
            <p className="text-red-100 leading-relaxed">
              Our community is getting stronger! Singapore ranks in the top 5 globally for digital literacy. Together, we've protected over 2.3M people from scams this year.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Scam Detection</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="bg-white/20 rounded-full h-3">
                <div className="bg-green-400 h-3 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Critical Thinking</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="bg-white/20 rounded-full h-3">
                <div className="bg-blue-400 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Community Reporting</span>
                <span className="font-bold">89%</span>
              </div>
              <div className="bg-white/20 rounded-full h-3">
                <div className="bg-purple-400 h-3 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Privacy Awareness</span>
                <span className="font-bold">81%</span>
              </div>
              <div className="bg-white/20 rounded-full h-3">
                <div className="bg-yellow-400 h-3 rounded-full" style={{ width: '81%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {trendCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-2xl p-6 border-2 ${card.borderColor}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                card.trend === 'up' ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                {card.trend === 'up' ? (
                  <TrendingUp className={`w-4 h-4 ${card.trend === 'up' ? 'text-orange-600' : 'text-green-600'}`} />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                )}
                <span className={`text-xs font-bold ${card.trend === 'up' ? 'text-orange-600' : 'text-green-600'}`}>
                  {card.change}
                </span>
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-600">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-black text-gray-900">Filters</h2>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Threat Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Threat Type</label>
            <div className="space-y-2">
              {threatTypes.map((threat) => (
                <button
                  key={threat.id}
                  onClick={() => setSelectedThreat(threat.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedThreat === threat.id
                      ? 'bg-red-50 border-red-300 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <threat.icon className={`w-5 h-5 ${threat.color}`} />
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{threat.label}</span>
                  <span className="text-xs font-bold text-gray-500">{threat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Timeframe</label>
            <div className="space-y-2">
              {timeframes.map((time) => (
                <button
                  key={time.value}
                  onClick={() => setSelectedTimeframe(time.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedTimeframe === time.value
                      ? 'bg-blue-50 border-blue-300 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{time.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Severity</label>
            <div className="space-y-2">
              {severities.map((severity) => (
                <button
                  key={severity.value}
                  onClick={() => setSelectedSeverity(severity.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedSeverity === severity.value
                      ? 'bg-purple-50 border-purple-300 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${severity.color}`}></div>
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{severity.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Region</label>
            <div className="space-y-2">
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() => setSelectedRegion(region.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedRegion === region.value
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{region.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Live Threat Map</h2>
                  <p className="text-sm text-gray-600">Real-time reports across Singapore</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Heatmap View</span>
              </div>
            </div>

            {/* Singapore Map Representation */}
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 overflow-hidden aspect-[4/3]">
              {/* Map Grid */}
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>

              {/* Map Label */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900">Singapore</div>
                <div className="text-xs text-gray-600">Live Intelligence Map</div>
              </div>

              {/* Heatmap Hotspots */}
              <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-orange-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-yellow-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-red-500/40 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

              {/* Pin Markers */}
              <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>

              <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-orange-600 rounded-full border-2 border-white shadow-lg animate-ping absolute" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-4 h-4 bg-orange-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>

              <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-white shadow-lg animate-ping absolute" style={{ animationDelay: '1s' }}></div>
                  <div className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
                <div className="text-xs font-bold text-gray-900 mb-2">Threat Density</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Med</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Low</span>
                  </div>
                </div>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-green-600 rounded-xl">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-white">LIVE</span>
              </div>
            </div>

            {/* Regional Hotspots */}
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Hotspot Breakdown</h3>
              <div className="space-y-3">
                {hotspots.map((hotspot, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 font-medium text-gray-700 text-sm">{hotspot.region}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          hotspot.percentage > 25 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          hotspot.percentage > 20 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                          'bg-gradient-to-r from-yellow-500 to-green-500'
                        }`}
                        style={{ width: `${hotspot.percentage * 3}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="font-bold text-gray-900">{hotspot.count}</span>
                      <span className="text-xs text-gray-500 ml-1">({hotspot.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Reports</h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-green-700">Live</span>
              </div>
            </div>

            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <report.icon className={`w-5 h-5 ${report.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900">{report.type}</h4>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                          report.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          report.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {report.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{report.location}</span>
                        </div>
                        <span>{report.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>{report.reports} community reports</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/community/submit"
              className="block w-full mt-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all text-center"
            >
              Submit a Report
            </Link>
          </div>

          {/* Community Impact */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Community Impact</h3>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-purple-200">
                <div className="text-4xl font-black text-purple-600 mb-1">2.3M</div>
                <div className="text-sm text-gray-600">People Protected</div>
              </div>

              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-purple-200">
                <div className="text-4xl font-black text-pink-600 mb-1">15,234</div>
                <div className="text-sm text-gray-600">Active Guardians</div>
              </div>

              <div className="text-center py-4 bg-white/60 backdrop-blur rounded-xl border border-purple-200">
                <div className="text-4xl font-black text-blue-600 mb-1">94%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>

          {/* Contribute */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <Zap className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-xl mb-2">Become a Guardian</h3>
            <p className="text-blue-100 text-sm mb-4">
              Help protect Singapore by reporting suspicious content you encounter
            </p>
            <Link
              to="/community/submit"
              className="block w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-center"
            >
              Start Contributing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
