import { useEffect, useState } from "react";
import { api, type ActivityItem } from "../lib/api";
import TrustBadge from "../components/TrustBadge";

const stats = [
  { label: "Today's Orders", value: "48", change: "+12%" },
  { label: "Revenue", value: "$2,340", change: "+8%" },
  { label: "Low Stock Items", value: "3", change: "-2" },
  { label: "New Customers", value: "6", change: "+3" },
];

export default function Dashboard() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getActivity()
      .then(setActivity)
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Demo workspace for "The Corner Store"
          </p>
        </div>
        <TrustBadge kind="automation" label="Auto-refreshed every 5 min" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-ink">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-brand-teal">{s.change} this week</p>
          </div>
        ))}
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
