import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type ActivityItem, type DashboardStats } from "../lib/api";
import TrustBadge from "../components/TrustBadge";

export default function Dashboard() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    api.getActivity().then(setActivity).catch(() => setError(true));
    api.getStats().then(setStats).catch(() => setError(true));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000); // refresh every minute — genuinely live
    return () => clearInterval(interval);
  }, []);

  const statCards = stats
    ? [
        { label: "Today's Orders", value: stats.ordersToday.toString() },
        { label: "Revenue", value: `$${stats.revenueToday.toLocaleString()}` },
        { label: "Low Stock Items", value: stats.lowStockItems.toString() },
        { label: "New Leads", value: stats.newCustomersToday.toString() },
      ]
    : [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Demo workspace for "The Corner Store"
          </p>
        </div>
        <TrustBadge kind="automation" label="Auto-refreshed every minute" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-ink">{s.value}</p>
          </motion.div>
        ))}
        {!stats && !error && (
          <p className="col-span-4 text-sm text-slate-400">Loading live stats…</p>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-brand-ink">Live Activity Feed</h2>
          <TrustBadge kind="automation" label="Powered by Automation Center" />
        </div>

        {error && (
          <p className="text-sm text-slate-500">
            Backend not reachable yet — start the API server to see live activity here.
          </p>
        )}

        {!error && activity.length === 0 && (
          <p className="text-sm text-slate-400">Loading activity…</p>
        )}

        <ul className="space-y-3">
          {activity.map((item) => (
            <li key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className="text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
