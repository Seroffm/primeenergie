import type { LeadStatus, LeadType, Role } from "./mock-leads";

// ---------------------------------------------------------------------------
// Backend-Typen (Supabase-Schema)
// ---------------------------------------------------------------------------

export type BackendUserRole = "employee" | "manager" | "admin";

export type BackendLeadStatus =
  | "new"
  | "in_review"
  | "question_open"
  | "offer_created"
  | "offer_sent"
  | "interested"
  | "contract_prepared"
  | "contract_sent"
  | "completed"
  | "rejected"
  | "unreachable"
  | "follow_up"
  | "disqualified"
  | "lost";

export type BackendProductType = "electricity" | "gas" | "both";
export type BackendCustomerType =
  | "private"
  | "business"
  | "property_management"
  | "multi_location_company";

export interface BackendLead {
  id: string;
  lead_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: BackendLeadStatus;
  score: number;
  score_label: "cold" | "warm" | "hot";
  product_type: BackendProductType;
  customer_type: BackendCustomerType;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendAddress {
  id: string;
  lead_id: string;
  address_type: "delivery" | "billing" | "contact";
  street: string | null;
  house_number: string | null;
  address_addition: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface BackendEnergyDemand {
  id: string;
  lead_id: string;
  energy_type: "electricity" | "gas";
  annual_consumption_kwh: number | null;
  consumption_known: boolean | null;
  household_size: number | null;
  living_area_sqm: number | null;
  heating_type: string | null;
  hot_water_with_gas: boolean | null;
  current_provider: string | null;
  current_tariff: string | null;
  monthly_payment: number | null;
  contract_end_date: string | null;
  meter_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendLeadDetail extends BackendLead {
  addresses?: BackendAddress[];
  energy_demands?: BackendEnergyDemand[];
}

export interface BackendNote {
  id: string;
  lead_id: string;
  created_by: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface BackendDocument {
  id: string;
  lead_id: string;
  uploaded_by: string;
  document_type: string;
  file_name: string;
  storage_path: string;
  storage_bucket: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  ocr_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendCommunication {
  id: string;
  lead_id: string;
  offer_id: string | null;
  created_by: string;
  communication_type: "email" | "call" | "sms" | "system";
  direction: "inbound" | "outbound" | "internal";
  subject: string | null;
  content_summary: string | null;
  status: "pending" | "success" | "failed";
  external_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendOffer {
  id: string;
  lead_id: string;
  energy_demand_id: string | null;
  created_by: string;
  offer_number: string;
  version: number;
  provider_name: string;
  tariff_name: string;
  energy_type: "electricity" | "gas";
  monthly_price: number | null;
  annual_price: number | null;
  estimated_savings: number | null;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired" | "superseded";
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendStatusHistory {
  id: string;
  lead_id: string;
  old_status: BackendLeadStatus | null;
  new_status: BackendLeadStatus;
  changed_by: string;
  reason: string | null;
  created_at: string;
}

export interface BackendProfile {
  profileId: string;
  authUserId: string;
  role: BackendUserRole;
  full_name: string;
  email: string;
  is_active: boolean;
}

// ---------------------------------------------------------------------------
// Public Lead Submit — Request-Payload-Typen
// ---------------------------------------------------------------------------

export interface PublicLeadElectricityPayload {
  annual_consumption_kwh: number | null;
  consumption_known: boolean | null;
  current_provider?: string;
  monthly_payment?: number;
  contract_end_date?: string;
  price_guarantee?: boolean;
}

export interface PublicLeadGasPayload extends PublicLeadElectricityPayload {
  hot_water_with_gas: boolean | null;
  heating_type?: string;
  household_size?: number;
}

export interface PublicLeadPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  customer_type: BackendCustomerType;
  product_type: BackendProductType;
  privacy_consent: true;
  contact_consent: true;
  address: { postal_code: string; city: string; street?: string };
  turnstile_token: string;
  electricity?: PublicLeadElectricityPayload;
  gas?: PublicLeadGasPayload;
  // Felder ohne dedizierte DB-Spalte — landen in leads.notes via p_initial_note
  ziele?: string[];
  erreichbarkeit?: string;
  rechnung_dateiname?: string;
  rechnung_groesse_kb?: number;
  referral_code?: string;
}

// ---------------------------------------------------------------------------
// Referral-System
// ---------------------------------------------------------------------------

export interface BackendReferralCode {
  id: string;
  lead_id: string;
  code: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export interface BackendReferral {
  id: string;
  referrer_lead_id: string;
  referred_lead_id: string | null;
  code_used: string;
  status: "pending" | "qualified" | "paid" | "expired";
  reward_amount_cents: number;
  reward_type: string;
  payout_after: string | null;
  paid_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields (für Admin-Ansicht):
  referrer_name?: string;
  referrer_email?: string;
  referred_name?: string;
  referred_email?: string;
}

export interface BackendListResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

export interface BackendSingleResponse<T> {
  data: T;
}

// ---------------------------------------------------------------------------
// Blog CMS
// ---------------------------------------------------------------------------

export interface BlogArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  teaser: string;
  tag: string;
  image: string;
  author: string;
  body: BlogArticleSection[];
  seo_title: string | null;
  seo_description: string | null;
  read_time_min: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Mapping: Backend → Frontend
// ---------------------------------------------------------------------------

export function mapRole(backendRole: BackendUserRole): Role {
  return backendRole === "employee" ? "mitarbeiter" : backendRole;
}

export function mapLeadStatus(s: BackendLeadStatus): LeadStatus {
  const map: Record<BackendLeadStatus, LeadStatus> = {
    new: "neu",
    in_review: "in_pruefung",
    question_open: "rueckfrage",
    offer_created: "angebot_erstellt",
    offer_sent: "angebot_gesendet",
    interested: "interessiert",
    contract_prepared: "vertrag_vorbereitet",
    contract_sent: "vertrag_gesendet",
    completed: "abgeschlossen",
    rejected: "abgelehnt",
    unreachable: "nicht_erreichbar",
    follow_up: "wiedervorlage",
    disqualified: "abgelehnt",
    lost: "abgelehnt",
  };
  return map[s] ?? "neu";
}

export function mapLeadStatusToBackend(s: LeadStatus): BackendLeadStatus {
  const map: Record<LeadStatus, BackendLeadStatus> = {
    neu: "new",
    in_pruefung: "in_review",
    rueckfrage: "question_open",
    angebot_erstellt: "offer_created",
    angebot_gesendet: "offer_sent",
    interessiert: "interested",
    vertrag_vorbereitet: "contract_prepared",
    vertrag_gesendet: "contract_sent",
    abgeschlossen: "completed",
    abgelehnt: "rejected",
    nicht_erreichbar: "unreachable",
    wiedervorlage: "follow_up",
  };
  return map[s] ?? "new";
}

export function mapLeadType(
  productType: BackendProductType,
  customerType: BackendCustomerType,
): LeadType {
  if (
    customerType === "business" ||
    customerType === "property_management" ||
    customerType === "multi_location_company"
  ) {
    return "gewerbe";
  }
  switch (productType) {
    case "electricity":
      return "strom";
    case "gas":
      return "gas";
    case "both":
      return "strom_gas";
  }
}

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
