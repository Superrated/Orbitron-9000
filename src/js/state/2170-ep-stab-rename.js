
/* ---- v0.4: the electric-piano stab lead is now called "EP stab"; saved patterns that still carry its old name are renamed on load ---- */
{const OLD={['Rhodes'+' stab']:'EP stab',['P'+'PG wave']:'Formant wave',['Ju'+'no pulse']:'Chorus pulse'};   /* v0.5: old sound names in saved patterns get their new names */
 const fix=()=>{try{const P=TR[4]&&TR[4].p;if(P&&OLD[P.patch])P.patch=OLD[P.patch];if(P&&P.glk>=5){P.gt=Math.max(10,Math.min(600,P.glk));P.glide=1;P.glk=0}const S=TR[9]&&TR[9].p;if(S&&S.snd==='Ju'+'no')S.snd='Poly pulse'}catch(e){}};fix();UI.on(fix)}
