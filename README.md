# Faktenkreuzung – Quiz zur Roten Welle

Quiz zum Podcast „Faktenkreuzung – Folge: Die Rote Welle“ (Deutsch-Prüfungsleistung zum Thema Verschwörungserzählungen). Die „Rote-Welle-Verschwörung“ und alle Personen, Gruppen und Kanäle sind frei erfunden.

**Link für den QR-Code:** https://jakub07makowski-cell.github.io/faktenkreuzung-quiz/

## So wird gespielt

- **Spielleitung (Jakub, Jannis, Taha):** Am Laptop, der am Beamer hängt, https://jakub07makowski-cell.github.io/faktenkreuzung-quiz/?host öffnen. Dort erscheinen QR-Code, Raumnummer und alle, die am Tisch sitzen. „Quiz starten“, danach mit „Weiter“ (oder Leertaste) durch Auflösung und Rangliste.
- **Mitspielen:** QR-Code scannen, „Live-Lobby betreten“, Spitzname und Figur wählen, „Platz nehmen“.
- **Spiel zurücksetzen:** Knopf unten links bei der Spielleitung. Gleicher Raum und QR-Code, alle bleiben am Tisch, Punkte und Antworten werden gelöscht. Wer noch fehlt, kann danach scannen.
- **Raum neu generieren:** ebenfalls unten links. Neue Raumnummer und neuer QR-Code, der alte Raum wird geschlossen, alle müssen neu beitreten (ihre Handys springen automatisch auf die Startseite).
- **Ohne Live-Runde:** Wer den Code scannt, während keine Live-Runde läuft, spielt automatisch eine Einzelrunde.

10 Fragen mit je 20 Sekunden plus eine Bonusfrage ohne Punkte. Schnelle richtige Antworten bringen mehr Punkte, mehrere richtige hintereinander ergeben eine „Grüne Welle“ mit Bonus.

## Technik

- Reine statische Seite (GitHub Pages), keine Anmeldung.
- Live-Lobby und Rangliste laufen über eine Firebase Realtime Database, Adresse in `js/config.js`. Gespeichert werden nur Spitzname, Figur, Antworten und Punkte.
- Fragen und Texte: `js/data.js`. Figuren: `js/figures.js`.
- Testmodus ohne Internet: `?net=local` an die Adresse hängen (alle Tabs im selben Browser spielen zusammen).
