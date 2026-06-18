import { createFileRoute } from "@tanstack/react-router";
import { ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/referral-validate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let body: { code?: string };
        try {
          body = (await request.json()) as { code?: string };
        } catch {
          return err("Ungültiger Request-Body", 400);
        }

        const code = body.code?.trim().toUpperCase();
        if (!code) {
          return ok({ data: { valid: false } });
        }

        const supabase = createServiceClient();

        const { data: codeRow } = await supabase
          .from("referral_codes")
          .select("id, lead_id, is_active, expires_at")
          .eq("code", code)
          .single();

        if (!codeRow || !codeRow.is_active || new Date(codeRow.expires_at as string) <= new Date()) {
          return ok({ data: { valid: false } });
        }

        const { data: referrerLead } = await supabase
          .from("leads")
          .select("id, status, first_name, last_name")
          .eq("id", codeRow.lead_id)
          .single();

        if (!referrerLead || referrerLead.status !== "completed") {
          return ok({ data: { valid: false } });
        }

        // Nur Anfangsbuchstabe des Nachnamens aus Datenschutzgründen
        const lastName = referrerLead.last_name as string;
        const referrerName = `${referrerLead.first_name as string} ${lastName ? lastName[0] + "." : ""}`.trim();

        return ok({ data: { valid: true, referrer_name: referrerName } });
      },
    },
  },
});
