import Link from "next/link";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import TiltCard from "../components/ui/TiltCard";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import { MoveRight, BadgeCheck, Hand, Home, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const services: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Sports Rehabilitation", description: "Recovery support for sports injuries, overuse pain, strengthening, and return-to-play progression.", icon: Sparkles },
  { title: "Orthopaedic and Spine Care", description: "Hands-on treatment and movement correction for back pain, neck pain, shoulder pain and joint stiffness.", icon: BadgeCheck },
  { title: "Neuro Rehabilitation", description: "Guided support for coordination, balance, gait, and movement-based recovery after neurological challenges.", icon: Stethoscope },
  { title: "Post-Surgery Rehabilitation", description: "Focused rehab plans for mobility, pain management, and strength rebuilding after surgery.", icon: ShieldCheck },
  { title: "Manual Therapy & Cupping", description: "Soft tissue release, mobilisation, and complementary therapies for tension and pain relief.", icon: Hand },
  { title: "Physiotherapy at Home", description: "Convenient care in the comfort of home for elderly patients, recovery after procedures, and mobility support.", icon: Home },
];

export default function ServicesPage() {
  return (
    <PageTransition>
      <main className="min-h-screen pt-28 pb-20">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Our services</p>
            <h1 className="mb-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Physiotherapy support for <GradientText>mobility, pain relief</GradientText> and performance.
            </h1>
            <p className="text-lg leading-8 text-slate-600">Each session is designed to help you recover safely, move better, and feel stronger with expert guidance tailored to your goals.</p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" stagger={0.07}>
            {services.map((service, i) => (
              <StaggerItem key={service.title}>
                <TiltCard index={i} className="h-full rounded-[1.6rem] border border-teal-100/60 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-slate-900">{service.title}</h2>
                  <p className="text-sm leading-7 text-slate-600">{service.description}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal className="mt-10" delay={0.15}>
            <div className="relative overflow-hidden rounded-[2rem] border border-teal-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_24px_90px_rgba(2,6,23,0.25)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-teal-300">Ready to begin?</p>
                  <h2 className="mb-3 text-3xl font-bold tracking-tight">Book a consultation and start your recovery plan.</h2>
                  <p className="text-lg leading-8 text-slate-300">Whether it is a sports injury, post-surgical recovery, or long-standing pain, help is available with a simple and supportive first step.</p>
                </div>
                <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.03] hover:shadow-lg">
                  Contact Dr. Nishmitha <MoveRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </PageTransition>
  );
}
