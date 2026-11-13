
/* ---- v0.29: NEW SOUNDS + SMARTER LEAD AND BASS PATTERNS
   Leads: House piano and EP stab (chords that follow the pad), Rave stab and Organ stab (one chord shape moved in parallel).
   Lead card → Osc page → Chord: Off / Follow pad / Rave / Organ works on any patch.
   Bass: 808 glide (sine with a pitch drop and long decay; overlapping notes glide), Rolling pluck. Bass card → Sound picks any bass sound.
   Texture bed (Mix page): Vinyl, Tape, Rain, Air (soft noise tuned to the key). Every Launch picks one.
   Patterns: lead notes on the strong beats land on the pad's chord tones; modern lead rhythms per family;
   a bass role per family — Rolling (dodges the kick), Anchor (root on the one + octave pickup), Answer (fills the lead's gaps), 808 (long gliding notes). ---- */
{const _=null;
 // ---------- lead: chord voices ----------
 Object.assign(LDEF,{chd:''});
 Object.assign(LPRE,{
  'House piano':{pg:1.1,eng:'FM',fmr:1,fmi:2.6,fenv:1.2,uni:1,usp:0,wid:.3,ft:'LP12',cut:2600,res:.8,envA:4200,dec:.55,sus:0,att:1,kt:.4,subosc:0,oct2:0,drv:.08,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.3,rs:.3,chd:'Follow pad'},
  'EP stab':{pg:1.05,eng:'FM',fmr:1,fmi:1.1,fenv:2.2,uni:1,usp:0,wid:.45,ft:'LP12',cut:1800,res:.7,envA:2200,dec:.7,sus:.2,hold:.9,rel:.35,att:2,kt:.3,subosc:0,oct2:0,drv:.12,crush:0,fold:0,penv:0,glide:0,vib:4,vibr:4.2,ds:.35,rs:.35,chd:'Follow pad'},
  'Rave stab':{pg:3,eng:'Stack',uni:1,usp:0,wid:.4,wave:.1,det:11,ft:'LP24',cut:900,res:2.5,envA:2000,/* v0.83: mellower (cut 1100, env 4200) */dec:.24,sus:0,att:1,kt:.3,subosc:.1,oct2:0,drv:.25,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.45,rs:.35,chd:'Rave'},
  'Organ stab':{pg:2.6,eng:'Organ',uni:1,usp:0,wid:.3,ft:'LP12',cut:1700,/* v0.83: mellower (was 4200) */res:.7,envA:800,dec:.26,sus:0,att:2,rel:.05,kt:0,subosc:0,oct2:0,drv:.3,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.35,rs:.3,chd:'Organ'}});
 const CHD={Rave:[0,3,7,12],Organ:[0,3,7,10]},CHOPT=['Off','Follow pad','Rave','Organ'];
 const extra=()=>QOS.eco2||QOS.lvl>=2?1:QOS.lvl>=1?2:3;
 const ratios=(p,d)=>{const lim=extra();if(CHD[p.chd])return CHD[p.chd].slice(1,1+lim).map(s=>Math.pow(2,s/12));
  const n=SC[G.scale].length,ct=new Set(cur.n.map(x=>((x%n)+n)%n)),out=[];for(let k=d+1;k<=d+n&&out.length<Math.min(2,lim);k++)if(ct.has(((k%n)+n)%n))out.push(k);
  const f0=d2f(d,3);return out.map(k=>d2f(k,3)/f0)};
 // strong beats (1 e & a → every quarter) pull the lead onto the pad's chord tones; the modes that already choose chord tones are left alone
 const SKIP=new Set(['Acid 303','Riff','Chord arp','Pedal arp','Motif']);
 const _lnP=leadNote;leadNote=function(p){const d=_lnP.apply(this,arguments);try{if(SKIP.has(p.mode)||typeof d!=='number'||!isFinite(d)||p.ctp===0)return d;const s=((tk%16)+16)%16;if(s%4)return d;return snapCT(d,p)}catch(e){return d}};
 const _lp=leadPoly;leadPoly=function(w){const T=TR[4],P=T.p;if(!P.chd||P.chd==='Off')return _lp(w);const lv=T.lv;T.lv=lv*.6;window.__CHRF=d=>[1,...ratios(P,d)];try{return _lp(w)}finally{T.lv=lv;window.__CHRF=null}};
 if(!LGRP.Osc.includes('Chord'))LGRP.Osc.splice(1,0,'Chord');LENGK.Chord=['Stack','Pulse','FM','Vowel','Organ','Sine'];
 const _lpu=leadPresetUI;leadPresetUI=function(g){_lpu.apply(this,arguments);try{const P=TR[4].p,eng=[...g.children].find(el=>el.tagName==='LABEL'&&el.firstChild&&el.firstChild.textContent==='Engine');
   const s=mkSel('Chord',CHOPT,P.chd||'Off',v=>{P.chd=v==='Off'?'':v;P.patch=''});if(eng)eng.after(s);else g.appendChild(s)}catch(e){}};

 // ---------- bass: 808 glide + Rolling pluck ----------
 const BP=orbModern.BASSP;Object.keys(BP).forEach(k=>{BP[k].beng=''});
 Object.assign(BP,{'808 glide':{beng:'808',sub:0,cut:900,res:.7,envA:.4,det:0,sqm:0,bpp:.25,bdrv:.3,bgr:0,dec:.75},
  'Rolling pluck':{beng:'',sub:.55,cut:170,res:7,envA:5.5,det:7,sqm:.1,bpp:.12,bdrv:.1,bgr:0,dec:.1}});
 const B8={g:null,f:0,end:0};
 window.bass808=function(w,p,v){let d=G.pedal?0:cur.r;if(lastDeg%2&&R()<p.fifth)d+=4;
  const f=window.BOVF||d2f(d,p.oct)*(G.bstyle==='octave'?(tk%2?2:1):(R()<p.jump?2:1)),dec=Math.max(.18,(window.BFDEC||p.dec)*(window.BPHS?.6:1)),e=w+dec+.06;
  const ring=B8.g&&w<B8.end-.02,from=window.BSLF||(ring&&Math.abs(B8.f/f-1)>.01?B8.f:0);
  if(ring){try{B8.g.gain.cancelScheduledValues(w);B8.g.gain.setTargetAtTime(.0001,w,.012)}catch(x){}}
  const o=mkOsc(),g=ctx.createGain(),q=ctx.createBiquadFilter();o.type='sine';
  if(from){o.frequency.setValueAtTime(from,w);o.frequency.exponentialRampToValueAtTime(f,w+.09)}
  else{const pp=p.bpp||0;o.frequency.setValueAtTime(f*Math.pow(2,.25+pp*1.2),w);o.frequency.exponentialRampToValueAtTime(f,w+.03+pp*.05)}
  o.start(w);o.stop(e);
  const pk=v*.36;   /* v0.75: was .12 (+9.5 dB). On the bass bus the 808 peaked about 20 dB under the other bass sounds, and a near-pure low sine sounds quieter still */g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(pk,w+.004);g.gain.setValueAtTime(pk,w+Math.min(.08,dec*.25));g.gain.exponentialRampToValueAtTime(.0001,w+dec);
  let src=o;const dv=p.bdrv||0;if(dv>.02){const k=Math.round((1+dv*6)*10)/10,ws=ctx.createWaveShaper(),mk=ctx.createGain();ws.curve=BDC[k]||(BDC[k]=satCurve(k));mk.gain.value=1+dv*2.4;o.connect(ws);ws.connect(mk);src=mk}
  q.type='lowpass';q.Q.value=Math.min(4,p.res||.7);q.frequency.value=Math.max(120,Math.min(8000,p.cut*Math.pow(2,2*mv("Bass cutoff",w))*(1+(p.envA||0)*.3)));
  src.connect(q);q.connect(g);send(g,A.dkb,0,0);B8.g=g;B8.f=f;B8.end=w+dec;window.BLF=f;window.BLFN=(window.BLFN||0)+1};
 const bassSet=name=>{const P=TR[6].p;if(name==='Classic'){P.beng='';G.bchar='';return}if(!BP[name])return;Object.assign(P,BP[name]);G.bchar=name};
 window.orbBassSound=bassSet;
 const _bui=window.bassUI;if(_bui)window.bassUI=function(g,t){const r=_bui.apply(this,arguments);try{const P=t.p,s=mkSel('Sound',['Classic',...Object.keys(BP)],BP[G.bchar]?G.bchar:'Classic',v=>{bassSet(v);try{build()}catch(e){}});s.classList.add('bsnd');g.prepend(s)}catch(e){}return r};

 // ---------- texture bed (Mix page) ----------
 const BEDS=['Off','Vinyl','Tape','Rain','Air'],BB={},BED={src:null,g:null,f:[],type:'',root:-1};
 if(G.bed==null)G.bed='Off';if(G.bedLv==null)G.bedLv=.4;
 const fillCh=(type,b,c)=>{const sr=b.sampleRate,N=b.length,rn=()=>Math.random()*2-1;
  {const a=b.getChannelData(c);let lp=0,lp2=0;
   if(type==='Vinyl'){for(let i=0;i<N;i++){const x=rn();lp+=.03*(x-lp);a[i]=lp*.9+x*.025}let i=0;while(i<N){i+=Math.floor(sr*(.008+Math.random()*.11));const amp=Math.random()<.12?.9:.2+Math.random()*.3,len=Math.floor(sr*(.0004+Math.random()*.0018));for(let j=0;j<len&&i+j<N;j++)a[i+j]+=amp*rn()*Math.exp(-j/(len*.3))}}
   else if(type==='Tape'){for(let i=0;i<N;i++){const x=rn();lp+=.04*(x-lp);lp2+=.5*(x-lp2);a[i]=(lp2-lp)*.5*(1+.22*Math.sin(2*Math.PI*i/N*3+c))+lp*.35}}
   else if(type==='Rain'){for(let i=0;i<N;i++){const x=rn();lp+=.25*(x-lp);lp2+=.06*(x-lp2);a[i]=(lp-lp2)*.35}let i=0;while(i<N){i+=Math.floor(sr*(.002+Math.random()*.03));const fr=2000+Math.random()*4500,amp=.05+Math.random()*.25,len=Math.floor(sr*(.003+Math.random()*.006));for(let j=0;j<len&&i+j<N;j++)a[i+j]+=amp*Math.sin(2*Math.PI*fr*j/sr)*Math.exp(-j/(len*.25))}}
   else{for(let i=0;i<N;i++)a[i]=rn()*.5}
   const F=Math.floor(sr*.05);for(let j=0;j<F;j++){const t=j/F;a[j]=a[j]*t+a[N-F+j]*(1-t)}   // seamless loop
   let s=0;for(let i=0;i<N;i++)s+=a[i]*a[i];const k=.1/Math.sqrt(s/N||1);for(let i=0;i<N;i++)a[i]*=k}};
 /* v0.3: beds are prepared in idle time (one channel per slice) as soon as a Launch or the menu picks them, never while starting playback */
 const BP_={},idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1500}):setTimeout(f,30);
 const prep=type=>{if(!ctx||ctx instanceof OfflineAudioContext||!type||type==='Off'||BB[type]||BP_[type])return;BP_[type]=1;const b=ctx.createBuffer(2,Math.floor(ctx.sampleRate*4),ctx.sampleRate);
  idle(()=>{try{fillCh(type,b,0)}catch(e){}idle(()=>{try{fillCh(type,b,1);BB[type]=b}catch(e){}BP_[type]=0})})};window.orbBedPrep=prep;
 const airF=()=>{const m=12*6+G.root;return [440*Math.pow(2,(m-69)/12),440*Math.pow(2,(m+7-69)/12)]};
 const bedStop=(w)=>{if(!BED.src)return;const t=w||ctx.currentTime,s=BED.src,g=BED.g;try{g.gain.cancelScheduledValues(t);g.gain.setTargetAtTime(0,t,.25);s.stop(t+1.5)}catch(e){}BED.src=null;BED.g=null;BED.f=[];BED.type=''};
 const bedLvl=()=>{const l=Math.max(0,Math.min(1,G.bedLv||0));return l*l*.42*(G.bed==='Air'?2:1)};
 const bedStart=type=>{if(!BB[type]){prep(type);return}const t=ctx.currentTime,s=mkBuf(),g=ctx.createGain();s.buffer=BB[type];s.loop=true;let head=s;
  if(type==='Air'){const [f1,f2]=airF(),m=ctx.createGain();m.gain.value=7;BED.f=[f1,f2].map(f=>{const b=ctx.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=16;s.connect(b);b.connect(m);return b});head=m;BED.root=G.root}
  else if(type==='Tape'){const h=ctx.createBiquadFilter();h.type='highpass';h.frequency.value=180;s.connect(h);head=h}
  g.gain.setValueAtTime(0,t);g.gain.setTargetAtTime(bedLvl(),t,.6);head.connect(g);send(g,A.dk||A.m,0,type==='Rain'||type==='Air'?.2:.05);s.start(t,Math.random()*3);BED.src=s;BED.g=g;BED.type=type};
 const bedTick=()=>{try{if(!ctx||ctx instanceof OfflineAudioContext||!A.m)return;const type=BEDS.includes(G.bed)?G.bed:'Off',want=playing&&type!=='Off'&&(G.bedLv||0)>.005;
   if(!want){if(BED.src)bedStop();return}
   if(BED.type!==type){if(!BB[type]){prep(type);if(BED.src)bedStop();return}bedStop();bedStart(type);return}
   BED.g.gain.setTargetAtTime(bedLvl(),ctx.currentTime,.3);
   if(type==='Air'&&BED.root!==G.root){const fs=airF();BED.f.forEach((b,i)=>b.frequency.setTargetAtTime(fs[i],ctx.currentTime,.5));BED.root=G.root}}catch(e){console.warn('[orbitron] bed',e)}};
 setInterval(bedTick,300);
 let bedPan=null;const bedUI=()=>{try{const mx=$('#t-mix');if(!mx)return;if(!bedPan||!bedPan.isConnected){bedPan=document.createElement('div');bedPan.className='panel';bedPan.innerHTML='<h2>Texture bed</h2><p class="gnote" style="margin:0 0 6px">A quiet layer under the track: vinyl crackle, tape hiss, rain, or air tuned to the key. Every Launch picks one.</p><div class="grid" id="bedg"></div>';
    const g2=$('#gate'),gp=g2&&g2.closest('.panel');if(gp)gp.before(bedPan);else mx.appendChild(bedPan)}
   const g=bedPan.querySelector('#bedg');g.innerHTML='';g.appendChild(mkSel('Bed',BEDS,BEDS.includes(G.bed)?G.bed:'Off',v=>{G.bed=v;prep(v);bedTick()}));sl(g,'Bed level',0,1,G.bedLv||0,.01,v=>{G.bedLv=v;bedTick()})}catch(e){console.warn('[orbitron] bed ui',e)}};
 const _sm=syncMix;syncMix=function(){const r=_sm.apply(this,arguments);bedUI();return r};
 const _afx=applyFX;applyFX=function(){const r=_afx.apply(this,arguments);bedUI();bedTick();return r};
 bedUI();try{build()}catch(e){}

 // ---------- Launch: new sounds, lead rhythms, bass roles, bed ----------
 const AMB=new Set(['Ambient','Ethereal','Drone','Deep Space']);
 const rp=a=>a[Math.floor(R()*a.length)],wp=o=>{let t=Object.values(o).reduce((a,b)=>a+b,0)*R();for(const k in o)if((t-=o[k])<0)return k;return Object.keys(o)[0]};
 const NEWL={bounce:[.48,{'Rave stab':1,'House piano':1,'EP stab':1}],peak:[.42,{'Organ stab':1,'Rave stab':1}],minimal:[.42,{'Organ stab':1,'EP stab':.7}],rolling:[.14,{'EP stab':1}]};
 const MOODL={Italo:[.35,{'House piano':1}],Hopeful:[.42,{'House piano':1,'EP stab':1}],'Melodic House':[.48,{'EP stab':2,'House piano':1}],Breaks:[.42,{'Rave stab':1,'House piano':.5}],'Groove Techno':[.35,{'Organ stab':1}],Dreamy:[.3,{'EP stab':1}]}; /* v0.4: new leads ~40 % more often */
 const RHY={rolling:['x.xx.xx.x.xx.xx.','x..x..x..x..x.x.'],bounce:['x..x..x.x..x..x.','..x..x....x..x..','x.x...x...x.x...'],peak:['x..x..x.........','..x...x...x.....','x.....x...x.....'],minimal:['...x..x....x....','.x....x..x......','..x..x..x.......']};
 const SPARSE=['x..x..x.........','..x...x...x.....','...x..x....x....','x.....x...x.....','..x..x....x..x..'];
 const pt16=s=>[...s].map(c=>c==='x'?1:0);
 const setRing=(T,pt)=>{T.st=16;try{const ft=bassFit(T,pt);Object.assign(T,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){Object.assign(T,{h:pt.reduce((a,b)=>a+b,0),r:0,ten:0})}T.pt=pt.slice()};
 const ROLE={rolling:{Rolling:.65,Anchor:.35},bounce:{Answer:.4,'808':.42,Rolling:.18},peak:{Anchor:.5,Rolling:.5},minimal:{Rolling:.45,Answer:.4,'808':.15}};
 const RSND={Rolling:['Rolling pluck','Rolling sub','Rolling pluck'],Anchor:['Reese mid','Rolling sub'],Answer:['FM round','Rubber','Rolling pluck','Rolling pluck'],'808':['808 glide']};
 const RT={Rolling:[[_,0,0,0,_,0,0,0,_,0,0,0,_,0,0,0],[_,0,0,_,_,0,0,10,_,0,0,_,_,0,0,4],[_,0,10,0,_,0,10,0,_,0,10,0,_,0,4,0],[_,_,0,0,_,_,0,0,_,_,0,0,_,_,0,10]],
  Anchor:[[0,_,_,_,_,_,_,_,0,_,_,_,_,_,10,_],[0,_,_,_,_,_,0,_,_,_,_,_,_,_,10,_],[0,_,_,10,_,_,0,_,_,_,_,_,_,_,4,10]],
  '808':[[0,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_],[0,_,_,_,_,_,_,0,_,_,_,_,4,_,_,_],[0,_,_,_,_,_,10,_,_,_,0,_,_,_,_,_],[0,_,_,_,_,_,_,_,_,_,_,_,4,_,2,_]]};
 const answer=()=>{const L=TR[4],K=TR[0],cand=[];for(let s=0;s<16;s++){const lp=!L.m&&L.pt[s%L.st],kp=!K.m&&K.pt[s%K.st];if(!lp&&!kp)cand.push(s)}
  if(cand.length<3)return null;const t=Array(16).fill(_),pickN=Math.min(5,Math.max(3,Math.round(cand.length/3)));const step=cand.length/pickN;
  for(let i=0;i<pickN;i++){const s=cand[Math.min(cand.length-1,Math.floor(i*step+R()*step*.5))];t[s]=rp([0,0,4,10,2,0])}t[cand[0]]=0;return t};
 const fillT=t=>{let last=t.find(x=>x!=null);if(last==null)last=0;return t.map(x=>x==null?last:(last=x))};
 const bassRole=(fam)=>{const B=TR[6],BPp=B.p,w=Object.assign({},ROLE[fam]);if((curMood==='Breaks'||curMood==='Dreamy')&&w['808'])w['808']=.7;
  let role=wp(w),t=role==='Answer'?answer():rp(RT[role]);if(!t){role='Rolling';t=rp(RT.Rolling)}
  bassSet(rp(RSND[role]));const pt=t.map(x=>x==null?0:1),ff=fillT(t),A1=ff.map((v,i)=>({d:v>=10?v-10:v,o:v>=10?1:0,l:(role==='Anchor'||role==='808')&&t[i]!=null&&i%8===0?1:undefined})),
   A2=A1.map((e,i)=>i>=12&&t[i]!=null&&R()<.5?{d:e.d,o:1-e.o}:Object.assign({},e));
  setRing(B,pt);Object.assign(BPp,{bns:'Phrase',bsty:'Modern '+fam,bsus:0,btn:false,bph:1,bgh:0,blk:'Free'});G.bavoid=false;G.bavStrict=false;
  window.BPH={bars:[A1,A2],pk:[],chr:0,lead:9,evo:0};window.__bphLock=1;G.brole=role};
 const BEDM={Ambient:['Air','Rain'],Ethereal:['Air','Rain'],Drone:['Air','Tape'],'Deep Space':['Air'],Melancholic:['Rain','Tape','Vinyl'],Dreamy:['Tape','Air','Rain'],Noir:['Vinyl','Rain'],Hopeful:['Tape','Vinyl'],
  'Melodic House':['Tape','Air'],Italo:['Tape'],Breaks:['Vinyl','Tape'],Dark:['Air','Tape'],Tense:['Air','Tape'],Power:['Tape','Air'],'Distorted Electro':['Tape','Vinyl'],'Groove Techno':['Vinyl','Tape'],Bleep:['Tape','Vinyl'],Temporal:['Air','Tape'],Vector:['Vinyl','Tape']};
 const FAMB={rolling:['Air','Rain','Tape'],bounce:['Vinyl','Tape','Rain'],peak:['Tape','Air'],minimal:['Vinyl','Tape']};
 const rr=(a,b)=>+(a+R()*(b-a)).toFixed(2);
 const _g=generate;generate=function(){TR[6].p.beng='';G.brole='';const r=_g.apply(this,arguments);try{
   const fam=orbModern.last,L=TR[4],P=L.p,B=TR[6],acid=P.mode==='Acid 303'||(MOODS[curMood]||{}).acid;
   if(!L.m&&!acid){const o=fam?NEWL[fam]:MOODL[curMood];if(o&&R()<o[0]){applyLP(wp(o[1]),1);if(P.mode!=='Riff'){P.mode='Motif';try{mot=[];mp=-1;buf=[]}catch(e){}P.range=2}}
    // modern lead rhythm for the family (the Riff mode keeps its own rhythm)
    if(P.mode!=='Riff'){const ch=P.chd&&P.chd!=='Off';if(ch&&(L.h>7||['Chord arp','Up/Down','Up','Random'].includes(P.mode))){P.mode='Motif';try{mot=[];mp=-1;buf=[]}catch(e){}setRing(L,pt16(rp(SPARSE)))}
     else if(fam&&RHY[fam]&&R()<(fam==='rolling'?(P.mode==='Motif'?.35:0):.6))setRing(L,pt16(rp(RHY[fam])))}}
   if(fam&&!B.m&&!acid&&R()<.9)bassRole(fam);
   G.bed=fam&&R()<.6?rp(FAMB[fam]):rp(BEDM[curMood]||['Tape','Vinyl','Air']);G.bedLv=AMB.has(curMood)?rr(.5,.7):fam==='peak'?rr(.25,.35):rr(.3,.5);prep(G.bed);
   setTimeout(()=>{try{bedUI();bedTick();const s=document.querySelector('.bsnd select');if(s)s.value=BP[G.bchar]?G.bchar:'Classic';window.bassSync&&bassSync()}catch(e){}},80)
  }catch(e){console.warn('[orbitron] v0.29',e)}return r}}
