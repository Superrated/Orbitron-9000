/* v8: pad can be a one-chord / one-note drone, and chord changes can be much faster (down to 1/8 bar) */
{const be=TR[5].x.find(e=>e[1]==='bars');be[0]='Chord length (bars)';be[2]=.125;be[4]=.125;TR[5].x.find(e=>e[1]==='size')[2]=1}
BUILD.sync.push(function(){const g=TR[5].mb.closest('.card').querySelector('.grid'),l=document.createElement('label');l.className='sl';l.innerHTML='Pad style';const s=document.createElement('select');['Progression','Pedal chords','Chord memory','One chord','Vamp','One note'].forEach(x=>s.add(new Option(x)));s.value=padStyle;
 s.onchange=()=>{padStyle=s.value;G.padAuto=0;G.pedal=padStyle==='Pedal chords';const T=TR[5];if(padStyle==='Progression'||G.pedal||padStyle==='Chord memory'){T.st=4;T.p.size=4;newProg(4);if(padStyle==='Chord memory'&&window.cmPrep)cmPrep()}else{T.st=1;prog=[0];pshape=[pick(MOODS[curMood].sh)];T.p.size=padStyle==='One note'?1:4;if(padStyle==='Vamp')T.p.bars=1}pmean=null;T.pt=pat(T);build()};l.appendChild(s);g.insertBefore(l,g.children[1]);const l2=document.createElement('label');l2.className='sl';l2.innerHTML='Pad sound';const s2=document.createElement('select');[...PADN,'Rotate','Random'].forEach(x=>s2.add(new Option(x,x)));s2.value=TR[5].p.patch;s2.onchange=()=>TR[5].p.patch=s2.value;l2.appendChild(s2);g.insertBefore(l2,g.children[2]);tagCtl();applyMode()});
/* v9: sub drone track, rhythmic gate, chord arp, denser lead, pedal option */
G.pedal=false;
TR.push({n:'Satellite',c:'#7af0ff',st:16,h:2,r:0,lv:.4,m:true,p:{role:'Counter',snd:'Warm saw',mot:'Long',reg:'Auto',amt:.5,tone:.5,space:.4,att:.2,rel:.32},x:[['Amount','amt',0,1,.01],['Tone','tone',0,1,.01],['Space','space',0,1,.01],['Attack','att',0,1,.01],['Release','rel',0,1,.01]]});TR[9].pt=pat(TR[9]);
function subDrone(w){const T=TR[9],p=T.p,hold=p.hold*60/G.bpm/4,e=w+hold+.2,f0=d2f(R()<p.follow?cur.r:0,p.oct),f=f0<40?f0*2:f0,o=osc('sine',f,w,e),o2=osc('triangle',f,w,e),q=ctx.createBiquadFilter(),g=ctx.createGain(),hg=ctx.createGain(),pk=T.lv*.2;
 hg.gain.value=p.harm*.6;q.type='lowpass';q.frequency.value=p.cut;q.Q.value=.7;g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(pk,w+.012);g.gain.setValueAtTime(pk,w+hold);g.gain.linearRampToValueAtTime(.0001,w+hold+.1);o.connect(g);o2.connect(hg);hg.connect(q);q.connect(g);g.connect(A.dkb)}
TR[9].c='#7af0ff';{const b=document.createElement('button');b.className='pad';b.textContent='Satellite';b.onclick=()=>TR[9].m=!TR[9].m;b.style.setProperty('--col','#7af0ff');$('#pads').appendChild(b);pads.push(b)}
$('#lg').insertAdjacentHTML('beforeend','<span><i style="background:#00ffd0"></i>Sub</span>');
/* rhythmic gate on the synth bus (pads, lead, stab and their reverb/delay) */
const GT={depth:0,st:16,h:9,r:0,len:.5,pt:[],was:0};
function gtPat(){const h=Math.min(GT.h,GT.st);GT.pt=Array(GT.st).fill(0);for(let i=0;i<GT.st;i++)if((i*h)%GT.st<h)GT.pt[(i+GT.r)%GT.st]=1}gtPat();
function gateStep(w,sd){if(!A.gt)return;if(GT.depth<.01){if(GT.was){A.gt.gain.cancelScheduledValues(w);A.gt.gain.setTargetAtTime(1,w,.01);GT.was=0}return}
 GT.was=1;const s=tk%GT.st,lo=1-GT.depth,gn=A.gt.gain;if(GT.pt[s]){gn.setTargetAtTime(1,w,.004);gn.setTargetAtTime(lo,w+sd*GT.len,.006)}else gn.setTargetAtTime(lo,w,.006)}
{const pn=document.createElement('div');pn.className='panel';pn.innerHTML='<h2>Rhythmic gate \u00b7 synth bus (pad, lead, stab)</h2><div class="grid" id="gate"></div>';$('#t-mix').appendChild(pn);const g2=$('#gate');
 sl(g2,'Gate depth',0,1,GT.depth,.01,v=>{GT.depth=v});sl(g2,'Gate steps',2,32,GT.st,1,v=>{GT.st=v;gtPat()});sl(g2,'Gate hits',1,32,GT.h,1,v=>{GT.h=v;gtPat()});sl(g2,'Gate rotate',0,31,GT.r,1,v=>{GT.r=v;gtPat()});sl(g2,'Gate length',.1,1,GT.len,.01,v=>{GT.len=v})}
/* lead: chord arp mode (plays the pad's own chord tones) */
MODES.push('Chord arp');let ca=0;
const _ln3=leadNote;leadNote=function(p){if(p.mode!=='Chord arp')return _ln3(p);const n=SC[G.scale].length;let arr=[];for(let o=0;o<Math.round(p.range);o++)cur.n.forEach(d=>arr.push(((d%n)+n)%n+o*n));arr=[...new Set(arr)].sort((a,b)=>a-b);const L=arr.length;if(R()>p.dv)ca+=1+Math.floor(R()*2);const m=ca%Math.max(1,2*(L-1)),i=L<2?0:(m<L?m:2*(L-1)-m);ca++;return arr[Math.min(i,L-1)]};
const _ln4=leadNote;leadNote=function(p){return p.mode==='Acid 303'?acidNote(p):_ln4(p)};
/* lead: unison, sub osc, drive, grit + presets */
Object.assign(TR[4].p,{uni:1,usp:18,subosc:0,drv:0,grit:0});TR[4].x.push(['Unison','uni',1,7,1],['Unison spread \u00a2','usp',0,50,1],['Sub osc','subosc',0,1,.01],['Drive','drv',0,1,.01],['Grit','grit',0,1,.01],['Crush','crush',0,1,.01],['Accent amount','acc3',0,1,.01],['Accent chance','accp',0,1,.01]);Object.assign(TR[4].p,{crush:0,acc3:.6,accp:.3});MODES.push('Acid 303');
const LPRE={Clean:{uni:1,usp:8,subosc:0,drv:0,fold:0,grit:0,crush:0,res:3.5,wave:.35},Dense:{uni:5,usp:22,subosc:.3,drv:.25,grit:.05,res:3.5},Aggro:{uni:7,usp:32,subosc:.45,drv:.7,fold:.4,fenv:.5,grit:.3,res:7,wave:.65,cut:700,envA:3200,dec:.34},'Acid 303':{mode:'Acid 303',uni:1,subosc:.25,drv:.5,fold:0,grit:.15,crush:.15,res:10,cut:360,envA:3800,dec:.2,wave:.05,glide:.3,gt:60,acc3:.7,accp:.3,ds:.25,rs:.08,dv:.85,_t:{st:16,h:11,r:0}}};
BUILD.sync.push(function(){const g=TR[4].mb.closest('.card').querySelector('.grid');leadPresetUI(g);tagCtl();applyMode()});

