
/* v162: menus follow the sound. After Launch, Random warp or a Sector recall, every track menu shows what is actually playing
   (lead patch, engine, filter, oscillators, arp mode, pad style/sound/movement, perc sound and tuning, pad pattern options). */
{const lab=s=>{const l=s.closest('label');return l&&l.childNodes[0]?l.childNodes[0].textContent.trim():''};
 const L=()=>TR[4].p,P5=()=>TR[5].p,P3=()=>TR[3].p;
 const GET={'Arp mode':()=>L().mode,'Engine':()=>(!L().eng||L().eng==='Saw')?'Stack':L().eng,'Filter type':()=>L().ft||'LP12',
  'Pad style':()=>padStyle,'Pad sound':()=>P5().patch,'Movement':()=>P5().mov||'Classic',
  'Perc sound':()=>P3().pv==='Woodblock'?'Marimba':P3().pv,'Tuning':()=>P3().mode==='Fixed'?'Fixed':'Follow scale',
  'Push':()=>PPUSH?'On':'Off','Inversions':()=>G.pvoice,'Top line':()=>G.ptl?'On':'Off'};
 const OSC={'Osc 1 wave':'o1w','Osc 1 range':'o1r','Osc 2 wave':'o2w','Osc 2 range':'o2r','Osc 3 wave':'o3w','Osc 3 range':'o3r'};
 const set=(s,v)=>{if(v==null||s.value===String(v))return;if([...s.options].some(o=>o.value===String(v)))s.value=String(v)};
 const sync=()=>{try{document.querySelectorAll('.card select').forEach(s=>{if(document.activeElement===s)return;
   if(s.getAttribute('aria-label')==='Lead patch'){set(s,LPRE[L().patch]?L().patch:'Custom');return}
   const k=lab(s);if(k==='Progression'&&s.closest('[data-pp]')){progSync(s);return}if(GET[k]){set(s,GET[k]());return}
   const ok=OSC[k];if(ok){const v=Math.round(L()[ok]||0),i=ok.endsWith('r')?v+2:v;if(s.options[i])set(s,s.options[i].value)}})}catch(e){}};

 // pad Progression menu: options come from the current mood, value names the progression that is playing
 const RN=['1','2','3','4','5','6','7'],plab=a=>a.map(x=>typeof x==='number'?RN[((x%7)+7)%7]:x).join('–');
 function progSync(s){const M=MOODS[curMood]||{},pr=M.pr||[],lib=pr.map(plab);
  if(s.dataset.mood!==curMood){s.dataset.mood=curMood;s.innerHTML='';['(custom)',...lib].forEach(o=>s.add(new Option(o,o)));
   s.onchange=()=>{const i=lib.indexOf(s.value);if(i<0)return;const T=TR[5],sp=pr[i].map(chordSpec);prog=sp.map(q=>q.d);PX=sp.map(q=>q.x);T.st=prog.length;T.h=Math.min(T.h,T.st);
    pshape=prog.map(()=>pick(M.sh||['7']));pmean=null;PTOP=null;T.pt=pat(T);if(typeof PD!=='undefined'&&PD&&PD.length!==T.st)PD=null;build()}}
  const i=pr.findIndex(a=>a.length===prog.length&&a.every((x,j)=>chordSpec(x).d===prog[j]&&(chordSpec(x).x||0)===((PX[j])||0)));
  set(s,i>=0?lib[i]:'(custom)')}
 window.syncMenus=sync;
 const _sf=window.syncFaders;if(_sf)window.syncFaders=function(){_sf.apply(this,arguments);sync()};
 const cv=()=>['#t-drums','#t-synth'].some(q=>{const e=document.querySelector(q);return e&&!e.hidden});const _g=generate;generate=function(){const r=_g.apply(this,arguments);if(cv()){setTimeout(sync,0);setTimeout(sync,150)}return r}; /* perf 6 */
 UI.on(()=>{if(!document.hidden&&['#t-drums','#t-synth'].some(q=>{const e=document.querySelector(q);return e&&!e.hidden}))sync()})}  /* perf 3: only while the cards are on screen */
