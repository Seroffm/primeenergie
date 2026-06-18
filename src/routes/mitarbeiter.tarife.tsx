import { createFileRoute } from "@tanstack/react-router";
import { Plus, Leaf, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { tariffs } from "@/lib/mock-leads";

export const Route = createFileRoute("/mitarbeiter/tarife")({
  head: () => ({
    meta: [{ title: "Tarife – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: TariffsPage,
});

function TariffsPage() {
  const [filter, setFilter] = useState<"alle" | "strom" | "gas">("alle");
  const filtered = tariffs.filter((t) => filter === "alle" || t.type === filter);

  function handleAdd() {
    toast.info("Tarif anlegen – Feature in Kürze verfügbar");
  }

  function handleFilter() {
    toast.info("Erweiterte Filter – Feature in Kürze verfügbar");
  }

  function handleEdit(name: string) {
    toast.info(`Tarif „${name}" bearbeiten – Feature in Kürze verfügbar`);
  }

  return (
    <AdminShell
      title="Tarife"
      subtitle={`${tariffs.length} aktive Tarife · ${tariffs.filter((t) => t.eco).length} Ökotarife`}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={handleFilter}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tarif anlegen
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as "alle" | "strom" | "gas")}>
          <TabsList>
            <TabsTrigger value="alle">Alle</TabsTrigger>
            <TabsTrigger value="strom">Strom</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Tarif</th>
                  <th className="px-6 py-3 font-medium">Typ</th>
                  <th className="px-6 py-3 font-medium">Segment</th>
                  <th className="px-6 py-3 font-medium">ct/kWh</th>
                  <th className="px-6 py-3 font-medium">Grundpreis</th>
                  <th className="px-6 py-3 font-medium">Laufzeit</th>
                  <th className="px-6 py-3 font-medium">Preisgar.</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/40">
                    <td className="px-6 py-4">
                      <div className="font-medium">{t.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {t.provider}
                        {t.eco && (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <Leaf className="h-3 w-3" />
                            Öko
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {t.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 capitalize text-muted-foreground">{t.segment}</td>
                    <td className="px-6 py-4 font-medium">{t.pricePerKwh.toFixed(2)}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {t.basePrice.toFixed(2)} €/Mt
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{t.duration} Mt</td>
                    <td className="px-6 py-4 text-muted-foreground">{t.priceGuarantee} Mt</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(t.name)}>
                        Bearbeiten
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      Keine Tarife gefunden.
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
