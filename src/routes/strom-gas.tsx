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
      { title: "Strom + Gas im Bundle: Doppel-Bonus sichern | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Strom und Gas bündeln, einen Vertrag verwalten, doppelten Wechselbonus sichern. Wir prüfen, ob sich ein Bundle für Sie wirklich lohnt.",
      },
      { property: "og:title", content: "Strom + Gas im Bundle | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Ein Vertrag, doppelte Ersparnis. Wir prüfen ehrlich, ob sich das Bundle lohnt.",
      },
      { property: "og:image", content: "https://images.unsplash.com/photo-1548502032-4d0e6d99b31e?w=1200&h=630&fit=crop&q=80" },
    ],
  }),
  component: StromGasPage,
});

const features = [
  {
    icon: Gift,
    title: "Doppelter Wechselbonus",
    desc: "Bei vielen Anbietern bekommen Sie Bonus für Strom UND Gas. Kombiniert oft über 300 €.",
  },
  {
    icon: FileSignature,
    title: "Ein Vertrag, eine Rechnung",
    desc: "Statt zwei Versorgern, zwei Portalen, zwei Mahnungen: alles aus einer Hand.",
  },
  {
    icon: Clock,
    title: "Ein Wechseltermin",
    desc: "Wir synchronisieren die Kündigungen, sodass Sie keinen Tag doppelt zahlen.",
  },
  {
    icon: TrendingDown,
    title: "Ehrlich gerechnet",
    desc: "Wir prüfen, ob ein Bundle wirklich günstiger ist. Oder zwei Einzeltarife.",
  },
  {
    icon: ShieldCheck,
    title: "Geprüfte Komplett-Anbieter",
    desc: "Nur Versorger, die in beiden Kategorien überzeugen. Nicht nur im Marketing.",
  },
  {
    icon: Users,
    title: "Familien-Tarife",
    desc: "Spezielle Bundles für Haushalte ab 3 Personen mit erhöhtem Verbrauch.",
  },
];

function StromGasPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Doppel-Bonus möglich"
        title={<>Strom & Gas. Ein Vertrag. Doppelt sparen.</>}
        lead="Ein Bundle ist nicht automatisch günstiger. Aber wenn es passt, sparen Sie doppelt. Wir rechnen es für Sie ehrlich durch."
        image={heroImg}
        imageAlt="Glückliche Familie im hellen Wohnzimmer mit smartem Thermostat"
        Icon={Layers}
        secondaryCta={{ to: "/ablauf", label: "So läuft der Wechsel ab" }}
      />

      <FeatureGrid
        title="Wann sich das Bundle wirklich lohnt"
        intro="Sechs Gründe, warum Strom + Gas aus einer Hand mehr ist als ein Marketing-Trick."
        items={features}
      />

      <ImageSplit
        eyebrow="Bundle vs. Einzeltarife"
        title="Wir vergleichen beide Varianten. Immer"
        body="Standardmäßig prüfen wir nicht nur Bundles, sondern auch jeweils den besten Einzeltarif für Strom und den besten für Gas. Sie bekommen das günstigere Ergebnis. Nicht das mit der höheren Provision."
        image={splitImg}
        imageAlt="Vergleichsdiagramm Strom und Gas Tarife"
        bullets={[
          "Bundle-Berechnung mit echten 24-Monats-Kosten",
          "Parallel: bester Einzeltarif Strom und bester Einzeltarif Gas",
          "Sie entscheiden, was günstiger und einfacher ist",
        ]}
      />

      <FinalCta
        title="Lohnt sich ein Bundle für Sie?"
        body="In 2 Minuten zur ehrlichen Antwort. Mit individuellem Sparbetrag in Euro."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
