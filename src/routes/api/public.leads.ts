import { createFileRoute } from "@tanstack/react-router";
import {
  verifyTurnstile,
  consumeRateLimit,
  computeScore,
  ok,
  err,
  methodNotAllowed,
} from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import {
  publicLeadPayloadSchema,
  type ValidPublicLeadPayload,
} from "@/lib/api/public-lead-schema";
import { hasValidFileSignature } from "@/lib/api/upload-validation.server";
import { sendEmail } from "@/lib/email.server";
import { leadConfirmationTemplate, newLeadInternalTemplate } from "@/lib/email-templates.server";
import process from "node:process";
import { generateLeadNumber } from "@/lib/lead-number";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_FILES, MAX_UPLOAD_MB, PUBLIC_INVOICE_TYPES } from "@/lib/upload-limits";

// Legacy multipart requests remain capped below Vercel's 4.5 MB function body
// limit. New requests upload directly to private storage and reference the
// signed upload in JSON, so the customer-facing limit is 10 MB per file.
const MAX_INVOICE_SIZE = 2 * 1024 * 1024;
const MAX_INVOICE_FILES = MAX_UPLOAD_FILES;
const ALLOWED_INVOICE_TYPES = new Set<string>(PUBLIC_INVOICE_TYPES);
const MAX_LEAD_NUMBER_ATTEMPTS = 5;

type InvoiceAttachment = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  buffer: ArrayBuffer;
  pendingPath?: string;
};

function formatKwh(value: number | null | undefined): string {
  return value == null ? "Nicht angegeben" : `${value.toLocaleString("de-DE")} kWh`;
}

function formatEuro(value: number | null | undefined): string {
  return value == null
    ? "Nicht angegeben"
    : `${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Euro`;
}

function yesNo(value: boolean | null | undefined): string {
  return value == null ? "Nicht angegeben" : value ? "Ja" : "Nein";
}

function buildInternalLeadDetails(
  payload: ValidPublicLeadPayload,
  uploadedInvoiceCount: number,
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [
    {
      label: "Kundentyp:",
      value:
        {
          private: "Privat",
          business: "Gewerbe",
          property_management: "Hausverwaltung",
          multi_location_company: "Unternehmen mit mehreren Standorten",
        }[payload.customer_type] ?? payload.customer_type,
    },
    {
      label: "Adresse:",
      value: [payload.address.street, payload.address.postal_code, payload.address.city]
        .filter(Boolean)
        .join(", "),
    },
  ];

  if (payload.electricity) {
    details.push(
      { label: "Stromverbrauch:", value: formatKwh(payload.electricity.annual_consumption_kwh) },
      { label: "Stromverbrauch bekannt:", value: yesNo(payload.electricity.consumption_known) },
      {
        label: "Aktueller Stromanbieter:",
        value: payload.electricity.current_provider || "Nicht angegeben",
      },
      { label: "Monatlicher Stromabschlag:", value: formatEuro(payload.electricity.monthly_payment) },
      {
        label: "Vertragsende Strom:",
        value: payload.electricity.contract_end_date || "Nicht angegeben",
      },
      { label: "Preisgarantie Strom:", value: yesNo(payload.electricity.price_guarantee) },
    );
  }

  if (payload.gas) {
    details.push(
      { label: "Gasverbrauch:", value: formatKwh(payload.gas.annual_consumption_kwh) },
      { label: "Gasverbrauch bekannt:", value: yesNo(payload.gas.consumption_known) },
      { label: "Warmwasser mit Gas:", value: yesNo(payload.gas.hot_water_with_gas) },
      { label: "Heizart:", value: payload.gas.heating_type || "Nicht angegeben" },
      {
        label: "Haushaltsgröße:",
        value: payload.gas.household_size?.toString() || "Nicht angegeben",
      },
      {
        label: "Aktueller Gasanbieter:",
        value: payload.gas.current_provider || "Nicht angegeben",
      },
      { label: "Monatlicher Gasabschlag:", value: formatEuro(payload.gas.monthly_payment) },
      {
        label: "Vertragsende Gas:",
        value: payload.gas.contract_end_date || "Nicht angegeben",
      },
      { label: "Preisgarantie Gas:", value: yesNo(payload.gas.price_guarantee) },
    );
  }

  details.push(
    { label: "Ziele:", value: payload.ziele?.join(", ") || "Nicht angegeben" },
    { label: "Erreichbarkeit:", value: payload.erreichbarkeit || "Nicht angegeben" },
    {
      label: "Rechnung:",
      value: payload.rechnung_dateiname
        ? `${payload.rechnung_dateiname} (${uploadedInvoiceCount} Datei(en) gespeichert)`
        : "Keine Rechnung hochgeladen",
    },
  );

  if (payload.referral_code) {
    details.push({ label: "Empfehlungscode:", value: payload.referral_code });
  }

  return details;
}

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
      GET: () => methodNotAllowed(["POST"]),
      POST: async ({ request }: { request: Request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        const isMultipart = contentType.includes("multipart/form-data");
        const isJson = contentType.split(";", 1)[0]?.trim() === "application/json";
        if (!isMultipart && !isJson) return err("Ungültiger Inhaltstyp", 415);

        const declaredLength = Number(request.headers.get("content-length") ?? 0);
        if (isMultipart && Number.isFinite(declaredLength) && declaredLength > 4_400_000) {
          return err("Anfrage ist zu groß", 413);
        }

        let rawPayload: unknown;
        let invoiceFiles: File[] = [];
        try {
          if (isMultipart) {
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
        if (!withinIpLimit) {
          return err("Zu viele Anfragen. Bitte versuchen Sie es später erneut.", 429);
        }
        const invoiceAttachments: InvoiceAttachment[] = [];
        const invoiceUploads = payload.invoice_uploads ?? [];
        if (invoiceFiles.length > 0 && invoiceUploads.length > 0) {
          return err("Rechnung wurde mehrfach übertragen", 400);
        }
        if (invoiceFiles.length + invoiceUploads.length > MAX_INVOICE_FILES) {
          return err(`Maximal ${MAX_INVOICE_FILES} Rechnungsdateien erlaubt`, 400);
        }
        for (const invoiceFile of invoiceFiles) {
          if (invoiceFile.size > MAX_INVOICE_SIZE) {
            return err("Rechnungsdatei ist zu groß (maximal 2 MB je Datei)", 413);
          }
          if (!ALLOWED_INVOICE_TYPES.has(invoiceFile.type)) {
            return err("Dateityp nicht erlaubt (PDF, JPG oder PNG)", 415);
          }
          const buffer = await invoiceFile.arrayBuffer();
          if (!hasValidFileSignature(invoiceFile.type, buffer)) {
            return err("Dateiinhalt stimmt nicht mit dem Dateityp überein", 415);
          }
          invoiceAttachments.push({
            fileName: invoiceFile.name,
            mimeType: invoiceFile.type,
            sizeBytes: invoiceFile.size,
            buffer,
          });
        }

        const pendingInvoicePaths: string[] = [];
        if (invoiceUploads.length > 0) {
          const supabase = createServiceClient();
          for (const upload of invoiceUploads) {
            if (!upload.path.startsWith("pending-invoices/")) {
              return err("Ungültiger Uploadpfad", 400);
            }
            if (pendingInvoicePaths.includes(upload.path)) {
              return err("Rechnung wurde mehrfach übertragen", 400);
            }
            if (upload.size_bytes > MAX_UPLOAD_BYTES || !ALLOWED_INVOICE_TYPES.has(upload.mime_type)) {
              return err(`Rechnungsdatei ist ungültig oder größer als ${MAX_UPLOAD_MB} MB`, 413);
            }
            const { data: blob, error: downloadError } = await supabase.storage
              .from("lead-documents")
              .download(upload.path);
            if (downloadError || !blob || blob.size !== upload.size_bytes) {
              return err("Hochgeladene Rechnung wurde nicht gefunden", 400);
            }
            const buffer = await blob.arrayBuffer();
            if (!hasValidFileSignature(upload.mime_type, buffer)) {
              await supabase.storage.from("lead-documents").remove([upload.path]);
              return err("Dateiinhalt stimmt nicht mit dem Dateityp überein", 415);
            }
            pendingInvoicePaths.push(upload.path);
            invoiceAttachments.push({
              fileName: upload.file_name,
              mimeType: upload.mime_type,
              sizeBytes: blob.size,
              buffer,
              pendingPath: upload.path,
            });
          }
        }

        // Turnstile wird zusätzlich geprüft, sobald echte Cloudflare Schlüssel hinterlegt sind.
        if (process.env.TURNSTILE_SECRET_KEY) {
          const turnstileOk = await verifyTurnstile(payload.turnstile_token);
          if (!turnstileOk) {
            return err("Bot-Schutz fehlgeschlagen. Bitte erneut versuchen.", 400);
          }
        }

        // Die E-Mail-Quote wird erst nach vollständiger Datei- und Bot-Prüfung
        // verbraucht. Ungültige Requests können dadurch keine fremde Adresse sperren.
        const withinEmailLimit = await consumeRateLimit(
          request,
          "public_lead_email",
          3,
          86_400,
          payload.email,
        );
        if (!withinEmailLimit) {
          return err("Zu viele Anfragen. Bitte versuchen Sie es später erneut.", 429);
        }

        const supabase = createServiceClient();

        // Score berechnen
        const { score, scoreLabel } = computeScore({
          annualKwhElectricity: payload.electricity?.annual_consumption_kwh,
          annualKwhGas: payload.gas?.annual_consumption_kwh,
          hasPhone: Boolean(payload.phone),
          hasInvoiceRef: invoiceAttachments.length > 0,
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
          if (pendingInvoicePaths.length > 0) {
            await supabase.storage.from("lead-documents").remove(pendingInvoicePaths);
          }
          return err("Lead konnte nicht angelegt werden", 500);
        }

        const leadId = lead.id as string;
        let uploadedInvoiceCount = 0;
        const uploadedStoragePaths: string[] = [];
        let persistenceError: unknown = null;

        for (const invoiceFile of invoiceAttachments) {
          const safeName = invoiceFile.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `${leadId}/${Date.now()}-${crypto.randomUUID()}_${safeName}`;
          const { error: uploadError } = invoiceFile.pendingPath
            ? await supabase.storage.from("lead-documents").move(invoiceFile.pendingPath, storagePath)
            : await supabase.storage.from("lead-documents").upload(storagePath, invoiceFile.buffer, {
                contentType: invoiceFile.mimeType,
                upsert: false,
              });

          if (!uploadError) {
            if (invoiceFile.pendingPath) {
              const pendingIndex = pendingInvoicePaths.indexOf(invoiceFile.pendingPath);
              if (pendingIndex !== -1) pendingInvoicePaths.splice(pendingIndex, 1);
            }
            const { error: documentError } = await supabase.from("lead_documents").insert({
              lead_id: leadId,
              uploaded_by: null,
              document_type: "invoice",
              file_name: invoiceFile.fileName,
              storage_path: storagePath,
              mime_type: invoiceFile.mimeType,
              file_size_bytes: invoiceFile.sizeBytes,
            });

            if (documentError) {
              console.error("Public invoice document insert error:", documentError);
              await supabase.storage.from("lead-documents").remove([storagePath]);
            } else {
              uploadedInvoiceCount += 1;
              uploadedStoragePaths.push(storagePath);
            }
          } else {
            console.error("Public invoice upload error:", uploadError);
          }
        }
        const invoiceUploaded =
          invoiceAttachments.length > 0 && uploadedInvoiceCount === invoiceAttachments.length;
        if (invoiceAttachments.length > 0 && !invoiceUploaded) {
          persistenceError = new Error("Rechnungsupload unvollständig");
        }

        // Adresse speichern
        if (payload.address) {
          const { error: addressError } = await supabase.from("lead_addresses").insert({
            lead_id: leadId,
            address_type: "delivery",
            street: payload.address.street ?? null,
            postal_code: payload.address.postal_code ?? null,
            city: payload.address.city ?? null,
          });
          persistenceError ??= addressError;
        }

        // Energie-Bedarf Strom speichern
        if (
          payload.electricity ||
          payload.product_type === "electricity" ||
          payload.product_type === "both"
        ) {
          const el = payload.electricity;
          const { error: electricityError } = await supabase.from("energy_demands").insert({
            lead_id: leadId,
            energy_type: "electricity",
            annual_consumption_kwh: el?.annual_consumption_kwh ?? null,
            consumption_known: el?.consumption_known ?? null,
            current_provider: el?.current_provider ?? null,
            monthly_payment: el?.monthly_payment ?? null,
            contract_end_date: el?.contract_end_date ?? null,
          });
          persistenceError ??= electricityError;
        }

        // Energie-Bedarf Gas speichern
        if (payload.gas || payload.product_type === "gas" || payload.product_type === "both") {
          const g = payload.gas;
          const { error: gasError } = await supabase.from("energy_demands").insert({
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
          persistenceError ??= gasError;
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
          const { error: noteError } = await supabase.from("lead_notes").insert({
            lead_id: leadId,
            created_by: null,
            note: noteLines.join("\n"),
          });
          persistenceError ??= noteError;
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
              const { error: referralError } = await supabase.from("referrals").insert({
                referrer_lead_id: referrerLead!.id,
                referred_lead_id: leadId,
                code_used: code,
                status: "pending",
                reward_amount_cents: 3000,
                reward_type: "amazon_voucher",
              });
              persistenceError ??= referralError;
            }
          }
        }

        if (persistenceError) {
          console.error("Lead child data could not be stored:", persistenceError);
          const cleanupPaths = [...uploadedStoragePaths, ...pendingInvoicePaths];
          if (cleanupPaths.length > 0) {
            const { error: cleanupStorageError } = await supabase.storage
              .from("lead-documents")
              .remove(cleanupPaths);
            if (cleanupStorageError) console.error("Storage cleanup failed:", cleanupStorageError);
          }
          const { error: cleanupLeadError } = await supabase.from("leads").delete().eq("id", leadId);
          if (cleanupLeadError) console.error("Lead cleanup failed:", cleanupLeadError);
          return err("Anfrage konnte nicht vollständig gespeichert werden", 500);
        }

        // E-Mails vor Abschluss der Serverless-Anfrage versenden, damit der Prozess
        // nicht beendet wird, bevor Resend die Nachrichten angenommen hat.
        const appUrl = process.env.APP_URL ?? "https://project-gqhfy.vercel.app";
        const notificationEmail = process.env.NOTIFICATION_EMAIL;

        // 1. Bestätigung an Kunden
        const confirmTpl = leadConfirmationTemplate({
          firstName: payload.first_name.trim(),
          lastName: payload.last_name.trim(),
          leadNumber: lead.lead_number as string,
          productType: payload.product_type as "electricity" | "gas" | "both",
        });
        const emailDeliveries: Array<{
          label: string;
          recipient: string;
          direction: "outbound" | "internal";
          subject: string;
          html: string;
          replyTo?: string;
        }> = [
          {
            label: "Kundenbestätigung",
            recipient: payload.email.trim().toLowerCase(),
            direction: "outbound",
            subject: confirmTpl.subject,
            html: confirmTpl.html,
          },
        ];

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
            details: buildInternalLeadDetails(payload, uploadedInvoiceCount),
          });
          emailDeliveries.push({
            label: "Interne Lead-Benachrichtigung",
            recipient: notificationEmail,
            direction: "internal",
            subject: internalTpl.subject,
            html: internalTpl.html,
            replyTo: payload.email.trim().toLowerCase(),
          });
        }

        const deliveryResults = await Promise.allSettled(
          emailDeliveries.map((delivery) =>
            sendEmail({
              to: delivery.recipient,
              subject: delivery.subject,
              html: delivery.html,
              replyTo: delivery.replyTo,
              idempotencyKey: `prime-lead-${leadId}-${delivery.direction}-v1`,
            }),
          ),
        );

        const communicationRows = deliveryResults.map((result, index) => {
          const delivery = emailDeliveries[index]!;
          const success = result.status === "fulfilled" && !result.value.skipped;
          if (!success) {
            const reason =
              result.status === "rejected"
                ? result.reason
                : new Error("E-Mail-Versand wurde übersprungen");
            console.error(`[EMAIL] ${delivery.label} fehlgeschlagen:`, reason);
          }
          return {
            lead_id: leadId,
            created_by: null,
            communication_type: "email",
            direction: delivery.direction,
            subject: delivery.subject,
            content_summary: `${delivery.label} an ${delivery.recipient}`,
            status: success ? "success" : "failed",
            external_id: result.status === "fulfilled" ? result.value.id : null,
          };
        });

        const { error: communicationError } = await supabase
          .from("lead_communications")
          .insert(communicationRows);
        if (communicationError) {
          console.error("E-Mail-Protokollierung fehlgeschlagen:", communicationError);
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
