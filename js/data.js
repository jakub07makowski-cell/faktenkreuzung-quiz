// Inhalte des Quiz. Die richtige Antwort steht immer an erster Stelle (Index 0),
// die Reihenfolge wird beim Spielen gemischt.
window.FK_DATA = {
  title: "Quiz zum Thema Verschwörungserzählungen: Die Rote Welle",
  questionTime: 30, // Sekunden pro Frage

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
      ex: "„Ein müdes Volk ist ein ruhiges Volk.“ Dazu verdient der Kreis angeblich heimlich an Tankstellen und Getränkefirmen mit: „Euer Stress ist deren Gewinn.“"
    },
    {
      q: "Wer hat die drei Merkmale beschrieben, an denen man Verschwörungstheorien erkennt?",
      a: ["Michael Barkun", "Michael Butter", "Karl Popper", "Dr. Sommer"],
      ex: "Die drei Merkmale stammen vom Politikwissenschaftler Michael Barkun. Michael Butter kam bei den Teilöffentlichkeiten und der Immunisierung gegen Kritik vor."
    },
    {
      q: "„Ein Mal ist Pech, zwölf Mal ist Absicht.“ Welches Merkmal steckt in diesem Satz?",
      a: [
        "Nichts geschieht durch Zufall",
        "Nichts ist, wie es scheint",
        "Alles ist miteinander verbunden",
        "Immunisierung gegen Kritik"
      ],
      ex: "Merkmal 1: Nichts geschieht durch Zufall. Zwölf rote Ampeln sind angeblich Teil eines Plans. So wird die Welt in Gut und Böse geteilt: der Grüne Kreis gegen die Pendler."
    },
    {
      q: "Welche Aussage ist ein Beispiel für das Merkmal „Nichts ist, wie es scheint“?",
      a: [
        "Das Ampelmännchen mit Hut ist in Wahrheit ein geheimes Erkennungszeichen",
        "Ein Mal ist Pech, zwölf Mal ist Absicht",
        "Navi-Firmen und Fahrschulen arbeiten heimlich zusammen",
        "Wer im Kanal widerspricht, ist ein Schläfer des Kreises"
      ],
      ex: "Merkmal 2: Die harmlose Ampel ist angeblich ein Werkzeug der Kontrolle, und die Verschwörer erkennt man nur an geheimen Codes wie der Zahl 3. Die anderen Sätze zeigen „kein Zufall“, „alles ist verbunden“ und die Immunisierung gegen Kritik."
    },
    {
      q: "Verkehrsämter, Tankstellen, Getränkefirmen, Navi-Anbieter und Fahrschulen sollen zusammenarbeiten. Was hat eine Fahrschule mit einem Energydrink zu tun? Welches Merkmal ist das?",
      a: [
        "Alles ist miteinander verbunden",
        "Nichts ist, wie es scheint",
        "Nichts geschieht durch Zufall",
        "Teilöffentlichkeit"
      ],
      ex: "Merkmal 3: Alles ist miteinander verbunden. Logisch muss die Verbindung nicht sein, es reicht, dass alle mit dem Straßenverkehr zu tun haben. Je mehr mitmachen, desto mächtiger wirkt die Verschwörung."
    },
    {
      q: "Was meint Michael Butter mit „Teilöffentlichkeiten“?",
      a: [
        "Gruppen, die fast nur unter sich reden und eine eigene Vorstellung von Wahrheit haben",
        "Der Teil der Bevölkerung, der grundsätzlich an Verschwörungen glaubt",
        "Geschlossene Kanäle, in denen nur die Admins etwas posten dürfen",
        "Öffentliche Debatten, an denen sich nur Fachleute beteiligen"
      ],
      ex: "Die Öffentlichkeit zerfällt in Gruppen, die unter sich bleiben. Bei Lokalzeitung, Behörden und Fachleuten wird die Rote Welle belächelt, im Telegram-Kanal „Grüne Welle Wahrheit“ gilt sie als sicheres Wissen."
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
        "Den Ärger ernst nehmen, sich klar abgrenzen und auf Widersprüche hinweisen",
        "Ruhig bleiben und möglichst viele Fakten und Statistiken vorlegen",
        "Erst einmal zustimmen, um das Vertrauen nicht zu verlieren",
        "Das Thema meiden, damit der Streit nicht größer wird"
      ],
      ex: "Wer nur mit Fakten kommt, greift auch die Identität des anderen an. Besser ist ein Gespräch: den Ärger ernst nehmen, sich klar von der Geschichte abgrenzen und auf Widersprüche hinweisen."
    },
    {
      bonus: true,
      q: "Bonusfrage ohne Punkte: Wie viele rote Ampeln hintereinander hatte der Ampelwächter auf dem Weg zu seinem wichtigen Termin?",
      a: ["Zwölf", "Elf", "Neun", "Sieben"],
      ex: "Zwölf Ampeln, zwölfmal Rot vor seinem Termin um acht. Neun von elf waren es auf dem Weg ins Studio, sieben von acht standen im Kanal-Post."
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
