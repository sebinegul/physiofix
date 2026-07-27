import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import ScrollReveal from "../../components/ui/ScrollReveal";
import {
  ShareButton,
  TocMobile,
  TocDesktop,
} from "./BlogPostClient";
import { slugify, parseToc } from "./utils";

/* ────────────────────────────────────────────────────────────────────────
   SEO – generateMetadata
   ──────────────────────────────────────────────────────────────────────── */
interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return { title: "Post Not Found | PhysioFix" };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://physiobhavitha.com";

  return {
    title: `${post.title} | PhysioFix Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/* ────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────── */
function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

const categoryColors: Record<string, string> = {
  general: "bg-slate-100 text-slate-700 border-slate-200",
  "sports-injury": "bg-orange-50 text-orange-700 border-orange-200",
  "posture-ergonomics": "bg-amber-50 text-amber-700 border-amber-200",
  "joint-pain": "bg-rose-50 text-rose-700 border-rose-200",
  "neck-back-pain": "bg-purple-50 text-purple-700 border-purple-200",
  rehabilitation: "bg-emerald-50 text-emerald-700 border-emerald-200",
  fitness: "bg-cyan-50 text-cyan-700 border-cyan-200",
  wellness: "bg-blue-50 text-blue-700 border-blue-200",
  "women-health": "bg-pink-50 text-pink-700 border-pink-200",
  "pediatric-physio": "bg-indigo-50 text-indigo-700 border-indigo-200",
  geriatric: "bg-teal-50 text-teal-700 border-teal-200",
};

function getCategoryColor(category: string) {
  const key = category.toLowerCase().replace(/\s+/g, "-");
  return categoryColors[key] || "bg-blue-50 text-blue-700 border-blue-200";
}

/** Convert h2/h3 tags in content to have anchor IDs */
function addHeadingIds(html: string): string {
  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level, attrs, innerText) => {
      const text = innerText.replace(/<[^>]*>/g, "").trim();
      const id = slugify(text);
      return `<h${level}${attrs} id="${id}"><a href="#${id}" class="group">${innerText}</a></h${level}>`;
    }
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────── */
export const revalidate = 3600; // Cache for 1 hour

export default async function BlogPostPage({ params }: Props) {
  // Parallel: fetch post + related posts in same category at the same time
  const [post, sameCategoryPosts] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug: params.slug } }),
    prisma.blogPost.findMany({
      where: { published: true, category: { not: "" } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        category: true,
        createdAt: true,
      },
    }),
  ]);

  if (!post || !post.published) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="mx-auto max-w-md px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Post Not Found
          </h1>
          <p className="text-slate-500 mb-6">
            The blog post you are looking for does not exist or has been
            removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  // Compute related posts client-side from the single fetch
  const sameCat = sameCategoryPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);
  const needMore = 3 - sameCat.length;
  const relatedPosts =
    needMore > 0
      ? [
          ...sameCat,
          ...sameCategoryPosts
            .filter(
              (p) =>
                p.id !== post.id &&
                p.category !== post.category &&
                !sameCat.some((s) => s.id === p.id)
            )
            .slice(0, needMore),
        ]
      : sameCat;

  // Process content: add heading IDs
  const processedContent = addHeadingIds(post.content);

  // Parse TOC from processed content
  const toc = parseToc(processedContent);

  const readTime = estimateReadTime(post.content);
  const dateStr = new Date(post.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hasToc = toc.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt || post.title,
            image: post.coverImage || undefined,
            author: {
              "@type": "Person",
              name: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: "PhysioFix",
              logo: {
                "@type": "ImageObject",
                url:
                  (process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://physiobhavitha.com") + "/logo.png",
              },
            },
            datePublished: post.createdAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                (process.env.NEXT_PUBLIC_SITE_URL ||
                  "https://physiobhavitha.com") +
                `/blog/${post.slug}`,
            },
          }),
        }}
      />

      {/* ── Hero ── */}
      <div className="relative pt-28 pb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.06),_transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            {/* Category + Meta row */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getCategoryColor(
                  post.category
                )}`}
              >
                <Tag className="h-3 w-3" />
                {post.category.replace(/-/g, " ")}
              </span>
            </div>

            {/* Title */}
            <h1
              className="mb-5 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]"
              style={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
              }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-500">
                {post.excerpt}
              </p>
            )}

            {/* Author + meta + share */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-500/20">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {post.author}
                  </p>
                  <p className="text-xs text-slate-400">PhysioFix Team</p>
                </div>
              </div>

              <span className="hidden sm:block h-5 w-px bg-slate-200" />

              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {dateStr}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {readTime}
                </span>
              </div>

              <span className="hidden sm:block h-5 w-px bg-slate-200" />

              <ShareButton title={post.title} />
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Cover Image ── */}
      {post.coverImage && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-10">
          <ScrollReveal>
            <div className="relative max-h-[520px] overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-[0_8px_40px_rgba(15,23,42,0.1)]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                className="object-cover"
                priority
              />
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-10">
          {/* Main content column */}
          <div className="min-w-0 flex-1">
            {/* Mobile TOC */}
            {hasToc && <TocMobile items={toc} />}

            {/* Article */}
            <ScrollReveal>
              <article
                className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-8 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:bg-blue-50 prose-code:text-blue-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm prose-code:font-normal prose-pre:bg-slate-950 prose-pre:text-slate-200 prose-headings:scroll-mt-24 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:not-italic"
                style={
                  {
                    "--tw-prose-img-border-radius": "1rem",
                    "--tw-prose-img-box-shadow":
                      "0 4px 20px rgba(0,0,0,0.08)",
                  } as React.CSSProperties
                }
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </ScrollReveal>

            {/* Tags */}
            {post.tags && (
              <div className="mt-14 pt-8 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-400 mr-1" />
                  {post.tags.split(",").map((tag, i) => {
                    const t = tag.trim();
                    if (!t) return null;
                    return (
                      <Link
                        key={i}
                        href={`/blog?tag=${encodeURIComponent(t)}`}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      >
                        {t}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CTA ── */}
            <div className="mt-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white">
              <h3
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: "var(--font-plus-jakarta), sans-serif",
                }}
              >
                Need Expert Physiotherapy?
              </h3>
              <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                Book a consultation with Dr. Nishmitha R and get a
                personalised treatment plan for your recovery.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  Book Consultation
                </Link>
                <a
                  href="https://wa.me/918151912525?text=Hi%2C%20I%20need%20physiotherapy%20consultation"
                  target="_blank"
                  className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* ── Related Posts ── */}
            {relatedPosts.length > 0 && (
              <div className="mt-20">
                <h2
                  className="text-2xl font-bold text-slate-900 mb-8"
                  style={{
                    fontFamily: "var(--font-plus-jakarta), sans-serif",
                  }}
                >
                  Related Articles
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.slug}`}
                      className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        {rp.coverImage ? (
                          <Image
                            src={rp.coverImage}
                            alt={rp.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-2xl font-bold text-blue-200">
                            {rp.title.charAt(0)}
                          </div>
                        )}
                        <span
                          className={`absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
                            rp.category
                          )}`}
                        >
                          {rp.category.replace(/-/g, " ")}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                          {rp.title}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {new Date(rp.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="mt-14 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all articles
              </Link>
            </div>
          </div>

          {/* ── Desktop sidebar (TOC) ── */}
          {hasToc && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <TocDesktop items={toc} />
            </aside>
          )}
        </div>
      </div>

      {/* ── Custom prose styles for images ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .prose img {
              border-radius: 1rem;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              margin-top: 2rem;
              margin-bottom: 2rem;
            }
            .prose pre {
              border-radius: 1rem;
            }
            .prose h2 a,
            .prose h3 a {
              color: inherit;
              text-decoration: none;
            }
            .prose h2 a:hover,
            .prose h3 a:hover {
              color: #2563eb;
            }
            .prose h2 a::before,
            .prose h3 a::before {
              content: '#';
              opacity: 0;
              margin-right: 0.25em;
              transition: opacity 0.2s;
            }
            .prose h2:hover a::before,
            .prose h3:hover a::before {
              opacity: 0.4;
            }
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-in {
              animation: fade-in 0.3s ease-out;
            }
          `,
        }}
      />
    </div>
  );
}
