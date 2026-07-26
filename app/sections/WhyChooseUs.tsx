import Link from "next/link";
import Image from "next/image";
import { Clock, CheckCircle, CalendarCheck, Shield, Star, ArrowRight } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "../components/ui/StaggerContainer";

const reasons = [
  { icon: Clock, text: "Personalised plans shaped around your symptoms, routine and goals", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: CheckCircle, text: "Evidence-based rehabilitation with clear progress and recovery milestones", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: CalendarCheck, text: "Flexible clinic and home-visit care for convenience and comfort", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Shield, text: "Trusted, local physiotherapy support with a calm and supportive approach", color: "text-orange-600", bg: "bg-orange-50" },
  { icon: Star, text: "A thoughtful recovery experience built around movement and confidence", color: "text-amber-600", bg: "bg-amber-50" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal direction="left" className="hidden lg:block">
            <div className="section-shell p-4">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[470px] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800&q=80"
                  alt="Physiotherapy session"
                  fill
                  sizes="(max-width: 1024px) 0px, 50vw"
                  className="object-cover object-top transition duration-700 hover:scale-105"
                />
                <div className="absolute left-4 right-4 top-4 flex items-center justify-between rounded-2xl border border-white/20 bg-white/85 px-4 py-3 backdrop-blur">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">5+ years experience</p>
                    <p className="text-sm text-slate-500">Trusted by patients in Bangalore</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/15 bg-slate-950/70 p-4 text-white backdrop-blur-xl">
                  {reasons.slice(0, 3).map((reason) => (
                    <div key={reason.text} className="mb-2 flex items-center gap-2 last:mb-0">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${reason.bg}`}>
                        <reason.icon className={`h-3.5 w-3.5 ${reason.color}`} />
                      </div>
                      <p className="text-sm text-slate-200">{reason.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Why choose PhysioFix</p>
            <h2 className="mb-5 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 md:text-4xl">
              A calmer, clearer path to recovery.
            </h2>
            <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
              From post-surgery rehab to sports injuries and everyday pain, care is delivered with structure, empathy and a focus on long-term movement confidence.
            </p>

            <StaggerContainer className="mb-10 space-y-3" stagger={0.08}>
              {reasons.map((reason) => (
                <StaggerItem key={reason.text}>
                  <div className="flex items-center gap-3 rounded-2xl border border-blue-100/60 bg-white/70 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${reason.bg}`}>
                      <reason.icon className={`h-5 w-5 ${reason.color}`} />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{reason.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Link href="/contact" className="btn-primary">
              Book your first consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
