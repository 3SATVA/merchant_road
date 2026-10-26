'use strict';
const ICONS={
 apple:['....g...','...g....','.rrrrrr.','rrwrrrrr','rwrrrrrr','rrrrrrrr','.rrrrrd.','..rddd..'],
 potato:['........','..tttt..','.ttdtttt','tttttdtt','ttdttttt','tttttdt.','.ttttt..','........'],
 wood:['........','........','bbbbbbbo','bbbbbbol','bbbbbbol','bbbbbbbo','........','........'],
 coal:['........','...kk...','..kgkk..','.kkkkgk.','kgkkkkkk','kkkkgkk.','.kkkkk..','........'],
 iron:['........','........','..wwwww.','.siiiiis','siiiiiss','ssssssss','........','........'],
 gold:['........','........','..wwwww.','.yyyyyyo','yyyyyyoo','oooooooo','........','........'],
 cloudwool:['........','..uuu...','.uuuuuu.','uuuvuuuu','uuuuuuvu','.uuvuuu.','..uuuu..','........'],
 skyglass:['...x....','..qxq...','.qqxqq..','.qqqqqz.','qqqqqzz.','.qqqzz..','..qzz...','...z....'],
 sunfruit:['....g...','...gg...','..eeee..','.eexeee.','.eeeeef.','.eeeeff.','..efff..','........'],
 starsilk:['........','.mmmmn..','mmxmmnn.','mmmmmnn.','.nmmmmn.','..nmmmmn','...nnmmn','....nnn.']};
const IPAL={e:'#ffb040',f:'#d8781a',m:'#e8c8ff',n:'#a87ad8',u:'#f4fbff',v:'#b8cce4',q:'#7de0ff',z:'#3a9ac8',x:'#ffffff',h:'#5a3a7a',p:'#c060ff',a:'#5e5e5e',c:'#d0d0d0',g:'#3a8a2a',r:'#d83a3a',w:'#ffd0d0',d:'#9a2020',t:'#c8a060',b:'#8b5a2b',o:'#5a3818',l:'#d8b080',k:'#22222a',i:'#b8c0cc',s:'#707884',y:'#ffd040'};
const ICONPAL2={iron:{w:'#eef2f8'},gold:{w:'#fff4b0',o:'#c08a10'}};
function iconCanvas(id){const c=document.createElement('canvas');c.width=8;c.height=8;const g=c.getContext('2d');const pal=Object.assign({},IPAL,ICONPAL2[id]||{});ICONS[id].forEach((row,y)=>{for(let x=0;x<8;x++){const ch=row[x];if(ch&&ch!=='.'){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}});return c}
// World 2 capital goods (Aldenreach)
ICONS.spicedamber=['....k...','...kb...','..aaaa..','.axaaab.','.aaaaab.','.aaabbb.','..abbb..','........'];ICONPAL2.spicedamber={a:'#e88a2a',b:'#a8501a',x:'#ffe0a0',k:'#5a2a10'};
ICONS.emberleaf=['......g.','....rrg.','..rreg..','.rrefr..','.refrr..','.efrr...','.ff.....','f.......'];ICONPAL2.emberleaf={r:'#c8482a',e:'#f08848',f:'#8a2a1a',g:'#5a3818'};
ICONS.hearthcider=['...oo...','...bb...','..tttt..','.tyyyyt.','.tyxyyt.','.tyyyyt.','.tttttt.','........'];ICONPAL2.hearthcider={t:'#a8743a',y:'#d8a040',x:'#ffe08a',o:'#5a3818',b:'#c8a060'};
const ICONC={},ICONURL={};ITEMS.forEach(it=>{ICONC[it.id]=iconCanvas(it.id);ICONURL[it.id]=ICONC[it.id].toDataURL()});
ICONS.essence=['....w...','...pp...','..pmmp..','.pmwmmp.','.pmmmmp.','..pmmp..','...pp...','........'];ICONPAL2.essence={p:'#7a3aa0',m:'#c060ff',w:'#ffffff'};
ICONS.lava=['........','..kkk...','.kkokkk.','kkookkk.','kokkkokk','kkkookk.','.kkkkk..','........'];ICONPAL2.lava={k:'#4a3030',o:'#ff6a1a'};
ICONS.stone=['........','..ssss..','.sllsss.','sslsseds','ssssssss','.sssss..','..sss...','........'];ICONPAL2.stone={s:'#7a7a80',l:'#b8b8c0',e:'#7de0ff',d:'#4a4a50'};
ICONS.stonehelm=['..aaaa..','.abbbba.','abbccbba','abbbbbba','aaaaaaaa','a.dddd.a','a......a','........'];ICONPAL2.stonehelm={a:'#5e5e5e',b:'#8a8a8a',c:'#d0d0d0',d:'#2a2a30'};
ICONS.witchboots=['........','..pp....','..pp....','..pp....','..pppp..','.ppppppm','.mmmmmm.','........'];ICONPAL2.witchboots={p:'#5a3a7a',m:'#c060ff'};
ICONS.stoneboots=['........','.aa..aa.','.ab..ab.','.ab..ab.','.abb.abb','aabbaabb','aaaaaaaa','........'];ICONPAL2.stoneboots={a:'#6a6a6a',b:'#b8b8c0'};
ICONS.witchrobe=['..pppp..','.pmppmp.','pppppppp','.pppppp.','.pmmmmp.','.pppppp.','pppppppp','pppppppp'];ICONPAL2.witchrobe={p:'#5a3a7a',m:'#c060ff'};
ICONS.stonechest=['.a....a.','aab..baa','aabbbbaa','.abccba.','.abbbba.','.abbbba.','.aabbaa.','..aaaa..'];ICONPAL2.stonechest={a:'#5e5e5e',b:'#8a8a8a',c:'#d0d0d0'};
ICONS.tophat=['........','..hhhh..','..hhhh..','..hhhh..','..yyyy..','..hhhh..','hhhhhhhh','........'];ICONPAL2.tophat={h:'#8a2b2b',y:'#d8b040'};
ICONS.witchhat=['.....h..','....hh..','...hhh..','...hhh..','..hhhhh.','..ppppp.','hhhhhhhh','.hhhhhh.'];ICONPAL2.witchhat={h:'#5a3a7a',p:'#c060ff'};
ICONS.crystalhelm=['...x....','..aqa...','.aqqqa..','aqxqqqa.','aqqqqqzb','aaaaaaab','a.kkkk.b','........'];ICONPAL2.crystalhelm={a:'#5ac8e0',q:'#a8f4ff',x:'#ffffff',z:'#3a9ac8',b:'#2a7aa0',k:'#1a3a50'};
ICONS.crystalchest=['.a....a.','aaq..qaa','aqqxqqqa','.aqqqqa.','.aqxqqa.','.aqqqza.','.aazzaa.','..bbbb..'];ICONPAL2.crystalchest={a:'#5ac8e0',q:'#a8f4ff',x:'#ffffff',z:'#3a9ac8',b:'#2a7aa0'};
ICONS.crystalboots=['........','.aa..aa.','.aq..aq.','.ax..ax.','.aqq.aqq','aaqqaaqq','bbbbbbbb','........'];ICONPAL2.crystalboots={a:'#5ac8e0',q:'#a8f4ff',x:'#ffffff',b:'#2a7aa0'};
// Cultist armor (Aldenreach forge) + Sun Cloth: crimson cloth, gold trim, the spiky sun mask
ICONS.cultmask=['.y.y..y.','..yggy..','yggggggy','.gkkgkg.','yggggggy','.ggddgg.','y.gggg.y','...y....'];ICONPAL2.cultmask={g:'#f0c040',y:'#ffe080',k:'#3a1a14',d:'#c08a20'};
ICONS.cultrobe=['..rrrr..','.rdyydr.','rrryyrrr','.rrrrrr.','.rdyyrr.','.rrrrrr.','rrrrrrrr','yyyyyyyy'];ICONPAL2.cultrobe={r:'#b8282a',d:'#7a1418',y:'#e8b040'};
ICONS.cultboots=['........','.rr..rr.','.rd..rd.','.rd..rd.','.rdd.rdd','rrddrrdd','yyyyyyyy','........'];ICONPAL2.cultboots={r:'#b8282a',d:'#7a1418',y:'#e8b040'};
ICONS.suncloth=['........','rrrrrrr.','rrryrrrd','rryxyrrd','rrryrrrd','rrrrrrrd','.ddddddd','........'];ICONPAL2.suncloth={r:'#c8342e',d:'#7a1418',y:'#f0c040',x:'#ffe080'};
const GEARC={},GEARURL={};for(const id in GEAR){GEARC[id]=iconCanvas(id);GEARURL[id]=GEARC[id].toDataURL()}
const MATC={},MATURL={};for(const id in MATS){MATC[id]=iconCanvas(id);MATURL[id]=MATC[id].toDataURL()}
