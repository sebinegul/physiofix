"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface SectionImageProps {
  src: string;
  alt: string;
  index: number;
}

export default function SectionImage({ src, alt, index }: SectionImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative my-10 overflow-hidden rounded-2xl border border-white/[0.06] shadow-xl shadow-black/20"
    >
      <div className="relative aspect-[21/9]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          loading="lazy"
        />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12]/30 via-transparent to-transparent" />
      </div>
      {/* Subtle bottom accent line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}
