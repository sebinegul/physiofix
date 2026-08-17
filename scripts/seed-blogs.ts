import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

const blogs = [
  {
    title: "5 Signs You Need Physiotherapy After a Sports Injury",
    slug: "5-signs-you-need-physiotherapy-after-sports-injury",
    excerpt: "Ignoring minor pain after sports can lead to chronic issues. Learn the 5 key signs that indicate you need professional physiotherapy intervention.",
    content: `
<h2>Introduction</h2>
<p>Sports injuries are common, but knowing when to seek professional help can make the difference between a quick recovery and a chronic condition. At PhysioFix, Dr. Nishmitha.R sees many athletes who waited too long to get treatment.</p>

<h2>1. Pain That Persists Beyond 48 Hours</h2>
<p>Normal post-exercise soreness (DOMS) typically resolves within 24-48 hours. If pain persists beyond this window, especially if it's sharp or localized rather than a general ache, it's a sign of tissue damage that needs assessment.</p>

<h2>2. Swelling That Doesn't Subside</h2>
<p>Acute swelling is your body's natural response to injury, but persistent swelling beyond 72 hours indicates ongoing inflammation or a more serious structural injury like a ligament tear or fracture.</p>

<h2>3. Reduced Range of Motion</h2>
<p>If you can't move a joint through its full range — whether it's a shoulder that won't go overhead, a knee that won't fully straighten, or an ankle that feels "stuck" — there's likely a mechanical restriction or instability that physiotherapy can address.</p>

<h2>4. Instability or "Giving Way"</h2>
<p>Does your knee buckle when you step off a curb? Does your ankle roll on flat ground? This feeling of instability suggests ligamentous laxity or neuromuscular control deficits that require targeted rehabilitation.</p>

<h2>5. Recurring Injuries in the Same Area</h2>
<p>If you've "tweaked" the same ankle three times this season, or your shoulder keeps acting up, you're not just unlucky — you have an unresolved biomechanical issue. Physiotherapy identifies and corrects the root cause.</p>

<h2>When to Book</h2>
<p>Don't wait for the injury to "fix itself." Early intervention means faster recovery, fewer sessions, and lower risk of re-injury. Book a consultation at PhysioFix today — Dr. Nishmitha.R (MPT) specializes in sports rehabilitation and post-surgical recovery.</p>
`,
    coverImage: "/sportsPhysio.jpg",
    author: "Dr.Nishmitha.R",
    category: "sports-rehab",
    tags: "sports injury,physiotherapy,rehabilitation,recovery",
    published: true,
    featured: true,
  },
  {
    title: "Post-Surgery Rehabilitation: What to Expect at Each Phase",
    slug: "post-surgery-rehabilitation-phases",
    excerpt: "Understanding the phases of post-surgical rehab helps you stay motivated and track progress. From immediate post-op to return-to-sport, here's your roadmap.",
    content: `
<h2>Introduction</h2>
<p>Surgery is only half the battle — rehabilitation is where function is restored. At PhysioFix, we guide patients through a structured, evidence-based rehab protocol tailored to their specific procedure.</p>

<h2>Phase 1: Protection & Acute Management (Weeks 0-2)</h2>
<p>Goals: Control pain and swelling, protect the surgical repair, initiate gentle range of motion within safe limits. You'll likely use assistive devices (crutches, sling, brace) and focus on isometric contractions to prevent muscle atrophy.</p>

<h2>Phase 2: Early Mobilization (Weeks 2-6)</h2>
<p>Goals: Restore range of motion, begin progressive loading, normalize gait/movement patterns. This phase introduces therapeutic exercises, manual therapy, and neuromuscular re-education.</p>

<h2>Phase 3: Strengthening & Functional Training (Weeks 6-12)</h2>
<p>Goals: Build strength, endurance, and power; introduce functional movement patterns relevant to daily life or sport. Progressive resistance training, proprioception drills, and task-specific practice dominate this phase.</p>

<h2>Phase 4: Return to Activity / Sport (Week 12+)</h2>
<p>Goals: Sport-specific drills, agility, plyometrics, psychological readiness testing. Clearance criteria include: full ROM, strength ≥90% of contralateral side, functional test battery passed, and confidence in the limb.</p>

<h2>Key Success Factors</h2>
<ul>
<li><strong>Consistency:</strong> Attending scheduled sessions and doing home exercises daily</li>
<li><strong>Communication:</strong> Reporting pain levels, fears, and functional limitations honestly</li>
<li><strong>Patience:</strong> Tissue healing timelines can't be rushed — biological constraints are real</li>
</ul>

<h2>PhysioFix Approach</h2>
<p>Dr. Nishmitha.R (MPT) creates individualized protocols with measurable milestones, regular re-assessment, and direct surgeon communication when needed. We don't just follow a template — we adapt to <em>you</em>.</p>
`,
    coverImage: "/postSurgeryRehab.jpeg",
    author: "Dr.Nishmitha.R",
    category: "post-surgical",
    tags: "post-surgery,rehabilitation,recovery,physical therapy",
    published: true,
    featured: true,
  },
  {
    title: "Desk Job Neck Pain: 5 Exercises You Can Do at Your Workstation",
    slug: "desk-job-neck-pain-exercises-workstation",
    excerpt: "Long hours at a computer? These 5 discreet exercises combat tech neck, improve posture, and prevent chronic pain — no equipment needed.",
    content: `
<h2>The Problem: Tech Neck</h2>
<p>The average adult spends 7+ hours daily looking at screens. Forward head posture adds 10+ lbs of effective weight to your cervical spine for every inch your head protrudes. Result: stiffness, headaches, shoulder tension, and eventually disc issues.</p>

<h2>1. Chin Tucks (The Reset)</h2>
<p>Sit tall. Gently pull your chin straight back (like making a double chin) without tilting your head down. Hold 3-5 seconds. Repeat 10x. Do this every hour.</p>

<h2>2. Upper Trapezius Stretch</h2>
<p>Sit on your right hand (anchors shoulder). Gently tilt left ear toward left shoulder. Use left hand for gentle overpressure. Hold 20-30 sec. Switch sides. 3x/day.</p>

<h2>3. Scapular Squeezes</h2>
<p>Squeeze shoulder blades together and down (like putting them in back pockets). Hold 5 sec. 15 reps. 3x/day. Activates lower traps, counters rounded shoulders.</p>

<h2>4. Thoracic Extension on Chair</h2>
<p>Sit at chair edge, hands behind head. Gently extend upper back over chair back. Don't hyperextend neck. 10 reps. 2x/day. Counters thoracic kyphosis from slouching.</p>

<h2>5. Levator Scapulae Stretch</h2>
<p>Turn head 45° to right. Look down toward right armpit. Gentle overpressure with right hand. Hold 20-30 sec. Switch sides. Targets the "where did my neck go?" muscle.</p>

<h2>Ergonomic Quick Wins</h2>
<ul>
<li>Monitor top at eye level</li>
<li>Keyboard/mouse at elbow height, wrists neutral</li>
<li>Feet flat, knees ~90°</li>
<li>Micro-break every 30 min: stand, stretch, look far away</li>
</ul>

<h2>When to See a Physio</h2>
<p>If exercises don't improve symptoms in 2 weeks, or if you have radiating arm pain, numbness, or headaches worsening in frequency — book an assessment at PhysioFix. Dr. Nishmitha.R treats cervical spine disorders with manual therapy, exercise prescription, and ergonomic coaching.</p>
`,
    coverImage: "/postureCorrection.jpeg",
    author: "Dr.Nishmitha.R",
    category: "posture-correction",
    tags: "neck pain,posture,desk job,ergonomics,exercises",
    published: true,
    featured: false,
  },
];

async function main() {
  for (const blog of blogs) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: blog.slug } });
    if (existing) {
      console.log(`Skipping existing: ${blog.title}`);
      continue;
    }
    await prisma.blogPost.create({ data: blog });
    console.log(`Created: ${blog.title}`);
  }
  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());