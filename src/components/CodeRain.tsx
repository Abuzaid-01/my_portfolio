import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle/code-rain field behind the Sage.
 * Particles drift slowly and are gently attracted to the cursor.
 */
export const CodeRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01░▒▓█{};</>=*+-_アイウエカキクケサシ";
    type P = { x: number; y: number; vx: number; vy: number; ch: string; a: number };
    const particles: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15 + 0.05,
      ch: chars[Math.floor(Math.random() * chars.length)],
      a: 0.08 + Math.random() * 0.35,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = "11px JetBrains Mono, monospace";
      for (const p of particles) {
        // attract toward cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 40000) {
          const f = 0.0008;
          p.vx += dx * f;
          p.vy += dy * f;
        }
        // damping
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        // wrap
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.fillStyle = `hsla(155, 100%, 55%, ${p.a})`;
        ctx.fillText(p.ch, p.x, p.y);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
};
