"use client";
import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

interface GradientBorderCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GradientBorderCard({ children, className = "", delay = 0 }: GradientBorderCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      className={`group relative ${className}`}
    >
      <div className="absolute -inset-[1px] rounded-[inherit] bg-gradient-to-br from-teal-400/30 via-cyan-400/20 to-blue-500/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-teal-500/8 to-cyan-500/5 opacity-0 blur-2xl transition-all duration-700 group-hover:translate-y-2 group-hover:opacity-100 group-hover:blur-3xl" />
    </motion.div>
  );
}