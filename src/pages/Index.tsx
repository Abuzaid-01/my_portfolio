import { useEffect, useState } from "react";
import { Sage } from "@/components/Sage";
import { CodeRain } from "@/components/CodeRain";
import { CustomCursor } from "@/components/CustomCursor";
import { Typewriter } from "@/components/Typewriter";
import { ProjectCard } from "@/components/ProjectCard";
import { ScrollHud } from "@/components/ScrollHud";
import { TechCube } from "@/components/TechCube";
import { projects } from "@/data/projects";
import { Github, Linkedin, Mail, Menu, X, Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

const NAV = [
  { n: "01", label: "home", href: "#home" },
  { n: "02", label: "about", href: "#about" },
  { n: "03", label: "work", href: "#work" },
  { n: "04", label: "journey", href: "#journey" },
  { n: "05", label: "contact", href: "#contact" },
];

/* ───── Scroll-reveal hook ───── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ───── Main page ───── */
const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [navScrolled, setNavScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useReveal();

  useEffect(() => {
    const sections = NAV.map((item) => document.querySelector(item.href)).filter(
      Boolean
    ) as HTMLElement[];

    const onScroll = () => {
      const y = window.scrollY + 140;
      const current =
        sections.find((section) => {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          return y >= top && y < bottom;
        })?.id ?? "home";

      setActiveSection(current);
      setNavScrolled(window.scrollY > 18);

      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(max > 0 ? Math.min(100, Math.round((doc.scrollTop / max) * 100)) : 0);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onEscape);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="min-h-screen scanlines grain vignette relative selection:bg-primary/20">
      <CustomCursor />
      <ScrollHud />

      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${
          navScrolled ? "bg-background/80 border-border shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : "bg-background/50 border-border/60"
        }`}
      >
        <div className="h-[2px] w-full bg-border/40">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#home" className="font-mono text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.32em] text-primary text-glow-sm font-medium">
            ABUZAID<span className="text-foreground/40 text-xs">::dev</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            {NAV.map((n) => (
              <a
                key={n.n}
                href={n.href}
                className={`terminal-link flex items-center gap-1.5 px-2 py-1 rounded-sm transition-colors ${
                  activeSection === n.href.slice(1) ? "text-primary bg-primary/10" : ""
                }`}
              >
                <span className={activeSection === n.href.slice(1) ? "text-primary" : "text-primary/50"}>{n.n}</span>
                <span className="mx-1 text-border/70">:</span>
                <span className="text-foreground/80 hover:text-primary transition-colors">{n.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Abuzaid-01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center px-3 py-1.5 border border-primary/50 text-primary font-mono text-[10px] tracking-[0.18em] uppercase hover:bg-primary/10 transition-colors"
            >
              hire me
            </a>
            <button
              className="md:hidden text-foreground/70 hover:text-primary transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-5 py-5 flex flex-col gap-4 font-mono text-sm animate-fade-in">
            {NAV.map((n) => (
              <a
                key={n.n}
                href={n.href}
                className={`terminal-link flex items-center justify-between gap-2 py-2 ${
                  activeSection === n.href.slice(1) ? "text-primary" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-primary/50">{n.n}</span>
                  <span className="text-border/50">:</span>
                  <span>{n.label}</span>
                </span>
                <span className="text-primary/50">↗</span>
              </a>
            ))}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <a href="mailto:abuzaid0205@gmail.com" className="terminal-link">mail</a>
              <a href="https://www.linkedin.com/in/abuzaid01" target="_blank" rel="noopener noreferrer" className="terminal-link">linkedin</a>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════
          HERO
      ══════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <CodeRain />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">

          {/* LEFT */}
          <div className="animate-fade-up text-center lg:text-left" style={{ animationDelay: "0.05s" }}>

            {/* Terminal breadcrumb */}
            <div className="flex items-center justify-center lg:justify-start gap-3 font-mono text-xs text-primary/70 mb-8">
              <span className="w-12 h-px bg-primary/50" />
              <span className="text-glow-sm tracking-widest">~/portfolio $ ./init —— ready</span>
            </div>

            {/* WHOAMI label */}
            <div className="font-mono text-sm md:text-base text-muted-foreground/60 mb-3 tracking-[0.12em] sm:tracking-[0.15em]">
              whoami →
            </div>

            {/* BIG glitch headline */}
            <h1
              className="font-display leading-none mb-3 relative"
              style={{ fontSize: "clamp(3rem, 12vw, 9rem)", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              <span className="glitch-wrap text-shimmer" data-text="ABUZAID">
                ABUZAID
              </span>
            </h1>

            {/* Static subtitle — ML Data Scientist & Engineer */}
            <div className="font-mono text-base md:text-lg text-primary/80 mb-5 tracking-wide text-glow-sm">
              ML Data Scientist & Engineer
            </div>

            {/* Typewriter role line */}
            <div className="font-mono text-sm sm:text-base md:text-lg text-foreground/70 mb-4 flex items-baseline justify-center lg:justify-start gap-2 flex-wrap">
              <span className="text-primary text-glow-sm">$</span>
              <span className="text-muted-foreground">role =</span>
              <span className="text-primary">"</span>
              <Typewriter
                phrases={[
                  "ml data scientist & engineer",
                  "ml & rag systems builder",
                  "prompt-security researcher",
                  "ai intern @ domainlab",
                  "shipper of real products",
                ]}
                speed={50}
              />
              <span className="text-primary">"</span>
            </div>

            {/* Sub-headline */}
            <p className="font-mono text-sm md:text-base text-muted-foreground mb-10 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <span className="text-primary">›</span>{" "}
              B.Tech CS · MSIT year 2 — building AI systems, RAG pipelines,
              and computer-vision tools that make a real impact.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.45)" }}
              >
                ./view-work
              </a>
              <a
                href="#journey"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-primary/40 font-mono text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
              >
                ./journey
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border font-mono text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:border-primary/60 hover:text-primary/80 transition-all duration-300"
              >
                ./contact
              </a>
            </div>
          </div>

          {/* RIGHT — interactive Sage */}
          <div className="flex items-center justify-center lg:justify-end mt-2 lg:mt-0">
            <div className="relative">
              <div
                className="absolute inset-[-20%] rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsl(var(--primary)/0.12) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <Sage size={340} />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-primary/60 tracking-[0.3em] whitespace-nowrap">
                [click me]
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-muted-foreground tracking-[0.35em] flex flex-col items-center gap-2">
          <div className="w-px h-6 bg-primary/40 animate-pulse" />
          ↓ SCROLL
        </div>
      </section>

      {/* ══════════════════════════
          ABOUT
      ══════════════════════════ */}
      <section id="about" className="relative py-16 md:py-32 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <SectionHeader num="02" title="ABOUT" subtitle="// runtime info" />
          <div className="grid md:grid-cols-5 gap-6 md:gap-8 items-start">

            {/* Terminal bio */}
            <div className="reveal md:col-span-3 border border-border bg-card/30 p-4 sm:p-6 md:p-8 font-mono text-xs sm:text-sm hover-glow transition-all duration-500">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                <span className="ml-3 text-[10px] text-muted-foreground tracking-widest">abuzaid@portfolio ~ bash</span>
              </div>
              <TerminalLine cmd="whoami" out="abuzaid — ml data scientist & engineer" />
              <TerminalLine
                cmd="cat about.txt"
                multiline={[
                  "Computer science student, B.Tech year 2 @ MSIT.",
                  "AI/ML Developer @ DomAIyn Labs — building real AI systems.",
                  "Interested in applied ML, RAG systems,",
                  "prompt security, and shipping working products.",
                  "I prefer building over talking — every project here",
                  "has a live URL you can break right now.",
                ]}
              />
              <TerminalLine cmd="echo $FOCUS" out="ml · rag · mcp · prompt-security · ship-fast" />
              <div className="mt-6 text-primary text-glow-sm">
                $ <span className="typewriter-caret" />
              </div>
            </div>

            {/* ── 3D Tech Cube ── */}
            <div
              className="reveal md:col-span-2 border border-border bg-card/30 p-4 sm:p-6 hover-glow transition-all duration-500 flex flex-col items-center"
              style={{ transitionDelay: "0.15s" }}
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50 w-full">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                <span className="ml-3 text-[10px] font-mono text-muted-foreground tracking-widest">tech-stack.3d</span>
              </div>
              <TechCube />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          WORK
      ══════════════════════════ */}
      <section id="work" className="relative py-16 md:py-32 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeader num="03" title="WORK" subtitle="// selected systems shipped to production" />
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {projects.map((p, i) => (
              <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <ProjectCard p={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          JOURNEY — Experience + Education
      ══════════════════════════ */}
      <section id="journey" className="relative py-16 md:py-32 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <SectionHeader num="04" title="JOURNEY" subtitle="// experience & education log" />

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">

            {/* ── EXPERIENCE ── */}
            <div className="reveal">
              <div className="flex items-center gap-3 font-mono text-xs text-primary/80 mb-6 uppercase tracking-[0.2em]">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>experience.log</span>
              </div>

              {/* Timeline item */}
              <div className="relative pl-6 border-l border-primary/30">
                {/* Dot */}
                <div
                  className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary"
                  style={{ boxShadow: "0 0 10px hsl(var(--primary))" }}
                />

                <div className="border border-border bg-card/30 p-4 sm:p-5 hover-glow transition-all duration-500 scanline-sweep">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                    <span className="w-2 h-2 rounded-full bg-red-500/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    <span className="ml-2 text-[9px] font-mono text-muted-foreground tracking-widest">intern.sh</span>
                  </div>

                  <div className="font-mono">
                    {/* Role + company */}
                    <div className="text-primary text-glow-sm text-sm font-bold mb-1">
                      AI / ML Developer
                    </div>
                    <div className="text-foreground font-medium text-base mb-1">
                      DomAIyn Labs
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-primary/60" />
                        2025 — present
                      </span>
                    </div>

                    {/* What I do */}
                    <ul className="space-y-2 text-xs text-foreground/75 leading-relaxed">
                      {[
                        "Building systems to protect LLMs against adversarial prompt attacks",
                        "Contributing to real-time LLM threat detection & response pipelines",
                        "Developing compliance tooling aligned with EU AI Act requirements",
                        "Researching shadow AI discovery and hallucination detection in regulated environments",
                        "Deploying on-premise AI safety components with zero data exfiltration",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {["Python", "PyTorch", "FastAPI", "LangChain", "FAISS", "HuggingFace", "XGBoost", "EU AI Act"].map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 border border-primary/30 text-primary/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── EDUCATION ── */}
            <div className="reveal" style={{ transitionDelay: "0.15s" }}>
              <div className="flex items-center gap-3 font-mono text-xs text-primary/80 mb-6 uppercase tracking-[0.2em]">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>education.log</span>
              </div>

              <div className="relative pl-6 border-l border-primary/30">
                <div
                  className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary"
                  style={{ boxShadow: "0 0 10px hsl(var(--primary))" }}
                />

                <div className="border border-border bg-card/30 p-4 sm:p-5 hover-glow transition-all duration-500 scanline-sweep">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                    <span className="w-2 h-2 rounded-full bg-red-500/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    <span className="ml-2 text-[9px] font-mono text-muted-foreground tracking-widest">degree.sh</span>
                  </div>

                  <div className="font-mono">
                    <div className="text-primary text-glow-sm text-sm font-bold mb-1">
                      B.Tech — Computer Science & Engineering
                    </div>
                    <div className="text-foreground font-medium text-base mb-2">
                      MSIT · Maharaja Surajmal Institute of Technology
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-primary/60" />
                        2024 — 2028
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary/60" />
                        New Delhi, India
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between font-mono text-[10px] text-muted-foreground mb-1.5">
                        <span>year 2 of 4</span>
                        <span className="text-primary">50%</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-none overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: "50%", boxShadow: "0 0 8px hsl(var(--primary))" }}
                        />
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-foreground/75 leading-relaxed">
                      {[
                        "Core focus: Machine Learning, Data Structures & Algorithms",
                        "Electives: AI, Computer Vision, Database Management",
                        "Active builder — every semester ships a production project",
                        "GGSIPU affiliated · Affiliated to IP University",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {["DSA", "ML", "Computer Vision", "DBMS", "OS", "CN"].map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 border border-primary/30 text-primary/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ══════════════════════════
          CONTACT
      ══════════════════════════ */}
      <section id="contact" className="relative py-16 md:py-32 px-4 sm:px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader num="05" title="CONTACT" subtitle="// open a connection" centered />
          <div className="reveal border border-border bg-card/30 p-5 sm:p-8 md:p-10 font-mono text-xs sm:text-sm text-left hover-glow transition-all duration-500">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border/50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
              <span className="ml-3 text-[10px] text-muted-foreground tracking-widest">contact.sh</span>
            </div>
            <div className="text-primary/80 mb-4">$ contact --send</div>
            <ul className="space-y-3">
              <ContactRow icon={<Mail className="w-4 h-4" />} label="email" href="mailto:abuzaid0205@gmail.com" value="abuzaid0205@gmail.com" />
              <ContactRow icon={<Github className="w-4 h-4" />} label="github" href="https://github.com/Abuzaid-01" value="github.com/Abuzaid-01" />
              <ContactRow icon={<Linkedin className="w-4 h-4" />} label="linkedin" href="https://www.linkedin.com/in/abuzaid01" value="linkedin.com/in/abuzaid01" />
            </ul>
            <div className="mt-6 text-primary text-glow-sm">
              connection: <span className="text-primary-glow animate-pulse">established</span> ●
            </div>
          </div>
          <p className="mt-10 text-xs font-mono text-muted-foreground">
            — built with conviction · the sage is watching ⌐◨-◨ —
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-5 sm:py-6 px-4 sm:px-6 md:px-10 font-mono text-[10px] text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-2 max-w-7xl mx-auto">
        <span>© 2026 abuzaid.exe — all rights reserved</span>
        <span className="flex items-center gap-3">
          <span className="text-primary/60">●</span>
          <span>uptime: ∞</span>
          <span className="text-primary/60">●</span>
          <span>status: <span className="text-primary">online</span></span>
        </span>
      </footer>
    </div>
  );
};

/* ── Sub-components ── */

const SectionHeader = ({
  num, title, subtitle, centered,
}: { num: string; title: string; subtitle: string; centered?: boolean }) => (
  <div className={`mb-14 reveal ${centered ? "text-center" : ""}`}>
    <div className={`flex items-center gap-3 font-mono text-xs text-primary/70 mb-5 ${centered ? "justify-center" : ""}`}>
      <span className="w-10 h-px bg-primary/50" />
      <span className="tracking-[0.2em]">{num} :: section</span>
    </div>
    <h2 className="font-display font-bold tracking-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
      {title}
    </h2>
    <p className="mt-3 font-mono text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

const TerminalLine = ({ cmd, out, multiline }: { cmd: string; out?: string; multiline?: string[] }) => (
  <div className="mb-4">
    <div className="text-primary">$ <span className="text-foreground">{cmd}</span></div>
    {out && <div className="text-foreground/80 pl-3">› {out}</div>}
    {multiline && (
      <div className="pl-3 text-foreground/80 leading-relaxed mt-1">
        {multiline.map((l, i) => <div key={i}>› {l}</div>)}
      </div>
    )}
  </div>
);

const ContactRow = ({ icon, label, href, value }: { icon: React.ReactNode; label: string; href: string; value: string }) => (
  <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 border-b border-border/40 pb-3 group">
    <span className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground/80 transition-colors">
      <span className="text-primary">{icon}</span>
      {label}
    </span>
    <a href={href} target="_blank" rel="noopener noreferrer" className="terminal-link text-foreground">
      {value}
    </a>
  </li>
);

export default Index;
