
/* v166: (1) Evolve — the loop keeps moving without an arrangement: a hat roll on the last beat of every 8 bars, the kick drops out on the
   last beat of every 16 bars, and every 32 bars the perc ring shifts by two steps (and back 32 bars later). Mix → Evolve On/Off.
   (3) Clean low end — a gentle high-pass on the synth bus (lead, pad, stab, echo and reverb returns): ~110 Hz while bass or sub play,
   wide open when they don't (and for the Acid 303 line, which is the bass). */
{if(G.evolve==null)G.evolve=1;let dropK=0,shifted=0;
 const _as=arrStep;arrStep=function(w){_as.apply(this,arguments);dropK=0;try{if(!G.evolve)return;const s=((tk%16)+16)%16,b=Math.floor(tk/16);
   if(s===0&&b>0&&b%32===0){const P=TR[3];if(P&&!P.m&&P.st>2){P.r=((P.r+(shifted?-2:2))%P.st+P.st)%P.st;P.pt=pat(P);shifted=shifted?0:1}}
   if(s>=12&&b%16===15&&!TR[0].m)dropK=1;
   else if(s>=12&&b%8===7){const H=TR[1];if(H&&!H.m&&!H.pt[tk%H.st]){const o=H.lv;H.lv=o*(.45+.12*(s-12));try{fire(1,w)}finally{H.lv=o}}}}catch(e){}};
 const _f=fire;fire=function(k,w){if(k===0&&dropK&&G.evolve)return;return _f.apply(this,arguments)};
 const _g=generate;generate=function(){shifted=0;return _g.apply(this,arguments)};
 // clean low end on the synth bus
 let HP=null;const lowF=()=>{const bass=!TR[6].m&&TR[4].p.mode!=='Acid 303';return bass?110:25};
 const hpOn=()=>{if(!ctx||!A.gt||!A.m)return;if(!HP||HP.context!==ctx){HP=ctx.createBiquadFilter();HP.type='highpass';HP.Q.value=.6;HP.frequency.value=lowF();
   try{A.gt.disconnect(A.m)}catch(e){}A.gt.connect(HP);HP.connect(A.m)}const f=lowF();if(Math.abs(HP.frequency.value-f)>1)HP.frequency.setTargetAtTime(f,ctx.currentTime,.3)};
 const _f2=fire;fire=function(k,w){if(!HP&&ctx)try{hpOn()}catch(e){}return _f2.apply(this,arguments)};
 setInterval(()=>{try{hpOn()}catch(e){}},1000);
 window.evolve={set:v=>{G.evolve=v?1:0},hp:()=>HP&&HP.frequency.value};
 // UI: "Fill" toggle pad on Flight → Thrusters, in the place of the old +2 octaves pad. Clear state: lit + glow when on, dark + dashed when off.
 const st=document.createElement('style');st.textContent=`#t-perf .pad.evx{transition:background .15s,box-shadow .15s}
  #t-perf .pad.evx:not(.on){background:var(--c1)!important;color:var(--muted)!important;outline:1px dashed rgba(159,224,255,.55);outline-offset:-3px;box-shadow:none}
  #t-perf .pad.evx.on{background:#9fe0ff!important;color:#04100a!important;outline:0;box-shadow:0 0 14px rgba(159,224,255,.8),inset 0 0 0 2px #fff}
  #t-perf .pad.evx .evc{display:block;font-style:normal;font-size:9px;font-weight:600;letter-spacing:-.02em;text-transform:none;margin-top:2px;white-space:nowrap;font-family:ui-monospace,Menlo,monospace}`;document.head.appendChild(st);
 const add=()=>{if(document.querySelector('#t-perf .evx'))return;const pads=[...document.querySelectorAll('#t-perf .pad')];
  const oct2=pads.find(x=>/^\+2 octaves/.test(x.textContent.trim())),brk=pads.find(x=>/^Break!/.test(x.textContent.trim()));if(!oct2&&!brk)return;
  const b=document.createElement('button');b.className='pad evx';b.style.setProperty('--col','#9fe0ff');b.innerHTML='Fill';
  b.title='Fill on: the loop keeps moving — hat roll every 8 bars, kick drop on the last beat of every 16, perc shift every 32 · tap to switch off';
  const c=document.createElement('i');c.className='evc';b.appendChild(c);b.onclick=()=>{G.evolve=G.evolve?0:1;paint()};
  if(oct2){oct2.replaceWith(b)}else brk.after(b);paint()};
 // countdown: bars until the next hat roll (bar 8 of 16) and kick drop (bar 16 of 16); "now" during the beat it happens
 const until=(t,b,s)=>{const d=((t-b%16)%16+16)%16;return d===0?(s>=12?'now':'this bar'):d};
 const paint=()=>{const b=document.querySelector('#t-perf .evx');if(!b)return;b.classList.toggle('on',!!G.evolve);const c=b.querySelector('.evc');if(!c)return;
  let t='○ OFF';if(G.evolve){if(playing&&ctx){const st=((tk%16)+16)%16,br=Math.floor(tk/16);t='roll '+until(7,br,st)+'·drop '+until(15,br,st)}else t='● ON'}
  if(c.textContent!==t)c.textContent=t};
 add();UI.on(()=>{try{add();paint()}catch(e){}});UI.onBeat(paint)}   /* the countdown follows the sequencer: one repaint per beat */
