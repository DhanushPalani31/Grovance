import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Bot,
  PenSquare,
  LineChart,
  ShieldCheck,
  Settings as SettingsIcon,
  ArrowLeft,
} from "lucide-react";

const links = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/automation", label: "Automation Center", icon: Zap },
  { to: "/portal/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/portal/content-studio", label: "Content Studio", icon: PenSquare },
  { to: "/portal/insights", label: "Insights", icon: LineChart },
  { to: "/portal/maintenance", label: "Maintenance", icon: ShieldCheck },
  { to: "/portal/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-6 py-5">
        <img src="/logo.svg" alt="Grovance" className="h-8 w-auto" />
      </div>
      <Link
        to="/"
        className="mx-3 mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
      >
        <ArrowLeft size={14} />
        Back to site
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-indigo/10 text-brand-indigo"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-teal p-4 text-xs text-white">
        <p className="font-semibold">This demo runs on Grovance</p>
        <p className="mt-1 text-white/80">
          Every widget here is a real Grovance service — automation, AI, and
          maintenance — not a mockup.
        </p>
      </div>
    </aside>
  );
}
