import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

 const adapter = new PrismaNeonHttp(process.env.DATABASE_URL || "", {});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed admin user
  const adminEmail = "admin@physiofix.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        phone: "+91-9999999999",
      },
    });
    console.log("Admin user created: admin@physiofix.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  // Seed exercises
  const exerciseCount = await prisma.exercise.count();
  if (exerciseCount === 0) {
    const exercises = [
      {
        name: "Neck Stretches",
        description: "Gentle neck stretching exercises to relieve tension and improve mobility",
        category: "Stretching",
        difficulty: "Easy",
        duration: "5-10 minutes",
        instructions: "1. Slowly tilt your head to the right, hold for 15 seconds\n2. Return to center and tilt to the left, hold for 15 seconds\n3. Slowly roll your head forward in a circle, 5 times each direction\n4. Gently push your chin back to create a double chin, hold for 5 seconds, repeat 10 times",
      },
      {
        name: "Shoulder Shrugs",
        description: "Strengthening exercise for shoulder and upper back muscles",
        category: "Strengthening",
        difficulty: "Easy",
        duration: "5 minutes",
        instructions: "1. Stand with feet shoulder-width apart\n2. Raise both shoulders up toward your ears\n3. Hold for 5 seconds\n4. Slowly lower shoulders back down\n5. Repeat 10-15 times",
      },
      {
        name: "Knee Extensions",
        description: "Strengthening exercise for quadriceps and knee support muscles",
        category: "Strengthening",
        difficulty: "Medium",
        duration: "10 minutes",
        instructions: "1. Sit on a chair with your back straight\n2. Slowly straighten your right leg out in front of you\n3. Hold for 5 seconds at the top\n4. Slowly lower back down\n5. Repeat 10 times per leg",
      },
      {
        name: "Hip Flexor Stretch",
        description: "Stretching exercise to improve hip flexibility and reduce lower back pain",
        category: "Stretching",
        difficulty: "Medium",
        duration: "10 minutes",
        instructions: "1. Kneel on your right knee with your left foot forward\n2. Push your hips gently forward\n3. Hold for 20-30 seconds\n4. Switch sides and repeat\n5. Perform 3 sets per side",
      },
      {
        name: "Ankle Circles",
        description: "Mobility exercise for ankle joints and lower leg muscles",
        category: "Mobility",
        difficulty: "Easy",
        duration: "5 minutes",
        instructions: "1. Sit or stand with one foot raised slightly\n2. Rotate your ankle clockwise 10 times\n3. Rotate your ankle counter-clockwise 10 times\n4. Switch feet and repeat",
      },
      {
        name: "Wall Push-ups",
        description: "Upper body strengthening exercise suitable for beginners",
        category: "Strengthening",
        difficulty: "Easy",
        duration: "10 minutes",
        instructions: "1. Stand arm's length from a wall\n2. Place your palms flat on the wall at shoulder height\n3. Slowly bend your elbows and lean toward the wall\n4. Push back to the starting position\n5. Repeat 15 times, 3 sets",
      },
      {
        name: "Single Leg Balance",
        description: "Balance and stability exercise for lower body",
        category: "Balance",
        difficulty: "Medium",
        duration: "10 minutes",
        instructions: "1. Stand near a wall or chair for support\n2. Lift your right foot off the ground\n3. Balance on your left leg for 30 seconds\n4. Switch legs and repeat\n5. Perform 5 repetitions per leg",
      },
      {
        name: "Pelvic Tilts",
        description: "Core strengthening exercise for lower back pain relief",
        category: "Strengthening",
        difficulty: "Easy",
        duration: "10 minutes",
        instructions: "1. Lie on your back with knees bent, feet flat on the floor\n2. Flatten your lower back against the floor by tightening your abdominal muscles\n3. Hold for 5 seconds\n4. Relax and repeat\n5. Perform 15 repetitions",
      },
      {
        name: "Hamstring Stretch",
        description: "Stretching exercise for the back of the thigh muscles",
        category: "Stretching",
        difficulty: "Easy",
        duration: "10 minutes",
        instructions: "1. Lie on your back\n2. Lift your right leg and hold behind the thigh\n3. Gently pull the leg toward you until you feel a stretch\n4. Hold for 20-30 seconds\n5. Switch legs and repeat 3 times each",
      },
      {
        name: "Clamshells",
        description: "Strengthening exercise for hip abductors and gluteus medius",
        category: "Strengthening",
        difficulty: "Easy",
        duration: "10 minutes",
        instructions: "1. Lie on your side with knees bent at 45 degrees\n2. Keep your feet together\n3. Lift your top knee upward while keeping feet together\n4. Lower slowly\n5. Repeat 15 times per side, 3 sets",
      },
      {
        name: "Bridging",
        description: "Core and glute strengthening exercise for spinal stability",
        category: "Strengthening",
        difficulty: "Medium",
        duration: "10 minutes",
        instructions: "1. Lie on your back with knees bent\n2. Tighten your abdominal muscles\n3. Lift your hips off the floor until your body forms a straight line\n4. Hold for 5 seconds\n5. Lower slowly and repeat 15 times",
      },
      {
        name: "Heel Raises",
        description: "Strengthening exercise for calf muscles and ankle stability",
        category: "Strengthening",
        difficulty: "Easy",
        duration: "5 minutes",
        instructions: "1. Stand with feet hip-width apart, near a wall for balance\n2. Slowly rise onto the balls of your feet\n3. Hold for 3 seconds\n4. Lower back down slowly\n5. Repeat 20 times, 3 sets",
      },
      {
        name: "Cat-Cow Stretch",
        description: "Yoga-based exercise for spinal flexibility and core engagement",
        category: "Stretching",
        difficulty: "Easy",
        duration: "10 minutes",
        instructions: "1. Start on hands and knees in tabletop position\n2. Inhale: arch your back, lift your head and tailbone (Cow)\n3. Exhale: round your back, tuck your chin and tailbone (Cat)\n4. Flow between positions slowly\n5. Repeat 10-15 times",
      },
    ];

    for (const exercise of exercises) {
      await prisma.exercise.create({ data: exercise });
    }
    console.log(`${exercises.length} exercises seeded`);
  } else {
    console.log(`Exercises already exist (${exerciseCount} found)`);
  }

  // Seed default site content
  const contentCount = await prisma.siteContent.count();
  if (contentCount === 0) {
    const content = [
      { key: "hero_title", value: "Your Trusted Physiotherapy Partner" },
      { key: "hero_subtitle", value: "Expert physiotherapy care in the comfort of your home. Licensed professionals dedicated to your recovery." },
      { key: "about_text", value: "PhysioFix is a leading home physiotherapy service providing expert care across India. Our certified physiotherapists bring professional treatment directly to your doorstep." },
      { key: "contact_email", value: "info@physiofix.com" },
      { key: "contact_phone", value: "+91-8151912525" },
      { key: "contact_address", value: "JP Nagar 8th Phase, Bangalore, Karnataka, India" },
    ];

    for (const item of content) {
      await prisma.siteContent.create({ data: item });
    }
    console.log("Default site content seeded");
  } else {
    console.log(`Site content already exists (${contentCount} entries)`);
  }

  // Seed a demo patient for testing
  const demoEmail = "patient@physiofix.com";
  const existingPatient = await prisma.user.findUnique({
    where: { email: demoEmail },
  });
  if (!existingPatient) {
    const hashedPassword = await bcrypt.hash("patient123", 12);
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        password: hashedPassword,
        name: "Demo Patient",
        role: "patient",
        phone: "+91-9876543210",
      },
    });
    await prisma.patient.create({
      data: {
        userId: user.id,
        dateOfBirth: "1990-05-15",
        gender: "Female",
        address: "JP Nagar, Bangalore",
        emergencyContact: "+91-9876543211",
        medicalHistory: "No significant medical history",
        allergies: "None",
      },
    });
    console.log("Demo patient created: patient@physiofix.com / patient123");
  } else {
    console.log("Demo patient already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
