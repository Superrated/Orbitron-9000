/* ---- v33: subtle space cues — drifting starfield + horizon glow, orbit emblem (one turn per bar), mission clock, beat ping on play, satellite dot on the active tab ---- */
{const st=document.createElement('style');st.textContent=`
html{background:var(--bg,#020806)!important}body{background-color:transparent!important}
body::before{content:'';position:fixed;inset:-50%;z-index:-2;pointer-events:none;opacity:.55;
 background-image:radial-gradient(1px 1px at 20px 30px,#d8fff0 50%,transparent 51%),radial-gradient(1px 1px at 140px 90px,#bfffe6 50%,transparent 51%),radial-gradient(1.5px 1.5px at 260px 170px,#fff8c8 50%,transparent 51%),radial-gradient(1px 1px at 90px 230px,#d8fff0 50%,transparent 51%),radial-gradient(1px 1px at 310px 40px,#9fffd5 50%,transparent 51%);
 background-size:340px 260px;animation:drift 240s linear infinite;will-change:transform}
body::after{content:'';position:fixed;left:-30%;right:-30%;top:-62vh;height:80vh;z-index:-1;pointer-events:none;border-radius:50%;
 background:radial-gradient(ellipse at 50% 100%,rgba(0,255,156,.10),rgba(0,255,156,.03) 40%,transparent 70%);box-shadow:0 10px 60px rgba(0,255,156,.06)}
@keyframes drift{to{transform:translate(340px,130px)}}
h1{display:flex;align-items:center;gap:0}.orb{margin-right:10px}
.orb{position:relative;width:22px;height:22px;flex:none}
.orb i{position:absolute;inset:3px;border:1px solid rgba(0,255,156,.45);border-radius:50%}
.orb b{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#ffe44d;box-shadow:0 0 8px #ffe44d}
.orb em{position:absolute;inset:0;animation:spin 2s linear infinite;animation-play-state:paused}
.orb em::after{content:'';position:absolute;left:50%;top:0;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:#00ff9c;box-shadow:0 0 6px #00ff9c}
.orb.run em{animation-play-state:running}
@keyframes spin{to{transform:rotate(360deg)}}
.met{font:700 10px ui-monospace,monospace;color:#7fffc4;opacity:.75;margin-left:8px;letter-spacing:.08em;white-space:nowrap}
#play{position:relative;overflow:visible}
#play .ping{position:absolute;inset:-2px;border:1px solid var(--acc,#ffe44d);pointer-events:none;opacity:0}
#play .ping.go{animation:ping .5s ease-out}
@keyframes ping{from{opacity:.8;transform:scale(1)}to{opacity:0;transform:scale(1.25,1.6)}}
.tabs button{position:relative}
.tabs button.on::after{content:'';position:absolute;top:3px;right:5px;width:4px;height:4px;border-radius:50%;background:var(--acc,#ffe44d);box-shadow:0 0 6px var(--acc,#ffe44d)}
@media (prefers-reduced-motion:reduce){body::before,.orb em,#play .ping.go{animation:none!important}}`;document.head.appendChild(st);
 const h1=document.querySelector('h1'),orb=document.createElement('span');orb.className='orb';orb.innerHTML='<i></i><b></b><em></em>';h1.prepend(orb);
 const met=document.createElement('span');met.className='met';met.title='Mission elapsed time';met.textContent='T+00:00';(QB||$('#kinfo')).after(met);
 const pg=document.createElement('span');pg.className='ping';$('#play').appendChild(pg);
 let t0=0,lastB=-1;
 const em0=orb.querySelector('em');let ad0='',mt0='';setInterval(()=>{const on=playing&&ctx;if(orb.classList.contains('run')!==!!on)orb.classList.toggle('run',!!on);const ad=(240/G.bpm)+'s';if(ad!==ad0){ad0=ad;em0.style.animationDuration=ad} /* v0.23: write only on change */
  if(!on){t0=0;lastB=-1;if(mt0!=='T+00:00'){mt0='T+00:00';met.textContent=mt0}return}
  if(!t0)t0=performance.now();const s=Math.floor((performance.now()-t0)/1000),mt='T+'+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(mt!==mt0){mt0=mt;met.textContent=mt}if(0)met.textContent='T+'+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  const sd=60/G.bpm/4,pos=tk-(nextT-ctx.currentTime)/sd,b=Math.floor(pos/4);if(b!==lastB&&pos>=0){lastB=b;if(!$('#play .ping'))$('#play').appendChild(pg);pg.classList.remove('go');void pg.offsetWidth;pg.classList.add('go')}},40)}
