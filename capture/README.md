# How the screenshots in `public/ui/` were made

## Dongle web UI (`ui-01` … `ui-08`, `ui-10`)

The real web UI of firmware 2.0.0, served by the official Linux build in a
fresh container (no hardware, nothing configured):

```sh
docker run -d --name pb-video-ui -p 127.0.0.1:18080:8080 -e TZ=Europe/Berlin phoneblock/answerbot2:latest
```

Captured with Playwright at a 400×820 viewport, UI language set to Deutsch
(`#langSelect`). The parts that would talk to a real Fritz!Box or to
phoneblock.net were answered in the browser with `page.route()`, so no real
router was touched:

| request | simulated answer |
|---|---|
| `api/fritzbox-setup` | `401 {"two_factor": true, "methods": "button dtmf;*18401"}` |
| `api/fritzbox-2fa-status` | pending twice, then `{"ok": true, "internal_number": "620"}` |
| `api/status` | the container's real status, with `sip.user`/`registered`/`internal_number: 620` and `phoneblock.token_set` filled in once the step is "done", `ip_address: 192.168.178.50` |

Sequence: start page → "Telefonie einrichten" → "Fritz!Box (empfohlen)" →
password typed → "Nebenstelle einrichten" (2FA hint) → back on the start page
with step 1 done → "PhoneBlock verbinden" → final status page.

## phoneblock.net (`ui-09-pb-login`, `web-step2`)

- `ui-09-pb-login`: the page "Bei PhoneBlock anmelden" opens
  (`/phoneblock/mobile/login?appId=PhoneBlockDongle…`), 400×820, `Accept-Language: de-DE`.
- `web-step2`: https://phoneblock.net/phoneblock/dongle at 1280×760, scrolled to
  "Schritt 2 — Dongle vorbereiten".

The Web Serial port picker and the ESP Web Tools dialogs in the video are
redrawn in `src/Install.tsx`, not screenshots.
