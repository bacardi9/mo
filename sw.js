const V='mopla-v4';
const SHELL=['./index.html','./manifest.json','./icon.svg'];
const CACHE_HOSTS=o=>o===location.origin||o.endsWith('gstatic.com')||o.endsWith('googleapis.com')||o==='loremflickr.com'||o.endsWith('loremflickr.com')||o==='images.unsplash.com'||o==='picsum.photos'||o.endsWith('picsum.photos');
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put('./index.html',cp));return r;})
                           .catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then(hit=> hit || fetch(req).then(r=>{
      if(r.ok && CACHE_HOSTS(url.hostname)){
        const cp=r.clone(); caches.open(V).then(c=>c.put(req,cp));
      }
      return r;
    }).catch(()=>hit))
  );
});