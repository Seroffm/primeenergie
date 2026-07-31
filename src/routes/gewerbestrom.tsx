import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  TrendingDown,
  ShieldCheck,
  FileText,
  Sparkles,
  Zap,
  Users,
  BadgeCheck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero, FeatureGrid, ImageSplit, FinalCta } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-strom.jpg";
import splitImg from "@/assets/solution-autostrom.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/gewerbestrom")({
  head: () => ({
    meta: [
      { title: "Gewerbestrom persönlich prüfen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "PRIME ENERGIE prüft Gewerbestrom für Unternehmen, Handwerk, Gastronomie und mehrere Standorte persönlich und nachvollziehbar.",
      },
      { property: "og:title", content: "Gewerbestrom vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "Gewerbestrom mit persönlicher Einordnung von Preis, Laufzeit und Verbrauchsprofil.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=630&fit=crop&q=80",
      },
    ],
  }),
  component: GewerbestromPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Kostenstruktur verstehen",
    desc: "Wir betrachten Preisbestandteile, Laufzeit und Verbrauchsprofil Ihres Betriebs.",
  },
  {
    icon: ShieldCheck,
    title: "Planbarkeit einordnen",
    desc: "Verfügbare Festpreis- und Garantieoptionen werden mit ihren Bedingungen dargestellt.",
  },
  {
    icon: FileText,
    title: "Mehrere Standorte",
    desc: "Mehrere Zähler oder Standorte können in einer gemeinsamen Anfrage erfasst werden.",
  },
  {
    icon: Users,
    title: "Persönlicher Kontakt",
    desc: "Rückfragen zu Lastprofil, Vertragsdaten und Angeboten besprechen Sie direkt mit unserem Team.",
  },
  {
    icon: Sparkles,
    title: "Lastprofil berücksichtigen",
    desc: "Bei größeren Verbräuchen beziehen wir vorhandene Lastgangdaten in die Anfrage ein.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent entscheiden",
    desc: "Sie erhalten die entscheidenden Konditionen verständlich aufbereitet und entscheiden selbst.",
  },
];

function GewerbestromPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Gewerbestrom"
        title={
          <>
            Strom für Ihr Unternehmen.{" "}
            <span className="text-success">Passend zum Verbrauchsprofil.</span>
          </>
        }
        lead="Vom Handwerksbetrieb bis zum Filialnetz: PRIME ENERGIE erfasst Ihren Bedarf und ordnet verfügbare Gewerbestromangebote verständlich ein."
        image={heroImg}
        imageAlt="Modernes Bürogebäude mit beleuchteten Fenstern"
        Icon={Building2}
        secondaryCta={{ to: "/kontakt", label: "Persönliches Angebot anfordern" }}
      />

      <FeatureGrid
        title="Warum Gewerbestrom über PRIME ENERGIE?"
        intro="Sechs Punkte, die Unternehmen bei der Tarifprüfung mit PRIME ENERGIE unterstützen."
        items={features}
      />

      <ImageSplit
        eyebrow="Für wen das passt"
        title="Vom Café bis zur Maschinenhalle"
        body="Jede Branche hat ein anderes Verbrauchsprofil. Wir erfassen Jahresverbrauch, Zähler, Standorte und Lastgangdaten, soweit sie für die Anfrage erforderlich sind."
        image={splitImg}
        imageAlt="Werkstatt mit moderner Beleuchtung"
        bullets={[
          "Handwerk, Gastronomie, Einzelhandel, Praxen",
          "Filialnetze & Hausverwaltungen mit mehreren Zählern",
          "Produzierendes Gewerbe mit individuellem Lastprofil",
          "Vorhandene Vertrags- und Rechnungsdaten strukturiert erfassen",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="So läuft es ab"
        title="3 Schritte zur passenden Tarifentscheidung"
        body="Sie übermitteln die relevanten Unterlagen. Wir prüfen die Ausgangslage, besprechen verfügbare Optionen und begleiten auf Wunsch die nächsten Schritte."
        image={ctaBg}
        imageAlt="Unternehmer prüft Vertragsangebote"
        bullets={[
          "1. Rechnung hochladen oder per E-Mail senden",
          "2. PRIME ENERGIE ordnet verfügbare Optionen für Ihr Profil ein",
          "3. Sie entscheiden und beauftragen die gewünschten nächsten Schritte",
        ]}
      />

      <FinalCta
        title="Gewerbestrom passend zum Betrieb prüfen"
        body="Senden Sie uns Ihre letzte Jahresrechnung. Die erste Einordnung ist kostenlos und unverbindlich."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
