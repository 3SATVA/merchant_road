'use strict';
// Minecraft-style: each enchant has a level I-III; an offer holds 1-3 enchants (no duplicate types).
// v = value per level; w = roll weight per category (w = weapons, a = armor); cur = curse (high risk, high reward)
const RN=['I','II','III'],pc=x=>Math.round(x*100)+'%';
const ENCH={
 sharp:{n:'Sharp',col:'#e8eef4',w:{w:20},v:[.1,.2,.3],d:v=>'⚔ +'+pc(v)},
 crit:{n:'Critical',col:'#ffe08a',w:{w:14},v:[.1,.15,.2],d:v=>'✴ '+pc(v)+' ×2 hit'},
 knock:{n:'Knockback',col:'#d8b890',w:{w:12},v:[1.6,2.2,2.8],d:v=>'💥 push ×'+v},
 burning:{n:'Burning',col:'#ff8a2a',w:{w:14},v:[[2,5],[3,7],[4,9]],d:v=>'🔥 '+v[1]+'/s '+v[0]+'s'},
 freezing:{n:'Freezing',col:'#7ad0ff',w:{w:14},v:[1.5,2.5,3.5],d:v=>'❄ slow '+v+'s'},
 venom:{n:'Venom',col:'#6cd04a',w:{w:14},v:[[3,3],[4,4],[5,5]],d:v=>'☠ '+v[1]+'/s '+v[0]+'s'},
 leeching:{n:'Leeching',col:'#ff7aa8',w:{w:12,a:16},v:[1,2,3],d:v=>'❤ +'+v+'/hit'},
 guarded:{n:'Guarded',col:'#a8c8ff',w:{a:24},v:[.06,.1,.14],d:v=>'🛡 -'+pc(v)},
 swift:{n:'Swift',col:'#7de07a',w:{a:16},v:[.05,.08,.12],d:v=>'👟 +'+pc(v)},
 hardy:{n:'Hardy',col:'#ffd75e',w:{a:16},v:[10,15,25],d:v=>'❤ +'+v+' max'},
 thorns:{n:'Thorns',col:'#9ad870',w:{a:14},v:[.2,.35,.5],d:v=>'🌵 reflect '+pc(v)},
 regen:{n:'Regen',col:'#ff9ac8',w:{a:14},v:[.5,1,1.5],d:v=>'❤ +'+v+'/s'},
 bloodthirst:{n:'Bloodthirst',cur:1,w:{w:30},v:[[.5,.1],[.65,.15],[.8,.2]],d:v=>'⚔ +'+pc(v[0])+' · 💔 +'+pc(v[1])+' taken'},
 berserk:{n:'Berserk',cur:1,w:{w:25},v:[.6,.9,1.2],d:v=>'⚔ up to +'+pc(v)+' at low ❤ · 🧪 half'},
 volatile:{n:'Volatile',cur:1,w:{w:25},v:[[.2,15],[.25,22],[.3,30]],d:v=>'💣 '+pc(v[0])+' boom '+v[1]+' · -3 you'},
 heavy:{n:'Heavy',cur:1,w:{a:60},v:[.2,.28,.36],d:v=>'🛡 -'+pc(v)+' · 👟 -12%'},
 greedy:{n:'Greedy',cur:1,w:{w:20,a:40},v:[.5,.75,1],d:v=>'$ +'+pc(v)+' · loot+ · 👺 more'},
 // Sticky: never rolls (w:{}); only comes built into a weapon (WEAPONS[id].perm, the Resin Sword's Sticky III). v = enemy speed multiplier for
 // STICKY.dur s after a hit; multiplies with Freezing's slow, floored at STICKY.floor so nothing ever stops dead
 sticky:{n:'Sticky',col:'#e8a040',perm:1,w:{},v:[.8,.7,.6],d:v=>'slow -'+pc(1-v)+' '+STICKY.dur+'s · stacks with ❄'}};
const STICKY={dur:2.5,floor:.25};
const CURSECOL='#ff4a6a';for(const k in ENCH)if(ENCH[k].cur)ENCH[k].col=CURSECOL;
const ENCHCOST=3; // flat, every time
const ENCHN=[60,30,10],ENCHL=[55,33,12]; // 1/2/3 enchants, level I/II/III
const CURSEP=1/6; // each enchant rolled has this chance to be a curse
let WTOWER=0;const ENCHT={cost:6,curse:.057,n:[25,45,30],l:[0,55,45]}; // Vex's Tower (World 2 capital): 2x the wagon's essence, curse chance per enchant cut so a roll is ~92% curse-free (wagon ~77%); n/l: Vex rolls more enchants (1/2/3: 25/45/30, wagon 60/30/10) and only level II-III (55/45, wagon I/II/III 55/33/12)
function isWep(id){return !GEAR[id]&&!!WEAPONS[id]}
function wIdx(ws){let t=ws.reduce((a,b)=>a+b,0)*rnd();for(let i=0;i<ws.length;i++){if(t<ws[i])return i;t-=ws[i]}return 0}
function rollEnchants(id){const c=isWep(id)?'w':'a',n=1+wIdx(WTOWER?ENCHT.n:ENCHN),out=[];
 for(let i=0;i<n;i++){const cur=rnd()<(WTOWER?ENCHT.curse:CURSEP);const ok=k=>ENCH[k].w[c]&&!out.some(o=>o.k===k);let pool=Object.keys(ENCH).filter(k=>ok(k)&&!!ENCH[k].cur===cur);if(!pool.length)pool=Object.keys(ENCH).filter(ok);if(!pool.length)break;
  out.push({k:pool[wIdx(pool.map(k=>ENCH[k].w[c]))],l:1+wIdx(WTOWER?ENCHT.l:ENCHL)})}return out}
function enchCost(){return WTOWER?ENCHT.cost:ENCHCOST}
// replaces every enchant on the item with a fresh random roll
function enchantItem(id){if(!(S.weapons.includes(id)||S.gear.includes(id)||S.lances.includes(id))||id==='fists')return null;if((S.mats.essence||0)<enchCost())return null;
 S.mats.essence-=enchCost();S.ench[id]=rollEnchants(id);save();return S.ench[id]}
// an item's enchants: built-in ones first (WEAPONS[id].perm, e.g. the Resin Sword's Sticky III: can't be rolled off, a re-roll never adds a
// second copy), then whatever S.ench holds
function encList(id){const e=S&&S.ench&&S.ench[id],a=Array.isArray(e)?e:[],W=WEAPONS[id],pm=W&&!GEAR[id]&&W.perm;return pm?pm.concat(a.filter(x=>!pm.some(p=>p.k===x.k))):a}
function eVal(x){return ENCH[x.k].v[x.l-1]}
function eName(x){return ENCH[x.k].n+' '+RN[x.l-1]}
// enchant sources currently active: held weapon + worn armor -> [key, 'w'|'a', level]
function activeEnch(){const a=[];if(!S)return a;for(const x of encList(heldW()))a.push([x.k,'w',x.l]);if(S.eq)for(const [sl] of GSLOTS){const g=S.eq[sl];if(g)for(const x of encList(g))a.push([x.k,'a',x.l])}return a}
function ench(k){let n=0;for(const [x] of activeEnch())if(x===k)n++;return n}
function ev(k,i){let s=0;for(const [x,,l] of activeEnch())if(x===k){const v=ENCH[k].v[l-1];s+=Array.isArray(v)?v[i||0]:v}return s} // summed value
function wv(k){const x=encList(heldW()).find(x=>x.k===k);return x?eVal(x):null} // held weapon's value
function berserkMul(){const b=ev('berserk');return b?1+b*clamp(1-S.hp/maxHP(),0,1):1}
function dmgMul(){return (1+ev('sharp'))*(1+ev('bloodthirst',0))*berserkMul()*(1+(S&&S.eq?gearSum('atk'):0))} // atk = Cultist armor
function aspdMul(){return 1+(S&&S.eq?gearSum('aspd'):0)} // attack speed (Cultist armor): weapon / lance cooldown divided by this
function dmgTakenMul(){return 1+ev('bloodthirst',1)}
function defTotal(){return Math.min(.75,gearSum('def')+ev('guarded')+ev('heavy'))}
function spdMul(){return Math.max(.5,1+gearSum('spd')+ev('swift')-.12*ench('heavy'))}
function hurtEnemy(e,amt,col){if(e.dead)return;e.hp-=amt;ftxt(e.x,e.y-ENEMY[e.type].h-4,Math.round(amt),col||'#ffffff')}
function onHitFx(e,dmg){
 const b=wv('burning');if(b&&e.type!=='lavaGolem'){e.burn=Math.max(e.burn||0,b[0]);e.burnD=b[1]}
 const f=wv('freezing');if(f&&e.type!=='iceGolem'){if(!(e.frz>0))part(e.x,e.y-8,'#bfe8ff',6,60);e.frz=Math.max(e.frz||0,f)}
 const v=wv('venom');if(v){e.psn=Math.max(e.psn||0,v[0]);e.psnD=v[1]}
 const sk=wv('sticky');if(sk){if(!(e.stk>0))part(e.x,e.y-8,'#e8a040',6,50);e.stk=Math.max(e.stk||0,STICKY.dur);e.stkM=sk} // world1/enemies.js updEnemy slows by stkM
 const heal=(wv('leeching')||0)+.5*activeEnch().filter(([x,s])=>x==='leeching'&&s==='a').reduce((a,[,,l])=>a+ENCH.leeching.v[l-1],0);
 if(heal&&S.hp<maxHP()){S.hp=Math.min(maxHP(),S.hp+heal);PARTS.push({x:P.x+(rnd()-.5)*6,y:P.y-12,vx:0,vy:-24,col:'#ff7aa8',g:0,life:.5})}
 const vo=wv('volatile');if(vo&&rnd()<vo[0]){part(e.x,e.y-8,'#ffd040',18,190);part(e.x,e.y-8,'#ff5a1a',14,140);
  for(const o of ENEMIES)if(!o.dead&&Math.abs(o.x-e.x)<38&&Math.abs(o.y-e.y)<40){hurtEnemy(o,vo[1],'#ffb030');if(o!==e&&o.hp<=0)killEnemy(o)}
  if(Math.abs(P.x-e.x)<40){S.hp=Math.max(1,S.hp-3);ftxt(P.x,P.y-24,'-3 💣','#ff9a4a')}}}
// Solar Flare (full Cultist Set): every SOLAR.every-th landed hit (hitEnemy) bursts fire around you; FLARES = the ring effect (drawn in core/render.js)
const FLARES=[];
function solarHit(e){if(!setOn('cultist'))return;P.sol=(P.sol||0)+1;if(P.sol<SOLAR.every)return;P.sol=0;const cx=P.x,cy=P.y-10,dm=SOLAR.dmg*dmgMul();
 FLARES.push({x:cx,y:cy,t:0});part(cx,cy,'#ffe080',14,170);part(cx,cy,'#ff6a1a',12,130);shake(.5);
 for(const o of ENEMIES)if(!o.dead&&o.hp>0&&Math.abs(o.x-cx)<SOLAR.rx&&Math.abs(o.y-ENEMY[o.type].h/2-cy)<SOLAR.ry){hurtEnemy(o,dm,'#ffb030');o.hitT=.12;if(o!==e&&o.hp<=0)killEnemy(o)}}
function drawFlares(ox,oy){for(const f of FLARES){const k=clamp(f.t/SOLAR.fx,0,1),r=6+SOLAR.rx*Math.sqrt(k),cx=Math.round(f.x-ox),cy=Math.round(f.y-oy),n=40;
 if(k<.25){const s=Math.round(9*(1-k*4))+3;px(X,cx-s,cy-s,s*2+1,s*2+1,'rgba(255,240,180,'+(.55*(1-k*4))+')')}
 for(let i=0;i<n;i++){const a=i/n*6.283+f.t*2,x=Math.round(cx+Math.cos(a)*r),y=Math.round(cy+Math.sin(a)*r*.85),c=k<.35?'#fff0b0':k<.7?(i%2?'#ffb040':'#ff7a1a'):(i%2?'#e8501a':'#a8301a');px(X,x-1,y-1,k<.6?3:2,k<.6?3:2,c)}
 if(k<.6)for(let i=0;i<22;i++){const a=i/22*6.283-f.t*3,q=r*(.62+.08*((i*7)%3)),y=Math.round(cy+Math.sin(a)*q*.85)-Math.round(k*6);px(X,Math.round(cx+Math.cos(a)*q)-1,y-1,2,2,i%3?'#ff8a2a':'#ffd040')}
 if(k<.7)for(let i=0;i<8;i++){const a=i/8*6.283+.39,l=r*.7;for(let j=0;j<3;j++){const q=l*(.45+j*.2);px(X,Math.round(cx+Math.cos(a)*q),Math.round(cy+Math.sin(a)*q*.85),1,1,j<1?'#ffe080':'#ff9a30')}}}}
function tickFlares(dt){for(const f of FLARES)f.t+=dt;for(let i=FLARES.length-1;i>=0;i--)if(FLARES[i].t>SOLAR.fx)FLARES.splice(i,1)}
function thornsHit(dmg){const t=ev('thorns');if(!t)return;let best=null,bd=34;for(const e of ENEMIES){if(e.dead)continue;const d=Math.abs(e.x-P.x);if(d<bd){bd=d;best=e}}
 if(best){hurtEnemy(best,dmg*t,'#9ad870');part(best.x,best.y-8,'#9ad870',5,60);if(best.hp<=0)killEnemy(best)}}
function enchCol(id){const l=encList(id);if(!l.length)return null;return l.some(x=>ENCH[x.k].cur)?CURSECOL:ENCH[l[0].k].col}
function enchSpan(x){const E=ENCH[x.k];return '<span class="'+(E.cur?'cz':'')+'" style="color:'+E.col+'">'+(E.perm?ico('lock')+' ':'')+eName(x)+'</span>'}
function enchTag(id){const l=encList(id);if(!l.length)return '';return '<span class="en">'+enchSpan(l[0])+(l.length>1?' <span class="gold">+'+(l.length-1)+'</span>':'')+'</span>'}
function enchAura(c,sx,sy,t){const a=activeEnch();if(!a.length)return;for(let i=0;i<a.length;i++){const E=ENCH[a[i][0]];const ph=t*1.7+i*2.4;const y=sy-2-((t*9+i*7)%18),x=sx+Math.round(Math.sin(ph*2)*6);if(Math.sin(t*5+i*2)>-.3)px(c,x,y,1,1,E.cur?(i%2?'#ff4a6a':'#9a40ff'):E.col)}}
// tinted enemy draw for status effects
const FXCV=document.createElement('canvas');FXCV.width=80;FXCV.height=80;const FXG=FXCV.getContext('2d');
function drawEnemyFx(e,sx,sy){const sk=e.stk>0,tint=sk&&!(e.frz>0&&Math.floor(menuT*4)%2)?['#e8a040',.42]:e.frz>0?['#7ad0ff',.45]:e.psn>0?['#5cd04a',.38]:e.burn>0&&Math.floor(menuT*12)%2?['#ff7a1a',.35]:null;
 if(!tint){drawEnemy(X,e,sx,sy,menuT);return}
 FXG.globalCompositeOperation='source-over';FXG.clearRect(0,0,80,80);drawEnemy(FXG,e,40,70,menuT);FXG.globalCompositeOperation='source-atop';FXG.globalAlpha=tint[1];FXG.fillStyle=tint[0];FXG.fillRect(0,0,80,80);FXG.globalAlpha=1;FXG.globalCompositeOperation='source-over';
 X.drawImage(FXCV,sx-40,sy-70);if(sk)resinDrips(e,sx,sy)}
// amber resin drips on a Sticky-slowed foe: 3 drops sliding down from the body and falling off
function resinDrips(e,sx,sy){const d=ENEMY[e.type],w=d.w||12,h=d.h||12;for(let i=0;i<3;i++){const ph=(menuT*1.1+i/3+(e.x*.013))%1,dx=Math.round((((i*37+Math.floor(e.x))%7)/6-.5)*w*.8),y=Math.round(sy-h*.55+ph*h*.7);
 px(X,sx+dx,sy-h+1,2,1,'#c86a1a');px(X,sx+dx,y,1,2,ph>.8?'#f8c060':'#e8a040');px(X,sx+dx,y+2,1,1,'#ffe0a0')}}
