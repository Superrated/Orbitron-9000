
/* ---- v0.35: Flight thrusters and drop hits in a logical order without taking more room: the thrusters stay two rows — the hold pads
   first (Snare roll, octave) then the switches (Kick, Break!, Fill, Hat push, Ride push) — and the drop hits sit in one row, low → high
   (Sub boom, Steel drop, Horn, Noise sweep, Ride in). The Funky claps hold pad is retired (Sub boom joins the drop hits). ---- */
{const st=document.createElement('style');st.textContent=`html body #t-perf .thr.g12{grid-template-columns:repeat(12,minmax(0,1fr))!important}
html body #t-perf .g12>.pad{grid-column:span 3}html body #t-perf .g12>.pad.w4{grid-column:span 4}
html body #t-perf .arm.g5{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}html body #t-perf .arm.g5>.pad{font-size:9.5px!important;padding:2px 2px!important;letter-spacing:0!important}`;document.head.appendChild(st);
 const ORDER_T=[/^Snare roll/,/^\+1 octave/,/^\+2 octaves/,/^Drift/,/^KICK/i,/^Break!/,/^Fill/,/^Hat push/,/^Ride push/,/^Chord hold/,/^Lift/],ORDER_D=[/^Sub boom/,/^Steel drop/,/^Horn/,/^Noise sweep/,/^Ride in/];
 const txt=b=>b.textContent.trim();
 const order=(box,pats)=>{const pads=[...box.querySelectorAll(':scope>.pad')],used=new Set(),list=[];pats.forEach(p=>{const b=pads.find(x=>!used.has(x)&&p.test(txt(x)));if(b){used.add(b);list.push(b)}});
  pads.filter(b=>!used.has(b)).forEach(b=>list.push(b));list.forEach(b=>box.appendChild(b));return list};
 const run=()=>{try{const g=document.querySelector('#t-perf .thr'),a=document.querySelector('#t-perf .arm');if(!g)return;
  const s0=g.previousElementSibling;if(s0&&s0.classList.contains('sub'))s0.textContent='Hold pads, then on / off switches';
  const L=order(g,ORDER_T);g.classList.add('g12');const n=L.length,r1=n>4?Math.ceil(n/2):n;
  if(n>8){g.style.setProperty('grid-template-columns','repeat('+r1+',minmax(0,1fr))','important');L.forEach(b=>{b.classList.remove('w4');b.style.gridColumn='span 1'})}   // 9–10 pads: two rows of five
  else{g.style.removeProperty('grid-template-columns');L.forEach((b,i)=>{b.style.gridColumn='';b.classList.toggle('w4',i>=r1&&n-r1===3)})}   // 4 + 3: second row spans the width
  if(a){order(a,ORDER_D);a.classList.add('g5');const sl=a.previousElementSibling;if(sl&&sl.classList.contains('sub'))sl.textContent='Drop hits · tap to arm, fire on release · low → high'}}catch(e){console.warn('[orbitron] flight layout',e)}};
 run();setTimeout(run,600);setTimeout(run,2500);
 UI.on(()=>{const g=document.querySelector('#t-perf .thr');if(g&&g.offsetParent&&!g.classList.contains('g12'))run()})}
