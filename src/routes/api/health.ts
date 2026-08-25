import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "node:crypto";
import process from "node:process";
import { getEmailReadiness, sendEmail } from "@/lib/email.server";
import { createServiceClient } from "@/lib/supabase.server";

type CheckStatus = "ok" | "error";

function isAuthorized(request: Request): boolean {
  const expected = process.env.OPS_HEALTH_SECRET?.trim();
  const supplied = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

function response(
  status: "ok" | "degraded",
  checks: { api: CheckStatus; database: CheckStatus; email: CheckStatus },
): Response {
  return new Response(
    JSON.stringify({ status, checks, checkedAt: new Date().toISOString() }),
    {
      status: status === "ok" ? 200 : 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
}

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const checks: { api: CheckStatus; database: CheckStatus; email: CheckStatus } = {
          api: "ok",
          database: "error",
          email: getEmailReadiness().ok ? "ok" : "error",
        };

        try {
          const supabase = createServiceClient();
          const { error } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true });
          checks.database = error ? "error" : "ok";
        } catch {
          checks.database = "error";
        }

        const healthy = Object.values(checks).every((check) => check === "ok");
        if (!healthy) {
          console.error(JSON.stringify({ event: "health_check_degraded", checks }));
        }
        return response(healthy ? "ok" : "degraded", checks);
      },
      POST: async ({ request }: { request: Request }) => {
        if (!isAuthorized(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }

        const recipient = process.env.NOTIFICATION_EMAIL?.trim();
        if (!recipient || !getEmailReadiness().ok) {
          return new Response(JSON.stringify({ status: "degraded" }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }

        const hour = new Date().toISOString().slice(0, 13);
        try {
          const result = await sendEmail({
            to: recipient,
            subject: "PRIME ENERGIE Betriebsprüfung erfolgreich",
            html: "<p>Der geschützte PRIME ENERGIE Mail Healthcheck wurde erfolgreich ausgeführt.</p>",
            idempotencyKey: `prime-health-${hour}`,
          });
          return new Response(
            JSON.stringify({ status: "ok", accepted: !result.skipped, attempts: result.attempts }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
            },
          );
        } catch (error) {
          console.error(
            JSON.stringify({
              event: "email_health_check_failed",
              errorType: error instanceof Error ? error.name : "UnknownError",
            }),
          );
          return new Response(JSON.stringify({ status: "degraded" }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }
      },
    },
  },
});
