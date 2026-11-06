/* shared page boot: theme toggle, course tag, offline cache */
(function(){const root=document.documentElement;let t=null;try{t=localStorage.getItem('plcbook-theme')}catch(e){}
 if(t)root.setAttribute('data-theme',t);
 const tb=document.getElementById('themeBtn');if(tb)tb.addEventListener('click',()=>{const dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  const n=dark?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('plcbook-theme',n)}catch(e){}});
 const ct=document.getElementById('courseTag');if(ct&&window.PLCBOOK)ct.textContent=PLCBOOK.COURSE.code;
 if(window.PLCBOOK&&PLCBOOK.start)PLCBOOK.start();
 if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.hostname)){try{const base=document.querySelector('link[rel=manifest]').href.replace(/manifest\.webmanifest$/,'');navigator.serviceWorker.register(base+'sw.js',{scope:base}).catch(()=>{})}catch(e){}}
})();
