
/* ---- v156: robust saving outside Claude — phones use the share sheet (save to Files / Drive / …), other browsers a normal download;
   inside a sandboxed preview that blocks downloads the app says so instead of silently doing nothing ---- */
window.orbSave=async function(name,blob){
 const mob=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform));
 try{if(mob&&navigator.canShare){const f=new File([blob],name,{type:blob.type||'application/octet-stream'});if(navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return 'shared'}}}
 catch(e){if(e&&e.name==='AbortError')return 'cancelled'}
 let sandboxed=false;try{sandboxed=window.top!==window&&!(window.claude&&claude.use)}catch(e){sandboxed=true}
 try{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000)}catch(e){return 'blocked'}
 return sandboxed?'maybe-blocked':'downloaded'};

