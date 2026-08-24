"use client";

import { useState, useEffect, useRef, Fragment } from "react";
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
  ArrowUp,
  ImageIcon,
} from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { slugify, parseToc } from "./utils";
import { getBlogImages } from "@/lib/blog-images";
import SectionImage from "../../components/blog/SectionImage";

export type TocItem = { id: string; text: string; level: number };
export { slugify, parseToc };

/* ── Helpers ──────────────────────────────────────────────────────────── */

/** Split HTML at H2 boundaries for image injection */
function splitAtHeadings(html: string): { type: "content" | "heading"; html: string }[] {
  const parts = html.split(/(<h[23][^>]*>.*?<\/h[23]>)/i);
  const result: { type: "content" | "heading"; html: string }[] = [];
  for (const part of parts) {
    if (/^<h[23]/i.test(part)) {
      result.push({ type: "heading", html: part });
    } else if (part.trim()) {
      result.push({ type: "content", html: part });
    }
  }
  return result;
}

/* ── Toast ────────────────────────────────────────────────────────────── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="rounded-xl bg-white/10 border border-white/[0.08] px-5 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
        {message}
      </div>
    </motion.div>
  );
}

/* ── Share Button ─────────────────────────────────────────────────────── */
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
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
        >
          <Toast message={toast} onClose={() => setToast(null)} />
        </motion.div>
      )}
    </>
  );
}

/* ── TOC highlight hook ───────────────────────────────────────────────── */
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

/* ── Scroll to top hook ───────────────────────────────────────────────── */
function useScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return { visible, scrollToTop };
}

/* ── Mobile TOC ───────────────────────────────────────────────────────── */
export function TocMobile({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const activeId = useTocHighlight(items);
  if (items.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:hidden mb-8"
    >
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
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
          >
            <div className="p-4">
              <TocList items={items} activeId={activeId} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Desktop TOC ──────────────────────────────────────────────────────── */
export function TocDesktop({ items }: { items: TocItem[] }) {
  const activeId = useTocHighlight(items);
  if (items.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky top-24"
    >
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
    </motion.div>
  );
}

/* ── TOC list (shared) ────────────────────────────────────────────────── */
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

/* ── Back to Top ──────────────────────────────────────────────────────── */
function BackToTop() {
  const { visible, scrollToTop } = useScrollToTop();
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ── Content Section with Scroll-Reveal ───────────────────────────────── */
function ContentSection({
  html,
  index,
  hasImageAfter,
  imageUrl,
  imageAlt,
}: {
  html: string;
  index: number;
  hasImageAfter: boolean;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const isHeading = /^<h[23]/i.test(html);

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, y: isHeading ? 20 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: isHeading ? 0.5 : 0.4,
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={isHeading ? "scroll-mt-24" : ""}
      >
        <div
          className={
            isHeading
              ? "[&>h2]:after:block [&>h2]:after:mt-2 [&>h2]:after:h-[3px] [&>h2]:after:w-12 [&>h2]:after:rounded-full [&>h2]:after:bg-gradient-to-r [&>h2]:after:from-blue-500 [&>h2]:after:to-indigo-500"
              : ""
          }
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </motion.div>

      {/* Section image after headings */}
      {isHeading && hasImageAfter && imageUrl && (
        <SectionImage
          src={imageUrl}
          alt={imageAlt || "Blog section image"}
          index={index}
        />
      )}
    </Fragment>
  );
}

/* ── Related Posts ────────────────────────────────────────────────────── */
interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  createdAt: string;
}

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

/* ── Category → specialization internal links (SEO) ──────────────────── */
const categoryServiceLinks: Record<string, { name: string; href: string }[]> = {
  "sports-injury": [
    { name: "Sports Physiotherapy", href: "/specialization/sportsPhysio" },
    { name: "Post-Surgery Rehabilitation", href: "/specialization/postSurgeryRehabilitation" },
    { name: "Manual Therapy", href: "/specialization/manualTherapy" },
  ],
  rehabilitation: [
    { name: "Neuro Rehabilitation", href: "/specialization/neuroRehabilitation" },
    { name: "Post-Surgery Rehabilitation", href: "/specialization/postSurgeryRehabilitation" },
    { name: "Physiotherapy Assessment", href: "/specialization/physiotherapyAssessment" },
  ],
  "neck-back-pain": [
    { name: "Chiropractic Care", href: "/specialization/chiropracticCare" },
    { name: "Bone Alignment", href: "/specialization/boneAlignment" },
    { name: "Posture Correction", href: "/specialization/postureCorrection" },
  ],
  "joint-pain": [
    { name: "Manual Therapy", href: "/specialization/manualTherapy" },
    { name: "Electrotherapy", href: "/specialization/electrotherapy" },
    { name: "Cupping Therapy", href: "/specialization/cuppingTherapy" },
  ],
  fitness: [
    { name: "Sports Physiotherapy", href: "/specialization/sportsPhysio" },
    { name: "Physiotherapy Assessment", href: "/specialization/physiotherapyAssessment" },
  ],
  "posture-ergonomics": [
    { name: "Posture Correction", href: "/specialization/postureCorrection" },
    { name: "Physiotherapy Assessment", href: "/specialization/physiotherapyAssessment" },
  ],
  wellness: [
    { name: "Cupping Therapy", href: "/specialization/cuppingTherapy" },
    { name: "Soft Tissue Manipulation", href: "/specialization/softTissueManipulation" },
  ],
  "women-health": [
    { name: "Home Physiotherapy", href: "/specialization/homePhysio" },
    { name: "Physiotherapy Assessment", href: "/specialization/physiotherapyAssessment" },
  ],
  "pediatric-physio": [
    { name: "Physiotherapy Assessment", href: "/specialization/physiotherapyAssessment" },
    { name: "Home Physiotherapy", href: "/specialization/homePhysio" },
  ],
  geriatric: [
    { name: "Geriatric Physiotherapy", href: "/specialization/geriatricPhysio" },
    { name: "Home Physiotherapy", href: "/specialization/homePhysio" },
  ],
  general: [
    { name: "Physiotherapy Assessment", href: "/specialization/physiotherapyAssessment" },
    { name: "Sports Physiotherapy", href: "/specialization/sportsPhysio" },
    { name: "Cupping Therapy", href: "/specialization/cuppingTherapy" },
  ],
};

/* ── Main Component ───────────────────────────────────────────────────── */
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
  // Extract category from first heading's tag if possible, or default
  const categoryMatch = content.match(/category:\s*["']?([a-z-]+)/i);
  const category = (categoryMatch?.[1] || "general").toLowerCase().replace(/\s+/g, "-");
  const blogImages = getBlogImages(category);

  // Split content at H2 boundaries
  const sections = splitAtHeadings(content);

  // Map image URLs to heading sections (after each heading)
  let imgIndex = 0;
  const sectionsWithImages = sections.map((section, i) => {
    if (section.type === "heading" && i < sections.length - 1) {
      const img = imgIndex < blogImages.length ? blogImages[imgIndex] : undefined;
      imgIndex++;
      return { ...section, imageUrl: img, hasImageAfter: true };
    }
    return { ...section, imageUrl: undefined, hasImageAfter: false };
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Build alt text from heading text
  function getAltText(html: string, index: number): string {
    const match = html.replace(/<[^>]*>/g, "").trim();
    return match ? `${match} – PhysioFix Blog` : `Blog illustration ${index + 1}`;
  }

  return (
    <>
      {/* Reading progress (in-content) */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600"
        style={{ scaleX }}
      />

      {/* Mobile TOC */}
      {hasToc && <TocMobile items={toc} />}

      {/* Article */}
      <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-headings:scroll-mt-24 prose-p:text-white/70 prose-p:leading-8 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:bg-white/[0.06] prose-code:text-blue-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm prose-code:font-normal prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.06] prose-pre:text-white/80 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/[0.04] prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-white/60 prose-li:text-white/70 prose-hr:border-white/[0.06] prose-img:rounded-2xl prose-img:shadow-2xl prose-img:shadow-black/30">
        {sectionsWithImages.map((section, i) => (
          <ContentSection
            key={i}
            html={section.html}
            index={i}
            hasImageAfter={section.hasImageAfter}
            imageUrl={section.imageUrl}
            imageAlt={
              section.imageUrl
                ? getAltText(section.html, i)
                : undefined
            }
          />
        ))}
      </article>

      {/* Tags */}
      {tags && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 pt-8 border-t border-white/[0.06]"
        >
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
        </motion.div>
      )}

      {/* Share */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8"
      >
        <ShareButton title={title} />
      </motion.div>

      {/* ── Related Treatments (internal links) ── */}
      {(() => {
        const serviceLinks = categoryServiceLinks[category] || categoryServiceLinks.general;
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"
          >
            <h2 className="text-lg font-bold text-white mb-1">Related treatments at PhysioFix</h2>
            <p className="text-sm text-white/50 mb-4">
              Offered in-clinic in JP Nagar and through home visits across Bangalore.
            </p>
            <div className="flex flex-wrap gap-2">
              {serviceLinks.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-200 backdrop-blur-sm transition hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-blue-100"
                >
                  {s.name}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-blue-900/20 p-8 sm:p-12 text-center"
      >
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
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.97]"
            >
              Book Consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/918151912525?text=Hi%2C%20I%20need%20physiotherapy%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:text-white active:scale-[0.97]"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <h2 className="text-xl font-bold text-white mb-8">
            Related Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp, i) => {
              const key = rp.category.toLowerCase().replace(/\s+/g, "-");
              const colorClass =
                categoryColors[key] ||
                "border-white/10 text-white/60 bg-white/[0.04]";
              return (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="group relative block overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-0.5"
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
                          <ImageIcon className="h-8 w-8 text-white/[0.06]" />
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
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-14 text-center"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white/50 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:text-white/80 active:scale-[0.97]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all articles
        </Link>
      </motion.div>

      {/* Back to top */}
      <BackToTop />
    </>
  );
}
