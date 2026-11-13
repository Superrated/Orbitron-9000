
/* ---- v0.24: SAFETY LOOP — if the audio goes haywire while playing (broken audio values, repeated dropouts, or 2 s of silence while
   tracks should sound), a copy of the current kick pattern (4/4 if the kick is muted or empty) keeps the floor going on its own small audio engine while the
   main engine resets. The live engine comes back on the next bar of that kick, fading in over one bar while the kick fades out. ---- */
{let S=null,buf=null,bkey='',busy=0,cool=0;
 const sctx=()=>{if(S&&S.state!=='closed')return S;try{S=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});S.suspend()}catch(e){S=null}return S};
 document.addEventListener('pointerdown',()=>{if(!S)sctx()},{once:true,capture:true});
 const render=()=>{if(!ctx||busy||(window.DR&&DR.rendering)||!window.OfflineAudioContext)return;const K=TR[0],kp=(K.pt||[]).map(x=>x?1:0),use=!K.m&&kp.some(x=>x),ks=use?K.st:4,steps=use&&16%ks&&ks%16?64:16,
   key=[G.bpm,K.p.pitch,K.p.dec,K.p.punch,K.p.drive,K.p.click,K.lv,use?ks+':'+kp.join(''):'4/4'].join('|');if(key===bkey&&buf)return;
  const sr=ctx.sampleRate,bar=240/G.bpm,n=Math.round(sr*bar*steps/16),oc=new OfflineAudioContext(1,n+Math.round(sr*.7),sr),sink=oc.createGain(),nul=oc.createGain();sink.connect(oc.destination);
  const sv={ctx,ks:A.ks,m:A.m,ru:A.ru,dI:A.dI,rI:A.rI,duck,OCT,mt:K.m};
  try{ctx=oc;A.ks=sink;A.m=sink;A.ru=nul;A.dI=nul;A.rI=nul;duck=()=>{};OCT=0;if(window.DR)DR.rendering=true;K.m=false;for(let i=0;i<steps;i++)if(use?kp[i%ks]:i%4===0)fireVoice(0,i*bar/16)}
  catch(e){}finally{if(window.DR)DR.rendering=false;ctx=sv.ctx;A.ks=sv.ks;A.m=sv.m;A.ru=sv.ru;A.dI=sv.dI;A.rI=sv.rI;duck=sv.duck;OCT=sv.OCT;K.m=sv.mt}
  oc.startRendering().then(r=>{const d=r.getChannelData(0),o=new Float32Array(n);for(let i=0;i<d.length;i++)o[i%n]+=d[i]; /* fold the last kick's tail into the start */
   const c=sctx();if(!c)return;const b=c.createBuffer(1,n,sr);b.copyToChannel(o,0);buf=b;bkey=key}).catch(()=>{})};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);setTimeout(()=>{try{render()}catch(e){}},1500);return r};
 setInterval(()=>{try{if(playing)render()}catch(e){}},10000);
 const _t=toggle;toggle=function(){const r=_t.apply(this,arguments);if(playing)setTimeout(()=>{try{render()}catch(e){}},900);return r};try{$('#play').onclick=toggle}catch(e){}
 const safety=why=>{if(busy||!playing||performance.now()<cool)return false;const c=sctx();if(!buf||!c){cool=performance.now()+20000;try{window.orbResetWhy?orbResetWhy('haywire · '+why):hardReset('haywire')}catch(e){}return true} /* no kick loop yet: plain reset */
  busy=1;cool=performance.now()+20000;
  try{if(typeof say==='function')say('⚠ SAFETY LOOP · '+why.toUpperCase()+' · ENGINE RESETTING')}catch(e){}
  c.resume().catch(()=>{});const src=mkBuf(c),g=c.createGain();src.buffer=buf;src.loop=true;g.gain.value=0;src.connect(g);g.connect(c.destination);
  const t0=c.currentTime+.02;src.start(t0);g.gain.setTargetAtTime(.9,t0,.02);const bar=240/G.bpm,lp=buf.duration;
  try{window.orbResetWhy?orbResetWhy('safety loop · '+why):hardReset('safety loop')}catch(e){}
  let tries=0;const back=setInterval(()=>{tries++;if(tries>60){clearInterval(back);g.gain.setTargetAtTime(0,c.currentTime,.3);setTimeout(()=>{try{src.stop()}catch(e){}c.suspend();busy=0},1500);return}
   if(!ctx||ctx.state!=='running'||!playing||!A.m)return;clearInterval(back);
   const ph=((c.currentTime-t0)%lp+lp)%lp;let wait=(lp-ph)%bar||bar;if(wait<.35)wait+=bar;const now=ctx.currentTime,start=now+wait;
   try{A.m.gain.cancelScheduledValues(now);A.m.gain.setValueAtTime(0,now);A.m.gain.setValueAtTime(0,start);A.m.gain.linearRampToValueAtTime(.8,start+bar)}catch(e){}
   tk=Math.ceil(tk/16)*16;nextT=start;const cs=c.currentTime+wait;g.gain.cancelScheduledValues(cs);g.gain.setValueAtTime(.9,cs);g.gain.linearRampToValueAtTime(0,cs+bar);
   setTimeout(()=>{try{src.stop()}catch(e){}try{c.suspend()}catch(e){}busy=0;try{if(typeof say==='function')say('▶ ENGINE BACK')}catch(e){}},(wait+bar+.3)*1000)},100);return true};
 // trigger 1: broken audio values (the NaN watchdog calls orbReset)
 const _r=window.orbReset;window.orbReset=function(){if(playing&&safety('broken audio'))return;return _r&&_r.apply(this,arguments)};
 // trigger 2: repeated dropouts (6 within 10 s)
 let ur=null,ut=[];setInterval(()=>{if(!ctx||!playing)return;let ps=null;try{ps=ctx.playbackStats}catch(e){}if(!ps||ps.underrunEvents==null)return;
  if(ur!=null&&ps.underrunEvents>ur){const n=performance.now();for(let i=0;i<ps.underrunEvents-ur;i++)ut.push(n);ut=ut.filter(t=>n-t<10000);if(ut.length>=6){ut=[];if(performance.now()-(window.__launchT||-1e9)>10000)safety('dropouts')}}ur=ps.underrunEvents},500);
 // trigger 3: silence for 2 s while tracks should sound
 let q=0;METER.every(2,()=>{if(!ctx||!playing||busy||ctx.state!=='running'){q=0;return}
  const sounding=TR.some(T=>!T.m&&T.pt&&T.pt.some(x=>x));if(!sounding){q=0;return}
  let s;try{s=METER.post().sum}catch(e){return}if(s<1e-10)q++;else q=0;if(q>=4){q=0;safety('silence')}});
 window.orbSafety={trigger:safety,ready:()=>!!buf,render}}
