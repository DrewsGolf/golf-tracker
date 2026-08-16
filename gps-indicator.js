// ── GPS accuracy indicator — reusable component ─────────────────────────────
// Drop into any page alongside gps-indicator.css and the matching markup
// (see the comment at the top of that file).
//
// Exposes as globals: currentFix, watchId, accuracyTier(acc)
// Call startGpsWatch(onUpdate) to begin tracking — onUpdate(fix) fires on
// every new position, for whatever page-specific logic needs the fix (e.g.
// updating a live walking-distance readout). Call stopGpsWatch() on
// teardown (e.g. beforeunload) to stop watching and release the sensor.
//
// Originally built for distance.html; reused on round.html / suggest.html
// per the GPS hole-capture doc.
//
// CHANGED 16 Aug 2026 (Measure/Suggest merge into round.html): updateGpsStatusUI()
// now updates EVERY matching status block on the page via document.querySelectorAll
// on the shared classes (.gps-indicator / .gps-status-text / .gps-accuracy /
// .gps-debug), instead of getElementById on one fixed id. This lets a single page
// host multiple independent GPS status displays fed by the same shared watch —
// e.g. round.html's merged Round/Measure/Suggest tabs each keep their own visible
// GPS block, all reading the same live fix, without id collisions (only one
// element per page can hold a given id; three tabs each needing "the GPS dot"
// broke that). Each block still needs the class names above for styling (as
// before) — ids are now optional/only for readability, no longer required by
// this script. Backward compatible with every existing single-instance page
// (distance.html, suggest.html standalone): querySelectorAll on a class that
// matches exactly one element behaves the same as getElementById did.

let currentFix = null;
let watchId    = null;
const GPS_ACC_GOOD = 8;
const GPS_ACC_FAIR = 15;

function accuracyTier(acc) {
  if (acc == null || !isFinite(acc)) return 'unknown';
  if (acc <= GPS_ACC_GOOD) return 'good';
  if (acc <= GPS_ACC_FAIR) return 'fair';
  return 'poor';
}

function updateGpsStatusUI() {
  const dots   = document.querySelectorAll('.gps-indicator');
  const texts  = document.querySelectorAll('.gps-status-text');
  const accs   = document.querySelectorAll('.gps-accuracy');
  const debugs = document.querySelectorAll('.gps-debug');
  if (!dots.length && !texts.length && !accs.length && !debugs.length) return; // markup not present on this page
  if (!currentFix) {
    dots.forEach(d => d.className = 'gps-indicator searching');
    texts.forEach(t => t.textContent = 'Acquiring GPS…');
    accs.forEach(a => a.textContent = '—');
    debugs.forEach(d => d.textContent = 'no fix yet');
    return;
  }
  const tier = accuracyTier(currentFix.accuracy);
  const labels = { good: 'Good fix', fair: 'Fair — may drift', poor: 'Poor — move to open sky', unknown: 'Unknown accuracy' };
  dots.forEach(d => d.className = 'gps-indicator ' + tier);
  texts.forEach(t => t.textContent = labels[tier]);
  accs.forEach(a => a.textContent = '±' + Math.round(currentFix.accuracy) + 'm');
  debugs.forEach(d => d.textContent = currentFix.latitude.toFixed(6) + ', ' + currentFix.longitude.toFixed(6));
}

function startGpsWatch(onUpdate) {
  if (!('geolocation' in navigator)) {
    document.querySelectorAll('.gps-status-text').forEach(t => t.textContent = 'Geolocation not supported');
    return null;
  }
  watchId = navigator.geolocation.watchPosition(
    pos => {
      currentFix = {
        latitude: pos.coords.latitude, longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy, timestamp: pos.timestamp
      };
      updateGpsStatusUI();
      if (typeof onUpdate === 'function') onUpdate(currentFix);
    },
    err => {
      document.querySelectorAll('.gps-status-text').forEach(t => t.textContent = 'GPS error: ' + err.message);
    },
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
  );
  return watchId;
}

function stopGpsWatch() {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}
