#!/bin/sh
# Synthesized placeholder sound effects and the dongle's real announcement
# (first sentence, telephone band). Writes public/sfx/.
set -e
cd "$(dirname "$0")/.."
FW=${PHONEBLOCK_FIRMWARE:-../phoneblock/phoneblock-dongle/firmware}
O=public/sfx; mkdir -p $O
q="-loglevel error -y"
# phone ring: 440+480 Hz trill, 1.0 s on / 0.6 s off
ffmpeg $q -f lavfi -i "aevalsrc='0.25*(sin(2*PI*440*t)+sin(2*PI*480*t))*(0.5+0.5*sin(2*PI*20*t))*lt(mod(t,1.6),1.0)':s=48000:d=1.6" -af "afade=t=in:d=0.02" $O/ring.wav
ffmpeg $q -f lavfi -i "aevalsrc='0.18*sin(2*PI*(200*t+600*t*t))*(0.6+0.4*sin(2*PI*28*t))':s=48000:d=1.3" -af "afade=t=in:d=0.05,afade=t=out:st=1.1:d=0.2" $O/rewind.wav
ffmpeg $q -f lavfi -i "aevalsrc='0.3*(sin(2*PI*1320*t)+0.5*sin(2*PI*1980*t))*exp(-7*t)':s=48000:d=0.7" $O/pling.wav
ffmpeg $q -f lavfi -i "aevalsrc='0.5*sin(2*PI*(600-900*t)*t)*exp(-30*t)':s=48000:d=0.15" $O/pop.wav
ffmpeg $q -f lavfi -i "anoisesrc=d=0.6:c=pink:a=0.4" -af "bandpass=f=1200:w=1500,afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.3" -ar 48000 $O/whoosh.wav
ffmpeg $q -f lavfi -i "aevalsrc='0.15*sin(2*PI*425*t)*lt(mod(t,0.48),0.24)':s=48000:d=1.2" $O/busy.wav
# "Lieber Anrufer, Sie wurden leider gephoneblockt." from the firmware's announcement
ffmpeg $q -f alaw -ar 8000 -ac 1 -i "$FW/i18n/audio/announcement-de.alaw" \
  -af "highpass=f=300,lowpass=f=3400,silenceremove=start_periods=1:start_threshold=-45dB,loudnorm=I=-20,atrim=0:2.9,afade=t=out:st=2.6:d=0.3" \
  -ar 48000 $O/announcement.wav
