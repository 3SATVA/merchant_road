'use strict';
// World 2 sky trees: decoration only (nothing is solid, drawn behind foes and the player, like World 1 decor trees).
// 3 variants (puff tree, crystal pine, blossom willow) x 3 sizes x 2 palettes (teal isles / lilac isles), each pre-rendered once to a small canvas.
const TREEW=32,TREEH=44,TREEC={};
const TREEPAL=[{tr:'#c8b090',tr2:'#a89070',g:['#3ab8a8','#5ee0c8','#2a9888'],c:['#7de0ff','#c8f6ff','#4ab0d0'],bl:'#ffc8ec'},
 {tr:'#d4bea4',tr2:'#b49e84',g:['#9a7ad0','#c8a8f0','#7a5ab0'],c:['#e8c8ff','#ffffff','#b890e8'],bl:'#ffd0a0'}];
function treeArt(g,v,pl,s){const Q=TREEPAL[pl],B=TREEH,cx=TREEW>>1,F=(x,y,w,h,c)=>px(g,cx+x,B+y,w,h,c);
 if(v===0){const th=10+s*4,r=4+s*1.5,disc=(x0,y0,R,c)=>{for(let dy=-Math.floor(R);dy<=R;dy++){const w=Math.round(Math.sqrt(Math.max(0,R*R-dy*dy)));F(Math.round(x0)-w,Math.round(y0)+dy,2*w+1,1,c)}};
  F(-1,-th,2,th,Q.tr);F(0,-th,1,th,Q.tr2);F(1,-th+3,2,1,Q.tr);
  const L=[[0,-th-r,r],[-r*.85,-th-r*.35,r*.72],[r*.85,-th-r*.4,r*.75]];
  for(const [x,y,R] of L)disc(x,y+1,R,Q.g[2]);for(const [x,y,R] of L)disc(x,y,R,Q.g[0]);for(const [x,y,R] of L)disc(x-R*.3,y-R*.3,R*.45,Q.g[1]);F(Math.round(-r*.4),Math.round(-th-r*1.7),1,1,'#ffffff')}
 else if(v===1){const th=4+s,n=3+s;F(-1,-th,2,th,Q.tr2);let y=-th;
  for(let i=0;i<n;i++){const w=2*(n-i)+4,h=5;F(-(w>>1),y-h,w,h,Q.c[0]);F(-(w>>1),y-1,w,1,Q.c[2]);F(-(w>>1)+1,y-h,Math.max(1,(w>>1)-1),1,Q.c[1]);y-=h-1}
  F(-1,y-3,2,3,Q.c[0]);F(-1,y-3,1,1,Q.c[1])}
 else{const th=12+s*4,w=14+s*4;F(-1,-th,2,th,Q.tr);F(0,-th+2,1,th-2,Q.tr2);F(1,-th+3,2,1,Q.tr);
  F(-(w>>1),-th-3,w,4,Q.g[0]);F(-(w>>1)+2,-th-5,w-4,2,Q.g[0]);F(-(w>>1)+2,-th-5,w-4,1,Q.g[1]);F(-(w>>1),-th-3,w,1,Q.g[1]);
  for(let j=0;j<w;j+=2){const l=2+Math.round(hash(j*1.7+v+s)*(4+s));F(-(w>>1)+j,-th+1,1,l,j%4?Q.g[2]:Q.g[0])}
  for(const [a,b] of [[-3,-th-4],[2,-th-2],[-(w>>1)+1,-th-2],[(w>>1)-2,-th-3]])F(a,b,1,1,Q.bl)}}
function treeImg(v,pl,s){const k=v*9+pl*3+s;let c=TREEC[k];if(!c){c=document.createElement('canvas');c.width=TREEW;c.height=TREEH;treeArt(c.getContext('2d'),v,pl,s);TREEC[k]=c}return c}
const SKYTREES=[];let HOMETREES=null;
function flatAt(x){return Math.abs(surfY(x+5)-surfY(x-5))<=3}
function treePick(L,x,k,pl){const h=hash(k*5.3+x*.01);L.push({x:Math.round(x),v:h<.4?0:h<.7?1:2,s:Math.floor(hash(k*2.9+x*.03)*3),pl})}
// combat islands: clear of the landing strips, the reward at the centre and ledges
function isleTrees(i){if(SKYTREES[i])return SKYTREES[i];const I=SKYISLES[i],L=[],rx=rwX(i);let x=I.x0+34+hash(i*3.1)*40,k=i*40;
 while(x<I.x1-34){if(Math.abs(x-rx)>36&&skyAt(x-8)===i&&skyAt(x+8)===i&&flatAt(x))treePick(L,x,k,I.top?1:0);x+=55+hash(k*1.91+i)*80;k++}
 return SKYTREES[i]=L}
// home islands (Skyhaven, Sunspire): only on the open ground between towns and docks
function homeTrees(){if(HOMETREES)return HOMETREES;const L=[];let k=500;
 for(const I of ISLES){let x=I.x0+60;while(x<I.x1-60){if(!townAt(x,150)&&WORLDDEF[1].decorOK(x)&&flatAt(x)&&!DECOR.some(d=>Math.abs(d.x-x)<12))treePick(L,x,k,biomeAt(x)===7?1:0);x+=70+hash(k*1.37)*100;k++}}
 return HOMETREES=L}
function drawTreeList(L,ox,oy){for(const t of L){const x=Math.round(t.x-ox);if(x<-TREEW||x>VW+TREEW)continue;X.drawImage(treeImg(t.v,t.pl,t.s),x-(TREEW>>1),Math.round(surfY(t.x)-oy)-TREEH)}}
function drawHomeTrees(ox,oy){if(WI===1)drawTreeList(homeTrees(),ox,oy)}
