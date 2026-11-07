const C='nitya-bhakti-v2';
const CORE=['./','./index.html','./style.css','./app.js','./daily.js','./share.js','./icon.svg','./mala/','./mantras/','./gita/','./about/'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 // pages: network first, so new features (like the language menu) reach everyone; fall back to cache offline
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(C).then(c=>c.put(e.request,copy)).catch(()=>{});return resp;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));return;}
 // assets: cache first, network updates in background
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(C).then(c=>c.put(e.request,copy)).catch(()=>{});return resp;})));
});