'use strict';
const DRESPAWN=480; // seconds of play before a looted cave refills
function dungAt(x,r){if(DG)return null;r=r||18;for(const d of DUNGEONS)if(Math.abs(x-d.x)<r)return d;return null}
function dState(d){const s=S&&S.dng[d.i];if(!s)return 0;const left=DRESPAWN-(S.time-s.t);return left>0?left:0}
const DPAL=[{bg:'#1c130e',bg2:'#2a1c14',rock:'#5a4030',rock2:'#3a281c',top:'#5a9a3a',glow:'#ffcf6a',deep:'#080403'},
 {bg:'#111824',bg2:'#1a2434',rock:'#4e5e78',rock2:'#34405a',top:'#e6f2ff',glow:'#9fe8ff',deep:'#04070c'},
 {bg:'#15151b',bg2:'#202028',rock:'#5a5c68',rock2:'#3e404a',top:'#a0a6ae',glow:'#ffcf6a',deep:'#050506'},
 {bg:'#1a0909',bg2:'#2a1010',rock:'#3e2828',rock2:'#2a1a1a',top:'#e8642a',glow:'#ff8a3a',deep:'#c8401a',lava:1},
 {bg:'#17141a',bg2:'#221e24',rock:'#5a524e',rock2:'#3e3834',top:'#a29a90',glow:'#ffa060',deep:'#060506'}];
function genDungeon(d){const R=mulberry((d.i+1)*7919+((S.dng[d.i]||{}).n||0)*131);const diff=d.diff;
 const plats=[],spikes=[],slots=[],torches=[];
 const add=(x0,x1,y,o)=>{x0=Math.round(x0);x1=Math.round(x1);const p=Object.assign({x0,x1,y,bx:x0,by:y,w:x1-x0,th:8,dx:0,dy:0},o||{});plats.push(p);return p};
 const start=add(-70,110,0,{th:80});torches.push({x:-56,y:-24},{x:96,y:-24});
 let x=110,y=0,last='';const segs=5+diff*3;
 for(let s=0;s<segs;s++){const r=R();let k=r<.3?'step':r<.48?'mover':r<.62?'lift':r<.8?'spikes':'arena';
  if(s===0||(k===last&&k!=='step'))k='step';if(k==='lift'&&y<-110)k='step';last=k;
  if(k==='step'){const n=2+Math.floor(R()*2);for(let j=0;j<n;j++){const g=18+R()*(12+diff*5);const ny=clamp(y+Math.round((R()-.55)*40),-150,40);const w=30+R()*34;x+=g;const p=add(x,x+w,ny);if(R()<.35)torches.push({x:x+w/2,y:ny-24});y=ny;x+=w}}
  else if(k==='mover'){const span=Math.round(78+diff*12+R()*24),pw=26;add(x+4,x+4+pw,y,{mv:{ax:span-pw-8,ay:0,sp:.8+diff*.15+R()*.25,ph:Math.PI*2*R()}});x+=span;const w=50+R()*30;add(x,x+w,y);x+=w}
  else if(k==='lift'){const h=Math.round(50+R()*22);add(x+6,x+34,y,{mv:{ax:0,ay:-h,sp:1+diff*.12,ph:Math.PI*2*R()},lift:1});const ny=y-h;const w=50+R()*30;add(x+40,x+40+w,ny);torches.push({x:x+60,y:ny-24});x+=40+w;y=ny}
  else if(k==='spikes'){x+=20+R()*14;const w=Math.round(150+R()*50);const p=add(x,x+w,y,{th:14});const n=1+(diff>1?1:0)+(diff>2&&R()<.5?1:0);
   for(let j=0;j<n;j++){const sw=14+Math.round(R()*(6+diff*3));const sx=Math.round(x+(j+1)*w/(n+1)-sw/2);spikes.push({x0:sx,x1:sx+sw,p})}x+=w}
  else{x+=20+R()*14;const w=Math.round(150+R()*60);const p=add(x,x+w,y,{th:14});slots.push(p,p);torches.push({x:x+w/2,y:y-30});x+=w}}
 x+=24+R()*10;const end=add(x,x+200,y,{th:80});const chest={x:end.x0+130,y,open:0};const endX=end.x0+178;torches.push({x:end.x0+20,y:y-30},{x:end.x0+156,y:y-30});
 for(const p of plats)if(!p.mv&&p.w>=56&&p!==start&&p!==end&&!slots.includes(p)&&!spikes.some(q=>q.p===p))slots.push(p);
 slots.push(end);
 const nF=[3,5,7][diff-1],tbl=SPAWNS[d.b],foes=[];
 for(let i=0;i<nF;i++){const p=slots[i%slots.length];let r=R(),type=tbl[0][0];for(const [t,w] of tbl){if(r<w){type=t;break}r-=w}
  if(isGolem(type)&&foes.some(f=>isGolem(f.type)))type=noGolem(d.b)||tbl[0][0];
  const fx=p===end?p.x0+40+R()*50:p.x0+18+R()*(p.w-36);foes.push({type,x:fx,p})}
 let maxY=-1e9;for(const p of plats)maxY=Math.max(maxY,p.by+(p.mv?Math.max(0,p.mv.ay):0));
 return {d,b:d.b,diff,plats,spikes,foes,chest,torches,doorX:-46,endX,minX:-70,maxX:end.x1,deathY:maxY+110,abyssY:maxY+46,t:0,start,end}}
function enterDungeon(d){if(dState(d)>0||DG)return;fadeIn();if(S.horse&&S.horse.on){dismount(d.x+30);toast('🐴 waits outside',900)}if(!S.park&&S.hauler!=='backpack')unhitch(d.x-34);
 save();DG=genDungeon(d);ENEMIES=[];PROJ=[];PICK=[];PARTS=[];FTXT=[];ROCKS=[];
 P=newPlayer(0);P.x=-12;P.y=0;P.plat=DG.start;P.safe={x:-12,y:0,p:DG.start};P.inv=.6;
 for(const f of DG.foes){const e=spawnEnemy(f.type,f.x);e.plat=f.p;e.y=f.p.y-((ENEMY[f.type].base||f.type)==='witch'?30:0);e.dir=-1}
 camX=Math.max(DG.minX,P.x-VW/2);camY=P.y-VH*.6;showPrompt('');toast(skulls(d.diff),1100)}
function exitDungeon(){if(!DG)return;fadeIn();const d=DG.d;DG=null;ENEMIES=[];PROJ=[];PICK=[];PARTS=[];FTXT=[];ROCKS=[];
 P=newPlayer(d.x+6);P.inv=1.2;env.spawnD=0;camX=clamp(P.x-VW/2,0,WORLD-VW);camY=P.y-VH*.64;save()}
function dungeonKO(){S.hp=Math.max(1,Math.round(maxHP()*.4));exitDungeon();toast('Knocked out<br><span class="small">dragged outside · nothing lost</span>',2400)}
function chestLoot(diff){if(diff===1)return {coin:15+Math.floor(rnd()*16),goods:rnd()<.5?[[2,3],[3,1]]:[[2,3],[1,2]]};
 if(diff===2)return {coin:40+Math.floor(rnd()*41),goods:[[3,3],[4,1]]};
 return {coin:100+Math.floor(rnd()*81),goods:rnd()<.6?[[4,3],[5,1]]:[[4,4]]}}
function openChest(){const D=DG;if(!D||D.chest.open)return;const d=D.d;D.chest.open=1;const pv=S.dng[d.i];S.dng[d.i]={t:S.time,n:(pv?pv.n:0)+1};
 let origin=0;for(const t of TOWNS)if(Math.abs(t.x-d.x)<Math.abs(TOWNS[origin].x-d.x))origin=t.i;
 const L=chestLoot(d.diff);let extra=0;const got=[];
 // goods fill free backpack space; whatever doesn't fit is paid out as coin (60%)
 for(const [it,q] of L.goods){let k=0;for(let i=0;i<q;i++){if(cargoCount()<cap()){addCargo(it,origin,1,0);k++}else extra+=Math.round(ITEMS[it].base*.6)}if(k)got.push('<img class="px" style="width:16px;height:16px;vertical-align:middle" src="'+ICONURL[ITEMS[it].id]+'"> ×'+k)}
 S.money+=L.coin+extra;part(D.chest.x,D.chest.y-8,'#ffd040',26,170);part(D.chest.x,D.chest.y-8,'#ffffff',10,120);
 toast((got.length?got.join('  ')+'<br>':'')+'<span class="gold">+'+pr(L.coin+extra)+'</span>'+(extra?' · 🎒 full':''),3400);save()}
function dSolid(x,y){const D=DG;if(y>D.deathY)return true;for(const p of D.plats)if(x>=p.x0&&x<=p.x1&&y>=p.y&&y<=p.y+p.th)return true;return false}
function setSafe(p){let sx=clamp(P.x,p.x0+6,p.x1-6);for(const q of DG.spikes)if(q.p===p&&sx>q.x0-8&&sx<q.x1+8)sx=q.x0-9>p.x0+4?q.x0-9:q.x1+9;P.safe={x:sx,y:p.y,p}}
function updDungeon(dt){const D=DG;D.t+=dt;
 for(const p of D.plats)if(p.mv){const k=.5-.5*Math.cos(D.t*p.mv.sp+p.mv.ph);const nx=p.bx+p.mv.ax*k,ny=p.by+p.mv.ay*k;p.dx=nx-p.x0;p.dy=ny-p.y;p.x0=nx;p.x1=nx+p.w;p.y=ny}
 let mv=(inp.left()?-1:0)+(inp.right()?1:0);if(mv)P.dir=mv;
 if(P.onGround&&P.plat){P.x+=P.plat.dx;P.y=P.plat.y}
 const ox=P.x;P.x=clamp(P.x+(mv*94*spdMul()+P.kbx)*dt,D.minX+6,D.maxX-6);P.kbx*=Math.pow(.004,dt);if(Math.abs(P.kbx)<2)P.kbx=0;
 P.walk=mv&&P.onGround;P.wheel+=(P.x-ox)/4;
 if(P.onGround){const p=P.plat;if(!p||P.x<p.x0-2||P.x>p.x1+2){P.onGround=false;P.plat=null}else P.y=p.y}
 if(inp.jump()&&P.onGround){P.vy=-262;P.onGround=false;P.plat=null}
 if(!P.onGround){const py=P.y;P.vy+=720*dt;P.y+=P.vy*dt;
  if(P.vy>=0)for(const p of D.plats){if(P.x>=p.x0-2&&P.x<=p.x1+2&&py<=p.y-p.dy+4&&P.y>=p.y){P.y=p.y;P.vy=0;P.onGround=true;P.plat=p;if(!p.mv)setSafe(p);break}}}
 // spikes
 if(P.onGround)for(const q of D.spikes)if(P.plat===q.p&&P.x>q.x0-2&&P.x<q.x1+2){if(P.inv<=0){hurtPlayer(10+D.diff*3,(q.x0+q.x1)/2,false);P.vy=-210;P.onGround=false;P.plat=null;part(P.x,P.y-2,'#e84a4a',6,80)}break}
 if(!DG)return;
 // fall into the abyss / lava
 if(P.y>D.deathY){const dmg=D.b===3?22:12;S.hp-=dmg;ftxt(P.safe.x,P.safe.y-24,'-'+dmg+(D.b===3?' 🔥':''),'#ff7a6a');
  if(S.hp<=0){die();return}P.x=P.safe.x;P.y=P.safe.y;P.vy=0;P.kbx=0;P.onGround=true;P.plat=P.safe.p;P.inv=1;part(P.x,P.y-8,'#ffffff',8,60)}
 if(MODE!=='play'){showPrompt('');return}
 // prompts: start door, chest, exit door
 let h='';const k=isTouch?'E':'[E]';
 if(P.plat===D.start&&Math.abs(P.x-D.doorX)<18){h=k+' ⬅ Leave';if(inp.use()){showPrompt('');exitDungeon();return}}
 else if(P.plat===D.end&&!D.chest.open&&Math.abs(P.x-D.chest.x)<18){h=k+' 🎁 Open';if(inp.use())openChest()}
 else if(P.plat===D.end&&D.chest.open&&Math.abs(P.x-D.endX)<18){h=k+' ➜ Exit';if(inp.use()){showPrompt('');exitDungeon();return}}
 if(inp.cart())toggleCart();if(inp.horse())toggleHorse();
 showPrompt(MODE==='play'?h:'')}
function burnPit(pit){S.hp-=25;P.inv=.9;ftxt(P.x,P.y-24,'-25 🔥','#ff7a1a');part(P.x,pit.ly,'#ff7a1a',16,160);let lost=0;for(let i=0;i<2;i++)if(randomUnit())lost++;if(lost)ftxt(P.x,P.y-34,'-'+lost+' burned','#ffd75e');
 P.x=P.lastSafe;P.y=surfY(P.x);P.vy=0;P.onGround=true;P.kbx=0;if(S.hp<=0)die()}
const CAVEPAL=[['#7a6a5a','#5a4a3e','#9a8a78','#4f9a3a'],['#7a889e','#56647a','#a8b6ca','#f4f8ff'],['#6a6c78','#4a4c58','#9aa0a8','#a0a6ae'],['#3a2626','#241818','#5a3a3a','#e8642a'],['#5a524e','#3e3834','#7a726c','#a29a90']];
const SKULL=['.###.','#####','#.#.#','#####','.#.#.'];
function drawSkull(c,x,y,col){if(c===X){let k=SKC[col];if(!k){k=SKC[col]=document.createElement('canvas');k.width=k.height=6;drawSkull(k.getContext('2d'),0,0,col)}X.drawImage(k,Math.round(x),Math.round(y));return}for(let j=0;j<5;j++)for(let i=0;i<5;i++)if(SKULL[j][i]==='#'){px(c,x+i+1,y+j+1,1,1,'#000');px(c,x+i,y+j,1,1,col)}}const SKC={}; // world skulls blit a cached 6x6 sprite
const SKURL=[spriteURL(6,6,g=>drawSkull(g,0,0,'#f4f0e0')),spriteURL(6,6,g=>drawSkull(g,0,0,'#8a8070'))];
function skulls(n,dim){let h='';for(let i=0;i<n;i++)h+='<img src="'+SKURL[dim?1:0]+'" style="width:12px;height:12px;image-rendering:pixelated;margin:0 1px;vertical-align:middle">';return h}
// cave mound + mouth never change, so each cave is painted once into a small canvas and blitted (pixel-identical)
const CAVEC={};function caveBody(d){let cv=CAVEC[d.i];if(cv)return cv;cv=CAVEC[d.i]=document.createElement('canvas');cv.width=60;cv.height=48;const X=cv.getContext('2d'),x=29,y=40,c=CAVEPAL[d.b];
 for(let i=-28;i<=28;i++){const k=i/29;const h=Math.round(32*Math.sqrt(1-k*k)+3*Math.sin(i*1.7+d.i)+(hash(i+d.i*31)>.8?2:0));
  px(X,x+i,y-h,1,h+6,i>8?c[1]:c[0]);px(X,x+i,y-h,1,2,c[3]);if(hash(i*3.3+d.i)>.7)px(X,x+i,y-h+6+Math.floor(hash(i+7)*14),1,2,c[1]);if(hash(i*5.1+d.i)>.85)px(X,x+i,y-h+3,1,1,c[2])}
 for(let i=-11;i<=11;i++){const k=i/11.5;const h=Math.round(19*Math.sqrt(1-k*k));px(X,x+i,y-h,1,h,Math.abs(i)>=10?c[1]:'#0c0808');if(Math.abs(i)<9&&h>4)px(X,x+i,y-h+2,1,h-2,'#060404')}
 return cv}
function drawCave(d,ox,oy){const x=Math.round(d.x-ox),y=Math.round(surfY(d.x)-oy);const cl=dState(d)>0;X.drawImage(caveBody(d),x-29,y-40);
 if(cl){for(let j=0;j<3;j++){px(X,x-11,y-16+j*5,23,3,'#8a5a2b');px(X,x-11,y-14+j*5,23,1,'#4a2e1a')}px(X,x-1,y-17,2,15,'#5a3818')}
 else{for(const sd of [-16,16]){px(X,x+sd,y-14,1,9,'#5a3818');const f=Math.sin(menuT*14+sd)>0;px(X,x+sd-1,y-17,3,3,f?'#ff8a2a':'#ffd040');px(X,x+sd,y-18-(f?1:0),1,1,'#fff0a0')}
  if(Math.sin(menuT*1.3+d.i*2)>.55){px(X,x-3,y-9,1,1,'#ff3030');px(X,x+2,y-9,1,1,'#ff3030')}}
 const n=d.diff;let sx=x-Math.round((n*7-2)/2);for(let k=0;k<n;k++)drawSkull(X,sx+k*7,y-44,cl?'#8a8070':'#f4f0e0')}
function renderDungeon(){const D=DG,pal=DPAL[D.b],ox=Math.round(camX)+shk(),oy=Math.round(camY)+shk(),T=menuT;
 X.fillStyle=pal.bg;X.fillRect(0,0,VW,VH);
 // back wall: ceiling with stalactites and rubble silhouettes (parallax)
 for(let sx=0;sx<VW;sx+=2){const wx=sx+ox*.5;const hc=10+8*Math.abs(Math.sin(wx/23))+(hash(Math.floor(wx/6))>.82?10+Math.floor(hash(Math.floor(wx/6)+3)*14):0);rb(0,pal.bg2,sx,0,2,hc);
  const hb=16+10*Math.abs(Math.sin(wx/31+1))+5*Math.sin(wx/11);rb(1,pal.bg2,sx,Math.round(VH-hb),2,VH);
  if(hash(Math.floor(wx/4)*1.7)>.93)rb(2,pal.rock2,sx,Math.round(VH*.3+hash(Math.floor(wx/4))*VH*.4),2,2)}
 rbFlush(X);
 // torches glow
 for(const t of D.torches){const x=Math.round(t.x-ox),y=Math.round(t.y-oy);if(x<-40||x>VW+40)continue;const fl=Math.sin(T*12+t.x)>0;
  X.globalAlpha=.08;X.fillStyle=pal.glow;X.beginPath();X.arc(x,y,34+(fl?2:0),0,7);X.fill();X.globalAlpha=.1;X.beginPath();X.arc(x,y,18,0,7);X.fill();X.globalAlpha=1;
  px(X,x,y,2,8,'#5a3818');px(X,x-1,y-3,4,3,fl?'#ff8a2a':'#ffd040');px(X,x,y-4-(fl?1:0),2,1,'#fff0a0')}
 // abyss / lava
 const ay=Math.round(D.abyssY-oy);if(ay<VH){if(pal.lava){for(let sx=0;sx<VW;sx++){const wx=sx+ox;const b=Math.round(Math.sin(wx/7+T*3)*1.5);rb(0,Math.sin(wx/4+T*4)>.6?'#ffd040':'#ff8a2a',sx,ay+b,1,2);rb(1,'#e8501a',sx,ay+b+2,1,6);rb(2,'#a8301a',sx,ay+b+8,1,VH)}rbFlush(X)}
  else{X.fillStyle=pal.deep;X.fillRect(0,ay,VW,VH-ay);for(let sx=-(ox%6+6)%6;sx<VW;sx+=6){px(X,sx,ay-3,3,3,pal.bg2);px(X,sx+1,ay-5,1,2,pal.bg2)}}}
 // platforms
 for(const p of D.plats){const x=Math.round(p.x0-ox),y=Math.round(p.y-oy),w=p.w;if(x>VW||x+w<0)continue;
  if(p.mv){if(p.lift){const top=Math.round(p.by+p.mv.ay-oy-40);for(let yy=top;yy<y;yy+=3){px(X,x+3,yy,1,2,'#8a8a90');px(X,x+w-4,yy,1,2,'#8a8a90')}}
   px(X,x,y,w,5,'#8a5a2b');px(X,x,y,w,1,'#c8904a');px(X,x,y+4,w,1,'#4a2e1a');for(let i=4;i<w;i+=7)px(X,x+i,y+1,1,3,'#6e4526');continue}
  px(X,x,y,w,p.th,pal.rock);px(X,x,y+p.th-2,w,2,pal.rock2);px(X,x,y,w,2,pal.top);
  for(let i=0;i<w;i+=3){const n=hash(p.bx*.37+i);if(n>.55)px(X,x+i,y+p.th,3,Math.floor(n*6),pal.rock2);if(n<.12)px(X,x+i,y+4+Math.floor(n*30),2,1,pal.rock2)}}
 // spikes
 for(const q of D.spikes){const y=Math.round(q.p.y-oy);for(let sx=q.x0;sx<q.x1-1;sx+=4){const x=Math.round(sx-ox);px(X,x,y-1,4,1,'#8a8e98');px(X,x+1,y-3,2,2,'#c8ccd4');px(X,x+1,y-5,1,2,'#eef0f4')}}
 // doors
 const door=(wx,wy,lit)=>{const x=Math.round(wx-ox),y=Math.round(wy-oy);px(X,x-8,y-22,16,22,'#2a1a10');for(let i=-6;i<=6;i++){const h=Math.round(16+4*Math.sqrt(1-(i/6.5)**2));px(X,x+i,y-h,1,h,lit?'#ffe8a8':'#140c08')}if(lit){X.globalAlpha=.14;X.fillStyle='#ffe8a8';X.beginPath();X.arc(x,y-10,24,0,7);X.fill();X.globalAlpha=1}else{for(let i=-5;i<=5;i+=3)px(X,x+i,y-19,1,19,'#6a6c78')}};
 door(D.doorX,D.start.y,1);door(D.endX,D.end.y,D.chest.open);
 // chest
 {const c=D.chest,x=Math.round(c.x-ox),y=Math.round(c.y-oy);if(c.open){px(X,x-7,y-8,14,8,'#8a5a2b');px(X,x-6,y-8,12,2,'#ffd040');px(X,x-7,y-14,14,3,'#a8743c');px(X,x-7,y-12,14,1,'#5a3818');if(Math.sin(T*6)>0)px(X,x-2,y-11,1,1,'#ffffff')}
  else{const b=Math.round(Math.sin(T*3)*1);px(X,x-7,y-10,14,10,'#8a5a2b');px(X,x-7,y-10,14,3,'#a8743c');px(X,x-7,y-7,14,1,'#5a3818');px(X,x-5,y-10,2,10,'#d8b040');px(X,x+3,y-10,2,10,'#d8b040');px(X,x-1,y-7,2,3,'#ffd040');
   if(Math.sin(T*2.4)>.4){px(X,x+6,y-14+b,1,1,'#fff4b0');px(X,x-8,y-12-b,1,1,'#fff4b0')}}}
 drawActors(ox,oy);
 // dim the edges a little
 X.fillStyle='rgba(0,0,0,.18)';X.fillRect(0,0,VW,6);X.fillRect(0,VH-6,VW,6);
 drawFTXT(ox,oy)}
