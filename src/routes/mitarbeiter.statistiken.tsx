import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, FileSignature, Euro } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { employees } from "@/lib/mock-leads";
import { getLeads } from "@/lib/api-client";
import { mapLeadStatus } from "@/lib/api-types";
import type { BackendLead } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/statistiken")({
  head: () => ({
    meta: [{ title: "Statistiken – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: StatistikenPage,
});

function adaptLead(l: BackendLead) {
  return {
    id: l.id,
    status: mapLeadStatus(l.status),
    backendStatus: l.status,
    createdAt: l.created_at,
  };
}

function StatistikenPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => getLeads({ pageSize: 500 }),
  });

  const leads = useMemo(() => (data?.data ?? []).map(adaptLead), [data]);

  // KPIs aus echten Leads
  const total = data?.count ?? leads.length;
  const completed = leads.filter((l) => l.backendStatus === "completed").length;
  const offerSent = leads.filter((l) => l.backendStatus === "offer_sent").length;
  const conversionRate =
    total > 0 ? ((completed / total) * 100).toFixed(1) + " %" : "0,0 %";

  const kpi = [
    {
      label: "Leads gesamt",
      value: isLoading ? "…" : String(total),
      icon: Users,
    },
    {
      label: "Abschlüsse",
      value: isLoading ? "…" : String(completed),
      icon: FileSignature,
    },
    {
      label: "Umsatz",
      value: "—",
      icon: Euro,
    },
    {
      label: "Conversion",
      value: isLoading ? "…" : conversionRate,
      icon: TrendingUp,
    },
  ];

  // Monatschart: Gruppierung nach Monat (letzte 12 Monate)
  const monthly = useMemo(() => {
    const counts = new Array(12).fill(0);
    const now = new Date();
    for (const l of leads) {
      const d = new Date(l.createdAt);
      const diffMonths =
        (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diffMonths >= 0 && diffMonths < 12) {
        counts[11 - diffMonths] += 1;
      }
    }
    return counts;
  }, [leads]);

  const maxMonthly = Math.max(...monthly, 1);

  // Funnel-Werte aus echten Leads
  const funnelItems = useMemo(
    () => [
      { label: "Gesamt", value: leads.length },
      {
        label: "Angebot erstellt",
        value: leads.filter(
          (l) => l.backendStatus === "offer_created" || l.backendStatus === "offer_sent",
        ).length,
      },
      {
        label: "Vertrag vorbereitet",
        value: leads.filter(
          (l) =>
            l.backendStatus === "contract_prepared" || l.backendStatus === "contract_sent",
        ).length,
      },
      {
        label: "Abschluss",
        value: leads.filter((l) => l.backendStatus === "completed").length,
      },
    ],
    [leads],
  );

  return (
    <AdminShell title="Statistiken" subtitle="KPIs, Funnel, Quellen & Teamleistung">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{k.label}</div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <k.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-semibold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Monatschart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads pro Monat (letzte 12 Monate)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                Wird geladen…
              </div>
            ) : (
              <div className="flex h-48 items-end gap-2">
                {monthly.map((v, i) => {
                  const monthLabel = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 11 + i,
                    1,
                  ).toLocaleDateString("de-DE", { month: "short" });
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-primary to-emerald-400"
                        style={{ height: `${(v / maxMonthly) * 100}%` }}
                      />
                      <div className="text-[10px] text-muted-foreground">{monthLabel}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mitarbeiter-Ranking (aus Mock, da keine Aggregation per Lead vorhanden) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mitarbeiter-Ranking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[...employees]
              .sort((a, b) => b.closed - a.closed)
              .map((e, i) => (
                <div key={e.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="font-medium">{e.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{e.closed} Abschlüsse</span>
                  </div>
                  <Progress value={(e.closed / 20) * 100} className="h-2" />
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Conversion-Funnel aus echten Leads */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Conversion-Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelItems.map((f) => {
                const pct =
                  funnelItems[0].value > 0
                    ? Math.round((f.value / funnelItems[0].value) * 100)
                    : 0;
                return (
                  <div key={f.label} className="flex items-center gap-4">
                    <div className="w-40 text-sm">{f.label}</div>
                    <div className="flex-1">
                      <div className="h-6 overflow-hidden rounded bg-muted">
                        <div
                          className="flex h-full items-center justify-end bg-gradient-to-r from-primary to-emerald-500 px-2 text-xs font-medium text-primary-foreground"
                          style={{ width: `${pct}%` }}
                        >
                          {pct > 5 ? `${pct}%` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm tabular-nums">
                      {isLoading ? "…" : f.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Score-Verteilung */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead-Status-Verteilung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              {
                label: "Neu",
                count: leads.filter((l) => l.backendStatus === "new").length,
                color: "bg-blue-500",
              },
              {
                label: "In Prüfung",
                count: leads.filter((l) => l.backendStatus === "in_review").length,
                color: "bg-sky-500",
              },
              {
                label: "Angebot gesendet",
                count: offerSent,
                color: "bg-violet-500",
              },
              {
                label: "Abgeschlossen",
                count: completed,
                color: "bg-emerald-500",
              },
              {
                label: "Abgelehnt / Verloren",
                count: leads.filter(
                  (l) =>
                    l.backendStatus === "rejected" ||
                    l.backendStatus === "lost" ||
                    l.backendStatus === "disqualified",
                ).length,
                color: "bg-rose-500",
              },
            ].map((s) => {
              const pct = leads.length > 0 ? Math.round((s.count / leads.length) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex justify-between">
                    <span>{s.label}</span>
                    <span className="text-muted-foreground">
                      {isLoading ? "…" : s.count}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted">
                    <div className={`h-full ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
