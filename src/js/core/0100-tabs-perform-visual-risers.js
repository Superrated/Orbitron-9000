/* tabs */
const TB=[["gen","Generate"],["drums","Drums"],["synth","Synths"],["mix","Mix"],["lfo","LFO"],["viz","Visual"],["perf","Perform"]];
TB.forEach(([id,l],i)=>{const b=document.createElement("button");b.textContent=l;b.className=i?"":"on";b.onclick=()=>TB.forEach(([j],n)=>{$("#t-"+j).hidden=j!==id;$("#tabs").children[n].classList.toggle("on",j===id)});$("#tabs").appendChild(b)});
/* perform */
$("#t-perf").innerHTML='<div class="panel"><h2>Live mutes</h2><div class="pads" id="pads"></div></div>';
const pads=TR.map((T,k)=>{const b=document.createElement("button");b.className="pad";b.style.setProperty("--col",T.c);b.textContent=T.n.split(" ")[0];b.onclick=()=>T.m=!T.m;$("#pads").appendChild(b);return b});
const gs=(n,v)=>n&&n.gain.setTargetAtTime(v,ctx.currentTime,.05);
/* visual */
$("#lg").innerHTML=TR.map(T=>'<span><i style="background:'+T.c+'"></i>'+T.n.split(" ")[0]+'</span>').join("");
function viz(){const now=performance.now();
 TR.forEach((T,k)=>{pads[k].classList.toggle("off",!!T.m);T.mb&&T.mb.classList.toggle("m",!!T.m)});
 if(!$("#t-viz").hidden){const x=$("#viz").getContext("2d"),cs=getComputedStyle(document.body),tx=cs.getPropertyValue("--text"),mu=cs.getPropertyValue("--muted");x.clearRect(0,0,720,720);
  const K=TR[0],kd=Math.max(0,1-(now-(K.fl||0))/260);x.fillStyle=K.c;x.globalAlpha=.25+.55*kd;x.beginPath();x.arc(360,360,24+24*kd,0,7);x.fill();
  TR.forEach(T=>{const r=70+TR.indexOf(T)*30,n=T.st,P=i=>{const a=-Math.PI/2+2*Math.PI*i/n;return[360+r*Math.cos(a),360+r*Math.sin(a)]};
   x.globalAlpha=.2;x.strokeStyle=mu;x.lineWidth=1;x.beginPath();x.arc(360,360,r,0,7);x.stroke();
   if(!T.pad){x.globalAlpha=T.m?.1:.5;x.strokeStyle=T.c;x.lineWidth=2;x.beginPath();let f=1;T.pt.forEach((h,i)=>{if(h){const[a,b]=P(i);f?x.moveTo(a,b):x.lineTo(a,b);f=0}});x.closePath();x.stroke()}
   T.pt.forEach((h,i)=>{const[a,b]=P(i);x.globalAlpha=T.m?.2:1;x.fillStyle=h?T.c:mu;x.beginPath();x.arc(a,b,h?7:3,0,7);x.fill();
    if(i===T.cs&&playing){x.globalAlpha=1;x.strokeStyle=tx;x.lineWidth=2;x.beginPath();x.arc(a,b,11,0,7);x.stroke();const dt=now-(T.fl||0);if(dt<350){x.globalAlpha=1-dt/350;x.strokeStyle=T.c;x.lineWidth=3;x.beginPath();x.arc(a,b,11+dt/12,0,7);x.stroke()}}})});x.globalAlpha=1}
 requestAnimationFrame(viz)}
/* riser: master high-pass + hold-and-drag build/drop */
const rs={on:0,p:0,kd:0,km:false,ld0:.28,y0:0};
const rp=document.createElement("div");rp.className="panel";
rp.innerHTML='<h2>Riser build → drop</h2><div id="riser" style="position:relative;height:240px;border-radius:14px;background:var(--c1);overflow:hidden;touch-action:none;user-select:none"><div id="rfill" style="position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(to top,#b583ff,#ff5d73);opacity:.85"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;pointer-events:none;padding:12px;line-height:1.5">Hold and drag up<br><span style="font-weight:400;font-size:12px">kick drops · reverb + delay swell · lead decay opens · high-pass rises<br>Release = drop</span></div></div>';
$("#t-perf").prepend(rp);
const RZ=$("#riser");
function setP(p){rs.p=p;$("#rfill").style.height=p*100+"%";if(!ctx)return;const t=ctx.currentTime,q=Math.max(0,(p-.15)/.85);
 if(p>.12&&!rs.kd){rs.kd=1;rs.km=TR[0].m;TR[0].m=true}else if(p<=.12&&rs.kd){rs.kd=0;TR[0].m=rs.km}
 A.hp.frequency.setTargetAtTime(10*Math.pow(120,p),t,.05);
 gs(A.rO,G.rev+(1.3-G.rev)*q);gs(A.sh,G.shim+(1.5-G.shim)*q);gs(A.dO,G.dly+(.85-G.dly)*q);gs(A.dF,G.fb+(.88-G.fb)*q);
 TR[4].p.dec=rs.ld0+(1.2-rs.ld0)*q}
RZ.addEventListener("pointerdown",e=>{e.preventDefault();init();RZ.setPointerCapture(e.pointerId);rs.on=1;rs.y0=e.clientY;rs.ld0=TR[4].p.dec;setP(0)});
RZ.addEventListener("pointermove",e=>{if(!rs.on)return;setP(Math.max(0,Math.min(1,(rs.y0-e.clientY)/(Math.max(150,RZ.getBoundingClientRect().height)*.85))))});
const drop=()=>{if(!rs.on)return;rs.on=0;const dT=window.__dropT,t=dT&&dT>ctx.currentTime?dT-.02:ctx.currentTime;if(dT&&dT>ctx.currentTime)window.__kickHold=dT; /* no kick before the drop beat */TR[4].p.dec=rs.ld0;if(rs.kd){rs.kd=0;TR[0].m=rs.km;if(playing&&!rs.km)fire(0,t+.02)}
 $("#rfill").style.height="0";rs.p=0;A.hp.frequency.setTargetAtTime(10,t,.02);gs(A.rO,G.rev);gs(A.sh,G.shim);gs(A.dO,G.dly);gs(A.dF,G.fb)};
["pointerup","pointercancel"].forEach(ev=>RZ.addEventListener(ev,drop));
/* timing helpers + noise riser */
function ensure(){init()}
const sdur=()=>60/G.bpm/4,anchor=()=>playing?nextT-tk*sdur():0;
const align=D=>{const a=anchor(),n=ctx.currentTime;return a+Math.ceil((n-a+.005)/D)*D};
function mkPad(h,t,dn,mv,up){const d=document.createElement("div");d.className="panel";d.innerHTML='<h2>'+h+'</h2><div style="position:relative;height:200px;border-radius:14px;background:var(--c1);overflow:hidden;touch-action:none;user-select:none"><div style="position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(to top,#4dd4ac,#6aa7ff);opacity:.85"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;pointer-events:none;padding:12px;line-height:1.5">Hold and drag up<br><span style="font-weight:400;font-size:12px">'+t+'</span></div></div>';
 const z=d.children[1],f=z.firstChild;let on=0,y0=0;
 z.addEventListener("pointerdown",e=>{e.preventDefault();ensure();z.setPointerCapture(e.pointerId);on=1;y0=e.clientY;dn();mv(0)});
 z.addEventListener("pointermove",e=>{if(!on)return;const p=Math.max(0,Math.min(1,(y0-e.clientY)/(Math.max(150,z.getBoundingClientRect().height)*.85)));f.style.height=p*100+"%";mv(p)});
 ["pointerup","pointercancel"].forEach(ev=>z.addEventListener(ev,()=>{if(!on)return;on=0;f.style.height="0";up()}));return d}
/* v3: snare track, new stutter (beat-repeat), noise riser with ordered drops; other perform buttons removed */
TR.push({n:"Snare",c:"#e8a0ff",st:16,h:2,r:4,lv:.7,p:{tone:190,snap:.8,dec:.22,rv:.2},x:[["Body tone","tone",110,320,1],["Snap","snap",0,1.5,.01],["Decay","dec",.06,.6,.01],["Reverb","rv",0,.6,.01]]});TR[7].pt=pat(TR[7]);
function snare(w,vel=1){if(window.DR&&DR.on(7,w,TR[7].lv*vel,TR[7].p))return;const T=TR[7],p=T.p,v=T.lv*vel,o=mkOsc(),g=ctx.createGain();o.type="triangle";o.frequency.setValueAtTime(p.tone*1.6,w);o.frequency.exponentialRampToValueAtTime(p.tone,w+.04);env(g,w,v*.6,p.dec*.6);o.connect(g);send(g,A.m,0,p.rv);o.start(w);o.stop(w+p.dec+.05);nz(w,"highpass",1500,p.dec,v*p.snap*.7,A.m,p.rv)}
$("#lg").insertAdjacentHTML("beforeend",'<span><i style="background:'+TR[7].c+'"></i>Snare</span>');
{const b=document.createElement("button");b.className="pad";b.style.setProperty("--col",TR[7].c);b.textContent="Snare";b.onclick=()=>TR[7].m=!TR[7].m;$("#pads").appendChild(b);pads.push(b)}
/* noise riser: kick drops first, then percussion; noise + synths pump on every beat (4 per bar) */
const nr2={on:0,p:0,t:0,iv:0,sm:[]},PERC=[1,2,3,7];
function nrRun2(){if(!nr2.on)return;const D=4*sdur(),L=.03+.28*nr2.p*nr2.p;while(nr2.t<ctx.currentTime+.12){duck(nr2.t);nr2.g.gain.setValueAtTime(L*.2,nr2.t);nr2.g.gain.linearRampToValueAtTime(L,nr2.t+D*.85);nr2.t+=D}}
function nrMv2(p){const n=ctx.currentTime,q=Math.max(0,(p-.1)/.9);nr2.p=p;TR[0].m=p>.1?true:nr2.sm[0];PERC.forEach(k=>TR[k].m=p>.35?true:nr2.sm[k]);
 nr2.f.frequency.setTargetAtTime(400*Math.pow(16,p),n,.08);A.hp.frequency.setTargetAtTime(10*Math.pow(60,p),n,.05);gs(A.rO,G.rev+(1-G.rev)*q);gs(A.dO,G.dly+(.6-G.dly)*q)}
const Q3=mkPad("Noise riser","kick drops first, then percussion · white noise + synths pump on every beat · reverb/delay swell · high-pass rises<br>Release = drop",
 ()=>{const s=mkBuf();s.buffer=A.nb;s.loop=true;const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=.9;f.frequency.value=400;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=6500;const g=ctx.createGain();g.gain.value=0;s.connect(f);f.connect(lp);lp.connect(g);g.connect(A.m);const rv=ctx.createGain();rv.gain.value=.6;g.connect(rv);rv.connect(A.rI);s.start();Object.assign(nr2,{on:1,src:s,f,g,p:0,sm:TR.map(T=>T.m),t:align(4*sdur()),iv:setInterval(nrRun2,25)})},nrMv2,
 ()=>{nr2.on=0;clearInterval(nr2.iv);const n=ctx.currentTime,kd=nr2.p>.1;nr2.g.gain.cancelScheduledValues(n);nr2.g.gain.setTargetAtTime(0,n,.02);nr2.src.stop(n+.15);TR.forEach((T,k)=>T.m=nr2.sm[k]);if(kd&&playing&&!nr2.sm[0])fire(0,n+.02);A.hp.frequency.setTargetAtTime(10,n,.02);gs(A.rO,G.rev);gs(A.dO,G.dly)});
/* snare fill: hold for a tempo-synced roll that speeds up and gets louder */
const fr={on:0,t:0,t0:0,iv:0};
function frRun(){if(!fr.on)return;const sd=sdur();while(fr.t<ctx.currentTime+.12){const b=(fr.t-fr.t0)/(4*sd);{const t=fr.t,v=Math.min(1.1,.75+.12*b);window.lpRun?lpRun('drm',()=>snare(t,v)):snare(t,v)}fr.t+=sd}}
const QS=document.createElement("div");QS.className="panel";QS.innerHTML='<h2>Snare fill</h2><button class="pad" style="width:100%;height:96px;background:#e8a0ff;touch-action:none;user-select:none">Hold for snare roll<br><span style="font-weight:400;font-size:12px">steady 16ths, tempo-synced, getting louder</span></button>';
{const b=QS.firstChild.nextSibling,go=e=>{e.preventDefault();if(fr.on)return;ensure();fr.on=1;fr.t=fr.t0=align(sdur());fr.iv=setInterval(frRun,25);b.classList.add("on")},stop=()=>{if(!fr.on)return;fr.on=0;clearInterval(fr.iv);b.classList.remove("on")};b.addEventListener("pointerdown",go);["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,stop))}
rp.after(Q3);Q3.after(QS);
/* pitch performance: octave up (hold), 2 octaves up (hold), next scale key (tap). Bass stays put. */
const QP=document.createElement("div");QP.className="panel";QP.innerHTML='<h2>Pitch · lead, perc, pad</h2><div class="pads"></div><div style="font-size:12px;color:var(--muted);margin-top:8px"></div>';
const PH=QP.children[1],KL=QP.children[2],ks={base:G.root,di:0,cur:G.root};
const kl=()=>KL.textContent="Current key: "+NN[G.root]+" "+G.scale;UI.on(kl);kl();
const hb=(l,dn,up)=>{const b=document.createElement("button");b.className="pad act";b.innerHTML=l;let on=0;const U=()=>{if(!on)return;on=0;b.classList.remove("on");up()};b.addEventListener("pointerdown",e=>{e.preventDefault();if(on)return;on=1;b.classList.add("on");dn()});["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,U));PH.appendChild(b)};
const tb=(l,fn)=>{const b=document.createElement("button");b.className="pad act";b.innerHTML=l;b.onclick=fn;PH.appendChild(b)};
hb("Octave up<br>(hold)",()=>G.ldUp=1,()=>G.ldUp=0); /* v0.24: lifts only the lead */
hb("2 octaves up<br>(hold)",()=>G.ldUp=2,()=>G.ldUp=0);


QS.after(QP);
/* perc synth: constant tuning option (ignores key, scale and octave buttons) */
Object.assign(TR[3].p,{mode:"Fixed",tune:57});TR[3].x.push(["Tune (MIDI note, 57 = A3)","tune",36,96,1]);
BUILD.sync.push(function(){const g=TR[3].mb.closest(".card").querySelector(".grid"),l=document.createElement("label");l.className="sl";l.innerHTML="Tuning";const s=document.createElement("select");["Fixed","Follow scale"].forEach(x=>s.add(new Option(x)));s.value=TR[3].p.mode==="Fixed"?"Fixed":"Follow scale";s.onchange=()=>TR[3].p.mode=s.value;l.appendChild(s);g.insertBefore(l,g.children[3])});
