'use strict';
const WEAPONS={
 fists:{name:'Fists',dmg:5,range:13,cd:.35,price:0},
 dagger:{name:'Dagger',dmg:8,range:16,cd:.22,price:40},
 sword:{name:'Sword',dmg:15,range:22,cd:.4,price:180},
 crossbow:{name:'Crossbow',dmg:13,cd:.6,ranged:1,pspd:280,price:350},
 firestaff:{name:'Fire Staff',dmg:15,cd:.65,ranged:1,pspd:180,elem:'fire',price:0,crafted:1},
 leafstaff:{name:'Leaf Staff',dmg:9,cd:.75,ranged:1,pspd:165,leaf:1,price:600},
 warhammer:{name:'Warhammer',dmg:38,range:22,cd:.85,elem:'crush',price:1200},
 frostspear:{name:'Frost Spear',dmg:24,range:34,cd:.5,elem:'ice',price:1800},
 obsidian:{name:'Obsidian Blade',dmg:34,range:25,cd:.3,price:5000},
 flamesword:{name:'Flame Sword',dmg:30,range:24,cd:.38,elem:'fire',burn:1,price:0,crafted:1},
 // lances: horseback only; damage scales with gallop speed (see lanceTick)
 woodlance:{name:'Wooden Lance',dmg:14,range:30,cd:.5,lance:1,price:0},
 ironlance:{name:'Iron Lance',dmg:24,range:32,cd:.5,lance:1,price:900},
 magmalance:{name:'Magma Lance',dmg:32,range:32,cd:.5,lance:1,elem:'fire',burn:1,price:0,crafted:1}};
const LORDER=['woodlance','ironlance','magmalance'];
// shop + balance tunables that used to be inline literals (one place to tune; also the shape a JSON/Supabase config would take)
const INN={rest:i=>10+i*8,pot:30,potMax:5,potHP:45,potHPBerserk:23}; // rest price grows with the town index; potions
const WORDER=['fists','dagger','sword','crossbow','leafstaff','firestaff','warhammer','frostspear','obsidian','flamesword'];const ICONORDER=WORDER.concat(LORDER);
function wmult(w,type){const e=w.elem;
 if(e==='fire'){if(type==='iceGolem')return 2;if(type==='slime')return 1.5;if(type==='lavaGolem')return .4}
 if(e==='ice'){if(type==='lavaGolem')return 2;if(type==='iceGolem')return .5}
 if(e==='crush'&&(ENEMY[type].base==='golem'))return 1.5;
 return 1}
const GEAR={stonechest:{name:'Stone Chestplate',slot:'chest',def:.2,val:75,stat:'🛡 -20%'},witchhat:{name:'Witch Hat',slot:'head',rng:.25,val:100,stat:'🏹 +25%'}};
GEAR.tophat={name:'Top Hat',slot:'head',val:0,stat:'—',base:1};
GEAR.stonehelm={name:'Stone Helm',slot:'head',def:.1,val:60,stat:'🛡 -10%'};
GEAR.witchboots={name:'Witch Boots',slot:'feet',rng:.1,spd:.08,val:80,stat:'🏹 +10% 👟 +8%'};
GEAR.stoneboots={name:'Stone Boots',slot:'feet',def:.06,kb:.5,val:60,stat:'🛡 -6% ⚓'};
GEAR.witchrobe={name:'Witch Robes',slot:'chest',def:.08,rng:.15,val:120,stat:'🏹 +15% 🛡 -8%'};
const GSLOTS=[['head','Head'],['chest','Chest'],['feet','Feet']];
const SETS={witch:{name:'Witch Set',pieces:['witchhat','witchrobe','witchboots'],col:'#c060ff',desc:'🔮 Twin shots'},stone:{name:'Stone Set',pieces:['stonehelm','stonechest','stoneboots'],col:'#7de0ff',desc:'❤ +30 · ⚓ · 📦 safe'}};
const MATS={stone:{name:'Sentient Stone',col:'#a8a8a8'},essence:{name:'Magic Essence',col:'#c060ff'},lava:{name:'Dried Lava',col:'#ff6a1a'}};
// drop chances by enemy family (DROPMUL lets tests force drops)
const DROPS={slime:[['apple',.25]],goblin:[['dagger',.1]],golem:[['stone',.3]],witch:[['essence',.3]],lavaGolem:[['lava',.1]]};let DROPMUL=1;
