
/* ---- v0.23: Thrusters and mutes no longer fight. Your mutes (Planet mutes, Mute buttons, Launch) and the temporary mutes of held Thrusters
   are kept apart: a track sounds only if you have not muted it AND no held Thruster is forcing it off (hold-to-solo sits on top).
   · tap a mute while a Thruster holds that track: your mute changes underneath and is there when you let go
   · two Thrusters on the same track: the track comes back when the last one is released
   · Launch while holding: the new groove's mutes win; nothing stale is put back ---- */
{const U=[],F=[];let SOLO=null,CUR=null,PH='';
 const eff=k=>SOLO!=null?k!==SOLO:(U[k]||F[k].size>0);
 const install=k=>{const T=TR[k],d=Object.getOwnPropertyDescriptor(T,'m');if(d&&d.get)return;U[k]=!!T.m;F[k]=F[k]||new Set();
  Object.defineProperty(T,'m',{enumerable:true,configurable:true,get:()=>eff(k),
   set:v=>{if(CUR){if(PH==='down'){if(v)F[k].add(CUR);return}F[k].delete(CUR);return}U[k]=!!v}})};
 const all=()=>TR.forEach((T,k)=>install(k));all();UI.on(all);
 // which Thruster is acting: its own press / release handlers run inside these events
 const own=e=>{const t=e.target&&e.target.closest&&e.target.closest('#t-perf button,#t-perf .pad');return t&&!t.closest('#pads')?t:null};
 const clr=()=>{CUR=null;PH=''};
 const hook=(ev,ph)=>{window.addEventListener(ev,e=>{const o=own(e);if(!o){clr();return}CUR=o;PH=ph;if(ph==='down')o.__held=1;setTimeout(clr,0)},true);window.addEventListener(ev,clr,false)};
 hook('pointerdown','down');['pointerup','pointerleave','pointercancel','lostpointercapture'].forEach(n=>hook(n,'up'));
 // safety net: a Thruster that is no longer lit cannot keep a track muted
 setInterval(()=>{F.forEach(set=>set.forEach(o=>{if(!o.isConnected||(o.__held&&!o.classList.contains('on')&&!o.matches(':active'))){set.delete(o)}}))},500);
 // tapping a Planet mute under a held Thruster changes your own mute underneath
 pads.forEach((p,k)=>p.addEventListener('click',e=>{if(SOLO==null&&F[k]&&F[k].size>0){U[k]=!U[k];e.stopImmediatePropagation();e.preventDefault();try{if(typeof say==='function')say((U[k]?'MUTED':'UNMUTED')+' · AFTER THE THRUSTER')}catch(_){}}},true));
 const _g=generate;generate=function(){F.forEach(s=>s.clear());SOLO=null;clr();return _g.apply(this,arguments)};
 window.TMUTE={solo:k=>{SOLO=k},user:k=>U[k],forced:k=>F[k]?F[k].size:0,clear:()=>{F.forEach(s=>s.clear());SOLO=null}}}
