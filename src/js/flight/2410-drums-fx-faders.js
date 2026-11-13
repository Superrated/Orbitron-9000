
/* ---- v0.75: two more Flight faders, in a row under LEAD and BASS. Both stay where you leave them; double-tap or a Launch = back to AS SET.
   DRUMS · TIGHT ↔ WILD. Left: shorter, closed hats and shorter toms, ghosts and bar-to-bar variation fade out. Right: longer, opening hats,
           longer toms with more pitch bend, ghost notes and variation come in on hats, perc, snare and clap, accents deepen. The kick is
           never touched. Only bends the settings while a hit is made — your own values stay as they are.
   FX    · DRY ↔ WASH. Left: echo, reverb and shimmer pull back to nothing. Right: more echo with longer feedback, more reverb and shimmer —
           a wash to throw over a transition. Moves the four FX levels together; the Mix faders keep their values.
   v0.8: DRUMS · RATCHETS — past ~55 % WILD, hats and perc sometimes fire 2 quick hits (1/32) or 3 (a triplet, near the end) instead of
           one, a bit quieter, more often the further you go. Same pre-rendered sounds, so almost no extra CPU.
         FX · DUB THROW — flick the FX fader to the right and let go: the echo catches that moment and keeps ringing (long feedback) for
           about two bars while the dry groove carries on, then it settles back. The fader returns to where it was.
         FX · FREEZE — the last 10 % of WASH freezes the reverb into an endless pad (a long feedback loop fed from the reverb, closed off
           once full); pull back below 88 % and it fades out over a few seconds. Built only the first time you use it. ---- */
{const lst=[...document.querySelectorAll('style')].find(t=>t.textContent.includes('.lmx .lmt'));
 if(lst){const st=document.createElement('style');st.textContent=lst.textContent.replace(/\.lmx/g,'.xmx')+'.mxrow>.xmx{margin:0;min-width:0}@media (max-width:640px) and (max-height:780px){.mxrow>.xmx{position:relative}}@media (min-width:900px){body.flw #t-perf>.mxp.xmp{grid-column:1/7;grid-row:5}}#t-perf .mxrow .lmt{height:32px!important}#t-perf .mxp{padding-top:6px!important;padding-bottom:7px!important}#t-perf .mxrow .lmh{margin-bottom:4px!important}'   /* v0.77: the wide-screen placement applied on phones too — it stretched the 3-column grid to 6 and the riser and breakdown pads collapsed to nothing. It is behind the wide-screen condition now. All six faders are a touch lower (32 px, were 38–44) so the extra row costs less room. */;document.head.appendChild(st)}
 const mk=(o)=>{const F={x:0,raf:0,el:null};let last=null;
  const show=()=>{const el=F.el;if(!el)return;const x=F.x;if(last!==null&&Math.abs(x-last)<.002)return;last=x;const k=el.querySelector('.lmk'),f=el.querySelector('.lmf'),b=el.querySelector('b');
   k.style.left=((x+1)/2*100)+'%';f.style.left=(x<0?(x+1)/2*100:50)+'%';f.style.width=(Math.abs(x)/2*100)+'%';b.textContent=F.tag||(Math.abs(x)<.01?'AS SET':(o.lab&&o.lab(x))||(x<0?o.l:o.r)+' '+Math.round(Math.abs(x)*100)+'%');if(o.on)try{o.on(x)}catch(e){}};
  F.build=row=>{const el=F.el=document.createElement('div');el.className='xmx '+o.cls;
   el.innerHTML='<div class="lmh"><span>'+o.name+'</span><small>'+o.hint+'</small><b>AS SET</b></div><div class="lmt" title="'+o.title+'"><div class="lmc"></div><div class="lmf"></div><div class="lmk"></div><i style="left:4px">'+o.l+'</i><i style="right:4px">'+o.r+'</i></div>';
   row.appendChild(el);const tr=el.querySelector('.lmt');let on=0,tg=0,lt=0,lt2=0;
   const sm=t=>{const dt=Math.min(50,t-(lt||t));lt=t;F.x+=(tg-F.x)*(1-Math.exp(-dt/70));if(Math.abs(tg-F.x)<.002)F.x=tg;show();if(on||F.x!==tg)F.raf=requestAnimationFrame(sm);else F.raf=0};
   const at=e=>{const r=tr.getBoundingClientRect();tg=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width)*2-1));if(Math.abs(tg)<.06)tg=0};
   let fd=null;tr.addEventListener('pointerdown',e=>{e.preventDefault();fd={t:performance.now(),px:e.clientX,x:F.x};cancelAnimationFrame(F.raf);try{window.orbWake&&orbWake()}catch(_){}tr.setPointerCapture(e.pointerId);on=1;at(e);lt=0;F.raf=requestAnimationFrame(sm)});
   tr.addEventListener('pointermove',e=>{if(on)at(e)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tr.addEventListener(ev,()=>{on=0}));
   tr.addEventListener('pointerup',e=>{const n=performance.now();if(n-lt2<300){tg=0;lt=0;cancelAnimationFrame(F.raf);F.raf=requestAnimationFrame(sm)}lt2=n;
    /* v0.8 flick: a quick swipe to the right (< 0.3 s, > 40 px) fires o.flick and the knob goes back to where it was */
    if(o.flick&&fd&&n-fd.t<300&&e.clientX-fd.px>40){tg=fd.x;lt=0;lt2=0;cancelAnimationFrame(F.raf);F.raf=requestAnimationFrame(sm);try{o.flick()}catch(_){}}fd=null});show()};
  F.set=v=>{F.x=Math.max(-1,Math.min(1,v));last=null;show()};return F};
 // ---- FX: dry ↔ wash
 const fx=x=>{if(!ctx||!A.dO||A.dO.context!==ctx)return;const t=ctx.currentTime,z=(p,v)=>{try{p.setTargetAtTime(v,t,.06)}catch(e){}},d=G.dly||0,f=G.fb||0,r=G.rev||0,s=G.shim||0;
  if(x<0){z(A.dO.gain,d*(1+x));z(A.dF.gain,f*(1+.5*x));z(A.rO.gain,r*(1+.9*x));z(A.sh.gain,s*(1+x))}
  else{z(A.dO.gain,Math.min(.7,d+.28*x));z(A.dF.gain,Math.min(.8,f+(.8-Math.min(.8,f))*.8*x*x));z(A.rO.gain,Math.min(1,r+.3*x));z(A.sh.gain,Math.min(1.4,s+.35*x))}};   /* refined: at full WASH the old amounts piled up in the compressor and the whole mix dropped 4–5 dB and pumped. Less of each, and the long feedback only arrives in the last part of the travel */
 /* v0.8 FREEZE: a ping-pong feedback loop (two long delays, filtered) fed from the reverb output. Engage: open the input ~1.2 s, then
    close it and hold the loop at 0.985 feedback = an endless pad. Release: fade out, then disconnect everything (no idle CPU). */
 const FZ={on:0,n:null,tm:0};
 const frz=on=>{if(!ctx||!A.rO||A.rO.context!==ctx||on===FZ.on)return;FZ.on=on;const t=ctx.currentTime;
  if(on){if(FZ.n)try{FZ.n.kill()}catch(e){}const g=v=>{const n=ctx.createGain();n.gain.value=v;return n},inG=g(0),out=g(0),fa=g(0),fb=g(0),dA=ctx.createDelay(3),dB=ctx.createDelay(3),
    f=(ty,hz)=>{const b=ctx.createBiquadFilter();b.type=ty;b.frequency.value=hz;b.Q.value=.5;return b},la=f('lowpass',4200),lb=f('lowpass',3800),ha=f('highpass',140),hb=f('highpass',160),pL=ctx.createStereoPanner(),pR=ctx.createStereoPanner();
   dA.delayTime.value=1.37;dB.delayTime.value=1.91;pL.pan.value=-.6;pR.pan.value=.6;
   A.rO.connect(inG);inG.connect(dA);dA.connect(la);la.connect(ha);ha.connect(fa);fa.connect(dB);dB.connect(lb);lb.connect(hb);hb.connect(fb);fb.connect(dA);ha.connect(pL);hb.connect(pR);pL.connect(out);pR.connect(out);out.connect(A.dk);
   inG.gain.setTargetAtTime(1,t,.05);inG.gain.setTargetAtTime(0,t+1.2,.25);[fa,fb].forEach(x=>{x.gain.setTargetAtTime(.985,t,.3)});out.gain.setTargetAtTime(.85,t,.4);
   const all=[inG,out,fa,fb,dA,dB,la,lb,ha,hb,pL,pR];FZ.n={out,fa,fb,inG,kill:()=>{try{A.rO.disconnect(inG)}catch(e){}all.forEach(x=>{try{x.disconnect()}catch(e){}})}}}
  else if(FZ.n){const n=FZ.n;FZ.n=null;n.inG.gain.setTargetAtTime(0,t,.05);n.out.gain.setTargetAtTime(0,t,.9);[n.fa,n.fb].forEach(x=>x.gain.setTargetAtTime(.4,t+.5,.6));setTimeout(()=>{try{n.kill()}catch(e){}},5500)}};
 /* v0.8 DUB THROW: the echo input opens wide for one beat and the feedback goes long, then the input closes and the echo rings out for
    about two bars before the FX fader's own values come back */
 let thr=0;const throwFX=()=>{if(!ctx||!A.dI||A.dI.context!==ctx)return;const t=ctx.currentTime,b=60/G.bpm,z=(p,v,at,tc)=>{p.setTargetAtTime(v,at,tc)};
  [A.dI.gain,A.dF.gain,A.dO.gain].forEach(p=>{try{p.cancelScheduledValues(t)}catch(e){}});z(A.dI.gain,2.6,t,.01);z(A.dI.gain,1,t+b,.05);z(A.dF.gain,.84,t,.03);z(A.dO.gain,Math.max(G.dly||0,.6),t,.03);
  FX.tag='THROW';FX.set(FX.x);clearTimeout(thr);thr=setTimeout(()=>{FX.tag=null;FX.set(FX.x);try{fx(FX.x)}catch(e){}},b*8*1000)};
 const FX=mk({cls:'fxm',name:'FX',hint:'echo · reverb · shimmer',l:'DRY',r:'WASH',lab:x=>x>.9?'FREEZE':null,flick:()=>throwFX(),title:'Drag left to dry the mix out; right for more echo, reverb and shimmer — the last 10 % freezes the reverb into an endless pad. Flick right and let go for a dub throw. It stays where you leave it; double-tap to go back to AS SET.',on:x=>{if(!FX||!FX.tag)fx(x);if(x>.9){if(!FZ.on&&!FZ.tm)FZ.tm=setTimeout(()=>{FZ.tm=0;if(FX.x>.9&&!FX.tag)frz(1)},350)}else if(x<.88){clearTimeout(FZ.tm);FZ.tm=0;frz(0)}}});   /* freeze only after 0.35 s above 90 %, so a flick (dub throw) never freezes */
 {const _fx=applyFX;applyFX=function(){const r=_fx.apply(this,arguments);if(Math.abs(FX.x)>.01)try{fx(FX.x)}catch(e){}return r}}
 // ---- DRUMS: tight ↔ wild
 const DR=mk({cls:'drm',name:'DRUMS',hint:'hats · toms · ghosts',l:'TIGHT',r:'WILD',title:'Drag left for short, closed hats and toms with no ghost notes; right for long opening hats, bending toms, ghost notes and variation. The kick is never touched. It stays where you leave it; double-tap to go back to AS SET.'});
 let dep=0;const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 const wrap=(fn,pick)=>function(k){const x=DR.x;if(dep||Math.abs(x)<.01||(pick&&k!==1&&k!==3))return fn.apply(this,arguments);dep=1;const sv=[],put=(o,key,v)=>{sv.push([o,key,o[key],v]);o[key]=v},w=Math.max(0,x),t=Math.max(0,-x);
  try{if(pick){const T=TR[k],P=T.p;put(P,'dec',cl((P.dec||.05)*Math.pow(2,x<0?1.5*x:1.2*x),k===1?.015:.03,k===1?.4:1.5));
     if(k===1){put(P,'open',cl((P.open||0)*(1-t)+.5*w,0,1));put(T,'acc',cl((T.acc||0)+.4*w,0,1))}else put(P,'bend',cl((P.bend||0)+.6*w,0,3))}
    else [1,3,7,2].forEach(i=>{const T=TR[i];if(!T||T.m)return;put(T,'gho',cl(Math.max((T.gho||0)*(1-t),(i===2?.2:.45)*w*w),0,1));put(T,'vari',cl(Math.max((T.vari||0)*(1-t),(i===2?.25:.4)*w),0,1))   /* refined: ghosts come in late and stop short of clutter */});
   const r=fn.apply(this,arguments);
   if(pick&&w>.55&&R()<.5*(w-.55)/.45){const T=TR[k],tm=arguments[1],sd=sdur(),n=w>.85&&R()<.4?3:2;put(T,'lv',T.lv*.62);for(let i=1;i<n;i++)fn.call(this,k,tm+sd*i/n)}   /* v0.8 ratchet */
   return r}
  finally{dep=0;for(let i=sv.length-1;i>=0;i--){const [o,key,old,nw]=sv[i];if(o[key]===nw){if(old===undefined)delete o[key];else o[key]=old}}}};
 {const _f=fire;fire=wrap(_f,1)}{const _a=arrStep;arrStep=wrap(_a,0)}
 const add=()=>{if(document.querySelector('#t-perf .xmx'))return;const b=document.querySelector('#t-perf .bmx:not(.tha)'),pn0=b&&b.closest('.panel');if(!pn0)return;
  const pn=document.createElement('div');pn.className='panel mxp xmp';const row=document.createElement('div');row.className='mxrow';pn.appendChild(row);pn0.after(pn);DR.build(row);FX.build(row)};
 add();UI.on(()=>{try{add()}catch(e){}});window.orbFlightFx=FX;window.orbFlightDrums=DR;
 {const _g=generate;generate=function(){try{if(DR.x)DR.set(0);if(FX.x)FX.set(0)}catch(e){}return _g.apply(this,arguments)}}   /* a Launch puts them back to AS SET, like LOW-PASS, LEAD and BASS */}
