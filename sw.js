const CACHE = 'golf-tracker-v18';
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

// HTML pages — always network first, cache as fallback only.
// Matched by filename only (not full path) so this still works
// when the site is served from a sub-path like /golf-tracker/.
const HTML_FILENAMES = [
  'index.html',
  'login.html',
  'round.html',
  'setup.html',
  'start.html',
  'play.html',
  'find.html',
  'history.html',
  'clubs.html',
  'distance.html',
  'settings.html',
  'suggest.html'
];

function isHTMLRequest(request, url) {
  // Full-page navigations (typing a URL, tapping a link, opening the PWA) are always HTML
  if (request.mode === 'navigate') return true;
  // Root of the site (with or without sub-path) is index.html
  if (url.pathname === '/' || url.pathname.endsWith('/')) return true;
  // Match by filename regardless of what folder/sub-path it's served under
  const filename = url.pathname.split('/').pop();
  return HTML_FILENAMES.includes(filename);
}

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

  if (isHTMLRequest(e.request, url)) {
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
