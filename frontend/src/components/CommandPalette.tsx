import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Zap,
  Bot,
  PenSquare,
  LineChart,
  ShieldCheck,
  Settings as SettingsIcon,
  Home,
} from "lucide-react";
import { api } from "../lib/api";

interface Item {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Home;
  action: () => void;
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dynamicItems, setDynamicItems] = useState<Item[]>([]);

  const staticItems: Item[] = [
    { id: "home", label: "Home", icon: Home, action: () => navigate("/") },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, action: () => navigate("/portal") },
    { id: "automation", label: "Automation Center", icon: Zap, action: () => navigate("/portal/automation") },
    { id: "ai", label: "AI Assistant", icon: Bot, action: () => navigate("/portal/ai-assistant") },
    { id: "content", label: "Content Studio", icon: PenSquare, action: () => navigate("/portal/content-studio") },
    { id: "insights", label: "Insights", icon: LineChart, action: () => navigate("/portal/insights") },
    { id: "maintenance", label: "Maintenance", icon: ShieldCheck, action: () => navigate("/portal/maintenance") },
    { id: "settings", label: "Settings", icon: SettingsIcon, action: () => navigate("/portal/settings") },
  ];

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    api
      .getRules()
      .then((rules) =>
        setDynamicItems(
          rules.map((r) => ({
            id: `rule-${r.id}`,
            label: `Run: ${r.trigger}`,
            hint: "Automation rule",
            icon: Zap,
            action: () => navigate("/portal/automation"),
          }))
        )
      )
      .catch(() => setDynamicItems([]));
  }, [open, navigate]);

  const allItems = [...staticItems, ...dynamicItems];
  const filtered = allItems.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 pt-24 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
              <Search size={16} className="text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a page or rule…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
                esc
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-slate-400">No matches</p>
              )}
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    close();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-brand/5"
                >
                  <item.icon size={15} className="text-brand" />
                  {item.label}
                  {item.hint && <span className="ml-auto text-xs text-slate-400">{item.hint}</span>}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
