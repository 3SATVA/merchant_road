'use strict';
// World 2 timers (weather-zone tick, leap/dismount confirm window); World 1 never touches them
const W2ENV={wT:0,leaveT:0};
function plr(){return P}
function canFly(){return WI===1&&mounted()&&!!S.horse.wings&&!stormAt(P.x)} // no flying under a sky-island storm cloud
function startFly(){P.fly='horse';P.band=0;P.onGround=false;if(P.vy>-60)P.vy=-120;W2ENV.wT=0}
function fallOut(){P.x=P.lastSafe;P.y=surfY(P.x);P.vy=0;P.onGround=true;S.hp-=10;ftxt(P.x,P.y-24,'-10','#ff6a6a');toast(ico('down',2),900);if(S.hp<=0)die()}
function flyTarget(){let ty=BANDY[P.band];const g=groundAt(P.x);if(g!==null)ty=Math.min(ty,g-(P.fly==='ship'?40:24));return ty}
function updSky(dt){w2Tick(dt);wcTick(dt);if(W2ENV.leaveT>0)W2ENV.leaveT-=dt;const b=biomeAt(P.x),sh=P.fly==='ship';
 if(b!==env.biome){biomeToast(b);env.biome=b}
 if(!sh&&!canFly()){if(stormAt(P.x))stormDrop();P.fly=null;P.onGround=false;return}
 let mv=(inp.left()?-1:0)+(inp.right()?1:0);if(mv)P.dir=mv;
 const vmax=(sh?SHIPV*SHIPS[S.ship].spd:GALLOP*HFLY*spdMul()*(carriedH()==='wingcart'?HAULERS.wingcart.spd:1))*(P.band===2?JET:1);
 P.hv=(P.hv||0)+(mv*vmax-(P.hv||0))*Math.min(1,dt*(sh?1.3:2.4));if(!mv&&Math.abs(P.hv)<1)P.hv=0;P.ride=(P.ride||0)+Math.abs(P.hv)*dt;
 const ox=P.x;P.x=clamp(P.x+(P.hv+P.kbx)*dt,XMIN,XMAX);P.kbx*=Math.pow(.004,dt);if(Math.abs(P.kbx)<2)P.kbx=0;const dx=P.x-ox;P.walk=false;
 if(inp.up()){if(P.band<2){P.band++;if(!sh)part(P.x-P.dir*6,P.y-16,'#ffffff',5,60,40,.5)}}
 if(inp.down()){if(P.band>0)P.band--;else if(!sh&&groundAt(P.x)!==null){P.fly=null;P.vy=40;P.onGround=false;return}}
 // weather
 const w=wxAt(P.x);P.wx=w;if(w){W2ENV.wT=(W2ENV.wT||0)+dt;if(w==='rain'&&W2ENV.wT>1.5){W2ENV.wT=0;if(P.band>0)P.band--}else if(w==='up'&&W2ENV.wT>.9){W2ENV.wT=0;if(P.band<2)P.band++}}else W2ENV.wT=0;
 const ty=flyTarget()+(w==='rain'?8:w==='up'?-8:0);P.vy+=((ty-P.y)*7-P.vy*4.2)*dt;P.y+=P.vy*dt;
 if(sh){P.onGround=true;if(P.hinv>0)P.hinv-=dt;if(P.shipHit>0)P.shipHit-=dt}else P.onGround=false;
 // air foes live in the wilds
 if(b===6){env.spawnD+=Math.abs(dx);if(env.spawnD>env.next){env.spawnD=0;env.next=sh?SKY.gapShip[0]+rnd()*SKY.gapShip[1]:SKY.gapHorse[0]+rnd()*SKY.gapHorse[1];spawnAir(mv||P.dir)}}
 for(const e of ENEMIES)if(ENEMY[e.type].air&&!ENEMY[e.type].isle&&Math.abs(e.x-P.x)>VW*1.3)e.dead=1;
 if(inp.leave()&&leaveFly())return;
 if(MODE!=='play'){showPrompt('');return}
 let h='';if(sh)for(let i=0;i<DOCKS.length;i++)if(Math.abs(P.x-dockShipX(i))<80){h=ico('park')+'<br>'+(isTouch?'Tap E':'[E]');if(inp.use()){moor(i);toast(ico('ship',2)+' '+ico('check'),900);h=''}break}
 showPrompt(h)}
function shipDock(){for(let i=0;i<DOCKS.length;i++)if(Math.abs(P.x-dockShipX(i))<80)return i;return -1}
function canLeave(){if(!P||!P.fly)return false;return P.fly==='ship'?shipDock()>=0:groundAt(P.x)!==null}
// leave the airship / get off the winged horse from the big right button (or R / X)
function leaveFly(){if(FEATURE_DRIVABLE_AIRSHIPS&&P.fly==='ship'){const i=shipDock();if(i>=0){moor(i);toast(ico('ship',2)+' '+ico('check'),900);return true}
  if(!S.horse||!S.horse.wings){toast(ico('park')+' Dock to disembark',1300);return false}
  if(!(W2ENV.leaveT>0)){W2ENV.leaveT=1.6;toast(ico('exit',2)+' Tap again: leap onto your horse<br><small>the airship flies back to '+TOWNS[DOCKS[S.moor].town].name+'</small>',1600);return false}
  W2ENV.leaveT=0;detachShip();S.horse.on=true;S.horse.wings=true;P.fly='horse';P.hv*=.5;P.y-=10;P.vy=-40;P.onGround=false;part(P.x,P.y-10,'#ffffff',10,80,50,.5);
  toast(ico('horseOn',2)+' '+ico('ship')+' '+ico('arR')+' '+TOWNS[DOCKS[S.moor].town].name,1800);save();return true}
 if(groundAt(P.x)===null){if(!(W2ENV.leaveT>0)){W2ENV.leaveT=1;toast(ico('horseOff')+' Fly over land to dismount',1100)}return false}
 P.fly=null;dismount(P.x);P.vy=40;P.onGround=false;return true}
