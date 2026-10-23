'use strict';
// weapon pixel lines: [length, colors fn]
function wepPixels(id){switch(id){
 case 'dagger':return ['#5a3818','#5a3818','#d8b040','#d0d8e0','#e8eef4','#e8eef4','#ffffff'];
 case 'sword':return ['#5a3818','#5a3818','#d8b040','#c8d0dc','#d8e0ea','#d8e0ea','#d8e0ea','#d8e0ea','#e8eef4','#e8eef4','#ffffff'];
 case 'frostspear':return ['#5a4a6a','#5a4a6a','#6a5a7a','#6a5a7a','#6a5a7a','#6a5a7a','#6a5a7a','#6a5a7a','#6a5a7a','#6a5a7a','#9fe8ff','#9fe8ff','#e0faff','#ffffff'];
 case 'warhammer':return ['#5a3818','#5a3818','#6a4420','#6a4420','#6a4420','#6a4420','#6a4420','#6a4420','#6a4420'];
 case 'leafstaff':return ['#8a6a3a','#8a6a3a','#9a7a44','#9a7a44','#9a7a44','#9a7a44','#9a7a44','#9a7a44','#9a7a44','#9a7a44'];
 case 'firestaff':return ['#4a2a18','#4a2a18','#5a3418','#5a3418','#5a3418','#5a3418','#5a3418','#5a3418','#5a3418','#5a3418'];
 case 'flamesword':return ['#5a3818','#5a3818','#d8b040','#a8301a','#c83a1a','#e8501a','#ff6a1a','#ff8a2a','#ffa030','#ffd040','#fff0a0'];
 case 'obsidian':return ['#3a2a3a','#3a2a3a','#c04aa0','#2a1a2e','#3a2440','#3a2440','#3a2440','#3a2440','#4a2e52','#4a2e52','#e070d0'];
 case 'windstaff':return ['#a89070','#a89070','#c8b090','#c8b090','#c8b090','#c8b090','#c8b090','#c8b090','#c8b090','#c8b090'];
 case 'cogflail':return ['#5a3818','#5a3818','#6a4420','#7a5228','#9aa0aa'];
 case 'crossbow':return ['#6a4420','#6a4420','#6a4420','#7a5228','#7a5228','#7a5228','#9aa0aa'];
 case 'woodlance':return ['#5a3818','#5a3818','#5a3818','#a8743c','#8b5a2b','#a8743c','#8b5a2b','#a8743c','#8b5a2b','#a8743c','#8b5a2b','#a8743c','#c8a060','#d8b080','#f0d8a8'];
 case 'ironlance':return ['#3a2414','#3a2414','#3a2414','#7a5228','#8a6030','#7a5228','#8a6030','#7a5228','#8a6030','#7a5228','#9aa0aa','#b8c0cc','#d0d8e0','#e8eef4','#ffffff'];
 case 'magmalance':return ['#2a1a1a','#2a1a1a','#2a1a1a','#3a2626','#4a3030','#3a2626','#4a3030','#3a2626','#4a3030','#a8301a','#e8501a','#ff6a1a','#ff8a2a','#ffd040','#fff0a0'];
 default:return []}}
// Cog Flail head: a spiked gear (World 1 style: flat tones, highlight row, dark underside, no outline), brass hub
function drawCog(c,x,y){x=Math.round(x);y=Math.round(y);const M='#8a909a',HL='#c8ccd4',DK='#5a606a',SP='#d0d8e0';
 px(c,x-1,y-3,3,1,'#b8c0cc');px(c,x-1,y+3,3,1,'#6a707a');px(c,x-3,y-1,1,3,M);px(c,x+3,y-1,1,3,DK);for(const [a,b] of [[-3,-3],[3,-3],[-3,3],[3,3]])px(c,x+a,y+b,1,1,SP);
 px(c,x-2,y-2,5,5,M);px(c,x-2,y-2,5,1,HL);px(c,x-2,y+2,5,1,DK);px(c,x-1,y-1,2,1,'#ffffff');px(c,x,y,1,1,'#d8b040');px(c,x+1,y+1,1,1,'#a8801a')}
// chain + head from the grip tip: fl null = straight out (icons), fl.k<0 = hanging idle, fl.k 0..1 = swing toward FAIM (the auto-aimed foe)
function drawFlail(c,ex,ey,dir,ang,t,fl){let hx,hy;const ca=Math.cos(ang),sa=Math.sin(ang);
 if(!fl){hx=ex+ca*dir*6;hy=ey+sa*6}else if(fl.k<0){hx=ex+dir*(1+Math.round(Math.sin((t||0)*3)));hy=ey+7}
 else{const k=fl.k,len=4+(FAIM.r-4)*Math.sin(Math.PI*Math.min(1,k*1.2)),th=lerp(-2.4,FAIM.a,smooth(Math.min(1,k*2.2)));hx=ex+dir*Math.cos(th)*len;hy=ey+Math.sin(th)*len;
  if(k>.15&&k<.85){c.globalAlpha=.35;for(const j of [1,2]){const k2=Math.max(0,k-.07*j),l2=4+(FAIM.r-4)*Math.sin(Math.PI*Math.min(1,k2*1.2)),t2=lerp(-2.4,FAIM.a,smooth(Math.min(1,k2*2.2)));px(c,Math.round(ex+dir*Math.cos(t2)*l2)-1,Math.round(ey+Math.sin(t2)*l2)-1,3,3,'#e8eef4')}c.globalAlpha=1}}
 const n=Math.max(1,Math.round(Math.hypot(hx-ex,hy-ey)/2));for(let i=1;i<n;i++)px(c,Math.round(ex+(hx-ex)*i/n),Math.round(ey+(hy-ey)*i/n),1,1,i%2?'#9aa0aa':'#6a707a');drawCog(c,hx,hy)}
function drawWeapon(c,hx,hy,dir,ang,id,t,fl){
 const P=wepPixels(id);if(!P.length)return;const ca=Math.cos(ang),sa=Math.sin(ang);let ex=hx,ey=hy;
 if(WEAPONS[id]&&WEAPONS[id].lance)for(let i=3;i<P.length;i++)px(c,hx+ca*i*dir-sa*dir,hy+sa*i+ca,1,1,'#1e140c'); // dark underside so the lance reads against the horse
 for(let i=0;i<P.length;i++){const x=hx+ca*i*dir,y=hy+sa*i;px(c,x,y,1,1,P[i]);if(id==='sword'||id==='obsidian'||id==='flamesword'){if(i>2)px(c,x-sa*dir,y+ca,1,1,P[i])}ex=x;ey=y}
 const nx=-sa*dir,ny=ca;
 if(id==='warhammer'){for(let j=-3;j<=3;j++)for(let k=0;k<3;k++)px(c,ex+nx*j+ca*dir*k,ey+ny*j+sa*k,1,1,j===-3||j===3?'#6a707a':'#9aa0aa')}
 if(id==='crossbow'){const bx=hx+ca*dir*5,by=hy+sa*5;for(let j=-4;j<=4;j++)px(c,bx+nx*j-ca*dir*Math.abs(j)*.4,by+ny*j-sa*Math.abs(j)*.4,1,1,'#3a2a1a');}
 if(id==='flamesword'){const f=Math.floor((t||0)*12);for(let i=4;i<P.length;i+=2){const k=hash(i*3.1+f);if(k>.45){const x=hx+ca*i*dir-sa*dir*(k>.75?-1:2),y=hy+sa*i+ca*(k>.75?-1:2);px(c,x,y,1,1,k>.8?'#fff0a0':'#ff8a2a')}}}
 if(WEAPONS[id]&&WEAPONS[id].lance){const vx=hx+ca*dir*3,vy=hy+sa*3,vc=id==='ironlance'?'#9aa0aa':id==='magmalance'?'#5a3a3a':'#6e4526';for(let j=-2;j<=2;j++)px(c,vx+nx*j,vy+ny*j,1,1,Math.abs(j)===2?'#2a1a10':vc);
  if(id==='magmalance'){const f=Math.floor((t||0)*12);for(let i=9;i<P.length;i+=2){const k=hash(i*3.1+f);if(k>.5)px(c,hx+ca*i*dir-sa*dir*(k>.75?-1:1),hy+sa*i+ca*(k>.75?-1:1),1,1,k>.8?'#fff0a0':'#ff8a2a')}}}
 if(id==='cogflail')drawFlail(c,ex,ey,dir,ang,t,fl);
 if(id==='leafstaff'){px(c,ex-1,ey-1,3,3,'#3aa040');px(c,ex,ey-2,1,1,'#6cc04a');px(c,ex+1,ey,1,1,'#6cc04a');px(c,ex,ey,1,1,'#b8f080')}
 if(id==='windstaff'){const f=Math.floor((t||0)*8)%4,R=[[0,-2],[2,0],[0,2],[-2,0]][f];px(c,ex-1,ey-1,3,3,'#7fd4ea');px(c,ex-1,ey-1,2,2,'#bdeefa');px(c,ex,ey,1,1,'#ffffff');px(c,ex+R[0],ey+R[1],1,1,'#e8fbff')}
 if(id==='firestaff'){const f=(Math.floor((t||0)*10)%2);px(c,ex-1,ey-1,3,3,'#ff7a1a');px(c,ex,ey,1,1,f?'#fff0a0':'#ffd040')}
}
function drawHauler(c,x,y,dir,type,fill,wheel){if(type==='wingcart'){drawWingCart(c,x,y,dir,fill,wheel||0,false);return}
 // x,y = player feet (screen). returns nothing
 const P=(xo,yo,w,h,col)=>{px(c,dir>0?x+xo:x-xo-w,y+yo,w,h,col)};
 const wh=(cx,cy,r)=>{for(let a=0;a<12;a++){const an=a/12*Math.PI*2;P(cx+Math.round(Math.cos(an)*r),cy+Math.round(Math.sin(an)*r),1,1,'#2a1a10')}
  const s=wheel||0;for(let k=0;k<2;k++){const an=s+k*Math.PI/2;for(let i=-r+1;i<r;i++)P(cx+Math.round(Math.cos(an)*i),cy+Math.round(Math.sin(an)*i),1,1,'#7a5228')}P(cx,cy,1,1,'#c8a060')};
 const goods=(x0,y0,wd,n)=>{let k=0;for(let r=0;r<4&&k<n;r++)for(let i=0;i<Math.floor(wd/3)-r&&k<n;i++,k++){P(x0+i*3+r*1.5,y0-r*3-3,3,3,fill[k%fill.length])}};
 const n=fill.length;
 if(type==='backpack'){P(-7,-13,4,7,'#7a4a24');P(-7,-13,4,1,'#9a6a34');P(-6,-10,2,1,'#c8a060');if(n)goods(-7,-13,4,Math.min(n,1))}
 else if(type==='wheelbarrow'){P(4,-8,2,1,'#5a3818');P(6,-8,12,1,'#7a8088');P(6,-7,12,1,'#5a6068');P(7,-6,10,2,'#5a6068');P(8,-4,2,4,'#4a3018');wh(16,-3,3);goods(7,-8,11,Math.min(n,7))}
 else if(type==='smallwagon'){P(-8,-8,10,1,'#5a3818');P(-32,-11,24,6,'#8b5a2b');P(-32,-11,24,1,'#a8743c');P(-32,-8,24,1,'#6e4526');P(-32,-13,1,3,'#6e4526');P(-9,-13,1,3,'#6e4526');wh(-28,-4,4);wh(-13,-4,4);goods(-31,-11,22,Math.min(n,14))}
 else if(type==='bigwagon'){P(-10,-9,12,1,'#5a3818');P(-48,-13,38,8,'#7a4a24');P(-48,-13,38,1,'#9a6a34');P(-48,-9,38,1,'#5a3818');
  for(let i=0;i<34;i++){const hh=Math.round(Math.sin((i+1)/35*Math.PI)*11);P(-46+i,-13-hh,1,hh,i%8===0?'#b8a888':'#ece0c4')}
  if(n)goods(-12,-13,0,0);wh(-43,-5,5);wh(-17,-5,5);
  const fr=Math.min(1,n/50);if(n)P(-46,-14-Math.round(fr*3),5,Math.round(fr*3)+1,fill[0])}
}
const HAULURL={};HAULURL.wingcart=spriteURL(56,32,g=>drawWingCart(g,28,31,1,['#e8f4ff','#7de0ff','#ffb040'],.001,true));HORDER.forEach(id=>{HAULURL[id]=spriteURL(56,32,g=>{drawHauler(g,id==='wheelbarrow'?20:id==='backpack'?30:50,30,1,id,['#d83a3a','#c8a060','#8b5a2b','#ffd040','#a8b0bc'],.4);if(id==='backpack')drawPlayer(g,30,30,1,0,false,false,false,'fists',0)})});
const WEPURL={};const WEPC={};ICONORDER.forEach(id=>{const c=document.createElement('canvas');c.width=16;c.height=16;drawWeapon(c.getContext('2d'),3,13,1,-.78,id,0);WEPC[id]=c});ICONORDER.forEach(id=>{WEPURL[id]=spriteURL(16,16,g=>{if(id==='fists'){px(g,5,6,6,5,'#f1c28a');px(g,5,6,6,1,'#ffd8a8');px(g,6,8,1,1,'#c08a50');px(g,8,8,1,1,'#c08a50')}else drawWeapon(g,3,13,1,-.78,id,0)})});
