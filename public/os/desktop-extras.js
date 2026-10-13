import { h, reduceMotion } from './shared.js';

// Apps and system surfaces for KESH_OS that don't belong to the window manager itself.

/* ---------- Scribble: a pressure-free sketch pad ---------- */
export function scribbleApp() {
  const canvas = h('canvas', { class: 'scr-canvas' });
  const ctx = canvas.getContext('2d');
  const inks = [['Accent', 'var'], ['Paper', '#f1f0e9'], ['Ink', '#080a09']];
  let ink = 0, size = 4, erasing = false, drawing = false, last = null;
  const colour = () => (inks[ink][1] === 'var' ? getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#15ca91' : inks[ink][1]);
  const fit = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const keep = canvas.width ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = ctx.lineJoin = 'round';
    if (keep) ctx.putImageData(keep, 0, 0);
  };
  const at = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', e => { drawing = true; last = at(e); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = at(e);
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = colour();
    ctx.lineWidth = erasing ? size * 4 : size;
    ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke();
    last = p;
  });
  const stop = () => { drawing = false; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
  const tools = h('div', { class: 'scr-tools' });
  const render = () => tools.replaceChildren(
    ...inks.map(([name, c], i) => h('button', { type: 'button', class: `scr-ink${i === ink && !erasing ? ' is-on' : ''}`, title: name, 'aria-label': name, style: c === 'var' ? 'background:var(--accent)' : `background:${c}`, onclick: () => { ink = i; erasing = false; render(); } })),
    h('button', { type: 'button', class: `scr-btn${erasing ? ' is-on' : ''}`, onclick: () => { erasing = !erasing; render(); } }, 'Eraser'),
    h('label', { class: 'scr-size' }, 'Size', (() => { const r = h('input', { type: 'range', min: 1, max: 24, value: size, 'aria-label': 'Brush size' }); r.addEventListener('input', () => { size = Number(r.value); }); return r; })()),
    h('button', { type: 'button', class: 'scr-btn', onclick: () => ctx.clearRect(0, 0, canvas.width, canvas.height) }, 'Clear'),
    h('button', { type: 'button', class: 'scr-btn', onclick: () => { const a = h('a', { href: canvas.toDataURL('image/png'), download: 'scribble.png' }); a.click(); } }, 'Save PNG'));
  render();
  const el = h('div', { class: 'app-scribble' }, tools, canvas);
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);
  return { el, destroy: () => ro.disconnect() };
}

/* ---------- Calculator: immediate-execution, no eval ---------- */
export function calculatorApp() {
  let shown = '0', acc = null, op = null, fresh = true;
  const display = h('output', { class: 'calc-out', 'aria-live': 'polite' }, shown);
  const sub = h('span', { class: 'calc-sub' });
  const apply = (a, b, o) => o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : o === '÷' ? (b === 0 ? NaN : a / b) : b;
  const fmt = n => !isFinite(n) ? 'Error' : String(Number(n.toPrecision(12)));
  const show = () => { display.textContent = shown; sub.textContent = acc !== null && op ? `${fmt(acc)} ${op}` : ''; };
  const press = k => {
    if (/^\d$/.test(k)) { shown = fresh || shown === '0' ? k : shown + k; fresh = false; }
    else if (k === '.') { if (fresh) { shown = '0.'; fresh = false; } else if (!shown.includes('.')) shown += '.'; }
    else if ('+−×÷'.includes(k)) {
      const v = Number(shown);
      if (op !== null && !fresh) acc = apply(acc, v, op); // chain: 2 + 3 × ... shows 5 first
      else if (op === null) acc = v;                        // first operator
      shown = fmt(acc); op = k; fresh = true;               // pressing two operators just switches
    }
    else if (k === '=') { if (op !== null) { shown = fmt(apply(acc, Number(shown), op)); acc = null; op = null; fresh = true; } }
    else if (k === 'C') { shown = '0'; acc = null; op = null; fresh = true; }
    else if (k === '±') shown = fmt(-Number(shown));
    else if (k === '%') shown = fmt(Number(shown) / 100);
    else if (k === '⌫') { shown = fresh || shown.length < 2 ? '0' : shown.slice(0, -1); }
    show();
  };
  const keys = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '⌫', '='];
  const pad = h('div', { class: 'calc-pad' }, keys.map(k => h('button', { type: 'button', class: `calc-key${'+−×÷='.includes(k) ? ' is-op' : ''}${k === '=' ? ' is-eq' : ''}`, onclick: () => press(k) }, k)));
  const el = h('div', { class: 'app-calc', tabindex: '0', onkeydown: e => {
    const map = { '+': '+', '-': '−', '*': '×', 'x': '×', '/': '÷', 'Enter': '=', '=': '=', 'Escape': 'C', 'Backspace': '⌫', '%': '%', '.': '.' };
    const k = /^\d$/.test(e.key) ? e.key : map[e.key];
    if (k) { e.preventDefault(); e.stopPropagation(); press(k); }
  } }, h('div', { class: 'calc-screen' }, sub, display), pad);
  setTimeout(() => el.focus({ preventScroll: true }), 50);
  return el;
}

/* ---------- Live system stats: one sampler, shared by the monitor app and its widget ---------- */
// Every number is read from this browser tab. Anything the browser does not expose stays null
// and is shown as n/a; nothing is simulated.
const HIST = 60;
const stats = { fps: [], heap: [], blocked: [], now: {} };
const subs = new Set();
const hasLongTasks = typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes?.includes('longtask');
let frames = 0, lastT = 0, raf = 0, timer = 0, longMs = 0, observer = null, battery = null, storage = null, slow = 0;
const push = (arr, v) => { arr.push(v); if (arr.length > HIST) arr.shift(); };
const countFrame = () => { frames++; raf = requestAnimationFrame(countFrame); };
function resources() {
  const groups = { image: [0, 0], script: [0, 0], style: [0, 0], fetch: [0, 0], media: [0, 0], other: [0, 0] };
  const kind = t => t === 'img' || t === 'image' ? 'image' : t === 'script' ? 'script' : t === 'css' || t === 'link' ? 'style' : t === 'fetch' || t === 'xmlhttprequest' ? 'fetch' : t === 'video' || t === 'audio' ? 'media' : 'other';
  for (const r of performance.getEntriesByType('resource')) { const g = groups[kind(r.initiatorType)]; g[0]++; g[1] += r.encodedBodySize || r.transferSize || 0; }
  return groups;
}
function sample() {
  const t = performance.now(), span = t - lastT;
  push(stats.fps, Math.round(frames * 1000 / span));
  push(stats.blocked, hasLongTasks ? Math.min(100, Math.round(longMs / span * 100)) : null);
  frames = 0; longMs = 0; lastT = t;
  const mem = performance.memory, con = navigator.connection;
  push(stats.heap, mem ? mem.usedJSHeapSize / 1048576 : null);
  if (slow++ % 10 === 0) navigator.storage?.estimate?.().then(e => { storage = e; }).catch(() => {});
  stats.now = {
    fps: stats.fps.at(-1), peakFps: Math.max(60, ...stats.fps), blocked: stats.blocked.at(-1),
    heapUsed: mem ? mem.usedJSHeapSize / 1048576 : null, heapLimit: mem ? mem.jsHeapSizeLimit / 1048576 : null,
    storageUsed: storage ? storage.usage / 1048576 : null, storageQuota: storage ? storage.quota / 1048576 : null,
    battery: battery ? Math.round(battery.level * 100) : null, charging: battery?.charging ?? null,
    net: con ? { type: con.effectiveType, down: con.downlink, rtt: con.rtt } : null, online: navigator.onLine,
    threads: navigator.hardwareConcurrency || null, deviceMemory: navigator.deviceMemory || null,
    dom: document.getElementsByTagName('*').length, resources: resources()
  };
  subs.forEach(fn => fn(stats));
}
// Subscribing starts the sampler; the last unsubscribe stops it, so a closed monitor costs nothing.
export function watchStats(fn) {
  subs.add(fn);
  if (subs.size === 1) {
    lastT = performance.now(); frames = 0;
    raf = requestAnimationFrame(countFrame);
    timer = setInterval(sample, 1000);
    if (hasLongTasks) { observer = new PerformanceObserver(list => { for (const e of list.getEntries()) longMs += e.duration; }); observer.observe({ type: 'longtask' }); }
    if (!battery && navigator.getBattery) navigator.getBattery().then(b => { battery = b; }).catch(() => {});
  }
  if (stats.fps.length) fn(stats);
  return () => {
    subs.delete(fn);
    if (subs.size) return;
    cancelAnimationFrame(raf); clearInterval(timer); observer?.disconnect(); observer = null;
  };
}

const accentOf = el => getComputedStyle(el).getPropertyValue('--accent').trim() || '#15ca91';
// A line or bar chart on a canvas sized to its box. Null points are gaps.
function chart(canvas, data, { max, bars = false, grid = 3 } = {}) {
  const dpr = Math.min(devicePixelRatio || 1, 2), w = canvas.clientWidth, ht = canvas.clientHeight;
  if (!w || !ht) return;
  if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(ht * dpr); }
  const g = canvas.getContext('2d'), acc = accentOf(canvas);
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, ht);
  g.strokeStyle = '#f1f0e914'; g.lineWidth = 1;
  for (let i = 1; i <= grid; i++) { const y = Math.round(ht * i / (grid + 1)) + .5; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  const step = w / (HIST - 1), x0 = w - (data.length - 1) * step, y = v => ht - 2 - Math.min(v, max) / max * (ht - 6);
  if (bars) {
    g.fillStyle = acc;
    data.forEach((v, i) => { if (v == null) return; g.globalAlpha = .35 + Math.min(v, max) / max * .65; const hh = Math.max(1, ht - 2 - y(v)); g.fillRect(x0 + i * step - step * .35, ht - 2 - hh, step * .7, hh); });
    g.globalAlpha = 1;
    return;
  }
  const pts = data.map((v, i) => (v == null ? null : [x0 + i * step, y(v)])).filter(Boolean);
  if (pts.length < 2) return;
  const hex = /^#[0-9a-f]{6}$/i.test(acc) ? acc : '#15ca91', fill = g.createLinearGradient(0, 0, 0, ht);
  fill.addColorStop(0, `${hex}33`);
  fill.addColorStop(1, `${hex}00`);
  g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
  g.lineTo(pts.at(-1)[0], ht); g.lineTo(pts[0][0], ht); g.closePath();
  g.fillStyle = fill;
  g.fill();
  g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
  g.strokeStyle = acc; g.lineWidth = 1.5; g.stroke();
  const [lx, ly] = pts.at(-1);
  g.fillStyle = acc; g.beginPath(); g.arc(lx - 1, ly, 2.5, 0, Math.PI * 2); g.fill();
}
// A ring gauge: pct 0-100, or null for "not exposed".
function gauge(label) {
  const C = 2 * Math.PI * 26;
  const svg = h('div', { class: 'mon-ring', html: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" class="mon-ring-bg"/><circle cx="32" cy="32" r="26" class="mon-ring-fg" stroke-dasharray="0 ${C}"/></svg>` });
  const value = h('b'), sub = h('span');
  const el = h('div', { class: 'mon-gauge' }, svg, h('div', { class: 'mon-gauge-txt' }, h('em', {}, label), value, sub));
  const fg = svg.querySelector('.mon-ring-fg');
  return { el, set(pct, text, detail = '') {
    el.classList.toggle('is-na', pct == null);
    fg.setAttribute('stroke-dasharray', `${pct == null ? 0 : Math.max(0, Math.min(100, pct)) / 100 * C} ${C}`);
    value.textContent = pct == null ? 'n/a' : text; sub.textContent = pct == null ? 'not exposed' : detail;
  } };
}
const mb = v => (v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v.toFixed(0)} MB`);
const kb = b => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
const avg = a => { const v = a.filter(x => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };

/* ---------- System monitor: a translucent panel of live charts ---------- */
export function monitorApp({ bootedAt, windowCount }) {
  const up = h('span', { class: 'mon-up' });
  const g = { fps: gauge('FRAME RATE'), cpu: gauge('MAIN THREAD'), heap: gauge('JS HEAP'), disk: gauge('STORAGE'), batt: gauge('BATTERY') };
  const card = (title, canvas, legend) => h('section', { class: 'mon-card' }, h('header', {}, h('em', {}, title), legend), canvas);
  const fpsC = h('canvas', { class: 'mon-chart' }), cpuC = h('canvas', { class: 'mon-chart' }), heapC = h('canvas', { class: 'mon-chart' });
  const fpsL = h('span'), cpuL = h('span'), heapL = h('span');
  const loads = h('div', { class: 'mon-bars' });
  const specs = h('dl', { class: 'mon-specs' });
  const el = h('div', { class: 'app-monitor' },
    h('header', { class: 'mon-top' }, h('span', { class: 'mon-live' }, h('i'), 'LIVE'), h('b', {}, 'SYSTEM MONITOR'), up),
    h('div', { class: 'mon-gauges' }, Object.values(g).map(x => x.el)),
    h('div', { class: 'mon-grid' },
      card('FPS / 60S', fpsC, h('span', { title: 'min / avg / max' }, fpsL)), card('MAIN THREAD / 60S', cpuC, cpuL), card('JS HEAP / 60S', heapC, heapL),
      h('section', { class: 'mon-card' }, h('header', {}, h('em', {}, 'LOADED THIS SESSION')), loads),
      h('section', { class: 'mon-card mon-card-wide' }, h('header', {}, h('em', {}, 'DEVICE')), specs)),
    h('p', { class: 'mon-note' }, 'Live readings from this browser tab. Main thread is the share of each second spent in long tasks (over 50 ms). Anything the browser does not expose shows n/a.'));
  const render = ({ fps, heap, blocked, now: n }) => {
    const s = Math.floor((Date.now() - bootedAt) / 1000);
    up.textContent = `UP ${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    g.fps.set(n.fps / n.peakFps * 100, `${n.fps}`, `fps of ${n.peakFps}`);
    g.cpu.set(n.blocked, `${n.blocked}%`, 'busy');
    g.heap.set(n.heapUsed == null ? null : n.heapUsed / n.heapLimit * 100, n.heapUsed == null ? '' : mb(n.heapUsed), n.heapLimit == null ? '' : `of ${mb(n.heapLimit)}`);
    g.disk.set(n.storageUsed == null ? null : n.storageUsed / n.storageQuota * 100, n.storageUsed == null ? '' : `${(n.storageUsed / n.storageQuota * 100).toFixed(2)}%`, n.storageQuota == null ? '' : `of ${mb(n.storageQuota)}`);
    g.batt.set(n.battery, `${n.battery}%`, n.charging ? 'charging' : 'on battery');
    const f = fps.filter(x => x != null);
    fpsL.textContent = `${Math.min(...f)} / ${Math.round(avg(f))} / ${Math.max(...f)}`;
    cpuL.textContent = n.blocked == null ? 'n/a here' : `avg ${Math.round(avg(blocked))}%`;
    heapL.textContent = n.heapUsed == null ? 'n/a here' : mb(n.heapUsed);
    chart(fpsC, fps, { max: n.peakFps });
    chart(cpuC, blocked, { max: 100, bars: true });
    chart(heapC, heap, { max: Math.max(...heap.filter(x => x != null), 1) * 1.25 });
    const groups = Object.entries(n.resources), top = Math.max(...groups.map(([, [, b]]) => b), 1);
    loads.replaceChildren(...groups.map(([k, [count, bytes]]) => h('div', { class: 'mon-bar' }, h('span', {}, k), h('i', {}, h('b', { style: `width:${bytes / top * 100}%` })), h('em', {}, `${count} / ${kb(bytes)}`))));
    const spec = [['CPU threads', n.threads ?? 'n/a'], ['Device memory', n.deviceMemory ? `~${n.deviceMemory} GB` : 'n/a'], ['Screen', `${screen.width} x ${screen.height} @ ${devicePixelRatio}x`],
      ['Network', n.online ? (n.net ? `${n.net.type}, ${n.net.down} Mb/s, ${n.net.rtt} ms` : 'online') : 'offline'], ['DOM nodes', n.dom.toLocaleString()], ['Windows open', windowCount()]];
    specs.replaceChildren(...spec.map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, String(v)))));
  };
  const stop = watchStats(render);
  return { el, destroy: stop };
}

/* ---------- Monitor widget: the same sampler, at a glance ---------- */
export function monitorWidget(onOpen) {
  const spark = h('canvas', { class: 'w-spark' });
  const meter = label => { const fill = h('b'), val = h('em'); return { el: h('div', { class: 'w-meter' }, h('span', {}, label), h('i', {}, fill), val), set: (pct, text) => { fill.style.width = `${pct == null ? 0 : Math.min(100, pct)}%`; val.textContent = pct == null ? 'n/a' : text; } }; };
  const m = { fps: meter('FPS'), cpu: meter('MAIN'), heap: meter('HEAP') };
  const el = h('button', { type: 'button', class: 'widget w-mon', onclick: onOpen, 'aria-label': 'Open System Monitor' },
    h('span', { class: 'w-label' }, 'SYSTEM'), spark, ...Object.values(m).map(x => x.el));
  let stop = null;
  const render = ({ fps, now: n }) => {
    chart(spark, fps, { max: n.peakFps, grid: 1 });
    m.fps.set(n.fps / n.peakFps * 100, String(n.fps));
    m.cpu.set(n.blocked, `${n.blocked}%`);
    m.heap.set(n.heapUsed == null ? null : n.heapUsed / n.heapLimit * 100, n.heapUsed == null ? '' : mb(n.heapUsed));
  };
  return { el, start: () => { stop ??= watchStats(render); }, stop: () => { stop?.(); stop = null; } };
}

/* ---------- Camera: asks for the camera only when it opens, never before ---------- */
const SHOT_W = 1200, SHOT_H = 900;
const FRAMES = ['None', 'Polaroid', 'Film', 'Terminal', 'Manga', 'Dune', 'Riso'];
const MONO = '"JetBrains Mono", monospace';
const BW = 'grayscale(1) contrast(1.12)';
// Static textures (grain, scanlines, halftone, speed lines, vignette) are drawn once and reused, so a
// frame of the live preview costs a few drawImage calls rather than thousands of shapes.
const textures = new Map();
function texture(key, draw) {
  if (!textures.has(key)) {
    const c = document.createElement('canvas'); c.width = SHOT_W; c.height = SHOT_H;
    draw(c.getContext('2d'), SHOT_W, SHOT_H);
    textures.set(key, c);
  }
  return textures.get(key);
}
const grain = () => texture('grain', (g, W, H) => {
  const img = g.createImageData(W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const v = 128 + (Math.random() - .5) * 150; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  g.putImageData(img, 0, 0);
});
const vignette = () => texture('vignette', (g, W, H) => {
  const r = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .85);
  r.addColorStop(0, 'rgba(0,0,0,0)'); r.addColorStop(1, 'rgba(0,0,0,.6)');
  g.fillStyle = r; g.fillRect(0, 0, W, H);
});
const scanlines = () => texture('scan', (g, W, H) => { g.fillStyle = 'rgba(0,0,0,.28)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2); });
// Screentone dots that thicken toward the lower right, and speed lines bursting from behind the bubble.
const halftone = () => texture('halftone', (g, W, H) => {
  g.fillStyle = '#111';
  for (let y = 0; y < H; y += 12) for (let x = (y / 12) % 2 ? 6 : 0; x < W; x += 12) {
    const t = Math.max(0, (x / W + y / H - 1.05) / .95);
    if (t > 0) { g.beginPath(); g.arc(x, y, t * 5.5, 0, Math.PI * 2); g.fill(); }
  }
});
const speedLines = () => texture('speed', (g, W, H) => {
  const cx = W * .22, cy = H * .2, rnd = (a, b) => a + Math.random() * (b - a);
  g.fillStyle = '#0a0a0a';
  for (let i = 0; i < 70; i++) {
    const a = (i / 70) * Math.PI * 2 + rnd(-.03, .03), w = rnd(.004, .012), r0 = rnd(H * .62, H * .8), r1 = Math.hypot(W, H);
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a - w) * r1, cy + Math.sin(a - w) * r1);
    g.lineTo(cx + Math.cos(a + w) * r1, cy + Math.sin(a + w) * r1);
    g.fill();
  }
});
// A manga speech bubble that sizes itself to the text, with the tail merged into the outline.
function bubble(g, text, x, y, tipX, tipY) {
  g.save();
  g.translate(x, y); g.rotate(-.05);
  g.font = '56px "Archivo Black", sans-serif';
  const rx = g.measureText(text).width / 2 + 70, ry = 74;
  const tail = () => { g.beginPath(); g.moveTo(rx * .25, ry * .55); g.quadraticCurveTo(rx * .45, ry * 1.1, tipX - x, tipY - y); g.quadraticCurveTo(rx * .2, ry * 1.05, -rx * .05, ry * .8); g.closePath(); };
  const oval = () => { g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); };
  // Stroke both shapes thick, then fill both white: the fill covers the inner seam, leaving one outline.
  g.lineWidth = 12; g.lineJoin = 'round'; g.strokeStyle = '#0a0a0a';
  tail(); g.stroke(); oval(); g.stroke();
  g.fillStyle = '#fff'; tail(); g.fill(); oval(); g.fill();
  g.fillStyle = '#0a0a0a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 0, 4);
  g.restore();
}
// Draws the mirrored camera image and the chosen frame. The live preview and the saved photo both
// come from this one function, so what you see is what you save.
function drawShot(g, video, { frame, bw, accent }) {
  const W = SHOT_W, H = SHOT_H, date = new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  // grade: the frame's colour treatment; B&W replaces it.
  const photo = (x, y, w, hh, grade = 'none') => {
    g.save(); g.beginPath(); g.rect(x, y, w, hh); g.clip();
    g.filter = bw ? BW : grade;
    const vw = video.videoWidth || 4, vh = video.videoHeight || 3, s = Math.max(w / vw, hh / vh);
    g.translate(x + w / 2, y + hh / 2); g.scale(-1, 1);
    g.drawImage(video, -vw * s / 2, -vh * s / 2, vw * s, vh * s);
    g.restore();
  };
  const layer = (tex, alpha, mode = 'source-over', clip) => {
    g.save(); if (clip) { g.beginPath(); g.rect(...clip); g.clip(); }
    g.globalAlpha = alpha; g.globalCompositeOperation = mode; g.drawImage(tex, 0, 0); g.restore();
  };
  const tint = (color, mode, alpha, rect) => { g.save(); g.globalAlpha = alpha; g.globalCompositeOperation = mode; g.fillStyle = color; g.fillRect(...rect); g.restore(); };
  const text = (str, x, y, font, color, align = 'left') => { g.font = font; g.fillStyle = color; g.textAlign = align; g.fillText(str, x, y); };
  g.clearRect(0, 0, W, H);
  if (frame === 'Polaroid') {
    g.fillStyle = '#f3f0e6'; g.fillRect(0, 0, W, H);
    const r = [48, 44, W - 96, H - 210];
    photo(...r, 'sepia(.22) saturate(.85) contrast(.92) brightness(1.08)');
    if (!bw) tint('#ffe2b8', 'soft-light', .35, r);
    layer(vignette(), .5, 'source-over', r);
    text(`kesh_os // ${date}`, 56, H - 92, `700 30px ${MONO}`, '#1a1a17');
    text('a memory, saved', 56, H - 52, `500 22px ${MONO}`, '#77746a');
    text('K.', W - 56, H - 56, `800 54px ${MONO}`, '#1a1a17', 'right');
  } else if (frame === 'Film') {
    g.fillStyle = '#0d0d0c'; g.fillRect(0, 0, W, H);
    const r = [0, 96, W, H - 192];
    photo(...r, 'sepia(.3) saturate(1.35) contrast(1.12) hue-rotate(-6deg)');
    // A light leak bleeding in from the left edge.
    if (!bw) { const leak = g.createLinearGradient(0, 0, W * .45, 0); leak.addColorStop(0, 'rgba(255,110,40,.55)'); leak.addColorStop(1, 'rgba(255,110,40,0)'); g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = leak; g.fillRect(...r); g.restore(); }
    layer(grain(), .16, 'overlay', r);
    layer(vignette(), .7, 'source-over', r);
    g.fillStyle = '#e9e5d8';
    for (let x = 18; x < W; x += 62) { g.beginPath(); g.roundRect(x, 16, 30, 36, 6); g.roundRect(x, H - 52, 30, 36, 6); g.fill(); }
    text(`KESH 400   ▸ 14A   ${date.toUpperCase()}`, 20, 84, `700 18px ${MONO}`, '#e0a43c');
    text('▸ 15   KESH_OS', W - 20, H - 64, `700 18px ${MONO}`, '#e0a43c', 'right');
  } else if (frame === 'Terminal') {
    g.fillStyle = '#0a0e0c'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#1a1f1c'; g.fillRect(0, 0, W, 56);
    ['#b5655d', '#b99c5e', '#4e9a78'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(30 + i * 26, 28, 8, 0, Math.PI * 2); g.fill(); });
    text(`~/memories/${date.replace(/[ ,]+/g, '-').toLowerCase()}.png`, W / 2, 36, `600 20px ${MONO}`, '#cfd8d0', 'center');
    const r = [16, 72, W - 32, H - 72 - 64];
    photo(...r, 'grayscale(1) contrast(1.3) brightness(1.1)');
    if (!bw) tint(accent, 'color', 1, r);
    layer(scanlines(), 1, 'source-over', r);
    layer(vignette(), .6, 'source-over', r);
    g.strokeStyle = accent; g.lineWidth = 2; g.strokeRect(...r);
    text('❯ snap --frame terminal', 18, H - 22, `700 20px ${MONO}`, accent);
    text(`[ OK ] saved ${date}`, W - 18, H - 22, `500 20px ${MONO}`, '#6f8475', 'right');
  } else if (frame === 'Manga') {
    g.fillStyle = '#f6f4ee'; g.fillRect(0, 0, W, H);
    const r = [36, 36, W - 72, H - 72];
    photo(...r, 'grayscale(1) contrast(1.9) brightness(1.08)');
    layer(halftone(), .6, 'multiply', r);
    layer(speedLines(), .38, 'source-over', r);
    g.strokeStyle = '#0a0a0a'; g.lineWidth = 10; g.strokeRect(...r);
    bubble(g, 'L3 Cache', 300, 180, 470, 330);
  } else if (frame === 'Dune') {
    // Cinemascope bars, a spice-orange grade and a subtitle, after Dune: Part Two.
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    const bar = Math.round(H * .13), r = [0, bar, W, H - bar * 2];
    photo(...r, 'sepia(.65) saturate(1.7) hue-rotate(-14deg) contrast(1.15) brightness(.92)');
    if (!bw) tint('#ff8a2a', 'soft-light', .45, r);
    layer(grain(), .12, 'overlay', r);
    layer(vignette(), .8, 'source-over', r);
    text('ARRAKIS', W / 2, H - bar / 2 + 4, `600 26px ${MONO}`, '#e9e1d2', 'center');
    text(date.toUpperCase(), W - 28, bar / 2 + 6, `500 16px ${MONO}`, '#8a7f6e', 'right');
  } else if (frame === 'Riso') {
    // Two-ink risograph: shadows print blue, highlights pink, on grainy paper.
    const r = [0, 0, W, H];
    photo(...r, 'grayscale(1) contrast(1.35)');
    if (!bw) { tint('#ff5c8a', 'multiply', 1, r); tint('#2c3fd1', 'screen', 1, r); }
    layer(grain(), .22, 'overlay', r);
    text('RISO / KESH_OS', 28, H - 30, `700 22px ${MONO}`, '#f6f1e7');
  } else photo(0, 0, W, H);
}

export function cameraApp({ sticker }) {
  const video = h('video', { playsinline: true, autoplay: true });
  video.muted = true;
  const view = h('canvas', { class: 'cam-view', width: SHOT_W, height: SHOT_H });
  const g = view.getContext('2d');
  const chomp = h('img', { class: 'cam-chomp', src: sticker, alt: 'Garchomp sticker', draggable: 'false', hidden: true });
  const msg = h('div', { class: 'cam-msg' });
  const flash = h('i', { class: 'cam-flash' });
  const box = h('div', { class: 'cam-box' }, view, chomp, flash, msg);
  const review = h('div', { class: 'cam-review', hidden: true });
  const opts = { frame: 'Polaroid', bw: false, chomp: false, sx: .78, sy: .7, size: .26 };
  let stream = null, raf = 0, alive = true;
  const accent = () => getComputedStyle(view).getPropertyValue('--accent').trim() || '#15ca91';
  const placeChomp = () => Object.assign(chomp.style, { left: `${opts.sx * 100}%`, top: `${opts.sy * 100}%`, width: `${opts.size * 100}%` });
  const loop = () => { raf = requestAnimationFrame(loop); if (video.readyState >= 2) drawShot(g, video, { ...opts, accent: accent() }); };
  const say = (text, retry) => { msg.replaceChildren(h('p', {}, text), retry ? h('button', { type: 'button', class: 'btn', onclick: start }, 'Try again') : ''); msg.hidden = false; };
  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) return say('This browser does not offer camera access here.');
    say('Waiting for camera permission...');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' }, audio: false });
      if (!alive) return stream.getTracks().forEach(t => t.stop());
      video.srcObject = stream;
      await video.play().catch(() => {});
      msg.hidden = true;
      shutter.disabled = false;
      cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    } catch (err) {
      const why = { NotAllowedError: 'Camera access was blocked. Allow it from the address bar, then try again.', NotFoundError: 'No camera was found on this device.', NotReadableError: 'The camera is busy in another app.' }[err.name];
      say(why || `The camera could not start (${err.name}).`, true);
    }
  }
  function capture() {
    const out = h('canvas', { width: SHOT_W, height: SHOT_H }), o = out.getContext('2d');
    drawShot(o, video, { ...opts, accent: accent() });
    if (opts.chomp && chomp.naturalWidth) {
      const w = opts.size * SHOT_W, hh = w * chomp.naturalHeight / chomp.naturalWidth;
      o.drawImage(chomp, opts.sx * SHOT_W - w / 2, opts.sy * SHOT_H - hh / 2, w, hh);
    }
    flash.classList.remove('is-on'); void flash.offsetWidth; flash.classList.add('is-on');
    out.toBlob(blob => {
      const url = URL.createObjectURL(blob), stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
      const close = () => { URL.revokeObjectURL(url); review.hidden = true; review.replaceChildren(); };
      review.replaceChildren(h('img', { src: url, alt: 'Your photo' }),
        h('div', { class: 'cam-review-bar' },
          h('a', { class: 'btn btn-solid', href: url, download: `kesh-os-memory-${stamp}.png` }, 'SAVE TO COMPUTER ↓'),
          h('button', { type: 'button', class: 'btn', onclick: close }, 'RETAKE')));
      review.hidden = false;
    }, 'image/png');
  }
  // The sticker drags anywhere on the photo; positions are fractions so they survive resizing.
  chomp.addEventListener('pointerdown', e => {
    e.preventDefault(); chomp.setPointerCapture(e.pointerId);
    const move = ev => { const r = box.getBoundingClientRect(); opts.sx = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)); opts.sy = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)); placeChomp(); };
    const up = () => { chomp.removeEventListener('pointermove', move); chomp.removeEventListener('pointerup', up); };
    chomp.addEventListener('pointermove', move); chomp.addEventListener('pointerup', up);
  });
  placeChomp();
  const shutter = h('button', { type: 'button', class: 'cam-shutter', 'aria-label': 'Take photo', disabled: true, onclick: capture });
  const size = h('input', { type: 'range', min: 12, max: 50, value: opts.size * 100, 'aria-label': 'Sticker size' });
  size.addEventListener('input', () => { opts.size = size.value / 100; placeChomp(); });
  const tools = h('div', { class: 'cam-tools' });
  const render = () => tools.replaceChildren(
    h('div', { class: 'cam-frames', role: 'group', 'aria-label': 'Frame' }, FRAMES.map(f => h('button', { type: 'button', class: f === opts.frame ? 'is-on' : null, 'aria-pressed': String(f === opts.frame), onclick: () => { opts.frame = f; render(); } }, f))),
    h('button', { type: 'button', class: `cam-chip${opts.bw ? ' is-on' : ''}`, 'aria-pressed': String(opts.bw), onclick: () => { opts.bw = !opts.bw; render(); } }, 'B&W'),
    h('button', { type: 'button', class: `cam-chip cam-chip-chomp${opts.chomp ? ' is-on' : ''}`, 'aria-pressed': String(opts.chomp), onclick: () => { opts.chomp = !opts.chomp; chomp.hidden = !opts.chomp; render(); } }, h('img', { src: sticker, alt: '' }), 'Garchomp'),
    opts.chomp ? h('label', { class: 'cam-size' }, 'Size', size) : '',
    shutter);
  render();
  start();
  const el = h('div', { class: 'app-camera' }, box, tools, review);
  return { el, destroy: () => { alive = false; cancelAnimationFrame(raf); stream?.getTracks().forEach(t => t.stop()); } };
}

/* ---------- Boot: a terminal log, then K. with a blinking dot, then a fade to the desktop ---------- */
export function bootSplash(boot, lines, done) {
  const log = h('pre', { class: 'boot-log' });
  boot.replaceChildren(log, h('div', { class: 'boot-k', 'aria-hidden': 'true' }, 'K', h('i', { class: 'boot-dot' })));
  boot.dataset.phase = 'log';
  if (reduceMotion) { boot.dataset.phase = 'mark'; setTimeout(done, 700); return; }
  let i = 0;
  const step = () => {
    if (boot.classList.contains('is-done')) return;
    if (i < lines.length) { log.textContent += `${lines[i++]}\n`; setTimeout(step, i < 3 ? 160 : 85); return; }
    setTimeout(() => { boot.dataset.phase = 'mark'; setTimeout(done, 1500); }, 260);
  };
  setTimeout(step, 180);
}

/* ---------- Keyboard shortcuts cheat sheet ---------- */
export const SHORTCUTS = [
  ['Alt + Space', 'Launcher'], ['Alt + Enter', 'Terminal'], ['Alt + E', 'Files'], ['Alt + W', 'Close window'],
  ['Alt + M', 'Minimize window'], ['Alt + F', 'Maximize or restore'], ['Alt + L', 'Lock screen'], ['Alt + T', 'Next theme'],
  ['Alt + U', 'Full screen'], ['Alt + /', 'This cheat sheet'], ['Esc', 'Close menus']
];
export function shortcutsApp() {
  return h('div', { class: 'app-keys' }, h('p', { class: 'mon-h' }, 'KEYBOARD'),
    h('dl', {}, SHORTCUTS.flatMap(([k, v]) => [h('dt', {}, k.split(' + ').flatMap((p, i) => [i ? ' + ' : '', h('kbd', {}, p)])), h('dd', {}, v)])));
}

/* ---------- Notifications, stacked top-right ---------- */
export function notifier(stage, isQuiet) {
  const stack = h('div', { class: 'os-notes', 'aria-live': 'polite' });
  stage.append(stack);
  return (title, body = '') => {
    if (isQuiet()) return;
    const n = h('div', { class: 'os-note' }, h('b', {}, title), body && h('span', {}, body));
    stack.prepend(n);
    while (stack.children.length > 3) stack.lastChild.remove();
    setTimeout(() => { n.classList.add('is-out'); setTimeout(() => n.remove(), 250); }, 3600);
  };
}

/* ---------- Lock screen ---------- */
export function lockScreen(stage, { avatar, timeStr, onUnlock }) {
  const time = h('b', { class: 'lk-time' });
  const date = h('span', { class: 'lk-date' });
  const tick = () => { const d = new Date(); time.textContent = timeStr(d); date.textContent = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }); };
  tick();
  const timer = setInterval(tick, 15000);
  const el = h('div', { class: 'os-lock', role: 'dialog', 'aria-label': 'Locked' }, time, date,
    h('div', { class: 'lk-user' }, h('img', { src: avatar, alt: '' }), h('span', {}, 'kesh')),
    h('p', { class: 'lk-hint' }, 'Click or press any key to unlock'));
  const unlock = () => { clearInterval(timer); removeEventListener('keydown', key, true); el.classList.add('is-out'); setTimeout(() => el.remove(), 300); onUnlock?.(); };
  const key = e => { e.preventDefault(); e.stopPropagation(); unlock(); };
  el.addEventListener('click', unlock);
  addEventListener('keydown', key, true);
  stage.append(el);
}
