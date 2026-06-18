import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  HelpCircle,
  ArrowRight,
  MessageCircleQuestion,
  ShieldCheck,
  Zap,
  FileText,
  Euro,
  Clock,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ: Antworten zum Tarifwechsel | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Häufige Fragen zu Strom- und Gasvergleich, Beratung, Datenschutz und Wechselablauf. Klar und ehrlich beantwortet.",
      },
      { property: "og:title", content: "FAQ | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "Antworten auf die häufigsten Fragen rund um Tarifwechsel, Beratung und Datenschutz.",
      },
    ],
  }),
  component: FaqPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const categories: { icon: typeof Zap; title: string; faqs: { q: string; a: string }[] }[] = [
  {
    icon: Euro,
    title: "Kosten & Beratung",
    faqs: [
      {
        q: "Ist die Beratung wirklich kostenlos?",
        a: "Ja, zu 100 %. Wir werden vom neu gewählten Anbieter vergütet. Nicht von Ihnen. Es entstehen Ihnen weder bei der Beratung noch beim Wechsel Kosten.",
      },
      {
        q: "Gibt es versteckte Gebühren?",
        a: "Nein. Weder eine Wechselgebühr noch eine Servicepauschale. Was Sie zahlen, ist ausschließlich der Tarifpreis des neuen Anbieters.",
      },
      {
        q: "Verdient ihr mehr, wenn ich einen teureren Tarif wählt?",
        a: "Nein. Unsere Provisionen sind über alle empfohlenen Anbieter ähnlich strukturiert. Wir haben keinen Anreiz, Ihnen einen teureren Tarif zu empfehlen.",
      },
    ],
  },
  {
    icon: Clock,
    title: "Wechsel & Ablauf",
    faqs: [
      {
        q: "Wie lange dauert ein Wechsel?",
        a: "In der Regel 4–8 Wochen ab Unterschrift. Die Kündigungsfrist Ihres alten Vertrags bestimmt das Wechseldatum. Wir halten alle Fristen für Sie ein.",
      },
      {
        q: "Kann es zu einer Versorgungslücke kommen?",
        a: "Nein. Strom- und Gasversorgung sind gesetzlich abgesichert. Selbst wenn etwas schiefgehen sollte, springt der lokale Grundversorger automatisch ein.",
      },
      {
        q: "Muss ich selbst beim alten Anbieter kündigen?",
        a: "Nein, das übernehmen wir komplett für Sie. Inklusive fristgerechter Kündigung und schriftlicher Bestätigung.",
      },
      {
        q: "Kann ich auch wechseln, wenn ich noch in der Vertragslaufzeit bin?",
        a: "Wir prüfen das individuell. Bei laufenden Verträgen merken wir den Wechsel zum nächstmöglichen Kündigungstermin vor. Komplett automatisch.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Daten & Unterlagen",
    faqs: [
      {
        q: "Welche Daten brauchen Sie von mir?",
        a: "PLZ, ungefährer Jahresverbrauch und Kontaktdaten reichen für die erste Prüfung. Eine alte Jahresrechnung beschleunigt das Angebot. Ist aber kein Muss.",
      },
      {
        q: "Was, wenn ich meinen Verbrauch nicht kenne?",
        a: "Kein Problem. Wir schätzen Ihren Verbrauch anhand Wohnfläche und Personenzahl realistisch ein. Sie können den Wert später jederzeit anpassen.",
      },
      {
        q: "Brauche ich meine Zählernummer?",
        a: "Erst beim tatsächlichen Wechsel. Nicht für die Beratung. Wir fragen sie ab, sobald ein Tarif für Sie passt.",
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Datenschutz & Sicherheit",
    faqs: [
      {
        q: "Was passiert mit meinen Daten?",
        a: "Ihre Daten werden DSGVO-konform in Deutschland verarbeitet und ausschließlich zur Tarifprüfung verwendet. Keine Weitergabe an Dritte ohne Ihre Einwilligung.",
      },
      {
        q: "Werde ich nach der Anfrage mit Werbung zugeschüttet?",
        a: "Nein. Wir rufen Sie genau einmal zur Beratung an. Keine Newsletter, keine Werbung, keine Weitergabe an Callcenter.",
      },
      {
        q: "Kann ich meine Daten löschen lassen?",
        a: "Jederzeit. Eine kurze E-Mail an datenschutz@energieclever.de genügt. Wir löschen Ihre Daten umgehend.",
      },
    ],
  },
  {
    icon: Zap,
    title: "Tarife & Anbieter",
    faqs: [
      {
        q: "Welche Anbieter prüft ihr?",
        a: "Über 800 geprüfte Strom- und Gasanbieter in Deutschland. Große Versorger genauso wie regionale Spezialisten und Ökostrom-Anbieter.",
      },
      {
        q: "Gibt es auch Ökotarife?",
        a: "Ja, auf Wunsch finden wir ausschließlich zertifizierte Ökostrom- oder Biogas-Tarife. Ohne dass Sie deshalb mehr zahlen müssen.",
      },
      {
        q: "Bin ich verpflichtet zu wechseln?",
        a: "Nein. Die Beratung ist absolut unverbindlich. Selbst nach Angebot entscheiden Sie frei. Wir respektieren jedes Nein.",
      },
    ],
  },
];

function FaqPage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-success/5 via-background to-background">
        <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_50%_at_50%_0%,hsl(var(--success)/0.18),transparent_60%)]" />
        <div className="mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
          <motion.div
            {...fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-xs font-medium text-success"
          >
            <MessageCircleQuestion className="h-3.5 w-3.5" /> Antworten auf einen Blick
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-tight text-primary md:text-6xl"
          >
            Häufige Fragen
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Alles Wichtige rund um Beratung, Wechsel, Datenschutz und Tarife. Ehrlich beantwortet.
          </motion.p>
        </div>
      </section>

      {/* FAQ CATEGORIES */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <div className="space-y-12">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.03 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-primary md:text-3xl">{cat.title}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {cat.faqs.map((f, idx) => (
                  <AccordionItem
                    key={f.q}
                    value={`${cat.title}-${idx}`}
                    className="overflow-hidden rounded-2xl border border-border bg-card px-5 shadow-soft"
                  >
                    <AccordionTrigger className="py-5 text-left text-base font-semibold text-primary hover:no-underline">
                      <span className="flex items-start gap-3">
                        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                        {f.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pl-8 text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 md:pb-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground shadow-card md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold md:text-3xl">Ihre Frage war nicht dabei?</h2>
              <p className="mt-3 text-primary-foreground/80">
                Schreiben Sie uns oder rufen Sie an. Wir antworten in der Regel innerhalb von 24
                Stunden.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <Link to="/kontakt">
                  Kontakt aufnehmen <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <Link to="/">Tarif prüfen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
