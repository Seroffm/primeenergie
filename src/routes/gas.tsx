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
      { title: "Gas vergleichen: Heizkosten ehrlich senken | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Gastarife persönlich vergleichen: Erdgas, Bio-Erdgas und Gewerbe-Gas. Geprüfte Anbieter, transparente Konditionen, kostenloser Wechsel.",
      },
      { property: "og:title", content: "Gas vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Gastarife vergleichen und Heizkosten ehrlich senken. Persönlich beraten.",
      },
      { property: "og:image", content: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=1200&h=630&fit=crop&q=80" },
    ],
  }),
  component: GasPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Bis zu 600 € sparen",
    desc: "Vor allem bei Verbräuchen ab 12.000 kWh lohnt sich der Wechsel deutlich.",
  },
  {
    icon: ShieldCheck,
    title: "Preisgarantien geprüft",
    desc: "Wir erkennen Marketing-Garantien und empfehlen nur echte Festpreise.",
  },
  {
    icon: Sparkles,
    title: "Persönliche Beratung",
    desc: "Wir erklären den Tarif so lange, bis Sie ihn verstehen. Ohne Kleingedrucktes.",
  },
  {
    icon: Leaf,
    title: "Bio-Erdgas auf Wunsch",
    desc: "Zertifizierte Bio-Gas-Tarife. Ohne Aufpreis.",
  },
  {
    icon: Building2,
    title: "Auch für Gewerbe",
    desc: "Sonderkonditionen für KMU, Gastronomie und Mehrfamilienhäuser.",
  },
  {
    icon: BadgeCheck,
    title: "Wechsel ohne Risiko",
    desc: "Versorgung läuft lückenlos weiter, gesetzlich abgesichert.",
  },
];

function GasPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Gas vergleichen"
        title={<>Heizen ohne Bauchschmerzen.</>}
        lead="Gastarife sind kompliziert geworden. Wir machen sie wieder verständlich. Ehrliche Beratung, geprüfte Anbieter und ein Wechsel, der Sie keinen Cent kostet."
        image={heroImg}
        imageAlt="Blaue Gasflamme auf modernem Herd"
        Icon={Flame}
        secondaryCta={{ to: "/ablauf", label: "So läuft der Wechsel ab" }}
      />

      <FeatureGrid
        title="Warum mit uns Gas wechseln?"
        intro="Gas-Tarife verändern sich schnell. Wir behalten den Markt täglich im Blick."
        items={features}
      />

      <ImageSplit
        eyebrow="Heizkosten verstehen"
        title="Wo Ihre Heizkosten wirklich entstehen"
        body="Über 70 % Ihrer Gasrechnung ist reiner Arbeitspreis. Also direkt vom Anbieter beeinflussbar. Wir zeigen Ihnen, wie viel Spielraum tatsächlich drin ist, ohne dass Sie frieren müssen."
        image={splitImg}
        imageAlt="Heizungsthermostat wird eingestellt"
        bullets={[
          "Arbeitspreis vs. Grundpreis. Wo Sie wirklich sparen",
          "Wann sich ein Festpreis lohnt. Und wann nicht",
          "Verbrauchsschätzung auch ohne alte Jahresrechnung",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="Bio-Erdgas"
        title="Klimafreundlich heizen. Ohne versteckte Aufpreise"
        body="Bio-Erdgas wird aus organischen Reststoffen gewonnen und ist CO₂-neutral. Viele Anbieter werben damit, nur wenige liefern es ehrlich. Wir kennen den Unterschied."
        image={ctaBg}
        imageAlt="Grünes Feld mit Biogas-Anlage"
        bullets={[
          "Echte Bio-Anteile statt Zertifikate-Handel",
          "Geprüfte Herkunftsnachweise",
          "Preisaufschlag oft geringer als gedacht",
        ]}
      />

      <FinalCta
        title="Heizkosten ehrlich senken."
        body="Lassen Sie uns gemeinsam prüfen, was Ihr Tarif heute wirklich kostet. Und was er kosten sollte."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
