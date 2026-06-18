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
      { title: "Strom vergleichen: Bis zu 850 € sparen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Stromtarife persönlich vergleichen: Haushaltsstrom, Ökostrom, Autostrom und Wärmestrom. Geprüfte Anbieter, kostenloser Wechsel ohne Versorgungslücke.",
      },
      { property: "og:title", content: "Strom vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Stromtarife persönlich vergleichen und bis zu 850 € pro Jahr sparen.",
      },
      { property: "og:image", content: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop&q=80" },
    ],
  }),
  component: StromPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Bis zu 850 € sparen",
    desc: "Ein Tarifwechsel rechnet sich fast immer. Wir zeigen Ihnen schwarz auf weiß, wie viel.",
  },
  {
    icon: ShieldCheck,
    title: "Geprüfte Anbieter",
    desc: "Über 800 Stromanbieter im Vergleich. Nur Versorger mit guter Service- und Preisstabilität.",
  },
  {
    icon: Sparkles,
    title: "Persönliche Beratung",
    desc: "Echte Menschen am Telefon. Keine Bots, keine Verkaufsmasche, keine versteckten Gebühren.",
  },
  {
    icon: BadgeCheck,
    title: "Wechselgarantie",
    desc: "Wir übernehmen den kompletten Wechsel inklusive Kündigung beim alten Anbieter.",
  },
  {
    icon: Leaf,
    title: "Ökostrom-Tarife",
    desc: "Auf Wunsch ausschließlich zertifizierte Ökostrom-Anbieter. Ohne versteckte Aufpreise.",
  },
  {
    icon: Car,
    title: "Autostrom & Wärmestrom",
    desc: "Spezial-Tarife für E-Autos und Wärmepumpen. Getrennte Zähler, getrennt günstig.",
  },
];

function StromPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Strom vergleichen"
        title={<>Strom, der zu Ihrem Leben passt.</>}
        lead="Egal ob Haushaltsstrom, Ökostrom, Autostrom oder Wärmestrom. Wir finden den Tarif, der wirklich zu Ihrem Verbrauch passt."
        image={heroImg}
        imageAlt="Modernes Wohnzimmer mit smartem Stromzähler"
        Icon={Zap}
        secondaryCta={{ to: "/ablauf", label: "So läuft der Wechsel ab" }}
      />

      <FeatureGrid
        title="Warum mit PRIME ENERGIE wechseln?"
        intro="Sechs Gründe, warum sich der Anruf lohnt. Auch wenn Sie schon mal verglichen haben."
        items={features}
      />

      <ImageSplit
        eyebrow="Tarifarten"
        title="Vier Strom-Welten, ein Berater"
        body="Wir unterscheiden nicht nach Provision, sondern nach Bedarf. Haushalt, Familie, E-Auto, Wärmepumpe. Jede Situation hat ihren passenden Tarif. Wir filtern sie für Sie heraus."
        image={splitImg}
        imageAlt="E-Auto wird zuhause an Wallbox geladen"
        bullets={[
          "Haushaltsstrom. Stabil, einfach, transparent",
          "100 % Ökostrom, zertifiziert nach OK-Power oder Grüner Strom-Label",
          "Autostrom: Sondertarif für Wallbox und E-Auto",
          "Wärmestrom: Für Nachtspeicher- und Wärmepumpenheizungen",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="So sparen Sie wirklich"
        title="Wir prüfen genauer als jeder Online-Rechner"
        body="Online-Vergleichsportale zeigen oft Lockangebote mit Bonus im ersten Jahr. Wir rechnen ehrlich auf 24 Monate. Inklusive Preisgleitklauseln, Kündigungsfristen und realer Nettokosten."
        image={ctaBg}
        imageAlt="Hand vergleicht Stromrechnung mit Taschenrechner"
        bullets={[
          "Volle 24-Monats-Berechnung statt Bonus-Marketing",
          "Preisgarantien werden auf Belastbarkeit geprüft",
          "Service-Bewertungen aus echten Kundenstimmen",
        ]}
      />

      <FinalCta
        title="Wie viel könnten Sie sparen?"
        body="Zwei Minuten Aufwand, ein klares Sparergebnis. Komplett kostenlos und unverbindlich."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
