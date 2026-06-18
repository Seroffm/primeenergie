import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

const search = z.object({ id: z.string().optional() }).optional();

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
  const { id } = Route.useSearch();
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
        {id && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm">
              <span className="text-muted-foreground">Ihre Vorgangsnummer:</span>
              <span className="font-mono font-semibold text-primary">{id}</span>
            </div>
          </div>
        )}
        <div className="mt-10 flex justify-center">
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
