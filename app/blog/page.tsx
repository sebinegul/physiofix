import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import BlogGrid from "./BlogGrid";
import PageTransition from "../components/PageTransition";

export const metadata: Metadata = {
  title: "Physiotherapy Blog",
  description:
    "Expert articles on physiotherapy, rehabilitation, sports recovery, and wellness from Dr.Nishmitha.R.",
  alternates: {
    canonical: "https://physiofix.net/blog",
  },
  openGraph: {
    title: "Physiotherapy & Rehab Blog | PhysioFix",
    description:
      "Expert articles on physiotherapy, rehabilitation, sports recovery, and wellness from Dr.Nishmitha.R.",
    url: "https://physiofix.net/blog",
    type: "website",
  },
};

interface BlogPost {
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
  createdAt: Date;
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        author: true,
        category: true,
        tags: true,
        published: true,
        featured: true,
        createdAt: true,
      },
    });
    return posts;
  } catch (error) {
    return [];
  }
}

export const revalidate = 3600;

// Distinct categories for filter
// Category tabs mirror the actual `category` values stored in the BlogPost
// table so filtering matches. Keep in sync when new categories are introduced.
const ALL_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "conditions", label: "Conditions" },
  { slug: "wellness", label: "Wellness" },
  { slug: "sports", label: "Sports" },
  { slug: "post-surgery", label: "Post-Surgery" },
];

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);

  // Serialize dates
  const serialized = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));
  const serializedFeatured = serialized.filter((p) => p.featured);
  const serializedRegular = serialized.filter((p) => !p.featured);

  return (
    <>
      <PageTransition>
      <div className="relative min-h-screen bg-[#0b0d12]">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b border-white/[0.04]">
          {/* Grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Gradient orbs */}
          <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pb-20">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wider text-white/60 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-blue-400" />
              PhysioFix Journal
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Insights for{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 bg-clip-text text-transparent">
                better recovery
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/40 sm:text-lg">
              Practical guidance on physiotherapy, pain management, and
              rehabilitation from the PhysioFix team.
            </p>

            {/* Categories */}
            <div className="mt-10 flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  data-category={cat.slug}
                  className="category-filter inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/80"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          {posts.length === 0 ? (
            <div className="mx-auto mt-20 max-w-md px-8 py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-white/20" />
              <p className="text-lg font-semibold text-white/70">
                Blog posts coming soon
              </p>
              <p className="mt-2 text-sm text-white/40">
                Check back for expert articles and health tips from
                Dr.Nishmitha.R.
              </p>
            </div>
          ) : (
            <BlogGrid
              featured={serializedFeatured}
              regular={serializedRegular}
            />
          )}

          {/* ── CTA ── */}
          <section className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/[0.06] bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-blue-800/10 p-10 sm:p-14 text-center">
            {/* Glow */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[500px] rounded-full bg-blue-500/15 blur-[100px]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ready to start your recovery journey?
              </h2>
              <p className="mt-3 max-w-lg mx-auto text-sm sm:text-base text-white/50">
                Book a consultation with Dr.Nishmitha.R and get a personalized treatment plan tailored to your needs.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.03] active:scale-[0.97]"
              >
                Book a Consultation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
      </PageTransition>
    </>
  );
}
