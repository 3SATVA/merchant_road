'use strict';
// sky goods (World 2)
reg(ITEMS,6,[
 {id:'cloudwool',name:'Cloud Wool',base:20,col:'#e8f4ff'},
 {id:'skyglass',name:'Sky Crystal',base:260,col:'#7de0ff'},
 {id:'sunfruit',name:'Sunfruit',base:14,col:'#ffb040'},
 {id:'starsilk',name:'Star Silk',base:160,col:'#e8c8ff'}]);
HAULERS.wingcart={name:'Winged Cart',cap:20,spd:.9,jump:.95,price:400,w:1}; // World 2 only (Skyhaven), hitches to the winged horse
COFF.wingcart=-18;HITCHR.wingcart=32;
// airships: World 2 cargo haulers (hold = cargo cap there). spd/hull are used by phase-2 flying; shown in the shop now
const SHIPS={small:{name:'Small Airship',cap:30,spd:1.15,hull:60,price:0,z:.72,pal:['#c84a3a','#e8d8b0']},
 medium:{name:'Medium Airship',cap:60,spd:1,hull:100,price:6000,z:.9,pal:['#3a8ad0','#f4ead0']},
 large:{name:'Large Airship',cap:100,spd:.85,hull:160,price:20000,z:1.08,pal:['#e0b440','#f8f4e8']}};const SORDER=['small','medium','large'];
const SKY={dmg:.85,max:3,maxShip:3,pair:.45,gapHorse:[320,170],gapShip:[300,160],diveHorse:2,diveShip:1.6,diveRnd:1.1}; // air wilds: damage on the winged horse, foes at once, pair chance, px between spawns [min,+rnd], pegasus re-dive [s]
const WCART={knockCd:4,keep:.4,flash:3.8}; // Winged Cart: seconds between knock-loose losses, chance a hit costs nothing, hit flash while cd > flash
const W2LEN=9000,ISL0=150,ISL1=1950,W2DOCK=1560,W2TOWN=6,FLYALT=100,W2START=100; // World 2 layout; W2START = World 2's opening balance
// World 2 phase 2: two floating islands with the open-sky "air wilds" between them
const ISLES=[{x0:150,x1:1950},{x0:6800,x1:8600}];
const DOCKS=[{x:1560,side:1,isl:0,town:6},{x:6990,side:-1,isl:1,town:7}]; // side: which way the moored airship hangs off the pier
const BANDY=[-70,-140,-210]; // altitude bands: low (near islands, sky slimes), mid (pegasi), high (pegasi + tailwind)
const WX=[{x0:2500,x1:3150,k:'rain'},{x0:3450,x1:3700,k:'up'},{x0:4250,x1:4950,k:'rain'},{x0:5300,x1:5550,k:'up'},{x0:6000,x1:6450,k:'rain'}]; // rain pushes you down a band, updrafts lift you
// ===== FEATURE FLAG: drivable airships in World 2 (shop, boarding/mooring, piloting, hull + wrecks, airship cargo hold, mid-air leap to horse).
// Shelved for now (see SHELVED.md): all the code and sprites stay below, intact; set this to true to bring them back.
// The World 1 scrap-pile airship build and the airship that carries you between worlds (and the cutscene) are NOT affected.
const FEATURE_DRIVABLE_AIRSHIPS=false;
const SHIPV=118,HFLY=.5,JET=1.2,HULLFIX=12,WRECKLOSS=.3; // airship base speed (x ship spd); winged horse = gallop x0.5 (~69px/s: slower than any airship, the ship is the way to travel); high band x1.2; hull repairs 12/s while moored; a wreck loses 30% of the hold
// sky islands: small landable islands in the air wilds (no towns). Logic + art in world2/skyisles.js.
// h = surface height (BANDY is -70/-140/-210), top 1 = Sunspire lilac grass, storm 1 = under a storm cloud (no flying under it),
// rw = reward (chest / wool / crystal node) at the centre + rx, foes = spawned when you come near
const SKYISLES=[
 {x0:2250,x1:2480,h:100,top:0,rw:'wool',rx:34,foes:['bigSlime','unicorn']},
 {x0:3180,x1:3400,h:190,top:1,rw:'chest',rx:-24,foes:['unicorn','bigSlime']},
 {x0:3800,x1:4200,h:125,top:0,storm:1,rw:'crystal',rx:70,foes:['bigSlime','unicorn','bigSlime']},
 {x0:4500,x1:4760,h:85,top:1,rw:'wool',rx:-36,foes:['dreadUni','bigSlime']},
 {x0:5620,x1:5980,h:160,top:1,storm:1,rw:'chest',rx:46,foes:['unicorn','dreadUni','bigSlime']}];
const STORMIN=48; // the storm's no-fly core is the island minus this much at each end: land, cross, take off past the edge
const SKYI={chestCd:600,nodeCd:360,chest:[140,220],silk:2,wool:3,crystal:2}; // reward respawn [s of play time], chest coins + Star Silk, Cloud Wool / Sky Crystal per pick
const UNI={near:52,bolt:10,hull:9,tele:.5,gap:.2,spd:180,life:1.6,range:210,ang:.6,cd:1.6,cdR:.8}; // unicorn bolt: damage (x W2T.dmg), hull, telegraph [s], s between burst bolts (ENEMY.burst), px/s, life [s], aggro px, max aim [rad], cooldown + rnd
function islAt(x){for(let i=0;i<ISLES.length;i++)if(x>ISLES[i].x0&&x<ISLES[i].x1)return i;return -1}
function skyAt(x){for(let i=0;i<SKYISLES.length;i++)if(x>SKYISLES[i].x0&&x<SKYISLES[i].x1)return i;return -1}
function stormAt(x){const i=skyAt(x);if(i<0||!SKYISLES[i].storm)return false;const I=SKYISLES[i];return x>I.x0+STORMIN&&x<I.x1-STORMIN}
function onIsle(x){return islAt(x)>=0||skyAt(x)>=0}
function wxAt(x){for(const z of WX)if(x>z.x0&&x<z.x1)return z.k;return null}
function dockShipX(i){const d=DOCKS[i];return d.x+d.side*52}
reg(TOWNS,6,[
 {name:'Skyhaven',x:1050,w:1,ships:1,sells:[6,7],weapons:[],haulers:[]},
 {name:'Sunspire',x:7750,w:1,sells:[8,9],weapons:[],haulers:[]}]);
reg(BIOMES,5,[
 {name:'Sky Meadow',sky:['#78c4f0','#b4e2f8','#eaf8ff'],far:'#a8cce0',mid:'#f4fbff',top:'#5ee0c8',top2:'#3ab8a8',dirt:'#e0d2b4',dirt2:'#c8b896',farS:'isles',midS:'cloudbank',mm:'#5ee0c8'},
 {name:'Air Wilds',sky:['#5aa4e0','#9ad2f4','#e2f4ff'],far:'#b0d4ec',mid:'#f0f8ff',top:'#5ee0c8',top2:'#3ab8a8',dirt:'#e0d2b4',dirt2:'#c8b896',farS:'isles',midS:'cloudbank',mm:'#a8d8f4'},
 {name:'Sunspire Isle',sky:['#8aa8ec','#cfc4f2','#fbe6f2'],far:'#cabce6',mid:'#fbf4ff',top:'#c8a8f0',top2:'#9a7ad0',dirt:'#ecdcc8',dirt2:'#d4bea4',farS:'isles',midS:'cloudbank',mm:'#c8a8f0'}]);
reg(BIOMEINFO,5,['Peaceful skies','Pegasi · sky islands · storms','Peaceful skies']);
// Skylands air wilds (hull = damage to an airship)
Object.assign(ENEMY,{
 pegasus:{hp:55,dmg:11,hull:10,spd:190,w:18,h:14,coin:[6,12],air:1},
 skySlime:{hp:40,dmg:8,hull:7,spd:38,w:12,h:10,coin:[3,7],air:1},
 // sky-island foes: isle:1 routes them through updAir/drawAir to world2/skyisles.js (dmg = touch; the unicorn's bolt is UNI.bolt)
 // burst = bolts per volley (same aim, UNI.gap apart), gem = chance to drop a Sky Crystal, elite = gold-maned variant
 unicorn:{hp:70,dmg:7,hull:9,spd:34,w:16,h:20,coin:[10,18],air:1,isle:1,base:'witch',uni:1,burst:2},
 dreadUni:{hp:110,dmg:9,hull:11,spd:40,w:16,h:20,coin:[20,32],air:1,isle:1,base:'witch',uni:1,burst:3,elite:1,gem:.35},
 bigSlime:{hp:110,dmg:12,hull:10,spd:50,w:22,h:18,coin:[12,20],air:1,isle:1,base:'slime',gem:.15},
 isleSlime:{hp:24,dmg:7,hull:5,spd:50,w:10,h:8,coin:[2,4],air:1,isle:1,base:'slime'}});
// World 2 is end-game: you arrive with maxed World 1 gear (Magma Lance, Stone set, II-III enchants). The tier scales every sky foe
// (and the unicorn bolt) once, here; the numbers above stay readable as "World 1 sized". hull (shelved airships) is not scaled.
const W2T={hp:4.5,dmg:4,coin:3};
for(const t of ['pegasus','skySlime','unicorn','dreadUni','bigSlime','isleSlime']){const d=ENEMY[t];d.hp=Math.round(d.hp*W2T.hp);d.dmg=Math.round(d.dmg*W2T.dmg);d.coin=d.coin.map(c=>Math.round(c*W2T.coin))}
UNI.bolt=Math.round(UNI.bolt*W2T.dmg);
reg(SPAWNS,5,[[['slime',1]],[['pegasus',.55],['skySlime',.45]],[['slime',1]]]);
// World 2 definition (see WORLDDEF in core/registry.js)
WORLDDEF[1]={name:'Skylands',len:W2LEN,bounds:[0,ISLES[0].x1,ISLES[1].x0,W2LEN],wb:[5,6,7],xmin:ISL0+24,xmax:ISLES[1].x1-24,dungeons:[],
 rawH(x){for(const I of SKYISLES)if(x>I.x0-6&&x<I.x1+6){const ed=clamp(Math.min(x-I.x0,I.x1-x)/36,0,1);return I.h+2.5*Math.sin(x/29+I.h)-6*(1-ed)*(1-ed)}return 22+8*Math.sin(x/170)+4*Math.sin(x/53)},
 flat:[],pits:null,
 decorOK(x){return islAt(x-12)>=0&&islAt(x+12)>=0&&DOCKS.every(d=>Math.abs(x-d.x)>80)},
 town:W2TOWN,money:W2START,arriveX:W2DOCK-34,horseOff:26, // first arrival: Skyhaven, W2START coins, by the dock
 // cart: World 2's hauler is the Winged Cart once bought (S.wcart); with drivable airships on, cargo rides in the ship instead
 cart(){return S.wcart&&!FEATURE_DRIVABLE_AIRSHIPS?'wingcart':'backpack'},parkIco:'wcartP',carry:'hold',autoHitch:0,
 leave(s,o){o.hold=s.cargo;o.park=s.park||null}};
