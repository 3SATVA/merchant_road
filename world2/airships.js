'use strict';
window.MR_ICO=n=>ICO[n];const SHIPURL={};for(const id in SHIPS){const sh=SHIPS[id];SHIPURL[id]=spriteURL(104,84,g=>drawShip(g,54,84,4,1,0,-1,sh.z,sh.pal))}
if(!FEATURE_DRIVABLE_AIRSHIPS)$('helpSky').innerHTML='<b>Sky travel:</b> in the Skylands you cross the open sky on your winged horse: jump to take off, the up/down arrows on the left change altitude (3 bands; high is fastest; keys W/S), the big right button gets off over land (key R). The horse is slow and carries only your backpack (5 goods), so pick valuable ones. Pegasi and sky slimes attack in the Air Wilds; rain pushes you down, updrafts lift you. Skyhaven\'s airship takes you back to World 1.';
// winged horse: jump takes off into the low band; in the air tU/W = up a band, tD/S = down a band (low band over an island + down = land); tJ/R = leave ship / dismount
// airship: board at the dock where it's moored; fly with the same controls; E near a dock moors it. Hits go to the hull; hull 0 = wreck
function board(){if(!FEATURE_DRIVABLE_AIRSHIPS)return false;const i=S.moor,D=DOCKS[i];if(!D||!P||P.fly||S.park)return false;if(mounted())dismount(P.x);if(S.horse)S.horse.x=-9999;
 P.fly='ship';P.band=0;P.x=dockShipX(i);P.y=surfY(D.x)-54;P.vy=0;P.hv=0;P.kbx=0;P.dir=D.side;P.onGround=true;P.hinv=0;W2ENV.wT=0;showPrompt('');toast(ico('ship',2)+' '+ico('arU'),800);save();return true}
function moor(i){const D=DOCKS[i];S.moor=i;P.fly=null;P.x=D.x;P.y=surfY(D.x);P.vy=0;P.hv=0;P.kbx=0;P.onGround=true;P.lastSafe=D.x;P.dir=-D.side;
 if(S.horse){S.horse.on=false;S.horse.x=Math.round(D.x-D.side*26);S.horse.dir=-D.side}S.lastTown=D.town;if(!S.visited.includes(D.town))S.visited.push(D.town);save();return true}
function shipHW(){return Math.round(36*SHIPS[S.ship].z)}
function hullHit(dmg,sx){if((P.hinv||0)>0)return;shake(2);P.hinv=.5;P.shipHit=.15;S.hull=Math.max(0,S.hull-dmg);ftxt(P.x,P.y-56,'-'+Math.round(dmg),'#ffb060');part(P.x+(sx>P.x?14:-14),P.y-6,'#c8a060',8,90);if(S.hull<=0)shipwreck()}
// hull 0: the airship limps back to the dock it left from and loses 30% of its hold (half of what you paid comes back, like a death)
function shipwreck(){if(!FEATURE_DRIVABLE_AIRSHIPS)return;shake(3);const u=unitsOf(S.cargo),n=Math.ceil(u.length*WRECKLOSS),lost=[];for(let k=0;k<n;k++)lost.push(u.splice(Math.floor(rnd()*u.length),1)[0]);
 S.cargo=stacksOf(u);const rf=refundOf(lost);S.money+=rf;S.hull=Math.round(SHIPS[S.ship].hull*.4);S.stats.wrecks=(S.stats.wrecks||0)+1;ENEMIES=[];PROJ=[];moor(S.moor);
 env.wreck={n,rf};toast(ico('ship',2)+' '+ico('x')+(n?'<br>-'+n+' &nbsp;+'+pr(rf):''),2600);save()}
function detachShip(){const u=unitsOf(S.cargo).sort((a,b)=>ITEMS[b.item].base-ITEMS[a.item].base);S.cargo=stacksOf(u.slice(0,PACK));S.park={x:dockShipX(S.moor),dir:DOCKS[S.moor].side,cargo:stacksOf(u.slice(PACK))}} // the backpack takes your 5 most valuable goods, the rest stays aboard
function attachShip(){for(const c of S.park.cargo)addCargo(c.item,c.origin,c.qty,c.paid);S.park=null}
// your airship's hold is yours while you're on its island (like a hitched cart); fly off on the horse and only the backpack comes along
function w2Tick(dt){skyTick(dt);if(!FEATURE_DRIVABLE_AIRSHIPS||P.fly==='ship')return;const sh=SHIPS[S.ship];if(S.hull<sh.hull)S.hull=Math.min(sh.hull,S.hull+HULLFIX*dt);const isl=islAt(P.x),mi=DOCKS[S.moor].isl;
 if(!S.park&&isl!==mi)detachShip();else if(S.park&&isl===mi)attachShip()}
function drawSail(ox,oy){const sh=SHIPS[S.ship],sx=Math.round(P.x-ox),dy=Math.round(P.y-oy);drawShipD(X,sx,dy+25,-1,P.dir,sh);if(S.horse)drawHorse(X,sx-P.dir*16,dy,P.dir,menuT,0,1);
 const f=clamp(S.hull/sh.hull,0,1),top=dy-Math.round(24+32*(.8+.2*sh.z))-8;px(X,sx-13,top,26,4,'#000');px(X,sx-12,top+1,Math.max(1,Math.round(24*f)),2,f>.5?'#7de07a':f>.25?'#ffd75e':'#ff5a4a');if(P.shipHit>0)px(X,sx-12,top+1,24,2,'#ffffff')}
