/* shared page boot: theme toggle, course tag, offline cache */
(function(){const root=document.documentElement;
 /* أسلوب الشرح: رسمي / التفاعلي (يُحفظ على هذا الجهاز) — القيمة المخزنة ما زالت 'stations' */
 let sm='formal';try{sm=localStorage.getItem('elib-style')==='stations'?'stations':'formal'}catch(e){}
 if(sm==='stations')root.setAttribute('data-style','stations');
 const ta=document.querySelector('.top-actions');
 if(ta){const sb=document.createElement('button');sb.className='stylebtn';sb.type='button';sb.title='اختر أسلوب الشرح';
  const lab=()=>{const st=root.getAttribute('data-style')==='stations';sb.innerHTML='<span class="sl">أسلوب الشرح: </span><b>'+(st?'التفاعلي':'رسمي')+'</b>';sb.setAttribute('aria-label','أسلوب الشرح الحالي '+(st?'التفاعلي':'رسمي')+'، اضغط للتبديل')};lab();
  sb.addEventListener('click',()=>{const st=root.getAttribute('data-style')!=='stations';
   if(st)root.setAttribute('data-style','stations');else root.removeAttribute('data-style');
   try{localStorage.setItem('elib-style',st?'stations':'formal')}catch(e){}
   lab();window.dispatchEvent(new HashChangeEvent('hashchange'))});
  ta.insertBefore(sb,ta.firstChild)}
 /* إخفاء فهرس الدروس الجانبي ليأخذ الشرح عرض الشاشة كله (للعرض على البروجكتر) — يُحفظ على هذا الجهاز */
 let wide=false;try{wide=localStorage.getItem('elib-wide')==='1'}catch(e){}
 root.toggleAttribute('data-wide',wide);
 if(ta&&document.getElementById('courseTag')){const wb=document.createElement('button');wb.type='button';wb.className='widebtn';
  const wl=()=>{wb.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(wide?'M3 5h18v14H3zM15 5v14':'M3 5h18v14H3zM15 5v14M8 9l-3 3 3 3')+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span class="sl">'+(wide?'إظهار الفهرس':'إخفاء الفهرس')+'</span>';wb.title=wide?'إظهار فهرس الدروس':'إخفاء فهرس الدروس وتوسيع الشرح';wb.setAttribute('aria-pressed',String(wide))};wl();
  wb.addEventListener('click',()=>{wide=!wide;root.toggleAttribute('data-wide',wide);try{localStorage.setItem('elib-wide',wide?'1':'0')}catch(e){};wl()});
  ta.insertBefore(wb,ta.firstChild)}
 /* حجم الخط (يُحفظ على هذا الجهاز): يكبّر محتوى الصفحة كله دون الشريط العلوي */
 const FZ=[0.9,1,1.1,1.25,1.4];let fz=1;try{const v=parseFloat(localStorage.getItem('elib-fz'));if(FZ.includes(v))fz=v}catch(e){}
 const setFz=v=>{fz=v;root.style.setProperty('--fz',v);root.toggleAttribute('data-fz',v!==1);try{localStorage.setItem('elib-fz',v)}catch(e){};const o=document.getElementById('fzVal');if(o)o.textContent=Math.round(v*100)+'%'};
 setFz(fz);
 if(ta){const g=document.createElement('div');g.className='fzbox';g.setAttribute('role','group');g.setAttribute('aria-label','حجم الخط');
  g.innerHTML='<button type="button" class="fzb" data-d="-1" aria-label="تصغير الخط" title="تصغير الخط">أ−</button><span class="fzv" id="fzVal"></span><button type="button" class="fzb" data-d="1" aria-label="تكبير الخط" title="تكبير الخط">أ+</button>';
  g.addEventListener('click',e=>{const b=e.target.closest('.fzb');if(!b)return;const i=FZ.indexOf(fz)+(+b.dataset.d);if(i>=0&&i<FZ.length)setFz(FZ[i])});
  ta.insertBefore(g,ta.firstChild);setFz(fz)}
let t=null;try{t=localStorage.getItem('plcbook-theme')}catch(e){}
 if(t)root.setAttribute('data-theme',t);
 const tb=document.getElementById('themeBtn');if(tb)tb.addEventListener('click',()=>{const dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  const n=dark?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('plcbook-theme',n)}catch(e){}});
 const ct=document.getElementById('courseTag');if(ct&&window.PLCBOOK)ct.textContent=PLCBOOK.COURSE.sc||PLCBOOK.COURSE.code;
 if(window.PLCBOOK&&PLCBOOK.start)PLCBOOK.start();
 if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.hostname)){try{const base=document.querySelector('link[rel=manifest]').href.replace(/manifest\.webmanifest$/,'');navigator.serviceWorker.register(base+'sw.js',{scope:base}).catch(()=>{})}catch(e){}}
})();
