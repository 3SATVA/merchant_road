'use strict';
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;menuT+=dt;
 if(MODE==='cut')cutTick(dt);
 if(MODE==='play'){update(dt);for(const k in pressed)delete pressed[k]}else for(const k in pressed)delete pressed[k];
 if(MODE==='town'&&curTab==='barber')drawPrev($('cprev'),menuT,true);
 if(S&&S.hp>maxHP())S.hp=maxHP();
 if(MODE==='cut'){}
 else if(MODE==='menu'){camX=(camX+18*dt)%(WORLD-VW);camY=lerp(camY,surfY(camX+VW/2)-VH*.64,.05)}
 else if(P&&DG){const tx=clamp(P.x-VW/2+P.dir*28,DG.minX,Math.max(DG.minX,DG.maxX-VW));camX=lerp(camX,tx,Math.min(1,dt*5));camY=lerp(camY,DG.tower?towerCamY():P.y-VH*.6,Math.min(1,dt*4))}
 else if(P){const tx=clamp(P.x-VW/2+P.dir*28,0,WORLD-VW);camX=lerp(camX,tx,Math.min(1,dt*5));const ty=WI===1&&P.fly==='horse'?skyCam():(P.fly?P.y+VH*.1:P.onGround?P.y:Math.max(P.y,surfY(P.x)))-VH*.64;camY=lerp(camY,ty,Math.min(1,dt*4))}
 SHK*=Math.pow(.0005,dt);render(dt);if(MODE!=='menu'&&S)updHUD();requestAnimationFrame(frame)}
setMode('menu');requestAnimationFrame(frame);
addEventListener('beforeunload',()=>{if(MODE!=='menu')save()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&MODE==='play'){save();setMode('pause')}});
