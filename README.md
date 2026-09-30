# Milestones

A personal date tracker — baby's exact age, anniversaries, recurring pet-care reminders (deworming, vaccinations), and family birthdays. Built as an installable PWA: no backend, works offline, data stays on the device.

**Live:** https://sabarishkaramalsasidharan.github.io/Personal-Reminder/

## Install on your phone
1. Open the live link in Safari (iPhone) or Chrome (Android).
2. iPhone: tap **Share → Add to Home Screen**. Android: tap **⋮ → Install app / Add to Home screen**.
3. It appears as an app icon and opens fullscreen.

## Tech
Vanilla HTML/CSS/JS, no build step. `service-worker.js` caches the shell for offline use; entries are stored in `localStorage`.
