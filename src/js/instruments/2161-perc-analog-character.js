/* ---- v0.4: analog drum-synth character on the Perc synth (CPU-lean: no extra nodes except 2 when Drive is up).
   · Pitch: in Follow scale mode the perc no longer picks a random note per hit; hit 1, 2, 3 … of its own ring walk through the chord tones
     (every 4th hit an octave up), so the perc plays a knocking melody that loops with its pattern and follows the chords.
   · Pitch drop: Pitch bend now goes up to 3 (two octaves of drop) and has its own Drop time.
   · Velocity: the first hit of the ring is full, hits on a beat strong, the rest softer and darker (only when the track has no accent pattern).
   · Drive: mixer-style grit, a saturator after the filter. ---- */
var PDC={};
{const st=()=>{const T=TR[3];return T&&T.st?((typeof tk==='number'?tk:0)%T.st+T.st)%T.st:0};
 const hitNo=s=>{const pt=TR[3].pt||[];let i=0;for(let j=0;j<s;j++)if(pt[j])i++;return i};
 window.pcDeg=function(){if(window.DR&&DR.rendering)return 0;const n=SC[G.scale].length,ct=(cur&&cur.n&&cur.n.length)?cur.n:null;
  if(!ct)return Math.floor(R()*n*2);const i=hitNo(st()),r=TR[3].r||0;return ct[(i+r)%ct.length]+(i%4===3?n:0)};
 window.pcVel=function(){const T=TR[3];if(!T||(window.DR&&DR.rendering)||T.vel)return 1;const s=st();if(T.pt&&hitNo(s)===0)return 1;return s%4===0?.85:.62};
 const fill=()=>{const P=TR[3].p;if(P.pdt==null)P.pdt=.04;if(P.pdrv==null)P.pdrv=0};fill();
 // a sector or file saved before these controls existed loads with them at their defaults
 BUILD.hooks.push({pre(){try{fill()}catch(e){}}});
 // Launch: each mood brings the perc drive and drop in its own way. [chance, drive range, pitch bend range, drop time range]; null = leave as is
 const DF={Power:[.6,[.4,.6],[1.2,2],[.08,.14]],'Distorted Electro':[.6,[.4,.6],[.4,.9],[.02,.05]],
  'Groove Techno':[.5,[.15,.3],[.4,.9],[.02,.05]],Temporal:[.5,[.15,.3],[.4,.9],[.02,.05]],
  Dark:[.4,[.25,.45],[.6,1.2],[.04,.08]],Tense:[.4,[.25,.45],[.6,1.2],[.04,.08]],Acid:[.4,[.25,.45],[.6,1.2],[.04,.08]],
  Bleep:[.3,null,[1.5,2.5],[.01,.025]],
  Breaks:[.2,[.1,.2],null,null],Italo:[.2,[.1,.2],null,null],Hopeful:[.2,[.1,.2],null,null],Noir:[.2,[.1,.2],null,null],Drone:[.2,[.1,.2],null,null],Vector:[.2,[.1,.2],null,null],
  'Melodic House':[.3,null,[.4,.8],[.08,.15]],Ambient:[.3,null,[.4,.8],[.08,.15]],Ethereal:[.3,null,[.4,.8],[.08,.15]],Dreamy:[.3,null,[.4,.8],[.08,.15]],Melancholic:[.3,null,[.4,.8],[.08,.15]],'Deep Space':[.3,null,[.4,.8],[.08,.15]]};
 const rr=(r,dp)=>+(r[0]+R()*(r[1]-r[0])).toFixed(dp);
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const p=TR[3].p,c=DF[curMood];p.pdt=.04;p.pdrv=0;
  if(c&&R()<c[0]){if(c[1])p.pdrv=rr(c[1],2);if(c[2])p.bend=rr(c[2],2);if(c[3])p.pdt=rr(c[3],3)}}catch(e){console.warn('[orbitron] perc launch',e)}return r}}
