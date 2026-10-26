'use strict';
// Sky islands between Skyhaven and Sunspire (data: SKYISLES / STORMIN / SKYI / UNI in world2/data.js).
// Ground, landing, horse summon and unhitching come free from onIsle(); this file adds the island foes
// (ENEMY[..].isle, run from updAir/drawAir), unicorn bolts, storm clouds and the rewards.
// Save: S.sky={r:{<island>:S.time the reward was taken},st:1 once the storm tip was shown}. Created on first use; old saves need nothing.
const SKYST={ref:null,act:[],foes:[],full:[]},UB=[];
DROPS.unicorn=[['essence',.3]];DROPS.dreadUni=[['essence',.7]]; // on top of the witch-family essence roll (DROPS lives in inventory/data.js, loaded after world2/data.js)
function skyS(){if(!S.sky)S.sky={r:{},st:0};if(!S.sky.r)S.sky.r={};return S.sky}
function rwX(i){const I=SKYISLES[i];return Math.round((I.x0+I.x1)/2+(I.rx||0))}
function rwReady(i){const r=S.sky&&S.sky.r?S.sky.r[i]:null;return r==null||S.time-r>=(SKYISLES[i].rw==='chest'?SKYI.chestCd:SKYI.nodeCd)}
function skyTh(x,I){const ed=Math.min(x-I.x0,I.x1-x),bl=7+92*Math.sqrt(clamp(ed/230,0,1))+9*Math.sin(x/41+I.h)*clamp(ed/120,0,1);return Math.max(5,Math.round(heightAt(x)-I.h+bl+4*hash(Math.floor(x/3))))} // fixed belly under the base height: ledges and hills sit on top
function isleFoe(t,i,x,z0,z1){const e=spawnEnemy(t,x);e.isl=i;e.z0=z0;e.z1=z1;e.y=surfY(x);e.dir=rnd()<.5?-1:1;e.st='idle';e.sT=.4+rnd()*.6;e.tx=x;e.cd=1+rnd();e.tcd=0;e.onGround=true;e.vy=0;e.hx=0;e.hop=.5+rnd()*.8;e.sq=0;if(SKYISLES[i].au)auBuff(e);SKYST.foes.push(e);return e}
function isleDeath(e){const y=e.y-ENEMY[e.type].h/2;
 const d=ENEMY[e.type];if(d.gem&&rnd()<d.gem*DROPMUL)giveMat('skyglass'); // Sky Crystal: material, straight into S.mats
 if(d.cult||d.bot){auDeath(e,d,y);return} // autumn foes (world2/autumnfoes.js)
 if(d.fruit&&rnd()<d.fruit*DROPMUL)dropUnit({item:8,origin:6,paid:0},e.x,e.y-12); // Sunfruit (sky slimes, instead of the World 1 apple)
 if(d.uni){part(e.x,y,d.elite?'#ffd040':'#ff7ad8',10,120,40,.5);part(e.x,y,d.elite?'#1a1020':'#3e2c52',8,90,80,.5)}
 else{part(e.x,y,'#b8f8d8',8,110,200,.45);if(e.type==='bigSlime'&&SKYST.act[e.isl]){const I=SKYISLES[e.isl];for(const s of [-1,1]){const k=isleFoe('isleSlime',e.isl,clamp(e.x+s*8,e.z0||I.x0+10,e.z1||I.x1-10),e.z0,e.z1);k.onGround=false;k.y=e.y-6;k.vy=-170;k.hx=s*70;k.dir=s;k.hop=.5}}}}
function stormDrop(){part(P.x,P.y-20,'#c4d8f2',8,80,120,.5);if(!skyS().st){S.sky.st=1;toast(ico('wing',2)+' '+ico('x',2)+'<br>Storm cloud: land and cross on foot<br><small>call your horse past its edge</small>',3200)}}
function takeRw(i){const I=SKYISLES[i],x=rwX(i),y=surfY(x);let h='';
 if(I.rw==='chest'){const c=SKYI.chest[0]+Math.floor(rnd()*(SKYI.chest[1]-SKYI.chest[0]+1));S.money+=c;ftxt(x,y-22,'+$'+c,'#ffd75e');h='<span class="gold">+'+pr(c)+'</span>';
  const am=!!I.au,q=Math.min(am?SKYI.amber:SKYI.silk,cap()-cargoCount());if(q>0){addCargo(am?10:9,am?8:7,q,0);h+=' '+iconImg(ICONURL[am?'spicedamber':'starsilk'])+' +'+q}part(x,y-8,'#ffe08a',12,110,120,.6)}
 else{const lf=I.rw==='leaf',it=lf?11:6,n=lf?SKYI.leaf:SKYI.wool,q=Math.min(n,cap()-cargoCount()); // leaf = Emberleaf (autumn isles), else Cloud Wool
  if(q<=0){if(!SKYST.full[i]){SKYST.full[i]=1;toast(ico('pack',2)+' '+ico('x',2),1200)}return}
  addCargo(it,lf?8:6,q,0);h=iconImg(ICONURL[ITEMS[it].id])+' +'+q;ftxt(x,y-20,'+'+q,'#7de07a');part(x,y-8,lf?'#e8843a':'#ffffff',10,90,100,.5)}
 skyS().r[i]=S.time;toast(h,1600);save()}
function skyTick(dt){if(WI!==1||DG||!P)return;
 if(SKYST.ref!==ENEMIES){SKYST.ref=ENEMIES;W2ENV.pk=undefined;SKYST.act=[];SKYST.foes=[];UB.length=0;AUP.length=0} // ENEMIES was reset (death, menu, travel)
 skyHorseTick(dt);
 for(let i=0;i<SKYISLES.length;i++){const I=SKYISLES[i],dd=P.x<I.x0?I.x0-P.x:P.x>I.x1?P.x-I.x1:0;
  if(!SKYST.act[i]&&dd<VW/2+70){SKYST.act[i]=1;const n=I.foes.length,a=I.x0+SKYI.safe,sw=(I.x1-SKYI.safe-a)/n; // each foe owns one slice of the island (SKYI.gap between slices, SKYI.safe landing room at each end)
   I.foes.forEach((t,k)=>isleFoe(t,i,Math.round(a+sw*(k+.5)),Math.round(a+sw*k+SKYI.gap/2),Math.round(a+sw*(k+1)-SKYI.gap/2)))}
  else if(SKYST.act[i]&&dd>VW*1.25+60){SKYST.act[i]=0;for(const e of SKYST.foes)if(e.isl===i)e.dead=1} // killed foes come back on the next visit
  if(dd>40)SKYST.full[i]=0;
  if(!P.fly&&dd===0&&rwReady(i)){const x=rwX(i);if(Math.abs(P.x-x)<12&&Math.abs(P.y-surfY(x))<16)takeRw(i)}}
 for(const e of SKYST.foes)if(e.dead&&!e.done){e.done=1;if(e.hp<=0)isleDeath(e)}
 SKYST.foes=SKYST.foes.filter(e=>!e.done);
 // unicorn bolts: straight, glowing; jump or change band to dodge
 for(const b of UB){b.life-=dt;b.tr.unshift(b.y);b.tr.unshift(b.x);if(b.tr.length>20)b.tr.length=20;b.x+=b.vx*dt;b.y+=b.vy*dt;
  const g=groundAt(b.x);if(g!==null&&b.y>g+1){b.life=0;part(b.x,g,'#ff7ad8',4,60,100,.3);continue}
  const bb={x:b.x,y:b.y+2},BD={w:6,h:4},m=mounted();
  const hit=P.fly?airTouch(bb,BD):Math.abs(b.x-P.x)<(m?9:5)&&b.y>P.y-(m?27:17)&&b.y<P.y+1;
  if(hit){b.life=0;part(b.x,b.y,'#ff7ad8',6,90,60,.35);if(P.fly)airHit(bb,{dmg:b.dmg||UNI.bolt,hull:UNI.hull});else hurtPlayer(b.dmg||UNI.bolt,b.x)}
  else if(P.fly&&cartTouch(bb,BD)){b.life=0;part(b.x,b.y,'#ff7ad8',6,90,60,.35);cartHit(bb)}}
 for(let i=UB.length-1;i>=0;i--)if(UB[i].life<=0)UB.splice(i,1);
 auTick(dt)}
function uniFire(e){const dir=e.dir,hx=e.x+dir*17,hy=e.y-12;let a=Math.atan2(e.ay,Math.abs(e.ax)||1);if(Math.abs(e.ay)<16)a=0;a=clamp(a,-UNI.ang,UNI.ang);
 UB.push({x:hx,y:hy,vx:Math.cos(a)*UNI.spd*dir,vy:Math.sin(a)*UNI.spd,life:UNI.life,tr:[],dmg:e.au?Math.round(UNI.bolt*AUMUL):UNI.bolt});part(hx,hy,'#ff7ad8',6,70,0,.3);
 if(--e.bn>0){e.st='charge';e.sT=e.tele=UNI.gap;return} // burst: same aim, short re-glow between bolts
 e.st='cool';e.sT=.35;e.cd=UNI.cd+rnd()*UNI.cdR;e.vx-=dir*30}
function updIsle(e,dt,d){const I=SKYISLES[e.isl];if(!I){e.dead=1;return}const au=d.cult||d.bot,lo=!au&&e.z0!=null?e.z0:I.x0+8,hi=!au&&e.z1!=null?e.z1:I.x1-8; // autumn foes roam the whole island (they only patrol their own slice)
 e.x=clamp(e.x+e.vx*dt,lo,hi);e.vx*=Math.pow(.02,dt);if(e.tcd>0)e.tcd-=dt;e.moving=false;
 const gy=surfY(e.x),dxp=P.x-e.x,adx=Math.abs(dxp),near=adx<240&&P.y>gy-150&&P.y<gy+40;
 if(au){updAuFoe(e,dt,d,lo,hi,gy,dxp,adx,near,I);return} // cultist / Forgotten Robot: own attacks, no touch damage (world2/autumnfoes.js)
 if(d.uni){e.y=gy;
  if(e.st==='walk'){if(Math.abs(e.tx-e.x)<3){e.st='idle';e.sT=.5+rnd()*.8}else{const s=Math.sign(e.tx-e.x);e.dir=s;e.x=clamp(e.x+s*d.spd*dt,lo,hi);e.moving=true}}
  else if(e.st==='idle'){e.sT-=dt;if(near)e.dir=Math.sign(dxp)||e.dir;if(near&&adx<UNI.near){e.st='walk';e.tx=clamp(e.x-(Math.sign(dxp)||1)*80,lo,hi)}else if(e.sT<=0){e.st='walk';e.tx=lo+rnd()*(hi-lo)}}
  else if(e.st==='charge'){e.sT-=dt;if(e.sT<=0)uniFire(e)}
  else if(e.st==='cool'){e.sT-=dt;if(e.sT<=0){e.st='idle';e.sT=.3+rnd()*.4}}
  if(e.st==='walk'||e.st==='idle'){e.cd-=dt;if(near&&e.cd<=0&&adx>UNI.near&&adx<UNI.range){e.st='charge';e.sT=UNI.tele;e.bn=d.burst||1;e.tele=UNI.tele;e.dir=Math.sign(dxp)||1;e.ax=P.x-(e.x+e.dir*17);e.ay=(P.y-10)-(e.y-12)}}}
 else{const big=e.type==='bigSlime'; // big slime (and its split halves): hops at you, squashes on landing
  if(e.onGround){e.y=gy;if(e.sq>0)e.sq-=dt;e.hop-=dt;
   if(e.hop<=0){const s=near?(Math.sign(dxp)||1):(rnd()<.5?-1:1);e.dir=s;e.vy=big?(near?-230:-150):-170;e.hx=s*d.spd*(near?1:.5);e.onGround=false}}
  else{e.vy+=620*dt;e.y+=e.vy*dt;e.x=clamp(e.x+e.hx*dt,lo,hi);e.moving=true;const g2=surfY(e.x);
   if(e.y>=g2&&e.vy>0){e.y=g2;e.vy=0;e.onGround=true;e.sq=.22;e.hop=(big?1.1:.7)+rnd()*.6;if(big){part(e.x,g2,'#b8f8d8',5,60,200,.35);if(adx<160)shake(.6)}}}}
 // touch: on foot / mounted, or the winged horse (+ Winged Cart) skimming the island
 if(e.tcd<=0&&airTouch(e,d)){e.tcd=1;if(P.fly)airHit(e,d);else{const h0=S.hp;hurtPlayer(d.dmg,e.x,true,e.type==='bigSlime'?'bonk':undefined);
   if(S.hp<h0&&e.type==='bigSlime'&&!mounted()){P.kbx=(P.x<e.x?-1:1)*190;if(P.onGround){P.vy=-120;P.onGround=false}}}}
 else if(e.tcd<=0&&P.fly&&cartTouch(e,d)){e.tcd=1;cartHit(e)}}
// ---- art ----
function drawIsleFoe(c,e,sx,sy,t){const dir=e.dir||1,fl=e.hitT>0,R=[],G=[];const Q=(xo,yo,w,h,col)=>R.push([dir>0?sx+xo:sx-xo-w,sy+yo,w,h,fl?'#ffffff':col]);
 const tt=t+(e.seed||0)*3;
 const dd=ENEMY[e.type];if(dd.cult||dd.bot){drawAuFoe(c,e,sx,sy,t);return}if(dd.uni){const el=dd.elite,B=el?'#241a30':'#3e2c52',B2=el?'#140e1c':'#2a1c3a',B3=el?'#3a2c4a':'#5a4672',M=el?'#e0a020':'#c0306a',M2=el?'#ffe060':'#ff5a8a',H=el?'#fff0b0':'#e8e0ff',HV='#1a1020';const ch=e.st==='charge',f=e.moving?Math.floor(tt*9)%4:0;
  const by=f===1||f===3?-1:0,sp=f===0?1:f===2?-1:0,lift=f===1?[1,0,0,1]:f===3?[0,1,1,0]:[0,0,0,0];
  [-7,-4,3,6].forEach((lx,k)=>{const x=lx+(k%2?-sp:sp)*(e.moving?1:0),l=lift[k];Q(x,-6+by,2,5-l-by,k===1||k===2?B2:B);Q(x,-1-l+by*0,2,1,HV)});
  const tw=Math.round(Math.sin(tt*5));Q(-11,-12+by+tw,3,2,M);Q(-12,-10+by+tw,2,4,M);Q(-11,-7+by+tw,1,2,M2);
  Q(-8,-12+by,16,6,B);Q(-7,-13+by,14,1,B);Q(-7,-12+by,12,1,B3);Q(-7,-7+by,14,1,B2);
  if(ch){Q(6,-13+by,4,5,B);Q(8,-13+by,6,4,B);Q(13,-11+by,1,2,B3);Q(10,-12+by,1,1,'#ff3a5a');Q(4,-15+by,3,6,M);Q(2,-14+by,2,3,M2);
   const p=1-clamp(e.sT/(e.tele||UNI.tele),0,1),hc=Math.sin(tt*30)>0?'#ffffff':'#ffb0ec';Q(14,-12+by,4,1,hc);Q(18,-12+by,1,1,'#ffffff');
   const gx=dir>0?sx+18:sx-19,gr=1+Math.round(p*3);G.push([gx-gr,sy-12+by-gr,gr*2+1,gr*2+1,'rgba(255,90,216,'+(.25+p*.35)+')']);G.push([gx-1,sy-13+by,3,3,'rgba(255,255,255,'+(.5+p*.5)+')'])}
  else{Q(5,-16+by,4,5,B);Q(6,-19+by,6,4,B);Q(11,-17+by,2,2,B3);Q(8,-18+by,1,1,'#ff3a5a');Q(4,-19+by,3,8,M);Q(3,-16+by,1,4,M2);Q(5,-20+by,2,1,M2);
   Q(10,-20+by,1,1,H);Q(11,-21+by,1,1,H);Q(12,-22+by,1,1,'#ffb0ec')}}
 else{const big=e.type==='bigSlime',W=big?24:11,H=big?18:9;const BD='#2fae7a',BD2='#1f7a52',BH='#6ee0a8',HI='#c8ffe0',CO='#3cc08a',EY='#0a2a18';
  let s;if(e.onGround){s=e.sq>0?.3*e.sq/.22:e.hop<.25?.22*(1-e.hop/.25):.04*Math.sin(tt*5)}else s=clamp((e.vy||0)/900,-.28,.12);
  const w=Math.max(6,Math.round(W*(1+s))),h=Math.max(4,Math.round(H*(1-s))),x0=-Math.floor(w/2);
  for(let i=0;i<w;i++){const u=(i+.5)/w*2-1,ch2=Math.max(2,Math.round(h*(.5+.5*Math.sqrt(Math.max(0,1-u*u)))));Q(x0+i,-ch2,1,ch2,BD);Q(x0+i,-ch2,1,1,BH);Q(x0+i,-1,1,1,BD2)}
  if(big){Q(x0+Math.round(w*.3),-Math.round(h*.55),Math.round(w*.4),Math.round(h*.35),CO);Q(x0+3,-h+3,3,2,HI);Q(x0+3,-h+5,1,1,HI)}else Q(x0+2,-h+2,2,1,HI);
  const ey=-Math.round(h*.62),ex=Math.round(w*.12)+(big?2:1);Q(ex-(big?6:3),ey,big?2:1,big?3:2,EY);Q(ex+1,ey,big?2:1,big?3:2,EY);if(big){Q(ex-7,ey-2,3,1,EY);Q(ex+1,ey-2,3,1,EY)}}
 for(const r of R)px(c,r[0],r[1],r[2],r[3],r[4]); // flat, no outline (World 1 conventions)
for(const g of G)px(c,g[0],g[1],g[2],g[3],g[4])}
function drawBolts(ox,oy){for(const b of UB){const tr=b.tr;for(let k=0;k<tr.length;k+=2){const a=1-k/tr.length;const w=a>.5?3:2;X.globalAlpha=a*.8;px(X,Math.round(tr[k]-ox)-1,Math.round(tr[k+1]-oy)-1,w,w,k%4?'#ff5ad8':'#ffb0ec')}X.globalAlpha=1;
  const x=Math.round(b.x-ox),y=Math.round(b.y-oy);px(X,x-5,y-3,10,7,'rgba(255,90,216,.3)');px(X,x-4,y-2,8,5,'rgba(255,120,224,.5)');px(X,x-3,y-1,6,3,'#ff7ad8');px(X,x-2,y-1,4,2,'#ffd0f4');px(X,x-1,y,2,1,'#ffffff')}}
function drawSkyProps(ox,oy){for(let i=0;i<SKYISLES.length;i++){const I=SKYISLES[i];if(I.x1<ox-20||I.x0>ox+VW+20)continue;
 for(let sx=Math.max(0,Math.ceil(I.x0-ox));sx<Math.min(VW,I.x1-ox);sx++){const wx=sx+ox;if(skyAt(wx)!==i)continue;const y=Math.round(surfY(wx)-oy),th=skyTh(wx,I),n=hash(wx*1.31),n2=hash(wx*.37+i);
  const au=auAt(I,wx);if(au){rb(0,'#e8843a',sx,y,1,2);rb(1,'#c0502a',sx,y+2,1,2);if(hash(wx*.73)>.7){rb(0,'#f0a040',sx,y+2,1,1);rb(1,'#a83a22',sx,y+4,1,1)}}
  else if(I.top||I.au){rb(0,'#c8a8f0',sx,y,1,2);rb(1,'#9a7ad0',sx,y+2,1,2);if(hash(wx*.73)>.7){rb(0,'#c8a8f0',sx,y+2,1,1);rb(1,'#9a7ad0',sx,y+4,1,1)}}
  if(n>.8){const l=3+Math.floor(hash(wx*2.7)*10);rb(2,'#a89878',sx,y+th,1,l);rb(3,'#8a7a5a',sx+(l>7?1:0),y+th+l,1,2)}
  else if(n2>.955){const l=3+Math.floor(hash(wx*3.3)*6),cc=au?'#f0a040':I.top||I.au?'#e8c8ff':'#7de0ff';rb(4,cc,sx,y+th-2,2,l);rb(5,'#ffffff',sx,y+th-1,1,Math.max(1,l-3))}
  const sl=surfY(wx+2)-surfY(wx-2);if(Math.abs(sl)>3){rb(2,au?'#a8704a':I.top||I.au?'#d4bea4':'#c8b896',sx,y+2,1,4);rb(3,'#a89878',sx,y+6,1,2)} // ledge face
  if(n2<.05)rb(6,au?'#ffe070':I.top?'#ffd0a0':'#ffc8ec',sx,y-2,1,1);else if(n2<.13){rb(I.top?1:7,au?'#a83a22':I.top||I.au?'#9a7ad0':'#3ab8a8',sx,y-2,1,2)}}
 rbFlush(X);drawTreeList(isleTrees(i),ox,oy);drawIsleProps(i,ox,oy);if(I.au)drawAuSet(i,ox,oy);drawRw(i,ox,oy)}}
// bigger props on the sky islands (decor only, nothing is solid): crystal clusters, boulders, bushes, flowers, grass tufts, long hanging roots
const SKYPROP=[];
function isleProps(i){if(SKYPROP[i])return SKYPROP[i];const I=SKYISLES[i],L=[],rx=rwX(i);let x=I.x0+22,k=0;
 while(x<I.x1-22){const h=hash(k*7.13+i*31.7);if(Math.abs(x-rx)>18){const t=h<.2?0:h<.34?1:h<.56?2:h<.72?3:h<.86?5:4;L.push({x:Math.round(x),t,s:hash(k*3.9+i),r:hash(k*1.7+i*5)})}
  x+=18+Math.round(hash(k*2.31+i)*30);k++}
 return SKYPROP[i]=L}
const AUC=['#f0a040','#ffe0a0','#c06a20'],AUG=['#c0502a','#e8843a','#8a3a1a'];
// autumn colouring for an island column/prop: au:1 all autumn, au:2 (next to Sunspire) lilac fading into autumn towards the east (same rule as the trees)
function auAt(I,x){return !!I.au&&!(I.au===2&&hash(x*.37)>(x-I.x0)/(I.x1-I.x0)*1.6)}
function drawIsleProps(i,ox,oy){const I=SKYISLES[i],lil0=I.top||!!I.au,C0=lil0?['#e8c8ff','#ffffff','#b890e8']:['#7de0ff','#c8f6ff','#4ab0d0'],G0=lil0?['#9a7ad0','#c8a8f0','#7a5ab0']:['#3ab8a8','#5ee0c8','#2a9888'];
 for(const p of isleProps(i)){const A=auAt(I,p.x),lil=lil0&&!A,C=A?AUC:C0,G=A?AUG:G0;const x=Math.round(p.x-ox);if(x<-16||x>VW+16)continue;const y=Math.round(surfY(p.x)-oy),F=(a,b,w,h,c)=>px(X,x+a,y+b,w,h,c);
  if(p.t===0){const n=2+Math.floor(p.s*3);for(let j=0;j<n;j++){const hx=(j-(n-1)/2)*3|0,hh=5+Math.round(hash(p.x+j)*(p.s>.7?12:7))-Math.abs(hx);F(hx,-hh,2,hh+1,j%2?C[2]:C[0]);F(hx,-hh,1,Math.max(1,hh-2),C[1])}}
  else if(p.t===1){const w=5+Math.round(p.s*5);F(-(w>>1),-4,w,5,'#b8a888');F(-(w>>1)+1,-5,w-2,1,'#d8ccb0');F(-(w>>1),0,w,1,'#8a7a5a');F((w>>1)-2,-3,1,3,'#9a8a6a')}
  else if(p.t===2){F(-4,-4,4,4,G[0]);F(-1,-6,5,6,G[1]);F(2,-4,4,4,G[0]);F(0,-5,2,1,'#ffffff');F(-4,-1,10,1,G[2]);if(p.r>.5)F(1,-3,1,1,lil?'#ffd0a0':'#ffc8ec')}
  else if(p.t===3){const c=p.r<.5?(lil?'#ffd0a0':'#ffc8ec'):'#fff0a0';for(let j=-2;j<=2;j+=2){F(j,-3-(j&2?1:0),1,3,G[2]);F(j,-4-(j&2?1:0),1,1,c)}}
  else if(p.t===5){for(let j=-2;j<=2;j++)F(j,-2-((j+2)%3),1,2+((j+2)%3),j%2?G[0]:G[1])}
  if(p.t!==4&&p.r>.4){const th=skyTh(p.x+7,I),l=5+Math.round(p.r*10);for(let j=0;j<l;j++)F(7+Math.round(Math.sin(j/3+p.s*6)),th+j,1,1,j>l-3?'#8a7a5a':'#a89878')}
  if(p.t===4){const th=skyTh(p.x,I),l=8+Math.round(p.s*16);for(let j=0;j<l;j++)F(Math.round(Math.sin(j/4+p.r*6)*1.2),th+j,1,1,j>l-3?'#8a7a5a':'#a89878');
   if(p.r>.6){const yy=th+l;F(-1,yy,3,3,C[2]);F(0,yy,1,2,C[0])}}}}
function drawRw(i,ox,oy){const I=SKYISLES[i],wx=rwX(i),x=Math.round(wx-ox),y=Math.round(surfY(wx)-oy),ok=rwReady(i);if(x<-20||x>VW+20)return;
 const O=(a,b,w,h,col)=>{px(X,x+a-1,y+b-1,w+2,h+2,'#1a1020')},F=(a,b,w,h,col)=>px(X,x+a,y+b,w,h,col);
 if(I.rw==='chest'){if(ok){O(-6,-8,12,8);F(-6,-8,12,8,'#8b5a2b');F(-6,-8,12,2,'#a8743c');F(-6,-5,12,1,'#ffd040');F(-1,-5,2,3,'#ffe88a');F(-6,-1,12,1,'#5e3a1e')}
  else{O(-6,-12,12,3);O(-6,-6,12,6);F(-6,-12,12,3,'#a8743c');F(-6,-6,12,6,'#8b5a2b');F(-5,-6,10,1,'#3a2414');F(-6,-4,12,1,'#ffd040')}}
 else if(I.rw==='leaf'){F(0,-4,1,4,'#6a4230');if(ok){for(const r of [[-6,-9,5,4],[-2,-12,5,5],[2,-9,5,4]])O(r[0],r[1],r[2],r[3]);F(-6,-9,5,4,'#c0502a');F(-2,-12,5,5,'#e8843a');F(2,-9,5,4,'#a83a22');F(-5,-6,11,1,'#8a3a1a');F(-1,-11,2,1,'#ffe070');F(3,-8,1,1,'#f0a040')}
  else{F(-2,-3,2,1,'#8a3a1a');F(1,-4,2,1,'#a83a22')}}
 else{F(0,-5,1,5,'#c8b090');if(ok){for(const r of [[-6,-10,5,4],[-2,-13,5,5],[2,-10,5,4]])O(r[0],r[1],r[2],r[3]);F(-6,-10,5,4,'#ffffff');F(-2,-13,5,5,'#ffffff');F(2,-10,5,4,'#e8f4ff');F(-5,-7,11,1,'#dce8f6');F(-1,-12,2,1,'#ffffff')}
  else{F(-2,-3,2,1,'#3ab8a8');F(1,-4,2,1,'#3ab8a8')}}
 if(ok&&Math.sin(menuT*3+i)>.75){const k=Math.floor(menuT*3+i)%3;px(X,x-4+k*4,y-15-k*2,1,1,'#ffffff')}}
// storm mood: 0..1 by how far the player is from a storm island's no-fly core (1 inside, smooth fade over STORMFADE px outside)
const STORMFADE=170,STORMCY=232; // STORMCY: cloud base above the island top, as high as the regular rain clouds sit (visual only: the no-fly zone is stormAt, x only)
function stormF(){if(!P)return 0;let f=0;for(const I of SKYISLES){if(!I.storm)continue;const a0=I.x0+STORMIN,a1=I.x1-STORMIN,d=P.x<a0?a0-P.x:P.x>a1?P.x-a1:0;f=Math.max(f,clamp(1-d/STORMFADE,0,1))}return f*f*(3-2*f)}
function stormFlash(I){return hash(Math.floor(menuT*2.5)+I.x0)>.95&&Math.sin(menuT*40)>0}
// drawn before the actors: desaturate + dark blue-grey over sky, background and island (player and foes stay readable)
function stormShade(){const f=stormF();if(f<=0)return;X.globalCompositeOperation='saturation';X.globalAlpha=.48*f;X.fillStyle='#808080';X.fillRect(0,0,VW,VH);
 X.globalCompositeOperation='source-over';X.globalAlpha=1;X.fillStyle='rgba(26,32,54,'+(.36*f).toFixed(3)+')';X.fillRect(0,0,VW,VH)}
function drawStorms(ox,oy){const F=stormF();for(const I of SKYISLES){if(!I.storm)continue;const a0=I.x0+STORMIN,a1=I.x1-STORMIN,c0=I.x0-14,c1=I.x1+14;const a=Math.max(0,Math.round(c0-ox)),b=Math.min(VW,Math.round(c1-ox));if(b<=a)continue; // cloud: the whole island; rain + no-fly: the core
 const cy=Math.max(14,Math.round(-I.h-STORMCY-oy)), // short (landscape) screens: keep the cloud base just in view at the top
  fl=stormFlash(I);
 wxTint({x0:c0,x1:c1},ox,a,b-a,'40,52,84',.22);
 for(let sx=a;sx<b;sx+=2){const wx=sx+ox,e=clamp(Math.min(wx-c0,c1-wx)/44,0,1),h=Math.round((30+12*Math.abs(Math.sin(wx/19))+6*Math.sin(wx/7))*e);if(h<2)continue;const t0=Math.max(0,cy-Math.round((22+12*Math.abs(Math.sin(wx/23))+6*Math.sin(wx/9))*e));if(cy+h<0)continue;
  rb(0,fl?'#8a98b4':'#465068',sx,t0,2,cy+h-t0);rb(1,fl?'#b8c6e0':'#5e6a84',sx,cy+h-3,2,3);if(hash(wx*.9)>.6)rb(2,'#363e54',sx,t0+Math.round(6*hash(wx*.31)),2,2);if(hash(wx*.47)>.7)rb(2,'#363e54',sx,cy+h-6,2,2)}rbFlush(X);
 // heavy slanted rain under the core (wind from the right: 1px left per 3px down)
 X.fillStyle='#c8daf4';const n=Math.round((a1-a0)/.8);for(let k=0;k<n;k++){const s=hash(k*3.1+I.x0),wd=a1-a0,g0=cy+26;
  const sp=1+s*.4,ry0=(hash(k*5.3)*400+menuT*250*sp)%400,wx=a0+((s*977-ry0/3)%wd+wd)%wd,sx=Math.round(wx-ox);if(sx<a||sx>=b)continue;
  const g=Math.round(surfY(wx)-oy),hh=g-g0;if(hh<=4)continue;const ry=g0+ry0*hh/400,eA=clamp(Math.min(wx-a0,a1-wx)/30,0,1);
  X.globalAlpha=.35+.6*eA;const y=Math.round(ry);X.fillRect(sx,y,1,3);X.fillRect(sx-1,y+3,1,3);if(ry>g-7)X.fillRect(sx-2,g-1,3,1)}X.globalAlpha=1;
 // lightning: a jagged pixel bolt from the cloud base to the island, plus a faint screen flicker while you are in or near the storm
 if(fl){const k=Math.floor(menuT*2.5),bx=a0+hash(k*1.7+I.x0)*(a1-a0),g=Math.round(surfY(bx)-oy);let x=Math.round(bx-ox),y=cy+30;
  if(x>-20&&x<VW+20){while(y<g){const st=4+Math.round(hash(y*.37+k)*5),dx=Math.round((hash(y*.71+k*3)-.5)*6);px(X,x-1,y,3,st,'#a8c0ff');px(X,x,y,1,st,'#ffffff');y+=st;x+=dx}}
  if(F>0){X.fillStyle='rgba(210,222,255,'+(.16*F).toFixed(3)+')';X.fillRect(0,0,VW,VH)}}}}
