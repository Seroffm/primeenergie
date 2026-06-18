import process from "node:process";
import { createServiceClient } from "../supabase.server";

// ---------------------------------------------------------------------------
// JSON Response Helpers
// ---------------------------------------------------------------------------

export function ok<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function err(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function list<T>(
  data: T[],
  count: number,
  page: number,
  pageSize: number,
): Response {
  return ok({ data, count, page, pageSize });
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface AuthedUser {
  userId: string;
  profileId: string;
  role: "employee" | "manager" | "admin";
  fullName: string;
  email: string;
}

export type AuthResult =
  | { ok: true; user: AuthedUser }
  | { ok: false; response: Response };

export async function requireAuth(request: Request): Promise<AuthResult> {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { ok: false, response: err("Unauthorized", 401) };

  const supabase = createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return { ok: false, response: err("Unauthorized", 401) };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, is_active")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    return { ok: false, response: err("Profil nicht gefunden", 404) };
  }
  if (!profile.is_active) {
    return { ok: false, response: err("Konto deaktiviert", 403) };
  }

  return {
    ok: true,
    user: {
      userId: user.id,
      profileId: profile.id as string,
      role: profile.role as AuthedUser["role"],
      fullName: profile.full_name as string,
      email: profile.email as string,
    },
  };
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export function getPagination(request: Request, defaultSize = 20) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    200,
    Math.max(1, parseInt(url.searchParams.get("pageSize") ?? String(defaultSize), 10)),
  );
  return {
    page,
    pageSize,
    from: (page - 1) * pageSize,
    to: (page - 1) * pageSize + pageSize - 1,
  };
}

// ---------------------------------------------------------------------------
// Cloudflare Turnstile
// ---------------------------------------------------------------------------

export async function verifyTurnstile(token: string): Promise<boolean> {
  // Cloudflare always-pass Test-Token
  if (!token || token.startsWith("XXXX") || token === "1x0000000000000000000000000000000AA") {
    return true;
  }
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Dev-Modus: Verifizierung überspringen

  try {
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    const data = (await resp.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Referral-Code Generierung
// ---------------------------------------------------------------------------

export function generateReferralCode(): string {
  // 8 Zeichen, keine verwechselbaren Zeichen (kein O, 0, I, 1)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ---------------------------------------------------------------------------
// Lead-Score Berechnung (Initial)
// ---------------------------------------------------------------------------

export function computeScore(params: {
  annualKwhElectricity?: number | null;
  annualKwhGas?: number | null;
  hasPhone: boolean;
  hasInvoiceRef: boolean;
  consumptionKnown?: boolean | null;
}): { score: number; scoreLabel: "cold" | "warm" | "hot" } {
  let score = 15; // Basis-Score
  const kwh = Math.max(
    params.annualKwhElectricity ?? 0,
    params.annualKwhGas ?? 0,
  );
  // Verbrauch: bis 40 Punkte (10.000 kWh = max)
  score += Math.min(40, Math.round((kwh / 10_000) * 40));
  if (params.hasPhone) score += 10;
  if (params.hasInvoiceRef) score += 15;
  if (params.consumptionKnown) score += 10;
  score = Math.min(100, Math.max(0, score));
  const scoreLabel: "cold" | "warm" | "hot" =
    score >= 80 ? "hot" : score >= 50 ? "warm" : "cold";
  return { score, scoreLabel };
}
