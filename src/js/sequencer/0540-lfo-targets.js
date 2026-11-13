/* ---- v63: LFO targets reworked — drop the less musical ones (sidechain depth, perc FM, master pump, delay mix, bus grit), add per-note sound targets and continuous tape wobble / shimmer ---- */
{const NEWV=["Lead cutoff","Lead resonance","Lead decay","Lead detune","Lead glide","Bass cutoff","Bass resonance","Bass decay","Pad cutoff","Stab cutoff","Stab decay","Stab echo","Hat tone","Hat decay","Lead drive","Bass drive","Perc decay","Perc octave","Clap tone","Hat accent","Perc accent","Lead accent","Hat pan","Perc pan","Lead pan","Perc pitch","Perc FM","Hat open","Perc bend","Lead fold","Stab detune"],   /* v0.75: + open hat amount, perc pitch bend, lead wavefolder, stab detune */
  NEWR=["Perc hits","Hat hits","Lead hits","Stab hits"],NEWP=["Master low-pass","Master high-pass","Delay feedback","Tape wobble","Reverb mix","Shimmer","Rumble"];
 const OLD=new Set(["Sidechain depth","Perc FM","Perc filter","Perc decay","Master pump","Delay mix","Bus grit"]);
 LF_V.splice(0,LF_V.length,...NEWV);LF_P.splice(0,LF_P.length,...NEWP);
 LFOS.forEach(L=>{if(OLD.has(L.tg))L.tg='Lead cutoff'});
 // per-note targets: [track, param(s), how the LFO value s (−depth..+depth) bends it]
 const exp=(k,lo,hi)=>(b,s)=>Math.max(lo,Math.min(hi,b*Math.pow(2,k*s)));
 const PN={"Lead resonance":[4,['res'],exp(.8,.5,13)],"Lead detune":[4,['det','o2d','o3d'],(b,s)=>b+18*s*(b>=0?1:-1)],"Lead glide":[4,['glk','gt'],(b,s)=>Math.max(0,b*(1+s)+60*Math.max(0,s))],
  "Bass resonance":[6,['res'],exp(.8,.5,8)],"Bass decay":[6,['dec'],exp(1.2,.08,.8)],"Stab decay":[8,['dec'],exp(1.5,.05,.8)],"Stab echo":[8,['eko'],(b,s)=>Math.max(0,Math.min(1,b+.45*s))],
  "Hat decay":[1,['dec'],exp(1.8,.02,.4)],
  /* v0.22 sound targets */"Lead drive":[4,['drv'],(b,s)=>Math.max(0,Math.min(1,(b||0)+.5*s))],"Bass drive":[6,['bdrv'],(b,s)=>Math.max(0,Math.min(.8,(b||0)+.4*s))],
  "Perc decay":[3,['dec','mdec'],exp(1.5,.02,1.5)],"Perc octave":[3,['oct'],(b,s)=>Math.max(2,Math.min(7,b+Math.round(s)))],"Clap tone":[2,['tone'],exp(1,500,5000)],
  "Hat open":[1,['open'],(b,s)=>Math.max(0,Math.min(1,(b||0)+.6*s))],"Perc bend":[3,['bend'],(b,s)=>Math.max(0,Math.min(3,(b||0)+1.2*s))],"Lead fold":[4,['fold'],(b,s)=>Math.max(0,Math.min(1,(b||0)+.5*s))],"Stab detune":[8,['det'],(b,s)=>Math.max(0,Math.min(40,(b||0)+15*s))]};
 const apply=(k,w)=>{let sv=null;for(const tg in PN){const D=PN[tg];if(D[0]!==k)continue;const s=mv(tg,w);if(!s)continue;const P=TR[k].p;sv=sv||[];D[1].forEach(key=>{if(P[key]==null)return;sv.push([key,P[key]]);P[key]=D[2](P[key],s)})}return sv};
 const undo=(k,sv)=>{if(sv)for(let i=sv.length-1;i>=0;i--)TR[k].p[sv[i][0]]=sv[i][1]};
 const _f63=fire;fire=function(k,w){const sv=apply(k,w);try{_f63(k,w)}finally{undo(k,sv)}};
 const _p63=pad;pad=function(t,w,dur){const s=mv("Pad cutoff",w),P=TR[5].p,o=P.cut;if(s)P.cut=Math.max(120,Math.min(6000,o*Math.pow(2,1.8*s)));try{return _p63(t,w,dur)}finally{P.cut=o}};
 // continuous: tape wobble (delay-time warble → dubby pitch drift on the echoes) and shimmer amount
 setInterval(function lf63(){if(!ctx||!playing)return;const t=ctx.currentTime;
  if(!A.dwob&&A.dl){A.dwob=mkConst();A.dwob.offset.value=0;A.dwob.connect(A.dl.delayTime);A.dwob.start()}
  const[s1,d1]=mvd("Tape wobble",t+.03);if(A.dwob)A.dwob.offset.setTargetAtTime(d1>0?.009*s1:0,t,.04);
  const[s2,d2]=mvd("Shimmer",t+.03);if(d2>0){LF_ACT.Shimmer=1;A.sh.gain.setTargetAtTime(Math.max(0,(G.shim||0)+.9*s2),t,.03)}else if(LF_ACT.Shimmer){LF_ACT.Shimmer=0;A.sh.gain.setTargetAtTime(G.shim||0,t,.05)}},30);
 // rebuild the target menus
 document.querySelectorAll('#t-lfo select').forEach((s,i)=>{if(![...s.options].some(o=>o.value==='Lead cutoff'))return;const cur=s.value;s.innerHTML='';
  [["— Sound (per note) —",""],...NEWV.map(x=>[x,x]),["— Rhythm (per bar) —",""],...NEWR.map(x=>[x,x]),["— Master / FX (continuous) —",""],...NEWP.map(x=>[x,x])].forEach(o=>s.add(new Option(o[0],o[1])));s.value=OLD.has(cur)?'Lead cutoff':cur});
 const note=document.querySelector('#t-lfo .gnote');if(note)note.textContent='Depth 0 = off. Sound targets bend each note as it starts (pad: each chord); Rhythm targets add or remove hits once per bar around your setting; Master/FX targets move continuously. Tape wobble warbles the delay time for dubby pitch drift on the echoes. Sync rate is a full cycle. LFO 1 goes fast: dotted and triplet 16ths/32nds, or Free Hz up to 40 — on sound targets every note then gets its own value; on Master/FX targets it flutters (they update about 30× a second).'}
