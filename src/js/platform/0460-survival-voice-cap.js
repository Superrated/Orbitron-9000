/* ---- v51: Survival — hard cap of 64 sounding voices + lightest settings ---- */
{const CAP=64,LOW=new Set([1,3,8,9]);let q0='Eco';try{q0=localStorage.getItem('orb-q')||'Eco'}catch(e){}QOS.eco2=q0==='Survival';
 QOS.voices=()=>{if(!ctx)return 0;const now=ctx.currentTime;let n=0;for(const s of QOS.src)if(s.__e!==Infinity&&s.__e>now&&s.__s<=now+.01)n++;return n}; /* v0.23: notes scheduled ahead are not counted */
 const room=(k,need)=>{const v=QOS.voices();if(v+need<=CAP)return true;if(LOW.has(k))return false;steal(v+need-CAP);return QOS.voices()+need<=CAP+8};
 const NEED={0:1,1:2,2:1,3:1,4:4,6:4,7:1,8:6,9:3};
 const _f51=fire;fire=function(k,w){if(QOS.eco2&&!room(k,NEED[k]||2))return;_f51(k,w)};
 const _p51=pad;pad=function(t,w,dur){if(QOS.eco2){const P=TR[5].p,o=P.size;P.size=Math.min(o,3);room(5,10);try{_p51(t,w,dur)}finally{P.size=o}return}_p51(t,w,dur)};
 const _g51=grains;grains=function(w,sd){if(QOS.eco2)return;_g51(w,sd)};
 const _fx51=applyFX;applyFX=function(){_fx51();if(QOS.eco2&&SHM.inp)SHM.inp.gain.value=0};
 // pick up a switch to/from Survival without reload
 document.addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('#t-mix')&&['Auto','Eco','Survival','Hi-fi'].includes(e.target.value)){QOS.eco2=e.target.value==='Survival';if(QOS.eco2&&SHM.inp)SHM.inp.gain.value=0}})}
