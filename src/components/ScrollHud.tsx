import { useEffect, useState } from "react";

export const ScrollHud = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.round((h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filled = Math.round(pct / 10);
  const bar = "█".repeat(filled) + "░".repeat(10 - filled);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-[10px] text-primary/80 bg-background/60 backdrop-blur-sm px-2 py-1 border border-border">
      [{bar}] {String(pct).padStart(3, " ")}%
    </div>
  );
};
