
/* v0.75 gain structure: the corrections the 4-bar balance used to make a few bars after (nearly) every Launch are now part of the mood presets
   (dB, added to MTRIM; measured over 6 Launches per mood against the kick). 1 hi-hat · 2 clap · 3 perc · 5 pad · 6 bass · 9 Satellite.
   Only parts that sat outside their range Launch after Launch are touched, and only part of the way, so each mood keeps its own balance. */
{const T={Ethereal:{1:3,2:2,9:3},Ambient:{1:3,2:4},Dreamy:{1:2,6:4},'Deep Space':{5:5},Breaks:{5:6,6:3},Power:{5:3},'Groove Techno':{5:2},
  'Melodic House':{3:-3,6:2},Hopeful:{3:-3},Melancholic:{3:-3}};for(const m in T){if(!MTRIM[m])continue;for(const k in T[m])MTRIM[m][+k]=(MTRIM[m][+k]||0)+T[m][k]}}
