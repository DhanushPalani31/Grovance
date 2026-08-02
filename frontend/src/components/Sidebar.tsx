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
import { useAuth } from "../lib/AuthContext";
import Avatar from "./Avatar";

const links = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/automation", label: "Automation Center", icon: Zap },
  { to: "/portal/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/portal/content-studio", label: "Content Studio", icon: PenSquare },
  { to: "/portal/insights", label: "Insights", icon: LineChart },
  { to: "/portal/maintenance", label: "Maintenance", icon: ShieldCheck },
  { to: "/portal/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
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
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-lg bg-gradient-to-br from-brand to-accent p-4 text-xs text-white">
        <p className="font-semibold">This demo runs on Grovance</p>
        <p className="mt-1 text-white/80">
          Every widget here is a real Grovance service — automation, AI, and
          maintenance — not a mockup.
        </p>
        <p className="mt-2 flex items-center gap-1 text-white/70">
          Press <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">⌘K</kbd> to jump anywhere
        </p>
      </div>
      {user && (
        <Link
          to="/portal/settings"
          onClick={onNavigate}
          className="flex items-center gap-2.5 border-t border-slate-100 px-4 py-3 hover:bg-slate-50"
        >
          <Avatar name={user.name} size={32} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </Link>
      )}
    </aside>
  );
}
