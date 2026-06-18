import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  TrendingDown,
  ShieldCheck,
  FileText,
  Flame,
  Users,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero, FeatureGrid, ImageSplit, FinalCta } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-gas.jpg";
import splitImg from "@/assets/solution-waermestrom.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/gewerbegas")({
  head: () => ({
    meta: [
      { title: "Gewerbegas vergleichen: Festpreise sichern | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Gewerbegas-Tarife persönlich vergleichen: Festpreise bis 36 Monate, Bio-Erdgas, Lastgangoptimierung. Für Gastronomie, Bäckereien, Produktion und Filialbetriebe.",
      },
      { property: "og:title", content: "Gewerbegas vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "Gewerbegas: Festpreise, Preisgarantie, individuelle Beratung für Ihr Unternehmen.",
      },
      { property: "og:image", content: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80" },
    ],
  }),
  component: GewerbegasPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Spürbare Ersparnis",
    desc: "Bei Gas sind 15–25 % Ersparnis gegenüber Standardtarifen normal. Besonders bei Verbräuchen ab 50.000 kWh.",
  },
  {
    icon: ShieldCheck,
    title: "Festpreisgarantie",
    desc: "Wir verhandeln Festpreise für 12, 24 oder 36 Monate. Planbare Energiekosten ohne Überraschungen.",
  },
  {
    icon: Flame,
    title: "Auch Bio-Erdgas",
    desc: "Auf Wunsch zertifiziertes Bio-Erdgas. Wirksam für Ihre Nachhaltigkeitsbilanz, ohne CO₂-Aufschlag.",
  },
  {
    icon: FileText,
    title: "Mehrere Standorte",
    desc: "Wir bündeln Verträge für mehrere Standorte oder Filialen. Ein Ansprechpartner, eine saubere Rechnung.",
  },
  {
    icon: Users,
    title: "Persönliche Beratung",
    desc: "Sie erreichen Ihren Account-Manager direkt. Ohne Warteschleife, ohne Tariflotterie.",
  },
  {
    icon: BadgeCheck,
    title: "Wechselgarantie",
    desc: "Wir übernehmen die Kündigung und den lückenlosen Wechsel. Ihr Gas läuft ohne Unterbrechung weiter.",
  },
];

function GewerbegasPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Gewerbegas"
        title={
          <>
            Gas für Ihr Unternehmen.{" "}
            <span className="text-success">Festgepreist statt schwankend.</span>
          </>
        }
        lead="Vom Restaurant bis zur Produktion: Wir verhandeln planbare Gewerbegas-Tarife mit echter Preisgarantie. Kostenlos und unverbindlich."
        image={heroImg}
        imageAlt="Industrielle Anlage mit Gas-Heizsystem"
        Icon={Building2}
        secondaryCta={{ to: "/kontakt", label: "Persönliches Angebot anfordern" }}
      />

      <FeatureGrid
        title="Warum Gewerbegas über PRIME ENERGIE?"
        intro="Sechs Gründe, warum Sie Ihren Gastarif mit uns prüfen sollten."
        items={features}
      />

      <ImageSplit
        eyebrow="Für wen das passt"
        title="Vom Gastronom bis zur Bäckerei"
        body="Wir betreuen Gewerbekunden mit Gasverbräuchen ab 10.000 kWh. Branchenübergreifend. Besonders interessant für energieintensive Betriebe mit hohem Heiz- oder Prozesswärmebedarf."
        image={splitImg}
        imageAlt="Bäckerei mit großem Backofen"
        bullets={[
          "Bäckereien, Gastronomie, Hotels, Wäschereien",
          "Hausverwaltungen mit zentraler Heizung",
          "Produzierendes Gewerbe mit Prozesswärme",
          "Lastgangoptimierung ab 1,5 Mio. kWh möglich",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="Sicherheit zuerst"
        title="Bei Gas zählt jeder Cent. Und jede Stunde"
        body="Anders als bei Strom ist die Versorgungssicherheit bei Gas besonders kritisch. Wir achten penibel auf saubere Vertragsübergänge, Preisgleitklauseln und realistische Beschaffungsprognosen."
        image={ctaBg}
        imageAlt="Unternehmer prüft Gasrechnung am Schreibtisch"
        bullets={[
          "Lückenlose Versorgung. Garantiert",
          "Echte Preisgarantien statt Bonus-Marketing",
          "Beschaffung in Tranchen möglich (ab 1 Mio. kWh)",
          "Jährliche Marktprüfung & Anpassungsempfehlung",
        ]}
      />

      <FinalCta
        title="Wie viel könnte Ihr Betrieb sparen?"
        body="Senden Sie uns Ihre letzte Jahresrechnung. Wir rechnen Ihnen kostenlos drei Festpreis-Angebote durch."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
