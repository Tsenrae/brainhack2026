import { useState } from "react";

type LayerKey = "frontend" | "routing" | "features" | "ui" | "state" | "deps";

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  textColor?: string;
}

interface Layer {
  id: LayerKey;
  label: string;
  icon: string;
  description: string;
  color: string;
  borderColor: string;
  nodes: Node[];
}

const layers: Layer[] = [
  {
    id: "frontend",
    label: "Entry & Build",
    icon: "⚙️",
    description: "Vite + React 18 + TypeScript — Figma Make auto-generates the entrypoint at runtime",
    color: "bg-slate-800",
    borderColor: "border-slate-600",
    nodes: [
      { id: "entrypoint", label: "__figma__entrypoint__.ts", sublabel: "Figma Make entry (auto-generated)", color: "bg-slate-700", textColor: "text-slate-200" },
      { id: "vite", label: "Vite 6.3", sublabel: "Build tool + dev server", color: "bg-slate-700", textColor: "text-slate-200" },
      { id: "app", label: "App.tsx", sublabel: "Root component + BrowserRouter", color: "bg-indigo-700", textColor: "text-white" },
    ],
  },
  {
    id: "routing",
    label: "Routing Layer",
    icon: "🗺️",
    description: "React Router 7 — 21 client-side routes, all declarative in App.tsx",
    color: "bg-violet-950",
    borderColor: "border-violet-700",
    nodes: [
      { id: "r-landing", label: "/", sublabel: "LandingPage", color: "bg-violet-700" },
      { id: "r-auth", label: "/signin · /signup", sublabel: "Auth pages (mock)", color: "bg-violet-700" },
      { id: "r-dashboard", label: "/dashboard", sublabel: "Dashboard home", color: "bg-violet-700" },
      { id: "r-mission", label: "/mission/*", sublabel: "5 mission sub-routes", color: "bg-violet-700" },
      { id: "r-scanner", label: "/scanner · /scanner/results", sublabel: "Shield Scanner", color: "bg-violet-700" },
      { id: "r-learn", label: "/learn", sublabel: "Scenario Academy", color: "bg-violet-700" },
      { id: "r-community", label: "/community/submit", sublabel: "Community Submit", color: "bg-violet-700" },
      { id: "r-support", label: "/support/cyberbullying", sublabel: "Crisis Support", color: "bg-violet-700" },
      { id: "r-heatmap", label: "/heatmap", sublabel: "Guardian Heatmap", color: "bg-violet-700" },
      { id: "r-rankings", label: "/leaderboard · /profile", sublabel: "Rankings + Profile", color: "bg-violet-700" },
      { id: "r-admin", label: "/admin/*", sublabel: "Analytics + Video Studio", color: "bg-violet-700" },
      { id: "r-telegram", label: "/integrations/telegram", sublabel: "Telegram Bot Setup", color: "bg-violet-700" },
    ],
  },
  {
    id: "features",
    label: "Feature Modules",
    icon: "🧩",
    description: "34 React components grouped by domain — all client-side with mock data",
    color: "bg-slate-900",
    borderColor: "border-slate-600",
    nodes: [
      { id: "f-landing", label: "Landing Page", sublabel: "11 section components (Hero, Problem, CTA…)", color: "bg-blue-800" },
      { id: "f-layout", label: "Shell Layout", sublabel: "Sidebar + TopBar (shared across auth'd routes)", color: "bg-blue-800" },
      { id: "f-mission", label: "Mission Hub", sublabel: "SpotTheSpin Quiz · ChainReaction · ShieldSquad · MissionComplete", color: "bg-emerald-800" },
      { id: "f-scanner", label: "Shield Scanner", sublabel: "File / URL / Text / QR scanning + Results page", color: "bg-emerald-800" },
      { id: "f-academy", label: "Scenario Academy", sublabel: "5 categories · Video checkpoints · MCQ + confidence rating", color: "bg-emerald-800" },
      { id: "f-gamification", label: "Gamification", sublabel: "XP system · Badges · Leaderboard (Global/Squad/School)", color: "bg-amber-800" },
      { id: "f-profile", label: "User Profile", sublabel: "Badge collection · XP history · Achievement timeline", color: "bg-amber-800" },
      { id: "f-admin", label: "Admin Tools", sublabel: "Analytics dashboard (Recharts) · Video Studio", color: "bg-rose-800" },
      { id: "f-community", label: "Community", sublabel: "Report submission · Cyberbullying support (role-based)", color: "bg-orange-800" },
      { id: "f-heatmap", label: "Guardian Heatmap", sublabel: "Geographic threat visualisation · Regional insights", color: "bg-teal-800" },
      { id: "f-integrations", label: "Integrations", sublabel: "Telegram bot setup guide", color: "bg-teal-800" },
    ],
  },
  {
    id: "ui",
    label: "UI Component Library",
    icon: "🎨",
    description: "38 shadcn/ui primitives built on Radix UI for accessibility, plus custom styling",
    color: "bg-pink-950",
    borderColor: "border-pink-700",
    nodes: [
      { id: "ui-forms", label: "Forms", sublabel: "Input · Textarea · Select · Checkbox · Radio · Switch · Toggle · OTP · Calendar · Slider", color: "bg-pink-800" },
      { id: "ui-data", label: "Data Display", sublabel: "Table · Card · Badge · Avatar · Skeleton · Progress · Pagination · Chart (Recharts wrapper)", color: "bg-pink-800" },
      { id: "ui-overlays", label: "Overlays", sublabel: "Dialog · Alert-Dialog · Drawer · Dropdown · Popover · Hover-Card · Tooltip · Sheet", color: "bg-pink-800" },
      { id: "ui-layout", label: "Layout", sublabel: "Sidebar · Scroll-Area · Resizable · Separator · Accordion · Collapsible · Breadcrumb", color: "bg-pink-800" },
      { id: "ui-nav", label: "Navigation", sublabel: "Navigation-Menu · Menubar · Tabs · Carousel (Embla + react-slick)", color: "bg-pink-800" },
      { id: "ui-utils", label: "Utilities", sublabel: "Command palette (cmdk) · Toast (Sonner) · utils.ts · use-mobile.ts", color: "bg-pink-800" },
    ],
  },
  {
    id: "state",
    label: "State & Data",
    icon: "💾",
    description: "Purely local React state — no global store, no backend, no real auth",
    color: "bg-slate-900",
    borderColor: "border-slate-500",
    nodes: [
      { id: "s-hooks", label: "React Hooks", sublabel: "useState · useRef · useNavigate (all local)", color: "bg-slate-700" },
      { id: "s-mock", label: "Mock Data", sublabel: "Hardcoded quiz questions, scenarios, leaderboard entries in each component", color: "bg-slate-700" },
      { id: "s-rhf", label: "React Hook Form", sublabel: "v7.55 — form state + validation (SignIn/SignUp, CommunitySubmit)", color: "bg-slate-700" },
      { id: "s-theme", label: "Theme (next-themes)", sublabel: "Dark / light mode switching via CSS custom properties", color: "bg-slate-700" },
      { id: "s-nobackend", label: "No Backend", sublabel: "No Supabase · No REST API · No auth tokens — purely client-side", color: "bg-red-900", textColor: "text-red-200" },
    ],
  },
  {
    id: "deps",
    label: "Key Dependencies",
    icon: "📦",
    description: "Third-party libraries powering interactions, animation, charts, and icons",
    color: "bg-slate-800",
    borderColor: "border-slate-600",
    nodes: [
      { id: "d-router", label: "React Router 7", sublabel: "Client-side routing", color: "bg-slate-600" },
      { id: "d-recharts", label: "Recharts 2.15", sublabel: "Line · Bar · Pie · Radar charts in AdminAnalytics", color: "bg-slate-600" },
      { id: "d-motion", label: "Motion 12 (motion/react)", sublabel: "Page & element animations", color: "bg-slate-600" },
      { id: "d-dnd", label: "react-dnd 16", sublabel: "Drag-and-drop interactions", color: "bg-slate-600" },
      { id: "d-radix", label: "Radix UI (34 packages)", sublabel: "Accessible headless primitives backing shadcn/ui", color: "bg-slate-600" },
      { id: "d-lucide", label: "lucide-react 0.487", sublabel: "Icon library used throughout", color: "bg-slate-600" },
      { id: "d-mui", label: "@mui/material 7.3", sublabel: "Material Design components (supplemental)", color: "bg-slate-600" },
      { id: "d-confetti", label: "canvas-confetti 1.9", sublabel: "Celebration effect on mission completion", color: "bg-slate-600" },
      { id: "d-tw", label: "Tailwind CSS 4.1", sublabel: "Utility-first styling + clsx + tailwind-merge", color: "bg-slate-600" },
    ],
  },
];

const dataFlowItems = [
  { from: "Entry & Build", to: "Routing Layer", label: "App.tsx mounts BrowserRouter" },
  { from: "Routing Layer", to: "Feature Modules", label: "Route match renders component" },
  { from: "Feature Modules", to: "UI Component Library", label: "Composing Radix/shadcn primitives" },
  { from: "Feature Modules", to: "State & Data", label: "useState / useNavigate / mock data" },
  { from: "UI Component Library", to: "State & Data", label: "Form state via React Hook Form" },
];

export function ArchitectureDiagram() {
  const [activeLayer, setActiveLayer] = useState<LayerKey | null>(null);
  const [showFlow, setShowFlow] = useState(false);

  const active = activeLayer ? layers.find((l) => l.id === activeLayer) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🛡️</span>
          <h1 className="text-2xl tracking-tight text-white">ShieldVerse — Technical Architecture</h1>
        </div>
        <p className="text-slate-400 text-sm">
          React 18 + TypeScript + Vite · Tailwind CSS 4 · React Router 7 · shadcn/ui · Recharts
          <span className="ml-3 bg-emerald-900 text-emerald-300 text-xs px-2 py-0.5 rounded">Client-only · No backend</span>
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowFlow((v) => !v)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${showFlow ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-600 text-slate-400 hover:border-slate-400"}`}
          >
            {showFlow ? "▼ Hide" : "▶ Show"} Data Flow
          </button>
          {activeLayer && (
            <button
              onClick={() => setActiveLayer(null)}
              className="text-xs px-3 py-1.5 rounded border border-slate-600 text-slate-400 hover:border-slate-400 transition-colors"
            >
              ✕ Clear selection
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-3">
        {/* Data Flow panel */}
        {showFlow && (
          <div className="border border-indigo-700 bg-indigo-950 rounded-lg p-4 mb-4">
            <p className="text-indigo-300 text-xs uppercase tracking-widest mb-3">Data / Control Flow</p>
            <div className="space-y-2">
              {dataFlowItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-indigo-400 font-semibold min-w-[140px]">{item.from}</span>
                  <span className="text-slate-500">──▶</span>
                  <span className="text-emerald-400 font-semibold min-w-[160px]">{item.to}</span>
                  <span className="text-slate-500 italic">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Layer cards */}
        {layers.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <div
              key={layer.id}
              className={`rounded-lg border transition-all cursor-pointer select-none ${layer.borderColor} ${layer.color} ${isActive ? "ring-2 ring-white/30 shadow-xl" : "hover:brightness-110"}`}
              onClick={() => setActiveLayer(isActive ? null : layer.id)}
            >
              {/* Layer header */}
              <div className="flex items-center gap-3 px-5 py-3">
                <span className="text-lg">{layer.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{layer.label}</span>
                    <span className="text-slate-500 text-xs hidden sm:inline">— {layer.description}</span>
                  </div>
                </div>
                <span className="text-slate-500 text-xs">{isActive ? "▲" : "▼"} {layer.nodes.length} nodes</span>
              </div>

              {/* Node grid */}
              <div className={`px-5 pb-4 grid gap-2 transition-all ${isActive ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"}`}>
                {layer.nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`rounded px-3 py-2 ${node.color} border border-white/10`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={`text-xs font-semibold leading-snug ${node.textColor ?? "text-white"}`}>{node.label}</div>
                    {node.sublabel && isActive && (
                      <div className="text-slate-400 text-xs mt-0.5 leading-snug">{node.sublabel}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Stats footer */}
        <div className="border border-slate-700 rounded-lg p-4 bg-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {[
            { label: "Components", value: "46", sub: "34 feature + 1 shared image" },
            { label: "UI Primitives", value: "38", sub: "shadcn/ui + Radix UI" },
            { label: "Routes", value: "21", sub: "All client-side (React Router)" },
            { label: "npm Packages", value: "60+", sub: "Runtime dependencies" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-300 font-semibold">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.sub}</div>
            </div>
          ))}
        </div>

        <p className="text-slate-600 text-xs text-center pb-4">
          Click any layer to expand node details · Toggle Data Flow to see control flow between layers
        </p>
      </div>
    </div>
  );
}
