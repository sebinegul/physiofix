import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, BookOpen, Clock } from "lucide-react";
import type { Metadata } from "next";
import ScrollReveal from "../components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import Image from "next/image";
import GradientText from "../components/ui/GradientText";

export const metadata: Metadata = {
  title: "Blog | PhysioFix",
  description:
    "Expert articles on physiotherapy, rehabilitation, sports recovery, and wellness from Dr.Nishmitha.R.",
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
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.06),_transparent_40%)]" />
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <BookOpen className="h-4 w-4 text-blue-500" />
              PhysioFix Journal
            </div>
            <h1
              className="mb-4 text-4xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-5xl"
              style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
            >
              Insights for <GradientText>better recovery</GradientText>
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-8 text-slate-500">
              Practical guidance on physiotherapy, pain management, and rehabilitation from the PhysioFix team.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        {posts.length === 0 ? (
          <ScrollReveal>
            <div className="section-shell mx-auto max-w-2xl px-8 py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg font-semibold text-slate-700">Blog posts coming soon</p>
              <p className="mt-2 text-sm text-slate-500">
                Check back for expert articles and health tips from Dr.Nishmitha.R.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Featured posts */}
            {featured.length > 0 && (
              <div className="mb-14">
                <ScrollReveal>
                  <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Featured
                  </h2>
                </ScrollReveal>
                <StaggerContainer className="grid gap-6 md:grid-cols-2" stagger={0.1}>
                  {featured.map((post) => (
                    <StaggerItem key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)]"
                      >
                        {/* Gradient top accent */}
                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {post.coverImage && (
                          <div className="relative h-52 overflow-hidden">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                              <Tag className="h-3 w-3" />
                              {post.category.replace("-", " ")}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Clock className="h-3 w-3" />
                              {estimateReadTime(post.content)}
                            </span>
                          </div>
                          <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mb-4 flex-1 text-sm leading-6 text-slate-500 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all duration-300 group-hover:gap-2.5">
                            Read article <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* All posts */}
            <div>
              <ScrollReveal>
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                  {featured.length > 0 ? "All Posts" : "Latest Articles"}
                </h2>
              </ScrollReveal>
              <StaggerContainer className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
                {regular.map((post) => (
                  <StaggerItem key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-slate-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 hover:shadow-[0_16px_50px_rgba(59,130,246,0.1)]"
                    >
                      {post.coverImage && (
                        <div className="relative h-44 overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                            {post.category.replace("-", " ")}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="h-2.5 w-2.5" />
                            {estimateReadTime(post.content)}
                          </span>
                        </div>
                        <h3 className="mb-1.5 text-base font-bold text-slate-900 line-clamp-2 transition-colors duration-300 group-hover:text-blue-700">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mb-3 flex-1 text-sm leading-5 text-slate-500 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                          <span className="text-xs text-slate-400">{post.author}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(post.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
