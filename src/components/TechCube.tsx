import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const FACES = [
  {
    label: "ML / AI",
    code: "ML",
    accent: "hsl(155 100% 50%)",
    dim: "hsl(155 100% 50% / 0.12)",
    border: "hsl(155 100% 50% / 0.45)",
    items: ["PyTorch 2.x", "scikit-learn", "XGBoost", "Transformers"],
  },
  {
    label: "Backend",
    code: "API",
    accent: "hsl(195 100% 55%)",
    dim: "hsl(195 100% 55% / 0.12)",
    border: "hsl(195 100% 55% / 0.45)",
    items: ["Python 3.11", "FastAPI", "PostgreSQL", "REST APIs"],
  },
  {
    label: "Data",
    code: "DB",
    accent: "hsl(270 80% 72%)",
    dim: "hsl(270 80% 72% / 0.12)",
    border: "hsl(270 80% 72% / 0.45)",
    items: ["FAISS 1.7", "Pandas", "NumPy", "Plotly"],
  },
  {
    label: "LLMs & RAG",
    code: "RAG",
    accent: "hsl(38 100% 60%)",
    dim: "hsl(38 100% 60% / 0.12)",
    border: "hsl(38 100% 60% / 0.45)",
    items: ["LangChain", "Groq API", "RAG pipelines", "MCP"],
  },
  {
    label: "Vision",
    code: "CV",
    accent: "hsl(330 80% 65%)",
    dim: "hsl(330 80% 65% / 0.12)",
    border: "hsl(330 80% 65% / 0.45)",
    items: ["EfficientNet-B2", "PIL / OpenCV", "HuggingFace", "ONNX"],
  },
  {
    label: "Frontend",
    code: "UI",
    accent: "hsl(215 100% 65%)",
    dim: "hsl(215 100% 65% / 0.12)",
    border: "hsl(215 100% 65% / 0.45)",
    items: ["React 18", "TypeScript", "Tailwind CSS", "Streamlit"],
  },
];

const TRANSFORMS = [
  "translateZ(var(--cube-depth))",
  "rotateY(180deg) translateZ(var(--cube-depth))",
  "rotateY(-90deg) translateZ(var(--cube-depth))",
  "rotateY(90deg) translateZ(var(--cube-depth))",
  "rotateX(90deg) translateZ(var(--cube-depth))",
  "rotateX(-90deg) translateZ(var(--cube-depth))",
];

const DRAG_SENSITIVITY = 0.48;
const MANUAL_AUTO_SPEED = 0.18;
const MOMENTUM_FRICTION = 0.92;
const STOP_SPEED = 0.018;

export const TechCube = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const tiltFrameRef = useRef<number | null>(null);
  const renderFrameRef = useRef<number | null>(null);
  const momentumFrameRef = useRef<number | null>(null);
  const manualAutoFrameRef = useRef<number | null>(null);
  const autoStartedAtRef = useRef<number>(0);
  const interactionRef = useRef({
    freeRotate: false,
    dragging: false,
    hovering: false,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    lastMomentumTime: 0,
    lastManualAutoTime: 0,
    rotX: -14,
    rotY: 0,
    velX: 0,
    velY: 0,
  });
  const [faceIndex, setFaceIndex] = useState(0);
  const [freeRotate, setFreeRotate] = useState(false);
  const [dragging, setDragging] = useState(false);
  const active = FACES[faceIndex];

  useEffect(() => {
    autoStartedAtRef.current = performance.now();

    return () => {
      if (tiltFrameRef.current) cancelAnimationFrame(tiltFrameRef.current);
      if (renderFrameRef.current) cancelAnimationFrame(renderFrameRef.current);
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      if (manualAutoFrameRef.current) cancelAnimationFrame(manualAutoFrameRef.current);
    };
  }, []);

  const renderManualRotation = () => {
    if (!cubeRef.current) return;
    const { rotX, rotY, velY } = interactionRef.current;
    const bank = Math.max(-7, Math.min(7, velY * 0.24));

    cubeRef.current.style.transform = `translate3d(0,0,0) rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(3)}deg) rotateZ(${bank.toFixed(3)}deg)`;
  };

  const scheduleManualRender = () => {
    if (renderFrameRef.current) return;

    renderFrameRef.current = requestAnimationFrame(() => {
      renderFrameRef.current = null;
      renderManualRotation();
    });
  };

  const cancelMomentum = () => {
    if (!momentumFrameRef.current) return;
    cancelAnimationFrame(momentumFrameRef.current);
    momentumFrameRef.current = null;
    interactionRef.current.lastMomentumTime = 0;
  };

  const cancelManualAuto = () => {
    if (!manualAutoFrameRef.current) return;
    cancelAnimationFrame(manualAutoFrameRef.current);
    manualAutoFrameRef.current = null;
    interactionRef.current.lastManualAutoTime = 0;
  };

  const startManualAuto = () => {
    if (manualAutoFrameRef.current) return;

    const orbit = (time: number) => {
      const interaction = interactionRef.current;
      if (!interaction.freeRotate || interaction.hovering || interaction.dragging) {
        manualAutoFrameRef.current = null;
        interaction.lastManualAutoTime = 0;
        return;
      }

      const dt = interaction.lastManualAutoTime ? Math.min(time - interaction.lastManualAutoTime, 34) : 16.67;
      const step = dt / 16.67;
      interaction.lastManualAutoTime = time;
      interaction.rotY += MANUAL_AUTO_SPEED * step;
      interaction.velX *= 0.9;
      interaction.velY *= 0.9;
      renderManualRotation();
      manualAutoFrameRef.current = requestAnimationFrame(orbit);
    };

    manualAutoFrameRef.current = requestAnimationFrame(orbit);
  };

  const getAutoPose = () => {
    const elapsed = (performance.now() - autoStartedAtRef.current) % 18000;
    const progress = elapsed / 18000;
    const rotY = progress * 360;
    const rotX = progress <= 0.5 ? -14 + progress * 60 : 46 - progress * 60;

    return { rotX, rotY };
  };

  const startMomentum = () => {
    cancelMomentum();
    cancelManualAuto();

    const glide = (time: number) => {
      const interaction = interactionRef.current;
      if (!interaction.freeRotate || interaction.dragging || interaction.hovering) {
        momentumFrameRef.current = null;
        interaction.lastMomentumTime = 0;
        return;
      }

      const dt = interaction.lastMomentumTime ? Math.min(time - interaction.lastMomentumTime, 34) : 16.67;
      const step = dt / 16.67;
      interaction.lastMomentumTime = time;
      interaction.rotX += interaction.velX * step;
      interaction.rotY += interaction.velY * step;

      const friction = Math.pow(MOMENTUM_FRICTION, step);
      interaction.velX *= friction;
      interaction.velY *= friction;
      renderManualRotation();

      if (Math.abs(interaction.velX) < STOP_SPEED && Math.abs(interaction.velY) < STOP_SPEED) {
        momentumFrameRef.current = null;
        interaction.lastMomentumTime = 0;
        startManualAuto();
        return;
      }

      momentumFrameRef.current = requestAnimationFrame(glide);
    };

    momentumFrameRef.current = requestAnimationFrame(glide);
  };

  const updateTilt = (x: number, y: number) => {
    if (tiltFrameRef.current) cancelAnimationFrame(tiltFrameRef.current);

    tiltFrameRef.current = requestAnimationFrame(() => {
      if (!stageRef.current) return;
      stageRef.current.style.transform = `rotateX(${y.toFixed(3)}deg) rotateY(${x.toFixed(3)}deg) translateZ(0)`;
      tiltFrameRef.current = null;
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;

    if (interaction.freeRotate && interaction.dragging) {
      event.preventDefault();

      const now = performance.now();
      const dx = event.clientX - interaction.lastX;
      const dy = event.clientY - interaction.lastY;
      const dt = Math.max(now - interaction.lastTime, 16);
      const nextVelY = (dx * DRAG_SENSITIVITY * 16.67) / dt;
      const nextVelX = (-dy * DRAG_SENSITIVITY * 16.67) / dt;

      interaction.rotY += dx * DRAG_SENSITIVITY;
      interaction.rotX -= dy * DRAG_SENSITIVITY;
      interaction.velY = interaction.velY * 0.35 + nextVelY * 0.65;
      interaction.velX = interaction.velX * 0.35 + nextVelX * 0.65;
      interaction.lastX = event.clientX;
      interaction.lastY = event.clientY;
      interaction.lastTime = now;
      scheduleManualRender();
      return;
    }

    if (interaction.freeRotate) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    updateTilt(x * 14, y * -12);
  };

  const resetTilt = () => updateTilt(0, 0);

  const toggleFreeRotate = () => {
    setFreeRotate((enabled) => {
      const next = !enabled;
      const interaction = interactionRef.current;

      cancelMomentum();
      cancelManualAuto();
      interaction.freeRotate = next;
      interaction.dragging = false;
      setDragging(false);

      if (next) {
        const { rotX, rotY } = getAutoPose();
        interaction.rotX = rotX;
        interaction.rotY = rotY;
        interaction.velX = 0;
        interaction.velY = 0;
        resetTilt();
        scheduleManualRender();
        if (!interaction.hovering) startManualAuto();
      } else if (cubeRef.current) {
        cubeRef.current.style.transform = "";
        autoStartedAtRef.current = performance.now();
      }

      return next;
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    if (!interaction.freeRotate) return;

    event.preventDefault();
    cancelMomentum();
    cancelManualAuto();
    event.currentTarget.setPointerCapture(event.pointerId);

    interaction.dragging = true;
    interaction.lastX = event.clientX;
    interaction.lastY = event.clientY;
    interaction.lastTime = performance.now();
    interaction.lastMomentumTime = 0;
    interaction.velX = 0;
    interaction.velY = 0;
    setDragging(true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    if (!interaction.freeRotate || !interaction.dragging) return;

    interaction.dragging = false;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    startMomentum();
  };

  const handlePointerEnter = () => {
    const interaction = interactionRef.current;
    interaction.hovering = true;
    cancelManualAuto();
    cancelMomentum();
  };

  const handlePointerLeave = () => {
    const interaction = interactionRef.current;
    interaction.hovering = false;

    if (interaction.freeRotate) {
      interaction.dragging = false;
      setDragging(false);
      startManualAuto();
      return;
    }

    resetTilt();
  };

  return (
    <div className="tech-stack-shell">
      <div
        className={`tech-cube-scene ${freeRotate ? "free-rotate" : ""} ${dragging ? "dragging" : ""}`}
        onDoubleClick={toggleFreeRotate}
        onPointerEnter={handlePointerEnter}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div className="tech-cube-glow" />
        <div className="tech-cube-shadow" />
        <div className="tech-cube-orbit tech-cube-orbit-a" />
        <div className="tech-cube-orbit tech-cube-orbit-b" />
        <div className="tech-cube-orbit tech-cube-orbit-c" />

        <div ref={stageRef} className="tech-cube-stage">
          <div ref={cubeRef} className={`tech-cube ${freeRotate ? "manual" : ""} ${dragging ? "dragging" : ""}`}>
            <div className="tech-cube-core" />
            {FACES.map((face, i) => (
              <div
                key={face.label}
                className="tech-cube-face"
                style={
                  {
                    transform: TRANSFORMS[i],
                    "--face-accent": face.accent,
                    "--face-dim": face.dim,
                    "--face-border": face.border,
                  } as CSSProperties
                }
              >
                <div className="tech-face-code">{face.code}</div>
                <div className="tech-face-header">
                  <span>{face.label}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <ul className="tech-face-list">
                  {face.items.map((item) => (
                    <li key={item}>
                      <span />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tech-stack-controls" aria-label="Tech stack categories">
        {FACES.map((face, i) => (
          <button
            key={face.label}
            type="button"
            onClick={() => setFaceIndex(i)}
            className={i === faceIndex ? "active" : ""}
            style={{ "--dot-color": face.accent } as CSSProperties}
            aria-label={face.label}
            aria-pressed={i === faceIndex}
          />
        ))}
      </div>

      <div className="tech-stack-readout">
        <span style={{ color: active.accent, textShadow: `0 0 10px ${active.accent}` }}>
          {active.label}
        </span>
        <span>{active.items.slice(0, 2).join(" / ")}</span>
      </div>

      <div className="tech-stack-hint">
        {freeRotate ? "drag to rotate · leave to auto" : "double click to rotate"}
      </div>
    </div>
  );
};
