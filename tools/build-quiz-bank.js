/* يبني quiz-bank.json (بنك أسئلة «اختبر نفسك» لكل الدروس + أسئلة «الأنشطة التفاعلية» open/exit + مسائل «اكتشف الخطأ» errs إن وُجدت) لاستعماله في خادم المسابقة.
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
    questions:(l.quiz||[]).filter(q=>q&&typeof q.q==='string'&&Array.isArray(q.o)).map(q=>({q:q.q,o:q.o.map(String),c:q.c,e:q.e||''})),
    /* «الأنشطة التفاعلية» (courses/<id>/activities.js): open = أسئلة مفتوحة، exit = أسئلة تذكرة الخروج. تُضاف فقط إن وُجدت */
    ...(()=>{const a=(PLCBOOK.ACTS||{})[l.id]||{},o={};
      const op=(a.open||[]).filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim());if(op.length)o.open=op;
      const ex=(a.exit||[]).filter(q=>q&&typeof q.q==='string'&&Array.isArray(q.o)).map(q=>({q:q.q,o:q.o.map(String),c:q.c,e:q.e||''}));if(ex.length)o.exit=ex;
      return o})(),
    /* «اكتشف الخطأ» (courses/<id>/errors.js): errs = مسائل فيها خطوة واحدة خاطئة. تُضاف فقط إن وُجدت */
    ...(()=>{const v=((PLCBOOK.ERRS||{})[l.id]||[]).filter(x=>x&&typeof x.ask==='string'&&Array.isArray(x.steps)&&x.steps.length>=2&&x.steps.every(s=>s&&typeof s.t==='string'));
      if(!v.length)return {};
      return {errs:v.map(x=>({ex:x.ex||'',title:x.title||'',given:x.given||'',ask:x.ask,steps:x.steps.map(s=>s.bad?{t:s.t,bad:true,why:s.why||'',fix:s.fix||'',...(Array.isArray(s.reasons)&&s.reasons.length?{reasons:s.reasons.map(String),rc:s.rc}:{})}:{t:s.t}),answer:x.answer||''}))}})()})));
  const units=await p.evaluate(()=>PLCBOOK.UNITS.map(u=>({n:u.n,title:u.title})).sort((a,b)=>a.n-b.n));
  lessons.forEach(l=>{nq+=l.questions.length;l.questions.concat(l.exit||[]).forEach(q=>{if(!(Number.isInteger(q.c)&&q.c>=0&&q.c<q.o.length))throw new Error('bad answer index in '+c.id+'/'+l.id)})});
  lessons.forEach(l=>(l.errs||[]).forEach((x,i)=>{const b=x.steps.filter(s=>s.bad);const w=c.id+'/'+l.id+' errs['+i+']';
    if(b.length!==1)throw new Error('need exactly one bad step in '+w);
    if(b[0].reasons&&!(b[0].reasons.length>=2&&Number.isInteger(b[0].rc)&&b[0].rc>=0&&b[0].rc<b[0].reasons.length))throw new Error('bad reason index in '+w)}));
  const errsX=await p.evaluate(()=>Object.keys(PLCBOOK.ERRS||{}).filter(id=>!PLCBOOK.LESSONS.some(l=>l.id===id)));
  if(errsX.length)console.warn('  تنبيه: في errors.js دروس غير موجودة في',c.id+':',errsX.join(', '));
  const acts=await p.evaluate(()=>Object.keys(PLCBOOK.ACTS||{}).filter(id=>!PLCBOOK.LESSONS.some(l=>l.id===id)));
  if(acts.length)console.warn('  تنبيه: في activities.js دروس غير موجودة في',c.id+':',acts.join(', '));
  out.courses.push({id:c.id,code:c.code,title:c.title,units,lessons});
  console.log(c.id,lessons.length,'lessons',lessons.reduce((a,l)=>a+l.questions.length,0),'questions',lessons.reduce((a,l)=>a+(l.open||[]).length,0),'open',lessons.reduce((a,l)=>a+(l.exit||[]).length,0),'exit',lessons.reduce((a,l)=>a+(l.errs||[]).length,0),'errs');
 }
 fs.writeFileSync(path.join(ROOT,'quiz-bank.json'),JSON.stringify(out));console.log('total',nq,'->',path.join(ROOT,'quiz-bank.json'));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
