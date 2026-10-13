import { PROJECTS, PROFILE, SHELVES, MILESTONES, PLAYLIST, CARTRIDGES, BOOTS } from './data.js';

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- tiny DOM helper ---------- */
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
}
const ext = href => /^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
export const link = (href, label, cls) => h('a', { href, class: cls, ...ext(href), download: href.endsWith('.pdf') || null }, label);

/* ---------- toast + clipboard ---------- */
let toastTimer;
export function toast(text) {
  let el = document.querySelector('.toast');
  if (!el) { el = h('div', { class: 'toast', role: 'status' }); document.body.append(el); }
  el.textContent = text;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2200);
}
export async function copyEmail() {
  try { await navigator.clipboard.writeText(PROFILE.email); toast(`Copied ${PROFILE.email}`); }
  catch { location.href = `mailto:${PROFILE.email}`; }
}

/* ---------- music: one audio element shared by every surface ---------- */
class Player extends EventTarget {
  constructor() {
    super();
    this.audio = new Audio();
    this.audio.preload = 'none';
    this.index = 0;
    this.audio.addEventListener('ended', () => this.next());
    for (const ev of ['play', 'pause', 'timeupdate', 'loadedmetadata']) this.audio.addEventListener(ev, () => this.emit());
  }
  get track() { return PLAYLIST[this.index]; }
  get playing() { return !this.audio.paused; }
  emit() { this.dispatchEvent(new Event('change')); }
  load(i) {
    this.index = (i + PLAYLIST.length) % PLAYLIST.length;
    this.audio.src = this.track.src;
    this.emit();
  }
  play(i) {
    if (i != null && i !== this.index) this.load(i);
    if (!this.audio.src) this.load(this.index);
    this.audio.play().catch(() => toast('Press play again to allow audio'));
  }
  toggle() { this.playing ? this.audio.pause() : this.play(); }
  next() { const was = this.playing || !this.audio.src; this.load(this.index + 1); if (was) this.play(); }
  prev() { const was = this.playing; this.load(this.index - 1); if (was) this.play(); }
  analyser() {
    if (this._an) return this._an;
    try {
      const ctx = new AudioContext();
      const src = ctx.createMediaElementSource(this.audio);
      this._an = ctx.createAnalyser();
      this._an.fftSize = 64;
      src.connect(this._an).connect(ctx.destination);
      this.audio.addEventListener('play', () => ctx.resume());
    } catch { this._an = null; }
    return this._an;
  }
}
export const player = new Player();

const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';

export function miniPlayer() {
  const title = h('span', { class: 'mini-title' });
  const btn = h('button', { type: 'button', class: 'mini-play', 'aria-label': 'Play or pause music', onclick: () => player.toggle() });
  const next = h('button', { type: 'button', class: 'mini-next', 'aria-label': 'Next track', onclick: () => player.next() }, '»');
  const el = h('div', { class: 'mini-player' }, btn, h('span', { class: 'mini-eq', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')), title, next);
  const sync = () => {
    el.classList.toggle('is-playing', player.playing);
    btn.textContent = player.playing ? '❚❚' : '▶';
    title.textContent = `${player.track.title} / ${player.track.artist}`;
  };
  player.addEventListener('change', sync);
  sync();
  return el;
}

export function musicApp() {
  const cover = h('div', { class: 'music-viz' });
  const canvas = h('canvas', { width: 280, height: 90 });
  cover.append(canvas);
  const now = h('div', { class: 'music-now' });
  const time = h('span', { class: 'music-time' });
  const bar = h('input', { type: 'range', min: 0, max: 1000, value: 0, class: 'music-seek', 'aria-label': 'Seek' });
  bar.addEventListener('input', () => { if (player.audio.duration) player.audio.currentTime = bar.value / 1000 * player.audio.duration; });
  const play = h('button', { type: 'button', class: 'music-btn is-main', onclick: () => { player.analyser(); player.toggle(); } });
  const list = h('ol', { class: 'music-list' }, PLAYLIST.map((t, i) => h('li', {}, h('button', { type: 'button', onclick: () => { player.analyser(); player.play(i); } }, h('b', {}, String(i + 1).padStart(2, '0')), h('span', {}, t.title), h('em', {}, t.artist)))));
  const el = h('div', { class: 'music-app' },
    h('div', { class: 'music-head' }, cover, now, h('div', { class: 'music-ctrls' },
      h('button', { type: 'button', class: 'music-btn', 'aria-label': 'Previous', onclick: () => player.prev() }, '«'), play,
      h('button', { type: 'button', class: 'music-btn', 'aria-label': 'Next', onclick: () => player.next() }, '»')), h('div', { class: 'music-progress' }, bar, time)),
    list);
  const sync = () => {
    play.textContent = player.playing ? '❚❚ PAUSE' : '▶ PLAY';
    now.innerHTML = '';
    now.append(h('b', {}, player.track.title), h('span', {}, player.track.artist));
    const a = player.audio;
    time.textContent = `${fmt(a.currentTime)} / ${fmt(a.duration)}`;
    if (a.duration) bar.value = a.currentTime / a.duration * 1000;
    [...list.children].forEach((li, i) => li.classList.toggle('is-current', i === player.index));
  };
  player.addEventListener('change', sync);
  sync();
  // Visualizer only draws while music plays and the app is on screen.
  const g = canvas.getContext('2d');
  let raf = 0;
  const draw = () => {
    raf = 0;
    if (!el.isConnected) return;
    const an = player._an;
    g.clearRect(0, 0, 280, 90);
    const n = 24, data = new Uint8Array(32);
    if (an) an.getByteFrequencyData(data);
    for (let i = 0; i < n; i++) {
      const v = an ? data[i] / 255 : .08;
      const hgt = Math.max(3, v * 84);
      g.fillStyle = i % 4 === 0 ? '#f1f0e9' : '#15ca91';
      g.fillRect(i * 11.6, 90 - hgt, 8, hgt);
    }
    if (player.playing && !reduceMotion) raf = requestAnimationFrame(draw);
  };
  player.addEventListener('change', () => { if (!raf) raf = requestAnimationFrame(draw); });
  requestAnimationFrame(draw);
  return el;
}

/* ---------- case files: one landing page per project ---------- */
export function caseFile(key, { onNext } = {}) {
  const p = PROJECTS[key];
  const keys = Object.keys(PROJECTS);
  const nextKey = keys[(keys.indexOf(key) + 1) % keys.length];
  const table = p.table && h('figure', { class: 'case-table' },
    h('figcaption', {}, p.table.caption),
    h('table', {}, h('thead', {}, h('tr', {}, p.table.head.map(c => h('th', {}, c)))),
      h('tbody', {}, p.table.rows.map(r => h('tr', {}, r.map((c, i) => h(i ? 'td' : 'th', { class: i === 1 ? 'is-on' : i === 2 ? 'is-off' : null }, c)))))));
  // Projects without a screenshot show their README instead.
  const shot = p.image
    ? h('img', { src: p.image, alt: `${p.title} screenshot`, loading: 'lazy', decoding: 'async' })
    : h('div', { class: 'case-readme' }, h('p', {}, '❯ cat README.md'), h('b', {}, `# ${p.title}`), h('span', {}, p.tagline));
  return h('article', { class: 'case' },
    h('header', { class: 'case-hero' },
      h('div', { class: 'case-copy' },
        h('p', { class: 'case-kicker' }, h('span', {}, p.n), ` ${p.kind}`),
        h('h1', {}, p.title),
        h('p', { class: 'case-tagline' }, p.tagline),
        h('div', { class: 'case-actions' }, p.url && link(p.url, p.key === 'gates' ? 'READ RESEARCH ↗' : 'OPEN LIVE SITE ↗', 'btn btn-solid'), link(p.source, 'VIEW SOURCE ↗', p.url ? 'btn' : 'btn btn-solid')),
        h('ul', { class: 'case-stack', 'aria-label': 'Stack' }, p.stack.map(s => h('li', {}, s)))),
      h('figure', { class: 'case-shot' }, h('div', { class: 'case-url' }, h('i'), h('i'), h('i'), h('span', {}, p.host)), shot)),
    (p.status || p.facts) && h('section', { class: 'case-body' },
      h('div', { class: 'case-summary' }, h('h2', {}, '// WHAT IT IS'), h('p', {}, p.summary), p.status && h('p', { class: 'case-status' }, h('b', {}, 'STATUS'), ` ${p.status}`)),
      p.facts && h('dl', { class: 'case-facts' }, p.facts.map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v))))),
    table,
    p.points?.length > 0 && h('section', { class: 'case-points' }, h('h2', {}, '// HOW IT WORKS'), h('ol', {}, p.points.map(([t, d]) => h('li', {}, h('b', {}, t), h('span', {}, d))))),
    h('footer', { class: 'case-next' }, h('span', {}, 'NEXT CASE FILE'), h('button', { type: 'button', onclick: () => onNext?.(nextKey) }, `${PROJECTS[nextKey].n} / ${PROJECTS[nextKey].title} →`)));
}

/* ---------- elsewhere: interests behind six symbols, milestones on their own ---------- */
const playCart = file => dispatchEvent(new CustomEvent('kesh:play', { detail: file || null }));
const ICONS = {
  hobbies: '<path d="M20 4c-7 1-12 6-13 13l-3 3M7 17c4 0 7-2 9-5M10 13h5"/>',
  film: '<rect x="3" y="7" width="18" height="13" rx="1"/><path d="M3 7l3-4h3l-3 4M10 7l3-4h3l-3 4M17 7l3-4"/>',
  ink: '<path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"/>',
  tv: '<rect x="3" y="7" width="18" height="12" rx="1"/><path d="M8 3l4 4 4-4"/>',
  music: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
  games: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M18 12.5h.01"/>'
};
const svgIcon = k => h('span', { class: 'el-ic', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>` });

export function interests({ tab = 'hobbies' } = {}) {
  // Six shelves, the same as the site's: anime and manga share one.
  const ink = SHELVES.find(s => s.key === 'manga').items.concat(SHELVES.find(s => s.key === 'anime').items);
  const games = SHELVES.find(s => s.key === 'games').items;
  const shelves = [
    ['hobbies', 'Hobbies', SHELVES.find(s => s.key === 'hobbies').items],
    ['film', 'Film', SHELVES.find(s => s.key === 'cinema').items],
    ['ink', 'Anime & manga', ink],
    ['tv', 'TV', SHELVES.find(s => s.key === 'tv').items],
    ['music', 'Music', SHELVES.find(s => s.key === 'music').items],
    ['games', 'Games', games]
  ];
  const panel = h('div', { class: 'shelf-panel', role: 'tabpanel' });
  const bar = h('div', { class: 'el-tabs', role: 'tablist', 'aria-label': 'Interests' });
  const show = key => {
    for (const b of bar.children) b.setAttribute('aria-selected', String(b.dataset.key === key));
    const [, , items] = shelves.find(s => s[0] === key);
    panel.replaceChildren(h('div', { class: 'shelf' }, items.map(it => h('figure', { class: 'shelf-item' },
      h('img', { src: it.image, alt: it.title, loading: 'lazy', decoding: 'async' }),
      h('figcaption', {}, h('b', {}, it.title), h('span', {}, it.sub))))));
    if (key === 'music') panel.append(h('button', { type: 'button', class: 'btn btn-solid shelf-cta', onclick: () => player.toggle() }, '▶ Play the playlist'));
    if (key === 'games') panel.append(h('button', { type: 'button', class: 'btn btn-solid shelf-cta', onclick: () => playCart() }, '▶ Insert cartridge'));
  };
  for (const [key, label] of shelves) bar.append(h('button', { type: 'button', role: 'tab', 'data-key': key, 'aria-label': label, title: label, onclick: () => show(key) }, svgIcon(key)));
  bar.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const btns = [...bar.children], i = btns.indexOf(document.activeElement);
    const n = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
    n.focus(); n.click();
  });
  show(shelves.some(s => s[0] === tab) ? tab : 'hobbies');
  const path = h('ol', { class: 'milestones' }, MILESTONES.map(([y, t, d]) => h('li', {}, h('b', {}, y), h('div', {}, h('strong', {}, t), h('p', {}, d)))));
  return h('div', { class: 'interests' },
    h('header', { class: 'el-head' }, h('h2', {}, 'elsewhere'), h('p', {}, 'things i like, in no particular order.')),
    h('div', { class: 'profile' },
      h('img', { src: PROFILE.avatar, alt: 'Kesh', class: 'profile-pic', loading: 'lazy' }),
      h('div', {}, h('h3', {}, 'KESH ', h('img', { src: '/garchomp.gif', alt: 'Garchomp', class: 'profile-chomp', title: 'Hold on, he wakes up', onclick: () => playCart() })), h('p', {}, PROFILE.bio),
        h('p', { class: 'profile-links' }, PROFILE.links.map(([l, u]) => link(u, `${l} ↗`)), h('span', {}, PROFILE.aside)))),
    bar, panel,
    h('section', { class: 'el-path' }, h('h3', {}, 'path'), path));
}

/* ---------- emulator: the original secret game, driven over postMessage ---------- */
const PAD = { B: 0, SELECT: 2, START: 3, UP: 4, DOWN: 5, LEFT: 6, RIGHT: 7, A: 8, L: 10, R: 11 };
const KEYS = { z: 'A', x: 'B', c: 'START', v: 'SELECT', a: 'L', s: 'R', arrowup: 'UP', arrowdown: 'DOWN', arrowleft: 'LEFT', arrowright: 'RIGHT' };

export function gameConsole({ cart: startCart } = {}) {
  let frame = null, started = false, muted = false;
  const screen = h('div', { class: 'gba-screen' });
  const status = h('span', { class: 'gba-status' }, 'INSERT CARTRIDGE');
  const send = msg => frame?.contentWindow?.postMessage(msg, location.origin);
  const press = (btn, on) => {
    if (!started) return;
    send({ command: 'input', index: PAD[btn], pressed: on });
    el.querySelector(`[data-btn="${btn}"]`)?.classList.toggle('is-down', on);
  };
  const picker = () => {
    frame?.remove(); frame = null; started = false;
    status.textContent = 'INSERT CARTRIDGE';
    screen.replaceChildren(h('div', { class: 'gba-carts' },
      h('p', {}, '▸ SELECT A CARTRIDGE'),
      h('div', { class: 'gba-cart-grid' }, CARTRIDGES.map(c => h('button', { type: 'button', onclick: () => boot(c) }, h('img', { src: c.cover, alt: '', loading: 'lazy' }), h('span', {}, c.label.replace('Pokemon ', '')), h('em', {}, `${c.mb} MB`))))));
  };
  const boot = cart => {
    const gif = BOOTS[Math.floor(Math.random() * BOOTS.length)];
    screen.replaceChildren(h('img', { class: 'gba-boot', src: gif, alt: '' }));
    status.textContent = `LOADING ${cart.label.toUpperCase()}`;
    const rom = new URL(`/secret-game/roms/${cart.file}`, location.href).href;
    frame = h('iframe', { class: 'gba-frame', title: cart.label, tabindex: '-1', src: `/secret-game/index.html#rom=${encodeURIComponent(rom)}&name=${encodeURIComponent(cart.label)}` });
    screen.append(frame);
  };
  const onMsg = e => {
    if (!frame || e.source !== frame.contentWindow) return;
    if (e.data?.type === 'sg:started') { started = true; status.textContent = 'PLAYING'; screen.querySelector('.gba-boot')?.remove(); }
    if (e.data?.type === 'sg:error') status.textContent = e.data.message.toUpperCase();
  };
  addEventListener('message', onMsg);
  const btn = (name, label, cls = '') => h('button', { type: 'button', class: `gba-btn ${cls}`, 'data-btn': name, 'aria-label': name,
    onpointerdown: e => { e.preventDefault(); press(name, true); }, onpointerup: () => press(name, false), onpointerleave: () => press(name, false) }, label);
  const el = h('div', { class: 'gba' },
    h('div', { class: 'gba-shoulders' }, btn('L', 'L', 'is-shoulder'), h('span', { class: 'gba-brand' }, 'KESH', h('b', {}, '_'), 'BOY'), btn('R', 'R', 'is-shoulder')),
    h('div', { class: 'gba-body' },
      h('div', { class: 'gba-dpad' }, btn('UP', '▲', 'up'), btn('LEFT', '◀', 'left'), btn('RIGHT', '▶', 'right'), btn('DOWN', '▼', 'down')),
      h('div', { class: 'gba-bezel' }, screen, h('div', { class: 'gba-bar' }, h('i', { class: 'live-dot' }), status)),
      h('div', { class: 'gba-ab' }, btn('B', 'B', 'b'), btn('A', 'A', 'a'))),
    h('div', { class: 'gba-foot' }, btn('SELECT', 'SELECT', 'is-pill'), btn('START', 'START', 'is-pill'),
      h('button', { type: 'button', class: 'gba-tool', onclick: () => { muted = !muted; send({ command: 'volume', volume: muted ? 0 : 1 }); } }, 'MUTE'),
      h('button', { type: 'button', class: 'gba-tool', onclick: picker }, 'EJECT')),
    h('p', { class: 'gba-keys' }, 'Z / X = A / B · C = START · V = SELECT · A / S = L / R · ARROWS = D-PAD'));
  const first = CARTRIDGES.find(c => c.file === startCart);
  first ? boot(first) : picker();
  // Keys only reach the game while its host says it is active.
  const api = {
    el, active: false,
    key(e, down) {
      const btnName = KEYS[e.key.toLowerCase()];
      if (!btnName || !started || e.target.closest?.('input,textarea')) return false;
      e.preventDefault();
      if (!e.repeat) press(btnName, down);
      return true;
    },
    destroy() { removeEventListener('message', onMsg); frame?.remove(); }
  };
  return api;
}

/* ---------- full-screen sheet with hash routes (01 and 02 use it) ---------- */
let sheet, sheetBody, sheetTitle, sheetCleanup = null, lastFocus = null;
function ensureSheet() {
  if (sheet) return;
  sheetTitle = h('span', { class: 'sheet-title' });
  sheetBody = h('div', { class: 'sheet-body' });
  sheet = h('dialog', { class: 'sheet', 'aria-label': 'Detail' },
    h('div', { class: 'sheet-bar' }, h('span', { class: 'sheet-dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')), sheetTitle,
      h('button', { type: 'button', class: 'sheet-close', onclick: () => closeSheet() }, 'ESC ×')),
    sheetBody);
  sheet.addEventListener('cancel', e => { e.preventDefault(); closeSheet(); });
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  document.body.append(sheet);
}
export function openSheet(route, { push = true } = {}) {
  ensureSheet();
  sheetCleanup?.();
  sheetCleanup = null;
  const [kind, key] = route.split('/');
  let body, title;
  if (kind === 'case' && PROJECTS[key]) { title = `~/projects/${key}/README.md`; body = caseFile(key, { onNext: k => openSheet(`case/${k}`) }); }
  else if (kind === 'interests') { title = '~/elsewhere/'; body = interests({ tab: key }); }
  else if (kind === 'arcade') {
    title = '~/elsewhere/kesh_boy.exe';
    const c = gameConsole({ cart: key });
    const kd = e => c.key(e, true), ku = e => c.key(e, false);
    addEventListener('keydown', kd); addEventListener('keyup', ku);
    sheetCleanup = () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku); c.destroy(); };
    body = h('div', { class: 'arcade' }, c.el);
  }
  else if (kind === 'music') { title = '~/elsewhere/playlist.m3u'; body = musicApp(); }
  else return;
  sheetTitle.textContent = title;
  sheetBody.replaceChildren(body);
  sheetBody.scrollTop = 0;
  if (!sheet.open) { lastFocus = document.activeElement; sheet.showModal(); }
  if (push && location.hash !== `#/${route}`) history.pushState({ sheet: route }, '', `${location.search}#/${route}`);
}
export function closeSheet({ fromPop = false } = {}) {
  if (!sheet?.open) return;
  sheetCleanup?.(); sheetCleanup = null;
  sheet.close();
  sheetBody.replaceChildren();
  lastFocus?.focus?.({ preventScroll: true });
  if (!fromPop && location.hash) history.pushState(null, '', location.search);
}
export function routeFromHash() {
  const m = location.hash.match(/^#\/(.+)$/);
  if (m) openSheet(m[1], { push: false }); else closeSheet({ fromPop: true });
}
addEventListener('popstate', routeFromHash);

/* ---------- command palette (Ctrl+K or /) ---------- */
const commands = [];
export function registerCommands(list) { commands.push(...list); }
let pal;
function ensurePalette() {
  if (pal) return pal;
  const input = h('input', { type: 'text', placeholder: 'Type a command...', 'aria-label': 'Command', autocomplete: 'off', spellcheck: 'false' });
  const list = h('ul', { class: 'pal-list', role: 'listbox' });
  const dlg = h('dialog', { class: 'palette', 'aria-label': 'Command palette' }, h('div', { class: 'pal-input' }, h('span', {}, '>'), input, h('kbd', {}, 'ESC')), list);
  let sel = 0, shown = [];
  const render = () => {
    const q = input.value.trim().toLowerCase();
    shown = commands.filter(c => !c.when || c.when()).filter(c => !q || `${c.group} ${c.label}`.toLowerCase().includes(q)).slice(0, 12);
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.replaceChildren(...shown.map((c, i) => h('li', { role: 'option', 'aria-selected': String(i === sel), onclick: () => run(c), onpointermove: () => { if (sel !== i) { sel = i; render(); } } }, h('em', {}, c.group), h('span', {}, c.label), c.hint && h('kbd', {}, c.hint))));
    if (!shown.length) list.append(h('li', { class: 'pal-empty' }, 'zsh: no matches'));
  };
  const run = c => { dlg.close(); c.run(); };
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
    if (e.key === 'Enter' && shown[sel]) { e.preventDefault(); run(shown[sel]); }
  });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  document.body.append(dlg);
  pal = { open() { input.value = ''; sel = 0; render(); if (!dlg.open) dlg.showModal(); input.focus(); } };
  return pal;
}
export const openPalette = () => ensurePalette().open();
addEventListener('keydown', e => {
  const typing = e.target.closest?.('input,textarea,[contenteditable]');
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing && !document.querySelector('dialog[open]'))) { e.preventDefault(); openPalette(); }
});

registerCommands([
  ...Object.values(PROJECTS).map(p => ({ group: 'CASE FILE', label: p.title, run: () => openSheet(`case/${p.key}`) })),
  { group: 'ELSEWHERE', label: 'Interests, media and hobbies', run: () => openSheet('interests') },
  { group: 'ELSEWHERE', label: 'Play KESH_BOY (emulator)', run: () => openSheet('arcade') },
  { group: 'MUSIC', label: 'Play / pause', hint: '', run: () => player.toggle() },
  { group: 'MUSIC', label: 'Next track', run: () => player.next() },
  { group: 'MUSIC', label: 'Open playlist', run: () => openSheet('music') },
  { group: 'CONTACT', label: `Copy email (${PROFILE.email})`, run: copyEmail },
  { group: 'CONTACT', label: 'Download resume', run: () => { const a = link(PROFILE.resume, ''); document.body.append(a); a.click(); a.remove(); } },
  { group: 'CONTACT', label: 'Open GitHub', run: () => open(PROFILE.github, '_blank', 'noopener') },
  { group: 'CONTACT', label: 'Open LinkedIn', run: () => open(PROFILE.linkedin, '_blank', 'noopener') }
]);
