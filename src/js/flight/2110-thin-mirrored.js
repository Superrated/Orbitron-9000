
/* ---- v0.36: THIN fader mirrored to match LOW-PASS — it rests on the right (ALL) and you pull left for fewer notes (BONES on the left).
   No jump on tap: it only moves once you drag more than ~8 px, relative to where it was and a bit slower than the finger, so a stray
   touch doesn't thin the groove. Double-tap still switches it off. ---- */
{const fix=()=>{const tt=document.querySelector('#t-perf .lpf .tht');if(!tt||!window.THIN)return null;const kn=tt.querySelector('.thk'),fl=tt.querySelector('.thfill'),v=THIN.v;
  if(kn)kn.style.left=((1-v)*100)+'%';if(fl){fl.style.left='auto';fl.style.right='0';fl.style.width=(v*100)+'%'}
  const ii=tt.querySelectorAll('i');if(ii.length>=2){if(ii[0].textContent!=='BONES')ii[0].textContent='BONES';if(ii[1].textContent!=='ALL')ii[1].textContent='ALL'}
  tt.title='Drag left for fewer notes · double-tap to switch off';return tt};
 if(window.thinSet){const _ts=thinSet;window.thinSet=thinSet=function(v){const r=_ts.apply(this,arguments);try{fix()}catch(e){}return r}}
 const hook=()=>{const tt=fix();if(!tt||tt.__mir)return!!tt;tt.__mir=1;const box=tt.parentElement;let d=null,last=0;
  box.addEventListener('pointerdown',e=>{if(!tt.contains(e.target))return;e.stopPropagation();e.preventDefault();const n=performance.now();
   if(n-last<300){last=0;thinSet(0);d=null;return}last=n;d={x:e.clientX,v:THIN.v,go:false,id:e.pointerId};try{tt.setPointerCapture(e.pointerId)}catch(x){}},true);
  box.addEventListener('pointermove',e=>{if(!d||!tt.contains(e.target)&&e.target!==tt)return;e.stopPropagation();const dx=e.clientX-d.x;if(!d.go){if(Math.abs(dx)<8)return;d.go=true;d.x=e.clientX;return}
   const w=tt.getBoundingClientRect().width||1;thinSet(d.v-(e.clientX-d.x)/w*.75)},true);
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>box.addEventListener(ev,e=>{if(d&&(tt.contains(e.target)||e.target===tt)){e.stopPropagation();if(d.go)last=0}d=null},true));return true};
 if(!hook())setTimeout(hook,600);setTimeout(hook,2500);UI.on(()=>{try{fix()}catch(e){}})}
