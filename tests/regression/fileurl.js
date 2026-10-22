// file:// smoke test (Capacitor-style local bundle): loads, starts a new game, plays, no errors
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('requestfailed',r=>{if(!/fonts\.g/.test(r.url()))errs.push('FAIL '+r.url())});
await pg.goto('file://'+require('path').resolve(process.argv[2]||__dirname+'/../../index.html'));await pg.waitForTimeout(500);await pg.evaluate(()=>{localStorage.clear();document.getElementById('bNew').click()});await pg.keyboard.down('d');await pg.waitForTimeout(1500);await pg.keyboard.up('d');
const r=await pg.evaluate(()=>({mode:MR.mode,x:Math.round(MR.P.x),scripts:document.scripts.length}));console.log('file://',JSON.stringify(r),'errors',JSON.stringify(errs));await b.close()})();
