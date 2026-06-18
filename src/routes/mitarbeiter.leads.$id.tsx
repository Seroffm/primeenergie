import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Zap,
  FileText,
  Send,
  Save,
  MessageSquare,
  Calendar,
  FileSignature,
  CheckCircle2,
  Upload,
  Download,
  Clock,
  RefreshCw,
  AlertCircle,
  Inbox,
  MoreVertical,
  CalendarClock,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { cn } from "@/lib/utils";
import { useAuth, roleBadgeLabel } from "@/lib/auth-context";
import {
  statusColor,
  statusLabel,
  typeLabel,
  type Lead,
  type LeadStatus,
  type LeadWiedervorlage,
} from "@/lib/mock-leads";
import { DEFAULT_WIEDERVORLAGE_TIME } from "@/lib/mock-tasks";
import {
  getLead as getBackendLead,
  getNotes,
  postNote,
  getDocuments,
  getDocumentDownloadUrl,
  getCommunications,
  getOffers,
  getStatusHistory,
  patchLeadStatus,
  assignLead,
  uploadDocument,
  getTeam,
} from "@/lib/api-client";
import type { TeamMember } from "@/lib/api-client";
import {
  mapLeadStatus,
  mapLeadType,
  mapLeadStatusToBackend,
  type BackendLeadDetail,
  type BackendNote,
  type BackendDocument,
  type BackendCommunication,
  type BackendOffer,
  type BackendStatusHistory,
} from "@/lib/api-types";

function mapBackendToLead(raw: BackendLeadDetail): Lead {
  const delivery = raw.addresses?.find((a) => a.address_type === "delivery");
  const electricity = raw.energy_demands?.find((e) => e.energy_type === "electricity");
  const gas = raw.energy_demands?.find((e) => e.energy_type === "gas");
  const demand = electricity ?? gas;
  return {
    id: raw.id,
    name: `${raw.first_name} ${raw.last_name}`,
    email: raw.email,
    phone: raw.phone ?? "",
    city: delivery?.city ?? "",
    plz: delivery?.postal_code ?? "",
    type: mapLeadType(raw.product_type, raw.customer_type),
    consumption: demand?.annual_consumption_kwh ?? 0,
    currentProvider: demand?.current_provider ?? "—",
    monthlyPayment: demand?.monthly_payment ?? 0,
    status: mapLeadStatus(raw.status),
    score: raw.score,
    assignee: raw.assigned_to ? raw.assigned_to.slice(0, 8) + "…" : "—",
    createdAt: raw.created_at,
    expectedSavings: 0,
    source: "Backend",
    hasInvoice: false,
    notes: [],
    documents: [],
    emails: [],
    offers: [],
    history: [],
    wiedervorlage: undefined,
  };
}

function formatDateDe(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE");
}
function formatTimeDe(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}
function formatDateTimeDe(iso: string) {
  return `${formatDateDe(iso)} um ${formatTimeDe(iso)} Uhr`;
}
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const Route = createFileRoute("/mitarbeiter/leads/$id")({
  head: () => ({
    meta: [{ title: "Lead Detail – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  loader: async ({ params }): Promise<{ lead: Lead; assignedToId: string | null }> => {
    try {
      const raw = await getBackendLead(params.id);
      return { lead: mapBackendToLead(raw), assignedToId: raw.assigned_to ?? null };
    } catch {
      throw notFound();
    }
  },
  notFoundComponent: () => (
    <AdminShell title="Lead nicht gefunden">
      <Button asChild variant="outline">
        <Link to="/mitarbeiter/leads">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Link>
      </Button>
    </AdminShell>
  ),
  errorComponent: () => (
    <AdminShell title="Fehler">
      <p>Lead konnte nicht geladen werden.</p>
    </AdminShell>
  ),
  component: LeadDetail,
});

const docColor: Record<string, string> = {
  rechnung: "bg-amber-500/15 text-amber-700",
  angebot: "bg-blue-500/15 text-blue-700",
  vertrag: "bg-emerald-500/15 text-emerald-700",
  sonstiges: "bg-slate-500/15 text-slate-700",
};

const offerStatusColor: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-700",
  sent: "bg-violet-500/15 text-violet-700",
  accepted: "bg-emerald-500/15 text-emerald-700",
  rejected: "bg-rose-500/15 text-rose-700",
  expired: "bg-orange-500/15 text-orange-700",
  superseded: "bg-gray-500/15 text-gray-700",
};

const offerStatusLabel: Record<string, string> = {
  draft: "Entwurf",
  sent: "Gesendet",
  accepted: "Angenommen",
  rejected: "Abgelehnt",
  expired: "Abgelaufen",
  superseded: "Ersetzt",
};

const commTypeIcon: Record<string, typeof Inbox> = {
  email: Mail,
  call: Phone,
  sms: MessageSquare,
  system: AlertCircle,
};

function LeadDetail() {
  const { lead: loaderLead, assignedToId: loaderAssignedToId } = Route.useLoaderData() as {
    lead: Lead;
    assignedToId: string | null;
  };
  const { id } = Route.useParams();
  const lead = loaderLead;
  const [assignedToId, setAssignedToId] = useState<string | null>(loaderAssignedToId);
  const { user: authUser } = useAuth();
  const user = authUser ?? {
    name: "Mitarbeiter",
    role: "mitarbeiter" as const,
    id: "",
    profileId: "",
    initials: "M",
    email: "",
  };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Status
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);

  // Note-Textarea
  const [note, setNote] = useState("");

  // Wiedervorlage – nur lokaler State (kein eigener Backend-Endpoint vorhanden)
  const [wiedervorlage, setWiedervorlage] = useState<LeadWiedervorlage | undefined>(
    lead.wiedervorlage,
  );

  // Aufgabe: kein echtes Task-System → statisch false
  const hasOpenTask = false;

  const [wvOpen, setWvOpen] = useState(false);
  const [wvDate, setWvDate] = useState("");
  const [wvTime, setWvTime] = useState("");
  const [wvComment, setWvComment] = useState("");

  const [callOpen, setCallOpen] = useState(false);
  const [callNote, setCallNote] = useState("");
  const [allDoneOpen, setAllDoneOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── React Query: Daten für alle Tabs ──────────────────────────────────────

  const notesQuery = useQuery({
    queryKey: ["lead-notes", id],
    queryFn: () => getNotes(id),
  });

  const docsQuery = useQuery({
    queryKey: ["lead-documents", id],
    queryFn: () => getDocuments(id),
  });

  const commsQuery = useQuery({
    queryKey: ["lead-communications", id],
    queryFn: () => getCommunications(id),
  });

  const offersQuery = useQuery({
    queryKey: ["lead-offers", id],
    queryFn: () => getOffers(id),
  });

  const historyQuery = useQuery({
    queryKey: ["lead-status-history", id],
    queryFn: () => getStatusHistory(id),
  });

  const teamQuery = useQuery({
    queryKey: ["team"],
    queryFn: getTeam,
  });

  const notes: BackendNote[] = notesQuery.data?.data ?? [];
  const docs: BackendDocument[] = docsQuery.data?.data ?? [];
  const comms: BackendCommunication[] = commsQuery.data?.data ?? [];
  const offers: BackendOffer[] = offersQuery.data?.data ?? [];
  const statusHistory: BackendStatusHistory[] = historyQuery.data?.data ?? [];

  // ── Mutations ─────────────────────────────────────────────────────────────

  const saveNoteMutation = useMutation({
    mutationFn: (text: string) => postNote(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-notes", id] });
      setNote("");
      toast.success("Notiz gespeichert");
    },
    onError: () => toast.error("Notiz konnte nicht gespeichert werden"),
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: LeadStatus) =>
      patchLeadStatus(id, mapLeadStatusToBackend(newStatus)),
    onSuccess: (_data, newStatus) => {
      queryClient.invalidateQueries({ queryKey: ["lead-status-history", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setCurrentStatus(newStatus);
      toast.success(`Status auf "${statusLabel[newStatus]}" aktualisiert`);
    },
    onError: () => toast.error("Status konnte nicht gespeichert werden"),
  });

  const assignMutation = useMutation({
    mutationFn: (assignedTo: string | null) => assignLead(id, assignedTo),
    onSuccess: (_data, assignedTo) => {
      setAssignedToId(assignedTo);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead zugewiesen");
    },
    onError: () => toast.error("Zuweisung fehlgeschlagen"),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-documents", id] });
      toast.success("Dokument hochgeladen");
    },
    onError: () => toast.error("Upload fehlgeschlagen"),
  });

  // ── Handler ───────────────────────────────────────────────────────────────

  function handleSaveNote() {
    const text = note.trim();
    if (!text) return;
    saveNoteMutation.mutate(text);
  }

  // Optimistic toggle (kein Backend-Endpoint für is_important)
  const [importantIds, setImportantIds] = useState<Set<string>>(new Set());
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);

  async function handleDocumentDownload(docId: string, fileName: string) {
    setDownloadingDocId(docId);
    try {
      const { url } = await getDocumentDownloadUrl(id, docId);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      toast.error("Download fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setDownloadingDocId(null);
    }
  }
  function toggleImportant(noteId: string) {
    setImportantIds((prev) => {
      const next = new Set(prev);
      next.has(noteId) ? next.delete(noteId) : next.add(noteId);
      return next;
    });
  }

  function handleStatusUpdate() {
    if (status === currentStatus) return;
    statusMutation.mutate(status);
  }

  function openWiedervorlage() {
    const today = new Date().toISOString().slice(0, 10);
    setWvDate(wiedervorlage?.date ? wiedervorlage.date.slice(0, 10) : today);
    setWvTime(wiedervorlage?.date ? wiedervorlage.date.slice(11, 16) : "");
    setWvComment(wiedervorlage?.comment ?? "");
    setWvOpen(true);
  }

  function handleSaveWiedervorlage() {
    if (!wvDate) return;
    const isUpdate = !!wiedervorlage;
    const time = wvTime || DEFAULT_WIEDERVORLAGE_TIME;
    const iso = `${wvDate}T${time}:00`;
    const now = new Date().toISOString();
    const wv: LeadWiedervorlage = {
      date: iso,
      comment: wvComment.trim() || undefined,
      createdBy: user.name,
      createdAt: now,
    };
    setWiedervorlage(wv);
    setWvOpen(false);
    toast.success(
      isUpdate ? "Wiedervorlage erfolgreich aktualisiert" : "Wiedervorlage erfolgreich gespeichert",
    );
  }

  function handleCompleteTask() {
    toast.success("Aufgabe als erledigt markiert");
  }

  function handleOpenNextTask() {
    setAllDoneOpen(true);
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCallDialog() {
    setCallNote("");
    setCallOpen(true);
  }

  function handleSaveCallNote() {
    const text = callNote.trim();
    if (!text) return;
    saveNoteMutation.mutate(`Telefonat: ${text}`);
    setCallOpen(false);
  }

  function handleQuickAction(label: string) {
    toast.info(`${label} – Feature in Kürze verfügbar`);
  }

  return (
    <AdminShell
      title={lead.name}
      subtitle={`${lead.id} · ${typeLabel[lead.type]} · ${lead.plz} ${lead.city}`}
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/mitarbeiter/leads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Link>
          </Button>
          <Button size="sm" onClick={() => handleQuickAction("Angebot senden")}>
            <Send className="mr-2 h-4 w-4" />
            Angebot senden
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Kontakt & Verbrauch</CardTitle>
              <Badge
                className={`${statusColor[currentStatus]} border-0 px-4 py-1.5 text-sm font-bold`}
              >
                {statusLabel[currentStatus]}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info icon={Mail} label="E-Mail" value={lead.email} />
              <Info icon={Phone} label="Telefon" value={lead.phone || "—"} />
              <Info icon={MapPin} label="Adresse" value={`${lead.plz} ${lead.city}`} />
              <Info icon={Zap} label="Aktueller Anbieter" value={lead.currentProvider} />
              <Info
                icon={Zap}
                label="Jahresverbrauch"
                value={`${lead.consumption.toLocaleString("de-DE")} kWh`}
              />
              <Info icon={FileText} label="Monatl. Abschlag" value={`${lead.monthlyPayment} €`} />
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Zugewiesen an</div>
                {user.role === "admin" || user.role === "manager" ? (
                  <Select
                    value={assignedToId ?? "unassigned"}
                    onValueChange={(v) =>
                      assignMutation.mutate(v === "unassigned" ? null : v)
                    }
                    disabled={assignMutation.isPending}
                  >
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Nicht zugewiesen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Nicht zugewiesen</SelectItem>
                      {(teamQuery.data ?? [])
                        .filter((m: TeamMember) => m.is_active)
                        .map((m: TeamMember) => (
                          <SelectItem key={m.auth_user_id} value={m.auth_user_id}>
                            {m.full_name ?? m.email ?? m.auth_user_id}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm font-medium">
                    {assignedToId
                      ? (teamQuery.data ?? []).find(
                          (m: TeamMember) => m.auth_user_id === assignedToId,
                        )?.full_name ?? assignedToId.slice(0, 8) + "…"
                      : "Nicht zugewiesen"}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="timeline">
                <div className="border-b px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="timeline">Verlauf</TabsTrigger>
                    <TabsTrigger value="notes">
                      Notizen ({notesQuery.isLoading ? "…" : notes.length})
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      Dokumente ({docsQuery.isLoading ? "…" : docs.length})
                    </TabsTrigger>
                    <TabsTrigger value="emails">
                      Komm. ({commsQuery.isLoading ? "…" : comms.length})
                    </TabsTrigger>
                    <TabsTrigger value="offers">
                      Angebote ({offersQuery.isLoading ? "…" : offers.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ── VERLAUF ────────────────────────────────────────────── */}
                <TabsContent value="timeline" className="p-6">
                  <Timeline lead={lead} status={currentStatus} noteCount={notes.length} />
                  {historyQuery.isLoading && (
                    <p className="mt-4 text-sm text-muted-foreground">Verlauf wird geladen…</p>
                  )}
                  {statusHistory.length > 0 && (
                    <div className="mt-8">
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                        Status-Verlauf
                      </h3>
                      <ul className="space-y-3">
                        {statusHistory.map((h) => (
                          <li key={h.id} className="rounded-lg border bg-muted/30 p-3 text-sm">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {h.old_status ?? "—"} → {h.new_status}
                              </span>
                              <span>{formatDateTimeDe(h.created_at)}</span>
                            </div>
                            {h.reason && <p className="mt-1">{h.reason}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                {/* ── NOTIZEN ─────────────────────────────────────────────── */}
                <TabsContent value="notes" className="space-y-4 p-6">
                  {notesQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Notizen werden geladen…</p>
                  )}
                  {!notesQuery.isLoading && notes.length === 0 && (
                    <p className="text-sm text-muted-foreground">Noch keine Notizen.</p>
                  )}
                  {notes.map((n) => {
                    const isImportant = importantIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "rounded-lg border bg-muted/30 p-4",
                          isImportant &&
                            "border-rose-400 bg-rose-50/60 dark:border-rose-500/60 dark:bg-rose-950/20",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{n.created_by}</span>
                            {isImportant && (
                              <Badge className="border-0 bg-rose-500/15 text-[10px] text-rose-700 dark:text-rose-300">
                                Wichtig
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-none items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDateTimeDe(n.created_at)}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  aria-label="Notiz-Aktionen"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleImportant(n.id)}>
                                  {isImportant ? "Markierung entfernen" : "Als wichtig markieren"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{n.note}</p>
                      </div>
                    );
                  })}
                  <div className="space-y-2 pt-2">
                    <Textarea
                      placeholder="Neue Notiz hinzufügen…"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleSaveNote}
                        disabled={!note.trim() || saveNoteMutation.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {saveNoteMutation.isPending ? "Speichern…" : "Speichern"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* ── DOKUMENTE ───────────────────────────────────────────── */}
                <TabsContent value="documents" className="space-y-3 p-6">
                  {docsQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Dokumente werden geladen…</p>
                  )}
                  {!docsQuery.isLoading && docs.length === 0 && (
                    <p className="text-sm text-muted-foreground">Noch keine Dokumente.</p>
                  )}
                  {docs.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-md bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{d.file_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {d.file_size_bytes ? formatFileSize(d.file_size_bytes) : "—"} ·{" "}
                            {formatDateDe(d.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${docColor[d.document_type] ?? docColor.sonstiges} border-0 capitalize`}
                        >
                          {d.document_type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`${d.file_name} herunterladen`}
                          disabled={downloadingDocId === d.id}
                          onClick={() => handleDocumentDownload(d.id, d.file_name)}
                        >
                          {downloadingDocId === d.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={handleFilesSelected}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadMutation.isPending ? "Hochladen…" : "Dokument hochladen"}
                  </Button>
                </TabsContent>

                {/* ── KOMMUNIKATION ───────────────────────────────────────── */}
                <TabsContent value="emails" className="space-y-3 p-6">
                  {commsQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Kommunikation wird geladen…</p>
                  )}
                  {!commsQuery.isLoading && comms.length === 0 && (
                    <p className="text-sm text-muted-foreground">Noch keine Kommunikation.</p>
                  )}
                  {comms.map((c) => {
                    const Icon = commTypeIcon[c.communication_type] ?? MessageSquare;
                    const isIn = c.direction === "inbound";
                    return (
                      <div key={c.id} className="flex gap-3 rounded-lg border p-3">
                        <div
                          className={`mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-full ${isIn ? "bg-blue-500/15 text-blue-600" : "bg-emerald-500/15 text-emerald-600"}`}
                        >
                          {isIn ? (
                            <Inbox className="h-4 w-4" />
                          ) : (
                            <Icon className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-2">
                            <span className="truncate text-sm font-medium">
                              {c.subject ?? c.communication_type}
                            </span>
                            <span className="flex-none text-xs text-muted-foreground">
                              {new Date(c.created_at).toLocaleString("de-DE")}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground capitalize">
                            {c.direction} · {c.communication_type} · {c.status}
                          </div>
                          {c.content_summary && (
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                              {c.content_summary}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                {/* ── ANGEBOTE ────────────────────────────────────────────── */}
                <TabsContent value="offers" className="space-y-3 p-6">
                  {offersQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Angebote werden geladen…</p>
                  )}
                  {!offersQuery.isLoading && offers.length === 0 && (
                    <p className="text-sm text-muted-foreground">Noch keine Angebote erstellt.</p>
                  )}
                  {offers.map((o) => (
                    <div key={o.id} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">
                            {o.provider_name} · {o.tariff_name}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {o.monthly_price ?? "—"} €/Monat ·{" "}
                            {o.annual_price?.toLocaleString("de-DE") ?? "—"} €/Jahr
                          </div>
                        </div>
                        <Badge
                          className={`${offerStatusColor[o.status] ?? "bg-slate-500/15 text-slate-700"} border-0 capitalize`}
                        >
                          {offerStatusLabel[o.status] ?? o.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t pt-3">
                        <div className="text-sm font-medium text-emerald-600">
                          Ersparnis: +{o.estimated_savings ?? 0} €/Jahr
                        </div>
                        {o.valid_until && (
                          <div className="text-xs text-muted-foreground">
                            Gültig bis: {new Date(o.valid_until).toLocaleDateString("de-DE")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleQuickAction("Neues Angebot erstellen")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Neues Angebot erstellen
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Aufgabe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasOpenTask ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Für diesen Lead liegt eine offene Aufgabe vor.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={handleCompleteTask}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Aufgabe abschließen
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keine offene Aufgabe für diesen Lead.
                </p>
              )}
              <Button className="w-full" size="sm" onClick={handleOpenNextTask}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Nächste Aufgabe öffnen
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead-Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div
                className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold ${lead.score > 80 ? "bg-emerald-500/10 text-emerald-600" : lead.score > 50 ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"}`}
              >
                {lead.score}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {lead.score > 80
                  ? "Heißer Lead – sofort kontaktieren"
                  : lead.score > 50
                    ? "Solider Lead"
                    : "Niedrige Priorität"}
              </p>
              <div className="mt-4 space-y-1 text-left text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Rechnung hochgeladen</span>
                  <span>{lead.hasInvoice ? "+15" : "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Telefon vorhanden</span>
                  <span>{lead.phone ? "+10" : "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verbrauch</span>
                  <span>+{Math.min(40, Math.round(lead.consumption / 200))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quelle: {lead.source}</span>
                  <span>+5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status ändern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                size="sm"
                onClick={handleStatusUpdate}
                disabled={status === currentStatus || statusMutation.isPending}
              >
                {statusMutation.isPending ? "Speichern…" : "Aktualisieren"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Erwartete Ersparnis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-emerald-600">
                +{lead.expectedSavings} €
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                pro Jahr · {typeLabel[lead.type]}
              </p>
            </CardContent>
          </Card>

          {wiedervorlage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Wiedervorlage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  {formatDateDe(wiedervorlage.date)}, {formatTimeDe(wiedervorlage.date)} Uhr
                </div>
                {wiedervorlage.comment && (
                  <p className="text-xs text-muted-foreground">{wiedervorlage.comment}</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={openCallDialog}
                disabled={!lead.phone}
              >
                <Phone className="mr-2 h-4 w-4" />
                Anrufen
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => handleQuickAction("E-Mail senden")}
              >
                <Mail className="mr-2 h-4 w-4" />
                E-Mail senden
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => handleQuickAction("Rückfrage senden")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Rückfrage senden
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => handleQuickAction("Angebot anfordern")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Angebot anfordern
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => handleQuickAction("Angebot senden")}
              >
                <Send className="mr-2 h-4 w-4" />
                Angebot senden
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => handleQuickAction("Vertrag vorbereiten")}
              >
                <FileSignature className="mr-2 h-4 w-4" />
                Vertrag vorbereiten
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => handleQuickAction("Vertrag senden")}
              >
                <FileSignature className="mr-2 h-4 w-4" />
                Vertrag senden
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={openWiedervorlage}
              >
                <Clock className="mr-2 h-4 w-4" />
                {wiedervorlage ? "Wiedervorlage bearbeiten" : "Wiedervorlage setzen"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => handleQuickAction("Lead neu zuweisen")}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Lead neu zuweisen
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-rose-600 hover:text-rose-700"
                size="sm"
                onClick={() => handleQuickAction("Lead ablehnen")}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Lead ablehnen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── DIALOGE ─────────────────────────────────────────────────────────── */}

      <Dialog open={wvOpen} onOpenChange={setWvOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wiedervorlage setzen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wv-date">Datum</Label>
                <Input
                  id="wv-date"
                  type="date"
                  value={wvDate}
                  onChange={(e) => setWvDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wv-time">Uhrzeit (optional)</Label>
                <Input
                  id="wv-time"
                  type="time"
                  value={wvTime}
                  onChange={(e) => setWvTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ohne Angabe: {DEFAULT_WIEDERVORLAGE_TIME} Uhr
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wv-comment">Kommentar</Label>
              <Textarea
                id="wv-comment"
                placeholder="z. B. Kunde morgen erneut anrufen"
                value={wvComment}
                onChange={(e) => setWvComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWvOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveWiedervorlage} disabled={!wvDate}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={callOpen} onOpenChange={setCallOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Anruf
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-5 text-center">
              <div className="text-lg font-semibold">{lead.name}</div>
              <div className="text-xs text-muted-foreground">{lead.id}</div>
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="mt-3 block text-3xl font-bold tracking-wider text-primary hover:underline"
              >
                {lead.phone || "Keine Telefonnummer hinterlegt"}
              </a>
              <Badge
                className={`${statusColor[currentStatus]} border-0 mt-3 px-4 py-1.5 text-sm font-bold`}
              >
                {statusLabel[currentStatus]}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="call-note">Gesprächsnotiz</Label>
              <Textarea
                id="call-note"
                placeholder="Was wurde im Telefonat besprochen?"
                value={callNote}
                onChange={(e) => setCallNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCallOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSaveCallNote}
              disabled={!callNote.trim() || saveNoteMutation.isPending}
            >
              {saveNoteMutation.isPending ? "Speichern…" : "Gesprächsnotiz speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={allDoneOpen} onOpenChange={setAllDoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alle Aufgaben erledigt</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Aktuell liegen keine fälligen Wiedervorlagen, Rückfragen oder neuen Leads vor. Starke
            Leistung!
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllDoneOpen(false)}>
              Schließen
            </Button>
            <Button onClick={() => navigate({ to: "/mitarbeiter/dashboard" })}>
              Zurück zum Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function Timeline({
  lead,
  status,
  noteCount,
}: {
  lead: Lead;
  status: LeadStatus;
  noteCount: number;
}) {
  const steps = [
    { icon: Calendar, label: "Lead eingegangen", date: lead.createdAt, done: true },
    {
      icon: MessageSquare,
      label: "Erstkontakt",
      date: noteCount > 0 ? lead.createdAt : undefined,
      done: status !== "neu",
    },
    {
      icon: FileText,
      label: "Angebot erstellt",
      date: undefined,
      done: [
        "angebot_erstellt",
        "angebot_gesendet",
        "interessiert",
        "vertrag_vorbereitet",
        "vertrag_gesendet",
        "abgeschlossen",
      ].includes(status),
    },
    {
      icon: Send,
      label: "Angebot gesendet",
      date: undefined,
      done: [
        "angebot_gesendet",
        "interessiert",
        "vertrag_vorbereitet",
        "vertrag_gesendet",
        "abgeschlossen",
      ].includes(status),
    },
    {
      icon: FileSignature,
      label: "Vertrag gesendet",
      date: undefined,
      done: ["vertrag_gesendet", "abgeschlossen"].includes(status),
    },
    {
      icon: CheckCircle2,
      label: "Abgeschlossen",
      date: undefined,
      done: status === "abgeschlossen",
    },
  ];
  return (
    <ol className="relative space-y-6 border-l-2 border-muted pl-6">
      {steps.map((t, i) => (
        <li key={i} className="relative">
          <div
            className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ${t.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <t.icon className="h-3 w-3" />
          </div>
          <div className="font-medium">{t.label}</div>
          <div className="text-xs text-muted-foreground">
            {t.date ? new Date(t.date).toLocaleString("de-DE") : "Ausstehend"}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}
