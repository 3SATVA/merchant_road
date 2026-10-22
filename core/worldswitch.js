'use strict';
function leaveW(s,x){const w=s.w,o={x:Math.round(x),lastTown:s.lastTown,money:s.money,park:null,stash:[],hold:[]};
 WORLDDEF[w===0?0:1].leave(s,o); // file the parked cart / loose cargo of the world being left
 s.cargo=[];s.park=null;s.ws[w]=o}
function enterW(s,n){const o=s.ws[n]||{};s.w=n;s.lastTown=o.lastTown!=null&&TOWNS[o.lastTown]&&TOWNS[o.lastTown].w===n?o.lastTown:WORLDDEF[n?1:0].town;
 s.money=isFinite(o.money)?o.money:(WORLDDEF[n?1:0].money!=null?WORLDDEF[n?1:0].money:s.money);s.cargo=cargoOK(o[WORLDDEF[n?1:0].carry]);s.park=o.park||null;delete s.ws[n];return o}
function travelTo(n){n=n?1:0;if(!S||!S.horse||S.w===n||DG)return false;fadeIn();$('toasts').innerHTML='';
 S.horse.on=false;
 leaveW(S,P.x);enterW(S,n);S.x=WORLDDEF[n].arriveX;
 setWorld(n);DG=null;P=newPlayer(S.x);P.dir=-1;ENEMIES=[];PROJ=[];PICK=[];ROCKS=[];FTXT=[];PARTS=[];env.biome=-1;env.spawnD=0;env.next=350;W1ENV.ash=0;W1ENV.bliz=0;env.lift=0;
 S.horse.x=Math.round(S.x-WORLDDEF[n].horseOff);S.horse.dir=1;
 if(S.park&&Math.abs(S.park.x-P.x)<WORLDDEF[n].autoHitch)hitch();
 camX=clamp(P.x-VW/2,0,WORLD-VW);camY=P.y-VH*.64;setMode('play');
 if(n&&!S.w2seen)startCut();else toast(ico('ship',2),1000);
 save();return true}
