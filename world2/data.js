'use strict';
// sky goods (World 2)
reg(ITEMS,6,[
 {id:'cloudwool',name:'Cloud Wool',base:20,col:'#e8f4ff'},
 {id:'skyglass',name:'Sky Crystal',base:260,col:'#7de0ff'},
 {id:'sunfruit',name:'Sunfruit',base:500,col:'#ffb040'},
 {id:'starsilk',name:'Star Silk',base:2000,col:'#e8c8ff'}]);
// Aldenreach goods (the autumn capital, World 2 town 8). Prices follow the World 1 town ladder: each town further down the road brings a
// top good ~4x the last (wood 30 > coal 100 > iron 500 > gold 2000; Sunfruit 500 > Star Silk 2000), so the capital's prize is 4 x Star Silk
// and even its fillers sit above Star Silk (Oct 2026; was 1200 / 150 / 420)
reg(ITEMS,10,[
 {id:'spicedamber',name:'Spiced Amber',base:8000,col:'#e88a2a'},
 {id:'emberleaf',name:'Emberleaf Tea',base:2500,col:'#c8482a'},
 {id:'hearthcider',name:'Hearth Cider',base:4500,col:'#d8a040'}]);
HAULERS.wingcart={name:'Winged Cart',cap:20,spd:.9,jump:.95,price:400,w:1}; // World 2 only (Skyhaven), hitches to the winged horse
COFF.wingcart=-18;HITCHR.wingcart=32;
// Carriage (Aldenreach carrier store): World 2 only like the Winged Cart (flies with your horse, sparkles away on landing, hitch / park the same way);
// S.carriage = owned, S.w2c = which of the two you drive ('wingcart' picks the cart back). Not in HORDER: World 1 never offers or uses it
HAULERS.carriage={name:'Carriage',cap:75,spd:.85,jump:.93,price:100000,w:1};COFF.carriage=-20;HITCHR.carriage=36;
function isWC(h){return h==='wingcart'||h==='carriage'} // a World 2 flying cart (hitched behind the winged horse)
// Pegasus (Aldenreach stables): S.peg = owned, S.mnt = 'peg' rides it (else your sky horse). World 2 only: flies PEGSPD x the sky horse's
// speed; World 1 never sees it (you ride your own horse there, unchanged)
const PEGPRICE=50000,PEGSPD=1.5;function pegOn(){return !!(S&&S.peg&&S.mnt==='peg'&&WI===1)}
// airships: World 2 cargo haulers (hold = cargo cap there). spd/hull are used by phase-2 flying; shown in the shop now
const SHIPS={small:{name:'Small Airship',cap:30,spd:1.15,hull:60,price:0,z:.72,pal:['#c84a3a','#e8d8b0']},
 medium:{name:'Medium Airship',cap:60,spd:1,hull:100,price:6000,z:.9,pal:['#3a8ad0','#f4ead0']},
 large:{name:'Large Airship',cap:100,spd:.85,hull:160,price:20000,z:1.08,pal:['#e0b440','#f8f4e8']}};const SORDER=['small','medium','large'];
const SKY={dmg:.6,max:3,maxShip:3,pair:.45,gapHorse:[320,170],gapShip:[300,160],diveHorse:2,diveShip:1.6,diveRnd:1.1}; // air wilds: damage on the winged horse, foes at once, pair chance, px between spawns [min,+rnd], pegasus re-dive [s]
const WCART={knockCd:4,keep:.4,flash:3.8}; // Winged Cart: seconds between knock-loose losses, chance a hit costs nothing, hit flash while cd > flash
const W2LEN=19600,ISL0=150,ISL1=1950,W2DOCK=1560,W2TOWN=6,FLYALT=100,W2START=100; // World 2 layout; W2START = World 2's opening balance
// World 2 phase 2: two floating islands with the open-sky "air wilds" between them
const ISLES=[{x0:150,x1:1950},{x0:8800,x1:10600},{x0:16450,x1:19300,cap:1}]; // [2] = Aldenreach, the walled autumn capital (world2/capital.js)
const CAPW={x0:17150,x1:18550,tower:18250,piers:[16560,19190]}; // capital walls (gatehouses), Vex's Tower door, decorative piers at both ends
const DOCKS=[{x:1560,side:1,isl:0,town:6},{x:8990,side:-1,isl:1,town:7}]; // side: which way the moored airship hangs off the pier
const BANDY=[-70,-140,-210]; // altitude bands: low (near islands, sky slimes), mid (pegasi), high (pegasi + tailwind)
const WX=[{x0:2886,x1:3406,k:'rain'},{x0:4080,x1:4330,k:'up'},{x0:5540,x1:6645,k:'rain'},{x0:6930,x1:7133,k:'up'},{x0:8166,x1:8523,k:'rain'},{x0:11720,x1:11930,k:'up'},{x0:13020,x1:13300,k:'rain'},{x0:15380,x1:15600,k:'up'}]; // rain pushes you down a band, updrafts lift you
// ===== FEATURE FLAG: drivable airships in World 2 (shop, boarding/mooring, piloting, hull + wrecks, airship cargo hold, mid-air leap to horse).
// Shelved for now (see SHELVED.md): all the code and sprites stay below, intact; set this to true to bring them back.
// The World 1 scrap-pile airship build and the airship that carries you between worlds (and the cutscene) are NOT affected.
const FEATURE_DRIVABLE_AIRSHIPS=false;
const HLAND=1/3; // winged horse on any island (Skyhaven, Sunspire, sky islands): 1/3 of on-foot walking (92 -> ~31px/s), hop off and walk; flying is unchanged
const SHIPV=118,HFLY=.5,JET=1.2,HULLFIX=12,WRECKLOSS=.3; // airship base speed (x ship spd); winged horse = gallop x0.5 (~69px/s: slower than any airship, the ship is the way to travel); high band x1.2; hull repairs 12/s while moored; a wreck loses 30% of the hold
// sky islands: small landable islands in the air wilds (no towns). Logic + art in world2/skyisles.js.
// h = surface height (BANDY is -70/-140/-210), top 1 = Sunspire lilac grass, storm 1 = under a storm cloud (no flying under it),
// rw = reward (chest / wool node; Sky Crystal is enemy-only since Oct 2026, the storm island's crystal node became wool) at the centre + rx (deep inside: you walk through the fights to reach it), foes = spawned when you come near,
// ld = ledges / hollows [from, to (fraction of the width), +px up / -px down], on top of gentle rolling ground (flat landing pads of SKYI.pad at both ends)
const SKYISLES=[
 {x0:2250,x1:2870,h:100,top:0,rw:'wool',rx:40,foes:['bigSlime','unicorn'],ld:[[.28,.42,14],[.62,.71,-8]]},
 {x0:3430,x1:4030,h:190,top:1,rw:'chest',rx:-30,foes:['unicorn','bigSlime'],ld:[[.2,.33,-9],[.56,.72,16]]},
 {x0:4430,x1:5490,h:125,top:0,storm:1,rw:'wool',rx:30,foes:['bigSlime','unicorn','bigSlime'],ld:[[.16,.27,12],[.38,.45,-10],[.62,.78,18],[.84,.9,10]]},
 {x0:5790,x1:6490,h:85,top:1,rw:'wool',rx:-40,foes:['dreadUni','bigSlime'],ld:[[.22,.37,15],[.6,.66,-8],[.73,.83,12]]},
 {x0:7190,x1:8150,h:160,top:1,storm:1,rw:'chest',rx:50,foes:['unicorn','dreadUni','bigSlime'],ld:[[.18,.28,-9],[.34,.48,15],[.68,.77,12]]},
 // the autumn wilds (Sunspire -> Aldenreach): au = autumn look (au 2 = blends from Sunspire lilac), kind = set piece (world2/autumnfoes.js), rw 'leaf' = Emberleaf bush
 {x0:10950,x1:11650,h:115,top:0,au:2,kind:'grove',rw:'leaf',rx:30,foes:['unicorn','cultist'],ld:[[.25,.38,12],[.62,.72,-8]]},
 {x0:12000,x1:13000,h:175,top:0,au:1,kind:'castle',rw:'chest',rx:-60,foes:['cultist','robot','dreadUni'],ld:[[.16,.26,-9],[.74,.84,14]]},
 {x0:13350,x1:13950,h:95,top:0,au:1,kind:'rubble',rw:'leaf',rx:40,foes:['cultist','cultist'],ld:[[.62,.72,10]]},
 {x0:14300,x1:15350,h:150,top:0,au:1,storm:1,kind:'grove',rw:'chest',rx:50,foes:['robot','unicorn','cultist'],ld:[[.2,.3,14],[.5,.6,-10],[.75,.86,12]]},
 {x0:15650,x1:16150,h:120,top:0,au:1,kind:'shrine',rw:'leaf',rx:-30,foes:['dreadUni','cultist'],ld:[[.2,.3,10]]}];
const STORMIN=48; // the storm's no-fly core is the island minus this much at each end: land, cross, take off past the edge
const SKYI={pad:80,safe:110,gap:80,chestCd:600,nodeCd:360,chest:[140,220],silk:2,wool:3,leaf:2,amber:1}; // autumn: leaf = Emberleaf per pick, amber = Spiced Amber in an autumn chest (instead of the Star Silk) // pad = flat landing strip at each end, safe = no foe spawns or patrols this close to an end, gap = min px between two foes' patrol zones; reward respawn [s of play time], chest coins + Star Silk, Cloud Wool per pick
const UNI={near:52,bolt:10,hull:9,tele:.5,gap:.2,spd:180,life:1.6,range:210,ang:.6,cd:1.6,cdR:.8}; // unicorn bolt: damage (x W2T.dmg), hull, telegraph [s], s between burst bolts (ENEMY.burst), px/s, life [s], aggro px, max aim [rad], cooldown + rnd
// island ground: base height + small ripple, gentle rolling hills (flat at the landing pads), then the ledges / hollows (14px ramps)
function isleH(I,x){const w=I.x1-I.x0,u=x-I.x0,ed=Math.min(u,I.x1-x),e0=clamp(ed/36,0,1),pd=smooth(clamp((ed-SKYI.pad)/90,0,1));
 let h=I.h+2.5*Math.sin(x/29+I.h)-6*(1-e0)*(1-e0)+pd*(6*Math.sin(u/61+I.h*.1)+3.5*Math.sin(u/27+1.7));
 for(const l of I.ld||[]){const a=l[0]*w,b=l[1]*w;h+=l[2]*smooth(clamp((u-a)/14+.5,0,1))*smooth(clamp((b-u)/14+.5,0,1))}return h}
// Oct 2026: the sky islands grew ~2.7x and the Air Wilds got longer (Sunspire moved +2000). w2Remap() carries an older World 2 position
// onto the new layout: each old island onto the same spot of its bigger self, the gaps and Sunspire linearly (WORLDDEF[1].migrate)
const W2K0=[1950,2250,2480,3180,3400,3800,4200,4500,4760,5620,5980,6800,9000],W2K1=[1950,2250,2870,3430,4030,4430,5490,5790,6490,7190,8150,8800,11000],W2L=2;
function w2Remap(x){if(!isFinite(x)||x<=W2K0[0])return x;const n=W2K0.length;for(let i=1;i<n;i++)if(x<=W2K0[i])return Math.round(W2K1[i-1]+(x-W2K0[i-1])*(W2K1[i]-W2K1[i-1])/(W2K0[i]-W2K0[i-1]));return Math.round(x-W2K0[n-1]+W2K1[n-1])}
// an old save in the open sky lands on the nearest sky island's landing pad (within 400px), else ui.js puts it on the Skyhaven dock
function w2Land(x){if(!isFinite(x)||onIsle(x))return x;let b=null,bd=401;for(const I of SKYISLES)for(const c of [I.x0+40,I.x1-40]){const d=Math.abs(c-x);if(d<bd){bd=d;b=c}}return b==null?x:b}
// Sky Crystal moved from cargo (item 7) to materials: every unit in the hold, a parked cart, or the other world's stored hold becomes mats.skyglass 1:1
function w2Mats(s){let n=0;const st=a=>Array.isArray(a)?a.filter(u=>{if(u&&u.item===7){n+=Math.max(0,Math.floor(+u.qty||0));return false}return true}):a;
 s.cargo=st(s.cargo);if(s.park&&s.park.cargo)s.park.cargo=st(s.park.cargo);if(s.ws&&typeof s.ws==='object')for(const k in s.ws){const o=s.ws[k];if(!o)continue;o.hold=st(o.hold);if(o.park&&o.park.cargo)o.park.cargo=st(o.park.cargo)}
 if(n){if(!s.mats||typeof s.mats!=='object')s.mats={};s.mats.skyglass=(Math.floor(+s.mats.skyglass)||0)+n}}
function islAt(x){for(let i=0;i<ISLES.length;i++)if(x>ISLES[i].x0&&x<ISLES[i].x1)return i;return -1}
function skyAt(x){for(let i=0;i<SKYISLES.length;i++)if(x>SKYISLES[i].x0&&x<SKYISLES[i].x1)return i;return -1}
function stormAt(x){const i=skyAt(x);if(i<0||!SKYISLES[i].storm)return false;const I=SKYISLES[i];return x>I.x0+STORMIN&&x<I.x1-STORMIN}
function onIsle(x){return islAt(x)>=0||skyAt(x)>=0}
function wxAt(x){for(const z of WX)if(x>z.x0&&x<z.x1)return z.k;return null}
function dockShipX(i){const d=DOCKS[i];return d.x+d.side*52}
// Sky Crystal is an enemy-only material (S.mats.skyglass; item 7 stays reserved so old saves load, w2Mats converts it), sold nowhere; Skyhaven has the forge for the crystal armor (inventory/forge.js)
reg(TOWNS,6,[
 {name:'Skyhaven',x:1050,w:1,ships:1,forge:1,sells:[6,8],weapons:['cogflail'],haulers:[]},
 {name:'Sunspire',x:9750,w:1,sells:[8,9],weapons:[],haulers:[]}]);
reg(TOWNS,8,[{name:'Aldenreach',x:17850,w:1,biome:9,big:1,forge:1,stable:1,carrier:1,sells:[10,11,12],weapons:['resinsword'],haulers:[]}]); // big = drawn by world2/capital.js (walls, houses, Vex's Tower, the four shop buildings CAPSHOP)
reg(BIOMES,5,[
 {name:'Sky Meadow',sky:['#78c4f0','#b4e2f8','#eaf8ff'],far:'#a8cce0',mid:'#f4fbff',top:'#5ee0c8',top2:'#3ab8a8',dirt:'#e0d2b4',dirt2:'#c8b896',farS:'isles',midS:'cloudbank',mm:'#5ee0c8'},
 {name:'Air Wilds',sky:['#5aa4e0','#9ad2f4','#e2f4ff'],far:'#b0d4ec',mid:'#f0f8ff',top:'#5ee0c8',top2:'#3ab8a8',dirt:'#e0d2b4',dirt2:'#c8b896',farS:'isles',midS:'cloudbank',mm:'#a8d8f4'},
 {name:'Sunspire Isle',sky:['#8aa8ec','#cfc4f2','#fbe6f2'],far:'#cabce6',mid:'#fbf4ff',top:'#c8a8f0',top2:'#9a7ad0',dirt:'#ecdcc8',dirt2:'#d4bea4',farS:'isles',midS:'cloudbank',mm:'#c8a8f0'}]);
reg(BIOMES,8,[
 {name:'Autumn Wilds',sky:['#d8705e','#f2a272','#ffdcaa'],far:'#d8a08a',mid:'#ffe8d2',top:'#e8843a',top2:'#c0502a',dirt:'#9a6a4a',dirt2:'#7a4e36',farS:'isles',midS:'cloudbank',mm:'#e8843a'},
 {name:'Aldenreach',sky:['#c8605e','#ec9470','#ffd2a2'],far:'#c89080',mid:'#ffe2c8',top:'#e07030',top2:'#b84a22',dirt:'#8a5a3e',dirt2:'#6a4230',farS:'isles',midS:'cloudbank',mm:'#e07030'}]);
reg(BIOMEINFO,5,['Peaceful skies','Pegasi · sky islands · storms','Peaceful skies']);
reg(BIOMEINFO,8,['Harpies · cultists · ruins','The capital · Vex\'s Tower']);
const AIRB=[6,8]; // biomes with open-sky air foes (world2/sky.js, skyfoes.js)
// Skylands air wilds (hull = damage to an airship)
Object.assign(ENEMY,{
 pegasus:{hp:55,dmg:11,hull:10,spd:190,w:18,h:14,coin:[6,12],air:1,gem:.15},
 skySlime:{hp:40,dmg:8,hull:7,spd:38,w:12,h:10,coin:[3,7],air:1,gem:.15}, // gem: open-sky Sky Crystal, straight into S.mats (airGem)
 // sky-island foes: isle:1 routes them through updAir/drawAir to world2/skyisles.js (dmg = touch; the unicorn's bolt is UNI.bolt)
 // burst = bolts per volley (same aim, UNI.gap apart), gem = chance to drop a Sky Crystal, fruit = chance to drop a Sunfruit (replaces the slime apple), elite = gold-maned variant
 unicorn:{hp:70,dmg:7,hull:9,spd:34,w:16,h:20,coin:[10,18],air:1,isle:1,base:'witch',uni:1,burst:2},
 dreadUni:{hp:110,dmg:9,hull:11,spd:40,w:16,h:20,coin:[20,32],air:1,isle:1,base:'witch',uni:1,burst:3,elite:1,gem:.35},
 bigSlime:{hp:110,dmg:9,hull:10,spd:50,w:22,h:18,coin:[12,20],air:1,isle:1,base:'slime',gem:.15,fruit:.25},
 isleSlime:{hp:24,dmg:7,hull:5,spd:50,w:10,h:8,coin:[2,4],air:1,isle:1,base:'slime',fruit:.25},
 // autumn foes (world2/autumnfoes.js): FINAL numbers, not run through W2T below. cult = sun cultist (fast knife lunge), bot = Forgotten Robot (slam + telegraphed laser)
 cultist:{hp:110,dmg:58,hull:10,spd:92,w:8,h:15,coin:[30,50],air:1,isle:1,base:'cultist',cult:1,amber:.06},
 robot:{hp:320,dmg:52,hull:12,spd:22,w:18,h:22,coin:[45,75],air:1,isle:1,base:'robot',bot:1,gem:.5},
 harpy:{hp:125,dmg:30,hull:10,spd:120,w:16,h:16,coin:[24,40],air:1,gem:.2,harpy:1}}); // open-sky flyer of the autumn wilds: hovers at range, throws feather fans (AUF.feather)
// World 2 is end-game: you arrive with maxed World 1 gear (Magma Lance, Stone set, II-III enchants). The tier scales every sky foe
// (and the unicorn bolt) once, here; the numbers above stay readable as "World 1 sized". hull (shelved airships) is not scaled.
const W2T={hp:4.5,dmg:4,coin:3};
for(const t of ['pegasus','skySlime','unicorn','dreadUni','bigSlime','isleSlime']){const d=ENEMY[t];d.hp=Math.round(d.hp*W2T.hp);d.dmg=Math.round(d.dmg*W2T.dmg);d.coin=d.coin.map(c=>Math.round(c*W2T.coin))}
// HP nerf on top of the tier (Oct 2026): pegasus, unicorn, dread unicorn and big slime at 1/2 (sky slime and the big slime's isle slimes unchanged)
const W2HPN={pegasus:.5,unicorn:.5,dreadUni:.5,bigSlime:.5};for(const t in W2HPN)ENEMY[t].hp=Math.round(ENEMY[t].hp*W2HPN[t]);
UNI.bolt=Math.round(UNI.bolt*W2T.dmg);
// Autumn wilds x1.5 (Oct 2026): cultist, Forgotten Robot and harpy (autumn-only) get it here; their laser / feathers in AUF (world2/autumnfoes.js).
// Unicorns, dread unicorns and pegasi get it per spawn when they spawn in the autumn wilds (au islands, biome 8): auBuff marks e.au, updAir swaps in auD(type)
const AUMUL=1.5;for(const t of ['cultist','robot','harpy']){const d=ENEMY[t];d.hp=Math.round(d.hp*AUMUL);d.dmg=Math.round(d.dmg*AUMUL)}
const AUBUFF=['unicorn','dreadUni','pegasus'],AUDC={};
function auD(t){return AUDC[t]||(AUDC[t]=Object.assign({},ENEMY[t],{dmg:Math.round(ENEMY[t].dmg*AUMUL)}))}
function auBuff(e){if(!AUBUFF.includes(e.type)||e.au)return e;e.au=1;e.hp=e.max=Math.round(e.max*AUMUL);return e}
reg(SPAWNS,5,[[['slime',1]],[['pegasus',.55],['skySlime',.45]],[['slime',1]]]);
reg(SPAWNS,8,[[['harpy',.55],['pegasus',.45]],[['slime',1]]]);
// World 2 definition (see WORLDDEF in core/registry.js)
WORLDDEF[1]={name:'Skylands',len:W2LEN,bounds:[0,ISLES[0].x1,ISLES[1].x0,10900,ISLES[2].x0,W2LEN],wb:[5,6,7,8,9],xmin:ISL0+24,xmax:ISLES[2].x1-24,dungeons:[],
 rawH(x){for(const I of SKYISLES)if(x>I.x0-6&&x<I.x1+6)return isleH(I,x);if(x>CAPW.x0-260&&x<CAPW.x1+260)return 22+lerp(8*Math.sin(x/170)+4*Math.sin(x/53),0,smooth(clamp((Math.min(x-CAPW.x0,CAPW.x1-x)+260)/200,0,1)));return 22+8*Math.sin(x/170)+4*Math.sin(x/53)},
 flat:[],pits:null,
 decorOK(x){return islAt(x-12)>=0&&islAt(x+12)>=0&&DOCKS.every(d=>Math.abs(x-d.x)>80)&&!(x>CAPW.x0-40&&x<CAPW.x1+40)&&CAPW.piers.every(q=>Math.abs(x-q)>70)},
 town:W2TOWN,money:W2START,arriveX:W2DOCK-34,horseOff:26, // first arrival: Skyhaven, W2START coins, by the dock
 // cart: World 2's hauler is the Winged Cart once bought (S.wcart); with drivable airships on, cargo rides in the ship instead
 cart(){return FEATURE_DRIVABLE_AIRSHIPS?'backpack':S.carriage&&S.w2c!=='wingcart'?'carriage':S.wcart?'wingcart':'backpack'},parkIco:'wcartP',carry:'hold',autoHitch:0,
 leave(s,o){o.hold=s.cargo;o.park=s.park||null},
 fresh(s){s.w2l=W2L}, // new games are on the current World 2 layout
 migrate(s,d){w2Mats(s);if(d.w2l>=W2L)return;s.w2l=W2L; // older saves: World 2 positions onto the bigger islands (core/state.js load(), before anything checks them)
  const M=x=>isFinite(x)?clamp(w2Remap(+x),0,W2LEN):x;
  if(s.w===1){s.x=w2Land(M(s.x));if(s.horse&&s.horse.x!=null)s.horse.x=M(s.horse.x);if(s.park)s.park.x=M(s.park.x)}
  else{const o=s.ws&&s.ws[1];if(o){o.x=w2Land(M(o.x));if(o.park)o.park.x=M(o.park.x)}}}};
