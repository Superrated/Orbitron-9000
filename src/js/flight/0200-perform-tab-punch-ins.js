/* ---- v18: perform tab — risers kept; FX morph, scale-step/home-key and stab buttons removed; 3 punch-ins added ---- */
QM.remove();
{const g=QD.children[1];[...g.children].forEach(b=>{if(/^Stab/.test(b.textContent))b.remove()});QD.children[0].textContent='Fills · punch-ins'}
function tom(t,f,v){const e=t+.4,o=osc('sine',f*1.7,t,e),o2=osc('triangle',f*1.5,t,t+.08),g=ctx.createGain(),g2=ctx.createGain();o.frequency.exponentialRampToValueAtTime(f,t+.05);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+.32);g2.gain.setValueAtTime(v*.25,t);g2.gain.exponentialRampToValueAtTime(.0001,t+.06);
 o.connect(g);o2.connect(g2);g2.connect(g);send(g,A.m,.12,.25);nz(t,'bandpass',2500,.015,v*.25,A.m)}
function holdPad(g,label,step,dn,up){const b=document.createElement('button');b.className='pad';b.innerHTML=label+'<span> (hold)</span>';g.appendChild(b);let P=null;
 const U=()=>{if(!P)return;P.on=0;clearInterval(P.iv);P=null;b.classList.remove('on');up&&up()};
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(P)return;ensure();b.classList.add('on');P={on:1,t:align(sdur()),i:0};dn&&dn();P.iv=setInterval(()=>{if(!P||!P.on)return;const sd=sdur();while(P.t<ctx.currentTime+.12){step(P.t+(P.i%2?G.swing*sd:0),P.i,sd);P.t+=sd;P.i++}},25)});
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,U));return b}
