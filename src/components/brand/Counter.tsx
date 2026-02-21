"use client";
import React, { useEffect, useRef, useState } from "react";

type CounterProps = {
  from?: number;
  to: number;
  duration?: number; // ms
  className?: string;
  formatter?: (n: number) => string;
};

export function Counter({ from = 0, to, duration = 1500, className = "", formatter }: CounterProps) {
  const [value, setValue] = useState(from);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    startRef.current = start;

    const step = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, duration]);

  const text = formatter ? formatter(value) : String(value);
  return <span className={className}>{text}</span>;
}