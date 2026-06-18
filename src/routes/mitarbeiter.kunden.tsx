import { createFileRoute } from "@tanstack/react-router";
import { Plus, Download, Mail, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";

export const Route = createFileRoute("/mitarbeiter/kunden")({
  head: () => ({
    meta: [{ title: "Kunden – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: KundenPage,
});

const customers = [
  {
    id: "K-001",
    name: "Thomas Richter",
    email: "t.richter@example.de",
    phone: "+49 171 2233445",
    contracts: 1,
    savings: 198,
    since: "2024-03-12",
    status: "Aktiv",
  },
  {
    id: "K-002",
    name: "Bäckerei Krüger GmbH",
    email: "info@baeckerei-krueger.de",
    phone: "+49 221 5544332",
    contracts: 2,
    savings: 4820,
    since: "2025-01-08",
    status: "Aktiv",
  },
  {
    id: "K-003",
    name: "Familie Schneider",
    email: "schneider@example.de",
    phone: "+49 162 9988221",
    contracts: 2,
    savings: 412,
    since: "2023-11-22",
    status: "Aktiv",
  },
  {
    id: "K-004",
    name: "Petra Lehmann",
    email: "p.lehmann@example.de",
    phone: "+49 152 7766554",
    contracts: 1,
    savings: 240,
    since: "2024-07-30",
    status: "Wechsel offen",
  },
  {
    id: "K-005",
    name: "Stadtcafé Linde",
    email: "kontakt@cafe-linde.de",
    phone: "+49 221 1122334",
    contracts: 1,
    savings: 1680,
    since: "2025-04-15",
    status: "Aktiv",
  },
];

function KundenPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.email.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  function handleAdd() {
    toast.info("Kunde anlegen – Feature in Kürze verfügbar");
  }

  function handleExport() {
    const headers = ["ID", "Name", "E-Mail", "Telefon", "Verträge", "Ersparnis", "Seit", "Status"];
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.contracts,
      `+${c.savings} €`,
      new Date(c.since).toLocaleDateString("de-DE"),
      c.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kunden_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV-Export gestartet");
  }

  return (
    <AdminShell
      title="Kunden"
      subtitle={`${customers.length} aktive Bestandskunden`}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Kunde anlegen
          </Button>
        </>
      }
    >
      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Kunde suchen…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Kunde</th>
                  <th className="px-6 py-3 font-medium">Kontakt</th>
                  <th className="px-6 py-3 font-medium">Verträge</th>
                  <th className="px-6 py-3 font-medium">Ersparnis / Jahr</th>
                  <th className="px-6 py-3 font-medium">Kunde seit</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40">
                    <td className="px-6 py-4">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {c.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{c.contracts}</td>
                    <td className="px-6 py-4 font-medium text-emerald-600">+{c.savings} €</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(c.since).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={c.status === "Aktiv" ? "default" : "secondary"}>
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      Keine Kunden gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
