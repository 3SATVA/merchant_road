'use strict';
TOWNS.forEach((t,i)=>{t.i=i;t.w=t.w||0;t.biome=t.w?(t.x>ISLES[1].x0?7:5):biomeAt(t.x)});let WT=TOWNS.filter(t=>!t.w),DUNGEONS=WORLDDEF[0].dungeons; // WT / DUNGEONS = towns / caves of the current world
function rawH(x){return WORLDDEF[WI].rawH(x)} // terrain height formula of the current world
let HCACHE;function buildH(){HCACHE=new Float32Array(WORLD/2+4);
for(let i=0;i<HCACHE.length;i++){const x=i*2;let h=rawH(x);for(const t of WT){const d=Math.abs(x-t.x);if(d<170){const k=smooth(1-(d-100)/70);h=lerp(h,rawH(t.x),k)}}for(const q of DUNGEONS){const d=Math.abs(x-q.x);if(d<64){const k=smooth(1-(d-34)/30);h=lerp(h,rawH(q.x),k)}}for(const f of WORLDDEF[WI].flat){const d=Math.abs(x-f.x);if(d<f.r+f.fade){const k=smooth(1-(d-f.r)/f.fade);h=lerp(h,rawH(f.x),k)}}HCACHE[i]=h}}buildH();
function heightAt(x){x=clamp(x,0,WORLD);const f=x/2,i=Math.floor(f),t=f-i;return lerp(HCACHE[i],HCACHE[i+1],t)}
function surfY(x){return -heightAt(x)}
let PITS=[];function buildPits(){const d=WORLDDEF[WI];PITS=d.pits?d.pits():[]}buildPits();
function pitAt(x){if(DG)return null;for(const p of PITS)if(x>p.x0&&x<p.x1)return p;return null}
function groundAt(x){if(WI===1&&!onIsle(x))return null;return pitAt(x)?null:surfY(x)}
function inDrift(x){return biomeAt(x)===1&&!townAt(x,TOWNR+30)&&(Math.sin(x/97)+Math.sin(x/41+1))>1.15}
function townAt(x,r){if(DG)return null;r=r||TOWNR;for(const t of WT)if(Math.abs(x-t.x)<r)return t;return null}
let DECOR=[];function buildDecor(){DECOR=[];let x=40,k=0;while(x<WORLD-20){const b=biomeAt(x);if(!townAt(x,140)&&WORLDDEF[WI].decorOK(x)&&!DUNGEONS.some(q=>Math.abs(q.x-x)<46)&&!pitAt(x)&&!pitAt(x+8)&&!pitAt(x-8)){const r=hash(k*1.37);DECOR.push({x,b,r,k})}x+=30+Math.floor(hash(k*9.1)*70);k++}}buildDecor();
function setWorld(n){WI=n?1:0;const d=WORLDDEF[WI];
 WORLD=d.len;BOUNDS=d.bounds.slice();NB=d.bounds.length-1;WB=d.wb.slice();XMIN=d.xmin;XMAX=d.xmax;
 WT=TOWNS.filter(t=>t.w===WI);DUNGEONS=d.dungeons;buildH();buildPits();buildDecor()}
