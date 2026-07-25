"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import TiltCard from "../components/ui/TiltCard";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import {
  MoveRight,
  BadgeCheck,
  Hand,
  Home,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ArrowRight,
  Star,
  Clock,
  Users,
  TrendingUp,
  Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const services: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Sports Rehabilitation", description: "Recovery support for sports injuries, overuse pain, strengthening, and return-to-play progression.", icon: Sparkles },
  { title: "Orthopaedic and Spine Care", description: "Hands-on treatment and movement correction for back pain, neck pain, shoulder pain and joint stiffness.", icon: BadgeCheck },
  { title: "Neuro Rehabilitation", description: "Guided support for coordination, balance, gait, and movement-based recovery after neurological challenges.", icon: Stethoscope },
  { title: "Post-Surgery Rehabilitation", description: "Focused rehab plans for mobility, pain management, and strength rebuilding after surgery.", icon: ShieldCheck },
  { title: "Manual Therapy & Cupping", description: "Soft tissue release, mobilisation, and complementary therapies for tension and pain relief.", icon: Hand },
  { title: "Physiotherapy at Home", description: "Convenient care in the comfort of home for elderly patients, recovery after procedures, and mobility support.", icon: Home },
];

const stats = [
  { icon: Users, value: "2000+", label: "Patients Treated" },
  { icon: Star, value: "4.9", label: "Google Rating" },
  { icon: Clock, value: "5+", label: "Years Experience" },
  { icon: TrendingUp, value: "95%", label: "Recovery Rate" },
];

const processSteps = [
  { step: "01", title: "Assessment", description: "Detailed evaluation of your condition, movement patterns, and goals." },
  { step: "02", title: "Diagnosis", description: "Identifying the root cause and creating a clear picture of your recovery path." },
  { step: "03", title: "Treatment", description: "Personalised hands-on therapy and guided exercises tailored to you." },
  { step: "04", title: "Recovery", description: "Progressive rehabilitation with measurable milestones and lasting results." },
];

export default function ServicesPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_35%)]" />

          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 right-[-3rem] h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-8 max-w-3xl">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
              >
                <Heart className="h-4 w-4 text-blue-500" />
                Comprehensive Physiotherapy Care
              </motion.div>

              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 text-4xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-5xl lg:text-[3.45rem]"
              >
                Physiotherapy support for{" "}
                <GradientText>mobility, pain relief</GradientText> and performance.
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-lg leading-8 text-slate-600"
              >
                Each session is designed to help you recover safely, move better, and feel stronger with expert guidance tailored to your goals.
              </motion.p>
            </ScrollReveal>

            {/* Stats Bar */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                What we offer
              </p>
              <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl">
                Our <GradientText>specialised services</GradientText>
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
                Expert physiotherapy care tailored to your unique needs, from sports recovery to home-based rehabilitation.
              </p>
            </ScrollReveal>

            <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" stagger={0.07}>
              {services.map((service, i) => (
                <StaggerItem key={service.title}>
                  <TiltCard index={i} className="h-full rounded-[1.6rem] border border-blue-100/60 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition group-hover:bg-blue-500 group-hover:text-white">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-slate-900">{service.title}</h2>
                    <p className="text-sm leading-7 text-slate-600">{service.description}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                How it works
              </p>
              <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl">
                Your path to <GradientText>recovery</GradientText>
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
                A structured, evidence-based approach that ensures every step of your journey is guided and effective.
              </p>
            </ScrollReveal>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
                <ScrollReveal key={step.step} delay={i * 0.12}>
                  <div className="group relative h-full overflow-hidden rounded-[1.5rem] border border-slate-100/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                    <div className="mb-4 text-5xl font-black leading-none text-blue-500/15 transition-colors duration-500 group-hover:text-blue-500/30">
                      {step.step}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{step.description}</p>

                    {i < processSteps.length - 1 && (
                      <div className="absolute right-0 top-1/2 hidden h-[2px] w-6 -translate-y-1/2 translate-x-full bg-gradient-to-r from-blue-200 to-transparent lg:block" />
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal delay={0.1}>
              <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_24px_90px_rgba(2,6,23,0.25)] md:p-12">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

                <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-2xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
                      Ready to begin?
                    </p>
                    <h2 className="mb-4 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl">
                      Book a consultation and start your recovery plan.
                    </h2>
                    <p className="text-lg leading-8 text-slate-300">
                      Whether it is a sports injury, post-surgical recovery, or long-standing pain, help is available with a simple and supportive first step.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/35"
                    >
                      Contact Dr. Nishmitha
                      <MoveRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="tel:+918151912525"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:border-white/40 hover:bg-white/20"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}