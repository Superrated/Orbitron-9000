
/* ---- v0.22: pad Progression menu lists every progression Launch can play, grouped: this mood, lengths of the playing progression
   (2, 3, 4, 6, 8 chords, as Launch makes them), the four dark-harmony families, then every other mood. Whatever plays shows by name;
   "(custom)" only after a manual chord edit. Choosing one never changes the scale or anything else. ---- */
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
 let ENT=[],SIG='';
 function build_(){const M=MOODS[curMood]||{},E=[],seen=new Set(),ck=curKey(),add=(g,v,lab,a,sh,L)=>{E.push({g,v,lab,a,sh,L:L||a.length,k:ky(VAR(a,L||a.length))})};
  (M.pr||[]).forEach(a=>{add('This mood · '+MN(curMood),plab(a),nm(a),a,M.sh);seen.add(ky(a))});
  // the playing progression's base (any library) and its lengths
  const bases=[];(M.pr||[]).forEach(a=>bases.push([a,M.sh]));Object.values(window.HARMFAM||{}).forEach(F=>F.pr.forEach(a=>bases.push([a,F.sh])));
  Object.keys(MOODS).forEach(k=>(MOODS[k].pr||[]).forEach(a=>bases.push([a,MOODS[k].sh])));
  const hit=bases.find(([a])=>a.length===4&&[2,3,4,6,8].some(L=>ky(VAR(a,L))===ck));
  if(hit){const[a,sh]=hit;[2,3,4,6,8].forEach(L=>add('Same chords · shorter or longer','len:'+L+':'+plab(a),L+' chords:  '+VAR(a,L).map(cn).join(' '),a,sh,L))}
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
  const m=ENT.find(e=>e.k===ck&&!e.v.startsWith('len:'))||ENT.find(e=>e.k===ck);const v=m?m.v:'custom';if(s.value!==v)s.value=v}
 BUILD.hooks.push({post(){setTimeout(()=>{try{SIG='';sync()}catch(e){}},30)}});
 UI.on(()=>{try{sync()}catch(e){}})}
