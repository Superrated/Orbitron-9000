/* ---- v89: pad variety, round three — chord colour locks per Launch, rhythmic chord patterns (offbeat stabs, house-organ syncopation), and a slow counter-line moving inside the chords ---- */
{const COL={Dreamy:['9','add9'],Ethereal:['sus2','sus4'],Tense:['quart'],'Deep Space':['quart','sus2'],Noir:['7'],Melancholic:['7','add9'],Hopeful:['add9'],Dark:['tri','sus4'],Italo:['tri'],Breaks:['9','7'],Acid:['tri','sus4'],Drone:['quart','sus2'],Bleep:['sus2','quart'],Power:['tri'],'Melodic House':['7','add9','9'],'Distorted Electro':['tri','quart'],Ambient:['add9','sus2','quart'],'Groove Techno':['tri','quart'],Temporal:['7','quart'],Vector:['9','7','add9']};
 const RHY={'Offbeat stabs':'0010001000100010','House organ':'1001001000100100','Push stabs':'0010010000100101','Two-step':'1000001000100010','Dotted':'1001001001001000','Trance 16ths':'1111111111111111'};window.orbPadRhy=RHY;
 const RCH={Hopeful:.3,Italo:.2,Acid:.3,Breaks:.3,Dark:.2,Tense:.2,Bleep:.25,'Melodic House':.35,'Distorted Electro':.05};
 const TLC={Melancholic:.5,Dreamy:.45,Ethereal:.45,Hopeful:.4,Noir:.35,'Deep Space':.35,Italo:.3,Breaks:.25,Dark:.2,Tense:.15};
 G.ptl=0;let tlLast=null;
 // counter-line: one extra soft voice per chord, moving by step around the chord's top
 const _p89=pad;pad=function(t,w,dur){const r=_p89(t,w,dur);if(!G.ptl||!cur||!cur.n||TR[5].m)return r;
  const n=SC[G.scale].length,top=Math.max(...cur.n),cand=[];for(let d=top-3;d<=top+3;d++)cand.push(d);
  let tgt=tlLast==null?top:tlLast;const ch=new Set(cur.n.map(x=>((x%n)+n)%n));
  const sc=cand.map(d=>{const dist=Math.abs(d-tgt),inC=ch.has(((d%n)+n)%n);return[d,(inC?0:1.2)+(dist===0?1.5:dist<=2?0:dist)+R()*.6]}).sort((a,b)=>a[1]-b[1]);const d=sc[0][0];tlLast=d;
  const o=XS,P=TR[5].p,f=d2f(d,(P.oct||3)+1);const e=w+dur+.6,os=osc('triangle',f,w,e),vb=osc('sine',5,w,e),vg=ctx.createGain(),g=ctx.createGain(),lp=ctx.createBiquadFilter();vg.gain.value=6;vb.connect(vg);vg.connect(os.detune);
  lp.type='lowpass';lp.frequency.value=2200;g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(TR[5].lv*.09,w+Math.min(.4,dur*.3));g.gain.setValueAtTime(TR[5].lv*.09,w+dur);g.gain.linearRampToValueAtTime(.0001,e);
  os.connect(lp);lp.connect(g);send(g,A.dk,.25,.45);return r};
 const GRX={Off:null,Disco:'1011011010110101',Eighths:'1010101010101010',Shuffle:'1101101101101101',Sparse:'1001001010010010',Stutter:'1111011101110111',...RHY};
 const _g89=generate;generate=function(){_g89();const M=MOODS[curMood]||{},P=TR[5].p;tlLast=null;
  // chord colour lock
  if(COL[curMood]&&R()<.45){const c=pick(COL[curMood]);pshape=prog.map(()=>c);pmean=null;G.pcol=c}else G.pcol=null;
  // rhythmic chord pattern instead of sustained chords
  if(R()<(RCH[curMood]||.1)){const k=pick(Object.keys(RHY));P.pgpat=RHY[k].split('').map(Number);P.pgate=.8;P.att=.01;P.rel=Math.min(P.rel||.3,.18);G.prhy=k}else G.prhy=null;
  // counter-line
  G.ptl=R()<(TLC[curMood]||0)?1:0;build()};
 // controls on the pad pattern page
 PATL.push('Top line');
 BUILD.hooks.push({post(){queueMicrotask(()=>queueMicrotask(()=>queueMicrotask(()=>{const c=[...document.querySelectorAll('.card')].find(c=>+c.dataset.k===5);if(!c)return;const g=c.querySelector('.grid');if(!g)return;
  if(!c.querySelector('[data-tl]')){const el=mkSel('Top line',['Off','On'],G.ptl?'On':'Off',v=>{G.ptl=v==='On'?1:0;tlLast=null});el.dataset.g='pat';el.dataset.tl=1;g.appendChild(el)}
  const gs=[...c.querySelectorAll('select')].find(s=>labOf(s.parentElement)==='Gate rhythm');if(gs&&![...gs.options].some(o=>o.value==='Offbeat stabs')){Object.keys(RHY).forEach(k=>gs.add(new Option(k,k)));const P=TR[5].p;if(G.prhy&&(P.pgate||0)>.01)gs.value=G.prhy;
   gs.addEventListener('change',()=>{const v=RHY[gs.value];if(v){P.pgpat=v.split('').map(Number);P.pgate=.8}})}})))}});build()}
