import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_OPEN_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
} from "@/lib/cookie-consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  aiAssistant: boolean;
  date: string;
};

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [aiAssistant, setAiAssistant] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (!raw) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const openSettings = () => {
      try {
        const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
        if (raw) {
          const consent = JSON.parse(raw) as Partial<Consent>;
          setAnalytics(consent.analytics === true);
          setMarketing(consent.marketing === true);
          setAiAssistant(consent.aiAssistant === true);
        }
      } catch {
        setAnalytics(false);
        setMarketing(false);
        setAiAssistant(false);
      }
      setSettings(true);
      setOpen(true);
    };

    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, openSettings);
  }, []);

  const save = (c: Omit<Consent, "date">) => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_STORAGE_KEY,
        JSON.stringify({ ...c, date: new Date().toISOString() }),
      );
    } catch {
      /* ignore */
    }
    setOpen(false);
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-2 bottom-2 z-50 mx-auto max-h-[calc(100dvh-1rem)] max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background p-4 shadow-2xl sm:inset-x-4 sm:bottom-4 sm:p-5 md:p-6"
          role="dialog"
          aria-label="Cookie-Einstellungen"
        >
          <div className="flex items-start gap-4">
            <div className="hidden h-10 w-10 flex-none place-items-center rounded-full bg-success/10 text-success sm:grid">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-primary">
                  Cookies & Datenschutz
                </h2>
                <button
                  onClick={() =>
                    save({ necessary: true, analytics: false, marketing: false, aiAssistant: false })
                  }
                  aria-label="Schließen"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                PRIME ENERGIE speichert notwendige Einstellungen, damit diese Website zuverlässig
                funktioniert. Optionale Dienste werden nur mit Ihrer Zustimmung aktiviert. Mehr in
                unserer{" "}
                <Link to="/datenschutz" className="underline hover:text-primary">
                  Datenschutzerklärung
                </Link>
                .
              </p>

              {settings && (
                <div className="mt-4 space-y-4 rounded-lg border bg-muted/30 p-3 sm:p-4">
                  <Row
                    title="Notwendig"
                    desc="Für Grundfunktionen erforderlich. Nicht abwählbar."
                    checked
                    disabled
                  />
                  <Row
                    title="Statistik"
                    desc="Erlaubt statistische Auswertungen, sofern ein entsprechender Dienst aktiviert wird."
                    checked={analytics}
                    onCheck={setAnalytics}
                  />
                  <Row
                    title="Marketing"
                    desc="Erlaubt Marketingdienste, sofern diese künftig eingebunden werden."
                    checked={marketing}
                    onCheck={setMarketing}
                  />
                  <Row
                    title="KI Assistent"
                    desc="Übermittelt Ihre Chatnachrichten erst nach Ihrer ausdrücklichen Zustimmung an OpenAI."
                    checked={aiAssistant}
                    onCheck={setAiAssistant}
                  />
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    save({ necessary: true, analytics: false, marketing: false, aiAssistant: false })
                  }
                >
                  Nur erforderliche
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setSettings((s) => !s)}
                >
                  {settings ? "Schließen" : "Einstellungen"}
                </Button>
                {settings ? (
                  <Button
                    size="sm"
                    className="w-full bg-success text-success-foreground hover:bg-success/90 sm:w-auto"
                    onClick={() => save({ necessary: true, analytics, marketing, aiAssistant })}
                  >
                    Auswahl speichern
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full bg-success text-success-foreground hover:bg-success/90 sm:w-auto"
                    onClick={() =>
                      save({ necessary: true, analytics: true, marketing: true, aiAssistant: true })
                    }
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
