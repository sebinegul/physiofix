import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { readFileSync } from "fs";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function insertOne(data: any) {
  if (!data.title || !data.content) {
    console.log(`SKIP invalid draft (missing title/content)`);
    return;
  }
  const slug = generateSlug(data.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    console.log(`SKIP: "${data.title}" already exists (slug: ${slug})`);
    return;
  }
  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      author: data.author || "Dr.Nishmitha.R",
      category: data.category || "general",
      tags: data.tags || null,
      published: true,
      featured: data.featured || false,
    },
  });
  console.log(`CREATED: ${post.title} -> /blog/${post.slug}`);
}

async function main() {
  const file = process.argv[2];
  if (!file) { console.error("Pass draft JSON path"); process.exit(1); }
  const raw = JSON.parse(readFileSync(file, "utf-8"));
  if (Array.isArray(raw)) {
    for (const d of raw) await insertOne(d);
  } else {
    await insertOne(raw);
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
