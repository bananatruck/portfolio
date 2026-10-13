import { useRef, useEffect } from 'react';

interface LetterGlitchProps {
  glitchColors?: string[];
  className?: string;
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  /** Kept for API compatibility; letters now swap colour in place. */
  smooth?: boolean;
  characters?: string;
}

const FONT_SIZE = 16;
const CHAR_W = 10;
const CHAR_H = 20;
/** Share of the grid that changes on each tick. */
const CHANGE_RATE = 0.03;

const LetterGlitch = ({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc'],
  className = '',
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
}: LetterGlitchProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !parent || !ctx) return;

    const chars = Array.from(characters);
    const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let columns = 0, rows = 0, raf = 0, last = 0, visible = true;

    // Paint one cell. Only changed cells are repainted, never the whole canvas.
    const paint = (i: number) => {
      const x = (i % columns) * CHAR_W, y = Math.floor(i / columns) * CHAR_H;
      ctx.clearRect(x, y, CHAR_W, CHAR_H);
      ctx.fillStyle = pick(glitchColors);
      ctx.fillText(pick(chars), x, y);
    };

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = 'top';
      columns = Math.ceil(width / CHAR_W);
      rows = Math.ceil(height / CHAR_H);
      for (let i = 0; i < columns * rows; i++) paint(i);
    };

    // Ticks ride requestAnimationFrame so they land on display frames, at most every glitchSpeed ms.
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < glitchSpeed) return;
      last = now;
      const total = columns * rows;
      const count = Math.max(1, Math.floor(total * CHANGE_RATE));
      for (let n = 0; n < count; n++) paint(Math.floor(Math.random() * total));
    };

    // Run only while the hero is on screen and the tab is visible.
    const sync = () => {
      const on = visible && !document.hidden && !reduceMotion;
      if (on && !raf) raf = requestAnimationFrame(tick);
      if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    };

    layout();
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    io.observe(parent);
    document.addEventListener('visibilitychange', sync);
    let resizeTimeout = 0, firstResize = true;
    const ro = new ResizeObserver(() => {
      if (firstResize) { firstResize = false; return; } // fires once on observe; layout() already ran
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(layout, 150);
    });
    ro.observe(parent);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimeout);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
    // glitchColors and characters are literals at the call site; re-running on identity changes would reset the grid.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed]);

  const fill: React.CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none' };

  return (
    // Transparent, with vignettes built from the page colour, so it sits right in light and dark themes.
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} className={className}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {outerVignette && <div style={{ ...fill, background: 'radial-gradient(circle, transparent 60%, hsl(var(--background)) 100%)' }} />}
      {centerVignette && <div style={{ ...fill, background: 'radial-gradient(circle, hsl(var(--background) / 0.85) 0%, transparent 60%)' }} />}
    </div>
  );
};

export default LetterGlitch;
