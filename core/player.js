'use strict';
const SKINS=['#f1c28a','#ffdcb8','#e0a878','#c08050','#8a5a34','#5a3a22'].map(c=>[c,mixc(c,'#5a2010',.22)]);
const HAIRC=['#6b3d1f','#1e1612','#e0c060','#b0402a','#e8e8f0','#4a6ad0'];
// hair rects relative to head (head = x -3..2, y -16..-12, facing +x)
const HAIRS=[{n:'Short',r:[[-3,-17,6,1],[-3,-16,1,3],[-2,-16,3,1]]},{n:'Long',r:[[-3,-17,6,1],[-4,-16,2,7],[-2,-16,4,1],[-3,-10,1,1]]},{n:'Tail',r:[[-3,-17,6,1],[-3,-16,1,3],[-2,-16,3,1],[-5,-16,2,1],[-6,-15,2,4]]},
 {n:'Spiky',r:[[-3,-18,1,1],[-1,-18,1,1],[1,-18,1,1],[-3,-17,6,1],[-3,-16,1,3],[-2,-16,4,1]]},{n:'Bun',r:[[-3,-17,6,1],[-3,-16,1,2],[-2,-16,2,1],[-3,-20,3,3]]},{n:'Bald',r:[]}];
const DEFLOOK={skin:0,body:0,hair:0,hc:0};
function fixLook(l){l=Object.assign({},DEFLOOK,l&&typeof l==='object'?l:{});const ok=(v,n)=>Number.isInteger(v)&&v>=0&&v<n;if(!ok(l.skin,SKINS.length))l.skin=0;if(!ok(l.body,2))l.body=0;if(!ok(l.hair,HAIRS.length))l.hair=0;if(!ok(l.hc,HAIRC.length))l.hc=0;return {skin:l.skin,body:l.body,hair:l.hair,hc:l.hc}}
function drawPlayer(c,x,y,dir,t,walking,air,flash,wep,atk,o){
 const P=(xo,yo,w,h,col)=>{px(c,dir>0?x+xo:x-xo-w,y+yo,w,h,flash?'#ffffff':col)};
 const ph=walking?Math.sin(t*14):0;const la=Math.round(ph*1.5),lb=-la;
 if(air){P(-3,-6,2,4,'#4a3b2a');P(1,-5,2,4,'#4a3b2a');P(-4,-2,3,1,'#2a1d14');P(1,-1,3,1,'#2a1d14')}
 else{P(-3+la,-5,2,4,'#4a3b2a');P(1+lb,-5,2,4,'#4a3b2a');P(-3+la,-1,3,1,'#2a1d14');P(1+lb,-1,3,1,'#2a1d14')}
 {const FT=o&&o.eq&&o.eq.feet;if(FT){const ft=air?[[-4,-2],[1,-1]]:[[-3+la,-1],[1+lb,-1]];for(const [fx,fy] of ft){if(FT==='witchboots'){P(fx,fy-2,3,3,'#5a3a7a');P(fx,fy-2,3,1,'#c060ff');P(fx+3,fy,1,1,'#c060ff')}else if(FT==='cultboots'){P(fx,fy-2,3,3,'#b8282a');P(fx,fy-2,3,1,'#d84a3a');P(fx,fy,3,1,'#7a1418');P(fx+3,fy,1,1,'#e8b040')}else if(FT==='crystalboots'){P(fx,fy-2,3,3,'#5ac8e0');P(fx,fy-2,3,1,'#c8faff');P(fx+1,fy-1,1,1,'#ffffff');P(fx+3,fy,1,1,'#2a7aa0')}else{P(fx,fy-2,3,3,'#8a8a8a');P(fx,fy-2,3,1,'#b8b8c0');P(fx+3,fy,1,1,'#6a6a6a')}}}}
 const bob=walking&&Math.abs(ph)>.7?-1:0;
 const EQ=(o&&o.eq)||{head:'tophat'},LK=(o&&o.look)||DEFLOOK,SK=SKINS[LK.skin]||SKINS[0];
 if(LK.body===1){P(-3,-11+bob,6,4,'#3a6ea5');P(-3,-11+bob,6,1,'#5a8ec5');P(-4,-7+bob,8,3,'#3a6ea5');P(-4,-5+bob,8,1,'#2e5a8a')}else{P(-4,-11+bob,8,6,'#3a6ea5');P(-4,-11+bob,8,1,'#5a8ec5')}if(EQ.chest==='witchrobe'){P(-4,-11+bob,8,9,'#5a3a7a');P(-4,-11+bob,8,1,'#c060ff');P(-1,-10+bob,2,5,'#4a2e6a');P(-5,-4+bob,10,1,'#4a2e6a');P(-4,-6+bob,8,1,'#c060ff')}
 else if(EQ.chest==='cultrobe'){P(-4,-11+bob,8,9,'#b8282a');P(-4,-11+bob,8,1,'#d84a3a');P(-4,-11+bob,1,8,'#7a1418');P(1,-10+bob,1,6,'#d84a3a');P(-5,-4+bob,10,2,'#b8282a');P(-5,-3+bob,10,1,'#e8b040');P(-4,-7+bob,8,1,'#e8b040')}
 else if(EQ.chest==='crystalchest'){P(-4,-11+bob,8,4,'#5ac8e0');P(-4,-11+bob,8,1,'#c8faff');P(-5,-11+bob,2,2,'#2a7aa0');P(-2,-10+bob,3,2,'#a8f4ff');P(-1,-10+bob,1,1,'#ffffff');P(2,-9+bob,1,1,'#3a9ac8')}
 else if(EQ.chest==='stonechest'){P(-4,-11+bob,8,4,'#8a8a8a');P(-4,-11+bob,8,1,'#c8c8c8');P(-5,-11+bob,2,2,'#6a6a6a');P(-1,-10+bob,2,2,'#5e5e5e')}P(-4,-7+bob,8,1,'#5a3a1a');P(0,-7+bob,1,1,'#d8b040');
 P(-3,-16+bob,6,5,SK[0]);P(1,-14+bob,1,1,'#1a1420');P(3,-13+bob,1,1,SK[1]);if(LK.body===1){P(2,-15+bob,1,1,'#1a1420');P(1,-12+bob,1,1,'#c85a5a')}
 const HC=HAIRC[LK.hc]||HAIRC[0];for(const r of (HAIRS[LK.hair]||HAIRS[0]).r)P(r[0],r[1]+bob,r[2],r[3],HC);
 if(EQ.head==='stonehelm'){P(-4,-19+bob,8,4,'#8a8a8a');P(-3,-20+bob,6,1,'#8a8a8a');P(-3,-20+bob,4,1,'#c8c8c8');P(-4,-16+bob,8,1,'#5e5e5e');P(-4,-15+bob,1,3,'#6a6a6a');P(1,-18+bob,2,1,'#7de0ff')}
 else if(EQ.head==='cultmask'){P(-4,-18+bob,5,7,'#7a1418');P(-3,-19+bob,4,1,'#7a1418');P(-1,-17+bob,5,5,'#f0c040');P(0,-18+bob,3,1,'#f0c040');P(0,-12+bob,3,1,'#f0c040');P(4,-16+bob,1,3,'#f0c040');P(1,-15+bob,2,1,'#3a1a14');P(1,-13+bob,1,1,'#c08a20');for(const [a,b] of [[1,-20],[-1,-19],[3,-19],[5,-17],[6,-14],[5,-11],[3,-10],[-1,-11]])P(a,b+bob,1,1,(a+b)%2?'#ffe080':'#e8b040')}
 else if(EQ.head==='crystalhelm'){P(-4,-19+bob,8,4,'#5ac8e0');P(-3,-20+bob,6,1,'#5ac8e0');P(-3,-20+bob,4,1,'#c8faff');P(-1,-22+bob,2,2,'#a8f4ff');P(-1,-22+bob,1,1,'#ffffff');P(-4,-16+bob,8,1,'#2a7aa0');P(-4,-15+bob,1,3,'#3a9ac8');P(1,-18+bob,2,1,'#ffffff')}
 else if(EQ.head==='witchhat'){P(-6,-17+bob,12,1,'#3a2450');P(-3,-20+bob,6,3,'#4a2e6a');P(-3,-18+bob,6,1,'#c060ff');P(-2,-22+bob,4,2,'#4a2e6a');P(-2,-24+bob,2,2,'#4a2e6a');P(-3,-25+bob,1,1,'#4a2e6a')}
 else if(EQ.head==='tophat'){P(-5,-17+bob,10,1,'#6a2424');P(-3,-20+bob,6,3,'#8a2b2b');P(-3,-18+bob,6,1,'#d8b040')}
 // arm + weapon
 const w=WEAPONS[wep];let ang=-1.1,ext=0;
 if(w.lance){ang=atk>0?.04:-1.05;ext=atk>0?2:0}
 else if(atk>0){const k=1-atk;if(w.ranged){ang=0;ext=k<.3?-1:0}else if(wep==='frostspear'){ang=-.05;ext=Math.round(Math.sin(k*Math.PI)*6)}else ang=lerp(-2.0,.7,smooth(k))}
 else if(w.ranged)ang=-.25;
 const hx=2+ext+(atk>0&&wep==='fists'?3:0);P(2,-11+bob,2,3,'#3a6ea5');P(hx,-8+bob,2,2,SK[0]);
 if(!flash)drawWeapon(c,dir>0?x+hx+1:x-hx-2,y-8+bob,dir,ang,wep,t,w.flail?{k:atk>0?1-atk:-1}:null);
}
