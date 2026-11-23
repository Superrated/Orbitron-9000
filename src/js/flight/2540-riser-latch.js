/* ---- v1.01: LATCH for risers and breakdowns — a small "🔒 LATCH" switch next to STAGE / RESET (shown on Flight only). While it is on,
   a riser or breakdown stays held when you lift your finger, at the height you left it (the pad glows and shows 🔒), so both hands are
   free for thrusters, mutes and faders. Tap the held pad and it lets go as usual: the drop / the full groove lands on the next beat.
   Switching LATCH off lets go of every held pad. Hooks into the release-on-beat step (1710), which asks orbLatch first. ---- */
{const zones=()=>[document.getElementById('riser'),...[...document.querySelectorAll('#t-perf>.rz')].map(p=>p.children[1])].filter(Boolean);
 const inZone=t=>t&&zones().find(z=>z===t||z.contains(t));
 const panel=z=>z.closest('.rz')||z;
 let on=0,rel=0;const down=new Map(),held=new Map(),eat=new Set();   /* finger → pad it pressed · held pad → its lift (replayed as the release) · taps that released a pad */
 const css=document.createElement('style');
 css.textContent='.ltch.on{background:#ffe44d!important;color:#111!important;border-color:#ffe44d!important}'+
  '#t-perf>.rz.lk>div{box-shadow:inset 0 0 0 2px #ffe44d,0 0 12px rgba(255,228,77,.45)}#t-perf>.rz.lk>h2::after{content:" 🔒"}';
 document.head.appendChild(css);
 const release=z=>{const h=held.get(z);if(!h)return;held.delete(z);panel(z).classList.remove('lk');rel=1;
  try{h.tgt.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId:h.id,clientX:h.x,clientY:h.y}))}finally{rel=0}};
 window.addEventListener('pointerdown',e=>{const z=inZone(e.target);if(!z)return;
  if(held.has(z)){e.stopImmediatePropagation();e.preventDefault();eat.add(e.pointerId);release(z);return}
  down.set(e.pointerId,z)},true);
 window.orbLatch=e=>{if(rel)return false;
  if(eat.has(e.pointerId)){eat.delete(e.pointerId);e.stopImmediatePropagation();return true}   /* the lift of the tap that let go: nothing more to do */
  const z=down.get(e.pointerId);down.delete(e.pointerId);if(!on||!z)return false;
  e.stopImmediatePropagation();held.set(z,{tgt:e.target,id:e.pointerId,x:e.clientX,y:e.clientY});panel(z).classList.add('lk');return true};
 const top=document.querySelector('.panel.top'),after=top&&(top.querySelector('.rstb')||top.querySelector('.stg'));
 if(after){const b=document.createElement('button');b.className='stg ltch';b.textContent='🔒 LATCH';
  b.title='Latch: risers and breakdowns stay held when you let go — tap the pad again to drop';
  b.onclick=()=>{on=on?0:1;b.classList.toggle('on',!!on);if(!on)[...held.keys()].forEach(release)};
  after.after(b);
  const P=document.querySelector('#t-perf'),show=()=>{b.style.display=P&&!P.hidden?'':'none'};show();
  if(P)new MutationObserver(show).observe(P,{attributes:true,attributeFilter:['hidden','style','class']})}}
