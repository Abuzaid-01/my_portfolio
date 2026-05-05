import { useState } from "react";

/* Six faces — one tech category each */
const FACES = [
  {
    label: "ML / AI",
    accent: "hsl(155 100% 50%)",
    dim: "hsl(155 100% 50% / 0.12)",
    border: "hsl(155 100% 50% / 0.45)",
    items: ["PyTorch 2.x", "scikit-learn", "XGBoost", "Transformers"],
  },
  {
    label: "Backend",
    accent: "hsl(195 100% 55%)",
    dim: "hsl(195 100% 55% / 0.12)",
    border: "hsl(195 100% 55% / 0.45)",
    items: ["Python 3.11", "FastAPI", "PostgreSQL", "REST APIs"],
  },
  {
    label: "Data",
    accent: "hsl(270 80% 72%)",
    dim: "hsl(270 80% 72% / 0.12)",
    border: "hsl(270 80% 72% / 0.45)",
    items: ["FAISS 1.7", "Pandas", "NumPy", "Plotly"],
  },
  {
    label: "LLMs & RAG",
    accent: "hsl(38 100% 60%)",
    dim: "hsl(38 100% 60% / 0.12)",
    border: "hsl(38 100% 60% / 0.45)",
    items: ["LangChain", "Groq API", "RAG pipelines", "MCP"],
  },
  {
    label: "Vision",
    accent: "hsl(330 80% 65%)",
    dim: "hsl(330 80% 65% / 0.12)",
    border: "hsl(330 80% 65% / 0.45)",
    items: ["EfficientNet-B2", "PIL / OpenCV", "HuggingFace", "ONNX"],
  },
  {
    label: "Frontend",
    accent: "hsl(215 100% 65%)",
    dim: "hsl(215 100% 65% / 0.12)",
    border: "hsl(215 100% 65% / 0.45)",
    items: ["React 18", "TypeScript", "Tailwind CSS", "Streamlit"],
  },
];

const HALF = 100; // px — half of face width/height (face = 200px)

/*
  Face transforms for a 200px cube:
  front  → translateZ(100px)
  back   → rotateY(180deg) translateZ(100px)
  left   → rotateY(-90deg) translateZ(100px)
  right  → rotateY(90deg)  translateZ(100px)
  top    → rotateX(90deg)  translateZ(100px)
  bottom → rotateX(-90deg) translateZ(100px)
*/
const TRANSFORMS = [
  `translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateY(90deg)  translateZ(${HALF}px)`,
  `rotateX(90deg)  translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
];

export const TechCube = () => {
  const [paused, setPaused] = useState(false);
  const [faceIndex, setFaceIndex] = useState(0);

  const handleClick = () => {
    setFaceIndex((i) => (i + 1) % FACES.length);
  };

  const active = FACES[faceIndex];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Scene */}
      <div
        className="tech-cube-scene"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={handleClick}
        title="Click to cycle · Hover to pause"
        style={{ cursor: "pointer" }}
      >
        <div
          className="tech-cube"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {FACES.map((face, i) => (
            <div
              key={face.label}
              className="tech-cube-face"
              style={{
                transform: TRANSFORMS[i],
                background: face.dim,
                border: `1px solid ${face.border}`,
                boxShadow: `inset 0 0 30px ${face.dim}`,
              }}
            >
              {/* Category label */}
              <div
                className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] mb-3 pb-2 w-full text-center"
                style={{
                  color: face.accent,
                  textShadow: `0 0 8px ${face.accent}`,
                  borderBottom: `1px solid ${face.border}`,
                }}
              >
                {face.label}
              </div>
              {/* Items */}
              <ul className="space-y-1.5 w-full px-2">
                {face.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-[11px] text-foreground/75 flex items-center gap-2"
                  >
                    <span style={{ color: face.accent, opacity: 0.7 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Face indicator dots */}
      <div className="flex items-center gap-2">
        {FACES.map((face, i) => (
          <button
            key={face.label}
            onClick={() => setFaceIndex(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === faceIndex ? active.accent : "hsl(var(--border))",
              boxShadow: i === faceIndex ? `0 0 6px ${active.accent}` : "none",
              transform: i === faceIndex ? "scale(1.4)" : "scale(1)",
            }}
            aria-label={face.label}
          />
        ))}
      </div>

      {/* Active face label */}
      <div
        className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-300"
        style={{ color: active.accent, textShadow: `0 0 8px ${active.accent}` }}
      >
        [ {active.label} ]
      </div>

      <p className="font-mono text-[9px] text-muted-foreground tracking-widest">
        hover to pause · click to cycle
      </p>
    </div>
  );
};
