import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://physiofix.net";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: "daily", priority: 0.9 },
  ];

  // Specialization pages
  const specializations: MetadataRoute.Sitemap = [
    "chiropracticCare",
    "manualTherapy",
    "cuppingTherapy",
    "electrotherapy",
    "physiotherapyAssessment",
    "boneAlignment",
    "softTissueManipulation",
    "orthoSportsNeuroRehabilitation",
    "postureCorrection",
    "postSurgeryRehabilitation",
    "homePhysio",
    "geriatricPhysio",
    "sportsPhysio",
  ].map((slug) => ({
    url: `${baseUrl}/specialization/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
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