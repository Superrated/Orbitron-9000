/* ---- v74: Power lead plays 2–3 note dark cells (root, fifth, octave, flat 2nd / minor 3rd) instead of one pitch; one note mutates every 4 bars ---- */
{G.pcell=[0];G.pci=0;let lastBar=-1;
 const cellSet=()=>{const n=SC[G.scale].length;return{R:0,b2:1,m3:2,P5:4,oct:n,low5:4-n}};
 const _ln74=leadNote;leadNote=function(p){const d=_ln74(p);if(curMood!=='Power'||p.mode!==G.pwMode)return d;
  const b=Math.floor(tk/64);if(b!==lastBar){lastBar=b;if(b>0&&G.pcell.length>1&&R()<.6){const s=cellSet(),pool=[s.R,s.b2,s.m3,s.P5,s.oct,s.low5],i=1+Math.floor(R()*(G.pcell.length-1)),opts=pool.filter(x=>x!==G.pcell[i]&&x!==G.pcell[0]);if(opts.length)G.pcell[i]=pick(opts)}}
  return G.pcell[(G.pci++)%G.pcell.length]};
 const _g74=generate;generate=function(){_g74();if(curMood!=='Power')return;const s=cellSet();
  G.pcell=pick([[s.R,s.P5],[s.R,s.b2],[s.R,s.R,s.P5],[s.R,s.m3,s.P5],[s.R,s.oct],[s.R,s.P5,s.b2],[s.R,s.R,s.m3],[s.P5,s.R,s.b2],[s.R,s.low5],[s.oct,s.P5,s.R]]).slice();G.pci=0;lastBar=-1}}
/* ---- v75: Power mood has no lead at all ---- */
{const _g75=generate;generate=function(){_g75();if(curMood!=='Power')return;TR[4].m=true;G.pstyle='none';G.pgate=null;Object.assign(LFOS[1],{d:0});if(typeof lfoUI==='function')lfoUI();build()}}
