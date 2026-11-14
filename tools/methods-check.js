// «طرق التدريب»: يتأكد أن كل هدف في courses/<المقرر>/methods-data.js يجد جزءاً حقيقياً في الدرس — node tools/methods-check.js <المقرر> [--list] (يحتاج playwright)
const {chromium}=require('playwright');const path=require('path');
const C=process.argv[2]||'dc-machines',LIST=process.argv.includes('--list');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});
await ctx.addInitScript(()=>{localStorage.setItem('elib-trainer',JSON.stringify({token:'tok',name:'مدرب'}))});
await ctx.route('**/api/**',r=>r.fulfill({status:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization, Content-Type','Content-Type':'application/json'},body:'{"user":{"name":"مدرب"}}'}));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const url=h=>'file://'+path.join(__dirname,'..','courses',C,'index.html')+'#'+h;
await p.goto(url('home'));await p.waitForTimeout(500);
const ids=await p.evaluate(()=>Object.keys(window.METHODS_DATA||{}).filter(k=>k[0]!=='_'));
let bad=0,n=0;const rows=[];
for(const id of ids){await p.goto(url(id));await p.waitForTimeout(500);
  const plan=await p.evaluate(()=>{const M=PLCBOOK.METHODS,L=PLCBOOK.LESSONS.find(l=>l.id===location.hash.slice(1)),o=[];
    for(const m of M.list){if(m.stage!==1)continue;const lvs=m.lv?Object.keys(m.lv):[null];
      for(const lv of lvs){const g=M.goOf(L,m,lv),gr=M.gradeOf(L,m);if(!g){if(['rec','ok'].includes(gr.g)&&!m.lv)o.push({err:m.id+' مدرجة ('+gr.g+') بلا أهداف صحيحة'});continue}
        g.forEach((ts,i)=>ts.forEach(t=>o.push({m:m.id+(lv?':'+lv:''),i,t,step:M.stepsOf(m,lv)[i].t})))}}
    const d=window.METHODS_DATA[L.id];['rec','ok'].forEach(k=>(d[k]||[]).forEach(x=>{const id=x.m||x;if(!M.list.find(m=>m.id===id&&M.usable(L,m)))o.push({err:k+' '+id+' غير صالحة'})}));
    return o});
  for(const x of plan){if(x.err){bad++;console.log('FAIL',id,x.err);continue}
    n++;const r=await p.evaluate(async t=>{const M=PLCBOOK.METHODS;const ok=M.goTo(t,true);await new Promise(r=>setTimeout(r,350));
      const hl=document.querySelector('.mgo-hl');const q=hl&&hl.querySelector('h2,h3,h4,summary,b,.tp-lbl');return {ok,hl:hl?((q&&q.textContent.trim())||('#'+(hl.id||hl.className))).slice(0,50):null}},x.t);
    if(!r.ok||!r.hl){bad++;console.log('FAIL',id,x.m,'خطوة',x.i+1,x.t)}
    rows.push(id+' | '+x.m+' | '+(x.i+1)+'. '+x.step+' | '+x.t+' → '+(r.hl||'—'))}
}
if(LIST)console.log(rows.join('\n'));
console.log(`${C}: ${n} targets, ${bad} failures, page errors: ${errs.length}`);errs.forEach(e=>console.log(' ',e));
await b.close();process.exit(bad||errs.length?1:0)})();
