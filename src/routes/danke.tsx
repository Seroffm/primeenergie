import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { isValidLeadNumber, generateLeadNumber } from "@/lib/lead-number";

const search = z.object({ id: z.string().optional(), nr: z.string().optional() }).optional();

export const Route = createFileRoute("/danke")({
  validateSearch: (s) => search.parse(s) ?? {},
  head: () => ({
    meta: [
      { title: "Anfrage eingegangen | PRIME ENERGIE" },
      { name: "description", content: "Vielen Dank für Ihre Anfrage." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThanksPage,
});

function ThanksPage() {
  const { nr } = Route.useSearch();

  // nr aus URL nur verwenden wenn es exakt dem 7-Zeichen-Format entspricht.
  // L-2026-XXXX (altes Backend-Format) und UUIDs werden abgelehnt.
  // Niemals id/UUID als Fallback — immer generateLeadNumber().
  const [vorgangsnummer] = useState<string>(() => {
    if (nr && isValidLeadNumber(nr)) return nr;
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("prime-lead-nr");
      if (stored && isValidLeadNumber(stored)) return stored;
    }
    return generateLeadNumber();
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-primary md:text-4xl">
          Vielen Dank. Ihre Anfrage ist eingegangen.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Wir prüfen jetzt passende Strom- und Gasangebote für Sie. Ein Berater meldet sich
          innerhalb der nächsten <strong className="text-foreground">24 Stunden</strong>.
        </p>

        <div className="mt-8 inline-block rounded-xl border bg-muted/50 px-6 py-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ihre Vorgangsnummer
          </p>
          <p className="mt-1.5 font-mono text-base font-semibold tracking-widest text-foreground">
            {vorgangsnummer}
          </p>
        </div>

        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/">
              Zurück zur Startseite <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
