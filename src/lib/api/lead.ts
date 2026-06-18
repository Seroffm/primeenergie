import { ESTIMATED_STROM_KWH, estimateGasKwh, type LeadInput } from "../lead-schema";
import { submitPublicLead } from "../api-client";
import type { PublicLeadPayload } from "../api-types";

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

// DEMO/STAGING: VITE_TURNSTILE_DEMO_TOKEN ist der Cloudflare always-pass Testschlüssel.
// Production-Deployments müssen ein echtes Turnstile-Widget einbinden und
// den echten VITE_TURNSTILE_SITE_KEY konfigurieren.
function resolveTurnstileToken(widgetToken?: string): string {
  if (widgetToken) return widgetToken;
  const demoToken = import.meta.env.VITE_TURNSTILE_DEMO_TOKEN as string | undefined;
  if (demoToken) return demoToken;
  throw new Error(
    "Kein Turnstile-Token verfügbar. " +
      "Widget einbinden oder VITE_TURNSTILE_DEMO_TOKEN in .env.local setzen.",
  );
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

function mapToBackendPayload(lead: LeadInput, turnstileToken?: string): PublicLeadPayload {
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
): Promise<{ ok: true; leadId: string }> {
  const payload = mapToBackendPayload(lead, turnstileToken);
  if (referralCode) payload.referral_code = referralCode.trim().toUpperCase();
  const { lead_id } = await submitPublicLead(payload);
  return { ok: true, leadId: lead_id };
}
