
/* ---- v0.22: more useful LFO targets + polymeters on Launch.
   · weak targets scaled up so a given Depth sounds about equally strong everywhere (resonance, detune, glide, decays, hat tone)
   · new Sound targets: Lead drive, Bass drive, Perc decay, Perc octave, Clap tone (drums they touch play live instead of from the cache)
   · new Rhythm targets: Perc / Hat / Lead / Stab hits — once per bar the LFO adds or removes hits around your setting (up to ±60 %); depth 0 puts it back
   · Launch: most launches give 1–2 of perc, lead, hats, stab a polymetric ring (12, 14, 7, 11 …) or Rotate drift (4/8/16 bars); kick, clap and bass stay on 16.
     About 1 launch in 3 also puts a Rhythm or Sound target on the slow LFO (LFO 3). ---- */
{const SC={'Lead resonance':2,'Bass resonance':2,'Lead detune':1.7,'Hat tone':1.3,'Lead decay':1.3,'Bass decay':1.3,'Lead glide':1.5};
 const _mv=mv;mv=function(tg,t){const s=_mv.apply(this,arguments);return s&&SC[tg]?s*SC[tg]:s};
 const _mvd=mvd;mvd=function(tg,t){const r=_mvd.apply(this,arguments);if(r&&SC[tg])r[0]*=SC[tg];return r};
 const NC={'Perc decay':3,'Perc octave':3,'Clap tone':2};window.LFNC=new Set();
 UI.on(()=>{const s=new Set();LFOS.forEach(L=>{if(L.d>0&&NC[L.tg]!=null)s.add(NC[L.tg])});window.LFNC=s});
 // Rhythm: hits per bar
 const RH={'Perc hits':3,'Hat hits':1,'Lead hits':4,'Stab hits':8};let HB={};
 const redraw=T=>{try{draw(T,-1)}catch(e){}};
 const step=t=>{const act={};LFOS.forEach(L=>{const k=RH[L.tg];if(k!=null&&L.d>0)act[k]=(act[k]||0)+L.d*lfV(L,t)});
  Object.values(RH).forEach(k=>{const T=TR[k];if(!T)return;let H=HB[k];
   if(act[k]==null){if(H){if(T.h===H.a){T.h=H.b;T.pt=pat(T);redraw(T)}delete HB[k]}return}
   if(!H||T.h!==H.a)H=HB[k]={b:T.h,a:T.h};const v=Math.max(-1,Math.min(1,act[k])),span=Math.max(1,Math.round(H.b*.6)),
    h=Math.max(1,Math.min(T.st,H.b+Math.round(v*span)));if(h!==T.h){T.h=h;T.pt=pat(T);redraw(T)}H.a=T.h})};
 const _as=arrStep;arrStep=function(w){const r=_as.apply(this,arguments);try{if(playing&&((tk%16)+16)%16===0)step(w)}catch(e){}return r};
 // Launch: polymeters / drift + sometimes a new LFO target
 const POLY={3:[12,14,10,7,11,13],4:[12,14,7,11,13],1:[12,14,15],8:[12,14,10]};
 const _g=generate;generate=function(){HB={};const r=_g.apply(this,arguments);try{
   const cand=[3,4,1,8].filter(k=>{const T=TR[k];return T&&!T.m&&!T.pad&&!(k===4&&(T.p.mode==='Acid 303'||T.p.mode==='Riff'))&&!(k===1&&window.rigidHats&&rigidHats.on())});
   if(R()<.95){let have=cand.filter(k=>TR[k].st!==16||(TR[k].p.rdr||0)>0).length;const want=pick([1,2,2,2,3]);   /* v0.33: slightly more polyrhythm and drift */
    const pool=cand.filter(k=>TR[k].st===16&&!((TR[k].p.rdr||0)>0)).sort(()=>R()-.5);
    while(have<want&&pool.length){const k=pool.shift(),T=TR[k];
     if(R()<.6){const st=pick(POLY[k]);T.h=Math.max(1,Math.min(st-1,Math.round(T.h*st/16)||1));T.st=st;T.r=Math.floor(R()*st);T.pt=pat(T)}
     else T.p.rdr=pick([4,8,16]);have++}}
   const L=LFOS[2];if(L&&!(L.d>0)&&R()<.35){const on=k=>TR[k]&&!TR[k].m;
    const rh=['Perc hits','Hat hits','Lead hits'].filter(n=>on(RH[n])),so=[['Lead drive',4],['Bass drive',6],['Perc decay',3],['Clap tone',2],['Perc octave',3]].filter(x=>on(x[1])).map(x=>x[0]);
    const useR=rh.length&&(R()<.5||!so.length),tg=useR?pick(rh):so.length?pick(so):null;
    if(tg)Object.assign(L,{tg,sh:pick([0,1]),sync:1,div:useR?pick([32,64]):pick([8,16,32]),d:+(useR?.5+R()*.3:.3+R()*.3).toFixed(2),ph:0})}
  }catch(e){console.warn('[orbitron] poly',e)}
  setTimeout(()=>{try{window.syncFaders&&syncFaders();if(typeof lfoUI==='function')lfoUI()}catch(e){}},0);return r}}
