import { createFileRoute } from "@tanstack/react-router";
import {
  Sun,
  Battery,
  Thermometer,
  TrendingDown,
  ShieldCheck,
  BadgeCheck,
  Wrench,
  Leaf,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero, FeatureGrid, ImageSplit, FinalCta } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-solar.jpg";
import splitImg from "@/assets/solution-solar.jpg";
import splitImg2 from "@/assets/solution-waermestrom.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/solar")({
  head: () => ({
    meta: [
      { title: "Solar & Wärmepumpe verständlich planen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Erste Orientierung zu Photovoltaik, Stromspeicher und Wärmepumpe – verständlich erklärt und auf Ihre Immobilie bezogen.",
      },
      { property: "og:title", content: "Solar & Wärmepumpe | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Persönliche Orientierung zu Solaranlage, Stromspeicher und Wärmepumpe.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=630&fit=crop&q=80",
      },
    ],
  }),
  component: SolarPage,
});

const features = [
  {
    icon: Sun,
    title: "Bedarf einordnen",
    desc: "Dach, Verbrauch und Zukunftspläne bilden die Grundlage für die ersten Überlegungen.",
  },
  {
    icon: Battery,
    title: "Stromspeicher",
    desc: "Wir erklären, wann ein Speicher sinnvoll sein kann und welche Angaben dafür wichtig sind.",
  },
  {
    icon: Thermometer,
    title: "Wärmepumpe",
    desc: "Wir betrachten Heizsystem, Gebäude und einen möglichen Wärmestromtarif im Zusammenhang.",
  },
  {
    icon: BadgeCheck,
    title: "Nächste Schritte",
    desc: "Nach der Erstberatung klären wir mit Ihnen, welche Fachplanung oder welches Angebot benötigt wird.",
  },
  {
    icon: Wrench,
    title: "Förderung mitdenken",
    desc: "Wir weisen auf mögliche Förderwege hin; verbindlich ist die Prüfung der zuständigen Stelle.",
  },
  {
    icon: Leaf,
    title: "Eigenverbrauch verstehen",
    desc: "Sie erfahren, wie Erzeugung, Verbrauch und mögliche Speicherung zusammenspielen.",
  },
];

function SolarPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Eigene Energie produzieren"
        title={<>Ihre Energie zuhause neu denken.</>}
        lead="Photovoltaik, Stromspeicher und Wärmepumpe gehören zusammen gedacht. PRIME ENERGIE schafft eine verständliche erste Orientierung."
        image={heroImg}
        imageAlt="Einfamilienhaus mit Solaranlage auf dem Dach"
        Icon={Sun}
        primaryCta={{ to: "/kontakt", label: "Kostenlose Solar-Beratung" }}
        secondaryCta={{ to: "/ablauf", label: "So läuft die Planung ab" }}
      />

      <FeatureGrid
        title="Energie aus dem eigenen Haus"
        intro="Sechs Themen, die vor einem konkreten Angebot sorgfältig betrachtet werden sollten."
        items={features}
      />

      <ImageSplit
        eyebrow="Photovoltaik"
        title="Photovoltaik verständlich vorbereiten"
        body="Dachfläche, Ausrichtung, Verschattung und Verbrauch beeinflussen die passende Anlagengröße. Wir helfen Ihnen, die richtigen Informationen für eine Fachplanung zusammenzustellen."
        image={splitImg}
        imageAlt="Photovoltaik-Module aus der Nähe"
        bullets={[
          "Dachfläche, Ausrichtung und Verschattung erfassen",
          "Jahresverbrauch und zukünftige Verbraucher berücksichtigen",
          "Angebote anhand vergleichbarer Angaben bewerten",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="Wärmepumpe"
        title="Heizen mit der Wärme der Umgebung"
        body="Eine Wärmepumpe muss zu Gebäude, Heizflächen und Wärmebedarf passen. Zusätzlich kann ein geeigneter Stromtarif wichtig sein. Wir ordnen diese Punkte für Sie ein."
        image={splitImg2}
        imageAlt="Moderne Wärmepumpe im Außenbereich"
        bullets={[
          "Heizlast und vorhandene Heizflächen fachlich prüfen lassen",
          "Strombedarf und mögliche Wärmestromtarife berücksichtigen",
          "Förderbedingungen vor Beauftragung aktuell prüfen",
        ]}
      />

      <FinalCta
        title="Energie aus dem eigenen Haus."
        body="Sprechen Sie mit uns über Gebäude, Verbrauch und Ziele. Danach kennen Sie die sinnvollen nächsten Schritte."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
