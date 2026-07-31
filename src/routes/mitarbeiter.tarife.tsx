import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Leaf, Loader2, Plus } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createTariff,
  getProviders,
  getTariffs,
  updateTariff,
  type TariffInput,
} from "@/lib/api-client";
import type { BackendTariff } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/tarife")({
  head: () => ({
    meta: [{ title: "Tarife – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: TariffsPage,
});

function emptyTariff(providerId = ""): TariffInput {
  return {
    provider_id: providerId,
    name: "",
    energy_type: "strom",
    segment: "privat",
    price_per_kwh: 0,
    base_price: 0,
    duration_months: 12,
    price_guarantee_months: 12,
    is_eco: false,
  };
}

function TariffsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"alle" | "strom" | "gas">("alle");
  const [editing, setEditing] = useState<BackendTariff | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TariffInput>(emptyTariff());
  const {
    data: tariffs = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["tariffs"], queryFn: getTariffs });
  const { data: providers = [] } = useQuery({ queryKey: ["providers"], queryFn: getProviders });
  const filtered = tariffs.filter((tariff) => filter === "alle" || tariff.energy_type === filter);

  const saveMutation = useMutation({
    mutationFn: () => (editing ? updateTariff(editing.id, form) : createTariff(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success(editing ? "Tarif gespeichert" : "Tarif angelegt");
      setDialogOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openEditor(tariff?: BackendTariff) {
    setEditing(tariff ?? null);
    setForm(
      tariff
        ? {
            provider_id: tariff.provider_id,
            name: tariff.name,
            energy_type: tariff.energy_type,
            segment: tariff.segment,
            price_per_kwh: Number(tariff.price_per_kwh),
            base_price: Number(tariff.base_price),
            duration_months: tariff.duration_months,
            price_guarantee_months: tariff.price_guarantee_months,
            is_eco: tariff.is_eco,
            is_active: tariff.is_active,
          }
        : emptyTariff(providers[0]?.id),
    );
    setDialogOpen(true);
  }

  return (
    <AdminShell
      title="Tarife"
      subtitle={`${tariffs.filter((t) => t.is_active).length} aktive Tarife · ${tariffs.filter((t) => t.is_eco).length} Ökotarife`}
      actions={
        <Button size="sm" onClick={() => openEditor()} disabled={!providers.length}>
          <Plus className="mr-2 h-4 w-4" />
          Tarif anlegen
        </Button>
      }
    >
      <div className="mb-4">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList>
            <TabsTrigger value="alle">Alle</TabsTrigger>
            <TabsTrigger value="strom">Strom</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {isError && (
        <p className="mb-4 text-sm text-destructive">Tarife konnten nicht geladen werden.</p>
      )}
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
                  <th className="px-6 py-3 font-medium">Preisgarantie</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </td>
                  </tr>
                ) : (
                  filtered.map((tariff) => (
                    <tr
                      key={tariff.id}
                      className={!tariff.is_active ? "opacity-60" : "hover:bg-muted/40"}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{tariff.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {tariff.providers?.name ?? "Unbekannter Anbieter"}
                          {tariff.is_eco && (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <Leaf className="h-3 w-3" />
                              Öko
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {tariff.energy_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">
                        {tariff.segment}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {Number(tariff.price_per_kwh).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {Number(tariff.base_price).toFixed(2)} € pro Monat
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {tariff.duration_months} Monate
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {tariff.price_guarantee_months} Monate
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditor(tariff)}>
                          Bearbeiten
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                      Keine Tarife gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Tarif bearbeiten" : "Tarif anlegen"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tariff-name">Name</Label>
              <Input
                id="tariff-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tariff-provider">Anbieter</Label>
              <select
                id="tariff-provider"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.provider_id}
                onChange={(e) => setForm({ ...form, provider_id: e.target.value })}
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            <SelectField
              id="tariff-type"
              label="Energieart"
              value={form.energy_type}
              onChange={(value) =>
                setForm({ ...form, energy_type: value as TariffInput["energy_type"] })
              }
              options={[
                ["strom", "Strom"],
                ["gas", "Gas"],
              ]}
            />
            <SelectField
              id="tariff-segment"
              label="Segment"
              value={form.segment}
              onChange={(value) => setForm({ ...form, segment: value as TariffInput["segment"] })}
              options={[
                ["privat", "Privat"],
                ["gewerbe", "Gewerbe"],
              ]}
            />
            <NumberField
              id="tariff-energy-price"
              label="Arbeitspreis in ct/kWh"
              value={form.price_per_kwh}
              onChange={(value) => setForm({ ...form, price_per_kwh: value })}
              step="0.01"
            />
            <NumberField
              id="tariff-base-price"
              label="Grundpreis pro Monat"
              value={form.base_price}
              onChange={(value) => setForm({ ...form, base_price: value })}
              step="0.01"
            />
            <NumberField
              id="tariff-duration"
              label="Laufzeit in Monaten"
              value={form.duration_months}
              onChange={(value) => setForm({ ...form, duration_months: value })}
            />
            <NumberField
              id="tariff-guarantee"
              label="Preisgarantie in Monaten"
              value={form.price_guarantee_months}
              onChange={(value) => setForm({ ...form, price_guarantee_months: value })}
            />
            <label className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Ökotarif</span>
              <Switch
                checked={form.is_eco}
                onCheckedChange={(value) => setForm({ ...form, is_eco: value })}
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
              disabled={saveMutation.isPending || !form.provider_id || form.name.trim().length < 2}
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

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
function NumberField({
  id,
  label,
  value,
  step = "1",
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  step?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
