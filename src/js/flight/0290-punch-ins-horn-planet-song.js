/* ---- v28: punch-ins — hat rolls + tom fill out; Steamboat horn and Planet song in ---- */
{const g=QD.children[1];
 const holdBtn=(label,col,dn,up)=>{const b=document.createElement('button');b.className='pad';b.innerHTML=label+'<span> (hold)</span>';b.style.setProperty('--col',col);g.appendChild(b);let on=0;
  const U=()=>{if(!on)return;on=0;b.classList.remove('on');up()};b.addEventListener('pointerdown',e=>{e.preventDefault();if(on)return;ensure();on=1;b.classList.add('on');dn()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,U));return b};
 // steamboat horn: deep detuned saw power-chord, pitch scoop, wobbling resonant low-pass, breath noise, dub echo on release
 let HN=null;
 holdBtn('Steam horn','#ffb84d',()=>{const t=ctx.currentTime,sO=OCT,sF=FIX;OCT=0;FIX=0;let f=d2f((cur&&cur.r)||0,1);OCT=sO;FIX=sF;while(f<55)f*=2;while(f>110)f/=2;
  const g=ctx.createGain(),q=ctx.createBiquadFilter(),ws=ctx.createWaveShaper(),lf=osc('sine',5.2,t,t+60),lg=ctx.createGain(),os=[];q.type='lowpass';q.Q.value=4;q.frequency.setValueAtTime(250,t);q.frequency.exponentialRampToValueAtTime(900,t+.35);lg.gain.value=90;lf.connect(lg);lg.connect(q.frequency);ws.curve=satCurve(2);
  [[1,-9],[1,8],[1.5,-5],[1.5,6],[2,-3],[2,4]].forEach(([r,dt])=>{const o=mkOsc();o.type='sawtooth';o.frequency.setValueAtTime(f*r*.93,t);o.frequency.exponentialRampToValueAtTime(f*r,t+.22);o.detune.value=dt;o.start(t);o.connect(q);os.push(o)});
  const ns=mkBuf(),nb=ctx.createBiquadFilter(),ng=ctx.createGain();ns.buffer=A.nb;ns.loop=true;nb.type='bandpass';nb.frequency.value=420;nb.Q.value=1.2;ng.gain.value=.5;ns.connect(nb);nb.connect(ng);ng.connect(q);ns.start(t);os.push(ns);
  q.connect(ws);ws.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25,t+.2);send(g,A.m,.35,.35);HN={g,os,lf}},
 ()=>{if(!HN)return;const t=ctx.currentTime,{g,os,lf}=HN;HN=null;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.exponentialRampToValueAtTime(.0001,t+.45);os.forEach(o=>o.stop(t+.5));lf.stop(t+.5);
  A.dF.gain.cancelScheduledValues(t);A.dF.gain.setValueAtTime(.78,t);A.dF.gain.setTargetAtTime(G.fb,t+1.4,.4)});
 // planet song: every hit rings a crystal bell on a chord tone; inner planets sing higher; panned to the planet's place on its orbit
 const PSG={on:0};
 holdBtn('Planet song','#7fd0ff',()=>{PSG.on=1},()=>{PSG.on=0});
 const ping=(k,w)=>{const T=TR[k],n=SC[G.scale].length,ch=(cur&&cur.n&&cur.n.length)?cur.n:[0,2,4],ri=Math.max(0,VORD.indexOf(k)),deg=ch[ri%ch.length]+(ri<3?2*n:ri<6?n:0),sO=OCT,sF=FIX;OCT=0;FIX=0;const f=d2f(deg,4);OCT=sO;FIX=sF;
  const st=T.st,s=tk%st,pan=Math.sin(6.2832*s/st)*.8,e=w+1.4,c=osc('sine',f,w,e),m=osc('sine',f*3.5,w,e),mg=ctx.createGain(),g=ctx.createGain(),pn=ctx.createStereoPanner(),v=(k===1?.035:.06)*(T.lv/.6);
  mg.gain.setValueAtTime(f*2.2,w);mg.gain.exponentialRampToValueAtTime(f*.05,w+.3);m.connect(mg);mg.connect(c.frequency);pn.pan.value=pan;
  g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(v,w+.004);g.gain.exponentialRampToValueAtTime(.0001,w+(ri<3?.45:1.2));c.connect(g);g.connect(pn);send(pn,A.m,.28,.3);routeTrack(pn,null,A.sh)};
 const _fire28=fire;fire=function(k,w){_fire28(k,w);if(PSG.on&&k!==5&&k!==9&&!TR[k].m&&!(k===1&&tk%4!==2))ping(k,w)}}
