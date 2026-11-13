
/* ---- v0.78: two Flight faders in a row under LEAD and BASS — TENSION and PULSE (they replace DRUMS and FX, which bent too little to be
   worth a fader). One works on the harmony, the other on the rhythm, so together they build and release: TENSE + DOUBLE into a drop,
   CALM + HALF for a breather. Both stay where you leave them; double-tap or a Launch = back to AS SET. Your own settings are never
   changed: notes are only bent while they are made.
   TENSION · CALM ↔ TENSE. Right, in three steps: thirds are suspended to fourths, then fifths rise to sixths, then even the root gives
           way to the seventh below — lead, pad, stab and Satellite; the bass keeps the ground, so you hear the pull against it.
           Resonance on lead and bass rises with it and a thin, high suspended tone swells in. Left: passing notes settle on chord
           notes, then everything rests on root and fifth; resonance comes down. Always in the key.
           v0.85: more dramatic to the right — the three harmony steps arrive sooner (15 / 40 / 70 %), resonance rises twice as far
           (lead, bass, and now the stab too), lead and stab swell into more reverb and echo, and the suspended tone is about 3× louder.
   PULSE   · HALF ↔ DOUBLE. Right: hats, perc, lead and stab get a second, softer note half a step later — first on the pick-up before
           each beat, then on every off-step, then on every note.
           v0.85: PULSE works on lead and stab only (drums and bass stay as set); the extra notes on the right are sparkles — an octave
           up and brighter, growing from one note into a quick rising run of 2, 3, then 4 notes as you push further right.
           v0.87: the right side ratchets instead — each lead/stab note struck 2× (DOUBLE), 3× (TRIP), 4× (QUAD) inside its step,
           and at FULL TILT the last note rolls on every 16th between notes.
           v0.86: on the left the notes keep their own length (no longer held longer); only fewer of them play. Left: half-time — hats, perc, lead, bass and stab lose every fourth
           note, then every second one (the hats thin once more at the end); lead and bass notes are held longer. The kick, clap and snare are never touched. ---- */
{const lst=[...document.querySelectorAll('style')].find(t=>t.textContent.includes('.lmx .lmt'));
 if(lst){const st=document.createElement('style');st.textContent=lst.textContent.replace(/\.lmx/g,'.xmx')+'.mxrow>.xmx{margin:0;min-width:0}@media (max-width:640px) and (max-height:780px){.mxrow>.xmx{position:relative}}@media (min-width:900px){body.flw #t-perf>.mxp.xmp{grid-column:5/7;grid-row:4}}#t-perf .mxrow .lmt{height:32px!important}#t-perf .mxp{padding-top:6px!important;padding-bottom:7px!important}#t-perf .mxrow .lmh{margin-bottom:4px!important}'   /* v0.77: the wide-screen placement applied on phones too — it stretched the 3-column grid to 6 and the riser and breakdown pads collapsed to nothing. It is behind the wide-screen condition now. All six faders are a touch lower (32 px, were 38–44) so the extra row costs less room. */;document.head.appendChild(st)}
 const mk=(o)=>{const F={x:0,raf:0,el:null};let last=null;
  const show=()=>{const el=F.el;if(!el)return;const x=F.x;if(last!==null&&Math.abs(x-last)<.002)return;last=x;const k=el.querySelector('.lmk'),f=el.querySelector('.lmf'),b=el.querySelector('b');
   k.style.left=((x+1)/2*100)+'%';f.style.left=(x<0?(x+1)/2*100:50)+'%';f.style.width=(Math.abs(x)/2*100)+'%';b.textContent=Math.abs(x)<.01?'AS SET':o.lab?o.lab(x):(x<0?o.l:o.r)+' '+Math.round(Math.abs(x)*100)+'%';if(o.on)try{o.on(x)}catch(e){}};
  F.build=row=>{const el=F.el=document.createElement('div');el.className='xmx '+o.cls;
   el.innerHTML='<div class="lmh"><span>'+o.name+'</span><small>'+o.hint+'</small><b>AS SET</b></div><div class="lmt" title="'+o.title+'"><div class="lmc"></div><div class="lmf"></div><div class="lmk"></div><i style="left:4px">'+o.l+'</i><i style="right:4px">'+o.r+'</i></div>';
   row.appendChild(el);const tr=el.querySelector('.lmt');let on=0,tg=0,lt=0,lt2=0;
   const sm=t=>{const dt=Math.min(50,t-(lt||t));lt=t;F.x+=(tg-F.x)*(1-Math.exp(-dt/70));if(Math.abs(tg-F.x)<.002)F.x=tg;show();if(on||F.x!==tg)F.raf=requestAnimationFrame(sm);else F.raf=0};
   const at=e=>{const r=tr.getBoundingClientRect();tg=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width)*2-1));if(Math.abs(tg)<.06)tg=0};
   tr.addEventListener('pointerdown',e=>{e.preventDefault();cancelAnimationFrame(F.raf);try{window.orbWake&&orbWake()}catch(_){}tr.setPointerCapture(e.pointerId);on=1;at(e);lt=0;F.raf=requestAnimationFrame(sm)});
   tr.addEventListener('pointermove',e=>{if(on)at(e)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tr.addEventListener(ev,()=>{on=0}));
   tr.addEventListener('pointerup',()=>{const n=performance.now();if(n-lt2<300){tg=0;lt=0;cancelAnimationFrame(F.raf);F.raf=requestAnimationFrame(sm)}lt2=n});show()};
  F.set=v=>{F.x=Math.max(-1,Math.min(1,v));last=null;show()};return F};
 const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 // ---- TENSION: calm ↔ tense
 /* note map: for every degree of the scale, how many scale steps it moves at the current level (-2 … 3). Rebuilt only when the level or the scale changes. */
 const TN={lv:0,on:0,sc:null,ml:0,map:new Int8Array(16),tone:null,off:0};
 const near=(s,n,i,ok)=>{for(const o of [-1,1,-2,2,-3,3]){const j=((i+o)%n+n)%n;if(ok(s[j]%12))return o}return 0};
 const remap=()=>{const s=SC[G.scale]||[0],n=Math.min(16,s.length),L=TN.lv,m=TN.map;TN.sc=G.scale;TN.ml=L;
  for(let i=0;i<n;i++){const v=((s[i]%12)+12)%12,root=v===0,fifth=v===7,third=v===3||v===4;let o=0;
   if(L===-1){if(!root&&!fifth&&!third)o=near(s,n,i,x=>x===0||x===7||x===3||x===4)}
   else if(L===-2){if(!root&&!fifth)o=near(s,n,i,x=>x===0||x===7)}
   else if(L>0){if(third)o=1;else if(fifth&&L>1)o=1;else if(root&&L>2)o=-1}
   m[i]=o}};
 {const _d=d2f;d2f=function(d,o){if(TN.on&&TN.lv&&d===Math.floor(d)){if(TN.sc!==G.scale||TN.ml!==TN.lv)remap();const n=SC[G.scale].length;if(n<=16)d+=TN.map[((d%n)+n)%n]}return _d(d,o)}}
 {const _p=pad;pad=function(){if(!TN.lv)return _p.apply(this,arguments);const o=TN.on;TN.on=1;try{return _p.apply(this,arguments)}finally{TN.on=o}}}
 /* the suspended tone: two quiet sines (seventh and ninth of the key, high up) into the reverb; made when the fader first goes right, stopped when it is back */
 const toneF=()=>{const s=SC[G.scale]||[0,2],n=s.length,b=440*Math.pow(2,(72+G.root-69)/12);return [b*Math.pow(2,s[n-1]/12),b*Math.pow(2,(12+s[Math.min(1,n-1)])/12)]};
 const tone=x=>{if(!ctx||!A.m||A.m.context!==ctx)return;let T=TN.tone;if(T&&T.ctx!==ctx)T=TN.tone=null;const t=ctx.currentTime;
  if(x<=.01){if(T){T.g.gain.setTargetAtTime(0,t,.15);clearTimeout(TN.off);TN.off=setTimeout(()=>{const Z=TN.tone;if(!Z||TN.x>.01)return;TN.tone=null;try{Z.a.stop();Z.b.stop();Z.g.disconnect()}catch(e){}},1500)}return}
  if(!T){const g=ctx.createGain(),a=ctx.createOscillator(),b=ctx.createOscillator(),gb=ctx.createGain();g.gain.value=0;gb.gain.value=.6;a.type=b.type='sine';a.connect(g);b.connect(gb);gb.connect(g);g.connect(A.m);if(A.rI){const r=ctx.createGain();r.gain.value=1.5;g.connect(r);r.connect(A.rI)}
   a.start();b.start();T=TN.tone={ctx,g,a,b,r:-1,s:null}}
  if(T.r!==G.root||T.s!==G.scale){T.r=G.root;T.s=G.scale;const f=toneF();T.a.frequency.setTargetAtTime(f[0],t,.05);T.b.frequency.setTargetAtTime(f[1],t,.05)}
  T.g.gain.setTargetAtTime(.035*x*x,t,.08)};
 const tens=x=>{TN.x=x;TN.lv=x>.7?3:x>.4?2:x>.15?1:x<-.7?-2:x<-.3?-1:0;try{tone(x)}catch(e){}};
 const TE=mk({cls:'tnm',name:'TENSION',hint:'harmony · resonance',l:'CALM',r:'TENSE',title:'Drag right to pull the harmony tight: thirds hang on fourths, then fifths rise, then the root gives way, with rising resonance and a high suspended tone. Drag left and everything settles on root and fifth. Lead and stab also wash out into more reverb and echo. Always in the key. It stays where you leave it; double-tap to go back to AS SET.',on:tens});
 UI.onBeat(()=>{try{if(TN.tone&&TE.x>.01)tone(TE.x)}catch(e){}});   /* the tone follows a key change (Lift, a new root) */
 // ---- PULSE: half ↔ double
 const PU=mk({cls:'plm',name:'PULSE',hint:'lead · stab',l:'SPARKLE',r:'FULL TILT',lab:x=>x<0?'SPARKLE '+Math.round(-x*100)+'%':x>.75?'FULL TILT':x>.5?'QUAD':x>.25?'TRIP':x>.05?'DOUBLE':'AS SET',title:'Drag right to ratchet lead and stab: every note is struck 2×, then 3×, then 4× inside its step; at FULL TILT the last note keeps rolling between notes. Drag left for a continuous sparkle: a steady shimmer of quiet lead sparkles walks up and down the chord between your notes, from 8ths to every 16th. Drums and bass are never touched. It stays where you leave it; double-tap to go back to AS SET.'});
 const ONE=[0],SPK=[0,2,4,7,4,2];let SPD=0,spn=0;const spLN=function(){return SPD};
 /* v0.87: PULSE right = ratchets. How many strikes per step: DOUBLE 2 · TRIP 3 · QUAD 4 · FULL TILT 4 plus a non-stop roll between notes.
    CPU: 2 at most when the device is busy (QOS 2), none under overload (QOS 3). */
 const rN=(a,q)=>q>=3?1:Math.min(q>=2?2:4,a>.5?4:a>.25?3:2);
 {const _f=fire;
  /* the same note struck again: the lead keeps its last note (normal and acid engines), the stab its chord; a little softer each time */
  const rat=(k,w,n,i0)=>{const T=TR[k],lv=T.lv,d=lastDeg,ln=leadNote,an=acidNote,sd=sdur();
   try{if(k===4){SPD=d;leadNote=spLN;acidNote=spLN}for(let i=i0;i<n;i++){T.lv=lv*(1-.12*i);_f.call(null,k,w+i*sd/n)}}
   finally{T.lv=lv;leadNote=ln;acidNote=an;lastDeg=d}};
  fire=function(k,w){const tx=TE.x,px=PU.x,mel=k===4||k===8||k===9;
   if(!((tx>.01||tx<-.01)&&(mel||k===6))&&!(px>.01&&(k===4||k===8)))return _f.apply(this,arguments);
   const T=TR[k],P=T.p,s=((tk%16)+16)%16,a=px<0?-px:px;let rc=1,o1,o2,o3,o0=TN.on;
   if(px>.05&&(k===4||k===8))rc=rN(px,typeof QOS!=='undefined'?QOS.lvl:0);
   o1=P.res;o2=P.dec;o3=P.hold;const o4=P.rs,o5=P.ds,o6=P.cut,oc=G.oct,lv=T.lv;
   try{if((k===4||k===6||k===8)&&P.res!=null&&(tx>.01||tx<-.01))P.res=tx>0?P.res+(k===4?10:k===8?8:6)*tx*tx:P.res*(1+.6*tx);
    if(tx>.01&&(k===4||k===8)){if(P.rs!=null)P.rs=cl(P.rs+.35*tx*tx,0,1);if(P.ds!=null)P.ds=cl(P.ds+.3*tx*tx,0,1)}
    if(mel)TN.on=1;
    const r=_f.apply(this,arguments);
    if(rc>1)rat(k,w,rc,1);
    return r}
   finally{TN.on=o0;T.lv=lv;if(o1===undefined)delete P.res;else P.res=o1;if(o2===undefined)delete P.dec;else P.dec=o2;if(o3===undefined)delete P.hold;else P.hold=o3;if(o4===undefined)delete P.rs;else P.rs=o4;if(o5===undefined)delete P.ds;else P.ds=o5;if(o6===undefined)delete P.cut;else P.cut=o6;G.oct=oc}}
  /* v0.86: PULSE left = continuous sparkle. Between the normal notes a steady shimmer of quiet lead sparkles (an octave up, brighter,
     a little more reverb and echo) walks up and down the chord: 8ths, then every other 16th, then every 16th at full; at full the stab adds a
     sparkle on the last 16th of each beat. CPU: one lead voice per step at most, no sparkle where the lead already plays, 8ths at most
     when the device is busy (QOS 2), none under overload (QOS 3). */
  const spark=(k,w,deg,lvm)=>{const T=TR[k],P=T.p,lv=T.lv,oc=G.oct,c0=P.cut,r0=P.rs,d0=P.ds,ln=leadNote,d=lastDeg,cn=cur.n;
   try{T.lv=lv*lvm;if(c0!=null)P.cut=cl(c0*1.5,40,16000);if(r0!=null)P.rs=cl(r0+.25,0,1);if(d0!=null)P.ds=cl(d0+.2,0,1);G.oct=(oc||0)+1;
    if(k===4){SPD=d+deg;leadNote=spLN}else{ONE[0]=cn[deg%(cn.length||1)];cur.n=ONE}
    _f.call(null,k,w)}
   finally{T.lv=lv;G.oct=oc;if(c0===undefined)delete P.cut;else P.cut=c0;if(r0===undefined)delete P.rs;else P.rs=r0;if(d0===undefined)delete P.ds;else P.ds=d0;leadNote=ln;lastDeg=d;cur.n=cn}};
  const _as=arrStep;arrStep=function(w){const r=_as.apply(this,arguments);const px=PU.x;
   if(px>.75){try{const q=typeof QOS!=='undefined'?QOS.lvl:0;   /* v0.87 FULL: a non-stop roll of the last note on steps without a note (lead 4×, stab 2×; busy: lead 2×, no stab) */
    if(q<3){const L=TR[4],S=TR[8];if(!L.m&&!(L.pt&&L.pt[tk%L.st]))rat(4,w,q>=2?2:4,0);if(q<2&&!S.m&&!(S.pt&&S.pt[tk%S.st]))rat(8,w,2,0)}}catch(e){}}
   else if(px<-.1){try{const a=-px,q=typeof QOS!=='undefined'?QOS.lvl:0,s=((tk%16)+16)%16;
    if(q<3){const ev=(a>.75&&q<2)?1:a>.4?s%2===1:s%4===2,L=TR[4],S=TR[8];
     if(ev&&!L.m&&!(L.pt&&L.pt[tk%L.st]))spark(4,w,SPK[spn++%6],.45);
     if(a>.75&&q<2&&s%4===3&&!S.m&&!(S.pt&&S.pt[tk%S.st]))spark(8,w,spn,.4)}}catch(e){}}
   return r}}
 const add=()=>{if(document.querySelector('#t-perf .xmx'))return;const b=document.querySelector('#t-perf .bmx:not(.tha)'),pn0=b&&b.closest('.panel');if(!pn0)return;
  const pn=document.createElement('div');pn.className='panel mxp xmp';const row=document.createElement('div');row.className='mxrow';pn.appendChild(row);pn0.after(pn);TE.build(row);PU.build(row)};
 add();UI.on(()=>{try{add()}catch(e){}});window.orbFlightTension=TE;window.orbFlightPulse=PU;
 {const _g=generate;generate=function(){try{if(TE.x)TE.set(0);if(PU.x)PU.set(0)}catch(e){}return _g.apply(this,arguments)}}   /* a Launch puts them back to AS SET, like LOW-PASS, LEAD and BASS */}
