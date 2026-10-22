'use strict';
const MINI=$('mini').getContext('2d');
// minimap markers: a 5px-wide outlined pin (towns, park, horse, witch, ship) and the dock/scrap-pile flag
function mmPin(x,y,h,col){MINI.fillStyle='#000';MINI.fillRect(x-2,y,5,h);MINI.fillStyle=col;MINI.fillRect(x-1,y+1,3,h-2)}
function mmDock(x,col){MINI.fillStyle='#000';MINI.fillRect(x-3,1,7,9);MINI.fillStyle=col;MINI.fillRect(x-2,2,5,4);MINI.fillStyle='#8b5a2b';MINI.fillRect(x-2,7,5,2)}
function setTxt(id,v){const e=$(id);v=String(v);if(e.textContent!==v)e.textContent=v}
function setDisp(id,v){const e=$(id);if(e.style.display!==v){e.style.display=v;if(id==='tU')BANDPOS=null}}
function updHUD(){if(!S)return;{const w=clamp(S.hp/maxHP()*100,0,100)+'%',e=$('hpfill');if(e.dataset.w!==w){e.dataset.w=w;e.style.width=w}}setTxt('hpt',Math.ceil(Math.max(0,S.hp)));{const mt=pr(S.money),me=$('money');if(me.textContent!==mt){if(me.textContent&&me.dataset.w==S.w){me.classList.remove('bump');void me.offsetWidth;me.classList.add('bump')}me.dataset.w=S.w;me.textContent=mt}}
 setTxt('cargo',cargoCount()+'/'+cap());const ch=FEATURE_DRIVABLE_AIRSHIPS&&S.w&&!S.park?'ship':carriedH();if($('icart').dataset.k!==ch){$('icart').src=ch==='ship'?ICO.ship.url:HAULURL[ch];$('icart').style.width=ch==='ship'?'16px':'';$('icart').dataset.k=ch}
 const fl=!!(WI&&P&&P.fly);setDisp('tC',(curH()!=='backpack')?'flex':'none');setDisp('tU',fl?'flex':'none');setDisp('tD',fl?'flex':'none');{const k=fl&&P.fly==='ship'?'exit':'arU';if($('tJ').dataset.k!==k){$('tJ').dataset.k=k;$('tJ').innerHTML=ico(k,2);$('tJ').setAttribute('aria-label',fl?(P.fly==='ship'?'Leave airship':'Fly up'):'Jump')}}$('tJ').classList.toggle('hi',fl&&canLeave());{const k=(S.w?'w':'')+(S.park?'cartP':'cartH');if($('tC').dataset.k!==k){$('tC').dataset.k=k;$('tC').innerHTML=ico(k,2)}}{const k=mounted()?'horseOn':'horseOff';if($('tM').dataset.k!==k){$('tM').dataset.k=k;$('tM').innerHTML=ico(k,2)}}$('tC').classList.toggle('hi',nearCartP());{const hw=heldW();if($('iwep').dataset.k!==hw){$('iwep').src=WEPURL[hw];$('iwep').dataset.k=hw}}setDisp('tM',S.horse&&!fl?'flex':'none');$('tM').classList.toggle('hi',nearHorse()||mounted());{const k='p'+S.potions;if($('pots').dataset.k!==k){$('pots').dataset.k=k;$('pots').innerHTML=ico('potion')+S.potions}}
 const px0=DG?DG.d.x:(P?P.x:0);const b=biomeAt(px0);const bn=DG?skulls(DG.d.diff)+' Cave':BIOMES[b].name;if($('bname').dataset.k!==bn){$('bname').innerHTML=bn;$('bname').dataset.k=bn}
 const w=200;MINI.clearRect(0,0,w,20);for(let i=0;i<NB;i++){MINI.fillStyle=BIOMES[WB[i]].mm;MINI.fillRect(BOUNDS[i]/WORLD*w,6,(BOUNDS[i+1]-BOUNDS[i])/WORLD*w,8)}
 if(WI){for(const z of WX){MINI.fillStyle=z.k==='rain'?'#5a6a86':'#ffffff';MINI.fillRect(Math.round(z.x0/WORLD*w),6,Math.max(1,Math.round((z.x1-z.x0)/WORLD*w)),3)}
  ISLES.forEach((I,k)=>{const a=Math.round(I.x0/WORLD*w),L=Math.round((I.x1-I.x0)/WORLD*w);MINI.fillStyle='#000';MINI.fillRect(a-1,8,L+2,7);MINI.fillStyle=k?'#ecdcc8':'#e0d2b4';MINI.fillRect(a,9,L,5);MINI.fillStyle=k?'#c8a8f0':'#5ee0c8';MINI.fillRect(a,9,L,2)});
  for(let k=1;k<(FEATURE_DRIVABLE_AIRSHIPS?DOCKS.length:1);k++)mmDock(Math.round(DOCKS[k].x/WORLD*w),'#7de0ff');
  if(FEATURE_DRIVABLE_AIRSHIPS)mmPin(Math.round((P&&P.fly==='ship'?P.x:dockShipX(S.moor))/WORLD*w),14,5,SHIPS[S.ship].pal[0])}
 for(const t of WT)mmPin(Math.round(t.x/WORLD*w),3,14,t.i===S.lastTown?'#ffd75e':'#f6ead0');
 for(const i of S.caves){const d=DUNGEONS[i];if(!d)continue;const x=Math.round(d.x/WORLD*w);MINI.fillStyle=dState(d)>0?'#5a4a44':'#1a0c0c';MINI.fillRect(x-1,8,3,4)}
 mmDock(Math.round((WI?W2DOCK:SCRAPX)/WORLD*w),WI||S.scrap.done?'#7de0ff':'#c8a060');
 if(!WI&&S.witch&&S.witch.seen)mmPin(Math.round(S.witch.x/WORLD*w),0,7,'#c060ff');
 if(S.park&&(!WI||!FEATURE_DRIVABLE_AIRSHIPS))mmPin(Math.round(S.park.x/WORLD*w),13,7,'#ffa030');
 if(S.horse&&!S.horse.on&&S.horse.x>-9000)mmPin(Math.round(S.horse.x/WORLD*w),13,7,'#c8864a');
 if(P){const x=Math.round(px0/WORLD*w);MINI.fillStyle='#ff3030';MINI.fillRect(x-1,0,3,20)}}
