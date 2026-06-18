import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star, Building2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { providers } from "@/lib/mock-leads";

export const Route = createFileRoute("/mitarbeiter/anbieter")({
  head: () => ({
    meta: [{ title: "Anbieter – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ProvidersPage,
});

function ProvidersPage() {
  const [q, setQ] = useState("");
  const filtered = providers.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  function handleAdd() {
    toast.info("Anbieter hinzufügen – Feature in Kürze verfügbar");
  }

  function handleTarife(name: string) {
    toast.info(`Tarife für „${name}" – Feature in Kürze verfügbar`);
  }

  function handleEdit(name: string) {
    toast.info(`Bearbeiten von „${name}" – Feature in Kürze verfügbar`);
  }

  return (
    <AdminShell
      title="Energie-Anbieter"
      subtitle={`${providers.length} Anbieter im System · ${providers.filter((p) => p.partner).length} Partner`}
      actions={
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Anbieter hinzufügen
        </Button>
      }
    >
      <div className="mb-4 relative max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Anbieter suchen…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {p.type === "beide" ? "Strom & Gas" : p.type}
                    </div>
                  </div>
                </div>
                {p.partner && (
                  <Badge className="bg-emerald-500/15 text-emerald-700 border-0">Partner</Badge>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{p.tariffsCount} Tarife</span>
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {p.rating}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleTarife(p.name)}
                >
                  Tarife
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(p.name)}
                >
                  Bearbeiten
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
            Kein Anbieter gefunden.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
