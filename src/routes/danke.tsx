import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

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
  const { id, nr } = Route.useSearch();
  const vorgangsnummer = nr ?? id;
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
        {vorgangsnummer && (
          <div className="mt-8">
            <div className="text-sm text-muted-foreground">Ihre Vorgangsnummer</div>
            <div className="mt-1 font-mono text-2xl font-bold tracking-widest text-primary">
              {vorgangsnummer}
            </div>
          </div>
        )}
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
