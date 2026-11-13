/* ---- v57: Mini patch library + every mood draws on the Mini (osc 2/3 detune now ±7 semitones, like the Model D frequency knobs) ---- */
TR[4].x.forEach(x=>{if(x[1]==='o2d'||x[1]==='o3d'){x[2]=-700;x[3]=700}});
{const M=(o)=>Object.assign({pg:1,eng:'Mini',o1w:2,o1r:0,o1l:1,o2w:2,o2r:0,o2d:7,o2l:.8,o3w:2,o3r:-1,o3d:-5,o3l:.6,mnz:0,cut:700,res:6,envA:2600,fatt:2,fdec:.3,fsus:.2,att:3,dec:.4,sus:.6,hold:1,rel:.15,dsw:1,glk:0,kt:.5,vib:0},o);
 Object.assign(LPRE,{
  'Mini brass':M({o3r:-1,o3d:4,cut:420,res:4,envA:2600,fatt:70,fdec:.55,fsus:.45,att:25,dec:.5,sus:.8,hold:1.5,rel:.18,dsw:0,ds:.2,rs:.25}),
  'Mini flute':M({o1w:0,o2w:0,o2r:1,o2d:3,o2l:.35,o3l:0,mnz:.14,cut:1500,res:2.5,envA:700,fatt:40,fdec:.4,fsus:.5,att:45,dec:.5,sus:.85,hold:1.5,rel:.25,dsw:0,vib:12,vibr:5,ds:.3,rs:.45}),
  'Mini fifths':M({o2d:700,o2l:.7,o3w:3,o3r:-1,o3d:0,o3l:.5,cut:500,res:8,envA:3000,fatt:2,fdec:.25,fsus:.15,dec:.3,sus:.4,glk:50,pg:.85}),
  'Mini wobble':M({o1w:3,o2w:5,o2d:-6,o3w:2,o3r:-1,o3d:0,cut:180,res:14,envA:2200,fatt:260,fdec:.9,fsus:.3,att:5,dec:.6,sus:.7,hold:2,dsw:0,rel:.2,glk:80,pg:1.1}),
  'Mini sparkle':M({o1w:5,o1r:1,o2w:0,o2r:2,o2d:5,o2l:.5,o3l:0,cut:900,res:7,envA:4500,fatt:1,fdec:.14,fsus:0,att:1,dec:.22,sus:0,kt:.8,ds:.45,rs:.35,pg:1.5}),
  'Mini drone':M({o1r:-1,o2r:-2,o2d:4,o2l:.7,o3r:0,o3d:-6,o3l:.5,mnz:.05,cut:260,res:9,envA:900,fatt:1400,fdec:2.5,fsus:.4,att:900,dec:2,sus:1,hold:8,rel:1.6,dsw:0,kt:.2,vib:4,vibr:.3,ds:.35,rs:.6,pg:.9}),
  'Mini edge':M({o1w:2,o2w:2,o2r:1,o2d:690,o2l:.75,o3w:1,o3r:0,o3d:-12,o3l:.5,cut:1100,res:10,envA:3800,fatt:1,fdec:.2,fsus:.1,dec:.28,sus:.3,glk:30,pg:.9})});
 const add={Dark:['Mini bass','Mini wobble','Mini lead'],Melancholic:['Mini lead','Mini flute'],Dreamy:['Mini flute','Mini sparkle'],Tense:['Mini acid','Mini wobble','Mini edge'],
  Ethereal:['Mini flute','Mini sparkle'],Hopeful:['Mini brass','Mini sparkle','Mini lead'],Noir:['Mini lead','Mini brass'],Drone:['Mini drone','Mini drone'],'Deep Space':['Mini drone','Mini flute'],
  Italo:['Mini edge','Mini fifths','Mini sparkle'],'The Touch':['Mini brass','Mini fifths','Mini edge'],Breaks:['Mini sparkle','Mini fifths']};
 for(const m in add){if(!LMOOD[m])continue;add[m].forEach(n=>{if(LPRE[n]&&LMOOD[m].filter(x=>x===n).length<2)LMOOD[m].push(n)})}}
