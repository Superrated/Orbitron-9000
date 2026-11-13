/* ---- v131: compact top box on phones; the room goes to the riser/breakdown pads on Flight ---- */
{const st=document.createElement('style');st.textContent=`@media (max-width:640px){
body .panel.top{padding:5px 10px 6px!important;margin-bottom:6px!important;row-gap:4px!important}
body .panel.top #play{min-height:40px!important;height:40px!important}
body .panel.top .bpmlock{height:22px!important;min-height:22px!important;width:auto!important;padding:0 6px!important;margin:0 0 0 4px!important;line-height:1!important}
body .panel.top .sl{gap:2px!important}
body .panel.top .sl .sr button.st,body .panel.top .sl .sr input{height:28px!important;min-height:28px!important}
body .panel.top .stg{height:22px!important;min-height:22px!important}}
@media (max-width:640px){body #t-perf>.rz>div{height:clamp(34px,calc((100dvh - 690px)/2),130px)!important}}
@media (max-width:640px) and (max-height:780px){body #t-perf>.rz>div{height:clamp(34px,calc((100dvh - 654px)/2),130px)!important}}`;document.head.appendChild(st)}

