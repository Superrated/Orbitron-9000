/* v6: moods, richer pad (extended chords, voice leading, stereo, motion), motif melody generator */
const MOODS={
 Dark:{sc:['Phrygian','Minor','Harm. minor'],pr:[[0,1,0,6],[0,5,6,0],[0,6,5,4],[0,1,5,6]],sh:['tri','sus2','7'],b:[112,124],cut:350,sw:700,att:.5,lh:[3,4,5],sp:.2,bias:.3,dv:.85,md:['Motif','Interval'],wave:.2,dec:.3,res:4},
 Melancholic:{sc:['Minor','Dorian'],pr:[[0,5,2,6],[0,3,6,2],[0,5,3,6],[0,6,5,6]],sh:['7','9','add9'],b:[116,126],cut:500,sw:1300,att:.4,lh:[4,5,6],sp:.3,bias:.4,dv:.75,md:['Motif','Marbles'],wave:.35,dec:.28,res:3.5},
 Dreamy:{sc:['Major','Min pentatonic','Dorian'],pr:[[0,4,5,3],[0,2,3,4],[0,3,0,4],[0,5,3,4]],sh:['add9','sus2','9'],b:[110,122],cut:800,sw:1800,att:.55,lh:[5,6,7],sp:.35,bias:.5,dv:.7,md:['Motif','Up/Down'],wave:.15,dec:.4,res:2.5},
 Tense:{sc:['Harm. minor','Phrygian'],pr:[[0,3,4,0],[0,1,4,0],[0,5,4,3],[0,6,4,3]],sh:['7','sus4','tri'],b:[124,132],cut:600,sw:1500,att:.3,lh:[5,7,9],sp:.35,bias:.35,dv:.6,md:['Interval','Marbles','Motif'],wave:.5,dec:.2,res:6},
 Ethereal:{sc:['Whole tone','Hirajoshi','Min pentatonic'],pr:[[0,2,4,2],[0,3,1,4],[0,1,3,2],[0,4,2,5]],sh:['sus2','quart','add9'],b:[100,116],cut:900,sw:2200,att:.6,lh:[3,4,5],sp:.4,bias:.55,dv:.8,md:['Up/Down','Motif'],wave:.1,dec:.5,res:2},
 Hopeful:{sc:['Major','Dorian'],pr:[[0,4,5,3],[0,3,4,0],[0,5,1,4],[0,2,3,4]],sh:['tri','add9','7'],b:[120,130],cut:900,sw:1800,att:.35,lh:[6,7,9],sp:.3,bias:.5,dv:.65,md:['Motif','Marbles'],wave:.45,dec:.25,res:3},
 Noir:{sc:['Harm. minor','Minor'],pr:[[0,5,1,4],[0,3,5,4],[0,6,2,5]],sh:['7','9','sus4'],b:[108,120],cut:420,sw:1000,att:.45,lh:[3,4,5],sp:.25,bias:.35,dv:.8,md:['Motif','Interval'],wave:.3,dec:.32,res:4}};
MOODS.Dreamy.sc.push('Major pentatonic','Sus pentatonic');MOODS.Dreamy.md.push('Chord arp');MOODS.Ethereal.sc.push('Sus pentatonic');MOODS.Ethereal.md.push('Chord arp');MOODS.Hopeful.sc.push('Lydian','Mixolydian','Major pentatonic');MOODS.Hopeful.md.push('Chord arp');
MOODS.Drone={sc:['Major pentatonic','Sus pentatonic','Lydian'],pr:[[0,1,0,4],[0,4,3,4],[0,2,4,2],[0,5,3,4]],sh:['sus2','add9','tri','quart'],b:[126,132],cut:700,sw:1600,att:.5,lh:[5,7,9],sp:.3,bias:.5,dv:.75,md:['Chord arp','Motif','Interval'],wave:.35,dec:.3,res:4,pt:['Strings','Glass','Choir','Warm saw']};
MOODS.Acid={sc:['Phrygian','Minor','Harm. minor','Min pentatonic'],pr:[[0,0,5,0],[0,1,0,6],[0,5,0,4]],sh:['tri','sus4','tri'],b:[140,152],cut:500,sw:900,att:.2,lh:[9,11,13],sp:.3,bias:.3,dv:.85,md:['Acid 303'],wave:.05,dec:.2,res:9,pt:['Hollow','Air','Warm saw'],acid:1,hat:[[16,4,2],[16,8,1]],kick:{pitch:50,dec:.3,punch:5,drive:3},padlv:.28,mute:[6],grit:.3,duck:.75};
MOODS.Power={sc:['Phrygian','Harm. minor','Minor'],pr:[[0,0,1,0],[0,5,0,6],[0,1,5,0]],sh:['sus4','tri','quart'],b:[138,148],cut:350,sw:800,att:.15,lh:[5,7,9],sp:.3,bias:.25,dv:.7,md:['Interval','Marbles'],wave:.6,dec:.22,res:5,pt:['Hollow','Choir','Warm saw'],power:1,hat:[[16,4,2],[16,11,0]],kick:{pitch:54,dec:.34,punch:6,drive:6},padlv:.3,grit:.35,duck:.85};
let padStyle='Progression',curMood='Melancholic',pshape=[],pmean=null,mot=[],mp=-1;
const SHP={tri:[0,2,4],'7':[0,2,4,6],'9':[0,2,4,6,8],add9:[0,2,4,8],sus2:[0,1,4],sus4:[0,3,4],quart:[0,3,6],open:[0,3,5]};
// chord symbols: numbers = scale degrees; strings = roman numerals relative to the key (b/# prefix, upper = major, lower = minor) — out-of-scale ones are played as a shifted in-scale chord of the same quality
const RMN={I:0,II:2,III:4,IV:5,V:7,VI:9,VII:11};
function chordSpec(e){if(typeof e==='number')return{d:e,x:0};const m=/^([b#]?)([ivIV]+)$/.exec(e);if(!m)return{d:0,x:0};const up=m[2]===m[2].toUpperCase(),root=((RMN[m[2].toUpperCase()]||0)+(m[1]==='b'?-1:m[1]==='#'?1:0)+12)%12,s=SC[G.scale],n=s.length;
 const q=d=>{const a=s[((d%n)+n)%n],b=s[((d+2)%n+n)%n]+(d+2>=n?12:0),c=s[((d+4)%n+n)%n]+(d+4>=n?12:0);return[(b-a+12)%12,(c-a+12)%12]};
 const want=up?4:3;let best=null;for(let d=0;d<n;d++){const[t3,t5]=q(d);if(t3!==want||t5!==7)continue;let x=((root-s[d])%12+12)%12;if(x>6)x-=12;if(!best||Math.abs(x)<Math.abs(best.x))best={d,x}}
 return best||{d:0,x:0}}
// harmonic rhythm patterns (in units of the pad's Bars setting), per chord count
const HRP={4:[[1,1,1,1],[1,1,1,1],[2,1,1,2],[2,2,3,1],[3,1,3,1],[1.5,.5,1.5,.5],[2,1,1,4]],3:[[2,1,1],[1,1,2],[2,2,4]],2:[[1,1],[3,1],[2,1]],1:[[1]]};
function padSched(T,L){const n=T.st;if(!PD||PD.length!==n)return tk%L===0?[Math.floor(tk/L)%n,L]:null;const u=L,st=[];let a=0;PD.forEach(d=>{st.push(a);a+=Math.round(d*u)});const C=a,q=((tk%C)+C)%C;
 for(let i=0;i<n;i++){const s0=(st[i]-(PPUSH&&i>0?1:0)+C)%C;if(q===s0){const nx=(i+1<n?st[i+1]-(PPUSH?1:0):C)-(st[i]-(PPUSH&&i>0?1:0));return[i,nx]}}return null}
function topLead(ds,n){if(PTOP==null){PTOP=Math.max(...ds);return ds}let best=ds,bc=1e9;const L=ds.length;
 for(let r=0;r<L;r++){let c=ds.slice();for(let j=0;j<r;j++)c=c.slice(1).concat(c[0]+n);for(const sh of[-n,0,n]){const v=c.map(x=>x+sh),mn=v.reduce((a,b)=>a+b,0)/L;if(mn<-2||mn>n+3)continue;const cost=Math.abs(Math.max(...v)-PTOP)+.25*Math.abs(mn-(pmean||0));if(cost<bc){bc=cost;best=v}}}
 PTOP=Math.max(...best);return best}
function newProg(n){const M=MOODS[curMood],pn=pick(M.pr),sp=Array.from({length:n},(_,i)=>chordSpec(pn[i%pn.length]));prog=sp.map(c=>c.d);PX=sp.map(c=>c.x);pshape=prog.map(()=>pick(M.sh));pmean=null;PTOP=null;
 const hv=M.hr==null?.35:M.hr,opts=HRP[n];PD=opts&&R()<hv?pick(opts.slice(1)):null;PPUSH=PD&&R()<.4?1:0}
MODES.push('Motif');
TR[5].x.push(['Open voicing','open',0,1,.01],['Deep root','sub',0,1,.01],['Motion','lfo',0,1,.01]);Object.assign(TR[5].p,{open:.4,sub:.3,lfo:.5});TR[5].x.find(e=>e[1]==='size')[3]=5;
const PADN=['Warm saw','Strings','Hollow','Glass','Choir','Organ','Air'],VOW=[[800,1150,2900],[450,800,2830],[300,2300,3000],[350,600,2700],[550,1800,2500]],
 PGAIN={'Warm saw':1,Strings:1.25,Hollow:.9,Glass:1.35,Choir:1.15,Organ:1.1,Air:3.8},PCUT={'Warm saw':1,Strings:1.5,Hollow:.8,Glass:3,Choir:3,Organ:2.5,Air:4};
Object.assign(MOODS.Dark,{pt:['Hollow','Choir','Air','Warm saw']});Object.assign(MOODS.Melancholic,{pt:['Strings','Choir','Warm saw','Glass']});Object.assign(MOODS.Dreamy,{pt:['Glass','Air','Strings','Organ']});
Object.assign(MOODS.Tense,{pt:['Hollow','Warm saw','Air','Choir']});Object.assign(MOODS.Ethereal,{pt:['Glass','Air','Choir','Organ']});Object.assign(MOODS.Hopeful,{pt:['Strings','Organ','Glass','Warm saw']});Object.assign(MOODS.Noir,{pt:['Hollow','Organ','Choir','Strings']});
Object.assign(TR[5].p,{patch:'Rotate',rot:0,trem:0,apan:.15});TR[5].x.push(['Tremolo','trem',0,1,.01],['Auto-pan','apan',0,1,.01]);
function padPatch(t){const p=TR[5].p,l=MOODS[curMood].pt;return p.patch==='Rotate'?l[(t+(p.rot||0))%l.length]:p.patch==='Random'?pick(l):p.patch}
/* pad: 7 sound types (saw, strings, hollow square, FM glass, formant choir, organ, tuned-noise air); each chord re-rolls small variations */
const CHL=[];function chordLog(w,c){CHL.push({w,c});if(CHL.length>8)CHL.shift()}
function chordAt(t){if(!CHL.length||CHL[CHL.length-1].c!==cur&&!CHL.some(e=>e.c===cur))return cur;for(let i=CHL.length-1;i>=0;i--)if(CHL[i].w<=t+.002)return CHL[i].c;return cur}
function padChord(t,w){const T=TR[5],p=T.p,n=SC[G.scale].length;let ds=(SHP[pshape[t]]||SHP['7']).slice(0,Math.round(p.size)).map(i=>prog[t]+i);
 if(pmean!=null){let c=ds.slice(),best=c,bd=1e9;for(let r=0;r<ds.length;r++){const m=c.reduce((a,b)=>a+b,0)/c.length,dd=Math.abs(m-pmean);if(dd<bd){bd=dd;best=c.slice()}c=c.slice(1).concat(c[0]+n)}ds=best}
 let mm=ds.reduce((a,b)=>a+b,0)/ds.length;if(mm>n+2){ds=ds.map(x=>x-n);mm-=n}else if(mm<-1){ds=ds.map(x=>x+n);mm+=n}pmean=mm;ds=topLead(ds,n);cur={r:prog[t],n:ds,x:(PX.length===prog.length?PX[t]||0:0)};chordLog(w,cur)}
function pad(t,w,dur){if(padStyle==='Chord memory'&&window.cmStab)return cmStab(t,w,dur);OCT=G.oct||0;const T=TR[5],p=T.p,n=SC[G.scale].length,rel=Math.min(p.rel,dur*1.5+.1),e=w+dur+rel+.1,pt=padPatch(t),vr=.75+R()*.5;
 let ds=(SHP[pshape[t]]||SHP['7']).slice(0,Math.round(p.size)).map(i=>prog[t]+i);
 if(pmean!=null){let c=ds.slice(),best=c,bd=1e9;for(let r=0;r<ds.length;r++){const m=c.reduce((a,b)=>a+b,0)/c.length,dd=Math.abs(m-pmean);if(dd<bd){bd=dd;best=c.slice()}c=c.slice(1).concat(c[0]+n)}ds=best}
 let mm=ds.reduce((a,b)=>a+b,0)/ds.length;if(mm>n+2){ds=ds.map(x=>x-n);mm-=n}else if(mm<-1){ds=ds.map(x=>x+n);mm+=n}pmean=mm;
 ds=topLead(ds,n);cur={r:prog[t],n:ds,x:(PX.length===prog.length?PX[t]||0:0)};chordLog(w,cur);
 const q1=ctx.createBiquadFilter(),q2=ctx.createBiquadFilter(),g=padGain(ctx.createGain()),a=p.att*dur*vr*(pt==='Strings'?1.3:pt==='Glass'?.6:pt==='EP chords'?.04:pt==='Wind'?1.4:1),pa=ctx.createStereoPanner(),pb=ctx.createStereoPanner(),pn=ctx.createStereoPanner(),inL=ctx.createGain(),inR=ctx.createGain(),l=ctx.createGain(),lf=osc('sine',.08+R()*.25,w,e),cb=p.cut*(PCUT[pt]||1),sw=p.sweep*(.6+R()*.8);
 pa.pan.value=-.65;pb.pan.value=.65;l.gain.value=sw*.4*p.lfo;lf.connect(l);inL.connect(q1);inR.connect(q2);
 [q1,q2].forEach(q=>{q.type='lowpass';q.Q.value=.8;q.frequency.setValueAtTime(cb,w);q.frequency.linearRampToValueAtTime(cb+sw,w+dur*.5);q.frequency.linearRampToValueAtTime(cb,w+dur);l.connect(q.frequency)});
 const lite=(QOS.floor||0)>=1&&!['Glass','Air','Wavetable','Cloud','Tron','Bell pad','Fold','EP chords','Sync sweep','Wind'].includes(pt),gv=T.lv*.16*Math.sqrt(4/ds.length)*(PGAIN[pt]||1)*(lite?1.3:1);g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(gv,w+a);g.gain.setValueAtTime(gv,w+dur);g.gain.linearRampToValueAtTime(.0001,w+dur+rel);
 const oc=i=>p.oct+(i>1&&R()<p.open?1:0),side=i=>i%2?inR:inL,
  sideG=v=>{const c=[null,null];return i=>{const j=i%2;if(!c[j]){c[j]=ctx.createGain();c[j].gain.value=v;c[j].connect(j?inR:inL)}return c[j]}}; /* perf: one shared gain per side for fixed-level layers */
 if(pt==='Glass'){const rr=pick([2,3,3.5,4]);ds.forEach((d,i)=>{const f=d2f(d,oc(i)),o=osc('sine',f,w,e),m=osc('sine',f*rr,w,e),mg=ctx.createGain(),o2=osc('sine',f*2,w,e),g2=ctx.createGain();mg.gain.setValueAtTime(f*1.3,w);mg.gain.exponentialRampToValueAtTime(f*.12,w+dur);m.connect(mg);mg.connect(o.frequency);g2.gain.value=.25;o2.connect(g2);o.connect(side(i));g2.connect(side(i))})}
 else if(pt==='Choir'){const fin=ctx.createGain(),fo=ctx.createGain(),v1=pick(VOW),v2=pick(VOW);fo.gain.value=2.2;[0,1,2].forEach(k=>{const b=ctx.createBiquadFilter(),bg=ctx.createGain();b.type='bandpass';b.Q.value=7+k*3;b.frequency.setValueAtTime(v1[k],w);b.frequency.linearRampToValueAtTime(v2[k],w+dur);bg.gain.value=[1,.55,.3][k];fin.connect(b);b.connect(bg);bg.connect(fo)});fo.connect(inL);fo.connect(inR);
  ds.forEach((d,i)=>(lite?[i%2?1:-1]:[-1,1]).forEach(c=>{const o=osc('sawtooth',d2f(d,oc(i)),w,e);o.detune.value=c*p.det;o.connect(fin)}))}
 else if(pt==='Organ'){ds.forEach((d,i)=>{const f=d2f(d,oc(i));(lite?[1,2]:[1,2,4]).forEach((hm,k)=>{const o=osc('sine',f*hm,w,e),gg=ctx.createGain();gg.gain.value=[1,.55,.3][k]*(.7+R()*.6);o.connect(gg);gg.connect(side(i))})})}
 else if(pt==='Air'){const ns=mkBuf(),SG=sideG(.12);ns.buffer=A.nb;ns.loop=true;ns.start(w);ns.stop(e);ds.forEach((d,i)=>{const b=ctx.createBiquadFilter(),bg=ctx.createGain(),o=osc('sine',d2f(d,oc(i)),w,e);b.type='bandpass';b.Q.value=18;b.frequency.value=d2f(d,oc(i)+1);bg.gain.value=8;ns.connect(b);b.connect(bg);bg.connect(side(i));o.connect(SG(i))})}
 else if(pt==='Poly'){ds.forEach((d,i)=>{const f=d2f(d,oc(i));(lite?[i%2?['pulse',1]:['sawtooth',-1]]:[['sawtooth',-1],['pulse',1]]).forEach(([ty,c],j)=>{const o=osc('sawtooth',f,w,e);if(ty==='pulse')o.setPeriodicWave(pulseWave(.4));o.detune.value=c*p.det*.8+(R()-.5)*3;o.connect((lite?i:j)%2?inR:inL)});if(i===0){const s=osc('square',f/2,w,e),sg=ctx.createGain();sg.gain.value=.3;s.connect(sg);sg.connect(inL);sg.connect(inR)}});
  [q1,q2].forEach(q=>{q.Q.value=2.2})}
 else if(pt==='Wavetable'){const WT=padWT();ds.forEach((d,i)=>{const f=d2f(d,oc(i));WT.forEach((wv,k)=>{const o=osc('sine',f,w,e),gg=ctx.createGain();o.setPeriodicWave(wv);o.detune.value=(k-1)*p.det*.4;const pk=k===0?1:k===1?0:0;gg.gain.setValueAtTime(k===0?.9:.0001,w);
   if(k===1){gg.gain.linearRampToValueAtTime(.8,w+dur*.5);gg.gain.linearRampToValueAtTime(.2,w+dur)}else if(k===2){gg.gain.setValueAtTime(.0001,w+dur*.4);gg.gain.linearRampToValueAtTime(.7,w+dur)}else gg.gain.linearRampToValueAtTime(.15,w+dur*.6);o.connect(gg);gg.connect(side(i))})})}
 else if(pt==='Cloud'){const lim=QOS.lvl>=2?8:QOS.lvl>=1?14:22,n=Math.min(lim,Math.round((dur+rel)*8)),ws=ctx.createGain(),PNS=[-.7,-.25,.25,.7].map(v=>{const x=ctx.createStereoPanner();x.pan.value=v;x.connect(ws);return x});ws.gain.value=1.3;ws.connect(inL);ws.connect(inR);
  for(let j=0;j<n;j++){const t=w+R()*(dur+rel*.6),d=pick(ds),up=R()<.35?2:1,f=d2f(d,oc(1))*up,gl=.12+R()*.25,o=osc(R()<.5?'sine':'triangle',f,t,t+gl+.02),gg=ctx.createGain(),pn2=PNS[j%4];o.detune.value=(R()-.5)*14;
   gg.gain.setValueAtTime(.0001,t);gg.gain.linearRampToValueAtTime(.32,t+gl*.4);gg.gain.linearRampToValueAtTime(.0001,t+gl);o.connect(gg);gg.connect(pn2)}
  {const SG=sideG(.18);ds.forEach((d,i)=>{osc('sine',d2f(d,oc(i)),w,e).connect(SG(i))})}}
 else if(pt==='Tron'){const fl=plfo(5.5+R(),w,e),fg=ctx.createGain(),wl=plfo(.5,w,e),wg=ctx.createGain(),bp=ctx.createBiquadFilter(),hp2=ctx.createBiquadFilter(),bg=ctx.createGain();fg.gain.value=5;wg.gain.value=7;fl.connect(fg);wl.connect(wg);
  bp.type='peaking';bp.frequency.value=1100;bp.gain.value=6;bp.Q.value=.8;hp2.type='highpass';hp2.frequency.value=220;bg.gain.value=1;bp.connect(hp2);hp2.connect(bg);bg.connect(inL);bg.connect(inR);
  {const TG=[.4,.6].map(v=>{const x=ctx.createGain();x.gain.value=v;x.connect(bp);return x});ds.forEach((d,i)=>{const f=d2f(d,oc(i));['sawtooth','triangle'].forEach((ty,k)=>{const o=osc(ty,f,w,e);fg.connect(o.detune);wg.connect(o.detune);o.connect(TG[k])})})}
  {const ns=mkBuf(),nf=ctx.createBiquadFilter(),ng=ctx.createGain();ns.buffer=A.nb;ns.loop=true;nf.type='highpass';nf.frequency.value=5000;ng.gain.value=.02;ns.connect(nf);nf.connect(ng);ng.connect(inL);ns.start(w);ns.stop(e)}
  [q1,q2].forEach(q=>{q.frequency.cancelScheduledValues(w);q.frequency.setValueAtTime(Math.min(cb*1.2,3600),w)})}
 else if(pt==='PWM'){ds.forEach((d,i)=>{const f=d2f(d,oc(i));(lite?[i%2?[.18,1]:[.32,-1]]:[[.32,-1],[.18,1]]).forEach(([pw,c],j0)=>{const j=lite?i%2:j0;const o=osc('sawtooth',f,w,e);o.setPeriodicWave(pulseWave(pw));o.detune.value=c*p.det*1.4+(R()-.5)*4;const vl=plfo(.3+R()*.4,w,e),vg=ctx.createGain();vg.gain.value=6;vl.connect(vg);vg.connect(o.detune);o.connect(j?inR:inL)})})}
 else if(pt==='Brass'){ds.forEach((d,i)=>{const f=d2f(d,oc(i));(lite?[i%2?1:-1]:[-1,1]).forEach((c,j)=>{const o=osc('sawtooth',f,w,e);o.detune.value=c*p.det*.6;o.connect((lite?i:j)%2?inR:inL)})});[q1,q2].forEach(q=>{q.frequency.cancelScheduledValues(w);q.Q.value=1.6;q.frequency.setValueAtTime(cb*.35,w);q.frequency.linearRampToValueAtTime(cb*1.6+sw,w+Math.min(.5,dur*.3));q.frequency.linearRampToValueAtTime(cb*.9,w+dur)})}
 else if(pt==='Bell pad'){const SG=sideG(.55);ds.forEach((d,i)=>{const f=d2f(d,oc(i)),o=osc('sine',f,w,e),b=osc('sine',f*2,w,w+2.5),m=osc('sine',f*3.5,w,w+2.5),mg=ctx.createGain(),bg=ctx.createGain();o.connect(SG(i));
   mg.gain.setValueAtTime(f*2,w);mg.gain.exponentialRampToValueAtTime(f*.05,w+2);m.connect(mg);mg.connect(b.frequency);bg.gain.setValueAtTime(.0001,w);bg.gain.exponentialRampToValueAtTime(.9,w+.005);bg.gain.exponentialRampToValueAtTime(.0001,w+2.4);b.connect(bg);bg.connect(side(i))})}
 else if(pt==='Fold'){const fo=ctx.createWaveShaper(),fg=ctx.createGain(),fl=osc('sine',.05+R()*.12,w,e),flg=ctx.createGain();fo.curve=foldCurve(.6);fg.gain.value=.7;flg.gain.value=.45;fl.connect(flg);flg.connect(fg.gain);fg.connect(fo);fo.connect(inL);fo.connect(inR);
  ds.forEach((d,i)=>{const o=osc(i%2?'triangle':'sine',d2f(d,oc(i)),w,e);o.detune.value=(R()-.5)*8;o.connect(fg)})}
 else if(pt==='Tape'){const wl=plfo(.4+R()*.5,w,e),wg=ctx.createGain();wg.gain.value=9;wl.connect(wg);ds.forEach((d,i)=>{const f=d2f(d,oc(i));(lite?[i%2?1:-1]:[-1,1]).forEach((c,j0)=>{const j=lite?(i%2):j0,o=osc(j?'triangle':'sawtooth',f,w,e);o.detune.value=c*p.det*.5;wg.connect(o.detune);o.connect(j?inR:inL)})});[q1,q2].forEach(q=>{q.Q.value=.5;q.frequency.cancelScheduledValues(w);q.frequency.setValueAtTime(Math.min(cb,1400),w)})}
 /* v0.24 pads */
 else if(pt==='EP chords'){ds.forEach((d,i)=>{const f=d2f(d,oc(i)),c=osc('sine',f,w,e),m=osc('sine',f,w,e),mg=ctx.createGain(),t1=osc('sine',f*14,w,w+.4),tg2=ctx.createGain(),ng=ctx.createGain();
   mg.gain.setValueAtTime(f*1.5,w);mg.gain.exponentialRampToValueAtTime(f*.22,w+1.1);m.connect(mg);mg.connect(c.frequency);tg2.gain.setValueAtTime(.1,w);tg2.gain.exponentialRampToValueAtTime(.0001,w+.3);t1.connect(tg2);
   ng.gain.setValueAtTime(1,w);ng.gain.exponentialRampToValueAtTime(.42,w+Math.min(2.4,Math.max(.6,dur)));c.connect(ng);tg2.connect(ng);ng.connect(side(i))})}
 else if(pt==='Abyss'){ds.forEach((d,i)=>{const f=d2f(d,oc(i)-1);(lite?[i%2?['triangle',1]:['sawtooth',-1]]:[['sawtooth',-1],['triangle',1]]).forEach(([ty,c],j)=>{const o=osc(ty,f,w,e);o.detune.value=c*p.det*.6+(R()-.5)*3;o.connect((lite?i:j)%2?inR:inL)})});[q1,q2].forEach(q=>{q.Q.value=1.1})}
 else if(pt==='Sync sweep'){const sl=osc('sine',.05+R()*.07,w,e);ds.forEach((d,i)=>{const f=d2f(d,oc(i)),c=osc('triangle',f,w,e),m=osc('sine',f,w,e),mg=ctx.createGain(),lg=ctx.createGain();c.detune.value=(i%2?1:-1)*p.det*.4;mg.gain.value=f*1.1;lg.gain.value=f*.9;sl.connect(lg);lg.connect(mg.gain);m.connect(mg);mg.connect(c.frequency);c.connect(side(i))})}
 else if(pt==='Wind'){const ns=mkBuf();ns.buffer=A.nb;ns.loop=true;ns.start(w,R());ns.stop(e);ds.forEach((d,i)=>{const f=d2f(d,oc(i)),b=ctx.createBiquadFilter(),bg=ctx.createGain(),dl=plfo(.07+R()*.1,w,e),dg=ctx.createGain();b.type='bandpass';b.Q.value=6;b.frequency.value=f*1.5;dg.gain.value=f*.5;dl.connect(dg);dg.connect(b.frequency);bg.gain.value=4.5;ns.connect(b);b.connect(bg);bg.connect(side(i))})}
 else{const wv=pt==='Hollow'?'square':'sawtooth',vc=pt==='Strings'?[-1.8,0,1.8]:[-1,1];ds.forEach((d,i)=>{const f=d2f(d,oc(i));(lite?[vc[i%vc.length]||(i%2?1:-1)]:vc).forEach((c,j)=>{const o=osc(wv,f,w,e);o.detune.value=c*p.det+(R()-.5)*3;o.connect((lite?i:j)%2?inR:inL)})})}
 if(p.sub>0){const s=osc('sine',d2f(cur.r,p.oct-1),w,e),sg=ctx.createGain();sg.gain.value=p.sub*.6;s.connect(sg);sg.connect(g)}
 q1.connect(pa);q2.connect(pb);pa.connect(g);pb.connect(g);const PIN=padMove(p,w,e,pn);if((p.pgate||0)>.01){const gt=ctx.createGain(),sd=60/G.bpm/4,pat16=p.pgpat||[1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1];gt.gain.setValueAtTime(1,w);for(let t0=w,i=0;t0<w+dur+rel;t0+=sd,i++){const on=pat16[i%16];gt.gain.setValueAtTime(on?1:1-p.pgate,t0);if(on)gt.gain.setTargetAtTime(1-p.pgate*.7,t0+sd*.35,sd*.25)}g.connect(gt);gt.connect(PIN)}else g.connect(PIN);
 if(p.trem>0){const o=plfo(2+R()*3,w,e),tg=ctx.createGain();tg.gain.value=gv*p.trem*.5;o.connect(tg);tg.connect(g.gain)}
 if(p.apan>0){const o=plfo(.1+R()*.3,w,e),pg=ctx.createGain();pg.gain.value=p.apan;o.connect(pg);pg.connect(pn.pan)}
 send(pn,A.dk,.15,p.rs)};
/* motif melody mode: stepwise phrases that land on chord tones, slowly mutating */
const snapCT=(d,p)=>{const n=SC[G.scale].length,ct=cur.n.map(x=>((x%n)+n)%n);let b=d,bd=99;for(let c=-1;c<=3;c++)ct.forEach(t=>{const q=t+n*c,dd=Math.abs(q-d);if(dd<bd){bd=dd;b=q}});return Math.max(0,Math.min(b,p.range*n-1))};
const _ln2=leadNote;leadNote=function(p){if(p.mode!=='Motif')return _ln2(p);const n=SC[G.scale].length,top=p.range*n,L=Math.round(p.len);
 if(mot.length!==L||mot.some(x=>x>=top)){let d=pick([0,2,4].filter(x=>x<top));mot=[];for(let i=0;i<L;i++){if(i&&i%4===0)d=pick([0,2,4].map(x=>x+n*Math.floor(d/n)).filter(x=>x<top));else d+=pick([-2,-1,-1,0,1,1,1,2,3,-3]);d=Math.max(0,Math.min(top-1,d));mot.push(d)}mp=-1}
 mp=(mp+1)%L;if(mp===0&&R()>p.dv){const i=Math.floor(R()*L);mot[i]=Math.max(0,Math.min(top-1,mot[i]+pick([-2,-1,1,2])))}
 let d=mot[mp];if(mp%4===0&&R()<p.lock)d=snapCT(d,p);return d};
/* mood-driven generator */
function generate(){UI.sync(1600,true);const set=(k,st,h,r,lv)=>{const T=TR[k];Object.assign(T,{st,h,r,lv});T.pt=pat(T)};
 const sel=$('#mood').value;curMood=sel==='Auto'?pick([...$('#mood').options].map(o=>o.value).filter(v=>v!=='Auto'&&MOODS[v])):sel;const M=MOODS[curMood];$('#mood').options[0].textContent='Auto ('+MN(curMood)+')';
 G.scale=pick(M.sc);G.root=Math.floor(R()*12);G.bpm=M.b[0]+Math.floor(R()*(M.b[1]-M.b[0]+1));
 set(0,16,4,0,.9);set(1,...pick(M.hat||[[16,4,2],[16,7,2],[16,9,1],[16,11,0]]),.5);set(2,16,2,4,.75);set(7,16,pick([2,3,5]),Math.floor(R()*16),.5);
 set(3,pick([12,13,15]),3+Math.floor(R()*3),Math.floor(R()*12),.55);set(4,16,pick(M.lh),M.acid?0:Math.floor(R()*16),M.acid?.7:.6);set(6,16,pick([4,5]),2,.55);set(5,4,4,0,M.padlv||.5);
 Object.assign(TR[4].p,{seed:R()*1e3,fold:R()<.55?.2+R()*.5:0,fenv:.2+R()*.5,fsym:R()<.4?R()*.5:0,glide:R()<.65?.15+R()*.4:0,gt:50+Math.floor(R()*120),uni:pick([1,3,3,5,7]),usp:10+R()*26,subosc:R()*.5,drv:R()*.5,grit:R()<.4?R()*.4:0,mode:pick(M.md),spread:M.sp+R()*.15,bias:M.bias+R()*.15-.07,dv:M.dv,len:pick([6,8]),range:2,lock:.7,wave:M.wave,res:M.res,dec:M.dec,cut:350+R()*200,envA:1800+R()*1200});
 Object.assign(TR[5].p,{bars:pick([1,2,2,4]),cut:M.cut*(.7+R()*.7),sweep:M.sw*(.7+R()*.7),att:M.att,open:.35+R()*.4,sub:.3,lfo:.5,size:pick([3,4,4,5]),patch:pick(['Rotate','Rotate','Random',...M.pt]),rot:Math.floor(R()*4),rel:.6+R()*2,det:4+Math.floor(R()*13),trem:R()<.35?.1+R()*.3:0,apan:R()<.5?.1+R()*.4:0});
 Object.assign(TR[3].p,{mode:'Fixed',tune:48+G.root});
 Object.assign(TR[4].p,{crush:0,acc3:.6,accp:.3});
 if(M.acid){const P=Object.assign({},LPRE['Acid 303']);delete P._t;Object.assign(TR[4].p,P,{res:8+R()*5,cut:240+R()*260,envA:2600+R()*2000,dec:.2+R()*.25,drv:.25+R()*.25,grit:0,crush:R()<.15?.08+R()*.1:0,glide:.2+R()*.2,accp:.25+R()*.15,wave:R()<.3?.8:.1,subosc:0,seed:R()*1e3,mode:'Acid 303'});AC.key=''}
 if(M.power)Object.assign(TR[4].p,LPRE.Aggro,{uni:pick([5,7,7]),drv:.55+R()*.35,crush:R()<.4?.1+R()*.2:0});
 Object.assign(TR[0].p,M.kick||{pitch:48,dec:.45,punch:4,drive:2});G.duck=M.duck||.7;G.bgrit=M.grit||.1;if(A.gr)A.gr.gain.value=G.bgrit*.3;
 newProg(4);mot=[];mp=-1;buf=[];ar=0;ad=1;TR.forEach(T=>T.m=false);TR[7].m=R()<.6;(M.mute||[]).forEach(k=>TR[k].m=true);
 const T8=TR[8];Object.assign(T8,{st:16,h:pick([2,3]),r:pick([2,3,6,10]),lv:.55});T8.pt=pat(T8);const T9=TR[9],hh=pick([1,2,2,4]);Object.assign(T9,{st:16,h:hh,r:0,lv:.5});Object.assign(T9.p,{hold:Math.floor(16/hh),follow:pick([0,0,.5])});T9.pt=pat(T9);
 const TP=TR[5];if(padStyle==='One chord'||padStyle==='One note'){TP.st=1;prog=[0];pshape=[pick(M.sh)];TP.p.size=padStyle==='One note'?1:Math.max(3,TP.p.size)}TP.pt=pat(TP);pmean=null;ks.base=G.root;ks.di=0;ks.cur=G.root;
 $('#root').value=G.root;$('#scale').value=G.scale;$('#bpm').value=G.bpm;$('#bv').textContent=G.bpm;if(A.dl)A.dl.delayTime.value=(G.dt||.75)*60/G.bpm;syncMix();build();kl()};
function syncMix(){const m=$('#mix');if(!m)return;m.innerHTML='';mix();sl(m,'Swing',0,.4,G.swing,.01,v=>G.swing=v)}
const ms=document.createElement('select');ms.id='mood';['Auto',...Object.keys(MOODS)].forEach(x=>ms.add(new Option(x,x)));ms.onchange=()=>generate();$('#rnd').before(ms);
$('#mix').innerHTML='';mix();sl($('#mix'),'Swing',0,.4,G.swing,.01,v=>G.swing=v);
{const bp=$('#bpm'),r=document.createElement('div');r.className='sr';bp.replaceWith(r);const mkb=(t,d)=>{const b=document.createElement('button');b.className='st';b.textContent=t;b.onclick=()=>{bp.value=+bp.value+d;bp.oninput({target:bp})};return b};r.append(mkb('−',-1),bp,mkb('+',1))}
