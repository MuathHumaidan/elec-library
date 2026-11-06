/* Unit 8 — التطبيق على الغسالة الكهربائية (ص 131–144) */
(function(B){
const {S,clamp}=B;

/* ================= program (STL verbatim from ص 141–143) =================
   opt: {tv:'S5T#1M', pv:'C#5', fixCount:false, fixM02:false}                */
function washProgram(o){
  o=Object.assign({tv:'S5T#1M',pv:'C#5',fixCount:false,fixM02:false},o||{});
  const tvNote=o.tv==='S5T#1M'?'':` <b>(في هذه النسخة الزمن ${o.tv} بدل S5T#1M)</b>`;
  return [
  {title:'Network 1 : Inlet Pump — مضخة دفع المياه Y1',ref:'ص 135 · 138 · 141',
   read:'Y1 تعمل إذا: S0 غير مضغوط <b>و</b> (S1 مضغوط <b>أو</b> Y1 شغالة أصلاً «تعويض ذاتي») <b>و</b> الماء لم يصل إلى المستوى الأعلى LS1. <br>(في STL ص 141 عنوان هذه الشبكة مطبوع خطأً «1st Direction».)',
   stl:['AN I 0.0','A(','O I 0.1','O Q 5.1',')','AN I 1.1','= Q 5.1']},
  {title:'Network 2 : 1st Direction — المحرك يميناً K1',ref:'ص 135 · 138 · 141',
   read:'K1 يعمل إذا: S0 غير مضغوط <b>و</b> (انتهى T2 <b>أو</b> K1 شغال <b>أو</b> الماء عند LS1) <b>و</b> M0.1 = 1 (العداد لم يصل إلى الصفر) <b>و</b> K2 مفصول <b>و</b> T1 لم ينتهِ.',
   stl:['AN I 0.0','A(','O T 2','O Q 4.1','O I 1.1',')','A M 0.1','AN Q 4.2','AN T 1','= Q 4.1']},
  {title:'Network 3 : T1 — زمن الدوران يميناً (S_ODTS)',ref:'ص 135 · 138 · 141',
   read:'عند بدء K1 يبدأ المزمن T1 (تأخير تشغيل محتفظ SS) بالعد'+tvNote+'. بعد انتهاء الزمن يصبح T1 = 1 ويبقى كذلك حتى يُلغى بـ S0 <b>أو</b> بنبضة T3.',
   stl:['A Q 4.1','L '+o.tv,'SS T 1','A(','O I 0.0','O T 3',')','R T 1','NOP 0','NOP 0','NOP 0']},
  {title:'Network 4 : 2nd Direction — المحرك يساراً K2',ref:'ص 135 · 138 · 141',
   read:'K2 يعمل إذا: S0 غير مضغوط <b>و</b> (انتهى T1 <b>أو</b> K2 شغال) <b>و</b> M0.1 = 1 <b>و</b> K1 مفصول <b>و</b> T2 لم ينتهِ.',
   stl:['AN I 0.0','A(','O T 1','O Q 4.2',')','A M 0.1','AN Q 4.1','AN T 2','= Q 4.2']},
  {title:'Network 5 : T2 — زمن الدوران يساراً (S_ODTS)',ref:'ص 136 · 139 · 142',
   read:'عند بدء K2 يبدأ T2 بالعد'+tvNote+'. يُلغى بنبضة T4 <b>أو</b> بـ S0.',
   stl:['A Q 4.2','L '+o.tv,'SS T 2','A(','O T 4','O I 0.0',')','R T 2','NOP 0','NOP 0','NOP 0']},
  {title:'Network 6 : T3 — نبضة 1 ثانية عند بدء K2 (S_PULSE)',ref:'ص 136 · 139 · 142',
   read:'لحظة بدء K2 يعطي T3 نبضة مدتها ثانية واحدة، وهذه النبضة تلغي T1 (Network 3) ليكون جاهزاً للدورة التالية.',
   stl:['A Q 4.2','L S5T#1S','SP T 3','NOP 0','NOP 0','NOP 0','NOP 0']},
  {title:'Network 7 : T4 — نبضة 1 ثانية عند بدء K1 (S_PULSE)',ref:'ص 136 · 139 · 142',
   read:'لحظة بدء K1 يعطي T4 نبضة مدتها ثانية واحدة تلغي T2 (Network 5).',
   stl:['A Q 4.1','L S5T#1S','SP T 4','NOP 0','NOP 0','NOP 0','NOP 0']},
  {title:'Network 8 : C1 — العداد التنازلي (S_CD)'+(o.fixCount?' — مُعدَّل':''),ref:o.fixCount?'مصحح (الأصل ص 136 · 139 · 142)':'ص 136 · 139 · 142',
   read:(o.fixCount?'<b>تعديل:</b> العداد ينقص عند <b>انتهاء T2</b> (نهاية كل دورة يمين + يسار) بدل بداية K1. ':'كل بداية لـ K1 تُنقص العداد واحداً (CD). ')+
     `وصول الماء إلى LS1 يضبط العداد على ${o.pv} (S). S0 <b>أو</b> عمل Y1 يصفّر العداد (R). القيمة الحالية تُنقل إلى MW1، و M0.1 = 1 ما دام العداد أكبر من صفر.`,
   stl:[o.fixCount?'A T 2':'A Q 4.1','CD C 1','BLD 101','A I 1.1','L '+o.pv,'S C 1','A(','O I 0.0','O Q 5.1',')','R C 1','L C 1','T MW 1','NOP 0','A C 1','= M 0.1']},
  {title:'Network 9 : M0.2 — علَم التفريغ',ref:'ص 137 · 139 · 143',
   read:'ما دام M0.1 = 1 (الغسيل جارٍ) يُثبَّت (S) العلم M0.2، ويبقى 1 بعد انتهاء الغسيل.',
   stl:['A M 0.1','S M 0.2']},
  {title:'Network 10 : Outlet Pump — مضخة سحب المياه Y2',ref:'ص 137 · 139 · 143',
   read:'Y2 تعمل إذا: الماء فوق المستوى الأدنى (LS2 = 1) <b>و</b> M0.2 = 1 <b>و</b> قيمة العداد MW1 تساوي 0 (المقارنة ==I).',
   stl:['A I 1.2','A M 0.2','A(','L MW 1','L 0','==I',')','= Q 5.2']},
  {title:'Network 11 : إلغاء علَم التفريغ M0.2'+(o.fixM02?' — مُعدَّل':''),ref:o.fixM02?'مصحح (الأصل ص 137 · 140 · 143)':'ص 137 · 140 · 143',
   read:o.fixM02?'<b>تعديل:</b> M0.2 يُلغى بـ S0 <b>أو</b> عند عمل Y1 (بداية غسلة جديدة)، فلا تعمل Y2 أثناء التعبئة.':'الضغط على S0 يلغي (R) العلم M0.2. لا يوجد شيء آخر يلغيه.',
   stl:o.fixM02?['O I 0.0','O Q 5.1','R M 0.2']:['A I 0.0','R M 0.2']}
  ];
}

/* ================= headless fast run (used by theory widgets) ================= */
const FILL=0.14,DRAIN=0.11,HI=0.9,LO=0.1;
function runFast(prog,tvSec,maxT){
  const P=B.createPLC(prog);const dt=0.1;let lvl=0,t=0;const ev=[];let p41=0,p42=0,p51=0,p52=0,t41=0,t42=0;let full=0,blips=0,rights=0,lefts=0,both=0;
  const mw=()=>P.words.MW1||0;
  function step(){P.set('I1.1',lvl>=HI?1:0);P.set('I1.2',lvl>LO?1:0);P.scan(dt);
    const q41=P.get('Q4.1'),q42=P.get('Q4.2'),q51=P.get('Q5.1'),q52=P.get('Q5.2');if(q41&&q42)both++;
    lvl=clamp(lvl+((q51?FILL:0)-(q52?DRAIN:0))*dt,0,1);t+=dt;
    if(q51&&!p51)ev.push({t,k:'Y1',m:mw()});
    if(q41&&!p41){t41=t;rights++;ev.push({t,k:'R',m:mw(),n:rights})}
    if(!q41&&p41&&t-t41<0.5){blips++;const lr=ev.filter(e=>e.k==='R').pop();if(lr)lr.blip=1}
    if(q42&&!p42){t42=t;lefts++;ev.push({t,k:'L',m:mw(),n:lefts})}
    if(!q42&&p42&&t-t42>=0.9*tvSec){full++;ev.push({t,k:'F',m:mw(),n:full})}
    if(q52&&!p52)ev.push({t,k:'Y2',m:mw()});
    if(!q52&&p52)ev.push({t,k:'E',m:mw()});
    p41=q41;p42=q42;p51=q51;p52=q52}
  P.set('I0.1',1);for(let i=0;i<3;i++)step();P.set('I0.1',0);
  while(t<maxT){step();if(t>5&&lvl<=LO&&!P.get('Q5.1')&&!P.get('Q5.2')&&!P.get('Q4.1')&&!P.get('Q4.2'))break}
  return {ev,full,blips,rights,lefts,both,T:t};
}
const fmtMS=s=>{s=Math.round(s);const m=Math.floor(s/60),x=s%60;return m?`${m} د ${x} ث`:`${x} ث`};

/* ================= the washing machine drawing ================= */
const yOf=l=>256-l*200;
function machineSVG(o){
  // o: {Y1,Y2,K1,K2,LS1,LS2,S0,S1,lvl,fig}
  const on=v=>v?'var(--on)':'var(--muted)';
  const tub=`<rect x="120" y="48" width="220" height="212" rx="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.5"/>`;
  const wy=yOf(o.lvl||0);
  let s=`<svg viewBox="0 0 540 330" role="img" aria-label="الغسالة الكهربائية">`;
  // buttons
  s+=`<rect x="150" y="6" width="160" height="34" rx="8" fill="var(--surface)" stroke="var(--line)"/>`;
  s+=`<circle cx="190" cy="23" r="11" fill="${o.S0?'#e5463b':'#9c3a33'}" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(212,28,'S0','','start');
  s+=`<circle cx="258" cy="23" r="11" fill="${o.S1?'#3fd07a':'#2a7a4c'}" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(280,28,'S1','','start');
  s+=tub;
  s+=`<rect id="u8w" x="122.5" y="${wy}" width="215" height="${Math.max(0,257.5-wy)}" fill="var(--blue)" opacity=".32"/>`;
  s+=`<path id="u8ws" d="M122.5 ${wy}H337.5" stroke="var(--blue)" stroke-width="2" ${o.lvl>0.005?'':'opacity="0"'}/>`;
  // drum
  s+=`<g id="u8drum"><circle cx="230" cy="168" r="62" fill="none" stroke="var(--fg)" stroke-width="2" stroke-dasharray="3 5"/>`;
  for(let i=0;i<3;i++){const a=i*2*Math.PI/3;s+=`<path d="M${230+40*Math.cos(a)} ${168+40*Math.sin(a)}L${230+60*Math.cos(a)} ${168+60*Math.sin(a)}" stroke="var(--blue-ink)" stroke-width="7" stroke-linecap="round"/>`}
  s+=`<circle cx="230" cy="168" r="9" fill="var(--fg)"/></g>`;
  // motor
  const mot=o.K1||o.K2;
  s+=`<path d="M230 230V284" stroke="var(--fg)" stroke-width="3"/>`;
  s+=`<circle cx="230" cy="300" r="20" class="coil ${mot?'on':''}"/>`+S.t(230,305,'M1');
  if(o.fig){s+=`<path d="M185 300a45 18 0 0 1 20 -14" fill="none" stroke="var(--fg)" stroke-width="1.6" marker-end="url(#u8ar)"/><path d="M275 300a45 18 0 0 0 -20 -14" fill="none" stroke="var(--fg)" stroke-width="1.6" marker-end="url(#u8ar)"/>`}
  else{if(o.K1)s+=`<text class="txt ar" x="300" y="306" text-anchor="end" fill="var(--on)">K1 ⟳ يمين</text>`;if(o.K2)s+=`<text class="txt ar" x="160" y="306" text-anchor="start" fill="var(--stop)">⟲ يسار K2</text>`}
  // level switches (left wall)
  [[HI,'LS1','I1.1',o.LS1,'مفتاح المستوى الأعلى'],[LO,'LS2','I1.2',o.LS2,'مفتاح المستوى الأدنى']].forEach(([l,n,a,v,ar])=>{const y=yOf(l);
    s+=`<path d="M120 ${y}H96" stroke="var(--fg)" stroke-width="2"/><rect x="70" y="${y-11}" width="26" height="22" rx="4" fill="${v?'var(--on-soft)':'var(--surface)'}" stroke="${on(v)}" stroke-width="2"/>`;
    s+=`<circle cx="134" cy="${y}" r="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/><path d="M126 ${y}H120" stroke="var(--fg)" stroke-width="1.5"/>`;
    s+=S.t(64,y+5,n,'','end')+S.t(64,y+19,(o.fig?'':a+'='+(v?1:0)),'m','end');
    s+=`<text class="txt ar" x="4" y="${y-17}" text-anchor="end" font-size="10.5">${ar}</text>`});
  // Y1 inlet (top right)
  const f1=o.Y1?'var(--blue)':'var(--wire)';
  s+=`<path d="M530 64H352V${o.Y1?70:64}" fill="none" stroke="var(--fg)" stroke-width="10" stroke-linejoin="round" opacity=".18"/><path d="M530 64H340" stroke="${f1}" stroke-width="4"/>`;
  s+=`<path id="u8f1" d="M530 64H340" stroke="var(--surface)" stroke-width="2" stroke-dasharray="6 10" opacity="${o.Y1?1:0}"/>`;
  s+=`<path id="u8s1" d="M336 64V${wy}" stroke="var(--blue)" stroke-width="4" stroke-dasharray="5 6" opacity="${o.Y1?.9:0}"/>`;
  s+=`<path d="M420 54L420 74L444 54L444 74Z" fill="${o.Y1?'var(--on-soft)':'var(--surface)'}" stroke="var(--fg)" stroke-width="1.8"/><path d="M432 64V44" stroke="var(--fg)" stroke-width="1.8"/>`;
  s+=`<rect x="417" y="24" width="30" height="20" rx="3" class="coil ${o.Y1?'on':''}"/>`+S.t(432,38,'Y1')+S.t(456,38,'Q5.1','m','start');
  s+=`<text class="txt ar" x="530" y="96" text-anchor="start" font-size="11.5">مضخة دفع المياه للداخل</text>`;
  // Y2 outlet (bottom right)
  const f2=o.Y2?'var(--blue)':'var(--wire)';
  s+=`<path d="M340 246H530" stroke="${f2}" stroke-width="4"/><path id="u8f2" d="M340 246H530" stroke="var(--surface)" stroke-width="2" stroke-dasharray="6 10" opacity="${o.Y2?1:0}"/>`;
  s+=`<path d="M420 236L420 256L444 236L444 256Z" fill="${o.Y2?'var(--on-soft)':'var(--surface)'}" stroke="var(--fg)" stroke-width="1.8"/><path d="M432 256V272" stroke="var(--fg)" stroke-width="1.8"/>`;
  s+=`<rect x="417" y="272" width="30" height="20" rx="3" class="coil ${o.Y2?'on':''}"/>`+S.t(432,286,'Y2')+S.t(456,286,'Q5.2','m','start');
  s+=`<text class="txt ar" x="530" y="226" text-anchor="start" font-size="11.5">مضخة سحب المياه للخارج</text>`;
  if(o.fig)s+=`<text class="txt ar" x="230" y="44" text-anchor="middle" font-size="12" opacity="0">.</text><text class="txt ar" x="230" y="104" text-anchor="middle" font-size="13">الغسالة الكهربائية</text>`;
  s+=`<defs><marker id="u8ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--fg)"/></marker></defs>`;
  return s+'</svg>';
}
function remain(tm){if(!tm||!tm.tv)return '—';if(tm.run)return B.fmtTime(Math.max(0,tm.tv-tm.el));return tm.q?'انتهى (Q=1)':B.fmtTime(tm.tv)}

/* ================= plant ================= */
function washPlant(){
  return {
    title:'الغسالة الكهربائية',
    init:()=>({lvl:0,ang:0,w:0,rights:0,lefts:0,full:0,blips:0,p41:0,p42:0,p51:0,t41:0,t42:0,lvlP:0}),
    step(dt,st,p){
      const q41=st.Q('Q4.1'),q42=st.Q('Q4.2'),q51=st.Q('Q5.1'),q52=st.Q('Q5.2');
      p.lvl=clamp(p.lvl+((q51?FILL:0)-(q52?DRAIN:0))*dt,0,1);p.lvlP=p.lvl*100;
      const target=q41?1:q42?-1:0;p.w+=(target-p.w)*(1-Math.exp(-dt/0.35));p.ang=(p.ang+p.w*200*dt)%360;
      if(q51&&!p.p51){p.rights=0;p.lefts=0;p.full=0;p.blips=0}
      if(q41&&!p.p41){p.t41=st.t;p.rights++}
      if(!q41&&p.p41&&st.t-p.t41<0.5)p.blips++;
      if(q42&&!p.p42){p.t42=st.t;p.lefts++}
      const tv=(st.T('T2').tv)||60;
      if(!q42&&p.p42&&st.t-p.t42>=0.9*tv)p.full++;
      p.p41=q41;p.p42=q42;p.p51=q51;
    },
    sig:p=>[p.full,p.blips,p.rights,p.lefts].join(','),
    label:p=>`المنسوب ${Math.round(p.lvl*100)}%`,
    render(el,st,p){
      const o={Y1:st.Q('Q5.1'),Y2:st.Q('Q5.2'),K1:st.Q('Q4.1'),K2:st.Q('Q4.2'),LS1:st.I('I1.1'),LS2:st.I('I1.2'),S0:st.btn('S0'),S1:st.btn('S1'),lvl:p.lvl};
      el.innerHTML=`<div class="svgbox" style="margin-top:0;max-width:640px;margin-inline:auto">${machineSVG(o)}</div>
       <div class="facts">
        <div class="fact"><span>T1 الزمن المتبقي (يمين)</span><b id="u8T1">—</b></div>
        <div class="fact"><span>T2 الزمن المتبقي (يسار)</span><b id="u8T2">—</b></div>
        <div class="fact"><span>العداد C1 / MW1</span><b id="u8C">0</b></div>
        <div class="fact"><span>M0.1 · M0.2</span><b id="u8M">0 · 0</b></div>
        <div class="fact"><span>مرات التشغيل يمين · يسار</span><b id="u8RL">0 · 0</b></div>
        <div class="fact"><span>دورات كاملة (يمين+يسار)</span><b id="u8F">0</b></div>
       </div>
       <p class="sub">الدورة الكاملة = تشغيل يمين بزمنه كاملاً ثم يسار بزمنه كاملاً. ${p.blips?`<b style="color:var(--live)">لوحظ تشغيل يمين قصير جداً (ومضة) ${p.blips} مرة.</b>`:''}</p>`;
    },
    frame(el,st,p){if(!el)return;const q=id=>el.querySelector('#'+id);
      const w=q('u8w');if(w){const y=yOf(p.lvl);w.setAttribute('y',y.toFixed(1));w.setAttribute('height',Math.max(0,257.5-y).toFixed(1));
        const ws=q('u8ws');ws.setAttribute('d',`M122.5 ${y.toFixed(1)}H337.5`);ws.setAttribute('opacity',p.lvl>0.005?1:0);
        const s1=q('u8s1');if(s1){s1.setAttribute('d',`M336 64V${y.toFixed(1)}`);s1.style.strokeDashoffset=(-st.t*40).toFixed(1)}}
      const d=q('u8drum');if(d)d.setAttribute('transform',`rotate(${p.ang.toFixed(1)} 230 168)`);
      ['u8f1','u8f2'].forEach(id=>{const f=q(id);if(f)f.style.strokeDashoffset=(st.t*40).toFixed(1)});
      const set=(id,v)=>{const e=q(id);if(e&&e.textContent!==v)e.textContent=v};
      set('u8T1',remain(st.T('T1')));set('u8T2',remain(st.T('T2')));
      set('u8C',`${st.C('C1').v} / ${st.plc.words.MW1||0}`);set('u8M',`${st.M('M0.1')} · ${st.M('M0.2')}`);
      set('u8RL',`${p.rights} · ${p.lefts}`);set('u8F',String(p.full));
    },
    readouts:[
      {l:'الحالة',chip:(p,st)=>st.Q('Q5.1')?['تعبئة Y1','star']:st.Q('Q4.1')?['غسيل يمين K1','run']:st.Q('Q4.2')?['غسيل يسار K2','rev']:st.Q('Q5.2')?['تفريغ Y2','warn']:['متوقفة','']},
      {l:'المنسوب',v:p=>Math.round(p.lvl*100)+'%'},
      {l:'MW1',v:(p,st)=>String(st.plc.words.MW1||0)},
      {l:'دورات كاملة',v:p=>String(p.full)}
    ],
    chart:{key:'lvlP',ymax:100,ticks:[0,10,50,90,100],unit:'%',span:40,refs:[{v:90,color:'--on'},{v:10,color:'--live'}],label:'منسوب الماء مع الزمن (آخر 40 ثانية)',
      legend:'<span><i style="background:var(--blue)"></i>منسوب الماء</span><span><i style="background:var(--on)"></i>LS1 المستوى الأعلى</span><span><i style="background:var(--live)"></i>LS2 المستوى الأدنى</span>'}
  };
}

/* ================= shared tables / inputs ================= */
const IO8=[
 {sym:'S0',desc:'مفتاح الفصل العام وهو مفتاح التشغيل الأساسي.',addr:'I0.0'},
 {sym:'S1',desc:'مفتاح التشغيل',addr:'I0.1'},
 {sym:'LS1',desc:'مفتاح تحديد المستوى الأعلى',addr:'I1.1'},
 {sym:'LS2',desc:'مفتاح تحديد المستوى الأدنى',addr:'I1.2'},
 {sym:'K1',desc:'خرج المتمم لتشغيل المحرك يميناً.',addr:'Q4.1'},
 {sym:'K2',desc:'خرج المتمم لتشغيل المحرك يساراً.',addr:'Q4.2'},
 {sym:'Y1',desc:'مضخة دفع المياه للداخل',addr:'Q5.1'},
 {sym:'Y2',desc:'مضخة سحب المياه للخارج',addr:'Q5.2'},
 {sym:'',desc:'المزمن الأول لتحديد زمن الدوران يميناً.',addr:'T1'},
 {sym:'',desc:'المزمن الثاني لتحديد زمن الدوران يساراً.',addr:'T2'},
 {sym:'',desc:'خرج العداد على شكل دالة تخزين.',addr:'M0.1'}
];
const IN8=[
 {id:'S0',addr:'I0.0',type:'push',color:'red',label:'فصل عام / إيقاف'},
 {id:'S1',addr:'I0.1',type:'push',color:'green',label:'تشغيل'},
 {id:'LS1',addr:'I1.1',type:'sensor',from:st=>st.plant.lvl>=HI},
 {id:'LS2',addr:'I1.2',type:'sensor',from:st=>st.plant.lvl>LO}
];
const EXTRA_TABLE=`<div class="tablebox"><table class="tt"><thead><tr><th>العنصر</th><th>العمل في البرنامج</th><th>أين يظهر</th></tr></thead><tbody>
 <tr><td class="mono">T3</td><td>مزمن نبضة (S_PULSE) مدته 1 ثانية يبدأ مع K2 ويلغي T1</td><td>Network 6 و 3</td></tr>
 <tr><td class="mono">T4</td><td>مزمن نبضة (S_PULSE) مدته 1 ثانية يبدأ مع K1 ويلغي T2</td><td>Network 7 و 5</td></tr>
 <tr><td class="mono">C1</td><td>عداد تنازلي (S_CD)، القيمة المضبوطة C#5</td><td>Network 8</td></tr>
 <tr><td class="mono">MW1</td><td>كلمة ذاكرة تُنقل إليها القيمة الحالية للعداد</td><td>Network 8 و 10</td></tr>
 <tr><td class="mono">M0.2</td><td>علَم ذاكرة يُثبَّت أثناء الغسيل ويسمح بالتفريغ</td><td>Network 9 و 10 و 11</td></tr></tbody></table></div>`;

/* variants: book/fixed × book time/short time */
const TVB='S5T#1M',TVF='S5T#5S';
const NOTE_TIME='<b>زمن الكتاب (1 دقيقة)</b> = البرنامج كما طُبع. <b>زمن مختصر للعرض (5 ثوانٍ)</b> = البرنامج نفسه بعد تغيير <span class="ltr">S5T#1M</span> إلى <span class="ltr">S5T#5S</span> في Network 3 و 5 فقط، لتشاهد الدورة كاملة في دقيقتين تقريباً بدل نحو 9 دقائق (ليس من الكتاب).';
const NOTE_BOOK='البرنامج كما في ص 141–143: العداد مضبوط على <span class="ltr">C#5</span> وينقص مع كل بداية لـ K1، فيصل إلى الصفر عند بداية التشغيل الخامس يميناً: الناتج <b>4 دورات كاملة</b> ثم ومضة قصيرة يميناً، لا 10 كما في نص ص 133 ولا 5. وأيضاً M0.2 لا يُلغى إلا بـ S0.';
const NOTE_FIX='<b>التصحيح (ليس من الكتاب):</b> (1) في Network 8 صار العداد ينقص عند <b>انتهاء T2</b> (<span class="ltr">A T 2</span> بدل <span class="ltr">A Q 4.1</span>) أي عند نهاية كل دورة كاملة، وضُبط على <span class="ltr">C#10</span> ليطابق «عشر دورات» في ص 133. (2) في Network 11 صار M0.2 يُلغى أيضاً عند عمل Y1 (<span class="ltr">O Q 5.1</span>) فلا تعمل Y2 أثناء تعبئة غسلة جديدة.';
function mainVariants(def){
  return {default:def||'book',note:NOTE_TIME,
   'book':{label:'كما في الكتاب · زمن الكتاب (1 دقيقة)',program:washProgram({tv:TVB,pv:'C#5'}),note:NOTE_BOOK},
   'book-fast':{label:'كما في الكتاب · زمن مختصر للعرض (5 ثوانٍ)',program:washProgram({tv:TVF,pv:'C#5'}),note:NOTE_BOOK+' <b>الزمن هنا مختصر للعرض: 5 ثوانٍ بدل دقيقة.</b>'},
   'fixed':{label:'المصحح · زمن الكتاب (1 دقيقة)',program:washProgram({tv:TVB,pv:'C#10',fixCount:true,fixM02:true}),note:NOTE_FIX},
   'fixed-fast':{label:'المصحح · زمن مختصر للعرض (5 ثوانٍ)',program:washProgram({tv:TVF,pv:'C#10',fixCount:true,fixM02:true}),note:NOTE_FIX+' <b>الزمن هنا مختصر للعرض: 5 ثوانٍ بدل دقيقة.</b>'}};
}

/* ---------- static figures ---------- */
const figMachine=()=>`<div class="svgbox" style="max-width:640px;margin-inline:auto">${machineSVG({fig:1,lvl:0.6})}</div>`;
function timingSVG(){ // one cycle handover, 1 unit = T (60 s)
  const rows=[['Q4.1 (K1)',[[0,1],[2,2.6]]],['T1 (Q)',[[1,1.04]]],['T4',[[0,0.04],[2,2.04]]],['Q4.2 (K2)',[[1,2]]],['T3',[[1,1.04]]],['T2 (Q)',[[2,2.04]]]];
  const x0=110,wU=190,h=40;let s=`<svg viewBox="0 0 ${x0+wU*2.6+30} ${rows.length*h+50}" role="img" aria-label="مخطط زمني">`;
  rows.forEach(([n,segs],i)=>{const yb=20+i*h+28,yt=yb-20;s+=S.t(x0-10,yb-6,n,'','end')+`<path d="M${x0} ${yb}H${x0+wU*2.6}" stroke="var(--line)"/>`;
    let d=`M${x0} ${yb}`;segs.forEach(([a,b])=>{const xa=x0+a*wU,xb=x0+Math.max(b*wU,a*wU+8);d+=`H${xa}V${yt}H${xb}V${yb}`});d+=`H${x0+wU*2.6}`;
    s+=`<path d="${d}" fill="none" stroke="${/T3|T4/.test(n)?'var(--live)':/T1|T2/.test(n)?'var(--blue)':'var(--on)'}" stroke-width="2.4"/>`});
  const yb=20+rows.length*h+8;[0,1,2].forEach(k=>{s+=`<path d="M${x0+k*wU} 14V${yb}" stroke="var(--muted)" stroke-dasharray="3 4"/>`+S.t(x0+k*wU,yb+16,k===0?'0':k+'×T','m')});
  return s+'</svg>';
}

/* ---------- quick-check helpers for widgets ---------- */
function evTable(r){
  const name={Y1:'تبدأ التعبئة (Y1)',R:'بداية تشغيل يمين K1',L:'بداية تشغيل يسار K2',F:'اكتملت دورة (يمين+يسار)',Y2:'يبدأ التفريغ (Y2)',E:'انتهى التفريغ عند LS2'};
  return `<div class="tablebox"><table class="tt"><thead><tr><th>#</th><th>الحدث</th><th>MW1 بعده</th></tr></thead><tbody>`+
   r.ev.map((e,i)=>`<tr${e.blip?' style="background:var(--live-soft)"':''}><td>${i+1}</td><td>${name[e.k]}${e.n&&e.k!=='F'?' رقم '+e.n:''}${e.k==='F'?' رقم '+e.n:''}${e.blip?' <b>← ومضة قصيرة فقط</b>':''}</td><td class="mono">${e.m}</td></tr>`).join('')+`</tbody></table></div>`;
}

/* =================== Lesson 8.1 =================== */
B.lesson({
 id:'u8-l1',unit:8,order:1,pages:'131–134',
 title:'فكرة عمل الغسالة الكهربائية وجدول المداخل والمخارج',
 summary:'كيف تعمل الغسالة: تعبئة بالمضخة Y1 حتى LS1، ثم دوران المحرك يميناً ويساراً بعدد دورات يحدده العداد، ثم التفريغ بالمضخة Y2 حتى LS2؛ وجدول توزيع المداخل والمخارج على الـ PLC.',
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 131',html:`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
    <p><b>الأهداف كما في الكتاب:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة على:</p><ol><li>أن يعرف المتدرب طريقة عمل الغسالة الكهربائية.</li><li>أن يكتب المتدرب برنامج تشغيل الغسالة الكهربائية.</li></ol>
    <p><b>مستوى الأداء المطلوب:</b> إتقان الجدارة بنسبة 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم. <b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`},
  {err:'رأس صفحة الجدارة (ص 131) مطبوع عليه «الوحدة التاسعة — التطبيق على المصعد الكهربائي باستخدام مفاتيح نهاية المشوار» وهو منسوخ من الوحدة التالية؛ الصفحة تخص وحدة الغسالة. وعنوان الوحدة على الغلاف «التطبيق على الغسالة الكهربائية» وفي الداخل (ص 132) «تطبيق على الغسالة الكهربائية باستخدام مفاتيح تحديد المستوى».'},
  {h:'محتويات الوحدة',ref:'ص 132',html:`<ul><li><b>أولاً:</b> فكرة عمل الغسالة الكهربائية.</li><li><b>ثانياً:</b> كتابة برنامج عمل الغسالة الكهربائية باستخدام (PLC) باللغات الثلاثة (LAD, FBD, STL).</li></ul>`},
  {h:'أولاً: فكرة عمل الغسالة الكهربائية',ref:'ص 133',html:`<ol>
    <li>عند تشغيل الغسالة عن طريق <b>S1</b> تعمل المضخة <b>Y1</b> لدفع المياه إلى داخل حوض الغسالة حتى يصل منسوب المياه إلى الحد الأعلى الذي يتحدد بمفتاح تحديد المستوى <b>LS1</b>.</li>
    <li>وبعد ذلك يعمل المحرك الكهربائي باتجاه اليمين <b>K1</b> دقيقة، ثم يعكس اتجاه الدوران ويعمل في الاتجاه الآخر <b>K2</b> دقيقة أخرى. ويستمر عمل المحرك بهذه الطريقة إلى أن يعد العداد <b>عشر دورات</b>، وهكذا في كل مرحلة تشغيل جديدة.</li>
    <li>وبانتهاء دورة الغسيل تقوم طلمبة سحب المياه <b>Y2</b> بالعمل لتفريغ الحوض من المياه، وتقف عن العمل بوصول المياه للمستوى الأدنى <b>LS2</b>.</li>
    <li>ويتم إيقاف عمل الغسالة عن طريق <b>S0</b>.</li></ol><p>«والشكل ( ٢- ٧ ) يوضح فكرة العمل».</p>`},
  {fig:'( ٢- ٧ )',ref:'ص 133',caption:'الغسالة الكهربائية: الضاغطان S0 و S1، مفتاحا المستوى LS1 و LS2، المحرك M1 بالاتجاهين، ومضختا الدخول Y1 والخروج Y2.',draw:figMachine},
  {err:'رقم الشكل مطبوع «( ٢- ٧ )» ولا يتبع رقم الوحدة (8). نقلناه كما هو.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مفتاح المستوى (Level switch) عوّامة تغيّر تلامسها عندما يصل الماء إليها. في هذه المحاكاة: LS1 يعطي 1 عندما يصل الماء إلى المستوى الأعلى، و LS2 يعطي 1 <b>ما دام الماء فوق المستوى الأدنى</b>؛ هذا ما يفترضه البرنامج في Network 10 حتى تتوقف Y2 عند المستوى الأدنى.'},
  {h:'جدول توزيع المداخل والمخارج',ref:'ص 134',html:'<p>«ثانياً: كتابة برنامج عمل الغسالة الكهربائية باستخدام (PLC) باللغات الثلاث». الجدول كما طُبع:</p>'},
  {draw:'io',caption:'نقاط الدخل والخرج والترميز في (PLC)',ref:'ص 134'},
  {err:'(1) عنوان القسم في ص 134 يذكر «ST» بدل «STL». (2) الجدول ناقص: البرنامج يستخدم أيضاً T3 و T4 و C1 و M0.2 و MW1 وهي غير مذكورة (أكملناها في الجدول التالي). (3) وصف S0 «مفتاح الفصل العام وهو مفتاح التشغيل الأساسي» ملتبس: في البرنامج S0 زر إيقاف يعطي 1 عند الضغط (يُكتب AN I 0.0 في دوائر الخرج، و O I 0.0 لتصفير المزمنات والعداد و M0.2).'},
  {html:'<p><b>عناصر مستخدمة في البرنامج وغير موجودة في جدول الكتاب (أضفناها من البرنامج، ليست من الجدول):</b></p>'+EXTRA_TABLE},
  {h:'طابق كل عنصر بعنوانه',html:'<p>تمرين سريع (ليس من الكتاب): اختر العنوان الصحيح لكل عنصر حسب جدول ص 134.</p>'},
  {widget:(el)=>{const items=[['S0','I0.0'],['S1','I0.1'],['LS1','I1.1'],['LS2','I1.2'],['K1','Q4.1'],['K2','Q4.2'],['Y1','Q5.1'],['Y2','Q5.2']];const addrs=items.map(x=>x[1]).slice().sort();
    const ans={};const draw=(chk)=>{el.innerHTML=`<div class="fig"><div class="tablebox"><table class="tt"><thead><tr><th>العنصر</th><th>العنوان</th><th></th></tr></thead><tbody>${items.map(([s,a])=>`<tr><td class="mono">${s}</td><td><select data-s="${s}" aria-label="عنوان ${s}"><option value="">—</option>${addrs.map(x=>`<option ${ans[s]===x?'selected':''}>${x}</option>`).join('')}</select></td><td>${chk?(ans[s]===a?'<b style="color:var(--on)">✓</b>':`<b style="color:var(--stop)">✗</b> <span class="mono">${a}</span>`):''}</td></tr>`).join('')}</tbody></table></div>
      <p style="margin-top:8px"><button class="btn primary" data-chk>تحقق</button> <button class="btn" data-clr>مسح</button> ${chk?`<b>${items.filter(([s,a])=>ans[s]===a).length} / ${items.length}</b>`:''}</p></div>`;
      el.querySelectorAll('select').forEach(x=>x.onchange=()=>{ans[x.dataset.s]=x.value});
      el.querySelector('[data-chk]').onclick=()=>draw(true);el.querySelector('[data-clr]').onclick=()=>{for(const k in ans)delete ans[k];draw(false)}};draw(false)}},
  {note:'في تبويب «المختبر» تعمل الغسالة ببرنامج الكتاب كاملاً (11 Network). اختر «زمن مختصر للعرض» لتشاهد الغسلة كاملة بسرعة، أو «زمن الكتاب» لتشاهدها بالدقيقة الحقيقية.'}
 ],
 io:IO8,inputs:IN8,variants:mainVariants('book-fast'),plant:washPlant(),
 plcNote:'S0 في هذا البرنامج زر إيقاف يعطي 1 عند الضغط (AN I 0.0 في دوائر الخرج). مفتاحا المستوى LS1 و LS2 تحركهما المحاكاة تلقائياً حسب منسوب الماء.',
 steps:[
  {t:'اختر نسخة البرنامج',x:'فوق المختبر اختر «كما في الكتاب · زمن مختصر للعرض (5 ثوانٍ)» لتشاهد الغسلة كاملة في نحو دقيقة، أو «زمن الكتاب» للدقيقة الحقيقية.'},
  {t:'شغّل الغسالة',x:'اضغط S1. تعمل المضخة Y1 (Q5.1) ويرتفع الماء في الحوض.',done:s=>s.Q('Q5.1')},
  {t:'الماء يصل إلى LS1',x:'عندما يصل الماء إلى المستوى الأعلى يصبح LS1 = 1 فتتوقف Y1 ويبدأ المحرك يميناً K1.',done:s=>s.I('I1.1')&&s.Q('Q4.1')},
  {t:'عكس الاتجاه',x:'راقب «T1 الزمن المتبقي». عند انتهائه يفصل K1 ويعمل K2 يساراً.',done:s=>s.Q('Q4.2')},
  {t:'الدورة تتكرر',x:'بعد انتهاء T2 يعود المحرك يميناً. لاحظ أن MW1 ينقص واحداً مع كل بداية يمين.',done:s=>s.plant.full>=1&&s.Q('Q4.1')},
  {t:'انتهاء الغسيل والتفريغ',x:'عندما يصل العداد إلى 0 يتوقف المحرك وتعمل Y2 (Q5.2). كم دورة كاملة عُدّت؟ قارنها بـ «عشر دورات» في نص ص 133.',done:s=>s.Q('Q5.2')},
  {t:'التوقف عند LS2',x:'تتوقف Y2 عندما ينزل الماء تحت المستوى الأدنى (LS2 = 0).',done:s=>!s.I('I1.2')&&s.M('M0.2')&&!s.Q('Q5.2')},
  {t:'الإيقاف بـ S0',x:'اضغط S0. يُلغى العلم M0.2 فتصبح الغسالة جاهزة لغسلة جديدة.',done:s=>!s.M('M0.2')&&!s.btn('S0')},
  {t:'جرّب الإيقاف أثناء الغسيل',x:'شغّل غسلة جديدة ثم اضغط S0 والمحرك يدور: يتوقف المحرك ويُصفَّر العداد، لكن الماء يبقى في الحوض لأن Y2 تحتاج M0.2.'}
 ],
 quiz:[
  {q:'ما الذي يشغّل المضخة Y1 في بداية الغسيل؟',o:['المفتاح LS1','الضاغط S1','الضاغط S0','العداد C1'],c:1,e:'«عند تشغيل الغسالة عن طريق S1 تعمل المضخة Y1» (ص 133).'},
  {q:'متى تتوقف المضخة Y1 عن دفع الماء؟',o:['بعد دقيقة','عند وصول الماء إلى LS1','عند وصول الماء إلى LS2','عند الضغط على S1 مرة أخرى'],c:1,e:'LS1 هو مفتاح تحديد المستوى الأعلى، وفي Network 1 يوجد AN I 1.1.'},
  {q:'ما عنوان مفتاح تحديد المستوى الأدنى LS2 في الـ PLC؟',o:['I1.1','Q5.2','I1.2','I0.1'],c:2,e:'من جدول ص 134: LS2 = I1.2.'},
  {q:'أي مخرج يشغّل المحرك يساراً؟',o:['Q4.1 (K1)','Q4.2 (K2)','Q5.1 (Y1)','Q5.2 (Y2)'],c:1,e:'K2 = Q4.2 «خرج المتمم لتشغيل المحرك يساراً».'},
  {q:'كم مدة الدوران في كل اتجاه حسب الكتاب؟',o:['30 ثانية','5 ثوانٍ','دقيقة واحدة','عشر دقائق'],c:2,e:'ص 133: «يمين K1 دقيقة ثم ... K2 دقيقة أخرى»، وفي البرنامج S5T#1M.'},
  {q:'ما الذي يشغّل مضخة السحب Y2؟',o:['الضغط على S0','انتهاء دورات الغسيل','وصول الماء إلى LS1','الضغط على S1'],c:1,e:'«بانتهاء دورة الغسيل تقوم طلمبة سحب المياه Y2 بالعمل» (ص 133).'},
  {q:'النص يقول «عشر دورات» والعداد في البرنامج C#5. كم دورة كاملة تعطيها نسخة الكتاب فعلاً في المحاكاة؟',o:['10','5','4 ثم ومضة قصيرة يميناً','دورة واحدة'],c:2,e:'العداد ينقص مع كل بداية يمين بما فيها الأولى، فيصل إلى 0 عند بداية التشغيل الخامس يميناً.'},
  {q:'أي عنصر من البرنامج غير موجود في جدول ص 134؟',o:['T1','M0.1','C1','Q5.2'],c:2,e:'الجدول ناقص: C1 و T3 و T4 و M0.2 و MW1 غير مذكورة.'}
 ]
});

/* =================== Lesson 8.2 =================== */
B.lesson({
 id:'u8-l2',unit:8,order:2,pages:'134–136',
 title:'برنامج الغسالة بلغة LAD: التعبئة والدوران يميناً ويساراً (Network 1–7)',
 summary:'مضخة الدخول بتعويض ذاتي، ثم تبادل الاتجاهين يميناً ويساراً بالمزمنين T1 و T2 (تأخير تشغيل محتفظ S_ODTS) ونبضتي T3 و T4 (S_PULSE) اللتين تلغيان المزمنين، مع تعشيق K1 و K2.',
 theory:[
  {h:'١- دائرة (LAD) باستخدام (PLC)',ref:'ص 135',html:'<p>عنوان القسم في الكتاب: «دائرة (LAD) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات والعدادات». لا يوجد رقم شكل للمخططات البرمجية في هذه الوحدة. نشرح هنا الشبكات 1–7 (التعبئة والدوران)، والشبكات 8–11 في الدرس التالي.</p>'},
  {h:'Network 1 : Inlet Pump — مضخة الدخول',ref:'ص 135',html:'<p>تلامس S0 مغلق (I0.0)، ثم [S1 (I0.1) مفتوح ∥ Y1 (Q5.1) مفتوح]، ثم LS1 (I1.1) مغلق، ثم الملف Q5.1. التلامس Q5.1 الموازي لـ S1 هو التعويض الذاتي، و LS1 المغلق يفصل المضخة عند امتلاء الحوض.</p>'},
  {draw:'lad:1',caption:'Network 1 : Inlet Pump',ref:'ص 135'},
  {h:'Network 2 : 1st Direction — الاتجاه الأول (يمين)',ref:'ص 135',html:'<p>S0 مغلق، ثم [T2 ∥ Q4.1 ∥ I1.1] مفتوحة، ثم M0.1 مفتوح، ثم Q4.2 مغلق، ثم T1 مغلق، ثم الملف Q4.1.</p><ul><li><b>I1.1:</b> وصول الماء إلى LS1 يبدأ الدوران يميناً أول مرة.</li><li><b>T2:</b> انتهاء زمن اليسار يعيد المحرك يميناً.</li><li><b>Q4.1:</b> تعويض ذاتي.</li><li><b>M0.1:</b> خرج العداد؛ يمنع الدوران بعد انتهاء العد.</li><li><b>Q4.2 مغلق:</b> تعشيق (لا يعمل الاتجاهان معاً).</li><li><b>T1 مغلق:</b> يفصل K1 عند انتهاء زمن اليمين.</li></ul>'},
  {draw:'lad:2',caption:'Network 2 : 1st Direction',ref:'ص 135'},
  {h:'Network 3 — المزمن T1 (S_ODTS)',ref:'ص 135',html:'<p>مزمن T1 من نوع <b>S_ODTS</b>: مدخل التشغيل S من Q4.1، والزمن <span class="ltr">TV = S5T#1M</span>، ومدخل الإلغاء R من [I0.0 ∥ T3].</p>'},
  {draw:'lad:3',caption:'Network 3 : T1',ref:'ص 135'},
  {note:'<b>توضيح للمتدرب (ليس من نص هذه الوحدة):</b> S_ODTS = تأخير تشغيل <b>محتفظ</b>: يكفي أن يبدأ المدخل S مرة واحدة، فيعد الزمن ثم يصبح خرجه 1 <b>ويبقى 1</b> حتى لو انقطع S، ولا يعود إلى 0 إلا بمدخل الإلغاء R. لهذا احتاج البرنامج نبضتي T3 و T4 لإلغاء T1 و T2.'},
  {h:'Network 4 : 2nd Direction — الاتجاه الثاني (يسار)',ref:'ص 135',html:'<p>S0 مغلق، ثم [T1 ∥ Q4.2] مفتوحان، ثم M0.1 مفتوح، ثم Q4.1 مغلق (تعشيق)، ثم T2 مغلق، ثم الملف Q4.2. انتهاء T1 هو الذي يبدأ الدوران يساراً.</p>'},
  {draw:'lad:4',caption:'Network 4 : 2nd Direction',ref:'ص 135'},
  {h:'Network 5 — المزمن T2 (S_ODTS)',ref:'ص 136',html:'<p>S من Q4.2، <span class="ltr">TV = S5T#1M</span>، و R من [T4 ∥ I0.0].</p>'},
  {draw:'lad:5',caption:'Network 5 : T2',ref:'ص 136'},
  {h:'Network 6 و 7 — نبضتا T3 و T4 (S_PULSE)',ref:'ص 136',html:'<p>T3: مزمن نبضة (S_PULSE) مدخله Q4.2 وزمنه <span class="ltr">S5T#1S</span>، والإلغاء غير موصول. T4: مثله لكن مدخله Q4.1.</p><p>معنى ذلك: لحظة بدء K2 تخرج نبضة T3 لمدة ثانية فتلغي T1، ولحظة بدء K1 تخرج نبضة T4 فتلغي T2.</p>'},
  {draw:'lad:6',caption:'Network 6 : T3',ref:'ص 136'},
  {draw:'lad:7',caption:'Network 7 : T4',ref:'ص 136'},
  {h:'كيف يسلّم كل اتجاه للآخر؟',html:'<p>المخطط الزمني التالي (توضيح من عندنا مبني على البرنامج، ليس من الكتاب) يبين دورة واحدة. T = زمن كل اتجاه (دقيقة في الكتاب):</p>'},
  {fig:'',caption:'<b>توضيح (ليس من الكتاب):</b> K1 يعمل → بعد T يصبح T1 = 1 فيفصل K1 ويعمل K2 → بدء K2 يطلق نبضة T3 فتلغي T1 → بعد T يصبح T2 = 1 فيفصل K2 ويعمل K1 → بدء K1 يطلق T4 فتلغي T2 … وهكذا.',draw:()=>`<div class="svgbox" style="max-width:720px;margin-inline:auto">${timingSVG()}</div>`},
  {note:'<b>لاحظ:</b> I1.1 يبقى 1 طوال الغسيل لأن الماء يبقى عند المستوى الأعلى، ومع ذلك لا يعمل K1 أثناء عمل K2 بسبب التلامس المغلق Q4.2 (التعشيق) في Network 2.'}
 ],
 io:IO8,inputs:IN8,variants:mainVariants('book'),plant:washPlant(),
 plcNote:'في Network 3 و 5 يأتي سطر R بعد SS: إذا كان مدخل الإلغاء 1 يُلغى المزمن في الدورة البرمجية نفسها.',
 steps:[
  {t:'الوضع الابتدائي',x:'الحوض فارغ وكل المخارج مفصولة. اختر «زمن مختصر للعرض» إذا أردت أن ترى التبديل سريعاً.'},
  {t:'Network 1: التعبئة',x:'اضغط S1 ثم اتركه: تبقى Y1 شغالة بالتعويض الذاتي (O Q 5.1).',done:s=>s.Q('Q5.1')&&!s.btn('S1')},
  {t:'Network 1 و 2: LS1',x:'عند وصول الماء إلى LS1 يفتح التلامس المغلق I1.1 في Network 1 فتتوقف Y1، ويغلق التلامس المفتوح I1.1 في Network 2 فيعمل K1.',done:s=>s.Q('Q4.1')},
  {t:'Network 3: T1 يعد',x:'في تبويب «برنامج الـ PLC» راقب T1 وهو يعد الزمن (⏱).',done:s=>s.T('T1').run},
  {t:'Network 4 و 6: التسليم لليسار',x:'عند انتهاء T1 يفصل K1 (AN T 1) ويعمل K2 (O T 1)، ويطلق K2 نبضة T3 التي تلغي T1.',done:s=>s.Q('Q4.2')},
  {t:'Network 5 و 7: العودة لليمين',x:'عند انتهاء T2 يعود K1، ونبضة T4 تلغي T2 فيبدأ يعد من جديد في الدورة التالية.',done:s=>s.plant.rights>=2&&s.Q('Q4.1')},
  {t:'التعشيق',x:'طوال التجربة لاحظ أن K1 و K2 لا يضيئان معاً أبداً (AN Q 4.2 في Network 2 و AN Q 4.1 في Network 4).'},
  {t:'الإيقاف بـ S0',x:'اضغط S0: يفصل K1 و K2 ويُلغى T1 و T2 (O I 0.0 في مدخلي الإلغاء).',done:s=>s.btn('S0')&&!s.Q('Q4.1')&&!s.Q('Q4.2')}
 ],
 quiz:[
  {q:'ما فائدة التلامس Q5.1 الموازي لـ I0.1 في Network 1؟',o:['تعشيق','تعويض ذاتي يبقي Y1 تعمل بعد ترك S1','إيقاف المضخة','عكس الحركة'],c:1,e:'المخرج يغذي نفسه عبر التلامس الموازي.'},
  {q:'أي تلامس يوقف Y1 عند امتلاء الحوض؟',o:['I1.1 مغلق (AN I 1.1)','I1.2 مفتوح','T1 مغلق','M0.1 مفتوح'],c:0,e:'وصول الماء إلى LS1 يجعل I1.1 = 1 فيفتح التلامس المغلق.'},
  {q:'ما نوع المزمن T1 في Network 3؟',o:['S_PULSE','S_ODT','S_ODTS (تأخير تشغيل محتفظ)','S_OFFDT'],c:2,e:'في الكتاب T1 من نوع S_ODTS، وفي STL الأمر SS T 1.'},
  {q:'ما الذي يلغي المزمن T1 ليعد من جديد في الدورة التالية؟',o:['انتهاء T2','نبضة T3 أو الضغط على S0','نبضة T4','LS2'],c:1,e:'في Network 3 مدخل الإلغاء [I0.0 ∥ T3].'},
  {q:'متى يطلق T3 نبضته؟',o:['لحظة بدء K1','لحظة بدء K2','عند انتهاء T2','عند الضغط على S1'],c:1,e:'Network 6: A Q 4.2 / SP T 3.'},
  {q:'لماذا يوجد Q4.2 مغلق في Network 2؟',o:['للتعويض الذاتي','لتعشيق K1 مع K2 حتى لا يعملا معاً','لبدء T1','لتصفير العداد'],c:1,e:'تشغيل المحرك في الاتجاهين معاً قصر بين الأوجه.'},
  {q:'ما الأمر في STL الذي يحمّل زمن دقيقة في المزمن؟',o:['L S5T#1S','L C#5','L S5T#1M','T MW 1'],c:2,e:'S5T#1M = دقيقة واحدة؛ S5T#1S = ثانية واحدة (للنبضتين T3 و T4).'}
 ]
});

/* =================== Lesson 8.3 =================== */
B.lesson({
 id:'u8-l3',unit:8,order:3,pages:'136–137',
 title:'العداد التنازلي S_CD وتفريغ الحوض (Network 8–11)',
 summary:'العداد C1 يُضبط على C#5 عند وصول الماء إلى LS1 وينقص مع كل بداية يمين، وخرجه M0.1 يسمح بالدوران. عند وصوله إلى الصفر تقارن Network 10 القيمة MW1 بالصفر فتشغّل مضخة السحب Y2 حتى LS2.',
 theory:[
  {h:'Network 8 — العداد C1 (S_CD)',ref:'ص 136',html:'<p>عداد <b>C1</b> من نوع <b>S_CD</b> (عداد تنازلي) بالأطراف التالية كما في الكتاب:</p><ul><li><b>CD</b> ← Q4.1 (كل بداية تشغيل يمين تُنقص العداد واحداً).</li><li><b>S</b> ← I1.1 مع <b><span class="ltr">PV = C#5</span></b> (وصول الماء إلى LS1 يضع في العداد 5).</li><li><b>R</b> ← [I0.0 ∥ Q5.1] (S0 أو عمل مضخة الدخول يصفّر العداد).</li><li><b>CV</b> → MW1 (القيمة الحالية تُكتب في كلمة الذاكرة MW1).</li><li><b>Q</b> → الملف M0.1.</li></ul>'},
  {draw:'lad:8',caption:'Network 8 : C1',ref:'ص 136'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب؛ الوحدة لا تشرح العدادات):</b> خرج العداد Q يساوي 1 ما دامت القيمة أكبر من صفر. لذلك M0.1 = 1 من لحظة الضبط على 5 حتى تصل القيمة إلى 0. والعداد ينقص عند <b>تغيّر</b> مدخل CD من 0 إلى 1 فقط، لا طوال بقائه 1.'},
  {h:'Network 9 — تثبيت علَم التفريغ M0.2',ref:'ص 137',html:'<p>تلامس M0.1 مفتوح ← ملف تثبيت <b>(S) M0.2</b>. ما دام الغسيل جارياً يبقى M0.2 = 1، ولا يعود 0 عند انتهاء العد.</p>'},
  {draw:'lad:9',caption:'Network 9',ref:'ص 137'},
  {h:'Network 10 — مضخة السحب Y2',ref:'ص 137',html:'<p>I1.2 مفتوح ← M0.2 مفتوح ← صندوق مقارنة <b>CMP ==I</b> (IN1 = MW1، IN2 = 0) ← الملف Q5.2. أي أن Y2 تعمل عندما: الماء فوق المستوى الأدنى <b>و</b> الغسيل قد بدأ <b>و</b> العداد = 0. العنوان «Outlet Pump» يظهر في نسخة FBD فقط.</p>'},
  {draw:'lad:10',caption:'Network 10 : Outlet Pump',ref:'ص 137'},
  {h:'Network 11 — إلغاء M0.2',ref:'ص 137',html:'<p>I0.0 مفتوح ← ملف إلغاء <b>(R) M0.2</b>. فقط الضغط على S0 يلغي علَم التفريغ.</p>'},
  {draw:'lad:11',caption:'Network 11',ref:'ص 137'},
  {h:'كم دورة تعطي نسخة الكتاب فعلاً؟',html:'<p>نص ص 133 يقول «إلى أن يعد العداد <b>عشر دورات</b>»، والبرنامج يضبط العداد على <span class="ltr">C#5</span>. لنتتبع ما يحدث فعلاً عند تنفيذ البرنامج كما هو:</p>'},
  {err:'<b>تعارض في عدد الدورات:</b> النص (ص 133) «عشر دورات»، والبرنامج (ص 136، 139، 142) <span class="ltr">C#5</span>، والتمرين (ص 144) يطلب 10 دورات وكأن البرنامج الأصلي ليس 10. والأهم: لأن العداد ينقص مع <b>كل بداية</b> لـ K1 (بما فيها الأولى: 5 ← 4)، يصل إلى 0 عند <b>بداية</b> التشغيل الخامس يميناً فيسقط M0.1 فوراً ويتوقف المحرك. الناتج الفعلي: <b>4 دورات كاملة</b> (يمين + يسار) ثم ومضة يمين لدورة برمجية واحدة، لا 5 ولا 10. جرّب الجدول التالي، وفي المختبر اختر «المصحح» لترى نسخة تعطي 10 دورات.'},
  {widget:(el)=>{let v='book';const draw=()=>{const prog=v==='book'?washProgram({tv:'S5T#5S',pv:'C#5'}):washProgram({tv:'S5T#5S',pv:'C#10',fixCount:true,fixM02:true});const r=runFast(prog,5,600);
     el.innerHTML=`<div class="fig"><div class="seg" role="group"><button data-v="book" aria-pressed="${v==='book'}">كما في الكتاب (C#5)</button><button data-v="fixed" aria-pressed="${v==='fixed'}">المصحح (C#10 عند انتهاء T2)</button></div>
      <div class="facts"><div class="fact"><span>مرات بدء اليمين</span><b>${r.rights}</b></div><div class="fact"><span>مرات بدء اليسار</span><b>${r.lefts}</b></div><div class="fact"><span>دورات كاملة</span><b>${r.full}</b></div><div class="fact"><span>ومضات قصيرة</span><b>${r.blips}</b></div></div>
      ${evTable(r)}<p class="sub">نتيجة تشغيل البرنامج فعلاً على محاكي الـ PLC نفسه (بزمن مختصر 5 ثوانٍ؛ عدد الدورات لا يتغير مع الزمن).</p></div>`;
     el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{v=b.dataset.v;draw()})};draw()}},
  {h:'التصحيح المقترح (ليس من الكتاب)',html:`<p>لكي يعد البرنامج <b>عشر دورات</b> كما يقول النص، غيّرنا سطرين في Network 8:</p>
    <table class="tt"><thead><tr><th>كما في الكتاب</th><th>المصحح</th><th>السبب</th></tr></thead><tbody>
    <tr><td class="mono">A Q 4.1</td><td class="mono">A T 2</td><td>العد عند انتهاء زمن اليسار = نهاية دورة كاملة، بدل بداية اليمين</td></tr>
    <tr><td class="mono">L C#5</td><td class="mono">L C#10</td><td>عشر دورات كما في ص 133</td></tr></tbody></table>
    <p>حل آخر مكافئ: إبقاء <span class="ltr">A Q 4.1</span> وجعل القيمة <span class="ltr">C#11</span>، لأن البداية الأولى لليمين تُنقص العداد قبل أي دورة. اخترنا العد عند نهاية الدورة لأنه أوضح: الرقم المكتوب = عدد الدورات.</p>`},
  {err:'<b>ملاحظة على Network 11:</b> M0.2 لا يُلغى إلا بـ S0. إذا انتهت الغسلة وضغطت S1 مباشرة دون S0، تعمل Y2 مع Y1 أثناء التعبئة (لأن العداد يُصفَّر بعمل Y1 فتصبح MW1 = 0) ويُهدر الماء حتى يصل إلى LS1. وأيضاً ومضة اليمين الأخيرة تشغّل المزمن المحتفظ T1، فإذا انتهى زمنه قبل الغسلة التالية تبدأ الغسلة يساراً. لذلك يجب الضغط على S0 قبل كل غسلة (S0 يلغي T1 و T2 و C1 و M0.2)، أو تعديل Network 11 كما في النسخة «المصححة»: <span class="ltr">O I 0.0 / O Q 5.1 / R M 0.2</span>.'}
 ],
 io:IO8,inputs:IN8,variants:mainVariants('book-fast'),plant:washPlant(),
 plcNote:'راقب في LAD صندوق C1 (CV=…) وصندوق المقارنة في Network 10 (IN1 MW1=…). اختر «المصحح» من الأعلى لترى Network 8 و 11 بعد التعديل.',
 steps:[
  {t:'شغّل واملأ الحوض',x:'اضغط S1. أثناء عمل Y1 يبقى العداد مصفّراً (R من Q5.1).',done:s=>s.Q('Q5.1')},
  {t:'ضبط العداد',x:'عند وصول الماء إلى LS1 يُضبط العداد على 5 (S)، ومع بدء K1 مباشرة ينقص إلى 4. انظر MW1.',done:s=>s.Q('Q4.1')&&(s.plc.words.MW1||0)>0},
  {t:'العد مع كل بداية يمين',x:'في كل مرة يبدأ فيها K1 ينقص MW1 واحداً. انتظر حتى تصل القيمة إلى 2 في نسخة الكتاب.',done:s=>s.plant.rights>=3},
  {t:'الوصول إلى الصفر',x:'عند بداية التشغيل الخامس يميناً يصبح MW1 = 0 فيسقط M0.1 ويتوقف المحرك فوراً (ومضة). في النسخة المصححة يحدث ذلك عند انتهاء T2 للدورة العاشرة.',done:s=>s.M('M0.2')&&!s.M('M0.1')},
  {t:'Network 10: التفريغ',x:'الآن I1.2 = 1 و M0.2 = 1 و MW1 = 0 فتعمل Y2. كم دورة كاملة ظهرت في «دورات كاملة»؟',done:s=>s.Q('Q5.2')},
  {t:'توقف Y2 عند LS2',x:'تتوقف Y2 عندما ينزل الماء تحت LS2. لاحظ أن M0.2 ما زال 1.',done:s=>!s.Q('Q5.2')&&!s.I('I1.2')&&s.M('M0.2')},
  {t:'Network 11: S0',x:'اضغط S0 ليلغى M0.2. (جرّب قبل ذلك أن تضغط S1 مباشرة في نسخة الكتاب: ستعمل Y2 مع Y1.)',done:s=>!s.M('M0.2')&&!s.btn('S0')},
  {t:'قارن بالنسخة المصححة',x:'اختر «المصحح · زمن مختصر للعرض» من الأعلى وكرر الغسلة: ستعد 10 دورات كاملة بلا ومضة.'}
 ],
 quiz:[
  {q:'ما نوع العداد C1 في Network 8؟',o:['S_CU عداد تصاعدي','S_CD عداد تنازلي','S_CUD','مزمن'],c:1,e:'C1 من نوع S_CD، وفي STL الأمر CD C 1.'},
  {q:'ما القيمة التي يُضبط عليها العداد في برنامج الكتاب؟',o:['C#10','C#5','C#1','C#0'],c:1,e:'L C#5 / S C 1، والضبط عند I1.1.'},
  {q:'ماذا يحدث للعداد أثناء عمل مضخة الدخول Y1؟',o:['يزيد','ينقص','يُصفَّر لأن Q5.1 موصول بمدخل R','لا يتأثر'],c:2,e:'مدخل الإلغاء R = [I0.0 ∥ Q5.1].'},
  {q:'أين تُخزَّن القيمة الحالية للعداد لتُقارن في Network 10؟',o:['M0.1','MW1','T1','Q5.2'],c:1,e:'L C 1 / T MW 1، ثم L MW 1 / L 0 / ==I.'},
  {q:'متى تعمل Y2 حسب Network 10؟',o:['عند الضغط على S0','عندما I1.2 = 1 و M0.2 = 1 و MW1 = 0','عندما MW1 = 5','عندما يعمل K1'],c:1,e:'A I 1.2 / A M 0.2 / A(L MW 1, L 0, ==I) / = Q 5.2.'},
  {q:'ما الذي يلغي العلم M0.2 في برنامج الكتاب؟',o:['M0.1','LS2','الضغط على S0 فقط','انتهاء T2'],c:2,e:'Network 11: A I 0.0 / R M 0.2.'},
  {q:'لماذا تعطي نسخة الكتاب 4 دورات كاملة فقط مع أن العداد على 5؟',o:['لأن المزمن خاطئ','لأن البداية الأولى لـ K1 تُنقص العداد أيضاً فيصل إلى 0 عند بداية اليمين الخامس','لأن LS2 يفصل مبكراً','لأن T3 يلغي العداد'],c:1,e:'5←4 عند أول يمين ... 1←0 عند خامس يمين فيسقط M0.1 فوراً.'},
  {q:'في النسخة المصححة لماذا صار CD موصولاً بـ T2؟',o:['ليعد عند نهاية كل دورة كاملة','ليعد مرتين','ليوقف المضخة','ليلغي T1'],c:0,e:'T2 = 1 لحظة انتهاء زمن اليسار، أي عند اكتمال دورة يمين + يسار.'}
 ]
});

/* =================== Lesson 8.4 =================== */
function netCompare(el){let k=2;const P=B.createPLC(washProgram({}));const names={};IO8.forEach(r=>names[r.addr]=r.sym);
  const draw=()=>{const n=P.nets[k-1];el.innerHTML=`<div class="fig"><label>اختر الشبكة: <select data-n aria-label="رقم الشبكة">${P.nets.map((x,i)=>`<option value="${i+1}" ${i+1===k?'selected':''}>Network ${i+1}</option>`).join('')}</select></label>
    <h3 class="sm">${n.title}</h3>
    <div class="grid"><div class="c6"><h3 class="sm">LAD</h3><div class="svgbox">${B.ladNetwork(n,P,names)}</div><h3 class="sm">FBD</h3><div class="svgbox">${B.fbdNetwork(n,P,names)}</div></div>
    <div class="c6"><h3 class="sm">STL</h3>${B.stlTable(n,{trace:[],get:()=>0})}<p class="sub">${n.read}</p></div></div></div>`;
    el.querySelector('[data-n]').onchange=e=>{k=+e.target.value;draw()}};draw()}
B.lesson({
 id:'u8-l4',unit:8,order:4,pages:'138–143',
 title:'برنامج الغسالة بلغتي FBD و STL',
 summary:'البرنامج نفسه (11 Network) بالمخطط الصندوقي FBD (ص 138–140) وبقائمة الأوامر STL (ص 141–143)، مع مقارنة كل شبكة باللغات الثلاث.',
 theory:[
  {h:'٢- دائرة (FBD) باستخدام (PLC)',ref:'ص 138',html:'<p>«دائرة (FBD) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات والعدادات». في FBD تُرسم «أو» بصندوق <b>&gt;=1</b> و«و» بصندوق <b>&amp;</b>، والتلامس المغلق دائرة صغيرة (N) على مدخل الصندوق. مثال Network 2: صندوق &gt;=1 (T2، Q4.1، I1.1) يدخل صندوق &amp; مع I0.0(N) و M0.1 و Q4.2(N) و T1(N) ← = Q4.1.</p>'},
  {draw:'fbd',caption:'Network 1–11 بلغة FBD (Network 1–4 ص 138، 5–10 ص 139، 11 ص 140)',ref:'ص 138–140'},
  {note:'في FBD ص 139 يظهر عنوان Network 10 «Outlet Pump»، وعنوان Network 11 «Title:» فقط. المزمنات والعداد تُرسم صناديق بالأطراف نفسها: S و TV و R و Q (و BI و BCD غير موصولين «...»)، وللعداد CD و S و PV و R و CV و CV_BCD و Q.'},
  {h:'٣- دائرة (STL) باستخدام (PLC)',ref:'ص 141',html:'<p>«دائرة (STL) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات والعدادات». نقلنا الأوامر حرفياً (عمود العملية | المعامل | العنوان). الأسطر <span class="ltr">NOP 0</span> و <span class="ltr">BLD 101</span> يضيفها برنامج STEP 7 عند التحويل من LAD ولا تؤثر في المنطق.</p>'},
  {draw:'stl',caption:'Network 1–11 بلغة STL (1–4 ص 141، 5–8 ص 142، 9–11 ص 143)',ref:'ص 141–143'},
  {err:'عنوان <b>Network 1</b> في STL (ص 141) مطبوع «1st Direction» مع أن محتواه دائرة مضخة الدخول Q5.1 (عنوانها في LAD و FBD «Inlet Pump»)؛ الاتجاه الأول فعلاً هو Network 2. وعناوين بقية الشبكات في STL «Title:» فقط. استخدمنا في البرنامج العناوين الصحيحة.'},
  {h:'أوامر جديدة في STL هذه الوحدة',html:`<table class="tt"><thead><tr><th>الأمر</th><th>معناه في البرنامج</th></tr></thead><tbody>
    <tr><td class="mono">L S5T#1M / SS T 1</td><td>حمّل زمن دقيقة وشغّل T1 تأخير تشغيل محتفظ</td></tr>
    <tr><td class="mono">L S5T#1S / SP T 3</td><td>حمّل ثانية وشغّل T3 نبضة</td></tr>
    <tr><td class="mono">CD C 1</td><td>أنقص العداد C1 عند بدء النتيجة المنطقية</td></tr>
    <tr><td class="mono">L C#5 / S C 1</td><td>اضبط العداد على 5</td></tr>
    <tr><td class="mono">L C 1 / T MW 1</td><td>انقل قيمة العداد إلى الكلمة MW1</td></tr>
    <tr><td class="mono">L MW 1 / L 0 / ==I</td><td>قارن MW1 بالصفر (عدد صحيح)</td></tr>
    <tr><td class="mono">A C 1 / = M 0.1</td><td>M0.1 = 1 ما دام العداد أكبر من صفر</td></tr></tbody></table>`},
  {h:'قارن الشبكة الواحدة باللغات الثلاث',html:'<p>اختر رقم الشبكة لترى LAD و FBD و STL جنباً إلى جنب (من البرنامج نفسه).</p>'},
  {widget:netCompare}
 ],
 io:IO8,inputs:IN8,variants:mainVariants('book'),plant:washPlant(),
 plcNote:'بدّل بين LAD و FBD و STL أثناء عمل الغسالة: كلها البرنامج نفسه. في STL يظهر RLO بعد كل سطر.',
 steps:[
  {t:'افتح تبويب البرنامج',x:'في تبويب «برنامج الـ PLC» اختر FBD. ثم عد إلى هنا أو اضغط الضواغط من الشريط العلوي هناك.'},
  {t:'شغّل الغسالة',x:'اضغط S1. في FBD Network 1 يصبح خرج صندوق &gt;=1 = 1 ثم صندوق &amp; = 1.',done:s=>s.Q('Q5.1')},
  {t:'K1 في STL',x:'بعد وصول الماء إلى LS1 اختر STL وانظر Network 2: سطر A M 0.1 أصبح RLO = 1.',done:s=>s.Q('Q4.1')},
  {t:'العداد في FBD',x:'في FBD Network 8 راقب CV=… تنقص مع كل بداية يمين.',done:s=>s.plant.rights>=2},
  {t:'المقارنة في STL',x:'انتظر حتى تبدأ Y2 وانظر Network 10 في STL: سطر ==I أعطى RLO = 1 لأن MW1 = 0.',done:s=>s.Q('Q5.2')},
  {t:'الإيقاف',x:'بعد توقف التفريغ اضغط S0 وانظر Network 11 في اللغات الثلاث.',done:s=>!s.M('M0.2')&&!s.Q('Q5.2')&&!s.btn('S0')}
 ],
 quiz:[
  {q:'ماذا يعني الصندوق >=1 في FBD؟',o:['و (AND)','أو (OR)','عكس (NOT)','مقارنة'],c:1,e:'>=1 = يكفي مدخل واحد يساوي 1.'},
  {q:'كيف يُرسم التلامس المغلق I0.0 في FBD؟',o:['صندوق &','دائرة صغيرة (N) على مدخل الصندوق','خط متقطع','ملف S'],c:1,e:'في الكتاب يُكتب I0.0 (N).'},
  {q:'أي أمر STL يقابل صندوق S_ODTS؟',o:['SP','SD','SS','SE'],c:2,e:'SS T 1 و SS T 2.'},
  {q:'ما وظيفة الأمرين L C 1 ثم T MW 1؟',o:['تصفير العداد','نقل قيمة العداد إلى الكلمة MW1','ضبط العداد على 1','زيادة العداد'],c:1,e:'L يحمّل القيمة في المركم، T ينقلها إلى العنوان.'},
  {q:'ما الخطأ في عنوان Network 1 في STL ص 141؟',o:['مكتوب Inlet Pump','مكتوب 1st Direction مع أن محتواها مضخة الدخول','لا يوجد خطأ','مكتوب Outlet Pump'],c:1,e:'الاتجاه الأول فعلاً هو Network 2.'},
  {q:'هل تؤثر الأسطر NOP 0 في عمل البرنامج؟',o:['نعم توقفه','نعم تؤخره ثانية','لا، لا تؤثر في المنطق','تصفر العداد'],c:2,e:'NOP = لا عملية؛ يضيفها المحوّل من LAD.'},
  {q:'في STL Network 10، ما الذي يقارنه الأمر ==I؟',o:['MW1 مع 0','C1 مع 5','T1 مع T2','I1.2 مع M0.2'],c:0,e:'L MW 1 / L 0 / ==I.'}
 ]
});

/* =================== Lesson 8.5 — exercise p.144 =================== */
const TVX='S5T#30S',TVXF='S5T#2S500MS';
const NOTE_XD='<b>الحل المباشر (ليس من الكتاب):</b> غيّرنا ما يطلبه التمرين حرفياً فقط: <span class="ltr">S5T#1M</span> ← <span class="ltr">S5T#30S</span> في Network 3 و 5، و <span class="ltr">C#5</span> ← <span class="ltr">C#10</span> في Network 8. لأن العداد ينقص مع كل بداية يمين، الناتج <b>9 دورات كاملة</b> فقط ثم ومضة يمين.';
const NOTE_XF='<b>الحل المصحح (ليس من الكتاب):</b> 30 ثانية لكل اتجاه، والعداد ينقص عند انتهاء T2 (<span class="ltr">A T 2</span>) ومضبوط على <span class="ltr">C#10</span> = <b>10 دورات كاملة</b>، مع إلغاء M0.2 عند عمل Y1.';
B.lesson({
 id:'u8-l5',unit:8,order:5,pages:'144',
 title:'تمرين: زمن 30 ثانية وعشر دورات',
 summary:'تنفيذ تمرين مشابه مع تغيير زمن التشغيل يميناً ويساراً إلى 30 ثانية وعدد دورات العد إلى 10، والتحقق من الناتج بالمحاكاة.',
 theory:[
  {h:'تمرين',ref:'ص 144',html:'<p>«المطلوب: تنفيذ تمرين مشابه للتمرين السابق مع تغيير زمن التشغيل للاتجاه اليمين واليسار. تصبح <b>(30 ثانية)</b> وعدد دورات العد <b>(10 دورات)</b>.»</p>'},
  {h:'ماذا نغيّر في البرنامج؟',html:`<p><b>حل مقترح (ليس من الكتاب):</b></p><table class="tt"><thead><tr><th>الشبكة</th><th>في برنامج الكتاب</th><th>في التمرين</th></tr></thead><tbody>
    <tr><td>Network 3 (T1)</td><td class="mono">L S5T#1M</td><td class="mono">L S5T#30S</td></tr>
    <tr><td>Network 5 (T2)</td><td class="mono">L S5T#1M</td><td class="mono">L S5T#30S</td></tr>
    <tr><td>Network 8 (C1)</td><td class="mono">L C#5</td><td class="mono">L C#10 ← ولكن انتبه!</td></tr></tbody></table>
    <p>في FBD و LAD يُكتب الزمن في مدخل TV للمزمن (<span class="ltr">S5T#30S</span>) والقيمة في مدخل PV للعداد (<span class="ltr">C#10</span>).</p>`},
  {err:'إذا غيّرنا <span class="ltr">C#5</span> إلى <span class="ltr">C#10</span> فقط، يعطي البرنامج <b>9 دورات كاملة</b> لا 10، للسبب نفسه الذي شرحناه في الدرس 8.3: العداد ينقص عند <b>بداية</b> كل تشغيل يمين، والبداية الأولى تُنقصه قبل أن تكتمل أي دورة. للحصول على 10 دورات فعلية: اجعل CD = T2 (العد عند نهاية الدورة) مع <span class="ltr">C#10</span>، أو أبقِ CD = Q4.1 مع <span class="ltr">C#11</span>.'},
  {h:'منضدة التحقق السريع',html:'<p>اختر الزمن والقيمة ومصدر العد، ثم اضغط «شغّل». يُنفَّذ البرنامج فعلاً على محاكي الـ PLC (بسرعة) ويُحسب عدد الدورات وزمن الغسيل.</p>'},
  {widget:(el)=>{let tv=30,pv=10,src='Q41';
    const draw=(res)=>{el.innerHTML=`<div class="fig"><div class="facts">
      <label class="fact"><span>زمن كل اتجاه TV (ثانية)</span><select data-k="tv">${[5,10,30,60].map(x=>`<option value="${x}" ${x===tv?'selected':''}>${x===60?'60 (S5T#1M)':x+' (S5T#'+x+'S)'}</option>`).join('')}</select></label>
      <label class="fact"><span>قيمة العداد PV</span><select data-k="pv">${[5,9,10,11].map(x=>`<option value="${x}" ${x===pv?'selected':''}>C#${x}</option>`).join('')}</select></label>
      <label class="fact"><span>مدخل العد CD</span><select data-k="src"><option value="Q41" ${src==='Q41'?'selected':''}>A Q 4.1 (كالكتاب)</option><option value="T2" ${src==='T2'?'selected':''}>A T 2 (المصحح)</option></select></label></div>
      <p style="margin-top:10px"><button class="btn primary" data-run>شغّل</button></p>
      ${res?`<div class="facts"><div class="fact"><span>دورات كاملة</span><b style="color:${res.full===10?'var(--on)':'var(--stop)'}">${res.full}</b></div><div class="fact"><span>ومضات يمين قصيرة</span><b>${res.blips}</b></div><div class="fact"><span>زمن الغسيل (تقريباً)</span><b>${fmtMS(res.wash)}</b></div><div class="fact"><span>تعشيق K1/K2</span><b>${res.both?'خطأ!':'سليم'}</b></div></div>
       <p class="sub">${res.full===10?'<b style="color:var(--on)">✓ يحقق المطلوب: 10 دورات.</b>':'<b style="color:var(--stop)">✗ المطلوب 10 دورات كاملة.</b>'} ${tv!==30?'والمطلوب أيضاً 30 ثانية لكل اتجاه.':''}</p>`:''}</div>`;
      el.querySelectorAll('[data-k]').forEach(s=>s.onchange=()=>{const k=s.dataset.k;if(k==='src')src=s.value;else if(k==='tv')tv=+s.value;else pv=+s.value});
      el.querySelector('[data-run]').onclick=()=>{const prog=washProgram({tv:tv===60?'S5T#1M':'S5T#'+tv+'S',pv:'C#'+pv,fixCount:src==='T2'});const r=runFast(prog,tv,(pv+2)*2*tv+120);
        const y2=r.ev.find(e=>e.k==='Y2'),r1=r.ev.find(e=>e.k==='R');r.wash=y2&&r1?y2.t-r1.t:0;draw(r)}};draw(null)}},
  {note:'في المختبر أربع نسخ: الحل المباشر والحل المصحح، كل منهما بزمن التمرين (30 ثانية) أو بزمن مختصر للعرض (2.5 ثانية، أي بنسبة 1/12 كما في الدروس السابقة).'}
 ],
 io:IO8,inputs:IN8,plant:washPlant(),
 variants:{default:'ex-direct-fast',note:'<b>زمن التمرين (30 ثانية)</b> = ما يطلبه التمرين. <b>زمن مختصر للعرض (2.5 ثانية)</b> = البرنامج نفسه بزمن <span class="ltr">S5T#2S500MS</span> لتشاهد الدورات العشر بسرعة (ليس من الكتاب).',
  'ex-direct':{label:'الحل المباشر · 30 ثانية',program:washProgram({tv:TVX,pv:'C#10'}),note:NOTE_XD},
  'ex-direct-fast':{label:'الحل المباشر · زمن مختصر للعرض (2.5 ث)',program:washProgram({tv:TVXF,pv:'C#10'}),note:NOTE_XD+' <b>الزمن هنا مختصر للعرض.</b>'},
  'ex-fixed':{label:'الحل المصحح · 30 ثانية',program:washProgram({tv:TVX,pv:'C#10',fixCount:true,fixM02:true}),note:NOTE_XF},
  'ex-fixed-fast':{label:'الحل المصحح · زمن مختصر للعرض (2.5 ث)',program:washProgram({tv:TVXF,pv:'C#10',fixCount:true,fixM02:true}),note:NOTE_XF+' <b>الزمن هنا مختصر للعرض.</b>'}},
 plcNote:'قارن Network 3 و 5 و 8 بين النسخ: هذه هي الشبكات التي يغيّرها التمرين.',
 steps:[
  {t:'اختر الحل المباشر',x:'من الأعلى اختر «الحل المباشر · زمن مختصر للعرض». في تبويب البرنامج تأكد أن Network 8 فيها L C#10.'},
  {t:'شغّل الغسالة',x:'اضغط S1 وانتظر امتلاء الحوض.',done:s=>s.Q('Q4.1')},
  {t:'عُدّ الدورات',x:'راقب «دورات كاملة» حتى يبدأ التفريغ.',done:s=>s.Q('Q5.2')},
  {t:'النتيجة',x:'كم دورة كاملة؟ في الحل المباشر 9 فقط ثم ومضة يمين. اضغط S0 بعد انتهاء التفريغ.',done:s=>!s.M('M0.2')&&!s.btn('S0')&&!s.Q('Q5.2')},
  {t:'الحل المصحح',x:'اختر «الحل المصحح · زمن مختصر للعرض» وكرر: يجب أن تظهر 10 دورات كاملة.',done:s=>s.variant==='ex-fixed-fast'||s.variant==='ex-fixed'},
  {t:'تحقق',x:'شغّل الغسلة حتى التفريغ وتأكد من الرقم 10 في «دورات كاملة».',done:s=>s.plant.full>=10&&s.Q('Q5.2')},
  {t:'زمن التمرين الحقيقي',x:'اختر «الحل المصحح · 30 ثانية» وتأكد في تبويب البرنامج أن T1 و T2 يعدان 30 ثانية (30s).'}
 ],
 quiz:[
  {q:'ما الزمن المطلوب لكل اتجاه في تمرين ص 144؟',o:['دقيقة','30 ثانية','10 ثوانٍ','5 ثوانٍ'],c:1,e:'«تصبح (30 ثانية)».'},
  {q:'كيف يُكتب زمن 30 ثانية في STL؟',o:['L S5T#30M','L S5T#30S','L C#30','L 30'],c:1,e:'S5T#30S؛ و S5T#1M = دقيقة.'},
  {q:'في أي شبكتين يتغير الزمن؟',o:['1 و 2','3 و 5','6 و 7','8 و 10'],c:1,e:'Network 3 (T1) و Network 5 (T2). أما 6 و 7 فنبضتا ثانية لا تتغيران.'},
  {q:'أين تُكتب قيمة العداد الجديدة؟',o:['Network 8 بالأمر L C#10','Network 10','Network 2','Network 9'],c:0,e:'L C#10 / S C 1.'},
  {q:'إذا غيّرنا C#5 إلى C#10 فقط، كم دورة كاملة تحدث؟',o:['10','11','9','5'],c:2,e:'البداية الأولى لليمين تُنقص العداد، فيصل إلى 0 عند بداية اليمين العاشر.'},
  {q:'أي تعديل يعطي 10 دورات كاملة فعلاً؟',o:['C#10 مع CD = Q4.1','C#10 مع CD = T2 (العد عند نهاية الدورة)','C#9 مع CD = Q4.1','C#5 مع زمن 30 ثانية'],c:1,e:'أو C#11 مع CD = Q4.1.'},
  {q:'كم يستغرق الغسيل تقريباً (دون التعبئة والتفريغ) بعد التصحيح؟',o:['5 دقائق','10 دقائق','20 دقيقة','30 ثانية'],c:1,e:'10 دورات × (30 + 30) ثانية = 600 ثانية = 10 دقائق.'}
 ]
});
})(PLCBOOK);
