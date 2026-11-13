/* ---- v148: Space — automatic stereo depth and pan movement. One fader (Mix → Channels): hats, perc, lead, pad and dub stab drift slowly
   left/right, each at its own tempo-synced rate, a note further out gets a touch more reverb (depth), and the synth image widens via the mood
   finish's side channel. Kick, clap, snare, bass and sub stay centred. 0 = off. Launch sets a mood-matched amount; sectors keep it ---- */
{if(G.space==null)G.space=.35;
 const MV={3:[.75,6,.5],4:[.55,16,.25],5:[.4,32,.75],8:[.65,12,.6]}; // track: [depth, period in bars, phase]
 const SP={Ambient:.8,'Deep Space':.7,Ethereal:.7,Dreamy:.55,'Melodic House':.5,Melancholic:.45,Noir:.5,Hopeful:.4,Bleep:.45,Drone:.5,Italo:.35,Breaks:.3,'Groove Techno':.4,Temporal:.15,Dark:.3,Acid:.3,Tense:.2,Power:.15,'Distorted Electro':.25,Vector:.55};
 let CK=null,CW=0,CD=0;
 const off=(k,t)=>{const m=MV[k];if(!m||!(G.space>0))return 0;const bars=t/16;return G.space*m[0]*Math.sin(2*Math.PI*(bars/m[1]+m[2]))};
 const _f=fire;fire=function(k,w){const a=CK,b=CW;CK=k;CW=w;try{return _f.apply(this,arguments)}finally{CK=a;CW=b}};
 const _p=pad;pad=function(t,w,dur){const a=CK,b=CW,c=CD;CK=5;CW=w;CD=dur||0;try{return _p.apply(this,arguments)}finally{CK=a;CW=b;CD=c}};
 const _s=send;send=function(n,out,dly,rev){const k=CK;if(k==null||!MV[k]||!(G.space>0)||!ctx||(typeof DR!=='undefined'&&DR.rendering)||ctx instanceof OfflineAudioContext)return _s.apply(this,arguments);
  try{const base=+TR[k].pan||0,o0=off(k,tk),lim=v=>Math.max(-1,Math.min(1,base+v))-base,pn=ctx.createStereoPanner(),w=CW||ctx.currentTime;
   pn.pan.setValueAtTime(lim(o0),w);
   if(k===5&&CD>0){const sd=60/G.bpm/4,o1=off(k,tk+CD/sd);pn.pan.linearRampToValueAtTime(lim(o1),w+CD)}
   if(n.__keep||n.__n!==undefined)pn.__keep=1; /* v0.89: behind a shared stage → shared too (platform/0040) */n.connect(pn);return _s.call(this,pn,out,dly,rev?rev*(1+.6*G.space*Math.abs(o0)):rev)}catch(e){return _s.apply(this,arguments)}};
 // UI: one fader at the top of Mix → Channels
 const add=()=>{const ch=document.querySelector('#t-mix .ch');if(!ch||ch.parentElement.querySelector('.spc'))return;const w=document.createElement('div');w.className='spc';
  w.innerHTML='<div class="spt"><b>SPACE</b><span>auto stereo depth + movement on perc, lead, pad and stab</span></div><div class="spr"><input type="range" min="0" max="1" step=".01"><b class="spv"></b></div>';
  const r=w.querySelector('input'),v=w.querySelector('.spv'),show=()=>{r.value=G.space||0;v.textContent=G.space>0?Math.round(G.space*100)+'%':'OFF'};
  r.oninput=()=>{G.space=+r.value;show();try{window.moodFinish&&moodFinish.apply()}catch(e){}};r.ondblclick=()=>{G.space=0;show();try{moodFinish.apply()}catch(e){}};
  ch.before(w);show();window.spaceShow=show};
 add();UI.on(()=>{add();try{const r=document.querySelector('.spc input');if(r&&document.activeElement!==r&&+r.value!==(G.space||0))window.spaceShow&&spaceShow()}catch(e){}});
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{G.space=SP[curMood]!=null?SP[curMood]:.35;window.moodFinish&&moodFinish.apply();window.spaceShow&&spaceShow()}catch(e){}return r};
 const st=document.createElement('style');st.textContent=`.spc{margin:0 0 8px;padding:6px 0 8px;border-bottom:1px solid rgba(0,255,156,.18)}.spc .spt{display:flex;align-items:baseline;gap:8px;font:600 10px ui-monospace,monospace;letter-spacing:.08em}
.spc .spt b{color:var(--acc,#ffe44d);letter-spacing:.14em;font-size:11px}.spc .spt span{opacity:.55;font-size:9px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spc .spr{display:grid;grid-template-columns:minmax(0,1fr) 44px;gap:8px;align-items:center}.spc input{width:100%;height:28px;margin:0;accent-color:var(--acc,#ffe44d)}.spc .spv{text-align:right;color:var(--acc,#ffe44d);font:700 11px ui-monospace,monospace}`;document.head.appendChild(st)}


