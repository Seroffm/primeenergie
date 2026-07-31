import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2, Plus, Search, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createProvider, getProviders, updateProvider, type ProviderInput } from "@/lib/api-client";
import type { BackendProvider } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/anbieter")({
  head: () => ({
    meta: [{ title: "Anbieter – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ProvidersPage,
});

const EMPTY_PROVIDER: ProviderInput = {
  name: "",
  energy_type: "beide",
  rating: 0,
  is_partner: false,
};

function ProvidersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<BackendProvider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ProviderInput>(EMPTY_PROVIDER);
  const {
    data: providers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["providers"],
    queryFn: getProviders,
  });

  const saveMutation = useMutation({
    mutationFn: () => (editing ? updateProvider(editing.id, form) : createProvider(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
      toast.success(editing ? "Anbieter gespeichert" : "Anbieter angelegt");
      setDialogOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filtered = providers.filter((provider) =>
    provider.name.toLowerCase().includes(q.toLowerCase()),
  );

  function openEditor(provider?: BackendProvider) {
    setEditing(provider ?? null);
    setForm(
      provider
        ? {
            name: provider.name,
            energy_type: provider.energy_type,
            rating: Number(provider.rating),
            is_partner: provider.is_partner,
            is_active: provider.is_active,
          }
        : EMPTY_PROVIDER,
    );
    setDialogOpen(true);
  }

  return (
    <AdminShell
      title="Energie Anbieter"
      subtitle={`${providers.length} Anbieter im System · ${providers.filter((p) => p.is_partner).length} Partner`}
      actions={
        <Button size="sm" onClick={() => openEditor()}>
          <Plus className="mr-2 h-4 w-4" /> Anbieter hinzufügen
        </Button>
      }
    >
      <div className="relative mb-4 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Anbieter suchen…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>
      {isError && (
        <p className="mb-4 text-sm text-destructive">Anbieter konnten nicht geladen werden.</p>
      )}
      {isLoading ? (
        <div className="grid h-40 place-items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((provider) => (
            <Card key={provider.id} className={!provider.is_active ? "opacity-60" : undefined}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{provider.name}</div>
                      <div className="text-xs capitalize text-muted-foreground">
                        {provider.energy_type === "beide" ? "Strom und Gas" : provider.energy_type}
                      </div>
                    </div>
                  </div>
                  {provider.is_partner && (
                    <Badge className="border-0 bg-emerald-500/15 text-emerald-700">Partner</Badge>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {provider.tariffs?.[0]?.count ?? 0} Tarife
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
                    {Number(provider.rating).toFixed(1)}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate({ to: "/mitarbeiter/tarife" })}
                  >
                    Tarife
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditor(provider)}
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
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Anbieter bearbeiten" : "Anbieter hinzufügen"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="provider-name">Name</Label>
              <Input
                id="provider-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="provider-type">Energieart</Label>
              <select
                id="provider-type"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.energy_type}
                onChange={(e) =>
                  setForm({ ...form, energy_type: e.target.value as ProviderInput["energy_type"] })
                }
              >
                <option value="strom">Strom</option>
                <option value="gas">Gas</option>
                <option value="beide">Strom und Gas</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="provider-rating">Bewertung</Label>
              <Input
                id="provider-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              />
            </div>
            <label className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Partner</span>
              <Switch
                checked={form.is_partner}
                onCheckedChange={(value) => setForm({ ...form, is_partner: value })}
              />
            </label>
            {editing && (
              <label className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">Aktiv</span>
                <Switch
                  checked={form.is_active ?? true}
                  onCheckedChange={(value) => setForm({ ...form, is_active: value })}
                />
              </label>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              disabled={saveMutation.isPending || form.name.trim().length < 2}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? "Speichern…" : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
