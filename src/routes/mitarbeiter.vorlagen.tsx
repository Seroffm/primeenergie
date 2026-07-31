import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2, Mail, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createEmailTemplate,
  getEmailTemplates,
  updateEmailTemplate,
  type EmailTemplateInput,
} from "@/lib/api-client";
import type { BackendEmailTemplate } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/vorlagen")({
  head: () => ({
    meta: [
      { title: "E Mail Vorlagen – Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TemplatesPage,
});

const EMPTY_TEMPLATE: EmailTemplateInput = {
  name: "",
  subject: "",
  trigger_name: "",
  body: "",
  is_active: true,
};

function TemplatesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<BackendEmailTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<EmailTemplateInput>(EMPTY_TEMPLATE);
  const {
    data: templates = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["email-templates"], queryFn: getEmailTemplates });

  const saveMutation = useMutation({
    mutationFn: () => (editing ? updateEmailTemplate(editing.id, form) : createEmailTemplate(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success(editing ? "Vorlage gespeichert" : "Vorlage angelegt");
      setDialogOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ template, active }: { template: BackendEmailTemplate; active: boolean }) =>
      updateEmailTemplate(template.id, { is_active: active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["email-templates"] }),
    onError: (error: Error) => toast.error(error.message),
  });

  function openEditor(template?: BackendEmailTemplate) {
    setEditing(template ?? null);
    setForm(
      template
        ? {
            name: template.name,
            subject: template.subject,
            trigger_name: template.trigger_name,
            body: template.body,
            is_active: template.is_active,
          }
        : EMPTY_TEMPLATE,
    );
    setDialogOpen(true);
  }

  return (
    <AdminShell
      title="E Mail Vorlagen"
      subtitle="Gespeicherte Vorlagen entlang des Lead Ablaufs verwalten"
      actions={
        <Button size="sm" onClick={() => openEditor()}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Vorlage
        </Button>
      }
    >
      {isError && (
        <p className="mb-4 text-sm text-destructive">Vorlagen konnten nicht geladen werden.</p>
      )}
      {isLoading ? (
        <div className="grid h-40 place-items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      Auslöser:{" "}
                      <span className="font-medium text-foreground">{template.trigger_name}</span>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={template.is_active}
                  disabled={toggleMutation.isPending}
                  onCheckedChange={(active) => toggleMutation.mutate({ template, active })}
                />
              </CardHeader>
              <CardContent>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Betreff
                </div>
                <div className="mt-1 text-sm font-medium">{template.subject}</div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    Zuletzt bearbeitet: {new Date(template.updated_at).toLocaleDateString("de-DE")}
                  </div>
                  <div className="flex gap-2">
                    {template.is_active ? (
                      <Badge className="border-0 bg-emerald-500/15 text-emerald-700">Aktiv</Badge>
                    ) : (
                      <Badge variant="outline">Pausiert</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openEditor(template)}>
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Bearbeiten
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {templates.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
              Noch keine Vorlagen vorhanden.
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Vorlage bearbeiten" : "Vorlage anlegen"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="template-name">Name</Label>
              <Input
                id="template-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="template-trigger">Auslöser</Label>
              <Input
                id="template-trigger"
                value={form.trigger_name}
                onChange={(e) => setForm({ ...form, trigger_name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="template-subject">Betreff</Label>
              <Input
                id="template-subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="template-body">Inhalt</Label>
              <Textarea
                id="template-body"
                rows={8}
                placeholder="Optionaler Inhalt der Vorlage"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <label className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Aktiv</span>
              <Switch
                checked={form.is_active}
                onCheckedChange={(active) => setForm({ ...form, is_active: active })}
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              disabled={
                saveMutation.isPending ||
                form.name.trim().length < 2 ||
                form.subject.trim().length < 2 ||
                form.trigger_name.trim().length < 2
              }
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
