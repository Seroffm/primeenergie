import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/widerruf")({
  head: () => ({
    meta: [
      { title: "Widerrufsbelehrung von PRIME ENERGIE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StaticPage
      title="Widerrufsbelehrung"
      lead="Hinweise zum Widerruf einer im Fernabsatz geschlossenen Vermittlungsvereinbarung."
    >
      <h2>Widerrufsrecht</h2>
      <p>
        Verbraucher haben das Recht, eine mit uns im Fernabsatz geschlossene Vereinbarung innerhalb
        von 14 Tagen ohne Angabe von Gründen zu widerrufen. Die Frist beginnt mit dem Tag des
        Vertragsabschlusses.
      </p>

      <h2>Ausübung des Widerrufs</h2>
      <p>
        Um Ihr Widerrufsrecht auszuüben, informieren Sie uns mit einer eindeutigen Erklärung per
        Post, E-Mail oder Telefon:
      </p>
      <p>
        Alpha Energie GmbH
        <br />
        Alter Hellweg 50
        <br />
        44379 Dortmund
        <br />
        E-Mail: <a href="mailto:info@primeenergie.de">info@primeenergie.de</a>
        <br />
        Telefon: <a href="tel:+4923139989390">0231 39989390</a>
      </p>
      <p>Zur Wahrung der Frist genügt die rechtzeitige Absendung Ihrer Widerrufserklärung.</p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Nach einem wirksamen Widerruf beenden wir die betroffene Vermittlungsleistung. Da unsere
        Tarifprüfung für anfragende Kunden grundsätzlich kostenlos ist, entstehen hierfür regelmäßig
        keine Erstattungsansprüche.
      </p>

      <h2>Muster-Widerrufsformular</h2>
      <p>
        Wenn Sie widerrufen möchten, können Sie folgende Formulierung verwenden:
        <br />
        „Hiermit widerrufe ich die von mir abgeschlossene Vereinbarung über die Vermittlungsleistung
        von PRIME ENERGIE. Name, Anschrift, Datum und – bei postalischer Übersendung –
        Unterschrift.“
      </p>

      <h2>Hinweis zu Energielieferverträgen</h2>
      <p>
        Für einen vermittelten Strom-, Gas- oder sonstigen Produktvertrag erhalten Sie eine
        gesonderte Widerrufsbelehrung des jeweiligen Anbieters. Ein Widerruf gegenüber PRIME ENERGIE
        ersetzt den Widerruf gegenüber diesem Anbieter nicht.
      </p>

      <p className="text-xs text-muted-foreground">Stand: 30. Juli 2026</p>
    </StaticPage>
  ),
});
