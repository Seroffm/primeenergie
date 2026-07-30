import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [{ title: "Impressum von PRIME ENERGIE" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <StaticPage title="Impressum" lead="PRIME ENERGIE ist ein Angebot der Alpha Energie GmbH.">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        Alpha Energie GmbH
        <br />
        Alter Hellweg 50
        <br />
        44379 Dortmund
        <br />
        Deutschland
      </p>

      <h2>Vertretungsberechtigte Person</h2>
      <p>Geschäftsführer: Tolga Canga</p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+4923139989390">0231 39989390</a>
        <br />
        E-Mail: <a href="mailto:info@primeenergie.de">info@primeenergie.de</a>
      </p>

      <h2>Handelsregister</h2>
      <p>
        Registergericht: Amtsgericht Dortmund
        <br />
        Registernummer: HRB 38030
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: beantragt.</p>

      <h2>Verantwortlich für redaktionelle Inhalte</h2>
      <p>
        Verantwortlich gemäß § 18 Abs. 2 MStV:
        <br />
        Tolga Canga
        <br />
        Alter Hellweg 50
        <br />
        44379 Dortmund
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Wir pflegen die Inhalte dieses Angebots mit angemessener Sorgfalt. Für die Inhalte externer
        Websites, auf die wir verlinken, sind ausschließlich deren Betreiber verantwortlich. Sobald
        wir von einer konkreten Rechtsverletzung erfahren, entfernen wir den betreffenden Link.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen
        Urheberrecht. Eine Nutzung außerhalb der gesetzlichen Schranken bedarf der vorherigen
        Zustimmung des jeweiligen Rechteinhabers.
      </p>

      <p className="text-xs text-muted-foreground">Stand: 30. Juli 2026</p>
    </StaticPage>
  ),
});
