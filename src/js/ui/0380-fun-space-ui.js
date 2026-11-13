/* ---- v35: fun space UI — shooting stars, rocket liftoff on Generate, mission-control course banner, transmission ticker, warp-speed easter egg ---- */
{const st=document.createElement('style');st.textContent=`
.sstar{position:fixed;height:1.5px;width:140px;pointer-events:none;z-index:-1;background:linear-gradient(90deg,rgba(216,255,240,0),#d8fff0);border-radius:2px;opacity:0;transform:rotate(-18deg);animation:sstar 1.1s ease-out forwards}
@keyframes sstar{0%{opacity:0;margin-left:0}12%{opacity:.9}100%{opacity:0;margin-left:-320px;margin-top:105px}}
.rocket{position:fixed;font-size:22px;pointer-events:none;z-index:50;animation:lift 1.3s cubic-bezier(.5,0,.9,.4) forwards;filter:drop-shadow(0 6px 6px #ffb84d)}
@keyframes lift{0%{transform:translateY(0) rotate(-45deg);opacity:1}100%{transform:translateY(-110vh) rotate(-45deg);opacity:.9}}
.mctl{pointer-events:none;position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:60;font:700 11px ui-monospace,monospace;letter-spacing:.08em;color:#04100a;background:#ffe44d;padding:6px 12px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity .25s}
.mctl.on{opacity:1}
.ticker{position:fixed;left:0;right:0;bottom:0;z-index:40;height:22px;display:flex;align-items:center;gap:8px;padding:0 12px;font:600 10.5px ui-monospace,monospace;letter-spacing:.06em;color:#7fffc4;background:rgba(2,8,6,.88);border-top:1px solid rgba(0,255,156,.25);backdrop-filter:blur(3px);white-space:nowrap;overflow:hidden}
.ticker b{color:#ffe44d;font-weight:700}
body{padding-bottom:30px!important}
body.warp::before{animation-duration:3s!important}
.warpfx{position:fixed;inset:0;pointer-events:none;z-index:55;background:radial-gradient(circle,transparent 30%,rgba(0,255,156,.08) 60%,transparent 70%);animation:warp 2.6s ease-out forwards}
@keyframes warp{0%{opacity:0;transform:scale(.6)}20%{opacity:1}100%{opacity:0;transform:scale(2.4)}}
@media (prefers-reduced-motion:reduce){.sstar,.rocket,.warpfx{display:none!important}}`;document.head.appendChild(st);
 // shooting stars
 const shoot=()=>{if(!document.hidden){const s=document.createElement('div');s.className='sstar';s.style.left=(30+Math.random()*70)+'vw';s.style.top=(Math.random()*55)+'vh';document.body.appendChild(s);setTimeout(()=>s.remove(),1300)}setTimeout(shoot,9000+Math.random()*18000)};setTimeout(shoot,4000);
 // mission control banner
 const mc=document.createElement('div');mc.className='mctl';document.body.appendChild(mc);let mcT=0,mcI=0;
 const say=(txt)=>{clearInterval(mcI);clearTimeout(mcT);mc.textContent='';mc.classList.add('on');let i=0;mcI=setInterval(()=>{mc.textContent=txt.slice(0,++i);if(i>=txt.length){clearInterval(mcI);mcT=setTimeout(()=>mc.classList.remove('on'),2200)}},18)};
 // rocket on generate + course banner
 const _gen35=generate;generate=function(){_gen35();const sty=MP[curMood]?MP[curMood].sty:'';say('▲ COURSE SET · '+MN(curMood).toUpperCase()+(sty?' · '+sty.toUpperCase():'')+' · '+NN[G.root]+' '+G.scale.toUpperCase()+' · '+G.bpm+' BPM')};
 gb.addEventListener('click',e=>{const r=gb.getBoundingClientRect(),k=document.createElement('div');k.className='rocket';k.textContent='🚀';k.style.left=(r.left+r.width/2-11)+'px';k.style.top=(r.top+4)+'px';document.body.appendChild(k);setTimeout(()=>k.remove(),1400)});
 // transmission ticker
 const tk2=document.createElement('div');tk2.className='ticker';document.body.appendChild(tk2);
 const FUN=['Houston, we have a groove','Cosmic rays detected in the hi-hats','Asteroid field ahead — hold the rumble steady','Gravity assist from the sidechain engaged','Do not feed the sub-bass','Lunar module reports: bass is heavy','Solar flare on the reverb bus','All planets aligned on the downbeat','Wormhole in the delay line — echoes may arrive early','Ground control to Major Kick'];
 const live=()=>{const on=TR.filter(T=>!T.m).length-1,m=curMood,sty=MP[m]?MP[m].sty:'';return pick([
  'Kick star burning at <b>'+G.bpm+' BPM</b>','<b>'+on+'</b> planets in orbit','Lead in orbit: <b>'+(TR[4].p.patch||'custom')+'</b>','Sector: <b>'+m+'</b>'+(sty?' · '+sty:''),'Navigation key: <b>'+NN[G.root]+' '+G.scale+'</b>',
  'Systems: <b>CPU '+(typeof QOS!=='undefined'?QOS.nm[QOS.lvl]:'OK')+'</b>','Sub-bass gravity well: <b>'+(TR[6].m?'offline':'stable')+'</b>','Echoes returning from <b>'+(G.dt||.75)+'</b> beats away'])};
 let n=0;const tick2=()=>{const msg=(n++%3===2)?pick(FUN):live();tk2.innerHTML='<b>◉ MISSION CONTROL</b> <span>'+(playing?'':'[standby] ')+msg+'</span>';const sp=tk2.querySelector('span'),ov=sp.scrollWidth-(tk2.clientWidth-sp.offsetLeft-12);sp.style.display='inline-block';if(ov>0){sp.animate([{transform:'translateX(0)'},{transform:'translateX(0)',offset:.2},{transform:'translateX(-'+ov+'px)',offset:.8},{transform:'translateX(-'+ov+'px)'}],{duration:6500,fill:'forwards'})}};tick2();setInterval(tick2,7000);$('#play').addEventListener('click',()=>setTimeout(tick2,60));
 // warp-speed easter egg: tap the orbit emblem 5x
 const orb=document.querySelector('.orb');let taps=[];if(orb){orb.style.cursor='pointer';orb.addEventListener('click',()=>{const t=performance.now();taps=taps.filter(x=>t-x<2000);taps.push(t);if(taps.length>=5){taps=[];document.body.classList.add('warp');const w=document.createElement('div');w.className='warpfx';document.body.appendChild(w);say('★ WARP SPEED ENGAGED ★');for(let i=0;i<8;i++)setTimeout(shootOnce,i*120);setTimeout(()=>{document.body.classList.remove('warp');w.remove()},2800)}})}
 function shootOnce(){const s=document.createElement('div');s.className='sstar';s.style.left=(30+Math.random()*70)+'vw';s.style.top=(Math.random()*70)+'vh';document.body.appendChild(s);setTimeout(()=>s.remove(),1300)}}

try{window.__orbSnap1=TR.map(T=>JSON.parse(JSON.stringify(T.p,(k,v)=>v instanceof AudioNode||v instanceof AudioParam||typeof v==='function'?undefined:v)))}catch(e){}
generate();
build();viz();
