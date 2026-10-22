const {chromium}=require('playwright-core');const fs=require('fs');
const URL=process.argv[2];const PROF=process.argv[3]==='prof';
const src=fs.readFileSync(__dirname+'/reg.js','utf8');const INIT=eval(src.match(/const INIT=(`[\s\S]*?`);/)[1]);
const base=eval('('+src.match(/const base=(o=>[\s\S]*?,o\));/)[1]+')');
const W2=o=>base(Object.assign({w:1,x:1300,lastTown:6,money:600,w2seen:true,visited:[0,1,5,6],cargo:[],horse:{on:true,x:null,dir:1,wings:true},lances:['woodlance'],lance:'woodlance',scrap:{wood:150,apple:50,gold:50,done:true},ws:{0:{x:14710,lastTown:5,money:900,park:null,stash:[],hold:[]}},wcart:true},o));
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});await ctx.addInitScript(INIT);
const cases=[['plains',base({x:2400}),'keys.d=1'],['snow',base({x:4500}),'keys.d=1;W1ENV.bliz=1'],['wastes',base({x:13000,lastTown:5}),'keys.d=1'],['volcano',base({x:10300,lastTown:5}),'keys.d=1'],['w2fly',W2({x:1900}),'MR.P.dir=1;pressed.tj=1;setTimeout(()=>{pressed.tu=1;tkeys.r=1},500)'],['cave',base({x:1050}),'MR.enterDungeon(MR.DUNGEONS[0]);keys.d=1']];
const out={};
for(const [n,sv,act] of cases){const pg=await ctx.newPage();await pg.goto(URL);await pg.evaluate(s=>localStorage.setItem('merchantRoad.v1',s),JSON.stringify(sv));await pg.reload();await pg.evaluate(()=>document.fonts.ready);await pg.evaluate(()=>{__step(5);document.getElementById('bCont').click();__step(20)});await pg.evaluate(a=>eval(a),act);await pg.evaluate(()=>__step(60));
 let cdp;if(PROF){cdp=await ctx.newCDPSession(pg);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:100});await cdp.send('Profiler.start')}
 const t=await pg.evaluate(()=>{const ts=[];for(let k=0;k<5;k++){const t0=performance.__proto__.now?0:0;const a=window.__realNow?0:0;const s=Date.now;const st=new (window.PerformanceObserver?Object:Object)();const r0=window.__rt();__step(60);ts.push((window.__rt()-r0)/60)}ts.sort((a,b)=>a-b);return ts[2]});
 out[n]=t.toFixed(2)+'ms/frame';
 if(PROF){const {profile}=await cdp.send('Profiler.stop');const self={};const byId={};for(const nd of profile.nodes)byId[nd.id]=nd;const dt=profile.timeDeltas;const cnt={};profile.samples.forEach((id,i)=>{cnt[id]=(cnt[id]||0)+(dt[i]||0)});for(const id in cnt){const nd=byId[id];const k=(nd.callFrame.functionName||'(anon)')+':'+nd.callFrame.lineNumber;self[k]=(self[k]||0)+cnt[id]}
  const tot=Object.values(self).reduce((a,b)=>a+b,0);out[n+'_top']=Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>k+' '+(100*v/tot).toFixed(1)+'%')}
 await pg.close()}
console.log(JSON.stringify(out,null,1));await b.close()})();
