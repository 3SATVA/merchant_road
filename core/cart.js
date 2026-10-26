'use strict';
function nearCartP(){return !!((!WI||!FEATURE_DRIVABLE_AIRSHIPS)&&S.park&&P&&!DG&&Math.abs(P.x-S.park.x)<HITCHR[curH()]||0)}
function curH(){return WORLDDEF[S.w?1:0].cart()} // the cart that belongs to the current world (see WORLDDEF.cart)
function carriedH(){return S.park||DG?'backpack':curH()}
function cap(){return S.w?(FEATURE_DRIVABLE_AIRSHIPS&&!S.park?SHIPS[S.ship].cap:HAULERS[carriedH()].cap):S.park?PACK:HAULERS[S.hauler].cap}
function unhitch(at){const H=curH();if(H==='backpack'||S.park||DG)return;const room=HAULERS[H].cap-PACK;
 // the cart keeps as much as it holds (cheapest first); the rest (max 5, your most valuable) stays in your backpack
 const u=unitsOf(S.cargo).sort((a,b)=>ITEMS[a.item].base-ITEMS[b.item].base);
 let x=at!=null?at:P.x+P.dir*COFF[H];x=clamp(x,XMIN+30,XMAX-30);if(PITS.some(p=>x>p.x0-34&&x<p.x1+34))x=P.lastSafe;if(WI&&!onIsle(x))x=P.x;
 S.park={x:Math.round(x),dir:P.dir,cargo:stacksOf(u.slice(0,room))};S.cargo=stacksOf(u.slice(room));
 part(S.park.x,surfY(S.park.x)-2,'#c8a060',8,60);toast(ico(WORLDDEF[S.w?1:0].parkIco,2),900);save()}
function hitch(){if(!S.park)return;for(const s of S.park.cargo)addCargo(s.item,s.origin,s.qty,s.paid);P.dir=S.park.dir;S.park=null;part(P.x,P.y-2,'#c8a060',8,60);toast('🛒 ✓',900);save()}
function toggleCart(){if(S.w&&FEATURE_DRIVABLE_AIRSHIPS)return;if(DG){toast('🛒 waits outside',900);return}if(curH()==='backpack'){toast(S.w?ico('wcartH',2)+' Winged Cart: Skyhaven · Carriage: Aldenreach':'No cart',1400);return}if(P.fly||(WI&&!P.onGround)){toast(ico('wcartP',2)+' Land first',900);return}
 if(!S.park){unhitch();return}const d=S.park.x-P.x;if(nearCartP())hitch();else toast('🛒 '+(d<0?'◀ ':'')+Math.round(Math.abs(d)/10)+'m'+(d>0?' ▶':''),1100)}
