const {chromium}=require('playwright-core');const fs=require('fs');
const URL=process.argv[2];
const src=fs.readFileSync(__dirname+'/reg.js','utf8');const INIT=eval(src.match(/const INIT=(`[\s\S]*?`);/)[1]);
const base=eval('('+src.match(/const base=(o=>[\s\S]*?,o\));/)[1]+')');
const W2=o=>base(Object.assign({w:1,x:1300,lastTown:6,money:600,w2seen:true,visited:[0,1,5,6],cargo:[],horse:{on:true,x:null,dir:1,wings:true},lances:['woodlance'],lance:'woodlance',scrap:{wood:150,apple:50,gold:50,done:true},ws:{0:{x:14710,lastTown:5,money:900,park:null,stash:[],hold:[]}},wcart:true},o));
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});await ctx.addInitScript(INIT);
for(const [n,sv,act] of [['plains',base({x:2400}),'keys.d=1'],['snow',base({x:4500}),'keys.d=1'],['wastes',base({x:13000,lastTown:5}),'keys.d=1'],['w2fly',W2({x:1900}),'MR.P.dir=1;pressed.tj=1;setTimeout(()=>{pressed.tu=1;tkeys.r=1},500)'],['cave',base({x:1050}),'MR.enterDungeon(MR.DUNGEONS[0]);keys.d=1']]){
 const pg=await ctx.newPage();await pg.goto(URL);await pg.evaluate(s=>localStorage.setItem('merchantRoad.v1',s),JSON.stringify(sv));await pg.reload();await pg.evaluate(()=>document.fonts.ready);await pg.evaluate(()=>{__step(5);document.getElementById('bCont').click();__step(20)});await pg.evaluate(a=>eval(a),act);await pg.evaluate(()=>__step(90));
 const r=await pg.evaluate(()=>{const P=CanvasRenderingContext2D.prototype;const o=P.fillRect;const c={};let tot=0;P.fillRect=function(...a){tot++;const st=new Error().stack.split('\n');let k='';for(let i=2;i<st.length;i++){const m=st[i].match(/at (\S+) .*:(\d+):\d+\)?$/);if(m&&m[1]!=='px'){k=m[1]+':'+m[2];break}}c[k]=(c[k]||0)+1;return o.apply(this,a)};__step(1);P.fillRect=o;return {tot,top:Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10)}});
 console.log(n,r.tot,JSON.stringify(r.top));await pg.close()}
await b.close()})();
