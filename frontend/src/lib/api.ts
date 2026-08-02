const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
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

export interface AIChatResponse {
  reply: string;
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
  competitiveInsight: string;
  tools: AuditTool[];
  grounded: boolean;
}

export const api = {
  getHealth: () => request<HealthStatus>("/api/health"),
  sendChatMessage: (message: string, persona: "brand" | "marketing" = "brand") =>
    request<AIChatResponse>("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, persona }),
    }),
  submitLead: (name: string, email: string, message: string) =>
    request<{ received: boolean; id: string }>("/api/leads", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    }),
  runAudit: (
    businessName: string,
    category: string,
    location: string,
    customNeeds: string,
    currentSetup: string[],
    email?: string
  ) =>
    request<AuditResult>("/api/audit", {
      method: "POST",
      body: JSON.stringify({ businessName, category, location, customNeeds, currentSetup, email }),
    }),
};
