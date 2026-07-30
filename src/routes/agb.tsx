import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "Allgemeine Geschäftsbedingungen von PRIME ENERGIE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StaticPage
      title="Allgemeine Geschäftsbedingungen"
      lead="Bedingungen für die kostenlose Tarifprüfung und Vermittlung über PRIME ENERGIE."
    >
      <h2>1. Anbieter und Geltungsbereich</h2>
      <p>
        PRIME ENERGIE ist ein Angebot der Alpha Energie GmbH, Alter Hellweg 50, 44379 Dortmund
        („PRIME ENERGIE“ oder „wir“). Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung
        unserer Tarifprüfungs-, Beratungs- und Vermittlungsleistungen durch Verbraucher und
        Unternehmen.
      </p>
      <p>
        Abweichende Bedingungen eines Nutzers gelten nur, wenn wir ihrer Geltung ausdrücklich in
        Textform zugestimmt haben.
      </p>

      <h2>2. Gegenstand unserer Leistung</h2>
      <p>
        Wir erfassen Ihren Bedarf, prüfen verfügbare Angebote und unterstützen Sie auf Wunsch bei
        der Anbahnung eines Vertrags mit einem Energieversorger oder einem anderen Produktanbieter.
        Wir sind nicht selbst Energieversorger und schulden keine Lieferung von Strom oder Gas.
      </p>
      <p>
        Unsere Auswahl kann sich auf die Anbieter und Tarife beschränken, mit denen wir
        zusammenarbeiten oder zu denen uns verwertbare Angebotsdaten vorliegen. Ein vollständiger
        Marktvergleich aller Anbieter und Tarife ist nicht geschuldet.
      </p>

      <h2>3. Anfrage und Beratungsprozess</h2>
      <p>
        Das Absenden eines Formulars ist eine unverbindliche Anfrage und noch kein Antrag auf
        Abschluss eines Energieliefervertrags. Wir können Rückfragen stellen und weitere Unterlagen
        anfordern, soweit dies für eine belastbare Prüfung erforderlich ist.
      </p>
      <p>
        Angezeigte Einsparungen, Beispielpreise und Verfügbarkeiten sind unverbindliche
        Orientierungswerte. Maßgeblich sind ausschließlich das konkrete Angebot und die
        Vertragsunterlagen des jeweiligen Produktanbieters.
      </p>

      <h2>4. Vertrag mit dem Produktanbieter</h2>
      <p>
        Ein Liefer- oder Produktvertrag kommt ausschließlich zwischen Ihnen und dem im Angebot
        genannten Anbieter zustande. Für Abschluss, Annahme, Belieferung, Preise, Laufzeit,
        Kündigung und Widerruf gelten die Vertragsbedingungen und Pflichtinformationen dieses
        Anbieters.
      </p>
      <p>
        Wir können die Übermittlung einer Vertragserklärung unterstützen, dürfen aber keine
        Annahmeentscheidung des Anbieters garantieren. Der Anbieter kann insbesondere eine Bonitäts-
        oder Verfügbarkeitsprüfung durchführen.
      </p>

      <h2>5. Pflichten der Nutzer</h2>
      <p>
        Sie stellen sicher, dass Ihre Angaben vollständig und richtig sind und dass Sie zur
        Übermittlung der angegebenen Daten und hochgeladenen Dokumente berechtigt sind. Änderungen,
        die für ein Angebot relevant sind, teilen Sie uns unverzüglich mit.
      </p>
      <p>
        Zugangsdaten, Angebotsunterlagen und personenbezogene Informationen sind vor dem Zugriff
        unbefugter Dritter zu schützen.
      </p>

      <h2>6. Vergütung</h2>
      <p>
        Die Tarifprüfung und Vermittlungsunterstützung ist für anfragende Kunden kostenlos, soweit
        nicht vorab ausdrücklich eine gesonderte Vergütung in Textform vereinbart wird. Wir können
        für eine erfolgreiche Vermittlung eine Vergütung vom jeweiligen Produktanbieter oder
        Vertriebspartner erhalten.
      </p>

      <h2>7. Verfügbarkeit und Kommunikation</h2>
      <p>
        Wir bemühen uns um eine zuverlässige Erreichbarkeit, schulden jedoch keine unterbrechungs-
        und fehlerfreie Verfügbarkeit der Website. Wartung, Sicherheitsmaßnahmen oder technische
        Störungen können die Nutzung vorübergehend einschränken.
      </p>
      <p>
        Vertragsbezogene Kommunikation kann per E-Mail, Telefon oder über die von Ihnen gewählten
        Kontaktwege erfolgen. Sie sind für die Erreichbarkeit unter den angegebenen Kontaktdaten
        verantwortlich.
      </p>

      <h2>8. Haftung</h2>
      <p>
        Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei schuldhafter Verletzung
        von Leben, Körper oder Gesundheit sowie in Fällen zwingender gesetzlicher Haftung.
      </p>
      <p>
        Bei leicht fahrlässiger Verletzung einer wesentlichen Vertragspflicht ist die Haftung auf
        den vorhersehbaren, vertragstypischen Schaden begrenzt. Im Übrigen ist die Haftung für
        leichte Fahrlässigkeit ausgeschlossen. Für die Leistung, Preisgestaltung und
        Vertragserfüllung eines vermittelten Produktanbieters haftet dieser selbst.
      </p>

      <h2>9. Datenschutz</h2>
      <p>
        Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
        <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>

      <h2>10. Beendigung der Vermittlung</h2>
      <p>
        Sie können eine noch nicht abgeschlossene, kostenlose Vermittlungsanfrage jederzeit beenden.
        Bereits geschlossene Verträge mit Produktanbietern werden dadurch nicht beendet; hierfür
        gelten die Kündigungs- und Widerrufsregeln des jeweiligen Vertrags.
      </p>

      <h2>11. Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>12. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht. Bei Verbrauchern gilt diese Rechtswahl nur, soweit dadurch
        zwingender Schutz des Staates ihres gewöhnlichen Aufenthalts nicht entzogen wird.
        Ausschließlicher Gerichtsstand ist – soweit gesetzlich zulässig – Dortmund, wenn der Nutzer
        Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
        Sondervermögen ist.
      </p>
      <p>
        Sollten einzelne Bestimmungen unwirksam sein oder werden, bleiben die übrigen Bestimmungen
        davon unberührt. An die Stelle der unwirksamen Regelung tritt die gesetzliche Regelung.
      </p>

      <p className="text-xs text-muted-foreground">Stand: 30. Juli 2026</p>
    </StaticPage>
  ),
});
