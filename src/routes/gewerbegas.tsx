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
      { title: "Gewerbegas persönlich prüfen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "PRIME ENERGIE prüft Gewerbegastarife für Gastronomie, Handwerk, Produktion und mehrere Standorte persönlich.",
      },
      { property: "og:title", content: "Gewerbegas vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "Gewerbegas mit verständlicher Einordnung von Preis, Laufzeit und Verbrauchsprofil.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80",
      },
    ],
  }),
  component: GewerbegasPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Kostenstruktur prüfen",
    desc: "Wir betrachten Arbeitspreis, Grundpreis und Laufzeit passend zum Verbrauch Ihres Betriebs.",
  },
  {
    icon: ShieldCheck,
    title: "Festpreisgarantie",
    desc: "Wir stellen verfügbare Festpreisoptionen und deren Bedingungen verständlich dar.",
  },
  {
    icon: Flame,
    title: "Auch Bio-Erdgas",
    desc: "Auf Wunsch berücksichtigen wir Biogasoptionen und die im Angebot genannten Nachweise.",
  },
  {
    icon: FileText,
    title: "Mehrere Standorte",
    desc: "Mehrere Standorte oder Zähler können gemeinsam erfasst und strukturiert betrachtet werden.",
  },
  {
    icon: Users,
    title: "Persönliche Beratung",
    desc: "Fragen zu Verbrauch, Laufzeit und Angeboten besprechen Sie direkt mit unserem Team.",
  },
  {
    icon: BadgeCheck,
    title: "Wechselunterstützung",
    desc: "Nach Ihrer Entscheidung begleiten wir die vereinbarten Schritte zum neuen Vertrag.",
  },
];

function GewerbegasPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Gewerbegas"
        title={
          <>
            Gas für Ihr Unternehmen. <span className="text-success">Planbar und verständlich.</span>
          </>
        }
        lead="Vom Restaurant bis zur Produktion: PRIME ENERGIE erfasst Ihren Bedarf und ordnet verfügbare Gewerbegastarife verständlich ein."
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
        body="Gastronomie, Immobilien und Produktion nutzen Gas auf unterschiedliche Weise. Wir berücksichtigen Jahresverbrauch, Standorte und den Zweck des Gasbezugs."
        image={splitImg}
        imageAlt="Bäckerei mit großem Backofen"
        bullets={[
          "Bäckereien, Gastronomie, Hotels, Wäschereien",
          "Hausverwaltungen mit zentraler Heizung",
          "Produzierendes Gewerbe mit Prozesswärme",
          "Vorhandene Lastgangdaten bei größeren Verbräuchen",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="Sicherheit zuerst"
        title="Vertragsdetails sorgfältig betrachten"
        body="Preisgleitklauseln, Laufzeit, Kündigungsfrist und Übergabetermin können für Gewerbekunden besonders wichtig sein. Wir machen diese Punkte sichtbar."
        image={ctaBg}
        imageAlt="Unternehmer prüft Gasrechnung am Schreibtisch"
        bullets={[
          "Bestehende Vertragslaufzeit berücksichtigen",
          "Preisgarantie und Ausnahmen einordnen",
          "Verfügbare Beschaffungsmodelle verständlich darstellen",
          "Nächste Schritte gemeinsam abstimmen",
        ]}
      />

      <FinalCta
        title="Gewerbegas passend zum Betrieb prüfen"
        body="Senden Sie uns Ihre letzte Jahresrechnung. Die erste Einordnung ist kostenlos und unverbindlich."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
