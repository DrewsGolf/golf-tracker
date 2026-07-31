const CACHE = 'golf-tracker-v16';
const STATIC = [
  '/courses.js',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/Logo.png',
  '/Header.webp',
  '/Clubs_image.png',
  '/Back_ground_New.jpg',
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
  '/Back.png',
  '/par.PNG', '/Birdie.PNG', '/egale.PNG',
  '/hole_in_one.PNG', '/1over.PNG', '/2over.PNG', '/3over.PNG'
];

// HTML pages — always network first, cache as fallback only
const HTML_PAGES = [
  '/',
  '/index.html',
  '/login.html',
  '/round.html',
  '/setup.html',
  '/start.html',
  '/find.html',
  '/history.html',
  '/clubs.html',
  '/range.html',
  '/settings.html',
  '/suggest.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isHTML = HTML_PAGES.includes(url.pathname) || url.pathname === '/';

  if (isHTML) {
    // Network first for HTML — always get fresh auth-aware pages
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Update cache with fresh copy
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache first for static assets
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
