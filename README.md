# HELLFIRE LAN – mit Story-Modus

Koop-Shooter (Raycaster) für den Browser. Koop und Deathmatch sind wie vorher, dazu der **Story-Modus für 1 bis 4 Spieler**.

## Starten

- **Lokal:** `index.html` doppelklicken. Fertig.
- **Online:** Den kompletten Ordner bei einem beliebigen Hoster für statische Seiten hochladen
  (z. B. GitHub Pages, Netlify oder itch.io als HTML5-Spiel). Es gibt keinen Server-Teil –
  nur Dateien. Wichtig ist, dass `index.html` im Hauptordner liegt und die Ordner `js`, `css`
  und `assets` daneben.
- **Zusammen (bis zu 4):** Einer klickt auf „Story-Modus“, wählt seinen Charakter und schickt den
  4-stelligen Raum-Code. Die anderen klicken auf „Beitreten“, wählen ihren Charakter und geben
  den Code ein. Alle brauchen Internet (die Verbindung läuft direkt zwischen euch über PeerJS).

## Story-Modus

| Level | Karte | Wellen | Boss | Song |
|---|---|---|---|---|
| 1 | Arena | 3 | Lil M | Fühle mich wie Chief Keef 2012 |
| 2 | Ringlabyrinth | 6 | Drachenlord | Skrrr Skrrr |
| 3 | Bunker | 9 | SehrJamal | 17 |
| 4 | Kathedrale | 12 | Jermaine | Cracker |
| 5 | Präsidentenstraße | 15 | Raphael | ballack |
| 6 | Ultimative Kampf Arena Bonn | 18 | Slimee Rebel | fur.jacket.swag.for.real |

- Start nur mit Faust und Pistole. Nach jedem Level: Case Opening (neue Waffe für beide), danach meldet sich Slime.
- 5 gemeinsame Leben pro Level (ab dem 3. Spieler eins mehr pro Spieler), Münzen sammeln: 50 Münzen = 1 Extraleben.
- Checkpoint alle 3 Wellen und direkt vor dem Boss. Bei Game Over geht es am Checkpoint weiter, die Waffen bleiben.
- Der Fortschritt wird im Browser des Hosts gespeichert („Fortsetzen“).
- `Enter`, `Leertaste` oder Klick: Dialoge und Bildschirme weiter.

## Steuerung

- Tastatur/Maus: `WASD` laufen, Maus zielen und hoch/runter schauen, Klick schießen, `Leertaste` springen, `Shift` rennen, `1`–`9` oder Mausrad Waffe wechseln.
- Controller: linker Stick laufen, rechter Stick zielen, `RT` schießen, `A` springen, `LT` rennen, `RB`/`LB` Waffe. Im Menü: Steuerkreuz, `A` auswählen, `B` zurück.
- Wer springt, weicht Geschossen am Boden aus (Bomben treffen trotzdem).

## Koop

Alle 5 Wellen kommt ein Boss, der Reihe nach: Lil M, Drachenlord, SehrJamal, Jermaine, Raphael, Jxhn2K, Slimee Rebel. Danach beginnt die Runde von vorn, nur stärker.

## Aufbau

```
index.html            Menü
css/style.css         Aussehen des Menüs
js/game.js            Engine: Karten, Waffen, Gegner, Netzwerk, Grafik
js/fx.js              Waffensounds, Waffen-Grafik und -Animation, Geschosse, Explosionen
js/story.js           Story-Modus: Level, Bosse, Wellen, Case Opening, Slimes Texte
js/menu.js            Menü, Feuer-Logo, Kamerafahrt im Hintergrund
js/peerjs.min.js      Netzwerk-Bibliothek (liegt lokal bei, kein CDN nötig)
assets/sprites/*.png  Charaktere, Gegner, Bosse
assets/music/*.mp3    ein Song pro Level
assets/sfx/*.wav      ein Sound pro Waffe (Datei ersetzen = Sound ersetzen)
```

## Schnell anpassen (alles oben in `js/story.js`)

- `LEVELS` – Karte, Name und Song pro Level
- `WAVES_PER_LEVEL` – 3 bedeutet 3/6/9/12/15/18 Wellen, 5 wäre 5/10/15/20/25/30
- `BOSS` – Leben, Tempo und Angriffe der Bosse
- `CASEP` – welche Waffen nach welchem Level in der Kiste sein können
- `DLG` – Slimes Sprüche
- `pt` / `rt` bei den Bossen – womit sie schießen (Feuer, Becher, Messer, Musiknoten, Giftschädel, Kugelblitz ...)
- Lautstärke einzelner Waffen: `SFXV` oben in `js/fx.js`
