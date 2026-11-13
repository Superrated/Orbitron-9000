
/* ---- v0.26: SATELLITE — replaces the Sub drone track (slot 9). One Launch picks one of two roles:
   Counter  · a second line (warm saw, strings or reed) that moves against the lead, either in Long notes or short Answers in the lead's gaps;
   Sparkle  · high chord-tone ornaments (glass bell, pluck, music box) that answer in the lead's gaps, sometimes echoing its last note higher up.
   Few controls: Role, Sound, Motion, Register (Auto / Low / High), Amount, Tone, Space, Level. Thinned by THIN, filtered by the low-pass,
   lifted by the +1/+2 octave Thrusters. Launch adds it sparingly in melodic, spacious and groovy moods. ---- */
{const S=TR[9];S.pt=pat(S);
 const SND={Counter:['Super saw','Poly pulse','Keys','FM pluck','Strings'],Sparkle:['Mallet','Glass bell','FM pluck','Music box']};
 const OLDSND={'Warm saw':'Super saw',Reed:'Poly pulse',Pluck:'FM pluck'};
 /* v0.5: motions that follow the main parts — Double lead / Double bass (the same notes an octave up, another sound on top),
    Echo hook (the lead's last 2–3 notes again in its next gap, an octave up), Last-note hold (the lead's last note held into the next phrase) */
 const XM=new Set(['Double lead','Double bass','Echo hook','Last-note hold']),ALLS=[...SND.Counter,...SND.Sparkle.filter(x=>!SND.Counter.includes(x))];
 try{['Amount','Role','Motion','Register'].forEach(x=>{if(!PATL.includes(x))PATL.push(x)})}catch(e){}
 /* v0.26: Attack and Release knobs (each sound sets its own starting values), and an Arp motion: short chord-tone stabs running up and down, two notes together on the half bars */
 const SDEF={'Super saw':[.3,.4],'Poly pulse':[.15,.3],Keys:[.05,.35],'FM pluck':[.02,.35],Strings:[.6,.45],Mallet:[.01,.5],'Glass bell':[.03,.7],'Music box':[.01,.6]};
 const sdef=p=>{const d=SDEF[p.snd];if(d){p.att=d[0];p.rel=d[1]}};
 let cp=null,lPrev=0,ai=0;
 const regOct=p=>{const L=TR[4],r=p.reg||'Auto';if(p.role==='Sparkle')return r==='Low'?4:r==='High'?6:5;
  if(r==='Low')return 2;if(r==='High')return 4;if(L.m)return 3;return (Math.round(L.p.range)||1)>=2||(L.p.loct||0)>0?2:4};
 const nextHit=()=>{const T=S;for(let i=1;i<=32;i++)if(T.pt[((tk+i)%T.st+T.st)%T.st])return i;return 16};
 /* v0.27: Satellite rebuilt — composed parts instead of random notes, after how techno, electro and house records use a second line:
    Long   · guide tones: the 3rd / 5th / 7th of each chord, moving as little as possible (house pads and Detroit strings);
    Answer · call and response: in bars 3–4 it echoes what the lead played in bars 1–2, an 8th later and an octave away, only where the lead rests;
    Arp    · electro / house stab figures from a small library, the 4th bar answers;
    Sparkle· short bell cascades in bars 2 and 4, in the lead's gaps.
    Richer sounds: Super saw (5 detuned saws, wide), Poly pulse (two pulses + sub), Keys, FM pluck, Strings, Mallet, Glass bell, Music box. */
 const _=null,SPK=[[_,_,10,_,_,_,12,_,_,_,14,_,_,_,_,_],[_,_,_,_,_,_,14,_,12,_,_,_,10,_,_,_],[_,_,4,_,10,_,_,_,_,_,12,_,_,_,_,_],[_,_,_,10,_,_,_,_,_,_,12,_,_,14,_,_]],
  ARPT=[[0,_,4,_,10,_,4,_,0,_,4,_,12,_,10,_],[2,_,_,2,_,_,4,_,_,_,2,_,_,4,_,_],[0,10,_,0,10,_,0,_,0,10,_,0,10,_,4,_],[_,_,4,_,_,_,4,_,_,_,4,_,_,2,_,_]];
 const SST={tpl:null,mem:{},cp:null};window.orbSatState=SST;
 const fitRing=t=>{const pt=t.map(x=>x==null?0:1);S.st=16;try{const ft=bassFit(S,pt);Object.assign(S,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){Object.assign(S,{h:pt.reduce((a,b)=>a+b,0),r:0,ten:0})}S.pt=pat(S)};
 window.orbSatRing=()=>{const p=S.p,L=TR[4];SST.mem={};SST.cp=null;
  if(p.role==='Sparkle'){SST.tpl=pick(SPK);fitRing(SST.tpl)}
  else if(p.mot==='Arp'){SST.tpl=pick(ARPT);fitRing(SST.tpl)}
  else if(p.mot==='Answer'){SST.tpl=null;Object.assign(S,{st:L.st||16,h:Math.max(3,L.h||5),r:((L.r||0)+2)%(L.st||16),ten:L.ten||0});S.pt=pat(S)}
  else{SST.tpl=null;Object.assign(S,{st:16,h:2,r:0,ten:0});S.pt=pat(S)}};
 // remember the lead's notes in bars 1–2 of every 4 (for Answer)
 const _fl=fire;fire=function(k,w){const r=_fl.apply(this,arguments);if(k===4){const bar=Math.floor(tk/16);if(((bar%4)+4)%4<2)SST.mem[(((bar%2)+2)%2)*16+((tk%16)+16)%16]=lastDeg}return r};
 const LH=[];let echoQ=[],ePrev=false;window.orbSatSdef=sdef;
 const trig=(w,f,hold)=>{if(S.m||!f||!isFinite(f)||(QOS.ml||0)>=2)return;   /* under heavy load the follow-motions pause */SST.dF=f;SST.dH=hold;try{subDrone(w)}finally{SST.dF=0}};
 const xo=(p,L)=>3+leadOct(L.p)+(p.reg==='Low'?0:p.reg==='High'?2:1);
 const _fx=fire;fire=function(k,w){const r=_fx.apply(this,arguments);try{const p=S.p,m=p.mot,L=TR[4],sd=60/G.bpm/4;
   if(k===4&&L.p.mode!=='Acid 303'){LH.push(lastDeg);if(LH.length>4)LH.shift();if(!S.m&&p.role!=='Sparkle'&&m==='Double lead')trig(w,d2f(lastDeg,xo(p,L)),sd*1.2)}
   else if(k===6&&!S.m&&p.role!=='Sparkle'&&m==='Double bass'&&window.BLF)trig(w,BLF*(p.reg==='High'?4:2),sd*1.2)}catch(e){}return r};
 const _ax=arrStep;arrStep=function(w){_ax.apply(this,arguments);try{const p=S.p,m=p.mot;if(!ctx||S.m||p.role==='Sparkle'||(m!=='Echo hook'&&m!=='Last-note hold'))return;
   const L=TR[4],sd=60/G.bpm/4,s=((tk%16)+16)%16,bar=Math.floor(tk/16),lOn=!L.m&&L.p.mode!=='Acid 303',lp=lOn&&L.pt[((tk%L.st)+L.st)%L.st],o=xo(p,L);
   if(m==='Echo hook'){if(lp){echoQ=[];ePrev=true;return}if(ePrev&&LH.length>=2)echoQ=LH.slice((p.amt||.5)<.5?-2:-3);ePrev=false;if(echoQ.length)trig(w,d2f(echoQ.shift(),o),sd*.9)}
   else if(s===0&&bar>0&&bar%((p.amt||.5)>.6?2:4)===0&&LH.length&&lOn)trig(w,d2f(LH[LH.length-1],o),Math.min(3.2,16*sd*.95))}catch(e){}};
 const dg=(v,n)=>v>=10?v-10+n:v;
 subDrone=function(w){const T=S,p=T.p,L=TR[4],n=SC[G.scale].length,sd=60/G.bpm/4;if(!ctx)return;
  const s=((tk%16)+16)%16,bar=Math.floor(tk/16),q=((bar%4)+4)%4,lOn=!L.m&&L.p.mode!=='Acid 303',lp=lOn&&L.pt[((tk%L.st)+L.st)%L.st];
  const sp=p.role==='Sparkle',mot=sp?'Sparkle':(p.mot||'Long'),amt=p.amt==null?.5:p.amt,xm=XM.has(mot);let d,d2=null;if(xm&&!SST.dF)return;
  if(!SST.tpl&&(mot==='Sparkle'||mot==='Arp'))orbSatRing();
  if(xm){}else if(mot==='Sparkle'){if(q%2===0||lp)return;const v=SST.tpl[s];if(v==null)return;if(amt<.4&&s%4!==2)return;d=cur.r+dg(v,n)}
  else if(mot==='Arp'){const v=SST.tpl[s];if(v==null)return;if(amt<.4&&s%2===1)return;d=cur.r+dg(v,n);if(q===3&&s>=12)d+=2;if(s%8===0&&amt>.55)d2=d+4}
  else if(mot==='Answer'){if(q<2||lp)return;const m=SST.mem[(((bar%2)+2)%2)*16+((s-2+16)%16)];if(m==null)return;d=m-n}
  else{if(s!==0&&!(s===8&&amt>.6))return;const tgt=[2,4,6].map(x=>cur.r+x);let best=null,bs=1e9;const c0=SST.cp==null?tgt[0]:SST.cp;
   for(const o of[-n,0,n])for(const t of tgt){const v=t+o;if(v<-3||v>n+5)continue;const sc=Math.abs(v-c0)+(v>c0?.01:0);if(sc<bs){bs=sc;best=v}}SST.cp=best;d=best}
  let f=xm?SST.dF:d2f(d,regOct(p)+(G.ldUp||0)),f2=d2!=null?d2f(d2,regOct(p)+(G.ldUp||0)):0;while(f>(sp||xm?2000:1000)){f/=2;f2/=2}const FQ=f2?[f,f2]:[f];
  const tone=p.tone==null?.5:p.tone,space=p.space==null?.4:p.space,trim=(typeof dbg==='function'&&typeof TRIM!=='undefined')?dbg(TRIM[9]||0):1,
   g=ctx.createGain(),out=A.ld||A.dk;g.__k=9;let e;const lv=T.lv*trim*(xm?(mot==='Double bass'?.16:.22):sp?.24:mot==='Arp'?(f2?.2:.25):.3)/Math.sqrt(FQ.length),
   AT=.003+Math.pow(p.att==null?.2:p.att,2)*.6,RL=.08+Math.pow(p.rel==null?.32:p.rel,2)*2.4;
  const env=(a,hold,rl)=>{g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(lv,w+a);g.gain.setValueAtTime(lv,w+Math.max(a,hold));g.gain.setTargetAtTime(.0001,w+Math.max(a,hold),rl/3);e=w+Math.max(a,hold)+rl+.1};
  const cap=600*Math.pow(2,tone*3);
  const lpF=(c,q2)=>{const x=ctx.createBiquadFilter();x.type='lowpass';x.frequency.value=Math.min(cap*1.4,c);x.Q.value=q2;x.connect(g);return x};
  const nh=()=>{for(let i=1;i<=32;i++)if(T.pt[((tk+i)%T.st+T.st)%T.st])return i;return 16};
  const snd=OLDSND[p.snd]||p.snd||SND[p.role][0],hold=xm?SST.dH:mot==='Arp'?sd*.7:mot==='Answer'?sd*1.4:mot==='Long'?Math.min(3.2,nh()*sd*.97):sd,
   at=mot==='Arp'?Math.min(AT,.03):mot==='Last-note hold'?Math.max(AT,.3):AT,rl=mot==='Arp'?Math.min(RL,.35):RL;
  if(snd==='Super saw'){env(at,hold,rl);const fl=lpF(f*(1.3+tone*4),.7);fl.frequency.setValueAtTime(Math.min(cap*1.4,f*(2+tone*6)),w);fl.frequency.setTargetAtTime(Math.min(cap*1.4,f*(1.3+tone*4)),w+.01,.15);
   FQ.forEach(fq=>(xm||QOS.lvl>=2?[-10,0,10]:[-14,-7,0,7,14]).forEach((dt,i,A5)=>{const o=osc('sawtooth',fq,w,e),pn=ctx.createStereoPanner(),vg=ctx.createGain();o.detune.value=dt+(R()-.5)*3;pn.pan.value=(i-(A5.length-1)/2)*.32;vg.gain.value=.45;o.connect(vg);vg.connect(pn);pn.connect(fl)}))}
  else if(snd==='Poly pulse'){env(at,hold,rl);const fl=lpF(f*(1.5+tone*4),1.4);FQ.forEach(fq=>{[0,6].forEach(dt=>{const o=mkOsc();o.setPeriodicWave(pulseWave(.4));o.frequency.value=fq;o.detune.value=dt;o.start(w);o.stop(e);o.connect(fl)});const sb=osc('square',fq/2,w,e),sg=ctx.createGain();sg.gain.value=.25;sb.connect(sg);sg.connect(fl)})}
  else if(snd==='Keys'){env(Math.min(at,.02),Math.min(hold,sd*2),Math.max(rl,.25));const fl=lpF(f*(2+tone*5),.8);fl.frequency.setTargetAtTime(Math.min(cap*1.4,f*1.5),w+.02,.25);FQ.forEach(fq=>{const o=mkOsc();o.setPeriodicWave(pulseWave(.45));o.frequency.value=fq;o.start(w);o.stop(e);o.connect(fl);const t=osc('triangle',fq*2,w,e),tg=ctx.createGain();tg.gain.value=.2;t.connect(tg);tg.connect(fl)})}
  else if(snd==='FM pluck'){env(.003,.01,Math.max(.25,rl));const fl=lpF(cap,.6);FQ.forEach(fq=>{const c=osc('sine',fq,w,e),m=osc('sine',fq*2,w,e),mg=ctx.createGain();mg.gain.setValueAtTime(fq*(1.2+tone*2),w);mg.gain.setTargetAtTime(0,w,.05);m.connect(mg);mg.connect(c.frequency);c.connect(fl)})}
  else if(snd==='Strings'){env(Math.max(at,.15),hold,rl);const fl=lpF(f*(1.5+tone*4),.6);FQ.forEach(fq=>[-10,0,10].forEach(dt=>{const o=osc('sawtooth',fq,w,e);o.detune.value=dt;o.connect(fl)}))}
  else if(snd==='Mallet'){env(.002,.006,Math.max(.3,rl));const fl=lpF(cap*.8,.5);FQ.forEach(fq=>{osc('sine',fq,w,e).connect(fl);const o=osc('sine',fq*4,w,e),og=ctx.createGain();og.gain.setValueAtTime(.18,w);og.gain.setTargetAtTime(0,w,.03);o.connect(og);og.connect(fl);const m=osc('sine',fq*3,w,e),mg=ctx.createGain();mg.gain.setValueAtTime(fq*.5,w);mg.gain.setTargetAtTime(0,w,.08);m.connect(mg)})}
  else if(snd==='Music box'){env(.002,.005,Math.max(.4,rl));const fl=lpF(cap,.5);FQ.forEach(fq=>{osc('sine',fq,w,e).connect(fl);const o=osc('sine',fq*4,w,e),og=ctx.createGain();og.gain.setValueAtTime(.05+tone*.15,w);og.gain.setTargetAtTime(0,w,.12);o.connect(og);og.connect(fl)})}
  else{env(.004,.01,Math.max(.5,rl));const fl=lpF(cap,.5);FQ.forEach(fq=>{const c=osc('sine',fq,w,e),m=osc('sine',fq*3.5,w,e),mg=ctx.createGain();mg.gain.setValueAtTime(fq*(.35+tone*1.1),w);mg.gain.setTargetAtTime(0,w,.25);m.connect(mg);mg.connect(c.frequency);c.connect(fl)})}
  const ml=ctx.createBiquadFilter(),ml2=ctx.createBiquadFilter();ml.type=ml2.type='lowpass';ml.frequency.value=ml2.frequency.value=cap;ml.Q.value=.6;ml2.Q.value=.5;g.connect(ml);ml.connect(ml2);ml2.__k=9;
  send(ml2,out,(sp?.15:.08)+space*(sp?.5:.35),.08+space*(sp?.5:.4))};
 // card controls (Role, Sound, Motion, Register)
 const ctl=()=>{try{const card=S.mb&&S.mb.closest('.card'),g=card&&card.querySelector('.grid');if(!g||g.querySelector('.satc'))return;const p=S.p;
   const sep=document.createElement('div');sep.className='bksep satc';sep.textContent='Satellite';g.prepend(sep);const els=[];
   const add=(el,grp)=>{el.classList.add('satc');el.dataset.g=grp;els.push([el,grp]);sep.after(...[el]);return el};
   const reg=mkSel('Register',['Auto','Low','High'],p.reg||'Auto',v=>{p.reg=v});
   const mo=mkSel('Motion',['Long','Answer','Arp',...XM],p.mot||'Long',v=>{p.mot=v;cp=null;ai=0;orbSatRing();if(!(XM.has(v)?ALLS:SND[p.role]||SND.Counter).includes(p.snd)){p.snd=(SND[p.role]||SND.Counter)[0];sdef(p)}setTimeout(reCtl,0)});
   const sn=mkSel('Sound',XM.has(p.mot)&&p.role!=='Sparkle'?ALLS:SND[p.role]||SND.Counter,p.snd,v=>{p.snd=v;sdef(p);try{window.syncFaders&&syncFaders()}catch(e){}});
   const ro=mkSel('Role',['Counter','Sparkle'],p.role,v=>{p.role=v;p.snd=SND[v][0];sdef(p);cp=null;orbSatRing();g.querySelectorAll('.satc').forEach(x=>x.remove());ctl()});
   add(reg,'pat');if(p.role!=='Sparkle')add(mo,'pat');add(sn,'snd');add(ro,'pat');
   const fix=()=>els.forEach(([el,grp])=>el.dataset.g=grp);queueMicrotask(fix);setTimeout(fix,0);setTimeout(fix,200)}catch(e){}};
 const reCtl=()=>{try{const card=S.mb&&S.mb.closest('.card');if(card)card.querySelectorAll('.satc').forEach(x=>x.remove())}catch(e){}ctl()};
 const ren=()=>{try{if(typeof pads!=='undefined'&&pads[9]){if(pads[9].textContent!=='Satellite')pads[9].textContent='Satellite';pads[9].style.display='';pads[9].style.setProperty('--col',S.c)}
   document.querySelectorAll('.chip[data-k="9"]').forEach(b=>{if(b.textContent!=='Satellite'){b.textContent='Satellite';b.style.setProperty('--col',S.c)}})}catch(e){}};
 // Launch
 const MEL=new Set(['Melodic House','Melancholic','Hopeful','Dreamy']),SPC=new Set(['Ethereal','Deep Space','Ambient','Drone']);
 const SAT={'Melodic House':[.35,.7,'mix'],Melancholic:[.35,.75,'long'],Hopeful:[.3,.6,'answer'],Dreamy:[.35,.4,'long'],
  Ethereal:[.4,.25,'long'],'Deep Space':[.35,.2,'long'],Ambient:[.4,.35,'long'],Drone:[.3,.3,'long'],
  Italo:[.3,.8,'answer'],'Groove Techno':[.25,.7,'answer'],Temporal:[.3,.6,'mix'],Vector:[.25,.3,'answer']};
 const DEFP={role:'Counter',snd:'Warm saw',mot:'Long',reg:'Auto',amt:.5,tone:.5,space:.4,att:.2,rel:.32};
 const norm=()=>{const P=S.p;['oct','hold','harm','cut','follow'].forEach(k=>delete P[k]);for(const k in DEFP)if(P[k]==null)P[k]=DEFP[k];if(!SND[P.role])P.role='Counter';if(OLDSND[P.snd])P.snd=OLDSND[P.snd];if(!(XM.has(P.mot)&&P.role!=='Sparkle'?ALLS:SND[P.role]).includes(P.snd))P.snd=SND[P.role][0];if(S.n!=='Satellite')S.n='Satellite'};
 UI.on(norm);
 const ARPS={Italo:.45,Vector:.45,Hopeful:.35,Temporal:.35,'Groove Techno':.35,'Melodic House':.3,Dreamy:.2};   // share of Satellite Launches that arp
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{norm();const L=TR[4],c=SAT[curMood];S.m=true;cp=null;ai=0;
   const take=L.m&&(MEL.has(curMood)||SPC.has(curMood));
   if(c&&R()<(take?.4:c[0])){const p=S.p,wantArp=!take&&R()<(ARPS[curMood]||0),role=take||wantArp||R()<c[1]?'Counter':'Sparkle';p.role=role;p.snd=pick(SND[role]);p.reg='Auto';
    p.mot=take?'Long':c[2]==='mix'?pick(['Long','Answer']):c[2]==='long'?'Long':'Answer';
    if(wantArp){p.mot='Arp';p.snd=pick(['Poly pulse','Keys','FM pluck','Super saw'])}
    {const fm=window.orbModern&&orbModern.last;if(fm&&role==='Counter'&&p.mot!=='Arp')p.snd=({rolling:pick(['Super saw','Strings']),bounce:pick(['Keys','Poly pulse']),peak:'FM pluck',minimal:pick(['FM pluck','Keys'])})[fm];if(fm&&role==='Sparkle')p.snd=({rolling:'Glass bell',bounce:'Mallet',peak:'Mallet',minimal:'FM pluck'})[fm]}
    sdef(p);if(p.mot==='Arp'){p.att=.05;p.rel=.2}
    if(role==='Counter'&&p.mot==='Arp')Object.assign(S,{st:16,h:pick([8,8,6,12]),r:pick([0,2]),ten:0});
    else if(role==='Counter'&&p.mot==='Long')Object.assign(S,{st:16,h:pick([2,2,3]),r:0,ten:0});
    else if(role==='Counter')Object.assign(S,{st:16,h:pick([4,5,6]),r:Math.floor(R()*16),ten:0});
    else Object.assign(S,{st:pick([16,16,12]),h:pick([3,4,5]),r:Math.floor(R()*12),ten:0});
    orbSatRing();p.amt=+(.45+R()*.25).toFixed(2);p.tone=+((SPC.has(curMood)?.2:.3)+R()*.2).toFixed(2);p.space=+((role==='Sparkle'?.5:.25)+R()*.2).toFixed(2);S.lv=.4;S.m=false;
    // make room so the arrangement stays airy: never Sparkle over a dense lead or arp; a busy lead turns Answers into Long notes;
    // Counter thins the pad a little and takes the lead down a notch when it answers; the dub stab steps back; too many layers → less Satellite
    const PD=TR[5],ST=TR[8],ld=!L.m?L.h/Math.max(1,L.st):0;
    if(role==='Sparkle'&&!L.m&&(G.arpOn||ld>=.6))S.m=true;
    else{if(role==='Counter'&&((p.mot==='Answer'&&ld>.5)||(p.mot==='Arp'&&(G.arpOn||ld>.5)))){p.mot='Long';sdef(p);Object.assign(S,{st:16,h:2,r:0});S.pt=pat(S)}
     if(role==='Counter'){if(!PD.m){PD.p.size=Math.min(Math.round(PD.p.size||4),3);PD.lv=(PD.lv||.5)*.88}
      if(p.mot==='Answer'&&!L.m&&L.h>7){L.h=Math.max(5,Math.round(L.st*.4));L.pt=pat(L)}}
     if(!ST.m&&R()<.6)ST.m=true;
     const layers=[L,PD,ST].filter(x=>!x.m).length+(TR[6].p.bns==='Phrase'&&!TR[6].m?1:0);if(layers>=3){p.amt=Math.min(p.amt,.4);if(!ST.m)ST.m=true}}
    if(!S.m)setTimeout(()=>{try{if(typeof say==='function')say('🛰 SATELLITE · '+(role==='Counter'?'COUNTER · '+p.mot.toUpperCase():'SPARKLE')+' · '+p.snd.toUpperCase())}catch(e){}},900)}
   setTimeout(ren,50);setTimeout(reCtl,60)}catch(e){}return r};
 ren();setTimeout(ren,300);let sig='';UI.on(()=>{ren();const p=S.p,g=[p.role,p.snd,p.mot,p.reg].join('|');if(g!==sig){sig=g;reCtl()}else ctl()});setTimeout(ctl,200);window.orbSatellite={regOct,reCtl}}
