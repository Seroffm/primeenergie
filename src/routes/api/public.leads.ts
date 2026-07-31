import { createFileRoute } from "@tanstack/react-router";
import { verifyTurnstile, consumeRateLimit, computeScore, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import { publicLeadPayloadSchema } from "@/lib/api/public-lead-schema";
import { hasValidFileSignature } from "@/lib/api/upload-validation.server";
import { sendEmail } from "@/lib/email.server";
import { leadConfirmationTemplate, newLeadInternalTemplate } from "@/lib/email-templates.server";
import process from "node:process";
import { generateLeadNumber } from "@/lib/lead-number";

const MAX_INVOICE_SIZE = 10 * 1024 * 1024;
const MAX_INVOICE_FILES = 2;
const ALLOWED_INVOICE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_LEAD_NUMBER_ATTEMPTS = 5;

async function insertLeadWithNumber(
  supabase: ReturnType<typeof createServiceClient>,
  values: Record<string, unknown>,
) {
  for (let attempt = 0; attempt < MAX_LEAD_NUMBER_ATTEMPTS; attempt++) {
    const leadNumber = generateLeadNumber();
    const { data, error } = await supabase
      .from("leads")
      .insert({ ...values, lead_number: leadNumber })
      .select("id, lead_number")
      .single();

    if (!error && data) return { lead: data, error: null };
    if (error?.code !== "23505") return { lead: null, error };
  }

  return { lead: null, error: new Error("Keine eindeutige Vorgangsnummer verfügbar") };
}

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let rawPayload: unknown;
        let invoiceFiles: File[] = [];
        try {
          if (request.headers.get("content-type")?.includes("multipart/form-data")) {
            const formData = await request.formData();
            const rawPayloadEntry = formData.get("payload");
            if (typeof rawPayloadEntry !== "string") throw new Error("payload fehlt");
            rawPayload = JSON.parse(rawPayloadEntry);
            invoiceFiles = formData
              .getAll("invoice")
              .filter((value): value is File => value instanceof File && value.size > 0);
          } else {
            rawPayload = await request.json();
          }
        } catch {
          return err("Ungültiger Request-Body", 400);
        }

        const validation = publicLeadPayloadSchema.safeParse(rawPayload);
        if (!validation.success) return err("Eingaben sind unvollständig oder ungültig", 400);
        const payload = validation.data;

        const withinIpLimit = await consumeRateLimit(request, "public_lead_ip", 5, 900);
        const withinEmailLimit = await consumeRateLimit(
          request,
          "public_lead_email",
          3,
          86_400,
          payload.email,
        );
        if (!withinIpLimit || !withinEmailLimit) {
          return err("Zu viele Anfragen. Bitte versuchen Sie es später erneut.", 429);
        }
        if (invoiceFiles.length > MAX_INVOICE_FILES) {
          return err(`Maximal ${MAX_INVOICE_FILES} Rechnungsdateien erlaubt`, 400);
        }
        const invoiceBuffers = new Map<File, ArrayBuffer>();
        for (const invoiceFile of invoiceFiles) {
          if (invoiceFile.size > MAX_INVOICE_SIZE) {
            return err("Rechnungsdatei ist zu groß (maximal 10 MB)", 413);
          }
          if (!ALLOWED_INVOICE_TYPES.has(invoiceFile.type)) {
            return err("Dateityp nicht erlaubt (PDF, JPG oder PNG)", 415);
          }
          const buffer = await invoiceFile.arrayBuffer();
          if (!hasValidFileSignature(invoiceFile.type, buffer)) {
            return err("Dateiinhalt stimmt nicht mit dem Dateityp überein", 415);
          }
          invoiceBuffers.set(invoiceFile, buffer);
        }

        // Turnstile wird zusätzlich geprüft, sobald echte Cloudflare Schlüssel hinterlegt sind.
        if (process.env.TURNSTILE_SECRET_KEY) {
          const turnstileOk = await verifyTurnstile(payload.turnstile_token);
          if (!turnstileOk) {
            return err("Bot-Schutz fehlgeschlagen. Bitte erneut versuchen.", 400);
          }
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
        const { lead, error: leadError } = await insertLeadWithNumber(supabase, {
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
        });

        if (leadError || !lead) {
          console.error("Lead insert error:", leadError);
          return err("Lead konnte nicht angelegt werden", 500);
        }

        const leadId = lead.id as string;
        let uploadedInvoiceCount = 0;

        for (const invoiceFile of invoiceFiles) {
          const safeName = invoiceFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `${leadId}/${Date.now()}-${crypto.randomUUID()}_${safeName}`;
          const arrayBuffer = invoiceBuffers.get(invoiceFile)!;
          const { error: uploadError } = await supabase.storage
            .from("lead-documents")
            .upload(storagePath, arrayBuffer, {
              contentType: invoiceFile.type,
              upsert: false,
            });

          if (!uploadError) {
            const { error: documentError } = await supabase.from("lead_documents").insert({
              lead_id: leadId,
              uploaded_by: null,
              document_type: "invoice",
              file_name: invoiceFile.name,
              storage_path: storagePath,
              mime_type: invoiceFile.type,
              file_size_bytes: invoiceFile.size,
            });

            if (documentError) {
              console.error("Public invoice document insert error:", documentError);
              await supabase.storage.from("lead-documents").remove([storagePath]);
            } else {
              uploadedInvoiceCount += 1;
            }
          } else {
            console.error("Public invoice upload error:", uploadError);
          }
        }
        const invoiceUploaded = uploadedInvoiceCount === invoiceFiles.length;

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
        if (
          payload.electricity ||
          payload.product_type === "electricity" ||
          payload.product_type === "both"
        ) {
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
            `${invoiceUploaded ? "Rechnung hochgeladen" : "Rechnung zur Nachreichung vorgemerkt"}: ${payload.rechnung_dateiname}` +
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

          if (codeRow && codeRow.is_active && new Date(codeRow.expires_at as string) > new Date()) {
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
        const appUrl = process.env.APP_URL ?? "https://project-gqhfy.vercel.app";
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
              invoice_uploaded: invoiceUploaded,
            },
          },
          201,
        );
      },
    },
  },
});
