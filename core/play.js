'use strict';
const env={biome:-1,spawnD:0,next:350,lastX:0,lift:0}; // shared run timers; world-only timers live in W1ENV (world1/weather.js) and W2ENV (world2/sky.js)
function spawnEnemy(type,x){const d=ENEMY[type];const e={type,x,y:surfY(x),vy:0,vx:0,hp:d.hp,max:d.hp,dir:-1,t:0,state:'walk',cd:1+rnd(),onGround:true,hitT:0,loot:[],flee:0,seed:rnd()*10,moving:false,cast:0,hop:rnd()};
 if((d.base||type)==='witch')e.y=surfY(x)-30;ENEMIES.push(e);return e}
function isGolem(t){return (ENEMY[t].base||t)==='golem'}
function noGolem(b){const t=SPAWNS[b].find(([t])=>!isGolem(t));return t?t[0]:null}
function pickType(b){const tbl=SPAWNS[b];let r=rnd();for(const [t,w] of tbl){if(r<w)return t;r-=w}return tbl[0][0]}
function spawnGroup(dir){const b=biomeAt(P.x);const max=b===4?5:2+b;if(ENEMIES.length>=max||Math.abs(P.x-SCRAPX)<260)return;let n=1+(rnd()<.3+.15*b?1:0)+(b>=2&&rnd()<.3?1:0);
 for(let i=0;i<n&&ENEMIES.length<max;i++){const x=P.x+dir*(VW/2+18+i*26);if(x<20||x>WORLD-20||townAt(x,TOWNR+40)||pitAt(x))continue;let t=pickType(biomeAt(x));if(isGolem(t)&&ENEMIES.some(e=>!e.dead&&isGolem(e.type)))t=noGolem(biomeAt(x));if(!t)continue;const e=spawnEnemy(t,x);e.dir=-dir}
 // greedy: goblins smell the coin
 const gr=ench('greedy');if(gr&&rnd()<.3*gr){const x=P.x+dir*(VW/2+18+n*26);if(x>20&&x<WORLD-20&&!townAt(x,TOWNR+40)&&!pitAt(x)){const e=spawnEnemy(b===1?'goblinS':b===4?'raider':'goblin',x);e.dir=-dir}}}
let SHK=0;function shake(a){SHK=Math.min(3,Math.max(SHK,a))}function shk(){return SHK>.4?Math.round((Math.random()-.5)*2*SHK):0}
// drop dead entries in place (keeps order; no new array every frame)
function prune(a,keep){let j=0;for(let i=0;i<a.length;i++)if(keep(a[i]))a[j++]=a[i];a.length=j;return a}
function part(x,y,col,n,sp,g,life){for(let i=0;i<n;i++)PARTS.push({x,y,vx:(rnd()-.5)*sp,vy:(rnd()-.8)*sp,col,g:g==null?300:g,life:(life||.5)*(.6+rnd()*.6)})}
function ftxt(x,y,t,col){FTXT.push({x,y,t,col,life:1})}
function dropUnit(u,x,y,vx){PICK.push({...u,x,y,vx:vx==null?(rnd()-.5)*120:vx,vy:-140-rnd()*60,life:30,ground:false})}
function hurtPlayer(dmg,sx,knock,src){if(P.inv>0||MODE!=='play')return;shake(dmg>=20?2.5:1.6);dmg*=(1-defTotal())*dmgTakenMul();if(mounted())dmg*=MOUNTDMG;S.hp-=dmg;thornsHit(dmg);P.inv=.9;const rock=setOn('stone'),kr=rock?0:1-gearSum('kb');
 // on horseback nothing knocks you off: normal hits only hurt (you keep galloping); golem punches and BONKs shove the horse back
 if(mounted()){P.kbx=0;if(src==='golem'||src==='bonk'){P.hv=(P.x>=sx?1:-1)*(src==='bonk'?170:150)*Math.max(.4,kr);if(P.onGround){P.vy=-110;P.onGround=false}}
  else if(Math.abs(P.hv||0)>HITSLOW*GALLOP)P.hv=Math.sign(P.hv)*HITSLOW*GALLOP}
 else{P.kbx=(P.x>=sx?1:-1)*140*kr;if(P.onGround&&kr>.6){P.vy=-120*kr;P.onGround=false}}
 ftxt(P.x,P.y-24,'-'+Math.round(dmg),'#ff6a6a');part(P.x,P.y-10,'#e84a4a',6,80);
 if(!DG&&!rock&&knock!==false&&cargoCount()&&rnd()<.4){const u=randomUnit();if(u){dropUnit(u,P.x,P.y-14,(P.x>=sx?-1:1)*(60+rnd()*60));ftxt(P.x,P.y-32,'-1 '+ITEMS[u.item].name,'#ffd75e')}}
 if(S.hp<=0)die()}
function refundOf(units){let t=0;for(const u of units)t+=(+u.paid||0)*(u.qty||1);return Math.round(t*REFUND)}
function die(){if(DG){dungeonKO();return}const lost=cargoCount();const gnd=PICK.filter(k=>k.item!=null&&!k.mat&&!k.gear);const refund=refundOf(S.cargo)+refundOf(gnd);S.money+=refund;S.cargo=[];if(S.horse&&S.horse.on){S.horse.on=false;S.horse.x=TOWNS[S.lastTown].x+30;S.horse.dir=-1}S.hp=0;S.stats.deaths++;PICK=[];ENEMIES=[];PROJ=[];ROCKS=[];
 $('deadTxt').innerHTML=(lost?'Lost '+lost+' goods.':'No goods lost.')+(refund?'<br><br><span id="refund" style="color:#ffd75e;font-size:11px">+'+pr(refund)+' refunded</span><br><span style="opacity:.7">(half of what you paid)</span>':'')+'<br><br>Money and gear kept.<br>Waking up in '+TOWNS[S.lastTown].name+'.';S.x=TOWNS[S.lastTown].x;S.hp=maxHP();
 try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}setMode('dead')}
function hitEnemy(e,dmg,dir,elem){const w=WEAPONS[S.weapon];const m=wmult({elem:elem},e.type);const cr=wv('crit'),crit=cr&&rnd()<cr;const d=dmg*m*dmgMul()*(crit?2:1)*(.9+rnd()*.2);e.hp-=d;onHitFx(e,d);e.hitT=.12;e.vx=dir*(ENEMY[e.type].base==='golem'?30:90)*(wv('knock')||1);if(crit){ftxt(e.x,e.y-ENEMY[e.type].h-12,'CRIT!','#ffe08a');part(e.x,e.y-8,'#ffe08a',6,90)}
 ftxt(e.x,e.y-ENEMY[e.type].h-4,Math.round(d)+(m>1?'!':''),m>1?'#ffd75e':m<1?'#9a9a9a':'#ffffff');part(e.x,e.y-8,'#ffffff',3,60);
 if(e.hp<=0)killEnemy(e)}
function killEnemy(e){const d=ENEMY[e.type];e.dead=1;S.stats.kills++;const c=Math.round((d.coin[0]+Math.floor(rnd()*(d.coin[1]-d.coin[0]+1)))*(1+ev('greedy')));S.money+=c;ftxt(e.x,e.y-d.h-10,'+$'+c,'#ffd75e');
 const base=d.base||e.type;part(e.x,e.y-d.h/2,'#ffffff',8,70,30,.45);if(d.h>=18)shake(1);part(e.x,e.y-d.h/2,e.type==='pegasus'?'#e8f0ff':e.type==='skySlime'?'#8ad8ff':base==='slime'?'#5cc84a':base==='golem'?golemPal(e.type)[0]:base==='witch'?'#a060e0':'#6aa84f',14,140);
 for(const [id,ch] of (d.fruit?[]:DROPS[base]||[]).concat(base!==e.type?DROPS[e.type]||[]:[]))if(rnd()<ch*DROPMUL*(1+.6*ev('greedy')))dropLoot(id,e.x,e.y-10);
 if(d.air&&!d.isle&&d.gem)airGem(e,d);
 if(DG){let n=0;for(const u of e.loot)if(cargoCount()<cap()){addCargo(u.item,u.origin,1,u.paid);n++}if(n)ftxt(P.x,P.y-30,'+'+n,'#7de07a')}else for(const u of e.loot)dropUnit(u,e.x,e.y-10);e.loot=[]}
// homing fireballs: pick the nearest enemy within range in a forward cone, turn toward it at a limited rate
function steerProj(p,dt){const sp=Math.hypot(p.vx,p.vy)||1,ux=p.vx/sp,uy=p.vy/sp;let best=null,bd=190;
 for(const e of ENEMIES){if(e.dead)continue;const tx=e.x-p.x,ty=e.y-ENEMY[e.type].h/2-p.y,d=Math.hypot(tx,ty);if(d<bd&&(tx*ux+ty*uy)/(d||1)>.34){bd=d;best=[tx,ty]}}
 if(!best)return;const want=Math.atan2(best[1],best[0]),cur=Math.atan2(uy,ux);let da=want-cur;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
 const tr=3.6*(p.home||1)*dt,a=cur+clamp(da,-tr,tr);p.vx=Math.cos(a)*sp;p.vy=Math.sin(a)*sp}
function playerAttack(){if(mounted()&&S.lance&&!WEAPONS[S.weapon].flail){lanceStrike();return}const w=WEAPONS[S.weapon];if(P.cd>0)return;P.cd=w.cd;P.atk=1;P.atkD=w.flail?FLAIL.anim:.2;
 if(w.flail){flailSwing(w);return}
 if(w.ranged){const fire=w.elem==='fire',twin=setOn('witch'),n=twin?2:1;for(let i=0;i<n;i++){const a=twin?(i?-.13:.13):0;
  PROJ.push({x:P.x+P.dir*8,y:P.y-9-(twin?(i?2:-2):0),vx:P.dir*w.pspd*Math.cos(a),vy:w.pspd*Math.sin(a)+(w.leaf?-4:0),g:w.leaf?6:0,dmg:w.dmg*(1+gearSum('rng'))*(twin?.75:1),from:'p',elem:w.elem,kind:fire?'fire':w.leaf?'leaf':'bolt',home:fire?1:w.leaf?.6:0,life:fire?2.2:w.leaf?1.8:1.4,spin:rnd()*6})}
  if(twin)part(P.x+P.dir*8,P.y-9,'#c060ff',4,40,0,.3);return}
 const x0=P.dir>0?P.x:P.x-w.range-4,x1=P.dir>0?P.x+w.range+4:P.x;
 for(const e of ENEMIES){if(e.dead)continue;const d=ENEMY[e.type];if(e.x+d.w/2>x0&&e.x-d.w/2<x1&&e.y-d.h<P.y+2&&e.y>P.y-24){hitEnemy(e,w.dmg,P.dir,w.elem);if(w.burn&&!e.dead&&e.type!=='lavaGolem')e.burn=2}}}
// Cog Flail: light vertical auto-aim. Everything is measured from the hand the chain swings from (flPivot), to the nearest edge of each foe's box (not its centre), so the hitbox matches where the gear is drawn.
// Lock: nearest foe ahead whose box is within FLAIL.reach (vertical distance counts x FLAIL.vk, so the reach is a tall ellipse) and +-FLAIL.vband px; it is always hit.
// Splash: anyone within FLAIL.splash px of the gear's landing point. Sweep: for the whole swing, any foe whose box the drawn gear passes within FLAIL.pad px of is hit too (once per swing).
function flPivot(){const m=mounted();return {x:P.x+P.dir*(m?2:3.5),y:P.y-(m?18:8)}}
function boxD(e,x,y){const d=ENEMY[e.type],nx=clamp(x,e.x-d.w/2,e.x+d.w/2),ny=clamp(y,e.y-d.h,e.y);return {dx:(nx-x)*P.dir,dy:ny-y}}
function flHead(k){const o=flPivot(),ga=lerp(-2.0,.7,smooth(k)),ex=o.x+Math.cos(ga)*P.dir*4,ey=o.y+Math.sin(ga)*4,len=4+(FAIM.r-4)*Math.sin(Math.PI*Math.min(1,k*1.2)),th=lerp(-2.4,FAIM.a,smooth(Math.min(1,k*2.2)));return {x:ex+P.dir*Math.cos(th)*len,y:ey+Math.sin(th)*len}} // same path drawFlail draws
function flailSwing(w){const o=flPivot();let best=null,bd=1e9;
 for(const e of ENEMIES){if(e.dead)continue;const d=ENEMY[e.type];if((e.x-o.x)*P.dir<-d.w/2-4)continue;const b=boxD(e,o.x,o.y);if(Math.abs(b.dy)>FLAIL.vband)continue;const dd=Math.hypot(Math.max(0,b.dx),b.dy*FLAIL.vk);if(dd<=FLAIL.reach&&dd<bd){bd=dd;best=e}}
 let lx,ly;if(best){const d=ENEMY[best.type],cx=(best.x-o.x)*P.dir,cy=best.y-d.h/2-o.y;FAIM={a:clamp(Math.atan2(cy,Math.max(8,cx)),-1.25,1.25),r:clamp(Math.hypot(Math.max(8,cx),cy),16,w.range+8)};lx=best.x;ly=best.y-d.h/2}
 else{FAIM={a:0,r:w.range};lx=o.x+P.dir*w.range;ly=o.y} // no lock: splash where the gear is actually drawn (was 0.8x range, short of the sprite)
 const hl=flHead(1/2.4),hit=new Set(); // the gear's drawn landing point (full extension)
 for(const e of ENEMIES){if(e.dead)continue;const b1=boxD(e,lx,ly),b2=boxD(e,hl.x,hl.y);if(e===best||Math.hypot(b1.dx,b1.dy)<=FLAIL.splash||Math.hypot(b2.dx,b2.dy)<=FLAIL.splash){hit.add(e);hitEnemy(e,w.dmg,P.dir,w.elem)}}
 FSW={w,hit};if(best)part(lx,ly,'#c8ccd4',6,90)}
function flailTick(){const f=FSW;if(!f)return;if(P.atk<=0||!WEAPONS[heldW()].flail){FSW=null;return}const k=1-P.atk;if(k<.1||k>.8)return;const h=flHead(k);
 for(const e of ENEMIES){if(e.dead||f.hit.has(e))continue;const b=boxD(e,h.x,h.y);if(Math.hypot(b.dx,b.dy)<=FLAIL.pad){f.hit.add(e);hitEnemy(e,f.w.dmg,P.dir,f.w.elem)}}}
function update(dt){S.time+=dt;{const rg=ev('regen');if(rg&&S.hp>0)S.hp=Math.min(maxHP(),S.hp+rg*dt)}
 if(DG)updDungeon(dt);else if(WI&&P.fly)updSky(dt);else updWorld(dt);
 // actions
 if(P.cd>0)P.cd-=dt;if(P.atk>0)P.atk=Math.max(0,P.atk-dt/(P.atkD||.2));if(P.inv>0)P.inv-=dt;
 flailTick();if(inp.attack())playerAttack();if(mounted())lanceTick(dt);else P.couch=0;
 if(inp.swap()){if(mounted()&&S.lances.length){const fo=S.weapons.find(w=>WEAPONS[w].flail),L=S.lances.concat(fo?[fo]:[]),nx=L[(L.indexOf(heldW())+1)%L.length]; // the owned Cog Flail joins the saddle rotation
  if(WEAPONS[nx].flail){if(!WEAPONS[S.weapon].flail)S.wprev=S.weapon;S.weapon=nx}else{S.lance=nx;if(WEAPONS[S.weapon].flail)S.weapon=S.wprev&&S.weapons.includes(S.wprev)?S.wprev:S.weapons.find(w=>!WEAPONS[w].flail)||'fists'}toast(WEAPONS[nx].name,900)}else{const i=S.weapons.indexOf(S.weapon);S.weapon=S.weapons[(i+1)%S.weapons.length];toast(WEAPONS[S.weapon].name,900)}}
 if(inp.pot()){if(S.potions>0&&S.hp<maxHP()){S.potions--;const ph=ench('berserk')?INN.potHPBerserk:INN.potHP;S.hp=Math.min(maxHP(),S.hp+ph);ftxt(P.x,P.y-26,'+'+ph,'#7de07a');part(P.x,P.y-10,'#7de07a',10,60,-40)}else if(!S.potions)toast('No potions',900)}
 // enemies
 for(const e of ENEMIES){if(e.dead)continue;updEnemy(e,dt)}
 prune(ENEMIES,e=>!e.dead);
 // projectiles
 for(const p of PROJ){p.life-=dt;if(p.home)steerProj(p,dt);p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.kind==='fire'||p.kind==='lava')if(rnd()<(p.home?1:.6))PARTS.push({x:p.x-p.vx*.01,y:p.y-p.vy*.01,vx:(rnd()-.5)*12,vy:-10-rnd()*10,col:rnd()<.33?'#ff7a1a':rnd()<.5?'#ffd040':'#d8401a',g:0,life:p.home?.4:.25});
  let solid;if(DG)solid=dSolid(p.x,p.y);else{const gy=groundAt(p.x);solid=gy!==null&&p.y>gy}
  if(solid||p.life<=0||townAt(p.x,TOWNR-20)&&p.from==='e'){p.dead=1;part(p.x,p.y,p.kind==='bolt'?'#c8a060':p.kind==='leaf'?'#6cc04a':'#ff8a2a',5,70);continue}
  if(p.from==='p'){for(const e of ENEMIES){if(e.dead)continue;const d=ENEMY[e.type];if(Math.abs(e.x-p.x)<d.w/2+2&&p.y>e.y-d.h&&p.y<e.y+1){hitEnemy(e,p.dmg,Math.sign(p.vx),p.elem);p.dead=1;break}}}
  else if(Math.abs(p.x-P.x)<(mounted()?9:6)&&p.y>P.y-(mounted()?27:17)&&p.y<P.y+1){p.dead=1;hurtPlayer(p.dmg,p.x)}}
 prune(PROJ,p=>!p.dead);
 // pickups (road only)
 if(!DG){for(const k of PICK){k.life-=dt;if(!k.ground){k.vy+=600*dt;k.x+=k.vx*dt;k.y+=k.vy*dt;const gy=groundAt(k.x);const pit=pitAt(k.x);if(pit&&k.y>pit.ly){k.dead=1;part(k.x,pit.ly,'#ff7a1a',6,60);continue}if(gy!==null&&k.y>=gy){k.y=gy;k.ground=true}}
  if(k.life<=0)k.dead=1;else if(Math.abs(k.x-P.x)<10&&Math.abs(k.y-(P.y-4))<14&&k.age>.4){if(k.mat){giveMat(k.mat);k.dead=1}else if(k.gear){giveGear(k.gear);k.dead=1}else if(cargoCount()<cap()){addCargo(k.item,k.origin,1,k.paid);k.dead=1;ftxt(P.x,P.y-26,'+1 '+ITEMS[k.item].name,'#7de07a')}}
  k.age=(k.age||0)+dt}
 prune(PICK,k=>!k.dead)}
 for(const p of PARTS){p.life-=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}prune(PARTS,p=>p.life>0);
 for(const f of FTXT){f.life-=dt;f.y-=18*dt}prune(FTXT,f=>f.life>0);
 env.saveT=(env.saveT||0)+dt;if(env.saveT>5){env.saveT=0;save()}
}
function updWorld(dt){if(WI){w2Tick(dt);wcTick(dt)}const H=HAULERS[carriedH()];const b=biomeAt(P.x);const town=townAt(P.x);
 if(b!==env.biome){if(env.biome>=0||b>0)biomeToast(b);env.biome=b}
 // env
 let mul=H.spd;
 // on horseback: 1.5x (World 2: the winged horse plods on land, HLAND); a hitched cart drags a little (more when loaded), always faster than walking it
 if(mounted()){const c=cap(),fill=c?cargoCount()/c:0;mul=(WI?HLAND:RIDE)*(carriedH()==='backpack'?1:1-(1-H.spd)*(.3+.4*fill))}
 if(inDrift(P.x)&&P.onGround)mul*=.55;
 if(!WI)mul=w1Weather(dt,b,town,mul);
 let mv=(inp.left()?-1:0)+(inp.right()?1:0);if(mv)P.dir=mv;
 if(b===2&&mv&&P.onGround){const s=(heightAt(P.x+3*mv)-heightAt(P.x-3*mv))/6;if(s>0)mul*=Math.max(.45,1-s*2.6);else mul*=Math.min(1.15,1-s*.8)}
 let vx=mv*92*mul*spdMul();if(mounted()){P.hv=(P.hv||0)+(vx-(P.hv||0))*Math.min(1,dt*(mv&&Math.sign(vx)===Math.sign(P.hv||vx)?2.2:5));if(Math.abs(P.hv)<1&&!mv)P.hv=0;vx=P.hv;P.ride=(P.ride||0)+Math.abs(vx)*dt}else P.hv=0;
 const ox=P.x;P.x=clamp(P.x+(vx+P.kbx)*dt,XMIN,XMAX);P.kbx*=Math.pow(.004,dt);if(Math.abs(P.kbx)<2)P.kbx=0;
 const dx=P.x-ox;P.walk=mv&&P.onGround;P.wheel+=dx/4;
 const g=groundAt(P.x);
 if(P.onGround){if(g===null)P.onGround=false;else P.y=g}
 if(inp.jump()&&canFly()){startFly();part(P.x-P.dir*6,P.y-16,'#ffffff',6,60,40,.5)} // winged horse: jump takes off into the low sky band
 else if(inp.jump()&&P.onGround){P.vy=-255*H.jump*(mounted()?.97:1);P.onGround=false}
 if(!P.onGround){P.vy+=720*dt;P.y+=P.vy*dt;if(WI&&!P.fly&&g===null&&canFly()&&P.vy>0)startFly();if(WI&&!P.fly&&P.y>60){fallOut();return}if(g!==null&&P.y>=g&&(P.vy>=0||P.y>g+3)){P.y=g;P.vy=0;P.onGround=true}
  const pit=pitAt(P.x);if(pit&&P.y>pit.ly){burnPit(pit)}}
 if(P.onGround&&g!==null&&!pitAt(P.x-6)&&!pitAt(P.x+6))P.lastSafe=P.x;
 // spawning
 if(!town&&!WI){env.spawnD+=Math.abs(dx);if(env.spawnD>env.next){env.spawnD=0;env.next=b===4?190+rnd()*170:300+rnd()*200-b*45;spawnGroup(mv||P.dir)}}
 // hazards
 if(!WI)w1Rocks(dt,b,town,vx);
 if(b===3&&!town){P.heat+=dt;if(P.heat>2.5){P.heat=0;S.hp-=1;ftxt(P.x,P.y-24,'-1','#ff9a4a');if(S.hp<=0)die()}}
 for(const r of ROCKS){if(r.warn>0){r.warn-=dt;if(r.warn<=0)r.y=surfY(r.x)-150}else{r.vy+=520*dt;r.y+=r.vy*dt;const gy=surfY(r.x);if(r.y>=gy-3){r.dead=1;part(r.x,gy-2,'#8a8a8a',10,120);if(Math.abs(r.x-P.x)<10&&P.y>gy-30)hurtPlayer(14,r.x)}}}
 prune(ROCKS,r=>!r.dead);
 // caves you pass get marked on the map
 for(const d of DUNGEONS)if(Math.abs(d.x-P.x)<VW*.5&&!S.caves.includes(d.i))S.caves.push(d.i);
 if(!WI)witchTick();
 if(inp.cart())toggleCart();if(inp.horse())toggleHorse();
 if(MODE!=='play'){showPrompt('');return}
 const dn=dungAt(P.x,20),nearCart=nearCartP();let h='';
 if(town){h='<b class="gold">'+town.name+'</b><br>'+(isTouch?'Tap E':'Press E')+' to trade';if(S.lastTown!==town.i){S.lastTown=town.i;if(!S.visited.includes(town.i))S.visited.push(town.i);save()}if(inp.use())enterTown(town)}
 else if(dn){const l=dState(dn);h=l?skulls(dn.diff,1)+' ✓<br>⟳ '+Math.ceil(l/60)+'m':skulls(dn.diff)+'<br>'+(isTouch?'E':'[E]')+' Enter';if(inp.use()&&!l)enterDungeon(dn)}
 else if(nearWitch()){h='<b style="color:#c9b4ec">🔮 Vex</b><br>'+(isTouch?'Tap E':'Press E')+' to enchant';if(inp.use())openWitch()}
 else if(nearDock()){h=ico('ship')+'<br>'+(isTouch?'Tap E':'[E]');if(inp.use())openDock()}
 else if(nearPile()){h=(S.scrap.done?'✈ <b class="gold">World 2</b>':'🛠 ✈ '+Math.floor(scrapFrac()*100)+'%')+'<br>'+(isTouch?'Tap E':'[E]');if(inp.use())openScrap()}
 if(nearCart)h+=(h?'<br>':'')+'🛒 '+(isTouch?'Tap 🛒':'[C]')+' Hitch';
 if(nearHorse())h+=(h?'<br>':'')+'🐴 '+(isTouch?'Tap 🐴':'[R]')+' Ride';
 showPrompt(MODE==='play'?h:'')}
function biomeToast(b){const t=performance.now()/1000;env.bT=env.bT||{};if(!(t-(env.bT[b]||-99)<8))toast('<b>'+BIOMES[b].name+'</b><br>'+BIOMEINFO[b],2600);env.bT[b]=t}
