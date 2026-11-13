/* ---- v147: LFO tab fits a phone screen — three compact LFO panels, no scrolling ---- */
{const mq=matchMedia('(max-width:640px)');const fix=()=>{document.querySelectorAll('#t-lfo canvas').forEach(c=>{const h=mq.matches?64:110;if(c.height!==h)c.height=h})};fix();try{mq.addEventListener('change',fix)}catch(e){}
 const st=document.createElement('style');st.textContent=`@media (max-width:640px){
#t-lfo .panel{padding:6px 10px 8px!important;margin:0 0 6px!important;position:relative}
#t-lfo .panel h2{position:absolute;left:16px;top:8px;margin:0!important;font-size:10px!important;letter-spacing:.12em;z-index:1;pointer-events:none;background:rgba(4,14,10,.82);padding:1px 6px;border-radius:4px}
#t-lfo canvas{margin:0 0 4px!important}
#t-lfo .top{display:grid!important;grid-template-columns:1.35fr 1fr;gap:4px!important;margin:0 0 4px!important}
#t-lfo .top select{height:30px!important;min-height:30px!important;font-size:11px!important;padding:0 6px!important;width:100%!important;margin:0!important}
#t-lfo .top select[hidden]{display:none!important}
#t-lfo .grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(0,1fr))!important;gap:2px 8px!important;margin:0!important}
#t-lfo .grid>[hidden]{display:none!important}
#t-lfo .grid>div:not(.sl){display:contents}
#t-lfo .sl{margin:0!important;padding:0!important;min-height:0!important}
#t-lfo .sl>span{font-size:10px!important;margin:0 0 2px!important;line-height:1.2}
#t-lfo .sr{gap:4px!important}
#t-lfo .sr button{min-height:28px!important;height:28px!important;width:28px!important;min-width:28px!important;padding:0!important;font-size:14px!important}
#t-lfo .sr input{height:28px!important}
#t-lfo .gnote{display:none!important}}`;document.head.appendChild(st)}

