/* ---- v153: contemporary leads for Melancholic and Hopeful (melodic techno / progressive house): modern patches without vibrato, and one of
   three pattern styles per Launch — hypnotic 16th arp with Cycle + Reset on bar and a slow filter sweep, a rolling Turing-loop sequence, or a
   progressive-house pluck hook with long delay ---- */
{LMOOD.Melancholic=['Mini lead','Pluck','Mini sparkle','FM bell','Glass','Mini edge','Mini lead'];
 LMOOD.Hopeful=['Pluck','Mini sparkle','Glass','Soft sine','FM keys','Pluck','Mini lead'];
 MOODS.Melancholic.md=['Up/Down','Turing loop','Converge','Pedal arp','Motif'];MOODS.Hopeful.md=['Motif','Diverge','Up','Pedal arp','Turing loop'];
 const ring=(T,st,h,r,ten)=>{T.st=st;T.h=Math.max(1,Math.min(h,st));T.r=((r||0)%st+st)%st;if(ten!=null)T.ten=ten;T.pt=pat(T)};
 const _gc=generate;generate=function(){const r=_gc.apply(this,arguments);try{const m=curMood;if(m!=='Melancholic'&&m!=='Hopeful')return r;const L=TR[4],P=L.p;if(P.mode==='Acid 303')return r;
  const sty=pick(['hypno','rolling','hook']);G.leadSty=sty;P.vib=0;
  if(sty==='hypno'){ring(L,16,pick([12,14,16]),0,0);Object.assign(P,{mode:pick(m==='Melancholic'?['Up/Down','Converge','Pedal arp']:['Up','Diverge','Pedal arp']),cyc:pick([5,6,7]),rst:pick([1,2]),nrep:1,range:pick([1,2]),lock:.8,glide:0});
   P.dec=Math.min(P.dec||.3,.22);Object.assign(LFOS[0],{tg:'Lead cutoff',sh:0,sync:1,div:32,d:.5,ph:0})}
  else if(sty==='rolling'){ring(L,16,pick([10,11,12]),pick([0,1]),pick([0,.15]));Object.assign(P,{mode:'Turing loop',len:pick([6,7,8]),dv:.95,cyc:0,rst:0,nrep:1,range:2,lock:.75,glide:pick([0,.1])})}
  else{ring(L,16,pick([7,8,9]),2,.2);Object.assign(P,{mode:m==='Hopeful'?pick(['Motif','Pedal arp']):'Motif',len:8,dv:.97,cyc:0,rst:0,nrep:pick([1,1,2]),range:2,lock:.8,glide:0});P.ds=Math.max(P.ds||.3,.5);P.rs=Math.max(P.rs||.3,.42)}
  try{window.leadResetPos&&leadResetPos()}catch(e){}build();if(typeof lfoUI==='function')lfoUI();setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){console.warn('[orbitron] contemporary leads',e)}return r}}

