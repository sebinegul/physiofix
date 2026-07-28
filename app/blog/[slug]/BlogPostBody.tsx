"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Share2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Tag,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { slugify, parseToc } from "./utils";

export type TocItem = { id: string; text: string; level: number };
export { slugify, parseToc };

/* ── Toast ── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded-xl bg-white/10 border border-white/[0.08] px-5 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
        {message}
      </div>
    </div>
  );
}

/* ── Share Button ── */
export function ShareButton({ title }: { title: string }) {
  const [toast, setToast] = useState<string | null>(null);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setToast("Link copied!");
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/50 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:text-white/80"
        aria-label="Share article"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

/* ── TOC highlight hook ── */
function useTocHighlight(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>("");
  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);
  return activeId;
}

/* ── Mobile TOC ── */
export function TocMobile({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const activeId = useTocHighlight(items);
  if (items.length === 0) return null;
  return (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/[0.06]"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-400" />
          Table of Contents
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white/40" />
        )}
      </button>
      {open && (
        <nav className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
          <TocList items={items} activeId={activeId} />
        </nav>
      )}
    </div>
  );
}

/* ── Desktop TOC ── */
export function TocDesktop({ items }: { items: TocItem[] }) {
  const activeId = useTocHighlight(items);
  if (items.length === 0) return null;
  return (
    <div className="sticky top-24">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">
        On this page
      </p>
      <nav className="space-y-0.5 border-l border-white/[0.06] pl-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block rounded-lg px-3 py-1.5 text-sm transition-all ${
              item.level === 3 ? "pl-6" : ""
            } ${
              activeId === item.id
                ? "border-l-2 -ml-[calc(1rem+1px)] border-blue-500 bg-blue-500/5 font-medium text-blue-300"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

function TocList({ items, activeId }: { items: TocItem[]; activeId: string }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block rounded-lg px-3 py-1.5 text-sm transition-all ${
              item.level === 3 ? "pl-6" : ""
            } ${
              activeId === item.id
                ? "bg-blue-500/10 font-semibold text-blue-300"
                : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ── Blog Post Body ── */
interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  createdAt: string;
}

interface BlogPostBodyProps {
  content: string;
  toc: TocItem[];
  hasToc: boolean;
  tags: string | null;
  title: string;
  relatedPosts: RelatedPost[];
}

export default function BlogPostBody({
  content,
  toc,
  hasToc,
  tags,
  title,
  relatedPosts,
}: BlogPostBodyProps) {
  const categoryColors: Record<string, string> = {
    "sports-injury": "border-orange-500/30 text-orange-300 bg-orange-500/10",
    rehabilitation: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
    "neck-back-pain": "border-purple-500/30 text-purple-300 bg-purple-500/10",
    "joint-pain": "border-rose-500/30 text-rose-300 bg-rose-500/10",
    fitness: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
    "posture-ergonomics": "border-amber-500/30 text-amber-300 bg-amber-500/10",
    wellness: "border-blue-500/30 text-blue-300 bg-blue-500/10",
    "women-health": "border-pink-500/30 text-pink-300 bg-pink-500/10",
    "pediatric-physio": "border-indigo-500/30 text-indigo-300 bg-indigo-500/10",
    geriatric: "border-teal-500/30 text-teal-300 bg-teal-500/10",
  };

  return (
    <>
      {/* Mobile TOC */}
      {hasToc && <TocMobile items={toc} />}

      {/* Article */}
      <article
        className="prose prose-invert prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-white prose-headings:scroll-mt-24
          prose-p:text-white/70 prose-p:leading-8
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:bg-white/[0.06] prose-code:text-blue-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm prose-code:font-normal
          prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.06] prose-pre:text-white/80
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/[0.04] prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-white/60
          prose-li:text-white/70
          prose-hr:border-white/[0.06]
          prose-img:rounded-2xl prose-img:shadow-2xl prose-img:shadow-black/30"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Tags */}
      {tags && (
        <div className="mt-14 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-white/30 mr-1" />
            {tags.split(",").map((tag, i) => {
              const t = tag.trim();
              if (!t) return null;
              return (
                <Link
                  key={i}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/80"
                >
                  {t}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Share */}
      <div className="mt-8">
        <ShareButton title={title} />
      </div>

      {/* ── CTA ── */}
      <div className="mt-16 relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-blue-900/20 p-8 sm:p-12 text-center">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-3">
            Need Expert Physiotherapy?
          </h3>
          <p className="text-white/50 mb-6 max-w-lg mx-auto text-sm">
            Book a consultation with Dr. Nishmitha R and get a personalised
            treatment plan for your recovery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              Book Consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/918151912525?text=Hi%2C%20I%20need%20physiotherapy%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:text-white"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-white mb-8">
            Related Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => {
              const key = rp.category.toLowerCase().replace(/\s+/g, "-");
              const colorClass =
                categoryColors[key] ||
                "border-white/10 text-white/60 bg-white/[0.04]";
              return (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/[0.02]">
                    {rp.coverImage ? (
                      <Image
                        src={rp.coverImage}
                        alt={rp.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-900/10 to-indigo-900/10">
                        <span className="text-3xl font-black text-white/[0.04]">
                          P
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
                    <span
                      className={`absolute left-2.5 top-2.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${colorClass}`}
                    >
                      {rp.category.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-300 transition-colors">
                      {rp.title}
                    </h3>
                    <span className="text-[11px] text-white/30">
                      {new Date(rp.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-14 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white/50 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:text-white/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all articles
        </Link>
      </div>
    </>
  );
}
