-- Replaces inherited editorial copy with original PRIME ENERGIE content.
-- Existing slugs and images stay stable so published links continue to work.

alter table public.blog_articles
  alter column author set default 'PRIME ENERGIE Redaktion';

update public.blog_articles
set
  title = 'Strompreise verstehen: Darauf kommt es beim Tarif an',
  teaser = 'Arbeitspreis, Grundpreis, Laufzeit und Boni wirken gemeinsam. PRIME ENERGIE erklärt, wie Sie Angebote sinnvoll einordnen.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 6,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Mehr als nur der Preis je Kilowattstunde',
      'paragraphs', jsonb_build_array(
        'Ein Stromtarif besteht in der Regel aus einem verbrauchsabhängigen Arbeitspreis und einem festen Grundpreis. Welcher Anteil stärker ins Gewicht fällt, hängt von Ihrem Jahresverbrauch ab.',
        'Für einen fairen Vergleich sollten beide Bestandteile auf ein vollständiges Vertragsjahr gerechnet werden. Erst die Gesamtkosten zeigen, wie ein Angebot zu Ihrem Haushalt passt.'
      )
    ),
    jsonb_build_object(
      'heading', 'Laufzeit, Boni und Preisgarantie einordnen',
      'paragraphs', jsonb_build_array(
        'Eine niedrige Einstiegssumme sagt wenig über die Kosten in späteren Vertragsjahren aus. Prüfen Sie deshalb, ob Boni nur einmal gelten und wann sich der Vertrag verlängert.',
        'Auch eine Preisgarantie kann unterschiedlich weit reichen. Maßgeblich ist, welche Bestandteile tatsächlich umfasst sind und welche Änderungen weiterhin möglich bleiben.'
      )
    ),
    jsonb_build_object(
      'heading', 'So unterstützt PRIME ENERGIE',
      'paragraphs', jsonb_build_array(
        'PRIME ENERGIE betrachtet Verbrauch, Region und Vertragswünsche gemeinsam. Wir erklären die entscheidenden Konditionen und besprechen mögliche nächste Schritte persönlich mit Ihnen.',
        'Das konkrete Angebot und die zugehörigen Vertragsunterlagen bleiben für Ihre Entscheidung verbindlich.'
      )
    )
  ),
  seo_title = 'Strompreise und Stromtarife verstehen | PRIME ENERGIE',
  seo_description = 'PRIME ENERGIE erklärt Arbeitspreis, Grundpreis, Boni, Laufzeit und Preisgarantie bei Stromtarifen.'
where slug = 'strompreis-2026';

update public.blog_articles
set
  title = 'Ökostrom erkennen und sinnvoll einordnen',
  teaser = 'Herkunft, Tarifbedingungen und Zertifikate helfen bei der Auswahl. So prüfen Sie, was hinter einem Ökostromangebot steht.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 6,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Was Ökostrom im Tarif bedeutet',
      'paragraphs', jsonb_build_array(
        'Bei einem Ökostromtarif wird die gelieferte Strommenge bilanziell erneuerbaren Quellen zugeordnet. Die physische Energie im Netz lässt sich nicht nach einzelnen Erzeugungsarten trennen.',
        'Für Ihre Auswahl ist daher wichtig, wie der Anbieter die Herkunft nachweist und welche zusätzlichen Anforderungen der Tarif erfüllt.'
      )
    ),
    jsonb_build_object(
      'heading', 'Zertifikate richtig lesen',
      'paragraphs', jsonb_build_array(
        'Zertifikate können unterschiedliche Kriterien prüfen. Achten Sie darauf, wer das Zeichen vergibt, welche Anforderungen gelten und ob die Prüfung regelmäßig erneuert wird.',
        'Ein Logo allein ersetzt nicht den Blick in die Tarifunterlagen. Herkunft, Laufzeit, Preisbestandteile und Kündigungsregeln gehören immer mit in die Bewertung.'
      )
    ),
    jsonb_build_object(
      'heading', 'Ihre Prioritäten entscheiden',
      'paragraphs', jsonb_build_array(
        'Manche Haushalte legen den Schwerpunkt auf nachvollziehbare Herkunft, andere auf kurze Laufzeiten oder planbare Kosten. PRIME ENERGIE ordnet verfügbare Optionen anhand Ihrer Wünsche ein.',
        'So entsteht eine Entscheidung, bei der ökologische Kriterien und Vertragsbedingungen gemeinsam betrachtet werden.'
      )
    )
  ),
  seo_title = 'Ökostrom erkennen und vergleichen | PRIME ENERGIE',
  seo_description = 'Worauf es bei Herkunft, Zertifikaten und Vertragsbedingungen von Ökostromtarifen ankommt.'
where slug = 'oekostrom-labels';

update public.blog_articles
set
  title = 'Gaspreise und Gastarife verständlich prüfen',
  teaser = 'Verbrauch, Grundpreis, Laufzeit und Preisgarantie bestimmen, ob ein Gastarif zu Ihrem Haushalt passt.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 6,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Der Verbrauch prägt die Gesamtkosten',
      'paragraphs', jsonb_build_array(
        'Bei Gas wirken sich Gebäudegröße, Dämmung, Heizverhalten und Witterung auf den Jahresverbrauch aus. Deshalb sollte ein Tarif nie nur anhand eines einzelnen Preiswertes ausgewählt werden.',
        'Eine aktuelle Abrechnung liefert die beste Grundlage. Wenn sie nicht vorliegt, kann eine erste Schätzung zur Orientierung dienen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Vertragsbedingungen mitprüfen',
      'paragraphs', jsonb_build_array(
        'Neben Arbeitspreis und Grundpreis sind Laufzeit, Kündigungsfrist, Verlängerung und Umfang der Preisgarantie relevant. Ein Bonus kann die Kosten im ersten Jahr verändern, gilt aber häufig nicht dauerhaft.',
        'Vergleichen Sie deshalb die Gesamtkosten und prüfen Sie, wie sich der Vertrag nach der ersten Laufzeit fortsetzt.'
      )
    ),
    jsonb_build_object(
      'heading', 'Persönliche Einordnung durch PRIME ENERGIE',
      'paragraphs', jsonb_build_array(
        'PRIME ENERGIE bespricht Ihre Ausgangslage und ordnet verfügbare Gastarife verständlich ein. Sie erhalten eine persönliche Einschätzung statt einer unkommentierten Ergebnisliste.',
        'Ob und wann Sie wechseln, entscheiden Sie auf Grundlage des konkreten Angebots.'
      )
    )
  ),
  seo_title = 'Gaspreise und Gastarife verstehen | PRIME ENERGIE',
  seo_description = 'PRIME ENERGIE erklärt die wichtigsten Preisbestandteile und Vertragsbedingungen bei Gastarifen.'
where slug = 'gaspreise-2026';

update public.blog_articles
set
  title = 'Solaranlage wirtschaftlich und passend planen',
  teaser = 'Dach, Verbrauch, Speicher und Angebot müssen zusammenpassen. Diese Punkte helfen bei einer ersten Orientierung.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 7,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Das Gebäude gibt den Rahmen vor',
      'paragraphs', jsonb_build_array(
        'Dachfläche, Ausrichtung, Verschattung und Statik beeinflussen, welche Anlage technisch sinnvoll ist. Auch der Zustand der Elektroinstallation sollte früh berücksichtigt werden.',
        'Eine belastbare Planung beginnt deshalb mit den Gegebenheiten vor Ort und nicht mit einer pauschalen Anlagengröße.'
      )
    ),
    jsonb_build_object(
      'heading', 'Eigenverbrauch und Speicher',
      'paragraphs', jsonb_build_array(
        'Wie viel Solarstrom Sie selbst nutzen können, hängt von Ihrem Verbrauchsprofil ab. Wärmepumpe, Elektroauto oder flexible Haushaltsgeräte können den Eigenverbrauch verändern.',
        'Ein Speicher kann den nutzbaren Anteil erhöhen, verursacht aber zusätzliche Kosten. Größe und Wirtschaftlichkeit sollten zum tatsächlichen Bedarf passen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Angebote vollständig vergleichen',
      'paragraphs', jsonb_build_array(
        'Vergleichen Sie nicht nur den Gesamtpreis. Komponenten, Montageumfang, Garantien, Netzanschluss, Dokumentation und Service gehören ebenfalls in die Bewertung.',
        'PRIME ENERGIE unterstützt bei einer ersten Einordnung und stimmt mit Ihnen ab, welche nächsten Schritte sinnvoll sind.'
      )
    )
  ),
  seo_title = 'Solaranlage sinnvoll planen | PRIME ENERGIE',
  seo_description = 'Dach, Eigenverbrauch, Speicher und Angebotsumfang bei der Planung einer Solaranlage verständlich erklärt.'
where slug = 'solaranlage-kosten-2026';

update public.blog_articles
set
  title = 'Strom und Gas gemeinsam oder getrennt abschließen',
  teaser = 'Ein gemeinsames Angebot kann bequem sein. Zwei einzelne Tarife können flexibler passen. Entscheidend sind die Gesamtkosten.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 5,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Komfort ist nur ein Teil der Entscheidung',
      'paragraphs', jsonb_build_array(
        'Wenn Strom und Gas beim selben Anbieter liegen, können Kommunikation und Verwaltung einfacher sein. Das bedeutet jedoch nicht automatisch, dass die gemeinsame Lösung wirtschaftlich besser ist.',
        'Prüfen Sie beide Sparten mit ihrem jeweiligen Verbrauch und betrachten Sie die Kosten über die gesamte Laufzeit.'
      )
    ),
    jsonb_build_object(
      'heading', 'Boni getrennt bewerten',
      'paragraphs', jsonb_build_array(
        'Ein gemeinsamer Bonus kann ein Angebot im ersten Jahr günstiger erscheinen lassen. Wichtig ist, welche Bedingungen gelten und wie hoch die regulären Kosten ohne einmalige Vorteile ausfallen.',
        'Auch unterschiedliche Vertragsenden können die spätere Flexibilität beeinflussen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Beide Wege transparent vergleichen',
      'paragraphs', jsonb_build_array(
        'PRIME ENERGIE stellt eine gemeinsame Lösung passenden Einzeltarifen gegenüber. So sehen Sie, welche Variante besser zu Ihren Prioritäten passt.',
        'Maßgeblich bleiben immer die Konditionen der konkreten Angebote.'
      )
    )
  ),
  seo_title = 'Strom und Gas gemeinsam prüfen | PRIME ENERGIE',
  seo_description = 'Gemeinsames Angebot oder einzelne Tarife: PRIME ENERGIE erklärt die Unterschiede.'
where slug = 'bundle-doppelbonus';

update public.blog_articles
set
  title = 'Wärmestrom sinnvoll prüfen',
  teaser = 'Wärmepumpe und Nachtspeicherheizung stellen besondere Anforderungen an Zähler, Verbrauch und Tarif.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 6,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Was Wärmestrom auszeichnet',
      'paragraphs', jsonb_build_array(
        'Wärmestromtarife richten sich an elektrisch betriebene Heizsysteme. Je nach Anlage und Netzgebiet können ein eigener Zähler und technische Voraussetzungen erforderlich sein.',
        'Ob ein gesonderter Tarif sinnvoll ist, hängt vom Verbrauch und den zusätzlichen Kosten für Messung und Technik ab.'
      )
    ),
    jsonb_build_object(
      'heading', 'Zähler und Steuerbarkeit klären',
      'paragraphs', jsonb_build_array(
        'Vor der Tarifsuche sollten Zählerart, vorhandene Messeinrichtung und mögliche Vorgaben des Netzbetreibers feststehen. Diese Angaben beeinflussen, welche Angebote verfügbar sind.',
        'Bei einer neuen Anlage empfiehlt sich die Abstimmung mit dem Fachbetrieb und dem zuständigen Netzbetreiber.'
      )
    ),
    jsonb_build_object(
      'heading', 'PRIME ENERGIE ordnet Optionen ein',
      'paragraphs', jsonb_build_array(
        'PRIME ENERGIE betrachtet Haushaltsstrom und Wärmestrom im Zusammenhang. Wir erklären, welche Tarifstruktur zu Ihrer technischen Ausgangslage passen kann.',
        'Die Entscheidung treffen Sie nach Prüfung des konkreten Angebots und der anfallenden Nebenkosten.'
      )
    )
  ),
  seo_title = 'Wärmestromtarife prüfen | PRIME ENERGIE',
  seo_description = 'Wärmestrom für Wärmepumpe und Nachtspeicher verständlich erklärt.'
where slug = 'waermestrom-tarif';

update public.blog_articles
set
  title = 'Fördermöglichkeiten für Solaranlagen prüfen',
  teaser = 'Programme und Bedingungen können sich ändern. So gehen Sie bei der Förderprüfung strukturiert vor.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 6,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Förderung ist vom Vorhaben abhängig',
      'paragraphs', jsonb_build_array(
        'Mögliche Unterstützungen unterscheiden sich nach Standort, Gebäude, Anlagengröße und geplanter Nutzung. Neben bundesweiten Angeboten können regionale Programme hinzukommen.',
        'Da Budgets und Bedingungen angepasst werden können, sollte die Prüfung immer mit aktuellen offiziellen Informationen erfolgen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Reihenfolge vor dem Auftrag beachten',
      'paragraphs', jsonb_build_array(
        'Bei manchen Programmen muss der Antrag vor einer Bestellung oder Beauftragung gestellt werden. Ein zu früher Vertragsabschluss kann die Förderfähigkeit beeinflussen.',
        'Halten Sie technische Daten, Angebote und Angaben zum Gebäude bereit und dokumentieren Sie die Antragsfristen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Beratung und offizielle Stellen verbinden',
      'paragraphs', jsonb_build_array(
        'PRIME ENERGIE kann Ihren Bedarf zunächst einordnen. Verbindliche Auskünfte zu Förderfähigkeit, Fristen und Auszahlung erhalten Sie bei der jeweils zuständigen Stelle.',
        'So bleiben technische Planung, Finanzierung und formale Anforderungen sauber voneinander getrennt.'
      )
    )
  ),
  seo_title = 'Solarförderung strukturiert prüfen | PRIME ENERGIE',
  seo_description = 'So prüfen Sie Fördermöglichkeiten für Photovoltaik und Speicher rechtzeitig und strukturiert.'
where slug = 'solaranlage-foerderungen-2026';

update public.blog_articles
set
  title = 'Elektroauto zuhause laden: Tarif und Technik abstimmen',
  teaser = 'Fahrleistung, Ladezeit, Wallbox und Messkonzept entscheiden, welcher Stromtarif zu Ihrem Alltag passt.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 6,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Den zusätzlichen Verbrauch realistisch einschätzen',
      'paragraphs', jsonb_build_array(
        'Ein Elektroauto verändert den Stromverbrauch des Haushalts deutlich. Entscheidend sind Fahrleistung, Fahrzeugverbrauch und der Anteil, der tatsächlich zuhause geladen wird.',
        'Mit diesen Angaben lässt sich prüfen, ob der bestehende Haushaltstarif weiterhin passt oder eine andere Tarifstruktur interessant ist.'
      )
    ),
    jsonb_build_object(
      'heading', 'Technik und Ladezeiten berücksichtigen',
      'paragraphs', jsonb_build_array(
        'Wallbox, Zähler und mögliche Steuerung bestimmen, welche Tarife technisch nutzbar sind. Flexible Ladezeiten können zusätzliche Optionen eröffnen.',
        'Dynamische Preise können Chancen bieten, verlangen aber Aufmerksamkeit und eine passende technische Steuerung.'
      )
    ),
    jsonb_build_object(
      'heading', 'Tarif nach Ihrem Alltag auswählen',
      'paragraphs', jsonb_build_array(
        'PRIME ENERGIE betrachtet Fahrzeug und Haushalt gemeinsam. Wir ordnen verfügbare Angebote anhand Ihres Verbrauchsprofils und Ihrer gewünschten Planbarkeit ein.',
        'Dabei bleiben Kosten, Vertragsbedingungen und technische Voraussetzungen gleichermaßen sichtbar.'
      )
    )
  ),
  seo_title = 'Elektroauto zuhause laden | PRIME ENERGIE',
  seo_description = 'Stromverbrauch, Wallbox, Ladezeiten und Tarifwahl für das Laden eines Elektroautos zuhause.'
where slug = 'e-auto-laden';

update public.blog_articles
set
  title = 'Solaranlage planen und umsetzen',
  teaser = 'Von der ersten Dachprüfung bis zur Inbetriebnahme: Ein klarer Ablauf schafft Sicherheit bei der Umsetzung.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 7,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Bedarf und Gebäude prüfen',
      'paragraphs', jsonb_build_array(
        'Am Anfang stehen Stromverbrauch, Dachfläche, Ausrichtung, Verschattung und die technische Situation im Gebäude. Diese Punkte bilden die Grundlage für eine passende Anlagengröße.',
        'Auch zukünftige Verbraucher wie Wärmepumpe oder Elektroauto sollten in die Planung einfließen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Leistungsumfang der Angebote vergleichen',
      'paragraphs', jsonb_build_array(
        'Ein vollständiges Angebot beschreibt Komponenten, Montage, Elektroarbeiten, Anmeldung, Dokumentation und mögliche Zusatzkosten. Unklare Positionen sollten vor der Beauftragung geklärt werden.',
        'Referenzen, Garantien und Erreichbarkeit nach der Installation sind ebenfalls wichtige Auswahlkriterien.'
      )
    ),
    jsonb_build_object(
      'heading', 'Abnahme und Unterlagen sichern',
      'paragraphs', jsonb_build_array(
        'Nach der Montage gehören Einweisung, Prüfprotokolle, Anmeldungen und Produktunterlagen zu einer sauberen Übergabe. Bewahren Sie diese Dokumente für Wartung und mögliche Garantiefragen auf.',
        'PRIME ENERGIE unterstützt bei der ersten Orientierung und der Abstimmung sinnvoller nächster Schritte.'
      )
    )
  ),
  seo_title = 'Solaranlage Schritt für Schritt planen | PRIME ENERGIE',
  seo_description = 'Bedarf, Angebote, Montage und Dokumentation bei einer Solaranlage verständlich erklärt.'
where slug = 'solaranlage-installation';

update public.blog_articles
set
  title = 'Heizkosten mit System senken',
  teaser = 'Verbrauch, Einstellungen, Gebäude und Gastarif gehören zusammen. Kleine Schritte können bereits für mehr Transparenz sorgen.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 6,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Verbrauch zuerst verstehen',
      'paragraphs', jsonb_build_array(
        'Vergleichen Sie aktuelle Verbrauchswerte mit früheren Abrechnungen und berücksichtigen Sie Witterung sowie Änderungen im Haushalt. Auffällige Abweichungen lassen sich so schneller erkennen.',
        'Regelmäßige Zählerstände helfen, die Wirkung von Anpassungen nachvollziehbar zu machen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Technik und Verhalten abstimmen',
      'paragraphs', jsonb_build_array(
        'Passende Raumtemperaturen, freie Heizkörper und sinnvolle Zeitprogramme können unnötigen Verbrauch vermeiden. Bei ungleichmäßig warmen Räumen sollte die Anlage fachlich geprüft werden.',
        'Bauliche Maßnahmen und Arbeiten an der Heizung gehören in die Hände qualifizierter Fachbetriebe.'
      )
    ),
    jsonb_build_object(
      'heading', 'Auch den Vertrag prüfen',
      'paragraphs', jsonb_build_array(
        'Ein passender Gastarif ersetzt keine effiziente Heizung, kann aber die Kostenstruktur verbessern. Entscheidend sind Gesamtkosten, Laufzeit, Kündigungsfrist und Preisgarantie.',
        'PRIME ENERGIE ordnet diese Punkte anhand Ihrer Abrechnung und Ihrer Wünsche persönlich ein.'
      )
    )
  ),
  seo_title = 'Heizkosten strukturiert senken | PRIME ENERGIE',
  seo_description = 'Verbrauch, Heiztechnik, Verhalten und Gastarif gemeinsam betrachten.'
where slug = 'heizkosten-senken';

update public.blog_articles
set
  title = 'Ein Anbieter für Strom und Gas: Passt das zu Ihnen?',
  teaser = 'Eine gemeinsame Lösung kann übersichtlich sein. Wirtschaftlich zählt aber der Vergleich mit passenden Einzeltarifen.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 5,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Gemeinsam bedeutet nicht automatisch günstiger',
      'paragraphs', jsonb_build_array(
        'Ein Anbieter für beide Sparten kann Kommunikation und Verwaltung vereinfachen. Die Preise für Strom und Gas sollten trotzdem einzeln betrachtet werden.',
        'Erst der Vergleich der Gesamtkosten zeigt, ob die gemeinsame Lösung zu Ihrem Verbrauch passt.'
      )
    ),
    jsonb_build_object(
      'heading', 'Vertragsenden und Flexibilität',
      'paragraphs', jsonb_build_array(
        'Wenn bestehende Verträge zu unterschiedlichen Terminen enden, lässt sich ein gemeinsamer Start nicht immer sofort umsetzen. Auch spätere Kündigungsfristen können voneinander abweichen.',
        'Eine gute Lösung berücksichtigt deshalb nicht nur den Preis, sondern auch Ihre gewünschte Flexibilität.'
      )
    ),
    jsonb_build_object(
      'heading', 'PRIME ENERGIE prüft beide Varianten',
      'paragraphs', jsonb_build_array(
        'Wir stellen gemeinsame Angebote passenden Einzeltarifen gegenüber und erklären die Unterschiede. So können Sie Komfort und Wirtschaftlichkeit bewusst abwägen.',
        'Sie entscheiden erst, wenn die konkreten Konditionen verständlich vorliegen.'
      )
    )
  ),
  seo_title = 'Strom und Gas bei einem Anbieter | PRIME ENERGIE',
  seo_description = 'Vorteile und Unterschiede gemeinsamer Angebote und einzelner Tarife für Strom und Gas.'
where slug = 'ein-vertrag-statt-zwei';

update public.blog_articles
set
  title = 'Anbieterwechsel verständlich erklärt',
  teaser = 'Vom ersten Tarifcheck bis zum neuen Vertrag: PRIME ENERGIE erklärt die wichtigen Schritte und Unterlagen.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 5,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Ausgangslage erfassen',
      'paragraphs', jsonb_build_array(
        'Für eine Tarifprüfung sind Postleitzahl, Jahresverbrauch und Angaben zum bestehenden Vertrag besonders hilfreich. Eine aktuelle Abrechnung bündelt viele dieser Informationen.',
        'Prüfen Sie Vertragsende und Kündigungsfrist, bevor Sie einen möglichen Wechseltermin festlegen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Angebot und Auftrag trennen',
      'paragraphs', jsonb_build_array(
        'Eine Tarifempfehlung ist noch kein Vertragsabschluss. Lesen Sie das konkrete Angebot mit Preis, Laufzeit, Bonusbedingungen und Preisgarantie in Ruhe.',
        'Erst nach Ihrer Freigabe werden die vereinbarten nächsten Schritte eingeleitet.'
      )
    ),
    jsonb_build_object(
      'heading', 'Persönlich begleitet',
      'paragraphs', jsonb_build_array(
        'PRIME ENERGIE erklärt den Ablauf und unterstützt bei der Abstimmung mit den beteiligten Anbietern, soweit dies vereinbart wurde.',
        'Der tatsächliche Starttermin hängt von Ihrer Vertragssituation und der Bestätigung des neuen Anbieters ab.'
      )
    )
  ),
  seo_title = 'Anbieterwechsel verständlich erklärt | PRIME ENERGIE',
  seo_description = 'Tarifprüfung, Vertragsunterlagen und nächste Schritte beim Anbieterwechsel.'
where slug = 'anbieterwechsel-schritt-fuer-schritt';

update public.blog_articles
set
  title = 'Diese Unterlagen helfen beim Energieanbieterwechsel',
  teaser = 'Abrechnung, Verbrauch und Vertragsdaten schaffen eine verlässliche Grundlage für die Tarifprüfung.',
  author = 'PRIME ENERGIE Redaktion',
  read_time_min = 5,
  body = jsonb_build_array(
    jsonb_build_object(
      'heading', 'Die letzte Abrechnung als Grundlage',
      'paragraphs', jsonb_build_array(
        'Auf der Jahresabrechnung finden Sie Verbrauch, Kundennummer, Zählernummer und häufig weitere Vertragsangaben. Damit lässt sich Ihre aktuelle Situation besonders genau erfassen.',
        'Wenn keine Abrechnung vorliegt, kann eine erste Anfrage auch mit geschätztem Verbrauch beginnen.'
      )
    ),
    jsonb_build_object(
      'heading', 'Vertragsfristen und Kontaktdaten',
      'paragraphs', jsonb_build_array(
        'Notieren Sie Vertragsende, Kündigungsfrist und den Namen des bisherigen Anbieters. Korrekte Kontaktdaten sind wichtig, damit Rückfragen schnell geklärt werden können.',
        'Für einen späteren Auftrag können zusätzliche Angaben erforderlich sein. Diese werden erst abgefragt, wenn sie für den gewählten Prozess benötigt werden.'
      )
    ),
    jsonb_build_object(
      'heading', 'Dokumente sicher übermitteln',
      'paragraphs', jsonb_build_array(
        'Über das Formular von PRIME ENERGIE können Sie geeignete Dokumente verschlüsselt übermitteln. Bitte prüfen Sie vor dem Hochladen, ob die Datei lesbar und aktuell ist.',
        'Wie Ihre Angaben verarbeitet werden, erläutert unsere Datenschutzerklärung.'
      )
    )
  ),
  seo_title = 'Unterlagen für den Anbieterwechsel | PRIME ENERGIE',
  seo_description = 'Welche Angaben und Dokumente bei einer Tarifprüfung für Strom oder Gas hilfreich sind.'
where slug = 'unterlagen-beim-wechsel';
