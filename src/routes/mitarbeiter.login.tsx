import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/mitarbeiter/login")({
  head: () => ({
    meta: [
      { title: "Login – PRIME ENERGIE Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError("E-Mail oder Passwort ungültig.");
      return;
    }
    navigate({ to: "/mitarbeiter/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-primary via-primary to-emerald-600 p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">PRIME ENERGIE CRM</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-semibold leading-tight">
            Leads bearbeiten.
            <br />
            Verträge abschließen.
            <br />
            Kunden glücklich machen.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Das interne Tool für unser Team. Bitte halte deine Zugangsdaten geheim und melde dich
            nach der Arbeit ab.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-primary-foreground/80">
            <ShieldCheck className="h-4 w-4" /> Geschützter Bereich · DSGVO-konform
          </div>
        </motion.div>
        <div className="text-xs text-primary-foreground/60">© 2026 PRIME ENERGIE GmbH</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6"
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Willkommen zurück</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Melde dich mit deinem Mitarbeiter-Account an.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 flex-none" />
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>
                <Link to="/mitarbeiter/passwort-vergessen" className="text-xs text-primary hover:underline">
                  Passwort vergessen?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> Angemeldet bleiben
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              "Anmelden…"
            ) : (
              <>
                <span>Anmelden</span> <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Probleme?{" "}
            <Link to="/kontakt" className="text-primary hover:underline">
              IT kontaktieren
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
