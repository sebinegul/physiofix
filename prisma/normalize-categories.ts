import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

// Normalize stray one-off categories onto the canonical tab categories.
const MAP: [string, string][] = [
  ["posture-correction", "wellness"],
  ["sports-rehab", "sports"],
  ["post-surgical", "post-surgery"],
  ["physiotherapy", "conditions"],
];

async function main() {
  for (const [from, to] of MAP) {
    const posts = await prisma.blogPost.findMany({
      where: { category: from },
      select: { id: true },
    });
    for (const post of posts) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { category: to },
      });
    }
    console.log(`${from} -> ${to}: ${posts.length} updated`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
