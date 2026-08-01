import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GitCommit } from "lucide-react";
import { api, type HealthStatus, type ChangelogEntry, type Ticket } from "../lib/api";
import TrustBadge from "../components/TrustBadge";
import UptimeRing from "../components/UptimeRing";
import ConfettiBurst from "../components/ConfettiBurst";
import { SkeletonRow } from "../components/Skeleton";

export default function Maintenance() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState(false);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [changelogError, setChangelogError] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsError, setTicketsError] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [confettiTicketId, setConfettiTicketId] = useState<string | null>(null);

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
    if (newStatus === "Resolved") {
      setConfettiTicketId(ticket.id);
      setTimeout(() => setConfettiTicketId(null), 700);
    }
    try {
      const updated = await api.updateTicketStatus(ticket.id, newStatus);
      setTickets((t) => t.map((x) => (x.id === ticket.id ? updated : x)));
    } catch {
      setTickets((t) => t.map((x) => (x.id === ticket.id ? ticket : x)));
    }
  };

  const statusStyles: Record<Ticket["status"], string> = {
    Resolved: "bg-success/10 text-success",
    "In Progress": "bg-warning/10 text-warning",
    Open: "bg-slate-100 text-slate-600",
  };

  const systemStatus = error ? "danger" : health?.status === "ok" ? "ok" : "warning";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Maintenance</h1>
          <p className="text-sm text-slate-500">Your infrastructure, transparently.</p>
        </div>
        <TrustBadge kind="maintenance" label="Live system status" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <UptimeRing status={systemStatus} />
          <div>
            <p className="text-xs font-medium text-slate-500">System Status</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {error ? "Backend offline" : health?.status === "ok" ? "All systems operational" : "Checking…"}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Uptime</p>
          <p className="mt-2 text-lg font-bold text-ink">
            {health ? `${Math.floor(health.uptimeSeconds)}s` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Last Deployed</p>
          <p className="mt-2 text-lg font-bold text-ink">
            {health ? new Date(health.lastDeployedAt).toLocaleString() : "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Support Tickets</h2>
          <TrustBadge kind="maintenance" label="Live — click a status to update it" />
        </div>

        <div className="mb-4 flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTicket()}
            placeholder="Describe an issue…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <button
            onClick={addTicket}
            disabled={creating}
            className="flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
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

        {!ticketsError && tickets.length === 0 && (
          <div className="space-y-1">
            {[1, 2].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="relative flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
              <ConfettiBurst show={confettiTicketId === t.id} />
              <div>
                <p className="text-sm font-medium text-slate-700">{t.title}</p>
                <p className="text-xs text-slate-400">
                  {t.id} · updated {new Date(t.updatedAt).toLocaleString()}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => cycleStatus(t)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[t.status]}`}
                title="Click to advance status"
              >
                {t.status}
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Changelog</h2>
          <TrustBadge kind="maintenance" label="Pulled live from GitHub" />
        </div>

        {changelogError && (
          <p className="text-sm text-slate-500">
            Couldn't reach GitHub right now — this pulls real commit history from the
            Grovance repo, not a hand-written list.
          </p>
        )}

        {!changelogError && changelog.length === 0 && (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        <ul className="space-y-3">
          <AnimatePresence>
            {changelog.map((c, i) => (
              <motion.li
                key={c.sha}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0"
              >
                <div className="flex items-start gap-2.5">
                  <GitCommit size={14} className="mt-0.5 shrink-0 text-slate-300" />
                  <div>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-slate-700 hover:text-brand hover:underline"
                    >
                      {c.message}
                    </a>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {c.author} · {c.sha}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(c.date).toLocaleDateString()}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </motion.div>
  );
}
