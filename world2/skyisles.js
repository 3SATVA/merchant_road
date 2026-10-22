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
function skyTh(x,I){const w=I.x1-I.x0,ed=Math.min(x-I.x0,I.x1-x);return Math.round(7+w*.2*Math.sqrt(clamp(ed/(w*.5),0,1))+4*hash(Math.floor(x/3)))}
function isleFoe(t,i,x){const e=spawnEnemy(t,x);e.isl=i;e.y=surfY(x);e.dir=rnd()<.5?-1:1;e.st='idle';e.sT=.4+rnd()*.6;e.tx=x;e.cd=1+rnd();e.tcd=0;e.onGround=true;e.vy=0;e.hx=0;e.hop=.5+rnd()*.8;e.sq=0;SKYST.foes.push(e);return e}
function isleDeath(e){const y=e.y-ENEMY[e.type].h/2;
 const d=ENEMY[e.type];if(d.gem&&rnd()<d.gem*DROPMUL)dropUnit({item:7,origin:6,paid:0},e.x,e.y-10); // Sky Crystal
 if(d.uni){part(e.x,y,d.elite?'#ffd040':'#ff7ad8',10,120,40,.5);part(e.x,y,d.elite?'#1a1020':'#3e2c52',8,90,80,.5)}
 else{part(e.x,y,'#b8f8d8',8,110,200,.45);if(e.type==='bigSlime'&&SKYST.act[e.isl]){const I=SKYISLES[e.isl];for(const s of [-1,1]){const k=isleFoe('isleSlime',e.isl,clamp(e.x+s*8,I.x0+10,I.x1-10));k.onGround=false;k.y=e.y-6;k.vy=-170;k.hx=s*70;k.dir=s;k.hop=.5}}}}
function stormDrop(){part(P.x,P.y-20,'#c4d8f2',8,80,120,.5);if(!skyS().st){S.sky.st=1;toast(ico('wing',2)+' '+ico('x',2)+'<br>Storm cloud: land and cross on foot<br><small>take off again past its edge</small>',3200)}}
function takeRw(i){const I=SKYISLES[i],x=rwX(i),y=surfY(x);let h='';
 if(I.rw==='chest'){const c=SKYI.chest[0]+Math.floor(rnd()*(SKYI.chest[1]-SKYI.chest[0]+1));S.money+=c;ftxt(x,y-22,'+$'+c,'#ffd75e');h='<span class="gold">+'+pr(c)+'</span>';
  const q=Math.min(SKYI.silk,cap()-cargoCount());if(q>0){addCargo(9,7,q,0);h+=' '+iconImg(ICONURL.starsilk)+' +'+q}part(x,y-8,'#ffe08a',12,110,120,.6)}
 else{const it=I.rw==='wool'?6:7,n=I.rw==='wool'?SKYI.wool:SKYI.crystal,q=Math.min(n,cap()-cargoCount());
  if(q<=0){if(!SKYST.full[i]){SKYST.full[i]=1;toast(ico('pack',2)+' '+ico('x',2),1200)}return}
  addCargo(it,6,q,0);h=iconImg(ICONURL[ITEMS[it].id])+' +'+q;ftxt(x,y-20,'+'+q,'#7de07a');part(x,y-8,I.rw==='wool'?'#ffffff':'#a8f0ff',10,90,100,.5)}
 skyS().r[i]=S.time;toast(h,1600);save()}
function skyTick(dt){if(WI!==1||DG||!P)return;
 if(horsePlod()&&Math.abs(P.hv||0)>8&&!skyS().ld){S.sky.ld=1;toast(ico('wing',2)+' Your sky horse is slow on land<br><small>hop off and walk; whistle it back to fly</small>',2800)} // once per save
 if(SKYST.ref!==ENEMIES){SKYST.ref=ENEMIES;SKYST.act=[];SKYST.foes=[];UB.length=0} // ENEMIES was reset (death, menu, travel)
 for(let i=0;i<SKYISLES.length;i++){const I=SKYISLES[i],dd=P.x<I.x0?I.x0-P.x:P.x>I.x1?P.x-I.x1:0;
  if(!SKYST.act[i]&&dd<VW/2+70){SKYST.act[i]=1;const n=I.foes.length;I.foes.forEach((t,k)=>isleFoe(t,i,Math.round(I.x0+(I.x1-I.x0)*(k+1)/(n+1))))}
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
  if(hit){b.life=0;part(b.x,b.y,'#ff7ad8',6,90,60,.35);if(P.fly)airHit(bb,{dmg:UNI.bolt,hull:UNI.hull});else hurtPlayer(UNI.bolt,b.x)}
  else if(P.fly&&cartTouch(bb,BD)){b.life=0;part(b.x,b.y,'#ff7ad8',6,90,60,.35);cartHit(bb)}}
 for(let i=UB.length-1;i>=0;i--)if(UB[i].life<=0)UB.splice(i,1)}
function uniFire(e){const dir=e.dir,hx=e.x+dir*17,hy=e.y-12;let a=Math.atan2(e.ay,Math.abs(e.ax)||1);if(Math.abs(e.ay)<16)a=0;a=clamp(a,-UNI.ang,UNI.ang);
 UB.push({x:hx,y:hy,vx:Math.cos(a)*UNI.spd*dir,vy:Math.sin(a)*UNI.spd,life:UNI.life,tr:[]});part(hx,hy,'#ff7ad8',6,70,0,.3);
 if(--e.bn>0){e.st='charge';e.sT=e.tele=UNI.gap;return} // burst: same aim, short re-glow between bolts
 e.st='cool';e.sT=.35;e.cd=UNI.cd+rnd()*UNI.cdR;e.vx-=dir*30}
function updIsle(e,dt,d){const I=SKYISLES[e.isl];if(!I){e.dead=1;return}const lo=I.x0+8,hi=I.x1-8;
 e.x=clamp(e.x+e.vx*dt,lo,hi);e.vx*=Math.pow(.02,dt);if(e.tcd>0)e.tcd-=dt;e.moving=false;
 const gy=surfY(e.x),dxp=P.x-e.x,adx=Math.abs(dxp),near=adx<240&&P.y>gy-150&&P.y<gy+40;
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
 const dd=ENEMY[e.type];if(dd.uni){const el=dd.elite,B=el?'#241a30':'#3e2c52',B2=el?'#140e1c':'#2a1c3a',B3=el?'#3a2c4a':'#5a4672',M=el?'#e0a020':'#c0306a',M2=el?'#ffe060':'#ff5a8a',H=el?'#fff0b0':'#e8e0ff',HV='#1a1020';const ch=e.st==='charge',f=e.moving?Math.floor(tt*9)%4:0;
  const by=f===1||f===3?-1:0,sp=f===0?1:f===2?-1:0,lift=f===1?[1,0,0,1]:f===3?[0,1,1,0]:[0,0,0,0];
  [-7,-4,3,6].forEach((lx,k)=>{const x=lx+(k%2?-sp:sp)*(e.moving?1:0),l=lift[k];Q(x,-6+by,2,5-l,k===1||k===2?B2:B);Q(x,-1-l+by*0,2,1,HV)});
  const tw=Math.round(Math.sin(tt*5));Q(-11,-12+by+tw,3,2,M);Q(-12,-10+by+tw,2,4,M);Q(-11,-7+by+tw,1,2,M2);
  Q(-8,-12+by,16,6,B);Q(-7,-13+by,14,1,B);Q(-7,-12+by,12,1,B3);Q(-7,-7+by,14,1,B2);
  if(ch){Q(6,-13+by,4,5,B);Q(8,-13+by,6,4,B);Q(13,-11+by,1,2,B3);Q(10,-12+by,1,1,'#ff3a5a');Q(4,-15+by,3,6,M);Q(2,-14+by,2,3,M2);
   const p=1-clamp(e.sT/(e.tele||UNI.tele),0,1),hc=Math.sin(tt*30)>0?'#ffffff':'#ffb0ec';Q(14,-12+by,4,1,hc);Q(18,-12+by,1,1,'#ffffff');
   const gx=dir>0?sx+18:sx-19,gr=1+Math.round(p*3);G.push([gx-gr,sy-12+by-gr,gr*2+1,gr*2+1,'rgba(255,90,216,'+(.25+p*.35)+')']);G.push([gx-1,sy-13+by,3,3,'rgba(255,255,255,'+(.5+p*.5)+')'])}
  else{Q(5,-16+by,4,5,B);Q(6,-19+by,6,4,B);Q(11,-17+by,2,2,B3);Q(8,-18+by,1,1,'#ff3a5a');Q(4,-19+by,3,8,M);Q(3,-16+by,1,4,M2);Q(5,-20+by,2,1,M2);
   Q(10,-20+by,1,1,H);Q(11,-21+by,1,1,H);Q(12,-22+by,1,1,'#ffb0ec')}}
 else{const big=e.type==='bigSlime',W=big?24:11,H=big?18:9;const BD='#5ed49a',BD2='#34a878',HI='#d4fff0',CO='#46bc86',EY='#0e2a1e';
  let s;if(e.onGround){s=e.sq>0?.3*e.sq/.22:e.hop<.25?.22*(1-e.hop/.25):.04*Math.sin(tt*5)}else s=clamp((e.vy||0)/900,-.28,.12);
  const w=Math.max(6,Math.round(W*(1+s))),h=Math.max(4,Math.round(H*(1-s))),x0=-Math.floor(w/2);
  for(let i=0;i<w;i++){const u=(i+.5)/w*2-1,ch2=Math.max(2,Math.round(h*(.5+.5*Math.sqrt(Math.max(0,1-u*u)))));Q(x0+i,-ch2,1,ch2,BD);Q(x0+i,-2,1,2,BD2)}
  if(big){Q(x0+Math.round(w*.3),-Math.round(h*.55),Math.round(w*.4),Math.round(h*.35),CO);Q(x0+3,-h+3,3,2,HI);Q(x0+3,-h+5,1,1,HI)}else Q(x0+2,-h+2,2,1,HI);
  const ey=-Math.round(h*.62),ex=Math.round(w*.12)+(big?2:1);Q(ex-(big?6:3),ey,big?2:1,big?3:2,EY);Q(ex+1,ey,big?2:1,big?3:2,EY);if(big){Q(ex-7,ey-2,3,1,EY);Q(ex+1,ey-2,3,1,EY)}}
 for(const r of R)px(c,r[0]-1,r[1]-1,r[2]+2,r[3]+2,'#1a1020');for(const r of R)px(c,r[0],r[1],r[2],r[3],r[4]);for(const g of G)px(c,g[0],g[1],g[2],g[3],g[4])}
function drawBolts(ox,oy){for(const b of UB){const tr=b.tr;for(let k=0;k<tr.length;k+=2){const a=1-k/tr.length;const w=a>.5?3:2;X.globalAlpha=a*.8;px(X,Math.round(tr[k]-ox)-1,Math.round(tr[k+1]-oy)-1,w,w,k%4?'#ff5ad8':'#ffb0ec')}X.globalAlpha=1;
  const x=Math.round(b.x-ox),y=Math.round(b.y-oy);px(X,x-5,y-3,10,7,'rgba(255,90,216,.3)');px(X,x-4,y-2,8,5,'rgba(255,120,224,.5)');px(X,x-3,y-1,6,3,'#ff7ad8');px(X,x-2,y-1,4,2,'#ffd0f4');px(X,x-1,y,2,1,'#ffffff')}}
function drawSkyProps(ox,oy){for(let i=0;i<SKYISLES.length;i++){const I=SKYISLES[i];if(I.x1<ox-20||I.x0>ox+VW+20)continue;
 for(let sx=Math.max(0,Math.ceil(I.x0-ox));sx<Math.min(VW,I.x1-ox);sx++){const wx=sx+ox;if(skyAt(wx)!==i)continue;const y=Math.round(surfY(wx)-oy),th=skyTh(wx,I),n=hash(wx*1.31),n2=hash(wx*.37+i);
  if(I.top){rb(0,'#c8a8f0',sx,y,1,2);rb(1,'#9a7ad0',sx,y+2,1,2);if(hash(wx*.73)>.7){rb(0,'#c8a8f0',sx,y+2,1,1);rb(1,'#9a7ad0',sx,y+4,1,1)}}
  if(n>.8){const l=3+Math.floor(hash(wx*2.7)*10);rb(2,'#a89878',sx,y+th,1,l);rb(3,'#8a7a5a',sx+(l>7?1:0),y+th+l,1,2)}
  else if(n2>.955){const l=3+Math.floor(hash(wx*3.3)*6),cc=I.top?'#e8c8ff':'#7de0ff';rb(4,cc,sx,y+th-2,2,l);rb(5,'#ffffff',sx,y+th-1,1,Math.max(1,l-3))}
  if(n2<.05)rb(6,I.top?'#ffd0a0':'#ffc8ec',sx,y-2,1,1);else if(n2<.13){rb(I.top?1:7,I.top?'#9a7ad0':'#3ab8a8',sx,y-2,1,2)}}
 rbFlush(X);drawRw(i,ox,oy)}}
function drawRw(i,ox,oy){const I=SKYISLES[i],wx=rwX(i),x=Math.round(wx-ox),y=Math.round(surfY(wx)-oy),ok=rwReady(i);if(x<-20||x>VW+20)return;
 const O=(a,b,w,h,col)=>{px(X,x+a-1,y+b-1,w+2,h+2,'#1a1020')},F=(a,b,w,h,col)=>px(X,x+a,y+b,w,h,col);
 if(I.rw==='chest'){if(ok){O(-6,-8,12,8);F(-6,-8,12,8,'#8b5a2b');F(-6,-8,12,2,'#a8743c');F(-6,-5,12,1,'#ffd040');F(-1,-5,2,3,'#ffe88a');F(-6,-1,12,1,'#5e3a1e')}
  else{O(-6,-12,12,3);O(-6,-6,12,6);F(-6,-12,12,3,'#a8743c');F(-6,-6,12,6,'#8b5a2b');F(-5,-6,10,1,'#3a2414');F(-6,-4,12,1,'#ffd040')}}
 else if(I.rw==='wool'){F(0,-5,1,5,'#c8b090');if(ok){for(const r of [[-6,-10,5,4],[-2,-13,5,5],[2,-10,5,4]])O(r[0],r[1],r[2],r[3]);F(-6,-10,5,4,'#ffffff');F(-2,-13,5,5,'#ffffff');F(2,-10,5,4,'#e8f4ff');F(-5,-7,11,1,'#dce8f6');F(-1,-12,2,1,'#ffffff')}
  else{F(-2,-3,2,1,'#3ab8a8');F(1,-4,2,1,'#3ab8a8')}}
 else{if(ok){for(const r of [[-4,-7,2,7],[-1,-11,3,11],[2,-6,2,6]])O(r[0],r[1],r[2],r[3]);F(-4,-7,2,7,'#7de0ff');F(-1,-11,3,11,'#a8f0ff');F(2,-6,2,6,'#7ac8e8');F(0,-10,1,4,'#ffffff')}
  else{F(-4,-2,2,2,'#7ac8e8');F(-1,-3,3,3,'#7ac8e8');F(2,-2,2,2,'#7ac8e8')}}
 if(ok&&Math.sin(menuT*3+i)>.75){const k=Math.floor(menuT*3+i)%3;px(X,x-4+k*4,y-15-k*2,1,1,'#ffffff')}}
function drawStorms(ox,oy){for(const I of SKYISLES){if(!I.storm)continue;const a0=I.x0+STORMIN,a1=I.x1-STORMIN;const a=Math.max(0,Math.round(a0-20-ox)),b=Math.min(VW,Math.round(a1+20-ox));if(b<=a)continue;
 const cy=Math.round(-I.h-118-oy),fl=hash(Math.floor(menuT*2.5)+I.x0)>.95&&Math.sin(menuT*40)>0;
 wxTint({x0:a0-20,x1:a1+20},ox,a,b-a,'40,52,84',.22);
 for(let sx=a;sx<b;sx+=2){const wx=sx+ox,e=clamp(Math.min(wx-(a0-20),(a1+20)-wx)/44,0,1),h=Math.round((24+10*Math.abs(Math.sin(wx/19))+6*Math.sin(wx/7))*e);if(h<2)continue;const t0=Math.max(0,cy-Math.round(18*e));if(cy+h<0)continue;
  rb(0,fl?'#9aa8c0':'#5a6680',sx,t0,2,cy+h-t0);rb(1,fl?'#c8d4e8':'#7a88a0',sx,cy+h-3,2,3);if(hash(wx*.9)>.6)rb(2,'#4a5470',sx,t0,2,2)}rbFlush(X);
 X.fillStyle='#d0e2fa';const n=Math.round((b-a)/1.3);for(let k=0;k<n;k++){const s=hash(k*3.1+I.x0),wd=a1-a0,wx=a0+((s*977+menuT*24)%wd+wd)%wd,sx=Math.round(wx-ox);if(sx<a||sx>=b)continue;
  const g=Math.round(surfY(wx)-oy),top=cy+24,hh=g-top;if(hh<=4)continue;const ry=top+((hash(k*5.3)*hh+menuT*240*(1+s*.4))%hh),eA=clamp(Math.min(wx-a0,a1-wx)/30,0,1);
  X.globalAlpha=.3+.6*eA;X.fillRect(sx,Math.round(ry),1,5);if(ry>g-6)X.fillRect(sx-1,g-1,3,1)}X.globalAlpha=1}}
