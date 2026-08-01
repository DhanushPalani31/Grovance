/**
 * Lightweight in-memory data layer for the demo.
 *
 * This is intentionally isolated behind simple functions so swapping to a
 * real database (Postgres via `pg`, or an ORM) later only means rewriting
 * this file — nothing in routes/ needs to change.
 */

export interface ActivityItem {
  id: string;
  label: string;
  source: "automation" | "ai" | "system";
  timestamp: string;
}

const activityLog: ActivityItem[] = [
  {
    id: "1",
    label: "Sent order confirmation email to a customer",
    source: "automation",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: "2",
    label: "Low-stock alert sent for 'Ceramic Mug - Blue'",
    source: "automation",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "3",
    label: "AI Assistant answered a customer question about store hours",
    source: "ai",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "4",
    label: "Daily sales summary generated",
    source: "automation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
];

export interface Rule {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

const rules: Rule[] = [
  { id: "1", trigger: "New order placed", action: "Send confirmation email to customer", enabled: true },
  { id: "2", trigger: "Stock falls below 5 units", action: "Notify owner via WhatsApp/email", enabled: true },
  { id: "3", trigger: "Every day at 9 PM", action: "Generate daily sales summary", enabled: true },
  { id: "4", trigger: "Customer inactive for 30 days", action: "Send a personalized win-back offer", enabled: false },
  { id: "5", trigger: "Every Sunday", action: "Auto-backup shop data", enabled: true },
];

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const leads: Lead[] = [];

export const store = {
  listActivity(): ActivityItem[] {
    return [...activityLog].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
  logActivity(item: Omit<ActivityItem, "id" | "timestamp">) {
    const entry: ActivityItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    activityLog.unshift(entry);
    return entry;
  },
  addLead(lead: Omit<Lead, "id" | "createdAt">) {
    const entry: Lead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    leads.unshift(entry);
    return entry;
  },
  listLeads(): Lead[] {
    return [...leads];
  },
  listRules(): Rule[] {
    return [...rules];
  },
  toggleRule(id: string): Rule | undefined {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return undefined;
    rule.enabled = !rule.enabled;
    return rule;
  },
};

export const serverStartedAt = new Date();
