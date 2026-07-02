const CACHE = 'golf-tracker-v10';
const FILES = [
  '/',
  '/index.html',
  '/setup.html',
  '/round.html',
  '/start.html',
  '/find.html',
  '/history.html',
  '/clubs.html',
  '/range.html',
  '/settings.html',
  '/suggest.html',
  '/courses.js',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/Logo.png',
  '/Background_with_logo_and_tag.png',
  '/Home_1.png', '/Home_2.png',
  '/Play_1.png', '/Play_2.png',
  '/Range_1.png', '/Range_2.png',
  '/More.png',
  '/History_1.png', '/History_2.png',
  '/Clubs_1.png', '/Clubs_2.png',
  '/Courses_1.png', '/Courses_2.png',
  '/Suggest_1.png', '/Suggets_2.png',
  '/Settings_1.png', '/Settings_2.png',
  '/Back.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
