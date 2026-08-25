import { Link } from "@tanstack/react-router";
import { Phone, ChevronUp } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { COOKIE_CONSENT_OPEN_EVENT } from "@/lib/cookie-consent";

type Col = { title: string; links: { to: string; label: string }[] };

const columns: Col[] = [
  {
    title: "Strom",
    links: [
      { to: "/strom", label: "Strom für Zuhause" },
      { to: "/angebot", label: "Stromtarif prüfen" },
      { to: "/gewerbestrom", label: "Gewerbestrom" },
      { to: "/ablauf", label: "So begleitet PRIME ENERGIE" },
    ],
  },
  {
    title: "Gas",
    links: [
      { to: "/gas", label: "Gas für Zuhause" },
      { to: "/angebot", label: "Gastarif prüfen" },
      { to: "/gewerbegas", label: "Gewerbegas" },
      { to: "/strom-gas", label: "Strom & Gas gemeinsam prüfen" },
    ],
  },
  {
    title: "Service",
    links: [
      { to: "/ablauf", label: "Unser Ablauf" },
      { to: "/kontakt", label: "Persönliche Beratung" },
      { to: "/faq", label: "Hilfe & FAQ" },
      { to: "/wissen", label: "Energie-Wissen" },
    ],
  },
  {
    title: "Über PRIME ENERGIE",
    links: [
      { to: "/ueber-uns", label: "Über uns" },
      { to: "/freunde-werben", label: "PRIME ENERGIE empfehlen" },
      { to: "/kontakt", label: "Kontakt" },
      { to: "/wissen", label: "Ratgeber" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Top row: logo + back-to-top */}
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Link
            to="/"
            aria-label="PRIME ENERGIE Startseite"
            className="inline-flex w-full max-w-[18.4rem] rounded-lg transition-opacity hover:opacity-80 sm:max-w-[20.7rem]"
          >
            <BrandLogo className="w-full" />
          </Link>
          <button
            type="button"
            onClick={() =>
              typeof window !== "undefined" && window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary transition hover:border-success hover:text-success"
          >
            <ChevronUp className="h-4 w-4" /> Zum Seitenanfang
          </button>
        </div>

        {/* Link columns */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <div className="font-display text-sm font-bold text-primary">{c.title}</div>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="inline-flex min-h-6 items-center transition hover:text-success"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-14 border-t border-border pt-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Persönliche Beratung
            </div>
            <Link
              to="/kontakt"
              className="mt-2 inline-flex items-center gap-3 font-display text-2xl font-extrabold text-primary transition hover:text-success md:text-3xl"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-success/10 text-success">
                <Phone className="h-4 w-4" />
              </span>
              Anrufen
            </Link>
            <div className="mt-2 text-sm text-muted-foreground">
              Direkter Kontakt zum Team von PRIME ENERGIE
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground">
          <div>© {year} PRIME ENERGIE · Persönlich beraten · Transparent entscheiden</div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link to="/impressum" className="inline-flex min-h-8 items-center hover:text-success">
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="inline-flex min-h-8 items-center hover:text-success"
            >
              Datenschutz
            </Link>
            <Link to="/widerruf" className="inline-flex min-h-8 items-center hover:text-success">
              Widerruf
            </Link>
            <Link to="/agb" className="inline-flex min-h-8 items-center hover:text-success">
              AGB
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT))}
              className="inline-flex min-h-8 items-center hover:text-success"
            >
              Cookie Einstellungen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
