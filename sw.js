const CACHE_NAME = 'bcp-pharmacy-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://img1.pic.in.th/images/logoUBCH.png'
];

// ติดตั้ง Service Worker และ Cache ไฟล์ที่จำเป็น
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ดึงข้อมูลจาก Cache มาใช้เมื่อไม่มี Internet (Offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ถ้าเจอใน Cache ให้ใช้จาก Cache เลย (Offline Mode)
        if (response) {
          return response;
        }
        // ถ้าไม่เจอให้ไปโหลดจาก Internet
        return fetch(event.request);
      })
  );
});

// ล้าง Cache เก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
