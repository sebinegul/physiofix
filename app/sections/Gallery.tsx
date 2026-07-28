"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "../components/ui/ScrollReveal";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  beforeUrl: string;
  afterUrl: string;
  category: string;
}

function BeforeAfterSlider({ item }: { item: GalleryItem }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      handleMove(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-xl cursor-col-resize select-none group"
      onMouseDown={(e) => {
        isDragging.current = true;
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        isDragging.current = true;
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After image (full) */}
      <div className="absolute inset-0">
        <Image
          src={item.afterUrl}
          alt={`${item.title} - After`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={item.beforeUrl}
          alt={`${item.title} - Before`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${position}%` }}
      >
        {/* Drag handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
            <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 z-20">
        <span className="px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
          Before
        </span>
      </div>
      <div className="absolute top-3 right-3 z-20">
        <span className="px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
          After
        </span>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((json) => {
        const data = json?.data;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 sm:py-20" id="gallery">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50" />
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-400/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-400/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Transformations
          </p>
          <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-4xl md:text-4xl">
            See the progress{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              our patients have made
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-8 text-slate-500">
            Drag the slider to compare before and after — real results from real treatments.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)]">
                {/* Top accent line */}
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30" />

                {/* Before/After Slider */}
                <BeforeAfterSlider item={item} />

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-700 capitalize">
                      {item.category.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
