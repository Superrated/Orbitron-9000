/* v4: Generate (musical pattern builder), chord-tone lock, swing, smoother master */
TR[4].p.lock=.6;TR[4].x.push(["Chord lock","lock",0,1,.01]);Object.assign(TR[4].p,{res:3.5,envA:2400,det:7,fold:0,fenv:.4,fsym:0,glide:.3,gt:70,seed:1});TR[4].x.push(["Fold","fold",0,1,.01],["Fold env","fenv",0,1,.01],["Fold bias","fsym",0,1,.01],["Glide chance","glide",0,1,.01],["Glide time ms","gt",10,300,5]);
const _ln=leadNote;leadNote=function(p){let d=_ln(p);const lr=(p.mode==='Marbles'||p.mode==='Interval')?(x=>x-Math.floor(x))(Math.sin((bp+1)*91.7+(p.seed||0)*7.31)*43758.5453):R();if(lr<p.lock){const n=SC[G.scale].length,ct=cur.n.map(x=>((x%n)+n)%n);let b=d,bd=99;for(let c=-1;c<=3;c++)ct.forEach(t=>{const q=t+n*c,dd=Math.abs(q-d);if(dd<bd){bd=dd;b=q}});d=Math.max(0,Math.min(b,p.range*n-1))}return d};
const gb=document.createElement("button");gb.textContent="✨ Generate";gb.style.cssText="background:#b583ff;color:#14101c;font-weight:700";/* v5: dub stab track, palette, one-track-at-a-time view, compact perform tab */
TR.push({n:'Stab',sn:'Dub stab',c:'#9dff00', /* v0.4: one name everywhere; sn keeps the old rhythm seed so stab patterns stay the same */st:16,h:3,r:2,lv:.35,p:{dec:.18,cut:900,envA:1800,det:12,oct:3,size:3,ds:.7,rs:.35},x:[['Decay','dec',.05,.8,.01],['Cutoff','cut',200,3000,10],['Env amount','envA',0,4000,50],['Detune ¢','det',0,30,1],['Octave','oct',2,5,1],['Chord notes','size',2,4,1],['Delay send','ds',0,1,.01],['Reverb send','rs',0,1,.01]]});TR[8].pt=pat(TR[8]);
function stab(w){OCT=G.oct||0;const T=TR[8],p=T.p,e=w+p.dec+.4,q=ctx.createBiquadFilter(),g=ctx.createGain();q.type='lowpass';q.Q.value=2;{const sm=Math.pow(2,2*mv("Stab cutoff",w));q.frequency.setValueAtTime(p.cut*sm+p.envA,w);q.frequency.exponentialRampToValueAtTime(Math.max(30,p.cut*sm),w+p.dec)}env(g,w,T.lv*.15,p.dec+.05,.004);cur.n.slice(0,Math.round(p.size)).forEach(d=>[-1,1].forEach(c=>{const o=osc('sawtooth',d2f(d,p.oct),w,e);o.detune.value=c*p.det;o.connect(q)}));q.connect(g);send(g,A.dk,p.ds,p.rs)}
const COL=['#ffe600','#7dffb0','#34f58a','#00d9a3','#fff27a','#22c7c7','#f2b705','#b8ff3d','#9dff00'];TR.forEach((T,i)=>T.c=COL[i]);
{const b=document.createElement('button');b.className='pad';b.textContent='Stab';b.onclick=()=>TR[8].m=!TR[8].m;$('#pads').appendChild(b);pads.push(b)}
pads.forEach((b,i)=>b.style.setProperty('--col',COL[i]));
$('#lg').innerHTML=TR.map(T=>'<span><i style="background:'+T.c+'"></i>'+T.n.split(' ')[0]+'</span>').join('');
const selT={'#t-drums':0,'#t-synth':3};
/* tracks: every control is tagged PATTERN (what plays) or SOUND (how it sounds); a switch shows one set at a time */
const PATL=['Steps','Chords','Hits','Rotate','Tension','Break feel','Bassline','Lock','Phrase','Gate length','Slide','Ghost notes','Accent','Ghosts','Variation','Arp mode','Range oct','Spread','Bias','D\u00e9j\u00e0 vu','Loop len','Chord lock','Reseed','Pad style','Chord length (bars)','Chord notes','Open voicing','New progression','Fifth prob','Octave jump','Fancy notes','Glide chance','Glide time ms','Accent chance','Follow chords','Hold (steps)'];
let tmode='pat';
const MCAP={pat:'PATTERN \u00b7 what plays: steps, hits, rotation, melody and harmony rules',snd:'SOUND \u00b7 how it sounds: level, tone, envelopes, effect sends'};
function tagCtl(){document.querySelectorAll('#t-drums .grid>*,#t-synth .grid>*').forEach(el=>{const sp=el.querySelector('span>b')?el.querySelector('span'):null,lab=(sp?sp.firstChild.textContent:el.firstChild&&el.firstChild.nodeType===3?el.firstChild.textContent:el.textContent).trim();el.dataset.g=el.dataset.keep||(PATL.includes(lab)?'pat':'snd')})}
function applyMode(){['#t-drums','#t-synth'].forEach(id=>{const c=$(id);c.dataset.mode=tmode;c.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.m===tmode));const cap=c.querySelector('.mcap');if(cap)cap.textContent=MCAP[tmode]})}
function chips(){[['#t-drums',[0,1,2,3,7]],['#t-synth',[4,5,6,8,9]]].forEach(([id,ks])=>{const c=$(id),bar=document.createElement('div'),seg=document.createElement('div'),cap=document.createElement('div');bar.className='chips';seg.className='seg';cap.className='mcap';if(!ks.includes(selT[id]))selT[id]=ks[0];
 const show=()=>{c.querySelectorAll('.card').forEach(x=>x.hidden=+x.dataset.k!==selT[id]);bar.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',+b.dataset.k===selT[id]))};
 ks.forEach(k=>{const b=document.createElement('button');b.className='chip';b.dataset.k=k;b.textContent=TR[k].n.split(' ')[0];b.style.setProperty('--col',TR[k].c);b.onclick=()=>{selT[id]=k;show()};bar.appendChild(b)});
 [['pat','PATTERN'],['snd','SOUND']].forEach(([m,l])=>{const b=document.createElement('button');b.dataset.m=m;b.textContent=l;b.onclick=()=>{tmode=m;applyMode()};seg.appendChild(b)});
 c.prepend(cap);c.prepend(seg);c.prepend(bar);show()});tagCtl();applyMode()}
BUILD.sync.push(function(){chips()});
UI.on(()=>{const t=NN[G.root]+' '+G.scale+' \u00b7 '+MN(curMood),k=$('#kinfo'),s=$('#gsum');if(k)k.textContent=t+' \u00b7 '+G.bpm;if(s)s.textContent='Now: '+t+(typeof MP!=='undefined'&&MP[curMood]?' ('+MP[curMood].sty+')':'')+' \u00b7 '+G.bpm+' BPM \u00b7 lead: '+(TR[4].p.patch||'custom')+' \u00b7 pad: '+TR[5].p.patch+(G.dfeel?' \u00b7 drums: '+G.dfeel:'')+(G.hfam?' \u00b7 harmony: '+G.hfam:'')});
/* perf 4: chip mute state is kept in sync on change by the v0.25 mute sync; this 300 ms poll is no longer needed */
[rp,Q3].forEach(p=>p.classList.add('rz'));
const QD=document.createElement('div');QD.className='panel';QD.innerHTML='<h2>Dub stabs</h2><div class="pads"></div>';
{const g=QD.children[1],sb={on:0,t:0,iv:0},mk=(l,dn,up)=>{const b=document.createElement('button');b.className='pad';b.innerHTML=l;g.appendChild(b);if(!up){b.onclick=dn;return}let on=0;const U=()=>{if(!on)return;on=0;b.classList.remove('on');up()};b.addEventListener('pointerdown',e=>{e.preventDefault();if(on)return;on=1;b.classList.add('on');dn()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,U))};
 mk('Stab',()=>{ensure();stab(align(sdur()))});
 mk('Stab 8ths<span> (hold)</span>',()=>{ensure();sb.on=1;sb.t=align(2*sdur());sb.iv=setInterval(()=>{if(!sb.on)return;while(sb.t<ctx.currentTime+.12){stab(sb.t);sb.t+=2*sdur()}},25)},()=>{sb.on=0;clearInterval(sb.iv)});
 mk('Echo throw<span> (hold)</span>',()=>{ensure();gs(A.dF,.88);gs(A.dO,.8)},()=>{gs(A.dF,G.fb);gs(A.dO,G.dly)})}
QP.after(QD);
{const sb=QS.children[1];sb.removeAttribute('style');sb.style.setProperty('--col','#e8a0ff');sb.innerHTML='Snare roll<span> (hold)</span>';QD.children[1].prepend(sb);QD.children[0].textContent='Fills · stabs';QS.remove()}
/* FX morph: XY pad. X = low-pass <-> high-pass filter, Y = delay + reverb + dub wobble. Slow LFOs keep it evolving while held; release glides back. */
const QM=document.createElement('div');QM.className='panel';
QM.innerHTML=`<h2>FX morph · filter × delay/reverb</h2><div style='position:relative;height:120px;background:var(--c1);overflow:hidden;touch-action:none;user-select:none;border:1px solid rgba(0,255,156,.3)'><div style='position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 10px;font-size:10px;color:var(--muted);pointer-events:none'><span>◀ LOW-PASS</span><span>HIGH-PASS ▶</span></div><div style='position:absolute;left:50%;top:6px;transform:translateX(-50%);font-size:10px;color:var(--muted);pointer-events:none;white-space:nowrap'>▲ MORE DELAY + REVERB</div><div style='position:absolute;width:26px;height:26px;margin:-13px;border-radius:50%;border:2px solid var(--acc);box-shadow:0 0 14px var(--acc);display:none;pointer-events:none'></div></div>`;
const mz=QM.children[1],md=mz.lastChild,mr={on:0,x:.5,y:0,t0:0,iv:0};
function mrUpd(){if(!mr.on)return;const t=ctx.currentTime,k=t-mr.t0,x=Math.max(0,Math.min(1,mr.x+.05*Math.sin(6.283*.13*k)+.03*Math.sin(6.283*.31*k))),y=mr.y*(.85+.15*Math.sin(6.283*.21*k)),lo=x<.45?(.45-x)/.45:0,hi=x>.55?(x-.55)/.45:0;
 A.lp.frequency.setTargetAtTime(20000*Math.pow(300/20000,lo),t,.03);A.lp.Q.setTargetAtTime(.7+4*lo*lo,t,.03);A.hp.frequency.setTargetAtTime(10*Math.pow(150,hi),t,.03);
 gs(A.dO,G.dly+(.8-G.dly)*y);gs(A.dF,G.fb+(.86-G.fb)*y);gs(A.rO,G.rev+(.9-G.rev)*y);gs(A.sh,G.shim+(1-G.shim)*y*.5);mr.lg.gain.setTargetAtTime(.012*y,t,.05)}
function mrPos(e){const r=mz.getBoundingClientRect();mr.x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));mr.y=Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height));md.style.left=mr.x*100+'%';md.style.top=(1-mr.y)*100+'%'}
mz.addEventListener('pointerdown',e=>{e.preventDefault();ensure();
 mz.setPointerCapture(e.pointerId);mr.on=1;mr.t0=ctx.currentTime;mr.lfo=mkOsc();mr.lfo.frequency.value=.35;mr.lg=ctx.createGain();mr.lg.gain.value=0;mr.lfo.connect(mr.lg);mr.lg.connect(A.dl.delayTime);mr.lfo.start();md.style.display='block';mrPos(e);mr.iv=setInterval(mrUpd,40);mrUpd()});
mz.addEventListener('pointermove',e=>{if(mr.on)mrPos(e)});
const mrEnd=()=>{if(!mr.on)return;mr.on=0;clearInterval(mr.iv);const t=ctx.currentTime;md.style.display='none';A.lp.frequency.setTargetAtTime(20000,t,.25);A.lp.Q.setTargetAtTime(.7,t,.2);A.hp.frequency.setTargetAtTime(10,t,.25);
 A.dO.gain.setTargetAtTime(G.dly,t,.5);A.dF.gain.setTargetAtTime(G.fb,t,.5);A.rO.gain.setTargetAtTime(G.rev,t,.5);A.sh.gain.setTargetAtTime(G.shim,t,.5);mr.lg.gain.setTargetAtTime(0,t,.2);mr.lfo.stop(t+1.5)};
['pointerup','pointercancel'].forEach(ev=>mz.addEventListener(ev,mrEnd));
Q3.after(QM);
