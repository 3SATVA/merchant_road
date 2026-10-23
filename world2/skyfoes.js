'use strict';
function spawnAir(dir){const mx=P.fly==='ship'?SKY.maxShip:SKY.max,air=ENEMIES.filter(e=>!e.dead&&ENEMY[e.type].air&&!ENEMY[e.type].isle).length;if(air>=mx)return;const n=rnd()<SKY.pair?2:1;
 for(let i=0;i<n&&air+i<mx;i++){const x=P.x+dir*(VW/2+24+i*30);if(x<ISLES[0].x1+40||x>ISLES[1].x0-40)continue;const t=pickType(6),e=spawnEnemy(t,x);e.dir=-dir;
  e.y=t==='skySlime'?BANDY[0]+6-rnd()*24:BANDY[1+Math.floor(rnd()*2)]-6;e.by=e.y;e.state='hover';e.cd=1.2+rnd();e.age=0;e.onGround=false}}
// open-sky kills (pegasus / sky slime): Sky Crystal is a material, straight into S.mats (never lost to a full hold), crystal sparks fly from the kill to the player
function airGem(e,d){if(rnd()>=d.gem*DROPMUL)return;const y=e.y-d.h/2;giveMat('skyglass');const a=Math.atan2(P.y-12-y,P.x-e.x);for(let i=0;i<8;i++)PARTS.push({x:e.x,y,vx:Math.cos(a)*(90+rnd()*80)+(rnd()-.5)*40,vy:Math.sin(a)*(90+rnd()*80)+(rnd()-.5)*40,col:i%2?'#a8f4ff':'#ffffff',g:0,life:.45})}
function airTouch(e,d){if(P.fly==='ship'){const hw=shipHW();return Math.abs(e.x-P.x)<hw+d.w/2&&e.y>P.y-52&&e.y-d.h<P.y+14}const m=mounted();return Math.abs(e.x-P.x)<(m?10:6)+d.w/2&&e.y>P.y-(m?28:18)&&e.y-d.h<P.y+2}
function airHit(e,d){if(P.fly==='ship')hullHit(d.hull,e.x);else hurtPlayer(d.dmg*SKY.dmg,e.x,false)}
function updAir(e,dt,d){if(d.isle){updIsle(e,dt,d);return}const tx=P.x,ty=P.fly==='ship'?P.y-6:P.y-12;e.age=(e.age||0)+dt;e.x+=e.vx*dt;e.vx*=Math.pow(.05,dt);
 if(e.gone==null&&biomeAt(P.x)!==6){e.gone=e.age;e.dir=e.x<P.x?-1:1}
 if(e.gone!=null){e.y-=70*dt;e.x+=e.dir*110*dt;if(e.age-e.gone>2.2){e.dead=1;part(e.x,e.y-d.h/2,'#ffffff',8,70,40,.5)}return}
 if(e.type==='pegasus'){
  if(e.age>16&&e.state!=='leave')e.state='leave';
  if(e.state==='leave'){e.y-=60*dt;e.x+=e.dir*120*dt;if(e.age>22)e.dead=1;return}
  if(e.state==='hover'){const hx=tx+(e.x<tx?-70:70),hy=ty-40+Math.sin(e.t*2+e.seed)*10;e.x+=clamp((hx-e.x)*1.6,-d.spd*.95,d.spd*.95)*dt;e.y+=clamp((hy-e.y)*1.6,-80,80)*dt;e.dir=tx>e.x?1:-1;
   e.cd-=dt;if(e.cd<=0&&Math.abs(tx-e.x)<190){e.state='dive';e.hitDone=0;const a=Math.atan2(ty-e.y,tx-e.x);e.dvx=Math.cos(a)*d.spd;e.dvy=Math.sin(a)*d.spd;e.dT=0}}
  else if(e.state==='dive'){e.dT+=dt;e.x+=e.dvx*dt;e.y+=e.dvy*dt;e.dir=e.dvx>0?1:-1;if(!e.hitDone&&airTouch(e,d)){e.hitDone=1;airHit(e,d)}else if(!e.hitDone&&cartTouch(e,d)){e.hitDone=1;cartHit(e)}if(e.dT>1.1){e.state='hover';e.cd=(P.fly==='ship'?SKY.diveShip:SKY.diveHorse)+rnd()*SKY.diveRnd}}}
 else{const hop=Math.abs(Math.sin(e.t*2.6+e.seed));e.by+=clamp((ty+4-e.by)*.6,-22,22)*dt;e.by=Math.max(e.by,BANDY[1]-10);e.y=e.by-hop*16;e.onGround=hop<.15;
  const dx=tx-e.x;if(Math.abs(dx)<240){e.x+=Math.sign(dx)*d.spd*dt;e.dir=Math.sign(dx)||1}
  e.cd-=dt;if(e.cd<=0&&airTouch(e,d)){e.cd=1;airHit(e,d)}else if(e.cd<=0&&cartTouch(e,d)){e.cd=1;cartHit(e)}}}
function drawAir(c,e,sx,sy,t){if(ENEMY[e.type].isle){drawIsleFoe(c,e,sx,sy,t);return}const dir=e.dir,fl=e.hitT>0;let R=[];const L1=R;let tilt=0,by=0;const P=(xo,yo,w,h,col)=>R.push([dir>0?sx+xo:sx-xo-w,sy+yo+by+Math.round((dir>0?xo:xo+w-1)*tilt),w,h,fl?'#ffffff':col]);
 const tt=t+(e.seed||0)*3;
 if(e.type==='pegasus'){const W='#e4e6f0',HL='#ffffff',S2='#b4bad2',S3='#8a92b4',M='#4a9ae8',M2='#2a6ac0';const dive=e.state==='dive';
  const f=flapF(tt,e.state==='leave'?.05:.075),wing=(ox,oy,cols,fr)=>{for(const r of fr)P(ox+r[0],oy+r[1],r[2],r[3],cols[r[4]])};
  if(dive){tilt=clamp((e.dvy||0)/Math.max(30,Math.abs(e.dvx||0)),-1,1)*.3;
   wing(0,-10,[S2,S3,S3],wingRects(8,9,2));P(-13,-8,4,1,'rgba(255,255,255,.55)');P(-16,-5,5,1,'rgba(255,255,255,.4)')}
  else{by=FLAPBOB[f];wing(1,-10,['#b8c4dc','#8a98bc','#6a7aa0'],wingFrame((f+1)%6,11,3))}
  // body, neck, head, mane, tail
  P(-7,-9,13,5,W);P(-7,-9,13,1,HL);P(-7,-5,13,1,S2);P(4,-13,3,5,W);P(5,-15,5,3,W);P(5,-15,5,1,HL);P(9,-14,2,2,'#c8bcd8');P(7,-14,1,1,'#d83a3a');P(3,-16,2,6,M);P(2,-12,1,3,M2);
  const tw=dive?0:Math.round(Math.sin(tt*6));P(-10,-9+tw,3,2,M);P(-11,-7+tw,2,3,M2);if(dive)P(-13,-9,3,1,M);
  // legs: tucked back in a dive, paddling a little on the flap
  if(dive){P(-8,-5,3,1,W);P(-10,-5,2,1,'#c8a040');P(2,-5,3,1,W);P(0,-5,2,1,'#c8a040')}
  else{const lg=f<3?0:1;P(-6,-4,2,3-lg,W);P(3,-4,2,3-(1-lg),W);P(-6,-1-lg,2,1,'#c8a040');P(3,-2+lg,2,1,'#c8a040')}
  // near wing over the body (own outline)
  R=[];if(dive){wing(-1,-9,[HL,S2,S3],wingRects(4,11,3))}else wing(-1,-9,['#ffffff','#b8c4dc','#8a98bc'],wingFrame(f,13,3))}
 else{const B='#5aa8e8',B2='#3a78c0',BH='#9ad0ff',WG='#ffffff',WG2='#8aa4c8';const f=flapF(tt,.06);
  // squash on the downstroke, stretch on the upstroke
  const bw=[10,11,12,13,14,12][f],bh=[10,9,8,8,7,8][f],x0=-Math.floor(bw/2),y0=-bh;
  if(e.onGround){P(-8,1,16,3,'#ffffff');P(-6,3,12,2,'#dce8f6')}
  for(const sd of [-1,1]){const fr=wingFrame(f,6,2);for(const r of fr){const wx=sd<0?x0+1+r[0]:-x0-2-r[0]-r[2]+1;P(wx,y0+3+r[1],r[2],r[3],r[4]?WG2:WG)}}
  P(x0,y0+1,bw,bh-1,B);P(x0+1,y0,bw-2,1,B);P(x0+1,y0+1,bw-2,1,BH);P(x0,y0+bh-1,bw,1,B2);P(x0+2,y0+2,2,1,'#e0f4ff');
  const ey=y0+Math.round(bh*.45);P(-2,ey,1,2,'#0a1a3a');P(2,ey,1,2,'#0a1a3a')}
 for(const L of (R===L1?[L1]:[L1,R]))for(const r of L)px(c,r[0],r[1],r[2],r[3],r[4])} // flat, no outline: same conventions as the World 1 enemies
