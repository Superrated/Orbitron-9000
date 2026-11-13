
/* ---- v0.26: TESTER MODE — private Launch ratings. Tap the credit line at the bottom 5× to switch it on or off (this device only).
   A strip under Launch rates the current Launch 1–5 stars and marks the weakest part. Each rating stores a fingerprint of the Launch
   (mood, flavour, sounds, styles, groove scores, fixes). Everything stays in this browser; Export ratings saves a file to hand back. ---- */
{const KEY='orb-ratings',TK='orb-tester';let on=false;try{on=localStorage.getItem(TK)==='1'}catch(e){}
 let RT=[];try{RT=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(RT))RT=[]}catch(e){RT=[]}
 /* v0.27: ratings made before v0.27 are cleared once (they rated the old sounds) */
 try{if(localStorage.getItem('orb-ratings-reset')!=='0.27'){RT=RT.filter(r=>parseFloat(r.v)>=0.27);localStorage.setItem(KEY,JSON.stringify(RT));localStorage.setItem('orb-ratings-reset','0.27')}}catch(e){}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(RT.slice(-2000)))}catch(e){}};
 const msg=t=>{try{if(typeof say==='function')say(t)}catch(e){}};
 let cur=null,seq=0;
 const fp=()=>{const L=TR[4],P=L.p,PD=TR[5],B=TR[6],S=TR[9],m=k=>!!TR[k].m;let g=null;try{g=window.orbGroove&&orbGroove.last}catch(e){}
  return{id:Date.now().toString(36)+'-'+(++seq),t:new Date().toISOString(),v:window.ORB_VERSION,mood:curMood,name:MN(curMood),auto:$('#mood').value==='Auto',flav:G.flav||null,fam:(window.orbModern&&orbModern.last)||null,swing:+(G.swing||0).toFixed(2),fx:{rev:G.rev,dly:G.dly,duck:G.duck},bed:G.bed||null,brole:G.brole||null,
   bpm:G.bpm,scale:G.scale,kit:G.kit||null,
   lead:{m:m(4),patch:P.patch||null,mode:P.mode,eng:P.eng||null,hits:L.h,steps:L.st,range:P.range,oct:P.loct||0,arp:!!G.arpOn,drift:P.rdr||0},
   pad:{m:m(5),patch:PD.p.patch||null,notes:PD.p.size,style:typeof padStyle!=='undefined'?padStyle:null},
   bass:{m:m(6),style:B.p.bsty||null,notes:B.p.bns||null,char:G.bchar||null,sustain:B.p.bsus||0,subhold:B.p.shold||0,phrase:B.p.bns==='Phrase'&&window.BPH?BPH.bars.length:0},
   drums:{hats:TR[1].h,clap:!m(2),snare:!m(7),perc:m(3)?null:(TR[3].p.pv||'Blip')},stab:!m(8),
   sat:S.m?null:{role:S.p.role,sound:S.p.snd,motion:S.p.role==='Counter'?S.p.mot:null},
   groove:g,fixes:(window.orbGroove&&orbGroove.fixes)||[],stars:0,weak:[]}};
 // UI
 const host=document.querySelector('#gbox')&&document.querySelector('#gbox').closest('.panel');const bar=document.createElement('div');bar.className='orate';bar.hidden=!on;
 bar.innerHTML='<div class="ors"><span class="orl">RATE</span>'+[1,2,3,4,5].map(i=>'<button data-s="'+i+'">★</button>').join('')+'<b class="orn"></b><button class="orx" title="Export ratings">⇪</button><button class="orc" title="Clear all ratings (hold 2 s)">✕</button></div>'+
  '<div class="orw"><span class="orl">WEAK</span>'+['Lead','Pad','Bass','Drums','Satellite'].map(x=>'<button data-w="'+x+'">'+x+'</button>').join('')+'</div>';
 if(host)host.appendChild(bar);
 const paint=()=>{bar.hidden=!on;const c=cur;bar.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',!!c&&c.stars>=+b.dataset.s));
  bar.querySelectorAll('[data-w]').forEach(b=>b.classList.toggle('on',!!c&&c.weak.includes(b.dataset.w)));const n=RT.filter(r=>r.stars>0).length;bar.querySelector('.orn').textContent=n+' rated'};
 const store=()=>{if(!cur)return;const i=RT.findIndex(r=>r.id===cur.id);if(cur.stars>0||cur.weak.length){if(i<0)RT.push(cur);else RT[i]=cur}else if(i>=0)RT.splice(i,1);save();paint()};
 bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.s){if(!cur)cur=fp();const s=+b.dataset.s;cur.stars=cur.stars===s?0:s;store();msg(cur.stars?'★ '+cur.stars+' · '+MN(curMood).toUpperCase():'☆ RATING CLEARED')}
  else if(b.dataset.w){if(!cur)cur=fp();const w=b.dataset.w,i=cur.weak.indexOf(w);if(i<0)cur.weak.push(w);else cur.weak.splice(i,1);store()}
  else if(b.classList.contains('orx'))exp()});
 {const c=bar.querySelector('.orc');let t=0;c.addEventListener('pointerdown',()=>{t=setTimeout(()=>{RT=[];save();cur=null;paint();msg('✕ ALL RATINGS CLEARED')},2000)});['pointerup','pointerleave','pointercancel'].forEach(ev=>c.addEventListener(ev,()=>clearTimeout(t)))}
 const exp=async()=>{const n=RT.filter(r=>r.stars>0).length;if(!RT.length){msg('▲ NO RATINGS YET');return}
  const d=new Date(),z=x=>String(x).padStart(2,'0'),base='orbitron-ratings-'+d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'-'+z(d.getHours())+z(d.getMinutes()),
   txt=JSON.stringify({app:'orbitron-9000',kind:'launch-ratings',v:window.ORB_VERSION,saved:d.toISOString(),count:RT.length,ratings:RT},null,1);
  let dl=null;try{dl=window.claude&&claude.use?await claude.use('downloads'):null}catch(e){dl=null}
  if(dl){try{await dl.save({filename:base+'.json',data:txt});msg('⇪ '+n+' RATINGS EXPORTED');return}catch(e){}}
  try{const r=await window.orbSave(base+'.json',new Blob([txt],{type:'application/json'}));msg(r==='cancelled'?'EXPORT CANCELLED':'⇪ '+n+' RATINGS EXPORTED')}catch(e){msg('▲ EXPORT BLOCKED HERE')}}
 // every Launch starts a new (unrated) record; the fingerprint is taken once the Launch is complete
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{cur=null;window.__orbFromLaunch=1;if(on)setTimeout(()=>{cur=fp();paint()},120)}catch(e){}return r};
 // unlock: tap the credit line 5× within 3 s
 let taps=[];document.addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('.credit');if(!c)return;const n=Date.now();taps=taps.filter(t=>n-t<3000);taps.push(n);
  if(taps.length>=5){taps=[];on=!on;try{localStorage.setItem(TK,on?'1':'0')}catch(x){}if(on&&!cur)cur=fp();paint();msg(on?'🧪 TESTER MODE ON · rate launches under Launch':'🧪 TESTER MODE OFF')}});
 paint();window.orbRatings={all:()=>RT.slice(),export:exp,
  /* v0.3: storing a Launch in a sector slot rates it 5 stars (tester mode only; not after a recalled sector) */
  saved:()=>{if(!on||!window.__orbFromLaunch)return;if(!cur)cur=fp();cur.stars=5;store();setTimeout(()=>msg('★ 5 · SAVED LAUNCH RATED'),900)}};
 const st=document.createElement('style');st.textContent=`.orate{margin-top:8px;display:flex;flex-direction:column;gap:4px}.orate[hidden]{display:none!important}
.orate .ors,.orate .orw{display:flex;align-items:center;gap:4px;flex-wrap:nowrap}.orate .orl{font:700 9px ui-monospace,monospace;letter-spacing:.14em;opacity:.6;width:38px;flex:none}
.orate button{min-height:30px!important;height:30px;padding:0 6px!important;font-size:12px!important;flex:1;clip-path:none!important;border-radius:6px!important}
.orate [data-s]{font-size:18px!important;color:rgba(255,228,77,.35);background:transparent!important}.orate [data-s].on{color:var(--acc,#ffe44d)}
.orate [data-w].on{background:rgba(255,93,115,.25)!important;border-color:#ff5d73!important;color:#ffd0d6!important}.orate .orn{font:600 10px ui-monospace,monospace;opacity:.7;white-space:nowrap;margin:0 4px}
.orate .orx,.orate .orc{flex:0 0 34px}.orate [data-w]{font-size:10px!important;letter-spacing:.02em}`;document.head.appendChild(st)}
