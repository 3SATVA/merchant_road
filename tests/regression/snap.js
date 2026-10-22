// snapshot every top-level binding right after load (data, generated sprite URLs, canvases) for before/after comparison
const {chromium}=require('playwright-core');const fs=require('fs');
const src=fs.readFileSync(__dirname+'/reg.js','utf8');const INIT=eval(src.match(/const INIT=(`[\s\S]*?`);/)[1]);
const names=JSON.parse(fs.readFileSync(__dirname+'/names.json','utf8')).concat(['W1ENV','W2ENV']); // split-era per-world timer objects (ERR before they existed)
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const out={};
for(const [w,h,mob] of [[390,844,true],[1280,800,false]]){const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:mob,hasTouch:mob,deviceScaleFactor:mob?2:1});await ctx.addInitScript(INIT);const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 const reqs=[];pg.on('requestfailed',r=>reqs.push('FAIL '+r.url()));pg.on('response',r=>{if(r.status()>=400)reqs.push(r.status()+' '+r.url())});
 await pg.goto(process.argv[2]);await pg.evaluate(()=>document.fonts.ready);
 const r=await pg.evaluate(names=>{const seen=new WeakSet();const rep=(k,v)=>{if(typeof v==='function')return 'fn:'+(v.name||'');if(v instanceof HTMLCanvasElement){try{return 'cv:'+v.width+'x'+v.height+':'+v.toDataURL().length+':'+v.toDataURL().slice(-40)}catch(e){return 'cv'}}if(v instanceof Element)return 'el:'+v.tagName+'#'+v.id;if(v instanceof CanvasRenderingContext2D)return 'ctx';if(v&&typeof v==='object'){if(seen.has(v))return '[cyc]';seen.add(v)}if(typeof v==='number'&&!isFinite(v))return String(v);return v};
  const o={};for(const n of names){try{o[n]=JSON.stringify((0,eval)(n),rep)}catch(e){o[n]='ERR '+e.message}}{const cl=document.body.cloneNode(true);cl.querySelectorAll('script').forEach(x=>x.remove());o.__body=cl.innerHTML.trim().replace(/>\s+</g,'><').replace(/data:image[^"]*/g,u=>'img'+u.length)}o.__head=[...document.styleSheets].map(ss=>{try{return [...ss.cssRules].map(r=>r.cssText).join('')}catch(e){return 'x'}}).join('').length;o.__rnd=Math.random();return o},names);
 out[w]={errs,reqs,r}}
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));console.log('errors',JSON.stringify(out[390].errs),JSON.stringify(out[1280].errs),'bad requests',out[390].reqs.concat(out[1280].reqs));await b.close()})();
