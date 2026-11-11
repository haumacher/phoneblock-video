#!/bin/sh
# Renders the T-Dongle-S3 screens with the firmware's own display model, fonts
# and logo (lcd_render.c mirrors the drawing in main/display.c) and writes them
# 4x enlarged to public/img/lcd-call-*.png. The logo screens come from
# hires-logo.py instead (same layout, film resolution).
set -e
cd "$(dirname "$0")"
FW=${PHONEBLOCK_FIRMWARE:-../../phoneblock/phoneblock-dongle/firmware}
T=$(mktemp -d)
gcc -O1 -I$FW/main -I$FW/core -I$FW/test lcd_render.c $FW/main/display_model.c $FW/main/lcd_font.c $FW/main/lcd_logo.c -o $T/lcd_render
(cd $T && ./lcd_render)
for f in $T/call-*.ppm; do
  n=$(basename $f .ppm)
  ffmpeg -loglevel error -y -i $f -vf scale=640:320:flags=neighbor ../public/img/lcd-$n.png
done
rm -rf $T
