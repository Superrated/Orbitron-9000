/* ---- v16: distinct modern character per mood (style-based production profiles) ---- */
const MP={
 Dark:{sty:'Warehouse techno',b:[128,134],sw:[0,.03],gr:.5,kick:{pitch:47,dec:.5,punch:5,drive:4,click:.8},hat:{tone:8500,dec:.04,open:.08,acc:.5,metal:.7},hp:[[16,12,0],[16,7,2],[16,9,1]],clap:{tone:1100,spread:9,tail:.35,rv:.35},cl:.45,sn:0,
  fx:{rumble:.38,rcut:120,rfeed:1.3,dly:.2,fb:.55,dt:.75,rev:.35,shim:.3,dens:.3,duck:.78,bgrit:.2,glue:.5,clip:.4},lh:[2,3,4],gate:0,lfo:[['Lead cutoff',1,16,.35],['Master low-pass',0,32,.15]]},
 Melancholic:{sty:'Melodic techno',b:[120,124],sw:[0,.03],gr:.55,kick:{pitch:50,dec:.42,punch:4,drive:2,click:.6},hat:{tone:9000,dec:.05,open:.25,acc:.35,metal:.4},hp:[[16,4,2],[16,6,2]],clap:{tone:1400,spread:11,tail:.3,rv:.35},cl:.6,sn:0,
  fx:{rumble:.2,rcut:140,rfeed:1,dly:.3,fb:.5,dt:.75,rev:.45,shim:.7,dens:.5,duck:.8,bgrit:.05,glue:.45,clip:.3},lh:[5,6,7],gate:0,lfo:[['Lead cutoff',0,32,.45],['Delay mix',1,16,.3]]},
 Dreamy:{sty:'Deep house',b:[118,122],sw:[.12,.18],gr:.8,kick:{pitch:52,dec:.38,punch:2.5,drive:1,click:.4},hat:{tone:7000,dec:.06,open:.35,acc:.5,metal:.3},hp:[[16,4,2],[16,6,1],[16,7,2]],clap:{tone:1700,spread:14,tail:.25,rv:.3},cl:.55,sn:0,
  fx:{rumble:.05,rcut:140,rfeed:1,dly:.25,fb:.4,dt:.75,rev:.4,shim:.8,dens:.6,duck:.55,bgrit:0,glue:.55,clip:.2},lh:[4,5,6],gate:0,lfo:[['Lead cutoff',0,8,.25],['Reverb mix',0,32,.3]]},
 Tense:{sty:'Industrial / EBM techno',b:[132,138],sw:[0,0],gr:.35,kick:{pitch:52,dec:.3,punch:7,drive:8,click:1.4},hat:{tone:10000,dec:.03,open:.05,acc:.6,metal:.9},hp:[[16,16,0],[16,12,0]],clap:{tone:2200,spread:6,tail:.15,rv:.1},cl:.7,sn:1,
  fx:{rumble:.3,rcut:160,rfeed:1.2,dly:.18,fb:.35,dt:.5,rev:.2,shim:.1,dens:.1,duck:.7,bgrit:.45,glue:.6,clip:.65},lh:[7,9,11],gate:.6,lfo:[['Lead cutoff',5,.25,.5],['Master high-pass',2,4,.35]]},
 Ethereal:{sty:'Ambient techno',b:[114,120],sw:[.02,.05],gr:.5,kick:{pitch:46,dec:.55,punch:3,drive:1,click:.3},hat:{tone:11000,dec:.03,open:.2,acc:.6,metal:.2},hp:[[16,5,2],[16,7,3]],clap:{tone:2000,spread:16,tail:.5,rv:.55},cl:.4,sn:0,
  fx:{rumble:.12,rcut:100,rfeed:1,dly:.35,fb:.6,dt:1.5,rev:.6,shim:1.2,dens:.85,duck:.6,bgrit:0,glue:.35,clip:.15},lh:[2,3,4],gate:0,lfo:[['Master low-pass',0,32,.2],['Delay feedback',1,16,.3]]},
 Hopeful:{sty:'Progressive house',b:[124,128],sw:[.02,.04],gr:.6,kick:{pitch:50,dec:.45,punch:4,drive:2.5,click:1},hat:{tone:9500,dec:.05,open:.45,acc:.35,metal:.45},hp:[[16,4,2],[16,8,1]],clap:{tone:1600,spread:11,tail:.3,rv:.3},cl:.65,sn:0,
  fx:{rumble:.1,rcut:140,rfeed:1,dly:.28,fb:.45,dt:.75,rev:.4,shim:.7,dens:.5,duck:.85,bgrit:.05,glue:.5,clip:.35},lh:[6,7,9],gate:0,lfo:[['Lead cutoff',2,16,.4],['Lead decay',0,32,0]]},
 Noir:{sty:'Dub techno',b:[120,126],sw:[.06,.1],gr:.6,kick:{pitch:48,dec:.5,punch:3,drive:1.5,click:.3},hat:{tone:6500,dec:.07,open:.2,acc:.5,metal:.25},hp:[[16,4,2],[16,6,2]],clap:{tone:1000,spread:12,tail:.4,rv:.45},cl:.4,sn:0,
  fx:{rumble:.3,rcut:110,rfeed:1.1,dly:.45,fb:.68,dt:.75,rev:.5,shim:.4,dens:.2,duck:.7,bgrit:.1,glue:.5,clip:.3},lh:[2,3],gate:0,stab:1,lfo:[['Stab cutoff',0,32,.6],['Delay feedback',0,16,.25]]},
 Drone:{sty:'Hypnotic minimal',b:[126,132],sw:[.04,.07],gr:.55,kick:{pitch:45,dec:.55,punch:4,drive:3,click:.6},hat:{tone:8000,dec:.035,open:.05,acc:.5,metal:.55},hp:[[16,11,0],[16,9,1]],clap:{tone:1300,spread:10,tail:.3,rv:.3},cl:.4,sn:0,
  fx:{rumble:.32,rcut:120,rfeed:1.2,dly:.3,fb:.55,dt:.75,rev:.4,shim:.5,dens:.4,duck:.7,bgrit:.15,glue:.5,clip:.35},lh:[3,4],gate:0,sub:1,perc:.7,lfo:[['Perc FM',5,.5,.5],['Lead cutoff',0,32,.5]]},
 Acid:{sty:'Acid techno',b:[138,145],sw:[0,.03],gr:.45,kick:{pitch:50,dec:.3,punch:5,drive:4,click:1},hat:{tone:9500,dec:.04,open:.3,acc:.5,metal:.6},clap:{tone:1800,spread:10,tail:.2,rv:.2},cl:.6,
  fx:{rumble:.2,rcut:140,rfeed:1,dly:.25,fb:.45,dt:.75,rev:.25,shim:.2,dens:.1,duck:.75,bgrit:.3,glue:.55,clip:.5},gate:0,lfo:[['Lead cutoff',1,8,.55],['Lead decay',0,32,0]]},
 Power:{sty:'Peak-time techno',kick:{click:1.2},hat:{tone:9000,dec:.035,open:.1,acc:.5,metal:.8},clap:{tone:1200,spread:9,tail:.3,rv:.3},cl:.55,
  fx:{dly:.2,fb:.5,dt:.75,rev:.35,shim:.2,dens:.15,glue:.6,clip:.6},gate:0,lfo:[['Master low-pass',0,32,.2],['Lead decay',0,32,0]]}};
const rr=v=>Array.isArray(v)?v[0]+R()*(v[1]-v[0]):v;
function applyFX(){if(!A.dO)return;A.dO.gain.value=G.dly;A.dF.gain.value=G.fb;A.rO.gain.value=G.rev;A.sh.gain.value=G.shim;A.rg.gain.value=G.rumble;A.rl.frequency.value=G.rcut;A.gr.gain.value=G.bgrit*.3;A.glue.threshold.value=-3-12*G.glue;if(A.clip.__cv!==G.clip){A.clip.__cv=G.clip;A.clip.curve=clipCurve(G.clip)}const dt=(G.dt||.75)*60/G.bpm; /* perf 6 */A.dl.delayTime.value=dt;A.dl2.delayTime.value=dt}
const _init16=init;init=function(){const n=!ctx;_init16();if(n)applyFX()};
function gateUI(){const g2=$('#gate');if(!g2)return;g2.innerHTML='';sl(g2,'Gate depth',0,1,GT.depth,.01,v=>{GT.depth=v});sl(g2,'Gate steps',2,32,GT.st,1,v=>{GT.st=v;gtPat()});sl(g2,'Gate hits',1,32,GT.h,1,v=>{GT.h=v;gtPat()});sl(g2,'Gate rotate',0,31,GT.r,1,v=>{GT.r=v;gtPat()});sl(g2,'Gate length',.1,1,GT.len,.01,v=>{GT.len=v})}
function lfoUI(){document.querySelectorAll('#t-lfo .panel').forEach((pn,n)=>{const L=LFOS[n],s=pn.querySelectorAll('select'),r=pn.querySelectorAll('input[type=range]');if(s.length<4)return;s[0].value=L.tg;s[1].value=L.sh;s[2].value=L.sync;s[3].value=L.div;s[3].hidden=!L.sync;
 [[0,L.d],[1,L.ph],[2,L.hz]].forEach(([i,v])=>{if(!r[i])return;r[i].value=v;const b=r[i].closest('.sl')&&r[i].closest('.sl').querySelector('b');if(b)b.textContent=(+v).toFixed(2)});if(r[2])r[2].closest('.sl').parentElement.hidden=!!L.sync})}
const _gen16=generate;generate=function(){_gen16();const P=MP[curMood];if(!P)return;
 if(P.b){G.bpm=Math.round(rr(P.b));$('#bpm').value=G.bpm;$('#bv').textContent=G.bpm}
 if(P.sw)G.swing=rr(P.sw);if(P.gr!=null)G.groove=P.gr;
 Object.assign(TR[0].p,P.kick||{});tuneKick();Object.assign(TR[1].p,P.hat||{});Object.assign(TR[2].p,P.clap||{});if(P.cl!=null)TR[2].lv=P.cl;
 if(P.hp){const [st,hh,r]=pick(P.hp);Object.assign(TR[1],{st,h:hh,r});TR[1].pt=pat(TR[1])}
 if(P.sn!=null)TR[7].m=!P.sn;
 if(P.fx)Object.assign(G,P.fx);
 if(P.lh&&TR[4].p.mode!=='Acid 303'&&curMood!=='Power'){TR[4].h=Math.min(pick(P.lh),TR[4].st);TR[4].pt=pat(TR[4])}
 GT.depth=P.gate||0;if(P.gate){Object.assign(GT,{st:16,h:pick([7,9,11]),r:pick([0,2,3]),len:.45});gtPat()}
 if(P.stab){const S=TR[8];Object.assign(S,{st:16,h:pick([3,4]),r:pick([2,3,6]),lv:.7,m:false});S.pt=pat(S);Object.assign(S.p,{ds:.8,rs:.45})}
 if(P.sub)TR[9].m=false;if(P.perc)TR[3].lv=P.perc;
 P.lfo.forEach(([tg,sh,div,d],i)=>Object.assign(LFOS[i],{tg,sh,sync:1,div,d,ph:0}));
 applyFX();syncMix();gateUI();lfoUI();build();if(typeof kl==='function')kl();};
