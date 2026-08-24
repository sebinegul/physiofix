import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

// Topic-matched unique covers for the older posts (all curl-verified 200)
const UPDATES: [string, string][] = [
  // NULL covers first
  ["understanding-back-pain-causes-and-prevention", "1576091160399-112ba8d25d1d"],
  ["5-stretches-to-relieve-neck-pain-from-desk-work", "1581009146145-b5ef050c2e1e"],
  ["understanding-frozen-shoulder-symptoms-stages-and-treatment", "1582750433449-648ed127bb54"],
  ["the-runner-s-knee-guide-prevention-recovery-and-wh", "1461896836934-bd45ba8fcf9b"],
  ["physiotherapy-after-knee-replacement-what-your-rec", "1505751172876-fa1923c5c528"],
  ["the-hidden-link-between-stress-and-chronic-pain", "1545389336-cf090694435e"],
  // Duplicate-cover older posts
  ["sciatica-pain-relief-stretches-exercises-and-when-", "1506126613408-eca07ce68773"],
  ["knee-osteoarthritis-exercises-pain-relief-and-when", "1534258936925-c58bed479fcb"],
  ["back-pain-during-pregnancy-safe-exercises-and-reli", "1499209974431-9dddcece7f8"],
  ["muscle-strains-explained-first-aid-grading-and-whe", "1534438327276-14e5300c3a48"],
  ["herniated-disc-slipped-disc-physiotherapy-treatmen", "1526676037777-05a232554f77"],
  ["shin-splints-causes-treatment-and-how-physiotherap", "1571902943202-507ec2618e8f"],
  ["golfer-s-elbow-medial-epicondylitis-symptoms-and-r", "1559757175-5700dde675bc"],
  ["whiplash-injury-after-a-road-accident-recovery-sta", "1532029837206-abbe2b7620e3"],
  ["acl-injury-rehabilitation-from-surgery-to-return-t", "1522202176988-66273c2fd55f"],
  ["achilles-tendinitis-heel-cord-pain-treatment-and-s", "1584744982491-665216d95f8b"],
  ["lower-back-pain-from-sitting-ergonomics-and-daily-", "1605721911519-3dfeb3be25e7"],
  ["knee-pain-while-climbing-stairs-causes-and-strengt", "1498050108023-c5249f4df085"],
];

async function main() {
  let done = 0;
  for (const [slugPrefix, pid] of UPDATES) {
    const post = await prisma.blogPost.findFirst({
      where: { slug: { startsWith: slugPrefix.slice(0, 30) } },
      select: { slug: true },
    });
    if (!post) {
      console.log("NOT FOUND:", slugPrefix);
      continue;
    }
    const url = `https://images.unsplash.com/photo-${pid}?w=1200&h=600&fit=crop&auto=format`;
    await prisma.blogPost.update({ where: { slug: post.slug }, data: { coverImage: url } });
    console.log(`OK ${post.slug} -> ${pid}`);
    done++;
  }
  console.log(`${done} updated`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
