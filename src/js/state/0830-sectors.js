/* ---- v126: Sectors — 16 memory slots holding a full groove (patterns, sounds, chords, mix, LFOs). Save: tap SAVE, then a slot. 🔒 Protect blocks overwriting filled slots.
   Load: tap a slot; it is queued and swaps in on the next 4-bar boundary, from inside the step scheduler (data only: no generator, no new audio graph, drum hits pre-rendered while waiting).
   Tempo and key follow their locks; "Keep mutes" keeps the current mutes. Stored on the device.
   v1.0 CRATE: every filled slot shows its key and tempo ("Am · 128"), and the slots that make a good next groove light up, like a DJ's
   crate. Strong glow = key fits (same, relative major/minor or one step round the circle of fifths) AND tempo within 6 BPM AND energy
   within 1 level; soft glow = energy within 1 and key OR tempo fits. Energy is a hidden 1–9 rating per mood (ENERGY below). A locked key
   or tempo always counts as fitting (the slot will keep it anyway). A dot on a bank button = that bank holds a strong fit.
   v1.0 FULL RECALL: a sector also keeps the Satellite's note pattern (Sparkle/Arp template, Phase cell) and the 303 template, so the
   groove comes back exactly and later 303 edits rebuild from the same template; loading a sector of another mood resets the mix level
   keeper to that mood's start level, as a Launch does (it used to start 1–3 dB off and slide). Older saves load as before. ---- */
{const KEY='orb-sectors',N=16,EXG=new Set(['bpmLock','keyLock','fin','oct','master','pro']),SKIPT=new Set(['x','mb','cs','fl','el']);
 const msg=t=>{try{if(typeof say==='function')say(t)}catch(e){}};let SL=[];try{SL=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){SL=[]}if(!Array.isArray(SL))SL=[];while(SL.length<N)SL.push(null);SL.length=N;
 const PC_=['Kep','Zer','Vel','Orn','Thal','Nyx','Cael','Ur','Xan','Vesp','Lyr','Quor','Sol','Drav','Myr','Gal','Kor','Tor','Ard','Zeph','Ob','Phor','Ix','Ner','Alt','Glyn','Hesp','Jov','Rhed','Sar','Tes','Vor','Cor','Mar','Brin','Cass','Dex','Fen'],
  PV_=['a','e','i','o','u','y'],PE_=['ra','ron','rix','nos','lune','thys','dor','phi','vex','tara','mira','lon','xis','dris','kon','sor','nyx','lis','tan','gard','mos','ven','dion','rus'],
  PS_=['',' Prime',' IV',' VII',' IX',' b',' c',' d','-7','-12','-3',' Major',' II','',' X','',''];
 const BAD=/(.)\1\1|aa|ii|uu|yy|ae|ia|eo|uo|ou/;
 const pnm=()=>{for(let t=0;t<200;t++){const n=(pick(PC_)+pick(PV_)+pick(PE_));const w=n.charAt(0).toUpperCase()+n.slice(1).toLowerCase();if(BAD.test(w.toLowerCase())||w.length>8)continue;const f=(w+pick(PS_)).trim();if(f.length<=8&&!SL.some(x=>x&&x.nm===f))return f}return 'Orb-'+Math.floor(R()*900+100)};
 SL.forEach(x=>{if(x&&!x.nm)x.nm=pnm()});
 /* v0.26: 4 banks (A–D) of 16 slots; bank A is the old store, so existing sectors stay where they were */
 let bank=0;const BK=[SL];for(let b=1;b<4;b++){let a=[];try{a=JSON.parse(localStorage.getItem(KEY+'-b'+b)||'[]')}catch(e){}if(!Array.isArray(a))a=[];while(a.length<N)a.push(null);a.length=N;a.forEach(x=>{if(x&&!x.nm)x.nm=pnm()});BK.push(a)}
 try{bank=Math.max(0,Math.min(3,Math.round(+localStorage.getItem(KEY+'-bank')||0)))}catch(e){}SL=BK[bank];const BL='ABCD';
 const SS={prot:1,keepM:0,save:0,q:null,qi:-1,act:-1,held:0};try{const o=JSON.parse(localStorage.getItem(KEY+'-ui')||'{}');if(o.prot!=null)SS.prot=o.prot;SS.keepM=0}catch(e){}
 SS._q=-1;SS._a=-1;SS.qn='';
 const acc=k=>({get(){const g=SS[k];return g<0?-1:Math.floor(g/N)===bank?g%N:-2},set(v){SS[k]=v>=0?bank*N+v:-1},configurable:true});Object.defineProperty(SS,'qi',acc('_q'));Object.defineProperty(SS,'act',acc('_a'));
 const saveUI=()=>{try{localStorage.setItem(KEY+'-ui',JSON.stringify({prot:SS.prot,keepM:SS.keepM}))}catch(e){}};
 const cl=(v,d=0)=>{if(v==null)return v;const ty=typeof v;if(ty==='number')return isFinite(v)?v:0;if(ty!=='object')return ty==='function'?undefined:v;if(d>7)return undefined;
  if(Array.isArray(v))return v.map(x=>{const c=cl(x,d+1);return c===undefined?null:c});if(Object.getPrototypeOf(v)!==Object.prototype)return undefined;const o={};for(const k in v){const c=cl(v[k],d+1);if(c!==undefined)o[k]=c}return o};
 function snap(){/* v0.5: a 303 lead that hasn't played yet gets its line now (as its first note would), so the saved ring and line match */try{const p=TR[4].p;if(p.mode==='Acid 303'&&!AC.keep&&AC.key!==G.scale+'|'+p.seed+'|'+(+p.glide||0).toFixed(2)+'|'+(+p.accp||0).toFixed(2))acidGen(p)}catch(e){}
 const g={};for(const k in G){if(EXG.has(k))continue;const c=cl(G[k]);if(c!==undefined)g[k]=c}
  return{v:1,v4:1,mood:curMood,sel:$('#mood').value,padStyle,G:g,TR:TR.map(T=>{const o={};for(const k of Object.keys(T)){if(SKIPT.has(k))continue;const c=cl(T[k]);if(c!==undefined)o[k]=c}return o}),
   LF:cl(LFOS),TRIM:TRIM.slice(),prog:prog.slice(),pshape:pshape.slice(),PX:PX.slice(),PD:PD?PD.slice():null,PPUSH,mot:mot.slice(),buf:cl(buf),BPH:cl(window.BPH||null),RIFF:window.orbRiff&&orbRiff.t?{t:cl(orbRiff.t),f:cl(orbRiff.f)}:null,TU:window.TURING?TURING.get():[],FEEL:window.orbFeel?orbFeel.get():null,ACID:(typeof AC!=='undefined'&&AC.n&&AC.n.length)?{n:cl(AC.n),a:cl(AC.a),s:cl(AC.s),cell:AC.cell||8}:null,ATPL:window.orbAcid?cl(orbAcid.tpl):null,
   SAT:window.orbSatState?{tpl:cl(orbSatState.tpl),cell:cl(orbSatState.cell),ci:orbSatState.ci}:null}}
 const persist=()=>{try{localStorage.setItem(KEY+(bank?'-b'+bank:''),JSON.stringify(SL))}catch(e){msg('▲ SECTOR MEMORY FULL · could not store on this device')}};
 // pre-render the sector's drum hits while it waits, staggered, so the boundary itself costs nothing
 function prewarm(S){if(!ctx||!window.DR||!window.OfflineAudioContext)return;[0,7,2].forEach((k,j)=>setTimeout(()=>{try{const o=S.TR[k];if(!o||!o.p)return;const T=TR[k],sv=T.p,p=Object.assign({},sv,o.p);T.p=p;
   try{const key=DR.key(k,p);if(key&&!DR.cache.has(key)&&!DR.pend.has(key)){DR.pend.add(key);DR.render(k,key,FIX)}}finally{T.p=sv}}catch(e){}},60+j*90));
  try{if(S.G&&S.G.shx>0&&typeof shimmerInit==='function')setTimeout(()=>{try{shimmerInit()}catch(e){}},400)}catch(e){}}
 function apply(S,w){window.__orbFromLaunch=0;const mm=TR.map(T=>T.m),kb=G.bpm,kr=G.root,ksc=G.scale,km=curMood;
  TR.forEach((T,k)=>{const o=S.TR[k];if(!o)return;const old=k===9&&!S.v4&&!(o.p&&o.p.role);for(const key in o){if(key==='n'||key==='c'||key==='pan')continue;   /* v1.0: no pan sliders — old saved pans stay centred */if(key==='p'&&T.p&&o.p){if(!old){if(S.v4)for(const pk in T.p){const v=T.p[pk];if(!(pk in o.p)&&(v==null||typeof v!=='object'&&typeof v!=='function'))delete T.p[pk]} /* v0.4 saves are complete: recall exactly what was saved */Object.assign(T.p,o.p);if(k===4&&!('chd' in o.p))T.p.chd='';if(k===6&&!('beng' in o.p))T.p.beng=''}}else T[key]=o[key]}if(old)T.m=true;if(!('tsd' in o))delete T.tsd});
  ['bchar','flav','bed','bedLv','brole','padAuto'].forEach(k=>{if(S.G&&!(k in S.G))delete G[k]});if(S.v4&&S.G)for(const k in G){const v=G[k];if(!(k in S.G)&&!EXG.has(k)&&typeof v!=='function'&&!(v instanceof AudioNode))delete G[k]} /* v0.4 saves: no leftovers from a later Launch */window.BPH=S.BPH||null;try{if(S.FEEL&&S.FEEL.m&&window.orbFeel)orbFeel.set(S.FEEL.m,S.FEEL.a)}catch(e){}try{if(S.ACID&&typeof AC!=='undefined'){const P=TR[4].p;AC.n=cl(S.ACID.n);AC.a=cl(S.ACID.a);AC.s=cl(S.ACID.s);AC.cell=S.ACID.cell;AC.keep=1}}catch(e){}try{if('ATPL' in S&&window.orbAcid)orbAcid.tpl=cl(S.ATPL)}catch(e){}
  try{if(S.SAT&&window.orbSatState){const T=orbSatState;T.tpl=S.SAT.tpl?cl(S.SAT.tpl):null;T.cell=cl(S.SAT.cell);T.ci=S.SAT.ci}}catch(e){}   /* v1.0: the Satellite's notes travel with the pattern */ /* v0.5: the 303 line travels with the pattern */ /* v0.4: FEEL travels with the pattern */if(window.orbRiff){orbRiff.t=S.RIFF?S.RIFF.t:null;orbRiff.f=S.RIFF?S.RIFF.f:null}try{if(window.TURING){if(S.TU&&S.TU.length)TURING.set(S.TU);else TURING.reset()}}catch(e){}
  if(SS.keepM)TR.forEach((T,k)=>T.m=mm[k]);
  for(const k in S.G)if(!EXG.has(k))G[k]=S.G[k];if(G.bpmLock)G.bpm=kb;if(G.keyLock){G.root=kr;G.scale=ksc}
  if(Array.isArray(S.LF)){S.LF.forEach((L,i)=>{if(LFOS[i]&&L)Object.assign(LFOS[i],L)});if(S.LF.length<4&&LFOS[3])LFOS[3].d=0}   /* Sectors saved before LFO 4 existed leave it off */if(Array.isArray(S.TRIM))S.TRIM.forEach((v,i)=>TRIM[i]=v||0);
  if(S.prog)prog=S.prog;if(S.pshape)pshape=S.pshape;PX=S.PX||[];PD=S.PD||null;PPUSH=S.PPUSH||0;mot=S.mot||[];mp=-1;buf=(S.buf||[]).map(x=>x==null?undefined:x);
  if(S.mood&&MOODS[S.mood])curMood=S.mood;if(S.padStyle)padStyle=S.padStyle;pmean=null;PTOP=null;
  ks.base=G.root;ks.di=0;ks.cur=G.root;
  // chord for this very step, so lead/bass/stab on the downbeat already follow the new progression
  try{const T=TR[5],hr=padSched(T,16*T.p.bars);if(hr)padChord(hr[0],w)}catch(e){}
  if(ctx&&A.dl){const dt=(G.dt||.75)*60/G.bpm;[A.dl,A.dl2].forEach(d=>{if(d){d.delayTime.cancelScheduledValues(w);d.delayTime.setValueAtTime(d.delayTime.value,Math.max(ctx.currentTime,w-.01));d.delayTime.linearRampToValueAtTime(dt,w+.05)}})}
  const lead=ctx?Math.max(0,(w-ctx.currentTime)*1000):0;
  setTimeout(()=>{try{applyFX()}catch(e){}try{window.moodFinish&&moodFinish.apply()}catch(e){}try{if(curMood!==km&&window.orbHeadroom&&orbHeadroom.start)orbHeadroom.start()}catch(e){}},lead);   /* v1.0: another mood = that mood's start level, like a Launch */
  setTimeout(()=>refreshUI(S),lead+120)}
 function refreshUI(S){try{const ms=$('#mood');if(ms){const has=[...ms.options].some(o=>o.value===S.sel);ms.value=has?S.sel:(MOODS[curMood]?((window.MOODHOME&&MOODHOME[curMood])||curMood):'Auto');ms.options[0].textContent='Auto ('+MN(curMood)+')'}
  $('#root').value=G.root;$('#scale').value=G.scale;$('#bpm').value=G.bpm;$('#bv').textContent=G.bpm}catch(e){}
  try{syncMix()}catch(e){}requestAnimationFrame(()=>{try{build()}catch(e){}try{kl()}catch(e){}})}
 // the scheduler hook: runs first in every step, before any track fires
 const _as=arrStep;arrStep=function(w){if(SS.q&&tk%64===0&&!SS.held){const S=SS.q,gq=SS._q,qn=SS.qn;SS.q=null;SS._q=-1;try{apply(S,w);SS._a=gq;window.__orbSecArr=1;try{window.orbMPlus&&orbMPlus.mood()}catch(e){}msg('▶ ARRIVED AT '+(qn||'SECTOR').toUpperCase()+' · '+MN(curMood))}catch(e){console.warn('sector',e)}paint()}return _as.apply(this,arguments)};
 // hold off while a riser / breakdown pad is held (they restore their own snapshot on release)
 document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('#t-perf .rz'))SS.held++},true);
 const rel=()=>{if(SS.held)SS.held=0};['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,rel,true));
 // ---- UI (Launch tab) ----
 const host=$('#t-gen')||document.body;const pan=document.createElement('div');pan.className='panel sect';
 pan.innerHTML='<h2>Sectors</h2><div class="sctl"><button class="ssave">💾 Save</button><button class="skeep"></button><button class="sprot"></button><button class="sdel">🗑 Delete</button></div><div class="sgrid"></div><p class="gnote snote"></p>';
 const kp=$('#kbox')&&$('#kbox').closest('.panel');if(kp)kp.before(pan);else host.appendChild(pan);
 const grid=pan.querySelector('.sgrid'),bD=pan.querySelector('.sdel'),bS=pan.querySelector('.ssave'),bP=pan.querySelector('.sprot'),bK=pan.querySelector('.skeep'),note=pan.querySelector('.snote');
 const bkr=document.createElement('div');bkr.className='sbank';grid.before(bkr);const bkb=[...BL].map((c,b)=>{const x=document.createElement('button');x.type='button';x.dataset.b=b;x.onclick=()=>{if(SS.save||SS.del){}bank=b;SL=BK[b];try{localStorage.setItem(KEY+'-bank',b)}catch(e){}paint()};bkr.appendChild(x);return x});
 const btns=[];for(let i=0;i<N;i++){const b=document.createElement('button');b.className='sl';b.dataset.i=i;grid.appendChild(b);btns.push(b);let t0=0,raf=0,ate=0;
  b.onclick=()=>{if(ate){ate=0;return}tap(i)};b.addEventListener('contextmenu',e=>e.preventDefault());
  const stop=()=>{if(raf){cancelAnimationFrame(raf);raf=0;b.style.background='';paint()}};
  const step=()=>{const k=Math.min(1,(performance.now()-t0)/3000);b.style.background='linear-gradient(0deg,rgba(255,93,115,.6) '+k*100+'%,transparent '+k*100+'%)';
   if(k>=1){raf=0;ate=1;b.style.background='';const nm=SL[i]&&SL[i].nm;SL[i]=null;if(SS.qi===i){SS.q=null;SS.qi=-1}if(SS.act===i)SS.act=-1;persist();paint();msg('✖ '+(nm||'SECTOR').toUpperCase()+' DELETED · slot '+(i+1)+' is empty');return}
   if(performance.now()-t0>350){let bi=b.querySelector('i');b._h=null;if(!bi){bi=document.createElement('i');b.appendChild(bi)}bi.textContent='delete in '+Math.ceil(3-(performance.now()-t0)/1000)}raf=requestAnimationFrame(step)};
  b.addEventListener('pointerdown',()=>{ate=0;if(SS.prot||SS.save||!SL[i]||raf)return;t0=performance.now();raf=requestAnimationFrame(step)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop))}
 const MC={Dark:'#8f7bff',Melancholic:'#6aa7ff',Dreamy:'#ff9de6',Tense:'#ff5d73',Ethereal:'#9ff4ff',Hopeful:'#ffe44d',Noir:'#b9a27a',Drone:'#7fd0ff',Acid:'#b6ff3b',Power:'#ff8a3d',Italo:'#ff6bd6',Breaks:'#ffd36b','Deep Space':'#5d7bff',Bleep:'#00ff9c','Melodic House':'#ff9ab0','Distorted Electro':'#ff3d3d',Ambient:'#9ff0d0','Groove Techno':'#ffb347',Temporal:'#b8c8d8',Vector:'#7af0ff'};
 // ---- v1.0 crate: key · tempo on each slot, glow on the slots that fit as the next groove ----
 const ENERGY={Ambient:1,'Deep Space':2,Ethereal:3,Dreamy:4,Noir:4,Drone:4,Melancholic:5,'Melodic House':5,Italo:5,Chug:5,Hopeful:6,Vector:6,Bleep:6,Polymeter:6,'The Touch':6,
  Dark:7,'Distorted Electro':7,Tense:8,'Groove Techno':8,Temporal:8,Acid:9,Power:9,Breaks:9};
 const isMin=sc=>{const s=SC[sc];if(!s)return /min|dorian|phryg/i.test(sc||'');return s.includes(3)&&!s.includes(4)||!s.includes(3)&&!s.includes(4)&&s.includes(8)};
 const keyOf=(r,sc)=>{r=((+r||0)%12+12)%12;const m=isMin(sc);return{r,m,pos:m?(r+3)%12:r}};   /* pos = the relative major's root: same pos = same or relative key */
 const keyLbl=(r,sc)=>{const k=keyOf(r,sc);return NN[k.r]+(k.m?'m':'')};
 const keyFit=(a,b)=>a.pos===b.pos||(a.m===b.m&&((a.r-b.r+12)%12===7||(b.r-a.r+12)%12===7));
 const fitOf=s=>{if(!s||!s.G)return 0;const e1=ENERGY[curMood],e2=ENERGY[s.mood];if(e1!=null&&e2!=null&&Math.abs(e1-e2)>1)return 0;
  const kf=G.keyLock||keyFit(keyOf(G.root,G.scale),keyOf(s.G.root,s.G.scale)),tf=G.bpmLock||Math.abs((+s.G.bpm||0)-(+G.bpm||0))<=6;return kf&&tf?2:kf||tf?1:0};
 const sig=()=>curMood+'|'+G.bpm+'|'+G.root+'|'+G.scale+'|'+(G.keyLock?1:0)+(G.bpmLock?1:0)+'|'+bank+'|'+SS._a+'|'+SS._q+'|'+(SS.save||SS.del?1:0);let lastSig='';
 let blink=0;
 function paint(){lastSig=sig();const pick_=!SS.save&&!SS.del,skip=(b,i)=>b*N+i===SS._a||b*N+i===SS._q;
  bkb.forEach((x,b)=>{const n=BK[b].filter(Boolean).length,h='Bank '+BL[b]+(n?' <small>'+n+'</small>':'');if(x._h!==h){x._h=h;x.innerHTML=h}x.classList.toggle('on',b===bank);x.classList.toggle('qd',SS._q>=0&&Math.floor(SS._q/N)===b&&b!==bank);
   x.classList.toggle('fit',pick_&&b!==bank&&BK[b].some((s,i)=>s&&!skip(b,i)&&fitOf(s)===2))});const st=playing&&ctx?(64-((tk%64)+64)%64):0,bars=Math.ceil(st/16);
  btns.forEach((b,i)=>{const s=SL[i],q=SS.qi===i,f=pick_&&s&&!q&&SS.act!==i?fitOf(s):0;b.classList.toggle('full',!!s);b.classList.toggle('act',SS.act===i&&!q);b.classList.toggle('q',q);b.classList.toggle('blk',q&&blink);
   b.classList.toggle('g2',f===2);b.classList.toggle('g1',f===1);
   const ki=s&&s.G?keyLbl(s.G.root,s.G.scale)+' · '+Math.round(+s.G.bpm||0):'';
   b.style.setProperty('--sc',s&&MC[s.mood]||'#00ff9c');b.title=s?(s.nm+' · slot '+(i+1)+(ki?' · '+ki+' BPM':'')):'Slot '+(i+1)+' (empty)';const h='<u>'+(i+1)+'</u>'+(s?'<b>'+s.nm+'</b>':'<b class="e">'+(i+1)+'</b>')+(q?'<i>'+(playing?'in '+bars+' bar'+(bars>1?'s':''):'…')+'</i>':ki?'<em>'+ki+'</em>':'');if(b._h!==h){b._h=h;b.innerHTML=h}});
  bS.classList.toggle('on',!!SS.save);bS.textContent=SS.save?'💾 Pick a slot…':'💾 Save';if(SS.prot&&SS.del)SS.del=0;bD.classList.toggle('on',!!SS.del);bD.classList.toggle('dim',!!SS.prot);bD.textContent=SS.del?'🗑 Pick a planet…':'🗑 Delete';grid.classList.toggle('delmode',!!SS.del);
  if(!bP.style.background)bP.textContent=SS.prot?'🔒 Protected':'🔓 Unlocked';bP.classList.toggle('on',!!SS.prot);
  bK.textContent=SS.keepM?'Keep mutes ✓':'Keep mutes ✗';bK.classList.toggle('on',!!SS.keepM);
  note.textContent=SS.del?'Tap the planet to delete (tap 🗑 again to cancel).':SS.save?(SS.prot?'Tap an empty slot to store the groove (filled slots are protected).':'Tap any slot to store the groove — filled slots will be overwritten.'):SS.q?(SS.qn||'Sector')+' lands '+(playing?'on the next 4-bar boundary'+(SS.held?' after you release the pad':''):'now')+' · tap it again to cancel.':SS.prot?'Tap a planet to travel there on the next 4-bar boundary. Hold 🔒 for 3 s to unlock.':'Unlocked: saving can overwrite, and holding a planet for 3 s deletes it. Tap 🔓 to lock again.'}
 function tap(i){try{ensure()}catch(e){}
  if(SS.del){if(!SL[i])return;if(SS.prot){SS.del=0;paint();return}const nm=SL[i].nm;SL[i]=null;if(SS.qi===i){SS.q=null;SS.qi=-1}if(SS.act===i)SS.act=-1;persist();SS.del=0;msg('✖ '+(nm||'SECTOR').toUpperCase()+' DELETED · slot '+(i+1)+' is empty');paint();return}
  if(SS.save){if(SL[i]&&SS.prot){msg('▲ '+SL[i].nm.toUpperCase()+' IS PROTECTED · turn off 🔒 to overwrite');btns[i].classList.add('deny');setTimeout(()=>btns[i].classList.remove('deny'),400);return}
   SL[i]=snap();SL[i].nm=pnm();persist();try{window.orbRatings&&orbRatings.saved&&orbRatings.saved()}catch(e){}SS.save=0;SS.act=i;msg('💾 '+SL[i].nm.toUpperCase()+' STORED · SLOT '+(i+1)+' · '+MN(curMood));paint();return}
  if(!SL[i])return;if(SS.qi===i){SS.q=null;SS.qi=-1;paint();return}
  let S;try{S=JSON.parse(JSON.stringify(SL[i]))}catch(e){return}
  if(!playing||!ctx){apply(S,ctx?ctx.currentTime:0);SS.act=i;paint();return}
  SS.q=S;SS.qi=i;SS.qn=SL[i].nm+(bank?' ('+BL[bank]+')':'');prewarm(S);paint()}
 bS.onclick=()=>{SS.save=SS.save?0:1;SS.del=0;paint()};
 bD.onclick=()=>{if(SS.prot){SS.del=0;msg('▲ UNLOCK FIRST · hold 🔒 for 3 s, then Delete');bP.classList.add('deny');setTimeout(()=>bP.classList.remove('deny'),400);return}SS.del=SS.del?0:1;SS.save=0;paint()};bP.style.touchAction='none';{let t0=0,raf=0;const stop=()=>{cancelAnimationFrame(raf);raf=0;bP.style.background='';paint()};
  const step=()=>{const k=Math.min(1,(performance.now()-t0)/3000);bP.style.background='linear-gradient(90deg,rgba(255,93,115,.5) '+k*100+'%,transparent '+k*100+'%)';if(k>=1){raf=0;bP.style.background='';SS.prot=0;saveUI();paint();msg('🔓 SECTORS UNLOCKED · tap to lock again');return}bP.textContent='HOLD '+Math.ceil(3-(performance.now()-t0)/1000)+'… to unlock';raf=requestAnimationFrame(step)};
  bP.addEventListener('pointerdown',e=>{e.preventDefault();if(!SS.prot){SS.prot=1;saveUI();paint();msg('🔒 SECTORS PROTECTED');return}if(raf)return;t0=performance.now();raf=requestAnimationFrame(step)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>bP.addEventListener(ev,()=>{if(raf)stop()}));bP.addEventListener('contextmenu',e=>e.preventDefault())}bK.onclick=()=>{SS.keepM=SS.keepM?0:1;saveUI();paint()};
 setInterval(()=>{blink^=1;if(SS.q||SS.act>=0||sig()!==lastSig)paint()},350);paint();   /* v1.0: also repaint when the groove, key, tempo or a lock changed, so the glow follows */
 /* v1.0: a Launch replaces the groove, so no slot is "playing" any more (the old slot stayed lit and was left out of the glow) */
 {const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{SS.act=-1}catch(e){}return r}}

 // ---- export / import (.orbit) ----
 const io=document.createElement('div');io.className='sio';io.innerHTML='<button class="sexp" title="Export all sectors to a .orbit file">⇪ Export</button><label class="simp" title="Import sectors from a .orbit file">⇩ Import<input type="file" class="sfile"></label>';
 const iq=document.createElement('div');iq.className='simq';iq.hidden=true;{const kp=$('#kbox')&&$('#kbox').closest('.panel');if(kp)kp.after(io);else host.appendChild(io)}grid.after(iq);
 const bE=io.querySelector('.sexp'),bI=io.querySelector('.simp'),fin=io.querySelector('input');
 const stamp=()=>{const d=new Date(),z=n=>String(n).padStart(2,'0');return d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'-'+z(d.getHours())+z(d.getMinutes())};
 bE.onclick=async()=>{const n=SL.filter(Boolean).length;if(!n){msg('▲ NO SECTORS TO EXPORT');return}
  const txt=JSON.stringify({app:'orbitron-9000',kind:'sectors',v:1,saved:new Date().toISOString(),bank:BL[bank],slots:SL}),base='orbitron-sectors-'+BL[bank]+'-'+stamp();
  let dl=null;try{dl=window.claude&&claude.use?await claude.use('downloads'):null}catch(e){dl=null}
  if(dl){try{await dl.save({filename:base+'.orbit.json',data:txt});msg('⇪ BANK '+BL[bank]+' · '+n+' SECTORS EXPORTED');note.textContent='Exported as '+base+'.orbit.json (the Claude app only saves standard file types; renaming it to .orbit is fine).'}
   catch(e){const c=e&&e.code;note.textContent=c==='declined'?'Export cancelled.':c==='rate_limited'?'A save prompt is already open — finish that one first.':'Export is not available in this view.'}return}
  try{const r=await window.orbSave(base+'.orbit',new Blob([txt],{type:'application/octet-stream'}));if(r==='cancelled'){note.textContent='Export cancelled.';return}if(r==='blocked'||r==='maybe-blocked'){note.textContent='This view blocks downloads (e.g. a preview pane). Open the app directly in Chrome, Safari or Firefox to export.';if(r==='blocked')return}msg('⇪ BANK '+BL[bank]+' · '+n+' SECTORS EXPORTED');if(r!=='maybe-blocked')note.textContent=(r==='shared'?'Shared ':'Exported ')+base+'.orbit'}catch(e){note.textContent='Export is not available in this view.'}};
 const valid=o=>o&&typeof o==='object'&&Array.isArray(o.TR)&&o.G&&typeof o.G==='object'&&o.TR.length<=TR.length;
 const esc=t=>String(t).replace(/[<>&"]/g,'');
 function offer(txt,src){let d;try{d=JSON.parse(String(txt).trim())}catch(e){d=null}
   const sl=d&&d.app==='orbitron-9000'&&Array.isArray(d.slots)?d.slots.slice(0,N).map(x=>valid(x)?x:null):null;
   if(!sl||!sl.some(Boolean)){note.textContent='Not Orbitron sectors (.orbit).';return false}
   const cnt=sl.filter(Boolean).length,free=sl.filter((x,i)=>x&&!SL[i]).length,clash=sl.filter((x,i)=>x&&SL[i]).length;
   iq.hidden=false;iq.innerHTML='<span>'+cnt+' sector'+(cnt>1?'s':'')+' in '+esc(src)+(clash?' · '+clash+' would replace filled slots':'')+'</span><button data-m="fill">Into empty slots ('+free+')</button><button data-m="all"'+(SS.prot&&clash?' disabled title="Unlock (hold 🔒 for 3 s) to replace filled slots"':'')+'>Replace all 16</button><button data-m="x">Cancel</button>';
   iq.onclick=e=>{const m=e.target.dataset&&e.target.dataset.m;if(!m||e.target.disabled)return;iq.hidden=true;iq.onclick=null;if(m==='x')return;
    if(m==='all'){for(let i=0;i<N;i++)SL[i]=null;sl.forEach((x,i)=>{if(x){if(!x.nm)x.nm=pnm();SL[i]=x}});SS.act=-1}else sl.forEach((x,i)=>{if(x&&!SL[i]){if(!x.nm||SL.some(y=>y&&y.nm===x.nm))x.nm=pnm();SL[i]=x}});
    persist();paint();msg('⇩ SECTORS IMPORTED INTO BANK '+BL[bank]);note.textContent=m==='all'?'All 16 slots replaced.':'Filled '+free+' empty slot'+(free===1?'':'s')+'.'};return true}
 // tapping the label opens the picker natively; if the page never loses focus, the picker did not open here — offer the text route
 let pk=0;const opened=()=>{clearTimeout(pk);pk=0};window.addEventListener('blur',opened);document.addEventListener('visibilitychange',opened);
 bI.addEventListener('click',()=>{fin.value='';clearTimeout(pk);pk=setTimeout(()=>{pk=0;note.textContent='No file picker opened? Open Orbitron in Chrome and import there.'},1600)});
 fin.onchange=()=>{opened();const f=fin.files&&fin.files[0];if(!f)return;if(f.size>2e6){note.textContent='That file is too big to be an Orbitron sectors file.';return}
  note.textContent='Reading '+f.name+'…';const rd=new FileReader();rd.onload=()=>{if(offer(rd.result,'“'+f.name+'”')){note.textContent='Choose how to import ↑';try{iq.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}iq.classList.remove('fl');void iq.offsetWidth;iq.classList.add('fl')}};rd.onerror=()=>{note.textContent='Could not read that file.'};rd.readAsText(f)};

 window.SECTORS={list:()=>SL,snap,tap,state:SS};
 const st=document.createElement('style');st.textContent=`.sect .sctl{display:grid;grid-template-columns:1fr 1fr 1.1fr 1fr;gap:6px;margin-bottom:8px}.sect .sctl .sdel.on{border-color:#ff5d73!important;color:#ff5d73!important;box-shadow:0 0 8px rgba(255,93,115,.4)!important}.sect .sctl .sdel.dim{opacity:.3;filter:grayscale(1);border-style:dashed!important}.sect .sctl .sprot.deny{animation:sdeny .4s}.sect .sgrid.delmode .sl.full{border-color:#ff5d73;box-shadow:0 0 0 1px #ff5d73 inset}
.sect .sctl button{min-height:40px;border:1px solid rgba(0,255,156,.35);border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:12px;font-weight:600;cursor:pointer;opacity:.75;padding:0 4px}
.sect .sctl button.on{opacity:1;border-color:var(--acc,#ffe44d);color:var(--acc,#ffe44d);box-shadow:0 0 8px rgba(255,228,77,.3)}
.sect .sgrid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}
.sect .sl{position:relative;height:50px;border:1px solid rgba(0,255,156,.22);border-radius:9px;background:rgba(0,255,156,.03);color:inherit;cursor:pointer;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font:inherit;opacity:.55;touch-action:manipulation}
.sect .sl{height:48px;min-height:0!important}.sect .sl u{position:absolute;top:2px;left:5px;text-decoration:none;font-size:8px;line-height:1;opacity:.55}.sect .sl.full,.sect .sl.q{padding-top:9px}.sect .simq[hidden]{display:none}
.sect .sl b{font-size:12px;line-height:1.1;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:94%;letter-spacing:.02em}.sect .sl b.e{font-size:14px;opacity:.7}.sect .sl:not(.full):not(.q) u{display:none}
.sect .sl i{font-style:normal;font-size:8px;opacity:.8;margin-top:4px;white-space:nowrap;overflow:hidden;max-width:94%;text-transform:uppercase;letter-spacing:.05em}
.sect .sl.full{opacity:1;border-color:var(--sc);background:color-mix(in srgb,var(--sc) 14%,transparent)}
.sect .sl.act b,.sect .sl.act u,.sect .sl.act i{color:#04100a!important}.sect .sl.act{background:var(--sc);color:#04100a;box-shadow:0 0 10px color-mix(in srgb,var(--sc) 60%,transparent)}
.sect .sl.q{opacity:1;border-color:var(--acc,#ffe44d);box-shadow:0 0 0 2px var(--acc,#ffe44d) inset}.sect .sl.q.blk{background:color-mix(in srgb,var(--acc,#ffe44d) 35%,transparent)}
.sect .sl em{font-style:normal;font-size:9px;line-height:1;opacity:.85;margin-top:2px;white-space:nowrap;overflow:hidden;max-width:94%;letter-spacing:.02em;text-transform:none}.sect .sl.act em{color:#04100a!important}
.sect .sl.g2{border-color:#eafff4;box-shadow:inset 0 0 0 2px #eafff4,inset 0 0 14px 2px rgba(234,255,244,.5)}.sect .sl.g1{border-color:rgba(234,255,244,.85);box-shadow:inset 0 0 0 1px rgba(234,255,244,.6),inset 0 0 8px rgba(234,255,244,.2)}
.sbank button.fit{position:relative}.sbank button.fit::after{content:'';position:absolute;top:4px;right:5px;width:6px;height:6px;border-radius:50%;background:#eafff4;box-shadow:0 0 6px #eafff4}
.sect .sl.deny{animation:sdeny .4s}@keyframes sdeny{0%,100%{transform:none}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
.sect{position:relative}#t-gen>.sio{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 8px}#t-gen>.sio button,#t-gen>.sio label{min-height:40px!important;height:40px;padding:0 10px;font-size:12px;display:flex;justify-content:center;align-items:center;border:1px solid rgba(0,255,156,.3);border-radius:10px;background:transparent;color:inherit;font-family:inherit;cursor:pointer;opacity:.8;text-transform:uppercase;letter-spacing:.06em}#t-gen>.sio label{position:relative;overflow:hidden}#t-gen>.sio .sfile{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:40px}.sect .simq.fl{animation:sqfl 1.2s}@keyframes sqfl{0%,40%{background:rgba(255,228,77,.25)}100%{background:transparent}}.sect .simq .stx{flex:1 1 100%;min-height:64px;max-height:120px;background:rgba(0,0,0,.35);color:inherit;border:1px solid rgba(0,255,156,.3);border-radius:8px;font:11px/1.3 monospace;padding:6px;resize:vertical}
.sect .sio button,.sect .simq button{min-height:36px;border:1px solid rgba(0,255,156,.3);border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer;opacity:.8}
.sect .simq{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px;padding:8px;border:1px dashed var(--acc,#ffe44d);border-radius:10px;font-size:12px}.sect .simq span{flex:1 1 100%}
.sect .simq button{flex:1 1 auto;padding:0 8px}.sect .simq button:disabled{opacity:.3;cursor:not-allowed}
.sect .snote{margin:8px 0 0;min-height:1.3em}
@media (max-width:640px){#t-gen>.panel{padding:8px 10px!important;margin-bottom:6px!important}#t-gen>.panel>h2{margin:0 0 6px!important;font-size:11px!important;line-height:1.3}
#gbox{gap:6px!important}#gbox>button:not(#rnd){height:50px!important;font-size:16px!important}#gbox select,#gbox #rnd{min-height:38px!important;height:38px!important;padding-top:0;padding-bottom:0}
#kbox{grid-template-columns:1fr 1fr auto!important;gap:6px!important}#kbox select{min-height:38px!important;height:38px!important;padding-top:0;padding-bottom:0}#kbox .keylock{grid-column:auto!important;min-height:38px!important;height:38px;padding:0 12px;font-size:12px}#kbox .keylock .kll{display:none}#kbox .keylock .kls{display:inline}#gsum{display:none!important}
#t-gen>.sio{gap:6px;margin:0}#t-gen>.sio button,#t-gen>.sio label{height:34px;min-height:34px!important;font-size:11px}
.sect .sctl{margin-bottom:6px!important}.sect .sctl button{min-height:34px!important;height:34px;font-size:11px}
.sect .sgrid{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.sect .sl{height:36px}.sect .sl.full,.sect .sl.q{padding-top:0}.sect .sl.q{padding-top:8px}.sect .sl b{font-size:11.5px}
.sect .snote{margin:5px 0 0!important;font-size:10.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:0}}
@media (max-width:640px) and (max-height:760px){#t-gen>.panel:has(#kbox)>h2,.sect .snote{display:none!important}#t-gen>.sio button,#t-gen>.sio label{height:32px!important;min-height:32px!important}#gbox>button:not(#rnd){height:44px!important}.sect .sl{height:32px}.sect .sl.q{padding-top:7px}.sect .sl.q i{margin-top:1px}#gbox select,#gbox #rnd,#kbox select,#kbox .keylock{height:34px!important;min-height:34px!important}.sect .sctl button{height:32px;min-height:32px!important}}
@media (max-width:640px) and (max-height:700px){#gbox>button:not(#rnd){height:40px!important}#gbox select,#gbox #rnd,#kbox select,#kbox .keylock{height:30px!important;min-height:30px!important}.sect .sctl button{height:28px!important;min-height:28px!important}#t-gen>.sio button,#t-gen>.sio label{height:30px!important;min-height:30px!important}.sect .sgrid{gap:4px!important}#t-gen>.panel:first-child>h2,#t-gen>.panel:has(#kbox)>h2,.sect .snote{display:none!important}.sect .sl{height:27px}.sect .sl.q{padding-top:5px}.sect .sl u{display:none}}
@media (max-width:640px){.sect .sl i{font-size:8px;margin-top:1px}.sect .sl i{font-size:8px;margin-top:3px}#t-gen>.panel:first-child>.gnote{display:none}.sect .snote{font-size:11px;margin-top:6px}}`;document.head.appendChild(st)}

