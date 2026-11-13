
/* ---- v0.35: FREQUENCY SLOTS. Pad and lead each get one gentle low-cut on their own path, so the low end belongs to kick and bass:
   the pad's cut sits just under its own root (lower when the bass is muted), the lead's around 150 Hz (90 Hz for acid lines).
   On Launch the pad's sub layer steps back while the bass plays, and the bass sub eases off when it lands on the kick's own pitch. ---- */
{const SL={ctx:null,f:{}};let SK=null;
 const rootF=o=>440*Math.pow(2,(12*(o+1)+(G.root||0)-69)/12);
 const want=k=>{try{if(k===5){const fp=rootF((TR[5].p.oct||2)+(G.oct||0));return TR[6].m?Math.max(35,Math.min(120,fp*.5)):Math.max(55,Math.min(180,fp*.9))}
   const P=TR[4].p;return P.mode==='Acid 303'?90:150}catch(e){return 60}};
 const node=k=>{if(SL.ctx!==ctx){SL.ctx=ctx;SL.f={}}let f=SL.f[k];if(!f){f=vtag(ctx.createBiquadFilter());f.type='highpass';f.Q.value=.6;f.frequency.value=want(k);vconn(f,f.__k,A.dk);f.__dk=A.dk;SL.f[k]=f}
  else if(f.__dk!==A.dk){try{f.disconnect()}catch(e){}vconn(f,f.__k,A.dk,1);f.__dk=A.dk}return f};
 const _s=send;send=function(n,out,dly,rev){try{if((SK===4||SK===5)&&out===A.dk&&A.dk&&n&&n.context===ctx&&!(ctx instanceof OfflineAudioContext)&&!(window.DR&&DR.rendering))out=node(SK)}catch(e){}return _s(n,out,dly,rev)};
 const _f=fire;fire=function(k,w){const o=SK;SK=k;try{return _f(k,w)}finally{SK=o}};
 const _p=pad;pad=function(){const o=SK;SK=5;try{return _p.apply(this,arguments)}finally{SK=o}};
 setInterval(()=>{try{if(SL.ctx!==ctx)return;for(const k in SL.f){const f=SL.f[k],v=want(+k);if(Math.abs(f.frequency.value-v)>1)f.frequency.setTargetAtTime(v,ctx.currentTime,.3)}}catch(e){}},1000);
 window.orbSlots={freqs:()=>({pad:want(5),lead:want(4)}),nodes:()=>SL.f};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const B=TR[6],Pd=TR[5].p;
   if(!B.m&&Pd.sub>0)Pd.sub=+(Pd.sub*.35).toFixed(3);
   const kp=TR[0].p.pitch,fb=rootF(B.p.oct||1);if(kp&&fb&&B.p.sub>0){const d=Math.abs(12*Math.log2(kp/fb)),m=d%12;if(Math.min(m,12-m)<1.2)B.p.sub=+(B.p.sub*.8).toFixed(3)}}catch(e){}return r}}
