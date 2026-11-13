/* ---- v38: performance — pre-rendered hat metal, lighter master FX, capped visual fps, no hidden redraws, mobile-aware guard, Engine quality (Auto / Eco / Hi-fi) ---- */
{const mob=matchMedia('(pointer:coarse)').matches||(navigator.hardwareConcurrency||8)<=4;
 let q='Eco';try{if(!localStorage.getItem('orb-q2')){localStorage.setItem('orb-q','Eco');localStorage.setItem('orb-q2','1')}q=localStorage.getItem('orb-q')||'Eco'}catch(e){}
 const applyQ=()=>{const hf=q==='Hi-fi';QOS.hi=hf?[260,360,460]:mob?[110,160,220]:[170,240,320];QOS.hard=hf?600:mob?300:420;QOS.floor=q==='Survival'?2:q==='Eco'?1:0; /* perf 13: Eco keeps a light floor (unison ≤ 4) and saves more when the load meter asks */QOS.fps=q==='Hi-fi'?60:q==='Survival'?15:q==='Eco'?20:(mob?30:45);QOS.eco2=q==='Survival'};applyQ();
 QOS.la=.2;document.addEventListener('visibilitychange',()=>{QOS.la=document.hidden?1.2:.2});
 // quality selector in Mission control
 const _mx38=mix;mix=function(){_mx38();const m=$('#mix'),l=document.createElement('label');l.className='sl';l.appendChild(document.createTextNode('Engine quality'));const s=document.createElement('select');[['Hi-fi','Full · best sound'],['Auto','Auto · adapts to the device'],['Eco','Light · saves CPU'],['Survival','Survival · 64 voices max']].forEach(([x,t])=>s.add(new Option(t,x)));s.value=q;s.onchange=()=>{q=s.value;try{localStorage.setItem('orb-q',q)}catch(e){}applyQ()};l.appendChild(s);m.prepend(l)};
 // capped visual frame rate (lower still under load)
 let lastF=0;const _vz38=viz;viz=function(){const n=performance.now();QOS.ft=QOS.ft*.9+Math.min(100,n-(QOS.lt||n))*.1;QOS.lt=n;const cap=QOS.lvl>=1?Math.min(QOS.fps,24):QOS.fps;if(n-lastF<1000/cap-2){requestAnimationFrame(viz);return}lastF=n;_vz38()};
 // pattern dials only redraw when visible
 const _dw38=draw;draw=function(t,s){if(s>=0){t.cs=s;if(!t.m&&t.pt[s])t.fl=performance.now()}if(s<0||(t.cv&&isShown(t.cv)))_dw38(t,s)};
 // fewer grains per step
 const _gr38=grains;grains=function(w,sd){if(R()<.35)return;_gr38(w,sd)}}
// pre-rendered metallic hat source (one buffer instead of six oscillators per hit)
function hatMetal(){if(A.hm)return A.hm;const sr=ctx.sampleRate,n=Math.floor(sr*.6),b=ctx.createBuffer(1,n,sr),d=b.getChannelData(0),fr=[205.3,304.4,369.6,522.7,540,800].map(f=>f*1.6);
 for(let i=0;i<n;i++){let s=0;const t=i/sr;for(const f of fr)s+=((t*f)%1<.5?1:-1);d[i]=s/6}return A.hm=b}
const _init38=init;init=function(){const nw=!ctx;_init38();if(nw)setTimeout(hatMetalInit,50)};
function hatMetalInit(){if(A.hmP||!window.OfflineAudioContext)return;const sr=ctx.sampleRate,oc=new OfflineAudioContext(1,Math.floor(sr*.6),sr),m=oc.createGain(),bp=oc.createBiquadFilter(),hp=oc.createBiquadFilter();bp.type='bandpass';bp.frequency.value=9200;bp.Q.value=.7;hp.type='highpass';hp.frequency.value=4960;hp.Q.value=.5;m.connect(bp);bp.connect(hp);hp.connect(oc.destination);
 [205.3,304.4,369.6,522.7,540,800].forEach(f=>{const o=oc.createOscillator();o.type='square';o.frequency.value=f*1.6;o.connect(m);o.start()});A.hmP=oc.startRendering().then(b=>{A.hm2=b}).catch(()=>{})};
