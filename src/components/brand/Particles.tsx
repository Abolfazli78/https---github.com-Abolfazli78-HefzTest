"use client";
import React from "react";

type ParticlesProps = {
  count?: number;
  className?: string;
};

export function Particles({ count = 10, className = "" }: ParticlesProps) {
  const particles = Array.from({ length: count });
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + className} aria-hidden>
      {particles.map((_, i) => (
        <span
          key={i}
          className="absolute block w-1.5 h-1.5 rounded-full bg-emerald-400/20 blur-[1px]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${6 + Math.random() * 6}s ease-in-out ${Math.random() * 2}s infinite`,
            transform: `translate3d(0,0,0)`
          }}
        />
      ))}
    </div>
  );
}