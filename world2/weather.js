'use strict';
const CLOUDS=[];for(let x=1700,k=0;x<9100;k++){CLOUDS.push({x,y:-40-Math.round(hash(k*2.7)*220),w:16+Math.round(hash(k*5.3)*30)});x+=70+Math.round(hash(k*1.9)*90)}
// clouds that would sit inside a sky island are skipped (c.isl)
// autumn clouds (peach, c.au) from Sunspire's far side to the capital
for(let x=10760,k=0;x<16300;k++){CLOUDS.push({x,y:-40-Math.round(hash(k*3.1+.5)*220),w:16+Math.round(hash(k*4.3+.2)*30),au:1});x+=80+Math.round(hash(k*2.2+.7)*100)}
for(const c of CLOUDS)c.isl=SKYISLES.some(I=>c.x+c.w/2>I.x0-6&&c.x-c.w/2<I.x1+6&&c.y>-I.h-30&&c.y<-I.h+110);
function drawClouds(ox,oy){drawHomeTrees(ox,oy);drawSkyProps(ox,oy);for(const c of CLOUDS){const x=Math.round(c.x-ox),y=Math.round(c.y-oy);if(x<-50||x>VW+50||y<-20||y>VH+20||c.isl)continue;const w=c.w,W=c.au?'#ffe8d8':'#ffffff';
 px(X,x-w/2,y-3,w,5,W);px(X,x-w/2+3,y-6,w-8,3,W);px(X,x-w/4,y-8,w/2,2,W);px(X,x-w/2+2,y+2,w-4,1,c.au?'#f4c8b0':'#dce8f6')}}
function drawCloudSea(ox,oy){for(let sx=0;sx<VW;sx+=2){const wx=sx+ox,y=Math.round(58+4*Math.sin(wx/37)+3*Math.sin(wx/13)-oy);if(y>=VH)continue;if(wx>10400&&hash(Math.floor(wx/2)*.71)<(wx-10400)/900){rb(2,'#f4c8b0',sx,y,2,2);rb(3,'#ffe8d8',sx,y+2,2,VH-y)}else{rb(0,'#e4f0fa',sx,y,2,2);rb(1,'#f6fbff',sx,y+2,2,VH-y)}}rbFlush(X)} // autumn: dithered peach blend past Sunspire
function wxTint(z,ox,a,wd,col,al,y0,y1){const l=z.x0-ox,len=z.x1-z.x0,f=Math.min(.45,90/len),gr=X.createLinearGradient(l,0,l+len,0);gr.addColorStop(0,'rgba('+col+',0)');gr.addColorStop(f,'rgba('+col+','+al+')');gr.addColorStop(1-f,'rgba('+col+','+al+')');gr.addColorStop(1,'rgba('+col+',0)');X.fillStyle=gr;if(y0==null)X.fillRect(a,0,wd,VH);else{const t=Math.max(0,y0),bt=Math.min(VH,y1);if(bt>t)X.fillRect(a,t,wd,bt-t)}} // y0..y1: only those rows (lane weather)
function drawWeather(ox,oy){drawStorms(ox,oy);drawBolts(ox,oy);drawAuShots(ox,oy);for(const z of WX){const a=Math.max(0,Math.round(z.x0-ox)),b=Math.min(VW,Math.round(z.x1-ox));if(b<=a)continue;const wd=b-a;
 if(z.k==='rain'){const lh=Math.max(...z.ln),lo=Math.min(...z.ln),cy=Math.round(LANET[lh]-10-oy),yb=lo?Math.round(LANET[lo-1]-oy):VH; // lanes: the (pre-lane look) rain cloud sits at the top of the top rain lane, its base above the rider; rain falls to the bottom of the lowest
  wxTint(z,ox,a,wd,'60,80,112',.2,cy-30,yb);
  for(let sx=a;sx<b;sx+=2){const wx=sx+ox,e=Math.min(1,(wx-z.x0)/40,(z.x1-wx)/40),h=Math.round((26+10*Math.abs(Math.sin(wx/23))+6*Math.sin(wx/9))*e);const t0=Math.max(0,cy-30);if(cy+h<0)continue;rb(0,'#6a7a92',sx,t0,2,cy+h-t0);rb(1,'#8a98ae',sx,cy+h-3,2,3)}rbFlush(X);
  X.fillStyle='#c4d8f2';const y0=Math.max(0,cy+20),hh=Math.min(VH,yb)-y0;if(hh>0){const n=Math.round(wd*hh/(3*VH))+4;for(let i=0;i<n;i++){const s=hash(i*3.7+z.x0);const x=a+(((s*977-menuT*30)%wd)+wd)%wd,y=y0+(hash(i*5.3)*hh+menuT*260*(1+s*.4))%hh;X.fillRect(Math.round(x),Math.round(y),1,4)}}}
 else{wxTint(z,ox,a,wd,'255,255,255',.12);const n=Math.round(wd/5);for(let i=0;i<n;i++){const s=hash(i*4.9+z.x0);const x=a+((s*911+Math.sin(menuT*2+i)*4)%wd+wd)%wd,y=VH-((hash(i*2.3)*VH+menuT*150*(1+s))%VH);X.fillStyle=i%3?'rgba(255,255,255,.75)':'#bfe6f8';X.fillRect(Math.round(x),Math.round(y),1,i%2?6:4)}}}
 if(P&&P.fly&&MODE==='play'){if(!BANDPOS){const bu=$('tU'),br=bu&&bu.offsetParent?bu.getBoundingClientRect():null,bd=br?$('tD').getBoundingClientRect():null;BANDPOS=br?[br.right,br.top,bd.bottom]:[]}const br=BANDPOS.length?BANDPOS:null;const bx=br?Math.round((br[0]+5)/SC):3,y0=br?Math.round(((br[1]+br[2])/2)/SC)-14:Math.round(VH*.3);drawAlt(bx,y0)}}
// altitude indicator (flying): one pixel cell per lane, high on top. Gold = the lane you are in (an outline = the lane you are heading for),
// hatched violet = a storm lane on screen (no flying), blue streaks = a rain lane on screen (slow); the white tick on the left is your exact height
function drawAlt(bx,y0){const L=laneOf(P.y),near=(a,b)=>a<P.x+VW*.6&&b>P.x-VW*.6;
 for(let k=0;k<3;k++){const y=y0+(2-k)*10,st=SKYISLES.some(I=>stormLn(I,k)&&near(I.x0+STORMIN,I.x1-STORMIN)),rn=WX.some(z=>z.k==='rain'&&z.ln.includes(k)&&near(z.x0,z.x1));
  px(X,bx,y,7,8,'#000');px(X,bx+1,y+1,5,6,k===L?'#ffd75e':st?'#5a4672':rn?'#3e5a86':'#4a5a70');
  if(st)for(let j=0;j<6;j++)px(X,bx+1+(j*2+(k===L?1:0))%5,y+1+j,1,1,k===L?'#c0306a':'#9a7ad0');
  else if(rn)for(let j=0;j<2;j++)px(X,bx+2+j*2,y+2+j,1,3,k===L?'#ffffff':'#a8c8f0');
  if(k===P.band&&k!==L){px(X,bx+1,y+1,5,1,'#ffd75e');px(X,bx+1,y+6,5,1,'#ffd75e');px(X,bx+1,y+1,1,6,'#ffd75e');px(X,bx+5,y+1,1,6,'#ffd75e')}}
 const f=clamp((BANDY[0]-P.y)/(BANDY[0]-BANDY[2]),0,1),my=Math.round(y0+24-f*20);px(X,bx-3,my-1,3,3,'#000');px(X,bx-2,my,2,1,'#ffffff')}
