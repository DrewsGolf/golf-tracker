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

(function() {
  var stored = localStorage.getItem('golf-theme');
  var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  // meta[name=theme-color] may not exist in <head> yet at this point (script
  // runs before it in some pages) — try now, and again once DOM is ready.
  applyThemeColorMeta(theme);
  document.addEventListener('DOMContentLoaded', function() { applyThemeColorMeta(getTheme()); });
})();

function setTheme(value) {
  if (value !== 'light' && value !== 'dark') return;
  localStorage.setItem('golf-theme', value);
  document.documentElement.setAttribute('data-theme', value);
  applyThemeColorMeta(value);
}

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}
