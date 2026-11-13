
/* ---- v0.5 ENGINE TIDY — slider ranges cover every value Launch or a preset can set (before, touching such a slider made the sound jump),
   and after every Launch each slider value is kept inside its range, so what a slider shows is what plays. ---- */
{const W=(k,key,mn,mx)=>{const x=(TR[k].x||[]).find(x=>x[1]===key);if(!x)return;if(mn!=null)x[2]=mn;if(mx!=null)x[3]=mx};
 W(4,'fenv',null,2.5);W(4,'att',null,1500);W(4,'len',null,32);W(4,'rel',null,3);W(4,'dec',null,2.5);W(4,'vibr',.2,null);W(4,'o2d',-1200,1200);W(4,'o3d',-1200,1200);W(4,'gt',10,600);
 W(5,'att',.005,null);W(5,'rel',.1,null);W(5,'bars',null,8);
 const clampAll=()=>TR.forEach(T=>(T.x||[]).forEach(x=>{const [,key,mn,mx]=x,v=T.p[key];if(typeof v!=='number'||!isFinite(v)||!(mx>mn))return;if(v<mn)T.p[key]=mn;else if(v>mx)T.p[key]=mx}));
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{clampAll()}catch(e){}return r};
 setTimeout(()=>{try{clampAll();build()}catch(e){}},0);
 /* presets that had their own portamento time keep it as Glide time (with Glide chance 1) */
 const _lp=applyLP;applyLP=function(){const r=_lp.apply(this,arguments);try{const P=TR[4].p;if(P.glk>=5){P.gt=Math.max(10,Math.min(600,P.glk));P.glide=1;P.glk=0}}catch(e){}return r}}
