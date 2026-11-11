#!/bin/bash
# usage: ab.sh scenario runs fileA fileB
scn=$1;n=$2;shift 2
for i in $(seq 1 $n); do for f in "$@"; do timeout 200 ./srv.sh python3 pf.py $f $scn 4 2>/dev/null | python3 -c "
import sys,json
for l in sys.stdin:
  try:r=json.loads(l)
  except:continue
  print(r['file'],r['scn'],'load mean %.1f p99 %.1f over %d | main %.1f%% script %.1f%% gapmax %.0f lt %d | nodes/s %d'%(r['audio_load_mean_pct'],r['audio_load_p99_pct'],r['audio_over_100'],r['main_busy_pct'],r['script_pct'],r['gap_ms_max'],r['longtask_max'],r['nodes_per_s']))"; done; done
