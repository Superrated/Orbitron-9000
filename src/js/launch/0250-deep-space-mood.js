/* ---- v34: Deep Space mood — outer-space ambient: drones, heartbeat kick, slow chords, cosmic events (solar wind, sonar, telemetry chirps, drone clouds) ---- */
MOODS['Deep Space']={sc:['Lydian','Min pentatonic','Sus pentatonic','Dorian','Whole tone'],pr:[[0,0,0,0],[0,4,0,4],[0,5,3,0],[0,2,0,5]],sh:['sus2','quart','add9'],b:[80,94],cut:600,sw:1800,att:.8,lh:[1,2],sp:.4,bias:.6,dv:.9,md:['Motif','Up/Down'],wave:.1,dec:.6,res:2,pt:['Air','Glass','Choir','Strings'],hat:[[16,1,2]],kick:{pitch:42,dec:.8,punch:1.5,drive:0},duck:.2,grit:0,padlv:.5,mute:[1,2,6,7,8]};
MP['Deep Space']={sty:'Outer space ambient',b:[80,94],sw:[0,.02],gr:.4,kick:{pitch:42,dec:.8,punch:1.5,drive:0,click:0},cl:.3,sn:0,
 fx:{rumble:.08,rcut:90,rfeed:1,dly:.4,fb:.66,dt:1.5,rev:.65,shim:1.3,dens:.9,duck:.2,bgrit:0,glue:.3,clip:.1},lh:[1,2],gate:0,sub:1,perc:.35,lfo:[['Master low-pass',0,32,.3],['Delay feedback',0,16,.3]]};
LMOOD['Deep Space']=['Soft sine','FM bell','Glass','Vowel'];
MTRIM['Deep Space']=Object.assign({},MTRIM.Ethereal);
$('#mood').add(new Option('Deep Space','Deep Space'));
G.dspace=false;
const _gen34=generate;generate=function(){_gen34();G.dspace=curMood==='Deep Space';if(!G.dspace)return;
 const K=TR[0];Object.assign(K,{st:16,h:1,r:0,lv:.5,m:false});K.pt=pat(K);
 const P=TR[5];Object.assign(P.p,{bars:8,att:.9,size:4,rel:3,sweep:Math.max(P.p.sweep,900),trem:0,apan:.35});P.st=4;newProg(4);P.pt=pat(P);P.lv=.5;P.m=false;
 const L=TR[4];Object.assign(L,{st:32,h:pick([1,2]),r:pick([4,12,20]),lv:.45,m:false});L.pt=pat(L);Object.assign(L.p,{sus:.7,hold:8,rel:2,att:220,rs:.7,ds:.6,vib:3,vibr:4.5,glide:.3,range:2});
 const Pc=TR[3];Object.assign(Pc,{st:13,h:2,r:pick([0,3,5]),m:false});Pc.pt=pat(Pc);Object.assign(Pc.p,{mode:'Fixed',tune:84+G.root,rs:.6,ds:.55,dec:.3});
 const S=TR[9];Object.assign(S,{st:16,h:1,r:0,lv:.5,m:false});S.pt=pat(S);Object.assign(S.p,{hold:16,follow:1,harm:.15,cut:140});
 [1,2,6,7,8].forEach(k=>TR[k].m=true);G.bavoid=true;build()};
const SPF=()=>{const sO=OCT,sF=FIX;OCT=0;FIX=0;return()=>{OCT=sO;FIX=sF}};
function solarWind(w){const d=5+R()*4,s=mkBuf(),bp=ctx.createBiquadFilter(),g=ctx.createGain(),pn=ctx.createStereoPanner();s.buffer=A.nb;s.loop=true;bp.type='bandpass';bp.Q.value=6;
 bp.frequency.setValueAtTime(300,w);bp.frequency.exponentialRampToValueAtTime(2500+R()*2000,w+d*.55);bp.frequency.exponentialRampToValueAtTime(500,w+d);g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(.09,w+d*.5);g.gain.exponentialRampToValueAtTime(.0001,w+d);
 const a=R()<.5?-1:1;pn.pan.setValueAtTime(-.8*a,w);pn.pan.linearRampToValueAtTime(.8*a,w+d);s.connect(bp);bp.connect(g);g.connect(pn);send(pn,A.m,.25,.6);s.start(w);s.stop(w+d+.1)}
function sonar(w){const rs=SPF(),ch=cur.n||[0,2,4],f=d2f(pick(ch),5);rs();const o=osc('sine',f,w,w+3),g=ctx.createGain(),pn=ctx.createStereoPanner();o.frequency.exponentialRampToValueAtTime(f*.985,w+2.5);pn.pan.value=(R()-.5)*1.4;
 g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(.06,w+.005);g.gain.exponentialRampToValueAtTime(.0001,w+2.6);o.connect(g);g.connect(pn);send(pn,A.m,.6,.5)}
function chirps(w){const n=3+Math.floor(R()*4),rs=SPF(),n0=SC[G.scale].length;let t=w;for(let i=0;i<n;i++){const f=d2f(Math.floor(R()*n0*2),6),d=.04+R()*.05,o=osc('sine',f,t,t+d+.02),m=osc('square',f*(1.5+R()),t,t+d+.02),mg=ctx.createGain(),g=ctx.createGain(),pn=ctx.createStereoPanner();
 mg.gain.value=f*.6;m.connect(mg);mg.connect(o.frequency);o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*(R()<.5?1.6:.6),t+d);pn.pan.value=(R()-.5)*1.6;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.025,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(pn);send(pn,A.m,.5,.35);t+=d+.03+R()*.08}rs()}
function droneCloud(w){const d=8+R()*4,rs=SPF(),f=d2f((cur&&cur.r)||0,2);rs();const q=ctx.createBiquadFilter(),g=ctx.createGain();q.type='lowpass';q.Q.value=3;q.frequency.setValueAtTime(250,w);q.frequency.exponentialRampToValueAtTime(1100,w+d*.5);q.frequency.exponentialRampToValueAtTime(250,w+d);
 [[1,-7],[1,6],[1.5,-4],[2,5],[3,-3]].forEach(([r,dt])=>{const o=osc('sawtooth',f*r,w,w+d+.1);o.detune.value=dt;o.connect(q)});g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(.05,w+d*.45);g.gain.exponentialRampToValueAtTime(.0001,w+d);q.connect(g);send(g,A.dk,.3,.55)}
const _as34=arrStep;arrStep=function(w){_as34(w);if(!G.dspace||(QOS.ml||0)>=2||tk%16)return;const b=Math.floor(tk/16);
 if(R()<.35)solarWind(w+R()*.5);if(R()<.3)sonar(w+sdur()*pick([0,4,8,10]));if(R()<.22)chirps(w+sdur()*pick([2,6,12]));if(b%4===0&&R()<.5)droneCloud(w);
 if(b%16===15){TR[4].p.seed=R()*1e3;buf=[];mot=[];mp=-1}};
