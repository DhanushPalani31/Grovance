import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SECRET_KEY must be set in backend/.env — see .env.example"
    );
  }

  // The secret key bypasses Row Level Security — this client must only ever
  // be used server-side (it already is; this file lives in the backend only).
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
