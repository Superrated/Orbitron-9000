
/* ---- v0.22: Flight uses the full screen width on large screens (not phones). Only while Flight is open: the page widens and the deck becomes
   risers | breakdowns side by side, thrusters | planet mutes side by side, low-pass | LEAD + BASS side by side. Phones and tablets in portrait are unchanged.
   v0.84: the six faders share one row in three equal panels — FILTER + THIN | LEAD + BASS | TENSION + PULSE (the filter panel also carries
   .mxp, so the LEAD rule used to stack it underneath LEAD + BASS and hide it). ---- */
{const st=document.createElement('style');st.textContent=`@media (min-width:900px){
 body.flw{max-width:none!important;padding-left:20px!important;padding-right:20px!important}
 body.flw #t-perf{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:8px!important;align-items:stretch}
 body.flw #t-perf>.flw-s1{grid-column:1/4;grid-row:1}
 body.flw #t-perf>.flw-s2{grid-column:4/7;grid-row:1}
 body.flw #t-perf>.rz:not(.bdz){grid-row:2}
 body.flw #t-perf>.rz.bdz{grid-row:2}
 body.flw #t-perf>.flw-thr{grid-column:1/4;grid-row:3}
 body.flw #t-perf>.flw-mut{grid-column:4/7;grid-row:3}
 body.flw #t-perf>.mxp{grid-column:3/5;grid-row:4}
 body.flw #t-perf>.mxp.lpf{grid-column:1/3;grid-row:4}
 body.flw #t-perf>.flw-x{display:none!important}
 body.flw #t-perf>.flw-mut{display:flex;flex-direction:column}
 body.flw #t-perf>.flw-mut>:last-child{flex:1;align-content:stretch}
 body.flw #t-perf>.flw-mut>:last-child{grid-auto-rows:1fr}
 body.flw #t-perf>.flw-mut>:last-child>button{height:auto!important;min-height:44px;align-self:stretch;font-size:14px}
 body.flw #t-perf>.rz>div{height:clamp(90px,calc(100vh - 770px),200px)!important}
}`;document.head.appendChild(st);
 const tag=()=>{const T=document.getElementById('t-perf');if(!T)return;[...T.querySelectorAll(':scope>.sec')].forEach((c,i)=>{c.classList.toggle('flw-s1',i===0);c.classList.toggle('flw-s2',i===1)});[...T.children].forEach(c=>{if(!c.classList.contains('panel')||c.classList.contains('rz')||c.classList.contains('lpf')||c.classList.contains('mxp'))return;
   const tx=(c.textContent||'').toUpperCase();c.classList.toggle('flw-thr',/THRUSTERS/.test(tx));c.classList.toggle('flw-mut',/PLANET MUTES/.test(tx));c.classList.toggle('flw-x',!c.offsetHeight&&!tx.trim())})};
 const chk=()=>{const T=document.getElementById('t-perf');const on=!!T&&!T.hidden;if(on)tag();document.body.classList.toggle('flw',on)};
 const T=document.getElementById('t-perf');if(T)new MutationObserver(chk).observe(T,{attributes:true,attributeFilter:['hidden']});
 chk();UI.on(()=>{try{chk()}catch(e){}})}
