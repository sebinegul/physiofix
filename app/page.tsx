import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PageTransition from "./components/PageTransition";
import HomeSections from "./sections/HomeSections";
import { prisma } from "@/lib/prisma";
import { safeJsonLd } from "@/lib/json-ld";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://physiofix.net/",
  },
};

// Genuine patient reviews power Review/AggregateRating schema (star
// ratings in search results). Falls back gracefully if DB is cold.
async function getReviewSchema() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      select: { name: true, rating: true, text: true },
    });
    if (testimonials.length === 0) return null;

    const total = testimonials.reduce((s, t) => s + t.rating, 0);
    const avg = Math.round((total / testimonials.length) * 10) / 10;

    return safeJsonLd({
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "@id": "https://physiofix.net/#organization",
      name: "PhysioFix",
      url: "https://physiofix.net",
      review: testimonials.slice(0, 5).map((t) => ({
        "@type": "Review",
        author: { "@type": "Person", name: t.name },
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(t.rating),
          bestRating: "5",
        },
        reviewBody: t.text,
      })),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(avg),
        reviewCount: String(testimonials.length),
        bestRating: "5",
      },
    });
  } catch {
    return null;
  }
}

export default async function Home() {
  const reviewSchema = await getReviewSchema();
  return (
    <PageTransition>
      <main className="overflow-x-hidden bg-transparent">
        {reviewSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: reviewSchema }}
          />
        )}
        <HomeSections />
      </main>
    </PageTransition>
  );
}
