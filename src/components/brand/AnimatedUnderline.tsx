"use client";
import React from "react";

type AnimatedUnderlineProps = {
  className?: string;
};

export function AnimatedUnderline({ className = "" }: AnimatedUnderlineProps) {
  return (
    <span
      aria-hidden="true"
      className={
        "block h-[3px] w-24 md:w-32 lg:w-40 rounded-full " +
        "bg-gradient-to-r from-emerald-400 via-emerald-500 to-yellow-400 " +
        "motion-safe:animate-[underline_1s_ease-out_forwards] " +
        className
      }
      style={{ transformOrigin: "right", animationFillMode: "forwards" }}
    />
  );
}