"use client";

import { useEffect, useRef, useState } from "react";

interface WordFadeInProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export default function WordFadeIn({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
  as: Tag = "div",
}: WordFadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, once]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) rotateX(0)" : "translateY(16px) rotateX(90deg)",
            transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay + i * 0.06}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay + i * 0.06}s`,
          }}
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
