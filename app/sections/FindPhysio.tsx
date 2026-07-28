"use client";
import Link from "next/link";
import { ArrowRight, Activity, Sparkles, Home, ShieldCheck, Stethoscope, MapPin } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";
import TiltCard from "../components/ui/TiltCard";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import { useBookVisit } from "@/app/contexts/BookVisitContext";

const services = [
  { icon: Activity, title: "Sports Rehabilitation", text: "Recovery plans for sprains, strains, ACL rehab, tendon issues and return-to-sport readiness." },
  { icon: Stethoscope, title: "Neuro Rehabilitation", text: "Support for coordination, balance, strength and movement after neurological challenges." },
  { icon: Home, title: "Physiotherapy at Home", text: "Comfortable, personalised sessions at home for recovery, mobility and ageing well." },
  { icon: ShieldCheck, title: "Post-Surgery Rehab", text: "Structured care after surgery with pain relief, strength rebuilding and confidence in movement." },
];

export default function FindPhysio() {
  const { openBookVisit } = useBookVisit();

  return (
    <section id="specialties" className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <ScrollReveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Expert treatment</p>
            <h2 className="mb-4 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl md:text-4xl">
              Support for pain relief, movement recovery and everyday strength.
            </h2>
            <p className="mb-8 text-lg leading-8 text-slate-600">
              Whether you are dealing with back pain, a sports injury, post-surgery recovery or ongoing mobility concerns, each plan is built around clear progress and practical results.
            </p>

            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-blue-100/60 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:shadow-md">
                <div className="mb-3 flex items-center gap-2 text-slate-900">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">A clear path from first consultation to recovery</h3>
                </div>
                <p className="text-sm leading-7 text-slate-600">The care process is made simple, with thoughtful guidance and practical next steps at every stage.</p>
              </div>
              <div className="rounded-[1.25rem] border border-blue-100/60 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:shadow-md">
                <div className="mb-3 flex items-center gap-2 text-slate-900">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Convenient care in Bangalore and nearby areas</h3>
                </div>
                <p className="text-sm leading-7 text-slate-600">Choose in-clinic care or home visits, with plans designed to fit your routine and recovery pace.</p>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            <ScrollReveal direction="right" delay={0.1}>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.22)]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />

                <div className="relative mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-2">
                    <Activity className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-300">Popular care categories</p>
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-400">physiotherapy • rehab • wellness</p>
                  </div>
                </div>

                <StaggerContainer className="relative grid gap-3 md:grid-cols-2" stagger={0.08}>
                  {services.map((service) => (
                    <StaggerItem key={service.title}>
                      <TiltCard className="rounded-[1.15rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-300">
                          <service.icon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-1 text-sm font-semibold text-white">{service.title}</h3>
                        <p className="text-sm leading-6 text-slate-300">{service.text}</p>
                      </TiltCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="rounded-[1.5rem] border border-blue-100/60 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Need guidance on the right next step?</p>
                    <p className="text-sm text-slate-500">Book a consultation with Dr.Nishmitha.R.</p>
                  </div>
                  <button
                    onClick={openBookVisit}
                    className="btn-primary !px-4 !py-2.5 !text-sm shrink-0"
                  >
                    Book now <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Back pain", "Sports injury", "Neck pain", "Post-surgery", "Geriatric care"].map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{tag}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
