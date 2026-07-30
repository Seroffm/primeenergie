import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/widerruf")({
  head: () => ({
    meta: [{ title: "Widerrufsbelehrung von PRIME ENERGIE" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <StaticPage
      title="Widerrufsbelehrung"
      lead="Verbraucher haben grundsätzlich das Recht, einen geschlossenen Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen."
    >
      <h2>Widerrufsrecht</h2>
      <p>Die Widerrufsfrist beträgt grundsätzlich 14 Tage ab dem Tag des Vertragsabschlusses.</p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Im Falle eines wirksamen Widerrufs sind die beiderseits empfangenen Leistungen
        zurückzugewähren.
      </p>

      <h2>Wie widerrufen?</h2>
      <p>
        Senden Sie uns eine eindeutige, formlose Erklärung über das Kontaktformular. Die
        verifizierte Anbieteranschrift wird vor dem öffentlichen Start im Impressum ergänzt.
      </p>

      <p className="text-xs text-muted-foreground">
        Diese Testfassung ersetzt noch keine abschließend rechtlich geprüfte Widerrufsbelehrung.
      </p>
    </StaticPage>
  ),
});
