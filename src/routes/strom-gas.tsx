import { createFileRoute } from "@tanstack/react-router";
import {
  Layers,
  Gift,
  TrendingDown,
  ShieldCheck,
  Clock,
  FileSignature,
  Sparkles,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero, FeatureGrid, ImageSplit, FinalCta } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-strom-gas.jpg";
import splitImg from "@/assets/comparison-hero.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/strom-gas")({
  head: () => ({
    meta: [
      { title: "Strom & Gas gemeinsam prüfen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "PRIME ENERGIE prüft Strom und Gas gemeinsam und stellt kombinierte Angebote den passenden Einzeltarifen gegenüber.",
      },
      { property: "og:title", content: "Strom & Gas gemeinsam prüfen | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Gemeinsam oder getrennt: Wir ordnen beide Möglichkeiten verständlich ein.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1548502032-4d0e6d99b31e?w=1200&h=630&fit=crop&q=80",
      },
    ],
  }),
  component: StromGasPage,
});

const features = [
  {
    icon: Gift,
    title: "Gemeinsam betrachten",
    desc: "Wir erfassen beide Verbrauchswerte und prüfen, welche Kombination verfügbar ist.",
  },
  {
    icon: FileSignature,
    title: "Weniger Abstimmungsaufwand",
    desc: "Ein gemeinsamer Anbieter kann Verwaltung vereinfachen, ist aber nicht immer günstiger.",
  },
  {
    icon: Clock,
    title: "Termine im Blick",
    desc: "Die bestehenden Laufzeiten für Strom und Gas werden getrennt berücksichtigt.",
  },
  {
    icon: TrendingDown,
    title: "Varianten vergleichen",
    desc: "Kombinierte Angebote werden passenden Einzeltarifen gegenübergestellt.",
  },
  {
    icon: ShieldCheck,
    title: "Konditionen verstehen",
    desc: "Preise, Laufzeiten, Garantien und Boni werden für beide Energiearten eingeordnet.",
  },
  {
    icon: Users,
    title: "Persönliche Beratung",
    desc: "PRIME ENERGIE bespricht mit Ihnen, welche Variante besser zu Ihrem Haushalt passt.",
  },
];

function StromGasPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Gemeinsam oder getrennt"
        title={<>Strom & Gas passend zusammenstellen.</>}
        lead="Ein gemeinsamer Tarif kann praktisch sein. Zwei Einzeltarife können wirtschaftlicher sein. PRIME ENERGIE prüft beide Wege."
        image={heroImg}
        imageAlt="Glückliche Familie im hellen Wohnzimmer mit smartem Thermostat"
        Icon={Layers}
        secondaryCta={{ to: "/ablauf", label: "So läuft der Wechsel ab" }}
      />

      <FeatureGrid
        title="Was bei Strom & Gas gemeinsam zählt"
        intro="Sechs Punkte, die wir bei einer kombinierten Anfrage berücksichtigen."
        items={features}
      />

      <ImageSplit
        eyebrow="Bundle vs. Einzeltarife"
        title="Kombination und Einzeltarife gegenüberstellen"
        body="Wir betrachten verfügbare Kombinationen sowie passende Einzeltarife. Sie erhalten eine verständliche Einordnung und entscheiden selbst, welche Lösung zu Ihnen passt."
        image={splitImg}
        imageAlt="Vergleichsdiagramm Strom und Gas Tarife"
        bullets={[
          "Gesamtkosten für beide Energiearten betrachten",
          "Unterschiedliche Vertragslaufzeiten berücksichtigen",
          "Komfort und Wirtschaftlichkeit gemeinsam abwägen",
        ]}
      />

      <FinalCta
        title="Lohnt sich ein Bundle für Sie?"
        body="Senden Sie Ihre Eckdaten. PRIME ENERGIE prüft, welche gemeinsame oder getrennte Lösung verfügbar und nachvollziehbar ist."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
