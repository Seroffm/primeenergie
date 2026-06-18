import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Mail, Phone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { getTeam, inviteTeamMember, updateTeamMember } from "@/lib/api-client";
import type { TeamMember } from "@/lib/api-client";

export const Route = createFileRoute("/mitarbeiter/team")({
  head: () => ({
    meta: [{ title: "Team – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: TeamPage,
});

const roleColor: Record<string, string> = {
  admin: "bg-violet-500/15 text-violet-700",
  manager: "bg-blue-500/15 text-blue-700",
  employee: "bg-slate-500/15 text-slate-700",
  mitarbeiter: "bg-slate-500/15 text-slate-700",
};

const roleLabelMap: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  employee: "Mitarbeiter",
  mitarbeiter: "Mitarbeiter",
};

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function TeamPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"employee" | "manager" | "admin">("employee");

  const { data: members = [], isLoading, isError } = useQuery({
    queryKey: ["team"],
    queryFn: getTeam,
  });

  const activeCount = members.filter((m) => m.is_active).length;

  const inviteMutation = useMutation({
    mutationFn: () =>
      inviteTeamMember({
        email: inviteEmail.trim(),
        full_name: inviteName.trim() || undefined,
        role: inviteRole,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("employee");
      toast.success("Eingeladen! Temp-Passwort: " + result.temp_password);
    },
    onError: () => toast.error("Einladung fehlgeschlagen"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ profileId, role }: { profileId: string; role: string }) =>
      updateTeamMember(profileId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Rolle aktualisiert");
    },
    onError: () => toast.error("Rolle konnte nicht geändert werden"),
  });

  const activeMutation = useMutation({
    mutationFn: ({ profileId, is_active }: { profileId: string; is_active: boolean }) =>
      updateTeamMember(profileId, { is_active }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success(vars.is_active ? "Mitarbeiter aktiviert" : "Mitarbeiter deaktiviert");
    },
    onError: () => toast.error("Aktion fehlgeschlagen"),
  });

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteMutation.mutate();
  }

  return (
    <AdminShell
      title="Team"
      subtitle={
        isLoading
          ? "Laden…"
          : `${activeCount} aktive Mitarbeiter · ${members.length} insgesamt`
      }
      actions={
        isAdmin ? (
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Mitarbeiter einladen
          </Button>
        ) : undefined
      }
    >
      {isError && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Team-Daten konnten nicht geladen werden.
        </div>
      )}
      {isLoading && (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Team wird geladen…
        </div>
      )}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((m: TeamMember) => {
            const isOwnAccount = user?.profileId === m.id;
            const isInactive = !m.is_active;
            return (
              <Card key={m.id} className="relative overflow-hidden">
                {isInactive && (
                  <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[1px]" />
                )}
                <CardContent className="relative z-20 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{getInitials(m.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{m.full_name ?? "—"}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge
                            className={`${roleColor[m.role] ?? roleColor.employee} border-0`}
                          >
                            {roleLabelMap[m.role] ?? m.role}
                          </Badge>
                          {isInactive && (
                            <Badge className="border-0 bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              Inaktiv
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 flex-none" />
                      <span className="truncate">{m.email ?? "—"}</span>
                    </div>
                    {m.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 flex-none" />
                        {m.phone}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="mt-4 space-y-2 border-t pt-3">
                      <Select
                        value={m.role}
                        onValueChange={(role) =>
                          roleMutation.mutate({ profileId: m.id, role })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Mitarbeiter</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      {!isOwnAccount && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() =>
                            activeMutation.mutate({ profileId: m.id, is_active: !m.is_active })
                          }
                          disabled={activeMutation.isPending}
                        >
                          {m.is_active ? "Deaktivieren" : "Aktivieren"}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {members.length === 0 && !isLoading && (
            <div className="col-span-full rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
              Noch keine Team-Mitglieder vorhanden.
            </div>
          )}
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mitarbeiter einladen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">E-Mail *</Label>
              <Input
                id="invite-email"
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="mitarbeiter@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-name">Name</Label>
              <Input
                id="invite-name"
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Max Mustermann"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role">Rolle</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) =>
                  setInviteRole(v as "employee" | "manager" | "admin")
                }
              >
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Mitarbeiter</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending ? "Einladen…" : "Einladen"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
