// KESH cursor: a terminal arrow with four states, shared by the site and the KESH_OS desktop.
//   idle    the arrow
//   hover   the arrow morphs into a translucent ball, over anything clickable
//   press   the ball turns solid and shrinks
//   loading the ball breathes, while the page or a navigation is loading
// One fixed element, one transform write per frame; the animation is pure CSS.
// Colour: --kc-accent on <html> (the desktop sets it from its accent), else emerald.
(() => {
  if (window.__keshCursor || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  window.__keshCursor = true;

  const CLICKABLE = 'a[href], button:not(:disabled), [role="button"], [role="tab"], [role="menuitem"], [role="switch"], summary, label[for], select, input[type="range"], input[type="checkbox"], input[type="radio"], .cursor-pointer, [data-app]';
  const TEXT = 'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

  const style = document.createElement('style');
  style.textContent = `
html.kc-on, html.kc-on * { cursor: none !important; }
html.kc-on :is(${TEXT}) { cursor: text !important; }
.kc { --c: var(--kc-accent, #10b981); position: fixed; left: 0; top: 0; z-index: 2147483647; pointer-events: none; will-change: transform; opacity: 0; transition: opacity .15s; }
.kc.is-on { opacity: 1; }
.kc-arrow { position: absolute; left: -3px; top: -2px; width: 22px; height: 22px; transform-origin: 3px 2px; transition: opacity .14s, transform .18s cubic-bezier(.3,1.4,.5,1); }
.kc-arrow rect { fill: var(--c); }
/* A glass ball: a tinted body, a specular highlight top left, light pooling at the bottom, no outline. */
.kc-dot { position: absolute; left: -10px; top: -10px; width: 20px; height: 20px; border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, rgba(255,255,255,.9) 0 7%, rgba(255,255,255,.28) 16%, transparent 38%),
    radial-gradient(circle at 50% 58%, color-mix(in srgb, var(--c) 30%, transparent) 0 55%, color-mix(in srgb, var(--c) 62%, transparent) 100%);
  box-shadow: inset 0 -3px 5px color-mix(in srgb, var(--c) 55%, transparent), inset 0 1px 1px rgba(255,255,255,.35), 0 3px 12px color-mix(in srgb, var(--c) 35%, transparent);
  opacity: 0; transform: scale(.25); transition: opacity .14s, transform .2s cubic-bezier(.3,1.5,.5,1), filter .12s; }
/* Over anything clickable, the arrow shrinks into its tip and the ball takes its place. */
.kc:is([data-s="hover"], [data-s="press"], [data-s="loading"]) .kc-arrow { opacity: 0; transform: scale(.3); }
.kc[data-s="hover"] .kc-dot { opacity: 1; transform: scale(1); }
.kc[data-s="press"] .kc-dot { opacity: 1; transform: scale(.78); filter: saturate(1.6) brightness(1.15); }
.kc[data-s="loading"] .kc-dot { opacity: 1; transform: scale(1); animation: kc-breathe 1s ease-in-out infinite; }
.kc.is-text { opacity: 0; }
@keyframes kc-breathe { 50% { transform: scale(1.4); opacity: .55; } }
@media (prefers-reduced-motion: reduce) { .kc-dot { animation: none !important; } }`;
  document.head.append(style);

  const el = document.createElement('div');
  el.className = 'kc';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<svg class="kc-arrow" viewBox="0 0 22 22"><path d="M3 2v15l4-4 3 7 3-1.4-3-6.8h6z" fill="#f5f5f0" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/><rect x="15" y="16" width="5" height="2"/></svg><i class="kc-dot"></i>`;
  document.documentElement.classList.add('kc-on');
  (document.body || document.documentElement).append(el);

  let x = -100, y = -100, raf = 0, pressed = false, hover = false, loading = document.readyState !== 'complete', loadTimer = 0;
  const render = () => {
    raf = 0;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    el.dataset.s = pressed ? 'press' : loading ? 'loading' : hover ? 'hover' : 'idle';
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
  const setLoading = on => { loading = on; clearTimeout(loadTimer); if (on) loadTimer = setTimeout(() => setLoading(false), 4000); schedule(); };

  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    el.classList.add('is-on');
    schedule();
  }, { passive: true });
  addEventListener('pointerover', e => {
    const t = e.target instanceof Element ? e.target : null;
    hover = !!t?.closest(CLICKABLE);
    el.classList.toggle('is-text', !!t?.closest(TEXT));
    if (t?.closest('[aria-busy="true"]')) setLoading(true);
    schedule();
  }, { passive: true });
  addEventListener('pointerdown', () => { pressed = true; schedule(); }, { passive: true });
  addEventListener('pointerup', () => { pressed = false; schedule(); }, { passive: true });
  // Leaving the window (or into an iframe, which runs its own cursor) hides this one.
  document.addEventListener('pointerout', e => { if (!e.relatedTarget) el.classList.remove('is-on'); });
  addEventListener('blur', () => el.classList.remove('is-on'));

  // Loading: until the page finishes, and after clicking a link that navigates away.
  if (loading) addEventListener('load', () => setLoading(false), { once: true });
  document.addEventListener('click', e => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank' || a.hasAttribute('download') || e.metaKey || e.ctrlKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin === location.origin && (url.pathname !== location.pathname || url.search !== location.search)) setLoading(true);
  });
  // Client-side navigations (Next.js) finish with a history change.
  for (const fn of ['pushState', 'replaceState']) {
    const orig = history[fn];
    history[fn] = function (...args) { const r = orig.apply(this, args); setTimeout(() => setLoading(false), 120); return r; };
  }
  addEventListener('popstate', () => setLoading(false));
  // Only the full-screen element is painted in full screen, so the cursor moves into it.
  document.addEventListener('fullscreenchange', () => (document.fullscreenElement || document.body).append(el));
  window.keshCursor = { loading: setLoading };
  schedule();
})();
