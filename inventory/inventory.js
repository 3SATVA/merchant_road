'use strict';
function dropLoot(id,x,y){
 if(id==='apple'){const u={item:0,origin:nearestTown(DG?DG.d.x:x),paid:0};if(DG){if(cargoCount()<cap()){addCargo(0,u.origin,1,0);ftxt(P.x,P.y-30,'+1 Apple','#7de07a')}}else dropUnit(u,x,y);return}
 if(MATS[id]){if(DG)giveMat(id);else{PICK.push({mat:id,x,y,vx:(rnd()-.5)*80,vy:-170,life:45,ground:false});part(x,y,MATS[id].col,8,60)}return}
 if(DG){giveGear(id);return}
 PICK.push({gear:id,x,y,vx:(rnd()-.5)*80,vy:-170,life:45,ground:false});part(x,y,'#fff4b0',8,60)}
function giveMat(id){S.mats[id]=(S.mats[id]||0)+1;ftxt(P.x,P.y-30,'+1 '+MATS[id].name,MATS[id].col);part(P.x,P.y-12,MATS[id].col,8,50,-30);save()}
function gearIcon(id){return WEPURL[id]&&!GEAR[id]?WEPURL[id]:GEARURL[id]}
function giveGear(id){if(GEAR[id]&&GEAR[id].base)return;const name=GEAR[id]?GEAR[id].name:WEAPONS[id].name;let msg;
 if(GEAR[id]){if(S.gear.includes(id)){S.money+=GEAR[id].val;msg='+'+pr(GEAR[id].val)}else{S.gear.push(id);const sl=GEAR[id].slot;if(!S.eq[sl])S.eq[sl]=id;msg=GEAR[id].stat}}
 else{if(S.weapons.includes(id)){const v=Math.round(WEAPONS[id].price/2);S.money+=v;msg='+'+pr(v)}else{S.weapons.push(id);msg='⚔ '+WEAPONS[id].dmg}}
 toast('<img class="px" style="width:20px;height:20px;vertical-align:middle" src="'+gearIcon(id)+'"> <b>'+name+'</b><br><span class="up">'+msg+'</span>',2200);ftxt(P.x,P.y-30,name,'#ffd75e');save()}
function openInv(){if(MODE!=='play')return;setMode('inv');renderInv()}
function closeInv(){setMode('play')}
$('ibtn').onclick=openInv;$('invX').onclick=closeInv;
function tile(img,label,o){o=o||{};if(o.en&&encList(o.en).length){o.cls=(o.cls?o.cls+' ':'')+'ench';o.st='--ec:'+enchCol(o.en);o.s=(o.s||'')+enchTag(o.en)}return '<button class="tile'+(o.cls?' '+o.cls:'')+'"'+(o.st?' style="'+o.st+'"':'')+(o.act?' data-act="'+o.act+'" data-id="'+o.id+'"':'')+'>'+(o.q?'<span class="q">'+o.q+'</span>':'')+(img?'<img src="'+img+'">':'<span style="font-size:20px;opacity:.5">·</span>')+'<span>'+label+'</span>'+(o.s?'<span class="s">'+o.s+'</span>':'')+'</button>'}
function wstat(W){return ico('tsword')+W.dmg+(W.ranged?' '+ico('tbow'):'')}
function renderInv(){$('imoney').textContent=pr(S.money);let h='';const W=WEAPONS[S.weapon];
 h+='<div class="tiles slots"><canvas id="iprev" width="28" height="28"></canvas>'+tile(WEPURL[S.weapon],W.name,{cls:'eq',s:wstat(W),en:S.weapon});
 for(const [sl,lab] of GSLOTS){const g=S.eq[sl];h+=g?tile(GEARURL[g],GEAR[g].name,{cls:'eq',act:'uneq',id:sl,s:GEAR[g].stat,en:g}):tile('','<span class="l">'+lab+'</span>',{cls:'empty'})}
 h+='</div>';
 const owned=S.gear.filter(g=>!Object.values(S.eq).includes(g)),wps=S.weapons.filter(w=>w!==S.weapon);
 if(owned.length||wps.length){h+='<div class="sec">GEAR</div><div class="tiles">';for(const g of owned)h+=tile(GEARURL[g],GEAR[g].name,{act:'eq',id:g,s:GEAR[g].stat,en:g});for(const w of wps)h+=tile(WEPURL[w],WEAPONS[w].name,{act:'eqw',id:w,s:wstat(WEAPONS[w]),en:w});h+='</div>'}
 for(const id in SETS){const st=SETS[id],ownN=st.pieces.filter(g=>S.gear.includes(g)).length,wear=st.pieces.filter(g=>S.eq[GEAR[g].slot]===g).length;if(!ownN)continue;const on=wear===3;
  h+='<div class="row" style="'+(on?'box-shadow:0 0 0 2px #000,0 0 0 4px '+st.col+';background:#3e2a44':'')+'">'+st.pieces.map(g=>'<img class="px" style="width:20px;height:20px;'+(S.eq[GEAR[g].slot]===g?'':S.gear.includes(g)?'opacity:.5':'opacity:.15')+'" src="'+GEARURL[g]+'">').join('')+'<span class="nm">'+st.name+'<span class="sub" style="color:'+(on?'#7de07a':'#8a7a70')+'">'+st.desc+'</span></span><span class="'+(on?'up':'')+'">'+wear+'/3</span></div>'}
 if(S.lances.length){h+='<div class="sec">🐴 LANCE</div><div class="tiles">';for(const l of S.lances)h+=tile(WEPURL[l],WEAPONS[l].name,{cls:S.lance===l?'eq':'',act:'eql',id:l,s:ico('tsword')+WEAPONS[l].dmg,en:l});h+='</div>'}
 const mk=Object.keys(MATS).filter(k=>S.mats[k]>0);if(mk.length){h+='<div class="sec">MATERIALS</div><div class="tiles">';for(const k of mk)h+=tile(MATURL[k],MATS[k].name,{q:'×'+S.mats[k]});h+='</div>'}
 h+='<div class="sec">'+(S.park?'🎒 ':'')+'CARGO '+cargoCount()+'/'+cap()+'</div><div class="tiles">';
 if(!S.cargo.length)h+=tile('','Empty',{cls:'empty'});for(const st of S.cargo)h+=tile(ICONURL[ITEMS[st.item].id],ITEMS[st.item].name,{q:'×'+st.qty,s:'<span style="color:#b49a88">'+TOWNS[st.origin].name+'</span>'});h+='</div>';
 if(S.park){h+='<div class="sec">🛒 🅿 '+cargoN(S.park.cargo)+'/'+(HAULERS[S.hauler].cap-PACK)+'</div><div class="tiles">';if(!S.park.cargo.length)h+=tile('','Empty',{cls:'empty'});for(const st of S.park.cargo)h+=tile(ICONURL[ITEMS[st.item].id],ITEMS[st.item].name,{cls:'dim',q:'×'+st.qty});h+='</div>'}
 h+='<div class="small" style="margin-top:8px">🧪'+S.potions+' · ❤ '+Math.ceil(S.hp)+'/'+maxHP()+(defTotal()?' · 🛡 -'+Math.round(defTotal()*100)+'%':'')+(gearSum('rng')?' · 🏹 +'+Math.round(gearSum('rng')*100)+'%':'')+'</div>';
 $('ibody').innerHTML=h;drawPrev($('iprev'),0,false);updHUD()}
$('ibody').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const a=b.dataset.act,id=b.dataset.id;
 if(a==='eq'&&GEAR[id]&&S.gear.includes(id))S.eq[GEAR[id].slot]=id;
 else if(a==='uneq')S.eq[id]=null;
 else if(a==='eqw'&&S.weapons.includes(id))S.weapon=id;
 else if(a==='eql'&&S.lances.includes(id))S.lance=id;
 S.hp=Math.min(S.hp,maxHP());save();renderInv()};
function setOn(id){const st=SETS[id];return !!(S&&S.eq&&st.pieces.every(g=>S.eq[GEAR[g].slot]===g))}
function maxHP(){return (S?S.maxhp:100)+(S&&setOn('stone')?30:0)+(S&&S.ench?ev('hardy'):0)+(S&&S.eq?gearSum('hp')+(setOn('crystal')?3*CRYSET-gearSum('hp'):0):0)} // gear hp (crystal armor), the Crystal Set lifts its 3 x 30 to 3 x CRYSET
function gearSum(k){let v=0;for(const [sl] of GSLOTS){const g=S.eq&&S.eq[sl];if(g&&GEAR[g][k])v+=GEAR[g][k]}return v}
