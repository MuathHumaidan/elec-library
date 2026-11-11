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
      return {errs:v.map(x=>({ex:x.ex||'',title:x.title||'',given:x.given||'',ask:x.ask,steps:x.steps.map(s=>s.bad?{t:s.t,bad:true,why:s.why||'',fix:s.fix||'',...(Array.isArray(s.reasons)&&s.reasons.length?{reasons:s.reasons.map(String),rc:s.rc}:{})}:{t:s.t}),answer:x.answer||''}))}})(),
    /* «اكتشف العطل» و«تحدي المحاكاة» (courses/<id>/challenge.js، للدروس التي لها مختبر): faults = أعطال المختبر المخفية بأعراضها،
       sim = القراءات التي يمكن استهدافها والمدخلات التي يمكن تثبيتها، params = «قيم الآلة» للنشاط. تُضاف فقط إن وُجدت */
    ...(()=>{const c=(PLCBOOK.CHAL||{})[l.id];if(!c||!(PLCBOOK.chLab?PLCBOOK.chLab(l):l.lab))return {};const o={};
      /* symG/howG: نسخة بلا أرقام تظهر إذا غيّر المدرب «قيم الآلة» (النص الذي ليس فيه أرقام قيم يُنسخ كما هو) */
      const stdL=!l.lab||!!l.program||!!l.plant;
      const hasNum=t=>/\d/.test(String(t).replace(/<[^>]+>/g,'').replace(/√3/g,'').replace(/[A-Za-zθ]+[A-Za-z0-9θ²]*|\d+[A-Za-z]+[A-Za-z0-9]*/g,'').replace(/المحول(?:ين)?\s*\d/g,''));
      const gen=(x,k)=>{const g=x[k+'G'];if(typeof g==='string'&&g.trim()){if(hasNum(g))throw new Error('numbers in '+k+'G of '+l.id+'/'+x.id);return g}if(hasNum(x[k]||'')&&!stdL)throw new Error('missing '+k+'G (text has numbers) in '+l.id+'/'+x.id);return x[k]||''};
      /* مختبرات «منضدة البرنامج» ليس فيها «قيم آلة» يغيّرها المدرب، فلا تظهر النسخة العامة أبداً: symG/howG اختيارية فيها */
      const f=(c.faults||[]).filter(x=>x&&x.id&&typeof x.t==='string').map(x=>({id:String(x.id),t:x.t,sym:x.sym||'',how:x.how||'',symG:gen(x,'sym'),howG:gen(x,'how')}));if(f.length)o.faults=f;
      const out=(c.outputs||[]).filter(x=>x&&x.k&&x.label&&(x.m||x.sel||typeof x.read==='function')).map(x=>({k:x.k,label:x.label,unit:x.unit||'',dp:x.dp|0}));
      if(out.length)o.sim={outputs:out,inputs:(c.inputs||[]).filter(x=>x&&x.k&&x.label&&['range','switch','pick'].includes(x.kind)).map(x=>({k:x.k,label:x.label,kind:x.kind,
        ...(x.kind==='range'?{unit:x.unit||'',min:x.min,max:x.max,step:x.step,dp:x.dp|0}:{}),...(x.kind==='pick'?{opts:(x.opts||[]).map(p=>[p[0],String(p[1])])}:{}),...(x.noset?{noset:true}:{})}))};
      /* params = «قيم الآلة» التي يستطيع المدرب تغييرها للنشاط: مجموعات B.params كما يستدعيها مختبر الدرس [{id, defs:[{k,label,unit,value,min,max,step,dp,hint}]}]
         (تُلتقط بتشغيل المختبر مرة في عنصر مخفي) */
      /* refTitle = عنوان لوحة المقارنة على جوال الطالب («بيانات الآلة السليمة» / «قراءات الدائرة السليمة» / «قراءات النظام السليم») */
      if((o.faults||o.sim)&&PLCBOOK.chRefTitle)o.refTitle=PLCBOOK.chRefTitle(l.id);
      /* opts = قيم مسموحة فقط [[قيمة, نص]] (مثل تردد الشبكة 50 / 60 هرتز): تظهر للمدرب اختياراً لا خانة رقم */
      const cp=d=>{const o={k:d.k,label:d.label,unit:d.unit||'',value:d.value};['min','max','step','dp'].forEach(q=>{if(d[q]!=null)o[q]=d[q]});if(d.hint)o.hint=d.hint;
        if(Array.isArray(d.opts)&&d.opts.length)o.opts=d.opts.map(x=>[+x[0],String(x[1])]);return o};
      /* params في challenge.js = «قيم آلة» يعلنها الدرس صراحة (لمختبرات «منضدة البرنامج» التي لا تُشغَّل هنا) — تُضم قبل ما يُلتقط من المختبر */
      const SP=(Array.isArray(c.params)?c.params:[]).filter(g=>g&&g.id&&Array.isArray(g.defs)&&g.defs.length).map(g=>({id:String(g.id),defs:g.defs.map(cp)}));
      /* مختبرات «منضدة البرنامج» العامة (بلا L.lab): لا «قيم آلة» إلا ما أعلنته challenge.js */
      if(!l.lab||l.program||l.plant){if(SP.length)o.params=SP;return o}
      const P=SP.slice();const orig=PLCBOOK.params;const host=document.createElement('div');host.style.cssText='position:absolute;left:-99999px;top:0;width:1200px';document.body.appendChild(host);
      PLCBOOK.params=function(h,id,defs){if(!P.some(g=>g.id===String(id)))P.push({id:String(id),defs:defs.map(cp)});return orig.apply(this,arguments)};
      try{l.lab(host,PLCBOOK)}catch(e){console.error('lab',l.id,e)}finally{PLCBOOK.params=orig;host.remove()}
      if(P.length)o.params=P;
      return o})()})));
  const units=await p.evaluate(()=>PLCBOOK.UNITS.map(u=>({n:u.n,title:u.title})).sort((a,b)=>a.n-b.n));
  lessons.forEach(l=>{nq+=l.questions.length;l.questions.concat(l.exit||[]).forEach(q=>{if(!(Number.isInteger(q.c)&&q.c>=0&&q.c<q.o.length))throw new Error('bad answer index in '+c.id+'/'+l.id)})});
  lessons.forEach(l=>(l.errs||[]).forEach((x,i)=>{const b=x.steps.filter(s=>s.bad);const w=c.id+'/'+l.id+' errs['+i+']';
    if(b.length!==1)throw new Error('need exactly one bad step in '+w);
    if(b[0].reasons&&!(b[0].reasons.length>=2&&Number.isInteger(b[0].rc)&&b[0].rc>=0&&b[0].rc<b[0].reasons.length))throw new Error('bad reason index in '+w)}));
  const errsX=await p.evaluate(()=>Object.keys(PLCBOOK.ERRS||{}).filter(id=>!PLCBOOK.LESSONS.some(l=>l.id===id)));
  if(errsX.length)console.warn('  تنبيه: في errors.js دروس غير موجودة في',c.id+':',errsX.join(', '));
  const acts=await p.evaluate(()=>Object.keys(PLCBOOK.ACTS||{}).filter(id=>!PLCBOOK.LESSONS.some(l=>l.id===id)));
  if(acts.length)console.warn('  تنبيه: في activities.js دروس غير موجودة في',c.id+':',acts.join(', '));
  const chX=await p.evaluate(()=>Object.keys(PLCBOOK.CHAL||{}).filter(id=>!PLCBOOK.LESSONS.some(l=>l.id===id&&(PLCBOOK.chLab?PLCBOOK.chLab(l):l.lab))));
  const std=new Set(await p.evaluate(()=>PLCBOOK.LESSONS.filter(l=>!l.lab||l.program||l.plant).map(l=>l.id)));lessons.forEach(l=>{if(std.has(l.id))Object.defineProperty(l,'std',{value:true,enumerable:false})});
  if(chX.length)console.warn('  تنبيه: في challenge.js دروس غير موجودة أو بلا مختبر في',c.id+':',chX.join(', '));
  lessons.forEach(l=>(l.faults||[]).forEach((f,i,a)=>{if(a.findIndex(x=>x.id===f.id)!==i)throw new Error('duplicate fault id '+f.id+' in '+c.id+'/'+l.id)}));
  lessons.forEach(l=>{if((l.faults||l.sim)&&!l.params&&!l.std)console.warn('  تنبيه: لا «قيم آلة» (B.params) في مختبر',c.id+'/'+l.id);
    const ids=new Set();(l.params||[]).forEach(g=>g.defs.forEach(d=>{if(ids.has(d.k))throw new Error('duplicate param key '+d.k+' in '+c.id+'/'+l.id);ids.add(d.k);if(!(typeof d.value==='number'&&isFinite(d.value)))throw new Error('bad param value '+d.k+' in '+c.id+'/'+l.id);if(d.opts&&!(d.opts.length>=2&&d.opts.every(x=>isFinite(x[0])&&x[1])&&d.opts.some(x=>x[0]===d.value)))throw new Error('bad param opts '+d.k+' in '+c.id+'/'+l.id)}))});
  out.courses.push({id:c.id,code:c.code,title:c.title,units,lessons});
  console.log(c.id,lessons.length,'lessons',lessons.reduce((a,l)=>a+l.questions.length,0),'questions',lessons.reduce((a,l)=>a+(l.open||[]).length,0),'open',lessons.reduce((a,l)=>a+(l.exit||[]).length,0),'exit',lessons.reduce((a,l)=>a+(l.errs||[]).length,0),'errs',lessons.reduce((a,l)=>a+(l.faults||[]).length,0),'faults',lessons.filter(l=>l.sim).length,'sim',lessons.filter(l=>l.params).length,'params');
 }
 const OUTF=process.env.BANK_OUT||path.join(ROOT,'quiz-bank.json');fs.writeFileSync(OUTF,JSON.stringify(out));console.log('total',nq,'->',OUTF);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
