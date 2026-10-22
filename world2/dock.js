'use strict';
// the Skyhaven dock: your airship, and the way back to World 1
let DOCKP=false;
// shelved-airships dock: the airship here only flies you back to World 1
function renderDockHome(){const sh=SHIPS.small;$('spct').textContent='';const c=document.createElement('canvas');c.width=120;c.height=110;const g=c.getContext('2d');g.fillStyle='#bfe6f8';g.fillRect(0,0,120,110);g.fillStyle='#f4fbff';g.fillRect(0,96,120,14);drawShip(g,60,104,4,1,menuT,-4,sh.z,sh.pal);
 $('sbody').innerHTML='<img id="sprev" src="'+c.toDataURL()+'"><div class="w2">Skyhaven<br><span class="small">'+ico('ship')+' '+ico('arL')+' World 1</span></div><button id="dGo" class="srow" style="justify-content:center">'+ico('arL')+' World 1 '+ico('ship')+'</button>';
 $('dGo').onclick=()=>{closeScrap();travelTo(0)}}
function openDock(){if(MODE!=='play')return;DOCKP=true;setMode('scrap');renderDock()}
function renderDock(){if(!FEATURE_DRIVABLE_AIRSHIPS){renderDockHome();return}const D=nearDock()||DOCKS[0],di=DOCKS.indexOf(D),sh=SHIPS[S.ship],here=S.moor===di;$('spct').textContent='';
 const c=document.createElement('canvas');c.width=120;c.height=110;const g=c.getContext('2d');g.fillStyle='#bfe6f8';g.fillRect(0,0,120,110);g.fillStyle='#f4fbff';g.fillRect(0,96,120,14);
 if(here)drawShip(g,60,104,4,1,menuT,-4,sh.z,sh.pal);else{g.globalAlpha=.35;drawShip(g,60,104,4,1,menuT,-4,sh.z,sh.pal);g.globalAlpha=1}
 const hf=clamp(S.hull/sh.hull,0,1);
 let h='<img id="sprev" src="'+c.toDataURL()+'"><div class="w2">'+(here?sh.name+'<br><span class="small">'+ico('pack')+' '+cargoCount()+'/'+sh.cap+'</span><div class="hbar"><i style="width:'+Math.round(hf*100)+'%"></i></div>':ico('ship')+' '+ico(D.side>0?'arR':'arL')+'<br><span class="small">'+TOWNS[DOCKS[S.moor].town].name+'</span>')+'</div>';
 if(here)h+='<button id="dSail" class="srow" style="justify-content:center">'+ico('ship')+' '+ico('arU')+'</button>';
 if(di===0)h+='<button id="dGo" class="srow" style="justify-content:center">'+ico('arL')+' World 1 '+ico('ship')+'</button>';
 $('sbody').innerHTML=h;
 if($('dSail'))$('dSail').onclick=()=>{closeScrap();board()};if($('dGo'))$('dGo').onclick=()=>{closeScrap();travelTo(0)}}
