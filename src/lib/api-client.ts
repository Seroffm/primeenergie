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

async function authHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    : "";
  const res = await fetch(`${API_BASE}${path}${qs}`, {
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
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

// ---------------------------------------------------------------------------
// /api/leads
// ---------------------------------------------------------------------------

export async function getLeads(params?: {
  page?: number;
  pageSize?: number;
}): Promise<BackendListResponse<BackendLead>> {
  return get("/api/leads", {
    ...(params?.page ? { page: params.page } : {}),
    ...(params?.pageSize ? { pageSize: params.pageSize } : {}),
  });
}

export async function getLead(id: string): Promise<BackendLeadDetail> {
  const res = await get<BackendSingleResponse<BackendLeadDetail>>(`/api/leads/${id}`);
  return res.data;
}

export async function patchLeadStatus(
  id: string,
  status: BackendLeadStatus,
  reason?: string,
): Promise<void> {
  await patch(`/api/leads/${id}/status`, { status, reason });
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
  const res = await post<{ data: { id: string; email: string; role: string; temp_password: string } }>(
    "/api/team",
    payload,
  );
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

export async function submitPublicLead(payload: PublicLeadPayload): Promise<{
  lead_id: string;
  lead_number: string;
}> {
  const res = await fetch(`${API_BASE}/api/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
  const body = await res.json();
  return body.data;
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
  const res = await get<{ data: BackendReferral[] }>(
    "/api/referrals",
    status ? { status } : {},
  );
  return res.data;
}

export async function markReferralPaid(
  referralId: string,
  adminNotes?: string,
): Promise<void> {
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
