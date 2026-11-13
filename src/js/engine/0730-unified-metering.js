/* ---- UNIFIED METERING. One 250 ms pass and one shared Float32Array(2048) serve every master diagnostic: the NaN watchdog, the silence
   watchdog, the safety-loop silence check, the headroom keeper and the Master+ loudness / peak meter. Two engine taps (mix bus, post-filter bus)
   are read at most once per pass and their figures shared; each job keeps its own cadence (every Nth pass) and its own logic. ---- */
const METER={buf:new Float32Array(2048),v1k:null,n:0,jobs:[],T:{},
 every(n,fn){this.jobs.push([n,fn])},
 read(an,size){const v=size===1024?(this.v1k||(this.v1k=this.buf.subarray(0,1024))):this.buf;an.getFloatTimeDomainData(v);return v},   // valid until the next read
 tap(name,node,size){let t=this.T[name];if(!t||t.ctx!==ctx||t.src!==node){if(t)try{t.src.disconnect(t.an)}catch(e){}const an=ctx.createAnalyser();an.fftSize=size;node.connect(an);t=this.T[name]={an,ctx,src:node,at:-1,sum:0,nan:false,peak:0}}return t},
 /* post-filter bus (what goes into the master chain): sum of squares (every 4th sample) and a non-finite flag */
 post(){const t=this.tap('post',A.sg||A.m,1024);if(t.at!==this.n){t.at=this.n;const b=this.read(t.an,1024);let s=0,nan=false;for(let i=0;i<1024;i+=4){const v=b[i];if(v!==v||v===Infinity||v===-Infinity)nan=true;s+=v*v}t.sum=s;t.nan=nan}return t},
 /* mix bus: plain peak */
 mix(){const t=this.tap('mix',A.m,1024);if(t.at!==this.n){t.at=this.n;const b=this.read(t.an,1024);let p=0;for(let i=0;i<1024;i++){const v=b[i]<0?-b[i]:b[i];if(v>p)p=v}t.peak=p}return t}};
setInterval(()=>{METER.n++;const J=METER.jobs;for(let i=0;i<J.length;i++)if(METER.n%J[i][0]===0)try{J[i][1]()}catch(e){}},250);
