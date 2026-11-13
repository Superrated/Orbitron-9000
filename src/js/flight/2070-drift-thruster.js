
/* ---- v0.35: DRIFT thruster (hold). Your patterns stay exactly the same, but every ring except the kick and pad gets a few empty steps
   longer (hats +1, clap +3, perc +2, lead +1, bass +2, snare +3, stab +3, satellite +1), so each pattern slowly drifts away from the
   kick at its own speed. Let go and they all snap back in phase on the next downbeat. Only the step patterns change — no extra sound. ---- */
{const ADD={1:1,2:3,3:2,4:1,6:2,7:3,8:3,9:1};let saved=null,pend=false,held=false,btn=null;
 const redraw=()=>{try{TR.forEach(T=>{if(!T.pad)draw(T,-1)})}catch(e){}};
 const on=()=>{if(saved){pend=false;return}saved={};for(const k in ADD){const T=TR[k];if(!T||T.pad||!T.pt)continue;saved[k]={st:T.st,pt:T.pt.slice()};
   T.pt=T.pt.slice(0,T.st).concat(Array(ADD[k]).fill(0));T.st=T.pt.length}
  redraw();try{say&&say('◉ DRIFT · patterns drifting')}catch(e){}};
 const restore=()=>{if(!saved)return;for(const k in saved){const T=TR[k],o=saved[k];T.st=o.st;T.pt=o.pt}saved=null;pend=false;redraw();paint();try{say&&say('◉ DRIFT · back in phase')}catch(e){}};
 const off=()=>{if(!saved)return;if(!playing){restore();return}pend=true;paint()};
 const _as=arrStep;arrStep=function(w){try{if(pend&&!held&&((tk%16)+16)%16===0)restore()}catch(e){}return _as.apply(this,arguments)};
 const _g=generate;generate=function(){saved=null;pend=false;held=false;paint();return _g.apply(this,arguments)};   // a Launch replaces the rings anyway
 const paint=()=>{if(!btn)return;btn.classList.toggle('on',held);btn.classList.toggle('kpend',pend&&!held);const t=held?'Drift<span> · drifting</span>':pend?'Drift<span> → in phase · next bar</span>':'Drift<span> (hold)</span>';if(btn._h!==t){btn._h=t;btn.innerHTML=t}};
 const make=()=>{const g=document.querySelector('#t-perf .thr');if(!g||g.querySelector('.drfb'))return;btn=document.createElement('button');btn.className='pad drfb';btn.style.setProperty('--col','#7ad7ff');
  btn.title='Hold: your patterns stay the same but every ring except the kick gets a few steps longer, so they drift away from the kick · let go: back in phase on the next downbeat';
  btn.addEventListener('pointerdown',e=>{e.preventDefault();if(held)return;try{ensure()}catch(x){}held=true;on();paint()});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,()=>{if(!held)return;held=false;off();paint()}));
  btn.addEventListener('contextmenu',e=>e.preventDefault());paint();const oc=[...g.children].find(b=>/^\+1 octave/.test(b.textContent));oc?oc.after(btn):g.appendChild(btn)};
 make();setTimeout(make,700);setTimeout(make,2600);UI.on(()=>{make();if(pend)paint()});window.orbDrift={on:()=>{held=true;on();paint()},off:()=>{held=false;off();paint()},state:()=>({held,pend,active:!!saved})}}
