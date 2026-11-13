/* ---- v121→v134: "Break" thruster (toggle) — on: the drums switch to breakbeat patterns (Amen / Apache / two-step style kicks,
   backbeat snares with extra off-beat hits, 8th/16th hat shuffles, perc ghosts). A new variation every bar, a snare-roll fill every
   4th bar. If the snare is muted, the clap plays the snare part. Tapping it off restores your own patterns exactly. ---- */
{const g=document.querySelector('#t-perf .thr');if(g&&typeof holdPad==='function'){const K=[0,1,2,3,7];let sv=null;
 const P=x=>[...x].map(c=>c==='x'?1:0);
 const KICK=['x.x.......xx....','x......x..x.....','x.........x.....','x.x...x...x..x..','x..x......x..x..','x......x.x...x..'].map(P),
  SNR=['....x.......x...','....x..x....x...','....x.....x.x...','....x..x.x..x..x','....x.......x.x.'].map(P),
  HAT=['x.x.x.x.x.x.x.x.','x.xxx.x.x.xxx.x.','xx.xx.x.xx.xx.x.','x.x.x.xxx.x.x.x.'].map(P),
  PRC=['..x...x...x..x..','......x.......x.','..x..x....x..x..','.x...x.x...x....'].map(P),
  KF=P('x.x...x.x.......'),SF=P('....x...x.xxxxxx'),CLP=P('............x...'),pk=a=>a[Math.floor(R()*a.length)];
 const bar=fill=>{if(!sv)return;const sn=!TR[7].m||TR[2].m?7:2,set=(k,pt)=>{const T=TR[k];T.st=16;T.pt=pt.slice()};
  set(0,fill?KF:pk(KICK));set(sn,fill?SF:pk(SNR));set(1,pk(HAT));set(3,pk(PRC));if(sn!==2)set(2,R()<.5?CLP:Array(16).fill(0))};
 // toggle: tap on, tap off. Bar changes come from the step scheduler itself, so they land exactly on the downbeat.
 const ps=document.createElement('button');ps.className='pad';let on=0;const lab=()=>{ps.innerHTML='Break!'+(on?' ●':'')+'<span> (toggle)</span>';ps.classList.toggle('on',!!on)};
 const start=()=>{try{ensure()}catch(e){}if(!playing||on)return;sv={};K.forEach(k=>{const T=TR[k];sv[k]={st:T.st,pt:T.pt.slice()}});on=1;bar(((Math.floor(tk/16)%4)+4)%4===3);lab()};
 const stop=()=>{if(!on)return;on=0;if(sv)K.forEach(k=>{if(sv[k]){TR[k].st=sv[k].st;TR[k].pt=sv[k].pt}});sv=null;lab()};
 ps.addEventListener('click',()=>{on?stop():start()});lab();
 const _ab=arrStep;arrStep=function(w){try{if(on){if(window.SECTORS&&SECTORS.state.q&&tk%64===0&&!SECTORS.state.held)stop();else if(tk%16===0)bar(((Math.floor(tk/16)%4)+4)%4===3)}}catch(e){}return _ab.apply(this,arguments)};
 const _gb=generate;generate=function(){stop();return _gb.apply(this,arguments)};
 setInterval(()=>{if(on&&!playing)stop()},400);window.breakFX={start,stop,is:()=>!!on};
 ps.title='Tap: breakbeat drums on (new variation every bar, fill every 4th bar) · tap again: your own patterns back';
 ps.style.setProperty('--col','#7affd9');g.appendChild(ps);const o1=[...g.children].find(x=>/^\+1 octave/.test(x.textContent));if(o1)g.insertBefore(ps,o1)}}

