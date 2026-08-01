import { useState } from "react";
import TrustBadge from "../components/TrustBadge";

interface Rule {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

const initialRules: Rule[] = [
  { id: "1", trigger: "New order placed", action: "Send confirmation email to customer", enabled: true },
  { id: "2", trigger: "Stock falls below 5 units", action: "Notify owner via WhatsApp/email", enabled: true },
  { id: "3", trigger: "Every day at 9 PM", action: "Generate daily sales summary", enabled: true },
  { id: "4", trigger: "Customer inactive for 30 days", action: "Send a personalized win-back offer", enabled: false },
  { id: "5", trigger: "Every Sunday", action: "Auto-backup shop data", enabled: true },
];

export default function AutomationCenter() {
  const [rules, setRules] = useState(initialRules);

  const toggle = (id: string) =>
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));

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
        Want a custom automation for your shop's specific workflow? This is exactly the
        kind of rule Grovance builds around your requirements — this list is editable
        by our team, live, without touching your storefront.
      </div>
    </div>
  );
}
