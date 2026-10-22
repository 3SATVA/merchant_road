'use strict';
const WITCHMOVE=600; // seconds of play before Vex moves on
// Vex's wagon: a random roadside spot, moves every WITCHMOVE seconds of play
function witchSpotOK(x){if(x<300||x>BOUNDS[4]-200||townAt(x,TOWNR+90))return false;for(const d of DUNGEONS)if(Math.abs(d.x-x)<90)return false;for(let k=-40;k<=40;k+=8)if(pitAt(x+k))return false;return true}
function placeWitch(){let x=0;for(let i=0;i<200;i++){x=300+rnd()*(WORLD-600);if(witchSpotOK(x)&&!(P&&Math.abs(x-P.x)<VW*1.2))break}S.witch={x:Math.round(x),t:S.time,seen:false}}
function witchTick(){if(!S.witch)placeWitch();const w=S.witch;
 if(S.time-w.t>WITCHMOVE&&Math.abs(P.x-w.x)>VW){placeWitch();return}
 if(!w.seen&&Math.abs(P.x-w.x)<150){w.seen=true;toast('🔮 <b>Vex\'s wagon!</b>',1800);save()}}
function nearWitch(){return !!(!WI&&S.witch&&!DG&&Math.abs(P.x-(S.witch.x+22))<26)}
// ---- Vex's wagon house + Vex
const WITCHSPR=['.......KK...','......KhHK..','.....KhHK...','....KhHHK...','...KHhHHHK..','...KHHHHHK..','..KKKBBKKKK.','KHHHHHHHHHHK','.KKRRRRRRKK.','..RRSSSSRR..','..RSSeSSeR..','..RSSSSSSR..','..LRSSsSRL..','..L.TTTT.L..','...STTTTS...','...g.ss.g...','...kkkkkk...','..kkkkkkkk..','...bb..bb...','...bb..bb...','...bb..bb...','..bbb.bbb...'];
const WPAL={K:'#141018',H:'#3e2a66',h:'#56389a',B:'#f0b020',R:'#2b2b33',L:'#cbb0f2',S:'#fff0ea',s:'#ecc8bc',e:'#3e2a66',T:'#3e2a66',k:'#6a48b0',b:'#1a1a22',g:'#1a1a22'};
function drawVex(c,x,y,dir,t){const w=12,hh=WITCHSPR.length;for(let j=0;j<hh;j++){const row=WITCHSPR[j];for(let i=0;i<w;i++){const ch=row[i];if(ch==='.')continue;const xx=dir>0?i:w-1-i;px(c,x-6+xx,y-hh+j,1,1,WPAL[ch])}}
 // blink
 if(Math.floor(t*10)%37===0){const ey=y-hh+10;for(const i of [5,8])px(c,x-6+(dir>0?i:w-1-i),ey,1,1,WPAL.S)}}
function drawWitchCamp(ox,oy){const w=S.witch;if(Math.abs(w.x-ox-VW/2)>VW/2+80)return;if(!WAGONC)buildWagon();const gy=Math.round(surfY(w.x)-oy),sx=Math.round(w.x-ox);
 X.drawImage(WAGONC,sx-25,gy-38);
 // lantern on a hook + glow
 const fl=.6+.4*Math.sin(menuT*7)*Math.sin(menuT*3.1);px(X,sx+21,gy-26,1,4,'#2b2b33');X.globalAlpha=.22*fl;px(X,sx+19,gy-23,5,5,'#ffd75e');px(X,sx+20,gy-24,3,7,'#ffd75e');px(X,sx+18,gy-22,7,3,'#ffd75e');X.globalAlpha=1;px(X,sx+20,gy-22,3,3,'#141018');px(X,sx+21,gy-21,1,1,fl>.5?'#fff4b0':'#ffb030');
 // chimney smoke
 for(let i=0;i<4;i++){const k=(menuT*.6+i/4)%1;px(X,sx+13+Math.round(Math.sin(k*6+i)*2+k*4),gy-40-Math.round(k*16),k>.5?1:2,k>.5?1:2,k>.6?'#8a8a9a':'#b8b8c8')}
 // Vex stands by the door, facing you
 const hx=w.x+30,dir=P&&P.x<hx?-1:1;drawVex(X,Math.round(hx-ox),gy,dir,menuT);
 if(nearWitch()&&MODE==='play'&&Math.sin(menuT*4)>0)px(X,Math.round(hx-ox),gy-27,1,2,'#c9b4ec')}
