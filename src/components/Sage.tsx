import { useEffect, useRef, useState } from "react";

/**
 * The Sage — a hooded cyber-monk mascot.
 * Layered SVG. Cursor-reactive: visor light tracks pointer,
 * hood/sleeves parallax, idle breathing, click pulse.
 */
export const Sage = ({ size = 420 }: { size?: number }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const visorRef = useRef<SVGCircleElement>(null);
  const hoodRef = useRef<SVGGElement>(null);
  const robeRef = useRef<SVGGElement>(null);
  const auraRef = useRef<SVGCircleElement>(null);
  const [pulses, setPulses] = useState<number[]>([]);

  // Lerped values
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // normalize to -1..1 within ~600px radius
      target.current.x = Math.max(-1, Math.min(1, (e.clientX - cx) / 500));
      target.current.y = Math.max(-1, Math.min(1, (e.clientY - cy) / 500));
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      const { x, y } = current.current;

      if (visorRef.current) {
        // visor "eye" moves a few px in cursor direction
        visorRef.current.setAttribute("cx", String(100 + x * 6));
        visorRef.current.setAttribute("cy", String(82 + y * 4));
      }
      if (hoodRef.current) {
        hoodRef.current.setAttribute("transform", `translate(${x * 5} ${y * 3})`);
      }
      if (robeRef.current) {
        robeRef.current.setAttribute("transform", `translate(${x * 2} ${y * 1.5})`);
      }
      if (auraRef.current) {
        auraRef.current.setAttribute("cx", String(100 + x * 8));
        auraRef.current.setAttribute("cy", String(82 + y * 5));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onClick = () => {
    const id = Date.now();
    setPulses((p) => [...p, id]);
    setTimeout(() => setPulses((p) => p.filter((i) => i !== id)), 1200);
  };

  return (
    <div
      ref={wrapRef}
      className="relative animate-float-y crt-flicker"
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Outer halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--primary) / 0.25), transparent 60%)",
        }}
      />

      {/* Click pulse rings */}
      {pulses.map((id) => (
        <div
          key={id}
          className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary pointer-events-none"
          style={{
            width: size * 0.35,
            height: size * 0.35,
            animation: "pulse-ring 1.2s ease-out forwards",
          }}
        />
      ))}

      <svg
        viewBox="0 0 200 260"
        className="relative z-10 w-full h-full"
        style={{ filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.35))" }}
      >
        <defs>
          <radialGradient id="visorGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary-glow))" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="robeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(0 0% 8%)" />
            <stop offset="60%" stopColor="hsl(0 0% 5%)" />
            <stop offset="100%" stopColor="hsl(0 0% 3%)" />
          </linearGradient>
          <linearGradient id="hoodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(0 0% 12%)" />
            <stop offset="100%" stopColor="hsl(0 0% 4%)" />
          </linearGradient>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
            <stop offset="50%" stopColor="hsl(var(--primary) / 0.6)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
          </linearGradient>
          <filter id="visorBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Robe body — long flowing */}
        <g ref={robeRef}>
          {/* Robe base — pyramidal flowing form */}
          <path
            d="M 100 120
               L 60 175
               L 35 245
               L 165 245
               L 140 175
               Z"
            fill="url(#robeGrad)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          {/* Robe inner fold */}
          <path
            d="M 100 130 L 85 180 L 90 240 L 110 240 L 115 180 Z"
            fill="hsl(0 0% 2%)"
            opacity="0.7"
          />
          {/* Sleeves */}
          <path
            d="M 75 140 L 50 195 L 60 200 L 80 155 Z"
            fill="url(#robeGrad)"
            stroke="hsl(var(--border))"
            strokeWidth="0.3"
          />
          <path
            d="M 125 140 L 150 195 L 140 200 L 120 155 Z"
            fill="url(#robeGrad)"
            stroke="hsl(var(--border))"
            strokeWidth="0.3"
          />
          {/* Hem glow line */}
          <path
            d="M 35 245 L 165 245"
            stroke="url(#edgeGrad)"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Sash */}
          <rect x="70" y="160" width="60" height="3" fill="hsl(var(--primary) / 0.5)" />
          {/* Glyph on chest */}
          <text
            x="100"
            y="175"
            textAnchor="middle"
            fontSize="9"
            fill="hsl(var(--primary) / 0.7)"
            fontFamily="monospace"
            letterSpacing="2"
          >
            01//
          </text>
        </g>

        {/* Hood */}
        <g ref={hoodRef}>
          {/* Outer hood shape */}
          <path
            d="M 60 80
               C 55 30, 145 30, 140 80
               L 145 130
               C 130 140, 70 140, 55 130
               Z"
            fill="url(#hoodGrad)"
            stroke="hsl(var(--border))"
            strokeWidth="0.6"
          />
          {/* Inner hood shadow (where face would be) */}
          <ellipse cx="100" cy="92" rx="34" ry="40" fill="hsl(0 0% 1%)" />
          {/* Face void with subtle code lines */}
          <ellipse cx="100" cy="92" rx="32" ry="38" fill="hsl(0 0% 0%)" />

          {/* Faint code "runes" inside hood */}
          <g opacity="0.25" fontFamily="monospace" fontSize="4" fill="hsl(var(--primary))">
            <text x="80" y="65">0x7F</text>
            <text x="108" y="125">::void</text>
          </g>

          {/* Visor aura (blurred glow that follows cursor) */}
          <circle ref={auraRef} cx="100" cy="82" r="22" fill="url(#visorGrad)" filter="url(#visorBlur)" />

          {/* Visor — the eye */}
          <ellipse
            cx="100"
            cy="82"
            rx="18"
            ry="6"
            fill="hsl(0 0% 0%)"
            stroke="hsl(var(--primary) / 0.6)"
            strokeWidth="0.5"
          />
          <circle ref={visorRef} cx="100" cy="82" r="3.5" fill="hsl(var(--primary-glow))">
            <animate attributeName="r" values="3.5;4.2;3.5" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Visor highlight */}
          <ellipse cx="93" cy="80" rx="3" ry="1" fill="hsl(var(--primary) / 0.5)" />

          {/* Hood edge glow */}
          <path
            d="M 60 80 C 55 30, 145 30, 140 80"
            stroke="hsl(var(--primary) / 0.35)"
            strokeWidth="0.8"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
