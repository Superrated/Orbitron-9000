
/* v165: drum bus — the drums (kick, hats, clap, perc, snare) gather on one bus. Under the dry drums sits a parallel copy that is
   squashed hard (New York compression) and gently tape-saturated, blended in by the "Drum bus" fader (Mix → top). 0 = exactly the old sound.
   Kick rumble, sidechain and the synths are untouched. Launch sets a mood-matched amount; sectors keep it. */
{const DK=new Set([0,1,2,3,7]),AMT={Temporal:.55,'Groove Techno':.5,Power:.5,Breaks:.55,Tense:.45,Dark:.45,Acid:.45,'Distorted Electro':.45,Noir:.35,Bleep:.35,
  Italo:.35,'Melodic House':.35,Vector:.35,Hopeful:.3,Melancholic:.3,Drone:.3,Dreamy:.25,Ethereal:.2,'Deep Space':.2,Ambient:.12};
 if(G.dbus==null)G.dbus=.35;let B=null,inDrum=0;
 const satC=k=>{const n=1024,c=new Float32Array(n),t=Math.tanh(k);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(k*x)/t}return c};
 const wetGain=v=>Math.pow(v,1.3)*1.1;   // fader → blend of the squashed copy
 function dbEnsure(){if(!ctx||!A.m||!A.ks)return false;if(B&&B.ctx===ctx)return true;
  const g=v=>{const n=ctx.createGain();n.gain.value=v;return n};
  const bus=g(1),hp=ctx.createBiquadFilter(),cmp=ctx.createDynamicsCompressor(),pre=g(.7),sat=ctx.createWaveShaper(),tone=ctx.createBiquadFilter(),wet=g(wetGain(G.dbus||0));
  hp.type='highpass';hp.frequency.value=45;hp.Q.value=.6;
  cmp.threshold.value=-32;cmp.ratio.value=8;cmp.knee.value=4;cmp.attack.value=.004;cmp.release.value=.09;
  sat.curve=satC(1.6);sat.oversample='2x';tone.type='lowpass';tone.frequency.value=11000;tone.Q.value=.5;
  bus.connect(A.m);bus.connect(hp);hp.connect(cmp);cmp.connect(pre);pre.connect(sat);sat.connect(tone);tone.connect(wet);wet.connect(A.m);
  try{A.ks.disconnect(A.m)}catch(e){}A.ks.connect(bus);
  B={ctx,bus,wet,cmp};A.db=bus;return true}
 window.drumBus={set(v){G.dbus=Math.max(0,Math.min(1,+v||0));if(B&&ctx)B.wet.gain.setTargetAtTime(wetGain(G.dbus),ctx.currentTime,.05);try{show()}catch(e){}},get:()=>G.dbus,node:()=>B};
 // drum voices connect to the bus instead of the master (only while a drum fires, only on the live context)
 RT.drum=d=>(inDrum&&B&&d===A.m&&ctx===B.ctx)?B.bus:d;
 const _f=fire;fire=function(k,w){if(!DK.has(k))return _f.apply(this,arguments);if(!(B&&B.ctx===ctx))dbEnsure();inDrum++;try{return _f.apply(this,arguments)}finally{inDrum--}};
 // a mood-matched amount on every Launch
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{drumBus.set((window.MOODX&&MOODX[curMood]||{}).bus!=null?(window.MOODX&&MOODX[curMood]||{}).bus:AMT[curMood]!=null?AMT[curMood]:.35);show()}catch(e){}return r};
 // UI: one fader at the top of Mix, under Space
 let show=()=>{};
 const add=()=>{const anchor=document.querySelector('#t-mix .spc')||document.querySelector('#t-mix .ch');if(!anchor||document.querySelector('#t-mix .dbx'))return;
  const w=document.createElement('div');w.className='spc dbx';
  w.innerHTML='<div class="spt"><b>DRUM BUS</b><span>parallel squash + tape warmth under the drums</span></div><div class="spr"><input type="range" min="0" max="1" step=".01"><b class="spv"></b></div>';
  const rI=w.querySelector('input'),v=w.querySelector('.spv');show=()=>{if(document.activeElement!==rI)rI.value=G.dbus||0;v.textContent=G.dbus>0?Math.round(G.dbus*100)+'%':'OFF'};
  rI.oninput=()=>{drumBus.set(+rI.value);show()};rI.ondblclick=()=>{drumBus.set(0);show()};
  if(anchor.classList.contains('spc'))anchor.after(w);else anchor.before(w);show()};
 add();UI.on(()=>{try{add();if(B&&ctx&&Math.abs(B.wet.gain.value-wetGain(G.dbus||0))>.02)drumBus.set(G.dbus);show()}catch(e){}})}
