'use strict';
// the Winged Cart: little sky wagon with the same 6-frame wing flap as the pegasus; folded wings when parked/rolling
function drawWingCart(c,x,y,dir,fill,t,flap,hit){const R1=[],R2=[];let L=R1;const P=(xo,yo,w,h,col)=>L.push([dir>0?x+xo:x-xo-w,y+yo,w,h,hit?'#ffffff':col]);
 const f=flap?flapF(t,.08):0,bob=flap?FLAPBOB[f]:0;
 if(flap)for(const r of wingFrame((f+1)%6,9,3))P(-1+r[0],-12+bob+r[1],r[2],r[3],['#d4dcf0','#a8b4d4','#8a98c0'][r[4]]);
 L=R2;P(-9,-11+bob,18,7,'#8b5a2b');P(-9,-11+bob,18,1,'#a8743c');P(-9,-5+bob,18,1,'#5e3a1e');for(const q of [-5,0,5])P(q,-10+bob,1,5,'#6e4526');P(9,-7+bob,5,1,'#5e3a1e');P(13,-8+bob,1,3,'#c8a040');
 const fl=fill&&fill.length?fill:null;if(fl)for(let i=0;i<Math.min(4,fl.length);i++)P(-8+i*4,-14+bob,3,3,fl[i]);
 const wr=flap?0:Math.round(t*8)%2;for(const q of [-7,3]){P(q,-4+bob,4,4,'#3a2414');P(q+1,-3+bob,2,2,wr?'#c8a040':'#8a6a30')}
 if(flap)for(const r of wingFrame(f,11,3))P(-3+r[0],-11+bob+r[1],r[2],r[3],['#ffffff','#c4d0ea','#94a4cc'][r[4]]);
 else{P(-8,-13+bob,13,2,'#ffffff');P(-11,-14+bob,4,2,'#e4ecf6');P(-8,-11+bob,12,1,'#a8bcd8')}
 for(const Lr of [R1,R2]){for(const r of Lr)if(r[4]!=='#8b5a2b'&&r[4]!=='#3a2414')px(c,r[0]-1,r[1]-1,r[2]+2,r[3]+2,'#3a2a2a');for(const r of Lr)px(c,r[0],r[1],r[2],r[3],r[4])}}
