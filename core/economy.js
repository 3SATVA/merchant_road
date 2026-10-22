'use strict';
function tdist(a,b){if(TOWNS[a].w!==TOWNS[b].w)return 0; // goods never cross worlds
 return Math.abs(TOWNS[a].x-TOWNS[b].x)/DUNIT}
function drift(seed,i,k){const T=S?S.time:0;return 1+k*(.7*Math.sin(T/90+seed*1.7+i*2.3)+.3*Math.sin(T/37+seed*3.1+i*.7))}
function buyPrice(t,i){return Math.max(1,Math.round(ITEMS[i].base*drift(t,i,.04)))}
function sellPrice(t,i,origin){const m=origin===t?.9:1+.2*tdist(t,origin);return Math.max(1,Math.round(ITEMS[i].base*m*drift(t+7,i,.05)))}
const REFUND=.5; // on death, half of the purchase price of lost goods comes back
function cargoN(a){return a.reduce((t,s)=>t+s.qty,0)}
function cargoCount(){return cargoN(S.cargo)}
function addCargo(item,origin,qty,paid){let s=S.cargo.find(s=>s.item===item&&s.origin===origin);if(s){s.paid=(s.paid*s.qty+paid*qty)/(s.qty+qty);s.qty+=qty}else S.cargo.push({item,origin,qty,paid})}
function takeUnit(stackIdx,a){a=a||S.cargo;const s=a[stackIdx];s.qty--;const u={item:s.item,origin:s.origin,paid:s.paid};if(s.qty<=0)a.splice(stackIdx,1);return u}
function randomUnit(a){a=a||S.cargo;const n=cargoN(a);if(!n)return null;let r=Math.floor(rnd()*n);for(let i=0;i<a.length;i++){if(r<a[i].qty)return takeUnit(i,a);r-=a[i].qty}return null}
function buy(t,i,n){const p=buyPrice(t,i);n=Math.min(n,cap()-cargoCount(),Math.floor(S.money/p));if(n<=0)return 0;S.money-=p*n;addCargo(i,t,n,p);save();return n}
function sell(t,si,n){const s=S.cargo[si];if(!s)return 0;n=Math.min(n,s.qty);const p=sellPrice(t,s.item,s.origin);S.money+=p*n;S.stats.profit+=Math.round((p-s.paid)*n);S.stats.sold+=n;s.qty-=n;if(s.qty<=0)S.cargo.splice(si,1);save();return p*n}
function cargoColors(c){const a=[];for(const s of (c||S.cargo))for(let k=0;k<s.qty;k++)a.push(ITEMS[s.item].col);return a}
function nearestTown(x){let o=WT[0].i;for(const t of WT)if(Math.abs(t.x-x)<Math.abs(TOWNS[o].x-x))o=t.i;return o}
function unitsOf(a){const u=[];for(const s of a)for(let k=0;k<s.qty;k++)u.push({item:s.item,origin:s.origin,paid:s.paid});return u}
function stacksOf(u){const out=[];for(const x of u){const s=out.find(s=>s.item===x.item&&s.origin===x.origin);if(s){s.paid=(s.paid*s.qty+x.paid)/(s.qty+1);s.qty++}else out.push({item:x.item,origin:x.origin,qty:1,paid:x.paid})}return out}
