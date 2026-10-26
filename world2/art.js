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
// Carriage (Aldenreach carrier store, 75 cargo): a burgundy-lacquered coach with gold trim, a lit window, a roof rack (cargo colours), two big
// spoked wheels and white-and-gold wings. Same contract as drawWingCart (x,y = ground under the middle; flap = wings beating, hit = white flash)
function drawCarriage(c,x,y,dir,fill,t,flap,hit){const R1=[],R2=[];let L=R1;const P=(xo,yo,w,h,col)=>L.push([dir>0?x+xo:x-xo-w,y+yo,w,h,hit?'#ffffff':col]);
 const f=flap?flapF(t,.08):0,bob=flap?FLAPBOB[f]:0,BD='#8a2a32',BD2='#6a1e26',BH='#a8404a',GD='#e8b040',GD2='#ffe070',WD='#5e3a1e';
 if(flap)for(const r of wingFrame((f+1)%6,11,3))P(-2+r[0],-17+bob+r[1],r[2],r[3],['#e8dcc0','#d8b878','#b8904a'][r[4]]);
 L=R2;
 // body: arched roof, panels, window, door, gold trim, footboard
 for(let i=0;i<24;i++){const a=Math.min(i,23-i),rh=a<2?1:a<5?2:3;P(-12+i,-18-rh+bob,1,rh,i<12?'#5a2a30':'#4a2026')}
 P(-12,-18+bob,24,12,BD);P(-12,-18+bob,24,1,BH);P(-12,-7+bob,24,1,BD2);P(-12,-18+bob,1,12,BD2);P(11,-18+bob,1,12,BD2);
 P(-12,-16+bob,24,1,GD);P(-12,-8+bob,24,1,GD);
 P(-9,-15+bob,6,5,'#3a2a2a');P(-8,-14+bob,4,3,'#ffd070');P(-8,-14+bob,1,1,'#fff0b8');P(-6,-14+bob,1,3,'#c89040');
 P(1,-15+bob,6,7,BD2);P(2,-14+bob,4,5,BH);P(5,-11+bob,1,1,GD2);
 P(-13,-6+bob,26,1,WD);P(9,-6+bob,6,1,WD);P(14,-7+bob,1,3,GD); // footboard + shaft to the horse, gold hitch ring
 // roof rack: cargo colours
 const fl=fill&&fill.length?fill:null;if(fl)for(let i=0;i<Math.min(5,fl.length);i++)P(-10+i*4,-24+bob,3,3,fl[i]);P(-11,-21+bob,22,1,'#4a3226');
 // wheels: 4px spoked, gold hubs
 const wr=flap?0:Math.round(t*8)%2;for(const q of [-10,5]){P(q,-5+bob,6,5,'#2a1810');P(q+1,-6+bob,4,1,'#2a1810');P(q+1,-4+bob,4,3,'#6a4020');P(q+2-wr,-3+bob,1,1,'#2a1810');P(q+3+wr,-3+bob,1,1,'#2a1810');P(q+2,-3+bob,2,1,GD)}
 if(flap)for(const r of wingFrame(f,13,3))P(-4+r[0],-16+bob+r[1],r[2],r[3],['#ffffff','#f4e4b8','#e8b040'][r[4]]);
 else{P(-9,-19+bob,14,2,'#ffffff');P(-12,-20+bob,4,2,'#f4e4b8');P(-9,-17+bob,13,1,'#e8b040')}
 for(const Lr of [R1,R2]){for(const r of Lr)if(r[4]!==BD&&r[4]!=='#2a1810')px(c,r[0]-1,r[1]-1,r[2]+2,r[3]+2,'#3a2a2a');for(const r of Lr)px(c,r[0],r[1],r[2],r[3],r[4])}}
