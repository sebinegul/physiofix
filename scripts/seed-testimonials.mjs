// Seed existing testimonials into the database
// Run with: node --experimental-vm-modules scripts/seed-testimonials.mjs

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "JP Nagar",
    rating: 5,
    text: "I could barely sit at my desk for 20 minutes before the pain kicked in. After six sessions here, I am back to full work days. The exercise plan between visits made a real difference.",
    condition: "Chronic Back Pain",
    duration: "6 weeks",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    sortOrder: 1,
  },
  {
    name: "Anitha Devi",
    location: "BTM Layout",
    rating: 5,
    text: "After my knee replacement I was scared to put weight on it. Dr.Nishmitha.R walked me through every milestone and adjusted the plan when things felt too hard. Three months later I am climbing stairs again.",
    condition: "Post-Knee Surgery",
    duration: "3 months",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    sortOrder: 2,
  },
  {
    name: "Suresh Kumar",
    location: "HSR Layout",
    rating: 5,
    text: "Tore my ACL during a tournament and thought my season was over. The return-to-sport programme here was structured but realistic. I passed every fitness test before going back.",
    condition: "ACL Rehabilitation",
    duration: "5 months",
    img: "https://randomuser.me/api/portraits/men/56.jpg",
    sortOrder: 3,
  },
  {
    name: "Priya Nair",
    location: "Koramangala",
    rating: 5,
    text: "My mother had a stroke two years ago and we had almost given up on improving her movement. The neurological rehab sessions have brought back movement in her left hand that we did not think was possible.",
    condition: "Post-Stroke Recovery",
    duration: "Ongoing",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    sortOrder: 4,
  },
  {
    name: "Arjun Reddy",
    location: "Electronic City",
    rating: 5,
    text: "Woke up one morning and could not turn my neck. Tried everything for two weeks before coming here. Two sessions of manual therapy and I could move normally again. Wish I had come sooner.",
    condition: "Acute Neck Stiffness",
    duration: "2 weeks",
    img: "https://randomuser.me/api/portraits/men/41.jpg",
    sortOrder: 5,
  },
  {
    name: "Meera Joshi",
    location: "JP Nagar",
    rating: 5,
    text: "The home visit service has been a lifeline for my father. He has trouble travelling but the therapist comes to our house with all the equipment. Consistent, patient, and genuinely caring.",
    condition: "Geriatric Home Care",
    duration: "4 months",
    img: "https://randomuser.me/api/portraits/women/28.jpg",
    sortOrder: 6,
  },
];

async function seed() {
  // Use the Neon HTTP endpoint directly via fetch
  // We'll insert via a simple SQL approach using the database URL
  const { PrismaClient } = await import("@prisma/client");

  // Import the adapter
  const { PrismaNeonHttp } = await import("@prisma/adapter-neon");

  const adapter = new PrismaNeonHttp(DATABASE_URL, {});
  const prisma = new PrismaClient({ adapter });

  try {
    // Check if testimonials already exist
    const count = await prisma.testimonial.count();
    if (count > 0) {
      console.log(`Database already has ${count} testimonials. Skipping seed.`);
      await prisma.$disconnect();
      return;
    }

    for (const t of testimonials) {
      await prisma.testimonial.create({
        data: {
          name: t.name,
          location: t.location,
          rating: t.rating,
          text: t.text,
          condition: t.condition,
          duration: t.duration,
          img: t.img,
          active: true,
          sortOrder: t.sortOrder,
        },
      });
      console.log(`  Seeded: ${t.name}`);
    }

    console.log(`\nDone! ${testimonials.length} testimonials seeded.`);
    await prisma.$disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();
