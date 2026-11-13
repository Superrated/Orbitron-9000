/* ---- v0.4: the re-roll buttons (New lead line, New bassline, Chords, Whole part, Random patch) match the rest of the UI: cut corner,
   dark panel, green edge, and a small line-drawn die in the accent colour instead of the colour emoji. ---- */
{const st=document.createElement('style');st.textContent=`
.pdr,.bassroll:not(:empty),button.dice{border-radius:0!important;background:#0f2418!important;border:1px solid rgba(0,255,156,.32)!important;color:var(--acc,#ffe44d)!important;
 clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px));font-family:inherit;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
 display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:44px}
.pdu{border-radius:0!important;background:#0f2418!important;min-height:44px;clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px))}
.pdr:active,.bassroll:active,button.dice:active{background:rgba(255,228,77,.16)!important}
.pdr::before,.bassroll:not(:empty)::before,button.dice::before{content:'';width:16px;height:16px;flex:none;background:currentColor;
 -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='1.5' y='1.5' width='13' height='13' rx='2.5' fill='none' stroke='black' stroke-width='1.6'/%3E%3Ccircle cx='5' cy='5' r='1.3'/%3E%3Ccircle cx='11' cy='11' r='1.3'/%3E%3Ccircle cx='8' cy='8' r='1.3'/%3E%3Ccircle cx='11' cy='5' r='1.3'/%3E%3Ccircle cx='5' cy='11' r='1.3'/%3E%3C/svg%3E") center/contain no-repeat;
 mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='1.5' y='1.5' width='13' height='13' rx='2.5' fill='none' stroke='black' stroke-width='1.6'/%3E%3Ccircle cx='5' cy='5' r='1.3'/%3E%3Ccircle cx='11' cy='11' r='1.3'/%3E%3Ccircle cx='8' cy='8' r='1.3'/%3E%3Ccircle cx='11' cy='5' r='1.3'/%3E%3Ccircle cx='5' cy='11' r='1.3'/%3E%3C/svg%3E") center/contain no-repeat}`;document.head.appendChild(st)}
