import { createFileRoute } from "@tanstack/react-router";
import {
  Flame,
  Leaf,
  Building2,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  BadgeCheck,
  Thermometer,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero, FeatureGrid, ImageSplit, FinalCta } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-gas.jpg";
import splitImg from "@/assets/solution-waermestrom.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/gas")({
  head: () => ({
    meta: [
      { title: "Gastarife persönlich prüfen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "PRIME ENERGIE prüft Gastarife für private Haushalte und Unternehmen und erklärt Preise, Laufzeiten und Garantien verständlich.",
      },
      { property: "og:title", content: "Gas vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Gastarife verständlich prüfen und persönlich beraten lassen.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=1200&h=630&fit=crop&q=80",
      },
    ],
  }),
  component: GasPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Gesamtkosten prüfen",
    desc: "Wir betrachten Arbeitspreis, Grundpreis und Vertragsdauer passend zu Ihrem Verbrauch.",
  },
  {
    icon: ShieldCheck,
    title: "Preisgarantie verstehen",
    desc: "Wir erklären Umfang, Laufzeit und mögliche Ausnahmen einer Preisgarantie.",
  },
  {
    icon: Sparkles,
    title: "Persönliche Beratung",
    desc: "Unser Team beantwortet Ihre Fragen und ordnet Vertragsbedingungen verständlich ein.",
  },
  {
    icon: Leaf,
    title: "Bio-Erdgas auf Wunsch",
    desc: "Auf Wunsch beziehen wir Biogasoptionen und deren Herkunftsnachweise ein.",
  },
  {
    icon: Building2,
    title: "Auch für Gewerbe",
    desc: "Auch Gewerbe, Gastronomie und Hausverwaltungen können individuelle Anfragen stellen.",
  },
  {
    icon: BadgeCheck,
    title: "Begleiteter Wechsel",
    desc: "Wenn Sie wechseln möchten, unterstützt PRIME ENERGIE bei den vereinbarten Schritten.",
  },
];

function GasPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Gas vergleichen"
        title={<>Gaspreise verstehen. Bewusst entscheiden.</>}
        lead="PRIME ENERGIE macht Gastarife vergleichbar und erklärt, welche Konditionen zu Ihrem Verbrauch und Ihren Wünschen passen."
        image={heroImg}
        imageAlt="Blaue Gasflamme auf modernem Herd"
        Icon={Flame}
        secondaryCta={{ to: "/ablauf", label: "So läuft der Wechsel ab" }}
      />

      <FeatureGrid
        title="Was PRIME ENERGIE für Sie prüft"
        intro="Sechs Punkte, die bei einer Gastarifentscheidung eine wichtige Rolle spielen."
        items={features}
      />

      <ImageSplit
        eyebrow="Heizkosten verstehen"
        title="Arbeitspreis, Grundpreis und Verbrauch"
        body="Die Höhe Ihrer Gasrechnung hängt nicht nur vom Arbeitspreis ab. Wir betrachten auch Grundpreis, Vertragsdauer und Ihr Verbrauchsprofil."
        image={splitImg}
        imageAlt="Heizungsthermostat wird eingestellt"
        bullets={[
          "Arbeitspreis und Grundpreis gemeinsam betrachten",
          "Preisgarantie und Vertragslaufzeit einordnen",
          "Verbrauchsschätzung auch ohne alte Jahresrechnung",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="Bio-Erdgas"
        title="Biogasoptionen nachvollziehbar einordnen"
        body="Biogastarife können sich bei Anteil, Herkunft und Nachweisen deutlich unterscheiden. Wir zeigen Ihnen, welche Angaben im konkreten Angebot enthalten sind."
        image={ctaBg}
        imageAlt="Grünes Feld mit Biogas-Anlage"
        bullets={[
          "Biogasanteil im Tarif nachvollziehen",
          "Herkunfts- und Produktnachweise berücksichtigen",
          "Mehrkosten transparent gegenüberstellen",
        ]}
      />

      <FinalCta
        title="Passt Ihr Gastarif noch?"
        body="Übermitteln Sie Ihre Eckdaten. PRIME ENERGIE prüft die Ausgangslage und bespricht passende Optionen persönlich mit Ihnen."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
