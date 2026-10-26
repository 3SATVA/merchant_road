'use strict';
let curTab='market',curTown=0;
function enterTown(t,tab){curTown=t.i;S.lastTown=t.i;if(!S.visited.includes(t.i))S.visited.push(t.i);curTab=tab||'market'; // tab: Aldenreach's shop doors open their own tab (world2/capital.js CAPSHOP)
 setMode('town');renderTown();save()}
function leaveTown(){setMode('play');save()}
$('tLeave').onclick=leaveTown;
$('ttabs').onclick=e=>{const b=e.target.closest('button');if(b){curTab=b.dataset.tab;renderTown()}};
function pr(n){return '$'+Math.round(n).toLocaleString()}
// shop list: what this town sells, then what you own that it doesn't (in catalogue order)
function shopLists(order,sells,owned,row){const sale=order.filter(id=>sells.includes(id)),mine=order.filter(id=>owned.includes(id)&&!sells.includes(id));return (sale.length?'<div class="sec">FOR SALE</div>'+sale.map(row).join(''):'')+(mine.length?'<div class="sec">YOURS</div>'+mine.map(row).join(''):'')}
function iconImg(id,cls){return '<img class="px '+(cls||'')+'" src="'+id+'">'}
// building storefront icons for the town tabs
const BLDURL={};(function(){const mk=(roof,wall,fn)=>spriteURL(16,16,g=>{px(g,2,7,12,9,wall);for(let i=0;i<=7;i++)px(g,i,7-i,16-2*i,1,roof);px(g,6,11,4,5,'#4a2a18');fn(g)});
 BLDURL.market=mk('#b83a2a','#c89a62',g=>{for(let i=0;i<4;i++)px(g,1+i*4,7,2,2,i%2?'#f4f0e0':'#c83a3a');px(g,2,12,3,3,'#d83a3a');px(g,11,12,3,3,'#ffd040')});
 BLDURL.haulers=mk('#7a2a1a','#a8743c',g=>{const c=[[12,11],[13,12],[13,13],[12,14],[11,14],[10,13],[10,12],[11,11]];for(const [a,b] of c)px(g,a,b,1,1,'#2a1a10');px(g,11,12,2,2,'#c8a060')});
 BLDURL.weapons=mk('#4a4c58','#8a8a90',g=>{px(g,11,9,1,6,'#e8eef4');px(g,10,13,3,1,'#d8b040');px(g,11,14,1,2,'#5a3818');px(g,2,12,3,2,'#3a3a40')});
 BLDURL.inn=mk('#3a5a9a','#c89a62',g=>{px(g,2,9,3,3,'#ffe08a');px(g,11,9,3,3,'#ffe08a');px(g,11,13,3,3,'#c8a060');px(g,14,14,1,1,'#c8a060')});
 BLDURL.craft=mk('#3a3a40','#6a6c78',g=>{px(g,9,10,6,2,'#c8ccd4');px(g,11,12,2,2,'#9aa0aa');px(g,10,14,4,1,'#9aa0aa');px(g,2,12,3,3,'#ff8a2a');px(g,3,11,1,1,'#ffd040');px(g,13,1,2,6,'#4a4c58');px(g,13,0,2,1,'#888')});
 BLDURL.stable=mk('#6a3a1a','#a8743c',g=>{px(g,5,10,6,6,'#3a2414');px(g,5,10,6,1,'#5a3818');px(g,6,12,4,1,'#d8b060');px(g,7,13,2,1,'#d8b060');for(const [a,b] of [[11,9],[11,10],[11,11],[14,9],[14,10],[14,11],[12,12],[13,12]])px(g,a,b,1,1,'#c8ccd4');px(g,1,14,3,2,'#e8c860');px(g,12,14,3,2,'#e8c860')});
 BLDURL.barber=mk('#2a3a6a','#e8e0d0',g=>{px(g,12,8,3,1,'#c8c8c8');for(let i=0;i<6;i++)px(g,12,9+i,3,1,['#e83a3a','#f4f4f4','#3a6ad0'][i%3]);px(g,12,15,3,1,'#c8c8c8');px(g,2,10,3,3,'#ffe08a')})})();
BLDURL.ships=ICO.ship.url;document.querySelectorAll('#ttabs img[data-b]').forEach(i=>i.src=BLDURL[i.dataset.b]);
function lookPrev(look,eq,w,h,dx,dy){return spriteURL(w,h,g=>drawPlayer(g,dx,dy,1,0,false,false,false,'fists',0,{look,eq}))}
function drawPrev(cv,t,walk){if(!cv)return;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,cv.width,cv.height);drawPlayer(g,Math.floor(cv.width/2),cv.height-4,1,t||0,!!walk,false,false,S.weapon,0,{eq:S.eq,look:S.look});setAura(g,Math.floor(cv.width/2),cv.height-4,t||0)}
function renderTown(){const t=TOWNS[curTown];$('tname').textContent=t.name;$('tmoney').textContent=pr(S.money);
 [...$('ttabs').children].forEach(b=>{b.classList.toggle('on',b.dataset.tab===curTab);const tb=b.dataset.tab;b.style.display=(tb==='haulers'&&!t.w&&!t.haulers.length&&S.haulers.length<2)||(tb==='weapons'&&!t.weapons.length&&S.weapons.length<2)||(tb==='barber'&&!t.barber)||(tb==='craft'&&!t.forge)||(tb==='stable'&&!t.stable)||(tb==='ships'&&(!t.ships||!FEATURE_DRIVABLE_AIRSHIPS))||(tb==='haulers'&&t.w&&((t.i!==W2TOWN&&!t.carrier)||FEATURE_DRIVABLE_AIRSHIPS))?'none':''});let h='';
 if(curTab==='market'){const n=cargoCount(),c=cap();
  h+='<div class="sec">CARGO '+n+'/'+c+'</div>';
  if(!S.cargo.length)h+='<div class="row dim"><span class="nm">Empty</span></div>';
  S.cargo.forEach((s,si)=>{const p=sellPrice(t.i,s.item,s.origin),d=Math.round(p-s.paid);h+='<div class="row">'+iconImg(ICONURL[ITEMS[s.item].id])+'<span class="nm">'+ITEMS[s.item].name+' ×'+s.qty+'<span class="sub">from '+TOWNS[s.origin].name+'</span></span><span>'+pr(p)+' <span class="'+(d>=0?'up':'dn2')+'">'+(d>=0?'+':'')+d+'</span></span><button data-act="sell" data-i="'+si+'" data-n="1">Sell</button><button data-act="sell" data-i="'+si+'" data-n="999">All</button></div>'});
  h+='<div class="sec">BUY</div>';
  t.sells.forEach(i=>{const p=buyPrice(t.i,i);const pool=WT,pk=pool.indexOf(t);const far=pool.reduce((b,o)=>{const v=sellPrice(o.i,i,t.i);return v>b.v?{v,o}:b},{v:0});const nb=pool[pk+1]||pool[pk-1];const nv=nb?sellPrice(nb.i,i,t.i):0;
   const tr=p>ITEMS[i].base?'<span class="dn2">▲</span>':p<ITEMS[i].base?'<span class="up">▼</span>':'';
   const can=Math.min(c-n,Math.floor(S.money/p));
   h+='<div class="row" data-b="'+i+'">'+iconImg(ICONURL[ITEMS[i].id])+'<span class="nm">'+ITEMS[i].name+' '+pr(p)+tr+(nb?'<span class="sub">'+nb.name+' '+pr(nv)+(far.o!==nb?' · '+far.o.name+' '+pr(far.v):'')+'</span>':'')+'</span><button data-act="buy" data-i="'+i+'" data-n="1" '+(can<1?'disabled':'')+'>+1</button><button data-act="buy" data-i="'+i+'" data-n="999" '+(can<1?'disabled':'')+'>Max</button></div>'});
 } else if(curTab==='haulers'&&t.w){ // World 2 carts: Winged Cart (Skyhaven), Carriage (Aldenreach carrier store); own both and pick one with Use
  const w2r=(id,sold)=>{const H=HAULERS[id],own=id==='wingcart'?S.wcart:!!S.carriage,eq=own&&WORLDDEF[1].cart()===id;if(!own&&!sold)return '';
   const btn=eq?'<button disabled>'+(S.park?ico('wcartP')+' Parked':ico('check'))+'</button>':own?'<button data-act="usew2" data-id="'+id+'" '+(S.park||cargoCount()>H.cap?'disabled':'')+'>Use</button>':'<button data-act="'+(id==='wingcart'?'buywc':'buyw2')+'" data-id="'+id+'" '+(S.money<H.price?'disabled':'')+'>'+pr(H.price)+'</button>';
   return '<div class="row'+(eq?' on':'')+'" data-h="'+id+'">'+iconImg(HAULURL[id],'big')+'<span class="nm">'+H.name+'<span class="sub">'+ico('pack')+' '+H.cap+' ('+PACK+' pack + '+(H.cap-PACK)+' cart) · '+ico('arR')+' '+Math.round(H.spd*100)+'% · flies with your horse</span></span>'+btn+'</div>'};
  const sold=id=>id==='wingcart'?t.i===W2TOWN:!!t.carrier,ids=['wingcart','carriage'],fs=ids.filter(id=>sold(id)&&!(id==='wingcart'?S.wcart:S.carriage)),ys=ids.filter(id=>id==='wingcart'?S.wcart:S.carriage);
  if(fs.length)h+='<div class="sec">FOR SALE</div>'+fs.map(id=>w2r(id,1)).join('');if(ys.length)h+='<div class="sec">YOURS</div>'+ys.map(id=>w2r(id,1)).join('');
  h+='<div class="small" style="margin-top:6px">Hitch / park with the cart button. Sky foes can knock goods loose from the cart (never from your backpack).</div>';
 } else if(curTab==='haulers'){
  const row=id=>{const H=HAULERS[id];const own=S.haulers.includes(id),eq=S.hauler===id;
   const btn=eq?'<button disabled>'+(S.park?ico('park')+' Parked':'Using')+'</button>':own?'<button data-act="useh" data-id="'+id+'" '+(cargoCount()>H.cap||S.park?'disabled':'')+'>Use</button>':'<button data-act="buyh" data-id="'+id+'" '+(S.money<H.price?'disabled':'')+'>'+pr(H.price)+'</button>';
   return '<div class="row" data-h="'+id+'">'+iconImg(HAULURL[id],'big')+'<span class="nm">'+H.name+'<span class="sub">📦 '+H.cap+' · 👟 '+Math.round(H.spd*100)+'%</span></span>'+btn+'</div>'};
  h+=shopLists(HORDER,t.haulers,S.haulers,row);
 } else if(curTab==='weapons'){
  const row=id=>{const W=WEAPONS[id];const own=S.weapons.includes(id),eq=S.weapon===id;const el=W.elem==='fire'?' · 🔥':W.elem==='ice'?' · ❄':W.elem==='crush'?' · 🪨':W.leaf?' · 🍃':'';
   const btn=eq?'<button disabled>Equipped</button>':own?'<button data-act="usew" data-id="'+id+'">Equip</button>':'<button data-act="buyw" data-id="'+id+'" '+(S.money<W.price?'disabled':'')+'>'+pr(W.price)+'</button>';
   return '<div class="row" data-w="'+id+'">'+iconImg(WEPURL[id])+'<span class="nm">'+W.name+'<span class="sub">⚔ '+W.dmg+' · '+(1/W.cd).toFixed(1)+'/s · '+(W.ranged?'ranged':'reach '+(W.flail?FLAIL.reach:W.range))+el+(W.perm?' · '+ico('lock')+' '+W.perm.map(x=>enchSpan(x)).join(' '):'')+'</span></span>'+btn+'</div>'};
  const sale=WORDER.filter(id=>t.weapons.includes(id));h+=shopLists(WORDER,t.weapons,S.weapons,row);
  if(sale.some(id=>WEAPONS[id].elem))h+='<div class="small" style="margin-top:6px">🔥 melts ice golems · ❄ cracks lava golems · 🪨 crushes golems</div>';
 } else if(curTab==='inn'){const rc=INN.rest(t.i),pc=INN.pot;
  h+='<div class="row"><span class="nm">❤ Rest<span class="sub">'+Math.ceil(S.hp)+'/'+maxHP()+' → full</span></span><button data-act="rest" '+(S.hp>=maxHP()||S.money<rc?'disabled':'')+'>'+pr(rc)+'</button></div>';
  h+='<div class="row"><span class="nm">🧪 Potion ×'+S.potions+'<span class="sub">+'+INN.potHP+' HP · max '+INN.potMax+' · press H</span></span><button data-act="pot" '+(S.potions>=INN.potMax||S.money<pc?'disabled':'')+'>'+pr(pc)+'</button></div>';
  h+='<div class="sec">STATS</div><div class="small">Profit '+pr(S.stats.profit)+' · Goods sold '+S.stats.sold+' · Kills '+S.stats.kills+' · Falls '+S.stats.deaths+'</div>';
 } else if(curTab==='craft'&&t.forge){
  for(const r of recipesHere(t)){const isW=r.kind==='w',img=isW?WEPURL[r.id]:GEARURL[r.id],nm=isW?WEAPONS[r.id].name:GEAR[r.id].name,st=isW?(WEAPONS[r.id].lance?'🐴 ':'')+'⚔'+WEAPONS[r.id].dmg+(WEAPONS[r.id].multi?'×'+WEAPONS[r.id].multi+' 🌪':' 🔥'):GEAR[r.id].stat;const own=owns(r),ok=canCraft(r);
   const chips=Object.entries(r.need).map(([k,n])=>{const hv=have(k);return '<span class="ch'+(hv>=n?' ok':'')+'"><img src="'+matURL(k)+'">'+Math.min(hv,99)+'/'+n+'</span>'}).join('');
   h+='<div class="row'+(own?' dim':'')+'">'+iconImg(img)+'<span class="nm">'+nm+' <span class="up">'+st+'</span><span class="sub" style="margin-top:4px">'+chips+'</span></span><button data-act="craft" data-id="'+r.id+'" '+(own||!ok?'disabled':'')+'>'+(own?ico('check'):'Craft')+'</button></div>'}
 } else if(curTab==='stable'&&t.stable&&t.w){const Hs=S.horse,sky=!!(Hs&&Hs.wings),pg=!!S.peg,on=pegOn(); // Aldenreach stables: the Pegasus (World 2 only, PEGSPD x flying speed)
  h+='<div class="sec">MOUNTS</div>';
  if(sky)h+='<div class="row'+(!on?' on':'')+'">'+iconImg(HORSEURL,'big')+'<span class="nm">Sky Horse<span class="sub">'+ico('wing')+' flies · your horse from World 1</span></span>'+(!on?'<button disabled>'+ico('check')+'</button>':'<button data-act="mnt" data-id="horse">Ride</button>')+'</div>';
  h+='<div class="row'+(on?' on':'')+'">'+iconImg(pegURL(),'big')+'<span class="nm">Pegasus<span class="sub">'+ico('wing')+' flies ×'+PEGSPD+' faster · stays in World 2</span></span>'+(on?'<button disabled>'+ico('check')+'</button>':pg?'<button data-act="mnt" data-id="peg" '+(!sky?'disabled':'')+'>Ride</button>':'<button data-act="buypeg" '+(S.money<PEGPRICE||!sky?'disabled':'')+'>'+pr(PEGPRICE)+'</button>')+'</div>';
  h+='<div class="small" style="margin-top:6px">'+(sky?'Ride the Pegasus anywhere in the Skylands; in World 1 you ride your own horse.':'Bring your winged horse first.')+'</div>';
 } else if(curTab==='stable'&&t.stable){const Hs=S.horse;
  h+='<div class="row">'+iconImg(HORSEURL,'big')+'<span class="nm">Horse<span class="sub">👟 ×'+RIDE+' · 🛒 pulls carts · 🐴 lances</span></span>'+(Hs?'<button disabled>'+ico('check')+'</button>':'<button data-act="buyhorse" '+(S.money<HORSEPRICE?'disabled':'')+'>'+pr(HORSEPRICE)+'</button>')+'</div>';
  h+='<div class="sec">LANCES</div>';for(const id of LORDER){const W=WEAPONS[id],own=S.lances.includes(id);if(!own&&W.crafted&&!t.forge&&id!=='woodlance'){}
   const btn=own?(S.lance===id?'<button disabled>Equipped</button>':'<button data-act="usel" data-id="'+id+'">Equip</button>'):W.crafted?'<button disabled>Forge</button>':W.price?'<button data-act="buyl" data-id="'+id+'" '+(S.money<W.price||!Hs?'disabled':'')+'>'+pr(W.price)+'</button>':'<button disabled>'+ico('horseOff')+'</button>';
   h+='<div class="row'+(encList(id).length?' ench':'')+'" style="'+(encList(id).length?'--ec:'+enchCol(id):'')+'">'+iconImg(WEPURL[id])+'<span class="nm">'+W.name+'<span class="sub">⚔ '+Math.round(W.dmg*LANCEMIN)+'–'+Math.round(W.dmg*LANCEMAX)+(W.elem==='fire'?' · 🔥':'')+'</span></span>'+btn+'</div>'}
  h+='<div class="small" style="margin-top:6px">⚔ grows with speed · gallop in!</div>';
 } else if(curTab==='ships'&&t.ships&&FEATURE_DRIVABLE_AIRSHIPS){
  for(const id of SORDER){const sh=SHIPS[id],own=S.ships.includes(id),eq=S.ship===id;
   const btn=eq?'<button disabled>'+ico('check')+'</button>':own?'<button data-act="useship" data-id="'+id+'" '+(cargoCount()>sh.cap||S.moor!==0||S.park?'disabled':'')+'>Use</button>':'<button data-act="buyship" data-id="'+id+'" '+(S.money<sh.price?'disabled':'')+'>'+pr(sh.price)+'</button>';
   h+='<div class="row'+(eq?' on':'')+'"><img class="px shipi" src="'+SHIPURL[id]+'"><span class="nm">'+sh.name+'<span class="sub">'+ico('pack')+' '+sh.cap+' · '+ico('arR')+' ×'+sh.spd+' · Hull '+sh.hull+'</span></span>'+btn+'</div>'}
 } else if(curTab==='barber'&&t.barber){const L=S.look,noHat={head:null,chest:null,acc:null};
  const sw=(k,v,bg,on)=>'<button data-act="look" data-k="'+k+'" data-v="'+v+'" class="'+(on?'on':'')+'" style="background:'+bg+'"></button>';
  const opt=(k,v,img,lab)=>'<button class="tile'+(L[k]===v?' eq':'')+'" data-act="look" data-k="'+k+'" data-v="'+v+'"><img src="'+img+'">'+(lab?'<span>'+lab+'</span>':'')+'</button>';
  h+='<div class="cust"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><canvas id="cprev" width="28" height="30"></canvas>';
  const hatOn=S.eq.head==='tophat';h+='<button data-act="hat" class="'+(hatOn?'':'alt')+'" style="padding:6px 8px"><img class="px" style="width:20px;height:20px;vertical-align:middle;'+(hatOn?'':'opacity:.4')+'" src="'+GEARURL.tophat+'"> '+(hatOn?'On':'Off')+'</button></div><div class="copt">';
  h+='<div class="sec">SKIN</div><div class="sws">'+SKINS.map((c,i)=>sw('skin',i,c[0],L.skin===i)).join('')+'</div>';
  h+='<div class="sec">BODY</div><div class="sws">'+[0,1].map(v=>opt('body',v,lookPrev(Object.assign({},L,{body:v}),noHat,14,22,7,21),v?'♀':'♂')).join('')+'</div>';
  h+='<div class="sec">HAIR</div><div class="sws">'+HAIRS.map((hs,i)=>opt('hair',i,lookPrev(Object.assign({},L,{hair:i}),noHat,12,12,6,19))).join('')+'</div>';
  h+='<div class="sws">'+HAIRC.map((c,i)=>sw('hc',i,c,L.hc===i)).join('')+'</div></div></div>';
 }
 $('tbody').innerHTML=h;drawPrev($('cprev'),menuT,true);updHUD()}
$('tbody').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const a=b.dataset.act,t=curTown;
 if(a==='buy'){buy(t,+b.dataset.i,+b.dataset.n)}
 else if(a==='sell'){const v=sell(t,+b.dataset.i,+b.dataset.n);if(v)toast('+'+pr(v),1200)}
 else if(a==='buyh'){const H=HAULERS[b.dataset.id];if(S.money>=H.price){S.money-=H.price;S.haulers.push(b.dataset.id);if(cargoCount()<=H.cap&&!S.park)S.hauler=b.dataset.id}}
 else if(a==='buywc'){const H=HAULERS.wingcart;if(!S.wcart&&S.money>=H.price){const was=WORLDDEF[1].cart();S.money-=H.price;S.wcart=true;if(was==='carriage')S.w2c='carriage';toast(ico('wcartH',2)+' <b>Winged Cart</b> '+ico('check'),1800)}}
 else if(a==='buyw2'){const H=HAULERS.carriage;if(!S.carriage&&S.money>=H.price){const was=WORLDDEF[1].cart();S.money-=H.price;S.carriage=true;S.w2c=S.park&&was==='wingcart'?'wingcart':'carriage';toast(ico('wcartH',2)+' <b>Carriage</b> '+ico('check'),1800)}}
 else if(a==='usew2'){const id=b.dataset.id,H=HAULERS[id];if((id==='wingcart'?S.wcart:S.carriage)&&!S.park&&cargoCount()<=H.cap)S.w2c=id}
 else if(a==='buypeg'){if(!S.peg&&S.horse&&S.horse.wings&&S.money>=PEGPRICE){S.money-=PEGPRICE;S.peg=true;S.mnt='peg';toast(iconImg(pegURL())+' <b>Pegasus</b> '+ico('check'),1800)}}
 else if(a==='mnt'){const id=b.dataset.id;if(id==='horse')S.mnt='horse';else if(S.peg)S.mnt='peg'}
 else if(a==='useh'){if(!S.park)S.hauler=b.dataset.id}
 else if(a==='buyw'){const W=WEAPONS[b.dataset.id];if(S.money>=W.price){S.money-=W.price;S.weapons.push(b.dataset.id);S.weapon=b.dataset.id}}
 else if(a==='usew'){S.weapon=b.dataset.id}
 else if(a==='look'){const k=b.dataset.k;if(k in S.look)S.look[k]=+b.dataset.v;S.look=fixLook(S.look)}
 else if(a==='hat'){if(S.gear.includes('tophat'))S.eq.head=S.eq.head==='tophat'?null:'tophat'}
 else if(a==='craft'){craft(b.dataset.id)}
 else if(a==='buyship'&&FEATURE_DRIVABLE_AIRSHIPS){const id=b.dataset.id,sh=SHIPS[id];if(sh&&!S.ships.includes(id)&&S.money>=sh.price){S.money-=sh.price;S.ships.push(id);if(cargoCount()<=sh.cap&&S.moor===0&&!S.park){S.ship=id;S.hull=sh.hull}save();toast(ico('ship',2)+' '+sh.name,1400)}}
 else if(a==='useship'&&FEATURE_DRIVABLE_AIRSHIPS){const id=b.dataset.id,sh=SHIPS[id];if(sh&&S.ships.includes(id)&&cargoCount()<=sh.cap&&S.moor===0&&!S.park){S.ship=id;S.hull=sh.hull}}
 else if(a==='buyhorse'){buyHorse(t)}
 else if(a==='buyl'){const id=b.dataset.id,W=WEAPONS[id];if(W&&W.lance&&!S.lances.includes(id)&&S.horse&&S.money>=W.price){S.money-=W.price;S.lances.push(id);S.lance=id}}
 else if(a==='usel'){if(S.lances.includes(b.dataset.id))S.lance=b.dataset.id}
 else if(a==='rest'){const rc=INN.rest(t);if(S.money>=rc){S.money-=rc;S.hp=maxHP()}}
 else if(a==='pot'){if(S.money>=INN.pot&&S.potions<INN.potMax){S.money-=INN.pot;S.potions++}}
 save();renderTown()};
