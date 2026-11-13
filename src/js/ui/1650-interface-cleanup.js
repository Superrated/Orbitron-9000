
/* ---- v0.24: interface cleanup.
   1 nothing clips: key line, sector hint, Mix strip text and values, Riser names wrap or shrink instead of being cut
   2 Flight on a phone: compact header (no title lines, no key line or timer), so the whole performance page fits one screen
   3 Mix → Channels starts with the strips and track levels; Mood finish and Master+ (with its LUFS meter) moved to Bus & FX
   4 help texts fold into a small ⓘ — tap it to read, tap again to fold
   5 Sectors on Launch: saved slots plus one empty slot; "+ more" shows the rest ---- */
{const st=document.createElement('style');st.textContent=`
.panel.top .kinfo{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;max-width:none!important;flex:1 1 110px;line-height:1.15}
#t-mix .spc .spt span{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
#t-mix .spc .spr{display:flex!important;align-items:center;gap:8px}
#t-mix .spc .spr input{flex:1 1 auto;min-width:0;width:auto!important}
#t-mix .spc .spr .spv{flex:0 0 auto;min-width:46px!important}
#t-perf h2{white-space:normal!important;text-overflow:clip!important;line-height:1.1}
#t-perf .panel.rz>h2{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;letter-spacing:.04em!important;line-height:1.1}
.ticker>b{position:relative;z-index:1;background:rgb(2,8,6);padding-right:8px;box-shadow:6px 0 6px rgb(2,8,6)}
@media (max-width:820px){body.flw h1,body.flw h1+div{display:none!important}body.flw .panel.top .kinfo,body.flw .panel.top .met{display:none!important}}
.gnote:not(.gopen),.mcap:not(.gopen){font-size:0!important;line-height:0!important;height:16px;overflow:hidden;cursor:pointer;margin:2px 0!important;padding:0!important;white-space:nowrap}
.gnote:not(.gopen)::before,.mcap:not(.gopen)::before{content:'ⓘ';font-size:13px;line-height:16px;opacity:.65}
.gnote.gopen,.mcap.gopen{cursor:pointer;white-space:normal!important}
.smore{display:block;margin:8px auto 0;padding:6px 14px;font:700 11px ui-monospace,monospace;letter-spacing:.1em;background:none;border:1px dashed currentColor;border-radius:8px;color:var(--acc,#ffe44d);cursor:pointer}`;document.head.appendChild(st);
 document.addEventListener('click',e=>{const n=e.target.closest&&e.target.closest('.gnote,.mcap');if(n)n.classList.toggle('gopen')});
 // 3: master toggles to Bus & FX
 const moveMaster=()=>{const P=document.querySelectorAll('#t-mix>.panel');if(P.length<2)return;const ch=P[0],bus=P[1],h=bus.querySelector('h2');
  ['.finb','.mstx'].forEach(sel=>{const el=ch.querySelector(':scope>'+sel);if(el){(h?h.after(el):bus.prepend(el))}});
  const f=bus.querySelector(':scope>.finb'),m=bus.querySelector(':scope>.mstx');if(f&&m&&f.nextElementSibling!==m)f.after(m)};
 // 5: sector grid
 /* v0.25: all 16 slots always visible again (compact view removed) */
 const sectors=()=>{const g=document.querySelector('.sgrid');if(!g)return;g.querySelectorAll('button.sl.hx').forEach(b=>b.classList.remove('hx'));const mb=g.parentElement.querySelector('.smore');if(mb)mb.remove()};
 const sectorsOld=()=>{let open=false;const g=document.querySelector('.sgrid');if(!g||!g.offsetParent)return;const bs=[...g.querySelectorAll('button.sl')],emp=b=>/\(empty\)/.test(b.title||'');
  const first=bs.find(emp),hidden=bs.filter(b=>emp(b)&&b!==first);bs.forEach(b=>b.classList.toggle('hx',!open&&hidden.includes(b)));
  let mb=g.parentElement.querySelector('.smore');if(!mb){mb=document.createElement('button');mb.type='button';mb.className='smore';mb.onclick=()=>{open=!open;sectors()};g.after(mb)}
  const t=hidden.length?(open?'− fewer':'＋ more ('+hidden.length+' empty)'):'';if(mb.textContent!==t)mb.textContent=t;mb.style.display=t?'':'none'};
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{moveMaster()}catch(e){}return r};
 UI.on(()=>{try{moveMaster();sectors()}catch(e){}});setTimeout(()=>{try{moveMaster();sectors()}catch(e){}},300)}
