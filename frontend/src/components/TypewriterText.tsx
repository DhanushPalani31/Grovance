import { useEffect, useState } from "react";

export default function TypewriterText({ text, speed = 12 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const interval = setInterval(() => {
      i += 2; // reveal a couple characters per tick for a snappier feel
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{shown}</>;
}
