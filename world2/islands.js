'use strict';
const FARISLES=[{x:500,hw:120,dy:-40},{x:1500,hw:160,dy:-90},{x:2450,hw:200,dy:-60},{x:3150,hw:150,dy:40},{x:3800,hw:240,dy:-20},{x:4450,hw:170,dy:-80}]; // decorative for now (phase 2/3 islands)
function isleTh(x){const I=ISLES[Math.max(0,islAt(x))],ed=Math.min(x-I.x0,I.x1-x);return Math.round(12+80*Math.sqrt(clamp(ed/420,0,1))+5*hash(Math.floor(x/3)))}
function drawIsles(ox0,oy0){const B=BIOMES[5];const ox=Math.round(ox0*.5),oy=Math.round(oy0*.5)-30;X.globalAlpha=.32;for(const s of FARISLES){if(s.x+s.hw<ox-20||s.x-s.hw>ox+VW+20)continue;const base=-24+s.dy;
 for(let i=-s.hw;i<=s.hw;i++){const sx=Math.round(s.x+i-ox);if(sx<0||sx>=VW)continue;const wx=s.x+i,top=Math.round(base-4*Math.sin(wx/60)-oy),e=s.hw-Math.abs(i),th=Math.round(8+50*Math.sqrt(clamp(e/(s.hw*.8),0,1))+4*hash(Math.floor(wx/3)));
  X.fillStyle=B.dirt;X.fillRect(sx,top,1,th);X.fillStyle=B.dirt2;X.fillRect(sx,top+Math.round(th*.55),1,th-Math.round(th*.55));X.fillStyle='#a89878';X.fillRect(sx,top+th-2,1,2);X.fillStyle=B.top;X.fillRect(sx,top,1,2);X.fillStyle=B.top2;X.fillRect(sx,top+2,1,1)}
 const tx=Math.round(s.x-ox+s.hw*.3),ty=Math.round(base-4*Math.sin((s.x+s.hw*.3)/60)-oy);px(X,tx,ty-12,2,12,'#c8b090');px(X,tx-5,ty-18,12,7,'#7ee8d8');px(X,tx-3,ty-20,8,2,'#a8f4e8')}X.globalAlpha=1}
function liveDocks(){return FEATURE_DRIVABLE_AIRSHIPS?DOCKS:DOCKS.slice(0,1)}
function nearDock(){if(WI!==1||!P||DG||P.fly)return null;for(const d of liveDocks())if(Math.abs(P.x-d.x)<60)return d;return null}
function drawShipD(c,sx,y,lift,dir,sh){if(dir<0){c.save();c.translate(sx*2,0);c.scale(-1,1)}drawShip(c,sx,y,4,1,menuT,lift,sh.z,sh.pal);if(dir<0)c.restore()}
function drawDock(ox,oy){for(let i=0;i<liveDocks().length;i++){const D=DOCKS[i],sd=D.side,x=Math.round(D.x-ox),y=Math.round(surfY(D.x)-oy);if(x<-160||x>VW+160)continue;
 const Q=(a,b,w,h,c)=>px(X,sd>0?x+a:x-a-w,y+b,w,h,c);
 Q(-26,-6,42,3,'#f4f0e6');Q(-26,-6,42,1,'#e8c050');for(const p0 of [-24,-8,12])Q(p0,-6,2,6,'#c8a040');Q(14,-26,2,20,'#c8a040');Q(12,-29,6,3,'#ffe08a');
 if((FEATURE_DRIVABLE_AIRSHIPS?S.moor===i:i===0)&&!(P&&P.fly==='ship')){const sh=FEATURE_DRIVABLE_AIRSHIPS?SHIPS[S.ship]:SHIPS.small,bob=Math.round(Math.sin(menuT*1.6)*2),sx=x+sd*52,lift=-30+bob;
  const ax=x+sd*15,ay=y-24,bx=sx-sd*Math.round(34*sh.z),byy=y-24+lift+2;for(let k=0;k<=12;k++){const f=k/12;px(X,Math.round(ax+(bx-ax)*f),Math.round(ay+(byy-ay)*f+Math.sin(f*Math.PI)*4),1,1,'#5e3a1e')}
  drawShipD(X,sx,y,lift,sd,sh)}
 if(nearDock()===D&&MODE==='play'&&Math.sin(menuT*4)>0)px(X,x,y-34,1,2,'#ffd75e')}}
