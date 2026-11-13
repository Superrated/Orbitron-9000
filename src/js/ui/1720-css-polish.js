
/* ---- v0.24: professional polish (CSS only — no layout or behaviour changes). Same green / yellow identity, calmer and more consistent:
   steady numbers, softer borders and glows, one corner radius, clear press / focus states, refined sliders and menus. ---- */
{const st=document.createElement('style');st.textContent=`
html{-webkit-tap-highlight-color:transparent;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}
body b,body .spv,#bv,.met,.kinfo{font-variant-numeric:tabular-nums}
.panel{border-color:rgba(0,255,156,.16)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 6px 18px rgba(0,0,0,.28)!important;background-image:linear-gradient(180deg,rgba(255,255,255,.018),rgba(255,255,255,0) 60%)}
.panel>h2,.card .hd span,.pph{letter-spacing:.14em!important;font-weight:700!important}
.panel>h2{opacity:.92}
button,select,.chip,.pad{transition:background-color .12s ease,border-color .12s ease,box-shadow .12s ease,transform .06s ease,filter .12s ease}
button:active,.pad:active,.chip:active{transform:scale(.97)}
button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--acc,#ffe600)!important;outline-offset:2px}
button:not(.on):not(#play):not(.pad),select{border-color:rgba(0,255,156,.32)}
@media (hover:hover){button:hover,select:hover{filter:brightness(1.12)}}
select{background-image:linear-gradient(45deg,transparent 50%,rgba(0,255,156,.8) 50%),linear-gradient(135deg,rgba(0,255,156,.8) 50%,transparent 50%)!important;background-position:calc(100% - 15px) 50%,calc(100% - 10px) 50%!important;background-size:5px 5px,5px 5px!important;background-repeat:no-repeat!important;padding-right:24px!important;-webkit-appearance:none;appearance:none}
input[type=range]::-webkit-slider-runnable-track{border-radius:3px}
input[type=range]::-webkit-slider-thumb{border-radius:3px!important;box-shadow:0 0 0 1px rgba(0,0,0,.35),0 2px 6px rgba(0,0,0,.45),0 0 10px rgba(255,230,0,.18)}
input[type=range]::-moz-range-thumb{border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,.45)}
.pad.on,button.on{box-shadow:0 0 0 1px rgba(255,255,255,.08),0 0 14px rgba(0,255,156,.16)!important}
.gnote,.mcap,.snote{color:var(--muted)}
::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-thumb{background:rgba(0,255,156,.22);border-radius:4px}::-webkit-scrollbar-track{background:transparent}
.ticker{border-top:1px solid rgba(0,255,156,.14)}`;document.head.appendChild(st)}
