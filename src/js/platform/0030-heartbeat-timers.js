
/* ---- perf 11: one heartbeat for the slow screen timers. Every setInterval of 200 ms or more (UI refreshes, menus, meters, autosave…) runs
   from a single shared 100 ms clock instead of its own timer, so the phone wakes up once instead of dozens of times. Fast timers (LFOs, delay sync,
   playheads, the scheduler) keep their own exact timers. ---- */
(function(){const si=window.setInterval.bind(window),ci=window.clearInterval.bind(window);const J=new Map();let id=1e6,beat=null;
 let hb=0;const run=()=>{if(document.hidden&&(++hb%20))return; /* quick win 8: screen off → slow UI jobs at most every 2 s */const n=performance.now();for(const [k,j] of J){if(n>=j.due){j.due=n+j.ms-(n-j.due>j.ms?0:Math.min(j.ms*.5,n-j.due));try{j.fn.apply(window,j.a)}catch(e){setTimeout(()=>{throw e})}}}};
 window.setInterval=function(fn,ms,...a){if(typeof fn!=='function'||!(ms>=200))return si(fn,ms,...a);const k=++id;J.set(k,{fn,ms,a,due:performance.now()+ms});if(!beat)beat=si(run,100);return k};
 window.clearInterval=function(k){if(J.has(k)){J.delete(k);return}return ci(k)};window.orbBeat={count:()=>J.size}})();
