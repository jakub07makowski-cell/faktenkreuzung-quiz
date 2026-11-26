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
        "Die Lokalzeitung",
        "Die Autoindustrie",
        "Der Rote Ring"
      ],
      ex: "Der Grüne Kreis ist das erfundene Feindbild. Hinter allem steckt angeblich ein geheimer Plan."
    },
    {
      q: "Was soll der Grüne Kreis angeblich davon haben?",
      a: [
        "Geld und Macht: Erschöpfte Pendler kaufen Kaffee und hinterfragen nichts mehr",
        "Weniger Unfälle",
        "Sauberere Luft",
        "Mehr Radfahrer"
      ],
      ex: "Der Schaden der Pendler ist angeblich der Gewinn des Kreises. So entsteht ein klares Gut gegen Böse."
    },
    {
      q: "Von wem stammen die drei Merkmale einer Verschwörungstheorie?",
      a: ["Michael Barkun", "Michael Butter", "Dr. Sommer", "Ampelwächter_3"],
      ex: "Michael Barkun hat die drei Merkmale beschrieben. Michael Butter kam bei den Teilöffentlichkeiten und der Immunisierung vor."
    },
    {
      q: "„Keine einzige rote Ampel ist einfach Pech.“ Welches Merkmal ist das?",
      a: [
        "Nichts passiert durch Zufall",
        "Nichts ist, wie es scheint",
        "Alles hängt mit allem zusammen",
        "Bestätigungsfehler"
      ],
      ex: "Merkmal 1: Nichts passiert durch Zufall. Jede rote Ampel gehört angeblich zum Plan."
    },
    {
      q: "Die Ampel als heimliches Kontrollwerkzeug, erkennbar nur an Codes wie der Drei. Welches Merkmal ist das?",
      a: [
        "Nichts ist, wie es scheint",
        "Nichts passiert durch Zufall",
        "Alles hängt mit allem zusammen",
        "Echokammer"
      ],
      ex: "Merkmal 2: Nichts ist, wie es scheint. Hinter dem harmlosen Gerät steckt angeblich Kontrolle, und nur Eingeweihte erkennen die Zeichen."
    },
    {
      q: "Verkehrsämter, Tankstellen, Getränkefirmen, Navis und Fahrschulen arbeiten angeblich zusammen. Welches Merkmal ist das?",
      a: [
        "Alles hängt mit allem zusammen",
        "Nichts passiert durch Zufall",
        "Nichts ist, wie es scheint",
        "Immunisierung gegen Kritik"
      ],
      ex: "Merkmal 3: Alles hängt mit allem zusammen. Gruppen, die nichts miteinander zu tun haben, werden zu einem Netz verbunden."
    },
    {
      q: "Was meint Michael Butter mit „Teilöffentlichkeiten“?",
      a: [
        "Gruppen, die fast nur unter sich reden und ihre eigene Vorstellung von Wahrheit haben",
        "Die Hälfte der Zeitungsleser",
        "Öffentliche Sitzungen im Verkehrsamt",
        "Kanäle mit wenigen Mitgliedern"
      ],
      ex: "In Teilöffentlichkeiten wie dem Kanal „Grüne Welle Wahrheit“ wirkt Kritik von außen wie eine Bestätigung. So entsteht eine Echokammer."
    },
    {
      q: "Eine grüne Ampel heißt für den Ampelwächter „Ablenkungswelle“. Wie nennt man es, wenn jeder Gegenbeweis zum Beweis wird?",
      a: ["Immunisierung gegen Kritik", "Bestätigungsfehler", "Teilöffentlichkeit", "Faktencheck"],
      ex: "Immunisierung gegen Kritik: Rot beweist den Plan, Grün auch. Was man durch nichts widerlegen kann, erklärt am Ende nichts."
    },
    {
      q: "Man merkt sich die eine rote Ampel und vergisst die vielen grünen. Wie heißt dieser Denkfehler?",
      a: ["Bestätigungsfehler", "Ablenkungswelle", "Echokammer", "Zufallsfehler"],
      ex: "Beim Bestätigungsfehler merken wir uns vor allem, was zu unserer Meinung passt. Der Ampelwächter schreibt nur die roten Ampeln auf."
    },
    {
      q: "Was rät Dr. Sommer, wenn jemand aus der Familie so etwas glaubt?",
      a: [
        "Den Ärger ernst nehmen, klar widersprechen und nach Widersprüchen fragen",
        "Alle Fakten hinknallen",
        "Auslachen",
        "Gar nicht mehr darüber reden"
      ],
      ex: "Wer nur Fakten hinknallt, greift die Person an. Besser: reden, ernst nehmen und fragen, zum Beispiel warum ein geheimer Kreis überall Männchen mit Hut aufhängt."
    },
    {
      bonus: true,
      q: "Bonusfrage ohne Punkte: Wie viele rote Ampeln hatte der Ampelwächter an jenem Dienstag?",
      a: ["Zwölf", "Neun", "Drei", "Elf"],
      ex: "Zwölfmal Rot vor einem wichtigen Termin. Am Ende will er fünf Minuten früher losfahren, nur als Test."
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
