import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung von PRIME ENERGIE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StaticPage
      title="Datenschutzerklärung"
      lead="Hier informieren wir Sie darüber, wie PRIME ENERGIE personenbezogene Daten verarbeitet."
    >
      <h2>1. Verantwortlicher</h2>
      <p>
        Alpha Energie GmbH
        <br />
        Alter Hellweg 50
        <br />
        44379 Dortmund
        <br />
        Geschäftsführer: Tolga Canga
        <br />
        Telefon: <a href="tel:+4923139989390">0231 39989390</a>
        <br />
        E-Mail: <a href="mailto:info@primeenergie.de">info@primeenergie.de</a>
      </p>

      <h2>2. Allgemeine Grundsätze und Rechtsgrundlagen</h2>
      <p>
        Wir verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung unserer
        Website, die Bearbeitung Ihrer Anfrage, die Vermittlung von Energieangeboten oder die
        Erfüllung gesetzlicher Pflichten erforderlich ist. Je nach Verarbeitung stützen wir uns auf
        Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. b DSGVO (Vertrag und
        vorvertragliche Maßnahmen), Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) oder Art.
        6 Abs. 1 lit. f DSGVO (berechtigte Interessen).
      </p>

      <h2>3. Aufruf der Website und Hosting</h2>
      <p>
        Beim Aufruf der Website werden technisch erforderliche Zugriffsdaten verarbeitet. Dazu
        können IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Referrer, Browsertyp,
        Betriebssystem und Statuscodes gehören. Die Verarbeitung dient dem sicheren und
        störungsfreien Betrieb sowie der Fehleranalyse auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
      </p>
      <p>
        Die Website wird über Vercel Inc. bereitgestellt. Vercel verarbeitet dabei insbesondere
        Zugriffs- und Protokolldaten als Auftragsverarbeiter. Soweit Daten außerhalb der EU oder des
        EWR verarbeitet werden, erfolgt dies auf Grundlage der gesetzlichen
        Übermittlungsmechanismen, insbesondere eines Angemessenheitsbeschlusses oder der
        EU-Standardvertragsklauseln.
      </p>

      <h2>4. Tarif-, Kontakt- und Rückrufanfragen</h2>
      <p>
        Wenn Sie eine Anfrage stellen, verarbeiten wir die von Ihnen angegebenen Stamm- und
        Kontaktdaten, Anschrift, Postleitzahl, Verbrauchs- und Vertragsangaben, gewünschten
        Energieträger, Kundentyp, Nachrichten sowie gegebenenfalls Empfehlungsdaten. Die
        Verarbeitung erfolgt zur Prüfung Ihrer Anfrage, Kontaktaufnahme, Angebotsermittlung und
        Anbahnung einer Vermittlung gemäß Art. 6 Abs. 1 lit. b DSGVO. Freiwillige Zusatzangaben
        verarbeiten wir auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
      </p>
      <p>
        Erforderliche Angaben sind in den Formularen gekennzeichnet. Ohne diese Daten können wir
        Ihre Anfrage gegebenenfalls nicht bearbeiten. Eine unverbindliche Anfrage führt noch nicht
        zum Abschluss eines Energieliefervertrags.
      </p>

      <h2>5. Hochgeladene Rechnungen und Dokumente</h2>
      <p>
        Sie können Rechnungen oder vergleichbare Unterlagen hochladen. Diese können neben Vertrags-
        und Verbrauchsdaten auch weitere personenbezogene Angaben enthalten. Laden Sie deshalb nur
        Dokumente hoch, die für die Tarifprüfung erforderlich sind, und schwärzen Sie nicht
        benötigte Angaben. Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage gemäß Art. 6 Abs.
        1 lit. b DSGVO.
      </p>

      <h2>6. Datenbank, Dateispeicher und Mitarbeiterzugänge</h2>
      <p>
        Für Datenbank, geschützte Dateispeicherung und die Anmeldung im Mitarbeiterbereich nutzen
        wir Supabase. Verarbeitet werden dort insbesondere Anfragedaten, Dokumente,
        Bearbeitungsstände, Kommunikationsvermerke und Authentifizierungsdaten. Der Zugriff ist auf
        berechtigte Personen beschränkt. Supabase wird als Auftragsverarbeiter auf Grundlage von
        Art. 28 DSGVO eingesetzt.
      </p>

      <h2>7. E-Mail- und Telefonkommunikation</h2>
      <p>
        Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Kontaktdaten und den
        Inhalt der Kommunikation. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um Ihre
        Anfrage oder einen Vertrag geht, andernfalls Art. 6 Abs. 1 lit. f DSGVO. Für den technischen
        Versand von E-Mails setzen wir Resend als Auftragsverarbeiter ein.
      </p>

      <h2>8. Digitaler Assistent</h2>
      <p>
        Wenn Sie den digitalen Assistenten freiwillig nutzen, werden Ihre Eingaben zur Erzeugung
        einer Antwort an die OpenAI-API übermittelt. Geben Sie dort bitte keine sensiblen Daten,
        Vertragsnummern oder vollständigen Rechnungsinhalte ein. Die Nutzung ist freiwillig und
        erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO; eine erteilte Einwilligung können Sie
        jederzeit mit Wirkung für die Zukunft widerrufen.
      </p>
      <p>
        OpenAI kann Daten in den USA verarbeiten. Für API-Geschäftsdaten gelten die vertraglichen
        Datenschutz- und Sicherheitsregelungen von OpenAI. Der Assistent trifft keine Entscheidungen
        mit rechtlicher oder vergleichbar erheblicher Wirkung.
      </p>

      <h2>9. Cookies, Local Storage und Session Storage</h2>
      <p>
        Wir speichern technisch erforderliche Informationen im Browser, insbesondere Ihre
        Cookie-Auswahl und vorübergehende Formulardaten. Diese Speicherung hilft, Ihre Auswahl zu
        dokumentieren und Eingaben während der Sitzung zu erhalten. Rechtsgrundlage ist § 25 Abs. 2
        Nr. 2 TDDDG in Verbindung mit Art. 6 Abs. 1 lit. f DSGVO. Optionale Speicherungen oder
        Dienste werden nur nach Ihrer Einwilligung gemäß § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a
        DSGVO aktiviert.
      </p>
      <p>
        Derzeit setzen wir keine aktiven Analyse- oder Marketing-Pixel ein. Eine im
        Einwilligungsdialog erteilte Auswahl für solche Kategorien führt erst dann zu einer
        Verarbeitung, wenn ein entsprechender Dienst technisch eingebunden wird.
      </p>

      <h2>10. Externe Schriftarten, Bilder und Animationen</h2>
      <p>
        Zur Darstellung können Inhalte von Google Fonts, Unsplash und LottieFiles geladen werden.
        Dabei wird technisch bedingt insbesondere Ihre IP-Adresse an den jeweiligen Anbieter
        übertragen. Die Einbindung dient einer einheitlichen und ansprechenden Darstellung unseres
        Angebots auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Bei einer Übermittlung in Drittländer
        gelten die gesetzlichen Schutzmechanismen für internationale Datentransfers.
      </p>

      <h2>11. Empfänger und Weitergabe</h2>
      <p>
        Innerhalb unseres Unternehmens erhalten nur Personen Zugriff, die ihn für die Bearbeitung
        benötigen. Eine Weitergabe an Energieversorger oder Vermittlungspartner erfolgt nur, soweit
        dies für die von Ihnen gewünschte Angebotsermittlung oder Vertragsanbahnung erforderlich
        ist. Darüber hinaus erhalten technische Dienstleister Daten im Rahmen einer
        Auftragsverarbeitung. Eine Weitergabe zu fremden Werbezwecken findet nicht ohne
        Rechtsgrundlage oder Einwilligung statt.
      </p>

      <h2>12. Speicherdauer</h2>
      <p>
        Wir speichern personenbezogene Daten nur so lange, wie sie für den jeweiligen Zweck
        erforderlich sind. Nicht zu einem Vertrag führende Anfragen werden grundsätzlich spätestens
        nach 24 Monaten gelöscht, sofern keine Einwilligung oder ein berechtigter Grund für eine
        längere Speicherung besteht. Vertrags- und steuerrelevante Unterlagen bewahren wir für die
        gesetzlichen Fristen auf. Protokolldaten werden regelmäßig nach kurzer Frist gelöscht,
        sofern sie nicht zur Aufklärung eines Sicherheitsvorfalls benötigt werden.
      </p>

      <h2>13. Ihre Rechte</h2>
      <p>Sie haben nach Maßgabe der gesetzlichen Voraussetzungen insbesondere das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre verarbeiteten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO),</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Widerspruch gegen Verarbeitungen nach Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO),</li>
        <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft.</li>
      </ul>
      <p>
        Zur Ausübung Ihrer Rechte genügt eine Nachricht an{" "}
        <a href="mailto:info@primeenergie.de">info@primeenergie.de</a>.
      </p>

      <h2>14. Beschwerderecht</h2>
      <p>
        Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren. Für unseren Sitz ist
        insbesondere zuständig:
      </p>
      <p>
        Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen
        <br />
        Kavalleriestraße 2–4
        <br />
        40213 Düsseldorf
        <br />
        E-Mail: <a href="mailto:poststelle@ldi.nrw.de">poststelle@ldi.nrw.de</a>
      </p>

      <h2>15. Änderungen dieser Erklärung</h2>
      <p>
        Wir aktualisieren diese Datenschutzerklärung, wenn sich unsere Verarbeitung, die
        eingesetzten Dienste oder die Rechtslage ändern.
      </p>

      <p className="text-xs text-muted-foreground">Stand: 30. Juli 2026</p>
    </StaticPage>
  ),
});
