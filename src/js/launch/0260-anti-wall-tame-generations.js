/* ---- v21: anti wall-of-sound — after each Generate, keep low end, mids and effects uncluttered ---- */
function declutter(){const on=k=>!TR[k].m,dn=k=>TR[k].h/TR[k].st,M=curMood,P=MP[M]||{},L=TR[4],Lp=L.p,acid=Lp.mode==='Acid 303';
 const leadBusy=on(4)&&dn(4)>.4,leadSus=(Lp.sus||0)>.3&&(Lp.hold||1)>=2;
 // low end: rolling/busy bass and a sub drone don't share the floor
 if(on(6)&&on(9)&&(dn(6)>.45||R()<.5))TR[9].m=true;
 // mids: lead, pad, stab — at most two prominent tonal layers
 if(on(8)&&!P.stab&&(leadBusy||acid||[4,5].filter(on).length>=2&&R()<.6))TR[8].m=true;
 if(P.stab&&on(4)&&dn(4)>.25){L.h=Math.max(2,Math.round(L.st*.18));L.pt=pat(L)}
 if(on(5)&&on(4)&&(leadSus||acid||leadBusy))TR[5].lv*=leadSus?.7:.8;
 if([4,5,8,9].filter(on).length>=4){if(!P.sub)TR[9].m=true;else if(!P.stab)TR[8].m=true;else TR[9].m=true}
 // rhythm: busy perc against busy hats gets thinned
 if(on(3)&&dn(3)>.38&&dn(1)>.55){TR[3].h=Math.max(2,Math.round(TR[3].st*.28));TR[3].pt=pat(TR[3])}
 if(!G.brk&&curMood!=='Italo'&&curMood!=='Breaks'&&on(7)&&on(2)&&dn(1)>.7)TR[7].m=true;
 // lead density cap (acid keeps its 303 line)
 if(on(4)&&!acid&&dn(4)>.6){L.h=Math.round(L.st*.5);L.pt=pat(L)}
 // effects wash budget (dreamy/ethereal are allowed a bigger space)
 const cap=M==='Deep Space'?2.3:M==='Ethereal'||M==='Dreamy'?1.75:1.35,wet=G.rev+G.dly*(1+G.fb)+G.shim*.4+G.dens*.3;if(wet>cap){const s=cap/wet;G.rev*=s;G.dly*=s;G.shim*=s;G.dens*=s}
 G.fb=Math.min(G.fb,.7);if(leadBusy)G.dens=Math.min(G.dens,.3);
 applyFX();syncMix();build()}
const _gen21=generate;generate=function(){_gen21();declutter()};
/* ---- v23: tame generations — no over-driving, lead never on top ---- */
function tame(){const hard=curMood==='Power'||curMood==='Tense',P=TR[4].p;
 G.clip=Math.min(G.clip,.4);G.bgrit=Math.min(G.bgrit,.22);TR[0].p.drive=Math.min(TR[0].p.drive,hard?5:3.5);
 P.drv=Math.min((P.drv||0)*.6,.4);P.grit=Math.min(P.grit||0,.18);P.crush=Math.min(P.crush||0,.1);P.fold=(P.fold||0)*.7;
 applyFX();syncMix();build()}
const _gen23=generate;generate=function(){_gen23();tame()};
