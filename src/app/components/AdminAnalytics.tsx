import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  Users, Activity, CheckCircle, Target, ScanLine, AlertTriangle,
  Heart, Flag, MapPin, TrendingUp, TrendingDown, ArrowUpRight,
  Shield, Download, RefreshCw, Bell, Settings, ChevronDown,
  Zap, Globe, BarChart2, Calendar, Filter,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const dauData = [
  { day: 'Mon', users: 5820, new: 420 },
  { day: 'Tue', users: 6340, new: 510 },
  { day: 'Wed', users: 7110, new: 680 },
  { day: 'Thu', users: 6890, new: 590 },
  { day: 'Fri', users: 8240, new: 730 },
  { day: 'Sat', users: 9120, new: 870 },
  { day: 'Sun', users: 7650, new: 620 },
];

const monthlyUsers = [
  { month: 'Dec', users: 48200 },
  { month: 'Jan', users: 52400 },
  { month: 'Feb', users: 57100 },
  { month: 'Mar', users: 63800 },
  { month: 'Apr', users: 71200 },
  { month: 'May', users: 82400 },
];

const missionsData = [
  { week: 'W1 Apr', completed: 18400, started: 22100 },
  { week: 'W2 Apr', completed: 21300, started: 25600 },
  { week: 'W3 Apr', completed: 24800, started: 29400 },
  { week: 'W4 Apr', completed: 28100, started: 33200 },
  { week: 'W1 May', completed: 31600, started: 37800 },
  { week: 'W2 May', completed: 35200, started: 41100 },
];

const accuracyTrend = [
  { month: 'Dec', before: 61, after: 71 },
  { month: 'Jan', before: 63, after: 73 },
  { month: 'Feb', before: 65, after: 76 },
  { month: 'Mar', before: 66, after: 79 },
  { month: 'Apr', before: 68, after: 82 },
  { month: 'May', before: 69, after: 84 },
];

const threatTypes = [
  { name: 'Phishing Links', count: 38420, pct: 31, color: '#DC2626', fill: '#FEE2E2' },
  { name: 'Fake QR Codes', count: 24810, pct: 20, color: '#7C3AED', fill: '#EDE9FE' },
  { name: 'Deepfake Media', count: 21340, pct: 17, color: '#2563EB', fill: '#DBEAFE' },
  { name: 'Misinformation', count: 18950, pct: 15, color: '#D97706', fill: '#FEF3C7' },
  { name: 'Scam Messages', count: 13720, pct: 11, color: '#059669', fill: '#D1FAE5' },
  { name: 'Cyberbullying', count: 7460, pct: 6, color: '#DB2777', fill: '#FCE7F3' },
];

const pieData = threatTypes.map(t => ({ name: t.name, value: t.pct, color: t.color }));

const supportSessions = [
  { month: 'Dec', sessions: 340, resolved: 298 },
  { month: 'Jan', sessions: 410, resolved: 372 },
  { month: 'Feb', sessions: 480, resolved: 441 },
  { month: 'Mar', sessions: 520, resolved: 487 },
  { month: 'Apr', sessions: 610, resolved: 578 },
  { month: 'May', sessions: 684, resolved: 651 },
];

const communityReports = [
  { id: 1, type: 'Phishing Link', source: 'WhatsApp', reporter: 'SentinelAlex', status: 'Verified', severity: 'High', time: '2m ago' },
  { id: 2, type: 'Fake QR Code', source: 'Telegram', reporter: 'GuardianMei', status: 'Pending', severity: 'Medium', time: '14m ago' },
  { id: 3, type: 'Deepfake Video', source: 'TikTok', reporter: 'ShieldRaj', status: 'Verified', severity: 'High', time: '31m ago' },
  { id: 4, type: 'Misinformation', source: 'Facebook', reporter: 'NovaPriya', status: 'Investigating', severity: 'Medium', time: '47m ago' },
  { id: 5, type: 'Scam Message', source: 'SMS', reporter: 'CipherKai', status: 'Verified', severity: 'High', time: '1h ago' },
  { id: 6, type: 'Cyberbullying', source: 'Instagram', reporter: 'TruthAna', status: 'Resolved', severity: 'Low', time: '2h ago' },
  { id: 7, type: 'Phishing Link', source: 'Email', reporter: 'VeilSam', status: 'Pending', severity: 'Medium', time: '3h ago' },
];

const heatmapInsights = [
  { region: 'Central', reports: 3840, topThreat: 'Phishing', change: 12, risk: 'High' },
  { region: 'North', reports: 2210, topThreat: 'Fake QR', change: -4, risk: 'Medium' },
  { region: 'South', reports: 1980, topThreat: 'Deepfake', change: 8, risk: 'Medium' },
  { region: 'East', reports: 2640, topThreat: 'Scam SMS', change: 21, risk: 'High' },
  { region: 'West', reports: 1720, topThreat: 'Misinformation', change: -2, risk: 'Low' },
  { region: 'North-East', reports: 1540, topThreat: 'Cyberbullying', change: 5, risk: 'Low' },
];

const radarData = [
  { skill: 'Scam Detect', A: 84, avg: 64 },
  { skill: 'Deepfakes', A: 72, avg: 58 },
  { skill: 'Misinformation', A: 79, avg: 62 },
  { skill: 'QR Safety', A: 76, avg: 60 },
  { skill: 'Cyberbullying', A: 81, avg: 66 },
  { skill: 'Privacy', A: 70, avg: 55 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, iconColor, iconBg,
  trend, trendVal, trendUp,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconColor: string; iconBg: string;
  trend?: boolean; trendVal?: string; trendUp?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendVal}
          </div>
        )}
      </div>
      <div className="text-gray-900 text-2xl font-black mb-0.5">{value}</div>
      <div className="text-gray-500 text-xs font-medium">{label}</div>
      <div className="text-gray-400 text-xs mt-1">{sub}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

type Period = '7d' | '30d' | '90d';

export function AdminAnalytics() {
  const [period, setPeriod] = useState<Period>('30d');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-gray-900">Admin Analytics</h1>
          </div>
          <p className="text-gray-500 text-sm">ShieldVerse SG · Platform Intelligence Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-gray-100 rounded-xl p-1 text-xs font-medium">
            {(['7d', '30d', '90d'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button className="p-2 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live status bar */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl px-5 py-3 flex flex-wrap items-center gap-4 text-white text-sm shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-medium">Live</span>
        </div>
        <div className="h-4 border-l border-white/30" />
        {[
          { label: 'Online now', value: '3,241' },
          { label: 'Scans today', value: '8,120' },
          { label: 'Reports today', value: '47' },
          { label: 'Support active', value: '12 sessions' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-white/70">{label}</span>
            <span className="font-bold">{value}</span>
          </div>
        ))}
        <div className="ml-auto text-white/70 text-xs flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Updated just now
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="82,400" sub="+14.2% from last month" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" trend trendVal="+14.2%" trendUp />
        <StatCard label="Daily Active Users" value="9,120" sub="Peak: Sat 19 May" icon={Activity} iconColor="text-green-600" iconBg="bg-green-50" trend trendVal="+8.7%" trendUp />
        <StatCard label="Missions Completed" value="1.24M" sub="35,200 this week" icon={CheckCircle} iconColor="text-red-600" iconBg="bg-red-50" trend trendVal="+22%" trendUp />
        <StatCard label="Avg Accuracy Gain" value="+15 pts" sub="From 69% → 84% post-training" icon={Target} iconColor="text-purple-600" iconBg="bg-purple-50" trend trendVal="+3 pts" trendUp />
        <StatCard label="Total Scans" value="384,200" sub="8,120 today" icon={ScanLine} iconColor="text-cyan-600" iconBg="bg-cyan-50" trend trendVal="+19%" trendUp />
        <StatCard label="Threats Detected" value="124,700" sub="78% auto-verified" icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-50" trend trendVal="+31%" trendUp />
        <StatCard label="Support Sessions" value="684" sub="95% resolution rate" icon={Heart} iconColor="text-pink-600" iconBg="bg-pink-50" trend trendVal="+12%" trendUp />
        <StatCard label="Community Reports" value="18,340" sub="47 new today" icon={Flag} iconColor="text-indigo-600" iconBg="bg-indigo-50" trend trendVal="+9%" trendUp />
      </div>

      {/* Row 1: DAU chart + Monthly growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* DAU Area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 text-sm font-semibold">Daily Active Users</h2>
              <p className="text-gray-400 text-xs">This week — total vs new users</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-red-500 rounded inline-block" />Total</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-orange-300 rounded inline-block" />New</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dauData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="Total DAU" stroke="#DC2626" strokeWidth={2.5} fill="url(#dauGrad)" dot={false} />
              <Area type="monotone" dataKey="new" name="New Users" stroke="#F97316" strokeWidth={2} fill="url(#newGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly growth bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-gray-900 text-sm font-semibold">Monthly User Growth</h2>
            <p className="text-gray-400 text-xs">Total registered users</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyUsers} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" name="Users" fill="#DC2626" radius={[6, 6, 0, 0]}>
                {monthlyUsers.map((_, i) => (
                  <Cell key={i} fill={i === monthlyUsers.length - 1 ? '#DC2626' : '#FECACA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Missions completion + Accuracy improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Missions bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 text-sm font-semibold">Mission Completions</h2>
              <p className="text-gray-400 text-xs">Started vs completed by week</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-red-500 rounded inline-block" />Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-red-200 rounded inline-block" />Started</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={missionsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="started" name="Started" fill="#FECACA" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy line chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 text-sm font-semibold">Avg Accuracy Improvement</h2>
              <p className="text-gray-400 text-xs">Pre-training vs post-training scores</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-gray-400 rounded inline-block" />Before</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-500 rounded inline-block" />After</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={accuracyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 90]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="before" name="Before" stroke="#9CA3AF" strokeWidth={2} dot={{ r: 3, fill: '#9CA3AF' }} strokeDasharray="5 4" />
              <Line type="monotone" dataKey="after" name="After" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3.5, fill: '#16A34A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Threat types pie + bar + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pie */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-gray-900 text-sm font-semibold">Threat Type Distribution</h2>
            <p className="text-gray-400 text-xs">All-time scans · 124,700 threats</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `${val}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {threatTypes.slice(0, 4).map(t => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                <span className="text-gray-600 flex-1 truncate">{t.name}</span>
                <span className="font-semibold text-gray-800">{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-gray-900 text-sm font-semibold">Most Common Threats</h2>
            <p className="text-gray-400 text-xs">By detection count</p>
          </div>
          <div className="space-y-3">
            {threatTypes.map(t => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium">{t.name}</span>
                  <span className="font-bold text-gray-800">{t.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${t.pct * 3}%`, background: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="mb-2">
            <h2 className="text-gray-900 text-sm font-semibold">Literacy Skills Radar</h2>
            <p className="text-gray-400 text-xs">Platform avg vs national benchmark</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#F3F4F6" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <Radar name="Platform Avg" dataKey="A" stroke="#DC2626" fill="#DC2626" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="National Avg" dataKey="avg" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 3" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Cyberbullying support chart + sessions stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 text-sm font-semibold">Cyberbullying Support Sessions</h2>
              <p className="text-gray-400 text-xs">Monthly sessions opened vs resolved</p>
            </div>
            <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-pink-700 font-medium">
              <Heart className="w-3.5 h-3.5" />
              95% resolution rate
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={supportSessions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DB2777" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DB2777" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sessions" name="Sessions opened" stroke="#DB2777" strokeWidth={2} fill="url(#sessGrad)" dot={false} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#16A34A" strokeWidth={2} fill="url(#resGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-gray-900 text-sm font-semibold mb-4">Support Highlights</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Avg Resolution Time', value: '8.4 min', icon: '⏱️', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { label: 'Escalated Cases', value: '23 / 684', icon: '🚨', color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Repeat Sessions', value: '12%', icon: '🔄', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { label: 'Satisfaction Score', value: '4.8 / 5', icon: '⭐', color: 'bg-green-50 border-green-200 text-green-700' },
              { label: 'Peer Helpers Active', value: '41', icon: '🤝', color: 'bg-purple-50 border-purple-200 text-purple-700' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${color}`}>
                <span className="text-lg">{icon}</span>
                <span className="text-xs font-medium flex-1">{label}</span>
                <span className="font-bold text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Community Reports table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900 text-sm font-semibold">Community Reports</h2>
            <p className="text-gray-400 text-xs">18,340 total · 47 new today</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live feed
            </span>
            <button className="text-xs text-gray-500 hover:text-red-600 font-medium flex items-center gap-1 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-red-300 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Threat Type', 'Platform', 'Reporter', 'Severity', 'Status', 'Time'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {communityReports.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="font-medium text-gray-800 text-xs">{r.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 bg-gray-100 rounded-lg px-2 py-0.5 font-medium">{r.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {r.reporter[0]}
                      </div>
                      <span className="text-xs text-gray-700">{r.reporter}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.severity === 'High' ? 'bg-red-100 text-red-700' :
                      r.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.status === 'Verified' ? 'bg-green-100 text-green-700' :
                      r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      r.status === 'Investigating' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 6: Heatmap insights */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900 text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              Guardian Heatmap Insights
            </h2>
            <p className="text-gray-400 text-xs">Regional threat distribution across Singapore</p>
          </div>
          <a href="/heatmap" className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 border border-red-200 bg-red-50 rounded-lg px-2.5 py-1.5 hover:bg-red-100 transition-colors">
            Open Heatmap <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {heatmapInsights.map((r) => (
              <div key={r.region} className={`rounded-xl border p-4 ${
                r.risk === 'High' ? 'bg-red-50 border-red-200' :
                r.risk === 'Medium' ? 'bg-amber-50 border-amber-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${
                      r.risk === 'High' ? 'text-red-600' :
                      r.risk === 'Medium' ? 'text-amber-600' : 'text-green-600'
                    }`} />
                    <span className={`font-semibold text-sm ${
                      r.risk === 'High' ? 'text-red-800' :
                      r.risk === 'Medium' ? 'text-amber-800' : 'text-green-800'
                    }`}>{r.region}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    r.risk === 'High' ? 'bg-red-100 text-red-700' :
                    r.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>{r.risk}</span>
                </div>
                <div className="text-gray-700 text-xl font-black mb-0.5">{r.reports.toLocaleString()}</div>
                <div className="text-gray-500 text-xs mb-1.5">reports this month</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Top: <span className="font-semibold text-gray-700">{r.topThreat}</span></span>
                  <span className={`flex items-center gap-0.5 font-semibold ${r.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {r.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {r.change > 0 ? '+' : ''}{r.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mini summary bar */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            {[
              { label: 'Highest risk zone', value: 'Central · Phishing', icon: '🔴' },
              { label: 'Fastest growing threat', value: 'East · +21% Scam SMS', icon: '📈' },
              { label: 'Most improved region', value: 'North · −4% threats', icon: '✅' },
              { label: 'Total reports (SG)', value: '13,930 this month', icon: '📊' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-gray-400">{label}:</span>
                <span className="font-semibold text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
