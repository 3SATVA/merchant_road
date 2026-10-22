'use strict';
const C=$('c'),X=C.getContext('2d');let VW=400,VH=225,SC=0;
const FXC=$('fx'),FX=FXC.getContext('2d');let DPR=1;
let lastOri=null;
let BANDPOS=null; // cached altitude-button rect for the band pips (see drawWeather)
function resize(){BANDPOS=null;const de=document.documentElement,w=de.clientWidth||innerWidth,h=de.clientHeight||innerHeight;DPR=Math.min(2,devicePixelRatio||1);FXC.width=Math.round(w*DPR);FXC.height=Math.round(h*DPR);const ori=w>h?'L':'P';const s=Math.min(w/300,h/225);const ns=Math.max(1,Math.round(s*4)/4);
 // keep the pixel scale steady (no camera zoom jumps when the mobile browser toolbar shows/hides); only rescale on orientation change or big size change
 if(ori!==lastOri||Math.abs(ns-SC)/SC>.2||SC<1)SC=ns;lastOri=ori;VW=Math.ceil(w/SC);VH=Math.ceil(h/SC);C.width=VW;C.height=VH;X.imageSmoothingEnabled=false}
addEventListener('resize',resize);resize();
