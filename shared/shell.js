/* shared page boot: theme toggle, course tag, offline cache */
(function(){const root=document.documentElement;
 /* أسلوب الشرح: رسمي / المحطات (يُحفظ على هذا الجهاز) */
 let sm='formal';try{sm=localStorage.getItem('elib-style')==='stations'?'stations':'formal'}catch(e){}
 if(sm==='stations')root.setAttribute('data-style','stations');
 const ta=document.querySelector('.top-actions');
 if(ta){const sb=document.createElement('button');sb.className='stylebtn';sb.type='button';sb.title='اختر أسلوب الشرح';
  const lab=()=>{const st=root.getAttribute('data-style')==='stations';sb.innerHTML='<span class="sl">أسلوب الشرح: </span><b>'+(st?'المحطات':'رسمي')+'</b>';sb.setAttribute('aria-label','أسلوب الشرح الحالي '+(st?'المحطات':'رسمي')+'، اضغط للتبديل')};lab();
  sb.addEventListener('click',()=>{const st=root.getAttribute('data-style')!=='stations';
   if(st)root.setAttribute('data-style','stations');else root.removeAttribute('data-style');
   try{localStorage.setItem('elib-style',st?'stations':'formal')}catch(e){}
   lab();window.dispatchEvent(new HashChangeEvent('hashchange'))});
  ta.insertBefore(sb,ta.firstChild)}
let t=null;try{t=localStorage.getItem('plcbook-theme')}catch(e){}
 if(t)root.setAttribute('data-theme',t);
 const tb=document.getElementById('themeBtn');if(tb)tb.addEventListener('click',()=>{const dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  const n=dark?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('plcbook-theme',n)}catch(e){}});
 const ct=document.getElementById('courseTag');if(ct&&window.PLCBOOK)ct.textContent=PLCBOOK.COURSE.sc||PLCBOOK.COURSE.code;
 if(window.PLCBOOK&&PLCBOOK.start)PLCBOOK.start();
 if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.hostname)){try{const base=document.querySelector('link[rel=manifest]').href.replace(/manifest\.webmanifest$/,'');navigator.serviceWorker.register(base+'sw.js',{scope:base}).catch(()=>{})}catch(e){}}
})();
