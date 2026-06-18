import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "Allgemeine Geschäftsbedingungen – PRIME ENERGIE" },
      {
        name: "description",
        content:
          "AGB der PRIME ENERGIE GmbH: Nutzungsbedingungen für den kostenlosen Energie-Vergleichsdienst.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StaticPage
      title="Allgemeine Geschäftsbedingungen"
      lead="Stand: Juni 2026"
    >
      <h2>§ 1 Geltungsbereich und Anbieter</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Leistungen der PRIME ENERGIE
        GmbH, Friedrichstraße 123, 10117 Berlin (nachfolgend „PRIME ENERGIE" oder „wir"), gegenüber
        Verbrauchern und Unternehmern (nachfolgend „Nutzer"), die den Vergleichs- und
        Beratungsdienst unter der Website energieclever.de oder prime-energie.de nutzen.
        Abweichende Bedingungen des Nutzers finden keine Anwendung, es sei denn, PRIME ENERGIE hat
        diesen ausdrücklich und schriftlich zugestimmt.
      </p>

      <h2>§ 2 Leistungsbeschreibung</h2>
      <p>
        PRIME ENERGIE betreibt einen kostenlosen Online-Vergleichsdienst für Strom- und Gastarife
        in Deutschland. Die Leistung umfasst insbesondere:
      </p>
      <ul>
        <li>
          Die Entgegennahme von Anfragen zu Strom- und Gastarifen über das Online-Formular oder
          telefonisch.
        </li>
        <li>
          Die persönliche Prüfung von Tarifen durch geschulte Energieberater und die Unterbreitung
          eines individuellen Angebotsvorschlags.
        </li>
        <li>
          Die Vermittlung des Nutzers an einen geeigneten Energieversorger auf dessen ausdrücklichen
          Wunsch hin.
        </li>
        <li>
          Die Übernahme des Anbieterwechsels einschließlich der Kündigung beim bisherigen Versorger,
          sofern der Nutzer dies beauftragt.
        </li>
      </ul>
      <p>
        Ein Anspruch des Nutzers auf Abschluss eines Energieliefervertrags mit einem bestimmten
        Anbieter besteht nicht. PRIME ENERGIE ist kein Energielieferant und kein Vertragspartner
        des Energieliefervertrags. Der Vertrag kommt ausschließlich zwischen dem Nutzer und dem
        jeweiligen Energieversorger zustande.
      </p>

      <h2>§ 3 Vertragsschluss und Nutzung</h2>
      <p>
        Die Nutzung des Vergleichsdienstes ist für den Nutzer kostenlos. PRIME ENERGIE wird im
        Erfolgsfall vom neuen Energieversorger vergütet. Durch das Absenden des Online-Formulars
        oder die telefonische Anfrage erteilt der Nutzer PRIME ENERGIE den Auftrag zur
        Tarifprüfung und Beratung. Ein verbindlicher Vermittlungsauftrag kommt erst durch die
        ausdrückliche Zustimmung des Nutzers zur Einleitung des Anbieterwechsels zustande. Der
        Nutzer ist zu keinem Zeitpunkt verpflichtet, ein unterbreitetes Angebot anzunehmen.
      </p>

      <h2>§ 4 Pflichten des Nutzers</h2>
      <p>
        Der Nutzer verpflichtet sich, bei der Nutzung des Dienstes wahrheitsgemäße Angaben zu
        machen, insbesondere zu Verbrauchsmengen, Adresse und Kontaktdaten. Falsche Angaben können
        zu einer unzutreffenden Tarifempfehlung führen, für die PRIME ENERGIE keine Haftung
        übernimmt. Der Nutzer erklärt durch Absenden des Formulars sein Einverständnis, dass PRIME
        ENERGIE ihn zum Zweck der Beratung telefonisch oder per E-Mail kontaktieren darf.
      </p>

      <h2>§ 5 Datenschutz</h2>
      <p>
        Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten erfolgt ausschließlich gemäß
        der geltenden Datenschutzgesetze, insbesondere der DSGVO. Einzelheiten entnehmen Sie bitte
        unserer{" "}
        <a href="/datenschutz" className="text-success hover:underline">
          Datenschutzerklärung
        </a>
        . Die Einwilligung in die Datenverarbeitung zur Tarifprüfung kann der Nutzer jederzeit mit
        Wirkung für die Zukunft widerrufen.
      </p>

      <h2>§ 6 Haftungsbeschränkung</h2>
      <p>
        PRIME ENERGIE haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers
        oder der Gesundheit, für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen, sowie
        im Rahmen einer etwaigen Garantieübernahme.
      </p>
      <p>
        Im Übrigen ist die Haftung von PRIME ENERGIE auf den vorhersehbaren, vertragstypischen
        Schaden begrenzt. Eine Haftung für die Richtigkeit, Vollständigkeit und Aktualität der
        dargestellten Tarifkonditionen der Energieversorger ist ausgeschlossen, da diese
        ausschließlich von den jeweiligen Versorgern verantwortet werden.
      </p>
      <p>
        Die Haftung für mittelbare Schäden, entgangenen Gewinn oder Datenverluste ist – soweit
        rechtlich zulässig – ausgeschlossen. Diese Haftungsbeschränkung gilt nicht, soweit das
        Produkthaftungsgesetz einschlägig ist.
      </p>

      <h2>§ 7 Kündigung und Sperrung</h2>
      <p>
        Der Nutzer kann die Geschäftsbeziehung mit PRIME ENERGIE jederzeit durch formlose Mitteilung
        per E-Mail an{" "}
        <a href="mailto:hallo@energieclever.de" className="text-success hover:underline">
          hallo@energieclever.de
        </a>{" "}
        beenden. Bereits erteilte Vermittlungsaufträge werden davon nicht rückwirkend berührt.
        PRIME ENERGIE behält sich das Recht vor, Nutzer, die den Dienst missbräuchlich nutzen oder
        gegen diese AGB verstoßen, von der weiteren Nutzung auszuschließen.
      </p>

      <h2>§ 8 Anwendbares Recht und Gerichtsstand</h2>
      <p>
        Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ist
        der Nutzer Verbraucher mit Wohnsitz in der EU, gelten zusätzlich die zwingenden
        Verbraucherschutzvorschriften des Staates, in dem der Nutzer seinen gewöhnlichen Aufenthalt
        hat. Gerichtsstand für alle Streitigkeiten aus und im Zusammenhang mit diesen AGB ist Berlin,
        sofern der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
        Sondervermögen ist.
      </p>

      <h2>§ 9 Salvatorische Klausel</h2>
      <p>
        Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam oder undurchführbar
        sein oder werden, so bleibt die Gültigkeit der übrigen Bestimmungen davon unberührt. An die
        Stelle der unwirksamen oder undurchführbaren Bestimmung tritt die gesetzliche Regelung. Dies
        gilt auch für etwaige Regelungslücken.
      </p>

      <p className="text-xs text-muted-foreground">Stand: Juni 2026</p>
    </StaticPage>
  ),
});
