// usage: node test.js [lessonId ...] [--shots]
const {chromium}=require('playwright');const path=require('path');
(async()=>{const args=process.argv.slice(2);const shots=args.includes('--shots');const ids=args.filter(a=>!a.startsWith('--'));
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+(e.stack||e.message).split('\n').slice(0,2).join(' | ')));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push('CONSOLE '+m.text())});
await p.goto('file://'+path.join(__dirname,''+(process.env.COURSE?'../lib/courses/'+process.env.COURSE:'site')+'/index.html'));await p.waitForTimeout(300);
const all=await p.evaluate(()=>PLCBOOK.LESSONS.map(l=>l.id));
const list=ids.length?ids:all;console.log('lessons:',all.length);
for(const id of list){const before=errs.length;
  await p.evaluate(id=>{location.hash=id},id);await p.waitForTimeout(250);
  const tabs=await p.$$eval('.ltabs button',bs=>bs.map(b=>b.dataset.tab));
  for(const t of tabs){await p.click(`.ltabs button[data-tab="${t}"]`);await p.waitForTimeout(200);
    if(t==='lab'||t==='plc'){ // press each push button once and toggle switches
      const pbs=await p.$$('.pb');for(const pb of pbs){const bb=await pb.boundingBox();if(!bb)continue;await p.mouse.move(bb.x+20,bb.y+20);await p.mouse.down();await p.waitForTimeout(350);await p.mouse.up();await p.waitForTimeout(250)}
      if(t==='plc'){for(const v of ['fbd','stl','lad']){const vb=await p.$(`[data-view="${v}"]`);if(vb){await vb.click();await p.waitForTimeout(150)}}}
    }
    if(shots)await p.screenshot({path:path.join(__dirname,'shots',`${id}-${t}.jpg`),type:'jpeg',quality:70,fullPage:true});
  }
  console.log(id,tabs.join(','),errs.length>before?'ERRORS':'ok');
}
console.log(errs.slice(0,30).join('\n'));await b.close()})();
