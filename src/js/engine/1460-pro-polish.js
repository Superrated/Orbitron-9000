
/* ---- v0.22: PRO POLISH — make every Launch and every edit sound more finished. CPU-light by design.
   1. Auto mix balance: listens to every track for 4 bars, then nudges each track's Level (the normal Level fader) into a target range
      against the kick. Runs after each Launch, and on "⚖ Balance mix" (Mix → Channels) after your own edits. Beatless moods are skipped.
   2. Clean-up EQ: one shared low-cut per track (not per note) where a sound has no business: clap 180 Hz, perc 120, lead 140, pad 110
      (+ a −2 dB dip at 300 Hz against mud), snare 110. Hats and the dub stab have their own filter stages; kick, bass, sub and the Acid 303 line are untouched.
      While the Flight low-pass is engaged it steps aside (that fader already shapes the sound).
   3. Analog glue: a gentle tape curve on the synth bus and a tiny analog drift (≈±2 cents) on lead, pad and stab notes.
   "Pro polish" (Mix → Bus & FX) switches 2 and 3 off for an A/B; the balance only ever moves the Level faders.
   4. Plate reverb: the reverb impulses are rebuilt as a smooth plate with natural damping (highs fade about twice as fast as lows),
      a soft build-up and decorrelated stereo — same lengths as before, so no extra CPU. Pre-delay follows the tempo (≈1/64 note). ---- */
{if(G.pro==null){G.pro=1;try{const v=localStorage.getItem('orb-pro');if(v!=null)G.pro=+v}catch(e){}}
 let MEAS=null,EQN=0;const EQK={0:[20,1,250,-3],2:[180],3:[120],4:[140],5:[110,1],7:[110]};
 // the voice entry points say which track is sounding (VX); routeTrack and the stages below read it
 const tag=(fn,kf)=>function(){const o=VX.k,on=VX.n;VX.k=typeof kf==='function'?kf(arguments[0]):kf;VX.n=++VX.nc;try{return fn.apply(this,arguments)}finally{VX.k=o;VX.n=on}};
 fireVoice=tag(fireVoice,k=>k);pad=tag(pad,5);grains=tag(grains,5);snare=tag(snare,7);stab=tag(stab,8);
 const isSend=d=>d===A.dI||d===A.rI;const isBus=d=>{for(const x in A)if(A[x]===d)return true;return false};   /* is this one of the engine's shared buses? */
 // shared clean-up EQ per track and destination
 let EQC=null;const eqFor=(k,d)=>{if(!EQC||EQC.ctx!==ctx)EQC={ctx,m:{}};const m=EQC.m[k]||(EQC.m[k]=new Map());let e=m.get(d);if(e)return e;if(m.size>=8)return null;
  {const [f,mud]=EQK[k],h=ctx.createBiquadFilter();h.type='highpass';h.frequency.value=f;h.Q.value=.707;h.__eq=1;h.__dst=d;let out=h;
   if(mud){const pk=ctx.createBiquadFilter();pk.type='peaking';pk.frequency.value=EQK[k][2]||300;pk.Q.value=1;pk.gain.value=EQK[k][3]||-2;pk.__eq=1;h.connect(pk);out=pk}
   out.connect(RT.drum?RT.drum(d):d);m.set(d,h);EQN++;return h}};
 /* called by routeTrack for a tagged voice output: feeds the auto-balance meter, and returns the track's clean-up EQ when it applies */
 RT.pro=(n,k,d)=>{const vn=VX.k!=null?VX.n:undefined;
  if(MEAS&&!d.__an&&(d.__eq?!isSend(d.__dst):(!isSend(d)&&(isBus(d)||(d.__k!=null&&d.__n!==vn)))))try{const an=MEAS.an(k);n.connect(RT.lp?RT.lp(an):an)}catch(e){}   /* with the Flight low-pass engaged the meter hears the filtered voice */
  if((G.pro||k===0)&&EQK[k]&&d.__k==null&&!d.__eq&&isBus(d)&&!(d instanceof AudioDestinationNode)&&!(k===4&&TR[4].p.mode==='Acid 303')&&!(window.LOWPASS&&LOWPASS.get()<.999))return eqFor(k,d);
  return null};
 // analog glue: tape curve on the synth bus (unity at low level, about 2 dB softer at full scale, slightly asymmetric)
 const TC=(()=>{const n=2048,c=new Float32Array(n),k=.8,b=.08,sc=k/Math.pow(Math.cosh(k*b),2);for(let i=0;i<n;i++){const x=2*(i/(n-1)*2-1);c[i]=((Math.tanh(k*(x+b))-Math.tanh(k*b))/sc)/2}return c})();
 window.tapeSet=()=>{if(A.tape)A.tape.curve=G.pro?TC:null};
 // ---- 1. auto mix balance ----
 const RANGE={1:[-30,-22],2:[-22,-15],3:[-26,-16],4:[-24,-15],5:[-24,-11],6:[-16,-6],7:[-20,-13],8:[-24,-17],9:[-18,-9]}   /* v0.5: tighter on the loud side for hats, clap, perc, snare, stab, lead and Satellite — the parts that stuck out */,NM=['Kick','Hi-hat','Clap','Perc','Lead','Pad','Bass','Snare','Stab','Satellite'];
 let BAL={state:'idle',msg:'',pend:0};
 const status=m=>{BAL.msg=m;document.querySelectorAll('.balst').forEach(e=>e.textContent=m)};
 function measure(ms){return new Promise(res=>{const A_={},acc={},buf=METER.buf;
  MEAS={an:k=>{if(!A_[k]){const a=ctx.createAnalyser();a.fftSize=2048;a.__an=1;if(RT.lpOn&&RT.lpOn())a.__lpf=1; /* a meter made while the low-pass is engaged listens before the filter (as before) */A_[k]=a;acc[k]=[0,0]}return A_[k]}};
  const st=performance.now(),iv=setInterval(()=>{for(const k in A_){A_[k].getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];acc[k][0]+=s/buf.length;acc[k][1]++}
   if(performance.now()-st>=ms){clearInterval(iv);MEAS=null;const o={};for(const k in acc)o[k]=Math.sqrt(acc[k][0]/Math.max(1,acc[k][1]));setTimeout(()=>{for(const k in A_)try{A_[k].disconnect()}catch(e){}},1500);res(o)}},40)})}
 async function balance(src){if(BAL.state==='busy')return;if(!ctx||!playing){BAL.pend=1;status('⚖ will balance once playing');return}
  if(window.LOWPASS&&LOWPASS.get()<.999){status('⚖ open the Flight low-pass first');return}
  BAL.state='busy';BAL.pend=0;const bars=4,ms=bars*16*sdur()*1000;status('⚖ listening for '+bars+' bars…');
  let r;try{r=await measure(ms)}catch(e){BAL.state='idle';status('');return}BAL.state='idle';
  BAL.last={};for(const kk in r)if(r[0]>1e-6&&r[kk]>1e-7)BAL.last[NM[kk]]=+(20*Math.log10(r[kk]/r[0])).toFixed(1);const kick=r[0];if(TR[0].m||!(kick>1e-5)){status('⚖ no kick playing — balance skipped (beatless)');return}
  const ch=[];Object.keys(RANGE).forEach(ks=>{const k=+ks,T=TR[k],v=r[k];if(!T||T.m||!(v>1e-6))return;const db=20*Math.log10(v/kick),[lo,hi]=RANGE[k];
   let d=0;if(db<lo)d=Math.min(5,lo+1-db);else if(db>hi)d=-Math.min(5,db-(hi-1));if(Math.abs(d)<.5)return;
   const mx=k===4?1.4:1,nv=Math.max(.02,Math.min(mx,T.lv*Math.pow(10,d/20)));const real=20*Math.log10(nv/T.lv);if(Math.abs(real)<.3)return;T.lv=nv;ch.push(NM[k]+' '+(real>0?'+':'')+real.toFixed(1))});
  syncCh();status(ch.length?'⚖ balanced: '+ch.join(', ')+' dB':'⚖ mix already in range — nothing changed');setTimeout(()=>{if(BAL.state==='idle')status('')},9000)}
 const syncCh=()=>{document.querySelectorAll('#t-mix .cs').forEach(c=>{const n=(c.querySelector('h3')||{}).textContent,k=NM.indexOf((n||'').trim());if(k<0)return;const r=c.querySelector('input[type=range]'),b=c.querySelector('b');if(r){r.value=TR[k].lv;if(b)b.textContent=Math.round(TR[k].lv*100)}});try{window.syncFaders&&syncFaders()}catch(e){}};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(G.pro){BAL.pend=1;BAL.at=null}}catch(e){}return r};
 setInterval(()=>{try{if(!BAL.pend||BAL.state==='busy'||!ctx)return;if(!playing){return}if(BAL.at==null){BAL.at=performance.now()+16*sdur()*1000;return}if(performance.now()>=BAL.at){BAL.at=null;balance('launch')}}catch(e){}},250);
 // ---- UI: Balance button (Mix → Channels), Pro polish switch (Mix → Bus & FX, next to Air) ----
 const st=document.createElement('style');st.textContent=`.balbx{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0 8px}.balbx button{min-height:38px;padding:0 14px;border:1px solid var(--acc,#ffe44d);border-radius:10px;background:rgba(255,228,77,.08);color:var(--acc,#ffe44d);font:inherit;font-weight:700;letter-spacing:.06em;cursor:pointer}
 .balbx .balst{font-size:11px;opacity:.8;flex:1 1 160px}.prosw{grid-column:1/-1;display:flex;gap:8px;align-items:center;font-size:12px}.prosw button{min-height:34px;padding:0 12px;border-radius:9px;border:1px solid rgba(0,255,156,.4);background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer}.prosw button.on{background:var(--acc,#ffe44d);color:#0a0f0c;border-color:var(--acc,#ffe44d)}.prosw small{opacity:.65}`;document.head.appendChild(st);
 const ui=()=>{const ch=document.querySelector('#t-mix .ch');if(ch&&!document.querySelector('#t-mix .balbx')){const b=document.createElement('div');b.className='balbx';b.innerHTML='<button type="button">⚖ Balance mix</button><span class="balst"></span>';b.querySelector('button').onclick=()=>balance('user');ch.before(b);status(BAL.msg)}
  const m=$('#mix');if(m&&!m.querySelector('.prosw')){const d=document.createElement('div');d.className='prosw';d.innerHTML='<button type="button"></button><small>clean-up EQ per track · tape glue · analog drift · auto balance after Launch</small>';const bt=d.querySelector('button');
   const lab=()=>{bt.textContent=G.pro?'● Pro polish ON':'○ Pro polish OFF';bt.classList.toggle('on',!!G.pro)};lab();bt.onclick=()=>{G.pro=G.pro?0:1;try{localStorage.setItem('orb-pro',G.pro)}catch(e){}tapeSet();lab()};
   const air=m.querySelector('.airsl');if(air)air.after(d);else m.appendChild(d)}};
 UI.on(()=>{try{ui()}catch(e){}});
 // ---- 4. plate reverb impulse (replaces the noise impulse; same length, so the same CPU) ----
 window.ir2=ir2=function(sec,pre){const sr=ctx.sampleRate,n=Math.floor(sr*sec),b=ctx.createBuffer(2,n,sr),P=Math.floor(sr*Math.min(pre||0,.005));
  let ref=(window.__irRef&&__irRef.sr===sr)?__irRef.v:0;if(!ref){const o=ir(3.2,2.4,.3).getChannelData(0);for(let i=0;i<o.length;i++)ref+=o[i]*o[i];window.__irRef={sr,v:ref}} /* v0.34: computed once */
  const T=sec*.8,TL=T,TM=T*.8,TH=T*.45,a1=1-Math.exp(-2*Math.PI*700/sr),a2=1-Math.exp(-2*Math.PI*3500/sr),fade=Math.floor(n*.12);let en=0;
  for(let c=0;c<2;c++){const d=b.getChannelData(c);let l1=0,l2=0,ap=0;
   for(let i=P;i<n;i++){const x=Math.random()*2-1;l1+=(x-l1)*a1;l2+=(x-l2)*a2;const t=(i-P)/sr,lo=l1,mi=l2-l1,hi=x-l2;
    let y=lo*Math.exp(-6.91*t/TL)*1.6+mi*Math.exp(-6.91*t/TM)*1.15+hi*Math.exp(-6.91*t/TH)*.7;
    y*=1-Math.exp(-t/.006);if(i>n-fade)y*=.5+.5*Math.cos(Math.PI*(i-(n-fade))/fade);
    const z=y+ap*.35;ap=y-z*.35;d[i]=z}   // light allpass smear for plate density
   for(let i=0;i<n;i++)en+=d[i]*d[i]}
  const s=Math.sqrt(ref*2/en);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]*=s}return b};
 // tempo-synced pre-delay follows tempo changes
 let lb=0;setInterval(()=>{try{if(G.bpm!==lb){lb=G.bpm;window.finApply&&finApply()}}catch(e){}},1000);
 window.proPolish={eqMap:()=>{const o={};if(EQC)for(const k in EQC.m)o[k]=[...EQC.m[k].keys()].map(d=>{const nm=Object.keys(A).find(x=>A[x]===d);return (nm?'A.'+nm:d.constructor.name)});return o},balance,eqCount:()=>EQN,status:()=>BAL,tape:()=>!!(A.tape&&A.tape.curve)}}
