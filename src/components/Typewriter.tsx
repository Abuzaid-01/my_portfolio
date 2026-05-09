import { useEffect, useState } from "react";

interface Props {
  phrases: string[];
  speed?: number;
  pause?: number;
  className?: string;
}

export const Typewriter = ({ phrases, speed = 60, pause = 1800, className = "" }: Props) => {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = phrases[i % phrases.length];
    if (!del && text === current) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setI((n) => n + 1);
      return;
    }
    const t = setTimeout(
      () => setText(del ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)),
      del ? speed / 2 : speed
    );
    return () => clearTimeout(t);
  }, [text, del, i, phrases, speed, pause]);

  return <span className={`typewriter-caret ${className}`}>{text}</span>;
};
