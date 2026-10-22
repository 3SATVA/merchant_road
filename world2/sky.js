'use strict';
// World 2 timers (weather-zone tick, leap/dismount confirm window); World 1 never touches them
const W2ENV={wT:0,leaveT:0,pk:undefined};
function plr(){return P}
function horsePlod(){return WI===1&&mounted()&&!!P&&!P.fly&&P.onGround} // winged horse walking an island (dormant: horseVanish ends every ride on touchdown, so this is true for one frame at most)
function canFly(){return WI===1&&mounted()&&!!S.horse.wings&&!stormAt(P.x)} // no flying under a sky-island storm cloud
function startFly(){P.fly='horse';P.band=0;P.onGround=false;if(P.vy>-60)P.vy=-120;W2ENV.wT=0}
// the sky horse has no ground mode: it vanishes in sparkles on touchdown and the horse button calls it back under you, already taking off
const HGONE=-9999; // S.horse.x while the sky horse is away (never drawn, no minimap pin)
const SPARKC=['#7ff0ff','#ffe08a','#ffffff'];let SPARKS=[]; // aqua / gold / white motes, rising and twinkling out (drawn by drawSparks)
function sparkBurst(x,y,n,w){for(let i=0;i<n;i++)SPARKS.push({x:x+(rnd()-.5)*w,y:y+(rnd()-.5)*14,vx:(rnd()-.5)*28,vy:-16-rnd()*52,c:SPARKC[i%3],t:-rnd()*.12,life:.6+rnd()*.7,ph:rnd()*6})}
function sparkTick(dt){if(!SPARKS.length)return;for(const p of SPARKS){p.t+=dt;if(p.t<0)continue;p.vy-=14*dt;p.vx*=Math.pow(.25,dt);p.x+=p.vx*dt;p.y+=p.vy*dt}SPARKS=SPARKS.filter(p=>p.t<p.life)}
function drawSparks(X,ox,oy){if(!SPARKS.length)return;for(const p of SPARKS){if(p.t<0)continue;const k=p.t/p.life,x=Math.round(p.x-ox),y=Math.round(p.y-oy);
  if(k>.55&&((p.t*16+p.ph)|0)%2)continue;X.globalAlpha=1-k*.6; // twinkle out
  const a=p.c==='#ffffff'?'#7ff0ff':p.c;if(k<.22){px(X,x-2,y,5,1,a);px(X,x,y-2,1,5,a);px(X,x-1,y,3,1,p.c);px(X,x,y-1,1,3,p.c)}else if(k<.5){px(X,x-1,y,3,1,a);px(X,x,y-1,1,3,a);px(X,x,y,1,1,p.c)}else px(X,x,y,1,1,p.c)}X.globalAlpha=1}
function horseVanish(fx){const H=S.horse;if(!H)return;const wc=carriedH()==='wingcart'&&P.wcx!=null;H.on=false;H.x=HGONE;H.dir=P.dir;P.hv=0;P.couch=0;P.ride=0;
 if(fx){sparkBurst(P.x-P.dir*2,P.y-9,36,34);if(wc)sparkBurst(P.wcx,P.wcy-6,14,18); // a hitched Winged Cart goes with it (cargo stays yours)
  if(!skyS().lv&&!stormAt(P.x)){S.sky.lv=1;toast(ico('wing',2)+' Your sky horse vanishes on landing<br><small>'+(isTouch?'tap the horse':'press R')+' to call it</small>',2800)}}
 save()}
// horse button in World 2 (toggleHorse hook): sparkle in under you, mounted, and lift off into the low band
function skyHorseBtn(){const H=S.horse;if(H.on){horseVanish(1);return}
 if(stormAt(P.x)){sparkBurst(P.x,P.y-8,12,18);if(!$('toasts').children.length)toast(ico('wing',2)+' '+ico('x',2)+'<br>Too stormy for your sky horse<br><small>walk out past the cloud edge, then call it</small>',1800);return}
 H.on=true;H.wings=true;H.x=null;P.hv=0;P.couch=0;P.ride=0;P.wcx=null;sparkBurst(P.x,P.y-5,36,34);startFly();if(carriedH()==='wingcart')sparkBurst(P.x-P.dir*30,P.y-6,14,18);save()}
// game start / load in World 2: a ground save loads on foot (horse away), a mid-air one (S.air, or off any island) loads mounted and flying
function w2Start(air){W2ENV.pk=undefined;SPARKS=[];const H=S.horse;if(!H)return;if(H.on&&air&&canFly())startFly();else if(H.on)horseVanish(0);else H.x=HGONE}
// per tick (from skyTick): touchdown ends the ride, a horse left standing anywhere goes away, a Winged Cart parked / hitched on foot sparkles in / out
function skyHorseTick(dt){sparkTick(dt);const H=S.horse;
 if(H){if(mounted()&&!P.fly&&P.onGround)horseVanish(1);else if(!H.on&&H.x!==HGONE)H.x=HGONE}
 if(P.fly==='horse')S.air=1;else delete S.air;
 const pk=S.park?S.park.x:null;if(W2ENV.pk!==undefined&&pk!==W2ENV.pk&&!P.fly){const x=pk!=null?pk:W2ENV.pk;sparkBurst(x,surfY(x)-6,14,18)}W2ENV.pk=pk}
function fallOut(){P.x=P.lastSafe;P.y=surfY(P.x);P.vy=0;P.onGround=true;S.hp-=10;ftxt(P.x,P.y-24,'-10','#ff6a6a');toast(ico('down',2),900);if(S.hp<=0)die()}
function flyTarget(){let ty=BANDY[P.band];const g=groundAt(P.x);if(g!==null)ty=Math.min(ty,g-(P.fly==='ship'?40:24));return ty}
function updSky(dt){w2Tick(dt);wcTick(dt);if(W2ENV.leaveT>0)W2ENV.leaveT-=dt;const b=biomeAt(P.x),sh=P.fly==='ship';
 if(b!==env.biome){biomeToast(b);env.biome=b}
 if(!sh&&!canFly()){if(stormAt(P.x))stormDrop();P.fly=null;P.onGround=false;return}
 let mv=(inp.left()?-1:0)+(inp.right()?1:0);if(mv)P.dir=mv;
 const vmax=(sh?SHIPV*SHIPS[S.ship].spd:GALLOP*HFLY*spdMul()*(carriedH()==='wingcart'?HAULERS.wingcart.spd:1))*(P.band===2?JET:1);
 P.hv=(P.hv||0)+(mv*vmax-(P.hv||0))*Math.min(1,dt*(sh?1.3:2.4));if(!mv&&Math.abs(P.hv)<1)P.hv=0;P.ride=(P.ride||0)+Math.abs(P.hv)*dt;
 const ox=P.x;P.x=clamp(P.x+(P.hv+P.kbx)*dt,XMIN,XMAX);P.kbx*=Math.pow(.004,dt);if(Math.abs(P.kbx)<2)P.kbx=0;const dx=P.x-ox;P.walk=false;
 if(inp.up()||(!sh&&pressed.tj)){if(P.band<2){P.band++;if(!sh)part(P.x-P.dir*6,P.y-16,'#ffffff',5,60,40,.5)}}
 if(inp.down()){if(P.band>0)P.band--;else if(!sh&&groundAt(P.x)!==null){P.fly=null;P.vy=40;P.onGround=false;return}}
 // weather
 const w=wxAt(P.x);P.wx=w;if(w){W2ENV.wT=(W2ENV.wT||0)+dt;if(w==='rain'&&W2ENV.wT>1.5){W2ENV.wT=0;if(P.band>0)P.band--}else if(w==='up'&&W2ENV.wT>.9){W2ENV.wT=0;if(P.band<2)P.band++}}else W2ENV.wT=0;
 const ty=flyTarget()+(w==='rain'?8:w==='up'?-8:0);P.vy+=((ty-P.y)*7-P.vy*4.2)*dt;P.y+=P.vy*dt;
 if(sh){P.onGround=true;if(P.hinv>0)P.hinv-=dt;if(P.shipHit>0)P.shipHit-=dt}else P.onGround=false;
 // air foes live in the wilds
 if(b===6){env.spawnD+=Math.abs(dx);if(env.spawnD>env.next){env.spawnD=0;env.next=sh?SKY.gapShip[0]+rnd()*SKY.gapShip[1]:SKY.gapHorse[0]+rnd()*SKY.gapHorse[1];spawnAir(mv||P.dir)}}
 for(const e of ENEMIES)if(ENEMY[e.type].air&&!ENEMY[e.type].isle&&Math.abs(e.x-P.x)>VW*1.3)e.dead=1;
 if(sh&&inp.leave()&&leaveFly())return;
 if(MODE!=='play'){showPrompt('');return}
 let h='';if(sh)for(let i=0;i<DOCKS.length;i++)if(Math.abs(P.x-dockShipX(i))<80){h=ico('park')+'<br>'+(isTouch?'Tap E':'[E]');if(inp.use()){moor(i);toast(ico('ship',2)+' '+ico('check'),900);h=''}break}
 showPrompt(h)}
function shipDock(){for(let i=0;i<DOCKS.length;i++)if(Math.abs(P.x-dockShipX(i))<80)return i;return -1}
function canLeave(){return !!(P&&P.fly==='ship'&&shipDock()>=0)}
// leave the airship from the big right button (or R / X); the winged horse has no dismount, landing vanishes it (horseVanish)
function leaveFly(){if(FEATURE_DRIVABLE_AIRSHIPS&&P.fly==='ship'){const i=shipDock();if(i>=0){moor(i);toast(ico('ship',2)+' '+ico('check'),900);return true}
  if(!S.horse||!S.horse.wings){toast(ico('park')+' Dock to disembark',1300);return false}
  if(!(W2ENV.leaveT>0)){W2ENV.leaveT=1.6;toast(ico('exit',2)+' Tap again: leap onto your horse<br><small>the airship flies back to '+TOWNS[DOCKS[S.moor].town].name+'</small>',1600);return false}
  W2ENV.leaveT=0;detachShip();S.horse.on=true;S.horse.wings=true;P.fly='horse';P.hv*=.5;P.y-=10;P.vy=-40;P.onGround=false;part(P.x,P.y-10,'#ffffff',10,80,50,.5);
  toast(ico('horseOn',2)+' '+ico('ship')+' '+ico('arR')+' '+TOWNS[DOCKS[S.moor].town].name,1800);save();return true}
 return false}
