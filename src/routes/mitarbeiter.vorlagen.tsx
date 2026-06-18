import { createFileRoute } from "@tanstack/react-router";
import { Plus, Mail, Edit, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { emailTemplates } from "@/lib/mock-leads";
import type { EmailTemplate } from "@/lib/mock-leads";

export const Route = createFileRoute("/mitarbeiter/vorlagen")({
  head: () => ({
    meta: [
      { title: "E-Mail-Vorlagen – Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  // Lokaler State für die aktiv/inaktiv-Schalter
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(emailTemplates.map((t) => [t.id, t.active])),
  );

  function handleToggle(t: EmailTemplate, checked: boolean) {
    setActiveMap((prev) => ({ ...prev, [t.id]: checked }));
    toast.success(`Vorlage „${t.name}" ${checked ? "aktiviert" : "deaktiviert"}`);
  }

  function handleAdd() {
    toast.info("Neue Vorlage – Feature in Kürze verfügbar");
  }

  function handleEdit(name: string) {
    toast.info(`Vorlage „${name}" bearbeiten – Feature in Kürze verfügbar`);
  }

  return (
    <AdminShell
      title="E-Mail-Vorlagen"
      subtitle="Automationen entlang des Lead-Funnels verwalten"
      actions={
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Vorlage
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {emailTemplates.map((t) => {
          const isActive = activeMap[t.id] ?? t.active;
          return (
            <Card key={t.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      Trigger: <span className="font-medium text-foreground">{t.trigger}</span>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => handleToggle(t, checked)}
                />
              </CardHeader>
              <CardContent>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Betreff</div>
                <div className="mt-1 text-sm font-medium">{t.subject}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Zuletzt bearbeitet: {new Date(t.lastEdited).toLocaleDateString("de-DE")}
                  </div>
                  <div className="flex gap-2">
                    {isActive ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 border-0">Aktiv</Badge>
                    ) : (
                      <Badge variant="outline">Pausiert</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(t.name)}>
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Bearbeiten
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
