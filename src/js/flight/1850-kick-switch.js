
/* ---- v0.27: Flight — the Echo throw thruster becomes KICK SWITCH. Tap: a four-to-the-floor kick switches to a broken pattern
   (the last one you had, or one from a small library: breaks, tresillo, half-step, electro, skip); any other kick switches to four-to-the-floor.
   The change lands on the next bar. ---- */
{const LIB=['x.....x...x.....','x..x..x...x.....','x.........x.x...','x.....x.x.......','x..x....x..x....','x.....x...x..x..'];
 let alt=null,pend=0;
 const hits=()=>{const T=TR[0],o=[];for(let i=0;i<16;i++)if(T.pt[i%T.st])o.push(i);return o};
 const isFour=()=>{const h=hits();return h.length===4&&h.every((x,i)=>x===i*4)};
 const setPat=str=>{const T=TR[0],pt=[...str].map(c=>c==='x'?1:0);T.st=16;try{const ft=bassFit(T,pt);Object.assign(T,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){}T.pt=pat(T);
  /* bassFit finds the closest ring; if it is not exact, use the pattern as is */if(T.pt.join('')!==pt.join(''))T.pt=pt;try{draw(T,-1)}catch(e){}};
 const cur16=()=>{const T=TR[0];let s='';for(let i=0;i<16;i++)s+=T.pt[i%T.st]?'x':'.';return s};
 const HALF='x.......x.......'; /* v0.35: the switch now goes 4/4 ↔ HALF (kick on beats 1 and 3) — the lower-energy partner */
 const apply=()=>{if(isFour()){setPat(HALF);msg('KICK · HALF TIME')}else{alt=cur16();setPat('x...x...x...x...');msg('KICK · FOUR TO THE FLOOR')}paint()};
 const msg=t=>{try{if(typeof say==='function')say('◉ '+t)}catch(e){}};
 const _as=arrStep;arrStep=function(w){const r=_as.apply(this,arguments);try{if(pend&&((tk%16)+16)%16===0){pend=0;apply()}}catch(e){}return r};
 /* v0.33: clear state — the whole button shows the kick: solid = 4/4 (four to the floor), dark with an outline = BROKEN; while a switch waits it pulses and names the target */
 {const st=document.createElement('style');st.textContent=`#t-perf .kswb .ksv{display:block;font:800 15px ui-monospace,monospace;letter-spacing:.1em;margin-top:2px}
#t-perf .kswb.ksb{background:#170d07!important;color:#ff9b5d!important;box-shadow:inset 0 0 0 2px #ff9b5d!important}#t-perf .kswb.ksf{background:#ff9b5d!important;color:#140c06!important}
#t-perf .kswb.kpend{animation:kspulse .45s ease-in-out infinite alternate}@keyframes kspulse{from{filter:brightness(1)}to{filter:brightness(1.6);box-shadow:inset 0 0 0 3px #fff}}`;document.head.appendChild(st)}
 let btn=null;const paint=()=>{if(!btn)return;const four=isFour();
  const h='KICK<span class="ksv">'+(four?'4 / 4':cur16()===HALF?'HALF':'BROKEN')+'</span><span>'+(pend?'→ '+(four?'HALF':'4 / 4')+' · next bar':'tap to switch')+'</span>';
  if(btn._h!==h){btn._h=h;btn.innerHTML=h}btn.classList.add('kswb');btn.classList.toggle('ksf',four);btn.classList.toggle('ksb',!four);btn.classList.toggle('kpend',!!pend);btn.classList.remove('on')};
 const hook=()=>{const old=[...document.querySelectorAll('#t-perf button.pad')].find(b=>/^Echo throw/i.test(b.textContent));if(!old)return false;
  btn=old.cloneNode(true);old.replaceWith(btn);btn.style.setProperty('--col','#ff9b5d');
  btn.addEventListener('click',e=>{e.preventDefault();try{ensure()}catch(x){}if(!playing){apply();return}pend=pend?0:1;paint()});paint();return true};
 if(!hook())setTimeout(hook,500);UI.on(paint);window.orbKickSwitch={isFour,apply}}
