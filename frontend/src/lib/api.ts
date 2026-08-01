const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
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

export const api = {
  getHealth: () => request<HealthStatus>("/api/health"),
  getActivity: () => request<ActivityItem[]>("/api/automation/activity"),
  getRules: () => request<Rule[]>("/api/automation/rules"),
  toggleRule: (id: string) =>
    request<Rule>(`/api/automation/rules/${id}/toggle`, { method: "POST" }),
  getChangelog: () => request<ChangelogEntry[]>("/api/changelog"),
  getTickets: () => request<Ticket[]>("/api/tickets"),
  createTicket: (title: string) =>
    request<Ticket>("/api/tickets", { method: "POST", body: JSON.stringify({ title }) }),
  updateTicketStatus: (id: string, status: Ticket["status"]) =>
    request<Ticket>(`/api/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  sendChatMessage: (message: string, persona: "shop" | "marketing" = "shop") =>
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
};
