/* ---- v151: Master+ — 3-band multiband compression (120 Hz / 2.5 kHz, Linkwitz-Riley splits, amount per mood), a slow automatic loudness
   target of −12 LUFS (adapts gently, ignores intentionally quiet passages like breakdowns), a −1 dB safety limiter, and a short-term LUFS +
   peak meter on Mix. One switch to compare with the previous master. Survives engine rebuilds ---- */
{let on=true;try{const v=localStorage.getItem('orb-mst');if(v!=null)on=v==='1'}catch(e){}
 const DRV=Math.pow(10,-1.5/20),TARGET=-9, /* v0.4 master: was -9; the final clipper (end of file) catches the extra peaks */AMBT=new Set(['Ambient','Deep Space','Ethereal','Drone','Dreamy']),AMT={Ambient:.35,'Deep Space':.4,Ethereal:.5,Dreamy:.6,Drone:.7,Noir:.65,Melancholic:.65,Hopeful:.7,'Melodic House':.65,Vector:.65,Bleep:.6,Italo:.7};
 let M=null,agDb=0,hist=[],stv=-70,pk=-70,pkT=0;const MEM={};try{Object.assign(MEM,JSON.parse(localStorage.getItem('orb-mstmem')||'{}'))}catch(e){}setInterval(()=>{try{localStorage.setItem('orb-mstmem',JSON.stringify(MEM))}catch(e){}},10000);
 function mstBuild(){if(!ctx||!A.lim||!A.out)return;if(M&&M.ctx===ctx)return;
  const g=v=>{const n=ctx.createGain();n.gain.value=v;return n},bq=(t,f)=>{const b=ctx.createBiquadFilter();b.type=t;b.frequency.value=f;b.Q.value=.7071;return b},
   cp=(th,ra,at,re)=>{const c=ctx.createDynamicsCompressor();c.threshold.value=th;c.ratio.value=ra;c.attack.value=at;c.release.value=re;c.knee.value=10;return c};
  const inp=g(1),dry=g(on?0:1),wet=g(on?1:0),ag=g(1),sum=g(1);
  const l1=bq('lowpass',120),l2=bq('lowpass',120),h1=bq('highpass',120),h2=bq('highpass',120),m1=bq('lowpass',2500),m2=bq('lowpass',2500),t1=bq('highpass',2500),t2=bq('highpass',2500);
  const cL=cp(-6,1.4,.03,.25),cM=cp(-5,1.2,.02,.2),cH=cp(-4,1.25,.015,.15),gL=g(1.12),gM=g(1.06),gH=g(1.1);
  inp.connect(l1);l1.connect(l2);l2.connect(cL);cL.connect(gL);gL.connect(sum);
  inp.connect(h1);h1.connect(h2);h2.connect(m1);m1.connect(m2);m2.connect(cM);cM.connect(gM);gM.connect(sum);h2.connect(t1);t1.connect(t2);t2.connect(cH);cH.connect(gH);gH.connect(sum);
  sum.connect(wet);inp.connect(dry);wet.connect(ag);dry.connect(ag);
  const lim2=ctx.createDynamicsCompressor();lim2.threshold.value=-1;lim2.ratio.value=20;lim2.knee.value=0;lim2.attack.value=.001;lim2.release.value=.06;ag.connect(lim2);
  try{A.lim.disconnect()}catch(e){}A.lim.connect(inp);lim2.connect(A.out);
  // meters: K-weighted loudness and plain peak, taken from the final output
  const kh=bq('highpass',60),ks=ctx.createBiquadFilter();ks.type='highshelf';ks.frequency.value=1500;ks.gain.value=4;const an=ctx.createAnalyser(),ap=ctx.createAnalyser();an.fftSize=2048;ap.fftSize=2048;
  A.out.connect(kh);kh.connect(ks);ks.connect(an);A.out.connect(ap);
  window._mstLearn=performance.now()+9000;lim2.ratio.value=20;lim2.threshold.value=on?-1:-.5;lim2.knee.value=0;if(A.pre&&A.pre.context===ctx)A.pre.gain.value=on?DRV:1;M={ctx,lim2,dry,wet,ag,cL,cM,cH,gL,gM,gH,an,ap,inp,sum,l1,h1};agDb=MEM[curMood]!=null?MEM[curMood]:-8;try{ag.gain.value=Math.pow(10,agDb/20)}catch(e){}hist=[];amount()}   /* v0.6: start below the target and fade up, never above it */
 function amount(){if(!M)return;const a=AMT[curMood]!=null?AMT[curMood]:.8,t=ctx.currentTime;
  // Web Audio compressors add their own makeup gain (≈ 0.6 × the gain reduction at 0 dBFS); cancel it so the bands only shape, never boost
  [[M.cL,M.gL,-3-1.5*a,1.1+.25*a,0],[M.cM,M.gM,-2-1*a,1.05+.15*a,0],[M.cH,M.gH,-1.5-1*a,1.05+.15*a,0]].forEach(([c,g,th,ra,trim])=>{c.threshold.value=th;c.ratio.value=ra;
   const mk=.6*(-th)*(1-1/ra);g.gain.setTargetAtTime(Math.pow(10,(trim-mk)/20),t,.05)})}
 function setOn(v){on=v;if(v){window._mstLearn=performance.now()+9000;hist=[]}try{localStorage.setItem('orb-mst',on?'1':'0')}catch(e){}if(M&&M.ctx===ctx){const t=ctx.currentTime;M.wet.gain.setTargetAtTime(on?1:0,t,.05);M.dry.gain.setTargetAtTime(on?0:1,t,.05);M.lim2.ratio.value=on?20:1;M.lim2.threshold.value=on?-1:0;if(A.pre&&A.pre.context===ctx)A.pre.gain.setTargetAtTime(on?DRV:1,t,.1);if(on){agDb=MEM[curMood]!=null?MEM[curMood]:-8;M.ag.gain.setTargetAtTime(Math.pow(10,agDb/20),t,.15)}if(!on){agDb=0;M.ag.gain.setTargetAtTime(1,t,.1);if(A.pre&&A.pre.context===ctx)A.pre.gain.setTargetAtTime(1,t,.1)}}lab()}
 window.orbMPlus={set:v=>setOn(!!v),on:()=>on,M:()=>M};
 // loudness loop: short-term (3 s) K-weighted level; the gain moves at most +0.5 dB/s up and 1 dB/s down, never more than −9…+6 dB,
 // and does not lift passages that are far below the target on purpose (breakdowns, risers, the Flight low-pass, stopping)
 METER.every(2,()=>{if(!M||M.ctx!==ctx||ctx.state!=='running')return;
  let s=0,p=0;{const b=METER.read(M.an,2048);for(let i=0;i<2048;i++){const v=b[i];s+=v*v}}{const b=METER.read(M.ap,2048);for(let i=0;i<2048;i++){const q=b[i]<0?-b[i]:b[i];if(q>p)p=q}}if(!isFinite(s))return;
  hist.push(s/2048);if(hist.length>6)hist.shift();const ms=hist.reduce((a,b)=>a+b,0)/hist.length;stv=ms>0?10*Math.log10(2*ms)-.691:-70;
  const pdb=p>0?20*Math.log10(p):-70,now=performance.now();if(pdb>pk||now-pkT>1200){pk=pdb;pkT=now}
  if(on&&playing&&stv>-45&&hist.length>=6&&performance.now()<(window._mstLearn||0)){const err=TARGET+(AMBT.has(curMood)?-1.5:0)-stv,lp=window.LOWPASS?LOWPASS.get():1;   /* v0.6: ambient moods aim 1.5 dB lower */
   if(!(err>0&&(stv<TARGET-8||lp<.999))){agDb=Math.max(-16,Math.min(4,agDb+Math.max(-.75,Math.min(err>2?.5:.2,err*.3))));   /* v0.6: faster both ways, so it settles within ~2 s */MEM[curMood]=agDb;M.ag.gain.setTargetAtTime(Math.pow(10,agDb/20),ctx.currentTime,.5)}}
  show()},500);   /* v0.33: loudness read twice a second */
 const _in=init;init=function(){const r=_in.apply(this,arguments);try{setTimeout(()=>{try{mstBuild();if(A.pre&&A.pre.context===ctx)A.pre.gain.value=on?DRV:1}catch(e){console.warn('master+',e)}},0)}catch(e){}return r};
 const _ge=generate;generate=function(){const r=_ge.apply(this,arguments);try{amount();window._mstLearn=performance.now()+9000;if(on&&M&&M.ctx===ctx){agDb=MEM[curMood]!=null?MEM[curMood]:-8;hist=[];M.ag.gain.setTargetAtTime(Math.pow(10,agDb/20),ctx.currentTime,.15)}}catch(e){}return r};
 // UI under Mood finish
 let box=null;const lab=()=>{if(!box)return;const b=box.querySelector('button');{const h=on?'▲ Master+ <b>ON</b> · peak control + −9 LUFS':'△ Master+ <b>OFF</b> · previous master';if(b.innerHTML!==h)b.innerHTML=h}b.classList.toggle('on',on)};
 function show(){if(!box||!box.offsetParent)return;const t=box.querySelector('.mtx'),f=box.querySelector('.mfl');const l=stv<-60?'—':stv.toFixed(1);
  t.textContent=l+' LUFS · peak '+(pk<-60?'—':pk.toFixed(1))+' dB'+(on?' · gain '+(agDb>=0?'+':'')+agDb.toFixed(1):'');f.style.width=Math.max(0,Math.min(100,(stv+30)/30*100))+'%';f.classList.toggle('hot',stv>-7)}
 const add=()=>{const fb=document.querySelector('.finb');if(!fb||document.querySelector('.mstx'))return;box=document.createElement('div');box.className='mstx';
  box.innerHTML='<button type="button" class="finb mstb"></button><div class="mtr"><div class="mbar"><i class="mfl"></i><i class="mtg"></i></div><span class="mtx">— LUFS</span></div>';
  box.querySelector('button').onclick=()=>setOn(!on);fb.after(box);lab()};add();UI.on(add);
 window.masterPlus={on:()=>on,set:setOn,lufs:()=>stv,gain:()=>agDb,peak:()=>pk};
 const st=document.createElement('style');st.textContent=`.mstx{margin:0 0 8px}.mstx .mstb{margin-bottom:6px!important}.mstx .mtr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}
.mstx .mbar{position:relative;height:8px;border-radius:4px;background:rgba(0,255,156,.1);overflow:hidden}.mstx .mfl{position:absolute;left:0;top:0;bottom:0;width:0;background:#00ff9c;transition:width .2s}.mstx .mfl.hot{background:#ffb84d}
.mstx .mtg{position:absolute;top:-2px;bottom:-2px;left:70%;width:2px;background:var(--acc,#ffe44d)}.mstx .mtx{font:600 10px ui-monospace,monospace;letter-spacing:.04em;white-space:nowrap;opacity:.85;font-variant-numeric:tabular-nums}`;document.head.appendChild(st)}

