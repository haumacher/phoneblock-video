#!/usr/bin/env python3
"""Installation chapter, bonus scene and closing line.

lines.tsv: key<TAB>voice-id<TAB>text
  i*, n*, e1  narrator "Jonas Falk"
  p*          the sales caller in the bonus ("Basti Boom", call-centre headset sound)
The dongle's side of the bonus conversation (b1..b6) is not synthesized here:
those are the firmware's real dialogue clips (speaker "grandpa") from the CDN,
bot-*.mp3, played in telephone quality and at the tempo the firmware uses.

Same caching as part1. Writes public/bonus/<key>.wav and src/bonus-clips.json.
The dialogue texts for b1..b6 are read from the firmware's dialog_de.arb
(PHONEBLOCK_FIRMWARE, default ../phoneblock/phoneblock-dongle/firmware).
"""
import json, os, subprocess, sys, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / "public" / "bonus"
FW = Path(os.environ.get("PHONEBLOCK_FIRMWARE", ROOT.parent / "phoneblock" / "phoneblock-dongle" / "firmware"))
TEMPO = {"VBhW9TV6mNHCxbcqSl17": "1.1", "GpMEuRGYD0oLjmn4ptQZ": "1.15"}
TRIM = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse")
# The dongle's lines: b<n> -> firmware dialogue clip (CDN: dongle/firmware/audio/tts/de/grandpa/<clip>.mp3)
BOT = {"b1": "hello-2", "b2": "am-aparat-7", "b3": "question-14", "b4": "question-10",
       "b5": "cant-hear-you-4", "b6": "question-3"}
CDN = "https://cdn.phoneblock.net/dongle/firmware/audio/tts/de/grandpa"


def api_key():
    k = os.environ.get("ELEVENLABS_API_KEY")
    if k:
        return k
    for l in open(os.path.expanduser("~/.gradle/gradle.properties")):
        if l.startswith("elevenlabs.apiKey"):
            return l.split("=", 1)[1].strip()
    sys.exit("no ElevenLabs API key")


def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", str(p)]))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    key = None
    out = {}
    for line in open(HERE / "lines.tsv", encoding="utf-8"):
        k, voice, text = line.rstrip("\n").split("\t")
        raw, txt = HERE / f"{k}.raw.mp3", HERE / f"{k}.txt"
        if not (raw.exists() and txt.exists() and txt.read_text() == voice + text):
            key = key or api_key()
            req = urllib.request.Request(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128",
                data=json.dumps({"text": text, "model_id": "eleven_v4"}).encode(),
                headers={"xi-api-key": key, "Content-Type": "application/json"})
            raw.write_bytes(urllib.request.urlopen(req).read())
            txt.write_text(voice + text)
            print("generated", k)
        band = ",highpass=f=180,lowpass=f=6000" if k.startswith("p") else ""
        wav = OUT / f"{k}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                        f"atempo={TEMPO[voice]},{TRIM}{band},loudnorm=I=-16:TP=-1.5",
                        "-ar", "48000", "-ac", "1", str(wav)], check=True)
        out[k] = {"text": text, "duration": round(dur(wav), 3)}
    arb = json.load(open(FW / "i18n" / "l10n" / "dialog" / "dialog_de.arb", encoding="utf-8"))
    for k, clip in BOT.items():
        src = HERE / f"bot-{clip}.mp3"
        if not src.exists():
            src.write_bytes(urllib.request.urlopen(f"{CDN}/{clip}.mp3").read())
        wav = OUT / f"{k}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af",
                        f"atempo=1.25,{TRIM},highpass=f=300,lowpass=f=3400,loudnorm=I=-17:TP=-1.5",
                        "-ar", "48000", "-ac", "1", str(wav)], check=True)
        out[k] = {"text": arb[clip.replace("-", "_")], "duration": round(dur(wav), 3)}
    (ROOT / "src" / "bonus-clips.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    for k, v in out.items():
        print(k, v["duration"])


main()
