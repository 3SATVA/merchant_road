'use strict';
// World 2 sky trees: decoration only (nothing is solid, drawn behind foes and the player, like World 1 decor trees).
// 3 variants (puff tree, crystal pine, blossom willow) x 3 sizes x 3 palettes (teal isles / lilac isles / autumn), each pre-rendered once to a small canvas.
const TREEW=32,TREEH=44,TREEC={};
const TREEPAL=[{tr:'#c8b090',tr2:'#a89070',g:['#3ab8a8','#5ee0c8','#2a9888'],c:['#7de0ff','#c8f6ff','#4ab0d0'],bl:'#ffc8ec'},
 {tr:'#d4bea4',tr2:'#b49e84',g:['#9a7ad0','#c8a8f0','#7a5ab0'],c:['#e8c8ff','#ffffff','#b890e8'],bl:'#ffd0a0'},
 {tr:'#7a5038',tr2:'#5a3a28',g:['#d8602a','#f0a040','#a83a22'],c:['#c87a2a','#f0b050','#8a4a1a'],bl:'#ffe070'}]; // 2 = autumn wilds + Aldenreach
// m = 2 draws a tree twice as big with the same 1px detail (the autumn wilds' trees); 1 everywhere else
function treeArt(g,v,pl,s,m){const Q=TREEPAL[pl],B=TREEH*m,cx=(TREEW*m)>>1,F=(x,y,w,h,c)=>px(g,cx+x,B+y,w,h,c),tw=m>1?3:2;
 if(v===0){const th=(10+s*4)*m,r=(4+s*1.5)*m,disc=(x0,y0,R,c)=>{for(let dy=-Math.floor(R);dy<=R;dy++){const w=Math.round(Math.sqrt(Math.max(0,R*R-dy*dy)));F(Math.round(x0)-w,Math.round(y0)+dy,2*w+1,1,c)}};
  F(-1,-th,tw,th,Q.tr);F(0,-th,tw-1,th,Q.tr2);F(tw-1,-th+3*m,2,1,Q.tr);if(m>1){F(-3,-2,2,2,Q.tr);F(tw,-2,2,2,Q.tr2)}
  const L=[[0,-th-r,r],[-r*.85,-th-r*.35,r*.72],[r*.85,-th-r*.4,r*.75]];
  for(const [x,y,R] of L)disc(x,y+m,R,Q.g[2]);for(const [x,y,R] of L)disc(x,y,R,Q.g[0]);for(const [x,y,R] of L)disc(x-R*.3,y-R*.3,R*.45,Q.g[1]);F(Math.round(-r*.4),Math.round(-th-r*1.7),1,1,'#ffffff')}
 else if(v===1){const th=(4+s)*m,n=(3+s)*m,h=m>1?4:5;F(-1,-th,tw,th,Q.tr2);let y=-th;
  for(let i=0;i<n;i++){const w=(m>1?2:2)*(n-i)+4*m;F(-(w>>1),y-h,w,h,Q.c[0]);F(-(w>>1),y-1,w,1,Q.c[2]);F(-(w>>1)+1,y-h,Math.max(1,(w>>1)-1),1,Q.c[1]);y-=h-1}
  F(-1,y-3*m,2*m-(m>1?1:0),3*m,Q.c[0]);F(-1,y-3*m,1,1,Q.c[1])}
 else{const th=(12+s*4)*m,w=(14+s*4)*m;F(-1,-th,tw,th,Q.tr);F(0,-th+2,tw-1,th-2,Q.tr2);F(tw-1,-th+3*m,2,1,Q.tr);
  F(-(w>>1),-th-3*m,w,4*m,Q.g[0]);F(-(w>>1)+2*m,-th-5*m,w-4*m,2*m,Q.g[0]);F(-(w>>1)+2*m,-th-5*m,w-4*m,1,Q.g[1]);F(-(w>>1),-th-3*m,w,1,Q.g[1]);
  for(let j=0;j<w;j+=2){const l=(2+Math.round(hash(j*1.7+v+s)*(4+s)))*m;F(-(w>>1)+j,-th+m,1,l,j%4?Q.g[2]:Q.g[0])}
  for(const [a,b] of [[-3,-th-4],[2,-th-2],[-(w>>1)+1,-th-2],[(w>>1)-2,-th-3]])F(a*m,b*m+(m-1)*-2,1,1,Q.bl);if(m>1)for(const [a,b] of [[-8,-th-6],[9,-th-8],[-14,-th-3],[13,-th-4]])F(a,b,1,1,Q.bl)}}
function treeImg(v,pl,s,m){m=m||1;const k=v*9+pl*3+s+(m>1?100:0);let c=TREEC[k];if(!c){c=document.createElement('canvas');c.width=TREEW*m;c.height=TREEH*m;treeArt(c.getContext('2d'),v,pl,s,m);TREEC[k]=c}return c}
const SKYTREES=[],AUSETX=[[12545,12720],[13500,13640],[15960,16070]]; // autumn set pieces (world2/autumnfoes.js drawAuSet) the big trees keep clear of
let HOMETREES=null;
function flatAt(x){return Math.abs(surfY(x+5)-surfY(x-5))<=3}
function treePick(L,x,k,pl){const h=hash(k*5.3+x*.01);L.push({x:Math.round(x),v:h<.4?0:h<.7?1:2,s:Math.floor(hash(k*2.9+x*.03)*3),pl,m:pl===2?2:1})} // autumn trees are drawn 2x (the capital's garden trees inside the walls stay small)
// combat islands: clear of the landing strips, the reward at the centre and ledges
function isleTrees(i){if(SKYTREES[i])return SKYTREES[i];const I=SKYISLES[i],L=[],rx=rwX(i);let x=I.x0+34+hash(i*3.1)*40,k=i*40;
 const big=!!I.au;while(x<I.x1-34){if(Math.abs(x-rx)>(big?50:36)&&!(big&&AUSETX.some(([a,b])=>x>a-26&&x<b+26))&&skyAt(x-8)===i&&skyAt(x+8)===i&&flatAt(x))treePick(L,x,k,I.au?(I.au===2&&hash(x*.37)>(x-I.x0)/(I.x1-I.x0)*1.6?1:2):I.top?1:0);x+=55+hash(k*1.91+i)*80;k++}
 return SKYTREES[i]=L}
// home islands (Skyhaven, Sunspire): only on the open ground between towns and docks
function homeTrees(){if(HOMETREES)return HOMETREES;const L=[];let k=500;
 for(const I of ISLES){let x=I.x0+60;while(x<I.x1-60){if(!townAt(x,150)&&WORLDDEF[1].decorOK(x)&&flatAt(x)&&!DECOR.some(d=>Math.abs(d.x-x)<(biomeAt(x)>=8?22:12)))treePick(L,x,k,biomeAt(x)>=8?2:biomeAt(x)===7?1:0);x+=70+hash(k*1.37)*100;k++}}
 return HOMETREES=L}
function drawTreeList(L,ox,oy){for(const t of L){const x=Math.round(t.x-ox);if(x<-TREEW*2||x>VW+TREEW*2)continue;const c=treeImg(t.v,t.pl,t.s,t.m);X.drawImage(c,x-(c.width>>1),Math.round(surfY(t.x)-oy)-c.height)}}
function drawHomeTrees(ox,oy){if(WI===1)drawTreeList(homeTrees(),ox,oy)}
