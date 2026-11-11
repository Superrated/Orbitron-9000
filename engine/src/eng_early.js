<script>
/* ---- ENGINE (AudioWorklet), main-thread side.
   Every note's sound code runs unchanged, but against a lightweight "virtual" audio context while the worklet engine is on:
   the oscillators, filters, envelopes and shapers it builds become small descriptions that go to the worklet in one message per note.
   The worklet plays them sample-accurately with the same Web Audio rules (filters, envelopes, wavetables, panning), so the sound
   stays very close while the browser no longer builds and tears down hundreds of audio nodes per second.
   Fixed effects (delay, reverb, shimmer, sidechain, gate, master chain) stay native. Falls back to the classic path on any failure. ---- */
(()=>{
 // periodic waves made on a real context keep their coefficients, so the worklet can rebuild them
 try{const P=BaseAudioContext.prototype,f=P.createPeriodicWave;P.createPeriodicWave=function(re,im,o){const w=f.apply(this,arguments);try{w.__re=Float32Array.from(re);w.__im=Float32Array.from(im);w.__nn=!!(o&&o.disableNormalization)}catch(e){}return w}}catch(e){}
 const E=window.OrbEng={on:false,off:false,node:null,real:null,vc:null,q:null,qs:0,vid:0,nid:0,ports:new Map(),pg:[],nports:0,NOUT:48,ids:new WeakMap(),byId:new Map(),rid:0,
  fails:0,failT:[],stats:{notes:0,msgs:0,ops:0},err:''};
 E.push=x=>{(E.q||(E.q=[])).push(x);if(!E.qs){E.qs=1;queueMicrotask(E.flush)}};
 E.flush=()=>{E.qs=0;const q=E.q;E.q=null;if(q&&q.length&&E.node){try{E.node.port.postMessage(q);E.stats.msgs++;E.stats.ops+=q.length}catch(e){console.warn('[orbitron] engine post',e)}}};
 E.res=(o,kind)=>{let id=E.ids.get(o);if(id)return id;id=++E.rid;E.ids.set(o,id);try{E.byId.set(id,new WeakRef(o))}catch(e){}
  if(kind==='curve')E.push(['r',id,'curve',Float32Array.from(o)]);
  else if(kind==='buf'){const ch=[];for(let c=0;c<o.numberOfChannels;c++)ch.push(o.getChannelData(c).slice());E.push(['r',id,'buf',ch,o.sampleRate])}
  else{if(!o.__re)throw new Error('periodic wave without data');E.push(['r',id,'pw',o.__re,o.__im,o.__nn?1:0])}
  return id};
 const now=()=>E.real?E.real.currentTime:0;
 class VP{constructor(n,k,d){this.n=n;this.k=k;this._v=d;this._ev=0;this.defaultValue=d;this.minValue=-3.4e38;this.maxValue=3.4e38}
  get value(){return this._v}
  set value(x){x=+x;if(!isFinite(x))return;if(!this._ev){this._v=x;E.push(['pv',this.n.id,this.k,x]);return}this.setValueAtTime(x,now())}
  _a(ty,v,t,c){this._ev=1;E.push(['pa',this.n.id,this.k,ty,+v,+t||0,+c||0,now()]);return this}
  setValueAtTime(v,t){if(!isFinite(v))return this;this._v=+v;return this._a(0,v,t)}
  linearRampToValueAtTime(v,t){if(!isFinite(v))return this;this._v=+v;return this._a(1,v,t)}
  exponentialRampToValueAtTime(v,t){if(!isFinite(v))return this;this._v=+v;return this._a(2,v,t)}
  setTargetAtTime(v,t,c){if(!isFinite(v))return this;return this._a(3,v,t,Math.max(1e-4,+c||0))}
  cancelScheduledValues(t){return this._a(4,0,t)}
  cancelAndHoldAtTime(t){return this._a(5,0,t)}
  setValueCurveAtTime(a,t,d){const n=a.length;if(!n)return this;this.setValueAtTime(a[0],t);for(let i=1;i<n;i++)this.linearRampToValueAtTime(a[i],t+d*i/(n-1));return this}}
 class VN{constructor(ty,ch){this.id=++E.nid;this.t=ty;this.context=E.vc;this.numberOfOutputs=1;this.numberOfInputs=1;this.channelCount=2;this.channelCountMode='max';this.channelInterpretation='speakers';E.push(['n',this.id,ty,ch||0])}
  connect(d,o,i){if(d instanceof VN){E.push(['c',this.id,d.id,'']);return d}
   if(d instanceof VP){E.push(['c',this.id,d.n.id,d.k]);return d}
   if(d&&d.__plfo){return d}
   if(typeof AudioNode!=='undefined'&&d instanceof AudioNode){const p=E.port(this.__k,d);E.push(['c',this.id,-1-p,'']);return d}
   throw new Error('engine: cannot connect to '+(d&&d.constructor&&d.constructor.name))}
  disconnect(d){E.push(['d',this.id,d instanceof VN?d.id:d instanceof VP?d.n.id:0,d instanceof VP?d.k:''])}
  addEventListener(){}removeEventListener(){}}
 class VS extends VN{start(t=0,off,dur){t=+t||0;this.__s=t;this.__e=Infinity;this.__pc=window.__PADC||0;if(window.__LCOL)window.__LCOL.push(this);try{QOS.src.add(this)}catch(e){}E.push(['s',this.id,t,+off||0,dur==null?-1:+dur])}
  stop(t=0){t=+t||now();this.__e=t;E.push(['x',this.id,t])}}
 class VO extends VS{constructor(){super('osc');this.frequency=new VP(this,'frequency',440);this.detune=new VP(this,'detune',0);this._t='sine'}
  get type(){return this._t}set type(v){this._t=v;E.push(['k',this.id,'type',v])}
  setPeriodicWave(w){this._t='custom';E.push(['k',this.id,'pw',E.res(w,'pw')])}}
 class VBS extends VS{constructor(){super('buf');this.playbackRate=new VP(this,'playbackRate',1);this.detune=new VP(this,'detune',0);this._b=null;this._l=false;this._ls=0;this._le=0}
  get buffer(){return this._b}set buffer(b){this._b=b;if(b)E.push(['k',this.id,'buffer',E.res(b,'buf')])}
  get loop(){return this._l}set loop(v){this._l=!!v;E.push(['k',this.id,'loop',v?1:0])}
  get loopStart(){return this._ls}set loopStart(v){this._ls=+v;E.push(['k',this.id,'loopStart',+v])}
  get loopEnd(){return this._le}set loopEnd(v){this._le=+v;E.push(['k',this.id,'loopEnd',+v])}}
 class VCS extends VS{constructor(){super('const');this.offset=new VP(this,'offset',1)}}
 class VG extends VN{constructor(){super('gain');this.gain=new VP(this,'gain',1)}}
 class VB extends VN{constructor(){super('biquad');this.frequency=new VP(this,'frequency',350);this.Q=new VP(this,'Q',1);this.gain=new VP(this,'gain',0);this.detune=new VP(this,'detune',0);this._t='lowpass'}
  get type(){return this._t}set type(v){this._t=v;E.push(['k',this.id,'type',v])}}
 class VW extends VN{constructor(){super('shaper');this._c=null;this._o='none'}
  get curve(){return this._c}set curve(c){this._c=c;E.push(['k',this.id,'curve',c?E.res(c,'curve'):0])}
  get oversample(){return this._o}set oversample(v){this._o=v}}
 class VPn extends VN{constructor(){super('pan');this.pan=new VP(this,'pan',0)}}
 class VD extends VN{constructor(m){super('delay',0);this.delayTime=new VP(this,'delayTime',0);E.push(['k',this.id,'max',+m||1])}}
 const no=n=>()=>{throw new Error('engine: '+n+' is played natively')};
 class OrbVC{get currentTime(){return now()}get sampleRate(){return E.real.sampleRate}get state(){return E.real.state}get destination(){return E.real.destination}get __virtual(){return true}
  get baseLatency(){return E.real.baseLatency}get listener(){return E.real.listener}get audioWorklet(){return E.real.audioWorklet}
  createOscillator(){return new VO}createGain(){return new VG}createBiquadFilter(){return new VB}createWaveShaper(){return new VW}createStereoPanner(){return new VPn}
  createBufferSource(){return new VBS}createConstantSource(){return new VCS}createDelay(m){return new VD(m)}
  createPeriodicWave(re,im,o){return{__re:Float32Array.from(re),__im:Float32Array.from(im),__nn:!!(o&&o.disableNormalization)}}
  createBuffer(c,l,s){return E.real.createBuffer(c,l,s)}
  resume(){return E.real.resume()}suspend(){return E.real.suspend()}}
 ['createAnalyser','createConvolver','createChannelSplitter','createChannelMerger','createDynamicsCompressor','createScriptProcessor','createIIRFilter','createPanner','createMediaStreamDestination'].forEach(n=>OrbVC.prototype[n]=no(n));
 window.OrbVC=OrbVC;E.VN=VN;E.VP=VP;
})();
</script>
