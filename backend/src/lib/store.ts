/**
 * Supabase-backed data layer. Every function here is now async (real network
 * calls to Postgres), which is the main thing that changed for callers —
 * every route using `store.*` needs to `await` it now.
 */
import { getSupabase } from "./supabase";

export interface ActivityItem {
  id: string;
  label: string;
  source: "automation" | "ai" | "system" | "maintenance";
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  createdAt: string;
}

export interface Rule {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  runCount: number;
}

export interface Ticket {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

function mapRule(row: any): Rule {
  return {
    id: row.id,
    trigger: row.trigger_text,
    action: row.action_text,
    enabled: row.enabled,
    lastTriggeredAt: row.last_triggered_at,
    runCount: row.run_count,
  };
}

function mapTicket(row: any): Ticket {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    googleId: row.google_id,
    createdAt: row.created_at,
  };
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
  async simulateOrder(): Promise<number> {
    const sb = getSupabase();
    const orderValue = 15 + Math.round(Math.random() * 60);
    const { error } = await sb.rpc("simulate_order", { order_value: orderValue });
    if (error) throw error;
    return orderValue;
  },

  async getDashboardStats() {
    const sb = getSupabase();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [metricsRes, leadsRes, rulesRes, ticketsRes, automationEventsRes] = await Promise.all([
      sb.from("metrics").select("*").eq("id", true).single(),
      sb.from("leads").select("id", { count: "exact", head: true }),
      sb.from("rules").select("enabled"),
      sb.from("tickets").select("status"),
      sb
        .from("activity_log")
        .select("id", { count: "exact", head: true })
        .eq("source", "automation")
        .gte("created_at", startOfToday.toISOString()),
    ]);

    if (metricsRes.error) throw metricsRes.error;

    const rules = rulesRes.data || [];
    const tickets = ticketsRes.data || [];

    return {
      ordersToday: metricsRes.data.orders_today,
      revenueToday: metricsRes.data.revenue_today,
      lowStockItems: metricsRes.data.low_stock_items,
      newCustomersToday: leadsRes.count || 0,
      activeAutomationRules: rules.filter((r: any) => r.enabled).length,
      openTickets: tickets.filter((t: any) => t.status !== "Resolved").length,
      automationEventsToday: automationEventsRes.count || 0,
    };
  },

  async listActivity(): Promise<ActivityItem[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data || []).map(mapActivity);
  },

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

  async listRules(): Promise<Rule[]> {
    const sb = getSupabase();
    const { data, error } = await sb.from("rules").select("*").order("id");
    if (error) throw error;
    return (data || []).map(mapRule);
  },

  async toggleRule(id: string): Promise<Rule | undefined> {
    const sb = getSupabase();
    const { data: current } = await sb.from("rules").select("enabled").eq("id", id).single();
    if (!current) return undefined;
    const { data, error } = await sb
      .from("rules")
      .update({ enabled: !current.enabled })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapRule(data);
  },

  async runRule(id: string): Promise<Rule | undefined> {
    const sb = getSupabase();
    const { data: current } = await sb.from("rules").select("run_count").eq("id", id).single();
    if (!current) return undefined;
    const { data, error } = await sb
      .from("rules")
      .update({ last_triggered_at: new Date().toISOString(), run_count: current.run_count + 1 })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapRule(data);
  },

  async listTickets(): Promise<Ticket[]> {
    const sb = getSupabase();
    const { data, error } = await sb.from("tickets").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapTicket);
  },

  async createTicket(title: string): Promise<Ticket> {
    const sb = getSupabase();
    const { data: num, error: rpcError } = await sb.rpc("next_ticket_number");
    if (rpcError) throw rpcError;
    const id = `GRV-${num}`;
    const { data, error } = await sb
      .from("tickets")
      .insert({ id, title, status: "Open" })
      .select()
      .single();
    if (error) throw error;
    return mapTicket(data);
  },

  async updateTicketStatus(id: string, status: Ticket["status"]): Promise<Ticket | undefined> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return undefined;
    return mapTicket(data);
  },

  async findUserByEmail(email: string): Promise<User | undefined> {
    const sb = getSupabase();
    const { data } = await sb.from("users").select("*").ilike("email", email).maybeSingle();
    return data ? mapUser(data) : undefined;
  },

  async findUserById(id: string): Promise<User | undefined> {
    const sb = getSupabase();
    const { data } = await sb.from("users").select("*").eq("id", id).maybeSingle();
    return data ? mapUser(data) : undefined;
  },

  async createUser(
    user: Omit<User, "id" | "createdAt" | "googleId"> & { googleId?: string | null }
  ): Promise<User> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("users")
      .insert({
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        google_id: user.googleId ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return mapUser(data);
  },

  async findOrCreateGoogleUser(
    googleId: string,
    email: string,
    name: string
  ): Promise<{ user: User; created: boolean }> {
    const sb = getSupabase();

    const { data: byGoogleId } = await sb.from("users").select("*").eq("google_id", googleId).maybeSingle();
    if (byGoogleId) return { user: mapUser(byGoogleId), created: false };

    const { data: byEmail } = await sb.from("users").select("*").ilike("email", email).maybeSingle();
    if (byEmail) {
      const { data: updated, error } = await sb
        .from("users")
        .update({ google_id: googleId })
        .eq("id", byEmail.id)
        .select()
        .single();
      if (error) throw error;
      return { user: mapUser(updated), created: false };
    }

    const { data: created, error } = await sb
      .from("users")
      .insert({ name, email, password_hash: null, google_id: googleId })
      .select()
      .single();
    if (error) throw error;
    return { user: mapUser(created), created: true };
  },
};

export const serverStartedAt = new Date();
