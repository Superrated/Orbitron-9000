/* ---- v125: Mood finish — per-mood mastering polish: tilt EQ (sub / mud / presence / air), mono bass + side width, reverb tone + pre-delay, loudness trim. Cheap fixed nodes, click-free ramps, survives engine rebuilds ---- */
{const FIN={
  // hp: master high-pass Hz · sub: low shelf 70 Hz dB · mud: peak dB · mf: mud freq · pres: peak 3.2 kHz dB · air: high shelf 10 kHz dB · w: extra side width (side is high-passed at 120 Hz = mono bass) · rt: reverb return low-pass Hz · pre: reverb pre-delay ms · tr: level trim dB
  Dark:        {hp:28,sub:-1.5,mud:-.5,mf:320,pres:1.5,air:2.5,w:.25,rt:4500, pre:18,tr:-2.5},
  Melancholic: {hp:28,sub:-1,  mud:-.5,mf:300,pres:1.5,air:3,  w:.3, rt:6000, pre:25,tr:-.3},
  Dreamy:      {hp:28,sub:-.5, mud:-2, mf:350,pres:1,  air:4,  w:.4, rt:9500, pre:35,tr:.3},
  Tense:       {hp:32,sub:0,   mud:-1.5,mf:280,pres:2, air:1,  w:.2, rt:5000, pre:12,tr:-.5},
  Ethereal:    {hp:36,sub:-2.5,mud:-1, mf:300,pres:1.5,air:5,  w:.5, rt:11000,pre:45,tr:1.3},
  Hopeful:     {hp:28,sub:-1,  mud:-1.5,mf:320,pres:1.5,air:3.5,w:.35,rt:8500, pre:25,tr:-2.5},   /* v0.5: First Light calmer and ~1.5 dB down */
  Noir:        {hp:30,sub:-2,  mud:1,  mf:240,pres:1,  air:1.5,w:.2, rt:3500, pre:20,tr:0},
  Drone:       {hp:36,sub:-2.5,mud:-.5,mf:300,pres:1,  air:3,  w:.4, rt:6500, pre:30,tr:-2.5},   /* v0.5: Orbital Hum ~2 dB down */
  Acid:        {hp:30,sub:0,   mud:-1, mf:300,pres:.5, air:1,  w:.15,rt:5000, pre:8, tr:-.3},
  Power:       {hp:30,sub:0,   mud:-3,  mf:260,pres:1, air:2,  w:-.2,  rt:4000, pre:10,tr:-3},
  Italo:       {hp:28,sub:-.5, mud:-1, mf:350,pres:0,  air:1.5,w:.6, rt:9000, pre:20,tr:-.5},
  Breaks:      {hp:28,sub:0,   mud:0,  mf:300,pres:0,  air:-1, w:.6, rt:7000, pre:10,tr:-1.5},
  'Deep Space':{hp:28,sub:-.5, mud:0,  mf:300,pres:-1, air:3,  w:.45,rt:7000, pre:50,tr:4.5},
  Bleep:       {hp:30,sub:0,   mud:-1, mf:300,pres:1.5,air:3,  w:.5, rt:6000, pre:15,tr:.5},
  'Melodic House':{hp:28,sub:-.5,mud:-1,mf:320,pres:1.5,air:3,w:.4,rt:8000,pre:25,tr:-.5},
  'Distorted Electro':{hp:32,sub:0,mud:-1.5,mf:280,pres:1,air:1.5,w:.2,rt:5000,pre:10,tr:-1.5},
  Ambient:{hp:34,sub:-2,mud:-1.5,mf:320,pres:.5,air:4.5,w:.55,rt:11000,pre:50,tr:4.5},
  'Groove Techno':{hp:30,sub:-.5,mud:-2.5,mf:280,pres:1,air:1.5,w:.3,rt:4500,pre:12,tr:-1},
  Temporal:{hp:32,sub:-1,mud:-1.5,mf:300,pres:1.5,air:1,w:.2,rt:4000,pre:12,tr:-1.5},
  Vector:{hp:28,sub:-.5,mud:-1,mf:320,pres:1.5,air:3.5,w:.45,rt:8500,pre:25,tr:-.5}},
  OFF={hp:10,sub:0,mud:0,mf:300,pres:0,air:0,w:0,rt:20000,pre:0,tr:0,mono:0};
 G.fin=1;try{const v=localStorage.getItem('orb-fin');if(v!=null)G.fin=+v}catch(e){}
 window.MOODFIN=FIN;let F=null;
 function finBuild(){if(!ctx||!A.sg||!A.glue||!A.rO||!A.dk)return;if(F&&F.ctx===ctx)return;
  const bq=(ty,f,q,gn)=>{const b=ctx.createBiquadFilter();b.type=ty;b.frequency.value=f;if(q!=null)b.Q.value=q;if(gn!=null)b.gain.value=gn;return b},gn=v=>{const g=ctx.createGain();g.gain.value=v;return g};
  const hp=bq('highpass',10,.6),sub=bq('lowshelf',70,null,0),mud=bq('peaking',300,1,0),pres=bq('peaking',3200,.8,0),air=bq('highshelf',10000,null,0),tr=gn(1);
  const sp=ctx.createChannelSplitter(2),mg=ctx.createChannelMerger(2),M=gn(1),S=gn(1),mL=gn(.5),mR=gn(.5),sL=gn(.5),sR=gn(-.5),sh=bq('highpass',120,.7),sh2=bq('highpass',120,.7),ga=gn(1),gb=gn(0),X=gn(1),Xn=gn(-1),L=gn(1),Rr=gn(1);
  try{A.sg.disconnect(A.glue)}catch(e){}
  {const ti=gn(.5),tp=ctx.createWaveShaper(),to=gn(2);tp.oversample='none';A.tape=tp;window.tapeSet&&tapeSet();A.sg.connect(ti);ti.connect(tp);tp.connect(to);to.connect(tr)} // v0.22 analog glue: gentle tape curve
  hp.connect(sub);sub.connect(mud);mud.connect(pres);pres.connect(air);air.connect(tr); /* v0.33: the tone EQ and width moved into the merged mastering EQ (see MASTERING) */
  sp.connect(mL,0);sp.connect(mR,1);mL.connect(M);mR.connect(M);sp.connect(sL,0);sp.connect(sR,1);sL.connect(S);sR.connect(S);
  S.connect(ga);ga.connect(X);S.connect(sh);sh.connect(sh2);sh2.connect(gb);gb.connect(X);X.connect(Xn);
  M.connect(L);X.connect(L);M.connect(Rr);Xn.connect(Rr);L.connect(mg,0,0);Rr.connect(mg,0,1);A.pre=ctx.createGain();tr.connect(A.pre);A.pre.connect(A.glue);
  const pd=ctx.createDelay(.2),rl=bq('lowpass',20000,.5);try{A.rO.disconnect(A.dk)}catch(e){}A.rO.connect(pd);pd.connect(rl);rl.connect(A.dk);
  F={ctx,hp,sub,mud,pres,air,tr,ga,gb,pd,rl};apply(1)}
 function apply(now){if(!F||F.ctx!==ctx)return;const c=G.fin?Object.assign({mono:1},FIN[curMood]||{hp:28,sub:0,mud:0,mf:300,pres:.5,air:1.5,w:.25,rt:7000,pre:20,tr:0}):OFF,t=ctx.currentTime,k=now?.005:.12,
   z=(pm,v)=>{pm.cancelScheduledValues(t);pm.setTargetAtTime(v,t,k)};
  z(F.hp.frequency,c.hp);z(F.sub.gain,c.sub);z(F.mud.gain,c.mud);z(F.mud.frequency,c.mf);z(F.pres.gain,c.pres);z(F.air.gain,c.air);z(F.tr.gain,Math.pow(10,c.tr/20));
  const mo=c.mono?1:0;z(F.ga.gain,1-mo);z(F.gb.gain,mo*(1+c.w+(G.space||0)*.35));z(F.rl.frequency,c.rt);F.pd.delayTime.cancelScheduledValues(t);F.pd.delayTime.setTargetAtTime((G.fin?Math.max(12,Math.min(35,60000/(G.bpm||124)/16)):c.pre)/1000,t,now?.005:.4)}window.finApply=apply;
 window.moodFinish={apply:()=>apply(0),cfg:()=>G.fin?FIN[curMood]:OFF,ok:()=>!!F&&F.ctx===ctx};
 const _in=init;init=function(){const r=_in.apply(this,arguments);try{finBuild()}catch(e){console.warn('finish',e)}return r};
 const _gf=generate;generate=function(){const r=_gf.apply(this,arguments);try{apply(0)}catch(e){}return r};
 const mp=document.querySelector('#t-mix .panel');if(mp){const b=document.createElement('button');b.className='finb';
  const lab=()=>{const h=G.fin?'✦ Mood finish <b>ON</b> · '+MN(curMood):'✧ Mood finish <b>OFF</b> · raw mix';if(b.innerHTML!==h)b.innerHTML=h;b.classList.toggle('on',!!G.fin)};lab();UI.on(lab);
  b.title='Per-mood mastering polish: tone shaping, mono bass, stereo width, reverb colour and level matching. Tap to compare with the raw mix.';
  b.onclick=()=>{G.fin=G.fin?0:1;try{localStorage.setItem('orb-fin',G.fin)}catch(e){}apply(0);lab()};mp.querySelector('h2').after(b);
  const st=document.createElement('style');st.textContent='.finb{display:block;width:100%;min-height:42px;margin:0 0 10px;border:1px solid rgba(0,255,156,.35);border-radius:10px;background:transparent;color:inherit;font:inherit;cursor:pointer;opacity:.75}.finb.on{opacity:1;border-color:var(--acc,#ffe44d);box-shadow:0 0 8px rgba(255,228,77,.3)}.finb b{color:var(--acc,#ffe44d)}';document.head.appendChild(st)}}

