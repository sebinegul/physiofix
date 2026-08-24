import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

/**
 * Dynamic OG image for blog posts: branded gradient card with the post title.
 * Next.js serves this at /blog/<slug>/opengraph-image
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, author: true },
  });

  const title =
    post?.title.replace(/(.{60})./, "$1 ") ?? "PhysioFix Physiotherapy Blog";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0b0d12 0%, #1e1b4b 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            P
          </div>
          <div style={{ color: "#93c5fd", fontSize: 26, fontWeight: 600 }}>
            PhysioFix
          </div>
        </div>

        <div
          style={{
            color: "white",
            fontSize: title.length > 70 ? 52 : 64,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 24 }}>
            {post?.author ?? "Dr.Nishmitha.R"}
          </div>
          <div style={{ color: "#64748b", fontSize: 22 }}>
            physiofix.net · JP Nagar, Bangalore
          </div>
        </div>
      </div>
    ),
    size
  );
}
