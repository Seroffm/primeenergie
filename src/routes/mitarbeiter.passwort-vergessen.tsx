import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/mitarbeiter/passwort-vergessen")({
  head: () => ({
    meta: [
      { title: "Passwort vergessen – Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PasswortVergessen,
});

function PasswortVergessen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/mitarbeiter/passwort-neu",
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Passwort zurücksetzen</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gib deine E-Mail-Adresse ein, um einen Reset-Link zu erhalten.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Wenn diese E-Mail registriert ist, erhalten Sie eine E-Mail mit einem Link zum
              Zurücksetzen.
            </div>
            <Link
              to="/mitarbeiter/login"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Anmeldung
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-Mail</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                  autoComplete="email"
                  placeholder="deine@email.de"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Senden…" : "Zurücksetzen"}
            </Button>

            <Link
              to="/mitarbeiter/login"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Anmeldung
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
