'use strict';
function golemPal(type){return type==='scrapGolem'?['#8a5a3a','#5a3a2a','#7de0ff','#b07a4a']:type==='iceGolem'?['#9cc8e8','#5f8fb8','#e8ffff','#c8e8ff']:type==='lavaGolem'?['#4a3030','#2a1a1a','#ffd040','#ff6a1a']:['#8a8a8a','#5e5e5e','#ffcc33','#a8a8a8']}
function drawEnemy(c,e,sx,sy,t){if(ENEMY[e.type].air){drawAir(c,e,sx,sy,t);return}
 const dir=e.dir,fl=e.hitT>0;const P=(xo,yo,w,h,col)=>{px(c,dir>0?sx+xo:sx-xo-w,sy+yo,w,h,fl?'#ffffff':col)};
 const base=ENEMY[e.type].base||e.type;
 if(base==='slime'){const sq=e.onGround?(Math.sin(t*6+e.seed)>.6?1:0):-1;const K=e.type==='cinderSlime';
  P(-5,-7+sq,10,7-sq,K?'#3a3434':'#3a9f30');P(-4,-8+sq,8,1,K?'#3a3434':'#3a9f30');P(-4,-7+sq,8,1,K?'#5e5450':'#7ae06a');P(-3,-6+sq,2,1,K?'#8a807a':'#c8ffc0');P(1,-5+sq,1,2,K?'#ffb040':'#0a2a08');P(3,-5+sq,1,2,K?'#ffb040':'#0a2a08');P(-5,-1,10,1,K?'#221c1c':'#24701c');
  if(K){const g=Math.sin(t*5+e.seed)>0?'#ff7a1a':'#d8501a';P(-3,-3,2,1,g);P(2,-2,2,1,g);P(-1,-4+sq,1,2,g)}}
 else if(base==='goblin'){const snow=e.type==='goblinS',ash=e.type==='raider';const sk=snow?'#7ab0a0':ash?'#9a8c7c':'#6aa84f';const ph=Math.sin(t*16+e.seed);const la=e.moving?Math.round(ph):0;
  P(-3+la,-4,2,4,'#4a3020');P(1-la,-4,2,4,'#4a3020');P(-3,-9,6,5,snow?'#e8e8f0':'#7a5a2a');P(-3,-5,6,1,'#4a3020');
  P(-3,-13,6,4,sk);P(3,-12,2,1,sk);P(-5,-12,2,1,sk);P(1,-12,1,1,'#ff3030');P(-1,-12,1,1,'#ff3030');P(-1,-10,3,1,'#2a3a1a');
  if(snow)P(-3,-14,6,1,'#c83a3a');
  if(ash){P(-3,-9,6,4,'#3e3638');P(-4,-14,8,2,'#5a2626');P(-4,-12,1,3,'#5a2626');P(-3,-10,6,1,'#7a3030')}
  if(e.loot.length){P(-7,-11,4,5,'#b08a50');P(-6,-12,2,1,'#806030')}else{P(4,-9,1,4,'#c8d0dc');P(3,-6,3,1,'#5a3818')}}
 else if(base==='golem'){const p=golemPal(e.type);const ph=Math.sin(t*5+e.seed);const la=e.moving?Math.round(ph):0;const L=e.type==='lavaGolem'?1:0;
  P(-7+la,-7,5,7,p[1]);P(2-la,-7,5,7,p[1]);P(-9,-21-L,18,14+L,p[0]);P(-9,-21-L,18,2,p[3]);P(-9,-9,18,2,p[1]);
  if(L){P(-5,-18,2,6,p[3]);P(2,-16,4,1,p[3]);P(4,-15,1,4,p[3]);P(-7,-12,3,1,p[3])}else{P(-6,-17,3,2,p[1]);P(3,-13,4,2,p[1])}
  P(-5,-27-L,10,7,p[0]);P(-5,-27-L,10,1,p[3]);P(0,-25-L,2,2,p[2]);P(3,-25-L,2,2,p[2]);
  let ax=0;if(e.state==='wind')ax=-3;else if(e.state==='punch')ax=7;
  P(-13,-20,4,12,p[1]);P(9+ax,-20+(e.state==='punch'?4:0),5,ax>0?6:12,p[0]);if(ax>0)P(14+ax-5,-16,4,6,p[3])}
 else if(base==='witch'){const V=e.type==='witchV';const rb=V?'#8a2a3a':'#5a2f7a',rb2=V?'#6a1a2a':'#3e1f58';
  P(-8,-1,16,1,'#6a4420');P(5,-2,4,3,'#c8a060');
  P(-4,-11,8,10,rb);P(-5,-3,10,2,rb2);P(-3,-15,6,4,'#9acd7a');P(1,-13,1,1,'#ff3030');P(3,-12,1,2,'#7aa05a');
  P(-6,-16,12,1,'#2a1a3a');P(-3,-19,6,3,'#2a1a3a');P(-2,-21,4,2,'#2a1a3a');P(0,-23,2,2,'#2a1a3a');P(-3,-17,6,1,V?'#ff8030':'#c060ff');
  if(e.cast>0){P(5,-10,3,3,V?'#ff8030':'#d080ff');P(6,-9,1,1,'#ffffff')}else P(4,-9,2,2,'#9acd7a')}
 if(e.hp<e.max){px(c,sx-8,sy-ENEMY[e.type].h-8,16,2,'#000');px(c,sx-8,sy-ENEMY[e.type].h-8,Math.max(1,Math.round(16*e.hp/e.max)),2,'#e84a4a')}
}
function updEnemy(e,dt){const d=ENEMY[e.type],base=d.base||e.type;
 if(e.frz>0){e.frz-=dt;dt*=.45;if(rnd()<.15)PARTS.push({x:e.x+(rnd()-.5)*d.w,y:e.y-rnd()*d.h,vx:0,vy:12,col:rnd()<.5?'#e8f8ff':'#7ad0ff',g:0,life:.4})}
 if(e.psn>0){e.psn-=dt;e.hp-=(e.psnD||4)*dt;if(rnd()<.3)PARTS.push({x:e.x+(rnd()-.5)*d.w,y:e.y-rnd()*d.h*.8,vx:0,vy:-14,col:rnd()<.5?'#6cd04a':'#3a8a2a',g:0,life:.45});if(e.hp<=0){killEnemy(e);return}}
 e.t+=dt;if(e.hitT>0)e.hitT-=dt;
 if(e.burn>0){e.burn-=dt;e.hp-=(e.burnD||6)*dt;if(rnd()<.35)PARTS.push({x:e.x+(rnd()-.5)*d.w,y:e.y-rnd()*d.h,vx:0,vy:-30,col:rnd()<.5?'#ff7a1a':'#ffd040',g:0,life:.3});if(e.hp<=0){killEnemy(e);return}}
 if(d.air){updAir(e,dt,d);return}
 const dxp=P.x-e.x,adx=Math.abs(dxp);const town=townAt(e.x,TOWNR+10);
 if(DG){if(adx>VW*.62)return}else if(adx>VW*1.3){e.dead=1;return}
 const gY=x=>e.plat?e.plat.y:surfY(x);
 const near=adx<d.w/2+5&&P.y>e.y-d.h-2&&P.y-16<e.y;
 const walkTo=(dir,spd)=>{e.dir=dir;const nx=e.x+dir*spd*dt;
  if(base==='goblin'&&!(e.air>0)){const g=ENEMIES.find(g=>!g.dead&&g!==e&&isGolem(g.type)&&g.plat===e.plat&&Math.sign(g.x-e.x)===dir&&Math.abs(nx-g.x)<ENEMY[g.type].w/2+4);
   if(g){if(!(e.jcd>0)&&!(g.plat&&(g.x+dir*24<g.plat.x0+4||g.x+dir*24>g.plat.x1-4))){e.air=.01;e.avy=290;e.jcd=1.4}else return false}}if(e.plat&&(nx<e.plat.x0+5||nx>e.plat.x1-5))return false;if(townAt(nx,TOWNR+10)&&!town)return false;if(pitAt(nx)||pitAt(nx+dir*6))return false;e.x=nx;e.moving=true;return true};
 e.moving=false;e.x+=e.vx*dt;e.vx*=Math.pow(.01,dt);if(e.plat)e.x=clamp(e.x,e.plat.x0+4,e.plat.x1-4);
 if(town){walkTo(e.x<town.x?-1:1,d.spd*1.5);if(base!=='witch')e.y=gY(e.x);return}
 if(base==='slime'){if(e.onGround){e.y=gY(e.x);e.hop-=dt;if(e.hop<=0){e.hop=.8+rnd()*.6;e.vy=-170;e.onGround=false;e.dir=Math.sign(dxp)||1}}
  else{walkTo(e.dir,d.spd);e.vy+=600*dt;e.y+=e.vy*dt;const gy=gY(e.x);if(e.y>=gy){e.y=gy;e.onGround=true}}
  if(near)hurtPlayer(d.dmg,e.x)}
 else if(base==='goblin'){if(e.jcd>0)e.jcd-=dt;if(e.air>0){e.avy-=900*dt;e.air=Math.max(0,e.air+e.avy*dt)}e.y=gY(e.x)-(e.air||0);if(e.flee>0){e.flee-=dt;const fs=e.loot.length?d.spd*Math.max(.5,.65-.05*e.loot.length):d.spd*1.3;if(!walkTo(e.fdir,fs)){e.fdir*=-1}if(e.flee<=0&&e.loot.length&&adx>VW*.6){e.dead=1;return}if(e.flee<=0)e.flee=2;return}
  if(e.loot.length){e.flee=5;e.fdir=-Math.sign(dxp)||1;return}
  // raid a parked cart that's left alone
  const pk=S.park;if(!DG&&pk&&pk.cargo.length&&Math.abs(P.x-pk.x)>40&&Math.abs(pk.x-e.x)<adx){const dc=pk.x-e.x;if(Math.abs(dc)>4)walkTo(Math.sign(dc),d.spd);e.cd-=dt;
   if(Math.abs(dc)<8&&e.cd<=0){e.cd=1.1;const n=Math.min(cargoN(pk.cargo),1);for(let i=0;i<n;i++){const u=randomUnit(pk.cargo);if(u)e.loot.push(u)}ftxt(pk.x,surfY(pk.x)-22,'🛒 -'+n+'!','#ff6a6a');e.flee=5;e.fdir=Math.sign(e.x-P.x)||1;save()}return}
  if(adx>4)walkTo(Math.sign(dxp),d.spd);e.cd-=dt;
  if(near&&e.cd<=0){e.cd=1.1;if(cargoCount()&&!(mounted()&&lanceSpeed()>.5)){const n=Math.min(cargoCount(),1);for(let i=0;i<n;i++){const u=randomUnit();if(u)e.loot.push(u)}ftxt(P.x,P.y-30,'Stolen ×'+n+'!','#ff6a6a');e.flee=5;e.fdir=-Math.sign(dxp)||1;P.inv=Math.max(P.inv,.4)}else hurtPlayer(d.dmg,e.x,false)}}
 else if(base==='golem'){e.y=gY(e.x);e.cd-=dt;
  if(e.state==='walk'){if(adx>20)walkTo(Math.sign(dxp),d.spd);else e.dir=Math.sign(dxp)||e.dir;if(adx<26&&e.cd<=0){e.state='wind';e.st=.55}
   if(e.type==='lavaGolem'&&e.cd<=0&&adx>60&&adx<230){e.cd=3.2;e.dir=Math.sign(dxp);const T=1.0;PROJ.push({x:e.x+e.dir*8,y:e.y-24,vx:dxp/T,vy:-(.5*400*T),g:400,dmg:16,from:'e',kind:'lava',life:2.5})}}
  else if(e.state==='wind'){e.st-=dt;if(e.st<=0){e.state='punch';e.st=.25;if(adx<32&&P.y>e.y-34)hurtPlayer(d.dmg,e.x,true,'golem')}}
  else{e.st-=dt;if(e.st<=0){e.state='walk';e.cd=1.5}}
  if(e.type==='lavaGolem'&&near)hurtPlayer(8,e.x,false)}
 else if(base==='witch'){const gy=gY(e.x);e.y=lerp(e.y,gy-30+Math.sin(e.t*2.5+e.seed)*5,dt*3);e.dir=Math.sign(dxp)||1;
  if(adx<90)walkTo(-Math.sign(dxp),d.spd);else if(adx>150)walkTo(Math.sign(dxp),d.spd);e.dir=Math.sign(dxp)||1;
  if(adx<26&&e.cd>.5){e.x=clamp(e.x-Math.sign(dxp)*70,20,WORLD-20);if(townAt(e.x,TOWNR+10))e.x+=Math.sign(dxp)*140;if(e.plat)e.x=clamp(e.x,e.plat.x0+4,e.plat.x1-4);part(e.x,e.y-10,'#c060ff',10,80,0)}
  e.cd-=dt;if(e.cast>0)e.cast-=dt;if(e.cd<=0&&adx<240){e.cd=2.3+rnd()*.6;e.cast=.3;const ang=Math.atan2(P.y-10-(e.y-10),dxp);const sp=e.type==='witchV'?130:110;
   PROJ.push({x:e.x+e.dir*6,y:e.y-10,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,g:0,dmg:d.dmg,from:'e',kind:'magic',life:3,v:e.type==='witchV'})}}
}
