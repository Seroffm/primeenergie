import { createClient } from "@supabase/supabase-js";
import process from "node:process";

// Server-only Supabase client. Service-Role-Key umgeht RLS —
// Autorisierung erfolgt auf Anwendungsebene in den API-Routen.
export function createServiceClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "VITE_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen in .env.local gesetzt sein.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
