'use strict';
// horse (facing +x; x,y = between the hooves). run: 0..1 gallop amount; idle: standing animation
function drawHorse(c,x,y,dir,t,run,idle,flash){const P=(xo,yo,w,h,col)=>{px(c,dir>0?x+xo:x-xo-w,y+yo,w,h,flash?'#ffffff':col)};
 const B='#8a5a32',BH='#a8743c',BS='#6e4526',M='#2a1a10',HF='#1e140c';
 const hf=WI===1&&S&&S.horse&&S.horse.wings?horseFlap(idle):null,hfly=hf!==null&&!!(plr()&&plr().fly==='horse');
 const ph=run>0?t*(10+8*run):0,g=run>.05&&!hfly;const leg=(lx,o)=>{if(hfly){const k=lx<0?1:0;P(lx-k,-7,2,4,BS);P(lx-1-k,-4,2,1,BS);P(lx-1-k,-3,2,1,HF);return}const a=g?Math.sin(ph+o):0,lift=g?Math.max(0,Math.round(a*(2.2+run))):0,sw=g?Math.round(Math.cos(ph+o)*(2+run)*Math.min(1,run*1.5)):0;
  P(lx+sw,-7,2,6-lift,BS);P(lx+sw,-1-lift,2,1,HF)};
 const gal=run>.55;leg(-8,Math.PI);leg(5,0);
 const bob=hfly?FLAPBOB[flapF(t,hf)]:g?Math.round(Math.sin(ph*2)*(.5+.9*Math.min(1,run))):0; // walk = trot pairs, gallop = paired legs slightly out of step
 P(-10,-14+bob,19,7,B);P(-9,-15+bob,16,1,B);P(-9,-15+bob,15,1,BH);P(-10,-8+bob,19,1,BS);P(-11,-13+bob,1,5,B);
 leg(-6,gal?Math.PI+.8:0);leg(7,gal?.8:Math.PI);
 // neck + head
 const hb=idle?Math.round(Math.max(0,Math.sin(t*.8))*3):0;
 P(6,-19+bob+hb,4,6,B);P(8,-21+bob+hb,3,4,B);P(10,-22+bob+hb,5,4,B);P(14,-21+bob+hb,2,3,BS);P(15,-19+bob+hb,1,1,HF);P(11,-21+bob+hb,1,1,HF);P(9,-24+bob+hb,2,2,B);P(9,-24+bob+hb,1,1,BS);
 P(6,-21+bob+hb,2,7,M);P(8,-23+bob+hb,2,2,M);
 // tail
 const ts=Math.round(Math.sin(t*(g?14:2.2))*1.2)+(g?-1:1);P(-13,-15+bob,2,2,M);P(-14,-13+bob+ts,2,5,M);P(-13,-9+bob+ts,1,2,M);
 // saddle + blanket
 P(-4,-16+bob,7,2,'#7a2a1a');P(-4,-16+bob,7,1,'#a8402a');P(-5,-14+bob,9,4,'#3a6ea5');P(-5,-11+bob,9,1,'#d8b040');
 if(idle){P(12,-20+hb,4,1,'#5a3818')}else{P(10,-20+bob,6,1,'#5a3818');P(4,-19+bob,7,1,'#5a3818')}
 if(WI===1&&S&&S.horse&&S.horse.wings)drawWings(P,t,bob,idle?0:run,idle)}
// rider on horseback: horse, then the player seated, then a leg down the flank; lance couched while charging
function drawRider(c,sx,sy,d,t,fl,cols){const s=lanceSpeed();drawHorse(c,sx,sy,d,t,s,0,fl);const hf=WI===1&&S.horse.wings?horseFlap(0):null,by=hf!==null&&P.fly==='horse'?FLAPBOB[flapF(t,hf)]:Math.round(Math.sin((P.ride||0)*.35)*(s>.05?.8:0));
 const ry=sy-10+by;drawPlayer(c,sx-1*d,ry,d,t,false,false,fl,S.lance||S.weapon,P.couch>0?1:0,{eq:S.eq,look:S.look});
 const L=(xo,yo,w,h,col)=>px(c,d>0?sx+xo:sx-xo-w,sy+yo,w,h,fl?'#ffffff':col);const FT=S.eq.feet;L(-1,-12+by,2,4,'#4a3b2a');L(-1,-8+by,3,1,FT==='witchboots'?'#c060ff':FT==='stoneboots'?'#b8b8c0':'#2a1d14');
 if(carriedH()==='backpack')drawHauler(c,sx-1*d,ry,d,'backpack',cols,0);
 setAura(c,sx,ry,t);enchAura(c,sx,ry,t);
 if(s>.7&&Math.floor(t*20)%2)part(P.x-d*12,P.y-1,'#c8b898',1,30,0,.3)}
const HORSEURL=(()=>{const c=document.createElement('canvas');c.width=34;c.height=28;const g=c.getContext('2d');drawHorse(g,16,27,1,0,0,0);return c.toDataURL()})();
const LANCEMIN=.25,LANCEMAX=1.75,MOUNTDMG=1.3,HITSLOW=.4; // mounted: +30% damage taken (after armor), a hit drops you to 40% of gallop // lance damage x0.25 standing .. x1.75 at full gallop
function mounted(){return !!(S&&S.horse&&S.horse.on&&!DG)}
function heldW(){return S&&S.horse&&S.horse.on&&!DG&&S.lance?S.lance:S?S.weapon:'fists'}
function nearHorse(){return !!(S&&S.horse&&!S.horse.on&&!DG&&P&&Math.abs(P.x-S.horse.x)<22)}
function buyHorse(ti){if(S.horse||S.money<HORSEPRICE)return false;S.money-=HORSEPRICE;S.horse={on:false,x:TOWNS[ti].x+30,dir:-1};if(!S.lances.includes('woodlance'))S.lances.unshift('woodlance');if(!S.lance)S.lance='woodlance';
 toast('<img class="px" style="width:28px;height:20px;vertical-align:middle" src="'+HORSEURL+'"> <b>Horse</b> ✓<br><span class="small">'+(isTouch?'tap 🐴':'press R')+'</span>',2600);save();return true}
function horseSpot(x){x=clamp(x,Math.max(24,XMIN),Math.min(WORLD-24,XMAX));if(WI&&!onIsle(x))x=P.x;if(PITS.some(p=>x>p.x0-16&&x<p.x1+16))x=P.lastSafe;return Math.round(x)}
function mount(){if(!nearHorse())return false;S.horse.on=true;S.horse.x=null;P.hv=0;P.couch=0;P.x=clamp(P.x,12,WORLD-12);part(P.x,P.y-6,'#c8a060',8,60);toast('🐴 '+WEAPONS[S.lance].name,1000);save();return true}
function dismount(at){if(!S.horse||!S.horse.on)return;S.horse.on=false;S.horse.x=horseSpot(at!=null?at:P.x);S.horse.dir=P.dir;P.hv=0;P.couch=0;P.ride=0;save()}
function toggleHorse(){if(P&&P.fly)return;if(!S.horse){toast('🐴 Stables: Bog Town · Pinehollow · Stonepeak',1600);return}if(DG){toast('No horses in caves',1100);return}
 if(S.horse.on){dismount(P.x+P.dir*4);P.x=clamp(P.x-P.dir*10,XMIN,XMAX);toast('🐴 🅿',800);return}
 if(!nearHorse())summonHorse();mount()}
// the horse button whistles your horse over from wherever it was left (a cave mouth, another island, the other end of the road) and you hop on
function summonHorse(){if(!S.horse||S.horse.on||DG)return;const x=horseSpot(P.x-P.dir*8);S.horse.x=x;S.horse.dir=P.dir;if(WI)S.horse.wings=true;
 part(x,surfY(x)-6,'#e8dcc0',12,90,120,.6);part(x,surfY(x)-14,'#ffffff',6,60,40,.5);ftxt(P.x,P.y-30,'♪','#ffe08a')}
function lanceStrike(){const w=WEAPONS[S.lance];if(P.cd>0||P.couch>0)return;P.cd=w.cd;P.couch=.55;P.hits=[]}
function lanceSpeed(){return clamp(Math.abs(P.hv||0)/(P&&P.fly==='horse'?GALLOP*HFLY:GALLOP),0,1)} // in the sky the (slow) winged horse's own top speed counts as a full charge
function lanceTick(dt){if(!(P.couch>0))return;P.couch-=dt;const w=WEAPONS[S.lance],s=lanceSpeed();
 const x0=P.dir>0?P.x+4:P.x-w.range-6,x1=P.dir>0?P.x+w.range+6:P.x-4;
 for(const e of ENEMIES){if(e.dead||P.hits.includes(e))continue;const d=ENEMY[e.type];if(!(e.x+d.w/2>x0&&e.x-d.w/2<x1&&e.y-d.h<P.y-6&&e.y>P.y-34))continue;
  P.hits.push(e);const mul=LANCEMIN+(LANCEMAX-LANCEMIN)*s;const g=isGolem(e.type);const hp0=e.hp;
  hitEnemy(e,w.dmg*mul,P.dir,w.elem);P.lastLance={type:e.type,s:+s.toFixed(3),mul:+mul.toFixed(3),dmg:Math.round(hp0-e.hp)};
  if(w.burn&&!e.dead&&e.type!=='lavaGolem')e.burn=2;
  if(s>.75){ftxt(e.x,e.y-d.h-18,'CHARGE!','#ffd75e');part(e.x,e.y-d.h/2,'#fff4b0',10,150)}
  if(!g&&!e.dead)e.vx=P.dir*(90+220*s);
  // golems don't budge: a fast head-on charge bounces you off the horse
  if(g&&s>.35&&!e.dead){P.couch=0;P.inv=0;P.bounced=(P.bounced||0)+1;hurtPlayer(Math.round(3+4*s),e.x,false,'bonk');ftxt(P.x,P.y-44,'BONK','#ff9a4a');part(P.x+P.dir*10,P.y-16,'#ffd75e',8,110);break}
  P.hv*=g?.2:.85}}
