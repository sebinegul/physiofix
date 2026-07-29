"use client";
import Link from "next/link";
import {
  ArrowRight, HeartPulse, Activity, Brain, Home, Wind, Dumbbell,
  Hand, Zap, AlignCenter, Layers, ShieldCheck,
} from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import GradientText from "../components/ui/GradientText";
import type { LucideIcon } from "lucide-react";

const treatmentList = [
  { title: "Chiropractic Care", description: "Restores spine and joint alignment to reduce pain and improve body function.", href: "/specialization/chiropracticCare", icon: AlignCenter, color: "from-rose-500 to-pink-500", lightBg: "bg-rose-50", iconColor: "text-rose-600", category: "specialties" },
  { title: "Myofascial Release", description: "Releases tight fascia to reduce muscle tension and improve mobility.", href: "/specialization/softTissueManipulation", icon: Dumbbell, color: "from-indigo-500 to-blue-500", lightBg: "bg-indigo-50", iconColor: "text-indigo-500", category: "specialties" },
  { title: "Manual Therapy", description: "Hands-on techniques to improve movement, relax muscles, and reduce pain.", href: "/specialization/manualTherapy", icon: Hand, color: "from-emerald-500 to-green-500", lightBg: "bg-emerald-50", iconColor: "text-emerald-600", category: "specialties" },
  { title: "Physiotherapy At Home", description: "Personalised physiotherapy sessions delivered at home for faster recovery.", href: "/specialization/homePhysio", icon: Home, color: "from-emerald-400 to-green-500", lightBg: "bg-emerald-50", iconColor: "text-emerald-500", category: "recovery" },
  { title: "Geriatric Physiotherapy", description: "Improves mobility, strength, and independence in elderly individuals.", href: "/specialization/geriatricPhysio", icon: HeartPulse, color: "from-rose-400 to-red-500", lightBg: "bg-rose-50", iconColor: "text-rose-500", category: "mobility" },
  { title: "Sports Rehabilitation", description: "Recovery support for sports injuries, overuse pain, strengthening, and return-to-play progression.", href: "/specialization/sportsPhysio", icon: Activity, color: "from-teal-500 to-emerald-500", lightBg: "bg-teal-50", iconColor: "text-teal-600", category: "recovery" },
  { title: "Cupping Therapy", description: "Reduces muscle tension, improves blood flow, and promotes healing.", href: "/specialization/cuppingTherapy", icon: Layers, color: "from-violet-500 to-purple-500", lightBg: "bg-violet-50", iconColor: "text-violet-600", category: "specialties" },
  { title: "Neuro Rehabilitation", description: "Supports movement, coordination, and balance recovery after neurological conditions.", href: "/specialization/neuroRehabilitation", icon: Brain, color: "from-violet-500 to-purple-600", lightBg: "bg-purple-50", iconColor: "text-purple-600", category: "recovery" },
  { title: "Electrotherapy", description: "Uses electrical stimulation to reduce pain and support muscle recovery.", href: "/specialization/electrotherapy", icon: Zap, color: "from-amber-500 to-orange-500", lightBg: "bg-amber-50", iconColor: "text-amber-600", category: "specialties" },
  { title: "Posture Correction", description: "Corrects postural imbalances and improves spinal alignment.", href: "/specialization/postureCorrection", icon: Wind, color: "from-blue-400 to-indigo-500", lightBg: "bg-blue-50", iconColor: "text-blue-500", category: "mobility" },
  { title: "Post Surgery Rehabilitation", description: "Restores strength, mobility, and confidence after surgical procedures.", href: "/specialization/postSurgeryRehabilitation", icon: ShieldCheck, color: "from-sky-500 to-cyan-500", lightBg: "bg-sky-50", iconColor: "text-sky-600", category: "recovery" },
];

export default function PopularSearches() {
  return (
    <section className="py-12 sm:py-20" id="specializations">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-shell px-6 py-8 md:px-8 lg:px-10">
          <ScrollReveal className="mb-12">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 backdrop-blur-sm">
                What we treat
              </div>
              <h2 className="text-2xl font-bold leading-[1.2] tracking-tight sm:text-3xl md:text-4xl">
                <GradientText>Conditions and treatments</GradientText>{" "}
                <span className="text-slate-900">we support every day.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                From sports injuries and chronic pain to post-surgery rehab and mobility concerns, every condition is met with a calm, structured approach to recovery.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <StaggerContainer className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              {treatmentList.map((item, i) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <Link
                      href={item.href}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white p-4 sm:p-5 transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)]"
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]`} />

                      <div className="relative flex flex-1 items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.lightBg} transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                          <Icon className={`h-5 w-5 ${item.iconColor} transition-transform duration-500 group-hover:scale-110`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">{item.title}</p>
                          <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.description}</p>
                        </div>
                      </div>

                      {/* Bottom bar that slides in on hover */}
                      <div className="relative mt-auto pt-4 flex items-center gap-2 overflow-hidden">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent transition-all duration-500 group-hover:via-blue-200" />
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-all duration-500 group-hover:translate-x-0 group-hover:text-blue-600">
                          Learn more
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
