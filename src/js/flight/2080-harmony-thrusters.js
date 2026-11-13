
/* ---- v0.36: two harmony thrusters (tap on / off).
   CHORD HOLD: the harmony stays on the chord that is playing — pad, bass and lead keep to it — until you tap again; then the progression moves on.
   LIFT: on the next bar the whole tune moves up a whole tone (pad, bass, lead, stab, satellite, tuned perc); tap again to come back down on the next bar.
   A Launch clears both. ---- */
{const H={hold:false,idx:null,last:0,lift:false,pend:null,base:null},bt={};window.orbHarm=H;
 const wrap=fn=>function(t){const a=[...arguments];if(H.hold){if(H.idx==null)H.idx=H.last;a[0]=H.idx}else{H.idx=null;H.last=t}return fn.apply(this,a)};
 pad=wrap(pad);padChord=wrap(padChord);
 const setRoot=r=>{G.root=((r%12)+12)%12;try{const el=document.querySelector('#root');if(el)el.value=G.root}catch(e){}};
 const _as=arrStep;arrStep=function(w){try{if(H.pend!=null&&((tk%16)+16)%16===0){const up=H.pend;H.pend=null;if(up){H.base=G.root;setRoot(G.root+2);H.lift=true;say&&say('◉ LIFT · up a whole tone')}else{if(H.base!=null)setRoot(H.base);H.lift=false;H.base=null;say&&say('◉ LIFT · home key')}paint()}}catch(e){}return _as.apply(this,arguments)};
 const _g=generate;generate=function(){if(H.lift&&H.base!=null)setRoot(H.base);H.hold=false;H.idx=null;H.lift=false;H.pend=null;H.base=null;const r=_g.apply(this,arguments);paint();return r};
 window.orbHarmReset=()=>{if(H.lift&&H.base!=null)setRoot(H.base);H.hold=false;H.idx=null;H.lift=false;H.pend=null;H.base=null;paint()};
 const paint=()=>{const c=bt.c,l=bt.l;if(c){c.classList.toggle('on',H.hold);const t='Chord hold<span>'+(H.hold?' · on':' (toggle)')+'</span>';if(c._h!==t){c._h=t;c.innerHTML=t}}
  if(l){l.classList.toggle('on',H.lift&&H.pend==null);l.classList.toggle('hpend',H.pend!=null);const t='Lift<span>'+(H.pend!=null?(H.pend?' → up · next bar':' → home · next bar'):H.lift?' · +2':' (toggle)')+'</span>';if(l._h!==t){l._h=t;l.innerHTML=t}}};
 const mk=(cls,col,title,fn)=>{const b=document.createElement('button');b.className='pad '+cls;b.style.setProperty('--col',col);b.title=title;b.addEventListener('click',e=>{e.preventDefault();try{ensure()}catch(x){}fn();paint()});return b};
 const make=()=>{const g=document.querySelector('#t-perf .thr');if(!g||g.querySelector('.chdb'))return;
  bt.c=mk('chdb','#b8a6ff','Tap: the harmony stays on the current chord · tap again: the progression moves on',()=>{H.hold=!H.hold;if(!H.hold)H.idx=null;try{say&&say(H.hold?'◉ CHORD HOLD':'◉ CHORD HOLD · off')}catch(e){}});
  bt.l=mk('lftb','#7dffb5','Tap: the whole tune moves up a whole tone on the next bar · tap again: back home on the next bar',()=>{if(H.pend!=null){H.pend=null;return}if(!playing){H.pend=null;if(!H.lift){H.base=G.root;setRoot(G.root+2);H.lift=true}else{if(H.base!=null)setRoot(H.base);H.lift=false;H.base=null}return}H.pend=!H.lift});
  g.appendChild(bt.c);g.appendChild(bt.l);paint()};
 const st=document.createElement('style');st.textContent='#t-perf .pad.hpend{animation:kspulse .45s ease-in-out infinite alternate}';document.head.appendChild(st);
 make();setTimeout(make,700);setTimeout(make,2600);UI.on(()=>{make();paint()})}
