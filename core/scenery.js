'use strict';
const TOWNCACHE={};
function drawTown(tw,ox,oy){let c=TOWNCACHE[tw.i];if(!c){c=document.createElement('canvas');c.width=240;c.height=70;const g=c.getContext('2d');buildTown(g,tw);TOWNCACHE[tw.i]=c}
 X.drawImage(c,Math.round(tw.x-120-ox),Math.round(surfY(tw.x)-68-oy))}
function buildTown(g,tw){const b=tw.biome;const base=68;let seed=tw.i*17+3;const R=()=>{seed++;return hash(seed)};
 const wall=['#c89a62','#8a6a52','#8a8a90','#3a2a2a','#5a524e','#f4f0e6','#f4f0e6','#ece2f8'][b],wall2=['#a87a48','#6a4e3a','#6a6a72','#2a1c1c','#3e3834','#d8d0c0','#d8d0c0','#cfc0e4'][b],roof=['#b83a2a','#5a4a8a','#4a5a6a','#5a1a1a','#3a3438','#e8c050','#e8c050','#5ec8d8'][b],roof2=['#8a2a1a','#3a2e6a','#34404c','#3a0e0e','#2a2428','#b8902a','#b8902a','#3a98b0'][b];
 const spots=[18,62,150,196];
 for(const x0 of spots){const w=26+Math.floor(R()*12),h=18+Math.floor(R()*12);const x=x0-w/2;
  px(g,x,base-h,w,h,wall);px(g,x,base-h,w,1,wall2);for(let yy=base-h+4;yy<base;yy+=4)px(g,x,yy,w,1,wall2);
  for(let i=0;i<=w/2+2;i++)px(g,x-2+i,base-h-i,w+4-2*i,1,i%3===0?roof2:roof);
  if(b===1)for(let i=0;i<=w/2+2;i+=1)px(g,x-2+i,base-h-i-1,1,1,'#ffffff'),px(g,x+w+1-i,base-h-i-1,1,1,'#ffffff');
  px(g,x+w/2-3,base-9,6,9,'#4a2a18');px(g,x+w/2+1,base-5,1,1,'#d8b040');
  px(g,x+3,base-h+5,5,4,b===3?'#ff8a3a':'#ffe08a');px(g,x+w-8,base-h+5,5,4,b===3?'#ff8a3a':'#ffe08a');if(b===5||b===7){const T=b===7?'#a8f0ff':'#e8c050',T2=b===7?'#7ac8e8':'#c8a040',G=b===7?'#e8c8ff':'#bfe6f8';px(g,x-2,base-h,w+4,1,T);px(g,x,base-2,w,2,T);px(g,x+w/2-4,base-10,8,1,T2);px(g,x+2,base-h+4,7,6,T);px(g,x+w-9,base-h+4,7,6,T);px(g,x+3,base-h+5,5,4,G);px(g,x+w-8,base-h+5,5,4,G);if(b===7){px(g,x+w/2-1,base-h-14,2,5,'#a8f0ff');px(g,x+w/2,base-h-16,1,2,'#ffffff')}}}
 // market stall center
 const mx=106;px(g,mx,base-14,28,14,'#7a4a24');px(g,mx,base-14,28,2,'#9a6a34');for(let i=0;i<7;i++)px(g,mx-2+i*4,base-22,4,6,i%2?'#f4f0e0':['#c83a3a','#3a7ac8','#3aa060','#c83a6a','#c83a3a','#e8c050','#e8c050','#9a6ad0'][b]);
 px(g,mx+3,base-17,3,3,'#d83a3a');px(g,mx+9,base-17,3,3,'#c8a060');px(g,mx+16,base-17,4,3,'#8b5a2b');px(g,mx+22,base-17,3,3,'#ffd040');
 // sign posts
 px(g,88,base-16,2,16,'#5a3818');px(g,82,base-20,14,7,'#a8743c');px(g,84,base-18,10,1,'#5a3818');px(g,84,base-16,8,1,'#5a3818');
 px(g,152+18,base-12,2,12,'#5a3818');px(g,148+18,base-16,12,6,'#ffd75e');px(g,151+18,base-14,1,2,'#7a5420');px(g,155+18,base-14,1,2,'#7a5420');
 if(tw.forge){px(g,45,base-13,2,13,'#5a3818');px(g,40,base-20,12,7,'#3a3a40');px(g,42,base-18,7,2,'#c8ccd4');px(g,44,base-16,3,1,'#9aa0aa');px(g,43,base-15,5,1,'#9aa0aa');px(g,49,base-22,2,2,'#ff8a2a');px(g,50,base-23,1,1,'#ffd040')}
 if(tw.stable){px(g,134,base-6,14,1,'#7a5228');px(g,134,base-3,14,1,'#7a5228');px(g,134,base-7,1,7,'#5a3818');px(g,147,base-7,1,7,'#5a3818');px(g,140,base-16,2,16,'#5a3818');for(const [a,b2] of [[137,-23],[137,-22],[137,-21],[137,-20],[143,-23],[143,-22],[143,-21],[143,-20],[138,-19],[139,-18],[140,-18],[141,-18],[142,-19]])px(g,a,base+b2,2,1,'#c8ccd4');px(g,150,base-5,7,5,'#e8c860');px(g,150,base-5,7,1,'#fff0a0');px(g,152,base-3,3,1,'#c8a040')}
 if(tw.ships){px(g,140,base-16,2,16,'#c8a040');for(let i=-6;i<=6;i++){const hh=Math.round(3.5*Math.sqrt(Math.max(0,1-(i/6.5)**2)));px(g,141+i,base-27-hh,1,hh*2,Math.floor((i+6)/3)%2?'#e8c050':'#f8f4e8')}px(g,136,base-21,11,2,'#8b5a2b');px(g,137,base-19,9,1,'#5e3a1e')}
 if(tw.barber){px(g,219,base-17,4,1,'#c8c8c8');for(let i=0;i<12;i++)px(g,220,base-16+i,2,1,['#e83a3a','#f4f4f4','#3a6ad0'][(i>>1)%3]);px(g,219,base-4,4,1,'#c8c8c8');px(g,220,base-3,2,3,'#5a5a60')}
 if(b===3){px(g,4,base-26,2,26,'#3a2a2a');px(g,3,base-29,4,3,'#ff6a1a');px(g,234,base-26,2,26,'#3a2a2a');px(g,233,base-29,4,3,'#ff6a1a')}
 else{px(g,4,base-20,2,20,'#5a3818');px(g,2,base-22,6,3,'#ffd040');px(g,234,base-20,2,20,'#5a3818');px(g,232,base-22,6,3,'#ffd040')}}
function drawDecor(d,ox,oy){const x=Math.round(d.x-ox),y=Math.round(surfY(d.x)-oy);const r=d.r;const P=(a,b,w,h,c)=>px(X,x+a,y+b,w,h,c);
 if(d.b===0){if(r<.45){const h=10+Math.floor(r*20);P(-1,-h,3,h,'#6e4526');P(-7,-h-10,15,10,'#3f8a3a');P(-5,-h-13,11,3,'#4fa048');P(-3,-h-8,3,2,'#6cc04a')}else if(r<.7){P(-4,-4,9,4,'#3f8a3a');P(-3,-5,7,1,'#4fa048')}else if(r<.85){P(0,-3,1,3,'#3a8a2a');P(-1,-4,3,1,r>.78?'#ffd040':'#e870a0')}else{P(-3,-3,6,3,'#8a8a90');P(-2,-4,4,1,'#a8a8b0')}}
 else if(d.b===1){if(r<.6){const h=14+Math.floor(r*24);P(0,-4,2,4,'#4a3020');for(let i=0;i<h;i++){const w=Math.floor((i/h)*8)+1;P(1-w,-4-h+i,w*2,1,i%4===0?'#e8f0f8':'#2f5a48')}}else if(r<.75){P(-3,-6,7,6,'#ffffff');P(-2,-10,5,4,'#ffffff');P(0,-9,1,1,'#000');P(1,-8,2,1,'#ff8a2a')}else{P(-4,-3,8,3,'#ffffff');P(-3,-4,6,1,'#e8f0f8')}}
 else if(d.b===2){if(r<.5){const w=6+Math.floor(r*14);P(-w/2,-w*.6,w,Math.round(w*.6),'#6a6c78');P(-w/2,-w*.6,w,1,'#9aa0a8');P(-w/2+2,-w*.3,2,1,'#4a4c58')}else if(r<.7){P(0,-12,2,12,'#5a4a3a');P(-3,-10,3,1,'#5a4a3a');P(2,-8,3,1,'#5a4a3a')}else{P(-1,-3,3,3,'#3a7a3a')}}
 else if(d.b===7){if(r<.35){P(-2,-3,1,3,'#9a7ad0');P(0,-4,1,4,'#c8a8f0');P(2,-3,1,3,'#9a7ad0')}else if(r<.55){P(0,-5,1,5,'#9a7ad0');P(-1,-7,3,2,r<.45?'#ffd0a0':'#a8f0ff');P(0,-7,1,1,'#ffffff')}
  else if(r<.72){P(-2,-7,3,7,'#a8f0ff');P(-1,-9,1,2,'#ffffff');P(1,-5,2,5,'#7ac8e8')}else if(r<.88){P(0,-12,2,12,'#d4bea4');P(-5,-17,12,6,'#e8c8ff');P(-3,-19,8,2,'#f4e4ff');P(-5,-12,12,1,'#c8a8f0')}else{P(0,-14,1,14,'#7ac8e8');P(-1,-16,3,2,'#a8f0ff');P(0,-17,1,1,'#ffffff')}}
 else if(d.b===5){if(r<.35){P(-2,-3,1,3,'#3ab8a8');P(0,-4,1,4,'#5ee0c8');P(2,-3,1,3,'#3ab8a8')}else if(r<.55){P(0,-5,1,5,'#3ab8a8');P(-1,-7,3,2,r<.45?'#ffc8ec':'#fff4b0');P(0,-7,1,1,'#ffffff')}
  else if(r<.72){P(-2,-6,3,6,'#f4fbff');P(-1,-8,1,2,'#ffffff');P(1,-4,2,4,'#c8dcf0')}else if(r<.88){P(0,-12,2,12,'#c8b090');P(-5,-17,12,6,'#7ee8d8');P(-3,-19,8,2,'#a8f4e8');P(-5,-12,12,1,'#5ec8b8')}else{P(0,-14,1,14,'#c8a040');P(-1,-16,3,2,'#ffe08a');P(0,-17,1,1,'#ffffff')}}
 else if(d.b===4){if(r<.3){const h=12+Math.floor(r*30);P(0,-h,2,h,'#2a2422');P(-4,-h+4,4,1,'#2a2422');P(-5,-h+2,1,2,'#2a2422');P(2,-h+7,4,1,'#2a2422');P(5,-h+5,1,2,'#2a2422')}
  else if(r<.5){P(-4,-6,4,6,'#7a726c');P(-4,-6,4,1,'#9a928a');P(1,-11,3,11,'#7a726c');P(1,-11,3,1,'#9a928a');P(-1,-2,7,2,'#5a524e')}
  else if(r<.68){P(-4,-9,9,1,'#6a3a22');P(-4,-1,9,1,'#6a3a22');P(-5,-8,1,7,'#6a3a22');P(5,-8,1,7,'#6a3a22');P(0,-8,1,7,'#8a5a3a');P(-4,-5,9,1,'#8a5a3a');P(-1,-6,3,3,'#5a524e')}
  else if(r<.84){P(-3,-3,5,3,'#e8e0d0');P(-2,-4,3,1,'#e8e0d0');P(-2,-2,1,1,'#2a2422');P(0,-2,1,1,'#2a2422');P(3,-1,5,1,'#d8d0c0')}
  else{P(-5,-3,10,3,'#5a3a2a');P(-3,-6,6,3,'#7a4a30');P(-1,-8,2,2,'#8a8f98');if(Math.sin(menuT*2+d.k)>.4)P(0,-11-Math.floor((menuT*6+d.k)%4),1,1,'#777')}}
 else if(d.b>=8)auDecor(d,P); // World 2 autumn (world2/capital.js)
 else{if(r<.4){P(0,-12,2,12,'#1a1010');P(-3,-9,3,1,'#1a1010');P(2,-7,3,1,'#1a1010')}else if(r<.75){const w=6+Math.floor(r*8);P(-w/2,-4,w,4,'#2a1c1c');P(-w/2+1,-2,2,1,'#ff6a1a')}else{P(-2,-2,4,2,'#3a2626');if(Math.sin(menuT*3+d.k)>.3)P(0,-6-Math.floor((menuT*8+d.k)%5),1,1,'#888')}}}
