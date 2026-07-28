"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import SpotlightCard from "../components/ui/SpotlightCard";
import WordFadeIn from "../components/ui/WordFadeIn";

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string;
  category: string;
  tags: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

interface BlogGridProps {
  featured: Post[];
  regular: Post[];
}

const CATEGORY_LABELS: Record<string, string> = {
  "sports-injury": "Sports Injury",
  rehabilitation: "Rehabilitation",
  "joint-pain": "Joint Pain",
  "neck-back-pain": "Neck & Back",
  wellness: "Wellness",
  fitness: "Fitness",
  "posture-ergonomics": "Posture",
  "women-health": "Women's Health",
  "pediatric-physio": "Pediatric",
  geriatric: "Geriatric",
  general: "General",
};

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    general: "border-white/10 text-white/60 bg-white/[0.04]",
    "sports-injury": "border-orange-500/30 text-orange-300 bg-orange-500/10",
    rehabilitation:
      "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
    "neck-back-pain":
      "border-purple-500/30 text-purple-300 bg-purple-500/10",
    "joint-pain": "border-rose-500/30 text-rose-300 bg-rose-500/10",
    fitness: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
    "posture-ergonomics":
      "border-amber-500/30 text-amber-300 bg-amber-500/10",
    wellness: "border-blue-500/30 text-blue-300 bg-blue-500/10",
    "women-health": "border-pink-500/30 text-pink-300 bg-pink-500/10",
    "pediatric-physio":
      "border-indigo-500/30 text-indigo-300 bg-indigo-500/10",
    geriatric: "border-teal-500/30 text-teal-300 bg-teal-500/10",
  };
  const key = category.toLowerCase().replace(/\s+/g, "-");
  return colors[key] || "border-white/10 text-white/60 bg-white/[0.04]";
}

export default function BlogGrid({
  featured,
  regular,
}: BlogGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle filter clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".category-filter");
      if (!target) return;
      const cat = (target as HTMLElement).dataset.category;
      if (cat) {
        setActiveFilter(cat);
        // Animate items in
        setVisibleItems(new Set());

        // Update active state styling
        document.querySelectorAll(".category-filter").forEach((btn) => {
          btn.classList.remove(
            "border-blue-500/40",
            "bg-blue-500/10",
            "text-blue-300"
          );
          if (
            (btn as HTMLElement).dataset.category === cat
          ) {
            btn.classList.add(
              "border-blue-500/40",
              "bg-blue-500/10",
              "text-blue-300"
            );
          }
        });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const filteredFeatured = featured.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );
  const filteredRegular = regular.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  // Show items one by one
  const allFiltered = [...filteredFeatured, ...filteredRegular];
  useEffect(() => {
    if (!mounted) return;
    const ids = allFiltered.map((p) => p.id);
    ids.forEach((id, i) => {
      setTimeout(() => {
        setVisibleItems((prev) => new Set(prev).add(id));
      }, i * 80);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, mounted]);

  const hasContent = filteredFeatured.length > 0 || filteredRegular.length > 0;

  if (!hasContent) {
    return (
      <div className="mt-20 text-center">
        <p className="text-white/40">No posts in this category yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Featured hero card (first featured) */}
      {filteredFeatured.length > 0 && (
        <div className="mb-10">
          <WordFadeIn
            text="Featured"
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30"
            as="p"
            duration={0.4}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {filteredFeatured.slice(0, 2).map((post, i) => (
              <SpotlightCard
                key={post.id}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent transition-all duration-500 ${
                  i === 0
                    ? "md:col-span-1 md:row-span-1"
                    : "md:col-span-1"
                } ${
                  visibleItems.has(post.id)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{
                  transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s`,
                }}
                spotlightColor="rgba(59, 130, 246, 0.1)"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex h-full flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
                        <span className="text-5xl font-black text-white/[0.06]">
                          P
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
                    {/* Top gradient accent */}
                    <div className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 group-hover:w-full" />

                    {/* Category badge */}
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${getCategoryColor(post.category)}`}
                    >
                      {CATEGORY_LABELS[post.category] ||
                        post.category.replace(/-/g, " ")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-3 text-[11px] text-white/30">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {estimateReadTime(post.content)}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-blue-300">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mb-4 flex-1 text-sm leading-relaxed text-white/40 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm font-medium text-white/40 transition-all duration-300 group-hover:text-blue-300">
                      Read article
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* Regular posts grid */}
      <div>
        <WordFadeIn
          text={filteredFeatured.length > 0 ? "Latest Articles" : "All Posts"}
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30"
          as="p"
          duration={0.4}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRegular.map((post, i) => (
            <SpotlightCard
              key={post.id}
              className={`group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] ${
                visibleItems.has(post.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{
                transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s`,
              }}
              spotlightColor="rgba(59, 130, 246, 0.06)"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-900/10 to-indigo-900/10">
                      <span className="text-4xl font-black text-white/[0.04]">
                        P
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
                  <div className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 group-hover:w-full" />

                  <span
                    className={`absolute left-2.5 top-2.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${getCategoryColor(post.category)}`}
                  >
                    {CATEGORY_LABELS[post.category] ||
                      post.category.replace(/-/g, " ")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1.5 flex items-center gap-2 text-[10px] text-white/25">
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {estimateReadTime(post.content)}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <h3 className="mb-1.5 text-sm font-bold leading-snug text-white line-clamp-2 transition-colors duration-300 group-hover:text-blue-300">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mb-3 flex-1 text-xs leading-relaxed text-white/35 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <span className="text-[11px] text-white/30">
                      {post.author}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-white/20 transition-all duration-300 group-hover:text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
}
