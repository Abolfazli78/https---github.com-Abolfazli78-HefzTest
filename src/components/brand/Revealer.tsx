"use client";
import React, { useEffect, useRef, useState } from "react";

type RevealerProps = {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
  delay?: number; // ms
};

export function Revealer({ children, as = "div", className = "", once = true, delay = 0 }: RevealerProps) {
  const RefTag = as as any;
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setTimeout(() => setInView(true), delay);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, delay]);

  return (
    <RefTag
      ref={ref}
      className={
        `transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ` +
        `${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} ` +
        className
      }
    >
      {children}
    </RefTag>
  );
}