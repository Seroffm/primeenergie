import { supabase } from "./supabase";
import type {
  BackendLead,
  BackendLeadDetail,
  BackendNote,
  BackendDocument,
  BackendCommunication,
  BackendOffer,
  BackendStatusHistory,
  BackendProfile,
  BackendListResponse,
  BackendSingleResponse,
  BackendLeadStatus,
  PublicLeadPayload,
  BackendReferral,
  BlogArticle,
  BackendProvider,
  BackendTariff,
  BackendEmailTemplate,
} from "./api-types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function authHeaders(accessToken?: string): Promise<Record<string, string>> {
  if (accessToken) return { Authorization: `Bearer ${accessToken}` };
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function get<T>(
  path: string,
  params?: Record<string, string | number>,
  accessToken?: string,
): Promise<T> {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    : "";
  const res = await fetch(`${API_BASE}${path}${qs}`, {
    headers: { "Content-Type": "application/json", ...(await authHeaders(accessToken)) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? res.statusText, body.code);
  }
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
  return res.json();
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// /api/me
// ---------------------------------------------------------------------------

export async function getMe(): Promise<BackendProfile> {
  const res = await get<BackendSingleResponse<BackendProfile>>("/api/me");
  return res.data;
}

export async function getMeWithAccessToken(accessToken: string): Promise<BackendProfile> {
  const res = await get<BackendSingleResponse<BackendProfile>>("/api/me", undefined, accessToken);
  return res.data;
}

export async function updateMe(update: {
  full_name?: string;
  phone?: string | null;
  notification_prefs?: Record<string, boolean>;
}): Promise<BackendProfile> {
  const res = await patch<BackendSingleResponse<BackendProfile>>("/api/me", update);
  return res.data;
}

// ---------------------------------------------------------------------------
// CRM catalog
// ---------------------------------------------------------------------------

export type ProviderInput = Pick<
  BackendProvider,
  "name" | "energy_type" | "rating" | "is_partner"
> & { is_active?: boolean };

export async function getProviders(): Promise<BackendProvider[]> {
  return (await get<{ data: BackendProvider[] }>("/api/providers")).data;
}

export async function createProvider(input: ProviderInput): Promise<BackendProvider> {
  return (await post<{ data: BackendProvider }>("/api/providers", input)).data;
}

export async function updateProvider(
  id: string,
  input: Partial<ProviderInput>,
): Promise<BackendProvider> {
  return (await patch<{ data: BackendProvider }>(`/api/providers/${id}`, input)).data;
}

export type TariffInput = Pick<
  BackendTariff,
  | "provider_id"
  | "name"
  | "energy_type"
  | "segment"
  | "price_per_kwh"
  | "base_price"
  | "duration_months"
  | "price_guarantee_months"
  | "is_eco"
> & { is_active?: boolean };

export async function getTariffs(): Promise<BackendTariff[]> {
  return (await get<{ data: BackendTariff[] }>("/api/tariffs")).data;
}

export async function createTariff(input: TariffInput): Promise<BackendTariff> {
  return (await post<{ data: BackendTariff }>("/api/tariffs", input)).data;
}

export async function updateTariff(
  id: string,
  input: Partial<TariffInput>,
): Promise<BackendTariff> {
  return (await patch<{ data: BackendTariff }>(`/api/tariffs/${id}`, input)).data;
}

export type EmailTemplateInput = Pick<
  BackendEmailTemplate,
  "name" | "subject" | "trigger_name" | "body" | "is_active"
>;

export async function getEmailTemplates(): Promise<BackendEmailTemplate[]> {
  return (await get<{ data: BackendEmailTemplate[] }>("/api/email-templates")).data;
}

export async function createEmailTemplate(
  input: EmailTemplateInput,
): Promise<BackendEmailTemplate> {
  return (await post<{ data: BackendEmailTemplate }>("/api/email-templates", input)).data;
}

export async function updateEmailTemplate(
  id: string,
  input: Partial<EmailTemplateInput>,
): Promise<BackendEmailTemplate> {
  return (await patch<{ data: BackendEmailTemplate }>(`/api/email-templates/${id}`, input)).data;
}

// ---------------------------------------------------------------------------
// /api/leads
// ---------------------------------------------------------------------------

export async function getLeads(params?: {
  page?: number;
  pageSize?: number;
  q?: string;
}): Promise<BackendListResponse<BackendLead>> {
  return get("/api/leads", {
    ...(params?.page ? { page: params.page } : {}),
    ...(params?.pageSize ? { pageSize: params.pageSize } : {}),
    ...(params?.q ? { q: params.q } : {}),
  });
}

export async function getLead(id: string): Promise<BackendLeadDetail> {
  const res = await get<BackendSingleResponse<BackendLeadDetail>>(`/api/leads/${id}`);
  return res.data;
}

export async function patchLeadStatus(
  id: string,
  status: BackendLeadStatus,
  options?: {
    reason?: string;
    followUpAt?: string | null;
    followUpNote?: string | null;
  },
): Promise<void> {
  await patch(`/api/leads/${id}/status`, {
    status,
    reason: options?.reason,
    followUpAt: options?.followUpAt,
    followUpNote: options?.followUpNote,
  });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/notes
// ---------------------------------------------------------------------------

export async function getNotes(leadId: string): Promise<BackendListResponse<BackendNote>> {
  return get(`/api/leads/${leadId}/notes`, { pageSize: 100 });
}

export async function postNote(leadId: string, note: string): Promise<BackendNote> {
  const res = await post<BackendSingleResponse<BackendNote>>(`/api/leads/${leadId}/notes`, {
    note,
  });
  return res.data;
}

// ---------------------------------------------------------------------------
// /api/leads/:id/documents
// ---------------------------------------------------------------------------

export async function getDocuments(leadId: string): Promise<BackendListResponse<BackendDocument>> {
  return get(`/api/leads/${leadId}/documents`, { pageSize: 100 });
}

export async function getDocumentDownloadUrl(
  leadId: string,
  docId: string,
): Promise<{ url: string; file_name: string }> {
  const res = await get<{ data: { url: string; file_name: string } }>(
    `/api/leads/${leadId}/documents/${docId}/url`,
  );
  return res.data;
}

export async function deleteDocument(leadId: string, docId: string): Promise<void> {
  await del(`/api/leads/${leadId}/documents/${docId}`);
}

// ---------------------------------------------------------------------------
// /api/leads/:id/communications
// ---------------------------------------------------------------------------

export async function getCommunications(
  leadId: string,
): Promise<BackendListResponse<BackendCommunication>> {
  return get(`/api/leads/${leadId}/communications`, { pageSize: 100 });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/offers
// ---------------------------------------------------------------------------

export async function getOffers(leadId: string): Promise<BackendListResponse<BackendOffer>> {
  return get(`/api/leads/${leadId}/offers`, { pageSize: 100 });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/status-history
// ---------------------------------------------------------------------------

export async function getStatusHistory(
  leadId: string,
): Promise<BackendListResponse<BackendStatusHistory>> {
  return get(`/api/leads/${leadId}/status-history`, { pageSize: 100 });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/assign
// ---------------------------------------------------------------------------

export async function assignLead(leadId: string, assignedTo: string | null): Promise<void> {
  await patch(`/api/leads/${leadId}/assign`, { assigned_to: assignedTo });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/documents/upload
// ---------------------------------------------------------------------------

export async function uploadDocument(leadId: string, file: File): Promise<BackendDocument> {
  const headers = await authHeaders();
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/api/leads/${leadId}/documents/upload`, {
    method: "POST",
    headers, // kein Content-Type — Browser setzt multipart/form-data automatisch
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText);
  }
  const body = await res.json();
  return body.data;
}

// ---------------------------------------------------------------------------
// /api/team
// ---------------------------------------------------------------------------

export interface TeamMember {
  id: string;
  auth_user_id: string;
  full_name: string | null;
  email: string | null;
  role: "employee" | "manager" | "admin";
  is_active: boolean;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export async function getTeam(): Promise<TeamMember[]> {
  const res = await get<{ data: TeamMember[] }>("/api/team");
  return res.data;
}

export async function inviteTeamMember(payload: {
  email: string;
  full_name?: string;
  role?: string;
}): Promise<{ id: string; email: string; role: string; temp_password: string }> {
  const res = await post<{
    data: { id: string; email: string; role: string; temp_password: string };
  }>("/api/team", payload);
  return res.data;
}

export async function updateTeamMember(
  profileId: string,
  update: { role?: string; is_active?: boolean; full_name?: string; phone?: string },
): Promise<void> {
  await patch(`/api/team/${profileId}`, update);
}

// ---------------------------------------------------------------------------
// /api/public/leads  (kein Auth – Turnstile-Token erforderlich)
// ---------------------------------------------------------------------------

export async function submitPublicLead(
  payload: PublicLeadPayload,
  invoiceFiles: File[] = [],
): Promise<{
  lead_id: string;
  lead_number: string;
  invoice_uploaded: boolean;
}> {
  const hasInvoiceFiles = invoiceFiles.length > 0;
  const requestBody = hasInvoiceFiles
    ? (() => {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        invoiceFiles.forEach((invoiceFile) => formData.append("invoice", invoiceFile));
        return formData;
      })()
    : JSON.stringify(payload);

  const res = await fetch(`${API_BASE}/api/public/leads`, {
    method: "POST",
    headers: hasInvoiceFiles ? undefined : { "Content-Type": "application/json" },
    body: requestBody,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
  const responseBody = await res.json();
  return responseBody.data;
}

// ---------------------------------------------------------------------------
// Referral-System
// ---------------------------------------------------------------------------

export async function validateReferralCode(
  code: string,
): Promise<{ valid: boolean; referrer_name?: string }> {
  const res = await fetch(`${API_BASE}/api/referral-validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const body = await res.json();
  return body.data;
}

export async function requestReferralCode(email: string): Promise<void> {
  await fetch(`${API_BASE}/api/referral-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function getReferrals(status?: string): Promise<BackendReferral[]> {
  const res = await get<{ data: BackendReferral[] }>("/api/referrals", status ? { status } : {});
  return res.data;
}

export async function markReferralPaid(referralId: string, adminNotes?: string): Promise<void> {
  await patch(`/api/referrals/${referralId}/pay`, { admin_notes: adminNotes });
}

// ---------------------------------------------------------------------------
// Blog CMS
// ---------------------------------------------------------------------------

export async function getPublishedArticles(tag?: string): Promise<BlogArticle[]> {
  const params: Record<string, string> = {};
  if (tag) params.tag = tag;
  const res = await get<{ data: BlogArticle[]; count: number }>("/api/blog/articles", params);
  return res.data;
}

export async function getArticleBySlug(slug: string): Promise<BlogArticle> {
  const res = await get<{ data: BlogArticle }>(`/api/blog/articles/${slug}`);
  return res.data;
}

export async function getAdminArticles(): Promise<BlogArticle[]> {
  const res = await get<{ data: BlogArticle[]; count: number }>("/api/admin/blog/articles");
  return res.data;
}

export async function createArticle(data: Partial<BlogArticle>): Promise<BlogArticle> {
  const res = await post<{ data: BlogArticle }>("/api/admin/blog/articles", data);
  return res.data;
}

export async function updateArticle(id: string, data: Partial<BlogArticle>): Promise<BlogArticle> {
  const res = await patch<{ data: BlogArticle }>(`/api/admin/blog/articles/${id}`, data);
  return res.data;
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  await del(`/api/admin/blog/articles/${id}`);
}
