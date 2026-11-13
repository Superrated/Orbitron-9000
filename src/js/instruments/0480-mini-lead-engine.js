/* ---- v55: "Mini" lead engine — classic three-oscillator monosynth style: 3 VCOs (wave / range / detune / level) + noise, hot mixer, 4-pole ladder filter (AudioWorklet), separate filter contour, decay switch, glide ---- */
Object.assign(LDEF,{o1w:2,o1r:0,o1l:1,o2w:2,o2r:0,o2d:7,o2l:.8,o3w:2,o3r:-1,o3d:-5,o3l:.6,mnz:0,fatt:2,fdec:.3,fsus:.2,dsw:1,glk:0});
Object.keys(LDEF).forEach(k=>{if(TR[4].p[k]==null)TR[4].p[k]=LDEF[k]});
const MWN=['Triangle','Shark','Saw','Square','Wide pulse','Narrow pulse'],MRN=["32'","16'","8'","4'","2'"];
const MWC={};function miniWave(i){i=Math.round(i);if(i===0)return 'triangle';if(i===2)return 'sawtooth';if(i===3)return 'square';if(i===4)return pulseWave(.3);if(i===5)return pulseWave(.1);
 if(!MWC.sh){const N=48,re=new Float32Array(N),im=new Float32Array(N);for(let n=1;n<N;n++){const saw=2/(Math.PI*n)*(n%2?1:-1),tri=n%2?8/(Math.PI*Math.PI*n*n)*((n-1)/2%2?-1:1):0;im[n]=.55*saw+.45*tri}MWC.sh=ctx.createPeriodicWave(re,im)}return MWC.sh}
// 4-pole transistor-ladder model (Huovilainen-style, tanh per stage, feedback = resonance, self-oscillates near 4)
const LADDER_SRC=`const th=x=>{if(x>3)return 1;if(x<-3)return -1;const x2=x*x;return x*(27+x2)/(27+9*x2)};
registerProcessor('mini-ladder',class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:'cutoff',defaultValue:1000,minValue:20,maxValue:20000,automationRate:'a-rate'},{name:'res',defaultValue:0,minValue:0,maxValue:4.3,automationRate:'k-rate'},{name:'drive',defaultValue:1,minValue:.1,maxValue:8,automationRate:'k-rate'}]}
 constructor(){super();this.s0=0;this.s1=0;this.s2=0;this.s3=0}
 process(ins,outs,P){const y=outs[0][0],i0=ins[0],x=i0.length?i0[0]:null;
  if(!x){this.s0=0;this.s1=0;this.s2=0;this.s3=0;return true}   // slot idle (nothing connected): state cleared, the output block is already silent
  const c=P.cutoff,ca=c.length>1,k=P.res[0],dr=P.drive[0],sr=sampleRate,lim=sr*.42,comp=1+k*.55,N=y.length;
  let s0=this.s0,s1=this.s1,s2=this.s2,s3=this.s3,t0=th(s0),t1=th(s1),t2=th(s2),t3=th(s3),g=0;
  for(let i=0;i<N;i++){if((i&15)===0){const fc=ca?c[i]:c[0];g=1-Math.exp(-6.2831853*(fc<lim?fc:lim)/sr)}
   const u=th(x[i]*dr-k*s3);s0+=g*(u-t0);t0=th(s0);s1+=g*(t0-t1);t1=th(s1);s2+=g*(t1-t2);t2=th(s2);s3+=g*(t2-t3);t3=th(s3);y[i]=s3*comp}
  if(s0<1e-12&&s0>-1e-12)s0=0;if(s1<1e-12&&s1>-1e-12)s1=0;if(s2<1e-12&&s2>-1e-12)s2=0;if(s3<1e-12&&s3>-1e-12)s3=0;
  this.s0=s0;this.s1=s1;this.s2=s2;this.s3=s3;return true}})`;
function ladCap(){let q='Eco';try{q=localStorage.getItem('orb-q')||'Eco'}catch(e){}const mob=matchMedia('(pointer:coarse)').matches||(navigator.hardwareConcurrency||8)<=4;return q==='Survival'?0:q==='Hi-fi'?16:q==='Eco'?(mob?8:10):(mob?10:14)}
const _init55=init;init=function(){const nw=!ctx;_init55();if(nw){A.ladder=false;A.lads=null}if(!nw||!ctx.audioWorklet)return;const W=ctx.audioWorklet,c0=ctx,ok=()=>{if(ctx!==c0)return;ladPool();A.ladder=A.lads.length>0},viaData=()=>W.addModule('data:application/javascript;base64,'+btoa(LADDER_SRC)).then(ok).catch(()=>{A.ladder=false});try{W.addModule(URL.createObjectURL(new Blob([LADDER_SRC],{type:'application/javascript'}))).then(ok).catch(viaData)}catch(e){viaData()}};
/* perf: a fixed pool of ladder filters per engine (was: a new AudioWorkletNode + an 'end' message for every note). A note takes a free slot and
   hands it back when it has rung out; with every slot sounding the note uses the biquad pair, exactly like the old voice cap did. */
const LADN=6;
function ladPool(){A.lads=[];const n=Math.min(LADN,ladCap());for(let i=0;i<n;i++){try{const node=new AudioWorkletNode(ctx,'mini-ladder',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1]});
   node.parameters.get('drive').value=1.2;A.lads.push({node,cut:node.parameters.get('cutoff'),res:node.parameters.get('res'),free:0,md:null,g:null,id:0})}catch(e){break}}}
function ladGet(){const L=A.lads,now=ctx.currentTime;if(!L)return null;const cap=Math.min(L.length,ladCap());for(let i=0;i<cap;i++){const s=L[i];if(s.free<=now){ladFree(s);return s}}return null}
function ladFree(s){if(s.md){try{s.md.disconnect(s.node)}catch(e){}s.md=null}if(s.g){try{s.node.disconnect(s.g)}catch(e){}s.g=null}}
function miniVoice(w){const T=TR[4],p=T.p,v=T.lv,sd=60/G.bpm/4,d=leadNote(p);lastDeg=d;const f=leadFold(d2f(d,3+leadOct(p))),glk=(p.glk>=5?p.glk:p.gt||0)/1000,ghs=Math.sin(((tk%T.st)+1)*12.9898+(p.seed||0)*78.233)*43758.5453,sl=glk>.001&&LF>0&&w-LW<4*sd&&(p.glk>=5||ghs-Math.floor(ghs)<(p.glide||0)),f0=sl?LF:f;   /* v0.5: one glide for every engine — Glide chance + Glide time */
 const att=Math.max(.002,(p.att||2)/1000),dec=Math.max(.02,p.dec*Math.pow(2,1.2*mv("Lead decay",w))),susM=(p.sus||0)>.01,gate=Math.max(att+.01,(p.hold||1)*sd),rel=p.dsw?dec:Math.max(.01,p.rel||.05),
  e=w+(susM?gate+rel*1.6:att+dec+.03)+.04,mix=ctx.createGain(),vs=[];
 let vib=null;if(p.vib>.5){const l=osc('sine',p.vibr||5.5,w,e);vib=ctx.createGain();vib.gain.setValueAtTime(0,w);vib.gain.linearRampToValueAtTime(p.vib,w+.2);l.connect(vib)}
 [[p.o1w,p.o1r,0,p.o1l],[p.o2w,p.o2r,p.o2d,p.o2l],[p.o3w,p.o3r,p.o3d,p.o3l]].forEach(([wv,rg,dt,lv])=>{if(!(lv>.01))return;const r=Math.pow(2,Math.round(rg||0)),o=mkOsc(),wf=miniWave(wv||0),gg=ctx.createGain();
  if(typeof wf==='string')o.type=wf;else o.setPeriodicWave(wf);o.frequency.value=f0*r;o.detune.value=(dt||0)+(R()-.5)*6;if(vib)vib.connect(o.detune);gg.gain.value=lv*.42;o.connect(gg);gg.connect(mix);o.start(w);o.stop(e);vs.push([o,r])});
 if(p.mnz>.01){const ns=mkBuf(),ng=ctx.createGain();ns.buffer=A.nb;ns.loop=true;ng.gain.value=p.mnz*.35;ns.connect(ng);ng.connect(mix);ns.start(w,R()*.5);ns.stop(e)}
 if(sl)vs.forEach(([x,r])=>{x.frequency.setValueAtTime(f0*r,w);x.frequency.exponentialRampToValueAtTime(f*r,w+glk)});
 // hot mixer into the ladder
 const md=ctx.createWaveShaper();md.curve=satCurve(1.6);mix.connect(md);
 const kt=Math.pow(f/261.6,p.kt||0),cm=Math.pow(2,2.5*mv("Lead cutoff",w)),cb=Math.max(30,Math.min(16000,p.cut*kt*cm)),amt=Math.max(0,p.envA*Math.max(.3,kt)),pk2=Math.min(18000,cb+amt),
  fat=Math.max(.001,(p.fatt||2)/1000),fdc=Math.max(.02,p.fdec||.3),fs=Math.min(18000,cb+amt*(p.fsus||0)),k=Math.max(0,Math.min(4.15,((p.res||.5)-.5)/19.5*4.3)),g=ctx.createGain();
 const contour=prm=>{prm.setValueAtTime(cb,w);prm.linearRampToValueAtTime(pk2,w+fat);prm.setTargetAtTime(fs,w+fat,fdc/3);if(susM)prm.setTargetAtTime(cb,w+gate,(p.dsw?fdc:rel)/3)};
 const slot=A.ladder?ladGet():null;
 if(slot){contour(slot.cut);slot.res.value=k;md.connect(slot.node);slot.node.connect(g);slot.md=md;slot.g=g;slot.free=e-.06;const id=++slot.id;
  setTimeout(()=>{if(slot.id===id)ladFree(slot)},Math.max(0,(e-ctx.currentTime)*1000+250))}
 else{const q1=ctx.createBiquadFilter(),q2=ctx.createBiquadFilter();[q1,q2].forEach(q=>{q.type='lowpass';contour(q.frequency)});q1.Q.value=.7+k*3.2;q2.Q.value=.6;md.connect(q1);q1.connect(q2);q2.connect(g)}
 const pk=v*.4*(p.pg||1);g.gain.setValueAtTime(sl?pk*.8:.0001,w);if(!sl)g.gain.linearRampToValueAtTime(pk,w+att);
 if(susM){g.gain.setTargetAtTime(pk*p.sus,w+att,dec/3);g.gain.setTargetAtTime(.0001,w+gate,rel/4)}else g.gain.exponentialRampToValueAtTime(.0001,w+att+dec);
 send(g,A.ld||A.dk,p.ds,p.rs);leadVoice(g,w);LF=f;LW=w}
// knobs + menus
TR[4].x.push(['Osc 1 level','o1l',0,1,.01],['Osc 2 detune ¢','o2d',-50,50,1],['Osc 2 level','o2l',0,1,.01],['Osc 3 detune ¢','o3d',-50,50,1],['Osc 3 level','o3l',0,1,.01],['Noise','mnz',0,1,.01],
 ['Filter attack ms','fatt',1,2000,1],['Filter decay','fdec',.02,3,.01],['Filter sustain','fsus',0,1,.01],['Decay switch','dsw',0,1,1]);   /* v0.5: 'Glide ms' merged into Glide chance + Glide time */
LGRP.Osc.push('Osc 1 wave','Osc 1 range','Osc 1 level','Osc 2 wave','Osc 2 range','Osc 2 detune ¢','Osc 2 level','Osc 3 wave','Osc 3 range','Osc 3 detune ¢','Osc 3 level','Noise');
LGRP.Filter.push('Filter attack ms','Filter decay','Filter sustain');LGRP.Amp.push('Decay switch');LGRP.FX.push('Glide ms');
const NOTMINI=['Stack','Pulse','FM','Vowel','Organ','Sine'];
['Osc 1 wave','Osc 1 range','Osc 1 level','Osc 2 wave','Osc 2 range','Osc 2 detune ¢','Osc 2 level','Osc 3 wave','Osc 3 range','Osc 3 detune ¢','Osc 3 level','Noise','Filter attack ms','Filter decay','Filter sustain','Decay switch','Glide ms'].forEach(l=>LENGK[l]=['Mini']);
['Unison','Unison spread ¢','Stereo width','Sub osc','Octave up','Pitch env st','Pitch env time','Filter type','Fold','Fold env','Fold bias'].forEach(l=>LENGK[l]=NOTMINI);
BUILD.hooks.push({post(){queueMicrotask(()=>queueMicrotask(miniSels))}});function miniSels(){const c=TR[4].mb&&TR[4].mb.closest('.card');if(!c||c.querySelector('[data-mini]'))return;const g=c.querySelector('.grid'),P=TR[4].p,anchor=[...g.children].find(el=>labOf(el)==='Osc 1 level');
 [['Osc 1 wave',MWN,'o1w'],['Osc 1 range',MRN,'o1r'],['Osc 2 wave',MWN,'o2w'],['Osc 2 range',MRN,'o2r'],['Osc 3 wave',MWN,'o3w'],['Osc 3 range',MRN,'o3r']].forEach(([lab,opts,key])=>{
  const isR=key.endsWith('r'),cur=isR?opts[Math.round(P[key]||0)+2]:opts[Math.round(P[key]||0)],el=mkSel(lab,opts,cur,v=>{const i=opts.indexOf(v);P[key]=isR?i-2:i;P.patch=''});el.dataset.g='snd';el.dataset.mini=1;g.insertBefore(el,anchor||null)});
 leadPages()}
// engine list: Mini first; the old saw stack lives on as Stack
LENG.splice(0,LENG.length,'Mini','Stack','Pulse','FM','Vowel','Organ','Sine');
// patches on the Mini
Object.assign(LPRE,{
 Clean:{pg:1,eng:'Mini',o1w:2,o1r:0,o1l:1,o2w:2,o2r:0,o2d:7,o2l:.8,o3w:2,o3r:-1,o3d:-5,o3l:.6,mnz:0,cut:650,res:7,envA:3200,fatt:2,fdec:.32,fsus:.2,att:2,dec:.4,sus:.7,hold:1,dsw:1,glk:0,kt:.5},
 Pluck:{pg:1.5,eng:'Mini',o1w:2,o1r:0,o1l:1,o2w:3,o2r:0,o2d:5,o2l:.6,o3w:2,o3r:-1,o3d:0,o3l:.4,cut:300,res:5,envA:5000,fatt:1,fdec:.16,fsus:0,att:1,dec:.2,sus:0,dsw:1,glk:0,kt:.6,ds:.35,rs:.3},
 'Mini lead':{pg:1,eng:'Mini',o1w:2,o1r:0,o1l:1,o2w:3,o2r:0,o2d:6,o2l:.9,o3w:2,o3r:1,o3d:-4,o3l:.5,cut:900,res:9,envA:2600,fatt:15,fdec:.5,fsus:.45,att:6,dec:.5,sus:.8,hold:1.5,rel:.2,dsw:0,glk:120,kt:.5,vib:10,vibr:5.2},
 'Mini acid':{pg:1.6,eng:'Mini',o1w:3,o1r:0,o1l:1,o2w:2,o2r:0,o2d:0,o2l:0,o3w:2,o3r:0,o3d:0,o3l:0,cut:260,res:16,envA:5200,fatt:1,fdec:.15,fsus:0,att:1,dec:.18,sus:0,dsw:1,glk:60,kt:.3},
 'Mini bass':{pg:1,eng:'Mini',o1w:2,o1r:-1,o1l:1,o2w:3,o2r:-1,o2d:8,o2l:.8,o3w:0,o3r:-2,o3d:0,o3l:.7,cut:400,res:4,envA:1800,fatt:2,fdec:.25,fsus:.25,att:2,dec:.3,sus:.6,hold:1,dsw:1,glk:40,kt:.3}});
['Melancholic','Dark','Hopeful','Noir','Tense'].forEach(m=>{if(LMOOD[m]&&!LMOOD[m].includes('Mini lead'))LMOOD[m].push('Mini lead')});if(LMOOD.Dark)LMOOD.Dark.push('Mini bass');if(LMOOD.Tense)LMOOD.Tense.push('Mini acid');
