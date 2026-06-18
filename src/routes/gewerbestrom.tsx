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
      { title: "Gewerbestrom vergleichen: Bis 30 % sparen | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Gewerbestrom-Tarife persönlich vergleichen: bis zu 30 % Ersparnis für KMU, Handwerk, Gastronomie und Filialbetriebe. Festpreise, Preisgarantie, Wechselgarantie.",
      },
      { property: "og:title", content: "Gewerbestrom vergleichen | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "Gewerbestrom: Festpreise, Preisgarantie bis 36 Monate, individuelle Beratung für Ihr Unternehmen.",
      },
      { property: "og:image", content: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=630&fit=crop&q=80" },
    ],
  }),
  component: GewerbestromPage,
});

const features = [
  {
    icon: TrendingDown,
    title: "Bis zu 30 % Ersparnis",
    desc: "Gewerbetarife liegen oft deutlich unter Grundversorgung. Wir holen Festpreis-Angebote ein, die sich auf 24 Monate wirklich rechnen.",
  },
  {
    icon: ShieldCheck,
    title: "Preisgarantie bis 36 Mt.",
    desc: "Kein Risiko durch Preisanpassungen mitten im Jahr. Wir verhandeln Festpreise mit echter Garantie.",
  },
  {
    icon: FileText,
    title: "Mehrere Standorte",
    desc: "Auch Filial- und Mehrstandortverträge übernehmen wir gebündelt. Ein Ansprechpartner für alle Zähler.",
  },
  {
    icon: Users,
    title: "Persönlicher Account-Manager",
    desc: "Direkter Draht statt Hotline. Wir kennen Ihr Profil und prüfen jährlich, ob es noch passt.",
  },
  {
    icon: Sparkles,
    title: "Lastgangoptimierung",
    desc: "Bei Verbräuchen ab 100.000 kWh prüfen wir Sondervertragstarife und Spitzenlast-Optimierung.",
  },
  {
    icon: BadgeCheck,
    title: "100 % unabhängig",
    desc: "Wir vergleichen alle relevanten Versorger. Keine Bindung an einen Konzern, keine Lockangebote.",
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
            <span className="text-success">Verhandelt statt abgestempelt.</span>
          </>
        }
        lead="Vom Handwerksbetrieb bis zum Filialnetz: Wir vergleichen 200+ Gewerbestrom-Tarife und holen für Sie echte Festpreis-Angebote ein."
        image={heroImg}
        imageAlt="Modernes Bürogebäude mit beleuchteten Fenstern"
        Icon={Building2}
        secondaryCta={{ to: "/kontakt", label: "Persönliches Angebot anfordern" }}
      />

      <FeatureGrid
        title="Warum Gewerbestrom über PRIME ENERGIE?"
        intro="Sechs Gründe, warum Geschäftsführer und Einkäufer mit uns vergleichen."
        items={features}
      />

      <ImageSplit
        eyebrow="Für wen das passt"
        title="Vom Café bis zur Maschinenhalle"
        body="Wir betreuen Gewerbekunden mit Verbräuchen zwischen 10.000 und 1 Mio. kWh. Branchenübergreifend. Je nach Lastprofil bekommen Sie Festpreis-, Spot- oder Mischtarife."
        image={splitImg}
        imageAlt="Werkstatt mit moderner Beleuchtung"
        bullets={[
          "Handwerk, Gastronomie, Einzelhandel, Praxen",
          "Filialnetze & Hausverwaltungen mit mehreren Zählern",
          "Produzierendes Gewerbe ab 100.000 kWh. Inkl. Lastgangoptimierung",
          "Steuerlich saubere Rechnungen, immer mit Vorsteuerabzug",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="So läuft es ab"
        title="3 Schritte zum besseren Gewerbetarif"
        body="Sie übergeben uns einmal Ihre letzte Jahresrechnung. Wir kümmern uns um den Rest. Vergleich, Verhandlung, Kündigung, Anmeldung. Sie unterschreiben nur ein Mal."
        image={ctaBg}
        imageAlt="Unternehmer prüft Vertragsangebote"
        bullets={[
          "1. Rechnung hochladen oder per E-Mail senden",
          "2. Wir holen 3–5 Festpreis-Angebote für Ihr Lastprofil",
          "3. Vertragswechsel komplett durch uns. Keine Versorgungslücke",
        ]}
      />

      <FinalCta
        title="Wie viel könnte Ihr Unternehmen sparen?"
        body="Schicken Sie uns Ihre letzte Jahresrechnung. Wir rechnen kostenlos und unverbindlich."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
