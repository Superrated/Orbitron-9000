/* ---- v13: versatile lead engine — 6 oscillator models, 4 filter types, ADSR, stereo unison, pitch env, vibrato, key tracking, 17 tuned patches ---- */
const LDEF={eng:'Stack',ft:'LP12',att:2,sus:0,rel:.12,hold:1,wid:.3,oct2:0,pw:.5,fmr:2,fmi:2,vow:.3,penv:0,pdec:.08,vib:0,vibr:5.5,kt:.3,pg:1};
const LBASE={uni:1,usp:12,subosc:0,drv:0,fold:0,fenv:.4,fsym:0,grit:0,crush:0,wave:.35,det:7,res:3.5,cut:600,envA:2400,dec:.28};
Object.keys(LDEF).forEach(k=>{if(TR[4].p[k]==null)TR[4].p[k]=LDEF[k]});
const LENG=['Saw','Pulse','FM','Vowel','Organ','Sine'],LFT=['LP12','LP24','BP','HP'],EGN={Saw:1,Pulse:1,FM:1.2,Vowel:1.3,Organ:1,Sine:1.4};
const PWC={};function pulseWave(pw){const k=Math.round(Math.max(.05,Math.min(.95,pw))*40);if(!PWC[k]){const N=48,re=new Float32Array(N),im=new Float32Array(N),d=k/40;for(let n=1;n<N;n++)re[n]=2/(n*Math.PI)*Math.sin(n*Math.PI*d);PWC[k]=ctx.createPeriodicWave(re,im)}return PWC[k]}
let ORW=null;function organWave(){if(!ORW){const re=new Float32Array(17),im=new Float32Array(17);[[1,1],[2,.75],[3,.5],[4,.45],[6,.3],[8,.28],[10,.1],[12,.12],[16,.08]].forEach(([n,a])=>im[n]=a);ORW=ctx.createPeriodicWave(re,im)}return ORW}
const VWF=[[800,1150,2900],[400,1600,2700],[270,2140,2950],[450,800,2830],[325,700,2700]];let VWC={},VWN=0;
function vowelWave(f,v){const x=Math.max(0,Math.min(1,v))*4,i=Math.min(3,Math.floor(x)),t=x-i,F=VWF[i].map((a,j)=>a+(VWF[i+1][j]-a)*t),key=Math.round(f)+'|'+x.toFixed(2);if(VWC[key])return VWC[key];if(++VWN>400){VWC={};VWN=0}
 const N=Math.max(4,Math.min(80,Math.floor(7000/f))),re=new Float32Array(N+1),im=new Float32Array(N+1),AM=[1,.6,.3],B=[90,110,170];
 for(let n=1;n<=N;n++){const hf=n*f;let a=.04/n;F.forEach((fm,j)=>{const bw=Math.max(B[j]*1.6,f*.7);a+=AM[j]*Math.exp(-Math.pow((hf-fm)/bw,2))});im[n]=a}return VWC[key]=ctx.createPeriodicWave(re,im)}
function leadPoly(w){const T=TR[4],p=T.p,v=T.lv,sd=60/G.bpm/4,d=leadNote(p);lastDeg=d;const f=leadFold(d2f(d,3+leadOct(p))),
 hs=Math.sin(((tk%T.st)+1)*12.9898+(p.seed||0)*78.233)*43758.5453,sl=LF>0&&w-LW<=4.2*sd&&hs-Math.floor(hs)<p.glide,f0=sl?LF:f,
 eng=(!p.eng||p.eng==='Saw')?'Stack':p.eng,att=Math.max(.002,(p.att||2)/1000),dec=p.dec*(sl?1.4:1)*Math.pow(2,1.2*mv("Lead decay",w)),susM=(p.sus||0)>.01,gate=Math.max(att+.01,(p.hold||1)*sd),rel=Math.max(.01,p.rel||.1),
 e=w+(susM?gate+rel*1.6:att+dec)+.08,gt=p.gt/1000,nu=Math.max(1,Math.min(eng==='FM'?3:7,Math.round(p.uni||1),QOS.eco2?1:QOS.uni[QOS.lvl])),g=ctx.createGain(),mx=ctx.createGain(),vs=[];
 let vib=null;if(p.vib>.5){const l=osc('sine',p.vibr||5.5,w,e);vib=ctx.createGain();vib.gain.setValueAtTime(0,w);vib.gain.linearRampToValueAtTime(p.vib,w+.15+Math.min(.3,dec*.3));l.connect(vib)}
 const mk=(r,dt,ty)=>{const o=mkOsc();if(typeof ty==='string')o.type=ty;else o.setPeriodicWave(ty);const rr=r*cf;o.frequency.value=f0*rr;o.detune.value=dt;o.start(w);o.stop(e);vs.push([o,rr]);if(vib)vib.connect(o.detune);return o};
 let cf=1;const CR=window.__CHRF?__CHRF(d):[1];   /* v0.3: chord notes share this voice's filter, amp and FX */
 const wid=p.wid||0,uG=1/Math.sqrt(nu);
 const UV=[]; /* perf: unison voices that sit at the same pan position share one gain + panner */
 for(const c0 of CR){cf=c0;for(let i=0;i<nu;i++){const u=nu>1?i/(nu-1)-.5:0,dt=u*2*(p.usp||0),ui=wid>0?i:0;let vg=UV[ui];if(!vg){const pn=ctx.createStereoPanner();vg=UV[ui]=ctx.createGain();pn.pan.value=u*2*wid;vg.gain.value=uG;vg.connect(pn);pn.connect(mx)}
  if(eng==='Stack'){const dr=()=>(R()-.5)*6,a=ctx.createGain(),b=ctx.createGain();a.gain.value=.62;b.gain.value=p.wave<.5?.62:.5;mk(1,dt+dr(),'sawtooth').connect(a);mk(1,dt+(p.det||7)+dr(),p.wave<.5?'sawtooth':'square').connect(b);a.connect(vg);b.connect(vg)}
  else if(eng==='Pulse')mk(1,dt,pulseWave(p.pw+(nu>1?u*.14:0))).connect(vg);
  else if(eng==='FM'){const c=mk(1,dt,'sine'),m=mk(p.fmr||2,dt*.5,'sine'),mg=ctx.createGain(),ix=(p.fmi||0)*f*cf;mg.gain.setValueAtTime(ix*(1+2*(p.fenv||0)),w);mg.gain.setTargetAtTime(ix*.25,w+.002,Math.max(.02,dec*.35));m.connect(mg);mg.connect(c.frequency);c.connect(vg)}
  else if(eng==='Vowel')mk(1,dt,vowelWave(f,p.vow)).connect(vg);
  else if(eng==='Organ')mk(1,dt,organWave()).connect(vg);
  else mk(1,dt,'sine').connect(vg)}}cf=1;
 if(p.subosc>.01&&QOS.lvl<3&&!QOS.eco2){const sg=ctx.createGain();sg.gain.value=p.subosc*.6;mk(.5,(R()-.5)*6,eng==='Stack'?'sawtooth':eng==='Pulse'?'square':'sine').connect(sg);sg.connect(mx)}
 if(p.oct2>.01&&QOS.lvl<3&&!QOS.eco2){const og=ctx.createGain();og.gain.value=p.oct2*.5;mk(2,(p.usp||0)*.3,eng==='Stack'?'sawtooth':eng==='Pulse'?pulseWave(p.pw):'sine').connect(og);og.connect(mx)}
 const ps=p.penv||0;
 if(sl)vs.forEach(([x,r])=>{x.frequency.setValueAtTime(f0*r,w);x.frequency.exponentialRampToValueAtTime(f*r,w+gt)});
 else if(Math.abs(ps)>.05)vs.forEach(([x,r])=>{x.frequency.setValueAtTime(f*r*Math.pow(2,ps/12),w);x.frequency.exponentialRampToValueAtTime(f*r,w+Math.max(.005,p.pdec||.08))});
 if(p.grit>.01){const ns=mkBuf(),ng=ctx.createGain(),nf=ctx.createBiquadFilter();ns.buffer=A.nb;nf.type='highpass';nf.frequency.value=1500;ng.gain.setValueAtTime(p.grit*.5,w);ng.gain.exponentialRampToValueAtTime(.001,w+.09);ns.connect(nf);nf.connect(ng);ng.connect(mx);ns.start(w,R()*.5);ns.stop(w+.1)}
 const kt=Math.pow(f/261.6,p.kt||0),cm=Math.pow(2,2.5*mv("Lead cutoff",w)),ft=p.ft||'LP12',cb=Math.max(30,Math.min(16000,p.cut*kt*cm)),pkf=Math.max(cb+1,Math.min(18000,cb+p.envA*(sl?.5:1)*Math.max(.3,kt))),fd=Math.max(.03,dec),filt=[ctx.createBiquadFilter()];
 if(ft==='LP24')filt.push(ctx.createBiquadFilter());
 filt.forEach((x,i)=>{x.type=ft==='BP'?'bandpass':ft==='HP'?'highpass':'lowpass';x.Q.value=ft==='BP'?.6+p.res*.45:i?Math.max(.5,p.res*.4):ft==='LP24'?p.res*.75:p.res;x.frequency.setValueAtTime(pkf,w);x.frequency.exponentialRampToValueAtTime(cb,w+fd);if(i)filt[i-1].connect(x)});
 const q=filt[0],fo=filt[filt.length-1];
 const pk=v*.4*(EGN[eng]||1)*(p.pg||1)*(1+(p.drv||0)*.4+.07*(nu-1));
 g.gain.setValueAtTime(sl?pk*.75:.0001,w);if(!sl)g.gain.linearRampToValueAtTime(pk,w+att);
 if(susM){g.gain.setTargetAtTime(pk*p.sus,w+att,Math.max(.01,dec/3));g.gain.setTargetAtTime(.0001,w+gate,rel/4)}else g.gain.exponentialRampToValueAtTime(.0001,w+att+dec);
 if(p.fold>.01){const pre=ctx.createGain(),ws=ctx.createWaveShaper(),dr=1+p.fold*7,d0=Math.min(8,dr*(1+p.fenv*1.2));ws.curve=foldCurve();ws.oversample=QOS.lvl?'none':'2x';pre.gain.setValueAtTime(d0/8,w);pre.gain.exponentialRampToValueAtTime(dr/8,w+Math.max(.03,dec));mx.connect(pre);pre.connect(ws);if(p.fsym>.01){const cs=mkConst();cs.offset.value=p.fsym*.3;cs.connect(ws);cs.start(w);cs.stop(e)}ws.connect(q)}else if(eng==='Stack'){const md=ctx.createWaveShaper();md.curve=satCurve(1.7);mx.connect(md);md.connect(q)}else mx.connect(q);
 {let tl=fo;if(p.drv>.01){const dg=ctx.createGain(),dw=ctx.createWaveShaper();dg.gain.value=.6+p.drv*2.4;dw.curve=curve(p.drv*10);tl.connect(dg);dg.connect(dw);tl=dw}if(p.crush>.01){const cr=ctx.createWaveShaper();cr.curve=crushCurve(p.crush);tl.connect(cr);tl=cr}tl.connect(g)}
 send(g,A.ld||A.dk,p.ds,p.rs);leadVoice(g,w);LF=f;LW=w}
/* knobs: new ones + wider ranges on the old ones */
TR[4].x.forEach(x=>{if(x[1]==='cut')x[3]=9000;if(x[1]==='envA')x[3]=9000;if(x[1]==='dec')x[3]=2;if(x[1]==='res')x[3]=20});
TR[4].x.push(['Stereo width','wid',0,1,.01],['Octave up','oct2',0,1,.01],['Pulse width','pw',.05,.95,.01],['FM ratio','fmr',.5,8,.01],['FM index','fmi',0,10,.05],['Vowel','vow',0,1,.01],['Pitch env st','penv',-24,24,.5],['Pitch env time','pdec',.005,.5,.005],['Vibrato ¢','vib',0,60,1],['Vibrato rate','vibr',.5,12,.1],['Key track','kt',0,1,.01],['Attack ms','att',1,600,1],['Sustain','sus',0,1,.01],['Release','rel',.02,2,.01],['Note length','hold',.25,8,.25]);
/* patches — every field set, so switching never inherits leftovers; pg = loudness trim measured per patch */
Object.assign(LPRE,{
 Clean:{pg:2.6,ft:'LP24',res:4,cut:650,envA:3200,dec:.32,kt:.5,det:7,wave:.2,subosc:.4,uni:1,glide:.2,gt:60},
 Dense:{pg:1.093,uni:5,usp:22,wid:.6,subosc:.3,drv:.25,grit:.05},
 Aggro:{pg:0.668,uni:7,usp:32,wid:.7,subosc:.45,drv:.7,fold:.4,fenv:.5,grit:.3,res:7,wave:.65,cut:700,envA:3200,dec:.34},
 Pluck:{pg:4.364,uni:3,usp:10,wid:.5,ft:'LP24',cut:280,envA:5200,dec:.16,res:2.5,kt:.6,ds:.35,rs:.3},
 Supersaw:{pg:0.68,uni:7,usp:28,wid:.95,oct2:.25,wave:.1,cut:2400,envA:1600,dec:.5,sus:.7,att:8,rel:.35,hold:1.5,res:1.5,rs:.4},
 Reese:{pg:0.253,uni:5,usp:16,wid:.45,wave:.1,ft:'LP24',cut:520,envA:700,res:2,att:5,dec:.3,sus:.9,rel:.15,hold:2,drv:.35,subosc:.3},
 Hoover:{pg:0.246,eng:'Pulse',pw:.3,uni:7,usp:36,wid:.85,penv:-5,pdec:.14,oct2:.25,subosc:.4,cut:1800,envA:1500,res:2,att:6,dec:.3,sus:.8,hold:2,rel:.2,drv:.3},
 'Square chip':{pg:1.4,eng:'Pulse',pw:.25,wid:0,cut:6500,envA:0,res:.7,dec:.15,sus:.6,hold:.8,rel:.03,vib:18,vibr:6,kt:0},
 'Hollow BP':{pg:5.2,uni:3,usp:14,wid:.55,wave:.55,det:12,ft:'BP',res:2.2,cut:1500,envA:2600,dec:.32,kt:.8,drv:.25},
 'Glass':{pg:1.709,eng:'Pulse',pw:.12,ft:'HP',cut:700,res:3,envA:0,dec:.3,sus:.3,hold:.5,rel:.4,vib:5,vibr:4.5,wid:.4,uni:2,usp:6,rs:.55,ds:.4},
 'FM bell':{pg:0.591,eng:'FM',fmr:3.5,fmi:3,fenv:.6,cut:8000,envA:0,res:.7,dec:.9,kt:0,rs:.5,ds:.3},
 'FM keys':{pg:0.937,eng:'FM',fmr:1,fmi:2.2,fenv:.4,uni:2,usp:6,wid:.35,cut:5000,envA:0,res:.7,dec:.45,kt:0},
 'Metal FM':{pg:0.86,eng:'FM',fmr:1.41,fmi:6,fenv:.5,drv:.4,fold:.2,cut:3000,envA:2000,dec:.25,res:4},
 Vowel:{pg:0.871,eng:'Vowel',vow:.2,uni:3,usp:12,wid:.6,cut:4500,envA:0,res:.7,att:10,dec:.3,sus:.6,hold:1,rel:.15,vib:12,vibr:5,kt:0},
 Organ:{pg:0.579,eng:'Organ',cut:5000,envA:0,res:.7,att:4,dec:.2,sus:.85,hold:1,rel:.06,vib:8,vibr:6.5,drv:.2,kt:0},
 'Soft sine':{pg:0.446,eng:'Sine',cut:7000,envA:0,res:.7,att:15,dec:.4,sus:.5,hold:1,rel:.25,fold:.25,fenv:.5,vib:6,kt:0,rs:.4}});
const LMOOD={Dark:['Reese','Pluck','Metal FM','Clean','Hollow BP'],Melancholic:['Pluck','FM keys','Supersaw','Vowel','Clean'],Dreamy:['FM bell','Supersaw','Soft sine','FM keys','Glass'],Tense:['Metal FM','Aggro','Hollow BP','Square chip','Reese'],Ethereal:['FM bell','Glass','Soft sine','Vowel'],Hopeful:['Supersaw','Pluck','Square chip','FM keys','Organ'],Noir:['Organ','Reese','FM keys','Vowel','Clean'],Drone:['Soft sine','Reese','Vowel','Organ'],Power:['Aggro','Hoover','Supersaw','Metal FM']};
function applyLP(k,j){UI.sync(0,true);if(!LPRE[k])k=LPRE[TR[4].p.patch]?TR[4].p.patch:Object.keys(LPRE)[0];const {_t,...pp}=LPRE[k],P=TR[4].p,keep={mode:P.mode,ds:P.ds,rs:P.rs};Object.assign(P,LBASE,LDEF,{ds:keep.ds,rs:keep.rs},pp);if(!pp.mode)P.mode=keep.mode==='Acid 303'?'Motif':keep.mode;
 if(j){['cut','envA','dec'].forEach(x=>P[x]*=.8+R()*.4);P.usp*=.8+R()*.4;if(P.eng==='FM')P.fmi*=.8+R()*.4;if(P.eng==='Vowel')P.vow=R()}if(_t){Object.assign(TR[4],_t);TR[4].pt=pat(TR[4])}AC.key='';P.patch=k}
/* lead card UI: patch menu + random patch, engine/filter menus, Osc/Filter/Amp/FX pages, engine-specific knobs only */
const LGRP={Osc:['Engine','Saw↔Square','Detune ¢','Unison','Unison spread ¢','Stereo width','Sub osc','Octave up','Pulse width','FM ratio','FM index','Vowel','Pitch env st','Pitch env time','Vibrato ¢','Vibrato rate'],Filter:['Filter type','Cutoff','Resonance','Env amount','Key track','Fold','Fold env','Fold bias'],Amp:['Attack ms','Decay','Sustain','Release','Note length'],FX:['Drive','Grit','Crush','Delay send','Reverb send','Accent amount','Glide time ms']};
const LENGK={'Saw↔Square':['Stack'],'Detune ¢':['Stack'],'Pulse width':['Pulse'],'FM ratio':['FM'],'FM index':['FM'],'Vowel':['Vowel']};
let LPG='Osc';
const labOf=el=>{const sp=el.querySelector('span>b')?el.querySelector('span'):null;return(sp?sp.firstChild.textContent:el.firstChild&&el.firstChild.nodeType===3?el.firstChild.textContent:el.textContent).trim()};
function leadPages(){const c=TR[4].mb&&TR[4].mb.closest('.card');if(!c)return;const P=TR[4].p,ac=P.mode==='Acid 303';
 c.querySelectorAll('.grid>*').forEach(el=>{if(el.dataset.g==='pat')return;const l=labOf(el);let grp=null;for(const k in LGRP)if(LGRP[k].includes(l))grp=k;if(!grp)return;
  const engOk=!LENGK[l]||LENGK[l].includes((!P.eng||P.eng==='Saw')?'Stack':P.eng);el.style.display=grp===LPG&&engOk?'':'none'});
 c.querySelectorAll('.lpg button').forEach(b=>b.classList.toggle('on',b.textContent===LPG));const n=c.querySelector('.lpnote');if(n)n.hidden=!ac}
function mkSel(lab,opts,val,fn){const l=document.createElement('label');l.className='sl';l.appendChild(document.createTextNode(lab));const s=document.createElement('select');opts.forEach(o=>s.add(new Option(o,o)));s.value=val;s.onchange=()=>fn(s.value);l.appendChild(s);return l}
function leadPresetUI(g){const P=TR[4].p,card=g.closest('.card');
 const row=document.createElement('div');row.style.cssText='grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap;align-items:center';
 const ps=document.createElement('select');ps.setAttribute('aria-label','Lead patch');['Custom',...Object.keys(LPRE)].forEach(k=>ps.add(new Option(k==='Custom'?'Patch: custom':'Patch: '+k,k)));ps.value=LPRE[P.patch]?P.patch:'Custom';ps.onchange=()=>{if(ps.value!=='Custom'){applyLP(ps.value,0);build()}};
 const rb=document.createElement('button');rb.className='dice';rb.textContent='Random patch';rb.onclick=()=>{const ks=Object.keys(LPRE).filter(k=>k!=='Acid 303'||P.mode==='Acid 303');applyLP(pick(ks),1);build()};
 row.append(ps,rb);g.prepend(row);
 g.insertBefore(mkSel('Engine',LENG,(!P.eng||P.eng==='Saw')?'Stack':P.eng,v=>{P.eng=v;P.patch='';leadPages()}),row.nextSibling);
 g.insertBefore(mkSel('Filter type',LFT,P.ft||'LP12',v=>{P.ft=v;P.patch=''}),row.nextSibling.nextSibling);
 const pg=document.createElement('div');pg.className='lpg';pg.style.cssText='grid-column:1/-1;display:flex;gap:4px';Object.keys(LGRP).forEach(k=>{const b=document.createElement('button');b.textContent=k;b.style.cssText='flex:1;padding:6px 4px;font-size:11px';b.onclick=()=>{LPG=k;leadPages()};pg.appendChild(b)});
 const nt=document.createElement('p');nt.className='gnote lpnote';nt.style.cssText='grid-column:1/-1;margin:0';nt.textContent='Acid 303 mode uses its own mono voice: cutoff, resonance, env, decay, drive, grit, crush, accent and glide apply.';
 g.insertBefore(pg,row.nextSibling);g.insertBefore(nt,pg.nextSibling)}
BUILD.sync.push(function(){tagCtl();applyMode();leadPages()});
const _am=applyMode;applyMode=function(){_am();leadPages()};
/* generator picks a mood-appropriate patch with small variations */
const _gen13=generate;generate=function(){_gen13();const M=MOODS[curMood];if(!M.acid){const L=LMOOD[curMood]||Object.keys(LPRE).filter(k=>k!=='Acid 303');applyLP(pick(L),1);if(M.power){TR[4].p.drv=Math.max(TR[4].p.drv,.45)}}else TR[4].p.patch='Acid 303';build()};
