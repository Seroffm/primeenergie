import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, UserCheck, Gift, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { requestReferralCode } from "@/lib/api-client";

export const Route = createFileRoute("/freunde-werben")({
  head: () => ({
    meta: [
      { title: "PRIME ENERGIE empfehlen & 30 € sichern" },
      {
        name: "description",
        content:
          "Empfehlen Sie PRIME ENERGIE weiter und erhalten Sie nach einem erfolgreichen Energiewechsel einen Amazon-Gutschein im Wert von 30 €.",
      },
      {
        property: "og:title",
        content: "PRIME ENERGIE weiterempfehlen",
      },
      {
        property: "og:description",
        content:
          "Persönlichen Empfehlungslink teilen und nach einem erfolgreichen Wechsel 30 € als Amazon-Gutschein erhalten.",
      },
    ],
  }),
  component: FreundeWerbenPage,
});

const steps = [
  {
    icon: Share2,
    title: "Link teilen",
    description:
      "Teilen Sie Ihren persönlichen Empfehlungslink per WhatsApp, E-Mail oder über einen anderen Kanal.",
  },
  {
    icon: UserCheck,
    title: "Empfehlung wird Kunde",
    description:
      "Die empfohlene Person stellt über Ihren Link eine Anfrage und schließt den Energiewechsel ab.",
  },
  {
    icon: Gift,
    title: "Sie erhalten 30 €",
    description:
      "Nach Ablauf der Wartezeit erhalten Sie den Amazon-Gutschein im Wert von 30 € per E-Mail.",
  },
];

const conditions = [
  {
    title: "Nur Neukunden zählen",
    content:
      "Die empfohlene Person darf noch keine laufende Anfrage bei PRIME ENERGIE haben. Nur Neukunden qualifizieren sich für die Prämie.",
  },
  {
    title: "Keine Eigenempfehlung",
    content:
      "Eine Empfehlung der eigenen Person ist ausgeschlossen. Die E-Mail-Adressen müssen voneinander abweichen.",
  },
  {
    title: "Monatliches Limit",
    content:
      "Pro Monat können maximal 5 Prämien ausgezahlt werden. Empfehlungen darüber hinaus in einem Kalendermonat werden nicht berücksichtigt.",
  },
  {
    title: "Code-Gültigkeit: 90 Tage",
    content:
      "Ihr persönlicher Empfehlungscode ist 90 Tage ab Ausstellung gültig. Danach können Sie einen neuen Code anfordern.",
  },
  {
    title: "30 Tage Wartezeit",
    content:
      "Nach dem abgeschlossenen Wechsel gilt eine Wartezeit von 30 Tagen. Anschließend wird der Amazon-Gutschein per E-Mail versendet.",
  },
  {
    title: "Prämie: 30-€-Amazon-Gutschein",
    content:
      "Die Prämie wird ausschließlich als Amazon-Gutschein per E-Mail ausgezahlt. Eine Barauszahlung oder Übertragung auf andere Personen ist nicht möglich.",
  },
];

function FreundeWerbenPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await requestReferralCode(email.trim());
      setSubmitted(true);
      toast.success(
        "Wenn ein abgeschlossener Wechsel bei PRIME ENERGIE vorliegt, erhalten Sie Ihren Link per E-Mail.",
        { duration: 6000 },
      );
    } catch {
      // Kein Fehler zeigen (Security)
      setSubmitted(true);
      toast.success(
        "Wenn ein abgeschlossener Wechsel bei PRIME ENERGIE vorliegt, erhalten Sie Ihren Link per E-Mail.",
        { duration: 6000 },
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      {/* ─── HERO ─── */}
      <section className="bg-primary py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-semibold text-success">
              <Gift className="h-4 w-4" />
              30 € Amazon-Gutschein pro Empfehlung
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl">
              PRIME ENERGIE empfehlen &ndash; 30 &euro; sichern
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/80">
              Teilen Sie Ihren persönlichen Link. Für jeden qualifizierten und abgeschlossenen
              Energiewechsel erhalten Sie einen{" "}
              <strong className="text-primary-foreground">30-€-Amazon-Gutschein</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── 3-SCHRITTE ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-extrabold text-primary md:text-4xl">
              So einfach funktioniert&apos;s
            </h2>
            <p className="mt-3 text-muted-foreground">In drei klaren Schritten zu Ihrer Prämie.</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="relative rounded-2xl border border-border bg-background p-8 text-center shadow-sm"
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                    <Icon className="h-7 w-7 text-success" />
                  </div>
                  <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-success text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-primary">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── BEDINGUNGEN ─── */}
      <section className="border-y border-border bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-10 text-center"
          >
            <h2 className="font-display text-3xl font-extrabold text-primary md:text-4xl">
              Bedingungen &amp; Transparenz
            </h2>
            <p className="mt-3 text-muted-foreground">
              Wir legen alles offen, damit es keine Überraschungen gibt.
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-3">
            {conditions.map((condition, index) => (
              <AccordionItem
                key={index}
                value={`condition-${index}`}
                className="rounded-xl border border-border bg-background px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                  {condition.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {condition.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── CODE ANFORDERN ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Mail className="h-6 w-6 text-success" />
              </div>
              <h2 className="mb-2 font-display text-2xl font-extrabold text-primary">
                Ihren Empfehlungslink anfordern
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Sie haben bereits über PRIME ENERGIE gewechselt? Geben Sie Ihre E-Mail-Adresse ein,
                damit wir Ihren persönlichen Link zuordnen können.
              </p>

              {submitted ? (
                <div className="rounded-xl border border-success/20 bg-success/10 p-5 text-center">
                  <p className="text-sm font-semibold text-success">E-Mail wird gesendet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Wenn ein abgeschlossener Wechsel vorliegt, erhalten Sie Ihren Link per E-Mail.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="referral-email">Ihre E-Mail-Adresse</Label>
                    <Input
                      id="referral-email"
                      type="email"
                      placeholder="name@beispiel.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird gesendet…
                      </>
                    ) : (
                      "Link anfordern"
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Nur für Kunden mit abgeschlossenem Energiewechsel bei PRIME ENERGIE.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
