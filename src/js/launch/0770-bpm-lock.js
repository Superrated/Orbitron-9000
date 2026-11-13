/* ---- v94: BPM lock — keeps the current tempo when you Launch or change mood ---- */
/* padlock icon: closed when locked, shackle swung open when unlocked */
window.lockSvg=on=>'<svg class="lk'+(on?' on':'')+'" viewBox="0 0 24 24" width="1.15em" height="1.15em" aria-hidden="true" style="vertical-align:-.2em;overflow:visible"><path d="'+(on?'M7.5 11V8a4.5 4.5 0 0 1 9 0v3':'M7.5 11V7.5a4.5 4.5 0 0 1 8.6-1.9')+'" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="4.5" y="11" width="15" height="10" rx="2.2" fill="currentColor"/>'+(on?'<rect x="11" y="14.5" width="2" height="3.5" rx="1" fill="#04100a"/>':'')+'</svg>';
{G.bpmLock=0;try{localStorage.removeItem('orb-bpmlock')}catch(e){}
 const lb=$('#bv'),btn=document.createElement('button');btn.className='bpmlock';btn.title='Lock tempo: Launch keeps the current BPM';
 const lab=()=>{btn.innerHTML=window.lockSvg?window.lockSvg(G.bpmLock):(G.bpmLock?'🔒':'🔓');btn.classList.toggle('on',!!G.bpmLock)};lab();
 btn.onclick=e=>{e.preventDefault();e.stopPropagation();G.bpmLock=G.bpmLock?0:1;lab();};if(lb)lb.after(btn);
 const st=document.createElement('style');st.textContent='.bpmlock{margin-left:6px;padding:0 4px;border:1px solid rgba(0,255,156,.3);border-radius:6px;background:transparent;font-size:11px;line-height:16px;cursor:pointer;opacity:.6;vertical-align:middle}.bpmlock.on{opacity:1;color:var(--acc,#ffe44d);border-color:var(--acc,#ffe44d);box-shadow:0 0 6px rgba(255,228,77,.35)}';document.head.appendChild(st);
 const _g94=generate;generate=function(){const b=G.bpm;const r=_g94.apply(this,arguments);if(G.bpmLock&&b&&G.bpm!==b){G.bpm=b;$('#bpm').value=b;$('#bv').textContent=b;if(A.dl)A.dl.delayTime.setTargetAtTime((G.dt||.75)*60/b,ctx?ctx.currentTime:0,.05)}return r}}

