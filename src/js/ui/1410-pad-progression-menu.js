
/* ---- v0.22: pad Progression menu lists every progression Launch can play, grouped: this mood, lengths of the playing progression
   (2, 3, 4, 6, 8 chords, as Launch makes them), the four dark-harmony families, then every other mood. Whatever plays shows by name;
   "(custom)" only after a manual chord edit. Choosing one never changes the scale or anything else.
   v0.5: easier to use — ◀ ▶ buttons beside the menu step to the previous / next progression (try them by ear without opening
   the long list), and the "Same chords · shorter or longer" group became a row of chord-count chips (2 3 4 6 8) under the menu. ---- */
{const RN=['1','2','3','4','5','6','7'],plab=a=>a.map(x=>typeof x==='number'?RN[((x%7)+7)%7]:x).join('–');
 /* v0.22: entries read as chord names in the current key ("Am F Dm Em · 1–6–4–5") */
 const cn=x=>{const s=SC[G.scale]||[0,2,3,5,7,8,10],n=s.length,pc=d=>((G.root+s[((d%n)+n)%n]+12*Math.floor(d/n))%12+12)%12;
   if(typeof x==='number'){const r=pc(x),t=(pc(x+2)-r+12)%12,f=(pc(x+4)-r+12)%12;return NN[r]+(t===3?(f===6?'dim':'m'):t===4&&f===8?'aug':'')}
   const m=/^([b#]?)([ivIV]+)$/.exec(x);if(!m)return String(x);const r=((G.root+(RMN[m[2].toUpperCase()]||0)+(m[1]==='b'?-1:m[1]==='#'?1:0))%12+12)%12;return NN[r]+(m[2]===m[2].toLowerCase()?'m':'')};
 const nm=a=>a.map(cn).join(' ')+'  ·  '+plab(a);
 const FEEL={bright:['Hopeful','Italo','The Touch','Melodic House','Dreamy','Vector'],deep:['Melancholic','Ethereal','Deep Space','Ambient','Drone','Noir']},
  feel=k=>FEEL.bright.includes(k)?'More · bright & uplifting':FEEL.deep.includes(k)?'More · melancholic & deep':'More · dark & driving',
  FAMN={'cinematic minor':'Dark · cinematic','phrygian':'Dark · ominous','hypnotic':'Dark · hypnotic (1–2 chords)','suspended':'Dark · floating'};
 const VAR=(a,L)=>L===2?a.slice(0,2):L===3?a.slice(0,3):L===6?a.concat(a.slice(0,2)):L===8?a.concat([a[0],a[1],a[3],a[2]]):a;
 const ky=a=>JSON.stringify(a.map(x=>{const c=chordSpec(x);return[c.d,c.x||0]})),curKey=()=>JSON.stringify(prog.map((d,i)=>[d,(PX&&PX[i])||0]));
 let ENT=[],SIG='',HIT=null;
 function build_(){const M=MOODS[curMood]||{},E=[],seen=new Set(),ck=curKey(),add=(g,v,lab,a,sh,L)=>{E.push({g,v,lab,a,sh,L:L||a.length,k:ky(VAR(a,L||a.length))})};
  (M.pr||[]).forEach(a=>{add('This mood · '+MN(curMood),plab(a),nm(a),a,M.sh);seen.add(ky(a))});
  // the playing progression's base (any library) and its lengths
  const bases=[];(M.pr||[]).forEach(a=>bases.push([a,M.sh]));Object.values(window.HARMFAM||{}).forEach(F=>F.pr.forEach(a=>bases.push([a,F.sh])));
  Object.keys(MOODS).forEach(k=>(MOODS[k].pr||[]).forEach(a=>bases.push([a,MOODS[k].sh])));
  const hit=bases.find(([a])=>a.length===4&&[2,3,4,6,8].some(L=>ky(VAR(a,L))===ck));
  HIT=hit?{a:hit[0],sh:hit[1]}:null;
  const FAM=window.HARMFAM||{};Object.keys(FAM).forEach(f=>FAM[f].pr.forEach((a,i)=>{if(seen.has(ky(a)))return;seen.add(ky(a));add(FAMN[f]||('Dark · '+f),'fam:'+f+':'+i,nm(a),a,FAM[f].sh)}));
  const more=[];Object.keys(MOODS).filter(k=>k!==curMood).forEach(k=>(MOODS[k].pr||[]).forEach((a,i)=>{if(seen.has(ky(a)))return;seen.add(ky(a));more.push([feel(k),'mood:'+k+':'+i,nm(a),a,MOODS[k].sh])}));
  ['More · bright & uplifting','More · melancholic & deep','More · dark & driving'].forEach(g=>more.filter(m=>m[0]===g).forEach(m=>add(...m)));
  return E}
 function apply(e){const T=TR[5],full=T.h>=T.st,sp=VAR(e.a,e.L).map(chordSpec);prog=sp.map(q=>q.d);PX=sp.map(q=>q.x);T.st=prog.length;T.h=full?T.st:Math.min(T.h,T.st);
  pshape=prog.map(()=>pick(e.sh||(MOODS[curMood]||{}).sh||['7']));pmean=null;PTOP=null;T.pt=pat(T);try{if(typeof PD!=='undefined'&&PD&&PD.length!==T.st)PD=null}catch(_){}SIG='';build()}
 window.padProgApply=(a,L,sh)=>apply({a,L:L||a.length,sh});
 const find=()=>[...document.querySelectorAll('label[data-pp]')].find(l=>l.firstChild&&l.firstChild.nodeType===3&&l.firstChild.textContent.trim()==='Progression');
 function sync(){const l=find();if(!l)return;const s=l.querySelector('select');if(!s||document.activeElement===s)return;
  const ck=curKey(),sig=curMood+'|'+ck+'|'+G.scale+'|'+G.root+'|'+padStyle;
  if(sig!==SIG||!s.querySelector('optgroup')){SIG=sig;ENT=build_();s.innerHTML='';s.add(new Option(padStyle==='Progression'||padStyle==='Pedal chords'?'(custom)':'(set by '+padStyle+')','custom'));let og=null,gn='';
   ENT.forEach(e=>{if(e.g!==gn){gn=e.g;og=document.createElement('optgroup');og.label=e.g;s.appendChild(og)}og.appendChild(new Option(e.lab,e.v))});
   s.dataset.mood=curMood;s.onchange=()=>{const e=ENT.find(x=>x.v===s.value);if(e)apply(e)}}
  const m=ENT.find(e=>e.k===ck);const v=m?m.v:'custom';
  const o0=s.options[0];if(o0&&o0.value==='custom'){const t=!m&&HIT&&(padStyle==='Progression'||padStyle==='Pedal chords')?VAR(HIT.a,prog.length).map(cn).join(' ')+'  ·  '+prog.length+' chords':o0.dataset.t||(o0.dataset.t=o0.text);if(o0.text!==t)o0.text=t}
  if(s.value!==v)s.value=v;nav(l,s)}
 /* v0.5: ◀ ▶ step through the menu; chips change the number of chords of the same progression */
 const step=d=>{if(!ENT.length)ENT=build_();const ck=curKey();let i=ENT.findIndex(e=>e.k===ck);i=i<0?(d>0?0:ENT.length-1):(i+d+ENT.length)%ENT.length;apply(ENT[i])};
 function nav(l,s){let w=l.querySelector('.ppn');if(!w){l.classList.add('ppfull');w=document.createElement('div');w.className='ppn';
   const b=(t,d,ti)=>{const x=document.createElement('button');x.type='button';x.className='ppst';x.textContent=t;x.title=ti;x.onclick=e=>{e.preventDefault();e.stopPropagation();step(d)};return x};
   s.replaceWith(w);w.append(b('◀',-1,'Previous progression'),s,b('▶',1,'Next progression'));
   const c=document.createElement('div');c.className='ppc';l.appendChild(c)}
  const c=l.querySelector('.ppc'),n=prog.length,sig=HIT?plab(HIT.a)+'|'+n:'';if(c.dataset.sig===sig)return;c.dataset.sig=sig;c.innerHTML='';c.hidden=!HIT;if(!HIT)return;
  c.appendChild(Object.assign(document.createElement('span'),{textContent:'chords'}));
  [2,3,4,6,8].forEach(L=>{const x=document.createElement('button');x.type='button';x.className='ppch'+(L===n?' on':'');x.textContent=L;x.title=L+' chords: '+VAR(HIT.a,L).map(cn).join(' ');
   x.onclick=e=>{e.preventDefault();e.stopPropagation();if(L!==prog.length)apply({a:HIT.a,L,sh:HIT.sh})};c.appendChild(x)})}
 {const st=document.createElement('style');st.textContent=`.card[data-k="5"] label.ppfull{grid-column:1/-1}
 .ppn{display:flex;gap:6px;align-items:stretch}.ppn select{flex:1;min-width:0}
 .ppst,.ppch{border-radius:0;background:#0f2418;border:1px solid rgba(0,255,156,.32);color:var(--acc,#ffe44d);font:inherit;font-weight:700;cursor:pointer;padding:0;
  clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))}
 .ppst{width:34px;min-height:34px;font-size:12px;flex:none}.ppst:active,.ppch:active{background:rgba(255,228,77,.16)}
 .ppc{display:flex;gap:5px;align-items:center;margin-top:6px}.ppc[hidden]{display:none}.ppc span{font-size:10px;letter-spacing:.08em;opacity:.7;margin-right:4px}
 .ppch{width:34px;height:28px;font-size:12px}.ppch.on{background:var(--acc,#ffe44d);color:#0b1a12;border-color:var(--acc,#ffe44d)}`;document.head.appendChild(st)}
 BUILD.hooks.push({post(){setTimeout(()=>{try{SIG='';sync()}catch(e){}},30)}});
 UI.on(()=>{try{sync()}catch(e){}})}
