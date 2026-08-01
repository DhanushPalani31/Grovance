import { useEffect, useState } from "react";
import { api, type Rule } from "../lib/api";
import TrustBadge from "../components/TrustBadge";

export default function AutomationCenter() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
    // optimistic update
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));
    try {
      const updated = await api.toggleRule(id);
      setRules((r) => r.map((rule) => (rule.id === id ? updated : rule)));
    } catch {
      // revert on failure
      setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Automation Center</h1>
          <p className="text-sm text-slate-500">
            Rules that run without anyone lifting a finger.
          </p>
        </div>
        <TrustBadge kind="automation" label={`${rules.filter((r) => r.enabled).length} active rules`} />
      </div>

      {error && (
        <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
          Backend not reachable — start the API server to load and toggle live rules here.
        </div>
      )}

      {loading && !error && <p className="text-sm text-slate-400">Loading rules…</p>}

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5"
          >
            <div>
              <p className="text-sm font-medium text-brand-ink">
                When: <span className="font-normal text-slate-600">{rule.trigger}</span>
              </p>
              <p className="mt-1 text-sm font-medium text-brand-ink">
                Then: <span className="font-normal text-slate-600">{rule.action}</span>
              </p>
            </div>
            <button
              onClick={() => toggle(rule.id)}
              className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
                rule.enabled ? "bg-brand-teal" : "bg-slate-200"
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
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
        Toggling a rule here calls the real backend and logs the change to the Activity
        Feed on the Dashboard — nothing here is a local-only mockup. Want a custom
        automation for your shop's specific workflow? This is exactly the kind of rule
        Grovance builds around your requirements.
      </div>
    </div>
  );
}
