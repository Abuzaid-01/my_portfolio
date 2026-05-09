import { useState, type CSSProperties } from "react";
import { ExternalLink, Github, ChevronRight, Circle } from "lucide-react";
import type { Project } from "@/data/projects";

export const ProjectCard = ({ p, index }: { p: Project; index: number }) => {
  const [open, setOpen] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`group/project scanline-sweep hover-glow border border-border bg-card/40 backdrop-blur-sm transition-all duration-500 ${
        open ? "md:col-span-2" : ""
      }`}
    >
      <ProjectCardAtmosphere projectId={p.id} />

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 w-full text-left p-4 sm:p-6 md:p-8 group"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 text-xs font-mono text-muted-foreground">
              <span>{num}</span>
              <span className="h-px w-8 bg-border" />
              <span className="flex items-center gap-1.5">
                <Circle className="w-2 h-2 fill-primary text-primary animate-pulse" />
                {p.status}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-medium mb-2 group-hover:text-primary group-hover:text-glow-sm transition-colors">
              {p.name}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">// {p.tag}</p>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-primary shrink-0 mt-2 transition-transform duration-300 ${
              open ? "rotate-90" : ""
            }`}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mt-5">
          {p.tech.slice(0, open ? p.tech.length : 5).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground"
            >
              {t}
            </span>
          ))}
          {!open && p.tech.length > 5 && (
            <span className="text-[10px] font-mono px-2 py-0.5 text-muted-foreground">
              +{p.tech.length - 5}
            </span>
          )}
        </div>

        <ProjectCompanionDock projectId={p.id} index={index} />
      </button>

      {open && (
        <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-2 animate-fade-in border-t border-border/60 mt-2">
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div>
              <Section label="problem.txt" body={p.problem} />
              <div className="mt-6">
                <Section label="solution.txt" body={p.solution} />
              </div>
            </div>
            <div>
              <Label>pipeline.sh</Label>
              <ol className="mt-3 space-y-2 font-mono text-sm">
                {p.pipeline.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary shrink-0">[{i + 1}]</span>
                    <span className="text-foreground/80">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <Label>highlights.log</Label>
                <ul className="mt-3 space-y-1.5 font-mono text-sm">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="text-foreground/80">
                      <span className="text-primary mr-2">›</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary-glow transition-colors"
                style={{ boxShadow: "0 0 16px hsl(var(--primary) / 0.4)" }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                ./live-demo
              </a>
            )}
            {p.repoUrl && (
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-primary/60 text-primary font-mono text-xs uppercase tracking-wider hover:bg-primary/10 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                ./source
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectCardAtmosphere = ({ projectId }: { projectId: string }) => {
  const safeId = projectId.replace(/[^a-z0-9_-]/gi, "");
  const circuitId = `${safeId}-circuit-fade`;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        viewBox="0 0 600 260"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 group-hover/project:opacity-100 group-focus-within/project:opacity-100"
      >
        <defs>
          <linearGradient id={circuitId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
            <stop offset="58%" stopColor="hsl(var(--primary) / 0.2)" />
            <stop offset="100%" stopColor="hsl(280 100% 70% / 0.16)" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#${circuitId})`} strokeWidth="1">
          <path d="M385 26 H516 L575 83 V178" />
          <path d="M430 63 H505 L536 94 V140 H590" />
          <path d="M356 126 H469 L504 160 H590" />
          <path d="M392 218 H512 L556 178" />
        </g>
        <g fill="hsl(var(--primary) / 0.32)">
          <circle cx="516" cy="26" r="2.5" />
          <circle cx="536" cy="94" r="2.5" />
          <circle cx="504" cy="160" r="2.5" />
          <circle cx="556" cy="178" r="2.5" />
        </g>
      </svg>
      <div className="absolute right-0 top-0 h-16 w-16 border-r border-t border-primary/0 transition-colors duration-700 group-hover/project:border-primary/40 group-focus-within/project:border-primary/40" />
      <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-primary/0 transition-colors duration-700 group-hover/project:border-primary/30 group-focus-within/project:border-primary/30" />
    </div>
  );
};

const ProjectCompanionDock = ({ projectId, index }: { projectId: string; index: number }) => {
  const safeId = projectId.replace(/[^a-z0-9_-]/gi, "");
  const coreId = `${safeId}-dock-core`;
  const beamId = `${safeId}-dock-beam`;
  const glassId = `${safeId}-dock-glass`;
  const glowId = `${safeId}-dock-glow`;
  const waveDelay = `${index * 0.18}s`;

  return (
    <div
      aria-hidden="true"
      className="project-companion-dock relative mt-5 h-16 overflow-hidden border-t border-border/50 opacity-60 transition-opacity duration-500 group-hover/project:opacity-100 group-focus-within/project:opacity-100"
      style={{ "--dock-delay": waveDelay } as CSSProperties}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-45" />
      <div className="absolute left-0 top-4 h-px w-full bg-[linear-gradient(90deg,transparent,hsl(var(--primary)/0.25),transparent)]" />
      <div className="absolute bottom-3 left-12 right-0 h-px bg-border/60" />

      <svg viewBox="0 0 460 72" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={coreId} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
            <stop offset="42%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--primary-dim))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={beamId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
            <stop offset="50%" stopColor="hsl(var(--primary) / 0.75)" />
            <stop offset="100%" stopColor="hsl(280 100% 70% / 0)" />
          </linearGradient>
          <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.22)" />
            <stop offset="52%" stopColor="hsl(var(--primary) / 0.8)" />
            <stop offset="100%" stopColor="hsl(280 100% 70% / 0.48)" />
          </linearGradient>
          <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="project-companion-wave" opacity="0.45">
          <path d="M98 40 C142 18 178 62 220 40 S302 18 352 40 S425 58 448 35" fill="none" stroke={`url(#${beamId})`} strokeWidth="1.2" />
          <path d="M100 51 H444" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="5 9" />
        </g>

        <g className="project-companion-node">
          <path d="M22 46 L52 26 L86 45 L54 64 Z" fill="hsl(0 0% 3%)" stroke="hsl(var(--border))" strokeWidth="1.1" />
          <path d="M31 45 L53 32 L77 45 L54 58 Z" fill="hsl(0 0% 0%)" stroke={`url(#${glassId})`} strokeWidth="1" />
          <path d="M38 45 H70" stroke={`url(#${glassId})`} strokeWidth="4" strokeLinecap="round" filter={`url(#${glowId})`} />
          <circle cx="54" cy="45" r="7" fill={`url(#${coreId})`} filter={`url(#${glowId})`} className="project-companion-core" />
          <path d="M52 25 V15" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
          <circle cx="52" cy="13" r="2" fill="hsl(var(--primary-glow))" />
          <path d="M34 50 L24 61" stroke="hsl(var(--primary) / 0.32)" strokeWidth="1" />
          <path d="M73 50 L84 61" stroke="hsl(280 100% 70% / 0.28)" strokeWidth="1" />
        </g>

        <g className="project-companion-data" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="hsl(var(--primary) / 0.64)">
          <text x="112" y="30">node://{String(index + 1).padStart(2, "0")}</text>
          <text x="112" y="43" fill="hsl(280 100% 70% / 0.58)">trace active</text>
        </g>

        <g className="project-companion-packets">
          <circle cx="168" cy="51" r="2" fill="hsl(var(--primary-glow))" />
          <circle cx="262" cy="51" r="2" fill="hsl(var(--primary))" />
          <circle cx="356" cy="51" r="2" fill="hsl(280 100% 70%)" />
        </g>
      </svg>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-mono text-primary/80 uppercase tracking-[0.2em]">
    $ cat {children}
  </div>
);

const Section = ({ label, body }: { label: string; body: string }) => (
  <div>
    <Label>{label}</Label>
    <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{body}</p>
  </div>
);
