'use strict';
function toast(t,ms){const d=document.createElement('div');d.className='toast';d.innerHTML=t;$('toasts').appendChild(d);setTimeout(()=>d.remove(),ms||2200);while($('toasts').children.length>3)$('toasts').firstChild.remove()}
// the E / leave prompt: its HTML is only rewritten when the text changes (it used to be re-set, and re-scanned for emoji, every frame)
let PROMPTH=null;function showPrompt(h){const e=$('prompt');if(h){if(h!==PROMPTH){PROMPTH=h;e.innerHTML=h}if(e.style.display!=='block')e.style.display='block'}else if(e.style.display!=='none')e.style.display='none'}
function setMode(m){MODE=m;BANDPOS=null;showPrompt('');['menu','pause','town','dead','inv','witch','scrap'].forEach(id=>$(id).classList.toggle('on',m===id));
 const play=m!=='menu'&&m!=='cut';$('hud').style.display=play?'flex':'none';$('pbtn').style.display=m==='play'?'block':'none';$('ibtn').style.display=m==='play'?'block':'none';$('touch').classList.toggle('on',isTouch&&m==='play');for(const k in tkeys)tkeys[k]=0;
 if(m==='menu')$('bCont').style.display=load()?'block':'none'}
$('bNew').onclick=()=>{if(load()&&!confirm('Start over? Your current save will be erased.'))return;S=fresh();startGame()};
$('bCont').onclick=()=>{S=load()||fresh();startGame()};
$('bHelp').onclick=$('bHelp2').onclick=()=>$('help').classList.add('on');$('bHelpX').onclick=()=>$('help').classList.remove('on');
$('bRes').onclick=()=>setMode('play');$('bMenu').onclick=()=>{save();DG=null;ENEMIES=[];PROJ=[];setMode('menu')};$('pbtn').onclick=()=>setMode('pause');
$('bRespawn').onclick=()=>{fadeIn();P=newPlayer(TOWNS[S.lastTown].x);S.hp=maxHP();save();setMode('play')};
function startGame(){if(S&&S.shelfRf){const r=S.shelfRf;delete S.shelfRf;setTimeout(()=>toast(ico('ship',2)+' '+ico('x')+'<br>Airships are grounded for now<br><span class="gold">+'+pr(r)+'</span> refunded',3600),600)}DG=null;setWorld(S.w);if(S.horse&&!S.horse.on)S.horse.x=clamp(S.horse.x,XMIN,XMAX);const air=S.w===1&&(!!S.air||!onIsle(S.x));if(S.w===1){if(!onIsle(S.x))S.x=DOCKS[S.moor].x;if(S.horse&&!S.horse.on&&!onIsle(S.horse.x))S.horse.x=S.x-DOCKS[S.moor].side*26}P=newPlayer(clamp(S.x,XMIN,XMAX));if(S.w===1)w2Start(air);camX=clamp(P.x-VW/2,0,WORLD-VW);camY=P.y-VH*.64;ENEMIES=[];PROJ=[];PICK=[];ROCKS=[];FTXT=[];PARTS=[];env.biome=-1;env.spawnD=0;env.next=350;setMode('play');if(S.w===1&&!S.w2seen&&S.horse)startCut();save()}
// travel between worlds (needs a horse); carts stay parked at the World 1 airship, the airship hold carries your goods
function fadeIn(){const f=$('fade');if(!f)return;f.style.transition='none';f.style.opacity='1';void f.offsetWidth;f.style.transition='';f.style.opacity='0'}
