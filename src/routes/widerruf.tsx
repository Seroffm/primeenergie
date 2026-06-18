import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/widerruf")({
  head: () => ({
    meta: [
      { title: "Widerrufsbelehrung – PRIME ENERGIE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StaticPage
      title="Widerrufsbelehrung"
      lead="Verbraucher haben das Recht, einen geschlossenen Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen."
    >
      <h2>Widerrufsrecht</h2>
      <p>
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
        widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
      </p>
      <p>
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (PRIME ENERGIE GmbH, Friedrichstraße 123,
        10117 Berlin, E-Mail:{" "}
        <a href="mailto:widerruf@energieclever.de" className="text-success hover:underline">
          widerruf@energieclever.de
        </a>
        ) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine
        E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür
        das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
      </p>
      <p>
        Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
        Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
      </p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
        erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die
        sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene,
        günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn
        Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags
        bei uns eingegangen ist.
      </p>
      <p>
        Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
        Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes
        vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
      </p>
      <p>
        Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen,
        so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem
        Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses
        Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang
        der im Vertrag vorgesehenen Dienstleistungen entspricht.
      </p>

      <h2>Ausschluss des Widerrufsrechts</h2>
      <p>
        Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht
        vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch
        den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des
        Verbrauchers zugeschnitten sind, sowie bei vollständig erbrachten Dienstleistungen, wenn die
        Ausführung mit ausdrücklicher Zustimmung des Verbrauchers begonnen hat.
      </p>

      <h2>Muster-Widerrufsformular</h2>
      <p>
        (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und
        senden Sie es zurück.)
      </p>
      <p>
        An:
        <br />
        PRIME ENERGIE GmbH
        <br />
        Friedrichstraße 123
        <br />
        10117 Berlin
        <br />
        E-Mail:{" "}
        <a href="mailto:widerruf@energieclever.de" className="text-success hover:underline">
          widerruf@energieclever.de
        </a>
      </p>
      <p>
        Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
        der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
      </p>
      <p>Bestellt am (*)/erhalten am (*): ___________________________</p>
      <p>Name des/der Verbraucher(s): ___________________________</p>
      <p>Anschrift des/der Verbraucher(s): ___________________________</p>
      <p>
        Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
        ___________________________
      </p>
      <p>Datum: ___________________________</p>
      <p className="text-xs text-muted-foreground">(*) Unzutreffendes streichen.</p>

      <h2>Stand</h2>
      <p>Diese Widerrufsbelehrung hat den Stand: Juni 2026.</p>
    </StaticPage>
  ),
});
