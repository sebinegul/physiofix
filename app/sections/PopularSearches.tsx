import Link from "next/link";
import {
  ArrowRight, HeartPulse, Activity, Brain, Home, Wind, Dumbbell,
  Hand, Zap, Stethoscope, AlignCenter, Layers, ShieldCheck,
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
  { name: "Chiropractic Care", icon: AlignCenter, bg: "from-rose-500/12 to-red-400/8", border: "border-rose-200/70", color: "text-rose-600", detail: "Spinal and joint alignment" },
  { name: "Myofascial Release", icon: Dumbbell, bg: "from-indigo-500/12 to-blue-400/8", border: "border-indigo-200/70", color: "text-indigo-500", detail: "Trigger point and muscle release" },
  { name: "Manual Therapy", icon: Hand, bg: "from-emerald-500/12 to-green-400/8", border: "border-emerald-200/70", color: "text-emerald-600", detail: "Hands-on movement improvement" },
  { name: "Physiotherapy At Home", icon: Home, bg: "from-emerald-500/12 to-green-400/8", border: "border-emerald-200/70", color: "text-emerald-600", detail: "Comfortable visits at home" },
  { name: "Geriatric Physiotherapy", icon: HeartPulse, bg: "from-rose-500/12 to-red-400/8", border: "border-rose-200/70", color: "text-rose-500", detail: "Elderly mobility and balance" },
  { name: "Sports Rehabilitation", icon: Activity, bg: "from-orange-500/12 to-amber-400/8", border: "border-orange-200/70", color: "text-orange-600", detail: "Return to sport safely" },
  { name: "Cupping Therapy", icon: Layers, bg: "from-violet-500/12 to-purple-400/8", border: "border-violet-200/70", color: "text-violet-600", detail: "Circulation and muscle relief" },
  { name: "Neuro Rehabilitation", icon: Brain, bg: "from-violet-500/12 to-fuchsia-400/8", border: "border-violet-200/70", color: "text-violet-600", detail: "Balance and coordination" },
  { name: "Electrotherapy", icon: Zap, bg: "from-amber-500/12 to-yellow-400/8", border: "border-amber-200/70", color: "text-amber-600", detail: "Pain relief and muscle recovery" },
  { name: "Posture Correction", icon: Wind, bg: "from-blue-500/12 to-cyan-400/8", border: "border-blue-200/70", color: "text-blue-600", detail: "Alignment and sustainable habits" },
  { name: "Post Surgery Rehabilitation", icon: ShieldCheck, bg: "from-sky-500/12 to-cyan-400/8", border: "border-sky-200/70", color: "text-sky-600", detail: "Strength rebuilding after surgery" },
];

const treatmentList = [
  { title: "Chiropractic Care", description: "Restores spine and joint alignment to reduce pain and improve body function.", href: "/specialization/chiropracticCare", icon: AlignCenter, color: "from-rose-500 to-pink-500", lightBg: "bg-rose-50", iconColor: "text-rose-600" },
  { title: "Myofascial Release", description: "Releases tight fascia to reduce muscle tension and improve mobility.", href: "/specialization/softTissueManipulation", icon: Dumbbell, color: "from-indigo-500 to-blue-500", lightBg: "bg-indigo-50", iconColor: "text-indigo-500" },
  { title: "Manual Therapy", description: "Hands-on techniques to improve movement, relax muscles, and reduce pain.", href: "/specialization/manualTherapy", icon: Hand, color: "from-emerald-500 to-green-500", lightBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { title: "Physiotherapy At Home", description: "Personalised physiotherapy sessions delivered at home for faster recovery.", href: "/specialization/homePhysio", icon: Home, color: "from-emerald-400 to-green-500", lightBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  { title: "Geriatric Physiotherapy", description: "Improves mobility, strength, and independence in elderly individuals.", href: "/specialization/geriatricPhysio", icon: HeartPulse, color: "from-rose-400 to-red-500", lightBg: "bg-rose-50", iconColor: "text-rose-500" },
  { title: "Sports Rehabilitation", description: "Recovery support for sports injuries, overuse pain, strengthening, and return-to-play progression.", href: "/specialization/sportsPhysio", icon: Activity, color: "from-teal-500 to-emerald-500", lightBg: "bg-teal-50", iconColor: "text-teal-600" },
  { title: "Cupping Therapy", description: "Reduces muscle tension, improves blood flow, and promotes healing.", href: "/specialization/cuppingTherapy", icon: Layers, color: "from-violet-500 to-purple-500", lightBg: "bg-violet-50", iconColor: "text-violet-600" },
  { title: "Neuro Rehabilitation", description: "Supports movement, coordination, and balance recovery after neurological conditions.", href: "/specialization/neuroRehabilitation", icon: Brain, color: "from-violet-500 to-purple-600", lightBg: "bg-purple-50", iconColor: "text-purple-600" },
  { title: "Electrotherapy", description: "Uses electrical stimulation to reduce pain and support muscle recovery.", href: "/specialization/electrotherapy", icon: Zap, color: "from-amber-500 to-orange-500", lightBg: "bg-amber-50", iconColor: "text-amber-600" },
  { title: "Posture Correction", description: "Corrects postural imbalances and improves spinal alignment.", href: "/specialization/postureCorrection", icon: Wind, color: "from-blue-400 to-indigo-500", lightBg: "bg-blue-50", iconColor: "text-blue-500" },
  { title: "Post Surgery Rehabilitation", description: "Restores strength, mobility, and confidence after surgical procedures.", href: "/specialization/postSurgeryRehabilitation", icon: ShieldCheck, color: "from-sky-500 to-cyan-500", lightBg: "bg-sky-50", iconColor: "text-sky-600" },
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

          {/* Treatment cards with "Click to learn more" - NOW ON TOP */}
          <ScrollReveal className="mb-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-600">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">Specialized treatments</p>
                <p className="text-sm text-slate-500">Click to learn more about each treatment.</p>
              </div>
            </div>

            <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
              {treatmentList.map((item, i) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <Link
                      href={item.href}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)]"
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]`} />

                      <div className="relative flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.lightBg} transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                          <Icon className={`h-5 w-5 ${item.iconColor} transition-transform duration-500 group-hover:scale-110`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">{item.title}</p>
                          <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.description}</p>
                        </div>
                      </div>

                      {/* Bottom bar that slides in on hover */}
                      <div className="relative mt-4 flex items-center gap-2 overflow-hidden">
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
            </div>

            <div className="mt-8 text-center">
              <Link href="/services" className="btn-primary">
                Explore all services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Specialty cards grid - NOW ON BOTTOM */}
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.07}>
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
        </div>
      </div>
    </section>
  );
}
