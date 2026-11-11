/* Orbitron engine — AudioWorklet processor. Plays per-note voice graphs described by the main thread with Web Audio semantics. */
const SR=sampleRate,BL=128,NYQ=SR/2,TN=2048,TM=TN-1,TWO_PI=Math.PI*2;
// ---------- wavetables (band-limited, like Web Audio's PeriodicWave) ----------
function ifft(re,im){const n=re.length;for(let i=1,j=0;i<n;i++){let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;if(i<j){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t}}
 for(let len=2;len<=n;len<<=1){const a=TWO_PI/len,wr=Math.cos(a),wi=Math.sin(a),h=len>>1;for(let i=0;i<n;i+=len){let cr=1,ci=0;for(let j=0;j<h;j++){const p=i+j,k=p+h,vr=re[k]*cr-im[k]*ci,vi=re[k]*ci+im[k]*cr;re[k]=re[p]-vr;im[k]=im[p]-vi;re[p]+=vr;im[p]+=vi;const t=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=t}}}}
class Wave{constructor(re,im,nn){this.re=re;this.im=im;this.H=Math.min(Math.max(re.length,im.length)-1,TN/2-1);this.tabs=new Map();this.sc=1;
  if(!nn){const t=this.build(this.H);let m=0;for(let i=0;i<TN;i++)m=Math.max(m,Math.abs(t[i]));this.sc=m>0?1/m:1;for(let i=0;i<TN;i++)t[i]*=this.sc;this.tabs.set(this.lvl(this.H),t)}}
 lvl(h){return Math.max(0,Math.min(Math.ceil(Math.log2(Math.max(1,this.H))*3),Math.floor(Math.log2(Math.max(1,h))*3)))}
 build(h){const re=new Float64Array(TN),im=new Float64Array(TN),R=this.re,I=this.im;for(let k=1;k<=h;k++){re[k]=k<R.length?R[k]:0;im[k]=-(k<I.length?I[k]:0)}ifft(re,im);const t=new Float32Array(TN);for(let i=0;i<TN;i++)t[i]=re[i]*this.sc;return t}
 table(f){const a=Math.floor(NYQ/Math.max(1e-3,Math.abs(f))),l=this.lvl(Math.min(a,this.H));let t=this.tabs.get(l);if(!t){t=this.build(Math.max(1,Math.min(this.H,Math.floor(Math.pow(2,l/3)))));this.tabs.set(l,t)}return t}}
const BUILTIN={};
function builtin(ty){if(BUILTIN[ty])return BUILTIN[ty];const n=TN/2,re=new Float32Array(n),im=new Float32Array(n);
 for(let k=1;k<n;k++){const pk=Math.PI*k;if(ty==='sine'){if(k===1)im[k]=1}else if(ty==='square')im[k]=(2/pk)*(1-(k&1?-1:1));else if(ty==='sawtooth')im[k]=(2/pk)*(k&1?1:-1);else if(ty==='triangle')im[k]=(k&1)?(8/(pk*pk))*(((k-1)>>1)&1?-1:1):0}
 return BUILTIN[ty]=new Wave(re,im,false)}
// ---------- resources ----------
const RES=new Map();
// ---------- audio params (Web Audio automation rules) ----------
class Param{constructor(v){this.v=v;this.ev=null;this.inp=null;this.buf=null}
 add(ty,v,t,c,ins){if(ty===4){if(this.ev){this.ev=this.ev.filter(e=>e.t<t);if(!this.ev.length)this.ev=null}return}
  if(ty===5){const h=this.at(t);if(this.ev){this.ev=this.ev.filter(e=>e.t<t)}(this.ev||(this.ev=[])).push({k:0,v:h,t,c:0,ins});return}
  const e={k:ty,v,t,c,ins};const ev=this.ev||(this.ev=[]);let i=ev.length;while(i>0&&ev[i-1].t>t)i--;ev.splice(i,0,e);for(const x of ev)x.sv=undefined}
 sv(i){const e=this.ev[i];if(e.sv===undefined)e.sv=this.atBefore(e.t,i);return e.sv}
 atBefore(t,lim){const ev=this.ev;let j=0;while(j<lim&&ev[j].t<t)j++;return this.calc(t,j,lim)}
 at(t){const ev=this.ev;if(!ev)return this.v;let j=0;while(j<ev.length&&ev[j].t<=t)j++;return this.calc(t,j,ev.length)}
 calc(t,j,lim){const ev=this.ev,nx=j<lim?ev[j]:null,pv=j>0?ev[j-1]:null;
  if(nx&&(nx.k===1||nx.k===2)){let v0,t0;if(pv){t0=pv.t;v0=pv.k===3?this.tgt(pv,j-1,pv.t):pv.v}else{t0=Math.min(nx.ins,nx.t);v0=this.v}
   const d=nx.t-t0;if(d<=0)return nx.v;const x=Math.max(0,Math.min(1,(t-t0)/d));if(nx.k===1)return v0+(nx.v-v0)*x;if(v0*nx.v<=0||v0===0)return v0;return v0*Math.pow(nx.v/v0,x)}
  if(pv){if(pv.k===3)return this.tgt(pv,j-1,t);return pv.v}return this.v}
 tgt(e,i,t){const s=this.sv(i);return e.v+(s-e.v)*Math.exp(-(t-e.t)/e.c)}
 // value(s) for this block: a number when constant, else a Float32Array
 get(t0,bi){const ev=this.ev;let out;
  if(ev){const last=ev[ev.length-1];
   if(last.t<=t0&&last.k!==3){this.v=last.v;this.ev=null;out=this.v}
   else if(last.k===3&&last.t<=t0&&(t0-last.t)>last.c*12&&ev.every(e=>e.t<=t0)){this.v=last.v;this.ev=null;out=this.v}
   else if(ev[0].t>t0+BL/SR&&!(ev[0].k===1||ev[0].k===2)){out=this.v}
   else{const b=this.buf||(this.buf=new Float32Array(BL));const n=ev.length;let i=0;let j=0;while(j<n&&ev[j].t<=t0)j++;
    while(i<BL){const t=t0+i/SR;while(j<n&&ev[j].t<=t)j++;const nx=j<n?ev[j]:null,pv=j>0?ev[j-1]:null;
     let iend=nx?Math.min(BL,Math.max(i+1,Math.ceil((nx.t-t0)*SR-1e-9))):BL;
     const v=this.calc(t,j,n);b[i]=v;
     if(nx&&(nx.k===1||nx.k===2)){let t0r,v0;if(pv){t0r=pv.t;v0=pv.k===3?this.tgt(pv,j-1,pv.t):pv.v}else{t0r=Math.min(nx.ins,nx.t);v0=this.v}const d=(nx.t-t0r)*SR;
      if(nx.k===1){const st=d>0?(nx.v-v0)/d:0;let x=v;for(let k=i+1;k<iend;k++){x+=st;b[k]=x}}
      else if(v0*nx.v>0&&v0!==0&&d>0){const r=Math.pow(nx.v/v0,1/d);let x=v;for(let k=i+1;k<iend;k++){x*=r;b[k]=x}}else for(let k=i+1;k<iend;k++)b[k]=v}
     else if(pv&&pv.k===3){const kk=Math.exp(-1/(SR*pv.c)),tg=pv.v;let x=v;for(let k=i+1;k<iend;k++){x=tg+(x-tg)*kk;b[k]=x}}
     else for(let k=i+1;k<iend;k++)b[k]=v;
     i=iend}
    out=b}}
  else out=this.v;
  if(this.inp&&this.inp.length){let b;if(typeof out==='number'){b=this.buf||(this.buf=new Float32Array(BL));b.fill(out)}else b=out;let any=false;
   for(const s of this.inp){const o=render(s,bi,t0);if(s.sil)continue;any=true;const c0=o[0];if(s.ch===2){const c1=o[1];for(let i=0;i<BL;i++)b[i]+=(c0[i]+c1[i])*.5}else for(let i=0;i<BL;i++)b[i]+=c0[i]}
   if(!any&&typeof out==='number')return out;return b}
  return out}}
// ---------- nodes ----------
const NODES=new Map(),BATCH=new Map(),LINKS=[];let curB=null,blockNo=0;
const PDEF={osc:{frequency:440,detune:0},buf:{playbackRate:1,detune:0},const:{offset:1},gain:{gain:1},biquad:{frequency:350,Q:1,gain:0,detune:0},pan:{pan:0},delay:{delayTime:0},shaper:{}};
function mk(id,ty){const n={id,ty,inp:[],P:{},out:null,ch:1,bi:-1,sil:true,st:Infinity,sp:Infinity,type:ty==='biquad'?'lowpass':'sine',busy:false,b:curB};
 const d=PDEF[ty]||{};for(const k in d)n.P[k]=new Param(d[k]);
 if(ty==='osc'){n.wave=builtin('sine');n.ph=0}else if(ty==='biquad'){n.z=[0,0,0,0,0,0,0,0];n.cf=null}else if(ty==='buf'){n.pos=0;n.loop=0;n.ls=0;n.le=0}else if(ty==='delay'){n.max=1}
 NODES.set(id,n);if(curB){curB.nodes.push(n);if(ty==='osc'||ty==='buf'||ty==='const')curB.src.push(n);if(ty==='delay')curB.tail=Math.max(curB.tail,2)}return n}
function outBuf(n,ch){if(!n.own||n.own.length<ch){n.own=[];for(let c=0;c<ch;c++)n.own.push(new Float32Array(BL))}n.out=n.own;return n.out}
function zero(n){n.sil=true;n.ch=n.ch||1;if(n.zf&&n.out===n.own&&n.own&&n.own.length>=n.ch)return n.out;const o=outBuf(n,Math.max(1,n.ch));for(const c of o)c.fill(0);n.zf=true;return o}
function input(n,bi,t0){// fast path: single input used directly
 let live=null,cnt=0;for(const s of n.inp){render(s,bi,t0);if(!s.sil){live=s;cnt++}}if(!cnt)return null;if(cnt===1){const o=live.out;o.ch=live.ch;return o}
 const ch=n.inp.reduce((a,s)=>s.sil?a:Math.max(a,s.ch),1),m=n.mix||(n.mix=[new Float32Array(BL),new Float32Array(BL)]);m[0].fill(0);m[1].fill(0);
 for(const s of n.inp){if(s.sil)continue;const o=s.out;if(s.ch===1){const a=o[0],L=m[0];for(let i=0;i<BL;i++)L[i]+=a[i];if(ch>1){const Rr=m[1];for(let i=0;i<BL;i++)Rr[i]+=a[i]}}else{const a=o[0],b=o[1],L=m[0],Rr=m[1];for(let i=0;i<BL;i++){L[i]+=a[i];Rr[i]+=b[i]}}}
 m.ch=ch;return m}
function coef(ty,f,Q,g){let cut=Math.max(0,Math.min(1,f/NYQ));let b0=1,b1=0,b2=0,a1=0,a2=0;const w=Math.PI*cut,cs=Math.cos(w),sn=Math.sin(w);
 switch(ty){case'lowpass':if(cut>=1){}else if(cut<=0){b0=0}else{const r=Math.pow(10,Q*.05),al=sn/(2*r),be=(1-cs)/2,a0=1+al;b0=be/a0;b1=2*be/a0;b2=be/a0;a1=-2*cs/a0;a2=(1-al)/a0}break;
  case'highpass':if(cut>=1){b0=0}else if(cut<=0){}else{const r=Math.pow(10,Q*.05),al=sn/(2*r),be=(1+cs)/2,a0=1+al;b0=be/a0;b1=-2*be/a0;b2=be/a0;a1=-2*cs/a0;a2=(1-al)/a0}break;
  case'bandpass':if(cut>0&&cut<1){if(Q>0){const al=sn/(2*Q),a0=1+al;b0=al/a0;b1=0;b2=-al/a0;a1=-2*cs/a0;a2=(1-al)/a0}}else b0=0;break;
  case'peaking':{const A=Math.pow(10,g/40);if(cut>0&&cut<1){if(Q>0){const al=sn/(2*Q),a0=1+al/A;b0=(1+al*A)/a0;b1=-2*cs/a0;b2=(1-al*A)/a0;a1=-2*cs/a0;a2=(1-al/A)/a0}else b0=A*A}break}
  case'lowshelf':{const A=Math.pow(10,g/40);if(cut>=1)b0=A*A;else if(cut>0){const al=.5*sn*Math.SQRT2,k2=2*Math.sqrt(A)*al,a0=(A+1)+(A-1)*cs+k2;b0=A*((A+1)-(A-1)*cs+k2)/a0;b1=2*A*((A-1)-(A+1)*cs)/a0;b2=A*((A+1)-(A-1)*cs-k2)/a0;a1=-2*((A-1)+(A+1)*cs)/a0;a2=((A+1)+(A-1)*cs-k2)/a0}break}
  case'highshelf':{const A=Math.pow(10,g/40);if(cut>=1){}else if(cut<=0)b0=A*A;else{const al=.5*sn*Math.SQRT2,k2=2*Math.sqrt(A)*al,a0=(A+1)-(A-1)*cs+k2;b0=A*((A+1)+(A-1)*cs+k2)/a0;b1=-2*A*((A-1)+(A+1)*cs)/a0;b2=A*((A+1)+(A-1)*cs-k2)/a0;a1=2*((A-1)-(A+1)*cs)/a0;a2=((A+1)-(A-1)*cs-k2)/a0}break}
  case'notch':if(cut>0&&cut<1){if(Q>0){const al=sn/(2*Q),a0=1+al;b0=1/a0;b1=-2*cs/a0;b2=1/a0;a1=-2*cs/a0;a2=(1-al)/a0}else b0=0}break;
  case'allpass':if(cut>0&&cut<1){if(Q>0){const al=sn/(2*Q),a0=1+al;b0=(1-al)/a0;b1=-2*cs/a0;b2=(1+al)/a0;a1=-2*cs/a0;a2=(1-al)/a0}else b0=-1}break}
 return[b0,b1,b2,a1,a2]}
const pv=(x,i)=>typeof x==='number'?x:x[i];
function render(n,bi,t0){if(n.bi===bi)return n.out;if(n.busy){return n.out||zero(n)}n.busy=true;n.bi=bi;try{proc(n,bi,t0)}finally{n.busy=false}if(!n.sil)n.zf=false;return n.out}
function proc(n,bi,t0){const t1=t0+BL/SR;
 switch(n.ty){
 case'osc':case'const':case'buf':{if(t1<=n.st||t0>=n.sp){if(t0>=n.sp)n.done=true;zero(n);return}
  const s0=Math.max(0,Math.ceil((n.st-t0)*SR-1e-9)),s1=Math.min(BL,Math.ceil((n.sp-t0)*SR-1e-9));
  if(n.ty==='osc'){const o=outBuf(n,1)[0];n.ch=1;n.sil=false;const F=n.P.frequency.get(t0,bi),D=n.P.detune.get(t0,bi),tab=n.wave.table(pv(F,s0)*Math.pow(2,pv(D,s0)/1200));let ph=n.ph;
   if(typeof F==='number'&&typeof D==='number'){const inc=F*Math.pow(2,D/1200)/SR;for(let i=0;i<BL;i++){if(i<s0||i>=s1){o[i]=0;continue}const x=ph*TN,k=x|0,fr=x-k;o[i]=tab[k&TM]+(tab[(k+1)&TM]-tab[k&TM])*fr;ph+=inc;ph-=Math.floor(ph)}}
   else{const dm=typeof D==='number'?Math.pow(2,D/1200):0;for(let i=0;i<BL;i++){if(i<s0||i>=s1){o[i]=0;continue}const x=ph*TN,k=x|0,fr=x-k;o[i]=tab[k&TM]+(tab[(k+1)&TM]-tab[k&TM])*fr;ph+=pv(F,i)*(dm||Math.pow(2,D[i]/1200))/SR;ph-=Math.floor(ph)}}
   n.ph=ph;return}
  if(n.ty==='const'){const o=outBuf(n,1)[0];n.ch=1;n.sil=false;const V=n.P.offset.get(t0,bi);for(let i=0;i<BL;i++)o[i]=(i<s0||i>=s1)?0:pv(V,i);return}
  {const B=n.buf;if(!B){zero(n);return}const nc=B.ch.length,o=outBuf(n,nc),len=B.ch[0].length;n.ch=nc;n.sil=false;B.used=currentTime;
   const PR=n.P.playbackRate.get(t0,bi),DT=n.P.detune.get(t0,bi),rate=pv(PR,0)*Math.pow(2,pv(DT,0)/1200)*B.sr/SR;
   const ls=n.loop&&n.le>0?Math.max(0,Math.floor(n.ls*B.sr)):0,le=n.loop&&n.le>0?Math.min(len,Math.floor(n.le*B.sr)):len;let pos=n.pos;
   for(let c=0;c<nc;c++){const d=B.ch[c],oc=o[c];let p=pos;for(let i=0;i<BL;i++){if(i<s0||i>=s1||(!n.loop&&p>=len)){oc[i]=0;continue}if(n.loop&&p>=le)p=ls+((p-ls)%Math.max(1,le-ls));const k=p|0,fr=p-k,a=d[k],b=k+1<len?d[k+1]:(n.loop?d[ls]:0);oc[i]=a+(b-a)*fr;p+=rate}
    if(c===nc-1)pos=p}
   n.pos=pos;if(!n.loop&&pos>=len&&n.sp>t1)n.sp=t1;return}}
 case'gain':{const I=input(n,bi,t0);if(!I){n.sil=true;n.ch=1;zero(n);return}const ch=I.ch,o=outBuf(n,ch);n.ch=ch;n.sil=false;const G=n.P.gain.get(t0,bi);
  if(typeof G==='number'){if(G===0){zero(n);n.sil=true;return}if(G===1){n.out=I;n.ch=ch;return}for(let c=0;c<ch;c++){const a=I[c],b=o[c];for(let i=0;i<BL;i++)b[i]=a[i]*G}}else for(let c=0;c<ch;c++){const a=I[c],b=o[c];for(let i=0;i<BL;i++)b[i]=a[i]*G[i]}return}
 case'biquad':{const I=input(n,bi,t0),z=n.z;if(!I){if(Math.abs(z[0])+Math.abs(z[1])+Math.abs(z[2])+Math.abs(z[3])+Math.abs(z[4])+Math.abs(z[5])+Math.abs(z[6])+Math.abs(z[7])<1e-9){n.sil=true;zero(n);return}}
  const ch=I?I.ch:n.ch||1,o=outBuf(n,ch);n.ch=ch;n.sil=false;const F=n.P.frequency.get(t0,bi),Q=n.P.Q.get(t0,bi),Gn=n.P.gain.get(t0,bi),D=n.P.detune.get(t0,bi),cst=typeof F==='number'&&typeof Q==='number'&&typeof Gn==='number'&&typeof D==='number';
  let c=n.cf;if(cst){if(!c||n.cF!==F||n.cQ!==Q||n.cG!==Gn||n.cD!==D||n.cT!==n.type){c=n.cf=coef(n.type,F*Math.pow(2,D/1200),Q,Gn);n.cF=F;n.cQ=Q;n.cG=Gn;n.cD=D;n.cT=n.type}}
  for(let s=0;s<BL;s+=32){if(!cst){c=coef(n.type,pv(F,s)*Math.pow(2,pv(D,s)/1200),pv(Q,s),pv(Gn,s));n.cf=c;n.cF=NaN}const b0=c[0],b1=c[1],b2=c[2],a1=c[3],a2=c[4];
   for(let k=0;k<ch;k++){const a=I?I[k]:null,b=o[k],zi=k*4;let x1=z[zi],x2=z[zi+1],y1=z[zi+2],y2=z[zi+3];for(let i=s;i<s+32;i++){const x=a?a[i]:0,y=b0*x+b1*x1+b2*x2-a1*y1-a2*y2;x2=x1;x1=x;y2=y1;y1=(y>-1e-20&&y<1e-20)?0:y;b[i]=y1}z[zi]=x1;z[zi+1]=x2;z[zi+2]=y1;z[zi+3]=y2}}
  return}
 case'shaper':{const I=input(n,bi,t0);if(!I){n.sil=true;zero(n);return}const ch=I.ch,o=outBuf(n,ch);n.ch=ch;n.sil=false;const C=n.curve;
  if(!C){for(let k=0;k<ch;k++)o[k].set(I[k]);return}const N=C.length-1;
  for(let k=0;k<ch;k++){const a=I[k],b=o[k];for(let i=0;i<BL;i++){const v=(a[i]+1)*.5*N;if(v<=0)b[i]=C[0];else if(v>=N)b[i]=C[N];else{const j=v|0;b[i]=C[j]+(C[j+1]-C[j])*(v-j)}}}return}
 case'pan':{const I=input(n,bi,t0);if(!I){n.sil=true;n.ch=2;zero(n);return}const o=outBuf(n,2);n.ch=2;n.sil=false;const P=n.P.pan.get(t0,bi),L=o[0],Rr=o[1];
  if(I.ch===1){const a=I[0];if(typeof P==='number'){const x=(Math.max(-1,Math.min(1,P))+1)*.5,gl=Math.cos(x*Math.PI/2),gr=Math.sin(x*Math.PI/2);for(let i=0;i<BL;i++){L[i]=a[i]*gl;Rr[i]=a[i]*gr}}
   else for(let i=0;i<BL;i++){const x=(Math.max(-1,Math.min(1,P[i]))+1)*.5;L[i]=a[i]*Math.cos(x*Math.PI/2);Rr[i]=a[i]*Math.sin(x*Math.PI/2)}}
  else{const a=I[0],b=I[1];for(let i=0;i<BL;i++){const p=Math.max(-1,Math.min(1,pv(P,i)));if(p<=0){const x=p+1;L[i]=a[i]+b[i]*Math.cos(x*Math.PI/2);Rr[i]=b[i]*Math.sin(x*Math.PI/2)}else{const x=p;L[i]=a[i]*Math.cos(x*Math.PI/2);Rr[i]=b[i]+a[i]*Math.sin(x*Math.PI/2)}}}
  return}
 case'delay':{const I=input(n,bi,t0);if(!n.dl){const sz=Math.ceil(n.max*SR)+BL+4;n.dl=[new Float32Array(sz),new Float32Array(sz)];n.wp=0;n.dch=1;n.quiet=0}
  const ch=Math.max(I?I.ch:1,n.dch);n.dch=ch;const sz=n.dl[0].length,T=n.P.delayTime.get(t0,bi),o=outBuf(n,ch);n.ch=ch;
  if(!I){n.quiet+=BL;if(n.quiet>sz){n.sil=true;zero(n);return}}else n.quiet=0;n.sil=false;
  for(let k=0;k<ch;k++){const d=n.dl[k],a=I?(I.ch===1?I[0]:I[k]):null,b=o[k];let w=n.wp;for(let i=0;i<BL;i++){d[w]=a?a[i]:0;const dt=Math.max(0,Math.min(n.max,pv(T,i)))*SR;let r=w-dt;if(r<0)r+=sz;const j=r|0,fr=r-j,j2=j+1>=sz?0:j+1;b[i]=d[j]+(d[j2]-d[j])*fr;w=w+1>=sz?0:w+1}if(k===ch-1)n.wp=w}
  return}}
 zero(n)}
// ---------- processor ----------
class OrbEngine extends AudioWorkletProcessor{
 constructor(){super();this.port.onmessage=e=>{try{this.ops(e.data)}catch(x){this.port.postMessage({err:String(x&&x.stack||x)})}};this.lastGC=0;this.lastEv=0}
 ops(q){for(const op of q){const ty=op[0];
  if(ty==='n'){mk(op[1],op[2])}
  else if(ty==='pv'){const n=NODES.get(op[1]);if(n&&n.P[op[2]]){const p=n.P[op[2]];if(!p.ev)p.v=op[3];else p.add(0,op[3],currentTime,0,currentTime)}}
  else if(ty==='pa'){const n=NODES.get(op[1]);if(n&&n.P[op[2]])n.P[op[2]].add(op[3],op[4],op[5],op[6],op[7])}
  else if(ty==='c'){const s=NODES.get(op[1]);if(!s)continue;if(op[2]<0){LINKS.push({n:s,p:-1-op[2]});continue}const d=NODES.get(op[2]);if(!d)continue;
   if(op[3]){const p=d.P[op[3]];if(p&&!(p.inp||(p.inp=[])).includes(s))p.inp.push(s)}else if(!d.inp.includes(s))d.inp.push(s);
   if(s.b&&d.b&&s.b!==d.b){d.b.keep=s.b}}
  else if(ty==='d'){const s=NODES.get(op[1]);if(!s)continue;const rm=d=>{if(op[3]){const p=d.P[op[3]];if(p&&p.inp)p.inp=p.inp.filter(x=>x!==s)}else d.inp=d.inp.filter(x=>x!==s)};
   if(op[2]){const d=NODES.get(op[2]);if(d)rm(d)}else{for(const d of NODES.values()){if(d.inp.includes(s))d.inp=d.inp.filter(x=>x!==s);for(const k in d.P){const p=d.P[k];if(p.inp&&p.inp.includes(s))p.inp=p.inp.filter(x=>x!==s)}}for(let i=LINKS.length-1;i>=0;i--)if(LINKS[i].n===s)LINKS.splice(i,1)}}
  else if(ty==='s'){const n=NODES.get(op[1]);if(!n)continue;n.st=op[2];if(n.ty==='buf'&&n.buf){n.pos=op[3]*n.buf.sr;if(op[4]>=0)n.sp=Math.min(n.sp,op[2]+op[4])}if(n.b)n.b.start=Math.min(n.b.start,op[2])}
  else if(ty==='x'){const n=NODES.get(op[1]);if(n)n.sp=op[2]}
  else if(ty==='k'){const n=NODES.get(op[1]);if(!n)continue;const k=op[2],v=op[3];
   if(k==='type'){if(n.ty==='osc'){if(v!=='custom')n.wave=builtin(v)}else n.type=v}
   else if(k==='pw'){const r=RES.get(v);if(r){if(!r.wave)r.wave=new Wave(r.re,r.im,r.nn);n.wave=r.wave;r.used=currentTime}}
   else if(k==='buffer'){const r=RES.get(v);n.buf=r||null;if(r)r.used=currentTime}
   else if(k==='curve'){const r=RES.get(v);n.curve=r?r.d:null;if(r)r.used=currentTime}
   else if(k==='loop')n.loop=v;else if(k==='loopStart')n.ls=v;else if(k==='loopEnd')n.le=v;else if(k==='max')n.max=Math.max(.001,Math.min(5,v))}
  else if(ty==='r'){const id=op[1],k=op[2];if(k==='curve')RES.set(id,{d:op[3],used:currentTime});else if(k==='buf')RES.set(id,{ch:op[3],sr:op[4],used:currentTime});else RES.set(id,{re:op[3],im:op[4],nn:!!op[5],used:currentTime})}
  else if(ty==='b'){curB={id:op[1],nodes:[],src:[],start:Infinity,tail:.6,open:true,born:currentTime};BATCH.set(op[1],curB)}
  else if(ty==='e'){if(curB)curB.open=false;curB=null}
  else if(ty==='kill'){const b=BATCH.get(op[1]);if(b)this.free(b);curB=null}}}
 free(b){for(const n of b.nodes){NODES.delete(n.id);n.dead=true}BATCH.delete(b.id);for(let i=LINKS.length-1;i>=0;i--)if(LINKS[i].n.dead)LINKS.splice(i,1)}
 gc(){const t=currentTime,dead=[];for(const b of BATCH.values()){if(b.open)continue;let end=-1;for(const s of b.src)end=Math.max(end,s.sp);
   if(!b.src.length)end=b.born+1;if((end+b.tail<t&&!(b.keep&&BATCH.has(b.keep.id)&&false))||t-b.born>180)dead.push(b)}
  if(dead.length){for(const b of dead){for(const n of b.nodes){NODES.delete(n.id);n.dead=true}BATCH.delete(b.id)}
   for(let i=LINKS.length-1;i>=0;i--)if(LINKS[i].n.dead)LINKS.splice(i,1);
   for(const n of NODES.values()){if(n.inp.length&&n.inp.some(x=>x.dead))n.inp=n.inp.filter(x=>!x.dead);for(const k in n.P){const p=n.P[k];if(p.inp&&p.inp.some(x=>x.dead))p.inp=p.inp.filter(x=>!x.dead)}}}
  // resources nobody used for 2 minutes
  if(t-this.lastEv>10){this.lastEv=t;const ev=[];for(const [id,r] of RES)if(t-r.used>120){let live=false;for(const n of NODES.values())if(n.buf===r||n.curve===r.d||(r.wave&&n.wave===r.wave)){live=true;r.used=t;break}if(!live){RES.delete(id);ev.push(id)}}if(ev.length)this.port.postMessage({ev})}}
 process(inputs,outputs){const t0=currentTime,bi=++blockNo;
  for(const o of outputs)for(const c of o)c.fill(0);
  for(let i=0;i<LINKS.length;i++){const L=LINKS[i],n=L.n,b=n.b;if(b&&b.src.length&&b.start>t0+BL/SR+.003)continue;const o=render(n,bi,t0);if(n.sil)continue;const out=outputs[L.p];if(!out||!out.length)continue;
   const A=out[0],B=out[1]||out[0];if(n.ch===1){const a=o[0];for(let k=0;k<BL;k++){A[k]+=a[k];B[k]+=a[k]}}else{const a=o[0],c=o[1];for(let k=0;k<BL;k++){A[k]+=a[k];B[k]+=c[k]}}}
  if(bi-this.lastGC>=8){this.lastGC=bi;this.gc();if(bi%750===0)this.port.postMessage({st:{nodes:NODES.size,batches:BATCH.size,links:LINKS.length,res:RES.size}})}
  return true}}
registerProcessor('orb-engine',OrbEngine);
