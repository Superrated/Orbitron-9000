
/* ---- v0.5 perf: the Euclid rings only redraw while the Drums or Synths page is open (they can't be seen elsewhere);
   when you open the page they are drawn fresh. ---- */
{let RV=true;const chk=()=>{const d=document.querySelector('#t-drums'),y=document.querySelector('#t-synth');const was=RV;RV=!!((d&&!d.hidden)||(y&&!y.hidden));if(RV&&!was)TR.forEach(T=>{try{draw(T,-1)}catch(e){}})};
 UI.on(chk);document.addEventListener('click',()=>setTimeout(chk,30),true);
 const _dr=draw;draw=function(T,s){if(!RV&&s>=0&&playing)return;return _dr.apply(this,arguments)}}
