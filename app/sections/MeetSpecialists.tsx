import Link from "next/link";
import { Star, MapPin, ArrowRight, BadgeCheck, GraduationCap } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";

const treatments = [
  { name: "Physiotherapy Assessment & Therapy", href: "/specialization/physiotherapyAssessment" },
  { name: "Electrotherapy", href: "/specialization/electrotherapy" },
  { name: "Manual Therapy", href: "/specialization/manualTherapy" },
  { name: "Cupping Therapy", href: "/specialization/cuppingTherapy" },
  { name: "Chiropractic Treatment", href: "/specialization/chiropracticCare" },
  { name: "Bone Alignment Therapy", href: "/specialization/boneAlignment" },
  { name: "Soft Tissue Manipulation", href: "/specialization/softTissueManipulation" },
  { name: "Ortho Sports & Neuro Rehabilitation", href: "/specialization/neuroRehabilitation" },
  { name: "Posture Correction", href: "/specialization/postureCorrection" },
];

export default function MeetSpecialists() {
  return (
    <section className="py-20" id="doctor">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Meet your physiotherapist</p>
          <h2 className="text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 md:text-4xl">
            The expert behind <GradientText>PhysioFix</GradientText>
          </h2>
        </ScrollReveal>

        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <ScrollReveal direction="left">
            <div className="group relative overflow-hidden rounded-[2rem] border border-blue-100/60 bg-white/70 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl transition group-hover:bg-blue-400/30" />
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=640&q=80"
                  alt="Dr.Nishmitha.R"
                  className="h-[420px] w-full object-cover object-top transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  Lead Clinician
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 backdrop-blur">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">5+ years experience</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="rounded-[2rem] border border-blue-100/60 bg-white/75 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Dr.Nishmitha.R</h3>
                  <p className="text-sm text-blue-600">Master of Physiotherapy (MPT), Sports Science</p>
                </div>
              </div>

              <p className="mb-6 text-base leading-8 text-slate-600">
                Dr.Nishmitha.R has 5 years of experience in orthopaedic sports medicine and neurologic conditions, including paralysis, back pain, shoulder pain, knee pain, sports injuries, and post-fracture rehabilitation.
              </p>

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Specialized treatments</p>
              <div className="mb-8 grid gap-2 sm:grid-cols-2">
                {treatments.map((item) => (
                  <Link key={item.name} href={item.href} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <BadgeCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">JP Nagar, Bangalore</span>
                </div>
                <Link href="/about" className="btn-primary !px-5 !py-2.5 !text-sm">
                  Know More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
