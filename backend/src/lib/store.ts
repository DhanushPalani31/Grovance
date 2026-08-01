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
  source: "automation" | "ai" | "system" | "maintenance";
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
    label: "AI Assistant answered a customer question about business hours",
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

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const users: User[] = [];

export interface Rule {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  runCount: number;
}

const rules: Rule[] = [
  { id: "1", trigger: "New order placed", action: "Send confirmation email to customer", enabled: true, lastTriggeredAt: null, runCount: 0 },
  { id: "2", trigger: "Stock falls below 5 units", action: "Notify owner via WhatsApp/email", enabled: true, lastTriggeredAt: null, runCount: 0 },
  { id: "3", trigger: "Every day at 9 PM", action: "Generate daily sales summary", enabled: true, lastTriggeredAt: null, runCount: 0 },
  { id: "4", trigger: "Customer inactive for 30 days", action: "Send a personalized win-back offer", enabled: false, lastTriggeredAt: null, runCount: 0 },
  { id: "5", trigger: "Every Sunday", action: "Auto-backup brand data", enabled: true, lastTriggeredAt: null, runCount: 0 },
];

export interface Ticket {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  updatedAt: string;
}

const tickets: Ticket[] = [
  {
    id: "GRV-100",
    title: "Fix product image upload",
    status: "Resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
  },
  {
    id: "GRV-101",
    title: "Add new payment method",
    status: "In Progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "GRV-102",
    title: "Update business hours for holidays",
    status: "Resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];
let ticketCounter = 103;

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const leads: Lead[] = [];

let metrics = {
  ordersToday: 41,
  revenueToday: 2180,
  lowStockItems: 3,
};

export const store = {
  simulateOrder() {
    const orderValue = 15 + Math.round(Math.random() * 60);
    metrics.ordersToday += 1;
    metrics.revenueToday += orderValue;
    return orderValue;
  },
  getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const automationEventsToday = activityLog.filter(
      (a) => a.source === "automation" && new Date(a.timestamp) >= today
    ).length;

    return {
      ordersToday: metrics.ordersToday,
      revenueToday: metrics.revenueToday,
      lowStockItems: metrics.lowStockItems,
      newCustomersToday: leads.length, // real: derived from actual contact-form leads
      activeAutomationRules: rules.filter((r) => r.enabled).length,
      openTickets: tickets.filter((t) => t.status !== "Resolved").length,
      automationEventsToday,
    };
  },
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
  runRule(id: string): Rule | undefined {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return undefined;
    rule.lastTriggeredAt = new Date().toISOString();
    rule.runCount += 1;
    return rule;
  },
  listTickets(): Ticket[] {
    return [...tickets].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },
  createTicket(title: string): Ticket {
    const ticket: Ticket = {
      id: `GRV-${ticketCounter++}`,
      title,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tickets.push(ticket);
    return ticket;
  },
  updateTicketStatus(id: string, status: Ticket["status"]): Ticket | undefined {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return undefined;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  },
  findUserByEmail(email: string): User | undefined {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  },
  createUser(user: Omit<User, "id" | "createdAt">): User {
    const entry: User = { ...user, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    users.push(entry);
    return entry;
  },
};

export const serverStartedAt = new Date();
