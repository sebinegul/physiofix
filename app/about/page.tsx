import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import { ArrowRight, BadgeCheck, HeartPulse, MoveRight, Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "About Dr.Nishmitha.R | Physiotherapist in JP Nagar, Bangalore",
  description:
    "Dr.Nishmitha.R is a sports science physiotherapist (MPT) with 5+ years experience in orthopaedic, sports & neurological rehabilitation. Trusted physiotherapy care in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/about",
  },
  openGraph: {
    title: "About Dr.Nishmitha.R | PhysioFix Physiotherapy Bangalore",
    description:
      "Meet Dr.Nishmitha.R, experienced physiotherapist specialising in sports rehab, orthopaedic care & neurological rehabilitation in JP Nagar, Bangalore.",
    url: "https://physiofix.net/about",
  },
};

const credentials = [
  "Master of Physiotherapy (MPT)",
  "Bachelor of Physiotherapy (BPT)",
  "Specialized in orthopaedic sports medicine and neurological rehabilitation",
];

const expertise = [
  "Chiropractic manipulation and alignment care",
  "Myofascial release and soft tissue therapy",
  "Sports injury rehabilitation and return-to-play support",
  "Posture correction and movement re-education",
  "Home physiotherapy and geriatric mobility support",
];

async function getAboutContent() {
  try {
    const items = await prisma.siteContent.findMany();
    const map: Record<string, string> = {};
    for (const item of items) map[item.key] = item.value;
    return map;
  } catch {
    return {};
  }
}

const DEFAULT_ABOUT_TEXT = "Dr.Nishmitha.R is a physiotherapist in sports science with over 5 years of experience helping patients recover from pain, injury, surgery, neurological challenges, and movement limitations with compassionate, hands-on care.";

export default async function AboutPage() {
  let aboutText = DEFAULT_ABOUT_TEXT;
  try {
    const contentMap = await getAboutContent();
    if (contentMap.about_text) aboutText = contentMap.about_text;
  } catch {
    // use default
  }
  return (
    <PageTransition>
      <main className="min-h-screen pt-28 pb-20">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <ScrollReveal className="flex h-full">
              <div className="flex flex-col justify-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">About Dr.Nishmitha</p>
                <h1 className="mb-5 text-4xl font-black leading-[1.2] tracking-tight text-slate-950 md:text-5xl">
                  A trusted physiotherapist building a <GradientText>modern recovery</GradientText> experience.
                </h1>
                <p className="mb-8 text-lg leading-8 text-slate-600">
                  {aboutText}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-primary">
                    Book an appointment <MoveRight className="h-4 w-4" />
                  </Link>
                  <Link href="/services" className="btn-ghost">
                    Explore services <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1} className="flex h-full">
              <div className="flex w-full flex-col rounded-[2rem] border border-blue-100/60 bg-white/70 p-4 shadow-[0_24px_90px_rgba(15,23,42,0.1)] backdrop-blur-xl">
                <div className="flex-1 rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-400/15 p-3 text-blue-300">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-300">Clinical focus</p>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">orthopaedic • sports • neuro</p>
                    </div>
                  </div>
                  <StaggerContainer className="space-y-3" stagger={0.08}>
                    {credentials.map((item) => (
                      <StaggerItem key={item}>
                        <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3">
                          <BadgeCheck className="mt-0.5 h-4 w-4 text-blue-300" />
                          <p className="text-sm text-slate-200">{item}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <ScrollReveal className="h-full">
              <div className="section-shell flex h-full flex-col justify-center p-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Approach</p>
                <h2 className="mb-4 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900">Hands-on care, thoughtful rehabilitation, and clear communication.</h2>
                <p className="text-lg leading-8 text-slate-600">
                  Every recovery plan is customised to the person, not the diagnosis alone. The focus is simple: reduce pain, improve strength, restore confidence, and help each patient return to daily life or sport with clarity and calm.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col rounded-[2rem] border border-blue-100/60 bg-gradient-to-br from-blue-500/10 via-white to-blue-500/10 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 text-blue-600 shadow-sm">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Core expertise</p>
                    <p className="text-sm text-slate-600">Built around movement, pain relief, and confidence.</p>
                  </div>
                </div>
                <StaggerContainer className="space-y-3" stagger={0.06}>
                  {expertise.map((item) => (
                    <StaggerItem key={item}>
                      <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-700 transition hover:border-blue-300">
                        {item}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
