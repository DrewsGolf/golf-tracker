// ── Shot Tracker theme manager ────────────────────────────────────────────────
// Loaded on every page, as early as possible in <head>, before first paint,
// so there's no flash of the wrong theme.
//
// Storage: localStorage('golf-theme') = 'dark' | 'light'
// Default: 'dark' (unset = existing users see no change)
//
// Usage from any page: setTheme('light') / setTheme('dark')

var THEME_BG = { dark: '#0D0D0D', light: '#E8DFC8' };

function applyThemeColorMeta(theme) {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_BG[theme] || THEME_BG.dark);
}

// Maps each dark-mode icon path (as it actually appears in <img src="...">)
// to its light-mode counterpart. Explicit map rather than a computed pattern,
// since paths are being migrated to icons/ one batch at a time — add a line
// here as each icon's HTML reference is updated to live in icons/.
var ICON_LIGHT_MAP = {
  'icons/Settings.png':    'icons/Settings-light.png',
  'icons/Courses.png':     'icons/Courses-light.png',
  'icons/Play.png':        'icons/Play-light.png',
  'icons/Distance.png':    'icons/Distance-light.png',
  'icons/Suggest.png':     'icons/Suggest-light.png',
  'icons/History.png':     'icons/History-light.png',
  'icons/Home.png':        'icons/Home-light.png',
  'icons/hole_in_one.png': 'icons/hole_in_one-light.png',
  'icons/egale.png':       'icons/egale-light.png',
  'icons/Birdie.png':      'icons/Birdie-light.png',
  'icons/par.png':         'icons/par-light.png',
  'icons/1over.png':       'icons/1over-light.png',
  'icons/2over.png':       'icons/2over-light.png',
  'icons/3over.png':       'icons/3over-light.png',
  'icons/Handicap.png':    'icons/Handicap-light.png',
  'icons/Set_Clubs.png':   'icons/Set_Clubs-light.png',
  'icons/Sound.png':       'icons/Sound-light.png',
  'icons/Back.png':        'icons/Back-light.png',
  'images/Background_with_logo_and_tag.jpg': 'images/Background_with_logo_and_tag-light.jpg',
  'images/Header.jpg':     'images/Header-light.jpg'
};

function applyIconTheme(theme) {
  document.querySelectorAll('img').forEach(function(img) {
    var src = img.getAttribute('src');
    if (!src) return;
    if (!img.dataset.darkSrc) img.dataset.darkSrc = src;
    var darkSrc = img.dataset.darkSrc;
    // Some icons need a custom light-mode image instead of the global map
    // (e.g. index.html's nav row uses white icons in light mode, not the
    // usual green ones) — data-light-src on the <img> tag overrides the map.
    var lightSrc = img.dataset.lightSrc || ICON_LIGHT_MAP[darkSrc];
    img.src = (theme === 'light' && lightSrc) ? lightSrc : darkSrc;
  });
}

(function() {
  var stored = localStorage.getItem('golf-theme');
  var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  // meta[name=theme-color] may not exist in <head> yet at this point (script
  // runs before it in some pages) — try now, and again once DOM is ready.
  // Icons don't exist in the DOM yet at all at this point, so that has to
  // wait for DOMContentLoaded regardless.
  applyThemeColorMeta(theme);
  document.addEventListener('DOMContentLoaded', function() {
    applyThemeColorMeta(getTheme());
    applyIconTheme(getTheme());
  });
})();

function setTheme(value) {
  if (value !== 'light' && value !== 'dark') return;
  localStorage.setItem('golf-theme', value);
  document.documentElement.setAttribute('data-theme', value);
  applyThemeColorMeta(value);
  applyIconTheme(value);
}

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}
