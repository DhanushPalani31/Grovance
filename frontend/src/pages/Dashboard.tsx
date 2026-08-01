import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, DollarSign, PackageX, UserPlus } from "lucide-react";
import { api, type ActivityItem, type DashboardStats } from "../lib/api";
import TrustBadge from "../components/TrustBadge";
import AnimatedNumber from "../components/AnimatedNumber";
import Sparkline from "../components/Sparkline";
import { SkeletonCard, SkeletonRow } from "../components/Skeleton";

export default function Dashboard() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const seenIds = useRef<Set<string>>(new Set());
  const history = useRef<{ orders: number[]; revenue: number[] }>({ orders: [], revenue: [] });

  const load = () => {
    api
      .getActivity()
      .then((items) => {
        const freshIds = items.filter((i) => !seenIds.current.has(i.id)).map((i) => i.id);
        if (freshIds.length && seenIds.current.size > 0) {
          setNewIds(new Set(freshIds));
          setTimeout(() => setNewIds(new Set()), 2500);
        }
        items.forEach((i) => seenIds.current.add(i.id));
        setActivity(items);
      })
      .catch(() => setError(true));

    api
      .getStats()
      .then((s) => {
        history.current.orders = [...history.current.orders.slice(-9), s.ordersToday];
        history.current.revenue = [...history.current.revenue.slice(-9), s.revenueToday];
        setStats(s);
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000); // refresh every minute — genuinely live
    return () => clearInterval(interval);
  }, []);

  const statCards = stats
    ? [
        { label: "Today's Orders", value: stats.ordersToday, icon: ShoppingCart, prefix: "", trend: history.current.orders },
        { label: "Revenue", value: stats.revenueToday, icon: DollarSign, prefix: "$", trend: history.current.revenue },
        { label: "Low Stock Items", value: stats.lowStockItems, icon: PackageX, prefix: "", trend: [] },
        { label: "New Leads", value: stats.newCustomersToday, icon: UserPlus, prefix: "", trend: [] },
      ]
    : [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Demo workspace for "Aurora &amp; Co."
          </p>
        </div>
        <TrustBadge kind="automation" label="Auto-refreshed every minute" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {!stats && !error && [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}

        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <s.icon size={18} />
              </div>
              {s.trend.length > 1 && <Sparkline points={s.trend} />}
            </div>
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">
              <AnimatedNumber value={s.value} prefix={s.prefix} />
            </p>
          </motion.div>
        ))}
      </div>

      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center gap-2 text-xs text-slate-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {stats.activeAutomationRules} automation rules active · {stats.automationEventsToday} automation events today · {stats.openTickets} open tickets
        </motion.div>
      )}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Live Activity Feed</h2>
          <TrustBadge kind="automation" label="Powered by Automation Center" />
        </div>

        {error && (
          <p className="text-sm text-slate-500">
            Backend not reachable yet — start the API server to see live activity here.
          </p>
        )}

        {!error && activity.length === 0 && (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        <ul className="space-y-1">
          <AnimatePresence initial={false}>
            {activity.slice(0, 12).map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center justify-between border-b border-l-2 border-slate-100 py-3 pl-3 -ml-3 last:border-b-0 transition-colors duration-700 ${
                  newIds.has(item.id) ? "border-l-success bg-success/5" : "border-l-transparent"
                }`}
              >
                <span className="text-sm text-slate-700">{item.label}</span>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
