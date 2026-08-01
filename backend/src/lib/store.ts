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
};

export const serverStartedAt = new Date();
