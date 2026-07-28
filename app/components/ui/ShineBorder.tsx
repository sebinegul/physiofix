"use client";

import { type ReactNode } from "react";

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
  active?: boolean;
}

export default function ShineBorder({
  children,
  className = "",
  color = "rgba(59,130,246,0.5)",
  active = true,
}: ShineBorderProps) {
  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shine overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background: `linear-gradient(105deg, transparent 30%, ${color} 45%, transparent 55%, transparent 70%)`,
            backgroundSize: "300% 100%",
            animation: "shimmer 4s ease-in-out infinite",
          }}
        />
      </div>
      {children}
    </div>
  );
}
