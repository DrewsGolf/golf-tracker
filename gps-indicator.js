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
  const dot   = document.getElementById('gps-indicator');
  const text  = document.getElementById('gps-status-text');
  const acc   = document.getElementById('gps-accuracy');
  const debug = document.getElementById('gps-debug');
  if (!dot || !text || !acc || !debug) return; // markup not present on this page
  if (!currentFix) {
    dot.className = 'gps-indicator searching';
    text.textContent = 'Acquiring GPS\u2026';
    acc.textContent = '\u2014';
    debug.textContent = 'no fix yet';
    return;
  }
  const tier = accuracyTier(currentFix.accuracy);
  const labels = { good: 'Good fix', fair: 'Fair \u2014 may drift', poor: 'Poor \u2014 move to open sky', unknown: 'Unknown accuracy' };
  dot.className = 'gps-indicator ' + tier;
  text.textContent = labels[tier];
  acc.textContent = '\u00b1' + Math.round(currentFix.accuracy) + 'm';
  debug.textContent = currentFix.latitude.toFixed(6) + ', ' + currentFix.longitude.toFixed(6);
}

function startGpsWatch(onUpdate) {
  if (!('geolocation' in navigator)) {
    const text = document.getElementById('gps-status-text');
    if (text) text.textContent = 'Geolocation not supported';
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
      const text = document.getElementById('gps-status-text');
      if (text) text.textContent = 'GPS error: ' + err.message;
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
