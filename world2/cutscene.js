'use strict';
// first-arrival cutscene: pan across the Skylands and back, then the horse grows wings (tap / any key skips)
const CUT={t:0,x0:0,cy:0,wing:false},CUTA=3.4,CUTB=2.6,CUTW=1.8,CUTEND=11000; // CUTEND: the pan stops past Sunspire (the autumn wilds and the capital stay a surprise)
function startCut(){CUT.t=0;CUT.x0=clamp(P.x-VW/2,0,WORLD-VW);CUT.cy=P.y-VH*.64;CUT.wing=false;camX=CUT.x0;camY=CUT.cy;setMode('cut');$('cut').classList.add('on')}
function wingFx(n){const h=S.horse;const hx=h&&!h.on?h.x:P.x,hy=surfY(hx)-16;for(let i=0;i<n;i++)part(hx-9+rnd()*18,hy-rnd()*12,rnd()<.55?'#ffffff':'#ffe08a',1,70,-25,1.2)}
function cutTick(dt){CUT.t+=dt;const t=CUT.t,far=Math.max(0,Math.min(WORLD,CUTEND)-VW);
 camX=t<CUTA?lerp(CUT.x0,far,smooth(t/CUTA)):t<CUTA+CUTB?lerp(far,CUT.x0,smooth((t-CUTA)/CUTB)):CUT.x0;camY=CUT.cy;
 if(t>=CUTA+CUTB){if(!CUT.wing){CUT.wing=true;if(S.horse)S.horse.wings=true;wingFx(24)}else if(rnd()<.6)wingFx(1)}
 for(const p of PARTS){p.life-=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}prune(PARTS,p=>p.life>0);
 if(t>CUTA+CUTB+CUTW)endCut()}
function endCut(){if(MODE!=='cut')return;$('cut').classList.remove('on');if(S.horse)S.horse.wings=true;S.w2seen=true;setMode('play');camX=clamp(P.x-VW/2,0,WORLD-VW);save();toast(ico('wing',2),1600)}
$('cut').addEventListener('pointerdown',e=>{e.preventDefault();endCut()});
