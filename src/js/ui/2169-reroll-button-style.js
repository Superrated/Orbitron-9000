/* ---- v0.4: the re-roll buttons (New line, New chords, New part, New patch, Reseed) match the rest of the UI: cut corner,
   dark panel, green edge, and a small line-drawn die in the accent colour instead of the colour emoji.
   v0.5: one compact look for every dice and reseed button — same height (34 px), same small caps text on one line, same ↶ and
   "from" menu — and each dice row (roll · undo · from) sits on a single line, so they take half the room they used to. ---- */
{const die="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='1.5' y='1.5' width='13' height='13' rx='2.5' fill='none' stroke='black' stroke-width='1.6'/%3E%3Ccircle cx='5' cy='5' r='1.3'/%3E%3Ccircle cx='11' cy='11' r='1.3'/%3E%3Ccircle cx='8' cy='8' r='1.3'/%3E%3Ccircle cx='11' cy='5' r='1.3'/%3E%3Ccircle cx='5' cy='11' r='1.3'/%3E%3C/svg%3E\") center/contain no-repeat",
  cut='polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))';
 const st=document.createElement('style');st.textContent=`
.pdr,button.bassroll,button.dice{border-radius:0!important;background:#0f2418!important;border:1px solid rgba(0,255,156,.32)!important;color:var(--acc,#ffe44d)!important;
 clip-path:${cut};font-family:inherit;font-size:11px!important;font-weight:700;letter-spacing:.1em!important;text-transform:uppercase;white-space:nowrap;
 display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:34px!important;height:34px;padding:0 12px!important;line-height:1;cursor:pointer}
.pdu{border-radius:0!important;background:#0f2418!important;border:1px solid rgba(0,255,156,.32)!important;color:var(--acc,#ffe44d)!important;
 clip-path:${cut};width:34px!important;min-height:34px!important;height:34px;padding:0!important;font-size:15px!important;flex:none!important;cursor:pointer}
.pdu:disabled{opacity:.3;cursor:default}
.pdr:active,button.bassroll:active,button.dice:active,.pdu:active{background:rgba(255,228,77,.16)!important}
.pdr::before,button.bassroll::before,button.dice::before{content:'';width:13px;height:13px;flex:none;background:currentColor;-webkit-mask:${die};mask:${die}}
/* one row: roll button(s) · undo · from menu */
.pdice{grid-column:1/-1;display:flex;flex-wrap:nowrap!important;gap:6px!important;align-items:center!important}
.pdice .pdr{flex:1 1 auto!important;min-width:0}
.pdice:has(.pds) .pdr{flex:0 0 auto!important}
.pdice .pds{flex:1 1 0!important;min-width:0;display:flex;align-items:center;gap:6px;font-size:10px!important;letter-spacing:.08em;text-transform:lowercase;opacity:.85}
.pdice .pds select{flex:1;min-width:0;min-height:34px!important;height:34px;padding-top:0;padding-bottom:0;font-size:12px}
/* Reseed: a small button, not a full-width bar */
button.dice.reseed{justify-self:start;width:auto}`;document.head.appendChild(st)}
