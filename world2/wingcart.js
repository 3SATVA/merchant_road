'use strict';
function wcTick(dt){if(carriedH()!=='wingcart'){P.wcx=null;return}const tx=P.x-P.dir*30,g=groundAt(tx),air=!!P.fly||!P.onGround;const ty=air?P.y-2:(g===null?P.y:g);
 if(P.wcx==null||Math.abs(P.wcx-tx)>200){P.wcx=tx;P.wcy=ty}P.wcx+=(tx-P.wcx)*Math.min(1,dt*(air?5:12));P.wcy+=(ty-P.wcy)*Math.min(1,dt*(air?4:14));if(P.wcHit>0)P.wcHit-=dt}
function cartTouch(e,d){return carriedH()==='wingcart'&&!!P.fly&&P.wcx!=null&&Math.abs(e.x-P.wcx)<10+d.w/2&&e.y>P.wcy-16&&e.y-d.h<P.wcy+2}
function cartHit(e){if((P.wcHit||0)>0||cargoCount()<=PACK)return false;P.wcHit=WCART.knockCd;if(rnd()<WCART.keep)return false;const u=unitsOf(S.cargo).sort((a,b)=>ITEMS[b.item].base-ITEMS[a.item].base),k=PACK+Math.floor(rnd()*(u.length-PACK)),lost=u.splice(k,1)[0];S.cargo=stacksOf(u);
 ftxt(P.wcx,P.wcy-18,'-1','#ffb060');part(P.wcx,P.wcy-8,ITEMS[lost.item].col,6,70,260,.8);part(P.wcx,P.wcy-8,'#c8a060',5,60);shake(1.2);S.stats.knocked=(S.stats.knocked||0)+1;return true}
