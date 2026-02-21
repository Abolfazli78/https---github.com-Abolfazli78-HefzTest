import React from "react";

type PatternOverlayProps = {
  className?: string;
  opacity?: number;
};

export function PatternOverlay({ className = "", opacity = 0.03 }: PatternOverlayProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      <defs>
        <pattern id="geo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 H20" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
          <path d="M10 0 V20" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
          <circle cx="10" cy="10" r="2" fill="#ffffff" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo)" />
    </svg>
  );
}