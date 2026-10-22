'use strict';
const FLAPA=[62,32,4,-28,-56,20],FLAPL=[.82,1,1,.95,.8,.66],FLAPBOB=[1,0,0,-1,-1,0],WINGC={}; // wing flap cycle (see wingRects)
// pixel wings on the horse's back (World 2): folded when standing, flapping when running or flying
function horseFlap(idle){const pl=plr();if(idle||!pl||!mounted())return null;if(pl.fly==='horse')return .09;if(!pl.onGround)return .07;return null}
function drawWings(P0,t,bob,run,idle){const A='#ffffff',B='#e4ecf6',C='#a8bcd8',D='#7f94b4';const dur=horseFlap(idle),gal=!idle&&run>.05&&dur===null;
 const wing=(o,k,ol)=>{const P=ol?(x,y,w,h)=>P0(x-1,y-1,w+2,h+2,'#4a5a7a'):P0;const cols=k?[B,C,D]:[A,B,C];
  if(dur===null&&!gal){P(-9+o,-18+bob-o,13,3,cols[0]);P(-13+o,-20+bob-o,5,3,cols[0]);P(-16+o,-22+bob-o,4,2,cols[1]);P(-9+o,-15+bob-o,12,1,cols[2]);P(-15+o,-19+bob-o,3,1,cols[2]);return}
  const f=dur!==null?flapF(t,dur):[2,1,2,3][Math.floor(t*(6+5*run))%4],fr=wingFrame(k?(f+1)%6:f,k?16:19,4);
  for(const r of fr)P(2+o+r[0],-17+bob-o+r[1],r[2],r[3],cols[r[4]])};
 wing(2,1,1);wing(2,1);wing(0,0,1);wing(0,0)}
// ===== wing flaps: 6-frame cycle (up, up-mid, glide, down-mid, down, recover) shared by pegasus, sky slime and the winged horse

function flapF(t,dur){return ((Math.floor(t/dur)%6)+6)%6}
// wing as pixel rects from the shoulder, leaning back (-x); k: 0 main, 1 trailing feathers, 2 tips
function wingRects(deg,L,th){const key=deg+'|'+L+'|'+th;if(WINGC[key])return WINGC[key];const a=deg*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),out=[],steep=Math.abs(deg)>40;
 for(let k=0;k<=L;k++){const x=Math.round(-ca*k*.9-(steep?k*.25:0)),y=Math.round(-sa*k),T=Math.max(1,Math.round(th*(1-.55*k/L)));
  const fe=k>L*.3&&k%2===0; // scalloped trailing feathers
  if(steep){out.push([x-T+1,y,T,1,0]);out.push([x-T,y,1,1,1]);if(fe)out.push([x-T-1,y,1,1,2])}else{out.push([x,y,1,T,0]);out.push([x,y+T,1,1,1]);if(fe)out.push([x,y+T+1,1,1,2])}}
 if(!steep)out.push([Math.round(-ca*L*.9)-1,Math.round(-sa*L),1,1,1]);return WINGC[key]=out}
function wingFrame(f,L,th){return wingRects(FLAPA[f],Math.round(L*FLAPL[f]),th)}
