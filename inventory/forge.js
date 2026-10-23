'use strict';
const RECIPES=[{id:'flamesword',kind:'w',need:{essence:2,iron:2,lava:1}},{id:'firestaff',kind:'w',need:{essence:2,iron:2,lava:1}},{id:'magmalance',kind:'w',need:{stone:3,lava:1,iron:1}},{id:'witchhat',kind:'g',need:{essence:2}},{id:'witchrobe',kind:'g',need:{essence:3}},{id:'stonechest',kind:'g',need:{stone:3}},{id:'stonehelm',kind:'g',need:{stone:2}},{id:'witchboots',kind:'g',need:{essence:2}},{id:'stoneboots',kind:'g',need:{stone:2}},
 // World 2 (w:1, Skyhaven forge): Sky Crystal is a cargo item (CARGOMAT), essence a mat
 {id:'crystalhelm',kind:'g',w:1,need:{skyglass:6,essence:15}},{id:'crystalchest',kind:'g',w:1,need:{skyglass:6,essence:15}},{id:'crystalboots',kind:'g',w:1,need:{skyglass:6,essence:15}}];
const CARGOMAT={iron:4,skyglass:7}; // recipe needs paid in cargo units (any origin) instead of S.mats
function recipesHere(){return RECIPES.filter(r=>(r.w||0)===WI)}
function matURL(k){return CARGOMAT[k]!=null?ICONURL[ITEMS[CARGOMAT[k]].id]:MATURL[k]}
function have(k){const it=CARGOMAT[k];return it!=null?S.cargo.filter(s=>s.item===it).reduce((a,s)=>a+s.qty,0):(S.mats[k]||0)}
function owns(r){return r.kind==='w'?(WEAPONS[r.id].lance?S.lances.includes(r.id):S.weapons.includes(r.id)):S.gear.includes(r.id)}
function canCraft(r){return !owns(r)&&Object.entries(r.need).every(([k,n])=>have(k)>=n)}
function craft(id){const r=RECIPES.find(r=>r.id===id);if(!r||!canCraft(r))return false;
 for(const [k,n] of Object.entries(r.need)){const it=CARGOMAT[k];if(it!=null){let left=n;for(let i=S.cargo.length-1;i>=0&&left>0;i--){const st=S.cargo[i];if(st.item!==it)continue;const t=Math.min(left,st.qty);st.qty-=t;left-=t;if(st.qty<=0)S.cargo.splice(i,1)}}else S.mats[k]-=n}
 let nm;if(r.kind==='w'&&WEAPONS[id].lance){S.lances.push(id);S.lance=id;nm=WEAPONS[id].name}else if(r.kind==='w'){S.weapons.push(id);S.weapon=id;nm=WEAPONS[id].name}else{S.gear.push(id);const sl=GEAR[id].slot;if(!S.eq[sl]||S.eq[sl]==='tophat')S.eq[sl]=id;nm=GEAR[id].name}
 toast('<img class="px" style="width:20px;height:20px;vertical-align:middle" src="'+gearIcon(id)+'"> <b>'+nm+'</b> ✓',2000);save();return true}
