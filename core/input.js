'use strict';
const keys={};const pressed={};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(MODE==='cut'){e.preventDefault();endCut();return}if(['arrowleft','arrowright','arrowup',' ','arrowdown'].includes(k))e.preventDefault();if(!keys[k])pressed[k]=1;keys[k]=1;
 if(k==='i'&&!e.repeat){if(MODE==='play')openInv();else if(MODE==='inv')closeInv()}
 if(k==='escape'){if(MODE==='inv')closeInv();else if(MODE==='witch')closeWitch();else if(MODE==='scrap')closeScrap();else if(MODE==='play')setMode('pause');else if(MODE==='pause')setMode('play');else if(MODE==='town')leaveTown();else if($('help').classList.contains('on'))$('help').classList.remove('on')}});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0;for(const k in tkeys)tkeys[k]=0});
const tkeys={};
function bindTouch(id,k){const el=$(id);el.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});el.addEventListener('touchend',e=>e.preventDefault(),{passive:false});const dn=e=>{e.preventDefault();if(!tkeys[k])pressed['t'+k]=1;tkeys[k]=1;el.classList.add('dn')},up=e=>{e.preventDefault();tkeys[k]=0;el.classList.remove('dn')};
 el.addEventListener('pointerdown',dn);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up)}
[['tL','l'],['tR','r'],['tJ','j'],['tA','a'],['tE','e'],['tH','h'],['tQ','q'],['tC','c'],['tM','m'],['tU','u'],['tD','d']].forEach(a=>bindTouch(a[0],a[1]));
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches;
$('c').addEventListener('pointerdown',e=>{if(MODE==='play'&&e.pointerType==='mouse'&&e.button===0)pressed.click=1});
const inp={left:()=>keys.a||keys.arrowleft||tkeys.l,right:()=>keys.d||keys.arrowright||tkeys.r,
 jump:()=>pressed[' ']||pressed.w||pressed.arrowup||pressed.tj,attack:()=>keys.j||pressed.j||pressed.click||tkeys.a||pressed.ta,use:()=>pressed.e||pressed.te,pot:()=>pressed.h||pressed.th,swap:()=>pressed.q||pressed.tq,cart:()=>pressed.c||pressed.tc,up:()=>pressed[' ']||pressed.w||pressed.arrowup||pressed.tu,down:()=>pressed.s||pressed.arrowdown||pressed.td,leave:()=>pressed.tj||pressed.r||pressed.x,horse:()=>pressed.r||pressed.tm};
