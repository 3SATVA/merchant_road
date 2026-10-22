'use strict';
reg(ITEMS,0,[
 {id:'apple',name:'Apple',base:5,col:'#d83a3a'},
 {id:'potato',name:'Potato',base:10,col:'#c8a060'},
 {id:'wood',name:'Wood',base:30,col:'#8b5a2b'},
 {id:'coal',name:'Coal',base:100,col:'#2a2a30'},
 {id:'iron',name:'Iron',base:500,col:'#a8b0bc'},
 {id:'gold',name:'Gold',base:2000,col:'#ffd040'}]);
Object.assign(HAULERS,{
 wheelbarrow:{name:'Wheelbarrow',cap:12,spd:.9,jump:.97,price:120},
 smallwagon:{name:'Small Wagon',cap:25,spd:.78,jump:.93,price:800},
 bigwagon:{name:'Big Wagon',cap:50,spd:.66,jump:.9,price:4500}});
const HORDER=['backpack','wheelbarrow','smallwagon','bigwagon'];
Object.assign(COFF,{wheelbarrow:11,smallwagon:-15,bigwagon:-23});
Object.assign(HITCHR,{wheelbarrow:22,smallwagon:30,bigwagon:38});
const SCRAPX=WORLD-170,NEED={wood:150,apple:50,gold:50},SCRAPI={wood:2,apple:0,gold:5},SCRAPK=['wood','apple','gold'];
reg(TOWNS,0,[
 {name:'Wake Ridge',x:300,barber:1,sells:[0,1,2],weapons:['dagger'],haulers:['wheelbarrow']},
 {name:'Bog Town',x:1800,stable:1,sells:[0,1,2],weapons:['sword','crossbow'],haulers:['wheelbarrow','smallwagon']},
 {name:'Frostholm',x:4000,forge:1,sells:[1,2,3],weapons:['leafstaff','sword'],haulers:['smallwagon']},
 {name:'Pinehollow',x:5600,barber:1,stable:1,sells:[2,3,4],weapons:['warhammer','crossbow'],haulers:['smallwagon','bigwagon']},
 {name:'Stonepeak',x:8000,forge:1,stable:1,sells:[3,4,5],weapons:['frostspear','warhammer'],haulers:['bigwagon']},
 {name:'Emberfall',x:11000,barber:1,forge:1,sells:[3,4,5],weapons:['obsidian','leafstaff'],haulers:['bigwagon']}]);
const W1DUNG=[1050,2850,3600,4750,6750,7350,8900,10250,11650,13350].map((x,i)=>({i,x,b:biomeAt(x),diff:clamp(1+Math.floor(x/4000),1,3)}));
reg(BIOMES,0,[
 {name:'Plains',sky:['#4f9fe0','#8fcff2','#d4f0fb'],far:'#9cc4cf',mid:'#6aa86a',top:'#6cc04a',top2:'#4f9a3a',dirt:'#8a5a32',dirt2:'#6e4526',farS:'hills',midS:'trees',mm:'#5aa040'},
 {name:'Snowy Forest',sky:['#7d98c0','#b2c6de','#e6eef7'],far:'#c9d6e8',mid:'#3f6050',top:'#f4f8ff',top2:'#c6d8ec',dirt:'#6d6377',dirt2:'#554b5e',farS:'peaks',midS:'pines',mm:'#d8e4f0'},
 {name:'Mountains',sky:['#4e6aa8','#8aa0cc','#c7d3ea'],far:'#8a8fb0',mid:'#5f6178',top:'#a0a6ae',top2:'#7b818c',dirt:'#5d5f6b',dirt2:'#474954',farS:'peaks',midS:'rocks',mm:'#8a8c98'},
 {name:'Volcano',sky:['#2a0e18','#6e2418','#d05a26'],far:'#4e2226',mid:'#2e1818',top:'#4c3636',top2:'#3a2626',dirt:'#2a1c1c',dirt2:'#1e1414',farS:'volcano',midS:'rocks',mm:'#a03a1a'},
 {name:'Ashen Wastes',sky:['#2e2a36','#6a5c60','#c2a084'],far:'#4e4650',mid:'#353034',top:'#a29a90',top2:'#7c746c',dirt:'#4a423e',dirt2:'#37302e',farS:'ruins',midS:'spires',mm:'#6e6660'}]);
reg(BIOMEINFO,0,['Slimes & goblins','Deep snow slows you · blizzards','Uphill is slow · rockfall!','Heat burns · jump lava pits','No towns · raiders · ash storms']);
Object.assign(ENEMY,{
 slime:{hp:14,dmg:6,spd:55,w:10,h:8,coin:[1,3]},
 goblin:{hp:20,dmg:7,spd:72,w:8,h:12,coin:[2,5]},
 goblinS:{hp:30,dmg:9,spd:80,w:8,h:12,coin:[4,9],base:'goblin'},
 iceGolem:{hp:60,dmg:16,spd:22,w:16,h:26,coin:[8,16],base:'golem'},
 stoneGolem:{hp:90,dmg:20,spd:24,w:16,h:26,coin:[14,26],base:'golem'},
 witch:{hp:34,dmg:11,spd:45,w:10,h:18,coin:[12,24]},
 witchV:{hp:46,dmg:14,spd:50,w:10,h:18,coin:[25,45],base:'witch'},
 lavaGolem:{hp:128,dmg:22,spd:24,w:18,h:28,coin:[30,60],base:'golem'},
 // Ashen Wastes: tougher kin of the usual foes
 raider:{hp:38,dmg:11,spd:70,w:8,h:12,coin:[10,20],base:'goblin'},
 cinderSlime:{hp:32,dmg:10,spd:62,w:10,h:8,coin:[6,12],base:'slime'},
 scrapGolem:{hp:120,dmg:24,spd:28,w:16,h:26,coin:[45,80],base:'golem'}});
reg(SPAWNS,0,[[['slime',.6],['goblin',.4]],[['iceGolem',.4],['goblinS',.6]],[['stoneGolem',.5],['witch',.5]],[['witchV',.45],['lavaGolem',.55]],[['raider',.5],['cinderSlime',.36],['scrapGolem',.14]]]); // spawn tables per biome
// World 1 definition (see WORLDDEF in core/registry.js)
WORLDDEF[0]={name:'The Road',len:15000,bounds:[0,3200,6400,9600,12000,15000],wb:[0,1,2,3,4],xmin:12,xmax:15000-12,dungeons:W1DUNG,
 rawH(x){const h0=6*Math.sin(x/190)+3*Math.sin(x/71);
 const h1=10*Math.sin(x/160)+5*Math.sin(x/57)+10;
 const m=clamp((x-6400)/3200,0,1);
 const h2=30*Math.sin(x/200)+9*Math.sin(x/83)+30+45*Math.sin(m*Math.PI);
 const h3=10*Math.sin(x/180)+5*Math.sin(x/63)+14;
 const h4=12*Math.sin(x/140)+6*Math.sin(x/43)+3*Math.sin(x/17)+18;
 const H=[h0,h1,h2,h3,h4];let b=biomeAt(x);
 for(let i=1;i<NB;i++){const d=x-BOUNDS[i];if(Math.abs(d)<250){const t=smooth((d+250)/500);return lerp(H[i-1],H[i],t)}}
 return H[b]},
 flat:[{x:SCRAPX,r:180,fade:80}], // extra flattened ground: the airship scrap pile
 pits(){const out=[];let x=9800,k=0;while(x<11900){const w=22+Math.floor(hash(k*3.1)*10);if(Math.abs(x-11000)>200&&!DUNGEONS.some(q=>Math.abs(q.x-x)<110))out.push({x0:x,x1:x+w,ly:Math.max(surfY(x),surfY(x+w))+9});x+=280+Math.floor(hash(k*7.7)*180);k++}return out}, // lava pits (volcano)
 decorOK(x){return Math.abs(x-SCRAPX)>140},
 town:5,money:null,arriveX:SCRAPX-60,horseOff:30, // arriving from World 2: lastTown fallback, keep current money, land by the scrap pile
 // cart: World 1's hauler is whatever wagon you bought (S.hauler). S.park is the parked cart of the CURRENT world only;
 // on leaving, leave() files it (or cargo) into S.ws[0] and enterW restores it, so it can never be mistaken for the Winged Cart.
 cart(){return S.hauler},parkIco:'cartP',carry:'stash',autoHitch:120, // carry: S.ws field that holds loose cargo while away; autoHitch: re-hitch on arrival within this range
 leave(s,o){if(s.hauler!=='backpack'&&!s.park){o.park={x:SCRAPX-110,dir:-1,cargo:s.cargo}}else{o.park=s.park||null;o.stash=s.cargo}}}; // a hitched wagon waits by the scrap pile
