# PhoneBlock-Dongle – Erklärvideo

Ein Trickfilm über den [PhoneBlock-Dongle](https://phoneblock.net/phoneblock/dongle):
was er tut, wie man ihn einrichtet, und was er mit Werbeanrufern anstellt.
Komplett als Code gebaut mit [Remotion](https://www.remotion.dev) (React → MP4), ohne Kamera.

Das fertige Video hängt an den [Releases](../../releases).

## Inhalt (ca. 4:15 min)

| Teil | Szene |
|---|---|
| Szene 0 | Abendessen, das Telefon klingelt, Werbeanruf · Rückspulen · derselbe Abend mit Dongle: Display „SPAM 12×“, Telefon bleibt still · Titel |
| Szene 1 | So funktioniert's: Dongle im Router, Anruf geht an alle Telefone, Abfrage (Hash) bei der Community-Datenbank, Ansage, Auflegen · normaler Anruf geht durch · Hinweis auf den Dialog-Modus |
| Installation | Passt das bei dir? · 1 Bestellen · 2 Aufspielen (Browser-Flash) · 3 Einstecken + WPS · 4 Einrichten am Handy (Fritz!Box, 2FA, PhoneBlock-Login) · Heimnetz-Hinweis |
| Bonus | „Der Dongle plaudert“: echter Dialog-Modus gegen einen Werbeanrufer, der sich aufbläht und platzt · Einstellung Ansage/Dialog |
| Schluss | phoneblock.net/dongle |

## Was echt ist

- **Display-Inhalte** des T-Dongle-S3: pixelgenau mit dem Display-Code der Firmware gerendert (`lcd/`).
- **LED-Muster/-Farben**: wie in `status_led.c` (blau schnell = WPS, kurz weiß = Einrichtung, grün = bereit).
- **Weboberfläche**: Screenshots der echten UI (Firmware 2.0.0) und von phoneblock.net (`capture/README.md`).
- **Dongle-Stimme im Bonus**: die echten Dialog-Sätze der Firmware (Sprecher „grandpa“ vom CDN), die Ansage in Szene 1 ist die echte Standard-Ansage.

Nachgezeichnet bzw. synthetisch: Router (bewusst generisch, kein AVM-Design), Chrome-Portdialog und ESP-Web-Tools-Dialoge, Soundeffekte (Platzhalter), Sprecher (ElevenLabs).
Die Telefonnummern sind Platzhalter – vor einer Veröffentlichung durch für Film/TV reservierte Nummern ersetzen.

## Bauen

```sh
npm ci
npx remotion studio                 # interaktiv ansehen, Zeitleiste scrubben
npx remotion render src/index.ts Prototype out/phoneblock-dongle.mp4
```

Ohne Untertitel: `--props='{"subtitles":false}'`.

## Ton und Text ändern

Der gesprochene Text bestimmt das Timing: `src/timeline.ts` hängt alle Bild-Ereignisse an die Sprecher-Zeilen, eine neu eingesprochene Zeile verschiebt alles Folgende mit.

- `voice/part1/lines.tsv` – Szene 0 und 1 (Erzähler)
- `voice/part2/lines.tsv` – Installation, Bonus, Schluss (`i*`, `n*`, `e1` Erzähler, `p*` Werbeanrufer)

Text ändern und das Skript laufen lassen:

```sh
voice/part1/tts.py
voice/part2/tts.py
```

Nur geänderte Zeilen gehen an ElevenLabs (die `.raw.mp3` + `.txt` daneben sind der Cache), alles andere kostet nichts.
API-Key aus `ELEVENLABS_API_KEY` oder `elevenlabs.apiKey` in `~/.gradle/gradle.properties`.

| Rolle | ElevenLabs-Stimme |
|---|---|
| Erzähler | Jonas Falk (`GpMEuRGYD0oLjmn4ptQZ`) |
| Werbeanrufer | Basti Boom (`VBhW9TV6mNHCxbcqSl17`) |
| Dongle | Firmware-Sprecher „grandpa“ (nicht neu erzeugt) |

`voice/sfx.sh` erzeugt die Soundeffekte und den Ansage-Ausschnitt, `lcd/build.sh` die Display-Bilder.
Beide und `voice/part2/tts.py` brauchen einen Checkout des PhoneBlock-Repos
(`PHONEBLOCK_FIRMWARE`, Standard: `../phoneblock/phoneblock-dongle/firmware`).
