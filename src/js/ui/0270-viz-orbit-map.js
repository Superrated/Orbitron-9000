/* ---- v24: angular, readable orbit map — flat polygon orbits (one corner per step), square hits joined into the rhythm shape, diamond planet per track, octagon kick star, bar playhead, labelled rings ---- */
const VORD=[1,2,7,3,6,9,4,8,5];   // inside: rhythm -> outside: melodic
const VA={waves:[],lastK:0};
const poly=(x,cx,cy,r,n,rot)=>{x.beginPath();for(let i=0;i<=n;i++){const a=rot+i/n*6.2832;i?x.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):x.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a))}x.closePath()};
/* perf: the planets' glow, the lit spheres and the sun are drawn once into small offscreen canvases (sprites) and blitted each frame —
   no createRadialGradient() per planet per frame. A frame is three batches instead of ~20 blend-mode switches:
   source-over (grid, orbits, steps, labels) → lighter (trails, glows, sun) → source-over (spheres, flares, sun corona, read-out). */
const VSP={glow:{},ball:{},star:{}},vsC=n=>{const c=document.createElement('canvas');c.width=c.height=n;return c};
function vsGlow(c,q){const key=c+'|'+q;let s=VSP.glow[key];if(!s){const N=128,R=64,outer=2.6+1.6*q/3;s=VSP.glow[key]=vsC(N);const g=s.getContext('2d'),gr=g.createRadialGradient(R,R,R*.5/outer,R,R,R);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(R,R,R,0,6.2832);g.fill()}return s}
function vsBall(c,mu){const key=c+'|'+(mu?1:0);let s=VSP.ball[key];if(!s){const R=40;s=VSP.ball[key]=vsC(2*R);const g=s.getContext('2d'),gr=g.createRadialGradient(R+R*.5,R,R*.08,R,R,R*1.05);gr.addColorStop(0,mu?'#56635e':'#ffffff');gr.addColorStop(.32,c);gr.addColorStop(1,'#000');g.fillStyle=gr;g.beginPath();g.arc(R,R,R,0,6.2832);g.fill()}return s}   // highlight on the +x side; rotated towards the sun when drawn
function vsStar(mu){const key=mu?1:0;let s=VSP.star[key];if(!s){const R=128;s=VSP.star[key]=vsC(2*R);const g=s.getContext('2d'),gr=g.createRadialGradient(R,R,0,R,R,R);gr.addColorStop(0,mu?'rgba(150,60,40,.9)':'rgba(255,252,230,1)');gr.addColorStop(.2,mu?'#6a2a20':'#ffe44d');gr.addColorStop(.45,mu?'rgba(80,30,20,.25)':'rgba(255,150,30,.3)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(R,R,R,0,6.2832);g.fill()}return s}
const VPL=VORD.map(()=>({on:false,px:0,py:0,s:0,fl:0,c:'',mu:false,pad:false,P:null,u:0,n:0}));let VEL=null,VCX=null,VTAB=null,VMUTE=-1,VPASS=-1;
viz=function(){const now=performance.now();
 /* mute pads / Mute buttons: written only when a mute changed (or after a UI sync pass), not on every frame */
 {let m=0;for(let k=0;k<TR.length;k++)if(TR[k].m)m|=1<<k;if(m!==VMUTE||UI.passes!==VPASS){VMUTE=m;VPASS=UI.passes;TR.forEach((T,k)=>{pads[k].classList.toggle("off",!!T.m);T.mb&&T.mb.classList.toggle("m",!!T.m)})}}
 if(!(VTAB||(VTAB=$("#t-viz"))).hidden||document.fullscreenElement){if(!VEL||!VEL.isConnected){VEL=$("#viz");VCX=VEL.getContext("2d")}const x=VCX,W=720,H=620,cx=360,cy=318,TAU=6.2832,top=-Math.PI/2;
  /* ---- batch 1: source-over ---- */
  x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#02060a';x.fillRect(0,0,W,H);
  // faint angular grid (one path)
  x.strokeStyle='rgba(0,255,156,.05)';x.lineWidth=1;x.beginPath();for(let g=0;g<=W;g+=40){x.moveTo(g,0);x.lineTo(g,H)}for(let g=0;g<=H;g+=40){x.moveTo(0,g);x.lineTo(W,g)}x.stroke();
  const sd=60/G.bpm/4,pos=ctx&&playing?tk-(nextT-ctx.currentTime)/sd:0,K=TR[0],kd=playing&&!K.m?Math.max(0,1-(now-(K.fl||0))/300):0;
  if(playing&&!K.m&&K.fl&&K.fl!==VA.lastK){VA.lastK=K.fl;VA.waves.push(now);if(VA.waves.length>5)VA.waves.shift()}
  const R0=70,R1=292,NR=VORD.length;
  // bar playhead (one turn per bar)
  if(playing){const a=top+TAU*(((pos%16)+16)%16)/16;x.strokeStyle='rgba(255,228,77,.35)';x.lineWidth=1.5;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+(R1+18)*Math.cos(a),cy+(R1+18)*Math.sin(a));x.stroke()}
  // angular kick shockwaves
  VA.waves.forEach(b=>{const f=(now-b)/800;if(f>1)return;x.globalAlpha=.4*(1-f);x.strokeStyle='#ffe44d';x.lineWidth=2;poly(x,cx,cy,40+(R1-40)*f,8,top+Math.PI/8);x.stroke()});x.globalAlpha=1;
  VORD.forEach((k,ri)=>{const T=TR[k],r=R0+(R1-R0)*ri/(NR-1),n=T.st,mu=!!T.m,c=mu?'#2f3d37':T.c,L=T.pad?16*(T.p.bars||1):1,cur=Math.floor((((pos/L)%n)+n)%n),fl=playing&&!mu?Math.max(0,1-(now-(T.fl||0))/260):0,V=i=>[cx+r*Math.cos(top+TAU*i/n),cy+r*Math.sin(top+TAU*i/n)];
   // orbit polygon
   x.globalAlpha=mu?.25:.32+.3*fl;x.strokeStyle=c;x.lineWidth=1;x.setLineDash(mu?[4,6]:[]);poly(x,cx,cy,r,n<8?16:n,top);x.stroke();x.setLineDash([]);
   // rhythm shape: hits joined
   if(!T.pad&&!mu){const hs=[];for(let i=0;i<n;i++)if(T.pt[i])hs.push(V(i));if(hs.length>1){x.beginPath();hs.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.globalAlpha=.05+.08*fl;x.fillStyle=c;x.fill();x.globalAlpha=.4+.3*fl;x.strokeStyle=c;x.lineWidth=1.5;x.stroke()}}
   // steps: square = hit, tick = rest; pad = chord segments
   for(let i=0;i<n;i++){const [px,py]=V(i),hit=T.pad||T.pt[i],on=i===cur&&playing;
    if(T.pad){x.globalAlpha=mu?.3:on?1:.35;x.strokeStyle=c;x.lineWidth=on?7:3;x.beginPath();for(let s=0;s<=10;s++){const a=top+TAU*(i+.04+.92*s/10)/n,qx=cx+r*Math.cos(a),qy=cy+r*Math.sin(a);s?x.lineTo(qx,qy):x.moveTo(qx,qy)}x.stroke();continue}
    if(hit){const s=on?6+6*fl:5;x.globalAlpha=mu?.35:on?1:.85;x.fillStyle=c;x.fillRect(px-s,py-s,2*s,2*s)}else{x.globalAlpha=mu?.25:.45;x.fillStyle=c;x.fillRect(px-2,py-2,4,4)}}
   // planet: position worked out here, drawn in batches 2 and 3
   const o=VPL[ri];o.on=playing;if(playing){const u=(((pos/L)%n)+n)%n,P=uu=>{if(n>=8&&!T.pad){const a0=Math.floor(uu),fr=uu-a0,[ax,ay]=V(a0),[bx,by]=V(a0+1);return[ax+(bx-ax)*fr,ay+(by-ay)*fr]}const a=top+TAU*uu/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]},[px,py]=P(u);
    o.px=px;o.py=py;o.s=(PSZ[k]||7)*1.15*(1+.35*fl);o.fl=fl;o.c=c;o.mu=mu;o.pad=!!T.pad;o.P=P;o.u=u;o.n=n}
   // label at 12 o'clock
   x.globalAlpha=mu?.4:1;x.fillStyle=c;x.font='700 15px ui-monospace,monospace';x.textAlign=ri%2?'left':'right';x.fillText((T.n.split(/[ ·(]/)[0]+(mu?' ✕':'')).toUpperCase(),cx+(ri%2?10:-10),cy-r+5);x.textAlign='left'});
  /* ---- batch 2: lighter (short trails, planet glows, the sun) ---- */
  const r=30+10*kd,sc=K.m?'#6a2a20':'#ffe44d';x.globalCompositeOperation='lighter';
  if(QOS.lvl<2)for(let ri=0;ri<NR;ri++){const o=VPL[ri];if(!o.on||o.mu)continue;const s=o.s,fl=o.fl;x.fillStyle=o.c;
   for(let j=1;j<=8;j++){const [tx,ty]=o.P(o.u-j*.06*(o.n/16));x.globalAlpha=.22*(1-j/9);x.beginPath();x.arc(tx,ty,s*.45*(1-j/10),0,TAU);x.fill()}
   const gr=s*(2.6+1.6*fl);x.globalAlpha=.3+.5*fl;x.drawImage(vsGlow(o.c,Math.round(fl*3)),o.px-gr,o.py-gr,2*gr,2*gr)}
  x.globalAlpha=1;x.drawImage(vsStar(!!K.m),cx-r*3,cy-r*3,r*6,r*6);
  /* ---- batch 3: source-over (lit spheres, rings, flares, sun corona + rays, read-out) ---- */
  x.globalCompositeOperation='source-over';
  for(let ri=0;ri<NR;ri++){const o=VPL[ri];if(!o.on)continue;const s=o.s,px=o.px,py=o.py,k=s/40,dx=cx-px,dy=cy-py,dl=Math.hypot(dx,dy)||1,co=dx/dl*k,si=dy/dl*k;
   x.globalAlpha=1;x.setTransform(co,si,-si,co,px,py);x.drawImage(vsBall(o.c,o.mu),-40,-40);x.setTransform(1,0,0,1,0,0);
   if(o.pad){x.strokeStyle=o.c;x.globalAlpha=o.mu?.3:.7;x.lineWidth=2;x.beginPath();x.ellipse(px,py,s*1.9,s*.55,-.4,0,TAU);x.stroke()}
   if(o.fl>0&&!o.mu){x.globalAlpha=.6*o.fl;x.strokeStyle=o.c;x.lineWidth=2;x.beginPath();x.arc(px,py,s+4+12*(1-o.fl),0,TAU);x.stroke()}}
  // the beat star: octagon corona, its kick steps as rays
  {const c=sc;x.globalAlpha=.7;x.strokeStyle=c;x.lineWidth=2;poly(x,cx,cy,r*1.25,8,top+Math.PI/8+now/6000);x.stroke();
   for(let i=0;i<16;i++){if(!K.pt[i%K.st])continue;const a=top+TAU*i/16,on=Math.floor(((pos%16)+16)%16)===i&&playing,l=on?14+18*kd:8;x.globalAlpha=K.m?.3:on?1:.55;x.strokeStyle=c;x.lineWidth=on?3:2;x.beginPath();x.moveTo(cx+r*1.35*Math.cos(a),cy+r*1.35*Math.sin(a));x.lineTo(cx+(r*1.35+l)*Math.cos(a),cy+(r*1.35+l)*Math.sin(a));x.stroke()}
   x.globalAlpha=1;x.fillStyle=K.m?'#c07060':'#3a2400';x.font='700 15px ui-monospace,monospace';x.textAlign='center';x.fillText(K.m?'KICK ✕':'KICK',cx,cy+5);x.textAlign='left'}
  // corner read-out
  x.globalAlpha=.8;x.fillStyle='#7fffc4';x.font='700 17px ui-monospace,monospace';x.fillText((NN[G.root]+' '+G.scale+' · '+G.bpm+' BPM').toUpperCase(),14,22);x.fillText('BAR '+(playing?Math.floor(pos/16)+1:'-')+'  STEP '+(playing?Math.floor(((pos%16)+16)%16)+1:'-'),14,44);
  x.globalAlpha=.6;x.font='600 14px ui-monospace,monospace';x.fillText('■ hit  · rest  ● planet',W-230,H-14);x.globalAlpha=1}
 requestAnimationFrame(viz)};
