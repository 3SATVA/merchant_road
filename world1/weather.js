'use strict';
// World 1 timers: blizzards (Frostpeak), ash storms (Ashen Wastes) and falling rocks (mountains).
// Kept apart from the shared env so World 2 never ticks them: they pause while you are in the Skylands and pick up again
// when you return (travelTo clears a running storm). Called from updWorld (core/play.js) only in World 1, in this order.
const W1ENV={bliz:0,blizT:25,rockT:3,ash:0,ashT:18};
function w1Weather(dt,b,town,mul){
 if(b===1&&!town){W1ENV.blizT-=dt;if(W1ENV.bliz<=0&&W1ENV.blizT<=0){W1ENV.bliz=8;W1ENV.blizT=22+rnd()*15;toast('❄ Blizzard!',1500)}}
 if(W1ENV.bliz>0){W1ENV.bliz-=dt;if(b!==1)W1ENV.bliz=0}
 if(W1ENV.bliz>0&&b===1)mul*=.72;
 if(b===4){W1ENV.ashT-=dt;if(W1ENV.ash<=0&&W1ENV.ashT<=0){W1ENV.ash=7;W1ENV.ashT=24+rnd()*16;toast('🌪 Ash storm!',1500)}}
 if(W1ENV.ash>0){W1ENV.ash-=dt;if(b!==4)W1ENV.ash=0;else mul*=.8}
 return mul}
function w1Rocks(dt,b,town,vx){
 if(b===2&&!town){W1ENV.rockT-=dt;if(W1ENV.rockT<=0){W1ENV.rockT=2.6+rnd()*3;const rx=P.x+vx*.9+(rnd()-.5)*70;if(!townAt(rx))ROCKS.push({x:rx,y:null,vy:0,warn:.9})}}}
