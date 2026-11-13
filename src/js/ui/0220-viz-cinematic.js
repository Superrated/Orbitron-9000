/* ---- v20: cinematic solar-system visual — nebula + parallax stars, motion trails, plasma star with kick shockwaves, star-lit planets, hit bursts + beams, sync lines, rumble asteroid belt, tap for fullscreen ---- */
{const cv=$('#viz');cv.width=720;cv.height=620;cv.style.cursor='pointer';cv.title='Tap for fullscreen';
 cv.onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():(cv.requestFullscreen||cv.webkitRequestFullscreen).call(cv)}catch(e){}};
 const st=document.createElement('style');st.textContent='#viz:fullscreen{width:100vw!important;height:100vh!important;max-width:none!important;object-fit:contain;background:#010306}';document.head.appendChild(st)}
const NEB=(()=>{const c=document.createElement('canvas');c.width=c.height=1100;const x=c.getContext('2d');x.fillStyle='#010306';x.fillRect(0,0,1100,1100);
 [['0,255,156',.09],['255,228,77',.05],['120,60,255',.08],['0,200,255',.07],['255,60,140',.05],['0,255,156',.06]].forEach(([c0,a])=>{for(let i=0;i<3;i++){const px=200+Math.random()*700,py=200+Math.random()*700,r=120+Math.random()*260,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba('+c0+','+a+')');g.addColorStop(1,'rgba('+c0+',0)');x.fillStyle=g;x.fillRect(0,0,1100,1100)}});
 for(let i=0;i<700;i++){x.globalAlpha=Math.random()*.5;x.fillStyle='#e8fff6';const s=Math.random()<.92?1:2;x.fillRect(Math.random()*1100,Math.random()*1100,s,s)}return c})();
const SL=[0,1,2].map(l=>Array.from({length:60},()=>({a:Math.random()*6.283,r:40+Math.random()*520,s:.5+Math.random()*(1+l),p:Math.random()*6.283})));
const AST=Array.from({length:140},()=>({a:Math.random()*6.283,o:(Math.random()-.5),s:.6+Math.random()*1.6,v:.6+Math.random()*.8}));
const PRT=[],WAVES=[],VZ={lastK:0,t0:performance.now(),fl:{}};
viz=function(){const now=performance.now();
 TR.forEach((T,k)=>{pads[k].classList.toggle("off",!!T.m);T.mb&&T.mb.classList.toggle("m",!!T.m)});
 if(!$("#t-viz").hidden||document.fullscreenElement){const x=$("#viz").getContext("2d"),W=720,H=620,cx=360,cy=310,TAU=6.2832,ts=(now-VZ.t0)/1000;
  const K=TR[0],kd=playing&&!K.m?Math.max(0,1-(now-(K.fl||0))/320):0;
  if(playing&&!K.m&&K.fl&&K.fl!==VZ.lastK){VZ.lastK=K.fl;WAVES.push(now);if(WAVES.length>6)WAVES.shift()}
  // persistence: draw the nebula translucently over the last frame -> motion trails
  x.globalCompositeOperation='source-over';x.globalAlpha=.42;x.save();x.translate(cx,cy);x.rotate(ts*.012);x.drawImage(NEB,-550,-550);x.restore();
  // parallax stars
  x.globalCompositeOperation='lighter';SL.forEach((L,l)=>{const rot=ts*(.006+.01*l);L.forEach(s=>{const a=s.a+rot,px=cx+s.r*Math.cos(a)*1.25,py=cy+s.r*Math.sin(a)*.8;if(px<0||px>W||py<0||py>H)return;x.globalAlpha=(.15+.25*l)*(.6+.4*Math.sin(ts*2+s.p));x.fillStyle='#d8fff0';x.fillRect(px,py,s.s,s.s)})});
  const tl=.5+.07*Math.sin(ts/7),rot=ts*.035,zm=1+.025*kd,sd=60/G.bpm/4,pos=ctx&&playing?tk-(nextT-ctx.currentTime)/sd:0;
  const pl=TR.map((T,k)=>({T,k,per:T.pad?16*(T.p.bars||1)*T.st:T.st})).filter(o=>o.k!==0).sort((a,b)=>a.per-b.per||a.k-b.k);
  const Rr=i=>(84+(330-84)*i/(pl.length-1))*zm,PX=(r,a)=>[cx+r*Math.cos(a),cy+r*tl*Math.sin(a)];
  pl.forEach((o,i)=>{o.r=Rr(i);const T=o.T,n=T.st,L=T.pad?16*(T.p.bars||1):1,ph=(((pos/L)%n)+n)%n/n;o.a=-Math.PI/2+TAU*ph+rot;[o.x,o.y]=PX(o.r,o.a);o.z=Math.sin(o.a);
   o.fl=playing&&!T.m?Math.max(0,1-(now-(T.fl||0))/280):0;if(o.fl>.9&&VZ.fl[o.k]!==T.fl){VZ.fl[o.k]=T.fl;for(let j=0;j<7+o.k%4;j++){const a=Math.random()*TAU,v=.6+Math.random()*1.8;PRT.push({x:o.x,y:o.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.8,c:T.c,b:now,l:500+Math.random()*400})}}});
  if(PRT.length>380)PRT.splice(0,PRT.length-380);
  // orbits (glow brighter right after their planet hits) + hit nodes
  pl.forEach(o=>{const T=o.T;x.globalCompositeOperation='lighter';x.setLineDash(T.m?[3,8]:[]);x.globalAlpha=T.m?.06:.12+.35*o.fl;x.strokeStyle=T.c;x.lineWidth=1+1.5*o.fl;x.beginPath();x.ellipse(cx,cy,o.r,o.r*tl,0,0,TAU);x.stroke();x.setLineDash([]);
   const n=T.st;for(let i=0;i<n;i++){if(!T.pad&&!T.pt[i])continue;const [mx,my]=PX(o.r,-Math.PI/2+TAU*i/n+rot),f=i===T.cs?o.fl:0;x.globalAlpha=T.m?.12:.35+.65*f;x.fillStyle=T.c;x.beginPath();x.arc(mx,my,1.8+4*f,0,TAU);x.fill()}});
  // asteroid belt between the 4th and 5th orbit, shaken by kick x rumble
  {const br=(Rr(3)+Rr(4))/2,sh=(G.rumble||0)*kd*9;x.fillStyle='#9fb8ad';AST.forEach(s=>{const a=s.a+ts*.05*s.v+rot,r=br+s.o*22+(Math.random()-.5)*sh,[px,py]=PX(r,a);x.globalAlpha=.25+.3*(Math.sin(a)+1)/2;x.fillRect(px,py,s.s,s.s)})}
  // kick shockwaves rolling out through the system
  WAVES.forEach(b=>{const f=(now-b)/900;if(f>1)return;const r=40+380*f;x.globalAlpha=.35*(1-f);x.strokeStyle='#ffe44d';x.lineWidth=2.5*(1-f)+.5;x.beginPath();x.ellipse(cx,cy,r,r*tl,0,0,TAU);x.stroke()});
  const planet=o=>{const T=o.T,s=((PSZ[o.k]||7)*(1+.3*o.z))*zm,rad=s*(1+.4*o.fl),col=T.m?'#2c3833':T.c;
   x.globalCompositeOperation='lighter';
   if(!T.m){x.globalAlpha=.25+.5*o.fl;const ag=x.createRadialGradient(o.x,o.y,rad*.6,o.x,o.y,rad*(2.4+o.fl*1.5));ag.addColorStop(0,col);ag.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=ag;x.beginPath();x.arc(o.x,o.y,rad*(2.4+o.fl*1.5),0,TAU);x.fill();
    if(o.fl>.05){x.globalAlpha=.35*o.fl;x.strokeStyle=T.c;x.lineWidth=1+2*o.fl;x.beginPath();x.moveTo(o.x,o.y);x.lineTo(cx,cy);x.stroke()}}
   x.globalCompositeOperation='source-over';
   const dx=cx-o.x,dy=cy-o.y,dl=Math.hypot(dx,dy)||1,lx=o.x+dx/dl*rad*.5,ly=o.y+dy/dl*rad*.5,g=x.createRadialGradient(lx,ly,rad*.05,o.x,o.y,rad*1.05);
   g.addColorStop(0,T.m?'#5a6862':'#ffffff');g.addColorStop(.3,col);g.addColorStop(1,'#000');x.globalAlpha=1;x.fillStyle=g;x.beginPath();x.arc(o.x,o.y,rad,0,TAU);x.fill();
   if(T.pad){const rr=ts*.3;x.globalCompositeOperation='lighter';[1.7,2.1].forEach((m,j)=>{x.globalAlpha=(T.m?.2:.55)-.15*j+.3*o.fl;x.strokeStyle=col;x.lineWidth=2-j*.8;x.beginPath();x.ellipse(o.x,o.y,rad*m,rad*m*.3,-.35+.05*Math.sin(rr),0,TAU);x.stroke()})}
   if(o.k===4&&!T.m){x.globalCompositeOperation='lighter';const ma=ts*2.2;x.globalAlpha=.8;x.fillStyle='#ffffff';x.beginPath();x.arc(o.x+Math.cos(ma)*rad*2,o.y+Math.sin(ma)*rad*.7,1.6,0,TAU);x.fill()}
   x.globalCompositeOperation='source-over';x.globalAlpha=T.m?.25:.55+.4*o.fl;x.fillStyle=col;x.font='600 11px ui-monospace,monospace';x.fillText(T.n.split(/[ ·]/)[0].toUpperCase(),o.x+rad+6,o.y-rad*.3)};
  pl.filter(o=>o.z<0).forEach(planet);
  // plasma star
  {const r=(30+12*kd)*zm,hot=K.m?'#6a2018':'#ffe44d';x.globalCompositeOperation='lighter';
   const g=x.createRadialGradient(cx,cy,0,cx,cy,r*3.2);g.addColorStop(0,K.m?'rgba(140,50,30,.9)':'rgba(255,250,220,1)');g.addColorStop(.15,hot);g.addColorStop(.35,K.m?'rgba(90,30,20,.3)':'rgba(255,140,30,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=1;x.fillStyle=g;x.beginPath();x.arc(cx,cy,r*3.2,0,TAU);x.fill();
   for(let i=0;i<5;i++){const a=ts*(.7+i*.23)+i*1.3,d=r*.45,bx=cx+Math.cos(a)*d,by=cy+Math.sin(a)*d*.8,bg=x.createRadialGradient(bx,by,0,bx,by,r*.9);bg.addColorStop(0,K.m?'rgba(160,60,30,.25)':'rgba(255,200,80,.35)');bg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=bg;x.beginPath();x.arc(bx,by,r*.9,0,TAU);x.fill()}
   if(!K.m){x.strokeStyle='#ffd040';for(let i=0;i<18;i++){const a=i/18*TAU+ts*.15,w=Math.sin(ts*3+i*2.1),r0=r*1.05,r1=r*(1.35+.25*w+1.1*kd);x.globalAlpha=.18+.4*kd;x.lineWidth=1.5;x.beginPath();x.moveTo(cx+r0*Math.cos(a),cy+r0*Math.sin(a));x.lineTo(cx+r1*Math.cos(a+.05*w),cy+r1*Math.sin(a+.05*w));x.stroke()}}
   x.globalCompositeOperation='source-over';x.globalAlpha=.85;x.fillStyle=K.m?'#c07060':'#3a2200';x.font='700 11px ui-monospace,monospace';x.textAlign='center';x.fillText('KICK',cx,cy+4);x.textAlign='left'}
  pl.filter(o=>o.z>=0).forEach(planet);
  // sync lines: planets that hit together get linked
  {const hot=pl.filter(o=>o.fl>.6);x.globalCompositeOperation='lighter';for(let i=0;i<hot.length;i++)for(let j=i+1;j<hot.length;j++){const a=hot[i],b=hot[j],f=Math.min(a.fl,b.fl);x.globalAlpha=.4*f;const lg=x.createLinearGradient(a.x,a.y,b.x,b.y);lg.addColorStop(0,a.T.c);lg.addColorStop(1,b.T.c);x.strokeStyle=lg;x.lineWidth=1.2;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
  // particles
  for(let i=PRT.length-1;i>=0;i--){const p=PRT[i],f=(now-p.b)/p.l;if(f>=1){PRT.splice(i,1);continue}p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy*=.97;x.globalAlpha=.8*(1-f);x.fillStyle=p.c;x.fillRect(p.x,p.y,2,2)}
  x.globalCompositeOperation='source-over';x.globalAlpha=1}
 requestAnimationFrame(viz)};
