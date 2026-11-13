
/* v179: "808 ↔ room" character fader on Hi-hat and Clap (Sound page). 0.5 = the sound as before. Towards 0 = 808 style (hat: softer, more noise,
   less metal, a little darker and longer · clap: wider, darker, smoother); towards 1 = acoustic / room (hat: less metal, some room,
   longer, small hit-to-hit differences · clap: more room, longer tail, small hit-to-hit differences). Hit-to-hit differences use 4
   fixed variants, so the drum cache stays small. Also: no pad gate deeper than 0.8 from Launch. */
{if(TR[1].p.char==null)TR[1].p.char=.5;if(TR[2].p.char==null)TR[2].p.char=.5;
 const VAR=[[0,0],[.6,-.5],[-.7,.4],[.3,.8]],vi=()=>VAR[(((tk*7)%4)+4)%4];
 let room=0;const _s=send;send=function(n,out,dly,rev){if(room>0)return _s.call(this,n,out,dly,Math.min(.7,(rev||0)+room));return _s.apply(this,arguments)};
 const _f=fire;fire=function(k,w){if(k!==1&&k!==2)return _f.apply(this,arguments);const P=TR[k].p,c=P.char==null?.5:+P.char;if(Math.abs(c-.5)<.02)return _f.apply(this,arguments);
  const keep={tone:P.tone,dec:P.dec,metal:P.metal,spread:P.spread,tail:P.tail,rv:P.rv,body:P.body},a=Math.max(0,(.5-c)/.5),b=Math.max(0,(c-.5)/.5),[v1,v2]=vi();
  const T=TR[k],lv0=T.lv;T.lv=lv0*(k===1?(1-.5*a)*(1-.08*b):(1-.4*a)*(1-.25*b));
  try{if(k===1){const mt=P.metal==null?.6:P.metal;
     if(a>0){P.metal=mt*(1-.6*a);P.tone=P.tone*(1-.15*a);P.dec=P.dec*(1+.4*a)}
     else{P.metal=mt*(1-.5*b);P.tone=P.tone*(1-.1*b)*(1+.05*b*v1);P.dec=P.dec*(1+.6*b)*(1+.12*b*v2);room=.2*b}}
    else{if(a>0){P.spread=Math.min(30,P.spread*(1+.5*a));P.tone=P.tone*(1-.2*a);P.tail=Math.min(.6,P.tail*(1+.3*a))}
     else{P.rv=Math.min(.6,(P.rv||0)+.3*b);P.tone=P.tone*(1+.06*b*v1);P.spread=Math.max(4,Math.min(30,P.spread*(1+.15*b*v2)));P.tail=Math.min(.6,P.tail*(1+.4*b));P.body=(P.body||0)*(1-.3*b)}}
   return _f.apply(this,arguments)}finally{room=0;Object.assign(P,keep);T.lv=lv0}};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const P=TR[5].p;if((P.pgate||0)>.8)P.pgate=.8;[1,2].forEach(k=>{if(TR[k].p.char==null)TR[k].p.char=.5})}catch(e){}return r};
 // UI: the fader sits on the Sound page of the Hi-hat and Clap cards
 const addUI=()=>{[1,2].forEach(k=>{const c=TR[k].mb&&TR[k].mb.closest('.card');if(!c||c.querySelector('[data-char]'))return;const g=c.querySelector('.grid');if(!g)return;
   const n=g.children.length;sl(g,'808 ↔ room',0,1,TR[k].p.char==null?.5:TR[k].p.char,.01,v=>{TR[k].p.char=v});const el=g.children[n];if(!el)return;el.dataset.char=1;el.dataset.g='snd';
   el.title='0 = 808 style · 0.5 = as before · 1 = acoustic / room';const sp=el.firstChild;if(sp&&sp.firstChild)sp.firstChild.textContent='808 ↔ room'})};
 const syncUI=()=>[1,2].forEach(k=>{const c=TR[k].mb&&TR[k].mb.closest('.card'),el=c&&c.querySelector('[data-char]');if(!el)return;const i=el.querySelector('input'),b=el.querySelector('b'),v=TR[k].p.char==null?.5:TR[k].p.char;
   if(i&&document.activeElement!==i&&Math.abs(+i.value-v)>.005){i.value=v;if(b)b.textContent=(+v).toFixed(2)}});
 BUILD.hooks.push({post(){queueMicrotask(()=>queueMicrotask(()=>{try{addUI();tagCtl&&tagCtl();syncUI()}catch(e){}}))}});
 UI.on(()=>{try{addUI();syncUI()}catch(e){}});try{addUI()}catch(e){}}
