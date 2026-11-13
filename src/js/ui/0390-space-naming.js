/* ---- v37: space-themed naming across the UI (clear names kept alongside) ---- */
{const TABN=['Launch','Drums','Synths','Mix','LFO','Star map','Flight'];[...$('#tabs').children].forEach((b,i)=>{if(TABN[i])b.textContent=TABN[i]});
 const H2={'Generate a full groove':'Mission · launch a full groove','Key and scale':'Navigation · key and scale','Mix bus · sidechain · rumble':'Mission control · mix bus · sidechain · rumble',
  'Rhythmic gate':'Pulsar gate · synth bus (pad, lead, stab)','Pitch · lead, perc, pad':'Altitude · lead, perc, pad','Fills · punch-ins':'Thrusters · fills & punch-ins','Live mutes':'Planet mutes',
  'Riser build → drop':'Ascent · riser','Noise riser':'Solar storm · noise','Shepard climb':'Escape velocity','Song mode':'Song mode','LFO 1':'LFO 1 · orbit A','LFO 2':'LFO 2 · orbit B'};
 const ren=()=>document.querySelectorAll('h2').forEach(e=>{const t=e.textContent;for(const k in H2)if(t.startsWith(k)&&!t.startsWith(H2[k])){e.textContent=H2[k];break}});ren();
 gb.innerHTML='🚀 Launch';{const s2=document.createElement('style');s2.textContent='#t-perf>.rz h2{min-height:2.7em;font-size:10.5px;line-height:1.3}';document.head.appendChild(s2)}const rb=$('#rnd');if(rb)rb.textContent='Random warp';
 const sub=document.createElement('div');sub.textContent='orbital groove station';sub.style.cssText='font:600 9px ui-monospace,monospace;letter-spacing:.32em;color:#7fffc4;opacity:.55;text-transform:uppercase;margin:-4px 0 6px 32px';document.querySelector('h1').after(sub);
 QOS.nm=['NOMINAL','LOAD','SAVING','OVERLOAD'];const _qb=QB.textContent;
 setInterval(()=>{const p=$('#play');if(p&&p.firstChild&&p.firstChild.nodeType===3){const t=p.firstChild.textContent;if(t.includes('Play'))p.firstChild.textContent='▶ Ignite';else if(t.includes('Stop'))p.firstChild.textContent='■ Land'}if(QB.textContent.startsWith('CPU'))QB.textContent=QB.textContent.replace('CPU','CORE')},120)}

{const s=document.createElement('style');s.textContent='[data-mode=pat] .grid>[data-g=snd]{display:none!important}';document.head.appendChild(s)}
