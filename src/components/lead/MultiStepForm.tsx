import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Flame,
  Layers,
  Briefcase,
  Home,
  Building2,
  Users,
  ShieldCheck,
  Loader2,
  Upload,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";
import {
  energyTypes,
  customerTypes,
  goals,
  goalLabels,
  ESTIMATED_STROM_KWH,
  type LeadInput,
} from "@/lib/lead-schema";
import { submitLead } from "@/lib/api/lead";
import { isValidLeadNumber } from "@/lib/lead-number";
import {
  clearPendingInvoice,
  getPendingInvoice,
  setPendingInvoice,
  validateInvoice,
} from "@/lib/pending-invoice";

type Draft = Partial<LeadInput> & { ziele: LeadInput["ziele"] };

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          size?: "normal" | "compact" | "flexible";
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const STORAGE_KEY = "lead-draft-v1";
const STEP_STORAGE_KEY = "lead-draft-step-v1";
const TOTAL_STEPS = 8;

const initial: Draft = { ziele: [] };

function getStoredStep(): number {
  if (typeof window === "undefined") return 1;
  try {
    const storedStep = Number.parseInt(sessionStorage.getItem(STEP_STORAGE_KEY) ?? "1", 10);
    return Number.isInteger(storedStep) && storedStep >= 1 && storedStep <= TOTAL_STEPS
      ? storedStep
      : 1;
  } catch {
    return 1;
  }
}

export function MultiStepForm({
  initialEnergy,
  initialCustomerType,
  initialPlz,
  initialKwh,
  referralCode,
}: {
  initialEnergy?: LeadInput["energyType"];
  initialCustomerType?: LeadInput["customerType"];
  initialPlz?: string;
  initialKwh?: number;
  referralCode?: string;
}) {
  const navigate = useNavigate();
  // Start with the server-safe defaults and restore the browser draft after hydration.
  // Reading sessionStorage in the state initializer is unreliable with SSR hydration,
  // because React can retain the server state instead of running the client initializer.
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Draft>(initial);
  const [draftRestored, setDraftRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>(() =>
    typeof window === "undefined" ? [] : getPendingInvoice(),
  );
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useEffect(() => {
    let storedDraft: Draft = initial;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) storedDraft = { ...initial, ...JSON.parse(raw) } as Draft;
    } catch {
      storedDraft = initial;
    }

    const validPlz = initialPlz && /^\d{5}$/.test(initialPlz) ? initialPlz : undefined;
    setData({
      ...storedDraft,
      energyType: initialEnergy ?? storedDraft.energyType,
      customerType: initialCustomerType ?? storedDraft.customerType,
      plz: validPlz ?? storedDraft.plz,
      stromVerbrauchKwh:
        initialKwh &&
        (initialEnergy === "strom" || initialEnergy === "beides" || initialEnergy === "gewerbe")
          ? initialKwh
          : storedDraft.stromVerbrauchKwh,
      gasVerbrauchKwh:
        initialKwh && (initialEnergy === "gas" || initialEnergy === "beides")
          ? initialKwh
          : storedDraft.gasVerbrauchKwh,
    });
    setStep(getStoredStep());
    setDraftRestored(true);
    track("form_started");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftRestored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {
      /* sessionStorage not available */
    }
  }, [data, draftRestored]);

  useEffect(() => {
    if (!draftRestored) return;
    try {
      sessionStorage.setItem(STEP_STORAGE_KEY, String(step));
    } catch (_) {
      /* sessionStorage not available */
    }
  }, [step, draftRestored]);

  useEffect(() => {
    const invoiceFile = invoiceFiles[0];
    if (!invoiceFile) {
      setData((current) => ({
        ...current,
        rechnungDateiname: undefined,
        rechnungGroesseKb: undefined,
      }));
      return;
    }
    setData((current) => ({
      ...current,
      rechnungDateiname: invoiceFile.name,
      rechnungGroesseKb: Math.round(invoiceFile.size / 1024),
    }));
  }, [invoiceFiles]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setData((d) => ({ ...d, [k]: v }));

  const canContinue = useMemo(
    () => validateStep(step, data, invoiceFiles.length > 0),
    [step, data, invoiceFiles],
  );

  const next = () => {
    if (!canContinue) return;
    track("step_completed", { step });
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };
  const back = () => {
    if (step === 1) {
      const kwh = data.stromVerbrauchKwh ?? data.gasVerbrauchKwh;
      navigate({
        to: "/",
        search: {
          start: data.energyType,
          kunde:
            data.customerType === "gewerbe" ||
            data.customerType === "hausverwaltung" ||
            data.customerType === "mehrere_standorte"
              ? "gewerbe"
              : "privat",
          plz: data.plz,
          kwh: kwh,
        } as never,
      });
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  async function handleSubmit() {
    if (!canContinue) return;
    setSubmitting(true);
    setError(null);
    try {
      // Finalize numeric estimates
      const payload = finalizePayload(data);
      const invoiceFile = invoiceFiles[0] ?? null;
      const res = await submitLead(payload, turnstileToken, referralCode, invoiceFile, website);
      track("lead_submitted", { leadId: res.leadId });
      if (invoiceFile && res.invoiceUploaded) track("invoice_uploaded");
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STEP_STORAGE_KEY);
      clearPendingInvoice();
      const rawNr = res.leadNumber;
      if (!rawNr || !isValidLeadNumber(rawNr)) {
        throw new Error("Backend hat keine gültige Vorgangsnummer zurückgegeben");
      }
      sessionStorage.setItem("prime-lead-nr", rawNr);
      navigate({
        to: "/danke",
        search: {
          id: res.leadId,
          nr: rawNr,
          rechnung: invoiceFile ? (res.invoiceUploaded ? "hochgeladen" : "nachreichen") : undefined,
        },
      });
    } catch (e) {
      console.error(e);
      setError("Übermittlung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-contrast w-full min-w-0 overflow-x-clip">
      <div
        className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Webseite</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="font-medium text-primary">
          Schritt {step} von {TOTAL_STEPS}
        </span>
        <span className="text-muted-foreground">{Math.round((step / TOTAL_STEPS) * 100)} %</span>
      </div>
      <Progress value={(step / TOTAL_STEPS) * 100} className="mb-8 h-1.5" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
        >
          <StepRenderer
            step={step}
            data={data}
            set={set}
            invoiceFiles={invoiceFiles}
            invoiceError={invoiceError}
            onInvoiceChange={(files) => {
              const availableSlots = 2 - invoiceFiles.length;
              if (availableSlots <= 0) {
                setInvoiceError("Maximal 2 Dateien möglich.");
                return;
              }
              const nextFiles = files.slice(0, availableSlots);
              const validationError = nextFiles.map(validateInvoice).find(Boolean);
              if (validationError) {
                setInvoiceError(validationError);
                return;
              }
              const updatedFiles = [...invoiceFiles, ...nextFiles];
              setInvoiceError(files.length > availableSlots ? "Maximal 2 Dateien möglich." : null);
              setInvoiceFiles(updatedFiles);
              setPendingInvoice(updatedFiles);
            }}
            onInvoiceRemove={(index) => {
              const updatedFiles = invoiceFiles.filter((_, fileIndex) => fileIndex !== index);
              setInvoiceError(null);
              setInvoiceFiles(updatedFiles);
              setPendingInvoice(updatedFiles);
            }}
          />
        </motion.div>
      </AnimatePresence>

      {step === TOTAL_STEPS && turnstileSiteKey && (
        <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={back}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Zurück
        </Button>
        {step < TOTAL_STEPS ? (
          <Button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="w-full bg-success text-success-foreground hover:bg-success/90 sm:w-auto"
          >
            Weiter <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canContinue || submitting || Boolean(turnstileSiteKey && !turnstileToken)}
            className="w-full bg-success text-success-foreground hover:bg-success/90 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sende…
              </>
            ) : (
              <>
                Persönliches Angebot erhalten <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
      {(step === 3 || step === 7) && (
        <p className="mt-4 text-[11px] text-muted-foreground">
          <span className="text-success">*</span> Pflichtfeld
        </p>
      )}
    </div>
  );
}

function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetId) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        size: "flexible",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
    );
    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderWidget, { once: true });
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderWidget, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      onToken("");
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, siteKey]);

  return (
    <div
      ref={containerRef}
      className="mt-6 flex min-h-[65px] w-full min-w-0 justify-center overflow-hidden"
    />
  );
}

/* ----------------------------- Steps ----------------------------- */

function StepRenderer({
  step,
  data,
  set,
  invoiceFiles,
  invoiceError,
  onInvoiceChange,
  onInvoiceRemove,
}: {
  step: number;
  data: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  invoiceFiles: File[];
  invoiceError: string | null;
  onInvoiceChange: (files: File[]) => void;
  onInvoiceRemove: (index: number) => void;
}) {
  switch (step) {
    case 1:
      return <Step1 data={data} set={set} />;
    case 2:
      return <Step2 data={data} set={set} />;
    case 3:
      return <Step3 data={data} set={set} />;
    case 4:
      return (
        <Step4
          data={data}
          set={set}
          invoiceFiles={invoiceFiles}
          invoiceError={invoiceError}
          onInvoiceChange={onInvoiceChange}
          onInvoiceRemove={onInvoiceRemove}
        />
      );
    case 5:
      return <Step5 data={data} set={set} />;
    case 6:
      return <Step6 data={data} set={set} />;
    case 7:
      return <Step7 data={data} set={set} />;
    case 8:
      return (
        <Step8
          data={data}
          set={set}
          invoiceFiles={invoiceFiles}
          invoiceError={invoiceError}
          onInvoiceChange={onInvoiceChange}
          onInvoiceRemove={onInvoiceRemove}
        />
      );
    default:
      return null;
  }
}

function StepHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6 min-w-0">
      <h2 className="break-words text-2xl font-bold text-primary md:text-3xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

function ChoiceCard({
  active,
  onClick,
  icon: Icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Zap;
  title: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full min-w-0 items-start gap-3 rounded-xl border bg-card p-4 text-left transition",
        active
          ? "border-success bg-success/5 ring-2 ring-success/30"
          : "border-border hover:border-primary/40 hover:bg-surface",
      )}
    >
      <div
        className={cn(
          "grid h-10 w-10 flex-none place-items-center rounded-lg",
          active ? "bg-success text-success-foreground" : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="break-words font-semibold text-primary">{title}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </button>
  );
}

function Step1({ data, set }: StepProps) {
  const items = [
    { k: "strom" as const, icon: Zap, t: "Strom", s: "Privathaushalt" },
    { k: "gas" as const, icon: Flame, t: "Gas", s: "Heizung & Warmwasser" },
    { k: "beides" as const, icon: Layers, t: "Strom & Gas", s: "Gemeinsam prüfen" },
    { k: "gewerbe" as const, icon: Briefcase, t: "Gewerbe", s: "Tarif für Unternehmen" },
  ];
  return (
    <Field>
      <StepHead
        title="Wofür suchen Sie einen Tarif?"
        sub="Wählen Sie aus, was wir prüfen sollen."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <ChoiceCard
            key={i.k}
            active={data.energyType === i.k}
            onClick={() => set("energyType", i.k)}
            icon={i.icon}
            title={i.t}
            sub={i.s}
          />
        ))}
      </div>
    </Field>
  );
}

function Step2({ data, set }: StepProps) {
  const items = [
    { k: "privat" as const, icon: Home, t: "Privatkunde" },
    { k: "gewerbe" as const, icon: Briefcase, t: "Gewerbekunde" },
    { k: "hausverwaltung" as const, icon: Building2, t: "Hausverwaltung" },
    { k: "mehrere_standorte" as const, icon: Layers, t: "Mehrere Standorte" },
  ];
  return (
    <Field>
      <StepHead title="Welcher Kundentyp passt zu Ihnen?" />
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <ChoiceCard
            key={i.k}
            active={data.customerType === i.k}
            onClick={() => set("customerType", i.k)}
            icon={i.icon}
            title={i.t}
          />
        ))}
      </div>
    </Field>
  );
}

function Step3({ data, set }: StepProps) {
  return (
    <Field>
      <StepHead
        title="Wo wohnen Sie?"
        sub="Tarife sind regional unterschiedlich – wir brauchen mindestens Ihre PLZ."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="plz">
            Postleitzahl <span className="text-success">*</span>
          </Label>
          <Input
            id="plz"
            inputMode="numeric"
            maxLength={5}
            placeholder="z.B. 10115"
            value={data.plz ?? ""}
            onChange={(e) => set("plz", e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div>
          <Label htmlFor="ort">
            Ort <span className="text-success">*</span>
          </Label>
          <Input
            id="ort"
            placeholder="z.B. Berlin"
            value={data.ort ?? ""}
            onChange={(e) => set("ort", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="strasse">Straße (optional)</Label>
          <Input
            id="strasse"
            placeholder="Hilft bei der Auswahl"
            value={data.strasse ?? ""}
            onChange={(e) => set("strasse", e.target.value)}
          />
        </div>
      </div>
    </Field>
  );
}

type InvoiceStepProps = StepProps & {
  invoiceFiles: File[];
  invoiceError: string | null;
  onInvoiceChange: (files: File[]) => void;
  onInvoiceRemove: (index: number) => void;
};

function Step4({
  data,
  set,
  invoiceFiles,
  invoiceError,
  onInvoiceChange,
  onInvoiceRemove,
}: InvoiceStepProps) {
  const isBusiness =
    data.energyType === "gewerbe" ||
    data.customerType === "gewerbe" ||
    data.customerType === "hausverwaltung" ||
    data.customerType === "mehrere_standorte";

  if (isBusiness) {
    return (
      <Field>
        <StepHead
          title="Jahresabrechnung hochladen"
          sub="Gewerbe, Hausverwaltungen und mehrere Standorte prüfen wir manuell – ohne unpassenden Haushaltsrechner."
        />
        <InvoiceUpload
          files={invoiceFiles}
          error={invoiceError}
          onInvoiceChange={onInvoiceChange}
          onInvoiceRemove={onInvoiceRemove}
          required
        />
        <div className="mt-5 rounded-xl border border-success/25 bg-success/5 p-4 text-sm text-primary">
          <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-success" />
          Wir berücksichtigen Verbrauch, Leistungspreise, Laufzeiten und bei mehreren Standorten
          auch Bündelangebote.
        </div>
      </Field>
    );
  }

  const showStrom =
    data.energyType === "strom" || data.energyType === "beides" || data.energyType === "gewerbe";
  const showGas = data.energyType === "gas" || data.energyType === "beides";
  return (
    <Field>
      <StepHead
        title="Wie hoch ist Ihr Jahresverbrauch?"
        sub="Sie kennen den Wert nicht? Wir schätzen ihn anhand Ihrer Angaben."
      />
      {showStrom && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 font-semibold text-primary">
            <Zap className="h-4 w-4 text-success" /> Strom
          </div>
          <Label htmlFor="strom-kwh">Jahresverbrauch in kWh</Label>
          <Input
            id="strom-kwh"
            inputMode="numeric"
            placeholder="z.B. 3200"
            value={data.stromVerbrauchKwh ?? ""}
            onChange={(e) => set("stromVerbrauchKwh", numOrUndef(e.target.value))}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Kein Wert zur Hand? Wählen Sie eine Personenanzahl:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set("stromPersonen", n)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition",
                  data.stromPersonen === n
                    ? "border-success bg-success/10 text-success"
                    : "border-border hover:border-primary/40",
                )}
              >
                {n === 5 ? "5+ Pers." : `${n} Pers.`}
              </button>
            ))}
          </div>
          {data.stromPersonen && !data.stromVerbrauchKwh && (
            <div className="mt-3 text-xs text-muted-foreground">
              Geschätzt:{" "}
              <strong className="text-primary">
                {ESTIMATED_STROM_KWH[data.stromPersonen]} kWh/Jahr
              </strong>
            </div>
          )}
        </div>
      )}
      {showGas && (
        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 font-semibold text-primary">
            <Flame className="h-4 w-4 text-success" /> Gas
          </div>
          <Label htmlFor="gas-kwh">Jahresverbrauch in kWh</Label>
          <Input
            id="gas-kwh"
            inputMode="numeric"
            placeholder="z.B. 15000"
            value={data.gasVerbrauchKwh ?? ""}
            onChange={(e) => set("gasVerbrauchKwh", numOrUndef(e.target.value))}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Kein Wert zur Hand? Wohnfläche eingeben:
          </div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Input
              inputMode="numeric"
              placeholder="Wohnfläche m²"
              value={data.gasWohnflaeche ?? ""}
              onChange={(e) => set("gasWohnflaeche", numOrUndef(e.target.value))}
            />
            <Input
              inputMode="numeric"
              placeholder="Anzahl Personen"
              value={data.gasPersonen ?? ""}
              onChange={(e) => set("gasPersonen", numOrUndef(e.target.value))}
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={!!data.gasWarmwasser}
              onCheckedChange={(v) => set("gasWarmwasser", !!v)}
            />
            Warmwasser läuft über Gas
          </label>
        </div>
      )}
      <div className="mt-5">
        <div className="mb-2 text-sm font-semibold text-primary">Verbrauch nicht zur Hand?</div>
        <InvoiceUpload
          files={invoiceFiles}
          error={invoiceError}
          onInvoiceChange={onInvoiceChange}
          onInvoiceRemove={onInvoiceRemove}
        />
      </div>
    </Field>
  );
}

function isDateYearValid(value: string): boolean {
  if (!value) return true;
  const year = parseInt(value.split("-")[0], 10);
  return !isNaN(year) && year >= 1900 && year <= 2100;
}

function Step5({ data, set }: StepProps) {
  const dateValid = isDateYearValid(data.vertragsende ?? "");

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    set("vertragsende", e.target.value);
  }

  return (
    <Field>
      <StepHead title="Ihre aktuelle Versorgung" sub="So vergleichen wir Ihr Sparpotenzial." />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="anbieter">Aktueller Anbieter</Label>
          <Input
            id="anbieter"
            placeholder="z.B. Stadtwerke …"
            value={data.aktuellerAnbieter ?? ""}
            onChange={(e) => set("aktuellerAnbieter", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="abschlag">Monatlicher Abschlag (€)</Label>
          <Input
            id="abschlag"
            inputMode="numeric"
            placeholder="z.B. 95"
            value={data.monatlicherAbschlag ?? ""}
            onChange={(e) => set("monatlicherAbschlag", numOrUndef(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="vertragsende">Vertragsende (optional)</Label>
          <Input
            id="vertragsende"
            type="date"
            min="1900-01-01"
            max="2100-12-31"
            value={data.vertragsende ?? ""}
            onChange={handleDateChange}
            className={cn(!dateValid && "border-destructive focus-visible:ring-destructive")}
          />
          {!dateValid && (
            <p className="mt-1 text-xs text-destructive">
              Bitte ein gültiges Datum zwischen 1900 und 2100 eingeben.
            </p>
          )}
        </div>
        <div>
          <Label>Preisgarantie</Label>
          <RadioGroup
            className="mt-2 flex flex-col gap-2"
            value={data.preisgarantie ?? ""}
            onValueChange={(v) => set("preisgarantie", v as LeadInput["preisgarantie"])}
          >
            {[
              { v: "ja", l: "Ja" },
              { v: "nein", l: "Nein" },
              { v: "weiss_nicht", l: "Weiß ich nicht" },
            ].map((o) => (
              <label key={o.v} className="flex items-center gap-2 text-sm">
                <RadioGroupItem value={o.v} /> {o.l}
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </Field>
  );
}

function Step6({ data, set }: StepProps) {
  const toggle = (g: (typeof goals)[number]) => {
    const cur = data.ziele;
    set("ziele", cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]);
  };
  return (
    <Field>
      <StepHead
        title="Was ist Ihnen wichtig?"
        sub="Mehrfachauswahl möglich – wir richten die Tarife danach aus."
      />
      <div className="flex flex-wrap gap-2">
        {goals.map((g) => {
          const active = data.ziele.includes(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggle(g)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                active
                  ? "border-success bg-success/10 text-success"
                  : "border-border hover:border-primary/40",
              )}
            >
              {goalLabels[g]}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function Step7({ data, set }: StepProps) {
  return (
    <Field>
      <StepHead
        title="Wie können wir Sie erreichen?"
        sub="Ihre Angaben für das persönliche Angebot."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="vn">
            Vorname <span className="text-success">*</span>
          </Label>
          <Input
            id="vn"
            value={data.vorname ?? ""}
            onChange={(e) => set("vorname", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="nn">
            Nachname <span className="text-success">*</span>
          </Label>
          <Input
            id="nn"
            value={data.nachname ?? ""}
            onChange={(e) => set("nachname", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="em">
            E-Mail <span className="text-success">*</span>
          </Label>
          <Input
            id="em"
            type="email"
            value={data.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tel">
            Telefon <span className="text-success">*</span>
          </Label>
          <Input
            id="tel"
            type="tel"
            value={data.telefon ?? ""}
            onChange={(e) => set("telefon", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>
            Beste Erreichbarkeit <span className="text-muted-foreground">(optional)</span>
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { v: "vormittag", l: "Vormittag" },
              { v: "nachmittag", l: "Nachmittag" },
              { v: "abend", l: "Abend" },
              { v: "egal", l: "Egal" },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => set("erreichbarkeit", o.v as LeadInput["erreichbarkeit"])}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm",
                  data.erreichbarkeit === o.v
                    ? "border-success bg-success/10 text-success"
                    : "border-border hover:border-primary/40",
                )}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-surface p-4 text-xs text-muted-foreground">
        <ShieldCheck className="mr-1.5 inline h-4 w-4 text-success" />
        Ihre Angaben werden zweckgebunden nach den geltenden Datenschutzvorgaben verarbeitet.
        Weitere Informationen finden Sie in unserer Datenschutzerklärung.
      </div>

      <div className="mt-5 space-y-3">
        <label className="flex items-start gap-3 text-sm text-foreground">
          <Checkbox
            className="mt-0.5"
            checked={!!data.datenschutzAkzeptiert}
            onCheckedChange={(v) => set("datenschutzAkzeptiert", !!v as true)}
          />
          <span>
            Ich akzeptiere die{" "}
            <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="underline">
              Datenschutzerklärung
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-foreground">
          <Checkbox
            className="mt-0.5"
            checked={!!data.kontaktAkzeptiert}
            onCheckedChange={(v) => set("kontaktAkzeptiert", !!v as true)}
          />
          <span>
            Ich bin einverstanden, dass PRIME ENERGIE mich per E-Mail oder Telefon kontaktiert.
          </span>
        </label>
      </div>
    </Field>
  );
}

function Step8({ invoiceFiles, invoiceError, onInvoiceChange, onInvoiceRemove }: InvoiceStepProps) {
  return (
    <Field>
      <StepHead
        title="Letzter Schritt – Rechnung optional"
        sub="Eine alte Jahresabrechnung beschleunigt die manuelle Prüfung. Sie können sie auch später nachreichen."
      />
      <InvoiceUpload
        files={invoiceFiles}
        error={invoiceError}
        onInvoiceChange={onInvoiceChange}
        onInvoiceRemove={onInvoiceRemove}
      />

      <div className="mt-6 rounded-xl bg-primary/5 p-4 text-sm text-primary">
        <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-success" />
        Nach dem Absenden wird Ihre Anfrage persönlich geprüft. Für eine direkte Beratung erreichen
        Sie uns unter der auf der Kontaktseite angegebenen Telefonnummer.
      </div>
    </Field>
  );
}

function InvoiceUpload({
  files,
  error,
  onInvoiceChange,
  onInvoiceRemove,
  required = false,
}: {
  files: File[];
  error: string | null;
  onInvoiceChange: (files: File[]) => void;
  onInvoiceRemove: (index: number) => void;
  required?: boolean;
}) {
  const uploadDisabled = files.length >= 2;

  return (
    <div className="min-w-0">
      <label
        className={cn(
          "flex max-w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed bg-surface p-4 text-center transition hover:border-success hover:bg-success/5 sm:p-8",
          error ? "border-destructive" : files.length ? "border-success/60" : "border-border",
          uploadDisabled &&
            "cursor-not-allowed opacity-60 hover:border-success/60 hover:bg-surface",
        )}
      >
        <Upload className="h-6 w-6 text-success" />
        <div className="max-w-full break-words text-sm font-medium text-primary [overflow-wrap:anywhere]">
          {uploadDisabled
            ? "Maximal 2 Dateien möglich."
            : "Rechnung fotografieren oder Datei auswählen"}
        </div>
        <div className="max-w-full break-words text-xs text-muted-foreground">
          PDF, JPG oder PNG · maximal 10 MB{required ? " · erforderlich" : " · optional"}
        </div>
        <input
          type="file"
          multiple
          disabled={uploadDisabled}
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            if (selected.length) onInvoiceChange(selected);
            event.target.value = "";
          }}
        />
      </label>
      {files.length > 0 && (
        <ul className="mt-3 max-w-full space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex min-w-0 max-w-full items-center gap-3 overflow-hidden rounded-xl border border-success/30 bg-success/5 px-3 py-3 sm:px-4"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              <span className="min-w-0 flex-1 break-words text-sm font-medium text-primary [overflow-wrap:anywhere]">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => onInvoiceRemove(index)}
                aria-label={`${file.name} entfernen`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-destructive transition hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Field({ children }: { children: ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

type StepProps = { data: Draft; set: <K extends keyof Draft>(k: K, v: Draft[K]) => void };

/* ----------------------------- Validation ----------------------------- */

function numOrUndef(v: string): number | undefined {
  const n = Number(v.replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function validateStep(step: number, d: Draft, hasInvoice: boolean): boolean {
  switch (step) {
    case 1:
      return !!d.energyType && energyTypes.includes(d.energyType);
    case 2:
      return !!d.customerType && customerTypes.includes(d.customerType);
    case 3:
      return !!d.plz && /^\d{5}$/.test(d.plz) && !!d.ort && d.ort.length >= 2;
    case 4: {
      const isBusiness =
        d.energyType === "gewerbe" ||
        d.customerType === "gewerbe" ||
        d.customerType === "hausverwaltung" ||
        d.customerType === "mehrere_standorte";
      if (isBusiness) return hasInvoice;

      const needStrom =
        d.energyType === "strom" || d.energyType === "beides" || d.energyType === "gewerbe";
      const needGas = d.energyType === "gas" || d.energyType === "beides";
      const stromOk = !needStrom || hasInvoice || !!d.stromVerbrauchKwh || !!d.stromPersonen;
      const gasOk =
        !needGas || hasInvoice || !!d.gasVerbrauchKwh || (!!d.gasWohnflaeche && !!d.gasPersonen);
      return stromOk && gasOk;
    }
    case 5:
      return isDateYearValid(d.vertragsende ?? "");
    case 6:
      return true; // optional
    case 7:
      return (
        !!d.vorname &&
        d.vorname.length >= 2 &&
        !!d.nachname &&
        d.nachname.length >= 2 &&
        !!d.email &&
        /.+@.+\..+/.test(d.email) &&
        !!d.telefon &&
        d.telefon.length >= 5 &&
        d.datenschutzAkzeptiert === true &&
        d.kontaktAkzeptiert === true
      );
    case 8:
      return true;
    default:
      return false;
  }
}

function finalizePayload(d: Draft): LeadInput {
  return { ...d, erreichbarkeit: d.erreichbarkeit ?? "egal" } as LeadInput;
}
