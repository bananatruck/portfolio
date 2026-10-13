import { PROJECTS, PROFILE, SHELVES, PLAYLIST, CARTRIDGES } from './data.js';
import { h, link, player, musicApp, caseFile, interests, gameConsole, copyEmail, registerCommands, reduceMotion } from './shared.js';
import { scribbleApp, calculatorApp, monitorApp, monitorWidget, cameraApp, shortcutsApp, SHORTCUTS, notifier, lockScreen, bootSplash } from './desktop-extras.js';

// KESH_OS: a GNOME-style top bar and dock, macOS-style window buttons, the site's paper-and-ink look.
// Monochrome icons: ink, paper and one green accent, in a near-square frame.
const px = (paths, bg = '#080a09', fg = '#f1f0e9') => `<svg viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx=".9" fill="${bg}" stroke="${fg}"/>${paths}</svg>`;
// bare(): a frameless line glyph, for icons that read better without the square.
const bare = paths => `<svg viewBox="0 0 16 16" fill="none" stroke-linecap="square">${paths}</svg>`;
const ICON = {
  exe: px('<rect x="1" y="1" width="14" height="3" fill="#f1f0e9"/><path d="M4 7h2v1H4zM6 8h1v1H6zM4 9h2v1H4zM8 10h4v1H8z" fill="currentColor"/>'),
  term: px('<path d="M4 5l3 3-3 3M8 11h4" stroke="currentColor" stroke-width="1.4" fill="none"/>', '#050706'),
  folder: '<svg viewBox="0 0 16 16"><path d="M1 4h5l1.5 1.5H15V14H1z" fill="#16352a" stroke="#f1f0e9"/><path d="M1 6.5h14" stroke="currentColor"/></svg>',
  ink: px('<path d="M1 9h14M8 1v8" stroke="#080a08"/><path d="M3 3h3v4H3zM10 3h3v1h-3zM10 5h2v1h-2zM3 11h10v1H3zM3 13h6v1H3z" fill="#080a08"/>', '#f4f1e8', '#080a08'),
  game: px('<rect x="4" y="4" width="8" height="5" fill="#1b201d"/><path d="M3 11h3M4.5 9.5v3" stroke="#080a08"/><circle cx="12" cy="11" r="1" fill="#080a08"/>', '#f4f1e8', '#080a08'),
  music: px('<path d="M6 4h6v2H8v6H6z" fill="currentColor"/><rect x="4" y="10" width="3" height="3" fill="currentColor"/>'),
  mail: bare('<path d="M1.5 3.5h13v9h-13z" stroke="#f1f0e9" stroke-width="1.1"/><path d="M1.8 3.8L8 9l6.2-5.2" stroke="currentColor" stroke-width="1.3"/>'),
  pdf: px('<rect x="3" y="9" width="8" height="3" fill="currentColor"/><path d="M4 4h6M4 6h8" stroke="#080a09"/>', '#f1f0e9', '#080a09'),
  case: px('<rect x="1" y="1" width="14" height="3" fill="#f1f0e9"/><rect x="3" y="6" width="5" height="6" fill="currentColor"/><path d="M9 6h4v1H9zM9 8h4v1H9zM9 10h3v1H9z" fill="#f1f0e9"/>', '#050706'),
  gear: bare('<path d="M7 1.5h2l.4 1.9 1.3.6 1.7-1 1.4 1.4-1 1.7.6 1.3 1.9.4v2l-1.9.4-.6 1.3 1 1.7-1.4 1.4-1.7-1-1.3.6-.4 1.9H7l-.4-1.9-1.3-.6-1.7 1-1.4-1.4 1-1.7-.6-1.3L.8 9V7l1.9-.4.6-1.3-1-1.7 1.4-1.4 1.7 1 1.3-.6z" stroke="#f1f0e9" stroke-width="1" stroke-linejoin="round"/><circle cx="8" cy="8" r="2.1" stroke="currentColor" stroke-width="1.4"/>'),
  image: px('<path d="M3 12l3-4 2 2 2-3 3 5z" fill="currentColor"/><circle cx="5.5" cy="5.5" r="1.2" fill="#f1f0e9"/>'),
  research: bare('<path d="M3 1.5h6.5l3 3V14.5H3z" stroke="#f1f0e9" stroke-width="1.1"/><path d="M5 6h4M5 8.2h2.5" stroke="#f1f0e9" stroke-width="1.1"/><circle cx="9.6" cy="10" r="2.3" stroke="currentColor" stroke-width="1.3"/><path d="M11.3 11.7l2.6 2.6" stroke="currentColor" stroke-width="1.5"/>'),
  blog: px('<path d="M3.5 4h9M3.5 6.5h9M3.5 9h6" stroke="#f1f0e9"/><path d="M3.5 11.5h4" stroke="currentColor" stroke-width="1.4"/>'),
  grid: '<svg viewBox="0 0 16 16"><g fill="#f1f0e9">' + [3, 7, 11].flatMap(y => [3, 7, 11].map(x => `<rect x="${x}" y="${y}" width="2" height="2"/>`)).join('') + '</g></svg>',
  github: px('<path d="M8 3a5 5 0 00-1.6 9.7c.3 0 .4-.1.4-.3v-1c-1.4.3-1.7-.6-1.7-.6-.2-.6-.6-.8-.6-.8-.5-.3 0-.3 0-.3.5 0 .8.5.8.5.4.8 1.2.6 1.5.4 0-.3.2-.6.3-.7-1.1-.1-2.3-.6-2.3-2.5 0-.6.2-1 .5-1.4 0-.1-.2-.7.1-1.4 0 0 .4-.1 1.4.5a4.8 4.8 0 012.6 0c1-.6 1.4-.5 1.4-.5.3.7.1 1.3.1 1.4.3.4.5.8.5 1.4 0 1.9-1.2 2.4-2.3 2.5.2.2.3.5.3 1v1.5c0 .2.1.3.4.3A5 5 0 008 3z" fill="#f1f0e9"/>'),
  scribble: px('<path d="M3.5 12c1.5-3 3-5 4.5-4s-1 3 .5 3.5S12 9 12.5 6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M11 3.5l1.5 1.5" stroke="#f1f0e9"/>'),
  calc: px('<rect x="3.5" y="3" width="9" height="3" fill="currentColor"/><path d="M4 8.5h2M7 8.5h2M10 8.5h2M4 11h2M7 11h2M10 11h2M4 13.2h2M7 13.2h2" stroke="#f1f0e9" stroke-width="1.2"/><path d="M10 13.2h2" stroke="currentColor" stroke-width="1.2"/>'),
  monitor: px('<path d="M3 11l2.5-3 2 2 2.5-4 3 3.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 13h10" stroke="#f1f0e9"/>', '#050706'),
  camera: bare('<path d="M1.5 4.5h3.2l1.3-2h4l1.3 2h3.2v9h-13z" stroke="#f1f0e9" stroke-width="1.1" stroke-linejoin="round"/><circle cx="8" cy="8.8" r="2.6" stroke="currentColor" stroke-width="1.4"/><path d="M12 6.4h.6" stroke="currentColor" stroke-width="1.2"/>'),
  keys: px('<rect x="2.5" y="5" width="11" height="6" fill="none" stroke="#f1f0e9"/><path d="M4 7h1M6 7h1M8 7h1M10 7h1M5 9h6" stroke="currentColor" stroke-width="1.2"/>'),
  lock: px('<rect x="4.5" y="7.5" width="7" height="5" fill="currentColor"/><path d="M6 7.5V6a2 2 0 014 0v1.5" fill="none" stroke="#f1f0e9" stroke-width="1.3"/>'),
  linkedin: px('<path d="M4 7h2v5H4zM5 4.2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zM7.5 7h1.9v.7c.3-.5.9-.9 1.8-.9 1.5 0 1.8 1 1.8 2.2V12h-2V9.4c0-.6 0-1.3-.8-1.3s-.9.6-.9 1.3V12h-1.8z" fill="#f1f0e9"/>')
};
const icon = (k, cls = 'ic') => h('span', { class: cls, 'aria-hidden': 'true', html: ICON[k] });

const SOCIALS = [['github', 'GitHub', PROFILE.github], ['linkedin', 'LinkedIn', PROFILE.linkedin]];
// The real site's pages, opened inside windows. Served from the site itself (/os) they are
// same-origin paths; a host page elsewhere can point them at the site with window.KESH_SITE.
const SITE = window.KESH_SITE ?? '';
// Wallpapers are shown in black and white whatever the source. To add one, drop a grayscale webp in
// assets/ and a 360px-wide copy in assets/thumbs/ (Settings shows the thumbs), then add a line here.
const WALLPAPERS = [
  ['Summit night', 'wall-summit-night.webp'], ['Avalanche', 'wall-avalanche.webp'], ['Eclipse', 'wall-eclipse.webp'],
  ['Ink peaks', 'wall-ink-peaks.webp'], ['Crows', 'wall-crows.webp'], ['Contact', 'contact.webp', '/images/contact.webp']
].map(([name, file, full]) => [name, full || `./assets/${file}`, `./assets/thumbs/${file}`]);
const ACCENTS = [['Emerald', '#15ca91'], ['Spice', '#ff9a3c'], ['Ice', '#7cc4ff'], ['Rose', '#ff5c8a'], ['Violet', '#a58bff'], ['Mono', '#e8e8e2']];
// Theme presets pair an accent with a wallpaper, in the spirit of Omarchy's theme switcher.
const THEMES = [['Terminal', 0, 0], ['Dune', 1, 4], ['Glacier', 2, 1], ['Neon', 3, 2], ['Ultraviolet', 4, 5], ['Paper', 5, 3]];
// The site cursor lives outside the desktop, so the accent is mirrored onto <html> while the desktop shows.
const cursorAccent = c => (c ? document.documentElement.style.setProperty('--kc-accent', c) : document.documentElement.style.removeProperty('--kc-accent'));

function loadSettings() {
  const base = { wallpaper: 0, accent: 0, widgets: true, icons: true, clock24: false, seconds: false, brightness: 100, night: false, wifi: true, dnd: false, motion: true, dock: 'm' };
  try { return { ...base, ...JSON.parse(localStorage.getItem('kesh_os:settings') || '{}') }; } catch { return base; }
}

export function initDesktop(stage) {
  const mobile = () => matchMedia('(max-width: 760px)').matches;
  const settings = loadSettings();
  const save = () => { try { localStorage.setItem('kesh_os:settings', JSON.stringify(settings)); } catch {} };
  let z = 20, focusedKey = null;
  const bootedAt = Date.now();
  const wins = new Map();
  const listeners = new Set();
  const onSettings = fn => { listeners.add(fn); fn(); };
  const setSetting = (k, v) => { settings[k] = v; save(); listeners.forEach(fn => fn()); };

  /* ---------- shell ---------- */
  const wall = h('div', { class: 'os-wall', 'aria-hidden': 'true' });
  const iconsEl = h('nav', { class: 'os-icons', 'aria-label': 'Desktop icons' });
  const widgets = h('aside', { class: 'os-widgets', 'aria-label': 'Widgets' });
  const layer = h('div', { class: 'os-layer' });
  const snapGhost = h('div', { class: 'os-snap', hidden: true });
  const clockBtn = h('button', { type: 'button', class: 'tb-clock', 'aria-label': 'Calendar' });
  const statusBtn = h('button', { type: 'button', class: 'tb-status', 'aria-label': 'System menu', html: '<i class="st-net"><b></b><b></b><b></b><b></b></i><i class="st-vol"></i><i class="st-sun"></i><span class="st-batt"><em></em></span><span class="st-pct"></span>' });
  const launcherBtn = h('button', { type: 'button', class: 'tb-logo' }, h('b', {}, 'KESH'), '_OS');
  const nowEl = h('span', { class: 'tb-now' });
  // Full screen puts the desktop, wallpaper and all, on the whole display.
  const fsBtn = h('button', { type: 'button', class: 'tb-fs', title: 'Full screen', 'aria-label': 'Full screen', onclick: e => { e.stopPropagation(); toggleFullscreen(); } });
  const toggleFullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen?.())?.catch?.(() => {});
  document.addEventListener('fullscreenchange', () => fsBtn.classList.toggle('is-on', document.fullscreenElement === stage));
  const topbar = h('header', { class: 'os-topbar' }, h('div', { class: 'tb-left' }, launcherBtn, h('span', { class: 'tb-dots', 'aria-hidden': 'true' }, h('i', { class: 'is-on' }), h('i'), h('i'))), clockBtn, h('div', { class: 'tb-right' }, nowEl, fsBtn, statusBtn));
  const dockApps = h('div', { class: 'dk-apps' });
  const dockRunning = h('div', { class: 'dk-apps' });
  const dockSep = h('i', { class: 'dk-sep', hidden: true });
  const gridBtn = h('button', { type: 'button', class: 'dk-item', title: 'Apps', 'aria-label': 'Apps' }, icon('grid'));
  const dock = h('footer', { class: 'os-dock' }, dockApps, dockSep, dockRunning, h('i', { class: 'dk-sep' }), gridBtn);
  const appGrid = h('div', { class: 'os-start', hidden: true, role: 'menu' });
  const flyout = h('div', { class: 'os-flyout', hidden: true });
  const ctxMenu = h('div', { class: 'os-ctx', hidden: true, role: 'menu' });
  const boot = h('div', { class: 'os-boot', 'aria-hidden': 'true' });
  const shade = h('div', { class: 'os-shade', 'aria-hidden': 'true' });
  stage.append(wall, iconsEl, widgets, layer, snapGhost, appGrid, flyout, ctxMenu, topbar, dock, shade, boot);

  onSettings(() => {
    wall.style.backgroundImage = `url("${WALLPAPERS[settings.wallpaper % WALLPAPERS.length][1]}")`;
    stage.style.setProperty('--accent', ACCENTS[settings.accent % ACCENTS.length][1]);
    if (!stage.hidden) cursorAccent(ACCENTS[settings.accent % ACCENTS.length][1]);
    widgets.hidden = !settings.widgets;
    iconsEl.hidden = !settings.icons;
    stage.dataset.dock = settings.dock;
    stage.classList.toggle('no-motion', !settings.motion);
    shade.style.background = `rgba(0,0,0,${(100 - settings.brightness) / 100 * .7})`;
    stage.classList.toggle('is-night', settings.night);
    statusBtn.classList.toggle('is-offline', !settings.wifi);
  });

  /* ---------- apps ---------- */
  const APPS = {
    about: { title: 'PROJECT.EXE', icon: 'exe', w: 760, h: 430, build: aboutApp },
    files: { title: 'Files', icon: 'folder', w: 820, h: 520, build: () => filesApp() },
    terminal: { title: 'Terminal', icon: 'term', w: 620, h: 380, build: terminalApp },
    interests: { title: 'Elsewhere', icon: 'ink', w: 860, h: 640, build: () => interests() },
    arcade: { title: 'KESH_BOY', icon: 'game', w: 780, h: 600, build: () => arcadeApp() },
    music: { title: 'Music', icon: 'music', w: 420, h: 560, build: () => musicApp() },
    settings: { title: 'Settings', icon: 'gear', w: 680, h: 500, build: settingsApp },
    research: { title: 'Research', icon: 'research', w: 960, h: 680, build: () => pageApp('/research', 'Research') },
    blog: { title: 'Blog / ROM hacks', icon: 'blog', w: 920, h: 680, build: () => pageApp('/blog/pokemon-rom-hacks', 'Pokemon ROM hacks') },
    resume: { title: 'Resume.pdf', icon: 'pdf', w: 680, h: 640, build: resumeApp },
    scribble: { title: 'Scribble', icon: 'scribble', w: 760, h: 540, build: () => scribbleApp() },
    calc: { title: 'Calculator', icon: 'calc', w: 300, h: 440, build: () => calculatorApp() },
    monitor: { title: 'System Monitor', icon: 'monitor', w: 760, h: 600, build: () => monitorApp({ bootedAt, windowCount: () => wins.size }) },
    camera: { title: 'Camera', icon: 'camera', w: 720, h: 640, build: () => cameraApp({ sticker: '/garchomp.gif' }) },
    shortcuts: { title: 'Keyboard Shortcuts', icon: 'keys', w: 420, h: 440, build: shortcutsApp },
    contact: { title: 'Mail', icon: 'mail', w: 520, h: 470, build: contactApp }
  };
  for (const p of Object.values(PROJECTS)) APPS[`case:${p.key}`] = { title: p.title, icon: 'case', w: 920, h: 640, build: () => caseFile(p.key, { onNext: k => openApp(`case:${k}`) }) };
  const PINNED = ['files', 'terminal', 'interests', 'arcade', 'music', 'scribble', 'settings'];

  const DESK = [['about', 'PROJECT.EXE'], ['files', 'Projects'], ['research', 'Research'], ['blog', 'Blog'], ['terminal', 'Terminal'], ['interests', 'Elsewhere'], ['arcade', 'KESH_BOY'], ['music', 'Music'], ['scribble', 'Scribble'], ['calc', 'Calculator'], ['monitor', 'Monitor'], ['camera', 'Camera'], ['resume', 'Resume.pdf'], ['settings', 'Settings']];
  for (const [key, label] of DESK) iconsEl.append(h('button', { type: 'button', class: 'os-icon', 'data-app': key }, icon(APPS[key].icon, 'os-glyph'), h('span', {}, label)));
  for (const [key, label, url] of SOCIALS) iconsEl.append(h('a', { class: 'os-icon', href: url, target: '_blank', rel: 'noopener noreferrer', title: `${label} (opens in a new tab)` }, icon(key, 'os-glyph'), h('span', {}, label)));
  iconsEl.append(h('button', { type: 'button', class: 'os-icon', 'data-app': 'contact' }, icon('mail', 'os-glyph'), h('span', {}, 'Email')));

  const dockItem = key => h('button', { type: 'button', class: 'dk-item', 'data-app': key, title: APPS[key].title, 'aria-label': APPS[key].title, onclick: () => dockClick(key) }, icon(APPS[key].icon), h('i', { class: 'dk-dot' }));
  for (const key of PINNED) dockApps.append(dockItem(key));
  function renderDock() {
    for (const b of stage.querySelectorAll('.dk-item[data-app]')) {
      const w = wins.get(b.dataset.app);
      b.classList.toggle('is-running', !!w);
      b.classList.toggle('is-focused', b.dataset.app === focusedKey && !!w && !w.el.classList.contains('is-min'));
    }
    const extra = [...wins.keys()].filter(k => !PINNED.includes(k));
    dockRunning.replaceChildren(...extra.map(dockItem));
    dockSep.hidden = !extra.length;
    if (extra.length) renderDockRunning();
  }
  function renderDockRunning() { for (const b of dockRunning.children) { b.classList.add('is-running'); b.classList.toggle('is-focused', b.dataset.app === focusedKey); } }
  function dockClick(key) {
    const w = wins.get(key);
    if (!w) return openApp(key);
    if (focusedKey === key && !w.el.classList.contains('is-min')) minimize(key); else { w.el.classList.remove('is-min'); focus(key); }
  }

  /* ---------- window manager ---------- */
  const area = () => layer.getBoundingClientRect();
  function openApp(key, opts = {}) {
    const app = APPS[key];
    if (!app) return;
    closeMenus();
    if (wins.has(key)) { const w = wins.get(key); w.el.classList.remove('is-min'); focus(key); return w; }
    const body = h('div', { class: 'win-body' });
    const light = (act, label) => h('button', { type: 'button', class: `tl tl-${act}`, 'data-act': act, 'aria-label': label });
    const bar = h('div', { class: 'win-bar' }, h('span', { class: 'win-lights' }, light('close', 'Close'), light('min', 'Minimize'), light('max', 'Maximize')), h('span', { class: 'win-title' }, opts.title || app.title));
    const el = h('section', { class: 'os-window', 'data-app': key, role: 'dialog', 'aria-label': app.title }, bar, body,
      ...['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(d => h('i', { class: `rz rz-${d}`, 'data-dir': d })));
    const a = area();
    const w = Math.min(app.w, a.width - 30), ht = Math.min(app.h, a.height - 30), n = wins.size;
    Object.assign(el.style, { width: `${w}px`, height: `${ht}px`, left: `${Math.max(8, Math.min(a.width - w - 8, (a.width - w) / 2 - 60 + n * 30))}px`, top: `${Math.max(8, Math.min(a.height - ht - 8, (a.height - ht) / 2 - 30 + n * 26))}px` });
    const content = (opts.build || app.build)(el);
    body.append(content.el || content);
    layer.append(el);
    const rec = { el, content, prev: null };
    wins.set(key, rec);
    el.addEventListener('pointerdown', () => focus(key));
    bar.addEventListener('dblclick', e => { if (!e.target.closest('button')) toggleMax(key); });
    bar.querySelector('[data-act="close"]').addEventListener('click', () => closeApp(key));
    bar.querySelector('[data-act="min"]').addEventListener('click', e => { e.stopPropagation(); minimize(key); });
    bar.querySelector('[data-act="max"]').addEventListener('click', () => toggleMax(key));
    makeDraggable(rec, bar);
    for (const handle of el.querySelectorAll('.rz')) makeResizable(rec, handle);
    if (opts.max || mobile()) toggleMax(key, true);
    focus(key);
    return rec;
  }
  function focus(key) {
    focusedKey = key;
    for (const [k, w] of wins) { w.el.classList.toggle('is-focused', k === key); if (k === key) w.el.style.zIndex = ++z; }
    renderDock();
  }
  function minimize(key) {
    wins.get(key).el.classList.add('is-min');
    if (focusedKey === key) focusedKey = null;
    renderDock();
  }
  function closeApp(key) {
    const w = wins.get(key);
    if (!w) return;
    wins.delete(key);
    w.content.destroy?.();
    w.el.classList.add('is-closing');
    setTimeout(() => w.el.remove(), reduceMotion ? 0 : 160);
    if (focusedKey === key) focusedKey = null;
    renderDock();
  }
  const setRect = (el, r) => Object.assign(el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
  const rectOf = el => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  function toggleMax(key, force) {
    const w = wins.get(key), maxed = w.el.classList.contains('is-max');
    if (maxed && !force) { w.el.classList.remove('is-max'); if (w.prev) setRect(w.el, w.prev); return; }
    if (!maxed) w.prev = rectOf(w.el);
    const a = area();
    w.el.classList.add('is-max');
    setRect(w.el, { x: 0, y: 0, w: a.width, h: a.height });
  }
  function snapZone(x, y, a) {
    if (y < 6) return { x: 0, y: 0, w: a.width, h: a.height, max: true };
    if (x < 6) return { x: 0, y: 0, w: a.width / 2, h: a.height };
    if (x > a.width - 6) return { x: a.width / 2, y: 0, w: a.width / 2, h: a.height };
    return null;
  }
  // Pointer moves are batched into one style write per frame.
  function onDrag(target, e, move, end) {
    target.setPointerCapture(e.pointerId);
    let last = null, raf = 0;
    const mv = ev => { last = ev; if (!raf) raf = requestAnimationFrame(() => { raf = 0; move(last); }); };
    const up = () => { cancelAnimationFrame(raf); if (last) move(last); target.removeEventListener('pointermove', mv); target.removeEventListener('pointerup', up); target.removeEventListener('pointercancel', up); end(); };
    target.addEventListener('pointermove', mv);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }
  function makeDraggable(rec, bar) {
    bar.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button') || mobile()) return;
      const a = area();
      let start = rectOf(rec.el), moved = false, zone = null;
      const sx = e.clientX, sy = e.clientY;
      onDrag(bar, e, ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 4) return;
        if (!moved && rec.el.classList.contains('is-max')) {
          // Dragging a maximized window restores it under the cursor.
          rec.el.classList.remove('is-max');
          const w = rec.prev?.w || 640, hh = rec.prev?.h || 420;
          start = { x: ev.clientX - a.left - w / 2, y: 0, w, h: hh };
          setRect(rec.el, start);
        }
        moved = true;
        rec.el.classList.add('is-dragging');
        rec.el.style.left = `${Math.max(-start.w + 120, Math.min(a.width - 120, start.x + dx))}px`;
        rec.el.style.top = `${Math.max(0, Math.min(a.height - 32, start.y + dy))}px`;
        zone = snapZone(ev.clientX - a.left, ev.clientY - a.top, a);
        snapGhost.hidden = !zone;
        if (zone) setRect(snapGhost, zone);
      }, () => {
        rec.el.classList.remove('is-dragging');
        snapGhost.hidden = true;
        if (!zone) return;
        rec.prev = { ...start, x: rec.el.offsetLeft, y: rec.el.offsetTop };
        if (zone.max) toggleMax(rec.el.dataset.app, true); else setRect(rec.el, zone);
      });
    });
  }
  function makeResizable(rec, handle) {
    handle.addEventListener('pointerdown', e => {
      if (e.button !== 0 || mobile()) return;
      e.stopPropagation();
      rec.el.classList.remove('is-max');
      const dir = handle.dataset.dir, s = rectOf(rec.el), sx = e.clientX, sy = e.clientY;
      rec.el.classList.add('is-dragging');
      onDrag(handle, e, ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy, r = { ...s };
        if (dir.includes('e')) r.w = Math.max(320, s.w + dx);
        if (dir.includes('s')) r.h = Math.max(220, s.h + dy);
        if (dir.includes('w')) { r.w = Math.max(320, s.w - dx); r.x = s.x + s.w - r.w; }
        if (dir.includes('n')) { r.h = Math.max(220, s.h - dy); r.y = Math.max(0, s.y + s.h - r.h); }
        setRect(rec.el, r);
      }, () => rec.el.classList.remove('is-dragging'));
    });
  }
  new ResizeObserver(() => { const a = area(); for (const w of wins.values()) if (w.el.classList.contains('is-max')) setRect(w.el, { x: 0, y: 0, w: a.width, h: a.height }); }).observe(layer);

  /* ---------- apps ---------- */
  function aboutApp() {
    return h('div', { class: 'app-about' },
      h('div', { class: 'app-about-art' }, h('img', { src: '/images/project-exe-hero.webp', alt: 'Pixel-art hands reaching through a computer window' })),
      h('div', { class: 'app-about-copy' },
        h('span', { class: 'app-kicker' }, h('i', { class: 'live-dot' }), ' SYSTEM ONLINE // RESEARCH ASSISTANT @ CSULB'),
        h('p', { class: 'app-hi' }, "HI, I'M"),
        h('h1', {}, 'KESHAV', h('span', {}, 'JINDAL'), h('i', { class: 'caret', 'aria-hidden': 'true' })),
        h('p', { class: 'app-role' }, 'FULL STACK ', h('b', {}, '+'), ' AI SYSTEMS ENGINEER'),
        h('dl', {}, [['LOC', 'Long Beach, CA'], ['OS', 'Arch Linux'], ['NOW', 'CS undergrad, CSULB']].map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))),
        h('div', { class: 'app-actions' },
          h('button', { type: 'button', class: 'btn btn-solid', onclick: () => openApp('files') }, 'OPEN PROJECTS →'),
          h('button', { type: 'button', class: 'btn', onclick: () => openApp('terminal') }, 'TERMINAL'))));
  }

  // Files: a small virtual filesystem with back/forward, a path bar and two views.
  function fsTree() {
    const projects = Object.values(PROJECTS).map(p => ({ name: `${p.key}/`, kind: 'dir', sub: p.kind.toLowerCase(), image: p.image, children: () => [
      { name: 'README.md', kind: 'doc', sub: 'case file', open: () => openApp(`case:${p.key}`) },
      p.image && { name: 'preview.webp', kind: 'image', sub: 'screenshot', image: p.image, open: () => viewImage(p.title, p.image) },
      p.url && { name: 'site.url', kind: 'link', sub: p.host, open: () => window.open(p.url, '_blank', 'noopener') },
      { name: 'source.url', kind: 'link', sub: 'github', open: () => window.open(p.source, '_blank', 'noopener') }
    ].filter(Boolean) }));
    const shelves = SHELVES.map(s => ({ name: `${s.key}/`, kind: 'dir', sub: `${s.items.length} items`, image: s.items[0].image, children: () => s.items.map(it => ({ name: it.title, kind: 'image', sub: it.sub, image: it.image, open: () => viewImage(it.title, it.image) })) }));
    return {
      home: { label: 'Home', icon: 'folder', items: () => [
        { name: 'projects/', kind: 'dir', sub: `${projects.length} folders`, go: 'projects' },
        { name: 'elsewhere/', kind: 'dir', sub: 'interests', go: 'elsewhere' },
        { name: 'media/', kind: 'dir', sub: 'music and games', go: 'media' },
        { name: 'documents/', kind: 'dir', sub: 'resume, mail', go: 'documents' }
      ] },
      projects: { label: 'Projects', icon: 'case', items: () => projects },
      elsewhere: { label: 'Elsewhere', icon: 'ink', items: () => [{ name: 'elsewhere.app', kind: 'app', sub: 'open the shelf', open: () => openApp('interests') }, ...shelves] },
      media: { label: 'Media', icon: 'music', items: () => [
        { name: 'playlist.m3u', kind: 'music', sub: `${PLAYLIST.length} tracks`, open: () => openApp('music') },
        { name: 'kesh_boy.exe', kind: 'game', sub: `${CARTRIDGES.length} cartridges`, open: () => openApp('arcade') }
      ] },
      documents: { label: 'Documents', icon: 'pdf', items: () => [
        { name: 'keshav-jindal-resume.pdf', kind: 'pdf', sub: 'one page', open: () => openApp('resume') },
        { name: 'contact.eml', kind: 'mail', sub: PROFILE.email, open: () => openApp('contact') }
      ] }
    };
  }
  function filesApp() {
    const tree = fsTree();
    const back = [], fwd = [];
    let here = { place: 'home', path: ['home'], items: tree.home.items }, view = 'grid', sel = null;
    const side = h('nav', { class: 'files-side' });
    const crumb = h('div', { class: 'files-crumb' });
    const main = h('div', { class: 'files-main' });
    const status = h('p', { class: 'files-status' });
    const search = h('input', { type: 'search', placeholder: 'Filter', 'aria-label': 'Filter files' });
    const bBack = h('button', { type: 'button', 'aria-label': 'Back', onclick: () => step(back, fwd) }, '‹');
    const bFwd = h('button', { type: 'button', 'aria-label': 'Forward', onclick: () => step(fwd, back) }, '›');
    const bView = h('button', { type: 'button', 'aria-label': 'Toggle view', onclick: () => { view = view === 'grid' ? 'list' : 'grid'; render(); } });
    const kindIcon = { dir: 'folder', doc: 'case', image: 'image', link: 'github', app: 'ink', music: 'music', game: 'game', pdf: 'pdf', mail: 'mail' };
    function go(next, push = true) { if (push) { back.push(here); fwd.length = 0; } here = next; sel = null; search.value = ''; render(); }
    function step(from, to) { if (!from.length) return; to.push(here); here = from.pop(); render(); }
    function openItem(it) {
      if (it.go) go({ place: it.go, path: ['home', it.go], items: tree[it.go].items });
      else if (it.kind === 'dir') go({ place: here.place, path: [...here.path, it.name.replace('/', '')], items: it.children });
      else it.open?.();
    }
    function render() {
      for (const b of side.children) b.classList.toggle('is-on', b.dataset.place === here.place && here.path.length <= 2);
      crumb.replaceChildren(...here.path.flatMap((seg, i) => [i ? h('em', {}, '/') : '', h('button', { type: 'button', onclick: () => { if (i === here.path.length - 1) return; const place = here.path[Math.min(i, 1)] || 'home'; go({ place: i === 0 ? 'home' : place, path: here.path.slice(0, i + 1), items: i === 0 ? tree.home.items : tree[place].items }); } }, i === 0 ? '~' : seg)]));
      bBack.disabled = !back.length; bFwd.disabled = !fwd.length;
      bView.textContent = view === 'grid' ? '☰' : '▦';
      const q = search.value.trim().toLowerCase();
      const items = here.items().filter(it => !q || it.name.toLowerCase().includes(q));
      main.className = `files-main is-${view}`;
      main.replaceChildren(...items.map(it => h('button', { type: 'button', class: `file${sel === it.name ? ' is-sel' : ''}`,
        onclick: e => { sel = it.name; main.querySelectorAll('.file').forEach(f => f.classList.toggle('is-sel', f === e.currentTarget)); status.textContent = `${it.name}  ${it.sub || ''}`; if (mobile()) openItem(it); },
        ondblclick: () => openItem(it), onkeydown: e => { if (e.key === 'Enter') openItem(it); } },
        it.image && view === 'grid' ? h('img', { src: it.image, alt: '', loading: 'lazy' }) : icon(kindIcon[it.kind] || 'folder', 'file-ic'),
        h('b', {}, it.name), h('span', {}, it.sub || ''))));
      status.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;
    }
    search.addEventListener('input', render);
    for (const [key, place] of Object.entries(tree)) side.append(h('button', { type: 'button', 'data-place': key, onclick: () => go({ place: key, path: key === 'home' ? ['home'] : ['home', key], items: place.items }) }, icon(place.icon), place.label));
    render();
    return h('div', { class: 'app-files' }, side, h('div', { class: 'files-pane' }, h('div', { class: 'files-bar' }, bBack, bFwd, crumb, search, bView), main, status));
  }
  function viewImage(title, src) {
    closeApp('viewer');
    APPS.viewer = { title, icon: 'image', w: 720, h: 520, build: () => h('div', { class: 'app-viewer' }, h('img', { src, alt: title })) };
    openApp('viewer');
  }

  function terminalApp() {
    const out = h('div', { class: 'app-term-log' });
    const inp = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Terminal command' });
    const say = (text, cls) => out.append(h('p', { class: cls }, text));
    out.append(h('pre', { class: 'neofetch', html: `  ▄▄▄▄▄   <b>kesh</b>@kesh_os\n  █ ▸_█   ------------\n  █▄▄▄█   <b>role</b>   full stack + ai systems\n   ▀▀▀    <b>loc</b>    long beach, ca\n          <b>os</b>     arch linux\n          <b>repos</b>  ${Object.keys(PROJECTS).length} here, 9+ on github.com/bananatruck` }), h('p', { class: 'ok' }, 'Type help.'));
    const names = { projects: 'files', files: 'files', interests: 'interests', elsewhere: 'interests', music: 'music', games: 'arcade', emulator: 'arcade', pokemon: 'arcade', resume: 'resume', mail: 'contact', contact: 'contact', about: 'about', settings: 'settings', research: 'research', paper: 'research', blog: 'blog', romhacks: 'blog' };
    for (const k of Object.keys(PROJECTS)) names[k] = `case:${k}`;
    const form = h('form', { class: 'app-term-form', onsubmit: e => {
      e.preventDefault();
      const raw = inp.value.trim().toLowerCase(); inp.value = '';
      if (!raw) return;
      out.append(h('p', {}, h('span', {}, 'kesh@kesh_os'), ` ~ % ${raw}`));
      const [cmd, arg = ''] = raw.split(/\s+/, 2);
      const target = names[arg.replace(/\/$/, '')] || names[cmd];
      if (cmd === 'clear') out.replaceChildren();
      else if (cmd === 'help') say(`open <name> | ls | whoami | play | next | email | clear. names: ${Object.keys(names).join(' ')}`, 'ok');
      else if (cmd === 'ls') say(Object.keys(PROJECTS).map(k => `${k}/`).join('  '), 'ok');
      else if (cmd === 'whoami') say('keshav jindal / full stack + ai systems engineer / research assistant @ csulb', 'ok');
      else if (cmd === 'play' || cmd === 'pause') { player.toggle(); say(player.playing ? `now playing: ${player.track.title} / ${player.track.artist}` : 'paused', 'ok'); }
      else if (cmd === 'next') { player.next(); say(`next: ${player.track.title}`, 'ok'); }
      else if (cmd === 'email') { copyEmail(); say('email copied', 'ok'); }
      else if (target && (['open', 'cd', 'cat', 'run'].includes(cmd) || !arg)) { openApp(target); say(`opened ${APPS[target].title}`, 'ok'); }
      else say(`zsh: command not found: ${raw}. Type help.`);
      out.scrollTop = out.scrollHeight;
    } }, h('label', {}, h('span', {}, 'kesh@kesh_os'), ' ~ %'), inp);
    setTimeout(() => inp.focus({ preventScroll: true }), 60);
    return h('div', { class: 'app-term', onclick: e => { if (!e.target.closest('a,button')) inp.focus({ preventScroll: true }); } }, out, form);
  }

  function arcadeApp(cart) {
    const c = gameConsole({ cart });
    return { el: h('div', { class: 'arcade' }, c.el), destroy: () => c.destroy(), console: c };
  }

  function settingsApp() {
    const pane = h('div', { class: 'set-pane' });
    const row = (label, control, hint) => h('div', { class: 'set-row' }, h('div', {}, h('b', {}, label), hint && h('span', {}, hint)), control);
    const toggle = key => { const b = h('button', { type: 'button', class: 'set-toggle', role: 'switch', onclick: () => setSetting(key, !settings[key]) }); onSettings(() => b.setAttribute('aria-checked', String(!!settings[key]))); return b; };
    const slider = (key, min = 30, max = 100) => { const r = h('input', { type: 'range', min, max, value: settings[key], 'aria-label': key }); r.addEventListener('input', () => setSetting(key, Number(r.value))); return r; };
    const choice = (key, opts) => h('div', { class: 'set-seg' }, opts.map(([v, label]) => { const b = h('button', { type: 'button', onclick: () => setSetting(key, v) }, label); onSettings(() => b.classList.toggle('is-on', settings[key] === v)); return b; }));
    const vol = () => { const r = h('input', { type: 'range', min: 0, max: 100, value: Math.round(player.audio.volume * 100), 'aria-label': 'Volume' }); r.addEventListener('input', () => { player.audio.volume = r.value / 100; player.audio.muted = false; }); return r; };
    const info = () => [['Browser', navigator.userAgentData?.brands?.filter(b => !/Not/.test(b.brand)).map(b => b.brand).join(', ') || navigator.userAgent.split(' ').pop()],
      ['Platform', navigator.userAgentData?.platform || navigator.platform || 'not reported'], ['CPU threads', navigator.hardwareConcurrency || 'not reported'],
      ['Screen', `${screen.width} x ${screen.height}`], ['Uptime', `${Math.round((Date.now() - bootedAt) / 60000)} min`]];
    const pages = {
      Appearance: () => [
        h('p', { class: 'set-h' }, 'Themes'),
        h('div', { class: 'set-themes' }, THEMES.map(([name, acc, wp]) => { const b = h('button', { type: 'button', class: 'set-theme', style: `--c:${ACCENTS[acc][1]};background-image:url("${WALLPAPERS[wp][2]}")`, onclick: () => applyTheme(name) }, h('span', {}, name)); onSettings(() => b.classList.toggle('is-on', settings.accent === acc && settings.wallpaper === wp)); return b; })),
        h('p', { class: 'set-h' }, 'Wallpaper'),
        h('div', { class: 'set-walls' }, WALLPAPERS.map(([name, , thumb], i) => { const b = h('button', { type: 'button', class: 'set-wall', style: `background-image:url("${thumb}")`, onclick: () => setSetting('wallpaper', i) }, h('span', {}, name)); onSettings(() => b.classList.toggle('is-on', settings.wallpaper === i)); return b; })),
        h('p', { class: 'set-h' }, 'Accent'),
        h('div', { class: 'set-accents' }, ACCENTS.map(([name, c], i) => { const b = h('button', { type: 'button', title: name, 'aria-label': name, style: `--c:${c}`, onclick: () => setSetting('accent', i) }); onSettings(() => b.classList.toggle('is-on', settings.accent === i)); return b; }))
      ],
      Desktop: () => [row('Desktop icons', toggle('icons')), row('Widgets', toggle('widgets'), 'System monitor, then calendar, now playing, currently, shelf'), row('Dock size', choice('dock', [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']]))],
      Clock: () => [row('24-hour clock', toggle('clock24')), row('Show seconds', toggle('seconds'))],
      Display: () => [row('Brightness', slider('brightness')), row('Night light', toggle('night'), 'Warmer colours'), row('Animations', toggle('motion'), 'Window and menu transitions'), row('Full screen', h('button', { type: 'button', class: 'btn', onclick: toggleFullscreen }, 'Toggle'), 'Alt + U')],
      Sound: () => [row('Volume', vol()), row('Music', h('button', { type: 'button', class: 'btn', onclick: () => { player.analyser(); player.toggle(); } }, 'Play / pause'))],
      Notifications: () => [row('Do not disturb', toggle('dnd'), 'Hides notifications')],
      Network: () => [row('Wi-Fi', toggle('wifi'), 'KESH_NET')],
      Keyboard: () => [shortcutsApp()],
      About: () => [h('div', { class: 'set-about' }, h('b', {}, 'KESH_OS 26.10'), h('span', {}, 'A portfolio by Keshav Jindal. Built with plain HTML, CSS and JavaScript, plus Three.js for the planet.'),
        h('dl', { class: 'set-info' }, info().flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, String(v))])),
        h('div', { class: 'set-links' }, SOCIALS.map(([k, label, url]) => link(url, `${label} ↗`))))]
    };
    const nav = h('nav', { class: 'set-nav' });
    const show = name => { for (const b of nav.children) b.classList.toggle('is-on', b.textContent === name); pane.replaceChildren(h('h2', {}, name), ...pages[name]()); };
    for (const name of Object.keys(pages)) nav.append(h('button', { type: 'button', onclick: () => show(name) }, name));
    show('Appearance');
    return h('div', { class: 'app-settings' }, nav, pane);
  }
  function applyTheme(name) {
    const t = THEMES.find(x => x[0] === name);
    if (!t) return;
    settings.wallpaper = t[2];
    setSetting('accent', t[1]);
    notify('Theme', name);
  }
  function lock() { closeMenus(); lockScreen(stage, { avatar: PROFILE.avatar, timeStr, onUnlock: () => notify('Welcome back', 'kesh') }); }

  function pageApp(path, title) {
    return h('div', { class: 'app-page' },
      h('div', { class: 'app-resume-bar' }, h('span', {}, `kesh.dev${path}`), link(`${SITE}${path}`, 'OPEN IN BROWSER ↗', 'btn')),
      h('iframe', { src: `${SITE}${path}`, title, loading: 'lazy' }));
  }

  function resumeApp() {
    return h('div', { class: 'app-resume' },
      h('div', { class: 'app-resume-bar' }, h('span', {}, 'keshav-jindal-resume.pdf'), link(PROFILE.resume, 'DOWNLOAD ↓', 'btn btn-solid')),
      h('iframe', { src: `${PROFILE.resume}#view=FitH`, title: 'Resume', loading: 'lazy' }));
  }

  function contactApp() {
    const subject = h('input', { type: 'text', name: 'subject', placeholder: 'Subject', required: true });
    const bodyIn = h('textarea', { name: 'body', rows: 8, placeholder: 'Write a message...' });
    return h('form', { class: 'app-mail', onsubmit: e => { e.preventDefault(); location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(bodyIn.value)}`; } },
      h('label', {}, h('span', {}, 'TO'), h('b', {}, PROFILE.email), h('button', { type: 'button', class: 'mail-copy', onclick: copyEmail }, 'COPY')),
      h('label', {}, h('span', {}, 'SUBJECT'), subject), bodyIn,
      h('div', { class: 'app-mail-foot' }, h('button', { type: 'submit', class: 'btn btn-solid' }, 'SEND WITH MY MAIL APP ↗')));
  }

  /* ---------- widgets ---------- */
  const wCal = h('section', { class: 'widget w-clock' }, h('b', { class: 'w-time' }), h('span', { class: 'w-date' }), h('div', { class: 'w-cal' }));
  const viz = h('canvas', { class: 'w-viz', width: 220, height: 34 });
  const wNow = h('section', { class: 'widget w-now' }, h('span', { class: 'w-label' }, 'NOW PLAYING'), h('b', { class: 'w-track' }), h('span', { class: 'w-artist' }),
    h('div', { class: 'w-ctrls' }, h('button', { type: 'button', onclick: () => player.prev(), 'aria-label': 'Previous' }, '«'), h('button', { type: 'button', class: 'w-play', onclick: () => { player.analyser(); player.toggle(); }, 'aria-label': 'Play or pause' }), h('button', { type: 'button', onclick: () => player.next(), 'aria-label': 'Next' }, '»')),
    h('div', { class: 'w-bar' }, h('i')), viz);
  const wStatus = h('section', { class: 'widget w-status' }, h('span', { class: 'w-label' }, 'CURRENTLY'),
    h('ul', {}, h('li', {}, h('i', { class: 'live-dot' }), 'Research assistant @ CSULB'), h('li', {}, h('i', { class: 'live-dot' }), 'G.A.T.E.S. Gate 1 measured live'), h('li', {}, h('i', { class: 'live-dot is-amber' }), 'LaunchGuard in development')));
  const allItems = SHELVES.flatMap(s => s.items.map(it => ({ ...it, shelf: s.label })));
  const coverImg = h('img', { alt: '', loading: 'lazy' }), coverCap = h('span');
  const wCover = h('button', { type: 'button', class: 'widget w-cover', onclick: () => openApp('interests') }, coverImg, h('span', { class: 'w-cover-cap' }, coverCap));
  // The system widget sits on top; the default widgets follow below it.
  const wMon = monitorWidget(() => openApp('monitor'));
  widgets.append(wMon.el, wCal, wNow, wStatus, wCover);
  let coverI = Math.floor(Math.random() * allItems.length);
  const nextCover = () => { const it = allItems[coverI++ % allItems.length]; coverImg.src = it.image; coverImg.alt = it.title; coverCap.textContent = `${it.shelf} / ${it.title}`; };
  nextCover();

  const pad = n => String(n).padStart(2, '0');
  const timeStr = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: settings.seconds ? '2-digit' : undefined, hour12: !settings.clock24 });
  function tick() {
    const now = new Date();
    wCal.querySelector('.w-time').textContent = timeStr(now);
    wCal.querySelector('.w-date').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
    clockBtn.textContent = `${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}  ${timeStr(now)}`;
  }
  function calendar(el) {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    el.replaceChildren(h('p', {}, now.toLocaleDateString([], { month: 'long', year: 'numeric' }).toUpperCase()),
      h('div', { class: 'cal-grid' }, ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => h('em', {}, d)), Array.from({ length: first }, () => h('span')),
        Array.from({ length: days }, (_, i) => h('span', { class: i + 1 === now.getDate() ? 'is-today' : null }, String(i + 1)))));
  }
  let ticker = 0, coverTicker = 0;
  onSettings(() => { tick(); if (ticker) { clearInterval(ticker); ticker = setInterval(tick, settings.seconds ? 1000 : 15000); } });
  calendar(wCal.querySelector('.w-cal'));
  const startTimers = () => { clearInterval(ticker); clearInterval(coverTicker); tick(); ticker = setInterval(tick, settings.seconds ? 1000 : 15000); if (!reduceMotion) coverTicker = setInterval(nextCover, 7000); if (settings.widgets) wMon.start(); };
  const stopTimers = () => { clearInterval(ticker); clearInterval(coverTicker); wMon.stop(); };
  onSettings(() => { if (settings.widgets && !stage.hidden) wMon.start(); else wMon.stop(); });
  startTimers();

  // Visualizer: draws only while music plays and the desktop is visible.
  const vctx = viz.getContext('2d');
  let vraf = 0;
  const drawViz = () => {
    vraf = 0;
    const an = player._an, bins = new Uint8Array(32), accent = getComputedStyle(stage).getPropertyValue('--accent').trim() || '#15ca91';
    if (an) an.getByteFrequencyData(bins);
    vctx.clearRect(0, 0, 220, 34);
    for (let i = 0; i < 22; i++) {
      const v = an && player.playing ? bins[i] / 255 : .06;
      const hh = Math.max(2, v * 32);
      vctx.fillStyle = accent;
      vctx.globalAlpha = .45 + v * .55;
      vctx.fillRect(i * 10, 34 - hh, 6, hh);
    }
    if (player.playing && !stage.hidden && !reduceMotion) vraf = requestAnimationFrame(drawViz);
  };
  const syncPlayer = () => {
    wNow.querySelector('.w-track').textContent = player.track.title;
    wNow.querySelector('.w-artist').textContent = player.track.artist;
    wNow.querySelector('.w-play').textContent = player.playing ? '❚❚' : '▶';
    const a = player.audio;
    wNow.querySelector('.w-bar i').style.width = a.duration ? `${a.currentTime / a.duration * 100}%` : '0';
    nowEl.textContent = player.playing ? `♪ ${player.track.title}` : '';
    statusBtn.classList.toggle('is-muted', player.audio.muted || player.audio.volume === 0);
    if (!vraf) vraf = requestAnimationFrame(drawViz);
  };
  player.addEventListener('change', syncPlayer);
  syncPlayer();

  // Battery, only when the browser exposes it.
  const batt = statusBtn.querySelector('.st-batt'), pct = statusBtn.querySelector('.st-pct');
  if (navigator.getBattery) navigator.getBattery().then(b => {
    const s = () => { batt.firstChild.style.width = `${Math.round(b.level * 100)}%`; pct.textContent = `${Math.round(b.level * 100)}%`; batt.classList.toggle('is-charging', b.charging); };
    s(); b.addEventListener('levelchange', s); b.addEventListener('chargingchange', s);
  }).catch(() => { batt.remove(); pct.remove(); }); else { batt.remove(); pct.remove(); }

  /* ---------- menus: app grid, calendar, control panel, context menu ---------- */
  function closeMenus() { appGrid.hidden = true; flyout.hidden = true; ctxMenu.hidden = true; launcherBtn.classList.remove('is-on'); }
  // The app menu: a compact panel with search, the apps, and power options. It opens next to
  // whichever button summoned it (top-left logo or the dock's grid button).
  const COMMANDS = [
    ...THEMES.map(([name]) => [`Theme: ${name}`, 'gear', () => applyTheme(name)]),
    ['Lock screen', 'lock', () => lock()], ['Restart', 'gear', () => reboot()], ['Log out to website', 'exe', () => logout()],
    ['Toggle widgets', 'gear', () => setSetting('widgets', !settings.widgets)], ['Toggle night light', 'gear', () => setSetting('night', !settings.night)],
    ['Do not disturb', 'gear', () => setSetting('dnd', !settings.dnd)]
  ];
  function toggleGrid(from = 'dock') {
    const open = appGrid.hidden || appGrid.dataset.from !== from;
    closeMenus();
    if (!open) return;
    const q = h('input', { type: 'search', placeholder: 'Search apps and projects', 'aria-label': 'Search apps', autocomplete: 'off' });
    const grid = h('div', { class: 'start-grid' });
    const entries = Object.entries(APPS).filter(([k]) => k !== 'viewer');
    const render = () => {
      const t = q.value.trim().toLowerCase();
      // Apps first; projects only appear once you search, so the menu stays short.
      const apps = entries.filter(([k, a]) => t ? a.title.toLowerCase().includes(t) : !k.startsWith('case:')).map(([k, a]) => h('button', { type: 'button', role: 'menuitem', onclick: () => openApp(k) }, icon(a.icon, 'start-ic'), h('span', {}, a.title)));
      const cmds = t ? COMMANDS.filter(([label]) => label.toLowerCase().includes(t)).map(([label, ic, fn]) => h('button', { type: 'button', role: 'menuitem', onclick: () => { closeMenus(); fn(); } }, icon(ic, 'start-ic'), h('span', {}, label))) : [];
      grid.replaceChildren(...apps, ...cmds);
    };
    q.addEventListener('input', render);
    q.addEventListener('keydown', e => { if (e.key === 'Enter') grid.querySelector('button')?.click(); if (e.key === 'Escape') closeMenus(); });
    render();
    appGrid.replaceChildren(
      h('div', { class: 'start-head' }, h('img', { src: PROFILE.avatar, alt: '' }), h('div', {}, h('b', {}, 'kesh'), h('span', {}, 'Keshav Jindal'))),
      q, grid,
      h('div', { class: 'start-foot' },
        h('button', { type: 'button', onclick: () => openApp('settings') }, '⚙ Settings'),
        h('button', { type: 'button', onclick: lock }, '⊟ Lock'),
        h('button', { type: 'button', onclick: () => { closeMenus(); reboot(); } }, '⏻ Restart'),
        h('button', { type: 'button', onclick: () => { closeMenus(); logout(); } }, '↩ Website')));
    appGrid.dataset.from = from;
    appGrid.hidden = false;
    if (from === 'top') launcherBtn.classList.add('is-on');
    q.focus();
  }
  function openFlyout(kind, build) {
    const was = !flyout.hidden && flyout.dataset.kind === kind;
    closeMenus();
    if (was) return;
    flyout.dataset.kind = kind;
    flyout.replaceChildren(...build());
    flyout.hidden = false;
  }
  clockBtn.addEventListener('click', e => { e.stopPropagation(); openFlyout('cal', () => { const cal = h('div', { class: 'w-cal' }); calendar(cal); return [h('b', { class: 'fly-time' }, timeStr(new Date())), cal]; }); });
  statusBtn.addEventListener('click', e => {
    e.stopPropagation();
    openFlyout('panel', () => {
      const tile = (key, label, sub) => { const b = h('button', { type: 'button', class: 'cp-tile', onclick: () => setSetting(key, !settings[key]) }, h('b', {}, label), h('span', {}, sub)); onSettings(() => b.classList.toggle('is-on', !!settings[key])); return b; };
      const vol = h('input', { type: 'range', min: 0, max: 100, value: Math.round(player.audio.volume * 100), 'aria-label': 'Volume' });
      vol.addEventListener('input', () => { player.audio.volume = vol.value / 100; player.audio.muted = false; syncPlayer(); });
      const bright = h('input', { type: 'range', min: 30, max: 100, value: settings.brightness, 'aria-label': 'Brightness' });
      bright.addEventListener('input', () => setSetting('brightness', Number(bright.value)));
      return [
        h('label', { class: 'cp-slider' }, h('i', { class: 'st-vol' }), vol),
        h('label', { class: 'cp-slider' }, h('i', { class: 'st-sun' }), bright),
        h('div', { class: 'cp-tiles' }, tile('wifi', 'Wi-Fi', 'KESH_NET'), tile('night', 'Night light', 'Warm'), tile('widgets', 'Widgets', 'Desktop'), tile('dnd', 'Do not disturb', 'Quiet')),
        h('div', { class: 'cp-foot' },
          h('button', { type: 'button', onclick: () => { player.analyser(); player.toggle(); closeMenus(); } }, player.playing ? '❚❚ Pause music' : '▶ Play music'),
          h('button', { type: 'button', onclick: () => openApp('settings') }, '⚙ Settings'),
          h('button', { type: 'button', onclick: lock }, '⊟ Lock'),
          h('button', { type: 'button', onclick: () => { closeMenus(); reboot(); } }, '⏻ Restart'))
      ];
    });
  });
  launcherBtn.addEventListener('click', e => { e.stopPropagation(); toggleGrid('top'); });
  gridBtn.addEventListener('click', e => { e.stopPropagation(); toggleGrid('dock'); });
  for (const el of [appGrid, flyout, ctxMenu]) el.addEventListener('click', e => e.stopPropagation());
  stage.addEventListener('click', () => closeMenus());
  stage.addEventListener('contextmenu', e => {
    if (e.target.closest('.os-window,.os-dock,.os-topbar,.os-widgets')) return;
    e.preventDefault();
    closeMenus();
    const s = stage.getBoundingClientRect();
    const item = (label, fn) => h('button', { type: 'button', onclick: () => { closeMenus(); fn(); } }, label);
    ctxMenu.replaceChildren(item('Open Terminal here', () => openApp('terminal')), item('Open Files', () => openApp('files')),
      item('Next wallpaper', () => setSetting('wallpaper', (settings.wallpaper + 1) % WALLPAPERS.length)),
      item(settings.widgets ? 'Hide widgets' : 'Show widgets', () => setSetting('widgets', !settings.widgets)), item('Settings', () => openApp('settings')));
    Object.assign(ctxMenu.style, { left: `${Math.min(e.clientX - s.left, s.width - 210)}px`, top: `${Math.min(e.clientY - s.top, s.height - 210)}px` });
    ctxMenu.hidden = false;
  });

  /* ---------- desktop icons ---------- */
  iconsEl.addEventListener('click', e => {
    const ic = e.target.closest('.os-icon');
    if (!ic) return;
    for (const i of iconsEl.children) i.classList.toggle('is-sel', i === ic);
    if (ic.dataset.app && (mobile() || e.detail === 0)) openApp(ic.dataset.app);
  });
  iconsEl.addEventListener('dblclick', e => { const ic = e.target.closest('.os-icon[data-app]'); if (ic) openApp(ic.dataset.app); });

  /* ---------- keyboard ---------- */
  const gameKey = down => e => { if (stage.hidden || !focusedKey) return; wins.get(focusedKey)?.content.console?.key(e, down); };
  addEventListener('keydown', gameKey(true));
  addEventListener('keyup', gameKey(false));
  addEventListener('keydown', e => {
    if (stage.hidden) return;
    if (e.key === 'Escape') return closeMenus();
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase(), f = focusedKey;
    const act = { ' ': () => toggleGrid('center'), enter: () => openApp('terminal'), e: () => openApp('files'), w: () => f && closeApp(f), m: () => f && minimize(f),
      f: () => f && toggleMax(f), l: lock, u: toggleFullscreen, t: () => applyTheme(THEMES[(THEMES.findIndex(t => t[1] === settings.accent && t[2] === settings.wallpaper) + 1) % THEMES.length][0]), '/': () => openApp('shortcuts') }[k];
    if (act) { e.preventDefault(); act(); }
  });
  addEventListener('kesh:play', e => {
    if (stage.hidden) return;
    closeApp('arcade');
    setTimeout(() => openApp('arcade', { build: () => arcadeApp(e.detail) }), e.detail ? 180 : 0);
  });
  const notify = notifier(stage, () => settings.dnd);
  void SHORTCUTS;

  registerCommands(Object.entries(APPS).filter(([k]) => k !== 'viewer').map(([k, a]) => ({ group: 'KESH_OS', label: `Open ${a.title}`, when: () => !stage.hidden, run: () => openApp(k) })));

  /* ---------- boot ---------- */
  function reboot() { for (const k of [...wins.keys()]) closeApp(k); runBoot(); }
  function runBoot() {
    boot.hidden = false;
    boot.classList.remove('is-done');
    const lines = ['KESH_OS 26.10 tty1', '', 'kesh login: kesh', `Last login: ${new Date().toDateString()} on tty1`, '', `[ OK ] mounted ~/projects        ${Object.keys(PROJECTS).length} folders`, '[ OK ] mounted ~/elsewhere       interests, path', `[ OK ] started KESH_BOY          ${CARTRIDGES.length} cartridges`, `[ OK ] started music daemon      ${PLAYLIST.length} tracks`, '[ OK ] reached target graphical session'];
    const done = () => {
      if (boot.classList.contains('is-done')) return;
      boot.classList.add('is-done');
      setTimeout(() => { boot.hidden = true; }, 400);
      if (!wins.size) openApp('about');
      setTimeout(() => notify('Welcome back, kesh', 'Alt + Space opens the launcher. Alt + / lists every shortcut.'), 500);
    };
    bootSplash(boot, lines, done);
    boot.onclick = done;
  }
  runBoot();

  // Leaving the desktop hands control back to the host page (the review shell, or the site).
  function logout() { closeMenus(); dispatchEvent(new CustomEvent('kesh:os-exit')); }
  // Arriving from the site's K. button replays the boot, so the switch reads as one transformation.
  addEventListener('kesh:os-boot', () => { if (!boot.hidden) return; runBoot(); });
  addEventListener('review:view', e => {
    if (e.detail === 'desktop') { startTimers(); cursorAccent(ACCENTS[settings.accent % ACCENTS.length][1]); }
    else { stopTimers(); cursorAccent(null); }
  });
  cursorAccent(ACCENTS[settings.accent % ACCENTS.length][1]);
}
