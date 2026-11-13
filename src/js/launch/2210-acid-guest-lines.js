
/* ---- v0.5: 303 GUEST LINES — in fitting moods a Launch sometimes turns the lead into a 303 line that takes the bass's place
   (like the Acid mood): Distorted Electro and Tense 20 %, Groove Techno, Dark and Temporal 15 %, Bleep 12 %, Vector and Breaks 10 %. ---- */
{const FIT={'Distorted Electro':.2,Tense:.2,'Groove Techno':.12,Dark:.15,Temporal:.12,Bleep:.12,Vector:.1,Breaks:.1};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const L=TR[4],c=FIT[curMood];G.acidGuest=0;
   if(c&&L.p.mode!=='Acid 303'&&R()<c&&typeof LPRE!=='undefined'&&LPRE['Acid 303']){const B=Object.assign({},LPRE['Acid 303']),tt=B._t;delete B._t;
    Object.assign(L.p,B,{res:Math.min(12,8+R()*4),cut:240+R()*260,envA:2600+R()*1600,dec:.2+R()*.25,drv:.25+R()*.25,grit:0,crush:0,glide:.2+R()*.2,accp:.25+R()*.15,wave:R()<.3?.8:.1,subosc:0,seed:R()*1e3,mode:'Acid 303',patch:'Acid 303'});
    if(tt)Object.assign(L,tt);L.m=false;L.lv=Math.max(.35,Math.min(.55,L.lv||.45));AC.key='';TR[6].m=true;G.acidGuest=1;try{window.lfoUI&&lfoUI();build()}catch(e){}}}catch(e){}return r}}
