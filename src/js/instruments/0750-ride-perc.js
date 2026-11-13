/* ---- v91: 909-style ride as a Perc sound — Perc sound: Blip / Ride (six detuned square partials, high band-pass, bell ping, noise wash), pre-rendered per setting; moods sometimes switch perc to ride ---- */
{const P0=TR[3].p;Object.assign(P0,{pv:P0.pv||'Blip',rtn:P0.rtn||1,rdc:P0.rdc||1.1,rbl:P0.rbl==null?.4:P0.rbl});
 function rideRaw(w,p){const t=p.rtn||1,dec=p.rdc||1.1,out=ctx.createGain(),pn=ctx.createStereoPanner();pn.pan.value=.25;out.connect(pn);
  const mix=ctx.createGain();mix.gain.value=.17;[205.3,304.4,369.6,522.7,540,800].forEach(f=>{const o=osc('square',f*1.62*t,w,w+dec+.1);o.connect(mix)});
  const hp=ctx.createBiquadFilter(),bp=ctx.createBiquadFilter(),g=ctx.createGain();hp.type='highpass';hp.frequency.value=5200*t;bp.type='bandpass';bp.frequency.value=8200*t;bp.Q.value=.6;
  g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(1,w+.002);g.gain.exponentialRampToValueAtTime(.35,w+.05);g.gain.exponentialRampToValueAtTime(.0001,w+dec);mix.connect(hp);hp.connect(bp);bp.connect(g);g.connect(out);
  const bl=p.rbl||0;if(bl>.01)[1820,2930].forEach((f,i)=>{const o=osc('sine',f*t,w,w+.4),bg=ctx.createGain();bg.gain.setValueAtTime(.0001,w);bg.gain.exponentialRampToValueAtTime(.12*bl/(i+1),w+.002);bg.gain.exponentialRampToValueAtTime(.0001,w+.35);o.connect(bg);bg.connect(out)});
  {const s=mkBuf(),nf=ctx.createBiquadFilter(),ng=ctx.createGain();s.buffer=A.nb;nf.type='bandpass';nf.frequency.value=9500*t;nf.Q.value=.7;ng.gain.setValueAtTime(.0001,w);ng.gain.exponentialRampToValueAtTime(.18,w+.003);ng.gain.exponentialRampToValueAtTime(.0001,w+dec*.45);s.connect(nf);nf.connect(ng);ng.connect(out);s.start(w,R()*.5);s.stop(w+dec)}
  return pn}
 const RC={};let rbusy=0;const rkey=p=>[(p.rtn||1).toFixed(2),(p.rdc||1.1).toFixed(2),(p.rbl||0).toFixed(2),ctx.sampleRate].join('|');
 function rrender(key,p){if(rbusy||!window.OfflineAudioContext)return;rbusy=1;const sr=ctx.sampleRate,dur=(p.rdc||1.1)+.15,oc=new OfflineAudioContext(2,Math.ceil(sr*dur),sr),sv=ctx;
  try{ctx=oc;rideRaw(0,p).connect(oc.destination)}catch(e){}finally{ctx=sv}oc.startRendering().then(b=>{RC[key]=b;const ks=Object.keys(RC);if(ks.length>8)delete RC[ks[0]];rbusy=0}).catch(()=>{rbusy=0})}
 let bus=null;const rbus=()=>{if(bus&&bus.context===ctx)return bus;bus=vtag(ctx.createGain());send(bus,A.m,.05,.15);return bus};
 function ride(w){const T=TR[3],p=T.p,k=rkey(p),b=RC[k],v=T.lv*1.1;if(b){const s=mkBuf(),g=ctx.createGain();s.buffer=b;g.gain.value=v;s.connect(g);routeTrack(g,null,rbus());s.start(w);return}
  rrender(k,p);const o=rideRaw(w,p),g=ctx.createGain();g.gain.value=v;o.connect(g);routeTrack(g,null,rbus())}
  // woodblock: short tuned knock on a chord tone, with a click
 // marimba: a tuned wooden mallet. Each step of the perc ring keeps its own chord tone, so the line loops with the ring (and drifts against
 // the kick when the ring isn't 16) while following the chords. Body = sine + 4th partial (3.93×) + a short 9.2× knock and a soft mallet tick.
 function wood(w){const T=TR[3],p=T.p,c=(typeof chordAt==='function'?chordAt(w):cur)||cur,n=SC[G.scale].length,ch=((c&&c.n&&c.n.length)?c.n:[0,2,4]).map(x=>((x%n)+n)%n),
   pool=[...new Set([...ch,...ch.map(x=>x+n)])].sort((a,b)=>a-b),pos=((tk%T.st)+T.st)%T.st,hv=Math.sin((pos+1)*78.233+(p.mseed||1)*12.9898)*43758.5453,
   d=pool[Math.floor((hv-Math.floor(hv))*pool.length)],sO=OCT,sF=FIX;OCT=0;FIX=0;let f;try{f=d2f(d,4)}finally{OCT=sO;FIX=sF}
  while(f<220)f*=2;while(f>740)f/=2; /* v0.83: an octave lower at the top (was 250–1050 Hz): the high notes poked out */f*=Math.pow(2,Math.round(p.wtn||0));
  const dec=Math.max(.12,p.wdc||.45),e=w+dec+.1,v=T.lv*1.5,out=ctx.createGain(),g1=ctx.createGain(),g2=ctx.createGain(),g3=ctx.createGain();
  const o1=osc('sine',f,w,e),o2=osc('sine',f*3.93,w,w+dec*.35+.05),o3=osc('sine',f*9.2,w,w+.05);
  g1.gain.setValueAtTime(.0001,w);g1.gain.exponentialRampToValueAtTime(v,w+.002);g1.gain.exponentialRampToValueAtTime(.0001,w+dec);
  g2.gain.setValueAtTime(.0001,w);g2.gain.exponentialRampToValueAtTime(v*.2,w+.0015);g2.gain.exponentialRampToValueAtTime(.0001,w+dec*.35);
  g3.gain.setValueAtTime(.0001,w);g3.gain.exponentialRampToValueAtTime(v*.035,w+.001);g3.gain.exponentialRampToValueAtTime(.0001,w+.04);
  o1.connect(g1);o2.connect(g2);o3.connect(g3);g1.connect(out);g2.connect(out);g3.connect(out);nz(w,'bandpass',f*2.5,.005,v*.05,out,0); /* v0.83: softer overtones and click → warmer, sits in the mix */
  const lpq=ctx.createBiquadFilter();lpq.type='lowpass';lpq.Q.value=.6;lpq.frequency.value=Math.max(60,Math.min(12000,p.filt||8000));out.connect(lpq); // v0.22: the Filter fader works on the marimba too
  send(lpq,A.m,p.ds==null?.15:p.ds,p.rs==null?.2:p.rs)}
 const _fv91=fireVoice;fireVoice=function(k,w){if(k===3&&ctx&&!(ctx instanceof OfflineAudioContext)){if(TR[3].p.pv==='Ride')return ride(w);if(TR[3].p.pv==='Marimba'||TR[3].p.pv==='Woodblock')return wood(w)}return _fv91(k,w)};
 TR[3].x.push(['Ride tone','rtn',.7,1.4,.01],['Ride decay','rdc',.3,2.5,.01],['Ride bell','rbl',0,1,.01],['Marimba octave','wtn',-1,1,1],['Marimba decay','wdc',.12,1.2,.01]);Object.assign(TR[3].p,{wtn:0,wdc:.45,mseed:R()*1e3});
 // Perc sound select on the perc sound page
 BUILD.hooks.push({post(){queueMicrotask(()=>queueMicrotask(()=>{const c=[...document.querySelectorAll('.card')].find(c=>+c.dataset.k===3);if(!c||c.querySelector('[data-pv]'))return;const g=c.querySelector('.grid');if(!g)return;
  const el=mkSel('Perc sound',['Blip','Marimba','Ride','Conga','Cowbell'],TR[3].p.pv==='Woodblock'?'Marimba':TR[3].p.pv,v=>setPv(v));el.dataset.g='snd';el.dataset.pv=1;g.insertBefore(el,[...g.children].find(x=>x.dataset.g==='snd')||null)}))}});
 // moods: sometimes the perc track becomes a 909 ride
 const RM={Dark:[.35,['q','o']],Tense:[.35,['q','o']],Acid:[.35,['q','e']],Power:[.4,['q','o']],Breaks:[.4,['e','j']],Hopeful:[.25,['o']],Melancholic:[.25,['o']],Noir:[.25,['o']],Italo:[.2,['q']],Bleep:[.1,['o']],'Melodic House':[.25,['o']],'Distorted Electro':[.3,['q','o']],'Groove Techno':[.6,['q','o','e']],Temporal:[.45,['e','o']],Vector:[.2,['o']]};
 // every Launch prepares a ride part for the mood, but the perc track starts on Blip: switch Perc sound to Ride to bring it in
 const PF=['st','h','r','ten','acc','gho','vari','pt','lv','m'];let RIDE=null,BLIP=null;
 function setPv(v){const T=TR[3],P=T.p;if(v==='Woodblock')v='Marimba';if(v===P.pv)return;if(v==='Marimba'){P.mseed=R()*1e3;if(!(P.wdc>=.12))P.wdc=.45;if(Math.abs(P.wtn||0)>1)P.wtn=0}if(v==='Ride'){BLIP={};PF.forEach(f=>BLIP[f]=T[f]);if(RIDE)PF.forEach(f=>{if(RIDE[f]!==undefined)T[f]=RIDE[f]});T.m=false}else if(P.pv==='Ride'&&BLIP){PF.forEach(f=>T[f]=BLIP[f]);BLIP=null}P.pv=v;build()}
 window.setPercSound=setPv;
 const _g91=generate;generate=function(){_g91();const T=TR[3],P=T.p;P.pv='Blip';BLIP=null;const m=RM[curMood]||[0,['o']];
  P.rtn=+(.9+R()*.25).toFixed(2);P.rdc=+(.8+R()*.8).toFixed(2);P.rbl=+(R()*.5).toFixed(2);const ty=pick(m[1]);
  RIDE={st:16,r:ty==='o'?2:0,h:ty==='e'?8:ty==='j'?pick([6,7]):4,ten:ty==='j'?.25:0,acc:ty==='q'?.2:.5,gho:ty==='j'?.25:0,vari:.2,lv:Math.min(T.lv||.5,.75)}   /* v0.75: was .45 — the ride sat about 12 dB under the hats until the balance lifted it */;RIDE.pt=pat(Object.assign({n:'Ride'},RIDE));if(R()<m[0])setPv('Ride');else build()};
 build()}
