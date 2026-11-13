/* ---- v123: Ride push is also armable like the drop hits — "Ride in ○ arm" switches the offbeat ride on exactly at the next riser/breakdown release ---- */
{const g=document.querySelector('#t-perf .arm');if(g&&window.dropAll){let arm=0;const b=document.createElement('button');b.className='pad';b.style.setProperty('--col','#ffd36b');
 const run=()=>!!(window.ridePush&&window.ridePush.is()),lab=()=>{const r=run()&&!arm;b.innerHTML='Ride in<br>'+(arm?'▲ ARMED':r?'● ON · tap off':'○ arm');b.classList.toggle('on',!!arm||r)};lab();b.onclick=()=>{ensure();if(!arm&&run()){window.ridePush.off()}else arm=!arm;lab()};g.appendChild(b);UI.on(lab);
 const _da=window.dropAll;window.dropAll=function(){const r=_da.apply(this,arguments);if(arm&&window.ridePush){arm=0;lab();window.ridePush.on(window.DROPW)}return r};
 const st=document.createElement('style');st.textContent='body #t-perf .arm{grid-template-columns:repeat(4,minmax(0,1fr))!important}';document.head.appendChild(st)}}

