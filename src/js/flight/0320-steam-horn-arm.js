/* ---- v32: steam horn = arm button; fires at the start of the drop when any riser is released ---- */
{const g=QD.children[1];const old=[...g.children].find(b=>/^Steam horn/.test(b.textContent));
 function hornAt(w,dur){const sO=OCT,sF=FIX;OCT=0;FIX=0;let f=d2f((cur&&cur.r)||0,1);OCT=sO;FIX=sF;while(f<55)f*=2;while(f>110)f/=2;const e=w+dur,end=e+1.5;
  const gg=ctx.createGain(),q=ctx.createBiquadFilter(),ws=ctx.createWaveShaper(),lf=osc('sine',5.2,w,end),lg=ctx.createGain();q.type='lowpass';q.Q.value=4;q.frequency.setValueAtTime(250,w);q.frequency.exponentialRampToValueAtTime(900,w+.35);lg.gain.value=90;lf.connect(lg);lg.connect(q.frequency);ws.curve=satCurve(2);
  [[1,-9],[1,8],[1.5,-5],[1.5,6],[2,-3],[2,4]].forEach(([r,dt])=>{const o=osc('sawtooth',f*r*.93,w,end);o.frequency.exponentialRampToValueAtTime(f*r,w+.22);o.detune.value=dt;o.connect(q)});
  const ns=mkBuf(),nb=ctx.createBiquadFilter(),ng=ctx.createGain();ns.buffer=A.nb;ns.loop=true;nb.type='bandpass';nb.frequency.value=420;nb.Q.value=1.2;ng.gain.value=.5;ns.connect(nb);nb.connect(ng);ng.connect(q);ns.start(w);ns.stop(end);
  q.connect(ws);ws.connect(gg);gg.gain.setValueAtTime(.0001,w);gg.gain.exponentialRampToValueAtTime(.25,w+.15);gg.gain.setValueAtTime(.25,e);gg.gain.exponentialRampToValueAtTime(.0001,e+1.4);send(gg,A.m,.35,.35);
  A.dF.gain.setValueAtTime(.78,e);A.dF.gain.setTargetAtTime(G.fb,e+1.4,.4)}
 const HA={arm:0};const b=document.createElement('button');b.className='pad';b.style.setProperty('--col','#ffb84d');
 const lab=()=>{b.innerHTML='Horn<br>'+(HA.arm?'▲ ARMED':'○ arm');b.classList.toggle('on',!!HA.arm)};lab();
 b.onclick=()=>{ensure();HA.arm=!HA.arm;lab()};if(old)old.replaceWith(b);else g.appendChild(b);
 const fireDrop=()=>{window.DROPW=0;if(window.dropAll)window.dropAll();if(!HA.arm||!ctx)return;HA.arm=0;lab();hornAt(window.DROPW||align(sdur()),32*sdur())};window.hornDrop=fireDrop;
 // watch the three riser pads: fire on release if the riser was actually raised
 const zones=[$('#riser'),...[...document.querySelectorAll('#t-perf>.rz')].map(pn=>pn.children[1])].filter((z,i,a)=>z&&a.indexOf(z)===i);
 zones.forEach(z=>{let y0=0,mx=0,on=0;z.addEventListener('pointerdown',e=>{on=1;y0=e.clientY;mx=0},true);z.addEventListener('pointermove',e=>{if(on)mx=Math.max(mx,(y0-e.clientY)/Math.max(150,z.getBoundingClientRect().height))},true);
  ['pointerup','pointercancel'].forEach(ev=>z.addEventListener(ev,()=>{if(on&&mx>.15)fireDrop();on=0},true))})}
