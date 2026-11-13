/* ---- v144: WAV recorder (Launch tab, next to Export / Import). Records exactly what you hear (everything that reaches the speakers),
   16-bit stereo at the engine's sample rate (48 kHz on most phones, slightly above CD). Max 20 minutes. Stop saves: in the Claude app the
   .wav comes inside a .zip (the app only saves standard types), in a normal browser as a plain .wav. Survives engine rebuilds. ---- */
{const REC={on:false,ch:[],frames:0,sr:48000,node:null,ctx:null,t0:0,max:20*60};const outs=()=>A.out&&A.out.context===ctx?[A.out]:[]; /* what reaches the speakers: the engine's output stage */
 const SRC=`class R extends AudioWorkletProcessor{constructor(){super();this.b=[[],[]];this.n=0;this.port.onmessage=e=>{if(e.data==='flush')this.flush()}}
  flush(){if(!this.n)return;const L=new Float32Array(this.n),Rr=new Float32Array(this.n);let o=0;for(let i=0;i<this.b[0].length;i++){L.set(this.b[0][i],o);Rr.set(this.b[1][i],o);o+=this.b[0][i].length}this.port.postMessage([L,Rr],[L.buffer,Rr.buffer]);this.b=[[],[]];this.n=0}
  process(ins){const i=ins[0];if(i&&i.length){const l=i[0],r=i[1]||i[0];this.b[0].push(l.slice());this.b[1].push(r.slice());this.n+=l.length;if(this.n>=8192)this.flush()}return true}}registerProcessor('orb-rec',R)`;
 let modCtx=null;
 async function attach(){if(!ctx)return;REC.ctx=ctx;REC.sr=ctx.sampleRate;
  const onData=(L,Rr)=>{if(!REC.on)return;const n=L.length,o=new Int16Array(n*2);for(let i=0;i<n;i++){let a=L[i],b=Rr[i];a=a>1?1:a<-1?-1:a;b=b>1?1:b<-1?-1:b;o[2*i]=a<0?a*32768:a*32767;o[2*i+1]=b<0?b*32768:b*32767}REC.ch.push(o.buffer);REC.frames+=n;if(REC.frames/REC.sr>=REC.max)stop(true)};
  try{if(window.AudioWorkletNode&&ctx.audioWorklet){if(modCtx!==ctx){await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([SRC],{type:'text/javascript'})));modCtx=ctx}
    const n=new AudioWorkletNode(ctx,'orb-rec',{numberOfInputs:1,numberOfOutputs:0,channelCount:2,channelCountMode:'explicit'});n.port.onmessage=e=>onData(e.data[0],e.data[1]);REC.node=n}
   else{const sp=ctx.createScriptProcessor(4096,2,2);sp._recSkip=true;sp.onaudioprocess=e=>onData(e.inputBuffer.getChannelData(0).slice(),e.inputBuffer.getChannelData(1).slice());const z=ctx.createGain();z.gain.value=0;z._recSkip=true;sp.connect(z);z.connect(ctx.destination);REC.node=sp}
   outs().forEach(s=>{try{s.connect(REC.node)}catch(e){}})}catch(e){console.warn('[orbitron] recorder',e);REC.node=null}}
 function detach(){try{if(REC.node){if(REC.node.port)REC.node.port.postMessage('flush');const n=REC.node;const o=outs();setTimeout(()=>{o.forEach(s=>{try{s.disconnect(n)}catch(e){}})},60)}}catch(e){}REC.node=null}
 // a rebuilt engine (reset, phone resume) carries on recording into the same file
 const _iR=init;init=function(){const r=_iR.apply(this,arguments);if(REC.on&&ctx&&REC.ctx!==ctx)setTimeout(()=>{if(REC.on){REC.node=null;attach()}},150);return r};
 // ---- WAV + ZIP (stored) ----
 const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
 const crc=(c,u8)=>{for(let i=0;i<u8.length;i++)c=CRC[(c^u8[i])&255]^(c>>>8);return c};
 function wavHeader(frames,sr){const b=new ArrayBuffer(44),v=new DataView(b),w=(o,s)=>{for(let i=0;i<4;i++)v.setUint8(o+i,s.charCodeAt(i))},dl=frames*4;
  w(0,'RIFF');v.setUint32(4,36+dl,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,sr,true);v.setUint32(28,sr*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,dl,true);return b}
 async function zipOf(name,parts,size){let c=0xFFFFFFFF;for(let i=0;i<parts.length;i++){c=crc(c,new Uint8Array(parts[i]));if(i%40===39)await new Promise(r=>setTimeout(r,0))}c=(c^0xFFFFFFFF)>>>0;
  const nm=new TextEncoder().encode(name),d=new Date(),dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate(),tm=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1);
  const lh=new DataView(new ArrayBuffer(30));[[0,0x04034b50,4],[4,20,2],[6,0,2],[8,0,2],[10,tm,2],[12,dt,2],[14,c,4],[18,size,4],[22,size,4],[26,nm.length,2],[28,0,2]].forEach(([o,x,l])=>l===4?lh.setUint32(o,x,true):lh.setUint16(o,x,true));
  const cd=new DataView(new ArrayBuffer(46));[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0,2],[10,0,2],[12,tm,2],[14,dt,2],[16,c,4],[20,size,4],[24,size,4],[28,nm.length,2],[30,0,2],[32,0,2],[34,0,2],[36,0,2],[38,0,4],[42,0,4]].forEach(([o,x,l])=>l===4?cd.setUint32(o,x,true):cd.setUint16(o,x,true));
  const off=30+nm.length+size,cdl=46+nm.length,end=new DataView(new ArrayBuffer(22));[[0,0x06054b50,4],[4,0,2],[6,0,2],[8,1,2],[10,1,2],[12,cdl,4],[16,off,4],[20,0,2]].forEach(([o,x,l])=>l===4?end.setUint32(o,x,true):end.setUint16(o,x,true));
  return new Blob([lh,nm,...parts,cd,nm,end],{type:'application/zip'})}
 // ---- UI ----
 let btn=null,tmr=0;const fmt=t=>{t=Math.floor(t);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
 const say2=t=>{try{if(typeof msg==='function')msg(t);else if(typeof say==='function')say(t)}catch(e){}};
 function show(){if(!btn)return;btn.classList.toggle('on',REC.on);btn.innerHTML=REC.on?'■ '+fmt(REC.frames/REC.sr):'● Rec';btn.title=REC.on?'Stop and save the recording':'Record what you hear to a WAV file (max 20 min)'}
 async function start(){if(REC.on)return;if(!ctx){try{init()}catch(e){}}if(!ctx){say2('▲ AUDIO ENGINE NOT READY');return}try{window.orbWake&&orbWake()}catch(e){}
  REC.ch=[];REC.frames=0;REC.on=true;await attach();if(!REC.node){REC.on=false;say2('▲ RECORDING NOT AVAILABLE HERE');show();return}say2('● RECORDING');tmr=setInterval(show,250);show()}
 async function stop(auto){if(!REC.on)return;detach();await new Promise(r=>setTimeout(r,250));REC.on=false;clearInterval(tmr);show();
  const frames=REC.frames,sr=REC.sr;if(!frames){say2('▲ NOTHING RECORDED');return}
  const d=new Date(),z=n=>String(n).padStart(2,'0'),base='orbitron-'+String(curMood||'groove').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'-'+z(d.getHours())+z(d.getMinutes());
  const parts=[wavHeader(frames,sr),...REC.ch];REC.ch=[];const size=44+frames*4;say2((auto?'■ 20 MIN LIMIT · ':'■ ')+'SAVING '+fmt(frames/sr)+' RECORDING');
  let dl=null;try{dl=window.claude&&claude.use?await claude.use('downloads'):null}catch(e){dl=null}
  if(dl){try{const zb=await zipOf(base+'.wav',parts,size);await dl.save({filename:base+'.wav.zip',data:zb});say2('■ SAVED '+base+'.wav (inside the .zip)')}catch(e){const c=e&&e.code;say2(c==='declined'?'■ RECORDING DISCARDED':c==='rate_limited'?'▲ A SAVE PROMPT IS ALREADY OPEN':'▲ SAVING NOT AVAILABLE HERE')}return}
  try{const r=await window.orbSave(base+'.wav',new Blob(parts,{type:'audio/wav'}));say2(r==='cancelled'?'■ RECORDING DISCARDED':r==='blocked'||r==='maybe-blocked'?'▲ THIS VIEW BLOCKS DOWNLOADS · OPEN THE APP DIRECTLY IN YOUR BROWSER':r==='shared'?'■ SHARED '+base+'.wav':'■ SAVED '+base+'.wav')}catch(e){say2('▲ SAVING NOT AVAILABLE HERE')}}
 window.orbRec={start,stop,state:()=>({on:REC.on,frames:REC.frames,sr:REC.sr,chunks:REC.ch.length,node:!!REC.node})};
 const add=()=>{const io=document.querySelector('.sio');if(!io||io.querySelector('.srec'))return;btn=document.createElement('button');btn.className='srec';btn.type='button';btn.onclick=()=>REC.on?stop(false):start();io.appendChild(btn);show()};
 add();UI.on(add);
 const st=document.createElement('style');st.textContent=`.sio{grid-template-columns:1fr 1fr 1fr!important}#t-gen .sio .srec,.sio button.srec{border-color:rgba(255,93,115,.6)!important;color:#ff8a9a!important;opacity:1!important}.sio button.srec.on{background:rgba(255,93,115,.22)!important;color:#fff!important;border-color:#ff5d73!important}.sio .srec{min-height:40px;height:40px;padding:0 10px;font-size:12px;border:1px solid rgba(255,93,115,.55);border-radius:10px;background:transparent;color:#ff8a9a;font-family:inherit;cursor:pointer;text-transform:uppercase;letter-spacing:.06em;font-variant-numeric:tabular-nums}
.sio .srec.on{background:rgba(255,93,115,.18);color:#fff;border-color:#ff5d73;animation:recb 1.2s ease-in-out infinite}@keyframes recb{50%{box-shadow:0 0 12px rgba(255,93,115,.55)}}
@media (max-width:640px){.sio .srec{height:34px;min-height:34px;font-size:11px}}@media (max-width:640px) and (max-height:880px){.sio .srec{height:32px;min-height:32px}}@media (max-width:640px) and (max-height:780px){.sio .srec{height:30px;min-height:30px}}`;document.head.appendChild(st)}

