
/* ---- v0.35: FEEL — micro-timing per track. Each track sits a few milliseconds around the beat (kick on the grid, hats a touch late,
   bass a hair ahead on the off-beats). Launch picks one pocket (Tight, Pocket, Laid back, Push) and an amount within the mood's range; you can change both here until the next Launch. Groove only sets the accents now.
   Timing only — no extra sound processing. ---- */
{const POCK={ // ms per track: [kick,hat,clap,perc,lead,pad,bass,snare,stab,satellite]; bass value applies to off-beat 8ths
  Tight:[0,3,1.5,2,1,0,-1.5,1.5,2,0],Pocket:[0,6,3,4,2,0,-3,3,5,0],'Laid back':[0,10,6,7,4,0,-2,6,9,0],Push:[0,-3,-1.5,-2,-1,0,-5,-1,1,0]};
  const F={m:'Pocket',a:1};try{const s=JSON.parse(localStorage.getItem('orb-feel')||'null');if(s&&s.m)Object.assign(F,s)}catch(e){}if(!POCK[F.m]&&F.m!=='Off')F.m='Pocket';
 const save=()=>{try{localStorage.setItem('orb-feel',JSON.stringify(F))}catch(e){}};
 window.orbFeel={get:()=>Object.assign({},F),set:(m,a)=>{if(m)F.m=m;if(a!=null)F.a=Math.max(0,Math.min(2,+a));save()}};
 const _f=fire;fire=function(k,w){window.__feelOff=true; /* timing comes only from FEEL; Launch and Groove no longer move it (Groove still sets the accents) */try{if(F.m!=='Off'&&F.a>0&&ctx&&!(window.DR&&DR.rendering)){const P=POCK[F.m];if(P){let ms=P[k]||0;
     if(k===6&&tk%4!==2)ms=0;                                   // bass: only the off-beat 8ths lean
     if((k===1||k===3)&&ms)ms+=(R()-.5)*2*Math.min(1.5,Math.abs(ms)*.25); // a little life on hats and perc
     ms*=F.a;if(ms){const t=w+ms/1000;if(t>ctx.currentTime+.004)w=t}}}}catch(e){}return _f(k,w)};
 // Launch picks the pocket and its intensity for the mood (then it's yours to change until the next Launch)
 const LP={Tight:[['Groove Techno','Power','Distorted Electro','Acid','Tense','Temporal','Dark'],.6,1],
  Push:[['Breaks'],.5,.8],Pocket:[['Italo','Hopeful','Bleep','Noir','Vector','Drone'],.5,.8],
  'Laid back':[['Melodic House','Dreamy','Melancholic','Ethereal','Deep Space','Ambient'],.45,.75]};
 const _gl=generate;generate=function(){const r=_gl.apply(this,arguments);try{let st='Pocket',lo=.5,hi=.8;for(const k in LP)if(LP[k][0].includes(curMood)){st=k;lo=LP[k][1];hi=LP[k][2]}
   F.m=st;F.a=Math.round((lo+R()*(hi-lo))*20)/20;save();const w=document.querySelector('#t-mix .felx');w&&w.__sync&&w.__sync()}catch(e){}return r};
 window.orbFeelLaunch=LP;
 // UI on Mix → Channels, under PUMP
 const place=()=>{const ref=document.querySelector('#t-mix .pmpx')||document.querySelector('#t-mix .airx');if(!ref||document.querySelector('#t-mix .felx'))return;
  const w=document.createElement('div');w.className='spc felx';w.title='Micro-timing: how the tracks sit around the beat. Launch picks a pocket and amount for the mood; change it here any time. Amount 0 = straight grid.';
  w.innerHTML='<div class="spt"><b>FEEL</b><span>micro-timing · how the tracks sit around the beat</span></div><div class="spr"><select style="flex:0 0 auto;max-width:44%;height:28px;background:#0b1410;color:var(--acc,#ffe44d);border:1px solid rgba(0,255,156,.35);border-radius:6px;font:600 11px ui-monospace,monospace"></select><input type="range" min="0" max="2" step=".05"><b class="spv"></b></div>';
  const sel=w.querySelector('select'),r=w.querySelector('input'),v=w.querySelector('.spv');v.style.whiteSpace='nowrap';v.style.minWidth='64px';v.style.textAlign='right';
  ['Tight','Pocket','Laid back','Push','Off'].forEach(x=>sel.add(new Option(x,x)));
  const sync=()=>{if(document.activeElement!==sel)sel.value=F.m;if(document.activeElement!==r)r.value=F.a;const t=F.m==='Off'||F.a<=0?'straight':Math.round(F.a*100)+'%';if(v.textContent!==t)v.textContent=t;r.disabled=F.m==='Off';r.style.opacity=F.m==='Off'?.4:1};
  sel.onchange=()=>{F.m=sel.value;save();sync()};r.oninput=()=>{F.a=+r.value;save();sync()};r.ondblclick=()=>{F.a=1;save();sync()};w.__sync=sync;sync();ref.after(w)};
 try{place()}catch(e){}UI.on(()=>{try{place();const w=document.querySelector('#t-mix .felx');if(w&&w.offsetParent&&w.__sync)w.__sync()}catch(e){}})}
