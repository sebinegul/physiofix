import { prisma } from "@/lib/prisma";
import { safeJsonLd } from "@/lib/json-ld";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import BlogPostBody, { TocDesktop } from "./BlogPostBody";
import { slugify, parseToc } from "./utils";
import PageTransition from "../../components/PageTransition";

/* ── SEO ── */
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: (await params).slug },
  });

  if (!post) {
    return { title: "Post Not Found | PhysioFix" };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://physiofix.net";

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/* ── Helpers ── */
function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

const categoryColors: Record<string, string> = {
  general: "border-white/10 text-white/60 bg-white/[0.04]",
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

function getCategoryColor(category: string) {
  const key = category.toLowerCase().replace(/\s+/g, "-");
  return categoryColors[key] || "border-white/10 text-white/60 bg-white/[0.04]";
}

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

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  const [post, sameCategoryPosts] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug: (await params).slug } }),
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
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
        <div className="mx-auto max-w-md px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-3">
            Post Not Found
          </h1>
          <p className="text-white/40 mb-6">
            The blog post you are looking for does not exist or has been
            removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

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

  const processedContent = addHeadingIds(post.content);
  const toc = parseToc(processedContent);
  const readTime = estimateReadTime(post.content);
  const dateStr = new Date(post.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hasToc = toc.length > 0;

  return (
    <>
      <PageTransition>
      <div className="relative min-h-screen bg-[#0b0d12]">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
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
                      "https://physiofix.net") + "/physiofix.png",
                },
              },
              datePublished: post.createdAt.toISOString(),
              dateModified: post.updatedAt.toISOString(),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id":
                  (process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://physiofix.net") +
                  `/blog/${post.slug}`,
              },
            }),
          }}
        />

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-white/[0.04]">
          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          {/* Glow orbs */}
          <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-blue-500/8 blur-[140px]" />
          <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/6 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            {/* Back link */}
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/50 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:text-white/80"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All articles
            </Link>

            {/* Category */}
            <div className="mb-5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${getCategoryColor(post.category)}`}
              >
                <Tag className="h-3 w-3" />
                {post.category.replace(/-/g, " ")}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-5 max-w-3xl text-3xl font-black leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
                {post.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {post.author}
                  </p>
                  <p className="text-xs text-white/30">PhysioFix Team</p>
                </div>
              </div>

              <span className="hidden sm:block h-5 w-px bg-white/[0.08]" />

              <div className="flex items-center gap-4 text-sm text-white/40">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {dateStr}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {readTime}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cover Image ── */}
        {post.coverImage && (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
            <div className="relative aspect-[21/9] max-h-[480px] overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12]/40 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex gap-10">
            {/* Main content */}
            <div className="min-w-0 flex-1 max-w-3xl mx-auto lg:mx-0">
              <BlogPostBody
                content={processedContent}
                toc={toc}
                hasToc={hasToc}
                tags={post.tags}
                title={post.title}
                relatedPosts={relatedPosts.map((rp) => ({
                  ...rp,
                  createdAt: rp.createdAt.toISOString(),
                }))}
              />
            </div>

            {/* Desktop TOC sidebar */}
            {hasToc && (
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <TocDesktop items={toc} />
              </aside>
            )}
          </div>
        </div>
      </div>
      </PageTransition>
    </>
  );
}
