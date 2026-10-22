'use strict';
TOWNS.forEach((t,i)=>{t.i=i;t.w=t.w||0;t.biome=t.w?(t.x>ISLES[1].x0?7:5):biomeAt(t.x)});let WT=TOWNS.filter(t=>!t.w); // WT = towns of the current world
function rawH(x){if(WI===1)return 22+8*Math.sin(x/170)+4*Math.sin(x/53);
 const h0=6*Math.sin(x/190)+3*Math.sin(x/71);
 const h1=10*Math.sin(x/160)+5*Math.sin(x/57)+10;
 const m=clamp((x-6400)/3200,0,1);
 const h2=30*Math.sin(x/200)+9*Math.sin(x/83)+30+45*Math.sin(m*Math.PI);
 const h3=10*Math.sin(x/180)+5*Math.sin(x/63)+14;
 const h4=12*Math.sin(x/140)+6*Math.sin(x/43)+3*Math.sin(x/17)+18;
 const H=[h0,h1,h2,h3,h4];let b=biomeAt(x);
 for(let i=1;i<NB;i++){const d=x-BOUNDS[i];if(Math.abs(d)<250){const t=smooth((d+250)/500);return lerp(H[i-1],H[i],t)}}
 return H[b]}
let HCACHE;function buildH(){HCACHE=new Float32Array(WORLD/2+4);
for(let i=0;i<HCACHE.length;i++){const x=i*2;let h=rawH(x);for(const t of WT){const d=Math.abs(x-t.x);if(d<170){const k=smooth(1-(d-100)/70);h=lerp(h,rawH(t.x),k)}}for(const q of DUNGEONS){const d=Math.abs(x-q.x);if(d<64){const k=smooth(1-(d-34)/30);h=lerp(h,rawH(q.x),k)}}if(!WI){const d=Math.abs(x-SCRAPX);if(d<260){const k=smooth(1-(d-180)/80);h=lerp(h,rawH(SCRAPX),k)}}HCACHE[i]=h}}buildH();
function heightAt(x){x=clamp(x,0,WORLD);const f=x/2,i=Math.floor(f),t=f-i;return lerp(HCACHE[i],HCACHE[i+1],t)}
function surfY(x){return -heightAt(x)}
let PITS=[];function buildPits(){PITS=[];if(WI)return;let x=9800,k=0;while(x<11900){const w=22+Math.floor(hash(k*3.1)*10);if(Math.abs(x-11000)>200&&!DUNGEONS.some(q=>Math.abs(q.x-x)<110))PITS.push({x0:x,x1:x+w,ly:Math.max(surfY(x),surfY(x+w))+9});x+=280+Math.floor(hash(k*7.7)*180);k++}}buildPits();
function pitAt(x){if(DG)return null;for(const p of PITS)if(x>p.x0&&x<p.x1)return p;return null}
function groundAt(x){if(WI===1&&!onIsle(x))return null;return pitAt(x)?null:surfY(x)}
function inDrift(x){return biomeAt(x)===1&&!townAt(x,TOWNR+30)&&(Math.sin(x/97)+Math.sin(x/41+1))>1.15}
function townAt(x,r){if(DG)return null;r=r||TOWNR;for(const t of WT)if(Math.abs(x-t.x)<r)return t;return null}
let DECOR=[];function buildDecor(){DECOR=[];let x=40,k=0;while(x<WORLD-20){const b=biomeAt(x);if(!townAt(x,140)&&(WI?onIsle(x-12)&&onIsle(x+12)&&DOCKS.every(d=>Math.abs(x-d.x)>80):Math.abs(x-SCRAPX)>140)&&!DUNGEONS.some(q=>Math.abs(q.x-x)<46)&&!pitAt(x)&&!pitAt(x+8)&&!pitAt(x-8)){const r=hash(k*1.37);DECOR.push({x,b,r,k})}x+=30+Math.floor(hash(k*9.1)*70);k++}}buildDecor();
function setWorld(n){WI=n?1:0;
 if(WI){WORLD=W2LEN;BOUNDS=[0,ISLES[0].x1,ISLES[1].x0,W2LEN];NB=3;WB=[5,6,7];XMIN=ISL0+24;XMAX=ISLES[1].x1-24}
 else{WORLD=15000;BOUNDS=[0,3200,6400,9600,12000,15000];NB=5;WB=[0,1,2,3,4];XMIN=12;XMAX=WORLD-12}
 WT=TOWNS.filter(t=>t.w===WI);DUNGEONS=WI?[]:W1DUNG;buildH();buildPits();buildDecor()}
