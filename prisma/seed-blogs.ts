import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

const blogs = [
  {
    title: "5 Stretches to Relieve Neck Pain from Desk Work",
    excerpt:
      "Spending hours at a desk can take a serious toll on your neck. These five simple stretches can help relieve tension and prevent chronic neck pain.",
    category: "wellness",
    tags: "neck pain,desk ergonomics,stretches,office health",
    featured: true,
    content: `<h2>Why Desk Work Hurts Your Neck</h2>
<p>Sitting at a computer for extended periods forces your neck into a forward-head posture, straining the cervical muscles and joints. Over time this leads to stiffness, headaches, and even radiating pain into the shoulders and arms.</p>
<p>The good news: a few targeted stretches done throughout the day can make a noticeable difference within weeks.</p>

<h2>1. Chin Tucks</h2>
<p>Chin tucks strengthen the deep neck flexors and reverse forward-head posture. Sit upright, gently draw your chin straight back (as if making a double chin), hold for 5 seconds, then release. Repeat 10 times.</p>

<h2>2. Upper Trapezius Stretch</h2>
<p>Sit tall and drop your right ear toward your right shoulder. Place your right hand gently on the left side of your head to deepen the stretch. Hold 20-30 seconds, then switch sides. You should feel a comfortable pull along the side of your neck.</p>

<h2>3. Levator Scapulae Stretch</h2>
<p>Turn your head 45 degrees to the right, then look down toward your right armpit. Use your right hand to gently guide your head further down. Hold 20-30 seconds per side. This targets the muscle that connects your shoulder blade to your neck.</p>

<h2>4. Doorway Chest Opener</h2>
<p>Stand in a doorway with your forearms on the frame at shoulder height. Step one foot forward until you feel a gentle stretch across your chest and the front of your shoulders. Hold 30 seconds. Tight chest muscles pull your shoulders forward, worsening neck strain.</p>

<h2>5. Seated Thread the Needle</h2>
<p>From a seated position, cross your right arm under your left and let your right shoulder drop toward the desk. Rotate your torso gently to the left. Hold 20 seconds, then switch. This mobilizes the thoracic spine, reducing compensatory stress on the neck.</p>

<h2>When to See a Physiotherapist</h2>
<p>If your neck pain persists beyond two weeks, radiates into your arms, or is accompanied by numbness or tingling, it is time to see a professional. A physiotherapist can identify the underlying cause and design a personalised program that goes beyond generic stretches.</p>
<p>At PhysioFix, we combine manual therapy with targeted exercise prescription to address both the symptoms and the root cause of your neck pain.</p>`,
  },
  {
    title: "Understanding Frozen Shoulder: Symptoms, Stages, and Treatment",
    excerpt:
      "Frozen shoulder develops gradually and can severely limit your range of motion. Learn what causes it and how physiotherapy helps you recover.",
    category: "conditions",
    tags: "frozen shoulder,adhesive capsulitis,shoulder pain,range of motion",
    featured: false,
    content: `<h2>What Is Frozen Shoulder?</h2>
<p>Frozen shoulder, also known as adhesive capsulitis, is a condition where the capsule surrounding the shoulder joint becomes inflamed and thickened. This leads to progressive stiffness and pain that can last for months or even years if left untreated.</p>

<h2>The Three Stages</h2>
<h3>Stage 1: Freezing (2-9 months)</h3>
<p>Pain gradually increases and shoulder movement starts to become limited. Night pain is common, making it difficult to sleep on the affected side.</p>

<h3>Stage 2: Frozen (4-12 months)</h3>
<p>Pain may actually decrease, but stiffness worsens. Simple tasks like reaching overhead, fastening a bra, or tucking in a shirt become extremely difficult.</p>

<h3>Stage 3: Thawing (5-24 months)</h3>
<p>Range of motion slowly returns. Without treatment, this stage can take up to two years. With physiotherapy, recovery is significantly faster.</p>

<h2>Who Gets Frozen Shoulder?</h2>
<p>It most commonly affects people between 40 and 65 years old. Women are slightly more likely to develop it. Risk factors include diabetes (which doubles the risk), thyroid disorders, prolonged immobility after surgery or injury, and cardiovascular disease.</p>

<h2>How Physiotherapy Helps</h2>
<p>Early physiotherapy intervention is the gold standard for frozen shoulder treatment. Your therapist will use a combination of:</p>
<ul>
<li><strong>Joint mobilisation</strong> - gentle, graded movements to restore glide between the joint surfaces</li>
<li><strong>Stretching protocols</strong> - progressive stretching that respects pain thresholds</li>
<li><strong>Manual therapy</strong> - soft tissue work to reduce muscle guarding around the shoulder</li>
<li><strong>Home exercise programme</strong> - pendulum exercises, wall climbs, and towel stretches</li>
</ul>

<h2>What to Expect</h2>
<p>Most patients see meaningful improvement within 6-8 weeks of consistent physiotherapy. Complete resolution typically takes 3-6 months depending on the stage at which treatment begins. The key is starting early and sticking with the exercise programme between sessions.</p>`,
  },
  {
    title: "The Runner's Knee Guide: Prevention, Recovery, and When to Worry",
    excerpt:
      "Runner's knee is one of the most common overuse injuries in runners. Here is everything you need to know about managing it effectively.",
    category: "sports",
    tags: "runner's knee,patellofemoral pain,running injuries,sports physiotherapy",
    featured: true,
    content: `<h2>What Is Runner's Knee?</h2>
<p>Runner's knee, or patellofemoral pain syndrome (PFPS), is pain around or behind the kneecap. It occurs when the patella does not track smoothly in the groove at the front of the thigh bone during movement. Despite its name, it affects cyclists, hikers, and anyone who does repetitive knee-bending activities.</p>

<h2>Symptoms to Watch For</h2>
<ul>
<li>Dull, achy pain around the front of the knee</li>
<li>Pain that worsens going up or down stairs</li>
<li>Pain after sitting for long periods with knees bent (the "movie theatre sign")</li>
<li>A grinding or clicking sensation when bending the knee</li>
<li>Mild swelling around the kneecap</li>
</ul>

<h2>Common Causes</h2>
<h3>Muscle Imbalances</h3>
<p>Weak hip abductors and external rotators allow the thigh to rotate inward, pulling the kneecap out of alignment. Weak quadriceps, particularly the VMO (inner quad), fail to keep the patella centred.</p>

<h3>Overtraining</h3>
<p>Sudden increases in mileage, hill training, or speed work without adequate recovery overload the structures around the knee. Running on hard surfaces or wearing worn-out shoes compounds the problem.</p>

<h3>Biomechanical Factors</h3>
<p>Flat feet (overpronation), high arches, and a wide pelvis can all alter knee mechanics. A physiotherapist can assess your gait and identify these contributing factors.</p>

<h2>Self-Management in the Acute Phase</h2>
<p>In the first 1-2 weeks, focus on reducing inflammation. Apply ice for 15-20 minutes, reduce or modify running volume, and avoid stairs and deep squats. Anti-inflammatory medication can help manage pain, but it does not address the underlying cause.</p>

<h2>Physiotherapy Treatment</h2>
<p>A comprehensive approach addresses the root cause, not just the knee:</p>
<ol>
<li><strong>Strengthening</strong> - hip-focused exercises (clamshells, side-lying leg raises, banded walks) and quadriceps work (terminal knee extensions, wall sits)</li>
<li><strong>Flexibility</strong> - stretching the IT band, quads, hamstrings, and calves</li>
<li><strong>Patellar taping</strong> - McConnell taping to improve patella tracking during activity</li>
<li><strong>Gait retraining</strong> - cadence adjustments and foot strike modifications</li>
<li><strong>Load management</strong> - a gradual return-to-running plan based on pain response</li>
</ol>

<h2>When to See a Professional</h2>
<p>If pain persists beyond 2 weeks of self-management, if you experience giving way, locking, or significant swelling, or if you cannot bear weight on the affected leg, seek professional assessment promptly.</p>`,
  },
  {
    title: "Physiotherapy After Knee Replacement: What Your Recovery Looks Like",
    excerpt:
      "Knee replacement surgery is a major procedure, but the right physiotherapy programme makes all the difference in your outcome. Here is what to expect week by week.",
    category: "post-surgery",
    tags: "knee replacement,total knee arthroplasty,post-surgery rehab,physiotherapy",
    featured: false,
    content: `<h2>Why Physiotherapy Is Critical After Knee Replacement</h2>
<p>A total knee replacement (TKR) replaces damaged cartilage and bone with metal and plastic components. The surgery restores the joint surface, but the muscles around the knee need rehabilitation to regain strength, flexibility, and function. Without structured physiotherapy, scar tissue can limit your range of motion and you may not achieve the full benefit of the surgery.</p>

<h2>Week 1-2: The Acute Phase</h2>
<p>Physiotherapy begins within 24 hours of surgery, often while you are still in the hospital. Goals include:</p>
<ul>
<li>Controlled walking with a walker or crutches</li>
<li>Gentle knee bending (aiming for 60-70 degrees of flexion)</li>
<li>Quad sets and straight leg raises to activate the thigh muscles</li>
<li>Ankle pumps to prevent blood clots</li>
<li>Wound care and swelling management (ice, elevation)</li>
</ul>
<p>This phase is uncomfortable, but early movement is essential. Your physiotherapist will guide you through pain-appropriate exercises and ensure you are safe to walk independently.</p>

<h2>Week 3-6: Building the Foundation</h2>
<p>Most patients transition from a walker to a cane during this period. Key milestones include:</p>
<ul>
<li>Walking without assistive devices (most patients achieve this by week 4-6)</li>
<li>Stair climbing with proper technique</li>
<li>Knee flexion reaching 90 degrees or more</li>
<li>Stationary cycling (once flexion allows)</li>
<li>Progressive strengthening with resistance bands and bodyweight exercises</li>
</ul>

<h2>Week 6-12: Functional Recovery</h2>
<p>By this stage, most daily activities become easier. The focus shifts to:</p>
<ul>
<li>Full range of motion (aiming for 110-120 degrees of flexion)</li>
<li>Single-leg balance and stability exercises</li>
<li>Gait normalisation (reducing limp and improving walking speed)</li>
<li>Functional tasks: getting in and out of a car, kneeling, squatting</li>
<li>Light cardiovascular exercise: swimming, cycling, walking on varied terrain</li>
</ul>

<h2>Month 3-6: Return to Activity</h2>
<p>Most patients feel confident in daily activities by month 3. Continued strengthening and cardiovascular fitness training improve outcomes further. Many patients return to golf, swimming, cycling, and even light hiking within 6 months.</p>

<h2>Tips for a Better Recovery</h2>
<ul>
<li>Commit to your home exercise programme - consistency matters more than intensity</li>
<li>Attend all physiotherapy sessions - hands-on treatment accelerates recovery</li>
<li>Manage swelling proactively with ice and elevation</li>
<li>Sleep with a pillow between your knees for the first few weeks</li>
<li>Communicate openly with your therapist about pain levels and concerns</li>
</ul>`,
  },
  {
    title: "The Hidden Link Between Stress and Chronic Pain",
    excerpt:
      "Chronic pain is not always purely physical. Understanding how stress and mental health influence your pain can transform your recovery.",
    category: "wellness",
    tags: "stress,chronic pain,mental health,mind-body connection,pain science",
    featured: false,
    content: `<h2>When Pain Is More Than Tissue Damage</h2>
<p>If you have chronic pain that does not seem to match your scan results, or if your pain flares during stressful periods, you are not imagining it. Modern pain science has established a powerful connection between the brain, emotions, and pain perception. Understanding this link does not mean your pain is "all in your head" - it means your nervous system is real and your pain is valid.</p>

<h2>How Stress Amplifies Pain</h2>
<p>When you are stressed, your body releases cortisol and adrenaline. In acute situations this is helpful. In chronic stress, however, these hormones keep your nervous system on high alert - a state called <strong>central sensitisation</strong>. In this state:</p>
<ul>
<li>Pain thresholds drop, so stimuli that would not normally hurt begin to hurt (allodynia)</li>
<li>Pain spreads beyond the original injury site</li>
<li>Muscles tense up, creating secondary pain in the neck, shoulders, and back</li>
<li>Sleep quality decreases, which further lowers pain tolerance</li>
<li>Inflammation increases, slowing tissue healing</li>
</ul>

<h2>The Vicious Cycle</h2>
<p>Stress causes pain, pain causes more stress, and the cycle perpetuates itself. Many patients with chronic back pain, fibromyalgia, or persistent musculoskeletal pain find that their symptoms worsen during periods of anxiety, work pressure, or relationship difficulties. Breaking the cycle requires addressing both the physical and psychological components.</p>

<h2>What Physiotherapy Offers</h2>
<p>Modern physiotherapy takes a biopsychosocial approach, meaning your treatment considers biological factors (tissue health, movement patterns), psychological factors (fear, anxiety, beliefs about pain), and social factors (work demands, support systems).</p>
<p>Practical strategies include:</p>
<ul>
<li><strong>Pain neuroscience education</strong> - understanding how pain works reduces fear and catastrophising</li>
<li><strong>Graded exposure</strong> - gradually returning to activities you have been avoiding</li>
<li><strong>Relaxation techniques</strong> - diaphragmatic breathing and progressive muscle relaxation</li>
<li><strong>Mindful movement</strong> - yoga, tai chi, and gentle Pilates</li>
<li><strong>Sleep hygiene</strong> - improving sleep quality to support recovery</li>
</ul>

<h2>When to Seek Help</h2>
<p>If you have been dealing with pain for more than 3 months, if your pain does not respond to conventional treatment, or if stress and anxiety are clearly worsening your symptoms, consider a physiotherapist who works with a biopsychosocial model. You may also benefit from coordinated care with a psychologist or counsellor.</p>
<p>At PhysioFix, we understand that pain is complex. Our approach addresses the whole person, not just the injury, because lasting recovery requires it.</p>`,
  },
];

async function main() {
  console.log(`Seeding ${blogs.length} blog posts...\n`);

  for (const blog of blogs) {
    // Check for duplicate titles
    const existing = await prisma.blogPost.findFirst({
      where: { title: blog.title },
    });
    if (existing) {
      console.log(`  SKIP (exists): ${blog.title}`);
      continue;
    }

    // Generate slug
    const slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = await prisma.blogPost.create({
      data: {
        title: blog.title,
        slug,
        excerpt: blog.excerpt,
        content: blog.content,
        author: "Dr.Nishmitha.R",
        category: blog.category,
        tags: blog.tags,
        published: true,
        featured: blog.featured,
      },
    });
    console.log(`  OK: ${post.title} -> /blog/${post.slug}`);
  }

  const total = await prisma.blogPost.count();
  console.log(`\nDone. Total blog posts in database: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
