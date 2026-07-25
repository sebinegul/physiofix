import Link from "next/link";
import {
  ArrowRight, HeartPulse, Activity, Bone, Brain, Home, Wind, Syringe, Dumbbell,
  Hand, Zap, Stethoscope, AlignCenter, Layers,
} from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import type { LucideIcon } from "lucide-react";

const specialties: {
  name: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  detail: string;
  href: string;
  active?: boolean;
}[] = [
  {
    name: "Sports Rehab",
    icon: Activity,
    gradient: "from-orange-500 to-amber-400",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-500",
    detail: "Return to sport safely",
    href: "/services",
  },
  {
    name: "Orthopaedic",
    icon: Bone,
    gradient: "from-sky-500 to-cyan-400",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-500",
    detail: "Back and joint care",
    href: "/services",
  },
  {
    name: "Neurological",
    icon: Brain,
    gradient: "from-violet-500 to-fuchsia-400",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
    detail: "Balance and coordination",
    href: "/services",
  },
  {
    name: "Post-Surgical",
    icon: Syringe,
    gradient: "from-rose-500 to-red-400",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500",
    detail: "Strength rebuilding",
    href: "/services",
    active: true,
  },
  {
    name: "Home Care",
    icon: Home,
    gradient: "from-emerald-500 to-green-400",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    detail: "Comfortable visits at home",
    href: "/services",
  },
  {
    name: "Posture",
    icon: Wind,
    gradient: "from-blue-500 to-cyan-400",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    detail: "Alignment and breathing",
    href: "/services",
  },
];

const treatmentList = [
  { title: "Physiotherapy Assessment & Therapy", description: "A personalised evaluation to identify pain, mobility and strength concerns early.", href: "/specialization/physiotherapyAssessment", icon: Stethoscope },
  { title: "Electrotherapy", description: "Gentle electrical stimulation to reduce pain, relax muscles and support healing.", href: "/specialization/electrotherapy", icon: Zap },
  { title: "Manual Therapy", description: "Hands-on techniques to improve movement, ease tension and reduce discomfort.", href: "/specialization/manualTherapy", icon: Hand },
  { title: "Cupping Therapy", description: "Relieves stiffness, supports circulation and eases muscle tightness.", href: "/specialization/cuppingTherapy", icon: Layers },
  { title: "Chiropractic Treatment", description: "Spinal and joint care to restore alignment, mobility and comfort.", href: "/specialization/chiropracticCare", icon: AlignCenter },
  { title: "Bone Alignment Therapy", description: "Targeted care for posture, alignment and joint balance in everyday movement.", href: "/specialization/boneAlignment", icon: Bone },
  { title: "Soft Tissue Manipulation", description: "Focused release techniques for tight muscles, trigger points and restricted mobility.", href: "/specialization/softTissueManipulation", icon: Dumbbell },
  { title: "Ortho Sports & Neuro Rehab", description: "Structured recovery for sports injuries, neurological concerns and long-term rehabilitation.", href: "/services", icon: Activity },
  { title: "Posture Correction", description: "Movement-based support to improve alignment, reduce strain and build sustainable habits.", href: "/services", icon: Wind },
];

export default function PopularSearches() {
  return (
    <section className="relative overflow-hidden" id="specializations">
      {/* Background treatment to make section stand out */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Hero-style header */}
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Specialization
          </p>
          <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl lg:text-5xl">
            Expert care for <GradientText>every condition</GradientText>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
            From sports injuries to neurological recovery, each specialty is backed by
            evidence-based practice and years of hands-on experience.
          </p>
        </ScrollReveal>

        {/* 6 Specialty Feature Cards — top tier */}
        <StaggerContainer className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {specialties.map((specialty) => {
            const Icon = specialty.icon;
            return (
              <StaggerItem key={specialty.name}>
                <Link
                  href={specialty.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] ${
                    specialty.active
                      ? "border-blue-200 ring-2 ring-blue-400/40"
                      : "border-slate-100"
                  }`}
                >
                  {/* Gradient accent line at top */}
                  <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${specialty.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                  <div className="mb-5 flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${specialty.iconBg} transition-colors duration-500 group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${specialty.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{specialty.name}</p>
                      <p className="text-sm text-slate-500">{specialty.detail}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Treatment grid — second tier */}
        <ScrollReveal>
          <div className="rounded-[1.75rem] border border-blue-100/60 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-600">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Specialized treatments</p>
                  <p className="text-sm text-slate-500">Hands-on and movement-based care options.</p>
                </div>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-all duration-300 hover:bg-blue-100 hover:shadow-sm"
              >
                Explore all specialties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <StaggerContainer className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" stagger={0.05}>
              {treatmentList.map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <Link
                      href={item.href}
                      className="group flex h-full rounded-[1.15rem] border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_12px_40px_rgba(59,130,246,0.1)]"
                    >
                      <div className="flex w-full items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-100">
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.description}</p>
                        </div>
                        <span className="mt-0.5 shrink-0 rounded-full bg-blue-50 p-2 text-blue-500 transition-colors duration-300 group-hover:bg-blue-100 group-hover:text-blue-600">
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
