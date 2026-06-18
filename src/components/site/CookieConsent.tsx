import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "ec-cookie-consent-v1";

type Consent = { necessary: true; analytics: boolean; marketing: boolean; date: string };

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const save = (c: Omit<Consent, "date">) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...c, date: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-background p-5 shadow-2xl md:p-6"
          role="dialog"
          aria-label="Cookie-Einstellungen"
        >
          <div className="flex items-start gap-4">
            <div className="hidden h-10 w-10 flex-none place-items-center rounded-full bg-success/10 text-success sm:grid">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-primary">
                  Cookies & Datenschutz
                </h2>
                <button
                  onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                  aria-label="Schließen"
                  className="text-muted-foreground hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Wir nutzen Cookies, um unsere Seite zu verbessern und passende Inhalte auszuspielen.
                Notwendige Cookies sind immer aktiv. Mehr in unserer{" "}
                <Link to="/datenschutz" className="underline hover:text-primary">
                  Datenschutzerklärung
                </Link>
                .
              </p>

              {settings && (
                <div className="mt-4 space-y-3 rounded-lg border bg-muted/30 p-4">
                  <Row
                    title="Notwendig"
                    desc="Für Grundfunktionen erforderlich. Nicht abwählbar."
                    checked
                    disabled
                  />
                  <Row
                    title="Statistik"
                    desc="Anonyme Nutzungsanalyse (z. B. GA4) zur Verbesserung der Seite."
                    checked={analytics}
                    onCheck={setAnalytics}
                  />
                  <Row
                    title="Marketing"
                    desc="Personalisierte Werbung (z. B. Meta Pixel, Google Ads)."
                    checked={marketing}
                    onCheck={setMarketing}
                  />
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                >
                  Nur notwendige
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSettings((s) => !s)}>
                  {settings ? "Schließen" : "Einstellungen"}
                </Button>
                {settings ? (
                  <Button
                    size="sm"
                    className="bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => save({ necessary: true, analytics, marketing })}
                  >
                    Auswahl speichern
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                  >
                    Alle akzeptieren
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({
  title,
  desc,
  checked,
  disabled,
  onCheck,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onCheck?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheck} />
    </div>
  );
}
