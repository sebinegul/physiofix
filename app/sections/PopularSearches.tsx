import Link from "next/link";
import {
  ArrowRight, HeartPulse, Activity, Bone, Brain, Home, Wind, Syringe, Dumbbell,
  Hand, Zap, Stethoscope, AlignCenter, Layers,
} from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";
import TiltCard from "../components/ui/TiltCard";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";
import type { LucideIcon } from "lucide-react";

const categories = [
  { label: "Specialties", active: true },
  { label: "Recovery", active: false },
  { label: "Mobility", active: false },
];

const specialties: { name: string; icon: LucideIcon; bg: string; border: string; color: string; detail: string; active?: boolean }[] = [
  { name: "Sports Rehab", icon: Activity, bg: "from-orange-500/12 to-amber-400/8", border: "border-orange-200/70", color: "text-orange-600", detail: "Return to sport safely" },
  { name: "Orthopaedic", icon: Bone, bg: "from-sky-500/12 to-cyan-400/8", border: "border-sky-200/70", color: "text-sky-600", detail: "Back and joint care" },
  { name: "Neurological", icon: Brain, bg: "from-violet-500/12 to-fuchsia-400/8", border: "border-violet-200/70", color: "text-violet-600", detail: "Balance and coordination" },
  { name: "Post-Surgical", icon: Syringe, bg: "from-rose-500/12 to-red-400/8", border: "border-rose-200/70", color: "text-rose-600", detail: "Strength rebuilding", active: true },
  { name: "Home Care", icon: Home, bg: "from-emerald-500/12 to-green-400/8", border: "border-emerald-200/70", color: "text-emerald-600", detail: "Comfortable visits at home" },
  { name: "Posture", icon: Wind, bg: "from-blue-500/12 to-cyan-400/8", border: "border-blue-200/70", color: "text-blue-600", detail: "Alignment and breathing" },
];

const treatmentList = [
  { title: "Physiotherapy Assessment & Therapy", description: "A personalised evaluation to identify pain, mobility and strength concerns early.", href: "/specialization/physiotherapyAssessment", icon: Stethoscope },
  { title: "Electrotherapy", description: "Gentle electrical stimulation to reduce pain, relax muscles and support healing.", href: "/specialization/electrotherapy", icon: Zap },
  { title: "Manual Therapy", description: "Hands-on techniques to improve movement, ease tension and reduce discomfort.", href: "/specialization/manualTherapy", icon: Hand },
  { title: "Cupping Therapy", description: "Relieves stiffness, supports circulation and eases muscle tightness.", href: "/specialization/cuppingTherapy", icon: Layers },
  { title: "Chiropractic Treatment", description: "Spinal and joint care to restore alignment, mobility and comfort.", href: "/specialization/chiropracticCare", icon: AlignCenter },
  { title: "Bone Alignment Therapy", description: "Targeted care for posture, alignment and joint balance in everyday movement.", href: "/specialization/boneAlignment", icon: Bone },
  { title: "Soft Tissue Manipulation", description: "Focused release techniques for tight muscles, trigger points and restricted mobility.", href: "/specialization/softTissueManipulation", icon: Dumbbell },
  { title: "Ortho Sports & Neuro Rehabilitation", description: "Structured recovery for sports injuries, neurological concerns and long-term rehabilitation.", href: "/services", icon: Activity },
  { title: "Posture Correction", description: "Movement-based support to improve alignment, reduce strain and build sustainable habits.", href: "/services", icon: Wind },
];

export default function PopularSearches() {
  return (
    <section className="py-20" id="specializations">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-shell px-6 py-8 md:px-8 lg:px-10">
          <ScrollReveal className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Specialization</p>
              <h2 className="text-3xl font-bold leading-[1.2] tracking-tight text-slate-900">Conditions and treatments we support every day.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button key={item.label} className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${item.active ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" stagger={0.07}>
            {specialties.map((specialty) => {
              const Icon = specialty.icon;
              return (
                <StaggerItem key={specialty.name}>
                  <TiltCard className={`rounded-[1.25rem] border bg-gradient-to-br ${specialty.bg} p-4 text-left ${specialty.border} ${specialty.active ? "ring-2 ring-blue-400/60" : ""}`}>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                      <Icon className={`h-5 w-5 ${specialty.color}`} />
                    </div>
                    <p className={`text-sm font-semibold ${specialty.color}`}>{specialty.name}</p>
                    <p className="mt-2 text-xs text-slate-500">{specialty.detail}</p>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <ScrollReveal className="mt-8 rounded-[1.25rem] border border-blue-100/60 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/40 px-4 py-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-2 text-blue-600">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Specialized treatments</p>
                  <p className="text-sm text-slate-500">Hands-on and movement-based care options.</p>
                </div>
              </div>
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600">
                Explore all specialties <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
            <StaggerContainer className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
              {treatmentList.map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <Link
                      href={item.href}
                      className="group flex h-full rounded-[1.15rem] border border-slate-200/80 bg-white/90 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)]"
                    >
                      <div className="flex w-full items-start justify-between gap-3">
                        <div>
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                        <span className="mt-0.5 rounded-full bg-blue-50 p-2 text-blue-600 transition group-hover:bg-blue-100">
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
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
