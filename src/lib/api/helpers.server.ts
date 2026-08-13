import process from "node:process";
import { createServiceClient } from "../supabase.server";

// ---------------------------------------------------------------------------
// JSON Response Helpers
// ---------------------------------------------------------------------------

export function ok<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
      Vary: "Authorization",
    },
  });
}

export function err(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
      Vary: "Authorization",
    },
  });
}

export function list<T>(data: T[], count: number, page: number, pageSize: number): Response {
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

export type AuthResult = { ok: true; user: AuthedUser } | { ok: false; response: Response };

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
  const parsedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const parsedPageSize = Number.parseInt(
    url.searchParams.get("pageSize") ?? String(defaultSize),
    10,
  );
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const pageSize = Math.min(
    200,
    Number.isFinite(parsedPageSize) ? Math.max(1, parsedPageSize) : defaultSize,
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
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return false;
  if (!token || token.startsWith("XXXX") || token === "1x0000000000000000000000000000000AA") {
    return false;
  }

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
// Lead authorization and durable public rate limiting
// ---------------------------------------------------------------------------

export async function requireLeadAccess(
  supabase: ReturnType<typeof createServiceClient>,
  user: AuthedUser,
  leadId: string,
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const { data: lead, error } = await supabase
    .from("leads")
    .select("id, assigned_to")
    .eq("id", leadId)
    .single();

  if (error || !lead) return { ok: false, response: err("Lead nicht gefunden", 404) };
  if (user.role === "employee" && lead.assigned_to !== user.userId) {
    return { ok: false, response: err("Zugriff verweigert", 403) };
  }
  return { ok: true };
}

function getClientAddress(request: Request): string {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function consumeRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowSeconds: number,
  additionalIdentifier = "",
): Promise<boolean> {
  const supabase = createServiceClient();
  const identifier = additionalIdentifier.trim().toLowerCase() || getClientAddress(request);
  const identifierHash = await sha256(identifier);
  const { data, error } = await supabase.rpc("consume_request_rate_limit", {
    p_scope: scope,
    p_identifier_hash: identifierHash,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("Rate limit error:", error);
    return false;
  }
  return data === true;
}

// ---------------------------------------------------------------------------
// Referral-Code Generierung
// ---------------------------------------------------------------------------

export function generateReferralCode(): string {
  // 8 Zeichen, keine verwechselbaren Zeichen (kein O, 0, I, 1)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(random, (value) => chars[value % chars.length]).join("");
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
  const kwh = Math.max(params.annualKwhElectricity ?? 0, params.annualKwhGas ?? 0);
  // Verbrauch: bis 40 Punkte (10.000 kWh = max)
  score += Math.min(40, Math.round((kwh / 10_000) * 40));
  if (params.hasPhone) score += 10;
  if (params.hasInvoiceRef) score += 15;
  if (params.consumptionKnown) score += 10;
  score = Math.min(100, Math.max(0, score));
  const scoreLabel: "cold" | "warm" | "hot" = score >= 80 ? "hot" : score >= 50 ? "warm" : "cold";
  return { score, scoreLabel };
}
