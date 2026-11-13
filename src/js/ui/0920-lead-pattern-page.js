/* ---- v137: Lead pattern page grouped (RHYTHM / NOTES / LOOP / FEEL) with a one-line description of the arp mode; every fader the current
   mode or engine doesn't use is greyed out and locked, on the Pattern and Sound pages. ---- */
{window.ctlOff=(el,off,why)=>{if(!el)return;el.classList.toggle('ctloff',!!off);el.title=off?'Not used now: '+why:'';el.querySelectorAll('input,button,select').forEach(x=>x.disabled=!!off)};
 const MODEINFO={'Marbles':'Random notes around Bias, Spread wide. Loop len notes repeat; Déjà vu decides how often they stay.',
  'Interval':'A random walk: each note steps from the last one. Loop len notes repeat; Déjà vu keeps them.',
  'Motif':'A short written phrase of Loop len notes that repeats; Déjà vu below 1 slowly mutates it.',
  'Up':'Climbs the scale over Range octaves and starts again.','Up/Down':'Climbs and falls over Range octaves.',
  'Random':'A fresh random note every hit, no loop.','Chord arp':'Arpeggiates the notes of the current chord up and down; Déjà vu below 1 adds skips.',
  'Acid 303':'A 16-step acid line with its own slides and accents; Déjà vu below 1 mutates it each bar.'};
 const minfo=m=>MODEINFO[m]||(window.MODEINFO_EXT||{})[m]||'';
 const LOOPM=['Marbles','Interval','Motif','Turing loop'],RUNM=['Up','Up/Down','Chord arp','Converge','Diverge','Pedal arp'];
 const USE={ // pattern faders: modes that read them
  'Range oct':m=>m!=='Acid 303','Spread':m=>m==='Marbles'||m==='Interval','Bias':m=>m==='Marbles',
  'Déjà vu':m=>!['Up','Up/Down','Random','Converge','Diverge','Pedal arp'].includes(m),'Loop len':m=>LOOPM.includes(m),
  'Chord lock':m=>['Marbles','Interval','Up','Up/Down','Random','Turing loop'].includes(m),'Reseed':m=>LOOPM.includes(m)||m==='Acid 303',
  'Accent chance':m=>m==='Acid 303','Cycle (0 = off)':m=>RUNM.includes(m),'Note repeat':m=>m!=='Acid 303','Reset on bar':m=>m!=='Acid 303'&&m!=='Random'};
 const WHY={'Range oct':'Acid 303 has its own range','Spread':'only Marbles and Interval','Bias':'only Marbles','Déjà vu':'this mode doesn’t loop or mutate',
  'Loop len':'only the loop modes (Marbles, Interval, Motif, Turing loop) use it; the others use Cycle','Cycle (0 = off)':'loop modes use Loop len instead','Note repeat':'Acid 303 has its own line','Reset on bar':'this mode has no position to reset','Chord lock':'this mode already follows the chord or has its own notes','Reseed':'this mode has no random seed','Accent chance':'only Acid 303'};
 const POLY=['att','crush','cut','dec','det','drv','ds','envA','fenv','fmi','fmr','fold','fsym','ft','glide','grit','gt','hold','kt','oct2','pdec','penv','pg','pw','rel','res','rs','subosc','sus','uni','usp','vib','vibr','vow','wave','wid','eng'];
 const MINI=['att','cut','dec','ds','dsw','envA','fatt','fdec','fsus','glk','hold','kt','mnz','o1l','o1r','o1w','o2d','o2l','o2r','o2w','o3d','o3l','o3r','o3w','pg','rel','res','rs','sus','vib','vibr','eng'];
 const ACID=['acc3','cut','dec','drv','ds','envA','gt','res','rs','wave','glide'];
 const SELK={'Engine':'eng','Filter type':'ft','Osc 1 wave':'o1w','Osc 1 range':'o1r','Osc 2 wave':'o2w','Osc 2 range':'o2r','Osc 3 wave':'o3w','Osc 3 range':'o3r'};
 const lab=el=>{const f=el.firstChild;if(!f)return'';return(f.nodeType===3?f.textContent:(f.firstChild&&f.firstChild.textContent)||el.textContent).trim()};
 function keyOf(l){if(SELK[l])return SELK[l];const x=TR[4].x.find(x=>x[0]===l);return x?x[1]:null}
 function layout(card,g){if(card.querySelector('.lhd'))return;const all=[...card.querySelectorAll('.sl,label.sl,button')],by=n=>all.find(e=>lab(e)===n&&e.dataset.g==='pat');
  const steps=by('Steps');if(!steps)return;const hdr=(t,h)=>{const d=document.createElement('div');d.className='bksep bhd lhd';d.innerHTML=t+'<small>'+h+'</small>';d.dataset.g='pat';return d};
  const info=document.createElement('p');info.className='gnote lmodei';info.dataset.g='pat';info.style.cssText='grid-column:1/-1;margin:0 0 2px;opacity:.75';
  const RSO=['Off','Every bar','Every 2 bars','Every 4 bars'],P4=TR[4].p,rsb=mkSel('Reset on bar',RSO,RSO[[0,1,2,0,3][P4.rst||0]||0],v=>{P4.rst=[0,1,2,4][RSO.indexOf(v)]});rsb.classList.add('lrst');
  const order=[hdr('Rhythm','the Euclid ring · when the lead plays'),steps,by('Hits'),by('Rotate'),by('Tension'),
   hdr('Notes','which pitches'),by('Arp mode'),info,by('Range oct'),by('Chord lock'),by('Spread'),by('Bias'),
   hdr('Loop & cycle','length · repeats · restart'),by('Loop len'),by('Déjà vu'),by('Cycle (0 = off)'),by('Note repeat'),rsb,by('Reseed'),
   hdr('Feel','slides and accents'),by('Glide chance'),by('Glide time ms'),by('Accent chance')].filter(Boolean);
  const rs=by('Reseed');if(rs)rs.style.gridColumn='1/-1';
  order.forEach(e=>{e.dataset.g='pat';e.dataset.keep='pat';steps.parentElement.appendChild(e)});
  const am=by('Arp mode');if(am){const sel=am.querySelector('select');if(sel)sel.addEventListener('change',()=>setTimeout(refresh,0))}}
 function refresh(){const T=TR[4],P=T.p,card=T.mb&&T.mb.closest('.card');if(!card)return;const m=P.mode,acid=m==='Acid 303',eng=(!P.eng||P.eng==='Saw')?'Stack':P.eng;
  const used=acid?ACID:eng==='Mini'?MINI:POLY,vn=acid?'the Acid 303 voice':eng==='Mini'?'the Mini engine':'the '+eng+' engine';
  const rsS=card.querySelector('label.lrst select');if(rsS)rsS.value=['Off','Every bar','Every 2 bars','Every 4 bars'][[0,1,2,0,3][P.rst||0]||0];const info=card.querySelector('.lmodei');if(info)info.textContent=minfo(m);
  card.querySelectorAll('.sl,label.sl,button').forEach(el=>{const l=lab(el);if(!l)return;
   if(el.dataset.g==='pat'){if(USE[l])ctlOff(el,!USE[l](m),WHY[l]);return}
   if(el.dataset.g!=='snd'||l==='Level')return;if(l==='Engine'){ctlOff(el,acid,'Acid 303 uses its own voice');return}
   const k=keyOf(l);if(!k)return;ctlOff(el,!used.includes(k),'not part of '+vn)})}
 window.leadRefresh=refresh;
 const _lp=leadPages;leadPages=function(){_lp.apply(this,arguments);try{const c=TR[4].mb&&TR[4].mb.closest('.card');if(c){const g=c.querySelector('.grid');layout(c,g)}refresh()}catch(e){}};
 const _gn=generate;generate=function(){const r=_gn.apply(this,arguments);setTimeout(()=>{try{refresh()}catch(e){}},0);return r};
 const st=document.createElement('style');st.textContent='.ctloff{opacity:.32;filter:grayscale(1)}.ctloff input,.ctloff button,.ctloff select{pointer-events:none}';document.head.appendChild(st)}

