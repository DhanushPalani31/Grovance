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

export const api = {
  getHealth: () => request<HealthStatus>("/api/health"),
  getActivity: () => request<ActivityItem[]>("/api/automation/activity"),
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
  submitLead: (name: string, email: string, message: string) =>
    request<{ received: boolean; id: string }>("/api/leads", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    }),
};
