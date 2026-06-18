import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Gift,
  Users,
  Euro,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { getReferrals, markReferralPaid } from "@/lib/api-client";
import type { BackendReferral } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/referrals")({
  head: () => ({
    meta: [
      { title: "Referrals – Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ReferralsPage,
});

type StatusFilter = "all" | "pending" | "qualified" | "paid" | "expired";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "pending", label: "Offen" },
  { value: "qualified", label: "Qualifiziert" },
  { value: "paid", label: "Bezahlt" },
  { value: "expired", label: "Abgelaufen" },
];

const STATUS_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  pending: { label: "Offen", className: "bg-blue-500/15 text-blue-700" },
  qualified: { label: "Qualifiziert", className: "bg-amber-500/15 text-amber-700" },
  paid: { label: "Bezahlt", className: "bg-green-500/15 text-green-700" },
  expired: { label: "Abgelaufen", className: "bg-slate-500/15 text-slate-600" },
};

function formatDate(iso: string | null): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatEur(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function isPayoutDue(payoutAfter: string | null): boolean {
  if (!payoutAfter) return false;
  return new Date(payoutAfter) <= new Date();
}

function ReferralsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [payDialog, setPayDialog] = useState<BackendReferral | null>(null);

  const { data: referrals = [], isLoading, isError } = useQuery({
    queryKey: ["referrals", statusFilter],
    queryFn: () => getReferrals(statusFilter === "all" ? undefined : statusFilter),
  });

  const payMutation = useMutation({
    mutationFn: (referral: BackendReferral) =>
      markReferralPaid(referral.id, undefined),
    onSuccess: () => {
      toast.success("Referral als bezahlt markiert.");
      void queryClient.invalidateQueries({ queryKey: ["referrals"] });
      setPayDialog(null);
    },
    onError: (e: Error) => {
      toast.error(e.message ?? "Fehler beim Markieren als bezahlt.");
    },
  });

  // Statistiken berechnen
  const allReferrals = referrals;
  const pendingCount = allReferrals.filter((r) => r.status === "pending").length;
  const qualifiedCount = allReferrals.filter((r) => r.status === "qualified").length;
  const paidCount = allReferrals.filter((r) => r.status === "paid").length;
  const totalPaidEur = allReferrals
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.reward_amount_cents, 0);

  const stats = [
    { label: "Offen", value: pendingCount, icon: Clock, color: "text-blue-600" },
    { label: "Zu auszahlen", value: qualifiedCount, icon: AlertCircle, color: "text-amber-600" },
    { label: "Bezahlt", value: paidCount, icon: CheckCircle2, color: "text-green-600" },
    {
      label: "Gesamt ausgezahlt",
      value: formatEur(totalPaidEur),
      icon: Euro,
      color: "text-primary",
    },
  ];

  return (
    <AdminShell title="Referral-Prämien" subtitle="Übersicht aller Empfehlungen und Auszahlungen">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold text-primary">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filter-Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:bg-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabelle */}
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Wird geladen…</div>
        ) : isError ? (
          <div className="py-12 text-center text-destructive">
            Fehler beim Laden der Referrals.
          </div>
        ) : referrals.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface py-16 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-semibold text-primary">Keine Referrals gefunden</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {statusFilter === "all"
                ? "Es liegen noch keine Empfehlungen vor."
                : `Keine Referrals mit Status „${STATUS_BADGE[statusFilter]?.label ?? statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Werber</th>
                  <th className="px-4 py-3">Geworbener</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Prämie</th>
                  <th className="px-4 py-3">Fällig ab</th>
                  {isAdmin && <th className="px-4 py-3">Aktion</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {referrals.map((referral) => {
                  const statusInfo = STATUS_BADGE[referral.status] ?? {
                    label: referral.status,
                    className: "bg-slate-500/15 text-slate-600",
                  };
                  const canPay =
                    isAdmin &&
                    referral.status === "qualified" &&
                    isPayoutDue(referral.payout_after);

                  return (
                    <tr key={referral.id} className="bg-background hover:bg-surface/50">
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(referral.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-primary">
                          {referral.referrer_name ?? "–"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {referral.referrer_email ?? ""}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-primary">
                          {referral.referred_name ?? "–"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {referral.referred_email ?? ""}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-surface px-2 py-0.5 font-mono text-xs text-primary">
                          {referral.code_used}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusInfo.className}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        {formatEur(referral.reward_amount_cents)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(referral.payout_after)}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          {canPay ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPayDialog(referral)}
                              className="border-success text-success hover:bg-success/10"
                            >
                              Als bezahlt markieren
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">–</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bestätigungs-Dialog */}
      <Dialog open={payDialog !== null} onOpenChange={(open) => !open && setPayDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prämie als bezahlt markieren</DialogTitle>
            <DialogDescription>
              Haben Sie den 30-€-Amazon-Gutschein wirklich an{" "}
              <strong>{payDialog?.referrer_name ?? "diesen Kunden"}</strong> gesendet?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Werber:</span>
              <span className="font-medium text-primary">{payDialog?.referrer_name ?? "–"}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>E-Mail:</span>
              <span className="font-medium text-primary">{payDialog?.referrer_email ?? "–"}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Prämie:</span>
              <span className="font-medium text-primary">
                {payDialog ? formatEur(payDialog.reward_amount_cents) : "–"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialog(null)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => payDialog && payMutation.mutate(payDialog)}
              disabled={payMutation.isPending}
              className="bg-success text-white hover:bg-success/90"
            >
              {payMutation.isPending ? "Wird gespeichert…" : "Ja, als bezahlt markieren"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
