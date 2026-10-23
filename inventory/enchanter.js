'use strict';
let wFlash=null;
function openWitch(){if(MODE!=='play')return;wFlash=null;setMode('witch');renderWitch()}
function closeWitch(){setMode('play');save();WTOWER=0}
const TQUOTES=['Up here the magic holds better. Costs more, too.','Fewer curses at the top. Mostly.','You climbed all those ladders? Respect.'];
const WQUOTES=['Got essence? Let\'s make something cool.','Hand it over. I\'ll make it glow.','Curses hit hard. Both ways. Feeling lucky?'];
let wSel=null,wRev=0;
function itemName(id){return isWep(id)?WEAPONS[id].name:GEAR[id].name}
function witchIds(){return S.weapons.filter(w=>w!=='fists').concat(S.lances,S.gear)}
function renderWitch(){$('wmoney').textContent=pr(S.money);const es=S.mats.essence||0,ids=witchIds();if(!ids.includes(wSel))wSel=null;
 let h='<div class="wwrap"><div class="wl"><div class="wq">“'+(WTOWER?TQUOTES[Math.floor(S.time/40)%TQUOTES.length]:WQUOTES[Math.floor(S.time/40)%WQUOTES.length])+'”</div>';
 h+='<div class="wcols"><div class="wsl"><div class="eslot'+(wSel?' full':'')+(wRev?' rev':'')+'" id="eslot"'+(wSel&&encList(wSel).length?' style="--ec:'+enchCol(wSel)+'"':'')+'>';
 if(wSel){const l=encList(wSel);h+='<img class="px si" data-id="'+wSel+'" src="'+gearIcon(wSel)+'"><b>'+itemName(wSel)+'</b>'+(l.length?l.map((x,i)=>'<span class="el" style="animation-delay:'+(i*.18)+'s">'+enchSpan(x)+'<span class="sub">'+ENCH[x.k].d(eVal(x))+'</span></span>').join(''):'<span class="sub">—</span>')}
 else h+='<span class="sub">'+(ids.length?'Drag or tap an item':'No gear yet')+'</span>';
 h+='</div><button id="ebtn" '+(!wSel||es<enchCost()?'disabled':'')+'>'+ico('spark')+' Enchant · '+enchCost()+' <img class="px" style="width:12px;height:12px;vertical-align:middle" src="'+MATURL.essence+'"> <span style="opacity:.75">('+es+')</span></button>';
 h+='</div><div class="wtr"><div class="tray" id="etray">';for(const id of ids){if(id===wSel)continue;const on=isWep(id)?(WEAPONS[id].lance?S.lance===id:S.weapon===id):Object.values(S.eq).includes(id),l=encList(id);
  h+='<div class="ti'+(l.length?' ench':'')+'" data-id="'+id+'" title="'+itemName(id)+'"'+(l.length?' style="--ec:'+enchCol(id)+'"':'')+'><img class="px" src="'+gearIcon(id)+'">'+(on?'<span class="eb">E</span>':'')+(l.length?'<span class="ed">'+l.length+'</span>':'')+'</div>'}
 h+='</div><div class="small" style="line-height:1.6;margin-top:4px">1–3 random enchants · <span class="cz" style="color:'+CURSECOL+'">red = curse</span>'+(WTOWER?'<br><span class="gold">Tower: 92% curse-free</span> <span style="opacity:.7">(wagon 77%)</span>':'')+'</div></div></div>';
 h+='</div><img id="wpor" src="'+WPORTRAIT+'" alt="Vex"></div>';
 $('wbody').innerHTML=h;wRev=0}
$('wX').onclick=closeWitch;
function putSlot(id){wSel=id||null;renderWitch()}
let wDrag=null;
// drag & drop (mouse + touch pointer events); a tap is the phone fallback.
// Touch: when the tray or panel can scroll, a quick swipe scrolls and a short hold (180ms) lifts the item for dragging.
const HOLDMS=180;
function canScroll(){const t=$('etray'),pn=$('wbody').closest('.panel');return !!(t&&t.scrollHeight>t.clientHeight+2||pn&&pn.scrollHeight>pn.clientHeight+2)}
function dropDrag(d){clearTimeout(d.tm);if(d.el)d.el.classList.remove('lift')}
$('wbody').addEventListener('pointerdown',e=>{const t=e.target.closest('.ti,.si');if(!t)return;if(wDrag)dropDrag(wDrag);
 const d=wDrag={id:t.dataset.id,from:t.classList.contains('si')?'slot':'tray',x:e.clientX,y:e.clientY,on:false,g:null,pid:e.pointerId,el:t,need:e.pointerType!=='mouse'&&!t.classList.contains('si')&&canScroll(),armed:false};
 if(d.need)d.tm=setTimeout(()=>{if(wDrag===d&&!d.on){d.armed=true;t.classList.add('lift');if(navigator.vibrate)try{navigator.vibrate(8)}catch(_){}}},HOLDMS)});
$('wbody').addEventListener('contextmenu',e=>{if(e.target.closest('.ti,.si'))e.preventDefault()});
// once a drag is live (or armed), stop the browser from turning the touch into a scroll
addEventListener('touchmove',e=>{const d=wDrag;if(d&&(d.on||d.armed||!d.need))e.preventDefault()},{passive:false});
addEventListener('pointermove',e=>{const d=wDrag;if(!d||e.pointerId!==d.pid)return;if(!d.on&&Math.hypot(e.clientX-d.x,e.clientY-d.y)>8){
  if(d.need&&!d.armed){dropDrag(d);wDrag=null;return} // quick swipe: let it scroll
  d.on=true;dropDrag(d);const g=document.createElement('img');g.src=gearIcon(d.id);g.className='px ghost';document.body.appendChild(g);d.g=g}
 if(d.on){e.preventDefault();d.g.style.left=(e.clientX-22)+'px';d.g.style.top=(e.clientY-22)+'px';const over=document.elementFromPoint(e.clientX,e.clientY);const sl=$('eslot');if(sl)sl.classList.toggle('hov',!!(over&&over.closest('#eslot'))&&d.from==='tray')}},{passive:false});
function endDrag(e,cancel){const d=wDrag;if(!d||e.pointerId!==d.pid)return;wDrag=null;dropDrag(d);if(d.g)d.g.remove();if(MODE!=='witch')return;
 if(!d.on){if(!cancel)putSlot(d.from==='slot'?null:d.id);return}
 const over=cancel?null:document.elementFromPoint(e.clientX,e.clientY),inSlot=!!(over&&over.closest('#eslot'));
 if(d.from==='tray'&&inSlot)putSlot(d.id);else if(d.from==='slot'&&!inSlot)putSlot(null);else renderWitch()}
addEventListener('pointerup',e=>endDrag(e,false));addEventListener('pointercancel',e=>endDrag(e,true));
$('wbody').onclick=e=>{if(wSel&&e.target.closest('#eslot')&&!e.target.closest('.si')){putSlot(null);return} // tapping the slot returns the item
 const b=e.target.closest('#ebtn');if(!b||b.disabled||!wSel)return;const got=enchantItem(wSel);if(!got)return;wRev=1;part(P.x,P.y-12,'#c060ff',10,80);renderWitch()};
