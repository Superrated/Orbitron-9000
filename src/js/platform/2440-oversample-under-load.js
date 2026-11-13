/* ---- v0.8: OVERSAMPLING FOLLOWS THE LOAD — the clippers and saturators on the master and buses (final clipper 4x; mix clip, drum bus,
   lead bus and 303 bus 2x) cost a lot of processing because they oversample. At full quality nothing changes. When the device struggles
   they step down: at SAVING the 4x ones run at 2x, at OVERLOAD all of them run plain. When the load is gone again they step back up.
   Only the edge of very loud peaks sounds a touch rougher, and only while the device is overloaded. ---- */
{const OS={nodes:new Set(),lvl:0},D=Object.getOwnPropertyDescriptor(WaveShaperNode.prototype,'oversample');
 if(D&&D.set){
  // remember the setting each live shaper asked for (per-note shapers are short-lived; they drop out of the list when garbage collected)
  Object.defineProperty(WaveShaperNode.prototype,'oversample',{configurable:true,enumerable:D.enumerable,get:D.get,
   set(v){if(!(this.context instanceof OfflineAudioContext)&&!this.__osApply){this.__os=v;if(v!=='none'&&window.WeakRef){OS.nodes.add(new WeakRef(this));v=OS.pick(v)}}D.set.call(this,v)}});
  OS.pick=v=>OS.lvl>=3?'none':OS.lvl>=2&&v==='4x'?'2x':v;
  const apply=()=>{for(const r of OS.nodes){const n=r.deref();if(!n||n.context.state==='closed'){OS.nodes.delete(r);continue}const want=OS.pick(n.__os);
   if(D.get.call(n)!==want){n.__osApply=1;try{D.set.call(n,want)}catch(e){}n.__osApply=0}}};
  setInterval(()=>{if(typeof QOS==='undefined')return;const l=typeof ctx!=='undefined'&&ctx&&playing?Math.max(QOS.lvl||0,QOS.ml||0):0;
   if(l!==OS.lvl){OS.lvl=l;apply()}else if(OS.nodes.size>400)apply()},500);
  window.orbOversample={state:()=>({lvl:OS.lvl,nodes:OS.nodes.size})}}}
