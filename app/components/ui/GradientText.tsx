"use client";
import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}

export default function GradientText({ children, className = "", animated = true }: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent ${
        animated ? "animate-gradient-text bg-[length:200%_auto]" : ""
      } ${className}`}
    >
      {children}
    </span>
  );
}
