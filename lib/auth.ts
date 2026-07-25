import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "physiofix-secret-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export async function authenticateRequest(request: Request): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(request: Request): Promise<JWTPayload> {
  const user = await authenticateRequest(request);
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requireAuth(request: Request): Promise<JWTPayload> {
  const user = await authenticateRequest(request);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function seedAdmin() {
  const adminEmail = "admin@physiofix.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword("admin123");
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
  }
}

export async function seedExercises() {
  const exerciseCount = await prisma.exercise.count();
  if (exerciseCount > 0) return;

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
      name: "Seated Spinal Twist",
      description: "Stretching exercise to improve spinal mobility and reduce stiffness",
      category: "Stretching",
      difficulty: "Medium",
      duration: "10 minutes",
      instructions: "1. Sit on the floor with legs extended\n2. Bend your right knee and place foot outside left thigh\n3. Twist your torso to the right, placing left elbow outside right knee\n4. Hold for 20 seconds\n5. Switch sides and repeat 3 times each",
    },
    {
      name: "Cat-Cow Stretch",
      description: "Yoga-based exercise for spinal flexibility and core engagement",
      category: "Stretching",
      difficulty: "Easy",
      duration: "10 minutes",
      instructions: "1. Start on hands and knees in tabletop position\n2. Inhale: arch your back, lift your head and tailbone (Cow)\n3. Exhale: round your back, tuck your chin and tailbone (Cat)\n4. Flow between positions slowly\n5. Repeat 10-15 times",
    },
    {
      name: "Resistance Band Row",
      description: "Upper back strengthening exercise using resistance band",
      category: "Strengthening",
      difficulty: "Medium",
      duration: "10 minutes",
      instructions: "1. Sit on the floor with legs extended\n2. Loop a resistance band around your feet\n3. Hold the band ends in each hand\n4. Pull the band toward your torso, squeezing shoulder blades together\n5. Release slowly. Repeat 15 times, 3 sets",
    },
    {
      name: "Standing Quad Stretch",
      description: "Stretching exercise for the front of the thigh muscles",
      category: "Stretching",
      difficulty: "Easy",
      duration: "5 minutes",
      instructions: "1. Stand near a wall for balance\n2. Bend your right knee and grab your right foot behind you\n3. Pull your foot toward your buttock\n4. Hold for 20-30 seconds\n5. Switch legs and repeat 3 times each",
    },
    {
      name: "Side Leg Raises",
      description: "Strengthening exercise for hip abductors and outer thigh",
      category: "Strengthening",
      difficulty: "Easy",
      duration: "10 minutes",
      instructions: "1. Lie on your side with legs straight and stacked\n2. Slowly lift your top leg up toward the ceiling\n3. Hold for 2 seconds at the top\n4. Lower slowly without touching the bottom leg\n5. Repeat 15 times per side, 3 sets",
    },
    {
      name: "Tandem Walking",
      description: "Balance exercise walking heel-to-toe for improved coordination",
      category: "Balance",
      difficulty: "Medium",
      duration: "10 minutes",
      instructions: "1. Stand at one end of a straight line\n2. Walk forward placing the heel of one foot directly in front of the toes of the other\n3. Continue for 20 steps\n4. Turn around and repeat\n5. Perform 5 rounds",
    },
    {
      name: "Wrist Flexor Stretch",
      description: "Stretching exercise for forearm and wrist muscles",
      category: "Stretching",
      difficulty: "Easy",
      duration: "5 minutes",
      instructions: "1. Extend your right arm in front of you, palm up\n2. With your left hand, gently pull your right fingers downward\n3. Hold for 15 seconds\n4. Switch hands and repeat\n5. Perform 3 repetitions per hand",
    },
    {
      name: "Step-ups",
      description: "Lower body strengthening exercise using a step or stair",
      category: "Strengthening",
      difficulty: "Hard",
      duration: "15 minutes",
      instructions: "1. Stand facing a step or sturdy platform\n2. Step up with your right foot\n3. Bring your left foot up to join it\n4. Step down with your right foot first\n5. Step down with left foot. Repeat 12 times per leg, 3 sets",
    },
    {
      name: "Finger Tendon Glides",
      description: "Hand therapy exercise to improve finger flexibility and reduce stiffness",
      category: "Mobility",
      difficulty: "Easy",
      duration: "5 minutes",
      instructions: "1. Start with fingers straight\n2. Bend fingertips to touch palm (hook fist)\n3. Straighten fingers\n4. Bend into a full fist\n5. Straighten again. Repeat 10 times per hand",
    },
    {
      name: "Foam Roller Back Extension",
      description: "Spinal extension exercise using foam roller for thoracic mobility",
      category: "Mobility",
      difficulty: "Hard",
      duration: "15 minutes",
      instructions: "1. Place foam roller horizontally on the floor\n2. Lie back so the roller is at your mid-back\n3. Support your head with your hands\n4. Gently arch backward over the roller\n5. Hold for 5 seconds, repeat 10 times. Move roller up and down the back",
    },
    {
      name: "Standing Calf Stretch",
      description: "Stretching exercise for the calf muscles and Achilles tendon",
      category: "Stretching",
      difficulty: "Easy",
      duration: "5 minutes",
      instructions: "1. Stand facing a wall with arms extended\n2. Step your right foot back, keeping the heel on the ground\n3. Bend your front knee until you feel a stretch in your back calf\n4. Hold for 20-30 seconds\n5. Switch legs and repeat 3 times each",
    },
    {
      name: "Lateral Band Walk",
      description: "Hip strengthening exercise using resistance band for lateral stability",
      category: "Strengthening",
      difficulty: "Medium",
      duration: "10 minutes",
      instructions: "1. Place a resistance band around your ankles or above knees\n2. Stand in a slight squat position\n3. Step sideways to the right for 10 steps\n4. Step sideways to the left for 10 steps\n5. Repeat 3 rounds in each direction",
    },
    {
      name: "Tai Chi Weight Shifts",
      description: "Balance and coordination exercise inspired by Tai Chi movements",
      category: "Balance",
      difficulty: "Easy",
      duration: "10 minutes",
      instructions: "1. Stand with feet wider than shoulder-width\n2. Slowly shift your weight to the right leg\n3. Pause for 3 seconds\n4. Slowly shift weight to the left leg\n5. Repeat 15 times, moving slowly and controlled",
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.create({ data: exercise });
  }
  console.log(`${exercises.length} exercises seeded`);
}