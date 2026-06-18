import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err, generateReferralCode } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import { sendEmail } from "@/lib/email.server";
import {
  offerSentTemplate,
  contractSentTemplate,
  completedTemplate,
  questionTemplate,
  rejectedTemplate,
  referralCodeIssuedTemplate,
  referralQualifiedTemplate,
} from "@/lib/email-templates.server";
import process from "node:process";

const VALID_STATUSES = new Set([
  "new", "in_review", "question_open", "offer_created", "offer_sent",
  "interested", "contract_prepared", "contract_sent", "completed",
  "rejected", "unreachable", "follow_up", "disqualified", "lost",
]);

// Statuse die eine Kunden-E-Mail auslösen
const CUSTOMER_EMAIL_TRIGGERS = new Set([
  "offer_sent",
  "contract_sent",
  "completed",
  "question_open",
  "rejected",
  "disqualified",
  "lost",
]);

export const Route = createFileRoute("/api/leads/$id/status")({
  server: {
    handlers: {
      PATCH: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string };
      }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        let body: { status?: string; reason?: string; questionText?: string };
        try {
          body = await request.json();
        } catch {
          return err("Ungültiger Request-Body", 400);
        }

        const { status, reason, questionText } = body;
        if (!status || !VALID_STATUSES.has(status)) {
          return err(`Ungültiger Status: ${status}`, 400);
        }

        const supabase = createServiceClient();

        // Lead mit Kundendaten laden
        const { data: current, error: fetchError } = await supabase
          .from("leads")
          .select("id, status, assigned_to, first_name, last_name, email, product_type, lead_number")
          .eq("id", params.id)
          .single();

        if (fetchError || !current) return err("Lead nicht gefunden", 404);

        if (auth.user.role === "employee" && current.assigned_to !== auth.user.userId) {
          return err("Zugriff verweigert", 403);
        }

        // Status aktualisieren
        const { error: updateError } = await supabase
          .from("leads")
          .update({ status })
          .eq("id", params.id);

        if (updateError) return err("Statusaktualisierung fehlgeschlagen", 500);

        // Status-History eintragen
        await supabase.from("lead_status_history").insert({
          lead_id: params.id,
          old_status: current.status,
          new_status: status,
          changed_by: auth.user.userId,
          reason: reason ?? null,
        });

        // E-Mail an Kunden asynchron versenden
        if (CUSTOMER_EMAIL_TRIGGERS.has(status) && current.email) {
          const firstName = current.first_name as string;
          const leadNumber = current.lead_number as string;
          const productType = current.product_type as string;
          const employeeName = auth.user.fullName ?? null;

          let tpl: { subject: string; html: string } | null = null;

          if (status === "offer_sent") {
            tpl = offerSentTemplate({ firstName, leadNumber, productType, employeeName });
          } else if (status === "contract_sent") {
            tpl = contractSentTemplate({ firstName, leadNumber, productType });
          } else if (status === "completed") {
            tpl = completedTemplate({
              firstName,
              lastName: current.last_name as string,
              leadNumber,
              productType,
            });
          } else if (status === "question_open") {
            tpl = questionTemplate({
              firstName,
              leadNumber,
              employeeName,
              questionText: questionText ?? null,
            });
          } else if (status === "rejected" || status === "disqualified" || status === "lost") {
            tpl = rejectedTemplate({ firstName, leadNumber });
          }

          if (tpl) {
            sendEmail({
              to: current.email as string,
              subject: tpl.subject,
              html: tpl.html,
            }).catch(console.error);
          }
        }

        // Referral-Logik bei "completed"
        if (status === "completed") {
          const appUrl = process.env.APP_URL ?? "https://strom-sandy.vercel.app";
          const leadEmail = current.email as string;
          const leadFirstName = current.first_name as string;

          // 1. Pending Referral für diesen Lead qualifizieren
          const { data: pendingReferral } = await supabase
            .from("referrals")
            .select("id, referrer_lead_id")
            .eq("referred_lead_id", params.id)
            .eq("status", "pending")
            .single();

          if (pendingReferral) {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { count: monthlyQualified } = await supabase
              .from("referrals")
              .select("id", { count: "exact", head: true })
              .eq("referrer_lead_id", pendingReferral.referrer_lead_id as string)
              .in("status", ["qualified", "paid"])
              .gte("created_at", startOfMonth.toISOString());

            if ((monthlyQualified ?? 0) < 5) {
              const payoutAfter = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
              await supabase
                .from("referrals")
                .update({ status: "qualified", payout_after: payoutAfter })
                .eq("id", pendingReferral.id);

              // Referrer benachrichtigen
              const { data: referrerLead } = await supabase
                .from("leads")
                .select("email, first_name")
                .eq("id", pendingReferral.referrer_lead_id)
                .single();

              if (referrerLead) {
                const qualifiedTpl = referralQualifiedTemplate({
                  firstName: referrerLead.first_name as string,
                  referredFirstName: leadFirstName,
                  rewardAmount: 3000,
                  payoutAfter,
                });
                sendEmail({
                  to: referrerLead.email as string,
                  subject: qualifiedTpl.subject,
                  html: qualifiedTpl.html,
                }).catch(console.error);
              }
            }
          }

          // 2. Automatisch Referral-Code für diesen Lead generieren (falls noch keiner existiert)
          const { data: existingCode } = await supabase
            .from("referral_codes")
            .select("code")
            .eq("lead_id", params.id)
            .eq("is_active", true)
            .gt("expires_at", new Date().toISOString())
            .single();

          if (!existingCode) {
            let newCode: string | null = null;
            for (let attempt = 0; attempt < 3; attempt++) {
              const candidate = generateReferralCode();
              const { error: insertError } = await supabase.from("referral_codes").insert({
                lead_id: params.id,
                code: candidate,
              });
              if (!insertError) {
                newCode = candidate;
                break;
              }
            }

            if (newCode && leadEmail) {
              const referralUrl = `${appUrl}/angebot?ref=${newCode}`;
              const codeTpl = referralCodeIssuedTemplate({
                firstName: leadFirstName,
                referralCode: newCode,
                referralUrl,
              });
              sendEmail({
                to: leadEmail,
                subject: codeTpl.subject,
                html: codeTpl.html,
              }).catch(console.error);
            }
          }
        }

        return ok({ data: { ok: true } });
      },
    },
  },
});
