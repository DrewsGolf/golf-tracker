# Golf Shot Tracker — Setup Guide

## What's in this folder
- `index.html` — the app
- `manifest.json` — makes it installable
- `sw.js` — makes it work offline
- `icon-192.svg` — home screen icon

---

## How to deploy on GitHub Pages (free, takes ~5 minutes)

### Step 1 — Create a GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Create a new repository
1. Click the + button top right → New repository
2. Name it: `golf-tracker`
3. Set to **Public**
4. Click **Create repository**

### Step 3 — Upload the files
1. On your new repository page, click **Add file** → **Upload files**
2. Drag all 5 files into the upload area:
   - index.html
   - manifest.json
   - sw.js
   - icon-192.svg
   - icon-512.svg
3. Click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to **Settings** tab in your repository
2. Scroll to **Pages** in the left sidebar
3. Under Source, select **Deploy from a branch**
4. Branch: **main**, folder: **/ (root)**
5. Click **Save**
6. Wait ~1 minute, then your app is live at:
   `https://YOUR-USERNAME.github.io/golf-tracker`

---

## Add to your iPhone home screen

1. Open Safari on your iPhone
2. Go to your app URL above
3. Tap the **Share** button (box with arrow)
4. Scroll down and tap **Add to Home Screen**
5. Tap **Add**

The app now appears on your home screen like a native app and works offline.

---

## Notes
- Your shot data is saved on your phone (browser storage)
- Clearing Safari's website data would erase shots — avoid doing this
- GPS requires you to allow location access when prompted
- Works best in Safari on iPhone for the "Add to Home Screen" feature
