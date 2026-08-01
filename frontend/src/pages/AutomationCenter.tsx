import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import { api, type Rule } from "../lib/api";
import { useToast } from "../lib/ToastContext";
import TrustBadge from "../components/TrustBadge";

export default function AutomationCenter() {
  const { showToast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);

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
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));
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

      {error && (
        <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
          Backend not reachable — start the API server to load and trigger live rules
          here.
        </div>
      )}

      {loading && !error && <p className="text-sm text-slate-400">Loading rules…</p>}

      <div className="space-y-3">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">
                  When: <span className="font-normal text-slate-600">{rule.trigger}</span>
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  Then: <span className="font-normal text-slate-600">{rule.action}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => runNow(rule)}
                  disabled={runningId === rule.id}
                  className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 disabled:opacity-50"
                >
                  <Play size={12} />
                  {runningId === rule.id ? "Running…" : "Run now"}
                </button>
                <button
                  onClick={() => toggle(rule.id)}
                  className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
                    rule.enabled ? "bg-success" : "bg-slate-200"
                  }`}
                  aria-label="Toggle rule"
                >
                  <span
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
        Hit "Run now" on any rule, then check the Dashboard's Activity Feed — you'll see
        the exact same event appear there in real time. Toggling or running a rule here
        calls the real backend; nothing on this page is a local-only mockup. Want a
        custom automation for your brand's specific workflow? This is exactly the kind
        of rule Grovance builds around your requirements.
      </div>
    </div>
  );
}
