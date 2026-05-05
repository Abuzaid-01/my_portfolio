import { useState } from "react";
import { ExternalLink, Github, ChevronRight, Circle } from "lucide-react";
import type { Project } from "@/data/projects";

export const ProjectCard = ({ p, index }: { p: Project; index: number }) => {
  const [open, setOpen] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`scanline-sweep hover-glow border border-border bg-card/40 backdrop-blur-sm transition-all duration-500 ${
        open ? "md:col-span-2" : ""
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-6 md:p-8 group"
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
            <h3 className="font-display text-2xl md:text-3xl font-medium mb-2 group-hover:text-primary group-hover:text-glow-sm transition-colors">
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
      </button>

      {open && (
        <div className="px-6 md:px-8 pb-8 pt-2 animate-fade-in border-t border-border/60 mt-2">
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
