import { useRef, useState, useCallback } from "react";

export const useMouseTilt = (intensity = 8) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg)", transition: "transform 0.1s ease-out" });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg)`,
      transition: "transform 0.1s ease-out",
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.4s ease-out",
    });
  }, []);

  return { ref, style, handleMouseMove, handleMouseLeave };
};
