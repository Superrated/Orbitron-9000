/* ---- v154: a fader that an LFO is moving turns violet and shows which LFO (A / B / C) ---- */
{const MAP={'Lead cutoff':[4,['Cutoff']],'Lead resonance':[4,['Resonance']],'Lead decay':[4,['Decay']],'Lead detune':[4,['Detune ¢','Unison spread ¢']],'Lead glide':[4,['Glide time ms','Glide ms']],
  'Bass cutoff':[6,['Cutoff']],'Bass resonance':[6,['Resonance']],'Bass decay':[6,['Decay']],'Pad cutoff':[5,['Cutoff']],
  'Stab cutoff':[8,['Cutoff']],'Stab decay':[8,['Decay']],'Stab echo':[8,['Dub echo','Echo feedback']],'Hat tone':[1,['Tone']],'Hat decay':[1,['Decay']],
  'Delay feedback':['mix',['Delay feedback']],'Reverb mix':['mix',['Reverb mix']],'Shimmer':['mix',['Shimmer verb']],'Rumble':['mix',['Rumble']],'Delay mix':['mix',['Delay mix']],'Bus grit':['mix',['Bus grit']]};
 const NM=['A','B','C'],lab=d=>{const sp=d.firstChild;return sp&&sp.firstChild?sp.firstChild.textContent.trim():''};
 function scan(){const want=new Map();LFOS.forEach((L,i)=>{if(!(L.d>0))return;const m=MAP[L.tg];if(!m)return;
   const root=m[0]==='mix'?document.querySelector('#t-mix'):(TR[m[0]]&&TR[m[0]].mb&&TR[m[0]].mb.closest('.card'));if(!root)return;
   root.querySelectorAll('.sl').forEach(d=>{if(m[1].includes(lab(d))){const a=want.get(d)||[];a.push(NM[i]);want.set(d,a)}})});
  document.querySelectorAll('.sl.lfom').forEach(d=>{if(!want.has(d)){d.classList.remove('lfom');delete d.dataset.lfo;const b=d.querySelector('span>b');if(b)delete b.dataset.lfo}});
  want.forEach((a,d)=>{const t='LFO '+a.join('+');if(d.dataset.lfo!==t){d.dataset.lfo=t;d.classList.add('lfom');d.title='Moved by '+t;const b=d.querySelector('span>b');if(b)b.dataset.lfo=a.join('+')}})}
 UI.on(()=>{if(!document.hidden)try{scan()}catch(e){}});
 const st=document.createElement('style');st.textContent=`.sl.lfom>span{color:#c89bff!important}.sl.lfom>span>b::before{content:'~' attr(data-lfo) ' ';font-size:10px;letter-spacing:.06em;color:#c89bff;opacity:.85;font-weight:600}
.sl.lfom input[type=range]{filter:hue-rotate(205deg) saturate(1.6) brightness(1.1)}.sl.lfom .st{border-color:#a77bff!important}.sl.lfom>span b{color:#c89bff!important}`;document.head.appendChild(st)}

