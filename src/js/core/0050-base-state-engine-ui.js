
/* v172: display names for moods (internal keys unchanged, so sectors, exports and settings keep working) */
window.MOODNAME={Dark:'Event Horizon',Melancholic:'Lost Signal',Dreamy:'Nebula',Tense:'Countdown',Ethereal:'Aurora',Hopeful:'First Light',Noir:'Dark Side',Drone:'Orbital Hum',Power:'Max Q',Ambient:'Low Orbit',
 /* v0.24 */Acid:'Solar Flare',Italo:'Satellite Disco',Breaks:'Meteor Shower',Bleep:'Telemetry','Melodic House':'Afterglow','Distorted Electro':'Ion Storm','Groove Techno':'Gravity Assist',Temporal:'Time Dilation',Vector:'Trajectory','Deep Space':'Outer Rim'};
window.MN=m=>(window.MOODNAME&&MOODNAME[m])||m;
const SC={Minor:[0,2,3,5,7,8,10],Dorian:[0,2,3,5,7,9,10],Phrygian:[0,1,3,5,7,8,10],Major:[0,2,4,5,7,9,11],"Harm. minor":[0,2,3,5,7,8,11],"Min pentatonic":[0,3,5,7,10],"Whole tone":[0,2,4,6,8,10],Hirajoshi:[0,2,3,7,8],"Major pentatonic":[0,2,4,7,9],"Sus pentatonic":[0,2,5,7,9],Lydian:[0,2,4,6,7,9,11],Mixolydian:[0,2,4,5,7,9,10],Hijaz:[0,1,4,5,7,8,10],"Double harmonic":[0,1,4,5,7,8,11],Pelog:[0,1,3,7,8],In:[0,1,5,7,8]};
const NN=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
const G={swing:.12,bpm:124,root:9,scale:"Minor",dly:.22,fb:.45,rev:.3,duck:.7,rel:.2,rumble:.22,rcut:140,shim:.6,dens:.5,bgrit:.1};
const TR=[
{n:"Kick",c:"#ff5d73",st:16,h:4,r:0,lv:.95,p:{pitch:48,dec:.45,punch:4,drive:2},x:[["Pitch","pitch",35,70,1],["Decay","dec",.12,.9,.01],["Punch","punch",0,8,.1],["Drive","drive",0,10,.1]]},
{n:"Hi-hat",c:"#4dd4ac",st:16,h:7,r:2,lv:.5,p:{dec:.05},x:[["Decay","dec",.02,.4,.01]]},
{n:"Clap",c:"#6aa7ff",st:16,h:2,r:4,lv:.6,p:{tone:1500},x:[["Tone","tone",600,3000,10]]},
{n:"Perc synth",c:"#ffb84d",st:13,h:5,r:1,lv:.5,p:{fm:3,dec:.15},x:[["FM","fm",0,8,.1],["Decay","dec",.05,.5,.01]]},
{n:"Lead · arp / marbles",c:"#b583ff",st:16,h:9,r:0,lv:.45,p:{mode:"Marbles",range:2,spread:.4,bias:.4,dv:.6,len:8},x:[["Range oct","range",1,3,1],["Spread","spread",0,1,.01],["Bias","bias",0,1,.01],["Déjà vu","dv",0,1,.01],["Loop len","len",2,16,1]]},
{n:"Pad · chords + shimmer",c:"#7fd0ff",st:4,h:4,r:0,lv:.4,pad:1,p:{bars:2},x:[["Bars/chord","bars",1,4,1]]},
{n:"Bass (derived)",c:"#f0e14d",st:16,h:5,r:0,lv:.7,p:{cut:500},x:[["Cutoff","cut",150,1500,10]]}];
const MODES=["Marbles","Interval","Up","Up/Down","Random"];
let prog=[0,5,3,4],cur={r:0,n:[0,2,4,6]},ctx,playing=false,tk=0,nextT=0,timer,buf=[],bp=0,ar=0,ad=1,prev=3,lastDeg=0,hitN=0,OCT=0,FIX=0,LF=0,LW=-9,FC=null;
const A={},DQ=[];
const $=s=>document.querySelector(s),R=Math.random,pick=a=>a[Math.floor(R()*a.length)];
const gauss=()=>(R()+R()+R()-1.5)/.75;
let XS=0,PX=[],PD=null,PPUSH=0,PTOP=null;
/* v0.24: lead octave = its own Octave knob plus the +1/+2 octave Thruster while held (they add up) */
function leadOct(p){return (p.loct||0)+(G.ldUp||0)}
/* v0.26: lead notes above ~2.4 kHz fold down an octave (Octave knob + Thruster + 3-octave range could reach 15 kHz) */
function leadFold(f){let n=0;while(f>2400&&n++<4)f/=2;return f}
function d2f(d,o){if(FIX)return FIX;o+=OCT;const s=SC[G.scale],n=s.length,k=Math.floor(d/n),m=12*(o+1)+G.root+s[((d%n)+n)%n]+12*k+XS;return 440*Math.pow(2,(m-69)/12)}
const pat=t=>{const a=Array(t.st).fill(0);if(t.pad)return a.fill(1);const on=[];for(let i=0;i<t.st;i++)if((i*t.h)%t.st<t.h)on.push(i);
 // tension: pull hits off the even grid (first hit stays put) — 0 = pure Euclid, 1 = wild, clustered, breakbeat-like
 const ten=+t.ten||0;if(ten>0&&on.length>1){const sp=t.st/on.length,sd=t.tsd||(t.sn||t.n||'x').length*7.31+1,used=new Set();
  on.forEach((q,j)=>{if(j>0){const x=Math.sin((j+1)*12.9898+sd*78.233)*43758.5453,u=(x-Math.floor(x))*2-1;q=Math.round(q+u*ten*sp*1.25)}q=((q%t.st)+t.st)%t.st;let d=0;while(used.has(q)&&d++<t.st)q=(q+1)%t.st;used.add(q)});
  used.forEach(q=>a[(q+t.r)%t.st]=1);return a}
 on.forEach(i=>a[(i+t.r)%t.st]=1);return a};
TR.forEach(t=>t.pt=pat(t));
// ---------- UI ----------
function sl(par,lab,min,max,val,step,fn){if(lab==='Chords')min=1;if(!isFinite(+val))val=min;   /* v0.75: a setting without a value showed "NaN" */const LG=/(cutoff|filter|tone)$/i.test(lab)&&!/tune/i.test(lab)&&min>0&&max/min>=2.5,lr=Math.log(max/min),U=v=>Math.log(Math.max(min,Math.min(max,v))/min)/lr,F=u=>min*Math.exp(lr*Math.max(0,Math.min(1,u))),dec=LG?0:(String(step).split('.')[1]||'').length,d=document.createElement('div');d.className='sl';d.innerHTML='<span>'+lab+'<b>'+(+val).toFixed(dec)+'</b></span>';
 const row=document.createElement('div'),i=document.createElement('input');row.className='sr';i.type='range';if(LG){i.min=0;i.max=1;i.step=.001;i.value=U(val);d.dataset.lmin=min;d.dataset.lmax=max}else{i.min=min;i.max=max;i.step=step;i.value=val}
 const cur=()=>LG?F(+i.value):+i.value,nx=k=>LG?cur()*Math.pow(1.02,k):+i.value+k*step;
 const set=v=>{v=Math.max(min,Math.min(d._max!=null?d._max:max,v));if(LG){i.value=U(v);v=Math.round(v);d.querySelector('b').textContent=v;fn(v);return}i.value=v;d.querySelector('b').textContent=(+i.value).toFixed(dec);fn(+i.value)};
 i.oninput=()=>set(cur());d.firstChild.ondblclick=()=>set(val);
 const mk=(t,dl)=>{const b=document.createElement('button');b.type='button';b.className='st';b.textContent=t;let to,iv,c=0;const stop=()=>{clearTimeout(to);clearInterval(iv)};
  b.addEventListener('pointerdown',e=>{e.preventDefault();c=0;set(nx(dl));to=setTimeout(()=>{iv=setInterval(()=>{c++;set(nx(dl*(1+Math.floor(c/6))))},70)},380)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));return b};
 row.append(mk('−',-1),i,mk('+',1));d.appendChild(row);par.appendChild(d)};
/* ---- build(): ONE function and a flat hook queue (was: 29 nested build=function(){_prev();…} wrappers).
   build()            runs the call hooks, then asks for a rebuild; several requests in one turn rebuild once (microtask).
   BUILD.sync[]       run inside the rebuild, right after the cards exist (tab placement, extra menus, chips, pattern/sound tags).
   BUILD.hooks[]      {pre, post} run at every build() call in the old wrapper order: pre from the newest hook inwards (a pre returning false
                      holds the rebuild back, e.g. while a finger is down), post from the oldest outwards (each schedules its own additions). ---- */
const BUILD={sync:[],hooks:[],clear:null,q:0,
 now(){if(BUILD.clear)BUILD.clear();buildCards();const S=BUILD.sync;for(let i=0;i<S.length;i++)S[i]();if(typeof UI!=='undefined')UI.sync(0,true)},
 request(){if(BUILD.q)return;BUILD.q=1;queueMicrotask(()=>{BUILD.q=0;BUILD.now()})}};
function build(){const H=BUILD.hooks,st=[];let i=H.length-1;
 for(;i>=0;i--){const h=H[i];if(h.pre){const r=h.pre();if(r===false)break;st[i]=r}}
 if(i<0)BUILD.request();
 for(let j=i+1;j<H.length;j++){const h=H[j];if(h.post)h.post(st[j])}}
function buildCards(){const root=$("#tracks");root.innerHTML="";TR.forEach((t,k)=>{
 const c=document.createElement("div");c.className="card";c.style.setProperty("--col",t.c);
 c.innerHTML='<div class="hd"><span>'+t.n+'</span></div>';
 const m=document.createElement("button");m.textContent="Mute";m.className=t.m?"m":"";m.onclick=()=>{t.m=!t.m;m.classList.toggle("m",t.m)};c.firstChild.appendChild(m);
 const b=document.createElement("div");b.className="body";const cv=document.createElement("canvas");cv.width=cv.height=208;t.cv=cv;b.appendChild(cv);
 const g=document.createElement("div");g.className="grid";
 const upd=()=>{if(t.pad){while(prog.length<t.st)prog.push(pick([3,4,5,0]));prog.length=t.st}t.pt=pat(t);draw(t,-1)};
 sl(g,t.pad?"Chords":"Steps",t.pad?3:2,t.pad?8:64,t.st,1,v=>{t.st=v;if(!t.pad){t.h=Math.min(t.h,v);t.r=Math.min(t.r||0,v-1)}upd()});   /* v0.75: Rotate stays inside a shortened ring */
 if(!t.pad){sl(g,"Hits",0,32,t.h,1,v=>{t.h=Math.min(v,t.st);upd()});sl(g,"Rotate",0,31,t.r,1,v=>{t.r=v;upd()});sl(g,"Tension",0,1,t.ten||0,.01,v=>{t.ten=v;upd()});if(k===6){const sep=document.createElement("div");sep.className="bksep";sep.textContent="Bassline";g.appendChild(sep);const P=t.p;g.appendChild(mkSel("Lock",["Free","Kick lock","Around kick","Offbeats","Rolling"],P.blk||"Free",v=>P.blk=v));g.appendChild(mkSel("Phrase",["1 bar","2 bars","4 bars"],(P.bph||1)+(P.bph>1?" bars":" bar"),v=>P.bph=parseInt(v)));sl(g,"Gate (0 = Decay)",0,1,P.bgt||0,.01,v=>P.bgt=v);sl(g,"Slide",0,1,P.bsl||0,.01,v=>P.bsl=v);sl(g,"Ghost notes",0,1,P.bgh||0,.01,v=>P.bgh=v);try{window.bassUI&&bassUI(g,t)}catch(e){}}
 if([0,1,2,3,7].includes(k)){const sep=document.createElement("div");sep.className="bksep";sep.textContent="Break feel";g.appendChild(sep);sl(g,"Accent",0,1,t.acc||0,.01,v=>t.acc=v);sl(g,"Ghosts",0,1,t.gho||0,.01,v=>t.gho=v);sl(g,"Variation",0,1,t.vari||0,.01,v=>t.vari=v)}}
 sl(g,"Level",0,t===TR[4]?1.4:1,t.lv,.01,v=>t.lv=v);
 if(k===4){const s=document.createElement("label");s.className="sl";s.innerHTML="Arp mode";const se=document.createElement("select");MODES.forEach(x=>se.add(new Option(x)));se.value=t.p.mode;se.onchange=()=>t.p.mode=se.value;s.appendChild(se);g.appendChild(s);const rs=document.createElement("button");rs.className="dice reseed";rs.textContent="Reseed";rs.onclick=()=>{buf=[];mot=[];mp=-1;TR[4].p.seed=Math.random()*1e3};g.appendChild(rs)}
 if(t.pad){const np=document.createElement("button");np.textContent="New progression";np.onclick=()=>newProg(t.st);g.appendChild(np)}
 t.x.forEach(([l,key,mn,mx,sp])=>sl(g,l,mn,mx,t.p[key],sp,v=>t.p[key]=v));
 b.appendChild(g);c.appendChild(b);root.appendChild(c);draw(t,-1)});
}
function draw(t,s){const c=t.cv;if(!c)return;const x=c.getContext("2d"),tx=window.DTX||(window.DTX=getComputedStyle(document.body).getPropertyValue("--text")),mu=window.DMU||(window.DMU=getComputedStyle(document.body).getPropertyValue("--muted"));x.clearRect(0,0,208,208);const n=t.st;
 /* v0.5: the pad ring follows the Chord rhythm — each dot sits where its chord starts and an arc shows how long the chord lasts (a long chord gets a long arc, a half chord a short one) */
 let FR=null;if(t.pad&&typeof PD!=='undefined'&&PD&&PD.length===n){let C=0;for(let i=0;i<n;i++)C+=PD[i];if(C>0){FR=[0];for(let i=0;i<n;i++)FR.push(FR[i]+PD[i]/C)}}
 const AN=i=>-Math.PI/2+2*Math.PI*(FR?FR[i]:i/n),P=i=>{const a=AN(i);return[104+78*Math.cos(a),104+78*Math.sin(a)]};
 x.strokeStyle=mu;x.globalAlpha=.25;x.beginPath();x.arc(104,104,78,0,7);x.stroke();
 if(t.pad&&n>1){x.strokeStyle=t.c;x.lineWidth=5;x.lineCap='round';for(let i=0;i<n;i++){const gp=Math.min(.26,(AN(i+1)-AN(i))*.32);x.globalAlpha=i===s?.9:.45;x.beginPath();x.arc(104,104,78,AN(i)+gp,AN(i+1)-gp);x.stroke()}x.lineCap='butt'}x.globalAlpha=.8;x.strokeStyle=t.c;x.lineWidth=2;x.beginPath();let f=1;t.pt.forEach((h,i)=>{if(h&&!t.pad){const[a,b]=P(i);f?x.moveTo(a,b):x.lineTo(a,b);f=0}});x.closePath();x.stroke();x.globalAlpha=1;
 t.pt.forEach((h,i)=>{const[a,b]=P(i);x.beginPath();x.arc(a,b,h?9:4,0,7);x.fillStyle=h?t.c:mu;x.globalAlpha=h?1:.5;x.fill();if(i===s){x.globalAlpha=1;x.lineWidth=3;x.strokeStyle=tx;x.beginPath();x.arc(a,b,13,0,7);x.stroke()}});x.globalAlpha=1}
// ---------- Audio ----------
function irM(b){const m=ctx.createBuffer(1,b.length,b.sampleRate);m.copyToChannel(b.getChannelData(0),0);return m} /* v0.22: mono impulse = half the convolution work */
function ir(sec,dec,lp){const n=ctx.sampleRate*sec,b=ctx.createBuffer(2,n,ctx.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);let y=0;for(let i=0;i<n;i++){y+=((R()*2-1)-y)*lp;d[i]=y*Math.pow(1-i/n,dec)}}return b}
let CURVEC={},CURVEN=0;function curve(k){k=Math.round(k*50)/50;if(CURVEC[k])return CURVEC[k];if(++CURVEN>200){CURVEC={};CURVEN=1}const key=k;const n=512,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/n*2-1;c[i]=Math.tanh(x*(1+k))}return CURVEC[key]=c}   /* v0.8: cached, in 0.02 steps of drive (the lead's Drive asked for a new table on every note) */
function init(){if(ctx){ctx.resume();return}
 ctx=new (window.AudioContext||window.webkitAudioContext)({latencyHint:window.orbBufHint?orbBufHint():'playback'});window.LAMIN=Math.max(0,(ctx.baseLatency||0)*1.6+.06);{const h=window.orbBufHint?orbBufHint():'playback';window.LASC=(h==='interactive'||(typeof h==='number'&&h<=.03))?.6:1}   /* v0.75: see the scheduler */
 const g=(v=1)=>{const n=ctx.createGain();n.gain.value=v;return n};
 A.m=g(.8);{const ws=ctx.createWaveShaper(),c=ctx.createDynamicsCompressor();ws.curve=wsCurve2();ws.oversample="none";A.hp=ctx.createBiquadFilter();A.hp.type="highpass";A.hp.frequency.value=10;A.lp=ctx.createBiquadFilter();A.lp.type="lowpass";A.lp.frequency.value=20000;A.lp.Q.value=.7;A.sg=ctx.createGain();c.threshold.value=-14;c.ratio.value=3;c.knee.value=12;c.attack.value=.01;c.release.value=.2;{const wi=g(.5);A.m.connect(wi);wi.connect(ws)}ws.connect(A.hp); /* v0.22 gain staging: 6 dB headroom into the master shaper (same curve below 0 dBFS, no hard clip above) */A.hp.connect(A.lp);A.arh=ctx.createBiquadFilter();A.arh.type='highpass';A.arh.frequency.value=10;A.arh.Q.value=.9;A.arf=ctx.createBiquadFilter();A.arf.type='lowpass';A.arf.frequency.value=20000;A.arf.Q.value=.9;A.lp.connect(A.arh);A.arh.connect(A.sg); /* perf 9: 20 kHz safety low-pass (A.arf) removed */A.glue=c;c.attack.value=.025;c.release.value=.15;c.ratio.value=2.5;c.knee.value=8;c.threshold.value=-3-12*G.glue;A.sg.connect(c);const ls=ctx.createBiquadFilter(),hs=ctx.createBiquadFilter();ls.type='lowshelf';ls.frequency.value=90;ls.gain.value=1.5;hs.type='highshelf';hs.frequency.value=9500;hs.gain.value=2;A.clip=ctx.createWaveShaper();A.clip.curve=clipCurve(G.clip);A.clip.oversample='2x';const lim=ctx.createGain(); /* perf 9: old limiter removed — the master's own limiter catches the peaks */A.lim=lim;A.out=g(.84);c.connect(ls);A.tls=ls;A.ths=hs;A.tmid=ctx.createBiquadFilter();A.tmid.type='peaking';A.tmid.frequency.value=700;A.tmid.Q.value=.8;A.tmid.gain.value=0;A.tpre=ctx.createBiquadFilter();A.tpre.type='highshelf';A.tpre.frequency.value=4500;A.tpre.gain.value=0;ls.connect(A.tmid);A.tmid.connect(A.tpre);A.tpre.connect(hs); /* v0.3: per-mood tonal balance (see TONE) */{const ci=g(.5);hs.connect(ci);ci.connect(A.clip)} /* v0.22: same headroom into the Loudness clipper */A.clip.connect(lim);lim.connect(A.out);A.out.connect(ctx.destination)}
 {const hh=ctx.createBiquadFilter(),gw=ctx.createWaveShaper();hh.type='highpass';hh.frequency.value=250;gw.curve=curve(14);gw.oversample='none';A.gr=g(G.bgrit*.3);A.m.connect(hh);hh.connect(gw);gw.connect(A.gr);A.gr.connect(A.hp)}
 A.dk=g();A.gt=g();A.dk.connect(A.gt);A.gt.connect(A.m);A.dkb=g();A.dkb.connect(A.m);
 const nb=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=R()*2-1;A.nb=nb;
 A.dI=g();A.dl=ctx.createDelay(2);A.dF=g(G.fb);A.dO=g(G.dly);const dlp=ctx.createBiquadFilter();dlp.frequency.value=2200;
 A.dl2=ctx.createDelay(2);A.dF2=g(G.fb);const dlp2=ctx.createBiquadFilter();dlp2.frequency.value=2200;const dhp=ctx.createBiquadFilter();dhp.type='highpass';dhp.frequency.value=280;const dsat=ctx.createWaveShaper();dsat.curve=satCurve(1.3);A.dI.connect(dhp);dhp.connect(A.dl);A.dl.connect(dlp);dlp.connect(dsat);dsat.connect(A.dF);A.dF.connect(A.dl2);A.dl2.connect(dlp2);dlp2.connect(A.dF2);A.dF2.connect(A.dl);{const pL=ctx.createStereoPanner(),pR=ctx.createStereoPanner();pL.pan.value=-.7;pR.pan.value=.7;dlp.connect(pL);dlp2.connect(pR);pL.connect(A.dO);pR.connect(A.dO)}A.dl2.delayTime.value=(G.dt||.75)*60/G.bpm;A.dO.connect(A.dk);A.dl.delayTime.value=(G.dt||.75)*60/G.bpm;
 A.rI=g();const cv=ctx.createConvolver();A.rcv=cv;cv.buffer=ir2(1.8,.022); /* v0.22 stability: was 2.7 s */A.rO=g(G.rev);{const rh=ctx.createBiquadFilter();rh.type='highpass';rh.frequency.value=220;A.rI.connect(rh);rh.connect(cv)}cv.connect(A.rO);A.rO.connect(A.dk);
 A.sh=g(G.shim);A.sh.connect(A.rI);
 A.ks=ctx.createWaveShaper();A.ks.curve=curve(TR[0].p.drive);A.ks.connect(A.m);
 A.ru=g(.8);const rc=ctx.createConvolver();A.rmc=rc;rc.buffer=irM(ir(1.1,1.6,.06));A.rl=ctx.createBiquadFilter();A.rl.frequency.value=G.rcut;A.rl.Q.value=.7;const rs=ctx.createWaveShaper();rs.curve=curve(2.5);A.rg=g(G.rumble);A.rdk=g();
 A.ru.connect(rc);rc.connect(A.rl);A.rl.connect(rs);rs.connect(A.rg);A.rg.connect(A.rdk);A.rdk.connect(A.m)}
/* ---- EXPLICIT VOICE ROUTING. Every voice hands its output to routeTrack(node, trackIndex, dest, dlySend, revSend); nothing else is intercepted:
   AudioNode.prototype.connect and BaseAudioContext.prototype.create* are native, and so are all connections inside a voice.
   The stages that used to hook connect() plug in here instead: RT.pro (auto-balance metering + clean-up EQ), RT.drum (drum bus), RT.lp (Flight low-pass).
   VX = the voice being built (track tag + voice id, set by the voice entry points). VO* = ring of the latest voice outputs, so Launch can fade ringing voices. ---- */
const VX={k:null,n:0,nc:0},RT={pro:null,drum:null,lp:null},VON=512,VOn=new Array(VON).fill(null),VOd=new Array(VON).fill(null),VOv=new Int32Array(VON),VOt=new Float64Array(VON);let VOi=0,PADGRAB=null;
const vlive=()=>!!ctx&&!(ctx instanceof OfflineAudioContext)&&!(window.DR&&DR.rendering);
/* a long-lived stage built by a voice (hat bus, ride bus, stab echo …) carries its track, like the voice's own output does */
function vtag(x){if(VX.k!=null&&vlive()){x.__k=VX.k;x.__n=VX.n}return x}
function padGain(g){if(PADGRAB&&!PADGRAB.g)PADGRAB.g=g;return g}
function vconn(n,k,d,nolp){if(d instanceof AudioNode&&vlive()&&n.context===ctx){const e=k!=null&&RT.pro?RT.pro(n,k,d):null;
  if(e)d=e;else{if(RT.drum)d=RT.drum(d);if(RT.lp&&!nolp)d=RT.lp(d)}
  VOn[VOi]=n;VOd[VOi]=d;VOv[VOi]=VX.n;VOt[VOi]=ctx.currentTime;VOi=(VOi+1)%VON}
 n.connect(d);return d}
function routeTrack(n,k,dest,dlySend,revSend){if(k==null)k=n.__k!=null?n.__k:VX.k;vconn(n,k,dest);if(dlySend)sendTo(n,A.dI,dlySend,k);if(revSend)sendTo(n,A.rI,revSend,k);return n}
function send(n,out,dly,rev){routeTrack(n,null,out,dly,rev)}
/* v0.23 perf: one send gain per track and level (made outside the note) instead of two new nodes per note */
function sendTo(n,dst,v,k){if(k===undefined)k=n.__k!=null?n.__k:VX.k;const key=(k==null?'x':k)+'|'+Math.round(v*1000);let m=dst.__sg||(dst.__sg=new Map()),s=m.get(key);
 if(s&&s!=='pending'){vconn(n,k,s);return}
 const t=ctx.createGain();t.gain.value=v;n.connect(t);vconn(t,VX.k,dst);
 if(!s&&m.size<160&&!(ctx instanceof OfflineAudioContext)){m.set(key,'pending');const c=ctx;queueMicrotask(()=>{try{if(c!==ctx)return;const g=c.createGain();g.gain.value=Math.round(v*1000)/1000;g.__an=1;if(k!=null)g.__k=k;vconn(g,k,dst);m.set(key,g)}catch(e){m.delete(key)}})}}
function env(g,t,pk,dur,att=.003){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+dur)}
function nz(t,type,f,dur,pk,out,rev){const s=mkBuf();s.buffer=A.nb;const q=ctx.createBiquadFilter();q.type=type;q.frequency.value=f;const g=ctx.createGain();env(g,t,pk,dur);s.connect(q);q.connect(g);send(g,out,0,rev||0);s.start(t,R()*.5);s.stop(t+dur+.02)}
function duck(t){const du=Math.max(0,Math.min(.95,G.duck+.4*mv("Sidechain depth",t)));A.dkb.gain.cancelScheduledValues(t);A.dkb.gain.setValueAtTime(1-du,t);A.dkb.gain.setTargetAtTime(1,t+G.rel*.12,G.rel*.38);A.dk.gain.cancelScheduledValues(t);A.dk.gain.setValueAtTime(1-du,t);A.dk.gain.setTargetAtTime(1,t+G.rel*.12,G.rel*.38);A.rdk.gain.cancelScheduledValues(t);A.rdk.gain.setValueAtTime(.03,t);A.rdk.gain.setTargetAtTime(1,t+.02,Math.min(G.rel*.6,13/G.bpm))}
const osc=(ty,f,t,e)=>{const o=mkOsc();o.type=ty;o.frequency.value=f;o.start(t);o.stop(e);return o};
/* v0.23 perf: pad modulation LFOs are shared (one running sine per rate, per audio context) instead of a new oscillator per chord.
   Each chord connects to it and disconnects when the chord ends. Rates snap to the nearest of 10 fixed rates. */
const PLF={};function plfo(f,w,e){if(!ctx||ctx instanceof OfflineAudioContext)return osc('sine',f,w,e);const RT=[.07,.11,.16,.23,.33,.5,.7,2.5,4,5.8],q=RT.reduce((b,x)=>Math.abs(Math.log(x/f))<Math.abs(Math.log(b/f))?x:b,RT[0]),key=q.toFixed(2); /* at most 10 shared LFOs */
 let L=PLF[key];if(!L||L.ctx!==ctx){const o=mkOsc();o.type='sine';o.frequency.value=q;o.start();L=PLF[key]={o,ctx}}const o=L.o,c=ctx;
 return {frequency:o.frequency,connect(d){o.connect(d);setTimeout(()=>{try{if(c===ctx||c.state!=='closed')o.disconnect(d)}catch(_){}},Math.max(0,(e-c.currentTime)*1000)+400);return d},disconnect(){},stop(){},start(){}}}
function leadNote(p){const n=SC[G.scale].length,top=p.range*n;
 if(p.mode==="Up"){ar=(ar+1)%top;return ar}
 if(p.mode==="Up/Down"){ar+=ad;if(ar>=top-1||ar<=0)ad*=-1;ar=Math.max(0,Math.min(top-1,ar));return ar}
 if(p.mode==="Random")return Math.floor(R()*top);
 const L=Math.round(p.len);bp=(bp+1)%L;if(buf[bp]===undefined||R()>p.dv){
  buf[bp]=p.mode==="Marbles"?Math.round(Math.max(0,Math.min(1,p.bias+gauss()*p.spread*.5))*(top-1)):Math.max(0,Math.min(top-1,prev+Math.round(gauss()*p.spread*4)))}
 prev=buf[bp];return buf[bp]}
function grains(w,sd){OCT=G.oct||0;const T=TR[5];if(R()>G.dens*1.2)return;const n=1+Math.floor(R()*2);for(let i=0;i<n;i++){const t0=w+R()*sd,dur=.12+R()*.35,f=d2f(pick(cur.n),3)*pick([2,2,3,4]),o=osc("sine",f,t0,t0+dur+.02),g=ctx.createGain();o.detune.value=(R()-.5)*14;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(T.lv*.07,t0+dur/2);g.gain.linearRampToValueAtTime(0,t0+dur);const pn=grainPan(R());o.connect(g);vconn(g,null,pn)}}
/* v0.8 quick win: grains share five fixed stereo positions (they made a new panner per grain); the grain itself is still registered as a voice */
let GPN=null;function grainPan(r){if(!GPN||GPN.ctx!==ctx||GPN.out!==A.sh){GPN={ctx,out:A.sh,p:[-.8,-.4,0,.4,.8].map(v=>{const n=ctx.createStereoPanner();n.pan.value=v;n.connect(A.sh);return n})}}return GPN.p[Math.min(4,Math.floor(r*5))]}
function toggle(){init();UI.sync(600);playing=!playing;$("#play").classList.toggle("on",playing);$("#play").textContent=playing?"■ Stop":"▶ Play";
 if(playing){tk=0;buf=[];nextT=ctx.currentTime+.06;timer=setInterval(tick,25)}else{clearInterval(timer);TR.forEach(t=>draw(t,-1))}}
function mix(){const f=[["Delay mix","dly",0,.8,.01,v=>A.dO&&(A.dO.gain.value=v)],["Delay feedback","fb",0,.85,.01,v=>A.dF&&(A.dF.gain.value=v)],["Reverb mix","rev",0,1,.01,v=>A.rO&&(A.rO.gain.value=v)],["Shimmer verb","shim",0,1.5,.01,v=>A.sh&&(A.sh.gain.value=v)],["Grain density","dens",0,1,.01,()=>0],["Sidechain depth","duck",0,.95,.01,()=>0],["Sidechain release","rel",.05,.5,.01,()=>0],["Rumble","rumble",0,1,.005,v=>A.rg&&(A.rg.gain.value=v)],["Rumble cutoff","rcut",60,260,1,v=>A.rl&&(A.rl.frequency.value=v)],["Bus grit","bgrit",0,1,.01,v=>A.gr&&(A.gr.gain.value=v*.3)]];const m=$("#mix");f.forEach(([l,k,a,b,s,fn])=>sl(m,l,a,b,G[k],s,v=>{G[k]=v;fn(v)}))}
$("#play").onclick=toggle;
$("#bpm").oninput=e=>{G.bpm=+e.target.value;$("#bv").textContent=G.bpm;if(A.dl){A.dl.delayTime.value=(G.dt||.75)*60/G.bpm;A.dl2.delayTime.value=(G.dt||.75)*60/G.bpm}};
NN.forEach((n,i)=>$("#root").add(new Option(n,i)));$("#root").value=G.root;$("#root").onchange=e=>G.root=+e.target.value;
Object.keys(SC).forEach(s=>$("#scale").add(new Option(s)));$("#scale").value=G.scale;$("#scale").onchange=e=>{G.scale=e.target.value;buf=[]};
$("#rnd").onclick=()=>{G.root=Math.floor(R()*12);G.scale=pick(Object.keys(SC));$("#root").value=G.root;$("#scale").value=G.scale;buf=[];
 TR.forEach(t=>{if(t.pad)return;if(t.n!=="Kick"){t.st=pick([8,12,13,16,16,16,5+Math.floor(R()*12)]);t.h=1+Math.floor(R()*Math.min(t.st-1,9));t.r=Math.floor(R()*t.st)}t.pt=pat(t)});newProg(TR[5].st);build()};
