
/* v170: one settings row per mood for the newer features — drum bus amount, groove families [chance, families…], new-lead picks,
   lead echo amount (× the lead's delay send) and note dynamics depth (0 = tight and even, 1 = loose and human). */
window.MOODX={
 Dark:{bus:.45,grv:[.35,'broken techno','skipping four'],lead:[['Cinematic arp',.2],['Donk',.08]],echo:.8,dyn:.4},
 Melancholic:{bus:.3,grv:[.35,'two-step','broken techno'],lead:[['Cinematic arp',.3]],echo:1.1,dyn:.7},
 Dreamy:{bus:.25,grv:[.4,'two-step','halftime'],lead:[['Cinematic arp',.1]],echo:1.2,dyn:.8},
 Tense:{bus:.45,grv:[.4,'broken techno','skipping four','electro'],lead:[['Cinematic arp',.15],['Donk',.1]],echo:.7,dyn:.3},
 Ethereal:{bus:.2,grv:[.4,'halftime','two-step'],lead:[['Cinematic arp',.25]],echo:1.3,dyn:.8},
 Hopeful:{bus:.3,grv:[.35,'two-step','clave perc'],lead:[['Cinematic arp',.1]],echo:1.1,dyn:.8},
 Noir:{bus:.35,grv:[.45,'halftime','broken techno'],lead:[['Rave stab',.12],['Cinematic arp',.1]],echo:1,dyn:.6},
 Drone:{bus:.3,grv:[.3,'halftime','clave perc'],lead:[['Cinematic arp',.1]],echo:1.2,dyn:.5},
 Acid:{bus:.45,grv:[.4,'electro','broken techno','skipping four'],lead:[],echo:.8,dyn:.3},
 Power:{bus:.5,grv:[.3,'skipping four','broken techno'],lead:[['Donk',.1]],echo:.6,dyn:.2},
 Italo:{bus:.35,grv:[.3,'electro','skipping four'],lead:[['Rave stab',.2]],echo:1,dyn:.6},
 Breaks:{bus:.55,grv:[.5,'electro','halftime','broken techno'],lead:[['Rave stab',.3]],echo:.9,dyn:.6},
 'Deep Space':{bus:.2,grv:[.45,'halftime','broken techno'],lead:[['Cinematic arp',.15]],echo:1.3,dyn:.5},
 Bleep:{bus:.35,grv:[.45,'electro','two-step','broken techno'],lead:[['Rave stab',.2],['Donk',.15]],echo:.8,dyn:.4},
 'Melodic House':{bus:.35,grv:[.35,'two-step','skipping four','clave perc'],lead:[['Cinematic arp',.15]],echo:1.1,dyn:.7},
 'Distorted Electro':{bus:.45,grv:[0],lead:[['Donk',.12]],echo:.8,dyn:.4},
 Ambient:{bus:.12,grv:null,lead:[['Cinematic arp',.1]],echo:1.4,dyn:.9},
 'Groove Techno':{bus:.5,grv:[.35,'skipping four','broken techno','clave perc'],lead:[['Donk',.25]],echo:.7,dyn:.35},
 Temporal:{bus:.55,grv:[.35,'skipping four','clave perc'],lead:[['Donk',.25]],echo:.6,dyn:.3},
 Vector:{bus:.35,grv:[.45,'two-step','electro','broken techno'],lead:[['Cinematic arp',.15],['Rave stab',.15]],echo:1,dyn:.6}};
