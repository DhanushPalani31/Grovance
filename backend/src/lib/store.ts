/**
 * Supabase-backed data layer — trimmed down to only what the current app
 * (marketing site + AI chat + leads + Automation Audit) actually needs.
 * Rules/tickets/users/dashboard-stats were removed along with the portal.
 */
import { getSupabase } from "./supabase";

export interface ActivityItem {
  id: string;
  label: string;
  source: "automation" | "ai" | "system" | "maintenance";
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

function mapActivity(row: any): ActivityItem {
  return {
    id: row.id,
    label: row.label,
    source: row.source,
    timestamp: row.created_at,
  };
}

function mapLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  };
}

export const store = {
  async logActivity(item: Omit<ActivityItem, "id" | "timestamp">): Promise<ActivityItem> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("activity_log")
      .insert({ label: item.label, source: item.source })
      .select()
      .single();
    if (error) throw error;
    return mapActivity(data);
  },

  async addLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
    const sb = getSupabase();
    const { data, error } = await sb.from("leads").insert(lead).select().single();
    if (error) throw error;
    return mapLead(data);
  },

  async listLeads(): Promise<Lead[]> {
    const sb = getSupabase();
    const { data, error } = await sb.from("leads").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapLead);
  },
};

export const serverStartedAt = new Date();
