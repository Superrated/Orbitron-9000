/* ---- v58: three breakdown pads (hold + drag, like the risers; release = full groove back on the next step, armed horn fires)
   v60: breakdowns are a calmer version of the main track — the track's own patterns keep playing, thinned and softened by drag; synth decays and patterns evolve gently bar by bar ---- */
{const BD={on:0,p:0,k:0,t:0,t0:0,iv:0,sm:[],sv:null,bar:-1};window.orbBD=BD;const EVT=[1,3,4,6,8];
 const stepOf=w=>Math.round((w-anchor())/sdur());
 const bars=w=>Math.max(0,(w-BD.t0)/(16*sdur()));
 const wave=(b,per,ph)=>.5-.5*Math.cos(2*Math.PI*(b/per+(ph||0)));
 function save(){const S={p:{},pt:{}};S.p={l:TR[4].p.dec,pr:TR[5].p.rel,b:TR[6].p.dec,s:TR[8].p.dec,h:TR[1].p.dec,sc:TR[8].p.cut,oct:G.oct||0,eko:TR[8].p.eko,efb:TR[8].p.efb};EVT.forEach(k=>{const T=TR[k];S.pt[k]={h:T.h,r:T.r,pt:T.pt}});return S}
 function restore(){const S=BD.sv;if(!S)return;TR[4].p.dec=S.p.l;TR[5].p.rel=S.p.pr;TR[6].p.dec=S.p.b;TR[8].p.dec=S.p.s;TR[8].p.cut=S.p.sc;TR[1].p.dec=S.p.h;G.oct=S.p.oct;TR[8].p.eko=S.p.eko;TR[8].p.efb=S.p.efb;
  EVT.forEach(k=>{const T=TR[k],o=S.pt[k];T.h=o.h;T.r=o.r;T.pt=o.pt});BD.sv=null}
 function rePat(k,hm,rot){const T=TR[k],o=BD.sv.pt[k],h=Math.max(1,Math.min(T.st-1,Math.round(o.h*hm)));if(T.h===h&&T.r===o.r+rot)return;T.h=h;T.r=o.r+rot;T.pt=pat(T)}
 // gentle evolution: decays drift within a modest range, patterns thin a little and shift every 2 bars
 const EV=[
  (b,nb)=>{const S=BD.sv.p;TR[4].p.dec=S.l*(.7+.5*wave(b,4));TR[6].p.dec=Math.min(.8,S.b*(1+.4*wave(b,6,.25)));TR[5].p.rel=Math.min(3,S.pr*(1+.5*wave(b,8)));TR[8].p.dec=S.s*(.7+.9*wave(b,3,.5));
   if(nb&&BD.bar%2===0){const B=BD.bar/2;rePat(4,[1,.8,.7,.9][B%4],B%2);rePat(8,[1,.75,1.2,.85][B%4],B%3)}},
  (b,nb)=>{const S=BD.sv.p;TR[1].p.dec=S.h*(1+1.5*wave(b,4));TR[8].p.dec=S.s*(.8+wave(b,5));TR[4].p.dec=S.l*(.7+wave(b,6,.5));TR[5].p.rel=Math.min(3,S.pr*(1+.4*wave(b,6)));TR[8].p.cut=S.sc*(.8+.5*wave(b,8,.25));
   if(nb&&BD.bar%2===0){const B=BD.bar/2;rePat(1,[1,.8,1.15,.9][B%4],B%2);rePat(8,[1,1.25,.8,1.1][B%4],B%3);rePat(3,[1,.8,1.2][B%3],0)}},
  (b,nb)=>{const S=BD.sv.p,g=Math.min(1,b/8);TR[4].p.dec=S.l*(1+g)*(.8+.4*wave(b,3));TR[5].p.rel=Math.min(3,S.pr*(1.15+.5*g));TR[6].p.dec=S.b*(1+.3*g);
   if(nb&&BD.bar%2===0){const B=BD.bar/2;rePat(4,[.85,.7,.9,.75][B%4],B%2)}}];

 // off-kilter percussion: small woodblock / tick / conga voices on polymetric cycles (3, 5, 7 against the 16-step bar), nudged off the grid
 function kv(type,w,vel,pan){const g=ctx.createGain(),pn=ctx.createStereoPanner();pn.pan.value=pan;g.connect(pn);
  if(type==='wood'){const ch=(cur&&cur.n&&cur.n.length)?cur.n:[0,2,4],sO=OCT,sF=FIX;OCT=0;FIX=0;let f=d2f(ch[Math.floor(R()*ch.length)],4);OCT=sO;FIX=sF;while(f<500)f*=2;while(f>1400)f/=2;
   const o=osc('triangle',f,w,w+.08),q=ctx.createBiquadFilter();q.type='bandpass';q.frequency.value=f*1.5;q.Q.value=3;o.connect(q);q.connect(g);g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(.95*vel,w+.002);g.gain.exponentialRampToValueAtTime(.0001,w+.06)}
  else if(type==='tick'){nz(w,"bandpass",3500+R()*2500,.03,.8*vel,g,0);g.gain.value=1}
  else{const o=osc('sine',240,w,w+.2);o.frequency.exponentialRampToValueAtTime(150+R()*30,w+.09);o.connect(g);g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(1.05*vel,w+.003);g.gain.exponentialRampToValueAtTime(.0001,w+.16)}
  send(pn,A.m,.18,.22)}
 // per breakdown: [voice, cycle choices, timing nudge ms, base velocity]; the cycle changes every 4 bars
 const KIL=[[['wood',[3,5,3,7],12,.55],['tick',[5,7,5,3],-6,.5]],[['conga',[7,5,7,3],-8,.55],['tick',[3,3,5,7],10,.45]],[['wood',[5,7,5,6],18,.45],['conga',[6,7,9,5],-12,.35]]];
 function kilter(n,w,b,p){const B=Math.floor(b/4);KIL[BD.k].forEach(([ty,cy,nd,v],j)=>{const c=cy[B%cy.length],off=j*2+B;if(((n+off)%c+c)%c===0){const acc=((n+off)/c|0)%3===0?1:.7;
   kv(ty,Math.max(ctx.currentTime,w+nd/1000*(1+.5*Math.sin(n*.7))),v*acc*(.75+.35*p),(j?-1:1)*(.25+.35*Math.sin(n*.37)))}})}
 function run(){const sd=sdur();while(BD.t<ctx.currentTime+.12){const n=stepOf(BD.t),s=((n%16)+16)%16,b=bars(BD.t),nb=s===0&&Math.floor(b)!==BD.bar;if(nb)BD.bar=Math.floor(b);EV[BD.k](b,nb);if(BD.k===0)half(n,s,BD.t,Math.floor(b));else if(BD.k===1&&BD.p>.04){const base=20000*Math.pow(900/20000,BD.p);A.lp.frequency.setTargetAtTime(Math.min(20000,base*(n%3===0?2.4:.7)),BD.t,.03)}if((QOS.ml||0)<3)kilter(n,BD.t,b,BD.p);BD.t+=sd}}
 function half(n,s,w,B){const on=k=>!TR[k].m&&TR[k].pt[((n%TR[k].st)+TR[k].st)%TR[k].st],hv=(k,v)=>{const T=TR[k],o=T.lv;T.lv=o*v;try{if(k===7)snare(w,1);else fireVoice(k,w)}finally{T.lv=o}};
  if(s===0&&!on(0))hv(0,1);if(s===10&&BD.p<.5&&B%2===1)hv(0,.55);if(s===8){if(!on(7))hv(7,.85);if(!on(2)&&TR[2].pt.some(x=>x))hv(2,.6)}if(s===15&&B%4===3)hv(7,.3)}
 // per hit of the main track: velocity multiplier (0 = skip). s = step in bar, p = drag, B = bars held
 const VEL=[
  (k,s,p,B)=>k===0?(s===0?1:0):k===1?(s%2?0:s%4===2?.75-.2*p:p>.5?0:.4):k===2||k===7?(s===8?.85:0):k===3?(s%2?.4:.75)-.2*p:k===6?(s%2?0:.9-.2*p):k===9?.7:1,
  (k,s,p,B)=>k===0?(s%4===0?.8-.2*p:p>.4?0:.5):k===6?.8-.3*p:k===9?.5:k===1?.9:1,
  (k,s,p,B)=>k===0?(s===0?.6-.25*p:0):k===2||k===7?(B%2===1&&s>=8?.35:0):k===1?(s%4===2?.35:0):k===3?.55:k===6?(p>.6?0:.5-.4*p):k===9?0:k===8?.7:1];
 const _f60x=fire,_f60=function(k,w){if(k!==4)return _f60x(k,w);const P=TR[4].p,u=P.uni;P.uni=Math.min(u||1,BD.k===0?2:3);try{return _f60x(k,w)}finally{P.uni=u}};fire=function(k,w){if(!BD.on)return _f60x(k,w);const s=tk%16,v=VEL[BD.k](k,s,BD.p,Math.max(0,BD.bar));if(v<=0)return;if(v>=.999)return _f60(k,w);const T=TR[k],o=T.lv;T.lv=o*v;try{_f60(k,w)}finally{T.lv=o}};
 const KINDS=[
  {h:'Breakdown · gravity well',t:'heavy and low: half-time beat (kick on 1, snare on 3), synths drop an octave past halfway, dark low-pass, woodblocks and ticks<br>Release = full groove',
   mv:p=>{const n=ctx.currentTime;A.lp.frequency.setTargetAtTime(20000*Math.pow(1200/20000,p),n,.06);A.lp.Q.setTargetAtTime(.7+1.2*p,n,.1);gs(A.rO,G.rev+(.8-G.rev)*p*.4);if(BD.sv)G.oct=BD.sv.p.oct-(p>.5?1:0)}},
  {h:'Breakdown · eclipse',t:'tense and hypnotic: full tempo, kick on the beats, filter pulses in dotted 8ths and closes as you drag, stab echoes swell, congas and ticks<br>Release = filter snaps open',
   mv:p=>{const n=ctx.currentTime;A.lp.Q.setTargetAtTime(.7+2.8*p,n,.08);gs(A.dO,G.dly+(.5-G.dly)*p*.6);if(BD.sv){TR[8].p.eko=Math.max(BD.sv.p.eko||0,.25+.35*p);TR[8].p.efb=Math.max(BD.sv.p.efb||0,.55+.15*p)}if(p<=.04)A.lp.frequency.setTargetAtTime(20000,n,.05)}},
  {h:'Breakdown · zero-G',t:'light and floating: one soft kick per bar, the low end lifts away as you drag, bass fades, pads and lead stretch in big reverb and shimmer, drifting woodblocks and congas<br>Release = full groove',
   mv:p=>{const q=p*.85;gs(A.rO,G.rev+(1.1-G.rev)*q);gs(A.sh,G.shim+(1.4-G.shim)*q);gs(A.dO,G.dly+(.6-G.dly)*q);gs(A.dF,G.fb+(.7-G.fb)*q*.7);A.hp.frequency.setTargetAtTime(10+260*Math.pow(p,1.5),ctx.currentTime,.1)}}];
 const back=()=>{const n=ctx.currentTime;[A.lp.frequency,A.lp.Q,A.hp.frequency].forEach(x=>{x.cancelScheduledValues(n);x.setValueAtTime(x.value,n)});A.lp.frequency.setTargetAtTime(20000,n,.015);A.lp.Q.setTargetAtTime(.7,n,.05);A.hp.frequency.setTargetAtTime(10,n,.02);gs(A.rO,G.rev);gs(A.sh,G.shim);gs(A.dO,G.dly);gs(A.dF,G.fb)};
 const pads=KINDS.map((K,i)=>{const pn=mkPad(K.h,K.t,
   ()=>{if(BD.on)return;BD.on=1;BD.k=i;BD.p=0;BD.bar=-1;BD.sv=save();BD.t=BD.t0=align(sdur());BD.iv=setInterval(run,25)},
   p=>{if(!BD.on||BD.k!==i)return;BD.p=p;K.mv(p)},
   ()=>{if(!BD.on||BD.k!==i)return;BD.on=0;clearInterval(BD.iv);restore();back();if(BD.p>.15&&window.hornDrop)window.hornDrop()});
  pn.classList.add('rz','bdz');pn.firstChild.style.color='#ffb84d';pn.children[1].firstChild.style.background='linear-gradient(to top,#ff8a3d,#ffe44d)';return pn});
 const last=[...document.querySelectorAll('#t-perf>.rz')].pop();let at=last;pads.forEach(pn=>{at.after(pn);at=pn});
 const _g59=generate;generate=function(){if(BD.on){BD.sv=null;BD.on=0;clearInterval(BD.iv);back()}return _g59.apply(this,arguments)}}
