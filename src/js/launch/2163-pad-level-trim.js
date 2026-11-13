/* ---- quick win 3: pads sat ~0.5 after Launch in eight moods (vs ~0.2 elsewhere); trimmed by 18 %. The fader stays fully yours. ---- */
{const PT={Dark:1,Dreamy:1,Ethereal:1,Noir:1,Ambient:1,Melancholic:1,Italo:1,Drone:1};const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(PT[curMood]&&TR[5])TR[5].lv=+(TR[5].lv*.82).toFixed(2)}catch(e){}return r}}
