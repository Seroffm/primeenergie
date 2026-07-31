import { createFileRoute } from "@tanstack/react-router";
import {
  Zap,
  Leaf,
  Car,
  Flame,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero, FeatureGrid, ImageSplit, FinalCta } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-strom.jpg";
import splitImg from "@/assets/solution-autostrom.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/strom")({
  head: () => ({
    meta: [
      { title: "Stromtarife persönlich prüfen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "PRIME ENERGIE prüft Stromtarife für Haushalt, Ökostrom, E-Auto und Wärmepumpe persönlich und verständlich.",
      },
      { property: "og:title", content: "Strom vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Stromtarife verständlich prüfen und den Wechsel auf Wunsch begleiten lassen.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop&q=80",
      },
    ],
  }),
  component: StromPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Kosten im Blick",
    desc: "Wir betrachten Grundpreis, Arbeitspreis, Laufzeit und mögliche Boni gemeinsam.",
  },
  {
    icon: ShieldCheck,
    title: "Nachvollziehbare Auswahl",
    desc: "Sie erfahren, welche Tarifmerkmale für Ihre Situation besonders wichtig sind.",
  },
  {
    icon: Sparkles,
    title: "Persönliche Beratung",
    desc: "Sie können Rückfragen direkt mit unserem Team besprechen und Konditionen einordnen lassen.",
  },
  {
    icon: BadgeCheck,
    title: "Wechselunterstützung",
    desc: "Wenn Sie sich entscheiden, begleiten wir die vereinbarten Schritte zum neuen Tarif.",
  },
  {
    icon: Leaf,
    title: "Ökostrom-Tarife",
    desc: "Auf Wunsch beziehen wir Ökostromtarife und deren Nachweise in die Prüfung ein.",
  },
  {
    icon: Car,
    title: "Autostrom & Wärmestrom",
    desc: "Wir berücksichtigen Sondertarife für Wallbox, Wärmepumpe oder getrennte Zähler.",
  },
];

function StromPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Strom vergleichen"
        title={<>Strom, der zu Ihrem Leben passt.</>}
        lead="Ob Haushalt, Ökostrom, E-Auto oder Wärmepumpe: PRIME ENERGIE ordnet passende Tarifoptionen für Ihren Verbrauch verständlich ein."
        image={heroImg}
        imageAlt="Modernes Wohnzimmer mit smartem Stromzähler"
        Icon={Zap}
        secondaryCta={{ to: "/ablauf", label: "So läuft der Wechsel ab" }}
      />

      <FeatureGrid
        title="Warum mit PRIME ENERGIE wechseln?"
        intro="Sechs Punkte, auf die wir bei Ihrer persönlichen Tarifprüfung achten."
        items={features}
      />

      <ImageSplit
        eyebrow="Tarifarten"
        title="Vier Anwendungen, eine klare Beratung"
        body="Haushalt, E-Auto und Wärmepumpe stellen unterschiedliche Anforderungen an einen Tarif. Wir berücksichtigen Verbrauch, Zählerart und Ihre persönlichen Wünsche."
        image={splitImg}
        imageAlt="E-Auto wird zuhause an Wallbox geladen"
        bullets={[
          "Haushaltsstrom. Stabil, einfach, transparent",
          "Ökostrom mit nachvollziehbaren Herkunfts- oder Gütenachweisen",
          "Autostrom: Sondertarif für Wallbox und E-Auto",
          "Wärmestrom: Für Nachtspeicher- und Wärmepumpenheizungen",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="So sparen Sie wirklich"
        title="Mehr als nur den ersten Abschlag betrachten"
        body="Ein niedriger Monatsabschlag allein sagt wenig aus. Wir beziehen Laufzeit, Preisgarantie, Kündigungsfrist und mögliche Boni in die Einordnung ein."
        image={ctaBg}
        imageAlt="Hand vergleicht Stromrechnung mit Taschenrechner"
        bullets={[
          "Gesamtkosten über die betrachtete Vertragsdauer",
          "Preisgarantie und Ausnahmen verständlich erklärt",
          "Vertragslaufzeit und Kündigungsfrist im Blick",
        ]}
      />

      <FinalCta
        title="Passt Ihr aktueller Stromtarif noch?"
        body="Starten Sie die kostenlose Anfrage. PRIME ENERGIE prüft Ihre Angaben und meldet sich mit einer persönlichen Einschätzung."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
