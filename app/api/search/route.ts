import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Static service/treatment definitions with search keywords
const services = [
  {
    title: "Physiotherapy Assessment & Therapy",
    description: "A personalised evaluation to identify pain, mobility and strength concerns early.",
    href: "/specialization/physiotherapyAssessment",
    keywords: ["assessment", "evaluation", "therapy", "physiotherapy", "consultation", "diagnosis", "pain", "mobility", "strength"],
  },
  {
    title: "Electrotherapy",
    description: "Gentle electrical stimulation to reduce pain, relax muscles and support healing.",
    href: "/specialization/electrotherapy",
    keywords: ["electro", "electrical", "stimulation", "TENS", "IFT", "pain relief", "muscle relaxation"],
  },
  {
    title: "Manual Therapy",
    description: "Hands-on techniques to improve movement, ease tension and reduce discomfort.",
    href: "/specialization/manualTherapy",
    keywords: ["manual", "hands-on", "mobilisation", "manipulation", "tension", "stiffness", "joint"],
  },
  {
    title: "Cupping Therapy",
    description: "Relieves stiffness, supports circulation and eases muscle tightness.",
    href: "/specialization/cuppingTherapy",
    keywords: ["cupping", "circulation", "stiffness", "tightness", "blood flow", "recovery"],
  },
  {
    title: "Chiropractic Treatment",
    description: "Spinal and joint care to restore alignment, mobility and comfort.",
    href: "/specialization/chiropracticCare",
    keywords: ["chiropractic", "spine", "spinal", "alignment", "back pain", "adjustment"],
  },
  {
    title: "Bone Alignment Therapy",
    description: "Targeted care for posture, alignment and joint balance in everyday movement.",
    href: "/specialization/boneAlignment",
    keywords: ["bone", "alignment", "posture", "joint", "balance", "fracture"],
  },
  {
    title: "Soft Tissue Manipulation",
    description: "Focused release techniques for tight muscles, trigger points and restricted mobility.",
    href: "/specialization/softTissueManipulation",
    keywords: ["soft tissue", "muscle", "trigger point", "myofascial", "tight", "knot", "strain"],
  },
  {
    title: "Ortho Sports & Neuro Rehab",
    description: "Structured recovery for sports injuries, neurological concerns and long-term rehabilitation.",
    href: "/services",
    keywords: ["ortho", "sports", "neuro", "rehabilitation", "ACL", "ligament", "paralysis", "stroke", "neurological", "sports injury"],
  },
  {
    title: "Sports Rehabilitation",
    description: "Recovery plans for sprains, strains, ACL rehab, tendon issues and return-to-sport readiness.",
    href: "/services",
    keywords: ["sports", "sprain", "strain", "ACL", "tendon", "return to sport", "athletic", "fitness"],
  },
  {
    title: "Physiotherapy at Home",
    description: "Comfortable, personalised sessions at home for recovery, mobility and ageing well.",
    href: "/services",
    keywords: ["home", "home visit", "home care", "house call", "elderly", "geriatric", "senior"],
  },
  {
    title: "Post-Surgery Rehab",
    description: "Structured care after surgery with pain relief, strength rebuilding and confidence in movement.",
    href: "/services",
    keywords: ["post surgery", "postoperative", "surgery recovery", "knee replacement", "hip replacement", "post operative"],
  },
  {
    title: "Posture Correction",
    description: "Movement-based support to improve alignment, reduce strain and build sustainable habits.",
    href: "/services",
    keywords: ["posture", "alignment", "slouch", "ergonomic", "desk", "spine", "cervical", "lumbar"],
  },
  {
    title: "Geriatric Physiotherapy",
    description: "Comprehensive care for elderly patients focusing on mobility, balance and fall prevention.",
    href: "/specialization/geriatricPhysio",
    keywords: ["geriatric", "elderly", "senior", "old age", "fall prevention", "balance", "mobility"],
  },
  {
    title: "Physiotherapy At Home",
    description: "Convenient sessions at home for recovery, mobility and comfort.",
    href: "/specialization/homePhysio",
    keywords: ["home", "home visit", "home physio", "house call", "mobile physio", "bedside"],
  },
  {
    title: "Sports Injury Physiotherapy",
    description: "Recovery plans for sprains, strains, ACL rehab, tendon issues and return-to-sport readiness.",
    href: "/specialization/sportsPhysio",
    keywords: ["sports", "sprain", "strain", "ACL", "tendon", "athletic", "return to sport", "fitness"],
  },
  {
    title: "Neuro Rehabilitation",
    description: "Guided support for coordination, balance, gait, and movement-based recovery after neurological challenges.",
    href: "/specialization/neuroRehabilitation",
    keywords: ["neuro", "neurological", "stroke", "paralysis", "coordination", "gait", "balance", "brain injury"],
  },
  {
    title: "Post-Surgery Rehabilitation",
    description: "Structured care after surgery with pain relief, strength rebuilding and confidence in movement.",
    href: "/specialization/postSurgeryRehabilitation",
    keywords: ["post surgery", "postoperative", "surgery recovery", "knee replacement", "hip replacement", "ACL reconstruction"],
  },
  {
    title: "Posture Correction",
    description: "Movement-based support to improve alignment, reduce strain and build sustainable habits.",
    href: "/specialization/postureCorrection",
    keywords: ["posture", "alignment", "slouch", "ergonomic", "desk", "cervical", "lumbar", "forward head"],
  },
];

interface SearchResult {
  type: "service" | "blog";
  title: string;
  description: string;
  href: string;
}

function matchService(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const service of services) {
    const titleMatch = service.title.toLowerCase().includes(q);
    const keywordMatch = service.keywords.some((kw) => kw.toLowerCase().includes(q));

    if (titleMatch || keywordMatch) {
      results.push({
        type: "service",
        title: service.title,
        description: service.description,
        href: service.href,
      });
    }
  }

  return results;
}

async function matchBlogs(query: string): Promise<SearchResult[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { tags: { contains: q } },
          { category: { contains: q } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return posts.map((post) => ({
      type: "blog" as const,
      title: post.title,
      description: post.excerpt || post.category,
      href: `/blog/${post.slug}`,
    }));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ data: [] });
  }

  const [serviceResults, blogResults] = await Promise.all([
    matchService(q),
    matchBlogs(q),
  ]);

  return NextResponse.json({
    data: [...serviceResults, ...blogResults],
  });
}
