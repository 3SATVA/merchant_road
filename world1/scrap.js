'use strict';
function nearPile(){return !!(!WI&&S&&P&&!DG&&Math.abs(P.x-SCRAPX)<70)}
function scrapFrac(){const s=S.scrap;return SCRAPK.reduce((t,k)=>t+Math.min(1,s[k]/NEED[k]),0)/3}
function scrapStage(){const f=scrapFrac();return S.scrap.done?4:f>=1?3:Math.min(3,Math.floor(f*4))}
function pileCart(){return S.park&&Math.abs(S.park.x-SCRAPX)<160?S.park:null}
function haveOf(k){const i=SCRAPI[k],c=a=>a.reduce((t,s)=>t+(s.item===i?s.qty:0),0);const pk=pileCart();return c(S.cargo)+(pk?c(pk.cargo):0)}
function takeItem(a,i,n){let t=0;for(let j=a.length-1;j>=0&&t<n;j--){const s=a[j];if(s.item!==i)continue;const m=Math.min(n-t,s.qty);s.qty-=m;t+=m;if(s.qty<=0)a.splice(j,1)}return t}
function deposit(k){if(S.scrap.done)return 0;const left=NEED[k]-S.scrap[k];if(left<=0)return 0;let n=takeItem(S.cargo,SCRAPI[k],left);const pk=pileCart();if(pk&&n<left)n+=takeItem(pk.cargo,SCRAPI[k],left-n);S.scrap[k]+=n;return n}
function depositKeys(keys){let n=0;for(const k of keys)n+=deposit(k);if(n){save();if(scrapFrac()>=1&&!S.scrap.done&&S.horse){finishShip();return n}}renderScrap(n?keys:null);return n}
function finishShip(){S.scrap.done=true;S.scrap.at=Math.round(S.time);save();setMode('play');env.lift=.001;toast('✈ <b class="gold">Airship!</b>',2600);
 for(let i=0;i<5;i++)part(SCRAPX-30+i*15,surfY(SCRAPX)-50,['#ffd75e','#7de0ff','#ff6a6a','#7de07a','#ffffff'][i],14,200,120,1.4)}
function openScrap(){if(MODE!=='play')return;if(scrapFrac()>=1&&!S.scrap.done&&S.horse){finishShip();return}DOCKP=false;setMode('scrap');renderScrap()}
function closeScrap(){setMode('play');save()}
$('sX').onclick=closeScrap;
function shipPreview(){const c=document.createElement('canvas');c.width=120;c.height=100;const g=c.getContext('2d');g.fillStyle='#3a3238';g.fillRect(0,0,120,100);g.fillStyle='#4a423e';g.fillRect(0,92,120,8);g.fillStyle='#a29a90';g.fillRect(0,92,120,2);
 const st=scrapStage(),f=scrapFrac();drawShip(g,60,92,st,st<4?(f>=1?.99:(f*4)%1):1,menuT,S.scrap.done?-14:0);return c.toDataURL()}
function renderScrap(flash){const s=S.scrap;$('spct').textContent=Math.floor(scrapFrac()*100)+'%';let h='<img id="sprev" src="'+shipPreview()+'">';
 if(s.done){h+=S.horse?'<button id="sGo" class="srow" style="justify-content:center">'+ico('ship')+' World 2 '+ico('arR')+'</button>':'<div class="needh">'+ico('horseOff',2)+ico('lock')+'</div><button class="srow" disabled style="justify-content:center">'+ico('lock')+' World 2</button>'}
 else{if(!S.horse)h+='<div class="needh">'+ico('horseOff',2)+ico('lock')+'</div>';let any=0;for(const k of SCRAPK){const v=s[k],n=NEED[k],a=haveOf(k),full=v>=n,can=!full&&a>0;if(can)any=1;
   h+='<button class="srow" data-k="'+k+'"'+(can?'':' disabled')+'><img src="'+ICONURL[k]+'"><span class="sbar"><i style="width:'+Math.round(100*Math.min(1,v/n))+'%'+(full?';background:#ffd75e':'')+'"></i></span><span class="sn">'+v+'/'+n+'</span><span class="sh">'+(full?ico('check'):a?'+'+Math.min(a,n-v):'')+'</span></button>'}
  h+='<button id="sAll"'+(any?'':' disabled')+'>'+ico('down')+' All</button>'}
 $('sbody').innerHTML=h;
 for(const b of $('sbody').querySelectorAll('.srow[data-k]'))b.onclick=()=>depositKeys([b.dataset.k]);
 const all=$('sAll');if(all)all.onclick=()=>depositKeys(SCRAPK);const go=$('sGo');if(go)go.onclick=()=>{closeScrap();travelTo(1)};
 if(flash)for(const k of flash){const b=$('sbody').querySelector('[data-k="'+k+'"] .sbar');if(b)b.animate([{filter:'brightness(2)'},{filter:'none'}],{duration:400})}}
// airship sprite, built up in stages: 0 scrap heap, 1 hull frame, 2 planked hull, 3 balloon inflating, 4 finished (lift = hover offset)
function drawShip(c,x,y,st,k,t,lift,z,pal){z=z||1;const G=(a,b,w,h,col)=>px(c,x+a,y+b,w,h,col);const L=Math.round(lift||0);const Q=(a,b,w,h,col)=>px(c,x+a,y+b+L,w,h,col);
 const W='#8b5a2b',W2='#5e3a1e',W3='#b07a44',DK='#2e1c10',ME='#9aa0a8',ME2='#5a5e66',RU='#9a5a32';
 const A1=pal?pal[0]:'#c84a3a',A2=pal?pal[1]:'#e8d8b0',A1d=pal?mixc(A1,'#000000',.25):'#963428',A2d=pal?mixc(A2,'#000000',.2):'#b8a888',A1h=pal?mixc(A1,'#ffffff',.25):'#e8705a',A2h=pal?mixc(A2,'#ffffff',.5):'#fff4d8';
 const heap=(cx,s)=>{const r=Math.round(26*s);for(let i=-r;i<=r;i++){const q=i/(r+1),hh=Math.max(1,Math.round(13*s*(1-q*q)+2*hash(i*1.31+cx)));for(let j=0;j<hh;j++){const zz=hash(i*7.7+j*3.1+cx);G(cx+i,-1-j,1,1,zz<.4?W:zz<.6?W2:zz<.75?ME2:zz<.88?RU:'#6a625c')}G(cx+i,-hh,1,1,hash(i+cx)>.5?W3:ME)}
  if(s>.5){G(cx-12,-20,2,10,W3);G(cx-10,-22,2,4,W3);G(cx+6,-18,10,2,W);G(cx+14,-20,2,2,W);for(let a=0;a<8;a++)G(cx+2+Math.round(Math.cos(a*.785)*4),-14+Math.round(Math.sin(a*.785)*4),1,1,ME);G(cx+2,-14,1,1,ME2)}};
 if(st===0){heap(0,.75+.35*k);return}
 if(st<4||!L)heap(-52,Math.max(.25,.6-.12*st));
 const HL=Math.round(34*z),HR=Math.round(36*z),bs=HR-Math.round(10*z),ss=-HL+Math.round(4*z),dz=13*(.7+.3*z);
 const y0=-24,top=i=>y0-(i>bs?Math.round((i-bs)*.7):0)-(i<ss?Math.round((ss-i)*.5):0),dep=i=>Math.round(dz*Math.sqrt(Math.max(0,1-((i-1)/(36*z))**2)));
 if(st<4||!L)for(const tx of [-20,20]){G(tx-4,-10,2,10,DK);G(tx+3,-10,2,10,DK);G(tx-4,-11,9,2,W2);G(tx-2,-6,5,1,DK)}
 if(st===1){const n=Math.round(-HL+(HL+HR)*(.45+.55*k));for(let i=-HL;i<=HR;i++){const tp=top(i),d=dep(i);if(d<=0)continue;Q(i,tp+d,1,1,W2);if(i<=n){if((i+HL)%6===0)Q(i,tp,1,d,W);if(i===n||i===-HL)Q(i,tp,1,1,W3)}}if(n>-20)for(let i=-HL;i<=Math.min(n,HR);i++)Q(i,top(i),1,1,W3);return}
 // planked hull
 for(let i=-HL;i<=HR;i++){const tp=top(i),d=dep(i);if(d<=0)continue;Q(i,tp,1,d,W);for(let j=3;j<d;j+=3)Q(i,tp+j,1,1,W2);Q(i,tp,1,1,W3);Q(i,tp+d-1,1,1,DK)}
 for(const p0 of [-18,-6,6,18]){const p=Math.round(p0*z);Q(p,y0+3,3,3,ME2);Q(p+1,y0+4,1,1,st>=4?'#ffe08a':'#3a2a20')}
 Q(-HL-3,y0-3,3,Math.round(12*(.7+.3*z)),W2);Q(-HL-4,y0+2,1,6,DK);Q(HR,y0-11,1,9,DK);Q(HR,y0-13,1,2,W3);
 if(st===2){const m=Math.round(10*z);Q(-m,y0-16,1,16,DK);Q(m,y0-16,1,16,DK);Q(-m,y0-16,2*m+1,1,W2);return}
 // ropes + balloon (inflating at stage 3)
 const s3=st===3?.3+.6*k:1,rx=Math.round(44*z*(.65+.35*s3)),ry=Math.max(3,Math.round(16*(.8+.2*z)*s3)),by=y0-10-ry-(st===3?Math.round(8*s3):10),sw=Math.max(5,Math.round(9*z));
 for(const r0 of [-20,-6,8,22]){const rz=Math.round(r0*z),bx=Math.round(rz*rx/(44*z));for(let yy=by+ry-1;yy<y0;yy++){const f=(yy-(by+ry-1))/Math.max(1,y0-(by+ry-1));Q(Math.round(bx+(rz-bx)*f),yy,1,1,DK)}}
 for(let i=-rx;i<=rx;i++){const q=i/(rx+.5),hh=Math.round(ry*Math.sqrt(Math.max(0,1-q*q))*(st===3?1+.15*Math.sin(i/3+t*3):1));if(hh<=0)continue;const stripe=Math.floor((i+rx)/sw)%2;const c1=stripe?A1:A2,c2=stripe?A1d:A2d;
  Q(i,by-hh,1,hh*2,c1);Q(i,by+Math.round(hh*.35),1,Math.max(1,hh-Math.round(hh*.35)),c2);Q(i,by-hh,1,1,stripe?A1h:A2h);Q(i,by+hh-1,1,1,DK)}
 if(st===3){const m=Math.round(30*z);for(let i=-m;i<=m;i+=2)Q(i,y0-1-Math.round(Math.abs(Math.sin(i/5))*2),2,1,A2);return}
 // finished: fins, propellers, flag
 Q(-rx-6,by-8,6,2,A1d);Q(-rx-8,by-10,3,3,A1);Q(-rx-6,by+6,6,2,A1d);Q(-rx-8,by+7,3,3,A1);
 const prop=(px0,py0)=>{const b=Math.round(Math.abs(Math.cos(t*(L?26:4)))*6);Q(px0-1,py0-1,3,3,ME2);Q(px0,py0-b,1,b*2+1,L?'#c8ccd4':ME);if(L)Q(px0-1,py0-b+1,1,Math.max(1,b*2-1),'rgba(200,204,212,.45)')};
 prop(-HL-6,y0+4);prop(-rx-2,by);prop(rx+2,by+2);Q(rx-1,by+1,3,3,ME2);
 {const fx=Math.round(30*z),mt=y0-22;Q(fx,mt,1,Math.max(2,top(fx)-mt-2),DK);const wv=Math.round(Math.sin(t*6));Q(fx+1,mt,6,2,'#ffd75e');Q(fx+1,mt+2+wv,6,2,'#ffb030')}}
function drawPile(ox,oy,dt){if(!S||MODE==='menu'&&!S)return;const x=Math.round(SCRAPX-ox),y=Math.round(surfY(SCRAPX)-oy);const sc=S.scrap||{done:false};const st=sc.done?4:scrapStage(),f=scrapFrac();
 let lift=0;if(sc.done){if(env.lift>0){env.lift+=dt;const p=Math.min(1,env.lift/3.2);lift=-2-24*smooth(p);if(Math.random()<.5)part(SCRAPX-40+Math.random()*80,surfY(SCRAPX)-40+lift-Math.random()*30,['#ffd75e','#7de0ff','#ff6a6a','#7de07a'][Math.floor(Math.random()*4)],2,120,60,1);if(p>=1)env.lift=-1}else lift=-26;lift+=Math.round(Math.sin(menuT*1.6)*2)}
 if(sc.done){px(X,x-30,y,62,1,'rgba(0,0,0,.25)');/* World 2 sign (locked) */px(X,x+58,y-14,2,14,'#2e1c10');px(X,x+51,y-23,16,10,'#000');px(X,x+52,y-22,14,8,'#b07a44');px(X,x+56,y-21,6,3,'#ffd75e');px(X,x+57,y-22,1,1,'#ffd75e');px(X,x+60,y-22,1,1,'#ffd75e');px(X,x+55,y-18,8,3,'#ffd75e');px(X,x+58,y-17,2,1,'#6a4a1a')}
 drawShip(X,x,y,st,st<4?(f>=1?.99:(f*4)%1):1,menuT,lift);
 if(nearPile()&&MODE==='play'&&Math.sin(menuT*4)>0)px(X,x,y-(sc.done?100:st===0?30:44)+lift,1,2,'#ffd75e')}
