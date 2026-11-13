/* ---- v19: visual = solar system. Kick is the star; each track is a planet orbiting at its own loop length (polymeters = different periods); hits are markers on its orbit ---- */
$('#viz').height=560;
const STARS=Array.from({length:150},()=>[Math.random()*720,Math.random()*560,Math.random()*1.5+.3,Math.random()*6.28]);
const PSZ={1:4,2:6,3:6,4:9,5:15,6:11,7:6,8:7,9:10};
viz=function(){const now=performance.now();
 TR.forEach((T,k)=>{pads[k].classList.toggle("off",!!T.m);T.mb&&T.mb.classList.toggle("m",!!T.m)});
 if(!$("#t-viz").hidden){const x=$("#viz").getContext("2d"),W=720,H=560,cx=360,cy=280,tl=.58,TAU=6.2832;
  x.globalAlpha=1;x.fillStyle='#020509';x.fillRect(0,0,W,H);
  STARS.forEach(s=>{x.globalAlpha=.2+.3*(1+Math.sin(now/1100+s[3]))/2;x.fillStyle='#d8fff0';x.fillRect(s[0],s[1],s[2],s[2])});
  const sd=60/G.bpm/4,pos=ctx&&playing?tk-(nextT-ctx.currentTime)/sd:0;
  const pl=TR.map((T,k)=>({T,k,per:T.pad?16*(T.p.bars||1)*T.st:T.st})).filter(o=>o.k!==0).sort((a,b)=>a.per-b.per||a.k-b.k);
  pl.forEach((o,i)=>{o.r=82+(345-82)*i/(pl.length-1);const T=o.T,n=T.st,L=T.pad?16*(T.p.bars||1):1,ph=(((pos/L)%n)+n)%n/n;o.a=-Math.PI/2+TAU*ph;o.x=cx+o.r*Math.cos(o.a);o.y=cy+o.r*tl*Math.sin(o.a);o.z=Math.sin(o.a)});
  // orbits + hit markers
  pl.forEach(o=>{const T=o.T;x.setLineDash(T.m?[3,7]:[]);x.globalAlpha=T.m?.1:.22;x.strokeStyle=T.c;x.lineWidth=1;x.beginPath();x.ellipse(cx,cy,o.r,o.r*tl,0,0,TAU);x.stroke();x.setLineDash([]);
   const n=T.st;for(let i=0;i<n;i++){if(!T.pad&&!T.pt[i])continue;const a=-Math.PI/2+TAU*i/n,mx=cx+o.r*Math.cos(a),my=cy+o.r*tl*Math.sin(a),fl=i===T.cs&&playing?Math.max(0,1-(now-(T.fl||0))/400):0;
    x.globalAlpha=T.m?.15:.45+.55*fl;x.fillStyle=T.c;x.beginPath();x.arc(mx,my,2.2+3*fl,0,TAU);x.fill()}});
  const drawPlanet=o=>{const T=o.T,s=(PSZ[o.k]||7)*(1+.28*o.z),fl=playing&&!T.m?Math.max(0,1-(now-(T.fl||0))/260):0,rad=s*(1+.45*fl),col=T.m?'#3a4a44':T.c;
   if(!T.m)for(let j=1;j<=14;j++){const a=o.a-j*.045,tx=cx+o.r*Math.cos(a),ty=cy+o.r*tl*Math.sin(a);x.globalAlpha=.35*(1-j/14);x.fillStyle=T.c;x.beginPath();x.arc(tx,ty,Math.max(.6,rad*.55*(1-j/16)),0,TAU);x.fill()}
   if(fl>0){x.globalAlpha=.5*fl;x.strokeStyle=T.c;x.lineWidth=2;x.beginPath();x.arc(o.x,o.y,rad+6+14*(1-fl),0,TAU);x.stroke()}
   const g=x.createRadialGradient(o.x-rad*.35,o.y-rad*.35,rad*.1,o.x,o.y,rad);g.addColorStop(0,T.m?'#56645e':'#ffffff');g.addColorStop(.35,col);g.addColorStop(1,'#050a08');
   x.globalAlpha=T.m?.45:1;x.fillStyle=g;x.beginPath();x.arc(o.x,o.y,rad,0,TAU);x.fill();
   if(T.pad){x.strokeStyle=col;x.globalAlpha=T.m?.25:.7;x.lineWidth=2;x.beginPath();x.ellipse(o.x,o.y,rad*1.9,rad*.55,-.35,0,TAU);x.stroke()}
   x.globalAlpha=T.m?.3:.75;x.fillStyle=col;x.font='600 12px ui-monospace,monospace';x.fillText(T.n.split(/[ ·]/)[0],o.x+rad+5,o.y-rad*.4)};
  pl.filter(o=>o.z<0).forEach(drawPlanet);
  // the star = kick
  {const K=TR[0],kd=playing&&!K.m?Math.max(0,1-(now-(K.fl||0))/320):0,r=30+14*kd,hot=K.m?'#7a2a20':'#ffe44d';
   x.globalAlpha=1;const g=x.createRadialGradient(cx,cy,2,cx,cy,r*2.6);g.addColorStop(0,'#ffffff');g.addColorStop(.18,hot);g.addColorStop(.42,K.m?'rgba(120,40,30,.35)':'rgba(255,170,40,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r*2.6,0,TAU);x.fill();
   if(kd>0){x.strokeStyle='#ffe44d';x.lineWidth=2;for(let i=0;i<14;i++){const a=i/14*TAU+now/4000,r0=r*1.1,r1=r*(1.3+.9*kd);x.globalAlpha=.5*kd;x.beginPath();x.moveTo(cx+r0*Math.cos(a),cy+r0*Math.sin(a));x.lineTo(cx+r1*Math.cos(a),cy+r1*Math.sin(a));x.stroke()}
    x.globalAlpha=.35*kd;x.beginPath();x.arc(cx,cy,r*(1.4+2.2*(1-kd)),0,TAU);x.stroke()}
   x.globalAlpha=.8;x.fillStyle=K.m?'#a05040':'#06231b';x.font='700 11px ui-monospace,monospace';x.textAlign='center';x.fillText('KICK',cx,cy+4);x.textAlign='left'}
  pl.filter(o=>o.z>=0).forEach(drawPlanet);x.globalAlpha=1}
 requestAnimationFrame(viz)};

{const C={'Echo throw':'#7fd0ff','Funky claps':TR[2].c,'Hat rolls':TR[1].c,'Tom fill':TR[3].c};[...QD.children[1].children].forEach(b=>{for(const k in C)if(b.textContent.startsWith(k))b.style.setProperty('--col',C[k])})}
