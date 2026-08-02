import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, ArrowRight } from "lucide-react";
import { api, type Rule } from "../lib/api";
import { useToast } from "../lib/ToastContext";
import TrustBadge from "../components/TrustBadge";
import ConfettiBurst from "../components/ConfettiBurst";
import { SkeletonRow } from "../components/Skeleton";

export default function AutomationCenter() {
  const { showToast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [firedId, setFiredId] = useState<string | null>(null);
  const [confettiId, setConfettiId] = useState<string | null>(null);

  useEffect(() => {
    api
      .getRules()
      .then((r) => {
        setRules(r);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const toggle = async (id: string) => {
    const wasEnabled = rules.find((r) => r.id === id)?.enabled;
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));
    if (!wasEnabled) {
      setConfettiId(id);
      setTimeout(() => setConfettiId(null), 700);
    }
    try {
      const updated = await api.toggleRule(id);
      setRules((r) => r.map((rule) => (rule.id === id ? updated : rule)));
    } catch {
      setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));
      showToast("Couldn't reach the backend to toggle this rule", "error");
    }
  };

  const runNow = async (rule: Rule) => {
    setRunningId(rule.id);
    try {
      const res = await api.runRule(rule.id);
      setRules((r) => r.map((x) => (x.id === rule.id ? res.rule : x)));
      showToast(`Fired: ${rule.action}`, "success");
      setFiredId(rule.id);
      setTimeout(() => setFiredId(null), 1200);
    } catch {
      showToast("Couldn't reach the backend to run this rule", "error");
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Automation Center</h1>
          <p className="text-sm text-slate-500">
            Rules that run without anyone lifting a finger — click "Run now" to see
            proof, live.
          </p>
        </div>
        <TrustBadge kind="automation" label={`${rules.filter((r) => r.enabled).length} active rules`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-4"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
        </span>
        <p className="text-sm text-slate-700">
          <strong className="font-semibold text-ink">This is a live control panel, not a mockup.</strong>{" "}
          Toggling a rule or clicking "Run now" changes real backend data — check the
          Dashboard's Activity Feed right after and you'll see the same event appear there.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
          Backend not reachable — start the API server to load and trigger live rules
          here.
        </div>
      )}

      {loading && !error && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <ConfettiBurst show={confettiId === rule.id} />

            <div className="flex items-center justify-between gap-4">
              {/* Visual flow: trigger -> arrow -> action, with a pulse traveling the arrow on fire */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Trigger</p>
                  <p className="truncate text-sm font-medium text-ink">{rule.trigger}</p>
                </div>

                <div className="relative w-8 shrink-0">
                  <ArrowRight size={16} className="text-slate-300" />
                  <AnimatePresence>
                    {firedId === rule.id && (
                      <motion.span
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-success"
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="min-w-0 rounded-lg bg-info/5 px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-info/70">Action</p>
                  <p className="truncate text-sm font-medium text-ink">{rule.action}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => runNow(rule)}
                  disabled={runningId === rule.id}
                  className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 disabled:opacity-50"
                >
                  <Play size={12} />
                  {runningId === rule.id ? "Running…" : "Run now"}
                </motion.button>
                <button
                  onClick={() => toggle(rule.id)}
                  className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
                    rule.enabled ? "bg-success" : "bg-slate-200"
                  }`}
                  aria-label="Toggle rule"
                >
                  <motion.span
                    layout
                    className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                      rule.enabled ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {(rule.lastTriggeredAt || rule.runCount > 0) && (
              <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-400">
                <Clock size={12} />
                Last ran {rule.lastTriggeredAt ? new Date(rule.lastTriggeredAt).toLocaleString() : "never"}
                {rule.runCount > 0 && <span className="ml-1">· {rule.runCount} run{rule.runCount === 1 ? "" : "s"} total</span>}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
        Want a custom automation for your brand's specific workflow? This is exactly the
        kind of rule Grovance builds around your requirements.
      </div>
    </div>
  );
}
