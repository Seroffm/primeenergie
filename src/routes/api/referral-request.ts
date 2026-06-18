import { createFileRoute } from "@tanstack/react-router";
import { ok, err, generateReferralCode } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import { sendEmail } from "@/lib/email.server";
import { referralCodeRequestTemplate } from "@/lib/email-templates.server";
import process from "node:process";

export const Route = createFileRoute("/api/referral-request")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let body: { email?: string };
        try {
          body = (await request.json()) as { email?: string };
        } catch {
          return err("Ungültiger Request-Body", 400);
        }

        const email = body.email?.trim().toLowerCase();
        if (!email) {
          // Security: kein Fehler zeigen
          return ok({ data: { sent: true } });
        }

        const supabase = createServiceClient();

        // Lead mit dieser E-Mail suchen der status = 'completed' hat
        const { data: lead } = await supabase
          .from("leads")
          .select("id, first_name, email, status")
          .eq("email", email)
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!lead) {
          // Security: immer 200 zurückgeben (kein Enumeration-Angriff)
          return ok({ data: { sent: true } });
        }

        const leadId = lead.id as string;

        // Prüfen ob bereits ein aktiver referral_code existiert
        let code: string | null = null;

        const { data: existingCode } = await supabase
          .from("referral_codes")
          .select("code")
          .eq("lead_id", leadId)
          .eq("is_active", true)
          .gt("expires_at", new Date().toISOString())
          .single();

        if (existingCode) {
          code = existingCode.code as string;
        } else {
          // Neuen Code generieren mit uniqueness retry (max 3 Versuche)
          for (let attempt = 0; attempt < 3; attempt++) {
            const candidate = generateReferralCode();
            const { error: insertError } = await supabase.from("referral_codes").insert({
              lead_id: leadId,
              code: candidate,
            });
            if (!insertError) {
              code = candidate;
              break;
            }
          }
        }

        if (!code) {
          // Code-Generierung fehlgeschlagen, trotzdem 200 (kein Enumeration-Angriff)
          return ok({ data: { sent: true } });
        }

        const appUrl = process.env.APP_URL ?? "https://strom-sandy.vercel.app";
        const referralUrl = `${appUrl}/angebot?ref=${code}`;

        const tpl = referralCodeRequestTemplate({
          firstName: lead.first_name as string,
          referralCode: code,
          referralUrl,
        });

        sendEmail({
          to: email,
          subject: tpl.subject,
          html: tpl.html,
        }).catch(console.error);

        return ok({ data: { sent: true } });
      },
    },
  },
});
