import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung – PRIME ENERGIE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StaticPage
      title="Datenschutzerklärung"
      lead="Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie darüber, wie wir Ihre personenbezogenen Daten verarbeiten."
    >
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
      </p>
      <p>
        PRIME ENERGIE GmbH
        <br />
        Friedrichstraße 123
        <br />
        10117 Berlin
        <br />
        Deutschland
        <br />
        E-Mail:{" "}
        <a href="mailto:hallo@energieclever.de" className="text-success hover:underline">
          hallo@energieclever.de
        </a>
        <br />
        Telefon:{" "}
        <a href="tel:08001234567" className="text-success hover:underline">
          0800 123 4567
        </a>
      </p>

      <h2>2. Allgemeine Hinweise und Rechtsgrundlagen</h2>
      <p>
        Wir verarbeiten personenbezogene Daten nur, soweit eine Rechtsgrundlage nach Art. 6 DSGVO
        dies erlaubt:
      </p>
      <ul>
        <li>
          <strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Die betroffene Person hat ihre Einwilligung
          zur Verarbeitung gegeben.
        </li>
        <li>
          <strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Die Verarbeitung ist zur Erfüllung eines
          Vertrags oder zur Durchführung vorvertraglicher Maßnahmen erforderlich.
        </li>
        <li>
          <strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Die Verarbeitung ist zur Erfüllung einer
          rechtlichen Verpflichtung erforderlich.
        </li>
        <li>
          <strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Die Verarbeitung ist zur Wahrung berechtigter
          Interessen erforderlich, sofern nicht die Interessen der betroffenen Person überwiegen.
        </li>
      </ul>

      <h2>3. Datenerhebung beim Website-Besuch</h2>
      <p>
        Beim Besuch unserer Website werden automatisch technische Informationen in Server-Log-Dateien
        erfasst. Dazu gehören:
      </p>
      <ul>
        <li>IP-Adresse des anfragenden Geräts (anonymisiert nach 7 Tagen)</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>Name und URL der abgerufenen Datei</li>
        <li>Website, von der aus der Zugriff erfolgte (Referrer-URL)</li>
        <li>Verwendeter Browser und Betriebssystem</li>
        <li>HTTP-Statuscode</li>
      </ul>
      <p>
        Die Verarbeitung dieser Daten ist zur Bereitstellung und Sicherung der Website technisch
        notwendig und erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO. Die Log-Dateien werden
        nach spätestens 30 Tagen gelöscht.
      </p>

      <h2>4. Kontaktformular und Leaderfassung</h2>
      <p>
        Wenn Sie über unser Formular eine Tarifprüfung beantragen, erheben wir folgende Daten:
      </p>
      <ul>
        <li>Vorname und Nachname</li>
        <li>E-Mail-Adresse</li>
        <li>Telefonnummer</li>
        <li>Postleitzahl und Energieart (Strom, Gas, beides)</li>
        <li>Ungefährer Jahresverbrauch (kWh)</li>
        <li>Auf Wunsch: bisheriger Anbieter und Vertragsdetails</li>
      </ul>
      <p>
        Zweck der Verarbeitung ist die Durchführung der beantragten Tarifprüfung und die
        Kontaktaufnahme zur persönlichen Beratung (Art. 6 Abs. 1 lit. b DSGVO). Diese Daten
        werden nicht ohne Ihre ausdrückliche Einwilligung an Dritte weitergegeben. Die Daten werden
        spätestens 24 Monate nach Abschluss der Beratungsleistung oder auf Ihren Wunsch hin
        gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Unsere Website verwendet ausschließlich technisch notwendige Cookies, die den Betrieb der
        Website ermöglichen. Darüber hinaus setzen wir Cloudflare Turnstile als
        CAPTCHA-Lösung ein, um automatisierte Anfragen zu erkennen und abzuwehren. Cloudflare
        Turnstile setzt dabei datenschutzfreundliche Signale ein, die keine personenbezogenen Daten
        speichern. Weitere Informationen finden Sie unter{" "}
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-success hover:underline"
        >
          cloudflare.com/privacypolicy
        </a>
        .
      </p>
      <p>
        Wir verwenden keine Tracking-Cookies, keine Werbe-Cookies und keine Social-Media-Tracking-Pixel.
      </p>

      <h2>6. Hosting und CDN</h2>
      <p>
        Unsere Website wird über <strong>Vercel Inc.</strong> (340 Pine Street, Suite 900, San
        Francisco, CA 94104, USA) gehostet. Vercel verarbeitet technische Zugriffsdaten im Rahmen
        der Bereitstellung der Website. Vercel ist nach dem EU-US Data Privacy Framework zertifiziert.
        Die Datenbankinfrastruktur wird über <strong>Supabase</strong> bereitgestellt, wobei die
        Datenhaltung in der EU erfolgt (Region eu-central-1). Mit beiden Dienstleistern bestehen
        Auftragsverarbeitungsverträge gemäß Art. 28 DSGVO.
      </p>

      <h2>7. E-Mail-Kommunikation</h2>
      <p>
        Für den Versand von Transaktions-E-Mails (z. B. Eingangsbestätigungen Ihrer Anfrage)
        nutzen wir den Dienst <strong>Resend</strong> (Resend Inc., 2261 Market Street #5001,
        San Francisco, CA 94114, USA). Resend verarbeitet dabei nur die zur Zustellung der E-Mail
        notwendigen Daten (E-Mail-Adresse, Inhalt). Mit Resend besteht ein
        Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.
      </p>

      <h2>8. Ihre Rechte als betroffene Person</h2>
      <p>
        Sie haben nach der DSGVO folgende Rechte gegenüber uns hinsichtlich der Sie betreffenden
        personenbezogenen Daten:
      </p>
      <ul>
        <li>
          <strong>Recht auf Auskunft</strong> (Art. 15 DSGVO): Sie können Auskunft über die von uns
          verarbeiteten personenbezogenen Daten verlangen.
        </li>
        <li>
          <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO): Sie können die Berichtigung
          unrichtiger Daten verlangen.
        </li>
        <li>
          <strong>Recht auf Löschung</strong> (Art. 17 DSGVO): Sie können unter bestimmten
          Voraussetzungen die Löschung Ihrer Daten verlangen.
        </li>
        <li>
          <strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO): Sie können
          unter bestimmten Voraussetzungen die Einschränkung der Verarbeitung verlangen.
        </li>
        <li>
          <strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO): Sie können verlangen,
          dass wir Ihnen die uns bereitgestellten Daten in einem strukturierten, maschinenlesbaren
          Format übermitteln.
        </li>
        <li>
          <strong>Recht auf Widerspruch</strong> (Art. 21 DSGVO): Sie können der Verarbeitung
          Ihrer Daten auf Basis von Art. 6 Abs. 1 lit. f DSGVO jederzeit widersprechen.
        </li>
        <li>
          <strong>Recht auf Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO): Eine
          erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
        </li>
      </ul>
      <p>
        Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an:{" "}
        <a href="mailto:hallo@energieclever.de" className="text-success hover:underline">
          hallo@energieclever.de
        </a>
      </p>

      <h2>9. Beschwerderecht bei der Aufsichtsbehörde</h2>
      <p>
        Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die
        DSGVO verstößt, haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
        beschweren. Die für uns zuständige Aufsichtsbehörde ist:
      </p>
      <p>
        Berliner Beauftragte für Datenschutz und Informationsfreiheit
        <br />
        Friedrichstr. 219
        <br />
        10969 Berlin
        <br />
        <a
          href="https://www.datenschutz-berlin.de"
          target="_blank"
          rel="noopener noreferrer"
          className="text-success hover:underline"
        >
          www.datenschutz-berlin.de
        </a>
      </p>

      <h2>10. Aktualität dieser Datenschutzerklärung</h2>
      <p>
        Diese Datenschutzerklärung hat den Stand: <strong>Juni 2026</strong>. Wir behalten uns vor,
        diese Datenschutzerklärung gelegentlich anzupassen, damit sie stets den aktuellen
        rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der
        Datenschutzerklärung umzusetzen, z. B. bei der Einführung neuer Services. Für Ihren
        erneuten Besuch gilt dann die neue Datenschutzerklärung.
      </p>
    </StaticPage>
  ),
});
