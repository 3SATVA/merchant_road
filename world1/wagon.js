'use strict';
let WAGONC=null;
function buildWagon(){const c=document.createElement('canvas');c.width=50;c.height=40;const g=c.getContext('2d');const P2=(x,y,w,h,col)=>px(g,x,y,w,h,col);
 const Y=40;// ground
 // body
 P2(4,16,40,14,'#8b5a2b');for(let x=4;x<44;x+=5)P2(x,16,1,14,'#6a4020');P2(4,16,40,1,'#c8a060');P2(4,29,40,2,'#5a3418');P2(3,15,42,1,'#3a2414');
 // window with lilac curtain + warm light
 P2(9,19,9,6,'#3a2414');P2(10,20,7,4,'#ffd75e');P2(10,20,2,4,'#a070d0');P2(15,20,2,4,'#a070d0');P2(12,22,3,1,'#fff4b0');
 // door, round window, steps
 P2(29,18,8,12,'#5a3418');P2(30,19,6,11,'#6e4222');P2(32,21,2,2,'#c9b4ec');P2(35,24,1,1,'#f0b020');P2(28,31,10,1,'#6a4020');P2(30,33,7,1,'#6a4020');
 // purple tarp roof (arched, striped, scalloped hem)
 for(let x=1;x<47;x++){const k=(x-24)/23,top=Math.round(3+8*k*k);P2(x,top,1,15-top,(Math.floor(x/6)%2)?'#56389a':'#4a2e86');P2(x,top,1,1,'#7a5cc4');P2(x,14,1,1,'#2a1f3d')}
 for(let x=1;x<47;x+=4)P2(x,15,2,1,'#3e2a66');
 P2(22,4,4,1,'#9a80e0');P2(14,6,3,1,'#9a80e0');
 // star patch
 P2(33,8,1,3,'#f0b020');P2(32,9,3,1,'#f0b020');
 // chimney
 P2(37,0,3,7,'#4a4a56');P2(36,0,5,1,'#2b2b33');
 // wheels
 for(const wx of [11,36])for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.hypot(dx,dy);if(d>4.6)continue;P2(wx+dx,34+dy,1,1,d>3.6?'#141018':d>2.6?'#8b5a2b':d<1.2?'#c8a060':(dx===0||dy===0||Math.abs(dx)===Math.abs(dy))?'#6a4020':'#2a1810')}
 // shafts resting on the ground
 P2(44,28,5,1,'#6a4020');P2(48,29,1,9,'#6a4020');
 WAGONC=c}
function drawParked(ox,oy){const k=S.park,H=curH();if(H==='backpack')return;if(Math.abs(k.x-ox-VW/2)>VW/2+60)return;const y=Math.round(surfY(k.x)-oy);
 drawHauler(X,Math.round(k.x-k.dir*COFF[H]-ox),y,k.dir,H,cargoColors(k.cargo),0);
 // chocks under the wheels
 px(X,Math.round(k.x-ox)-2,y-1,4,1,'#3a2414')}
function cartArrow(ox,oy){const sx=S.park.x-ox;if(sx>-8&&sx<VW+8)return;const L=sx<0,y=Math.round(VH*.56);const x=L?6:VW-7;
 for(let i=0;i<5;i++){const h=1+i*2;px(X,L?x+i:x-i,y-i-1,1,h+2,'#000');px(X,L?x+i:x-i,y-i,1,h,'#ffa030')}}
