'use strict';
let camX=0,camY=-150,menuT=0;
let SKYK='',SKYC=null; // last sky gradient (one entry: it only changes when the biome pair or blend changes)
function skyBands(b0,b1,t){const n=8,key=b0+','+b1+','+t;if(key!==SKYK){SKYK=key;SKYC=skyCols(b0,b1,t,n)}for(let i=0;i<n;i++){X.fillStyle=SKYC[i];X.fillRect(0,Math.floor(i*VH*.7/n),VW,Math.ceil(VH*.7/n)+1)}
 X.fillStyle=SKYC[n];X.fillRect(0,Math.floor(VH*.7)-1,VW,VH)}
function skyCols(b0,b1,t,n){const out=[];for(let i=0;i<n;i++){const k=i/(n-1);const c0=k<.5?mixc(BIOMES[b0].sky[0],BIOMES[b0].sky[1],k*2):mixc(BIOMES[b0].sky[1],BIOMES[b0].sky[2],k*2-1);const c1=k<.5?mixc(BIOMES[b1].sky[0],BIOMES[b1].sky[1],k*2):mixc(BIOMES[b1].sky[1],BIOMES[b1].sky[2],k*2-1);
 const A=c0.match(/\d+/g).map(Number),B=c1.match(/\d+/g).map(Number);out.push('rgb('+A.map((v,j)=>Math.round(lerp(v,B[j],t))).join(',')+')')}
 out.push(mixc(BIOMES[b0].sky[2],BIOMES[b1].sky[2],t));return out}
function layer(bi,kind,f,baseY,col,cap,alpha){X.globalAlpha=alpha;const off=camX*f;
 for(let sx=0;sx<VW;sx+=2){const wx=sx+off;let h;
  if(kind==='isles'){const p=((wx%300)+300)%300;if(p<110){const q=1-Math.abs(p-55)/55,tp=Math.round(baseY-50-10*Math.sin(Math.floor(wx/300)*2.3)),th=Math.round(3+16*Math.sqrt(q));rb(0,col,sx,tp,2,th);rb(1,'#8ad0c4',sx,tp,2,1)}continue}
  if(kind==='hills')h=28+16*Math.sin(wx/130)+8*Math.sin(wx/47+1);
  else if(kind==='peaks'){const a=Math.abs(Math.sin(wx/70)),bb=Math.abs(Math.sin(wx/41+2));h=30+40*a*a+14*bb}
  else if(kind==='volcano'){const p=((wx%700)+700)%700;h=22+8*Math.sin(wx/60);const d=Math.abs(p-350);if(d<150)h=Math.max(h,90-d*.45);if(d<22)h=Math.min(h,78)}
  else if(kind==='cloudbank'){h=14+6*Math.sin(wx/37)+4*Math.abs(Math.sin(wx/13))}
  else if(kind==='trees'){h=22+5*Math.abs(Math.sin(wx/11))+4*Math.sin(wx/37)}
  else if(kind==='ruins'){const p=((wx%230)+230)%230;h=16+6*Math.sin(wx/50);if(p<28)h=Math.max(h,(p<20?52:40)-(p%8<3?5:0));else if(p>120&&p<128)h=Math.max(h,34-(p>124?9:0))}
  else if(kind==='spires'){const p=((wx%67)+67)%67;h=14+5*Math.abs(Math.sin(wx/23));if(p<8)h+=24-Math.abs(p-4)*5}
  else if(kind==='pines'){const p=((wx%14)+14)%14;h=18+(7-Math.abs(p-7))*2.2+6*Math.sin(wx/53)}
  else{h=20+10*Math.abs(Math.sin(wx/29))+5*Math.sin(wx/13)}
  const y=Math.round(baseY-h);rb(0,col,sx,y,2,VH-y);
  if(cap&&h>cap.h)rb(1,cap.c,sx,y,2,Math.min(4,Math.round((h-cap.h)/3)+1));
  if(kind==='volcano'){const p=((wx%700)+700)%700;if(Math.abs(p-350)<20)rb(2,'#ff6a1a',sx,y,2,2)}}
 rbFlush(X);X.globalAlpha=1}
function render(dt){if(DG&&MODE!=='menu'){renderDungeon();return}const cx=MODE==='menu'?camX:camX;const mid=cx+VW/2;let b0=biomeAt(mid),b1=b0,t=0;
 for(let i=1;i<NB;i++){const d=mid-BOUNDS[i];if(Math.abs(d)<300){b0=WB[i-1];b1=WB[i];t=smooth((d+300)/600)}}
 skyBands(b0,b1,t);
 const hor=Math.round(VH*.64)+(WI?Math.round(clamp(-(camY+22+VH*.64)*.35,-40,140)):0);
 // sun/moon
 const bs=t>.5?b1:b0;if(bs===4){X.fillStyle='rgba(240,200,150,.25)';X.fillRect(VW-76,22,22,22);X.fillStyle='#e8c49a';disc(VW-72,26,14)}else if(!((b0===3)||(b1===3&&t>.5))){X.fillStyle=b0===1?'#f4f8ff':'#fff2b0';disc(VW-70,24,12)}else{X.fillStyle='#ff8a3a';disc(VW-70,30,10)}
 const bl=[[b0,1-(b1!==b0?t:0)],[b1,b1!==b0?t:0]];
 for(const [bi,a] of bl)if(a>0)layer(bi,BIOMES[bi].farS,.12,hor-14,BIOMES[bi].far,BIOMES[bi].farS==='peaks'?{h:62,c:'#f4f8ff'}:null,a);
 for(const [bi,a] of bl)if(a>0)layer(bi,BIOMES[bi].midS,.35,hor+10,BIOMES[bi].mid,bi===1?{h:30,c:'#e8f0f8'}:null,a);
 const ox=Math.round(camX)+shk(),oy=Math.round(camY)+shk();
 // towns
 if(WI)drawIsles(ox,oy);
 for(const tw of WT){if(Math.abs(tw.x-mid)<VW/2+160)drawTown(tw,ox,oy)}
 for(const d of DUNGEONS){if(Math.abs(d.x-mid)<VW/2+50)drawCave(d,ox,oy)}
 // decor behind
 for(const d of DECOR){if(d.x<camX-30||d.x>camX+VW+30)continue;drawDecor(d,ox,oy)}
 // ground
 for(let sx=0;sx<VW;sx++){const wx=sx+ox;const pit=pitAt(wx);const b=biomeAt(wx);const B=BIOMES[b];
  if(WI){if(!onIsle(wx))continue;const y=Math.round(surfY(wx)-oy),th=isleTh(wx),n=hash(wx*.73),t2=Math.round(th*.55);rb(0,B.dirt,sx,y,1,th);rb(1,B.dirt2,sx,y+t2,1,th-t2);rb(2,'#a89878',sx,y+th-3,1,3);if(n<.06)rb(3,B.dirt2,sx,y+8+Math.floor(n*90),1,2);rb(4,B.top,sx,y,1,2);rb(5,B.top2,sx,y+2,1,2);if(n>.7){rb(6,B.top,sx,y+2,1,1);rb(7,B.top2,sx,y+4,1,1)}continue}
  if(pit){const ly=Math.round(pit.ly-oy),py=Math.round(surfY(pit.x0)-oy);const fl=Math.sin(wx/4+menuT*4)>.6;rb(0,'#1e1414',sx,py,1,ly-py);const bub=Math.round(Math.sin(wx/3+menuT*3)*1);rb(1,fl?'#ffd040':'#ff8a2a',sx,ly+bub,1,2);rb(2,'#e8501a',sx,ly+bub+2,1,6);rb(3,'#b8301a',sx,ly+bub+8,1,VH);continue}
  const y=Math.round(surfY(wx)-oy);if(y>=VH)continue;const n=hash(wx*.73);
  rb(0,B.dirt,sx,y,1,VH-y);rb(1,B.dirt2,sx,y+26+((wx>>3)%3),1,VH);rb(2,B.top,sx,y,1,2);rb(3,B.top2,sx,y+2,1,2);if(n>.7){rb(4,B.top,sx,y+2,1,1);rb(5,B.top2,sx,y+4,1,1)}/* thick grass tufts: drawn as 2+2 runs plus a 1px patch so long runs still merge */
  if(n<.08)rb(4,B.dirt2,sx,y+8+Math.floor(n*80),1,2);
  if(b===3&&n>.96)rb(4,'#ff6a1a',sx,y+6,1,3);
  if(b===4){if(n>.975)rb(5,'#ff7a2a',sx,y+5,1,2);else if(n<.03)rb(5,'#d8d0c0',sx,y+10+Math.floor(n*300),1,1)}
  if(inDrift(wx)){const hh=2+Math.round(2*Math.abs(Math.sin(wx/9)));rb(5,'#ffffff',sx,y-hh,1,hh)}}
 rbFlush(X);
 if(WI)drawCloudSea(ox,oy);
 // rocks warn
 for(const r of ROCKS){const gy=Math.round(surfY(r.x)-oy),sx=Math.round(r.x-ox);if(r.warn>0){const w=Math.round(10-r.warn*6);X.fillStyle=Math.floor(menuT*10)%2?'#ff3030':'#7a1010';X.fillRect(sx-w/2,gy-1,w,1)}else{px(X,sx-3,r.y-oy-6,6,6,'#7b7f88');px(X,sx-3,r.y-oy-6,6,1,'#a0a6ae');px(X,sx+1,r.y-oy-3,2,2,'#5d5f6b')}}
 if(S&&S.witch&&!WI&&MODE!=='menu')drawWitchCamp(ox,oy);
 if(!WI&&Math.abs(SCRAPX-mid)<VW/2+120)drawPile(ox,oy,dt);
 if(WI)drawClouds(ox,oy);if(WI&&S)drawDock(ox,oy);if(WI&&P&&P.fly==='ship'&&MODE!=='menu')drawSail(ox,oy);
 // parked cart
 if(S&&S.park&&(!WI||!FEATURE_DRIVABLE_AIRSHIPS)&&MODE!=='menu')drawParked(ox,oy);
 if(S&&S.horse&&!S.horse.on&&MODE!=='menu'&&Math.abs(S.horse.x-ox-VW/2)<VW/2+40){const hx=Math.round(S.horse.x-ox),hy=Math.round(surfY(S.horse.x)-oy);drawHorse(X,hx,hy,S.horse.dir,menuT,0,1);if(nearHorse()&&MODE==='play'&&Math.sin(menuT*4)>0)px(X,hx,hy-27,1,2,'#ffd75e')}
 drawActors(ox,oy);
 // weather
 const bm=biomeAt(mid);
 if(bm===1||(b1===1&&t>.3)){const heavy=W1ENV.bliz>0&&MODE==='play';const n=heavy?140:40;X.fillStyle='#ffffff';for(let i=0;i<n;i++){const s=hash(i*3.3);const x=((s*997+menuT*(heavy?-90:-12)*(1+s))%VW+VW)%VW,y=((hash(i*7.1)*VH+menuT*(heavy?60:22)*(1+s*.5))%VH);X.fillRect(Math.round(x),Math.round(y),1,1)}if(heavy){X.fillStyle='rgba(235,242,255,.32)';X.fillRect(0,0,VW,VH)}}
 if(bm===3){for(let i=0;i<24;i++){const s=hash(i*5.7);const x=(s*VW+Math.sin(menuT+i)*10+VW)%VW,y=VH-((hash(i*2.9)*VH+menuT*30*(1+s))%VH);X.fillStyle=i%3?'#ff7a1a':'#ffd040';X.fillRect(Math.round(x),Math.round(y),1,1)}X.fillStyle='rgba(255,80,20,.07)';X.fillRect(0,0,VW,VH)}
 if(bm===4||(b1===4&&t>.4)){const st=W1ENV.ash>0&&MODE==='play';const n=st?120:36;for(let i=0;i<n;i++){const s=hash(i*4.1);const x=((s*991+menuT*(st?-110:-14)*(1+s))%VW+VW)%VW,y=((hash(i*6.3)*VH+menuT*(st?40:12)*(1+s*.5))%VH);X.fillStyle=i%5?'#b8b0a8':'#ff9a4a';X.fillRect(Math.round(x),Math.round(y),1,1)}if(st){X.fillStyle='rgba(120,108,100,.34)';X.fillRect(0,0,VW,VH)}}
 if(S&&S.park&&(!WI||!FEATURE_DRIVABLE_AIRSHIPS)&&MODE!=='menu')cartArrow(ox,oy);
 if(WI)drawWeather(ox,oy);
 drawFTXT(ox,oy);
}
function setAura(c,sx,sy,t){for(const id in SETS){if(!setOn(id))continue;const col=SETS[id].col;
 for(let i=0;i<3;i++){const a=t*(id==='witch'?2.4:1.4)+i*2.094;const x=sx+Math.round(Math.cos(a)*8),y=sy-10+Math.round(Math.sin(a)*(id==='witch'?11:5));if(id==='witch'){if(Math.sin(t*9+i*3)>-.2){px(c,x,y,1,1,col);if(Math.sin(t*9+i*3)>.7)px(c,x,y-1,1,1,'#ffffff')}}else{px(c,x,y,2,2,'#8a8a8a');px(c,x,y,1,1,col)}}}}
function drawActors(ox,oy){
 // pickups
 for(const k of PICK){if(k.life<3&&Math.floor(k.life*8)%2)continue;const bob=k.ground?Math.sin(menuT*4+k.x)*1.5:0;
  if(k.gear||k.mat){const c=k.mat?MATC[k.mat]:(WEPC[k.gear]||GEARC[k.gear]),w=c.width;if(Math.sin(menuT*5+k.x)>.7)px(X,k.x-ox+w/2-2,k.y-oy-w-2+bob,1,1,'#fff4b0');X.drawImage(c,Math.round(k.x-ox-w/2),Math.round(k.y-oy-w+bob))}
  else X.drawImage(ICONC[ITEMS[k.item].id],Math.round(k.x-ox-4),Math.round(k.y-oy-8+bob))}
 for(const e of ENEMIES)drawEnemyFx(e,Math.round(e.x-ox),Math.round(e.y-oy));
 if(WI&&S&&P&&P.wcx!=null&&MODE!=='menu'&&carriedH()==='wingcart'){const cx=Math.round(P.wcx-ox),cy=Math.round(P.wcy-oy),hx=Math.round(P.x-ox-P.dir*(mounted()?12:4)),hy=Math.round(P.y-oy-(mounted()?12:8));
  const ax=cx+P.dir*13,ay=cy-7;for(let k=0;k<=10;k++){const f=k/10;px(X,Math.round(ax+(hx-ax)*f),Math.round(ay+(hy-ay)*f+Math.sin(f*Math.PI)*3),1,1,'#5e3a1e')}
  drawWingCart(X,cx,cy,P.dir,cargoColors(),menuT,!!P.fly||!P.onGround,(P.wcHit||0)>WCART.flash)}
 if(P&&S&&MODE!=='menu'){const sx=Math.round(P.x-ox),sy=Math.round(P.y-oy);const fl=P.inv>0&&Math.floor(P.inv*14)%2===0;
  let hy=sy;const H=carriedH();if(H!=='backpack'&&H!=='wheelbarrow'){const cxw=P.x-P.dir*(H==='bigwagon'?28:20);const g=groundAt(cxw);hy=Math.round((g===null?P.y:Math.min(g+(P.y-(groundAt(P.x)??P.y)),g))-oy)}
  const cols=cargoColors();
  if(mounted()){const d=P.dir;
   if(H==='smallwagon'||H==='bigwagon'){const cxw=P.x-d*(H==='bigwagon'?40:32),g=groundAt(cxw);const yy=Math.round((g===null?P.y:Math.min(g+(P.y-(groundAt(P.x)??P.y)),g))-oy);drawHauler(X,sx-d*12,yy,d,H,cols,P.wheel)}
   else if(H==='wheelbarrow'){const g=groundAt(P.x-d*24);drawHauler(X,sx-d*12,Math.round((g===null?P.y:g)-oy),-d,H,cols,P.wheel)}
   drawRider(X,sx,sy,d,menuT,fl,cols)}
  else{
  if(H==='smallwagon'||H==='bigwagon')drawHauler(X,sx,hy,P.dir,H,cols,P.wheel);
  drawPlayer(X,sx,sy,P.dir,menuT,P.walk,!P.onGround,fl,S.weapon,P.atk,{eq:S.eq,look:S.look});setAura(X,sx,sy,menuT);enchAura(X,sx,sy,menuT);
  if(H==='backpack'||H==='wheelbarrow')drawHauler(X,sx,sy,P.dir,H,cols,P.wheel)}}
 else if(MODE==='menu'){const sx=Math.round(VW/2),wx=camX+VW/2;const sy=Math.round(surfY(wx)-oy);drawHauler(X,sx,sy,1,'smallwagon',['#d83a3a','#c8a060','#8b5a2b','#ffd040','#d83a3a','#8b5a2b'],menuT*6);drawPlayer(X,sx,sy,1,menuT,true,false,false,'sword',0)}
 for(const p of PROJ){const sx=Math.round(p.x-ox),sy=Math.round(p.y-oy);if(p.kind==='leaf'){const f=Math.floor(menuT*10+p.spin)%4;const L=[[-2,0,4,1],[-1,-1,2,3],[-2,-1,3,2],[-1,0,3,2]][f];px(X,sx+L[0],sy+L[1],L[2],L[3],'#3aa040');px(X,sx,sy,1,1,'#b8f080');if(rnd()<.3)PARTS.push({x:p.x,y:p.y,vx:0,vy:8,col:'#6cc04a',g:0,life:.3})}
  else if(p.kind==='bolt'){px(X,sx-3,sy,6,1,'#c8a060');px(X,p.vx>0?sx+2:sx-3,sy,1,1,'#e8eef4')}
  else if(p.kind==='fire'){const sp=Math.hypot(p.vx,p.vy)||1,ux=p.vx/sp,uy=p.vy/sp;for(let i=3;i>=1;i--)px(X,sx-ux*i*3-1,sy-uy*i*3-1,3-(i>2?1:0),3-(i>2?1:0),i>2?'#a8301a':i>1?'#e8501a':'#ff8a2a');px(X,sx-2,sy-2,5,5,'#ff7a1a');px(X,sx-1,sy-1,3,3,'#ffd040');px(X,sx,sy,1,1,'#ffffff')}
  else if(p.kind==='lava'){px(X,sx-2,sy-2,5,5,'#d8401a');px(X,sx-1,sy-1,3,3,'#ffd040')}
  else{const c=p.v?'#ff8030':'#c060ff';px(X,sx-2,sy-2,4,4,c);px(X,sx-1,sy-1,2,2,'#ffffff')}}
 drawHPBars(ox,oy);
 for(const p of PARTS)px(X,p.x-ox,p.y-oy,1,1,p.col);
}
// enemy health bars: show after a hit and fade ~3s later; big foes (golems, Vex's elite witches) always show theirs
const HPBAR_T=3.2;
function drawHPBars(ox,oy){for(const e of ENEMIES){if(e.dead)continue;const d=ENEMY[e.type];if(e.hpS==null)e.hpS=e.hp;if(e.hp<e.hpS)e.hbT=menuT;e.hpS=e.hp;
 const big=d.h>=24||e.type==='witchV',age=menuT-(e.hbT==null?-99:e.hbT);if(!big&&age>HPBAR_T)continue;const a=big?1:clamp((HPBAR_T-age)/.7,0,1);
 const f=clamp(e.hp/(e.max||d.hp),0,1),w=clamp(Math.round(d.w*1.3),10,22),x=Math.round(e.x-ox-w/2),y=Math.max(1,Math.round(e.y-oy-d.h-(d.air?9:6)));
 if(x<-30||x>VW+30)continue;X.globalAlpha=a;px(X,x-1,y-1,w+2,4,'#140c10');px(X,x,y,w,2,'#4a2a30');const fw=Math.max(1,Math.round(w*f)),col=f>.6?'#5ee05a':f>.3?'#ffd040':'#ff4a3a';px(X,x,y,fw,2,col);px(X,x,y,fw,1,f>.6?'#a8f8a0':f>.3?'#fff0a0':'#ff9a8a');X.globalAlpha=1}}
function drawFTXT(ox,oy){
 FX.setTransform(1,0,0,1,0,0);FX.clearRect(0,0,FXC.width,FXC.height);const fs=Math.round(9*DPR*Math.max(1,SC/2.2));FX.font=fs+'px "Press Start 2P",monospace';FX.textAlign='center';for(const f of FTXT){FX.globalAlpha=clamp(f.life*2,0,1);const x=Math.round((f.x-ox)*SC*DPR),y=Math.round((f.y-oy)*SC*DPR);if(EMOT.test(f.t)){emoText(FX,f.t,x+2*DPR,y+2*DPR,fs,f.col,1);emoText(FX,f.t,x,y,fs,f.col,0)}else{FX.fillStyle='#000';FX.fillText(f.t,x+2*DPR,y+2*DPR);FX.fillStyle=f.col;FX.fillText(f.t,x,y)}}FX.globalAlpha=1;}
function disc(x,y,d){const r=Math.max(2,Math.round(d/4));X.fillRect(x+r,y,d-2*r,d);X.fillRect(x,y+r,d,d-2*r);X.fillRect(x+1,y+1,d-2,d-2)}
