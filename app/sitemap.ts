import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

// Revalidate hourly so newly published blog posts appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const baseUrl = 'https://physiofix.net';
  // Static pages
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/physiotherapy-kothanur`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];

  // Specialization pages — slugs must match app/specialization/*/page.tsx
  const specializations: MetadataRoute.Sitemap = [
    "chiropracticCare",
    "manualTherapy",
    "cuppingTherapy",
    "electrotherapy",
    "physiotherapyAssessment",
    "boneAlignment",
    "softTissueManipulation",
    "neuroRehabilitation",
    "postureCorrection",
    "postSurgeryRehabilitation",
    "homePhysio",
    "geriatricPhysio",
    "sportsPhysio",
  ].map((slug) => ({
    url: `${baseUrl}/specialization/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog posts from database
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...specializations, ...blogPages];
}