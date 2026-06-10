import {
  MapPin, Shield, AlertTriangle, TrendingUp, TrendingDown, Filter,
  Calendar, Layers, MessageSquare, QrCode, Radio, UserX, Video,
  ArrowLeft, Eye, Users, Target, Zap, RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ── Types ─────────────────────────────────────────────────────────────────────

type ThreatType = 'scam' | 'qr' | 'misinfo' | 'cyberbully' | 'deepfake';
type Severity   = 'critical' | 'high' | 'medium' | 'low';
type Region     = 'central' | 'north' | 'northeast' | 'east' | 'west';

interface AnonymousIncident {
  id: string;
  threat_type: ThreatType;
  threat_label: string;
  region: Region;
  neighborhood: string;
  severity: Severity;
  time_ago: string;
  report_count: number;
  description: string;
}

interface HeatmapResponse {
  stats: { total_reports: number; reports_today: number; people_protected: number; active_threats: number };
  by_type: Record<string, number>;
  by_region: Record<Region, number>;
  recent: AnonymousIncident[];
  last_updated: string;
}

// ── Static config ─────────────────────────────────────────────────────────────

const THREAT_COLORS: Record<string, string> = {
  all: '#ef4444', scam: '#ef4444', qr: '#f97316',
  misinfo: '#eab308', cyberbully: '#a855f7', deepfake: '#ec4899',
};

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#16a34a',
};

// Coordinates are in 1920×1080 space (matching the PNG dimensions).
// Adjust these if your PNG crops/frames Singapore differently.
const REGION_CENTERS: Record<Region, { x: number; y: number }> = {
  north:     { x: 803,  y: 201 },
  northeast: { x: 1228, y: 290 },
  central:   { x: 970,  y: 461 },
  east:      { x: 1490, y: 437 },
  west:      { x: 467,  y: 569 },
};

const REGION_LABELS: Record<Region, string> = {
  north: 'North', northeast: 'North-East', central: 'Central', east: 'East', west: 'West',
};

// Coordinates in 1920×1080 space — adjust to match your PNG if needed.
const NEIGHBORHOOD_POSITIONS: Record<string, { x: number; y: number }> = {
  Woodlands:       { x: 677,  y: 167 },
  Yishun:          { x: 909,  y: 196 },
  Sembawang:       { x: 796,  y: 142 },
  Canberra:        { x: 859,  y: 155 },
  Admiralty:       { x: 619,  y: 177 },
  Punggol:         { x: 1268, y: 233 },
  Sengkang:        { x: 1182, y: 299 },
  Hougang:         { x: 1081, y: 368 },
  'Ang Mo Kio':    { x: 990,  y: 363 },
  Serangoon:       { x: 1048, y: 422 },
  Tampines:        { x: 1420, y: 363 },
  Bedok:           { x: 1445, y: 479 },
  'Pasir Ris':     { x: 1485, y: 290 },
  Changi:          { x: 1601, y: 290 },
  Simei:           { x: 1359, y: 422 },
  Orchard:         { x: 897,  y: 528 },
  'Marina Bay':    { x: 1015, y: 682 },
  'Toa Payoh':     { x: 955,  y: 412 },
  Bishan:          { x: 929,  y: 363 },
  Novena:          { x: 879,  y: 471 },
  Queenstown:      { x: 796,  y: 577 },
  'Bukit Timah':   { x: 727,  y: 511 },
  'Jurong West':   { x: 374,  y: 594 },
  'Jurong East':   { x: 543,  y: 577 },
  Clementi:        { x: 644,  y: 589 },
  'Boon Lay':      { x: 298,  y: 560 },
  'Choa Chu Kang': { x: 434,  y: 373 },
};

// ── Singapore PNG Map with SVG overlay ───────────────────────────────────────
// Drop your map PNG at public/singapore-map.png (1920×1080).
// All SVG overlay coordinates are in 1920×1080 space — calibrate REGION_CENTERS
// and NEIGHBORHOOD_POSITIONS above if your PNG frames Singapore differently.

function SingaporeMap({
  byRegion, recent, selectedRegion, selectedThreat, onRegionClick,
}: {
  byRegion: Record<Region, number>;
  recent: AnonymousIncident[];
  selectedRegion: string;
  selectedThreat: string;
  onRegionClick: (r: string) => void;
}) {
  const [hovered, setHovered] = useState<Region | null>(null);
  const [mapError, setMapError] = useState(false);

  const maxCount = Math.max(...(Object.values(byRegion) as number[]), 1);
  const heatColor = THREAT_COLORS[selectedThreat] ?? '#ef4444';

  // Radius in 1920×1080 space
  const heatRadius = (region: Region) => {
    const count = byRegion[region] ?? 0;
    return 40 + (count / maxCount) * 160;
  };

  const regionOpacity = (region: Region) => {
    if (selectedRegion === 'all') return 1;
    return selectedRegion === region ? 1 : 0.15;
  };

  const visibleDots = recent
    .filter(inc => selectedRegion === 'all' || inc.region === selectedRegion)
    .filter(inc => selectedThreat === 'all' || inc.threat_type === selectedThreat)
    .slice(0, 10);

  return (
    // Container preserves the PNG's 16:9 aspect ratio
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{ aspectRatio: '16/9', background: '#bfdbfe' }}
    >
      {/* ── Base PNG map ─────────────────────────────────────────────────── */}
      {!mapError ? (
        <img
          src="/singapore-map.jpg"
          alt="Singapore map"
          className="absolute inset-0 w-full h-full"
          draggable={false}
          onError={() => setMapError(true)}
        />
      ) : (
        // Shown until the PNG is added to /public
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-100 to-cyan-100">
          <MapPin className="w-10 h-10 text-blue-300" />
          <p className="text-blue-400 font-semibold text-sm">
            Add <code className="bg-blue-100 px-1 rounded">singapore-map.jpg</code> to the <code className="bg-blue-100 px-1 rounded">public/</code> folder
          </p>
          <p className="text-blue-300 text-xs">Heat overlays will appear on top of your PNG automatically</p>
        </div>
      )}

      {/* ── SVG overlay — viewBox matches the PNG dimensions ─────────────── */}
      <svg
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
        aria-label="Guardian Heatmap overlay"
      >
        <defs>
          {(Object.keys(REGION_CENTERS) as Region[]).map(r => (
            <radialGradient key={r} id={`grad-${r}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={heatColor} stopOpacity="0.72" />
              <stop offset="55%"  stopColor={heatColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={heatColor} stopOpacity="0"    />
            </radialGradient>
          ))}
        </defs>

        {/* ── Heat circles per region ─────────────────────────────────────── */}
        {(Object.entries(REGION_CENTERS) as [Region, { x: number; y: number }][]).map(([region, c]) => {
          const r = heatRadius(region);
          const isHov = hovered === region;
          // Keep tooltip inside the viewBox
          const tooltipY = Math.max(72, c.y - r * 0.72 - 72);
          return (
            <g
              key={region}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
              onClick={() => onRegionClick(selectedRegion === region ? 'all' : region)}
              onMouseEnter={() => setHovered(region)}
              onMouseLeave={() => setHovered(null)}
            >
              <ellipse
                cx={c.x} cy={c.y}
                rx={r} ry={r * 0.72}
                fill={`url(#grad-${region})`}
                opacity={regionOpacity(region)}
              />
              {isHov && (
                <>
                  <ellipse
                    cx={c.x} cy={c.y}
                    rx={r + 20} ry={(r + 20) * 0.72}
                    fill="none" stroke={heatColor}
                    strokeWidth="3" opacity="0.5"
                    strokeDasharray="10 7"
                  />
                  <rect
                    x={c.x - 155} y={tooltipY}
                    width="310" height="62" rx="12"
                    fill="white" stroke="#e2e8f0" strokeWidth="2"
                    filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))"
                  />
                  <text
                    x={c.x} y={tooltipY + 38}
                    textAnchor="middle" fill="#1e293b"
                    fontSize="24" fontWeight="700"
                    style={{ pointerEvents: 'none' }}
                  >
                    {REGION_LABELS[region]}: {(byRegion[region] ?? 0).toLocaleString()} reports
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* ── Recent report pings ─────────────────────────────────────────── */}
        {visibleDots.map((inc, i) => {
          const pos = NEIGHBORHOOD_POSITIONS[inc.neighborhood];
          if (!pos) return null;
          const col = SEVERITY_COLORS[inc.severity];
          return (
            <g key={inc.id} style={{ pointerEvents: 'none' }}>
              <circle
                cx={pos.x} cy={pos.y} r="15"
                fill={col} opacity="0.35"
                className="animate-ping"
                style={{ animationDelay: `${i * 0.28}s`, transformOrigin: `${pos.x}px ${pos.y}px` }}
              />
              <circle cx={pos.x} cy={pos.y} r="10" fill={col} stroke="white" strokeWidth="3" />
            </g>
          );
        })}

        {/* ── Region labels ───────────────────────────────────────────────── */}
        {(Object.entries(REGION_CENTERS) as [Region, { x: number; y: number }][]).map(([region, c]) => (
          <text
            key={`lbl-${region}`}
            x={c.x} y={c.y + 38}
            textAnchor="middle" fill="#475569"
            fontSize="22" fontWeight="700" letterSpacing="1.2"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {REGION_LABELS[region].toUpperCase()}
          </text>
        ))}

        {/* ── Live indicator (top-left) ───────────────────────────────────── */}
        <g transform="translate(32,28)" style={{ pointerEvents: 'none' }}>
          <rect width="136" height="52" rx="14" fill="#16a34a" />
          <circle cx="30" cy="26" r="9" fill="white" className="animate-pulse" />
          <text x="50" y="36" fill="white" fontSize="24" fontWeight="800">LIVE</text>
        </g>

        {/* ── Legend (bottom-right) ───────────────────────────────────────── */}
        <g transform="translate(1548,940)" style={{ pointerEvents: 'none' }}>
          <rect width="340" height="108" rx="16" fill="white" stroke="#e2e8f0" strokeWidth="2"
            filter="drop-shadow(0 3px 8px rgba(0,0,0,0.08))" />
          <text x="18" y="34" fill="#374151" fontSize="19" fontWeight="700">THREAT DENSITY</text>
          {[['#dc2626','High'],['#f97316','Med'],['#eab308','Low']].map(([col, lbl], idx) => (
            <g key={lbl} transform={`translate(${18 + idx * 108}, 52)`}>
              <circle cx="12" cy="14" r="11" fill={col} />
              <text x="30" y="20" fill="#6b7280" fontSize="19">{lbl}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function GuardianHeatmap() {
  const [selectedThreat,    setSelectedThreat]    = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedSeverity,  setSelectedSeverity]  = useState('all');
  const [selectedRegion,    setSelectedRegion]    = useState('all');

  const [data,    setData]    = useState<HeatmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/heatmap?timeframe=${selectedTimeframe}`);
      if (res.ok) {
        setData(await res.json() as HeatmapResponse);
        setLastFetch(new Date());
      }
    } catch {
      // silently keep old data
    } finally {
      setLoading(false);
    }
  }, [selectedTimeframe]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  // Derived values with safe fallbacks
  const byType   = data?.by_type   ?? { all: 0, scam: 0, qr: 0, misinfo: 0, cyberbully: 0, deepfake: 0 };
  const byRegion = data?.by_region ?? { central: 0, north: 0, northeast: 0, east: 0, west: 0 } as Record<Region, number>;
  const stats    = data?.stats     ?? { total_reports: 0, reports_today: 0, people_protected: 0, active_threats: 0 };

  const filteredRecent = (data?.recent ?? []).filter(inc => {
    if (selectedThreat   !== 'all' && inc.threat_type !== selectedThreat)   return false;
    if (selectedSeverity !== 'all' && inc.severity    !== selectedSeverity) return false;
    if (selectedRegion   !== 'all' && inc.region      !== selectedRegion)   return false;
    return true;
  });

  // Hotspot rows for bar chart (sorted by count desc)
  const hotspots = (Object.entries(byRegion) as [Region, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([region, count]) => ({
      region: REGION_LABELS[region],
      count,
      percentage: stats.total_reports > 0 ? Math.round((count / stats.total_reports) * 100) : 0,
    }));

  const threatTypes = [
    { id: 'all',        label: 'All Threats',     icon: Shield,       color: 'text-gray-700',   count: byType.all       ?? 0 },
    { id: 'scam',       label: 'Scam Messages',   icon: MessageSquare, color: 'text-red-600',   count: byType.scam      ?? 0 },
    { id: 'qr',         label: 'Fake QR Codes',   icon: QrCode,        color: 'text-orange-600', count: byType.qr        ?? 0 },
    { id: 'misinfo',    label: 'Misinformation',  icon: Radio,         color: 'text-yellow-600', count: byType.misinfo   ?? 0 },
    { id: 'cyberbully', label: 'Cyberbullying',   icon: UserX,         color: 'text-purple-600', count: byType.cyberbully ?? 0 },
    { id: 'deepfake',   label: 'Deepfake Content',icon: Video,         color: 'text-pink-600',   count: byType.deepfake  ?? 0 },
  ];

  const THREAT_ICONS: Record<string, typeof MessageSquare> = {
    scam: MessageSquare, qr: QrCode, misinfo: Radio, cyberbully: UserX, deepfake: Video,
  };
  const THREAT_TEXT_COLORS: Record<string, string> = {
    scam: 'text-red-600', qr: 'text-orange-600', misinfo: 'text-yellow-600',
    cyberbully: 'text-purple-600', deepfake: 'text-pink-600',
  };

  const trendCards = [
    { title: 'Active Threats',   value: stats.active_threats.toLocaleString(),   change: '+12%', trend: 'up',   icon: AlertTriangle, color: 'from-red-500 to-orange-500',     bg: 'bg-red-50',     border: 'border-red-200'     },
    { title: 'Reports Today',    value: stats.reports_today.toLocaleString(),     change: '+8%',  trend: 'up',   icon: Eye,           color: 'from-blue-500 to-cyan-500',      bg: 'bg-blue-50',    border: 'border-blue-200'    },
    { title: 'Comm. Response',   value: '2.4 min',                                change: '-15%', trend: 'down', icon: Users,         color: 'from-green-500 to-emerald-500',  bg: 'bg-green-50',   border: 'border-green-200'   },
    { title: 'Threats Blocked',  value: stats.people_protected.toLocaleString(), change: '+24%', trend: 'up',   icon: Shield,        color: 'from-purple-500 to-pink-500',    bg: 'bg-purple-50',  border: 'border-purple-200'  },
  ];

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Guardian Heatmap</h1>
          <p className="text-gray-600">
            Anonymous aggregation of community reports across Singapore
            {lastFetch && (
              <span className="ml-2 text-xs text-gray-400">
                · Updated {lastFetch.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Digital Literacy Banner */}
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
              Our community is getting stronger! Singapore ranks in the top 5 globally for digital literacy.
              Together, we've protected over {(stats.people_protected + 2_000_000).toLocaleString()} people from scams this year.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Scam Detection',       pct: 92, color: 'bg-green-400'  },
              { label: 'Critical Thinking',    pct: 85, color: 'bg-blue-400'   },
              { label: 'Community Reporting',  pct: 89, color: 'bg-purple-400' },
              { label: 'Privacy Awareness',    pct: 81, color: 'bg-yellow-400' },
            ].map(b => (
              <div key={b.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{b.label}</span>
                  <span className="font-bold">{b.pct}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-3">
                  <div className={`${b.color} h-3 rounded-full`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {trendCards.map((card, i) => (
          <div key={i} className={`${card.bg} rounded-2xl p-6 border-2 ${card.border}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                card.trend === 'up' ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                {card.trend === 'up'
                  ? <TrendingUp className="w-4 h-4 text-orange-600" />
                  : <TrendingDown className="w-4 h-4 text-green-600" />}
                <span className={`text-xs font-bold ${card.trend === 'up' ? 'text-orange-600' : 'text-green-600'}`}>
                  {card.change}
                </span>
              </div>
            </div>
            {loading
              ? <Skeleton className="h-8 w-24 mb-2" />
              : <div className="text-3xl font-black text-gray-900 mb-1">{card.value}</div>
            }
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
              {threatTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThreat(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedThreat === t.id ? 'bg-red-50 border-red-300 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <t.icon className={`w-5 h-5 ${t.color}`} />
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{t.label}</span>
                  <span className="text-xs font-bold text-gray-500">{loading ? '…' : t.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Timeframe</label>
            <div className="space-y-2">
              {[['1h','Last Hour'],['24h','Last 24 Hours'],['7d','Last 7 Days'],['30d','Last 30 Days']].map(([v,lbl]) => (
                <button
                  key={v}
                  onClick={() => setSelectedTimeframe(v)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedTimeframe === v ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Severity</label>
            <div className="space-y-2">
              {([
                ['all','All Severity','bg-gray-500'],
                ['critical','Critical','bg-red-600'],
                ['high','High','bg-orange-500'],
                ['medium','Medium','bg-yellow-500'],
                ['low','Low','bg-green-500'],
              ] as [string,string,string][]).map(([v,lbl,dot]) => (
                <button
                  key={v}
                  onClick={() => setSelectedSeverity(v)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedSeverity === v ? 'bg-purple-50 border-purple-300 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${dot}`} />
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Region</label>
            <div className="space-y-2">
              {([
                ['all','All Singapore'],
                ['central','Central Region'],
                ['north','North Region'],
                ['northeast','North-East Region'],
                ['east','East Region'],
                ['west','West Region'],
              ] as [string,string][]).map(([v,lbl]) => (
                <button
                  key={v}
                  onClick={() => setSelectedRegion(v)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedRegion === v ? 'bg-green-50 border-green-300 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{lbl}</span>
                  {v !== 'all' && (
                    <span className="text-xs font-bold text-gray-500">
                      {loading ? '…' : (byRegion[v as Region] ?? 0).toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Live Threat Map</h2>
                  <p className="text-sm text-gray-600">Click a region to focus · Dots = recent reports</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Layers className="w-5 h-5" />
                <span>Heatmap View</span>
              </div>
            </div>

            {loading ? (
              <div className="relative bg-blue-50 rounded-xl border-2 border-blue-200 flex items-center justify-center" style={{ aspectRatio: '760/440' }}>
                <div className="animate-spin w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <SingaporeMap
                byRegion={byRegion}
                recent={data?.recent ?? []}
                selectedRegion={selectedRegion}
                selectedThreat={selectedThreat}
                onRegionClick={setSelectedRegion}
              />
            )}

            {/* Hotspot breakdown */}
            <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Hotspot Breakdown</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-6 w-full" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {hotspots.map((hs, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-28 font-medium text-gray-700 text-sm">{hs.region}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            hs.percentage > 25 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                            hs.percentage > 15 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                            'bg-gradient-to-r from-yellow-500 to-green-500'
                          }`}
                          style={{ width: hs.count > 0 ? `${Math.max(hs.percentage, 4)}%` : '0%' }}
                        />
                      </div>
                      <div className="w-24 text-right">
                        <span className="font-bold text-gray-900">{hs.count.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1">({hs.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-700">Live</span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : filteredRecent.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No reports match current filters.</p>
            ) : (
              <div className="space-y-3">
                {filteredRecent.slice(0, 5).map(inc => {
                  const Icon = THREAT_ICONS[inc.threat_type] ?? MessageSquare;
                  const textColor = THREAT_TEXT_COLORS[inc.threat_type] ?? 'text-gray-600';
                  return (
                    <div key={inc.id} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all">
                      <div className="flex items-start gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-gray-900">{inc.threat_label}</h4>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                              inc.severity === 'critical' ? 'bg-red-100 text-red-700' :
                              inc.severity === 'high'     ? 'bg-orange-100 text-orange-700' :
                              inc.severity === 'medium'   ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {inc.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{inc.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{inc.neighborhood}</span>
                            </div>
                            <span>{inc.time_ago}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{inc.report_count} community reports</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

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
                {loading
                  ? <Skeleton className="h-10 w-24 mx-auto mb-1" />
                  : <div className="text-4xl font-black text-purple-600 mb-1">
                      {stats.people_protected > 1_000_000
                        ? `${(stats.people_protected / 1_000_000).toFixed(1)}M`
                        : stats.people_protected.toLocaleString()}
                    </div>
                }
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

          {/* CTA */}
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
