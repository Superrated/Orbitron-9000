
/* ---- v0.22: Perc sound page shows only what the chosen sound uses. Perc sound menu on top, then that sound's own controls,
   then Tuning/Tune (Blip and Marimba), then Level and the sends. The Filter fader also works on the Marimba now.
   Filter res / env / mode get their real defaults (they showed NaN). ---- */
{const P3=()=>TR[3].p;const fixDef=()=>{const p=P3();if(p.fres==null)p.fres=4;if(p.fenvp==null)p.fenvp=.5;if(p.pmode==null)p.pmode=0};
 const OWN={Blip:['FM','Decay','Pitch oct','Mod ratio','Mod decay','Pitch bend','Drop time','Drive','Noise click','Filter','Filter res','Filter env','Filter mode (LP·BP·HP)'],
  Marimba:['Marimba octave','Marimba decay','Filter'],Ride:['Ride tone','Ride decay','Ride bell'],Conga:['Decay','Pitch oct','Pitch bend','Noise click','Filter'],Cowbell:['Decay','Pitch oct','Filter']};
 const ALL=new Set([].concat(...Object.values(OWN))),TUNE=['Tuning','Tune'],SH=['Level','Delay send','Reverb send'];
 const lab=d=>{const sp=d.firstChild;if(!sp)return'';if(sp.nodeType===3)return sp.textContent.trim();return sp.firstChild?sp.firstChild.textContent.trim():''};
 const st=document.createElement('style');st.textContent='.card .sl.pvx{display:none!important}';document.head.appendChild(st);
 const apply=()=>{const T=TR[3],card=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.hd span')?.textContent===T.n);if(!card)return;
  const pv=T.p.pv==='Woodblock'?'Marimba':(OWN[T.p.pv]?T.p.pv:'Blip'),own=OWN[pv];
  card.querySelectorAll('.sl').forEach(d=>{if(d.dataset.g!=='snd')return;const l=lab(d),tn=TUNE.find(x=>l===x||l.startsWith(x+' ('));let hide=false,o=0;
   if(l==='Perc sound')o=-50;else if(ALL.has(l)){const i=own.indexOf(l);hide=i<0;o=i<0?60:-40+i}
   else if(tn){hide=pv==='Ride';o=20+TUNE.indexOf(tn)}else if(SH.includes(l))o=30+SH.indexOf(l);
   d.classList.toggle('pvx',hide);d.style.order=o})};
 fixDef();
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{fixDef()}catch(e){}return r};
 BUILD.hooks.push({pre(){try{fixDef()}catch(e){}},post(){setTimeout(()=>{try{apply()}catch(e){}},5)}});
 if(window.setPercSound){const _s=setPercSound;window.setPercSound=function(){const r=_s.apply(this,arguments);setTimeout(apply,5);return r}}
 document.addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('.card'))setTimeout(()=>{try{apply()}catch(_){}},5)},true);
 UI.on(()=>{try{apply()}catch(e){}})}
