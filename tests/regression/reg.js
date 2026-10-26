// Deterministic regression harness for Merchant Road.
// usage: node reg.js <url> <outdir> [capture]   (capture = also write saves produced by this build to saves/live_*.json)
const {chromium}=require('playwright-core');const fs=require('fs'),path=require('path');
const URL=process.argv[2],OUT=process.argv[3],CAP=process.argv[4]==='capture';fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});
const SAVEDIR=path.join(__dirname,'saves');
const INIT=`(()=>{let a=1234567;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const __pn=performance.now.bind(performance);window.__rt=__pn;let vt=0;const rq=[];const T0=1790000000000;performance.now=()=>vt;Date.now=()=>T0+vt;
window.requestAnimationFrame=cb=>{rq.push(cb);return rq.length};window.cancelAnimationFrame=()=>{};
const tq=[];let tid=1;window.setTimeout=(f,ms,...x)=>{const id=tid++;tq.push({id,t:vt+(+ms||0),f,x});return id};window.clearTimeout=id=>{const i=tq.findIndex(q=>q.id===id);if(i>=0)tq.splice(i,1)};
window.setInterval=(f,ms)=>{const id=tid++;const tick=()=>{f();tq.push({id,t:vt+(+ms||16),f:tick,x:[]})};tq.push({id,t:vt+(+ms||16),f:tick,x:[]});return id};window.clearInterval=window.clearTimeout;
window.__step=n=>{for(let i=0;i<n;i++){vt+=1000/60;tq.sort((p,q)=>p.t-q.t||p.id-q.id);while(tq.length&&tq[0].t<=vt){const q=tq.shift();q.f(...q.x)}const cbs=rq.splice(0);for(const cb of cbs)cb(vt)}};
document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';document.head.appendChild(s)});})();`;
const VPS=[[390,844,true,'p'],[844,390,true,'l'],[1280,800,false,'d']];
const base=o=>Object.assign({money:500,hp:200,maxhp:200,potions:2,hauler:'bigwagon',haulers:['backpack','wheelbarrow','bigwagon'],weapons:['fists','sword','crossbow'],weapon:'sword',cargo:[{item:2,origin:1,qty:6,paid:30},{item:3,origin:2,qty:3,paid:100}],lastTown:1,x:2200,time:50,stats:{kills:3,profit:40,sold:5,deaths:0},visited:[0,1,2],park:null,dng:{},caves:[],gear:['tophat'],eq:{head:'tophat'},mats:{essence:2,lava:1},look:{skin:1,body:0,hair:3,hc:2},ench:{sword:[{k:'fire',l:1}]},witch:{x:5000,t:40,seen:false},horse:null,lances:[],lance:null,scrap:{wood:20,apple:5,gold:0,done:false},wal:1,v:2,shelf:1},o);
const W2=o=>base(Object.assign({w2l:2,w:1,x:1300,lastTown:6,money:600,w2seen:true,visited:[0,1,5,6],hauler:'bigwagon',cargo:[{item:6,origin:6,qty:3,paid:20}],horse:{on:true,x:null,dir:1,wings:true},lances:['woodlance'],lance:'woodlance',scrap:{wood:150,apple:50,gold:50,done:true},ws:{0:{x:14710,lastTown:5,money:900,park:null,stash:[],hold:[]}}},o));
// End-game World 1 loadouts for World 2 balance (see ARCHITECTURE.md "World 2 difficulty"): max = best W1 kit, mid = partway through W1
const ALLW=['fists','dagger','sword','crossbow','leafstaff','firestaff','warhammer','frostspear','obsidian','flamesword'];
const BALPROF={
 max:{hp:170,maxhp:100,potions:5,weapons:ALLW,weapon:'obsidian',lances:['woodlance','ironlance','magmalance'],lance:'magmalance',
  gear:['tophat','stonehelm','stonechest','stoneboots','witchhat','witchrobe','witchboots'],eq:{head:'stonehelm',chest:'stonechest',feet:'stoneboots'},
  ench:{magmalance:[{k:'sharp',l:3},{k:'bloodthirst',l:2}],obsidian:[{k:'sharp',l:3},{k:'crit',l:2},{k:'berserk',l:2}],stonechest:[{k:'guarded',l:3},{k:'hardy',l:3}],stonehelm:[{k:'hardy',l:2},{k:'regen',l:1}],stoneboots:[{k:'guarded',l:2},{k:'thorns',l:2}]},mats:{essence:4,stone:2,lava:1}},
 mid:{hp:100,maxhp:100,potions:3,weapons:ALLW.slice(0,8),weapon:'frostspear',lances:['woodlance','ironlance'],lance:'ironlance',
  gear:['tophat','stonehelm','stonechest','witchboots'],eq:{head:'stonehelm',chest:'stonechest',feet:'witchboots'},
  ench:{ironlance:[{k:'sharp',l:1}],stonechest:[{k:'guarded',l:1}]},mats:{}}};
// Skyhaven -> Sunspire crossing bot. c = careful (crosses storm islands on foot, band discipline, dodges telegraphed bolts and dives, potion < 30%), r = careless (holds right, swings, potion < 15%)
const BALRUN=(p,m)=>async h=>{await h.seed(W2(Object.assign({x:1900,cargo:[{item:6,origin:6,qty:6,paid:20}]},BALPROF[p])));
 const r=await h.ev(m=>{let f=0,minhp=S.hp,hits=0,lh=S.hp,pots=0,lp=S.potions;const M=MR.maxHP();MR.P.dir=1;
  for(;f<20000;f++){if(MR.mode!=='play'||MR.P.x>ISLES[1].x0-10)break;tkeys.r=1;const P=MR.P;
   if(!P.fly&&P.onGround&&S.horse&&!mounted()&&!stormAt(P.x)&&!(m==='c'&&MR.E.some(e=>!e.dead&&ENEMY[e.type].isle&&Math.abs(e.x-P.x)<60)))pressed.tm=1; // on foot (the sky horse vanishes on landing): call it back to take off; storms are crossed on foot
   if(m==='c'){if(P.fly&&!(f%6)){const tb=SKYISLES.some(I=>P.x>I.x0-70&&P.x<I.x1+20)?2:1;if(P.band<tb)pressed.tu=1;else if(P.band>tb)pressed.td=1}
    for(const b of UB){const dx=b.x-P.x;if(Math.abs(dx)<70&&Math.sign(dx)!==Math.sign(b.vx)&&Math.abs(b.y-(P.y-10))<22){if(P.fly)pressed[b.y<P.y-10?'td':'tu']=1;else if(P.onGround)pressed.tj=1}}
    if(P.fly&&!(f%4))for(const e of MR.E){if(e.dead||e.type!=='pegasus'||e.state!=='dive'||e.hitDone)continue;const dx=e.x-P.x;if(Math.abs(dx)<110&&Math.sign(e.dvx)!==Math.sign(dx)){pressed[(e.dvy>0?P.band<2:P.band===0)?'tu':'td']=1;break}}}
   for(const e of MR.E){if(e.dead)continue;const dx=(e.x-P.x)*P.dir;if(dx>-4&&dx<44&&Math.abs((e.y-ENEMY[e.type].h/2)-(P.y-14))<30){pressed.ta=1;break}}
   if(S.potions>0&&S.hp<M*(m==='c'?.3:.15))pressed.th=1;
   window.__step(1);if(S.hp<lh)hits++;if(S.potions<lp)pots++;lp=S.potions;lh=S.hp;minhp=Math.min(minhp,S.hp)}
  tkeys.r=0;return{f,mode:MR.mode,x:Math.round(MR.P?MR.P.x:0),hp:Math.round(S.hp),M,pct:Math.round(100*S.hp/M),minhp:Math.round(minhp),hits,pots,deaths:S.stats.deaths,money:S.money,kills:S.stats.kills}},m);
 h.put('run',r);await h.step(30);await h.shot();await h.dig()};
const ensureSaves=()=>fs.readdirSync(SAVEDIR).filter(f=>f.endsWith('.json')).sort();
// scenario: [name, async(h)=>{}]  h: ev, step, seed, shot, dig
const SC=[
 ['menu',async h=>{await h.step(120);await h.shot()}],
 ['w1_walk',async h=>{await h.seed(base({x:2400}));await h.ev(()=>{keys.d=1});await h.step(90);await h.ev(()=>{pressed[' ']=1});await h.step(40);await h.ev(()=>{MR.spawnEnemy('goblin',MR.P.x+60);MR.spawnEnemy('slime',MR.P.x+90)});
   for(let i=0;i<6;i++){await h.ev(()=>{keys.j=1});await h.step(15);await h.ev(()=>{keys.j=0});await h.step(10)}await h.ev(()=>{keys.d=0});await h.step(30);await h.shot();await h.dig()}],
 ['w1_long',async h=>{await h.seed(base({x:600,hauler:'wheelbarrow',horse:{on:false,x:900,dir:1}}));let n=0;
   for(let k=0;k<40;k++){await h.ev(k=>{keys.d=k%7!==6;keys.a=k%7===6;keys.j=k%3===0;if(k%5===0)pressed[' ']=1;if(k%11===3)pressed.e=1;if(k%13===5)pressed.r=1},k);await h.step(30);if(await h.ev(()=>MR.mode)==='town'){await h.ev(()=>MR.leaveTown())}if(await h.ev(()=>MR.mode)==='dead'){await h.ev(()=>document.getElementById('bRespawn').click())}}
   await h.ev(()=>{for(const k in keys)keys[k]=0});await h.step(20);await h.shot();await h.dig()}],
 ['w1_horse',async h=>{await h.seed(base({x:5000,horse:{on:true,x:null,dir:1},lances:['woodlance','ironlance'],lance:'ironlance'}));await h.ev(()=>{keys.d=1});await h.step(80);await h.ev(()=>MR.spawnEnemy('iceGolem',MR.P.x+80));await h.step(60);await h.ev(()=>{keys.d=0});await h.step(30);await h.shot();await h.dig()}],
 ['w1_park',async h=>{await h.seed(base({x:3000}));await h.ev(()=>{pressed.c=1});await h.step(5);await h.ev(()=>{keys.a=1});await h.step(40);await h.ev(()=>{keys.a=0});await h.step(20);await h.shot();await h.ev(()=>{keys.d=1});await h.step(40);await h.ev(()=>{keys.d=0;pressed.c=1});await h.step(20);await h.dig()}],
 ['town_tabs',async h=>{await h.seed(base({x:1800,money:5000}));await h.ev(()=>MR.enterTown(MR.TOWNS[1]));await h.step(5);await h.shot('market');
   for(const tb of ['haulers','weapons','inn','stable','forge','barber']){const ok=await h.ev(tb=>{const b=document.querySelector('#ttabs button[data-tab="'+tb+'"]');if(!b||b.offsetParent===null)return false;b.click();return true},tb);if(ok){await h.step(3);await h.shot(tb)}}
   await h.ev(()=>{const b=document.querySelector('#ttabs button[data-tab="market"]');b.click()});await h.step(2);await h.ev(()=>{const b=document.querySelector('#tbody button');if(b)b.click()});await h.step(2);await h.dig()}],
 ['town_buy',async h=>{await h.seed(base({x:1800,money:9000,hp:120,potions:1}));await h.ev(()=>MR.enterTown(MR.TOWNS[1]));await h.step(3);
   const act=async(tab,sel)=>{await h.ev(([tab,sel])=>{document.querySelector('#ttabs button[data-tab="'+tab+'"]').click();const b=document.querySelector('#tbody '+sel);if(b)b.click()},[tab,sel]);await h.step(3)};
   await act('inn','button[data-act="rest"]');await act('inn','button[data-act="pot"]');await act('inn','button[data-act="pot"]');await h.shot('inn');
   await act('haulers','button[data-act="buyh"]');await h.shot('haulers');await act('weapons','button[data-act="buyw"]');await act('stable','button[data-act="buyhorse"]');await h.shot('stable');
   await act('market','button[data-act="sell"]');await act('market','button[data-act="buy"]');await h.shot('market');await h.dig()}],
 ['town_forge',async h=>{await h.seed(base({x:4000,lastTown:2,money:9000,mats:{essence:5,lava:5}}));await h.ev(()=>MR.enterTown(MR.TOWNS[4]));await h.step(3);for(const tb of ['forge','barber','stable','weapons']){const ok=await h.ev(tb=>{const b=document.querySelector('#ttabs button[data-tab="'+tb+'"]');if(!b||b.offsetParent===null)return false;b.click();return true},tb);if(ok){await h.step(3);await h.shot(tb)}}await h.dig()}],
 ['inv',async h=>{await h.seed(base({x:2400}));await h.ev(()=>MR.openInv());await h.step(5);await h.shot();await h.ev(()=>{const t=document.querySelectorAll('#ibody .tile, #ibody .ti');if(t[1])t[1].click()});await h.step(3);await h.shot('sel');await h.dig()}],
 ['witch',async h=>{await h.seed(base({x:5000,money:3000,witch:{x:5030,t:40,seen:true}}));await h.step(20);await h.ev(()=>MR.openWitch());await h.step(5);await h.shot();await h.dig()}],
 ['cave',async h=>{await h.seed(base({x:1050}));await h.ev(()=>{MR.E.length=0;const d=MR.DUNGEONS[0];MR.P.x=d.x;MR.enterDungeon(d)});await h.step(60);await h.ev(()=>{keys.d=1;keys.j=1});await h.step(120);await h.ev(()=>{keys.d=0;keys.j=0});await h.step(20);await h.shot();await h.dig()}],
 ['cave_hard',async h=>{await h.seed(base({x:11650,lastTown:5,hp:300,maxhp:300}));await h.ev(()=>{MR.E.length=0;const d=MR.DUNGEONS[8];MR.P.x=d.x;MR.enterDungeon(d)});await h.step(40);await h.ev(()=>{keys.a=1;keys.j=1});await h.step(90);await h.ev(()=>{keys.a=0;keys.j=0});await h.step(10);await h.shot();await h.dig()}],
 ['caves_road',async h=>{await h.seed(base({x:2800,time:100,dng:{1:{t:90}},caves:[0,1]}));await h.step(30);await h.shot('closed');await h.ev(()=>{MR.P.x=4700});await h.step(40);await h.shot('snow');await h.ev(()=>{MR.P.x=8880});await h.step(40);await h.shot('mtn');await h.dig()}],
 ['wastes',async h=>{await h.seed(base({x:13200,lastTown:5}));await h.step(30);await h.ev(()=>{MR.spawnEnemy('raider',MR.P.x+50);MR.spawnEnemy('scrapGolem',MR.P.x-70)});await h.ev(()=>{keys.d=1;keys.j=1});await h.step(90);await h.ev(()=>{keys.d=0;keys.j=0});await h.step(20);await h.shot();await h.dig()}],
 ['volcano',async h=>{await h.seed(base({x:10100,lastTown:5}));await h.ev(()=>{keys.d=1});await h.step(120);await h.ev(()=>{pressed[' ']=1});await h.step(60);await h.ev(()=>{keys.d=0});await h.step(10);await h.shot();await h.dig()}],
 ['scrap',async h=>{await h.seed(base({x:14800,lastTown:5,cargo:[{item:2,origin:4,qty:10,paid:30},{item:0,origin:0,qty:5,paid:5}]}));await h.step(20);await h.ev(()=>MR.openScrap());await h.step(5);await h.shot();await h.dig()}],
 ['death',async h=>{await h.seed(base({x:2600,hp:10}));await h.ev(()=>MR.hurtPlayer(50,MR.P.x+10,1));await h.step(30);await h.shot();await h.ev(()=>document.getElementById('bRespawn').click());await h.step(30);await h.shot('respawn');await h.dig()}],
 ['w2_isle',async h=>{await h.seed(W2({}));await h.step(40);await h.ev(()=>{keys.a=1});await h.step(60);await h.ev(()=>{keys.a=0});await h.step(20);await h.shot();await h.dig()}],
 ['w2_town',async h=>{await h.seed(W2({x:1050}));await h.ev(()=>MR.enterTown(MR.TOWNS[6]));await h.step(3);await h.shot('market');for(const tb of ['haulers','weapons','inn']){const ok=await h.ev(tb=>{const b=document.querySelector('#ttabs button[data-tab="'+tb+'"]');if(!b||b.offsetParent===null)return false;b.click();return true},tb);if(ok){await h.step(3);await h.shot(tb)}}
   await h.ev(()=>{const b=document.querySelector('#tbody button[data-act="buywc"]');if(b)b.click()});await h.step(3);await h.shot('bought');await h.dig()}],
 ['w2_fly',async h=>{await h.seed(W2({x:1900,wcart:true,cargo:[{item:6,origin:6,qty:12,paid:20},{item:7,origin:6,qty:3,paid:260}]}));await h.step(10);await h.ev(()=>{MR.P.dir=1;MR.toggleHorse()});await h.step(30);await h.ev(()=>{pressed.tu=1});await h.step(40);await h.ev(()=>{tkeys.r=1});await h.step(200);await h.ev(()=>{MR.spawnAir(1)});await h.ev(()=>{tkeys.a=1});await h.step(120);await h.ev(()=>{tkeys.a=0});await h.step(60);await h.ev(()=>{tkeys.r=0});await h.step(10);await h.shot();await h.dig()}],
 ['w2_cross',async h=>{await h.seed(W2({...BALPROF.max,x:1900,wcart:true,cargo:[{item:6,origin:6,qty:15,paid:20}]}));await h.step(10);await h.ev(()=>{MR.P.dir=1;MR.toggleHorse()});await h.step(30);await h.ev(()=>{pressed.tu=1;tkeys.r=1});for(let k=0;k<20;k++){await h.ev(k=>{tkeys.a=k%2===0},k);await h.step(60)}await h.ev(()=>{tkeys.r=0;tkeys.a=0});await h.step(10);await h.shot();await h.dig()}],
 ['w2_dock',async h=>{await h.seed(W2({x:1560}));await h.step(20);await h.ev(()=>{pressed.e=1});await h.step(10);await h.shot();await h.dig()}],
 ['fresh_new',async h=>{await h.fresh();await h.step(10);await h.ev(()=>document.getElementById('bNew').click());await h.step(30);await h.shot('start');
   await h.ev(()=>{keys.d=1});await h.step(240);await h.ev(()=>{keys.d=0;pressed.e=1});await h.step(10);await h.shot('town');await h.dig()}],
 ['roundtrip',async h=>{await h.seed(base({x:14700,lastTown:5,horse:{on:true,x:null,dir:1},lances:['woodlance'],lance:'woodlance',scrap:{wood:150,apple:50,gold:50,done:true},w2seen:false,cargo:[{item:4,origin:3,qty:4,paid:500}]}));await h.step(20);
   await h.ev(()=>MR.travelTo(1));await h.step(30);await h.shot('cut');await h.step(500);await h.ev(()=>{if(MR.mode==='cut')MR.endCut()});await h.step(60);await h.shot('w2');
   await h.ev(()=>{keys.a=1});await h.step(60);await h.ev(()=>{keys.a=0});await h.step(10);await h.ev(()=>{MR.P.x=1560});await h.step(10);await h.ev(()=>MR.travelTo(0));await h.step(120);await h.shot('w1');await h.ev(()=>MR.travelTo(1));await h.step(90);await h.shot('w2b');await h.dig()}],
 ['cart_swap',async h=>{await h.seed(W2({x:1300,wcart:true,ws:{0:{x:14710,lastTown:5,money:900,park:{x:14720,dir:-1,cargo:[{item:1,origin:0,qty:5,paid:12}]},stash:[],hold:[]}}}));await h.step(10);
   await h.ev(()=>MR.unhitch());await h.step(10);await h.ev(()=>{MR.P.x=1560});await h.step(5);await h.ev(()=>MR.travelTo(0));await h.step(90);await h.shot('w1');await h.dig('w1');
   await h.ev(()=>{keys.a=1});await h.step(40);await h.ev(()=>{keys.a=0});await h.ev(()=>MR.unhitch());await h.step(10);await h.ev(()=>MR.travelTo(1));await h.step(90);await h.shot('w2');await h.dig()}],
 ['w2_to_w1',async h=>{await h.seed(W2({x:1560}));await h.step(10);await h.ev(()=>{try{MR.travelTo(0)}catch(e){}});await h.step(400);await h.ev(()=>{if(MR.mode==='cut')MR.endCut()});await h.step(60);await h.shot();await h.dig()}],
 // sky islands (World 2)
 ['isle_land',async h=>{await h.seed(W2({...BALPROF.max,x:1900}));await h.step(10);await h.ev(()=>{MR.P.dir=1;MR.toggleHorse()});await h.step(30);await h.ev(()=>{tkeys.r=1});for(let k=0;k<40&&await h.ev(()=>MR.P.x<2290);k++)await h.step(10);await h.ev(()=>{tkeys.r=0});await h.step(30);await h.shot('over');
   for(let k=0;k<3;k++){await h.ev(()=>{pressed.td=1});await h.step(20)}await h.step(40);await h.shot();await h.dig()}],
 ['isle_unicorn',async h=>{await h.seed(W2({...BALPROF.max,x:3445}));await h.step(5);for(let k=0;k<150&&!await h.ev(()=>MR.E.some(e=>e.type==='unicorn'&&e.st==='charge'));k++)await h.step(2);await h.step(20);await h.shot('tele');
   for(let k=0;k<60&&!await h.ev(()=>UB.length);k++)await h.step(1);await h.step(7);await h.shot('bolt');await h.step(40);await h.dig('hit');
   for(let k=0;k<200&&!await h.ev(()=>MR.E.some(e=>e.type==='unicorn'&&e.st==='charge'&&e.sT<.2));k++)await h.step(1);await h.ev(()=>{pressed.tj=1});await h.step(40);await h.shot('jump');await h.dig()}],
 ['isle_slime',async h=>{await h.seed(W2(Object.assign({},BALPROF.max,{x:2300,horse:{on:false,x:2270,dir:1,wings:true}})));await h.step(5);
   for(let k=0;k<60;k++){if(!await h.ev(()=>MR.E.some(e=>e.type==='bigSlime'&&!e.dead)))break;await h.ev(k=>{const e=MR.E.find(e=>e.type==='bigSlime'&&!e.dead);const d=e.x-MR.P.x;keys.d=d>14;keys.a=d<-14;keys.j=k%2===0;if(Math.abs(d)<=14)MR.P.dir=d>0?1:-1},k);await h.step(8);if(k===5)await h.shot('fight')}
   await h.ev(()=>{for(const k in keys)keys[k]=0});await h.step(12);await h.shot('split');await h.dig()}],
 ['isle_elite',async h=>{await h.seed(W2(Object.assign({},BALPROF.max,{x:5800})));await h.step(5);
   await h.ev(()=>{for(const e of MR.E){if(e.type==='dreadUni'){e.x=e.tx=MR.P.x+130;e.cd=.2}else if(e.type==='bigSlime')e.x=e.tx=SKYISLES[3].x1-12}});
   for(let k=0;k<200&&!await h.ev(()=>MR.E.some(e=>e.type==='dreadUni'&&e.st==='charge'));k++)await h.step(2);await h.step(18);await h.shot('tele');
   for(let k=0;k<90&&await h.ev(()=>UB.length<2);k++)await h.step(1);await h.step(3);await h.shot('burst');await h.step(60);await h.dig()}],
 // World 2 sky horse: a ground save loads on foot; the horse button sparkles it in under you and takes off; landing vanishes it in sparkles (first-time toast); the big right button climbs
 ['w2_vanish',async h=>{await h.seed(W2({...BALPROF.max,x:1250}));const sp=async n=>{const x0=await h.ev(()=>MR.P.x);await h.step(n);return +((await h.ev(()=>MR.P.x)-x0)*60/n).toFixed(1)};
   await h.step(5);const a=await h.ev(()=>({m:MR.mounted(),fly:MR.P.fly,g:MR.P.onGround,hx:S.horse.x}));await h.ev(()=>{MR.P.dir=1;tkeys.r=1});await h.step(20);const foot=await sp(90);
   await h.ev(()=>MR.toggleHorse());await h.step(4);await h.shot('summon');const b=await h.ev(()=>({m:MR.mounted(),fly:MR.P.fly,parts:SPARKS.length}));await h.step(60);const fly=await sp(90);
   await h.ev(()=>{pressed.tj=1});await h.step(2);const band=await h.ev(()=>MR.P.band);await h.ev(()=>{pressed.td=1});await h.step(30);await h.ev(()=>{tkeys.r=0;pressed.td=1});
   for(let k=0;k<60&&await h.ev(()=>MR.mounted());k++)await h.step(1);await h.step(6);await h.shot('vanish');const c=await h.ev(()=>({m:MR.mounted(),fly:MR.P.fly,g:MR.P.onGround,hx:S.horse.x,lv:S.sky.lv,parts:SPARKS.length,tj:document.getElementById('tJ').dataset.k}));
   await h.step(30);h.put('chk',{a,foot,b,fly,band,c,fly1:await h.ev(()=>!!MR.P.fly)});await h.shot('foot');await h.dig()}],
 // storm island with the Winged Cart hitched: land in the storm (horse + cart vanish), the horse button only fizzles inside the storm, walk out past its edge, call the horse and take off with cart and cargo; park / re-hitch the cart on foot
 ['isle_vanish_storm',async h=>{await h.seed(W2({...BALPROF.max,x:3485,wcart:true,cargo:[{item:6,origin:6,qty:12,paid:20}]}));const kill=()=>h.ev(()=>{for(const e of MR.E)if(ENEMY[e.type].isle)e.dead=1;UB.length=0});
   await h.step(4);await h.ev(()=>{MR.P.dir=1;MR.toggleHorse()});await h.step(30);await h.ev(()=>{tkeys.r=1});for(let k=0;k<240&&await h.ev(()=>!!MR.P.fly||MR.P.x<4562);k++){await kill();await h.step(5)}await h.step(3);await h.shot('drop');
   const a=await h.ev(()=>({x:Math.round(MR.P.x),m:MR.mounted(),fly:MR.P.fly,storm:stormAt(MR.P.x),cart:carriedH(),cargo:MR.cargoCount()}));await h.ev(()=>{tkeys.r=0});await kill();await h.step(20);
   await h.ev(()=>MR.toggleHorse());await h.step(10);const b=await h.ev(()=>({m:MR.mounted(),fly:MR.P.fly,storm:stormAt(MR.P.x)}));await h.shot('fizzle');
   await h.ev(()=>MR.toggleCart());await h.step(6);const pk=await h.ev(()=>({park:!!S.park,cart:carriedH()}));await h.shot('park');await h.ev(()=>MR.toggleCart());await h.step(6);const hi=await h.ev(()=>({park:!!S.park,cart:carriedH(),cargo:MR.cargoCount()}));
   await h.ev(()=>{tkeys.r=1});for(let k=0;k<200&&await h.ev(()=>stormAt(MR.P.x)||!MR.P.onGround);k++){await kill();await h.step(5)}await h.ev(()=>{tkeys.r=0});await h.step(5);
   await h.ev(()=>MR.toggleHorse());await h.step(40);
   h.put('chk',{a,b,pk,hi,out:await h.ev(()=>({fly:MR.P.fly,m:MR.mounted(),cart:carriedH(),cargo:MR.cargoCount(),storm:stormAt(MR.P.x)}))});await h.shot('out');await h.dig()}],
 // saves: one made mounted on the ground loads on foot (horse away); one made in the air loads mounted and flying
 ['isle_vanish_save',async h=>{await h.seed(W2({...BALPROF.max,x:5951,horse:{on:true,x:null,dir:1,wings:true}}));await h.step(30);await h.ev(()=>MR.save());const sv=await h.ev(()=>localStorage.getItem('merchantRoad.v1'));
   await h.ev(()=>{window.save=()=>{}});await h.seed(sv);await h.step(10);const a=await h.ev(()=>({m:MR.mounted(),g:MR.P.onGround,fly:MR.P.fly,x:Math.round(MR.P.x),hx:S.horse.x}));
   await h.ev(()=>MR.toggleHorse());await h.step(30);const b=await h.ev(()=>({fly:MR.P.fly,m:MR.mounted()}));await h.ev(()=>MR.save());const sv2=await h.ev(()=>localStorage.getItem('merchantRoad.v1'));
   await h.ev(()=>{window.save=()=>{}});await h.seed(sv2);await h.step(30);const c=await h.ev(()=>({fly:MR.P.fly,m:MR.mounted(),air:S.air}));
   h.put('chk',{a,b,c,air:JSON.parse(sv2).air});await h.shot();await h.dig()}],
 // bigger sky islands: every foe in its own patrol slice (min SKYI.gap apart), no foe within SKYI.safe of an end, over 12s of play; rewards deep inside
 ['isle_spread',async h=>{await h.seed(W2({...BALPROF.max,x:1900,hp:9999,maxhp:9999}));const out=[];
   for(let i=0;i<5;i++){const r=await h.ev(i=>{const I=SKYISLES[i];MR.P.x=I.x0+20;MR.P.y=surfY(MR.P.x);MR.P.fly=null;MR.P.onGround=true;S.hp=MR.maxHP();return 1},i);let gap=1e9,end=1e9,n=0;
    for(let k=0;k<72;k++){await h.step(10);const q=await h.ev(i=>{const I=SKYISLES[i],F=MR.E.filter(e=>e.isl===i&&!e.dead&&e.type!=='isleSlime').map(e=>e.x).sort((a,b)=>a-b);S.hp=MR.maxHP();let g=1e9;for(let j=1;j<F.length;j++)g=Math.min(g,F[j]-F[j-1]);return{n:F.length,g,e:F.length?Math.min(F[0]-I.x0,I.x1-F[F.length-1]):1e9}},i);gap=Math.min(gap,q.g);end=Math.min(end,q.e);n=Math.max(n,q.n)}
    out.push(await h.ev(([i,gap,end,n])=>{const I=SKYISLES[i],rx=rwX(i);return{i,w:I.x1-I.x0,n,gap:Math.round(gap),end:Math.round(end),rw:Math.min(rx-I.x0,I.x1-rx),pad:[I.x0+40,I.x1-40].map(x=>groundAt(x)!==null&&!stormAt(x))}},[i,gap,end,n]))}
   const tk=[];for(let i=0;i<5;i++)for(const sd of [0,1]){await h.ev(([i,sd])=>{const I=SKYISLES[i];for(const e of MR.E)if(ENEMY[e.type].isle)e.dead=1;MR.P.x=sd?I.x1-30:I.x0+30;MR.P.y=surfY(MR.P.x);MR.P.fly=null;MR.P.onGround=true;MR.P.dir=sd?1:-1;S.horse.on=false;S.horse.x=-9999;MR.toggleHorse()},[i,sd]);await h.step(20);
    await h.ev(()=>{pressed.tj=1});await h.step(30);tk.push(await h.ev(()=>!!MR.P.fly&&MR.P.band>0))}
   h.put('sp',out);h.put('tk',tk);await h.dig()}],
 // saves from the old (small-island) layout: positions carried onto the bigger islands, always on solid ground
 ['isle_oldsave',async h=>{const L=[];
   for(const [x,hx,fly] of [[3195,3300,0],[4100,null,0],[3100,null,1],[7750,7700,0],[6300,null,1]]){const o=W2({...BALPROF.max,x,wcart:true,horse:hx==null?{on:true,x:null,dir:1,wings:true}:{on:false,x:hx,dir:1,wings:true}});delete o.w2l;
    await h.ev(()=>{window.save=()=>{}});await h.seed(o);await h.step(20);L.push(await h.ev(()=>({x:Math.round(MR.P.x),g:groundAt(MR.P.x)!==null,on:MR.P.onGround,sky:skyAt(MR.P.x),hx:S.horse.on?'on':Math.round(S.horse.x),hg:S.horse.on||groundAt(S.horse.x)!==null,w2l:S.w2l,mode:MR.mode})))}
   h.put('old',L);await h.shot();await h.dig()}],
 ['bal_max_careful',BALRUN('max','c')],['bal_max_careless',BALRUN('max','r')],['bal_mid_careful',BALRUN('mid','c')],
 ['isle_storm',async h=>{await h.seed(W2({...BALPROF.max,x:3485}));await h.step(4);await h.ev(()=>{MR.P.dir=1;MR.toggleHorse()});await h.step(30);await h.ev(()=>{tkeys.r=1}); // landing in a storm: the horse vanishes, cross on foot, call it back past the edge
   for(let k=0;k<240&&await h.ev(()=>!!MR.P.fly||MR.P.x<4562);k++)await h.step(5);await h.step(24);await h.shot('drop');await h.dig('drop');await h.ev(()=>MR.toggleHorse());await h.step(20);await h.dig('summon');
   for(let k=0;k<220&&await h.ev(()=>MR.P.x<5455);k++)await h.step(5);await h.ev(()=>MR.toggleHorse());await h.step(44);await h.ev(()=>{tkeys.r=0});await h.step(10);await h.shot('out');await h.dig()}],
 ['isle_save',async h=>{await h.seed(W2({x:7720,hp:100,maxhp:100,time:500}));await h.step(30);await h.shot('chest');await h.ev(()=>MR.save());const sv=await h.ev(()=>localStorage.getItem('merchantRoad.v1'));
   await h.seed(sv);await h.step(30);await h.shot('reload');await h.dig()}],
 ['isle_death',async h=>{await h.seed(W2({x:3485,hp:20,maxhp:100,cargo:[{item:6,origin:6,qty:4,paid:20}]}));for(let k=0;k<60&&await h.ev(()=>MR.mode==='play');k++)await h.step(10);await h.step(30);await h.shot();await h.dig()}],
 // World 2 capital (Aldenreach), Vex's Tower and the autumn foes
 ['cap_town',async h=>{await h.seed(W2({w2l:2,x:17850,lastTown:8,visited:[0,1,5,6,7,8],money:3000,cargo:[{item:9,origin:7,qty:2,paid:2000}]}));await h.step(30);await h.shot('outside');
   await h.ev(()=>MR.enterTown(MR.TOWNS[8]));await h.step(5);await h.shot('market');await h.ev(()=>{const b=document.querySelector('#tbody button[data-act="buy"]');if(b)b.click()});await h.step(3);await h.shot('bought');await h.dig()}],
 ['alden_shops',async h=>{await h.seed(W2({w2l:2,x:17300,lastTown:8,visited:[0,1,5,6,7,8],money:300000,horse:{on:false,x:16000,dir:1,wings:true}}));await h.step(20);
   for(const s of await h.ev(()=>MR.CAPSHOP.map(s=>[s.x,s.n]))){await h.ev(x=>{MR.P.x=x;MR.P.y=MR.surfY(x);MR.P.lastSafe=x;MR.E.length=0},s[0]);await h.step(20);await h.shot('door_'+s[1]);await h.ev(()=>{pressed.te=1});await h.step(4);await h.shot('ui_'+s[1]);
    await h.ev(()=>{const b=document.querySelector('#tbody button[data-act="buypeg"],#tbody button[data-act="buyw2"],#tbody button[data-act="buyw"][data-id="resinsword"]');if(b)b.click()});await h.step(3);await h.shot('buy_'+s[1]);await h.ev(()=>document.getElementById('tLeave').click());await h.step(4)}
   await h.ev(()=>{MR.S.horse.x=MR.P.x;MR.mount();MR.startFly()});await h.step(20);await h.ev(()=>{tkeys.r=1});await h.step(60);await h.ev(()=>{tkeys.r=0});await h.shot('pegasus');await h.dig()}],
 ['cap_tower',async h=>{await h.seed(W2({w2l:2,x:18250,lastTown:8,visited:[0,1,5,6,7,8],money:3000,mats:{essence:12}}));await h.step(40);await h.shot('door');
   await h.ev(()=>{pressed.te=1});await h.step(40);await h.shot('in');
   const go=async tx=>{for(let i=0;i<200;i++){const x=await h.ev(()=>MR.P.x);if(Math.abs(x-tx)<3)break;await h.ev(([x,tx])=>{tkeys.r=x<tx;tkeys.l=x>tx},[x,tx]);await h.step(2)}await h.ev(()=>{tkeys.r=0;tkeys.l=0});await h.step(2)};
   for(const lx of await h.ev(()=>MR.TOWER.lad.map(l=>l.x))){await go(lx);await h.ev(()=>{pressed.tu=1});await h.step(2);await h.ev(()=>{tkeys.u=1});await h.step(20);await h.shot('ladder');await h.step(70);await h.ev(()=>{tkeys.u=0});await h.step(5)}
   await go(await h.ev(()=>MR.TOWER.vex)+14);await h.ev(()=>{pressed.te=1});await h.step(8);await h.shot('vex');await h.dig()}],
 ['au_foes',async h=>{await h.seed(W2({w2l:2,x:12280,lastTown:7,visited:[0,1,5,6,7],hp:9999,maxhp:9999}));await h.step(20);
   await h.ev(()=>{for(const e of MR.E)e.dead=1;MR.isleFoe('cultist',6,MR.P.x+70,12100,12500);MR.isleFoe('robot',6,MR.P.x+150,12100,12500);const e=MR.spawnEnemy('harpy',MR.P.x+90);e.y=MR.P.y-70;e.by=e.y;e.state='hover';e.cd=.6;e.age=0;e.onGround=false;e.dir=-1});
   for(let i=0;i<4;i++){await h.step(30);await h.shot('t'+i)}await h.dig()}],
];
const LEGACY={ // synthetic older saves exercising stacked migrations
 v1_acc:{money:120,hp:80,maxhp:100,potions:1,hauler:'wheelbarrow',haulers:['backpack','wheelbarrow'],weapons:['fists','dagger'],weapon:'dagger',cargo:[{item:0,origin:0,qty:4},{item:1,origin:1,qty:2,paid:-3}],lastTown:1,x:1900,time:300,stats:{kills:1,profit:10,sold:2,deaths:1},visited:[0,1],park:{x:1700,dir:-1,cargo:[{item:2,origin:1,qty:3,paid:30}]},gear:['tophat'],eq:{acc:'tophat'},ench:{dagger:{k:'fire'}},offers:[1,2,3]},
 nowal_w2:{money:4000,hp:150,maxhp:150,potions:2,hauler:'smallwagon',haulers:['backpack','smallwagon'],weapons:['fists','sword'],weapon:'sword',cargo:[{item:2,origin:4,qty:5,paid:30},{item:6,origin:6,qty:8,paid:20}],lastTown:6,x:1300,time:900,stats:{kills:9,profit:200,sold:20,deaths:0},visited:[0,1,5,6],park:null,dng:{},caves:[],gear:['tophat'],eq:{head:'tophat'},v:2,w:1,w2seen:true,ships:['small','medium'],ship:'medium',moor:1,hull:80,horse:{on:true,dir:1},lances:['woodlance'],lance:'woodlance',scrap:{wood:150,apple:50,gold:50,done:true},ws:{0:{x:14700,lastTown:5,park:null}}},
 ships_w1:{money:900,hp:120,maxhp:120,potions:1,hauler:'bigwagon',haulers:['backpack','bigwagon'],weapons:['fists','sword'],weapon:'sword',cargo:[{item:4,origin:3,qty:2,paid:500}],lastTown:5,x:14600,time:2000,stats:{kills:30,profit:900,sold:40,deaths:2},visited:[0,1,2,3,4,5,6],park:null,dng:{},caves:[],gear:['tophat'],eq:{head:'tophat'},v:2,wal:1,w:0,w2seen:true,ships:['small','large'],ship:'large',moor:1,hull:100,horse:{on:false,x:14650,dir:-1,wings:true},lances:['woodlance'],lance:'woodlance',scrap:{wood:150,apple:50,gold:50,done:true},ws:{1:{x:1520,lastTown:6,money:300,park:{x:1500,dir:1,cargo:[{item:7,origin:6,qty:20,paid:260}]},hold:[{item:6,origin:6,qty:30,paid:20}],stash:[]}}},
 junk:{money:'x',cargo:[{item:99,origin:-1,qty:2}],hauler:'rocket',weapons:[],weapon:'laser',horse:5,ench:7,ws:3,scrap:9,witch:{x:'a'},lastTown:99,look:null,mats:{foo:3,essence:-2}},
};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--font-render-hinting=none','--disable-gpu']});
 if(CAP){for(const [k,v] of Object.entries(LEGACY))fs.writeFileSync(path.join(SAVEDIR,'legacy_'+k+'.json'),JSON.stringify(v))}
 const res={};
 for(const [w,hh,mob,tag] of VPS){const ctx=await b.newContext({viewport:{width:w,height:hh},hasTouch:mob,isMobile:mob,deviceScaleFactor:mob?2:1});await ctx.addInitScript(INIT);
  const run=async(name,fn)=>{const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('console',m=>{if(m.type()==='error'&&!/fonts\.g|ERR_|Failed to load resource/.test(m.text()))errs.push('CE '+m.text())});
   const ev=(f,a)=>pg.evaluate(f,a);const h={ev,step:n=>ev(n=>window.__step(n),n),
    shot:async s=>{await pg.screenshot({path:path.join(OUT,tag+'_'+name+(s?'_'+s:'')+'.png')})},
    fresh:async()=>{await ev(()=>localStorage.clear());await pg.reload();await ev(()=>document.fonts.ready.then(()=>1))},
    put:(s,v)=>{res[tag+'_'+name+'_'+s]=v},
    seed:async o=>{await ev(s=>localStorage.setItem('merchantRoad.v1',s),typeof o==='string'?o:JSON.stringify(o));await pg.reload();await ev(()=>document.fonts.ready.then(()=>1));await h.step(10);await ev(()=>document.getElementById('bCont').click());await h.step(20)},
    dig:async(sfx)=>{if(CAP&&tag==='p'){await ev(()=>{if(MR.mode!=='menu')MR.save()});fs.writeFileSync(path.join(SAVEDIR,'live_'+name+'.json'),await ev(()=>localStorage.getItem('merchantRoad.v1')))}
     res[tag+'_'+name+(sfx?'_'+sfx:'')]=await ev(()=>{const r=v=>typeof v==='number'?Math.round(v*1000)/1000:v;const P=MR.P;return JSON.stringify({mode:MR.mode,S:MR.S,P:P&&Object.fromEntries(Object.entries(P).map(([k,v])=>[k,typeof v==='object'&&v?'obj':r(v)])),E:MR.E.map(e=>[e.type,r(e.x),r(e.y),r(e.hp)]),proj:MR.PROJ.length,pick:MR.PICK.length,cam:[r(camX),r(camY)],WI:MR.WI,DG:!!MR.DG,ov:[...document.querySelectorAll('.ov.on')].map(o=>o.id+':'+o.innerHTML.replace(/data:image[^"]*/g,u=>'img'+u.length)),hud:document.getElementById('hud').innerText,touch:[...document.querySelectorAll('#touch .tb')].map(b=>b.id+getComputedStyle(b).display+b.className).join()},(k,v)=>typeof v==='number'?Math.round(v*1000)/1000:v)})}};
   await pg.goto(URL);await ev(()=>document.fonts.ready.then(()=>1));await h.step(5);
   try{await fn(h)}catch(e){errs.push('HARNESS '+e.message.split('\n')[0])}
   res[tag+'_'+name+'_errs']=errs;await pg.close()};
  for(const [name,fn] of SC)await run(name,fn);
  for(const f of ensureSaves())await run('save_'+f.replace('.json',''),async h=>{await h.seed(fs.readFileSync(path.join(SAVEDIR,f),'utf8'));await h.step(30);await h.shot();
    res[tag+'_loaded_'+f]=await h.ev(()=>JSON.stringify(MR.load()));await h.dig()});
  await ctx.close()}
 fs.writeFileSync(path.join(OUT,'digest.json'),JSON.stringify(res,null,1));
 const errs=Object.entries(res).filter(([k,v])=>k.endsWith('_errs')&&v.length);console.log('scenarios',Object.keys(res).filter(k=>k.endsWith('_errs')).length,'with errors',errs.length);for(const [k,v] of errs)console.log(k,v.slice(0,3));
 await b.close()})();
