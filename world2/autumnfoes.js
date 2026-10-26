'use strict';
// Autumn Wilds (Sunspire -> Aldenreach): the new foes and their shots, the island set pieces (castle ruins, sun-cult rubble,
// shrine) and falling leaves. Stats live in ENEMY (world2/data.js: cultist / robot / harpy); timings here in AUF.
// Island foes run inside updIsle (skyisles.js) and do their own damage (no touch damage); the harpy runs from updAir (skyfoes.js).
const AUF={lunge:{near:165,tele:.36,spd:300,t:.42,cd:1.2}, // cultist: wind-up [s] then a long knife dash (px/s, s: 126 px, was 69); cooldown + up to .5
 laser:{range:230,min:40,tele:.85,lock:.3,beam:.22,cd:2.8,dmg:Math.round(46*AUMUL)}, // robot laser: aim line tracks you, locks for the last .3 s, then fires along the locked line
 slam:{near:26,tele:.45,cd:1.4}, // robot fist slam (ENEMY.robot.dmg)
 feather:{dmg:Math.round(30*AUMUL),hull:8,spd:165,tele:.45,cd:2.3,n:3,spread:.2,life:2.2}}; // harpy feather fan (x SKY.dmg on the winged horse)
const AUP=[]; // harpy feathers in flight
DROPS.cultist=[['essence',.35]];DROPS.robot=[['essence',.2]];DROPS.harpy=[['essence',.4]]; // plus: cultist 6% Spiced Amber, robot 50% Sky Crystal, harpy 20% Sky Crystal (ENEMY .amber/.gem)
function segD(px0,py0,x0,y0,x1,y1){const dx=x1-x0,dy=y1-y0,l=dx*dx+dy*dy,t=l?clamp(((px0-x0)*dx+(py0-y0)*dy)/l,0,1):0;return Math.hypot(px0-x0-t*dx,py0-y0-t*dy)}
function auHitP(e,d,dmg,src){if(P.fly==='ship')hullHit(d.hull,e.x);else if(P.fly)hurtPlayer(dmg*SKY.dmg,e.x,false);else hurtPlayer(dmg,e.x,true,src)}
// pathing: an autumn foe roams its whole island (lo..hi) while you are reachable there, patrols its own slice (z0..z1) otherwise.
// Every step reports whether it really moved, so nobody walks in place against an edge.
function auReach(I){if(P.fly||P.x<I.x0+4||P.x>I.x1-4)return false;const g=surfY(P.x);return P.y>g-70&&P.y<g+12} // on foot / riding on this island (a jump still counts)
function auStep(e,tx,sp,dt,lo,hi){const x0=e.x,s=Math.sign(tx-e.x);if(!s)return false;e.dir=s;e.x=clamp(e.x+s*Math.min(sp*dt,Math.abs(tx-e.x)),lo,hi);if(Math.abs(e.x-x0)>1e-3){e.moving=true;return true}return false}
function auWander(e,dt,d,lo,hi,sp){const z0=e.z0!=null?clamp(e.z0,lo,hi):lo,z1=e.z1!=null?clamp(e.z1,lo,hi):hi;
 if(e.st==='walk'){if(Math.abs(e.tx-e.x)<3||!auStep(e,e.tx,sp,dt,lo,hi)){e.st='idle';e.sT=.5+rnd()*.9}}
 else{e.st='idle';e.sT-=dt;if(e.sT<=0){e.st='walk';e.tx=z0+rnd()*(z1-z0)}}}
function robEye(e){return {x:e.x+e.dir*4,y:e.y-18}}
// laser geometry: the line from the eye at angle a, cut where it first meets the ground (it never passes through terrain)
function auRay(o,a,l){const c=Math.cos(a),sn=Math.sin(a);for(let k=4;k<=l;k+=2){const x=o.x+c*k,y=o.y+sn*k,g=groundAt(x);if(g!==null&&y>g+1)return {x,y,l:k}}return {x:o.x+c*l,y:o.y+sn*l,l}}
function auAimPt(){return {x:P.x,y:P.y-(P.fly==='ship'?6:10)}}
function auLOS(e){const o=robEye(e),t=auAimPt(),l=Math.hypot(t.x-o.x,t.y-o.y);return auRay(o,Math.atan2(t.y-o.y,t.x-o.x),l).l>=l-3}
function auOnCam(e){return e.x>camX+6&&e.x<camX+VW-6&&e.y>camY+20&&e.y<camY+VH+10} // no shots from off screen (phone portrait is narrow)
// the player's hit box, the same one the unicorn bolts and harpy feathers use (beam half-width added)
function auInBox(x,y){const w=1.5;if(P.fly==='ship'){const hw=shipHW();return Math.abs(x-P.x)<hw+w&&y>P.y-52-w&&y<P.y+14+w}const m=mounted();return Math.abs(x-P.x)<(m?9:5)+w&&y>P.y-(m?27:17)-w&&y<P.y+1+w}
function auBeamHit(x0,y0,x1,y1){const n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let k=0;k<=n;k++){const t=n?k/n:0;if(auInBox(x0+(x1-x0)*t,y0+(y1-y0)*t))return true}return false}
function auBeamSet(e){const o=robEye(e),r=auRay(o,e.ba,AUF.laser.range+90);e.bx0=o.x;e.by0=o.y;e.bx1=r.x;e.by1=r.y}
function updAuFoe(e,dt,d,lo,hi,gy,dxp,adx,near,I){e.y=gy;e.cd-=dt;
 const rch=auReach(I);e.agg=rch&&(e.agg||(adx<240&&Math.abs(P.y-gy)<150))?1:0; // aggro at 240 px, then it follows you anywhere on the island until you leave it
 if(d.cult){const A=AUF.lunge;
  if(e.st==='wind'){e.sT-=dt;if(e.sT<=0){e.st='lunge';e.sT=A.t;e.hitDone=0;part(e.x,e.y-3,'#e8dcc8',4,50,60,.3)}}
  else if(e.st==='lunge'){e.sT-=dt;const x0=e.x;e.x=clamp(e.x+e.dir*A.spd*dt,lo,hi);e.moving=e.x!==x0;if(!e.hitDone&&airTouch(e,d)){e.hitDone=1;auHitP(e,d,d.dmg)}if(e.sT<=0){e.st='cool';e.sT=.45;e.cd=A.cd+rnd()*.5}}
  else if(e.st==='cool'){e.sT-=dt;if(e.sT<=0){e.st='idle';e.sT=.2}}
  else if(e.agg){e.st='chase';e.dir=Math.sign(dxp)||e.dir;if(adx>14)auStep(e,P.x,d.spd,dt,lo,hi);if(e.cd<=0&&adx<A.near&&P.y>gy-40&&P.y<gy+30){e.st='wind';e.sT=A.tele}}
  else{if(e.st==='chase')e.st='idle';auWander(e,dt,d,lo,hi,d.spd*.4)}
  return}
 const L=AUF.laser,SL=AUF.slam;if(e.lcd==null)e.lcd=1+rnd();e.lcd-=dt;
 const canLaser=()=>e.lcd<=0&&adx>L.min&&adx<L.range&&auOnCam(e)&&auLOS(e),aim=()=>{e.st='aim';e.sT=L.tele;e.ba=null;const t=auAimPt();e.ax=t.x;e.ay=t.y;e.dir=Math.sign(dxp)||e.dir};
 if(e.st==='slam'){e.sT-=dt;if(e.sT<=0){e.st='cool';e.sT=.6;e.cd=SL.cd;e.slamT=.35;const fx=e.x+e.dir*12;shake(adx<140?1.4:.4);part(fx,gy,'#c8b8a0',8,90,160,.4);part(fx,gy-2,'#ffd070',4,80,120,.25);
   if(!P.fly&&Math.abs(P.x-fx)<SL.near&&P.y>gy-30&&P.y<gy+6)hurtPlayer(d.dmg,e.x,true,'golem');else if(P.fly&&airTouch(e,d))auHitP(e,d,d.dmg)}}
 else if(e.st==='aim'){e.sT-=dt;
  if(e.sT>L.lock){const t=auAimPt();e.ax=t.x;e.ay=t.y;e.dir=Math.sign(e.ax-e.x)||e.dir;
   if(adx>L.range+60||!auLOS(e)||!auOnCam(e)){e.st='cool';e.sT=.3;e.lcd=.8+rnd()*.5}} // lost you (out of range / behind the ground) before the lock: stand down, retry soon
  if(e.st==='aim'){const o=robEye(e);e.ba=Math.atan2(e.ay-o.y,e.ax-o.x);
   if(e.sT<=0){e.st='beam';e.sT=L.beam;e.hitDone=0;auBeamSet(e);shake(.6)}}}
 else if(e.st==='beam'){e.sT-=dt;auBeamSet(e); // the beam stays on the eye if the robot is knocked back
  if(!e.hitDone&&auBeamHit(e.bx0,e.by0,e.bx1,e.by1)){e.hitDone=1;const py=P.y-(P.fly==='ship'?6:10);if(P.fly==='ship')hullHit(d.hull+4,e.x);else hurtPlayer(L.dmg*(P.fly?SKY.dmg:1),e.x,true);part(P.x,py,'#ff5a3a',8,100,60,.35)}
  if(e.sT<=0){e.st='cool';e.sT=.5;e.lcd=L.cd+rnd()}}
 else if(e.st==='cool'){e.sT-=dt;if(e.sT<=0){e.st='idle';e.sT=.3}}
 else if(e.agg){e.st='chase';e.dir=Math.sign(dxp)||e.dir;if(adx>SL.near-8)auStep(e,P.x,d.spd,dt,lo,hi);e.dir=Math.sign(dxp)||e.dir;
  if(e.cd<=0&&adx<SL.near&&P.y>gy-30&&P.y<gy+6){e.st='slam';e.sT=SL.tele}else if(canLaser())aim()}
 else{if(e.st==='chase')e.st='idle';if(near&&canLaser())aim();else auWander(e,dt,d,lo,hi,d.spd)} // can't reach you (flying, other island): patrol, laser if it sees you
 if(e.slamT>0)e.slamT-=dt}
function updHarpy(e,dt,d){const F=AUF.feather,tx=P.x,ty=P.fly==='ship'?P.y-6:P.y-12;
 if(e.age>20&&e.state!=='leave')e.state='leave';
 if(e.state==='leave'){e.y-=60*dt;e.x+=e.dir*120*dt;if(e.age>26)e.dead=1;return}
 if(!e.side)e.side=e.x<tx?-1:1;const hx=tx+e.side*120,hy=ty-50+Math.sin(e.t*1.7+e.seed)*12;
 e.x+=clamp((hx-e.x)*1.4,-d.spd,d.spd)*dt;e.y+=clamp((hy-e.y)*1.4,-90,90)*dt;e.dir=tx>e.x?1:-1;
 if(e.state==='cast'){e.sT-=dt;if(e.sT<=0){const hx0=e.x+e.dir*5,hy0=e.y-11,a=Math.atan2(ty-hy0,tx-hx0);
   for(let i=0;i<F.n;i++){const b=a+(i-(F.n-1)/2)*F.spread;AUP.push({x:hx0,y:hy0,vx:Math.cos(b)*F.spd,vy:Math.sin(b)*F.spd,a:b,life:F.life})}
   part(hx0,hy0,'#ffb050',5,70,0,.3);e.state='hover';e.cd=F.cd+rnd()*.8;if(rnd()<.35)e.side=-e.side}}
 else{e.cd-=dt;if(e.cd<=0&&Math.abs(tx-e.x)<220){e.state='cast';e.sT=F.tele}}
 if(e.tcd>0)e.tcd-=dt;else if(airTouch(e,d)){e.tcd=1;airHit(e,d)}}
function auTick(dt){const F=AUF.feather;
 for(const b of AUP){b.life-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;const g=groundAt(b.x);if(g!==null&&b.y>g+1){b.life=0;part(b.x,g,'#f0a040',3,50,100,.3);continue}
  const bb={x:b.x,y:b.y+2},BD={w:6,h:4},m=mounted();
  const hit=P.fly?airTouch(bb,BD):Math.abs(b.x-P.x)<(m?9:5)&&b.y>P.y-(m?27:17)&&b.y<P.y+1;
  if(hit){b.life=0;part(b.x,b.y,'#f0a040',6,90,60,.35);if(P.fly)airHit(bb,{dmg:F.dmg,hull:F.hull});else hurtPlayer(F.dmg,b.x)}
  else if(P.fly&&cartTouch(bb,BD)){b.life=0;part(b.x,b.y,'#f0a040',6,90,60,.35);cartHit(bb)}}
 for(let i=AUP.length-1;i>=0;i--)if(AUP[i].life<=0)AUP.splice(i,1)}
function auDeath(e,d,y){if(d.cult){if(rnd()<d.amber*DROPMUL)dropUnit({item:10,origin:8,paid:0},e.x,e.y-12);part(e.x,y,'#b8282a',10,110,160,.5);part(e.x,y-6,'#f0c040',6,90,120,.45)}
 else{shake(1.2);part(e.x,y,'#ffd070',10,150,200,.4);part(e.x,y,'#6a6a70',8,60,-40,.8);part(e.x,y,'#a8643a',8,120,260,.6)}}
// ---- art (flat, no outline; facing right, feet at sy) ----
function drawAuFoe(c,e,sx,sy,t){const dir=e.dir||1,fl=e.hitT>0,R=[],G=[];const Q=(xo,yo,w,h,col)=>R.push([dir>0?sx+xo:sx-xo-w,sy+yo,w,h,fl?'#ffffff':col]);const tt=t+(e.seed||0)*3,d=ENEMY[e.type];
 if(d.cult){const RB='#b8282a',R2='#7a1418',R3='#d84a3a',GD='#e8b040',MK='#f0c040',RY='#ffe080',BL='#d8dce8',st=e.st,f=e.moving?Math.floor(tt*12)%4:0,w=st==='wind',lg=st==='lunge',cy=w?1:0;
  // a short, slight figure: boots, narrow flared robe (gold trim), hood, a spiky sun mask (gold disc, rays all round), dagger arm
  if(e.moving){Q(-2+(f<2?1:-1),-1,2,1,'#3a1a14');Q(1+(f<2?-1:1),-1,2,1,'#3a1a14')}
  Q(-3,-10+cy,6,9-cy,RB);Q(-4,-4,8,3,RB);Q(-4,-2,8,1,GD);Q(-3,-10+cy,1,7,R2);Q(1,-9+cy,1,6,R3);Q(-3,-6,6,1,GD);if(lg){Q(-6,-3,2,2,RB);Q(-7,-2,1,1,R2)}
  Q(-3,-14+cy,4,5,R2);
  const mc=w&&Math.sin(tt*40)>0?'#fff8d0':MK;Q(0,-14+cy,4,4,mc);Q(1,-15+cy,2,1,mc);Q(1,-10+cy,2,1,mc);Q(-1,-13+cy,1,2,mc);Q(4,-13+cy,1,2,mc);
  Q(2,-13+cy,2,1,'#3a1a14');Q(2,-11+cy,1,1,'#c08a20');
  const sp=w?Math.round(Math.sin(tt*30)):0;
  for(const [a,b,c2] of [[1,-17,RY],[2,-16,GD],[-1,-16,GD],[4,-16,GD],[5,-15,RY],[6,-12,RY],[5,-10,GD],[-2,-15,RY],[-3,-12,RY],[-2,-10,GD],[4,-9,RY]])Q(a,b+cy-(a===1&&b===-17?sp:0),1,1,c2);
  if(w){Q(-4,-11,2,4,R2);Q(-4,-15,1,4,BL);Q(-4,-16,1,1,'#ffffff');G.push([dir>0?sx-5:sx+3,sy-17,3,3,'rgba(255,240,180,'+(.4+.4*Math.sin(tt*30))+')'])}
  else if(lg){Q(2,-8,4,2,R2);Q(6,-8,4,1,BL);Q(9,-8,1,1,'#ffffff');for(const k of [0,1,2,3])Q(-9-k*3,-12+k*3,3,1,'rgba(255,230,210,.55)')}
  else{Q(2,-8,1,3,R2);Q(3,-6,1,2,BL);Q(3,-7,1,1,'#a8a8b0')}}
 else{const RU='#a8643a',RU2='#6a3a22',RU3='#c87a4a',M='#8a8a90',M2='#4a4a52',M3='#b8b8bc',EY='#ff3a2a',VD='#5a7a6a',st=e.st,f=e.moving?Math.floor(tt*6)%4:0,aim=st==='aim'||st==='beam',sl=st==='slam',bob=e.moving&&f%2?-1:0;
  // treads, rusty boxy body with verdigris patches and rivets, dented head with a red eye, bent antenna, slam arm
  Q(-8,-4,16,4,M2);Q(-8,-4,16,1,M);for(let k=0;k<4;k++)Q(-7+((k*4+f)%16),-2,2,1,M3);
  Q(-9,-13+bob,2,7,RU2);Q(-10,-7+bob,3,3,M2);
  Q(-7,-15+bob,14,11,RU);Q(-7,-15+bob,14,1,RU3);Q(-7,-5+bob,14,1,RU2);Q(-7,-15+bob,1,10,RU2);Q(-5,-12+bob,3,3,VD);Q(3,-8+bob,2,2,VD);Q(4,-14+bob,2,1,RU2);
  for(const [a,b] of [[-6,-14],[5,-14],[-6,-6],[5,-6]])Q(a,b+bob,1,1,M3);Q(-1,-11+bob,4,3,M2);Q(0,-10+bob,1,1,Math.sin(tt*5)>0?'#7de07a':'#2a4a2a');Q(2,-10+bob,1,1,Math.sin(tt*3)>0?'#ffd070':'#5a4a2a');
  Q(-4,-21+bob,9,6,M);Q(-4,-21+bob,9,1,M3);Q(-4,-16+bob,9,1,M2);Q(-3,-20+bob,2,1,M2);Q(1,-19+bob,4,2,'#2a1a1a');
  const ec=aim?(st==='beam'||e.sT<AUF.laser.lock?(Math.sin(tt*40)>0?'#ffffff':'#ff8a6a'):'#ff6a4a'):EY;Q(3,-19+bob,2,2,ec);
  Q(-2,-24+bob,1,3,M2);Q(-3,-25+bob,1,1,M2);Q(-4,-25+bob,1,1,Math.sin(tt*2)>.6?EY:'#6a2a22');
  if(aim){const p=st==='beam'?1:1-clamp(e.sT/AUF.laser.tele,0,1),gr=1+Math.round(p*3),gx=dir>0?sx+4:sx-5;G.push([gx-gr,sy-18+bob-gr,gr*2+1,gr*2+1,'rgba(255,80,50,'+(.2+p*.4)+')'])}
  if(sl){const p=1-clamp(e.sT/AUF.slam.tele,0,1),lift=Math.round(p*8);Q(6,-14-lift,3,8,M2);Q(5,-18-lift,5,4,M);Q(5,-18-lift,5,1,M3);if(Math.sin(tt*30)>0)Q(7,-20-lift,1,1,'#ffffff')}
  else if(e.slamT>0){Q(6,-12,3,4,M2);Q(7,-8,4,2,M2);Q(9,-4,5,4,M);Q(9,-4,5,1,M3)}
  else{Q(6,-13+bob,3,7,M2);Q(6,-7+bob,4,3,M);Q(6,-7+bob,4,1,M3)}
  if(Math.sin(tt*1.3+e.seed)>.85){const p=(tt*2)%1;G.push([dir>0?sx-9:sx+8,sy-18-Math.round(p*8),2,2,'rgba(120,120,130,'+(.6*(1-p))+')'])}}
 for(const r of R)px(c,r[0],r[1],r[2],r[3],r[4]);for(const g of G)px(c,g[0],g[1],g[2],g[3],g[4])}
function drawHarpy(c,e,sx,sy,t){const dir=e.dir,fl=e.hitT>0,tt=t+(e.seed||0)*3,f=flapF(tt,e.state==='leave'?.05:.08),by=FLAPBOB[f];let R=[];const L1=R;
 const Q=(xo,yo,w,h,col)=>R.push([dir>0?sx+xo:sx-xo-w,sy+yo+by,w,h,fl?'#ffffff':col]),wing=(ox,oy,cols,fr)=>{for(const r of fr)Q(ox+r[0],oy+r[1],r[2],r[3],cols[r[4]])};
 const SK='#f0c8a8',SK2='#d8a888',HR='#7a2a1a',HR2='#a8402a',DR='#2a6a5a',DR2='#1e4e42',DR3='#3a8a74',GD='#e8b040',LG='#c89a50',cast=e.state==='cast';
 wing(-1,-13,['#c8602a','#a8482a','#7a3020'],wingFrame((f+1)%6,12,3));
 // bird legs + gold talons below a long dress; gold belt; arms; auburn hair streaming back, gold circlet
 Q(-2,-4,1,3,LG);Q(1,-4,1,3,LG);Q(-3,-1,2,1,GD);Q(1,-1,2,1,GD);
 Q(-3,-10,6,6,DR);Q(-4,-7,8,3,DR);Q(-4,-5,8,1,DR2);Q(1,-10,1,5,DR3);const sw=Math.round(Math.sin(tt*5));Q(-6,-6+sw,2,2,DR2);Q(-7,-5+sw,1,1,DR2);
 Q(-3,-11,6,1,GD);Q(-2,-14,5,3,DR);Q(-2,-14,5,1,DR3);Q(0,-15,2,1,SK);
 Q(-1,-19,4,4,SK);Q(3,-17,1,1,SK2);Q(2,-17,1,1,'#2a1a2a');Q(-2,-20,5,1,HR);Q(-2,-19,1,5,HR);Q(-3,-19,1,6,HR);Q(-4,-18+sw,1,5,HR2);Q(-5,-17+sw,1,3,HR);Q(-1,-19,4,1,GD);Q(0,-19,1,1,'#ffe080');
 if(cast){Q(2,-13,5,1,SK);Q(7,-14,1,2,SK);const p=1-clamp(e.sT/AUF.feather.tele,0,1),gr=1+Math.round(p*2),gx=dir>0?sx+8:sx-9;R.push([gx-gr,sy-13+by-gr,gr*2+1,gr*2+1,'rgba(255,176,80,'+(.3+p*.4)+')'])}
 else{Q(2,-13,1,4,SK);Q(-3,-13,1,4,SK2)}
 R=[];wing(-2,-12,['#f0a040','#e0782a','#b8562a'],wingFrame(f,13,3));
 for(const L of [L1,R])for(const r of L)px(c,r[0],r[1],r[2],r[3],r[4])}
// world-space: robot aim lines + beams, harpy feathers, falling leaves (drawn from drawWeather, after the bolts)
function drawAuShots(ox,oy){if(WI!==1)return;
 for(const e of SKYST.foes){if(e.dead||e.hp<=0||(e.st!=='aim'&&e.st!=='beam'))continue;const L=AUF.laser;
  if(e.st==='aim'){const o=robEye(e),a=e.ba!=null?e.ba:Math.atan2(e.ay-o.y,e.ax-o.x),lock=e.sT<L.lock,n=Math.round(auRay(o,a,L.range+90).l/2);X.globalAlpha=lock?(Math.sin(menuT*40)>0?.9:.5):.35+.15*Math.sin(menuT*12);
   for(let k=2;k<n;k++){if(!lock&&k%3===2)continue;px(X,Math.round(o.x+Math.cos(a)*k*2-ox),Math.round(o.y+Math.sin(a)*k*2-oy),1,1,lock?'#ffb0a0':'#ff5a3a')}X.globalAlpha=1}
  else{const n=Math.round(Math.hypot(e.bx1-e.bx0,e.by1-e.by0)/2),p=e.sT/L.beam;for(let k=0;k<n;k++){const x=Math.round(e.bx0+(e.bx1-e.bx0)*k/n-ox),y=Math.round(e.by0+(e.by1-e.by0)*k/n-oy);px(X,x-1,y-2,3,5,'rgba(255,70,40,'+(.35*p+.1)+')');px(X,x,y-1,2,3,'#ff5a3a');px(X,x,y,2,1,'#fff0d0')}}}
 for(const b of AUP){const x=Math.round(b.x-ox),y=Math.round(b.y-oy),ca=Math.cos(b.a),sa=Math.sin(b.a);px(X,x-3,y-3,7,7,'rgba(255,170,80,.22)');
  for(let k=0;k<5;k++)px(X,Math.round(x-ca*k),Math.round(y-sa*k),1,1,k===0?'#fff0c0':k<3?'#f0a040':'#c0502a');px(X,Math.round(x-ca*2-sa),Math.round(y-sa*2+ca),1,1,'#e0782a')}
 const cx=ox+VW/2,f=clamp((cx-10500)/700,0,1)*(cx<ISLES[2].x1+300?1:0);if(f>0){const n=Math.round(16*f);for(let i=0;i<n;i++){const s=hash(i*7.3),x=((s*1931+menuT*(18+s*20)+Math.sin(menuT*1.3+i)*10)%(VW+20)+VW+20)%(VW+20)-10,y=((hash(i*3.1)*VH+menuT*(22+s*16))%(VH+10))-5,fl=Math.sin(menuT*6+i*2)>0;
  px(X,Math.round(x),Math.round(y),fl?2:1,1,['#e8843a','#c0502a','#f0a040','#a83a22'][i%4])}}}
// ---- autumn island set pieces (decor only) ----
function drawAuSet(i,ox,oy){const I=SKYISLES[i];if(!I.kind||I.kind==='grove')return;const F=(wx,y,w,h,c)=>px(X,Math.round(wx-ox),Math.round(y-oy),w,h,c);
 if(I.kind==='castle'){const S='#a89a8a',S2='#86786c',S3='#c4b8a8',IV='#a83a22',IV2='#c8502a';
  // broken keep: ragged top, arched window, ivy
  {const x0=12570,g=surfY(x0+20);for(let i=0;i<40;i++){const h=62-Math.round(Math.abs(Math.sin(i*.7))*6)-(i>26?Math.round((i-26)*1.6+hash(i*3.1)*6):0)-(i<5?Math.round(hash(i)*5):0);F(x0+i,g-h,1,h+8,i>33?S2:S);if(i%7===3)F(x0+i,g-h,1,1,S3)}
   for(let y=g-56;y<g;y+=7)F(x0,y,40,1,S2);F(x0+12,g-44,10,14,'#3a2e2a');for(let k=0;k<10;k++){const hh=Math.round(3*Math.sqrt(1-((k-4.5)/5)**2));F(x0+12+k,g-47+3-hh,1,hh,'#3a2e2a')}F(x0+16,g-44,2,14,S2);F(x0+10,g-22,14,22,'#2a201c');F(x0+10,g-22,14,1,S3);
   for(let k=0;k<9;k++){const l=6+Math.round(hash(k*2.3)*20);for(let j=0;j<l;j++)F(x0+2+k*4+Math.round(Math.sin(j*.5+k)),g-60+j,1,1,j%3?IV:IV2)}
   const fx=x0+8,fy=g-74;F(fx,fy,1,16,'#3a2a24');for(let k=0;k<9;k++){const o=Math.round(Math.sin(menuT*4-k*.7)*1.2*(k/9)),h=5-(k>5?Math.round(hash(k+Math.floor(menuT*2))*2):0);F(fx+1+k,fy+o,1,h,k%3?'#a8282a':'#7a1418')}}
  // arched curtain wall + a small ruined tower
  {const x0=12612,g=surfY(x0+40);for(let i=0;i<76;i++){const h=30-(i>60?Math.round((i-60)*.8):0)-Math.round(hash(i*1.7)*3);F(x0+i,g-h,1,h+8,S)}for(let y=g-24;y<g;y+=6)F(x0,y,76,1,S2);
   for(const ax of [x0+14,x0+44]){for(let k=0;k<16;k++){const hh=Math.round(18+5*Math.sqrt(1-((k-7.5)/8)**2));F(ax+k,g-hh,1,hh,'#5a4a46')}}}
  {const x0=12694,g=surfY(x0+7);F(x0,g-46,15,54,S);F(x0+11,g-46,4,54,S2);F(x0,g-46,15,1,S3);for(const k of [0,5,10])if(k!==5)F(x0+k,g-51,4,5,S);F(x0+6,g-36,3,7,'#3a2e2a');F(x0+6,g-20,3,7,'#3a2e2a');for(let j=0;j<14;j++)F(x0+2+Math.round(Math.sin(j*.6)),g-44+j,1,1,IV)}
  for(const [rx,w] of [[12560,7],[12655,9],[12720,6],[12596,5]]){const g=surfY(rx);F(rx,g-4,w,4,S2);F(rx+1,g-5,w-2,1,S3)}}
 else if(I.kind==='rubble'){const x0=13530,g=surfY(x0+30);const S='#9a8c80',S2='#7a6c62',S3='#b8aca0';
  for(const [a,b,w,h] of [[0,-8,14,8],[10,-14,12,14],[20,-6,16,6],[34,-11,10,11],[44,-5,12,5],[6,-19,9,6],[26,-12,9,6],[52,-8,8,8]]){F(x0+a,g+b,w,h,S);F(x0+a,g+b,w,1,S3);F(x0+a+w-2,g+b,2,h,S2)}
  for(const [a,b] of [[16,-17],[38,-14],[3,-11]])F(x0+a,g+b,2,2,S2);
  const fx=x0+18,fy=g-58;F(fx,fy,2,46,'#4a3226');F(fx-1,fy-2,4,2,'#e8b040');
  for(let k=0;k<22;k++){const o=Math.round(Math.sin(menuT*4.5-k*.5)*2*(k/22)),tat=k>18?Math.round(hash(k*5.1)*4):0;for(let j=tat;j<14-(k>18?Math.round(hash(k*2.3)*4):0);j++){const sx=k-11,sy=j-7,r=Math.hypot(sx,sy);const c=r<3.5?'#ffe080':(r<4.6&&(Math.round(Math.atan2(sy,sx)*8/Math.PI)%2===0))?'#f0c040':j===0||j===13?'#7a1418':'#b8282a';F(fx+2+k,fy+1+j+o,1,1,c)}}}
 else if(I.kind==='shrine'){const x0=15990,g=surfY(x0);const R='#c0402a',R2='#8a2a1a';
  F(x0-20,g-40,4,40,R);F(x0-17,g-40,1,40,R2);F(x0+16,g-40,4,40,R);F(x0+19,g-40,1,40,R2);F(x0-27,g-46,54,4,R);F(x0-27,g-46,54,1,'#e8603a');F(x0-24,g-42,48,2,R2);F(x0-22,g-36,44,3,R);F(x0-2,g-42,4,6,R2);
  F(x0-23,g-2,10,2,'#8a7a6a');F(x0+13,g-2,10,2,'#8a7a6a');
  for(const lx of [x0-10,x0+10]){const sw=Math.round(Math.sin(menuT*2+lx)*1);F(lx,g-33,1,4,'#3a2a24');F(lx-2+sw,g-29,5,6,'#f4d8a0');F(lx-2+sw,g-29,5,1,R2);F(lx-2+sw,g-24,5,1,R2);X.globalAlpha=.15;X.fillStyle='#ffd070';X.beginPath();X.arc(Math.round(lx-ox)+sw,Math.round(g-26-oy),8,0,7);X.fill();X.globalAlpha=1}
  {const sx=x0+34,F2=(a,b,w,h,c)=>F(sx+a,g+b,w,h,c);F2(-3,-4,7,4,'#8a8a90');F2(-1,-10,3,6,'#8a8a90');F2(-4,-13,9,3,'#a8a8b0');F2(0,-9,1,2,Math.sin(menuT*7)>0?'#ffd070':'#ffb040');F2(-2,-15,5,2,'#8a8a90')}}}
