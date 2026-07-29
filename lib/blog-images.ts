/**
 * Curated blog images by category.
 * Injected between content sections on blog detail pages.
 * Unsplash – free for commercial use (Unsplash License).
 */
const BLOG_IMAGES: Record<string, string[]> = {
  "sports-injury": [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format", // runner stretching
    "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800&q=80&auto=format", // athlete running
    "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&q=80&auto=format", // sports tape
  ],
  rehabilitation: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format", // rehab exercises
    "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&q=80&auto=format", // physio session
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format", // stretching
  ],
  "neck-back-pain": [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format", // back stretch
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80&auto=format", // neck treatment
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80&auto=format", // posture
  ],
  "joint-pain": [
    "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=80&auto=format", // knee
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format", // joint therapy
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80&auto=format", // massage
  ],
  wellness: [
    "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80&auto=format", // meditation
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format", // yoga
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format", // nature walk
  ],
  fitness: [
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80&auto=format", // strength training
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&auto=format", // gym workout
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format", // fitness
  ],
  "posture-ergonomics": [
    "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80&auto=format", // office ergonomics
    "https://images.unsplash.com/photo-1541180193399-1a2ac47a8663?w=800&q=80&auto=format", // desk setup
    "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80&auto=format", // chiropractic
  ],
  general: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format", // therapy
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80&auto=format", // medical
    "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80&auto=format", // health
  ],
  default: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format",
  ],
};

/**
 * Get images for a given category with a consistent hash-based
 * offset so the same post always gets the same images.
 */
export function getBlogImages(category: string, count: number = 3): string[] {
  const pool = BLOG_IMAGES[category] || BLOG_IMAGES.default;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}
