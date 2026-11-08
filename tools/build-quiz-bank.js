/* يبني quiz-bank.json (بنك أسئلة «اختبر نفسك» لكل الدروس) لاستعماله في مسابقة الصف.
   التشغيل: node tools/build-quiz-bank.js   (يحتاج playwright)
   يفتح صفحة كل مقرر محلياً ويقرأ PLCBOOK.LESSONS كما يراها المتصفح. */
const path=require('path'),fs=require('fs');
let chromium;try{({chromium}=require('playwright'))}catch(e){({chromium}=require('/opt/npm-tools/node_modules/playwright'))}
const ROOT=path.join(__dirname,'..');
global.window={};eval(fs.readFileSync(path.join(ROOT,'library.js'),'utf8'));const LIB=window.LIBRARY;
(async()=>{const b=await chromium.launch();const p=await b.newPage();const out={built:new Date().toISOString(),courses:[]};let nq=0;
 for(const c of LIB.courses){
  await p.goto('file://'+path.join(ROOT,'courses',c.id,'index.html'));await p.waitForFunction(()=>window.PLCBOOK&&PLCBOOK.LESSONS&&PLCBOOK.LESSONS.length);
  const lessons=await p.evaluate(()=>PLCBOOK.LESSONS.slice().sort((a,b)=>a.unit-b.unit||a.order-b.order).map(l=>({id:l.id,unit:l.unit,order:l.order,title:l.title,
    questions:(l.quiz||[]).filter(q=>q&&typeof q.q==='string'&&Array.isArray(q.o)).map(q=>({q:q.q,o:q.o.map(String),c:q.c,e:q.e||''}))})));
  const units=await p.evaluate(()=>PLCBOOK.UNITS.map(u=>({n:u.n,title:u.title})).sort((a,b)=>a.n-b.n));
  lessons.forEach(l=>{nq+=l.questions.length;l.questions.forEach(q=>{if(!(q.c>=0&&q.c<q.o.length))throw new Error('bad answer index in '+c.id+'/'+l.id)})});
  out.courses.push({id:c.id,code:c.code,title:c.title,units,lessons});
  console.log(c.id,lessons.length,'lessons',lessons.reduce((a,l)=>a+l.questions.length,0),'questions');
 }
 fs.writeFileSync(path.join(ROOT,'quiz-bank.json'),JSON.stringify(out));console.log('total',nq,'->',path.join(ROOT,'quiz-bank.json'));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
