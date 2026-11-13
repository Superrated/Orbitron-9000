
/* v164: kick tuned to the key. The Pitch fader still sets the region; the kick snaps to the nearest root (or fifth) of the current key,
   so kick, rumble tail, sub and bass agree. Kick Sound page: "Tune to key" = Root + fifth (default) · Root · Off. */
{const NOTE=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
 const tunedMidi=p=>{const m=p.ktune||'Root + fifth';if(m==='Off')return null;const sc=SC[G.scale]||[0],root=((G.root%12)+12)%12,pcs=[root];
  if(m!=='Root'&&sc.includes(7))pcs.push((root+7)%12);const mf=69+12*Math.log2(Math.max(20,p.pitch)/440);let best=null,bd=99;
  for(const[lo,hi]of[[40.5,60.5],[36,66]]){for(let n=Math.floor(mf)-9;n<=Math.ceil(mf)+9;n++){const hz=440*Math.pow(2,(n-69)/12);if(hz<lo||hz>hi)continue;if(pcs.includes(((n%12)+12)%12)){const d=Math.abs(n-mf);if(d<bd){bd=d;best=n}}}if(best!=null)break}return best};
 const hzOf=n=>440*Math.pow(2,(n-69)/12);
 window.kickTune=()=>{const n=tunedMidi(TR[0].p);return n==null?null:{note:NOTE[n%12]+(Math.floor(n/12)-1),hz:+hzOf(n).toFixed(1)}};
 const _fv=fireVoice;fireVoice=function(k,w){if(k!==0)return _fv.apply(this,arguments);const P=TR[0].p,o=P.pitch,n=tunedMidi(P);if(n==null)return _fv.apply(this,arguments);
  P.pitch=+hzOf(n).toFixed(2);try{return _fv.apply(this,arguments)}finally{P.pitch=o}};
 // UI: a menu under the kick's Pitch fader that names the note it lands on
 const lab=()=>{const t=window.kickTune&&kickTune();return 'Tune to key'+(t?' · '+t.note:'')};
 const addUI=()=>{const c=TR[0].mb&&TR[0].mb.closest('.card');if(!c||c.querySelector('[data-ktune]'))return;const g=c.querySelector('.grid');if(!g)return;
  const el=mkSel('Tune to key',['Root + fifth','Root','Off'],TR[0].p.ktune||'Root + fifth',v=>{TR[0].p.ktune=v;upd()});el.dataset.g='snd';el.dataset.ktune=1;
  const pit=[...g.children].find(x=>/^Pitch/.test((x.textContent||'').trim()));if(pit)pit.after(el);else g.appendChild(el);upd()};
 const upd=()=>{const el=document.querySelector('[data-ktune]');if(!el)return;el.firstChild.textContent=lab();const s=el.querySelector('select');if(s&&document.activeElement!==s){const v=TR[0].p.ktune||'Root + fifth';if(s.value!==v)s.value=v}};
 BUILD.hooks.push({post(){queueMicrotask(()=>queueMicrotask(()=>{try{addUI();try{tagCtl&&tagCtl()}catch(e){}}catch(e){}}))}});
 UI.on(()=>{if(!document.hidden)try{upd()}catch(e){}});
 try{addUI()}catch(e){}}
