import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Clock, Share2 } from "lucide-react";
import type { Metadata } from "next";
import ScrollReveal from "../../components/ui/ScrollReveal";

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

  return {
    title: `${post.title} | PhysioFix Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="section-shell mx-auto max-w-md px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Post Not Found</h1>
          <p className="text-slate-500 mb-6">
            The blog post you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="btn-primary !text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero */}
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <Tag className="h-3 w-3" />
                {post.category.replace("-", " ")}
              </span>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                {estimateReadTime(post.content)}
              </span>
            </div>

            <h1
              className="mb-4 text-3xl font-black leading-[1.2] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]"
              style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mb-6 max-w-3xl text-lg leading-8 text-slate-500">{post.excerpt}</p>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                <p className="text-xs text-slate-400">PhysioFix Team</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-10">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24">
        <ScrollReveal>
          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-8 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:bg-blue-50 prose-code:text-blue-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm prose-code:font-normal prose-pre:bg-slate-950 prose-pre:text-slate-200">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </ScrollReveal>

        {/* Tags */}
        {post.tags && (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.split(",").map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="btn-primary !text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
