
/* ---- v0.27: MODERN SOUND PASS (from the first 154 rated Launches + "more modern" brief)
   Four modern families: Rolling (melodic techno), Bounce (UK house and breaks), peak-time techno, minimal / tech house.
   New lead presets: Wide saw, Bright pluck, Soft keys, FM stab, Hypno stab, Rubber blip.
   New bass sounds: Rolling sub, Reese mid, Rubber, FM round.
   Launch: the lowest-rated sounds never come up any more (Hollow BP, Formant wave, West Coast fold, Glass and Soft sine as leads,
   Interval and Turing loop note modes, Wind pad); Air pad and the Rumble kit become rare; the bass is rarely muted;
   most Launches pick a modern family for the mood and set lead sound + pattern and bass sound + pattern from it.
   The old sounds stay selectable by hand. ---- */
{Object.assign(LPRE,{
  'Wide saw':{pg:.62,eng:'Stack',uni:7,usp:16,wid:.85,ft:'LP24',cut:650,res:2,envA:3600,dec:.3,sus:.15,hold:1,rel:.35,att:3,kt:.35,subosc:.15,oct2:.1,drv:0,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.3,rs:.45},
  'Bright pluck':{pg:.8,eng:'Stack',uni:5,usp:10,wid:.7,ft:'LP24',cut:850,res:4,envA:4000,dec:.2,sus:0,att:1,kt:.5,subosc:0,oct2:.22,drv:0,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.4,rs:.35},
  'Soft keys':{pg:.95,eng:'Pulse',pw:.45,uni:2,usp:6,wid:.4,ft:'LP12',cut:1000,res:1.5,envA:2300,dec:.45,sus:.2,hold:.8,rel:.3,att:3,kt:.5,subosc:.1,oct2:0,drv:0,crush:0,fold:0,penv:.08,pdec:.03,glide:0,vib:2,vibr:4.5,ds:.3,rs:.3},
  'FM stab':{pg:.75,eng:'FM',fmr:2,fmi:3,fenv:1,uni:2,usp:8,wid:.4,ft:'LP12',cut:2000,res:2,envA:2400,dec:.18,sus:0,att:1,kt:.3,subosc:0,oct2:0,drv:.2,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.35,rs:.2},
  'Hypno stab':{pg:.8,eng:'Stack',uni:3,usp:8,wid:.5,ft:'LP24',cut:480,res:7,envA:2000,dec:.16,sus:0,att:1,kt:.35,subosc:.1,oct2:0,drv:.15,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.45,rs:.25},
  'Rubber blip':{pg:1.05,eng:'Sine',uni:1,usp:0,wid:0,ft:'LP12',cut:1300,res:6,envA:2200,dec:.14,sus:0,att:1,kt:.5,subosc:0,oct2:0,drv:0,crush:0,fold:.2,fenv:.5,penv:.6,pdec:.015,glide:0,vib:0,ds:.3,rs:.15}});
 const BASSP={'Rolling sub':{sub:.9,cut:230,res:1.5,envA:1.8,det:4,sqm:0,bpp:.15,bdrv:.1,bgr:0,dec:.22},
  'Reese mid':{sub:.6,cut:380,res:2,envA:1.2,det:22,sqm:.15,bpp:0,bdrv:.3,bgr:0,dec:.3},
  'Rubber':{sub:.5,cut:300,res:7,envA:3,det:0,sqm:.4,bpp:.5,bdrv:0,bgr:0,dec:.16},
  'FM round':{sub:1,cut:260,res:1,envA:1,det:6,sqm:0,bpp:.25,bdrv:0,bgr:.25,dec:.3}};
 const FAM={
  rolling:{lead:['Wide saw','Bright pluck','Wide saw','String pluck'],modes:[['Chord arp',16,0],['Up/Down',12,0],['Motif',7,0],['Chord arp',8,2]],bass:['Rolling sub','Reese mid'],bsty:[['Rolling 16ths','Root'],['Off-beat','Root'],['Rolling 16ths','Root']]},
  bounce:{lead:['Soft keys','Bright pluck','Soft keys','String pluck','Chorus pulse'],modes:[['Motif',3,0,8],['Pedal arp',5,0],['Motif',5,1],['Chord arp',7,0]],bass:['FM round','Rolling sub'],bsty:[['Syncopated','Phrase'],['Off-beat','Root'],['Syncopated','Root']]},
  peak:{lead:['FM stab','Hypno stab','Hard sync','Techno stab'],modes:[['Motif',3,0],['Motif',4,2],['Motif',5,0]],bass:['Reese mid','Rolling sub'],bsty:[['Rolling 16ths','Root'],['Off-beat','Root']]},
  minimal:{lead:['Rubber blip','FM stab'],modes:[['Motif',3,1],['Motif',4,0],['Pedal arp',3,0]],bass:['Rubber','FM round'],bsty:[['Syncopated','Root'],['Gallop','Root'],['Off-beat','Octave']]}};
 /* drum programming per family (by style):
    Rolling – deep 4/4, off-beat open hats, big clap on 2 & 4, sparse congas, almost straight;
    Bounce – broken kick some of the time, snare with ghost notes, swung 16th hats, congas, 808 kit;
    peak-time – 4/4, driving 16th hats with accents, clap, off-beat ride or sparse cowbell, dead straight, 909 or Raw;
    minimal / tech house – 4/4, shuffled hats, ghosty clap, syncopated conga/cowbell/rim lines, heavy swing. */
 FAM.rolling.dr=()=>({kick:{h:4},hat:{h:4,r:2,acc:.2,gho:0},clap:{h:2,r:4,vari:.1},snare:null,perc:R()<.6?{pv:'Conga',h:3,r:pick([3,5,7]),ten:.3,gho:.2}:null,hp:{open:.55,dec:.06},sw:.03+R()*.03,kit:'909'});
 FAM.bounce.dr=()=>({kick:R()<.55?{h:3,ten:.35}:{h:4},hat:{h:pick([7,9]),r:1,acc:.35,gho:.3},clap:R()<.5?{h:2,r:4}:null,snare:{h:2,r:4,gho:.35,vari:.25},perc:{pv:pick(['Conga','Conga','Blip']),h:5,r:pick([1,3]),ten:.2,gho:.2},hp:{open:.12,dec:.05},sw:.12+R()*.06,kit:'808'});
 FAM.peak.dr=()=>({kick:{h:4},hat:{h:pick([16,12]),r:0,acc:.45,gho:0},clap:{h:2,r:4},snare:null,perc:R()<.6?{pv:'Ride',h:4,r:2}:{pv:'Cowbell',h:3,r:pick([3,6]),ten:.1},hp:{open:.08,dec:.035},sw:0,kit:R()<.6?'909':'Raw'});
 FAM.minimal.dr=()=>({kick:{h:4},hat:{h:pick([6,7]),r:1,acc:.5,gho:.25},clap:{h:2,r:4,gho:.25,vari:.3},snare:null,perc:{pv:pick(['Conga','Cowbell','Conga']),h:pick([5,7]),r:Math.floor(R()*16),ten:.15,gho:.15},hp:{open:.2,dec:.045},sw:.18+R()*.07,kit:'909'});
 /* lead riffs and bass lines after modern records — 16 steps, scale degrees on the current chord root (10+ = an octave up), _ = rest.
    The lead ring is fitted to the riff's rhythm; bar 2 of every pair answers (the last quarter moves up a chord tone). */
 /* v0.29: six riffs moved one note by a step so every riff fits the Euclid ring exactly (what you hear is what was written) */
 const _=null;
 FAM.rolling.riff=[[0,2,4,10,4,2,0,2,0,2,4,10,12,10,4,2],[0,4,10,4,12,10,4,10,0,4,10,4,14,12,10,4],[0,_,2,_,4,_,2,_,10,_,4,_,2,_,4,_],[10,_,_,4,_,_,2,_,4,_,_,0,_,_,2,_]];
 FAM.bounce.riff=[[4,_,_,4,_,_,2,_,4,_,_,4,_,_,10,_],[0,_,10,_,4,_,_,2,_,0,_,10,_,4,_,_],[2,_,4,_,_,10,_,4,_,2,_,_,0,_,_,_],[4,_,_,2,_,_,0,_,_,_,2,_,_,4,_,_]];
 FAM.peak.riff=[[0,_,_,0,_,_,0,_,_,_,0,_,_,_,_,_],[0,_,_,_,_,_,1,_,_,_,0,_,_,_,_,_],[0,_,_,_,_,0,_,_,0,_,_,10,_,_,_,_],[_,_,0,_,_,_,0,_,_,_,0,_,_,_,1,_]];
 FAM.minimal.riff=[[_,_,0,_,_,_,_,0,_,_,_,_,_,4,_,_],[_,0,_,_,0,_,_,2,_,_,_,_,0,_,_,_],[_,_,10,_,_,0,_,_,_,_,10,_,_,0,_,4],[0,_,_,_,_,_,0,_,_,_,_,4,_,_,_,_]];
 FAM.rolling.bl=[[_,0,0,0,_,0,0,10,_,0,0,0,_,0,10,0],[_,_,0,_,_,_,0,_,_,_,0,_,_,_,0,10],[_,0,0,_,_,0,0,_,_,0,0,_,_,0,10,_]];
 FAM.bounce.bl=[[0,_,_,0,_,_,10,_,_,0,_,_,4,_,_,_],[0,_,_,_,_,_,0,_,_,_,4,_,2,_,_,_],[0,_,_,10,_,_,0,_,_,_,_,0,_,4,_,_]];
 FAM.peak.bl=[[_,_,0,_,_,_,0,_,_,_,0,_,_,_,0,_],[_,0,0,_,_,0,0,_,_,0,0,_,_,0,0,_],[_,_,0,0,_,_,0,_,_,_,0,0,_,_,0,_]];
 FAM.minimal.bl=[[0,_,_,0,_,0,_,_,0,_,_,0,_,_,10,_],[_,_,0,_,_,0,_,10,_,_,0,_,_,_,0,_],[0,_,_,_,0,_,_,0,_,_,4,_,_,0,_,_]];
 /* chords per family: scale degrees of the chord roots + chord shapes (tri, 7, 9, add9, sus2, sus4, quart) */
 const rr=(a,b)=>+(a+R()*(b-a)).toFixed(2);
 FAM.rolling.ch=()=>({prog:pick([[0,5,2,6],[0,3,5,4],[0,6,5,6],[0,5,3,4]]),sh:['tri','add9','sus2','tri','7'],scale:'Minor'});
 FAM.bounce.ch=()=>({prog:pick([[0,5,3,4],[0,3,6,5],[0,2,5,3],[3,4,0,0]]),sh:['7','9','add9','7'],scale:'Dorian'});
 FAM.peak.ch=()=>({prog:pick([[0,0,0,0],[0,0,1,0],[0,0,5,0]]),sh:['tri','quart','sus4'],scale:'Minor'});
 FAM.minimal.ch=()=>({prog:pick([[0,0,0,0],[0,3,0,3],[0,0,3,3]]),sh:['7','9','7'],scale:'Dorian'});
 /* effects per family, using the existing delay, reverb, shimmer, sidechain, rumble and bus grit
    Rolling: big dark space and heavy pump · Bounce: warm delay throws, medium room · peak-time: short room, rumble, a touch of grit · minimal: dry and close */
 FAM.rolling.fx=()=>({rev:rr(.38,.46),shim:rr(.5,.7),dly:rr(.2,.28),fb:.45,dt:.75,duck:rr(.75,.85),rel:.22,rumble:rr(.22,.32),rcut:120});
 FAM.bounce.fx=()=>({rev:rr(.26,.32),shim:rr(.18,.3),dly:rr(.3,.38),fb:.5,dt:pick([.75,.5]),duck:rr(.5,.6),rel:.18,rumble:rr(.06,.12)});
 FAM.peak.fx=()=>({rev:rr(.16,.22),shim:rr(.05,.12),dly:rr(.1,.15),fb:.35,dt:.5,duck:rr(.65,.75),rel:.15,rumble:rr(.35,.45),rcut:140,bgrit:rr(.12,.2)});
 FAM.minimal.fx=()=>({rev:rr(.12,.18),shim:rr(.02,.08),dly:rr(.08,.14),fb:.3,dt:pick([.5,.375]),duck:rr(.5,.6),rel:.14,rumble:rr(.06,.12)});
 const RIFF={t:null};window.orbRiff=RIFF;
 const fillT=t=>{let last=t.find(x=>x!=null);if(last==null)last=0;return t.map(x=>x==null?last:(last=x))};
 const dg=(v,n)=>v>=10?v-10+n:v;
 const _ln=leadNote;leadNote=function(p){if(p.mode==='Riff'&&RIFF.t){const n=SC[G.scale].length,N=RIFF.f.length||16,s=((tk%N)+N)%N,bar=Math.floor(tk/16),t=RIFF.f;let v=dg(t[s],n);
   if(N===16&&bar%2===1&&s>=12)v+=v%n===0?2:v%n===2?2:-2;return cur.r+v}return _ln.apply(this,arguments)};
 try{if(!MODES.includes('Riff'))MODES.push('Riff')}catch(e){}
 const MFAM={Melancholic:{rolling:.7,bounce:.3},'Melodic House':{rolling:.5,bounce:.5},Dark:{rolling:.5,peak:.5},Noir:{rolling:.6,bounce:.4},
  Dreamy:{bounce:.6,rolling:.4},Hopeful:{bounce:.7,rolling:.3},Breaks:{bounce:1},Ethereal:{bounce:.5,rolling:.5},Ambient:{bounce:.7,rolling:.3},
  Drone:{rolling:1},'Deep Space':{rolling:.7,bounce:.3},Power:{peak:1},Tense:{peak:1},'Distorted Electro':{peak:1},Temporal:{peak:.6,minimal:.4},
  'Groove Techno':{minimal:.6,peak:.4},Vector:{minimal:.5,bounce:.5},Bleep:{minimal:1},Italo:{bounce:.5,rolling:.5}};
 const MCH={Italo:.35};                                  // Satellite Disco already rated well: modern sound only sometimes
 const BADL=new Set(['Hollow BP','Formant wave','West Coast fold','Glass','Soft sine']),BADM=new Set(['Interval','Turing loop']);
 const AMB=new Set(['Ambient','Ethereal','Drone','Deep Space']);
 const wp=o=>{let t=Object.values(o).reduce((a,b)=>a+b,0)*R();for(const k in o)if((t-=o[k])<0)return k;return Object.keys(o)[0]};
 window.orbModern={FAM,MFAM,BASSP,last:null};
 const bassSet=(name)=>{const P=TR[6].p;Object.assign(P,BASSP[name]);G.bchar=name};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{
   const L=TR[4],P=L.p,B=TR[6],BP=B.p,PD=TR[5],acid=P.mode==='Acid 303'||(MOODS[curMood]||{}).acid,fams=MFAM[curMood];let fam=null;
   // ambient moods: more pulse — at least ~100 BPM, a soft beat, hats and a bass most of the time
   if(AMB.has(curMood)){if(G.bpm<100){G.bpm=100+Math.round(R()*12);try{$('#bpm').value=G.bpm;$('#bv').textContent=G.bpm;if(A.dl){A.dl.delayTime.value=(G.dt||.75)*60/G.bpm;A.dl2.delayTime.value=(G.dt||.75)*60/G.bpm}}catch(e){}}
    const K=TR[0];if(K.m&&R()<.8){K.m=false;Object.assign(K,{st:16,h:4,r:0,ten:0});K.pt=pat(K);K.lv=Math.min(K.lv||.9,.75)}
    const H=TR[1];if((H.m||H.h<3)&&R()<.8){H.m=false;Object.assign(H,{st:16,h:pick([4,4,6]),r:2,ten:0});H.pt=pat(H)}}
   // modern family for this Launch
   if(!acid&&fams&&R()<(MCH[curMood]||.75))fam=wp(fams);
   const F=fam&&FAM[fam];
   RIFF.t=null;window.__bphLock=0;
   if(F&&!L.m){applyLP(pick(F.lead),1);P.rdr=0;try{mot=[];mp=-1;buf=[]}catch(e){}
    if(R()<.7){const t=pick(F.riff);RIFF.t=t;RIFF.f=fillT(t);P.mode='Riff';const pt=t.map(x=>x==null?0:1);L.st=16;try{const ft=bassFit(L,pt);Object.assign(L,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){Object.assign(L,{h:pt.reduce((a,b)=>a+b,0),r:0,ten:0})}L.pt=pt.slice()}
    else{const [md,h,r,st]=pick(F.modes);P.mode=md;Object.assign(L,{st:st||16,h:Math.min(h,st||16),r,ten:0});L.pt=pat(L);P.range=md==='Motif'?(fam==='peak'||fam==='minimal'?1:2):2}}
   else if(!L.m&&!acid){if(BADL.has(P.patch)){const fl=F||FAM[wp(fams||{rolling:.5,bounce:.5})];applyLP(pick(fl.lead),1)}
    if(BADM.has(P.mode)){P.mode=pick(['Motif','Chord arp','Pedal arp','Motif']);try{mot=[];mp=-1;buf=[]}catch(e){}}}
   // bass: rarely muted, modern sound + pattern from the family
   if(B.m&&!acid&&R()<.85)B.m=false;
   if(F&&!B.m){bassSet(pick(F.bass));if(R()<.7){const t=pick(F.bl),pt=t.map(x=>x==null?0:1),ff=fillT(t),A=ff.map(v=>({d:v>=10?v-10:v,o:v>=10?1:0})),A2=A.map((e,i)=>i>=12&&i%2===0&&R()<.5?{d:e.d,o:1-e.o}:Object.assign({},e));
     B.st=16;try{const ft=bassFit(B,pt);Object.assign(B,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){}B.pt=pt.slice();Object.assign(BP,{bns:'Phrase',bsty:'Modern '+fam,bsus:0,btn:false,bph:1,bgh:0,blk:'Free'});
     window.BPH={bars:[A,A2],pk:[],chr:0,lead:9,evo:0};window.__bphLock=1}
    else{const [sty,notes]=pick(F.bsty);try{bassStyle(sty)}catch(e){}BP.bns=notes}}
   else if(!B.m&&(BP.bsty==='Custom'||BP.bsty==='Pedal'||['Chord tones','Melodic'].includes(BP.bns))&&R()<.8){const fl=FAM[wp(fams||{rolling:.5,peak:.5})];const [sty,notes]=pick(fl.bsty);try{bassStyle(sty)}catch(e){}BP.bns=notes;if(R()<.6)bassSet(pick(fl.bass))}
   // pads and kit
   if(PD.p.patch==='Wind'||(PD.p.patch==='Air'&&R()<.8))PD.p.patch=pick(['Poly','Strings','EP chords','Glass','Tape','Choir','Abyss'].filter(x=>{try{return typeof PGAIN==='undefined'||x in PGAIN||true}catch(e){return true}}));
   if(G.kit==='Rumble'&&R()<.7)try{orbKit(R()<.6?'909':'808')}catch(e){}
   // drums in the family's style: groove, swing, hat character, perc voice and rhythm (the kick stays four-to-the-floor unless the family breaks it)
   if(F&&F.dr){const D=F.dr,ring=(k,o)=>{const T=TR[k];if(!o){T.m=true;return}Object.assign(T,{m:false,st:o.st||16,h:o.h,r:o.r||0,ten:o.ten||0});['acc','gho','vari'].forEach(x=>{if(o[x]!=null)T[x]=o[x]});T.pt=pat(T)};
    const d=typeof D==='function'?D():D;if(d.kick)ring(0,d.kick);ring(1,d.hat);ring(2,d.clap);ring(7,d.snare);if(d.perc){ring(3,d.perc);try{setPercSound(d.perc.pv)}catch(e){TR[3].p.pv=d.perc.pv}}else ring(3,null);
    Object.assign(TR[1].p,d.hp||{});G.swing=d.sw;if(d.kit)try{orbKit(d.kit)}catch(e){}}
   // chords and effects in the family's style (existing effects only)
   if(F&&F.ch){const c=F.ch(),PDT=TR[5],nc=Math.max(1,Math.round(PDT.st)||4);
    if(['Min pentatonic','Major pentatonic','Sus pentatonic','Whole tone','Hirajoshi'].includes(G.scale)){G.scale=c.scale;try{$('#scale').value=G.scale}catch(e){}}
    prog=Array.from({length:nc},(_,i)=>c.prog[i%c.prog.length]);pshape=prog.map(()=>pick(c.sh));try{PX=prog.map(()=>0);pmean=null;PTOP=null}catch(e){}
    try{mot=[];mp=-1;buf=[]}catch(e){}
    const fx=F.fx();Object.assign(G,fx);try{applyFX()}catch(e){}}
   setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},60);
   orbModern.last=fam;if(fam)setTimeout(()=>{try{if(typeof say==='function')say('◆ '+({rolling:'ROLLING',bounce:'BOUNCE',peak:'PEAK-TIME',minimal:'MINIMAL'})[fam]+' · '+TR[4].p.patch.toUpperCase()+' · '+(G.bchar||'').toUpperCase())}catch(e){}},1200)
 }catch(e){console.warn('[orbitron] modern',e)}return r}}
