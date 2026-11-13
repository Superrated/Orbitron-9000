/* ---- v22: three more moods — Italo (octave-bass disco), The Touch (French touch filter house), Breaks (drum & bass) ---- */
Object.assign(MOODS,{
 Italo:{sc:['Minor','Harm. minor','Dorian'],pr:[[0,5,6,0],[0,3,6,2],[0,5,3,6],[0,6,5,4]],sh:['tri','7','add9'],b:[114,122],cut:900,sw:1500,att:.25,lh:[8],sp:.3,bias:.45,dv:.85,md:['Chord arp','Up/Down'],wave:.5,dec:.2,res:3,pt:['Warm saw','Strings','Choir'],hat:[[16,4,2]],kick:{pitch:52,dec:.35,punch:3,drive:1.5},duck:.45,grit:.05,padlv:.45},
 'The Touch':{sc:['Dorian','Minor','Mixolydian'],pr:[[0,3,0,3],[0,6,0,6],[0,3,4,3],[0,5,3,4]],sh:['7','9','add9'],b:[120,126],cut:1100,sw:2000,att:.2,lh:[3,4],sp:.2,bias:.5,dv:.9,md:['Motif','Chord arp'],wave:.3,dec:.25,res:2,pt:['Organ','Warm saw','Strings'],hat:[[16,8,1],[16,4,2]],kick:{pitch:50,dec:.42,punch:3,drive:3},duck:.9,grit:.3,padlv:.35},
 Breaks:{sc:['Minor','Phrygian','Min pentatonic'],pr:[[0,0,5,5],[0,5,0,6],[0,0,6,6],[0,0,0,5]],sh:['sus2','quart','tri'],b:[168,174],cut:700,sw:1600,att:.5,lh:[2,3,4],sp:.3,bias:.4,dv:.8,md:['Motif','Chord arp'],wave:.3,dec:.35,res:2.5,pt:['Strings','Air','Choir'],hat:[[16,8,0],[16,6,2]],kick:{pitch:55,dec:.3,punch:6,drive:3},duck:.5,grit:.12,padlv:.45,mute:[3,8]}});
Object.assign(MP,{
 Italo:{sty:'Italo disco',b:[114,122],sw:[0,.02],gr:.5,kick:{pitch:52,dec:.35,punch:3,drive:1.5,click:.8},hat:{tone:8000,dec:.05,open:.85,acc:.3,metal:.4},hp:[[16,4,2]],clap:{tone:1500,spread:12,tail:.4,rv:.4},cl:.6,sn:1,
  fx:{rumble:.02,rcut:140,rfeed:1,dly:.3,fb:.4,dt:.75,rev:.4,shim:.3,dens:.1,duck:.45,bgrit:.05,glue:.5,clip:.3},lh:[8],gate:0,lfo:[['Lead cutoff',1,16,.3],['Delay mix',0,32,.2]]},
 'The Touch':{sty:'French touch',b:[122,126],sw:[.02,.05],gr:.7,kick:{pitch:50,dec:.42,punch:3,drive:3,click:.6},hat:{tone:8500,dec:.05,open:.4,acc:.5,metal:.35},hp:[[16,8,1],[16,4,2]],clap:{tone:1300,spread:12,tail:.3,rv:.25},cl:.6,sn:0,
  fx:{rumble:.03,rcut:140,rfeed:1,dly:.15,fb:.35,dt:.75,rev:.25,shim:.15,dens:.05,duck:.9,bgrit:.3,glue:.75,clip:.6},lh:[3,4],gate:0,stab:1,lfo:[['Master low-pass',0,16,.5],['Master pump',3,1,.3]]},
 Breaks:{sty:'Breaks / drum & bass',b:[170,174],sw:[.02,.05],gr:.6,kick:{pitch:55,dec:.3,punch:6,drive:3,click:1.3},hat:{tone:9500,dec:.035,open:.15,acc:.5,metal:.5},hp:[[16,8,0],[16,6,2]],clap:{tone:1600,spread:10,tail:.25,rv:.3},cl:.5,sn:1,
  fx:{rumble:0,rcut:140,rfeed:1,dly:.3,fb:.45,dt:.75,rev:.45,shim:.6,dens:.4,duck:.5,bgrit:.15,glue:.6,clip:.45},lh:[2,3,4],gate:0,sub:1,lfo:[['Lead cutoff',0,32,.35],['Bass cutoff',0,8,.4]]}});
Object.assign(LMOOD,{Italo:['Square chip','Pluck','Supersaw','Hollow BP','FM keys'],'The Touch':['Vowel','Organ','FM keys','Square chip'],Breaks:['FM keys','Glass','FM bell','Soft sine','Pluck']});
['Italo','The Touch','Breaks'].forEach(k=>$('#mood').add(new Option(k,k)));
G.bstyle='';
const mk16=a=>{const p=Array(16).fill(0);a.forEach(i=>p[i]=1);return p};
const _gen22=generate;generate=function(){_gen22();const M=curMood;G.bstyle='';G.brk=null;const B=TR[6],S7=TR[7];
 if(M==='Italo'){G.bstyle='octave';G.bavoid=false;Object.assign(B,{st:16,h:16,r:0});B.pt=pat(B);Object.assign(B.p,{dec:.11,cut:650,envA:2.5,res:5,sub:.35,det:8,oct:1,fifth:0,jump:0});
  Object.assign(S7,{st:16,h:2,r:4,m:false});S7.pt=pat(S7);TR[8].m=true}
 else if(M==='The Touch'){G.bstyle='funk';Object.assign(B,{st:16,h:7,r:3});B.pt=pat(B);Object.assign(B.p,{dec:.18,cut:900,envA:2,res:4,sub:.4,det:4,oct:1,fifth:.25,jump:0});
  const S=TR[8];Object.assign(S,{st:16,h:pick([5,6]),r:pick([3,5]),lv:.65,m:false});S.pt=pat(S);Object.assign(S.p,{dec:.12,cut:1800,envA:2500,ds:.12,rs:.1,size:4})}
 else if(M==='Breaks')setupBreaks();
 build()};
/* ---- v26: Italo = no pads + space toms; chords keep moving when the pad is muted ---- */
G.stom=false;
function spaceTom(w,deg,v){const sO=OCT,sF=FIX;OCT=0;FIX=0;const f=d2f(deg,2);OCT=sO;FIX=sF;const e=w+.7,o=osc('triangle',f*2.4,w,e),o2=osc('sine',f*1.2,w,e),g=ctx.createGain(),q=ctx.createBiquadFilter();
 o.frequency.exponentialRampToValueAtTime(f*.5,w+.38);o2.frequency.exponentialRampToValueAtTime(f*.3,w+.42);q.type='lowpass';q.frequency.setValueAtTime(3800,w);q.frequency.exponentialRampToValueAtTime(500,w+.35);q.Q.value=4;
 g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(v,w+.003);g.gain.exponentialRampToValueAtTime(.0001,w+.55);o.connect(q);o2.connect(q);q.connect(g);send(g,A.m,.4,.45);nz(w,'bandpass',3000,.02,v*.3,A.m)}
const STP={6:4,22:4,26:4,28:2,30:0};
const _fv26=fireVoice;fireVoice=function(k,w){if(k===3&&G.stom){const T=TR[3],s=tk%T.st,n=SC[G.scale].length,base=(cur&&cur.r)||0;spaceTom(w,base+(STP[s]!=null?STP[s]:4)+n,T.lv*.9);return}_fv26(k,w)};
const _gen26=generate;generate=function(){_gen26();G.stom=curMood==='Italo';if(G.stom){const P3=TR[3];P3.st=32;P3.pt=Array(32).fill(0);[6,22,26,28,30].forEach(i=>P3.pt[i]=1);P3.h=5;P3.m=false;P3.lv=.6;TR[5].m=true;build()}};
const _as26=arrStep;arrStep=function(w){_as26(w);const T=TR[5];if(!T.m||!T.pad)return;const L=16*T.p.bars;if(tk%L===0){const ci=Math.floor(tk/L)%T.st,o=T.lv;T.lv=1e-6;try{pad(ci,w,L*(60/G.bpm/4))}finally{T.lv=o}}};
