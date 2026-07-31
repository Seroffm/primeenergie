import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, FileWarning } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { isValidLeadNumber } from "@/lib/lead-number";

const search = z
  .object({
    id: z.string().optional(),
    nr: z.string().optional(),
    rechnung: z.enum(["hochgeladen", "nachreichen"]).optional(),
  })
  .optional();

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
  const { nr, rechnung } = Route.useSearch();

  // Nur die vom Backend gespeicherte Nummer anzeigen. Eine lokal erzeugte
  // Ersatznummer wäre nicht mit dem Lead verknüpft und damit nicht suchbar.
  const vorgangsnummer = nr && isValidLeadNumber(nr) ? nr : null;

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
          Das Team von PRIME ENERGIE prüft jetzt passende Angebote für Strom und Gas anhand Ihrer
          Angaben. Wir melden uns persönlich bei Ihnen.
        </p>

        <div className="mt-8 inline-block rounded-xl border bg-muted/50 px-6 py-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ihre Vorgangsnummer
          </p>
          <p className="mt-1.5 font-mono text-base font-semibold tracking-widest text-foreground">
            {vorgangsnummer ?? "Nicht verfügbar"}
          </p>
        </div>

        {rechnung === "nachreichen" && (
          <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-950">
            <FileWarning className="mt-0.5 h-5 w-5 flex-none" />
            <p>
              Ihre Anfrage wurde gespeichert, die Rechnungsdatei konnte technisch noch nicht
              übertragen werden. Bitte halten Sie sie für die weitere Bearbeitung bereit; Ihr
              Berater fordert sie bei Bedarf erneut an.
            </p>
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
