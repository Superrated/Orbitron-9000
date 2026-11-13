
/* ---- v0.75: PATTERN and SOUND pages are laid out the same way on every instrument.
   Pattern · every card opens with a "Rhythm" section (the ring), then its own sections, each with the same kind of heading: a name and a short
             hint. Drums: Rhythm · Feel. Stab: Rhythm · Notes. Satellite: Rhythm · Part. Pad's headings use the same style. The dice row
             ("New bassline") sits at the top, as on Lead and Pad.
   Sound   · every card opens with a "Sound" heading, the sound menu (where there is one) and Level; echo / reverb sends come last under "Space".
             The kick's Techno rumble is a sound setting: on a phone it now shows on the Sound page only.
   Wide screens (pattern and sound side by side): the sound controls always follow the pattern controls (Pad had them in front), and the lead's
   Osc / Filter / Amp / Mod / FX pages work there too (every page used to show at once, with unused controls greyed).
   Faders: Hits and Rotate never run past the number of Steps (half their travel used to do nothing on a 16-step ring); Steps goes to 64, the
   length some Launches already use (touching the fader used to snap those rings to 32); a setting without a value shows its minimum, not "NaN";
   longer Decay on Perc (1 s), Bass (1.2 s) and Stab (1.5 s).
   Nothing is moved in the page itself — only headings are added and the display order is set — so every older layer keeps finding its controls. ---- */
{const st=document.createElement('style');st.textContent=`
.coh-s{color:var(--acc,#ffe44d)!important;border-top-color:rgba(255,228,77,.3)!important}
[data-mode=pat] .rumbx{display:none}
.rumbx{border-top:1px dashed rgba(255,228,77,.3)!important}.rumbx .rumh{font:700 10px ui-monospace,monospace!important;letter-spacing:.16em!important;color:var(--acc,#ffe44d);opacity:1!important}
@media (min-width:1000px){#t-drums [data-mode=pat] .rumbx,#t-drums[data-mode=pat] .rumbx{display:block}
 #t-synth .card[data-k="4"] .grid>.ctloff:not([data-g="pat"]),#t-synth .card .grid>[data-g=snd][style*="display: none"],#t-drums .card .grid>[data-g=snd][style*="display: none"],#t-drums .card .grid>.pvx.ctloff{display:none!important}}`;document.head.appendChild(st);
 try{[[3,1],[6,1.2],[8,1.5]].forEach(([k,mx])=>{const e=(TR[k].x||[]).find(e=>e[1]==='dec');if(e&&e[3]<mx)e[3]=mx})}catch(e){}
 try{const X=TR[4].x,f=k=>X.find(e=>e[1]===k),h=f('hold');if(h&&h[3]<16)h[3]=16;['o2d','o3d'].forEach(k=>{const e=f(k);if(e){e[2]=Math.min(e[2],-1250);e[3]=Math.max(e[3],1250)}})}catch(e){}   /* lead patches go to Note length 16 and an octave plus a few cents of detune; the faders stopped at 8 and ±1200 */
 const NAME={0:'kick',1:'hi-hat',2:'clap',3:'perc',7:'snare',8:'stab',9:'Satellite'},SENDS={'Delay send':1,'Reverb send':1,'Reverb':1},SNDSEL={'Sound':1,'Pad sound':1,'Movement':1,'Perc sound':1},PART={'Role':1,'Motion':1,'Register':1,'Amount':1};
 const lab=el=>{if(el._cl!=null)return el._cl;const f=el.firstChild;let t='';if(f)t=f.nodeType===3?f.textContent:(f.firstChild&&f.firstChild.nodeType===3?f.firstChild.textContent:'');return el._cl=(t||'').trim()};
 const hdr=(t,h,g,cls)=>{const d=document.createElement('div');d.className='bksep bhd coh '+cls;d.innerHTML=t+'<small>'+h+'</small>';d.dataset.g=g;d.dataset.keep=g;d._cl='';return d};
 const restyle=(e,t,h)=>{e.classList.add('bksep','bhd');e.innerHTML=t+'<small>'+h+'</small>'};
 /* three faders that were really switches with number codes (0 · 1 · 2 …) are shown as menus. The fader stays underneath, hidden, and the
    menu moves it, so everything that reads or sets the fader keeps working. */
 const CODED={'Filter mode (LP·BP·HP)':['Filter mode',['Low-pass','Band-pass','High-pass']],'Sweep shape':['Sweep shape',['Sine','Ramp up','Ramp down','Random steps']],'Decay switch':['Release follows decay',['Off','On']]};
 const menu=(e,cd)=>{const i=e.querySelector('input[type=range]');if(!i)return;const cur=cd[1][Math.max(0,Math.min(cd[1].length-1,Math.round(+i.value)))];
  if(!e._menu){const l=mkSel(cd[0],cd[1],cur,v=>{i.value=cd[1].indexOf(v);i.dispatchEvent(new Event('input',{bubbles:true}))});l.style.margin='0';[...e.children].forEach(c=>{c.style.display='none'});e.appendChild(l);e._menu=l.querySelector('select')}
  else if(document.activeElement!==e._menu&&e._menu.value!==cur)e._menu.value=cur};
 function card(c){const k=+c.dataset.k,g=c.querySelector('.grid'),T=TR[k];if(!g||!T)return;let kids=[...g.children];const by=n=>kids.find(e=>lab(e)===n);
  // ---- headings
  if(NAME[k]!=null&&!g.querySelector(':scope>.coh-r')){const s=by('Steps');if(s){g.insertBefore(hdr('Rhythm','the Euclid ring · when the '+NAME[k]+' plays','pat','coh-r'),s)}}
  if(k===8&&!g.querySelector(':scope>.coh-n')){const s=by('Chord notes');if(s)g.insertBefore(hdr('Notes','how many chord tones','pat','coh-n'),s)}
  if(!g.querySelector(':scope>.coh-s0'))g.appendChild(hdr('Sound',k===4?'patch · engine · pages':'level · tone · character','snd','coh-s coh-s0'));
  kids=[...g.children];const hasSend=k!==4&&kids.some(e=>SENDS[lab(e)]&&e.dataset.g==='snd');
  if(hasSend&&!g.querySelector(':scope>.coh-s1'))g.appendChild(hdr('Space','echo and reverb','snd','coh-s coh-s1'));
  kids=[...g.children];
  for(const e of kids){const cl=e.classList;
   if(cl.contains('bksep')&&!cl.contains('bhd')){const t=e.textContent.trim();if(t==='Break feel')restyle(e,'Feel','accents · ghosts · variation from bar to bar');
    else if(cl.contains('satc')){restyle(e,'Part','role · motion · how much');e.dataset.g='pat';e.dataset.keep='pat'}else restyle(e,t,'')}
   else if(cl.contains('pph')&&!cl.contains('bhd')){const p=e.textContent.split('·');restyle(e,p[0].trim(),(p[1]||'').trim())}
   // ---- display order: pattern first, sound after; inside sound: heading, sound menu, Level … sends last
   const snd=e.dataset.g==='snd',l=lab(e);let own=null;if(CODED[l]&&e.tagName==='DIV'&&cl.contains('sl'))menu(e,CODED[l]);
   if(cl.contains('coh-s0'))own=-200;else if(cl.contains('coh-s1'))own=49;
   else if(snd&&k!==4){if(l==='Level')own=k===3?-45:-5;else if(SENDS[l])own=50;else if(SNDSEL[l]&&k!==3&&e.tagName==='LABEL')own=-10}
   else if(!snd){if(k===9&&(cl.contains('satc')||PART[l]))own=5;else if(k===6&&cl.contains('bassroll'))own=-100}
   if(own==null){if(e.style.order!==e._co)e._cb=parseInt(e.style.order)||0;own=e._cb||0}
   const want=String(own+(snd?1000:0));if(e.style.order!==want)e.style.order=want;e._co=want}
  // ---- Hits and Rotate follow Steps
  if(!T.pad){const fit=(n,mx)=>{const e=by(n);if(!e)return;const i=e.querySelector('input[type=range]');if(!i)return;e._max=mx;if(+i.max!==mx)i.max=mx};fit('Hits',T.st);fit('Rotate',Math.max(0,T.st-1))}}
 const run=()=>{const d=document.querySelector('#t-drums'),y=document.querySelector('#t-synth');if(!((d&&!d.hidden)||(y&&!y.hidden)))return;document.querySelectorAll('#t-drums .card,#t-synth .card').forEach(c=>{try{if(isShown(c))card(c)}catch(e){console.warn('[orbitron] layout',e)}})};   /* only the cards on screen (one at a time on a phone) */
 UI.on(run);window.orbCohere=run}
