
/* v178: low-end/balance recheck trims (dB): Deep Space sub drone was level with the kick, Vector and Dreamy pads still loud, Melodic House clave perc */
{const T={'Deep Space':{9:-4},Vector:{5:-4},Dreamy:{5:-3},'Melodic House':{3:-3}};for(const m in T){if(!MTRIM[m])continue;for(const k in T[m])MTRIM[m][+k]=(MTRIM[m][+k]||0)+T[m][k]}}
