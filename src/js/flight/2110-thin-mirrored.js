
/* ---- v0.36: THIN fader mirrored to match LOW-PASS — it rests on the right (ALL) and you pull left for fewer notes (BONES on the left).
   No jump on tap: it only moves once you drag more than ~8 px, relative to where it was and a bit slower than the finger, so a stray
   touch doesn't thin the groove. Double-tap still switches it off.
   v0.8: bipolar, like the other Flight faders — it rests in the CENTRE (ALL). Left = fewer notes (weakest first, BONES at the end),
   right = MORE (hat ratchets, ghost notes, a snare roll into every 4th bar). Double-tap = back to ALL. ---- */
{const POS=()=>THIN.m>0?.5+.5*THIN.m:.5-.5*THIN.v;
 const fix=()=>{const tt=document.querySelector('#t-perf .lpf .tht');if(!tt||!window.THIN)return null;const kn=tt.querySelector('.thk'),fl=tt.querySelector('.thfill'),p=POS();
  if(kn)kn.style.left=(p*100)+'%';if(fl){fl.style.right='auto';fl.style.left=(Math.min(p,.5)*100)+'%';fl.style.width=(Math.abs(p-.5)*100)+'%'}
  if(!tt.querySelector('.thc')){const c=document.createElement('div');c.className='thc';tt.prepend(c)}
  const ii=tt.querySelectorAll('i');if(ii.length>=2){if(ii[0].textContent!=='BONES')ii[0].textContent='BONES';if(ii[1].textContent!=='MORE')ii[1].textContent='MORE'}
  const v=document.querySelector('#t-perf .lpf .thv'),t=THIN.m>0?'MORE '+Math.round(THIN.m*100)+'%':THIN.v>0?'FEWER '+Math.round(THIN.v*100)+'%':'ALL';
  if(v&&v.textContent!==t)v.textContent=t;const row=tt.closest('.tha');if(row)row.classList.toggle('on',THIN.m>0||THIN.v>0);
  tt.title='Centre = every note. Drag left for fewer notes (weakest first), right for MORE (ratchets, ghost notes, rolls). Double-tap = back to all.';return tt};
 let _ts=null;if(window.thinSet){_ts=thinSet;window.thinSet=thinSet=function(v){THIN.m=0;const r=_ts.apply(this,arguments);try{fix()}catch(e){}return r}}
 window.thinPos=p=>{p=Math.max(0,Math.min(1,p));if(Math.abs(p-.5)<.02)p=.5;if(p<=.5){THIN.m=0;_ts&&_ts((.5-p)/.5)}else{_ts&&_ts(0);THIN.m=(p-.5)/.5;if(THIN.m<.02)THIN.m=0}try{fix()}catch(e){}};
 const hook=()=>{const tt=fix();if(!tt||tt.__mir)return!!tt;tt.__mir=1;const box=tt.parentElement;let d=null,last=0;
  box.addEventListener('pointerdown',e=>{if(!tt.contains(e.target))return;e.stopPropagation();e.preventDefault();const n=performance.now();
   if(n-last<300){last=0;thinSet(0);d=null;return}last=n;d={x:e.clientX,p:POS(),go:false,id:e.pointerId};try{tt.setPointerCapture(e.pointerId)}catch(x){}},true);
  box.addEventListener('pointermove',e=>{if(!d||!tt.contains(e.target)&&e.target!==tt)return;e.stopPropagation();const dx=e.clientX-d.x;if(!d.go){if(Math.abs(dx)<8)return;d.go=true;d.x=e.clientX;return}
   const w=tt.getBoundingClientRect().width||1;thinPos(d.p+(e.clientX-d.x)/w*.75)},true);
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>box.addEventListener(ev,e=>{if(d&&(tt.contains(e.target)||e.target===tt)){e.stopPropagation();if(d.go)last=0}d=null},true));return true};
 {const st=document.createElement('style');st.textContent='#t-perf .lpf .tht .thc{position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(214,255,230,.35);pointer-events:none}';document.head.appendChild(st)}
 if(!hook())setTimeout(hook,600);setTimeout(hook,2500);UI.on(()=>{try{fix()}catch(e){}})}
