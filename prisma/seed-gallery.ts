import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

const items = [
  {
    title: "Post-Surgery Knee Recovery",
    description:
      "Full range of motion restored after ACL reconstruction — 12 weeks of structured physiotherapy.",
    beforeUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&crop=bottom",
    afterUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    category: "post-surgery",
  },
  {
    title: "Chronic Lower Back Pain",
    description:
      "From barely walking to resuming daily activities — 8 weeks of manual therapy and exercise.",
    beforeUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&crop=top",
    afterUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
    category: "spine",
  },
  {
    title: "Frozen Shoulder Release",
    description:
      "Shoulder flexion improved from 90 to 160 degrees after 10 weeks of mobilisation and stretching.",
    beforeUrl:
      "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&h=600&fit=crop&crop=top",
    afterUrl:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop",
    category: "ortho",
  },
  {
    title: "Sports Injury — Ankle Sprain",
    description:
      "Professional runner returned to competitive training after grade 2 ankle sprain rehabilitation.",
    beforeUrl:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop&crop=top",
    afterUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop",
    category: "sports",
  },
  {
    title: "Posture Correction",
    description:
      "Significant improvement in forward-head posture and rounded shoulders after 6 weeks of targeted exercises.",
    beforeUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
    afterUrl:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&h=600&fit=crop",
    category: "posture",
  },
];

async function main() {
  const count = await prisma.galleryImage.count();
  if (count > 0) {
    console.log(`Gallery already has ${count} items. Skipping.`);
    await prisma.$disconnect();
    return;
  }

  console.log(`Seeding ${items.length} gallery items...\n`);
  for (const item of items) {
    const created = await prisma.galleryImage.create({ data: item });
    console.log(`  OK: ${created.title} (id: ${created.id})`);
  }
  console.log(`\nDone. Gallery items in database: ${items.length}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
