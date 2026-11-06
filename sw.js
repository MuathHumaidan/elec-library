/* offline cache for the interactive book */
const V='plcbook-v2';
const FILES=['./',"app.js","engine.js","fonts.css","fonts/mono-500.woff2","fonts/mono-600.woff2","fonts/plex-ar-400.woff2","fonts/plex-ar-500.woff2","fonts/plex-ar-600.woff2","fonts/plex-ar-700.woff2","fonts/plex-la-400.woff2","fonts/plex-la-500.woff2","fonts/plex-la-600.woff2","fonts/plex-la-700.woff2","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","lessons/u1.js","lessons/u10.js","lessons/u2.js","lessons/u3.js","lessons/u4.js","lessons/u5.js","lessons/u6.js","lessons/u7.js","lessons/u8.js","lessons/u9.js","manifest.webmanifest","units.js"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// network first (so updates arrive), fall back to cache when offline
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./'))))});
