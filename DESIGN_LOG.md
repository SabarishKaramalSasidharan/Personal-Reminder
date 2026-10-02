# Design Log — Milestones (Personal event tracker)

## Decisions

### 2026-10-02 — App and mascot renamed to "Ellie"
- **Chosen by Sabarish:** one shared name for the app and the elephant mascot: **Ellie** (short for elephant; warm, friendly). Picked over Memo, Smriti, and Aana. Replaces the app name "Milestones" and the mascot placeholder "Milo".
- **Applied to:** page title, iOS home-screen label, manifest name/short_name, logo wordmark (lowercase "ellie" in Oswald), splash, top bar, backup filename.
- **Kept on purpose:** "milestone" is still the word for an entry ("No milestones yet"). Internal storage keys (`milestones.v1`, `milestones.settings`) are unchanged so existing data and old backups still load. Repo/URL (`Personal-Reminder`) unchanged.

### 2026-09-30 — Build as an installable PWA, not native or LWC
- **Chosen:** A self-contained Progressive Web App (vanilla HTML/CSS/JS, no build step, no server). Installs to the home screen on both iPhone (Safari → Add to Home Screen) and Android (Chrome → Install), runs fullscreen, works offline, stores data on-device in `localStorage`.
- **Why:** Sabarish asked for "a proper app that works in iPhone or Android." A true native app (Swift/Kotlin/React Native/Flutter) needs Xcode/Android Studio and App Store/Play accounts — not installable onto his phone by us, and heavy to maintain. LWC/SLDS (the repo house rule) can't run standalone on a phone and would look like enterprise CRM. A PWA is the only path that actually lands a working app on both phones today with zero backend.
- **Deviation logged:** Intentionally did NOT use SLDS 2 / LWC for this personal life app. Flagged to Sabarish; open to revisiting if he wants the SLDS look.

### 2026-09-30 — Five categories, five tracking "modes"
- **Categories:** Baby 🍼, Anniversary 💍, Pet health 🐾, Family 🎂, Other ⭐ (color-accented).
- **Modes** (each entry picks one; category sets a sensible default):
  - `age` — exact years/months/days since a birth date + next-birthday countdown (baby's exact age).
  - `anniversary` — years elapsed + countdown to next anniversary (marriage).
  - `recurring` — last-done date + repeat interval → next due date, overdue/soon flags (cat deworming, vaccine boosters).
  - `countdown` — one-off future date.
  - `elapsed` — one-off past date.
- **Why:** Covers everything requested (baby age, anniversaries, cat deworming + vaccination cycles, family birthdays, baby vaccine dates) with one flexible model instead of five bespoke screens.
- Cards auto-sort by soonest relevant event; overdue items surface with a red "Due" pill.

## Review feedback
_None yet._

## Iterations

### 2026-10-02 — Wordmark font swapped to Fredoka
- Request (Sabarish): use a different font for the app name under the logo.
- Replaced Oswald (condensed, heavy) with Fredoka (rounded, 700), a closer match to the playful mascot/Duolingo-style look than the narrow condensed wordmark. Applies to the splash screen's "ellie" wordmark (the only place the name still renders standalone — the home header shows the logo mark only).
- Asset versions bumped to v11; SW cache to v11.

### 2026-10-02 — Home logo moved beside greeting
- Feedback (Sabarish, screenshot of home): logo on the home page shouldn't have the name, and should sit to the right of the greeting.
- Home: wordmark removed; logo mark only (60px), right of the greeting, where the mascot used to be. The splash still shows logo + "ellie".
- Feedback (Sabarish, screenshot): settings gear looked broken. The curvy gear outline turned into blobs at 23px. Replaced it with a geometric 8-tooth gear (straight-sided teeth, clear gaps).

### 2026-10-01 — App logo + wordmark
- Request (Sabarish, with reference images): a logo like the reference "elephant" mark in green, with the app name below it.
- Mark: an elephant formed by white cuts through a rounded square (head with eye dot, trunk step-down, leg gap), recreated as SVG in feather green (`--tint`). Wordmark: "milestones" in lowercase Oswald 700 (closest free match to the reference's condensed heavy type).
- Placement (his choice): home-screen app icon (mark only, green on white; maskable variant padded), top of the home page (centered logo + name, replacing the header mascot), and a ~0.9s launch splash that fades into the app. The mascot stays only in the empty states.
- Note: the reference is an existing third-party logo. Fine for a personal app; would need an original design before any public or commercial release.
- Service worker cache bumped to v7.
- Deploy bug found while verifying: GitHub Pages lets browsers cache CSS/JS for 10 minutes, so the new HTML loaded with the old app.js, which crashed on the removed mascot element and left the page blank. Fix: version query on asset URLs (`?v=N`, bump with each release) and a `no-cache` service-worker fetch so it always checks the server. SW cache to v8.

### 2026-10-01 — Mascot v2 + removed from Settings
- Feedback (Sabarish): v1 mascot "not nice," asked for a better version, and to remove it from Settings.
- Mascot v2: flat head replaced with a full-body sitting elephant: rounded body with lighter belly, feet with toenails, tail, full ears with pink insides, head highlight, hair tuft, outlined trunk curling up, larger eyes with highlights, brows, cheeks, smile. Adds `--mascot-light`. Home size bumped 66→76px.
- Removed from the Settings sheet; now appears only in the home greeting and the empty states.
- Still a coded placeholder. Open: swap for Figma artwork if desired.

### 2026-10-01 — Mascot, greeting, more metrics, Settings
- Request: more home metrics; a welcome greeting; a Settings page (name + backup/restore + clear data + appearance); and "a mascot for the app that appears visually throughout."
- **Mascot — "Milo" the elephant** (v1): chosen for the "an elephant never forgets" association (fits a reminder app) and because it doesn't clash with the existing cat/paw category icon. Flat hand-coded SVG in brand green via CSS vars (`--mascot`/`--mascot-dark`) so it theme-adapts. Appears in the home greeting header, both empty states, and the Settings header. *Open:* v1 is a coded placeholder — Sabarish may replace it with his own Figma artwork (swap the `MASCOT` SVG string). App launcher icon not yet changed to Milo.
- **Greeting:** home hero now shows a time-of-day greeting + name ("Good morning, Sabarish") with the date beneath; app name "Milestones" moves to the collapsed top bar.
- **More metrics** on the dashboard Overview: Tracked, Need attention (when >0), Next event (days to soonest), Next 31 days, plus the featured baby age and anniversary years.
- **Settings** (gear in the top-right, opens as a bottom sheet — not a third tab, to avoid colliding with the compose button): name field (drives greeting, saves live); Appearance Auto/Light/Dark (overrides system via `data-theme`, updates the status-bar `theme-color`); Export backup (downloads JSON) and Restore (file import with validation + confirm); Delete all milestones (keeps name/prefs). Settings stored under `milestones.settings`.
- Service worker cache bumped to v4.

### 2026-10-01 — Dashboard landing + bottom tab bar
- Request: "I need a dashboard view on landing and then this current view should come." Confirmed scope: dashboard shows **Up next** + **Needs attention** + overview content; navigation via a **bottom tab bar** (Home / All).
- Added two views switched by a fixed bottom tab bar (Home = dashboard, All = the existing filtered list). Home is the landing view.
- **Dashboard content:**
  - *Needs attention* — overdue + due-soon items (reuses `computeView` state `due`/`soon`); section hides when empty.
  - *Up next* — the 3 soonest upcoming items not already flagged (positive, finite `sortKey`).
  - *Overview* — stat tiles: total tracked, plus featured baby age and anniversary years when present.
- Moved the compose button from centered to bottom-right so it clears the tab bar; tab bar respects `safe-area-inset-bottom`. Service worker cache bumped to v3.
- Existing list view, date math, and add/edit sheet left unchanged — the list is now reached via the "All" tab.

### 2026-10-01 — Mobile layout bugfix
- Reported broken on iPhone Safari (overflowing/clipped). Cause: Duolingo rewrite made card title/sub inline `<span>`s, so `overflow:hidden`/`text-overflow:ellipsis` didn't apply → text overflowed the card → horizontal page overflow (clipped title, displaced elements). Hidden on desktop by the 700px width.
- Fix: card title/sub to `display:block` (truncate properly), value column stacks on one line, `body { overflow-x:hidden }` guard. Deployed to GitHub Pages.

### 2026-09-30 — v0.4 Duolingo-style theme
- Feedback: v0.3 muted palette read as dull; wanted a bright, playful Duolingo look.
- Palette → Duolingo: feather-green (#58cc02) primary with darker "shelf" green, white background (dark = #131f24), category colors orange / cardinal-red / green / macaw-blue / beetle-purple.
- Typography → Nunito (Google Fonts, closest free match to Duolingo's Feather), weights 700–900 throughout.
- Chunky "3D" components: cards + chips + filter pills have 2px borders with a thicker bottom edge; compose button and Save button have solid offset "shelf" shadows and press down on tap. Value/label/badges set in bold uppercase.
- Note: Nunito loads from Google Fonts (won't be cached offline by the same-origin SW; falls back to system font offline).

### 2026-09-30 — v0.3 muted "premium editorial" palette
- Feedback: v0.2's Apple system colors read as bright/fluorescent; wanted elegant, premium.
- Replaced saturated system palette with a muted editorial one: warm paper backgrounds (#f4f1ec / warm-charcoal #161410 dark), soft near-black ink label instead of pure black, clay/bronze accent (#9c6a4c) instead of electric blue.
- Category colors desaturated to earth tones: camel, dusty rose, sage, muted slate-blue, mauve. Overdue/soon changed to muted brick/amber.
- Removed the colored "glow" drop-shadows on icon badges and compose button (a main source of the fluorescent feel) → soft neutral shadows.
- App icon + PWA theme-color/status-bar retinted to clay-on-cream to match.

### 2026-09-30 — v0.2 iOS-grade visual pass
- Feedback: v0.1 looked basic; wanted Apple-app polish (Journal-like), pixel-perfect.
- Rebuilt UI to iOS conventions: collapsing large-title nav with frosted `backdrop-filter` material + hairline on scroll; SF Pro type scale (34/17/15/13); Apple system color palette (systemGroupedBackground, label/secondaryLabel tiers, separators) for light + dark.
- Cards → grouped-list aesthetic with Settings-style tinted rounded-square icon badges (custom SF-Symbol-style SVG glyphs per category: bottle, heart, paw, people, calendar), trailing value + state badge + chevron.
- Add/Edit → iOS grouped inset form (sections with uppercase headers, hairline-separated rows, native date pill, segmented-style category/mode chips with checkmarks), presented as a spring-animated bottom sheet with grabber.
- Journal-style centered circular compose button (system-blue tint).
- Switched service worker from cache-first to network-first (fresh when online, still offline-capable) so updates aren't masked by stale cache; bumped cache to v2.

### 2026-09-30 — v0.1 initial build
- Mobile-first single-page app: header + category filter chips + card list + bottom-sheet add/edit form + FAB.
- Warm light/dark palette, safe-area insets, calendar/check app icon (orange gradient) generated at 180/192/512 + maskable.
- Offline via service worker (app-shell cache); installable via web manifest.
- Date math is calendar-aware (month/leap-day clamping) and unit-tested against known cases — all pass.
- Seeds two example entries (wedding, cat deworming) on first run so the app isn't blank.
