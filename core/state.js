'use strict';
const KEY='merchantRoad.v1';
let S,P,ENEMIES=[],PROJ=[],PARTS=[],PICK=[],ROCKS=[],FTXT=[];
let MODE='menu';
function fresh(){const s={wcart:false,money:50,hp:100,maxhp:100,potions:1,hauler:'backpack',haulers:['backpack'],weapons:['fists'],weapon:'fists',cargo:[],lastTown:0,x:TOWNS[0].x,time:0,stats:{kills:0,profit:0,sold:0,deaths:0},visited:[0],park:null,dng:{},caves:[],gear:['tophat'],eq:{head:'tophat',chest:null,feet:null},mats:{essence:0,lava:0},look:Object.assign({},DEFLOOK),ench:{},witch:null,horse:null,lances:[],lance:null,scrap:{wood:0,apple:0,gold:0,done:false},w:0,ws:{},ships:['small'],ship:'small',w2seen:false,wal:1,moor:0,hull:60,v:2};for(const W of WORLDDEF)if(W.fresh)W.fresh(s);return s}
function newPlayer(x){return {x,y:surfY(x),vy:0,kbx:0,dir:1,onGround:true,inv:0,cd:0,atk:0,walk:0,wheel:0,lastSafe:x,heat:0}}
function save(){if(!S)return;S.x=Math.round(DG?DG.d.x:P.x);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.cargo){const s=Object.assign(fresh(),d);
  for(const W of WORLDDEF)if(W.migrate)W.migrate(s,d); // a world's own layout migrations (e.g. World 2 positions), before anything below checks them
  // migrate older saves (no carts parking / caves)
  if(!s.dng||typeof s.dng!=='object')s.dng={};if(!Array.isArray(s.caves))s.caves=[];
  if(!Array.isArray(s.gear))s.gear=[];s.gear=s.gear.filter(g=>GEAR[g]);if(!s.eq||typeof s.eq!=='object')s.eq={};
  if(!s.gear.includes('tophat'))s.gear.unshift('tophat');
  // v2: Top Hat moved from the old accessory slot to the head slot (a Witch Hat on the head wins)
  if(!(d.v>=2)){const hat='acc' in s.eq?s.eq.acc==='tophat':true;delete s.eq.acc;if(hat&&!s.eq.head)s.eq.head='tophat';s.v=2}
  if(!s.mats||typeof s.mats!=='object')s.mats={};for(const k in MATS)s.mats[k]=Math.max(0,Math.floor(+s.mats[k]||0));for(const k in s.mats)if(!MATS[k])delete s.mats[k];
  s.weapons=s.weapons.filter(w=>WEAPONS[w]);s.look=fixLook(s.look);for(const [sl] of GSLOTS){const g=s.eq[sl];if(!(g&&GEAR[g]&&GEAR[g].slot===sl&&s.gear.includes(g)))s.eq[sl]=null}
  if(!Array.isArray(s.weapons)||!s.weapons.length)s.weapons=['fists'];if(!WEAPONS[s.weapon])s.weapon=s.weapons[0];
  const pk=s.park;if(pk&&(!Array.isArray(pk.cargo)||!isFinite(pk.x)||s.hauler==='backpack'||!HAULERS[s.hauler])){if(Array.isArray(pk.cargo))s.cargo=s.cargo.concat(pk.cargo);s.park=null}
  /* horse + lances (new): horse = null | {on, x, dir}; parked horses keep their spot */
  if(!Array.isArray(s.lances))s.lances=[];s.lances=s.lances.filter((l,i,a)=>WEAPONS[l]&&WEAPONS[l].lance&&a.indexOf(l)===i);
  {const h=s.horse;if(!h||typeof h!=='object')s.horse=null;else{h.on=!!h.on;h.dir=h.dir<0?-1:1;h.wings=!!h.wings||(s.w===1&&!!s.w2seen);if(h.on)h.x=null;else if(!isFinite(h.x))h.x=TOWNS[s.lastTown|0].x+30;else h.x=clamp(+h.x,20,WORLD-20);if(!s.lances.length)s.lances=['woodlance']}}
  if(!s.lances.includes(s.lance))s.lance=s.lances[0]||null;
  if(!s.ench||typeof s.ench!=='object')s.ench={};for(const k in s.ench){let v=s.ench[k];if(v&&!Array.isArray(v))v=[{k:v.k,l:1}];/* old single enchant -> level I */v=Array.isArray(v)?v.filter(x=>x&&ENCH[x.k]).map(x=>({k:x.k,l:clamp(Math.floor(+x.l||1),1,3)})).slice(0,3):[];if(!v.length||!(s.weapons.includes(k)||s.gear.includes(k)||s.lances.includes(k)))delete s.ench[k];else s.ench[k]=v}
  delete s.offers; // old 3-offer table is gone
  /* World 2: s.w = current world, s.ws[w] = the other world's spot {x,lastTown,park}; a free Small Airship */
  s.w=s.w===1?1:0;if(!s.ws||typeof s.ws!=='object')s.ws={};
  for(const k of [0,1]){const o=s.ws[k];if(!(o&&isFinite(o.x)&&TOWNS[o.lastTown]&&TOWNS[o.lastTown].w===k))delete s.ws[k];else{if(o.park&&!(Array.isArray(o.park.cargo)&&isFinite(o.park.x)))o.park=null;if(o.park)o.park.cargo=cargoOK(o.park.cargo);o.stash=cargoOK(o.stash);o.hold=cargoOK(o.hold);if(!isFinite(o.money))delete o.money;else o.money=Math.max(0,Math.round(o.money))}}
  delete s.ws[s.w===1?1:0];
  /* wallet migration (saves from before separate money): the shared balance becomes World 1's money, World 2 restarts at $100,
     World 1 goods go back to the World 1 wagon/airship spot, World 2 goods go to the airship hold */
  if(!d.wal){const isW1=c=>!(TOWNS[c.origin]&&TOWNS[c.origin].w===1);s.cargo=cargoOK(s.cargo);
   if(s.w===1){const o=s.ws[0]||(s.ws[0]={x:SCRAPX-60,lastTown:5,park:null,stash:[],hold:[]});o.money=Math.max(0,Math.round(+s.money||0));
    const g1=s.cargo.filter(isW1);s.cargo=s.cargo.filter(c=>!isW1(c));
    if(g1.length){if(o.park)o.park.cargo=o.park.cargo.concat(g1);else if(s.hauler!=='backpack')o.park={x:SCRAPX-110,dir:-1,cargo:g1};else o.stash=(o.stash||[]).concat(g1)}
    s.money=W2START}
   else{const w2=s.cargo.filter(c=>!isW1(c)).concat(s.park?s.park.cargo.filter(c=>!isW1(c)):[]);s.cargo=s.cargo.filter(isW1);if(s.park&&Array.isArray(s.park.cargo))s.park.cargo=s.park.cargo.filter(isW1);
    if(s.ws[1]||w2.length){const o=s.ws[1]||(s.ws[1]={x:W2DOCK-34,lastTown:W2TOWN});o.money=W2START;o.hold=(o.hold||[]).concat(w2)}}
   s.wal=1}
  if(!Array.isArray(s.ships))s.ships=[];s.ships=s.ships.filter((v,i,a)=>SHIPS[v]&&a.indexOf(v)===i);if(!s.ships.includes('small'))s.ships.unshift('small');if(!s.ships.includes(s.ship))s.ship='small';s.w2seen=!!s.w2seen;s.moor=s.moor===1?1:0;{const mh=SHIPS[s.ship].hull;s.hull=isFinite(s.hull)?clamp(+s.hull,1,mh):mh}
  if(s.w===1&&!s.horse){leaveW(s,s.x);const o=enterW(s,0);s.x=isFinite(o.x)?o.x:SCRAPX-60}
  if(s.w===1&&s.park){if(!Array.isArray(s.park.cargo))s.park=null;else s.park.cargo=cargoOK(s.park.cargo)}if(!TOWNS[s.lastTown]||TOWNS[s.lastTown].w!==s.w)s.lastTown=s.w?W2TOWN:0;
  /* airship scrap pile (new): deposits are permanent */
  {const sc=s.scrap;s.scrap={wood:0,apple:0,gold:0,done:false};if(sc&&typeof sc==='object'){for(const k of SCRAPK)s.scrap[k]=clamp(Math.floor(+sc[k]||0),0,NEED[k]);s.scrap.done=!!sc.done&&SCRAPK.every(k=>s.scrap[k]>=NEED[k])}}
  const wt=s.witch;if(!(wt&&isFinite(wt.x)&&isFinite(wt.t)))s.witch=null;else wt.seen=!!wt.seen;
  /* cost basis: stacks from old saves without a valid price get the good's base price */
  const fixPaid=a=>{if(Array.isArray(a))for(const c of a)if(c&&!(isFinite(c.paid)&&c.paid>=0))c.paid=ITEMS[c.item]?ITEMS[c.item].base:0};fixPaid(s.cargo);if(s.park)fixPaid(s.park.cargo);
  if(!FEATURE_DRIVABLE_AIRSHIPS&&!s.shelf){shelveShips(s);s.shelf=1}
  s.wcart=!!s.wcart;if(s.w===1&&s.park&&(!s.wcart||!onIsleX(s.park.x)||!Array.isArray(s.park.cargo))){if(s.wcart&&s.park&&Array.isArray(s.park.cargo))s.park.x=DOCKS[0].x-60;else s.park=null}
  if(s.w===0&&s.ws[1]&&s.ws[1].park&&!s.wcart)s.ws[1].park=null;
  if(!HAULERS[s.hauler])s.hauler='backpack';return s}}catch(e){}return null}
// airships shelved: land everyone at Skyhaven, World 2 goods fit the backpack (most valuable first), the rest and any bought airships are refunded in full to the World 2 wallet
function shelveShips(s){const act=s.w===1,o=act?null:s.ws[1];let rf=0;
 for(const id of s.ships)if(id!=='small'&&SHIPS[id])rf+=SHIPS[id].price;
 const g=act?s.cargo.concat(s.park&&Array.isArray(s.park.cargo)?s.park.cargo:[]):(o?cargoOK(o.hold).concat(o.park&&Array.isArray(o.park.cargo)?cargoOK(o.park.cargo):[]):[]);
 const u=unitsOf(g).sort((a,b)=>ITEMS[b.item].base-ITEMS[a.item].base),keep=u.slice(0,PACK);for(const x of u.slice(PACK))rf+=+x.paid||0;rf=Math.round(rf);
 if(act){s.cargo=stacksOf(keep);s.park=null;if(s.moor!==0||!onIsleX(s.x)){s.x=DOCKS[0].x;s.lastTown=W2TOWN}s.money=Math.max(0,Math.round(+s.money||0))+rf}
 else if(o){o.hold=stacksOf(keep);o.park=null;if(s.moor!==0){o.x=DOCKS[0].x-34;o.lastTown=W2TOWN}o.money=(isFinite(o.money)?o.money:W2START)+rf}
 s.ships=['small'];s.ship='small';s.moor=0;s.hull=SHIPS.small.hull;if(rf>0)s.shelfRf=(s.shelfRf||0)+rf}
function onIsleX(x){return ISLES.some(I=>x>=I.x0&&x<=I.x1)}
// each world keeps its own money and its own goods. s.ws[w] holds the world you're NOT in:
// {x,lastTown,money, park (W1 cart), stash (W1 goods left at the airship without a cart), hold (W2 goods in the airship at the dock)}
const cargoOK=a=>Array.isArray(a)?a.filter(c=>c&&ITEMS[c.item]&&TOWNS[c.origin]&&c.qty>0).map(c=>({item:c.item,origin:c.origin,qty:Math.floor(c.qty),paid:+c.paid||0})):[];
