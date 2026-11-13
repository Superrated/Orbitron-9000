
/* ---- v0.26: SUB HOLD on the bass replaces the Sub drone track — a clean sine on the chord root that rings from chord change to chord change
   under whatever the bassline plays (short plucky bass + continuous sub). It pumps with the sidechain. Moods that used the old Sub drone
   now turn on Sub hold; its slot is now the Satellite track. ---- */
{const B=TR[6];if(B.p.shold==null)B.p.shold=0;if(!B.x.some(x=>x[1]==='shold'))B.x.push(['Sub hold','shold',0,1,.01]);
 let H=null;const rel=t=>{if(!H)return;const h=H;H=null;try{if(h.c!==ctx||ctx.state==='closed')return;const g=h.g.gain,tt=Math.max(t,ctx.currentTime);g.cancelScheduledValues(tt);g.setValueAtTime(g.value,tt);g.setTargetAtTime(0,tt,.04);h.o.stop(tt+.4)}catch(e){}};
 const _cl=chordLog;chordLog=function(w,c){const r=_cl.apply(this,arguments);try{const P=B.p;
   if(!ctx||!playing||B.m||!(P.shold>.01)||(window.DR&&DR.rendering)||ctx instanceof OfflineAudioContext){rel(w);return r}
   rel(w);const sO=OCT,sF=FIX;OCT=0;FIX=0;let f;try{f=d2f(c.r,Math.round(P.oct)||1)}finally{OCT=sO;FIX=sF}while(f>95)f/=2;while(f<38)f*=2;
   const o=mkOsc(),g=padGain(ctx.createGain()),lp=ctx.createBiquadFilter();o.type='sine';o.frequency.value=f;lp.type='lowpass';lp.frequency.value=200;
   const lv=B.lv*.42*P.shold;g.gain.setValueAtTime(0,w);g.gain.linearRampToValueAtTime(lv,w+.05);o.connect(lp);lp.connect(g);routeTrack(g,null,A.dkb);o.start(w);o.stop(w+60);H={o,g,c:ctx}}catch(e){}return r};
 const _as=arrStep;arrStep=function(w){const r=_as.apply(this,arguments);try{if(H&&(B.m||!(B.p.shold>.01)||H.c!==ctx))rel(w)}catch(e){}return r};
 const _tg=toggle;toggle=function(){const r=_tg.apply(this,arguments);try{if(!playing&&ctx)rel(ctx.currentTime)}catch(e){}return r};try{$('#play').onclick=toggle}catch(e){}
 const SH={Drone:.7,'Deep Space':.65,Ambient:.6,Noir:.5,Dark:.5,Ethereal:.4,Dreamy:.3,Tense:.3};
 const _g=generate;generate=function(){const used=[];const r=_g.apply(this,arguments);try{const P=B.p,wasSub=!TR[9].m;TR[9].m=true;
   let s=0;if(!B.m&&!(P.bsus>.3)){if(wasSub)s=.45+R()*.25;else if(SH[curMood]&&R()<SH[curMood])s=.4+R()*.3}P.shold=+s.toFixed(2)}catch(e){}return r};
 try{build()}catch(e){}}
