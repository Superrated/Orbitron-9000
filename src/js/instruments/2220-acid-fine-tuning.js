
/* ---- v0.5: 303 FINE-TUNING
   · Drive type: Warm (soft, slightly asymmetric), Crunch (harder, uneven clipping plus a mid push) or Fuzz (raw, near-square clipping).
   · On an acid Launch: a slow cutoff "knob ride" on LFO 3 (16 or 32 bars, starting closed; the envelope moves along), a decay that is
     sometimes long and open (up to 1.2 s, more often in dark and slow moods), a drive type for the mood, and the dotted-1/8 echo with a
     little more send. (The delay already darkens each repeat, and the acid line already pumps with the kick through PUMP.) ---- */
var __ADC={};function acidDrive(t,d){if(t!=='Crunch'&&t!=='Fuzz')return acidWarm(d);const key=t+Math.round(d*20);if(__ADC[key])return __ADC[key];
 const N=2048,c=new Float32Array(N);let pk=0;
 for(let i=0;i<N;i++){const x=i/(N-1)*2-1;let y;if(t==='Crunch'){const a=2+d*8;y=x>0?Math.tanh(a*x):Math.tanh(a*1.4*x)*.85}else{const a=6+d*14;y=Math.sign(x)*(1-Math.exp(-a*Math.abs(x)))}c[i]=y;pk=Math.max(pk,Math.abs(y))}
 const lv=t==='Fuzz'?.62:1;let m=0;for(let i=0;i<N;i++){c[i]=c[i]/(pk||1)*lv;m+=c[i]}m/=N;for(let i=0;i<N;i++)c[i]-=m;   // Fuzz −2.5 dB to sit level with the others   // normalised and centred (no DC thump)
 return __ADC[key]=c}
{const DARK=new Set(['Dark','Noir','Temporal','Drone','Melancholic','Deep Space']),HARD=new Set(['Distorted Electro','Power','Tense']);
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const L=TR[4],P=L.p;if(P.mode!=='Acid 303'||L.m)return r;
   // 1 knob ride on LFO 3
   const L3=LFOS[2];Object.assign(L3,{tg:'Lead cutoff',sh:0,sync:1,div:R()<.55?64:128,d:+(.35+R()*.2).toFixed(2),ph:.75});try{window.lfoUI&&lfoUI()}catch(e){}
   // 2 decay
   P.dec=+(R()<(DARK.has(curMood)?.55:.3)?.5+R()*.7:.2+R()*.25).toFixed(2);
   // 6 drive type
   P.dty=HARD.has(curMood)?(R()<.6?'Fuzz':'Crunch'):DARK.has(curMood)?(R()<.75?'Warm':'Crunch'):(R()<.6?'Warm':R()<.75?'Crunch':'Fuzz');
   // 7 dotted-1/8 echo
   if(R()<.75){G.dt=.75;try{if(A.dl){A.dl.delayTime.value=.75*60/G.bpm;A.dl2.delayTime.value=.75*60/G.bpm}}catch(e){}}P.ds=Math.max(P.ds||0,+(.28+R()*.12).toFixed(2));
  }catch(e){}return r};
 // Drive type menu on the lead card (only in Acid 303 mode), under Drive
 UI.on(()=>{try{const T=TR[4],c=T.mb&&T.mb.closest('.card');if(!c)return;let el=c.querySelector('label.dtysel');const acid=T.p.mode==='Acid 303';
  if(!acid){if(el)el.style.display='none';return}
  if(!el){const drv=dfind(c);if(!drv||typeof mkSel!=='function')return;
   el=mkSel('Drive type',['Warm','Crunch','Fuzz'],T.p.dty||'Warm',v=>{T.p.dty=v});el.classList.add('dtysel');el.dataset.g=drv.dataset.g||'snd';el.title='Warm: soft and round · Crunch: harder with a mid push · Fuzz: raw';drv.after(el)}
  el.style.display=drv2(c)?'':'none'; /* shown on the same page as Drive */const s=el.querySelector('select');if(s&&document.activeElement!==s&&s.value!==(T.p.dty||'Warm'))s.value=T.p.dty||'Warm'}catch(e){}});
 function dfind(c){return [...c.querySelectorAll('.grid>.sl')].find(d=>{const sp=d.querySelector('span');return sp&&sp.firstChild&&sp.firstChild.textContent.trim()==='Drive'})}
 function drv2(c){const d=dfind(c);return d&&d.style.display!=='none'&&d.offsetParent!==null}}
