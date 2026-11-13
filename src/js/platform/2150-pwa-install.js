/* PWA: offline + install. An Install button joins the Export · Import · Rec row on the Launch tab, only while Chrome
   offers installation; it disappears once Orbitron is installed (and never shows inside the installed app). */
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){addEventListener('load',()=>{try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}})}
{const st=document.createElement('style');st.textContent='.sio.inst4{grid-template-columns:repeat(4,1fr)!important}.sio button.sinst{border-color:rgba(255,230,0,.6)!important;color:var(--acc,#ffe600)!important;opacity:1!important;padding:0 4px!important;letter-spacing:.03em!important;white-space:nowrap}';document.head.appendChild(st);
 const b=document.createElement('button');b.className='sinst';b.textContent='⤓ Install';b.title='Install Orbitron as an app on this device';let dp=null;
 const inApp=()=>matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
 const show=on=>{const row=document.querySelector('.sio');if(!row){if(on)setTimeout(()=>show(!!dp),500);return}
  if(on&&!b.isConnected)row.appendChild(b);if(!on&&b.isConnected)b.remove();row.classList.toggle('inst4',on)};
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();if(inApp())return;dp=e;show(true)});
 b.addEventListener('click',async()=>{if(!dp)return;const d=dp;try{d.prompt();const r=await d.userChoice;if(r&&r.outcome==='accepted'){dp=null;show(false)}}catch(e){dp=null;show(false)}});

 /* iPhone / iPad: Apple has no install prompt, so the button opens a short how-to instead (hidden once added to the home screen). */
 const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 if(isIOS&&!navigator.standalone&&!inApp()&&/^https?:$/.test(location.protocol)){
  b.title='How to add Orbitron to your home screen';
  b.addEventListener('click',()=>{if(dp)return;let o=document.getElementById('ioshow');if(o){o.remove();return}
   o=document.createElement('div');o.id='ioshow';
   o.style.cssText='position:fixed;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9999;background:#04100a;border:1px solid var(--acc,#ffe600);border-radius:14px;padding:14px 16px;color:#d8fff0;font-size:14px;line-height:1.5;box-shadow:0 0 24px rgba(255,230,0,.25)';
   o.innerHTML='<b style="color:var(--acc,#ffe600);letter-spacing:.06em">ADD TO HOME SCREEN</b><br>1. Tap the <b>Share</b> button (square with an arrow)<br>2. Scroll and tap <b>Add to Home Screen</b><br>3. Tap <b>Add</b><br><span style="opacity:.7;font-size:12px">Tip: switch the ring/silent switch to ring, or there may be no sound. Tap to close.</span>';
   o.addEventListener('click',()=>o.remove());document.body.appendChild(o)});
  show(true)}
 addEventListener('appinstalled',()=>{dp=null;show(false)})}
