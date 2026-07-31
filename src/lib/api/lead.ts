import { ESTIMATED_STROM_KWH, estimateGasKwh, type LeadInput } from "../lead-schema";
import { submitPublicLead } from "../api-client";
import type { PublicLeadPayload } from "../api-types";
import { getPendingInvoice } from "../pending-invoice";

const PRODUCT_TYPE_MAP = {
  strom: "electricity",
  gas: "gas",
  beides: "both",
  gewerbe: "electricity", // Gewerbe-Kunden bekommen Stromtarife
} as const;

const CUSTOMER_TYPE_MAP = {
  privat: "private",
  gewerbe: "business",
  hausverwaltung: "property_management",
  mehrere_standorte: "multi_location_company",
} as const;

function mapPriceGuarantee(val?: "ja" | "nein" | "weiss_nicht"): boolean | undefined {
  if (val === "ja") return true;
  if (val === "nein") return false;
  return undefined; // "weiss_nicht" und undefined → Feld wird im JSON weggelassen
}

function resolveTurnstileToken(widgetToken?: string): string {
  return widgetToken?.trim() ?? "";
}

function buildElectricity(lead: LeadInput): PublicLeadPayload["electricity"] {
  let annual_consumption_kwh: number | null = null;
  let consumption_known: boolean | null = null;

  if (lead.stromVerbrauchKwh) {
    annual_consumption_kwh = lead.stromVerbrauchKwh;
    consumption_known = true;
  } else if (lead.stromPersonen) {
    annual_consumption_kwh = ESTIMATED_STROM_KWH[lead.stromPersonen] ?? null;
    consumption_known = false;
  }

  return {
    annual_consumption_kwh,
    consumption_known,
    current_provider: lead.aktuellerAnbieter,
    monthly_payment: lead.monatlicherAbschlag,
    contract_end_date: lead.vertragsende,
    price_guarantee: mapPriceGuarantee(lead.preisgarantie),
  };
}

function buildGas(lead: LeadInput): PublicLeadPayload["gas"] {
  const hot_water_with_gas = lead.gasWarmwasser ?? null;
  let annual_consumption_kwh: number | null = null;
  let consumption_known: boolean | null = null;

  if (lead.gasVerbrauchKwh) {
    annual_consumption_kwh = lead.gasVerbrauchKwh;
    consumption_known = true;
  } else if (lead.gasWohnflaeche) {
    annual_consumption_kwh = estimateGasKwh(lead.gasWohnflaeche, !!lead.gasWarmwasser);
    consumption_known = false;
  }

  return {
    annual_consumption_kwh,
    consumption_known,
    hot_water_with_gas,
    current_provider: lead.aktuellerAnbieter,
    monthly_payment: lead.monatlicherAbschlag,
    contract_end_date: lead.vertragsende,
    price_guarantee: mapPriceGuarantee(lead.preisgarantie),
    heating_type: lead.gasHeizart,
    household_size: lead.gasPersonen,
  };
}

function mapToBackendPayload(
  lead: LeadInput,
  turnstileToken?: string,
  website = "",
): PublicLeadPayload {
  const product_type = PRODUCT_TYPE_MAP[lead.energyType];
  const customer_type = CUSTOMER_TYPE_MAP[lead.customerType];

  const address: PublicLeadPayload["address"] = {
    postal_code: lead.plz,
    city: lead.ort,
  };
  if (lead.strasse) address.street = lead.strasse;

  return {
    first_name: lead.vorname,
    last_name: lead.nachname,
    email: lead.email,
    phone: lead.telefon,
    customer_type,
    product_type,
    privacy_consent: true,
    contact_consent: true,
    address,
    turnstile_token: resolveTurnstileToken(turnstileToken),
    website,

    ...(product_type === "electricity" || product_type === "both"
      ? { electricity: buildElectricity(lead) }
      : {}),
    ...(product_type === "gas" || product_type === "both" ? { gas: buildGas(lead) } : {}),

    // Felder ohne dedizierte DB-Spalte — Backend speichert sie in leads.notes
    ziele: lead.ziele.length > 0 ? lead.ziele : undefined,
    erreichbarkeit: lead.erreichbarkeit,
    rechnung_dateiname: lead.rechnungDateiname,
    rechnung_groesse_kb: lead.rechnungGroesseKb,
  };
}

export async function submitLead(
  lead: LeadInput,
  turnstileToken?: string,
  referralCode?: string,
  invoiceFile?: File | null,
  website = "",
): Promise<{ ok: true; leadId: string; leadNumber: string; invoiceUploaded: boolean }> {
  const payload = mapToBackendPayload(lead, turnstileToken, website);
  if (referralCode) payload.referral_code = referralCode.trim().toUpperCase();
  const pendingInvoiceFiles = getPendingInvoice();
  const invoiceFiles =
    pendingInvoiceFiles.length > 0 ? pendingInvoiceFiles : invoiceFile ? [invoiceFile] : [];
  if (invoiceFiles.length > 0) {
    payload.rechnung_dateiname = invoiceFiles.map((file) => file.name).join(", ");
    payload.rechnung_groesse_kb = Math.round(
      invoiceFiles.reduce((total, file) => total + file.size, 0) / 1024,
    );
  }
  const { lead_id, lead_number, invoice_uploaded } = await submitPublicLead(payload, invoiceFiles);
  return {
    ok: true,
    leadId: lead_id,
    leadNumber: lead_number,
    invoiceUploaded: invoice_uploaded,
  };
}
