import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

// Usage: npx tsx prisma/insert-blog.ts '{"title":"...","excerpt":"...","content":"...","category":"...","tags":"...","coverImage":"...","featured":false}'

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const json = process.argv[2];
  if (!json) {
    console.error("Pass JSON as first argument");
    process.exit(1);
  }

  const data = JSON.parse(json);
  if (!data.title || !data.content) {
    console.error("title and content are required");
    process.exit(1);
  }

  const slug = generateSlug(data.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    console.log(`SKIP: "${data.title}" already exists (slug: ${slug})`);
    await prisma.$disconnect();
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

  console.log(`CREATED: ${post.title} -> /blog/${post.slug} (id: ${post.id})`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
