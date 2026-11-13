/* ---- v31: third riser "Shepard climb" — endlessly rising Shepard chord + accelerating chord-tone arp, thins low end, climax swell; release = boom + crash drop ---- */
{const SH={on:0,p:0,vs:[],ph:0,t:0,iv:0,lt:0,ai:0,km:false,kd:0};
 const st=document.createElement('style');st.textContent='#t-perf{grid-template-columns:repeat(3,minmax(0,1fr))!important}';document.head.appendChild(st);
 const chordHz=(t)=>{const n=SC[G.scale].length,cc=t!=null?chordAt(t):cur,ch=(cc&&cc.n&&cc.n.length)?cc.n:[0,2,4],sO=OCT,sF=FIX;OCT=0;FIX=0;const fs=ch.slice(0,3).map(d=>d2f(((d%n)+n)%n,0));OCT=sO;FIX=sF;return fs};
 function shTick(){if(!SH.on)return;const now=ctx.currentTime,dt=now-(SH.lt||now);SH.lt=now;const p=SH.p;SH.ph=(SH.ph+dt*(.05+.25*p))%1;
  SH.vs.forEach(v=>{const x=((v.oct+SH.ph)%6+6)%6,f=v.base*Math.pow(2,x),a=Math.exp(-Math.pow((x-3)/1.3,2));v.o.frequency.setTargetAtTime(f,now,.03);v.g.gain.setTargetAtTime(a*(SH.lite?.07:.05)*(.25+.75*p),now,.05)});
  SH.f.frequency.setTargetAtTime(400*Math.pow(30,p),now,.08);SH.ng.gain.setTargetAtTime(p>.85?(p-.85)*.5:0,now,.1);
  const sd=sdur(),div=p<.33?2*sd:p<.66?sd:sd/2;while(SH.t<now+.12){if(p>.04){const i=SH.ai++,t=SH.t,fq=900*Math.pow(2,R()*3+p*1.5),q=ctx.createBiquadFilter(),g=ctx.createGain(),pn=ctx.createStereoPanner(),m=osc('square',fq*1.37,t,t+.08),mg=ctx.createGain();
    q.type='bandpass';q.Q.value=6+10*p;q.frequency.value=fq;pn.pan.value=(R()*2-1)*.8;mg.gain.value=.35;m.connect(mg);mg.connect(q);
    {const s=mkBuf(),sg=ctx.createGain();s.buffer=A.nb;sg.gain.value=1;s.connect(sg);sg.connect(q);s.start(t,R()*.5);s.stop(t+.06)}
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.09+.12*p,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+.03+.04*(1-p));q.connect(g);g.connect(pn);send(pn,A.dk,.25,.2)}
   SH.t+=div}
  if(p>.7&&!SH.kd){SH.kd=1;SH.km=TR[0].m;TR[0].m=true}else if(p<=.7&&SH.kd){SH.kd=0;TR[0].m=SH.km}
  A.hp.frequency.setTargetAtTime(10*Math.pow(18,p),now,.08)}
 function impact(w){const o=osc('sine',120,w,w+1.2),g=ctx.createGain();o.frequency.exponentialRampToValueAtTime(38,w+.5);g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(.55,w+.005);g.gain.exponentialRampToValueAtTime(.0001,w+1.1);o.connect(g);g.connect(A.m);
  nz(w,'highpass',2500,1.4,.22,A.m,.8);nz(w,'bandpass',900,.25,.25,A.m,.5);duck(w)}
 const pn=mkPad('Shepard climb','endless rising atonal cluster · metallic ticks speed up 8ths → 16ths → 32nds · low end thins, kick drops near the top · climax swell<br>Release = boom + drop',
  ()=>{ensure();const t=ctx.currentTime,bus=ctx.createGain(),f=ctx.createBiquadFilter(),ns=mkBuf(),nf=ctx.createBiquadFilter(),ng=ctx.createGain();f.type='lowpass';f.Q.value=2;f.frequency.value=400;bus.gain.value=1;bus.connect(f);send(f,A.dk,.3,.45);
   ns.buffer=A.nb;ns.loop=true;nf.type='highpass';nf.frequency.value=3000;ng.gain.value=0;ns.connect(nf);nf.connect(ng);send(ng,A.dk,0,.4);ns.start(t);
   const lite=(QOS.floor||0)>=1,fs=(lite?[1,1.931]:[1,1.414,1.931,2.718]).map(r=>27.5*r),vs=[];SH.lite=lite; /* v0.36: Eco/Survival — 12 oscillators instead of 24 */fs.forEach((b,j)=>{for(let oc=0;oc<6;oc++){const o=mkOsc(),g=ctx.createGain();o.type=j%2?'triangle':'sawtooth';o.detune.value=(R()-.5)*40;o.frequency.value=b;o.start(t);g.gain.value=0;o.connect(g);g.connect(bus);vs.push({o,g,base:b*.5,oct:oc+j*.33,j})}});
   Object.assign(SH,{on:1,p:0,vs,ph:0,f,ns,ng,bus,lt:t,t:align(sdur()),ai:0,kd:0});SH.iv=setInterval(shTick,25)},
  p=>{SH.p=p},
  ()=>{if(!SH.on)return;SH.on=0;clearInterval(SH.iv);const t=ctx.currentTime;SH.vs.forEach(v=>{v.g.gain.cancelScheduledValues(t);v.g.gain.setTargetAtTime(0,t,.03);v.o.stop(t+.3)});SH.ng.gain.setTargetAtTime(0,t,.03);SH.ns.stop(t+.3);
   if(SH.kd){TR[0].m=SH.km;SH.kd=0}A.hp.frequency.setTargetAtTime(10,t,.02);if(SH.p>.3)impact(align(sdur()))});
 pn.classList.add('rz');Q3.after(pn)}
