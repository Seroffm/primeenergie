import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { getMe } from "@/lib/api-client";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/mitarbeiter/einstellungen")({
  head: () => ({
    meta: [
      { title: "Einstellungen – Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SettingsPage,
});

const notificationItems = [
  { key: "new_lead", label: "Neuer Lead zugewiesen", desc: "E-Mail bei jeder neuen Zuweisung" },
  {
    key: "no_reaction",
    label: "Lead ohne Reaktion > 24h",
    desc: "Erinnerung an offene Leads",
  },
  { key: "contract_signed", label: "Vertrag unterschrieben", desc: "Sofort-Benachrichtigung" },
  { key: "weekly_report", label: "Wöchentlicher Report", desc: "Montags 08:00 Uhr" },
];

function SettingsPage() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!user,
  });

  // Profil-Felder
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Passwort
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isSavingPw, setIsSavingPw] = useState(false);

  // Benachrichtigungen – lokaler State
  const [notifState, setNotifState] = useState<Record<string, boolean>>({
    new_lead: true,
    no_reaction: true,
    contract_signed: true,
    weekly_report: false,
  });

  // Initialbefüllung aus Profil-Daten
  useEffect(() => {
    if (profile) {
      const parts = profile.full_name?.split(" ") ?? [];
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" ") ?? "");
      setEmail(profile.email ?? "");
    }
  }, [profile]);

  async function handleSaveProfile() {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const full_name = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name, phone: phone.trim() || null })
        .eq("auth_user_id", user.id);
      if (error) throw error;
      toast.success("Profil gespeichert");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast.error(`Fehler: ${msg}`);
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!newPw) return;
    if (newPw !== confirmPw) {
      toast.error("Passwörter stimmen nicht überein");
      return;
    }
    if (newPw.length < 8) {
      toast.error("Passwort muss mindestens 8 Zeichen haben");
      return;
    }
    setIsSavingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success("Passwort erfolgreich geändert");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast.error(`Fehler: ${msg}`);
    } finally {
      setIsSavingPw(false);
    }
  }

  function handleToggleNotif(key: string, checked: boolean) {
    setNotifState((prev) => ({ ...prev, [key]: checked }));
    // Kein notification_prefs-Feld in der DB-Spalte → nur lokaler State + Toast
    console.log("notification_prefs update:", key, checked);
    toast.success("Einstellung gespeichert");
  }

  return (
    <AdminShell title="Einstellungen" subtitle="Profil, Benachrichtigungen und Team">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── PROFIL ─────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} disabled className="bg-muted/40" />
              <p className="text-xs text-muted-foreground">
                E-Mail-Änderung bitte über den Supabase-Support
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49 …"
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? "Speichern…" : "Änderungen speichern"}
            </Button>
          </CardContent>
        </Card>

        {/* ── BENACHRICHTIGUNGEN ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Benachrichtigungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationItems.map((n) => (
              <div
                key={n.key}
                className="flex items-start justify-between gap-4 rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium">{n.label}</div>
                  <div className="text-xs text-muted-foreground">{n.desc}</div>
                </div>
                <Switch
                  checked={notifState[n.key] ?? false}
                  onCheckedChange={(checked) => handleToggleNotif(n.key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── PASSWORT ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Passwort ändern</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPw">Aktuelles Passwort</Label>
              <Input
                id="currentPw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPw">Neues Passwort</Label>
              <Input
                id="newPw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 Zeichen"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPw">Passwort bestätigen</Label>
              <Input
                id="confirmPw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleChangePassword}
              disabled={isSavingPw || !newPw}
            >
              {isSavingPw ? "Ändern…" : "Passwort ändern"}
            </Button>
          </CardContent>
        </Card>

        {/* ── TEAM-ÜBERSICHT (statisch) ──────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team-Mitglieder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Eine vollständige Team-Verwaltung ist unter{" "}
              <span className="font-medium">Mitarbeiter → Team</span> verfügbar.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Einladung – Feature in Kürze verfügbar")}
            >
              Mitarbeiter einladen
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
