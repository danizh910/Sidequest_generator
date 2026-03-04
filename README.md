# Sidequest Picker 🎰

Ein Slot-Machine-Style Adventure-Picker. Öffne `index.html` direkt im Browser oder hoste es auf GitHub Pages.

## Dateien

```
index.html       ← Einstiegspunkt
styles.css       ← Gesamtes Styling (Retro-Arcade Theme)
app.js           ← App-Logik + alle Quest-Daten
roulette.js      ← Slot-Machine-Animation (jQuery Plugin)
baseQuests.json  ← Basis-Quests (wird von app.js direkt eingebunden)
```

## Lokal starten

Einfach `index.html` im Browser öffnen — kein Build-Schritt nötig.

> **Hinweis:** Für GitHub Pages reicht es, alle Dateien ins Root-Verzeichnis zu pushen und in den Repo-Settings → Pages → Branch: `main` zu aktivieren.

## GitHub Pages Deploy

1. Repo erstellen
2. Alle 5 Dateien pushen
3. Settings → Pages → Source: `main / root`
4. Fertig — App läuft unter `https://USERNAME.github.io/REPO/`

## Features

- 🎰 **Slot Machine Picker** — echte Scroll-Animation via roulette.js
- 🔧 **Filter** — Kategorie-Pills, Dauer, Setting, Gruppe, Level
- ➕ **Eigene Quests** erstellen & bearbeiten
- ✅ **Done / Skip / Save** — mit lokalem Verlauf
- 📜 **History & Saved** Tabs
- 💾 Alles im localStorage gespeichert
