
/* ---- v0.26: THIN fader on Flight, under the low-pass — fewer notes (drums, lead, bass, stab), the kick never thins. Double-tap = off. Resets on Launch. ---- */
{const lp=document.querySelector('#t-perf .lpf');if(lp&&window.THIN){const TH=window.THIN;const row=document.createElement('div');row.className='thr';
  row.innerHTML='<span>THIN</span><div class="tht" title="Drag right for fewer notes. Double-tap to switch off."><div class="thfill"></div><div class="thk"></div></div><b class="thv">OFF</b>';lp.appendChild(row);
  const tr=row.querySelector('.tht'),kn=row.querySelector('.thk'),fl=row.querySelector('.thfill'),val=row.querySelector('.thv');
  const st=()=>{const t=TH.v;return t>=.9?4:t>=.65?3:t>=.4?2:t>=.12?1:0};
  const show=()=>{kn.style.left=(TH.v*100)+'%';fl.style.width=(TH.v*100)+'%';const n=st(),t=n?['','LIGHT','HALF','SPARSE','BONES'][n]:'OFF';if(val.textContent!==t)val.textContent=t;row.classList.toggle('on',n>0)};
  window.thinSet=v=>{TH.v=Math.max(0,Math.min(1,v));if(TH.v<.02)TH.v=0;show()};
  let drag=0,last=0;const pos=e=>{const r=tr.getBoundingClientRect();return (e.clientX-r.left)/r.width};
  tr.addEventListener('pointerdown',e=>{e.preventDefault();const n=performance.now();if(n-last<300){thinSet(0);last=0;return}last=n;drag=1;try{tr.setPointerCapture(e.pointerId)}catch(x){}thinSet(pos(e))});
  tr.addEventListener('pointermove',e=>{if(drag)thinSet(pos(e))});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tr.addEventListener(ev,()=>{drag=0}));
  tr.addEventListener('contextmenu',e=>e.preventDefault());show();
  const css=document.createElement('style');css.textContent=`.lpf .thr{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:11px;letter-spacing:.12em}.lpf .thr>span{font-weight:700;color:var(--acc,#ffe44d);width:44px}
.lpf .thr>b{width:58px;text-align:right;font-size:10.5px;opacity:.7}.lpf .thr.on>b{opacity:1;color:var(--acc,#ffe44d)}
.lpf .tht{position:relative;flex:1;height:30px;border:1px solid rgba(255,228,77,.35);border-radius:10px;background:rgba(0,0,0,.35);touch-action:none;user-select:none;cursor:ew-resize;overflow:hidden}
.lpf .thfill{position:absolute;left:0;top:0;bottom:0;width:0;background:repeating-linear-gradient(90deg,rgba(255,228,77,.18) 0 6px,transparent 6px 12px)}
.lpf .thk{position:absolute;top:3px;bottom:3px;width:16px;margin-left:-8px;left:0;border-radius:6px;background:var(--acc,#ffe44d);box-shadow:0 0 8px rgba(255,228,77,.5)}
@media (max-width:640px){body #t-perf>.rz>div{height:clamp(34px,calc((100dvh - 828px)/2),118px)!important}.lpf .tht{height:28px}}`;document.head.appendChild(css)}}
