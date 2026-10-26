'use strict';
// Aldenreach: World 2's walled autumn capital on ISLES[2] (layout CAPW, town TOWNS[8] in world2/data.js), Vex's Tower
// (enchanting at +~15% curse-free odds for 2x essence, inventory/enchant.js WTOWER) and the autumn ground decor.
// The walls, houses, market and tower never change, so they are painted once into one canvas (CAPC) and blitted;
// flags, smoke, lanterns, townsfolk, piers and skiffs are drawn live on top. Nothing here is solid.
// The tower interior is a DG room (DG.tower; world1/caves.js hands updDungeon/renderDungeon over to updTower/renderTower).
const CAPX0=CAPW.x0-40,CAPCW=CAPW.x1-CAPW.x0+80,CAPCH=250,CAPGY=226,CAPC={img:null,chim:[],lamps:[]};
// the four Aldenreach shop buildings (each door opens TOWNS[8] on its own tab: core/town.js enterTown(t,tab); prompt in core/play.js)
const CAPSHOP=[{x:17300,w:56,tab:'craft',n:'Forge',c:'#ffb070'},{x:17520,w:64,tab:'stable',n:'Stables',c:'#e8c860'},{x:18080,w:64,tab:'haulers',n:'Carrier',c:'#9ad0ff'},{x:18410,w:56,tab:'weapons',n:'Smith',c:'#f0a040'}];
const CAPEX=[[CAPW.x0-40,CAPW.x0+44],[17850-104,17850+104],[CAPW.tower-46,CAPW.tower+46],[CAPW.x1-44,CAPW.x1+40]].concat(CAPSHOP.map(s=>[s.x-s.w/2-4,s.x+s.w/2+4])); // no houses: gates, market, tower, shops
function nearCapShop(){if(WI!==1||DG||!P||P.fly||!TOWNS[8])return null;for(const s of CAPSHOP)if(Math.abs(P.x-s.x)<18&&Math.abs(P.y-surfY(s.x))<12)return s;return null}
function capShopPrompt(s){return '<b style="color:'+s.c+'"><img class="px" style="width:18px;height:18px;vertical-align:middle" src="'+BLDURL[s.tab]+'"> '+s.n+'</b><br>'+(isTouch?'Tap E':'Press E')+' to enter'}
const CAPROOF=[['#d8702a','#b0501e','#8a3a1a'],['#c0402a','#9a3020','#702418'],['#a85a3a','#8a4430','#6a3022'],['#b8862a','#966a1e','#6e4c16']];
const CAPWALL=['#f0dcc0','#e8c8a0','#e0c0a8','#ecd4b0'];
function capFree(a,b){return CAPEX.every(e=>b<e[0]||a>e[1])}
function capArt(){const cv=document.createElement('canvas');cv.width=CAPCW;cv.height=CAPCH;const g=cv.getContext('2d'),F=(x,y,w,h,c)=>px(g,Math.round(x-CAPX0),CAPGY+Math.round(y),w,h,c);
 const ST='#9a8a80',ST2='#86766c',ST3='#b0a092';
 // curtain wall (background), with battlements, arrow slits and autumn ivy
 const WH=46;F(CAPW.x0,-WH,CAPW.x1-CAPW.x0,WH+24,ST);
 for(let y=-WH+6,r=0;y<0;y+=6,r++){F(CAPW.x0,y,CAPW.x1-CAPW.x0,1,ST2);for(let x=CAPW.x0+(r%2?6:0);x<CAPW.x1;x+=12)F(x,y-5,1,5,ST2)}
 F(CAPW.x0,-WH,CAPW.x1-CAPW.x0,2,ST3);for(let x=CAPW.x0;x<CAPW.x1-4;x+=10){F(x,-WH-6,6,6,ST);F(x,-WH-6,6,1,ST3);F(x+5,-WH-6,1,6,ST2)}
 for(let x=CAPW.x0+30;x<CAPW.x1-20;x+=60)F(x,-WH+12,2,7,'#3a2e2a');
 for(let x=CAPW.x0+20,k=0;x<CAPW.x1-10;x+=37+Math.round(hash(k*3.1)*40),k++){if(hash(k*1.7)<.45)continue;const l=6+Math.round(hash(k*2.3)*16);for(let j=0;j<5;j++){const ll=Math.max(2,l-Math.abs(j-2)*4);F(x+j,-WH,1,ll,j%2?'#a83a22':'#c8502a')}F(x+2,-WH+l-1,1,1,'#e8843a')}
 // wall towers along the curtain wall
 for(const tx of [17420,17630,18060,18430]){F(tx-13,-74,26,74,ST);F(tx+7,-74,6,74,ST2);F(tx-13,-74,26,2,ST3);for(let x=tx-13;x<tx+13;x+=7){F(x,-80,4,6,ST);F(x,-80,4,1,ST3)}
  for(let y=-68;y<0;y+=8){F(tx-13,y,20,1,ST2)}F(tx-2,-60,3,8,'#3a2e2a');F(tx-2,-36,3,8,'#3a2e2a');F(tx-1,-59,1,1,'#ffd070')}
 // houses: half-timbered, orange/red tiled roofs, lit windows, chimneys; autumn trees in some gaps
 let x=CAPW.x0+46,k=0;const trees=[];
 while(x<CAPW.x1-46){const w=30+Math.round(hash(k*4.7)*26);if(!capFree(x,x+w)){x+=8;k++;continue}
  const two=hash(k*2.9)>.45,hh=two?34+Math.round(hash(k*3.3)*14):22+Math.round(hash(k*3.3)*6),R=CAPROOF[Math.floor(hash(k*5.1)*4)],wl=CAPWALL[Math.floor(hash(k*6.7)*4)],TM='#6a4230',gab=hash(k*7.3)<.5;
  const rx0=x-2,rw=w+4,rh=Math.min(gab?26:18,Math.round(w*(gab?.45:.36))),roofH=i=>{if(gab){const t=1-Math.abs((i+.5)/rw*2-1);return Math.max(1,Math.round(rh*t))}const s=Math.min(i,rw-1-i);return Math.max(1,Math.round(rh*Math.min(1,(s+1)/(rh*.9))))};
  F(x,-hh,w,hh,wl);F(x+w-3,-hh,3,hh,'#c8a888');F(x,-hh,1,hh,TM);F(x+w-1,-hh,1,hh,TM);F(x,-2,w,2,'#8a7a70');
  const my=two?-Math.round(hh/2):0;if(two){F(x-1,my-1,w+2,2,TM);for(let px2=x+9;px2<x+w-5;px2+=10){F(px2,-hh,1,hh+my,TM);for(let j=0;j<6&&my-2-j>-hh;j++)F(px2+1+j,my-2-j,1,1,TM)}}
  const dx=hash(k*8.1)<.5?x+4:x+w-11;F(dx-1,-12,8,1,TM);F(dx,-11,6,11,'#5a3420');F(dx+1,-10,4,10,'#7a4a2a');F(dx+4,-5,1,1,'#e8b040');
  const rows=two?[-hh+6,my+4]:[-hh+6];
  for(let ri=0;ri<rows.length;ri++){const wy=rows[ri],n=Math.max(1,Math.floor((w-6)/11));for(let j=0;j<n;j++){const wx=x+4+Math.round((j+.5)*(w-8)/n)-3;if(ri===rows.length-1&&wx+5>dx-2&&wx<dx+8)continue;if(wy+8>-12&&wx+5>dx-2&&wx<dx+8)continue;
   const lit=hash(k*9.3+j+ri*3)>.25;F(wx,wy,6,7,TM);F(wx+1,wy+1,4,5,lit?'#ffd070':'#5a6a80');if(lit)F(wx+1,wy+1,1,1,'#fff0b8');F(wx+1,wy+3,4,1,TM);F(wx-1,wy+7,8,1,'#8a6448');if(hash(k+j*1.3+ri)>.6){F(wx,wy+8,6,1,'#c0402a');F(wx+1,wy+8,1,1,'#ffe070')}}}
  for(let i=0;i<rw;i++){const h=roofH(i),col=i<rw/2?R[0]:R[1];F(rx0+i,-hh-h,1,h,col);for(let j=3;j<h;j+=3)F(rx0+i,-hh-h+j,1,1,R[2]);F(rx0+i,-hh-h,1,1,i<rw/2?'#f09050':R[0])}
  F(rx0,-hh,rw,1,R[2]);
  if(hash(k*1.9)>.3){const ci=Math.round(rw*(.2+hash(k*2.2)*.5)),cx=rx0+ci,top=-hh-roofH(ci)-7;F(cx,top,4,roofH(ci)+6,'#8a7a70');F(cx+3,top,1,roofH(ci)+6,'#6a5a52');F(cx-1,top,6,2,'#a89a8a');CAPC.chim.push({x:cx+2,y:top,s:hash(k*3.7)})}
  x+=w;const gap=hash(k*1.13)>.55?16+Math.round(hash(k*2.71)*10):2+Math.round(hash(k*2.71)*3);if(gap>12)trees.push(x+gap/2);x+=gap;k++}
 for(let i=0;i<trees.length;i++){const tx=trees[i],v=Math.floor(hash(i*3.3)*3),s=1+Math.floor(hash(i*5.7)*2);g.drawImage(treeImg(v,2,s),Math.round(tx-CAPX0)-(TREEW>>1),CAPGY-TREEH)}
 capShops(F);
 // market: three stalls with striped awnings, goods on the counters (spiced amber jars, tea bundles, cider barrels)
 const AW=[['#e8843a','#f4e4c8'],['#c0402a','#f4e4c8'],['#e0a030','#fff0d0']];
 [17776,17850,17924].forEach((sx,i)=>{const A=AW[i];F(sx-15,-22,1,22,'#6a4230');F(sx+14,-22,1,22,'#6a4230');F(sx-14,-9,28,9,'#8a5a3a');F(sx-14,-9,28,1,'#a87444');F(sx-14,-5,28,1,'#6a4230');
  for(let j=0;j<32;j++){const c=Math.floor(j/4)%2?A[1]:A[0];F(sx-16+j,-28,1,6+(j%4<2?1:0),c)}F(sx-16,-29,32,1,A[0]);
  if(i===0)for(let j=0;j<4;j++){const jx=sx-11+j*6;F(jx,-14,4,5,'#e88a2a');F(jx+1,-15,2,1,'#c06a20');F(jx+1,-13,1,2,'#ffd070')}
  else if(i===1)for(let j=0;j<5;j++){const jx=sx-11+j*5;F(jx,-13,4,4,j%2?'#c8482a':'#a83a22');F(jx+1,-14,2,1,'#5a7a2a')}
  else for(let j=0;j<3;j++){const jx=sx-11+j*8;F(jx,-15,6,6,'#8a5a3a');F(jx,-13,6,1,'#5a3a22');F(jx,-11,6,1,'#5a3a22');F(jx+2,-15,2,1,'#d8a040')}});
 for(const [bx,b] of [[17808,0],[17892,1],[17950,0],[17752,1]]){if(b){F(bx-4,-8,8,8,'#8a5a3a');F(bx-4,-8,8,1,'#a87444');F(bx-4,-4,8,1,'#5a3a22')}else{F(bx-4,-9,8,9,'#7a5038');F(bx-4,-7,8,1,'#5a3a22');F(bx-4,-3,8,1,'#5a3a22');F(bx-3,-9,6,1,'#9a6a48')}}
 // Vex's Tower: tall stone, glowing violet windows, purple cone roof, gold star
 {const t=CAPW.tower,W2=18,TH=142,S1='#8a8298',S2='#6e6680',S3='#a8a0b4';F(t-W2,-TH,W2*2,TH+20,S1);F(t+W2-8,-TH,8,TH+20,S2);F(t-W2,-TH,2,TH,S3);
  for(let y=-TH+8,r=0;y<0;y+=8,r++){F(t-W2,y,W2*2,1,S2);for(let xx=t-W2+(r%2?5:0);xx<t+W2;xx+=10)F(xx,y-7,1,7,S2)}
  for(const by of [-40,-86,-TH]){F(t-W2-2,by,W2*2+4,3,'#5a526a');F(t-W2-2,by,W2*2+4,1,S3)}
  for(const [wx,wy] of [[t-8,-70],[t+3,-112],[t-10,-130],[t+5,-62]]){F(wx-1,wy-1,7,11,'#4a425a');F(wx,wy+2,5,8,'#c890ff');F(wx+1,wy,3,2,'#c890ff');F(wx+1,wy+3,1,5,'#f0d8ff');F(wx+2,wy+2,1,8,'#a070e0')}
  F(t-W2-3,-TH-2,W2*2+6,3,'#5a526a');for(let xx=t-W2-3;xx<t+W2+3;xx+=6){F(xx,-TH-7,4,5,S1);F(xx,-TH-7,4,1,S3)}
  const RH=48,RW=W2+6;for(let i=-RW;i<RW;i++){const h=Math.round(RH*(1-Math.abs(i+.5)/RW));F(t+i,-TH-8-h,1,h,i<0?'#7a4ab0':'#5a3a8a');for(let j=4;j<h;j+=4)F(t+i,-TH-8-h+j,1,1,'#4a2a70')}
  F(t-RW,-TH-8,RW*2,1,'#4a2a70');F(t-1,-TH-8-RH-4,2,5,'#e8b040');F(t-2,-TH-8-RH-2,4,1,'#ffe070');
  for(let i=-7;i<=7;i++){const h=Math.round(15+5*Math.sqrt(1-(i/7.5)**2));F(t+i,-h,1,h,Math.abs(i)>=6?'#5a526a':'#3a2a4a')}
  F(t-5,-17,10,17,'#4a2a5a');F(t-5,-17,10,1,'#6a3a7a');F(t-1,-17,1,17,'#3a1e48');F(t-4,-12,2,1,'#e8b040');F(t+2,-12,2,1,'#e8b040');F(t-2,-15,4,3,'#c890ff');F(t+3,-8,1,2,'#e8b040');
  F(t-11,-2,22,2,'#8a8298');F(t-9,-4,18,2,'#a8a0b4')}
 // gatehouses at both ends: twin turrets, arch with a raised portcullis, Aldenreach banners (gold leaf on red)
 for(const gx of [CAPW.x0,CAPW.x1]){const B='#b0a092',B2='#8e7e72',B3='#c8b8a8';F(gx-26,-88,52,108,B);F(gx+16,-88,10,108,B2);
  for(const s of [-1,1]){const tx=s<0?gx-28:gx+14;F(tx,-102,14,102,s<0?B:B2);F(tx,-102,14,2,B3);for(let xx=tx;xx<tx+14;xx+=5){F(xx,-108,3,6,s<0?B:B2);F(xx,-108,3,1,B3)}F(tx+6,-90,2,8,'#3a2e2a');F(tx+6,-60,2,8,'#3a2e2a')}
  for(let xx=gx-14;xx<gx+14;xx+=6){F(xx,-94,4,6,B);F(xx,-94,4,1,B3)}F(gx-14,-88,28,2,B3);
  for(let y=-80,r=0;y<0;y+=8,r++)for(let xx=gx-26+(r%2?6:0);xx<gx+26;xx+=12)F(xx,y,1,7,B2);for(let y=-80;y<0;y+=8)F(gx-26,y,52,1,B2);
  for(let i=-12;i<12;i++){const h=Math.round(28+8*Math.sqrt(Math.max(0,1-((i+.5)/12)**2)));F(gx+i,-h,1,h,'#2a201c');F(gx+i,-h-1,1,1,'#6a5a52')}
  for(let i=-11;i<12;i+=3){const h=Math.round(28+8*Math.sqrt(Math.max(0,1-((i+.5)/12)**2)));F(gx+i,-h,1,h-26,'#5a4a40')}F(gx-12,-29,24,1,'#5a4a40');F(gx-12,-27,24,1,'#4a3a32');
  for(const bx of [gx-24,gx+17]){F(bx,-74,7,22,'#a8282a');F(bx,-74,7,1,'#7a1418');F(bx+6,-74,1,22,'#7a1418');F(bx-1,-75,9,1,'#6a4230');for(let j=0;j<4;j++){F(bx+j,-52+j,1,4-j,'#a8282a');F(bx+6-j,-52+j,1,4-j,'#a8282a')}
   for(const [a,b] of [[3,0],[1,1],[3,1],[5,1],[2,2],[3,2],[4,2],[1,3],[2,3],[3,3],[4,3],[5,3],[3,4],[3,5]])F(bx+a,-70+b,1,1,'#e8b040')}}
 CAPC.img=cv}
// shop facades (painted into CAPC): forge (dark stone, furnace, chimney), stables (red barn, hay), carrier (wide arched coach door, wheel),
// smith (stone shop, amber sword window); each has a hanging pixel sign beside its door
function capShops(F){
 const sign=(x,y,bg,ic)=>{F(x-1,y-6,9,1,'#3a2a24');F(x+6,y-8,1,3,'#3a2a24');F(x,y-5,1,2,'#3a2a24');F(x+5,y-5,1,2,'#3a2a24');F(x-2,y-3,10,10,'#4a3226');F(x-1,y-2,8,8,bg);ic(x-1,y-2)};
 const roof=(x0,w,h,c1,c2,c3,top)=>{for(let i=0;i<w;i++){const t=1-Math.abs((i+.5)/w*2-1),rh=Math.max(1,Math.round(h*Math.min(1,t*1.6)));F(x0+i,top-rh,1,rh,i<w/2?c1:c2);for(let j=3;j<rh;j+=3)F(x0+i,top-rh+j,1,1,c3)}F(x0,top,w,1,c3)};
 for(const s of CAPSHOP){const a=s.x-s.w/2,w=s.w;
  if(s.tab==='craft'){const H=34;F(a,-H,w,H,'#5e5866');for(let y=-H+5,r=0;y<0;y+=5,r++){F(a,y,w,1,'#4a4452');for(let xx=a+(r%2?4:0);xx<a+w;xx+=9)F(xx,y-4,1,4,'#4a4452')}F(a,-H,1,H,'#3e3846');F(a+w-1,-H,1,H,'#3e3846');
   roof(a-3,w+6,14,'#4a4a56','#3a3a44','#2e2e38',-H);F(a+w-14,-H-24,8,24,'#6a6474');F(a+w-8,-H-24,2,24,'#4a4452');F(a+w-15,-H-26,10,2,'#7a7484');F(a+w-13,-H-25,6,1,'#ff8a2a');
   for(let i=-9;i<=9;i++){const h=Math.round(14+6*Math.sqrt(Math.max(0,1-(i/9.5)**2)));F(a+16+i,-h,1,h,'#2a1a14')} // furnace arch
   F(a+9,-10,15,10,'#c84a1a');F(a+11,-9,11,8,'#ff8a2a');F(a+13,-7,7,6,'#ffd040');F(a+15,-5,3,4,'#fff0a0');F(a+6,-2,21,2,'#3a2a24');
   F(a+33,-21,10,21,'#3a2e2a');F(a+34,-20,8,20,'#5a3a26');F(a+40,-11,1,1,'#e8b040');F(a+33,-22,10,1,'#2a201c'); // door
   F(a+30,-6,9,2,'#3a3a40');F(a+32,-4,4,2,'#2a2a30');F(a+31,-2,6,2,'#3a3a40');F(a+30,-6,9,1,'#8a8a94'); // anvil
   sign(a+w-6,-26,'#e8dcc0',(x,y)=>{F(x+1,y+2,6,2,'#3a3a40');F(x+3,y+4,2,2,'#3a3a40');F(x+2,y+6,4,1,'#3a3a40');F(x+6,y+2,1,1,'#3a3a40')})}
  else if(s.tab==='stable'){const H=30;F(a,-H,w,H,'#9a3a2a');for(let xx=a+3;xx<a+w;xx+=4)F(xx,-H,1,H,'#7a2a1e');F(a,-H,w,1,'#b8503a');F(a,-2,w,2,'#5a2a1e');
   for(let i=0;i<w+6;i++){const d=Math.min(i,w+5-i),rh=d<8?Math.round(d*1.4):Math.round(11+(d-8)*.5);F(a-3+i,-H-rh,1,Math.max(1,rh),i<(w+6)/2?'#6a3a2a':'#542e22')}F(a-3,-H,w+6,1,'#3a2018');
   const dx=s.x-12;F(dx-1,-23,26,23,'#e8dcc0');F(dx,-22,24,22,'#6a2a1e');for(const ox of [0,12]){for(let j=0;j<12;j++){F(dx+ox+j,-22+Math.round(j*22/12),1,1,'#e8dcc0');F(dx+ox+11-j,-22+Math.round(j*22/12),1,1,'#e8dcc0')}F(dx+ox,-22,12,1,'#e8dcc0')}F(dx+12,-22,1,22,'#e8dcc0');
   F(s.x-6,-H-10,12,9,'#e8dcc0');F(s.x-5,-H-9,10,7,'#3a2018');F(s.x-4,-H-5,8,3,'#e8c860');F(s.x-3,-H-6,2,1,'#f8e080'); // hay loft
   for(const [hx,hy] of [[a-2,0],[a+w-8,0],[a+w-5,-6]]){F(hx,hy-6,9,6,'#d8b048');F(hx,hy-6,9,1,'#f0d070');F(hx+3,hy-6,1,6,'#b8902a');F(hx,hy-3,9,1,'#b8902a')}
   sign(a+4,-24,'#e8dcc0',(x,y)=>{for(const [p,q] of [[1,1],[1,2],[1,3],[1,4],[2,5],[3,6],[4,6],[5,5],[6,4],[6,3],[6,2],[6,1]])F(x+p,y+q,1,1,'#7a7a84');F(x+1,y+1,1,1,'#b8b8c0');F(x+6,y+1,1,1,'#b8b8c0')})}
  else if(s.tab==='haulers'){const H=36;F(a,-H,w,H,'#e0c8a8');F(a+w-3,-H,3,H,'#c8a888');F(a,-H,1,H,'#6a4230');F(a+w-1,-H,1,H,'#6a4230');F(a,-H+12,w,2,'#6a4230');for(let xx=a+8;xx<a+w-4;xx+=12)F(xx,-H,1,12,'#6a4230');
   roof(a-3,w+6,16,'#3a5a8a','#2e4870','#22385a',-H);
   for(let i=-14;i<=14;i++){const h=Math.round(16+8*Math.sqrt(Math.max(0,1-(i/14.5)**2)));F(s.x+i,-h,1,h,'#2a201c');F(s.x+i,-h-1,1,1,'#8a7a70')}
   for(let i=-12;i<=12;i++){const h=Math.round(15+7*Math.sqrt(Math.max(0,1-(i/12.5)**2)));F(s.x+i,-h,1,h,'#3a2a22')}
   const wx=s.x+2;for(const [p,q] of [[-3,-7],[-2,-8],[-1,-8],[0,-8],[1,-8],[2,-7],[3,-6],[3,-5],[3,-4],[3,-3],[2,-2],[1,-1],[0,-1],[-1,-1],[-2,-1],[-3,-2],[-4,-3],[-4,-4],[-4,-5],[-4,-6]])F(wx+p,q,1,1,'#c8a040');F(wx-1,-5,2,2,'#e8b040');F(wx-4,-9,10,1,'#8a2a32');F(s.x-11,-10,6,8,'#8a2a32');F(s.x-11,-10,6,1,'#a8404a'); // coach inside
   F(a+4,-12,9,9,'#3a2a22');F(a+5,-11,7,7,'#8a5a3a');F(a+8,-11,1,7,'#3a2a22');F(a+5,-8,7,1,'#3a2a22');F(a+7,-9,3,3,'#c8a040'); // spare wheel
   for(const wx2 of [a+6,a+w-12]){F(wx2,-H+3,7,7,'#6a4230');F(wx2+1,-H+4,5,5,'#ffd070');F(wx2+3,-H+4,1,5,'#6a4230')}
   sign(a+w-7,-27,'#e8dcc0',(x,y)=>{for(const [p,q] of [[2,0],[3,0],[4,0],[5,0],[1,1],[6,1],[0,2],[7,2],[0,3],[7,3],[0,4],[7,4],[0,5],[7,5],[1,6],[6,6],[2,7],[3,7],[4,7],[5,7]])F(x+p,y+q,1,1,'#5a3818');F(x+3,y+3,2,2,'#c8a040');F(x+3,y+1,2,1,'#8a5a3a');F(x+3,y+6,2,1,'#8a5a3a');F(x+1,y+3,1,2,'#8a5a3a');F(x+6,y+3,1,2,'#8a5a3a')})}
  else{const H=32;F(a,-H,w,H,'#b0a092');for(let y=-H+6,r=0;y<0;y+=6,r++){F(a,y,w,1,'#9a8a80');for(let xx=a+(r%2?5:0);xx<a+w;xx+=10)F(xx,y-5,1,5,'#9a8a80')}F(a,-H,1,H,'#86766c');F(a+w-1,-H,1,H,'#86766c');
   roof(a-3,w+6,15,'#c0402a','#9a3020','#702418',-H);F(a+10,-H-20,5,10,'#8a7a70');F(a+9,-H-21,7,2,'#a89a8a');
   F(a+4,-22,24,16,'#4a3226');F(a+5,-21,22,14,'#3a2418');for(let i=0;i<10;i++){F(a+8+i*2,-17+(i>7?0:0),2,2,['#a8541a','#c86a1a','#e08a2a','#f0a040','#f8c060','#ffe0a0','#f8c060','#f0a040','#d8b040','#5a3818'][i])}F(a+7,-19,1,6,'#d8b040');F(a+5,-21,22,1,'#ffe0a0'); // display window: the Resin Sword
   for(let i=0;i<3;i++)F(a+12+i*4,-14,1,2+i%2,'#e8a040');F(a+4,-6,24,2,'#6a4230');
   F(a+34,-22,12,22,'#3a2e2a');F(a+35,-21,10,21,'#6a4230');F(a+36,-20,8,9,'#7a4a2a');F(a+43,-11,1,1,'#e8b040');
   sign(a+w-5,-28,'#e8dcc0',(x,y)=>{for(let i=0;i<6;i++)F(x+1+i,y+6-i,1,1,i<4?'#a8b0bc':'#e8eef4');F(x+1,y+4,3,1,'#d8b040');F(x+2,y+3,1,3,'#d8b040');F(x,y+7,1,1,'#5a3818')})}}}
function capLamps(){if(CAPC.lamps.length)return CAPC.lamps;for(let x=CAPW.x0+70;x<CAPW.x1-60;x+=118){if(Math.abs(x-17850)<110||Math.abs(x-CAPW.tower)<40||CAPSHOP.some(s=>Math.abs(x-s.x)<s.w/2+6))continue;CAPC.lamps.push(x)}CAPC.lamps.push(17736,17964);return CAPC.lamps}
// townsfolk: little walkers that pace their own stretch of the street (decor only)
const CAPFOLK=[{x:17300,r:70,c:'#4a6aa8'},{x:17560,r:90,c:'#8a4a6a'},{x:17850,r:60,c:'#5a7a3a'},{x:18080,r:80,c:'#a8642a'},{x:18400,r:60,c:'#6a4a8a'},{x:17700,r:40,c:'#a83a2a'}];
function drawFolk(ox,oy,gy){for(let i=0;i<CAPFOLK.length;i++){const f=CAPFOLK[i],ph=menuT*.35/(f.r/60)+i*1.7,s=Math.sin(ph),dir=Math.cos(ph)>0?1:-1,wx=f.x+s*f.r,x=Math.round(wx-ox),y=gy;if(x<-10||x>VW+10)continue;
 const st=Math.floor(menuT*6+i)%2,F=(a,b,w,h,c)=>px(X,dir>0?x+a:x-a-w+1,y+b,w,h,c);
 F(-1,-3,1,3-st,'#3a2a24');F(1,-3,1,2+st,'#3a2a24');F(-2,-9,5,6,f.c);F(-2,-4,5,1,'#3a2a24');F(-1,-12,3,3,'#f0c8a8');F(-1,-13,3,1,i%2?'#5a3420':'#c89040');F(1,-11,1,1,'#2a1a1a');if(i%3===0)F(-2,-13,5,1,'#6a4230')}}
function flag(x,y,w,h,c1,c2,ph){for(let i=0;i<w;i++){const o=Math.round(Math.sin(menuT*4-i*.7+ph)*1.2*(i/w));px(X,x+i,y+o,1,h,i%4<2?c1:c2)}}
function drawPier(q,dir,ox,oy){const gy=Math.round(surfY(q)-oy),a=dir<0?q-150:q-10,b=dir<0?q+10:q+150;const x0=Math.round(a-ox),L=b-a;if(x0>VW+40||x0+L<-40)return;
 px(X,x0,gy-3,L,3,'#8a5a3a');px(X,x0,gy-3,L,1,'#a87444');for(let i=0;i<L;i+=5)px(X,x0+i,gy-2,1,2,'#6a4230');
 for(let i=6;i<L;i+=26){px(X,x0+i,gy,2,18,'#6a4230');px(X,x0+i+1,gy,1,18,'#4a2e1e')}
 const ex=dir<0?x0+3:x0+L-4;px(X,ex,gy-16,1,13,'#3a2a24');px(X,ex-2,gy-17,5,1,'#3a2a24');const fl=Math.sin(menuT*9+q)>0;px(X,ex-1,gy-16,3,3,fl?'#ffd070':'#ffb040');X.globalAlpha=.12;X.fillStyle='#ffd070';X.beginPath();X.arc(ex,gy-15,9,0,7);X.fill();X.globalAlpha=1;
 // moored sky skiff, bobbing at the pier end
 const sx=dir<0?x0-26:x0+L+2,sy=gy+2+Math.round(Math.sin(menuT*1.6+q)*2);for(let i=0;i<26;i++){const d=Math.abs(i-12.5)/13,h=Math.max(1,Math.round(6*(1-d*d)));px(X,sx+i,sy-4,1,h,i%6<3?'#8a5a3a':'#7a4a2e');px(X,sx+i,sy-4,1,1,'#a87444')}
 px(X,sx+12,sy-24,1,20,'#5a3420');for(let j=0;j<16;j++){const w=Math.max(1,Math.round(9*(1-Math.abs(j-8)/9)));px(X,sx+13,sy-23+j,w,1,j%5?'#f4e4c8':'#e8843a')}
 for(const w of [2,20]){px(X,sx+w,sy-6,4,1,'#e8e0d0');px(X,sx+w+1,sy-7,2,1,'#ffffff')}px(X,dir<0?sx+25:sx,sy-5,dir<0?x0-sx-25+3:x0+L-sx+0,1,'#c8a070')}
function drawCapital(ox,oy){if(ox+VW<ISLES[2].x0-200||ox>ISLES[2].x1+200)return;const gy0=surfY(CAPW.x0+120);
 for(const q of CAPW.piers)drawPier(q,q<17850?-1:1,ox,oy);
 if(ox+VW<CAPX0||ox>CAPX0+CAPCW)return;if(!CAPC.img)capArt();const gy=Math.round(gy0-oy);
 // chimney smoke behind the roofs' edge: soft pixel puffs rising and drifting
 for(const c of CAPC.chim){const x=Math.round(c.x-ox);if(x<-20||x>VW+20)continue;for(let j=0;j<4;j++){const p=(menuT*.45+c.s+j/4)%1,sz=1+Math.round(p*3);X.globalAlpha=.55*(1-p);px(X,x-1+Math.round(p*8+Math.sin(menuT+j)*1.5),Math.round(gy+c.y-2-p*26),sz,sz,'#e8dcd4')}}X.globalAlpha=1;
 X.drawImage(CAPC.img,Math.round(CAPX0-ox),gy-CAPGY);
 // flags: gatehouse turrets, wall towers, the tower's pennant; lamplight; the tower door glows
 for(const gx of [CAPW.x0,CAPW.x1])for(const s of [-1,1]){const fx=Math.round(gx+s*21-ox);if(fx<-20||fx>VW+20)continue;px(X,fx,gy-122,1,16,'#3a2a24');flag(fx+1,gy-122,11,6,'#a8282a','#c0402a',gx*.01+s);px(X,fx+4,gy-120,2,2,'#e8b040')}
 for(const tx of [17420,17630,18060,18430]){const fx=Math.round(tx-ox);if(fx<-20||fx>VW+20)continue;px(X,fx,gy-94,1,14,'#3a2a24');flag(fx+1,gy-94,8,5,'#e8843a','#e8b040',tx*.01)}
 {const t=CAPW.tower,fx=Math.round(t-ox);if(fx>-40&&fx<VW+40){flag(fx+2,gy-205,10,3,'#7a4ab0','#c890ff',0);const pl=.5+.5*Math.sin(menuT*3),near=P&&!DG&&Math.abs(P.x-t)<30;X.globalAlpha=(near?.22:.1)+pl*.06;X.fillStyle='#c890ff';X.beginPath();X.arc(fx,gy-10,near?18:14,0,7);X.fill();X.globalAlpha=1;
  if(Math.sin(menuT*2.2)>.3){const k=Math.floor(menuT*2.2)%4;px(X,fx-14+k*9,gy-150+((k*13)%40),1,1,'#f0d8ff')}}}
 for(const lx of capLamps()){const x=Math.round(lx-ox);if(x<-12||x>VW+12)continue;const fl=Math.sin(menuT*8+lx)>0;px(X,x,gy-18,1,18,'#3a2a24');px(X,x-2,gy-22,5,1,'#3a2a24');px(X,x-1,gy-21,3,4,fl?'#ffd070':'#ffb040');px(X,x,gy-20,1,2,'#fff0b8');X.globalAlpha=.1;X.fillStyle='#ffd070';X.beginPath();X.arc(x,gy-19,11,0,7);X.fill();X.globalAlpha=1}
 capShopLive(ox,gy);drawFolk(ox,oy,gy)}
// live shop details: the forge's furnace flickers and its chimney throws sparks; a shop door glows while you stand at it
function capShopLive(ox,gy){const ns=nearCapShop();for(const s of CAPSHOP){const a=Math.round(s.x-s.w/2-ox);if(a<-s.w-30||a>VW+30)continue;
  if(s.tab==='craft'){const f=.5+.5*Math.sin(menuT*9)*Math.sin(menuT*3.3);X.globalAlpha=.18+.14*f;X.fillStyle='#ff8a2a';X.beginPath();X.arc(a+16,gy-6,13,0,7);X.fill();X.globalAlpha=1;px(X,a+13+Math.round(f*4),gy-6,2,2,f>.5?'#fff0a0':'#ffd040');
   for(let j=0;j<3;j++){const p=(menuT*.9+j/3)%1;px(X,a+s.w-10+Math.round(Math.sin(menuT*3+j*2)*2+p*5),Math.round(gy-60-p*22),1,1,p<.5?'#ffd040':'#ff8a2a')}}
  if(ns===s){X.globalAlpha=.12+.06*Math.sin(menuT*4);X.fillStyle=s.c;X.beginPath();X.arc(Math.round(s.x-ox),gy-10,18,0,7);X.fill();X.globalAlpha=1}}}
// ---- World 2 autumn ground decor (DECOR with biome >= 8: the capital island outside the walls) ----
function auDecor(d,P){const r=d.r;
 if(r<.24){P(-4,-2,9,2,'#c0502a');P(-3,-3,7,1,'#e8843a');P(-1,-4,3,1,'#f0a040');P(2,-3,1,1,'#ffe070');P(-5,-1,1,1,'#a83a22')}
 else if(r<.4){const s=r<.32;P(-3,-4,7,4,'#e8781a');P(-2,-5,5,1,'#f09030');P(-1,-4,1,4,'#c05a12');P(1,-4,1,4,'#c05a12');P(0,-7,1,2,'#5a7a2a');P(1,-7,2,1,'#6a8a3a');if(s){P(5,-3,4,3,'#e8781a');P(6,-4,2,1,'#f09030');P(6,-5,1,1,'#5a7a2a')}}
 else if(r<.56){P(-4,-5,9,5,'#a83a22');P(-3,-6,7,1,'#c8502a');P(-2,-4,2,1,'#e8843a');P(1,-3,1,1,'#ffe070');P(2,-5,2,1,'#e8843a')}
 else if(r<.68){P(-3,-3,1,3,'#e8dcc8');P(-5,-5,5,2,'#a85a3a');P(-4,-6,3,1,'#c87a4a');P(1,-2,1,2,'#e8dcc8');P(0,-3,3,1,'#c87a4a');P(-4,-5,1,1,'#f4e4c8')}
 else if(r<.8){P(-6,-3,12,3,'#7a5038');P(-6,-3,12,1,'#9a6a48');P(-6,-3,2,3,'#c8a070');P(-5,-2,1,1,'#8a6040');P(2,-4,2,1,'#c8502a')}
 else if(r<.88){const fl=Math.sin(menuT*8+d.k)>0;P(0,-14,1,14,'#3a2a24');P(-2,-18,5,1,'#3a2a24');P(-1,-17,3,3,fl?'#ffd070':'#ffb040');P(0,-16,1,1,'#fff0b8')}
 else{P(-2,-3,1,3,'#d8a040');P(0,-4,1,4,'#e8b850');P(2,-3,1,3,'#c08a30');P(-1,-2,1,2,'#c08a30')}}
// ---- Vex's Tower ----
// Interior: one tall, narrow shaft (x 0..TOWER.w, y up is negative). The ground floor has the door; one ladder runs straight up to Vex's landing at the top.
// Up (W / arrow / tU / jump) anywhere on the ground floor slides you onto the ladder and climbs; down anywhere on the landing climbs back. Your cart and horse stay hitched (they are invisible on foot).
const TOWER={w:112,fl:[0,-236],lad:[{x:76,y0:0,y1:-236}],door:20,vex:30,climb:120};
function nearTowerDoor(){return WI===1&&!DG&&!!P&&!P.fly&&Math.abs(P.x-CAPW.tower)<16&&Math.abs(P.y-surfY(CAPW.tower))<12}
function towerPrompt(){return '<b style="color:#c9b4ec">'+ico('ball')+' Vex\'s Tower</b><br>'+(isTouch?'Tap E':'Press E')+' to enter'}
function enterTower(){if(DG||!WI)return;const dx=CAPW.tower;fadeIn();if(S.horse&&S.horse.on)dismount(dx+30);
 save();DG={tower:1,d:{x:dx,diff:0},t:0,minX:TOWER.w/2-VW/2,maxX:TOWER.w/2+VW/2,plats:[],foes:[]};ENEMIES=[];PROJ=[];PICK=[];PARTS=[];FTXT=[];ROCKS=[];
 P=newPlayer(0);P.x=TOWER.door+8;P.y=0;P.onGround=true;P.plat=null;P.safe={x:P.x,y:0,p:null};P.inv=.6;P.dir=1;P.climb=null;
 const t=$('toasts');if(t)t.innerHTML=''; // drop the region banner so it does not sit over the room
 camX=DG.minX;camY=towerCamY();showPrompt('')}
// camera: on the ground floor the room sits at 62% height, clear of the touch buttons; it eases up with you on the climb so the top landing
// (Vex) ends at 60%, below the prompt box
function towerCamY(){const f=clamp(-P.y/-TOWER.fl[1],0,1);return lerp(Math.min(-VH*.62,P.y-60),P.y-VH*.6,f)}
function updTower(dt){const D=DG,T=TOWER,L=T.lad[0],top=T.fl[1];D.minX=T.w/2-VW/2;D.maxX=T.w/2+VW/2;P.onGround=true;P.vy=0;
 if(MODE!=='play'){showPrompt('');return}
 const up=!!(keys.w||keys.arrowup||tkeys.u),dn=!!(keys.s||keys.arrowdown||tkeys.d),upP=inp.jump()||pressed.tu,dnP=!!(pressed.s||pressed.arrowdown||pressed.td);
 const mv=(inp.left()?-1:0)+(inp.right()?1:0);let h='';const k=isTouch?'Tap E':'Press E';
 if(P.climb){P.x+=(L.x-P.x)*Math.min(1,dt*10);const atL=Math.abs(P.x-L.x)<2; // slide onto the ladder, then climb; it carries on by itself
  P.walk=1;if(atL){P.y+=P.cv*T.climb*dt;P.wheel+=dt*8;
   if(P.y<=L.y1){P.y=L.y1;P.climb=null;P.x=L.x-16;P.dir=-1}else if(P.y>=L.y0){P.y=L.y0;P.climb=null;P.x=L.x-16;P.dir=-1}}
  showPrompt('');return}
 if(mv)P.dir=mv;const ox=P.x;P.x=clamp(P.x+mv*94*spdMul()*dt,8,T.w-8);P.walk=mv&&1;P.wheel+=(P.x-ox)/4;
 if(P.y===0){if(upP||up){P.climb=L;P.cv=-1;showPrompt('');return}
  if(Math.abs(P.x-T.door)<14){h=ico('exit')+' Leave<br>'+k;if(inp.use()){showPrompt('');exitDungeon();return}}
  else h=ico('up')+'<br>'+(isTouch?'Tap':'[W]')+' climb'}
 else if(P.y===top){if(dnP||dn){P.climb=L;P.cv=1;showPrompt('');return}
  h='<b style="color:#c9b4ec">'+ico('ball')+' Vex</b><br>'+k+' to enchant';if(inp.use()){showPrompt('');WTOWER=1;openWitch();return}}
 showPrompt(h)}
let TWC=null;
function towerArt(){const T=TOWER,W=T.w+80,H=340,g0=300,top=T.fl[1],L=T.lad[0],cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),F=(x,y,w,h,c)=>px(g,x+40,g0+y,w,h,c);
 F(-40,-300,W,H,'#241e2c');F(0,-290,T.w,290,'#4a4058');
 for(let y=-290,r=0;y<0;y+=8,r++){F(0,y,T.w,1,'#3e3550');for(let x=(r%2?8:0);x<T.w;x+=16)F(x,y,1,8,'#3e3550');if(r%5===2)F((r*37)%96+6,y+3,6,2,'#544a64')}
 F(-4,-290,4,290,'#3a3248');F(T.w,-290,4,290,'#3a3248');
 // tall slit windows with the sunset outside, up the shaft
 for(const [wx,wy,wh] of [[40,-70,30],[16,-150,30],[92,-120,30],[44,-200,22],[96,-276,22]]){F(wx-2,wy-2,10,wh+4,'#5a526a');for(let j=0;j<wh;j++){const c=j<wh*.3?'#ec9470':j<wh*.6?'#f2a272':'#ffd2a2';F(wx,wy+j,6,1,c)}F(wx,wy,1,2,'#5a526a');F(wx+5,wy,1,2,'#5a526a');F(wx+2,wy,2,wh,'#5a526a');F(wx-3,wy+wh,12,2,'#6e6680')}
 // wall shelves up the shaft: books, potions, a star chart
 {const y=-104;F(4,y,30,2,'#6a4230');for(let b=0;b<9;b++){const c=['#a83a2a','#3a6a8a','#e8b040','#5a7a3a','#8a4a8a'][b%5];F(6+b*3,y-7+(b%3===1?1:0),2,7-(b%3===1?1:0),c)}}
 {const y=-176;F(80,y,28,2,'#6a4230');for(let b=0;b<4;b++){const c=['#e84a6a','#5ae0a0','#c890ff','#ffd070'][b];F(83+b*6,y-5,3,5,c);F(84+b*6,y-6,1,1,'#e8e0d0')}}
 F(8,-222,26,18,'#2a2a4a');F(7,-223,28,1,'#e8b040');F(7,-204,28,1,'#e8b040');for(const [a,b] of [[11,-219],[17,-214],[24,-218],[29,-209],[14,-208]])F(a,b,1,1,'#ffffff');F(12,-218,6,1,'#6a6a9a');F(18,-214,7,1,'#6a6a9a');
 // ground: flagstones, door (warm daylight), rug, barrels
 F(0,0,T.w,40,'#5a5068');for(let x=0;x<T.w;x+=13)F(x,0,1,6,'#4a4058');F(0,0,T.w,1,'#6e6680');
 F(T.door-9,-26,18,26,'#5a526a');for(let i=-7;i<=7;i++){const h=Math.round(18+5*Math.sqrt(1-(i/7.5)**2));F(T.door+i,-h,1,h,'#ffd2a2')}F(T.door-7,-3,15,3,'#f2a272');
 F(34,-1,30,1,'#8a2a4a');F(36,-1,26,1,'#a83a5a');for(let x=38;x<62;x+=6)F(x,-1,2,1,'#e8b040');
 for(const bx of [96,104]){F(bx-4,-10,8,10,'#7a5038');F(bx-4,-8,8,1,'#5a3a22');F(bx-4,-3,8,1,'#5a3a22')}
 // the landing at the top (planks, a hatch for the ladder), Vex's desk with the crystal ball, a rug
 F(0,top,T.w,6,'#8a6448');F(0,top,T.w,1,'#a87c58');F(0,top+5,T.w,1,'#4a3226');for(let x=6;x<T.w;x+=17)F(x,top+1,1,4,'#6a4a3a');for(let x=6;x<T.w;x+=30)F(x,top+6,4,6,'#5a3e2e');F(L.x-8,top,16,6,'#1e1826');
 F(40,top-10,22,2,'#6a4230');F(42,top-8,2,8,'#4a3226');F(58,top-8,2,8,'#4a3226');F(46,top-13,8,3,'#4a3a5a');
 F(6,top-1,40,1,'#8a2a4a');for(let x=8;x<44;x+=6)F(x,top-1,2,1,'#e8b040');
 F(0,-290,T.w,6,'#3a2a24');for(let x=10;x<T.w;x+=26)F(x,-284,6,8,'#3a2a24');
 // the ladder, straight up the shaft
 F(L.x-7,L.y1-4,1,L.y0-L.y1+4,'#8a5a3a');F(L.x+6,L.y1-4,1,L.y0-L.y1+4,'#8a5a3a');for(let y=L.y1;y<L.y0;y+=6)F(L.x-6,y,12,1,'#a87444');
 TWC=cv}
function renderTower(){const T=TOWER,ox=Math.round(camX)+shk(),oy=Math.round(camY)+shk(),M=menuT;
 X.fillStyle='#1a1620';X.fillRect(0,0,VW,VH);if(!TWC)towerArt();X.drawImage(TWC,-40-ox,-300-oy);
 const S2=(x,y,w,h,c)=>px(X,Math.round(x-ox),Math.round(y-oy),w,h,c);
 // candles (desk, shelves) and the cauldron's bubbles
 for(const [cx,cy] of [[42,-249],[58,-249],[30,-108],[104,-180],[92,-14]]){const f=Math.sin(M*11+cx)>0;S2(cx,cy,2,4,'#e8e0d0');S2(cx,cy-3-(f?1:0),2,3,f?'#ffd070':'#ffb040');S2(cx,cy-3,1,1,'#fff0b8');X.globalAlpha=.1;X.fillStyle='#ffd070';X.beginPath();X.arc(Math.round(cx-ox)+1,Math.round(cy-oy)-2,10,0,7);X.fill();X.globalAlpha=1}
 
 // crystal ball on the desk
 {const bx=Math.round(50-ox),by=Math.round(-252-oy),pl=.5+.5*Math.sin(M*2.4);X.globalAlpha=.18+.12*pl;X.fillStyle='#c890ff';X.beginPath();X.arc(bx,by,9,0,7);X.fill();X.globalAlpha=1;
  for(let i=-3;i<=3;i++){const h=Math.round(3.6*Math.sqrt(1-(i/3.8)**2));px(X,bx+i,by-h,1,h*2,i>0?'#8a3ac0':'#c060ff')}px(X,bx-2,by-2,1,1,'#f0d0ff')}
 // dust in the window light
 for(let i=0;i<10;i++){const s=hash(i*3.7),x=8+((s*977+M*6*(1+s))%96),y=-280+((hash(i*5.1)*280+M*8)%280);S2(x,y,1,1,'rgba(255,220,180,.5)')}
 // Vex, at the top, facing you
 drawVex(X,Math.round(T.vex-ox),Math.round(T.fl[1]-oy),P&&P.x>T.vex?1:-1,M);
 if(P&&P.y===T.fl[1]&&Math.abs(P.x-T.vex)<22&&Math.sin(M*4)>0)S2(T.vex-1,T.fl[1]-30,2,2,'#c890ff');
 drawActors(ox,oy);
 X.fillStyle='rgba(0,0,0,.18)';X.fillRect(0,0,VW,6);X.fillRect(0,VH-6,VW,6);
 drawFTXT(ox,oy)}
