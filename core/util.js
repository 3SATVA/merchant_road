'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
function hex2rgb(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mixc(a,b,t){const A=hex2rgb(a),B=hex2rgb(b);return 'rgb('+Math.round(lerp(A[0],B[0],t))+','+Math.round(lerp(A[1],B[1],t))+','+Math.round(lerp(A[2],B[2],t))+')'}
const rnd=Math.random;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)}
// rect batcher: terrain, backdrops and the cloud sea are thousands of 1-2px columns. rb() queues them per pass and merges
// side-by-side runs (same colour, top and height); rbFlush() draws pass by pass. Same pixels, a fraction of the fillRect calls.
// Rules: rects within one pass must never overlap each other (one per column), and flush before anything else draws on top.
const RB=[[],[],[],[],[],[],[],[]];let RBN=0;
function rb(p,col,x,y,w,h){const a=RB[p],n=a.length;if(n&&a[n-5]===col&&a[n-3]===y&&a[n-1]===h&&a[n-4]+a[n-2]===x){a[n-2]+=w;return}a.push(col,x,y,w,h);if(p>=RBN)RBN=p+1}
function rbFlush(g){let cur=null;for(let p=0;p<RBN;p++){const a=RB[p];for(let i=0;i<a.length;i+=5){if(a[i]!==cur){cur=a[i];g.fillStyle=cur}g.fillRect(a[i+1],a[i+2],a[i+3],a[i+4])}a.length=0}RBN=0}
function spriteURL(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');fn(g);return c.toDataURL()}
