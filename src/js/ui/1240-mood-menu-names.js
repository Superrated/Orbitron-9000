
/* v172: mood menu shows the display names */
{const lab=()=>{const s=document.getElementById('mood');if(!s)return;[...s.options].forEach(o=>{if(o.value!=='Auto'&&MOODNAME[o.value]&&o.textContent!==MOODNAME[o.value])o.textContent=MOODNAME[o.value]})};lab();UI.on(lab)}
