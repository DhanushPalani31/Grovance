import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, type HealthStatus, type ChangelogEntry, type Ticket } from "../lib/api";
import TrustBadge from "../components/TrustBadge";

export default function Maintenance() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState(false);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [changelogError, setChangelogError] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsError, setTicketsError] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => setError(true));
    api.getChangelog().then(setChangelog).catch(() => setChangelogError(true));
    api.getTickets().then(setTickets).catch(() => setTicketsError(true));
  }, []);

  const addTicket = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const ticket = await api.createTicket(newTitle);
      setTickets((t) => [ticket, ...t]);
      setNewTitle("");
    } catch {
      setTicketsError(true);
    } finally {
      setCreating(false);
    }
  };

  const cycleStatus = async (ticket: Ticket) => {
    const next: Record<Ticket["status"], Ticket["status"]> = {
      Open: "In Progress",
      "In Progress": "Resolved",
      Resolved: "Open",
    };
    const newStatus = next[ticket.status];
    setTickets((t) => t.map((x) => (x.id === ticket.id ? { ...x, status: newStatus } : x)));
    try {
      const updated = await api.updateTicketStatus(ticket.id, newStatus);
      setTickets((t) => t.map((x) => (x.id === ticket.id ? updated : x)));
    } catch {
      setTickets((t) => t.map((x) => (x.id === ticket.id ? ticket : x)));
    }
  };

  const statusStyles: Record<Ticket["status"], string> = {
    Resolved: "bg-teal-50 text-brand-teal",
    "In Progress": "bg-amber-50 text-amber-700",
    Open: "bg-slate-100 text-slate-600",
  };

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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-brand-ink">Support Tickets</h2>
          <TrustBadge kind="maintenance" label="Live — click a status to update it" />
        </div>

        <div className="mb-4 flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTicket()}
            placeholder="Describe an issue…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-indigo focus:outline-none"
          />
          <button
            onClick={addTicket}
            disabled={creating}
            className="flex items-center gap-1 rounded-lg bg-brand-indigo px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus size={14} />
            {creating ? "Adding…" : "Open ticket"}
          </button>
        </div>

        {ticketsError && (
          <p className="text-sm text-slate-500">
            Backend not reachable — tickets are created and updated server-side, not
            stored locally.
          </p>
        )}

        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{t.title}</p>
                <p className="text-xs text-slate-400">
                  {t.id} · updated {new Date(t.updatedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => cycleStatus(t)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[t.status]}`}
                title="Click to advance status"
              >
                {t.status}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-brand-ink">Changelog</h2>
          <TrustBadge kind="maintenance" label="Pulled live from GitHub" />
        </div>

        {changelogError && (
          <p className="text-sm text-slate-500">
            Couldn't reach GitHub right now — this pulls real commit history from the
            Grovance repo, not a hand-written list.
          </p>
        )}

        {!changelogError && changelog.length === 0 && (
          <p className="text-sm text-slate-400">Loading recent updates…</p>
        )}

        <ul className="space-y-3">
          {changelog.map((c) => (
            <li key={c.sha} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
              <div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-slate-700 hover:text-brand-indigo hover:underline"
                >
                  {c.message}
                </a>
                <p className="mt-0.5 text-xs text-slate-400">
                  {c.author} · {c.sha}
                </p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {new Date(c.date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
