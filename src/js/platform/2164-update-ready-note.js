/* ---- quick win 6: a note when a new version has been downloaded. The installed app refreshes its copy in the background; when that copy is
   a newer build than the one running, a small note says so (once). Bump ORB_BUILD with every change. ---- */
window.ORB_BUILD='2026-11-13-v0.75';
{let shown=false;const note=()=>{if(shown)return;shown=true;const d=document.createElement('div');d.setAttribute('role','status');
  d.style.cssText='position:fixed;left:12px;right:12px;bottom:44px;z-index:9999;background:#ffe44d;color:#04100a;font:700 13px ui-monospace,monospace;padding:12px 14px;display:flex;gap:10px;align-items:center;justify-content:space-between;box-shadow:0 4px 18px rgba(0,0,0,.5)';
  d.innerHTML='<span>▲ UPDATE READY · close and reopen Orbitron to use it</span>';const x=document.createElement('button');x.type='button';x.textContent='OK';x.setAttribute('aria-label','Dismiss update note');
  x.style.cssText='min-width:44px;min-height:40px;border:2px solid #04100a;background:transparent;color:#04100a;font:700 13px ui-monospace,monospace';x.onclick=()=>d.remove();d.appendChild(x);document.body.appendChild(d)};
 const check=()=>{try{if(!window.caches||shown)return;caches.match('./index.html',{ignoreSearch:true}).then(r=>r&&r.text()).then(t=>{if(!t)return;const m=t.match(/ORB_BUILD='([^']+)'/);if(m&&m[1]!==window.ORB_BUILD)note()}).catch(()=>{})}catch(e){}};
 if(/^https?:$/.test(location.protocol)){setTimeout(check,15000);setInterval(check,600000);try{navigator.serviceWorker&&navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.t==='orb-update')note()})}catch(e){}}}
