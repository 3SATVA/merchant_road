'use strict';
let DG=null; // active dungeon run (null = on the road)
// Worlds append their goods, haulers, towns, biomes, enemies and spawn tables here (world1/data.js, then world2/data.js).
// ITEMS / TOWNS / BIOMES / SPAWNS indices are save data (cargo item + origin, lastTown, visited): append only, World 1 first;
// reg() throws if a world registers out of order. Object tables keep insertion order: World 1 keys, then World 2.
const ITEMS=[],TOWNS=[],BIOMES=[],BIOMEINFO=[],SPAWNS=[],ENEMY={},COFF={},HITCHR={}; // COFF: cart centre relative to player; HITCHR: how close you must be to hitch
const HAULERS={backpack:{name:'Backpack',cap:5,spd:1,jump:1,price:0}};
function reg(list,at,arr){if(list.length!==at)throw new Error('registry order: expected index '+at+', have '+list.length);list.push(...arr)}
// World definitions, indexed by world number (S.w / WI): layout, biome bands, caves, terrain, arrival point.
// world1/data.js fills WORLDDEF[0], world2/data.js fills WORLDDEF[1]; setWorld(n) loads the globals below from WORLDDEF[n].
const WORLDDEF=[];
const PACK=5; // backpack slots, always carried (part of every hauler's total)
const HORSEPRICE=1500,RIDE=1.5,GALLOP=92*RIDE; // horse: one-off price, no upkeep; riding = 1.5x walking
// World 1 = the road (biomes 0-4, Ashen Wastes = 4, airship scrap pile at the far east end)
// World 2 = Skylands (biome 5+ ; phase 1: the floating starting island with Skyhaven + its airship dock)
// setWorld(n) loads these from WORLDDEF[n] (the literals below must match WORLDDEF[0], they are needed before the defs load);
// biome and town indices are global across worlds so cargo origins/prices stay valid
let WORLD=15000,BOUNDS=[0,3200,6400,9600,12000,15000],NB=5,WB=[0,1,2,3,4],XMIN=12,XMAX=15000-12,WI=0;
const TOWNR=110, DUNIT=1500;
function biomeAt(x){for(let i=0;i<NB;i++)if(x<BOUNDS[i+1])return WB[i];return WB[NB-1]}
