import { createFileRoute } from "@tanstack/react-router";
import { verifyTurnstile, computeScore, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import type { PublicLeadPayload } from "@/lib/api-types";
import { sendEmail } from "@/lib/email.server";
import {
  leadConfirmationTemplate,
  newLeadInternalTemplate,
} from "@/lib/email-templates.server";
import process from "node:process";


export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let payload: PublicLeadPayload;
        try {
          payload = (await request.json()) as PublicLeadPayload;
        } catch {
          return err("Ungültiger Request-Body", 400);
        }

        // Pflichtfelder prüfen
        if (!payload.first_name || !payload.last_name || !payload.email) {
          return err("Pflichtfelder fehlen: first_name, last_name, email", 400);
        }
        if (!payload.privacy_consent || !payload.contact_consent) {
          return err("Datenschutz-Einwilligung fehlt", 400);
        }
        if (!payload.product_type || !payload.customer_type) {
          return err("product_type und customer_type sind erforderlich", 400);
        }

        // Turnstile verifizieren
        const turnstileOk = await verifyTurnstile(payload.turnstile_token);
        if (!turnstileOk) {
          return err("Bot-Schutz fehlgeschlagen. Bitte erneut versuchen.", 400);
        }

        const supabase = createServiceClient();

        // Score berechnen
        const { score, scoreLabel } = computeScore({
          annualKwhElectricity: payload.electricity?.annual_consumption_kwh,
          annualKwhGas: payload.gas?.annual_consumption_kwh,
          hasPhone: Boolean(payload.phone),
          hasInvoiceRef: Boolean(payload.rechnung_dateiname),
          consumptionKnown:
            payload.electricity?.consumption_known ?? payload.gas?.consumption_known,
        });

        // Lead anlegen
        const { data: lead, error: leadError } = await supabase
          .from("leads")
          .insert({
            first_name: payload.first_name.trim(),
            last_name: payload.last_name.trim(),
            email: payload.email.trim().toLowerCase(),
            phone: payload.phone?.trim() || null,
            product_type: payload.product_type,
            customer_type: payload.customer_type,
            privacy_consent: payload.privacy_consent,
            contact_consent: payload.contact_consent,
            score,
            score_label: scoreLabel,
          })
          .select("id, lead_number")
          .single();

        if (leadError || !lead) {
          console.error("Lead insert error:", leadError);
          return err("Lead konnte nicht angelegt werden", 500);
        }

        const leadId = lead.id as string;

        // Adresse speichern
        if (payload.address) {
          await supabase.from("lead_addresses").insert({
            lead_id: leadId,
            address_type: "delivery",
            street: payload.address.street ?? null,
            postal_code: payload.address.postal_code ?? null,
            city: payload.address.city ?? null,
          });
        }

        // Energie-Bedarf Strom speichern
        if (payload.electricity || payload.product_type === "electricity" || payload.product_type === "both") {
          const el = payload.electricity;
          await supabase.from("energy_demands").insert({
            lead_id: leadId,
            energy_type: "electricity",
            annual_consumption_kwh: el?.annual_consumption_kwh ?? null,
            consumption_known: el?.consumption_known ?? null,
            current_provider: el?.current_provider ?? null,
            monthly_payment: el?.monthly_payment ?? null,
            contract_end_date: el?.contract_end_date ?? null,
          });
        }

        // Energie-Bedarf Gas speichern
        if (payload.gas || payload.product_type === "gas" || payload.product_type === "both") {
          const g = payload.gas;
          await supabase.from("energy_demands").insert({
            lead_id: leadId,
            energy_type: "gas",
            annual_consumption_kwh: g?.annual_consumption_kwh ?? null,
            consumption_known: g?.consumption_known ?? null,
            hot_water_with_gas: g?.hot_water_with_gas ?? null,
            heating_type: g?.heating_type ?? null,
            household_size: g?.household_size ?? null,
            current_provider: g?.current_provider ?? null,
            monthly_payment: g?.monthly_payment ?? null,
            contract_end_date: g?.contract_end_date ?? null,
          });
        }

        // Initiale Notiz mit Zusatzinfos (Ziele, Erreichbarkeit, Rechnungsreferenz)
        const noteLines: string[] = [];
        if (payload.ziele?.length) {
          noteLines.push(`Ziele: ${payload.ziele.join(", ")}`);
        }
        if (payload.erreichbarkeit) {
          noteLines.push(`Erreichbarkeit: ${payload.erreichbarkeit}`);
        }
        if (payload.rechnung_dateiname) {
          noteLines.push(
            `Rechnung hochgeladen: ${payload.rechnung_dateiname}` +
              (payload.rechnung_groesse_kb ? ` (${payload.rechnung_groesse_kb} KB)` : ""),
          );
        }
        if (noteLines.length > 0) {
          await supabase.from("lead_notes").insert({
            lead_id: leadId,
            created_by: null,
            note: noteLines.join("\n"),
          });
        }

        // Referral verarbeiten (wenn referral_code übergeben wurde)
        if (payload.referral_code) {
          const code = payload.referral_code.trim().toUpperCase();

          const { data: codeRow } = await supabase
            .from("referral_codes")
            .select("id, lead_id, is_active, expires_at")
            .eq("code", code)
            .single();

          if (
            codeRow &&
            codeRow.is_active &&
            new Date(codeRow.expires_at as string) > new Date()
          ) {
            const { data: referrerLead } = await supabase
              .from("leads")
              .select("id, status, email, first_name, last_name")
              .eq("id", codeRow.lead_id)
              .single();

            const referredEmail = payload.email.trim().toLowerCase();

            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { count: monthlyQualified } = await supabase
              .from("referrals")
              .select("id", { count: "exact", head: true })
              .eq("referrer_lead_id", referrerLead?.id ?? "")
              .in("status", ["qualified", "paid"])
              .gte("created_at", startOfMonth.toISOString());

            const { count: existingLeads } = await supabase
              .from("leads")
              .select("id", { count: "exact", head: true })
              .eq("email", referredEmail)
              .neq("id", leadId);

            const isValid =
              referrerLead?.status === "completed" &&
              referrerLead.email !== referredEmail &&
              (existingLeads ?? 0) === 0 &&
              (monthlyQualified ?? 0) < 5;

            if (isValid) {
              await supabase.from("referrals").insert({
                referrer_lead_id: referrerLead!.id,
                referred_lead_id: leadId,
                code_used: code,
                status: "pending",
                reward_amount_cents: 3000,
                reward_type: "amazon_voucher",
              });
            }
          }
        }

        // E-Mails asynchron versenden (blockiert die Response nicht)
        const appUrl = process.env.APP_URL ?? "https://strom-sandy.vercel.app";
        const notificationEmail = process.env.NOTIFICATION_EMAIL;

        // 1. Bestätigung an Kunden
        const confirmTpl = leadConfirmationTemplate({
          firstName: payload.first_name.trim(),
          lastName: payload.last_name.trim(),
          leadNumber: lead.lead_number as string,
          productType: payload.product_type as "electricity" | "gas" | "both",
        });
        sendEmail({
          to: payload.email.trim().toLowerCase(),
          subject: confirmTpl.subject,
          html: confirmTpl.html,
        }).catch(console.error);

        // 2. Interne Benachrichtigung
        if (notificationEmail) {
          const internalTpl = newLeadInternalTemplate({
            firstName: payload.first_name.trim(),
            lastName: payload.last_name.trim(),
            email: payload.email.trim().toLowerCase(),
            phone: payload.phone ?? null,
            leadNumber: lead.lead_number as string,
            productType: payload.product_type,
            customerType: payload.customer_type,
            score,
            scoreLabel,
            leadId,
            appUrl,
          });
          sendEmail({
            to: notificationEmail,
            subject: internalTpl.subject,
            html: internalTpl.html,
          }).catch(console.error);
        }

        return ok(
          {
            data: {
              lead_id: leadId,
              lead_number: lead.lead_number,
            },
          },
          201,
        );
      },
    },
  },
});
