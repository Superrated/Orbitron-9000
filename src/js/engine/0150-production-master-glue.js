/* ---- v12: production engine — master glue/clip/limit, groove, song mode, smarter generator ---- */
Object.assign(G,{glue:.45,clip:.3,groove:.6,bavoid:true});
const HH={g:null};
const CLC={};function clipCurve(dr){const kk=Math.round(dr*1000);if(CLC[kk])return CLC[kk];return CLC[kk]=clipCurve0(dr)}
function clipCurve0(dr){const n=2048,c=new Float32Array(n),k=.3+3*dr,nm=Math.tanh(k);for(let i=0;i<n;i++){const x=2*(i/(n-1)*2-1);c[i]=Math.tanh(x*k)/nm}return c} /* v0.22: covers ±2 (input is padded by 6 dB) */
function wsCurve2(){const n=2048,c=new Float32Array(n);for(let i=0;i<n;i++){const x=2*(i/(n-1)*2-1);c[i]=Math.tanh(x)}return c}
/* v0.8 quick win: curves are cached — a few voices asked for a fresh 1024-point table on every note (assigning .curve copies it, so sharing is safe) */
let SATC={},SATN=0;function satCurve(k){const key=+k;if(SATC[key])return SATC[key];if(++SATN>200){SATC={};SATN=1}const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(x*k)/k}return SATC[key]=c}
/* damped stereo room/hall: pre-delay, sparse early reflections, exponential tail whose highs die faster */
function ir2(sec,pre){const sr=ctx.sampleRate,n=Math.floor(sr*sec),b=ctx.createBuffer(2,n,sr),P=Math.floor(sr*pre);let ref=(window.__irRef&&__irRef.sr===sr)?__irRef.v:0;if(!ref){const o=ir(3.2,2.4,.3).getChannelData(0);for(let i=0;i<o.length;i++)ref+=o[i]*o[i];window.__irRef={sr,v:ref}} /* v0.34: computed once */
 let en=0;for(let c=0;c<2;c++){const d=b.getChannelData(c);let y=0;for(let i=P;i<n;i++){const t=(i-P)/(n-P),a=.85-.7*t;y+=((R()*2-1)-y)*a;d[i]=y*Math.exp(-6.2*t)}
  for(let j=0;j<7;j++){const at=P+Math.floor(sr*(.004+R()*.045)),gg=(.55-j*.06)*(R()<.5?-1:1);if(at<n)d[at]+=gg}for(let i=0;i<n;i++)en+=d[i]*d[i]}
 const s=Math.sqrt(ref*2/en);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]*=s}return b}
/* extra sound knobs */
TR[0].p.click=1;TR[0].x.push(['Click','click',0,2,.01]);
TR[1].p.metal=.6;TR[1].x.push(['Metal','metal',0,1,.01]);
/* groove: per-step velocity templates (per beat position) + micro-timing; bass steps around the kick */
const GRV={1:[.55,.35,1,.42],3:[1,.68,.85,.74],4:[1,.72,.9,.8],6:[1,.78,.92,.84],7:[1,.62,.8,.66],8:[1,.85,.9,.85]};
const _fire=fire;fire=function(k,w){if(k===6&&G.bavoid){const K=TR[0];if(!K.m&&K.pt[tk%K.st])return}
 const T=TR[k],g=G.groove||0,tp=GRV[k];if(!tp||g<.01)return _fire(k,w);const s=tk%4,vel=Math.max(.12,1-g*(1-tp[s])+(R()-.5)*.1*g),o=T.lv;let dt=0;
 if(window.__feelOff){}else if(k===1&&s===2)dt=.005*g;else if(k===7)dt=.003*g;else if(k===3)dt=(R()-.5)*.006*g;if(window.__feelA!=null)dt*=__feelA;T.lv=o*vel;try{_fire(k,w+dt)}finally{T.lv=o}};
/* kick tuned to the key: root or fifth, whichever sits nearest the mood's kick pitch */
function tuneKick(){const p=TR[0].p;let best=p.pitch,bd=1e9;[0,7].forEach(iv=>{for(let o=1;o<7;o++){const f=440*Math.pow(2,(G.root+iv+12*o-69)/12);if(f>=36&&f<=70){const d=Math.abs(Math.log2(f/p.pitch))+(iv?.04:0);if(d<bd){bd=d;best=f}}}});p.pitch=Math.round(best*10)/10}
function arrStep(){}
/* mix: groove + master glue + loudness */
const _mix=mix;mix=function(){_mix();const m=$('#mix');sl(m,'Groove',0,1,G.groove,.01,v=>G.groove=v);sl(m,'Glue',0,1,G.glue,.01,v=>{G.glue=v;A.glue&&(A.glue.threshold.value=-3-12*v)});sl(m,'Loudness',0,1,G.clip,.01,v=>{G.clip=v;A.clip&&(A.clip.curve=clipCurve(v))})};
/* generator: groove + swing per style, rolling bass that steps around the kick, key-tuned kick */
const _gen=generate;generate=function(){_gen();const M=MOODS[curMood],hard=!!(M.acid||M.power);
 G.groove=hard?.4+R()*.2:.55+R()*.3;G.swing=hard?R()*.04:.04+R()*.1;G.bavoid=true;
 const T6=TR[6];if(R()<(hard?.65:.3)){Object.assign(T6,{st:16,h:pick([11,12,13]),r:0});T6.pt=pat(T6);T6.p.dec=Math.min(T6.p.dec||.2,.13)}
 tuneKick();syncMix();build()};
/* keep the ping-pong halves in step (feedback + delay time) */
setInterval(()=>{if(!A.dF2)return;const t=ctx.currentTime;A.dF2.gain.setTargetAtTime(A.dF.gain.value,t,.02);const dt=A.dl.delayTime.value;if(Math.abs(A.dl2.delayTime.value-dt)>1e-3)A.dl2.delayTime.setTargetAtTime(dt,t,.05)},30);
