/* ---- v0.4 master: final stage, between the master limiter and the output. A gentle 4x-oversampled clipper takes the kick tips (+4.5 dB drive),
   then a plain stage holds every sample at or below -1 dBFS (output gain 0.9). Measured: about 2 dB louder than before (around -9 LUFS),
   with true peaks close to 0 dBTP like released dance tracks. The automatic loudness may now lift up to 4 dB (target -7.5). Survives engine rebuilds. ---- */
{const curve=(()=>{const n=4096,c=new Float32Array(n),T=.72,M=.977;for(let i=0;i<n;i++){const x=(i/(n-1))*2-1,a=Math.abs(x)*2.2;   // input range ±2.2
   const y=a<=T?a:T+(M-T)*Math.tanh((a-T)/(M-T));c[i]=Math.sign(x)*y}return c})();
 const CAP=(()=>{const n=2049,c=new Float32Array(n);for(let i=0;i<n;i++){const x=(i/(n-1))*2-1;c[i]=Math.max(-.985,Math.min(.985,x))}return c})();
 let F=null;const fit=()=>{try{const M=window.orbMPlus&&orbMPlus.M();if(!ctx||!A.out||!M||M.ctx!==ctx||!M.lim2||(F&&F.ctx===ctx&&F.lim2===M.lim2))return;
  const pre=ctx.createGain(),ws=ctx.createWaveShaper();pre.gain.value=Math.pow(10,4.5/20)/2.2;ws.curve=curve;ws.oversample='4x';
  // sits between the master limiter and the output, so the meters and the in-app recorder hear the finished sound
  try{M.lim2.disconnect(A.out)}catch(e){}M.lim2.connect(pre);pre.connect(ws);const cap=ctx.createWaveShaper();cap.curve=CAP;cap.oversample='none';   // the 4x clipper can ring slightly past its ceiling; this plain stage holds the line
  ws.connect(cap);cap.connect(A.out);A.out.gain.value=.9;F={ctx,lim2:M.lim2,pre,ws,cap}}catch(e){console.warn('[orbitron] final stage',e)}};
 setInterval(fit,1000);window.orbFinal=()=>F;}
/* v0.75: an older build id was set here and overrode the real one (see ORB_BUILD above) */
