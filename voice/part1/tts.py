#!/usr/bin/env python3
"""Narration for scenes 0 and 1 (narrator: ElevenLabs voice "Jonas Falk").

Reads lines.tsv (key<TAB>text). A line is only sent to ElevenLabs when its text
changed (the .txt next to the .raw.mp3 is the cache key), so re-running costs
nothing for unchanged lines. Writes the processed clips to public/vo/<key>.wav
and their durations to src/clips.json, which drive the whole timeline.

The API key comes from ELEVENLABS_API_KEY or elevenlabs.apiKey in
~/.gradle/gradle.properties (same place the dongle's TTS pipeline uses).
"""
import json, os, subprocess, sys, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / "public" / "vo"
VOICE = "GpMEuRGYD0oLjmn4ptQZ"   # Jonas Falk
MODEL = "eleven_v4"
TEMPO = sys.argv[1] if len(sys.argv) > 1 else "1.15"   # eleven_v4 speaks slowly


def api_key():
    k = os.environ.get("ELEVENLABS_API_KEY")
    if k:
        return k
    for l in open(os.path.expanduser("~/.gradle/gradle.properties")):
        if l.startswith("elevenlabs.apiKey"):
            return l.split("=", 1)[1].strip()
    sys.exit("no ElevenLabs API key")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    key = None
    out = {}
    for line in open(HERE / "lines.tsv", encoding="utf-8"):
        k, text = line.rstrip("\n").split("\t")
        raw, txt = HERE / f"{k}.raw.mp3", HERE / f"{k}.txt"
        if not (raw.exists() and txt.exists() and txt.read_text() == text):
            key = key or api_key()
            req = urllib.request.Request(
                f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
                data=json.dumps({"text": text, "model_id": MODEL}).encode(),
                headers={"xi-api-key": key, "Content-Type": "application/json"})
            raw.write_bytes(urllib.request.urlopen(req).read())
            txt.write_text(text)
            print("generated", k)
        wav = OUT / f"{k}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                        f"atempo={TEMPO},silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5",
                        "-ar", "48000", "-ac", "1", str(wav)], check=True)
        d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                           "-of", "csv=p=0", str(wav)]))
        out[k] = {"text": text, "duration": round(d, 3)}
    (ROOT / "src" / "clips.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    for k, v in out.items():
        print(k, v["duration"])


main()
