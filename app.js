'use strict';

/* ============================================================
   Ellie — a personal date tracker (PWA, no backend)
   Data lives in localStorage on the device.
============================================================ */

const STORE_KEY = 'milestones.v1';

/* SF-Symbol-style glyphs (use currentColor; badge sets color to white) */
const ICONS = {
  baby: '<g fill="currentColor"><ellipse cx="12" cy="7" rx="4.3" ry="3.3" fill="none" stroke="currentColor" stroke-width="2.2"/><rect x="7.3" y="10.3" width="9.4" height="4.2" rx="2.1"/><ellipse cx="12" cy="17.3" rx="2.3" ry="2.9"/></g>',
  anniversary: '<path fill="currentColor" d="M12 21s-7.4-4.6-9.7-9C.6 8.3 2.6 4.5 6.4 4.5c2 0 3.3 1.1 4.6 2.8 1.3-1.7 2.6-2.8 4.6-2.8 3.8 0 5.8 3.8 4.1 7.5C17.4 16.4 12 21 12 21z"/>',
  cat: '<g fill="currentColor"><ellipse cx="7" cy="10" rx="1.7" ry="2.2"/><ellipse cx="12" cy="8" rx="1.8" ry="2.4"/><ellipse cx="17" cy="10" rx="1.7" ry="2.2"/><path d="M12 12c-2.6 0-4.7 2-4.7 4.3 0 1.7 1.4 2.6 2.8 2.6.9 0 1.3-.4 1.9-.4s1 .4 1.9.4c1.4 0 2.8-.9 2.8-2.6C16.7 14 14.6 12 12 12z"/></g>',
  family: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3.6 19c0-3 2.4-5 5.4-5s5.4 2 5.4 5"/><circle cx="16.6" cy="8.6" r="2.3"/><path d="M15.2 14.1c2.6-.4 5.2 1.5 5.2 4.9"/></g>',
  other: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="15" rx="3.2"/><path d="M4 9.6h16M8 3.6v3.8M16 3.6v3.8"/></g><g fill="currentColor"><circle cx="8.5" cy="13.5" r="1"/><circle cx="12" cy="13.5" r="1"/><circle cx="15.5" cy="13.5" r="1"/></g>',
};

/* Ellie — the app mascot (shares the app name) (an elephant: "never forgets"). Flat SVG, theme-adaptive via CSS vars. */
const MASCOT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" aria-hidden="true">
  <ellipse cx="60" cy="114" rx="32" ry="4" fill="#000" opacity="0.08"/>
  <path d="M87 98c7 1 10-4 9-9" fill="none" stroke="var(--mascot-dark)" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="60" cy="92" rx="29" ry="21" fill="var(--mascot)"/>
  <ellipse cx="60" cy="98" rx="17" ry="12" fill="var(--mascot-light)"/>
  <ellipse cx="45" cy="109" rx="10" ry="6" fill="var(--mascot)"/>
  <ellipse cx="75" cy="109" rx="10" ry="6" fill="var(--mascot)"/>
  <g fill="var(--mascot-light)">
    <circle cx="41" cy="111" r="1.7"/><circle cx="45" cy="112" r="1.7"/><circle cx="49" cy="111" r="1.7"/>
    <circle cx="71" cy="111" r="1.7"/><circle cx="75" cy="112" r="1.7"/><circle cx="79" cy="111" r="1.7"/>
  </g>
  <ellipse cx="25" cy="50" rx="19" ry="21" fill="var(--mascot-dark)" transform="rotate(-12 25 50)"/>
  <ellipse cx="95" cy="50" rx="19" ry="21" fill="var(--mascot-dark)" transform="rotate(12 95 50)"/>
  <ellipse cx="26" cy="51" rx="12" ry="14" fill="#ffb3c4" transform="rotate(-12 26 51)"/>
  <ellipse cx="94" cy="51" rx="12" ry="14" fill="#ffb3c4" transform="rotate(12 94 51)"/>
  <circle cx="60" cy="48" r="27" fill="var(--mascot)"/>
  <ellipse cx="49" cy="33" rx="10" ry="5.5" fill="var(--mascot-light)" transform="rotate(-20 49 33)"/>
  <path d="M57 22c-1-5 2-8 5-7-2 2-1 4 0 6 1-4 5-5 7-3-3 1-4 3-4 5" fill="var(--mascot-dark)"/>
  <path d="M60 60c0 9 1 16 7 20s13 1 14-5" fill="none" stroke="var(--mascot-dark)" stroke-width="13.5" stroke-linecap="round"/>
  <path d="M60 60c0 9 1 16 7 20s13 1 14-5" fill="none" stroke="var(--mascot)" stroke-width="10" stroke-linecap="round"/>
  <g stroke="var(--mascot-dark)" stroke-width="1.6" stroke-linecap="round" fill="none">
    <path d="M56.5 67h7"/><path d="M58 73.5l6-1.5"/>
  </g>
  <ellipse cx="48" cy="46" rx="7" ry="8.5" fill="#fff"/>
  <ellipse cx="72" cy="46" rx="7" ry="8.5" fill="#fff"/>
  <ellipse cx="49" cy="48" rx="4" ry="5" fill="#17323c"/>
  <ellipse cx="71" cy="48" rx="4" ry="5" fill="#17323c"/>
  <circle cx="50.6" cy="45.6" r="1.7" fill="#fff"/>
  <circle cx="72.6" cy="45.6" r="1.7" fill="#fff"/>
  <path d="M42 35q6-4 11-1M67 34q5-3 11 1" fill="none" stroke="var(--mascot-dark)" stroke-width="2.2" stroke-linecap="round"/>
  <ellipse cx="38" cy="58" rx="5" ry="3.2" fill="#ff9bb0"/>
  <ellipse cx="82" cy="58" rx="5" ry="3.2" fill="#ff9bb0"/>
  <path d="M45 64q4 4 8 1" fill="none" stroke="#17323c" stroke-width="2" stroke-linecap="round"/>
</svg>`;

/* App logo mark — elephant formed by cuts in a rounded square. Uses currentColor. */
const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
  <mask id="logoCut">
    <rect width="100" height="100" fill="#fff"/>
    <path d="M51 0V47H17V79H31V100M68 100V63" fill="none" stroke="#000" stroke-width="2.6"/>
    <circle cx="19" cy="31" r="1.9" fill="#000"/>
  </mask>
  <rect x="6" y="6" width="88" height="88" rx="10" fill="currentColor" mask="url(#logoCut)"/>
</svg>`;

const CATEGORIES = [
  { id: 'baby',        label: 'Baby',        accent: 'var(--c-baby)',        defaultMode: 'age' },
  { id: 'anniversary', label: 'Anniversary', accent: 'var(--c-anniversary)', defaultMode: 'anniversary' },
  { id: 'cat',         label: 'Pets',        accent: 'var(--c-cat)',         defaultMode: 'recurring' },
  { id: 'family',      label: 'Family',      accent: 'var(--c-family)',      defaultMode: 'age' },
  { id: 'other',       label: 'Other',       accent: 'var(--c-other)',       defaultMode: 'countdown' },
];

const MODES = [
  { id: 'age',         label: 'Exact age',     hint: 'Years, months and days since a birth date — plus a countdown to the next birthday.' },
  { id: 'anniversary', label: 'Anniversary',   hint: 'How many years since the date, and how long until the next anniversary.' },
  { id: 'recurring',   label: 'Recurring due', hint: 'Track when it was last done and how often it repeats. Shows when the next one is due.' },
  { id: 'countdown',   label: 'Countdown',     hint: 'A one-off date in the future — counts down the days.' },
  { id: 'elapsed',     label: 'Time since',    hint: 'A one-off date in the past — counts how long ago it was.' },
];

const catById = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];
const iconFor = id => ICONS[id] || ICONS.other;

/* ---------------- Date helpers (local, calendar-aware) ---------------- */

const DAY = 86400000;

function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function diffYMD(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    days += daysInMonth(to.getFullYear(), to.getMonth() - 1);
  }
  if (months < 0) { years -= 1; months += 12; }
  return { years, months, days };
}

function daysBetween(a, b) { return Math.round((b - a) / DAY); }

function addInterval(date, num, unit) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (unit === 'days')  { d.setDate(d.getDate() + num); return d; }
  if (unit === 'weeks') { d.setDate(d.getDate() + num * 7); return d; }
  const monthsToAdd = unit === 'years' ? num * 12 : num;
  const targetMonth = d.getMonth() + monthsToAdd;
  const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
  const normMonth = ((targetMonth % 12) + 12) % 12;
  const clampedDay = Math.min(d.getDate(), daysInMonth(targetYear, normMonth));
  return new Date(targetYear, normMonth, clampedDay);
}

function nextAnnual(anchor) {
  const t = today();
  const make = y => new Date(y, anchor.getMonth(), Math.min(anchor.getDate(), daysInMonth(y, anchor.getMonth())));
  let occ = make(t.getFullYear());
  if (occ < t) occ = make(t.getFullYear() + 1);
  return occ;
}

/* ---------------- Formatting ---------------- */

const fmtDate = d => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

function fmtYMD({ years, months, days }, max = 3) {
  const parts = [];
  if (years) parts.push(years + 'y');
  if (months) parts.push(months + 'mo');
  if (days) parts.push(days + 'd');
  if (!parts.length) return 'today';
  return parts.slice(0, max).join(' ');
}

function fmtSpan(from, to) {
  const d = daysBetween(from, to);
  if (d === 0) return 'today';
  if (Math.abs(d) < 31) return Math.abs(d) + (Math.abs(d) === 1 ? ' day' : ' days');
  const ymd = to >= from ? diffYMD(from, to) : diffYMD(to, from);
  return fmtYMD(ymd, 2);
}

/* ---------------- Compute display model ---------------- */

function computeView(entry) {
  const cat = catById(entry.category);
  const anchor = parseDate(entry.date);
  const t = today();
  const view = {
    accent: cat.accent, icon: iconFor(entry.category), title: entry.title,
    sub: '', valueMain: '', valueLabel: '', state: 'normal', sortKey: Infinity,
  };
  if (!anchor) { view.valueMain = '—'; return view; }

  switch (entry.mode) {
    case 'age': {
      const next = nextAnnual(anchor);
      const untilBday = daysBetween(t, next);
      view.valueMain = fmtYMD(diffYMD(anchor, t), 3);
      view.valueLabel = 'old';
      view.sub = `Born ${fmtDate(anchor)} · 🎂 ${untilBday === 0 ? 'today!' : 'in ' + fmtSpan(t, next)}`;
      view.sortKey = untilBday;
      if (untilBday <= 14) view.state = 'soon';
      break;
    }
    case 'anniversary': {
      const next = nextAnnual(anchor);
      const until = daysBetween(t, next);
      const yrs = diffYMD(anchor, t).years;
      view.valueMain = yrs + (yrs === 1 ? ' yr' : ' yrs');
      view.valueLabel = 'so far';
      view.sub = `${fmtDate(anchor)} · next ${until === 0 ? 'today!' : 'in ' + fmtSpan(t, next)}`;
      view.sortKey = until;
      if (until <= 14) view.state = 'soon';
      break;
    }
    case 'recurring': {
      const num = Math.max(1, Number(entry.intervalNum) || 1);
      const unit = entry.intervalUnit || 'months';
      const due = addInterval(anchor, num, unit);
      const untilDue = daysBetween(t, due);
      view.sortKey = untilDue;
      view.sub = `Last ${fmtDate(anchor)} · every ${num} ${num === 1 ? unit.slice(0, -1) : unit} · next ${fmtDate(due)}`;
      if (untilDue < 0) { view.state = 'due'; view.valueMain = fmtSpan(due, t) + ' late'; view.valueLabel = 'overdue'; }
      else if (untilDue === 0) { view.state = 'due'; view.valueMain = 'today'; view.valueLabel = 'due now'; }
      else { if (untilDue <= 14) view.state = 'soon'; view.valueMain = 'in ' + fmtSpan(t, due); view.valueLabel = 'next due'; }
      break;
    }
    case 'countdown': {
      const until = daysBetween(t, anchor);
      view.sortKey = until;
      view.sub = fmtDate(anchor);
      if (until < 0) { view.valueMain = fmtSpan(anchor, t) + ' ago'; view.valueLabel = 'passed'; }
      else if (until === 0) { view.state = 'due'; view.valueMain = 'today'; view.valueLabel = "it's here"; }
      else { if (until <= 14) view.state = 'soon'; view.valueMain = 'in ' + fmtSpan(t, anchor); view.valueLabel = 'to go'; }
      break;
    }
    case 'elapsed':
    default: {
      const since = daysBetween(anchor, t);
      view.sortKey = -since;
      view.sub = fmtDate(anchor);
      view.valueMain = since <= 0 ? 'today' : fmtSpan(anchor, t);
      view.valueLabel = 'ago';
      break;
    }
  }
  return view;
}

/* ---------------- Storage ---------------- */

const SETTINGS_KEY = 'milestones.settings';

function load() {
  try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function save(items) { localStorage.setItem(STORE_KEY, JSON.stringify(items)); }

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; }
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings)); }

let state = { items: load(), filter: 'all', view: 'home', settings: loadSettings(), editingId: null, draft: null };

/* ---------------- Theme + greeting ---------------- */

const THEMES = [{ id: 'auto', label: 'Auto' }, { id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }];
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function resolvedDark(theme) {
  return theme === 'dark' || (theme !== 'light' && prefersDark.matches);
}
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
  const meta = document.getElementById('themeColorMeta');
  if (meta) meta.content = resolvedDark(theme) ? '#131f24' : '#ffffff';
}
prefersDark.addEventListener('change', () => applyTheme(state.settings.theme || 'auto'));

function greeting() {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const name = (state.settings.name || '').trim();
  return name ? `${g}, ${name}` : g;
}

/* ---------------- Rendering ---------------- */

const $ = sel => document.querySelector(sel);
const listEl = $('#list');
const emptyEl = $('#empty');
const filtersEl = $('#filters');

const HERO = {
  home: {
    title: () => greeting(),
    sub: () => today().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
    compact: 'Ellie',
  },
  list: {
    title: () => 'All',
    sub: () => { const n = state.items.length; return `${n} ${n === 1 ? 'milestone' : 'milestones'} tracked`; },
    compact: 'All',
  },
};

function renderHero() {
  const h = HERO[state.view];
  $('#heroTitle').textContent = h.title();
  $('#heroSub').textContent = h.sub();
  $('#compactTitle').textContent = h.compact;
}

/* Build a card button element from an entry + its computed view */
function makeCard(it, view) {
  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
  card.style.setProperty('--accent', view.accent);
  card.setAttribute('aria-label', `Edit ${view.title}`);

  const valClass = view.state === 'due' ? ' card__value--due' : view.state === 'soon' ? ' card__value--soon' : '';
  const badge = view.state === 'due' ? '<span class="badge badge--due">Due</span>'
              : view.state === 'soon' ? '<span class="badge badge--soon">Soon</span>' : '';

  card.innerHTML = `
    <span class="icon-badge"><svg viewBox="0 0 24 24">${view.icon}</svg></span>
    <span class="card__body">
      <span class="card__title">${escapeHtml(view.title)}</span>
      <span class="card__sub">${escapeHtml(view.sub)}</span>
    </span>
    <span class="card__trail">
      <span class="card__value-stack">
        ${badge}
        <span class="card__value${valClass}">
          <span class="card__value-main">${escapeHtml(view.valueMain)}</span>
          <span class="card__value-label">${escapeHtml(view.valueLabel)}</span>
        </span>
      </span>
      <span class="chevron"><svg viewBox="0 0 8 14"><path d="M1 1l6 6-6 6"/></svg></span>
    </span>`;
  card.addEventListener('click', () => openSheet(it.id));
  return card;
}

/* ---- Dashboard (home) ---- */
function renderHome() {
  const withViews = state.items
    .map(it => ({ it, view: computeView(it) }))
    .sort((a, b) => a.view.sortKey - b.view.sortKey);

  const hasAny = withViews.length > 0;
  $('#homeEmpty').hidden = hasAny;
  $('#overviewSection').hidden = !hasAny;

  // Needs attention: overdue + due-soon
  const attention = withViews.filter(x => x.view.state === 'due' || x.view.state === 'soon');
  const attentionIds = new Set(attention.map(x => x.it.id));
  const attSection = $('#attentionSection');
  const attList = $('#attentionList');
  attList.innerHTML = '';
  attSection.hidden = attention.length === 0;
  attention.forEach(({ it, view }) => attList.appendChild(makeCard(it, view)));

  // Up next: soonest upcoming not already flagged (positive, finite countdown)
  const upnext = withViews
    .filter(x => !attentionIds.has(x.it.id) && isFinite(x.view.sortKey) && x.view.sortKey >= 0)
    .slice(0, 3);
  const upSection = $('#upnextSection');
  const upList = $('#upnextList');
  upList.innerHTML = '';
  upSection.hidden = upnext.length === 0;
  upnext.forEach(({ it, view }) => upList.appendChild(makeCard(it, view)));

  renderStats(withViews, attention);
  updateBadge(attention.length);
  maybeNudge(attention);
}

function statTile(num, label, accent) {
  const el = document.createElement('div');
  el.className = 'stat';
  if (accent) el.style.setProperty('--stat-accent', accent);
  el.innerHTML = `<div class="stat__num">${escapeHtml(num)}</div><div class="stat__label">${escapeHtml(label)}</div>`;
  return el;
}

function renderStats(withViews, attention) {
  const row = $('#statsRow');
  row.innerHTML = '';
  const t = today();

  // Total tracked
  row.appendChild(statTile(String(state.items.length), 'Tracked'));

  // Needs attention count (only when there is something)
  if (attention.length) {
    row.appendChild(statTile(String(attention.length), 'Need attention', 'var(--red)'));
  }

  // Soonest upcoming event (positive, finite countdown)
  const next = withViews.find(x => isFinite(x.view.sortKey) && x.view.sortKey >= 0);
  if (next) {
    const d = next.view.sortKey;
    row.appendChild(statTile(d === 0 ? 'Today' : `${d}d`, 'Next event'));
  }

  // Events coming up in the next 31 days
  const thisMonth = withViews.filter(x => isFinite(x.view.sortKey) && x.view.sortKey >= 0 && x.view.sortKey <= 31).length;
  row.appendChild(statTile(String(thisMonth), 'Next 31 days'));

  // Featured: first baby age
  const baby = state.items.find(i => i.mode === 'age' && parseDate(i.date));
  if (baby) {
    row.appendChild(statTile(fmtYMD(diffYMD(parseDate(baby.date), t), 2), baby.title, catById(baby.category).accent));
  }

  // Featured: first anniversary (years)
  const anniv = state.items.find(i => i.mode === 'anniversary' && parseDate(i.date));
  if (anniv) {
    const yrs = diffYMD(parseDate(anniv.date), t).years;
    row.appendChild(statTile(`${yrs} ${yrs === 1 ? 'yr' : 'yrs'}`, anniv.title, catById(anniv.category).accent));
  }
}

/* ---- All (list) ---- */
function renderFilters() {
  const cats = [{ id: 'all', label: 'All' }, ...CATEGORIES];
  filtersEl.innerHTML = '';
  cats.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'seg';
    btn.textContent = c.label;
    btn.setAttribute('aria-pressed', String(state.filter === c.id));
    btn.addEventListener('click', () => { state.filter = c.id; renderList(); });
    filtersEl.appendChild(btn);
  });
}

function renderList() {
  renderFilters();
  const items = state.items
    .filter(it => state.filter === 'all' || it.category === state.filter)
    .map(it => ({ it, view: computeView(it) }))
    .sort((a, b) => a.view.sortKey - b.view.sortKey);

  listEl.innerHTML = '';
  emptyEl.hidden = state.items.length > 0;
  items.forEach(({ it, view }) => listEl.appendChild(makeCard(it, view)));
}

/* Re-render whichever views are present + the hero */
function render() {
  renderHero();
  renderHome();
  renderList();
}

function setTab(view) {
  state.view = view;
  $('#view-home').hidden = view !== 'home';
  $('#view-list').hidden = view !== 'list';
  $('#tabHome').classList.toggle('is-active', view === 'home');
  $('#tabList').classList.toggle('is-active', view === 'list');
  $('#tabHome').setAttribute('aria-current', view === 'home' ? 'page' : 'false');
  $('#tabList').setAttribute('aria-current', view === 'list' ? 'page' : 'false');
  $('#homeBrand').hidden = view !== 'home';
  renderHero();
  window.scrollTo(0, 0);
  topbar.classList.remove('is-scrolled');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------------- Add / Edit sheet ---------------- */

const sheet = $('#sheet');
const scrim = $('#scrim');

function buildChips(container, options, current, onPick, kind) {
  container.innerHTML = '';
  options.forEach(o => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(o.id === current));
    if (kind === 'category') {
      btn.style.setProperty('--accent', o.accent);
      btn.innerHTML = `<span class="chip__dot"><svg viewBox="0 0 24 24">${iconFor(o.id)}</svg></span><span>${o.label}</span>`;
    } else {
      btn.style.setProperty('--accent', catById(state.draft.category).accent);
      btn.textContent = o.label;
    }
    btn.addEventListener('click', () => onPick(o.id));
    container.appendChild(btn);
  });
}

function syncModeUI() {
  const mode = state.draft.mode;
  const meta = MODES.find(m => m.id === mode);
  $('#modeHint').textContent = meta ? meta.hint : '';
  $('#intervalRow').hidden = mode !== 'recurring';
  const labels = { age: 'Birth date', anniversary: 'The date', recurring: 'Last done on', countdown: 'The date', elapsed: 'The date' };
  $('#dateLabel').textContent = labels[mode] || 'Date';
}

function openSheet(id) {
  const editing = id ? state.items.find(i => i.id === id) : null;
  state.editingId = editing ? id : null;

  if (editing) {
    state.draft = { category: editing.category, mode: editing.mode };
    $('#sheetTitle').textContent = 'Edit Milestone';
    $('#saveBtn').textContent = 'Save';
    $('#fTitle').value = editing.title;
    $('#fDate').value = editing.date;
    $('#fNotes').value = editing.notes || '';
    $('#fIntervalNum').value = editing.intervalNum || 6;
    $('#fIntervalUnit').value = editing.intervalUnit || 'months';
    $('#deleteGroup').hidden = false;
  } else {
    const defCat = 'baby';
    state.draft = { category: defCat, mode: catById(defCat).defaultMode };
    $('#sheetTitle').textContent = 'New Milestone';
    $('#saveBtn').textContent = 'Add';
    $('#form').reset();
    $('#fIntervalNum').value = 6;
    $('#fIntervalUnit').value = 'months';
    $('#deleteGroup').hidden = true;
  }

  buildChips($('#categoryChips'), CATEGORIES, state.draft.category, pickCategory, 'category');
  buildChips($('#modeChips'), MODES, state.draft.mode, pickMode, 'mode');
  syncModeUI();

  scrim.hidden = false;
  sheet.hidden = false;
  document.body.style.overflow = 'hidden';
  if (!editing) setTimeout(() => $('#fTitle').focus(), 350);
}

function closeSheet() {
  sheet.hidden = true;
  scrim.hidden = true;
  document.body.style.overflow = '';
  state.editingId = null;
}

function pickCategory(catId) {
  const prevDefault = catById(state.draft.category).defaultMode;
  state.draft.category = catId;
  if (state.draft.mode === prevDefault) state.draft.mode = catById(catId).defaultMode;
  buildChips($('#categoryChips'), CATEGORIES, state.draft.category, pickCategory, 'category');
  buildChips($('#modeChips'), MODES, state.draft.mode, pickMode, 'mode');
  syncModeUI();
}

function pickMode(modeId) {
  state.draft.mode = modeId;
  buildChips($('#modeChips'), MODES, state.draft.mode, pickMode, 'mode');
  syncModeUI();
}

function saveDraft() {
  const title = $('#fTitle').value.trim();
  const date = $('#fDate').value;
  if (!title) { $('#fTitle').focus(); return; }
  if (!date) { $('#fDate').focus(); return; }

  const base = {
    title, date,
    category: state.draft.category,
    mode: state.draft.mode,
    notes: $('#fNotes').value.trim(),
    intervalNum: Math.max(1, Number($('#fIntervalNum').value) || 1),
    intervalUnit: $('#fIntervalUnit').value,
  };

  if (state.editingId) {
    const idx = state.items.findIndex(i => i.id === state.editingId);
    if (idx > -1) state.items[idx] = { ...state.items[idx], ...base };
  } else {
    state.items.push({ id: 'm_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), createdAt: Date.now(), ...base });
  }
  save(state.items);
  closeSheet();
  render();
}

function deleteDraft() {
  if (!state.editingId) return;
  if (!confirm('Delete this milestone? This cannot be undone.')) return;
  state.items = state.items.filter(i => i.id !== state.editingId);
  save(state.items);
  closeSheet();
  render();
}

/* ---------------- Notifications (on-device only — no server, no account) ---------------- */

// App icon badge: count of items needing attention. Checked each time the app renders.
function updateBadge(count) {
  if (!('setAppBadge' in navigator)) return;
  if (count > 0) navigator.setAppBadge(count).catch(() => {});
  else if ('clearAppBadge' in navigator) navigator.clearAppBadge().catch(() => {});
}

function notifSupported() { return 'Notification' in window; }

// Shows a notification banner via the service worker (works for installed PWAs on iOS 16.4+).
function showNudge(title, body) {
  const opts = { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'ellie-nudge' };
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opts)).catch(() => {
      try { new Notification(title, opts); } catch {}
    });
  } else {
    try { new Notification(title, opts); } catch {}
  }
}

// Nudges at most once per day, only when notifications are enabled, permitted, and something is due/soon.
// This only fires while the app is open/foregrounded — there's no server to wake it up when closed.
function maybeNudge(attention) {
  if (!state.settings.notifications) return;
  if (!notifSupported() || Notification.permission !== 'granted') return;
  if (!attention.length) return;
  const t = isoDate(today());
  if (state.settings.lastNudgeDate === t) return;
  const title = attention.length === 1 ? attention[0].it.title : `${attention.length} milestones need attention`;
  const v = attention[0].view;
  const body = attention.length === 1
    ? [v.valueMain, v.valueLabel].filter(Boolean).join(' · ')
    : attention.slice(0, 3).map(a => a.it.title).join(', ');
  showNudge(title, body);
  state.settings.lastNudgeDate = t;
  saveSettings();
}

function refreshNotifBtn() {
  const btn = $('#notifBtn');
  const hint = $('#notifHint');
  if (!notifSupported()) {
    btn.textContent = 'Not supported in this browser';
    btn.disabled = true;
    hint.textContent = 'This browser doesn’t support notifications.';
    return;
  }
  const perm = Notification.permission;
  btn.disabled = false;
  if (perm === 'denied') {
    btn.textContent = 'Blocked — enable in iOS Settings';
    btn.disabled = true;
    hint.textContent = 'Notifications are blocked for this app. Turn them on in iOS Settings → Ellie → Notifications, then come back here.';
  } else if (perm === 'granted' && state.settings.notifications) {
    btn.textContent = 'Notifications on — tap to pause';
    hint.textContent = 'You’ll get a nudge and a badge on the app icon when something needs attention — checked each time you open Ellie. Nothing leaves this device.';
  } else if (perm === 'granted') {
    btn.textContent = 'Paused — tap to resume';
    hint.textContent = 'Notifications are allowed but paused.';
  } else {
    btn.textContent = 'Enable notifications';
    hint.textContent = 'Get a nudge when something needs attention — checked only while using the app, nothing is sent through a server.';
  }
}

function toggleNotifications() {
  if (!notifSupported()) return;
  const perm = Notification.permission;
  if (perm === 'denied') return;
  if (perm === 'granted') {
    state.settings.notifications = !state.settings.notifications;
    saveSettings();
    refreshNotifBtn();
    if (state.settings.notifications) render();
    return;
  }
  Notification.requestPermission().then(result => {
    if (result === 'granted') { state.settings.notifications = true; saveSettings(); render(); }
    refreshNotifBtn();
  });
}

/* ---------------- Settings ---------------- */

const settingsSheet = $('#settingsSheet');

function buildThemeChips() {
  const box = $('#themeChips');
  const current = state.settings.theme || 'auto';
  box.innerHTML = '';
  THEMES.forEach(o => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(o.id === current));
    btn.style.setProperty('--accent', 'var(--tint)');
    btn.textContent = o.label;
    btn.addEventListener('click', () => {
      state.settings.theme = o.id;
      saveSettings();
      applyTheme(o.id);
      buildThemeChips();
    });
    box.appendChild(btn);
  });
}

function openSettings() {
  $('#sName').value = state.settings.name || '';
  buildThemeChips();
  refreshNotifBtn();
  settingsSheet.hidden = false;
  scrim.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeSettings() { settingsSheet.hidden = true; scrim.hidden = true; document.body.style.overflow = ''; }
function closeOverlays() { if (!sheet.hidden) closeSheet(); if (!settingsSheet.hidden) closeSettings(); }

function exportData() {
  const payload = JSON.stringify(
    { app: 'milestones', version: 1, exportedAt: new Date().toISOString(), items: state.items, settings: state.settings },
    null, 2
  );
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `ellie-backup-${isoDate(today())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try { data = JSON.parse(reader.result); } catch { alert('That file isn’t valid JSON.'); return; }
    const items = Array.isArray(data) ? data : data && data.items;
    if (!Array.isArray(items) || !items.every(i => i && typeof i.title === 'string' && typeof i.date === 'string')) {
      alert('That file isn’t a valid Ellie backup.');
      return;
    }
    if (!confirm(`Restore ${items.length} milestone${items.length === 1 ? '' : 's'}? This replaces what’s on this device.`)) return;
    state.items = items.map(i => ({ id: i.id || 'm_' + Math.random().toString(36).slice(2, 9), createdAt: i.createdAt || Date.now(), ...i }));
    save(state.items);
    if (data && data.settings && typeof data.settings === 'object') {
      state.settings = { ...state.settings, ...data.settings };
      saveSettings();
      $('#sName').value = state.settings.name || '';
      applyTheme(state.settings.theme || 'auto');
      buildThemeChips();
    }
    render();
    alert('Backup restored.');
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm('Delete all milestones? This cannot be undone. Your name and preferences are kept.')) return;
  state.items = [];
  save(state.items);
  render();
}

/* ---------------- Wiring ---------------- */

$('#addBtn').addEventListener('click', () => openSheet());
$('#cancelBtn').addEventListener('click', closeSheet);
$('#saveBtn').addEventListener('click', saveDraft);
$('#deleteBtn').addEventListener('click', deleteDraft);
scrim.addEventListener('click', closeOverlays);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlays(); });

// Bottom tab bar
$('#tabHome').addEventListener('click', () => setTab('home'));
$('#tabList').addEventListener('click', () => setTab('list'));

// Settings
$('#settingsBtn').addEventListener('click', openSettings);
$('#settingsDone').addEventListener('click', closeSettings);
$('#sName').addEventListener('input', e => { state.settings.name = e.target.value; saveSettings(); renderHero(); });
$('#notifBtn').addEventListener('click', toggleNotifications);
$('#exportBtn').addEventListener('click', exportData);
$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', e => { const f = e.target.files[0]; if (f) importData(f); e.target.value = ''; });
$('#clearBtn').addEventListener('click', clearAllData);

// Collapsing large-title nav
const topbar = $('#topbar');
const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 46);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function seedIfFirstRun() {
  if (localStorage.getItem(STORE_KEY) !== null) return;
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const t = today();
  const sample = [
    { title: 'Our Wedding', category: 'anniversary', mode: 'anniversary', date: '2018-02-12', notes: '', intervalNum: 1, intervalUnit: 'years' },
    { title: 'Cat’s Deworming', category: 'cat', mode: 'recurring', date: iso(addInterval(t, -5, 'months')), notes: 'Vet: Dr. Rao', intervalNum: 6, intervalUnit: 'months' },
  ];
  state.items = sample.map((s, i) => ({ id: 'seed_' + i, createdAt: Date.now() + i, ...s }));
  save(state.items);
}

// Ask the browser to protect this app's storage from eviction under disk pressure.
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

seedIfFirstRun();
applyTheme(state.settings.theme || 'auto');
const parseSVG = str => new DOMParser().parseFromString(str, 'image/svg+xml').documentElement;
document.querySelectorAll('[data-mascot]').forEach(el => el.replaceChildren(parseSVG(MASCOT)));
document.querySelectorAll('[data-logo]').forEach((el, i) => el.replaceChildren(parseSVG(LOGO.replaceAll('logoCut', 'logoCut' + i))));
setTab('home');
render();

document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
}

// Launch splash: show briefly, then fade into the app
setTimeout(() => {
  const splash = $('#splash');
  splash.classList.add('is-done');
  splash.addEventListener('transitionend', () => splash.remove(), { once: true });
}, 900);
