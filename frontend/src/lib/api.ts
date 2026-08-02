const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const TOKEN_KEY = "grovance_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface HealthStatus {
  status: "ok" | "degraded";
  uptimeSeconds: number;
  lastDeployedAt: string;
  environment: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  source: "automation" | "ai" | "system";
  timestamp: string;
}

export interface AIChatResponse {
  reply: string;
}

export interface Rule {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  runCount: number;
}

export interface InsightsResponse {
  summary: string;
  generatedAt: string;
}

export interface ChangelogEntry {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface Ticket {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  lowStockItems: number;
  newCustomersToday: number;
  activeAutomationRules: number;
  openTickets: number;
  automationEventsToday: number;
}

export interface AuditTool {
  name: string;
  when: string;
  then: string;
  why: string;
}

export interface AuditResult {
  tagline: string;
  painPoints: string[];
  tools: AuditTool[];
}

export const api = {
  getHealth: () => request<HealthStatus>("/api/health"),
  getActivity: () => request<ActivityItem[]>("/api/automation/activity"),
  getRules: () => request<Rule[]>("/api/automation/rules"),
  toggleRule: (id: string) =>
    request<Rule>(`/api/automation/rules/${id}/toggle`, { method: "POST" }),
  runRule: (id: string) =>
    request<{ rule: Rule; activity: ActivityItem }>(`/api/automation/rules/${id}/run`, {
      method: "POST",
    }),
  getStats: () => request<DashboardStats>("/api/automation/stats"),
  getChangelog: () => request<ChangelogEntry[]>("/api/changelog"),
  getTickets: () => request<Ticket[]>("/api/tickets"),
  createTicket: (title: string) =>
    request<Ticket>("/api/tickets", { method: "POST", body: JSON.stringify({ title }) }),
  updateTicketStatus: (id: string, status: Ticket["status"]) =>
    request<Ticket>(`/api/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  loginWithGoogle: (credential: string) =>
    request<{ token: string; user: AuthUser }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    }),
  me: () => request<AuthUser>("/api/auth/me"),
  sendChatMessage: (message: string, persona: "brand" | "marketing" = "brand") =>
    request<AIChatResponse>("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, persona }),
    }),
  generateContent: (prompt: string, kind: string) =>
    request<{ result: string }>("/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, kind }),
    }),
  generateInsights: () =>
    request<InsightsResponse>("/api/ai/insights", { method: "POST" }),
  submitLead: (name: string, email: string, message: string) =>
    request<{ received: boolean; id: string }>("/api/leads", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    }),
  runAudit: (businessName: string, category: string, currentSetup: string[], email?: string) =>
    request<AuditResult>("/api/audit", {
      method: "POST",
      body: JSON.stringify({ businessName, category, currentSetup, email }),
    }),
};
