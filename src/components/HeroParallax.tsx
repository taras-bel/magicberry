"use client";

import { useEffect, useRef } from "react";

type Props = { children: React.ReactNode };

export default function HeroParallax({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      const y = Math.min(30, window.scrollY / 20);
      el.style.transform = `translateY(${y}px)`;
    };
    const loop = () => {
      onScroll();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref}>{children}</div>;
}


