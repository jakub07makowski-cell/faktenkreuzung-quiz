// Inhalte des Quiz. Die richtige Antwort steht immer an erster Stelle (Index 0),
// die Reihenfolge wird beim Spielen gemischt.
window.FK_DATA = {
  title: "Quiz zum Thema Verschwörungserzählungen: Die Rote Welle",
  questionTime: 20, // Sekunden pro Frage

  questions: [
    {
      q: "Wer steckt laut Ampelwächter hinter den roten Ampeln?",
      a: [
        "Der Grüne Kreis, ein geheimer Zusammenschluss von Verkehrsplanern",
        "Der Grüne Kreis, ein Bündnis von Tankstellen und Getränkefirmen",
        "Die Grüne Welle, ein Geheimbund in den Navi-Firmen",
        "Der Rote Kreis, eine geheime Abteilung im Verkehrsamt"
      ],
      ex: "Der Grüne Kreis besteht angeblich aus Verkehrsplanern in Ämtern und Leitzentralen. Tankstellen und Getränkefirmen sind nur die, an denen er heimlich mitverdient."
    },
    {
      q: "Was hat der Grüne Kreis laut Ampelwächter davon, dass alle warten?",
      a: [
        "Erschöpfte Pendler kaufen Kaffee und hinterfragen nichts mehr",
        "Im Stau wird mehr getankt, und die Ämter kassieren mit",
        "Wer zu spät kommt, zahlt mehr Bußgelder an die Stadt",
        "Genervte Autofahrer steigen auf Bus und Bahn um"
      ],
      ex: "„Ein erschöpftes Volk ist ein leicht zu lenkendes Volk.“ Der Kreis verdient angeblich an Kaffee und Energydrinks: Der Schaden der Pendler ist sein Gewinn."
    },
    {
      q: "Wer hat die drei Merkmale beschrieben, an denen man Verschwörungstheorien erkennt?",
      a: ["Michael Barkun", "Michael Butter", "Karl Popper", "Dr. Sommer"],
      ex: "Die drei Merkmale stammen von Michael Barkun. Michael Butter kam bei den Teilöffentlichkeiten und der Immunisierung gegen Kritik vor."
    },
    {
      q: "„Zwölfmal Rot hintereinander, das kann kein Pech sein.“ Welches Merkmal steckt in diesem Satz?",
      a: [
        "Nichts passiert durch Zufall",
        "Nichts ist, wie es scheint",
        "Alles hängt mit allem zusammen",
        "Immunisierung gegen Kritik"
      ],
      ex: "Merkmal 1: Nichts passiert durch Zufall. Jede rote Ampel gehört angeblich zum Plan, und damit gibt es sofort Täter und Opfer."
    },
    {
      q: "Welche Aussage ist ein Beispiel für das Merkmal „Nichts ist, wie es scheint“?",
      a: [
        "Das Ampelmännchen mit Hut ist in Wahrheit ein geheimes Erkennungszeichen",
        "Zwölfmal Rot vor einem wichtigen Termin kann kein Pech sein",
        "Navi-Firmen und Fahrschulen arbeiten heimlich zusammen",
        "Wer im Kanal widerspricht, ist ein Schläfer des Kreises"
      ],
      ex: "Merkmal 2: Hinter dem Harmlosen steckt angeblich etwas Verborgenes, das nur Eingeweihte an Codes erkennen. Die anderen Sätze zeigen „kein Zufall“, „alles hängt zusammen“ und die Immunisierung gegen Kritik."
    },
    {
      q: "Verkehrsämter, Tankstellen, Navi-Anbieter und Fahrschulen sollen gemeinsame Sache machen, obwohl manche davon Konkurrenten sind. Welches Merkmal ist das?",
      a: [
        "Alles hängt mit allem zusammen",
        "Nichts ist, wie es scheint",
        "Nichts passiert durch Zufall",
        "Teilöffentlichkeit"
      ],
      ex: "Merkmal 3: Alles hängt mit allem zusammen. Logisch muss das nicht sein. Je mehr angeblich mitmachen, desto mächtiger wirkt das Ganze."
    },
    {
      q: "Was meint Michael Butter mit „Teilöffentlichkeiten“?",
      a: [
        "Gruppen, die fast nur unter sich reden und eine eigene Vorstellung von Wahrheit haben",
        "Der Teil der Bevölkerung, der grundsätzlich an Verschwörungen glaubt",
        "Geschlossene Kanäle, in denen nur die Admins etwas posten dürfen",
        "Öffentliche Debatten, an denen sich nur Fachleute beteiligen"
      ],
      ex: "Die Öffentlichkeit zerfällt in Gruppen, die unter sich bleiben. Draußen lächelt man über die Rote Welle, im Kanal „Grüne Welle Wahrheit“ gilt sie als Fakt."
    },
    {
      q: "Dr. Sommer zeigt eine Statistik: Ampeln sind öfter grün, als man denkt. Der Ampelwächter sagt nur: „Ablenkungswelle.“ Was passiert hier?",
      a: [
        "Immunisierung gegen Kritik: Der Gegenbeweis wird zum Beweis umgedeutet",
        "Bestätigungsfehler: Er merkt sich nur, was zu seiner Meinung passt",
        "Echokammer: Die Gruppe bestätigt ihn in seiner Sicht",
        "Faktencheck: Er überprüft die Statistik an eigenen Daten"
      ],
      ex: "Immunisierung gegen Kritik: Rot beweist den Plan, Grün auch. Was man durch nichts widerlegen kann, erklärt am Ende nichts."
    },
    {
      q: "Der Ampelwächter schreibt jede rote Ampel mit Uhrzeit auf, die grünen aber nicht. Wofür ist das ein Beispiel?",
      a: [
        "Bestätigungsfehler: Man beachtet vor allem, was zur eigenen Meinung passt",
        "Immunisierung gegen Kritik: Gegenbeweise werden zu Beweisen umgedeutet",
        "Echokammer: Im Kanal hört er jeden Tag, dass er recht hat",
        "Sündenbock-Denken: Ein Schuldiger ersetzt die eigene Verantwortung"
      ],
      ex: "Beim Bestätigungsfehler nehmen wir vor allem wahr, was unsere Meinung stützt. Die grünen Ampeln vergisst man, die eine rote bleibt im Kopf."
    },
    {
      q: "Jemand aus der Familie glaubt an so eine Erzählung. Was rät Dr. Sommer?",
      a: [
        "Den Ärger ernst nehmen, klar widersprechen und nach Widersprüchen fragen",
        "Ruhig bleiben und möglichst viele Fakten und Statistiken vorlegen",
        "Erst einmal zustimmen, um das Vertrauen nicht zu verlieren",
        "Das Thema meiden, damit der Streit nicht größer wird"
      ],
      ex: "Wer nur Fakten hinknallt, greift die Person an, und sie macht zu. Besser: reden, ernst nehmen, die eigene Haltung klar sagen und nach Widersprüchen fragen."
    },
    {
      bonus: true,
      q: "Bonusfrage ohne Punkte: Wie viele rote Ampeln hintereinander hatte der Ampelwächter an jenem Dienstag?",
      a: ["Zwölf", "Elf", "Neun", "Sieben"],
      ex: "Zwölfmal Rot vor einem wichtigen Termin. Neun von elf waren es auf dem Weg ins Studio, sieben von acht standen im Kanal-Beitrag."
    }
  ],

  // Kommentare des Ampelwächters bei falscher Antwort
  wrongLines: [
    "Siehst du? Genau das wollen die.",
    "Zufall? Sicher nicht.",
    "Typisch Ablenkungswelle.",
    "Das versteht man erst, wenn man aufgewacht ist.",
    "Rot. Wie immer.",
    "Schreib dir das auf. Mit Uhrzeit und Kreuzung.",
    "Das gehört halt zum Plan."
  ],
  rightLines: [
    "Grün! Freie Fahrt.",
    "Sauber erkannt.",
    "Das war eine grüne Ampel.",
    "Faktencheck bestanden."
  ],
  slowLines: [
    "Zu spät. Die Ampel war schon rot.",
    "Stau im Kopf? Passiert jedem."
  ],

  loadingLines: [
    "Elf Ampeln, neun davon rot …",
    "Rufe beim Verkehrsamt an …",
    "Suche das Männchen mit Hut …",
    "Warte auf Grün …",
    "Zähle gelbe Sekunden: eins, zwei, drei …"
  ],

  nameIdeas: [
    "Ampelwächter_7", "Grünwellenreiterin", "Rotlichtforscher", "Kreuzungskind",
    "Gelbphase", "Spurwechsler", "Pendlerin_42", "Tankstellenkaffee", "Zebrastreifen",
    "Navi-Skeptiker", "Faktenfuchs", "Linksabbieger", "Stauexpertin", "Ampelflüsterer",
    "Fußgängerfee", "Kreisverkehr", "Faktenkreuzerin", "Grünpfeil"
  ],

  // Rang nach Anteil richtiger Antworten (ohne Bonusfrage)
  ranks: [
    { min: 0, max: 0, title: "Zwölfmal Rot", text: "Kein einziges Grün. Tipp vom Ampelwächter: Morgen fünf Minuten früher losfahren." },
    { min: 1, max: 3, title: "Schläfer", text: "Du hast noch etwas geschlafen. Hör dir die Folge ruhig noch einmal an." },
    { min: 4, max: 6, title: "Pendler", text: "Du bist gut durchgekommen, aber an ein paar Kreuzungen hast du gestanden." },
    { min: 7, max: 8, title: "Faktenchecker", text: "Stark! Du erkennst die Muster einer Verschwörungserzählung." },
    { min: 9, max: 10, title: "Ehrenmitglied der Faktenkreuzung", text: "Grüne Welle bis zum Ende. Dich legt so schnell keine Erzählung rein." }
  ],

  farewell: "Kommt gut über die nächste Ampel."
};
