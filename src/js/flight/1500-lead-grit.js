
/* ---- v0.22: LEAD fader grit — one shared fuzz stage on the lead bus (not per note, so the CPU cost is fixed and tiny). Transparent up to
   half-way, then the fuzz blends in and is driven harder towards the end: rough, slightly asymmetric, toned down above ~6.5 kHz.
   Level-matched; works on every lead patch, including Mini (which has no drive of its own).
   v0.8: a real filter sweep. Left of centre the lead bus low-pass (0360) closes from fully open down to ~280 Hz, with a resonant edge
   that grows as it closes — it moves live while notes ring, like turning a cutoff knob. Right of centre the notes open up (1350). ---- */
{let last=null;setInterval(()=>{try{if(!ctx||!A.fz)return;const x=(window.leadMacro&&leadMacro.x)||0;if(last!==null&&Math.abs(x-last)<.003)return;last=x;
  {const lf=A.ldlp,t=ctx.currentTime;if(lf&&lf.context===ctx){const c=x<0?-x:0,f=c<.005?20000:20000*Math.pow(280/20000,Math.pow(c,.75));lf.frequency.setTargetAtTime(f,t,.04);lf.Q.setTargetAtTime(.7+2.3*Math.pow(c,.8),t,.06)}}
  const a=Math.max(0,Math.min(1,(x-.5)/.5)),t=ctx.currentTime,F=A.fz;
  const wl=Math.max(0,(x-.8)/.2),w0=Math.min(1,a/.6),dr=1+3*w0+9*wl+16*wl*wl;F.fi.gain.setTargetAtTime(dr,t,.03);F.fw.gain.setTargetAtTime(.12*w0,t,.03);   /* v0.75: the fuzz no longer gets louder in the last 20 % — the lead used to jump 6–17 dB there once its automatic level control was gone */F.fd.gain.setTargetAtTime(1-.25*w0-.55*wl,t,.03); /* v0.22 Radian: light warm overdrive 50–80 %, the wild fuzz only in the last 20 % */
  const L=window.LEX;if(L&&L.ctx===ctx){if(L.fb0==null||a===0)L.fb0=L.fb0==null?L.fb.gain.value:L.fb0;const e=wl;L.fb.gain.setTargetAtTime(Math.min(.72,L.fb0+.3*e),t,.15)}}catch(e){}},40)}
