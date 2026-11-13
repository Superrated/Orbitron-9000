
/* ---- v0.24: IN-TIME LAUNCH — while playing, Launch and Random warp wait for the next downbeat (the button shows "next bar"),
   then the new groove starts exactly on beat 1. Stopped: instant, as before. ---- */
{let pend=null;
 const isL=b=>b&&b.closest&&b.closest('#gbox')&&/launch|random warp/i.test(b.textContent||'');
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!isL(b)||b.__orbGo||!playing||!ctx)return;e.stopImmediatePropagation();e.preventDefault();
  if(pend)return;const lab=b.innerHTML;b.innerHTML='⏳ next bar';b.classList.add('wait');
  const go=()=>{clearInterval(pend.iv);pend=null;window.__inTime=1;b.__orbGo=1;try{b.innerHTML=lab;b.click()}finally{b.__orbGo=0;window.__inTime=0;b.classList.remove('wait')}};
  pend={iv:setInterval(()=>{if(!playing){clearInterval(pend.iv);pend=null;b.innerHTML=lab;b.classList.remove('wait');return}if(((tk%16)+16)%16===0)go()},4)}},true)}
