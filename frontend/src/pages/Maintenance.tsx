import { useEffect, useState } from "react";
import { api, type HealthStatus } from "../lib/api";
import TrustBadge from "../components/TrustBadge";

const tickets = [
  { id: "GRV-102", title: "Update store hours for holidays", status: "Resolved", time: "2h" },
  { id: "GRV-101", title: "Add new payment method", status: "In Progress", time: "1d" },
  { id: "GRV-100", title: "Fix product image upload", status: "Resolved", time: "3d" },
];

export default function Maintenance() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getHealth()
      .then(setHealth)
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Maintenance</h1>
          <p className="text-sm text-slate-500">Your infrastructure, transparently.</p>
        </div>
        <TrustBadge kind="maintenance" label="Live system status" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">System Status</p>
          <p className="mt-2 flex items-center gap-2 text-lg font-bold text-brand-ink">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                error ? "bg-red-400" : health?.status === "ok" ? "bg-brand-teal" : "bg-amber-400"
              }`}
            />
            {error ? "Backend offline" : health?.status === "ok" ? "All systems operational" : "Checking…"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Uptime</p>
          <p className="mt-2 text-lg font-bold text-brand-ink">
            {health ? `${Math.floor(health.uptimeSeconds)}s` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Last Deployed</p>
          <p className="mt-2 text-lg font-bold text-brand-ink">
            {health ? new Date(health.lastDeployedAt).toLocaleString() : "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-brand-ink">Support Tickets</h2>
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{t.title}</p>
                <p className="text-xs text-slate-400">{t.id} · {t.time} ago</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  t.status === "Resolved"
                    ? "bg-teal-50 text-brand-teal"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
