import { useEffect, useRef, useState } from "react";

export const useParallax = (intensity = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        const elementTop = scrolled + rect.top;
        const distance = window.scrollY - elementTop + window.innerHeight;
        setOffset(distance * intensity);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [intensity]);

  return { ref, offset };
};
