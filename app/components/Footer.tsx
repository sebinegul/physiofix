import Link from "next/link";
import { Activity, Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";

const columns = [
  {
    title: "Specializations",
    links: [
      { label: "Chiropractic Care", href: "/specialization/chiropracticCare" },
      { label: "Manual Therapy", href: "/specialization/manualTherapy" },
      { label: "Cupping Therapy", href: "/specialization/cuppingTherapy" },
      { label: "Electrotherapy", href: "/specialization/electrotherapy" },
      { label: "Sports Rehabilitation", href: "/services" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Dr. Nishmitha", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
      { label: "Book Appointment", href: "/contact" },
    ],
  },
  {
    title: "Treatments",
    links: [
      { label: "Physiotherapy Assessment", href: "/specialization/physiotherapyAssessment" },
      { label: "Bone Alignment", href: "/specialization/boneAlignment" },
      { label: "Soft Tissue Manipulation", href: "/specialization/softTissueManipulation" },
      { label: "Posture Correction", href: "/services" },
      { label: "Home Care Physiotherapy", href: "/services" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="conditions" className="relative overflow-hidden border-t border-slate-800 bg-slate-950/95 pt-16 pb-8 text-slate-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.08),_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-10 md:grid-cols-6">
          <ScrollReveal className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">
                Physio<span className="text-teal-300">Fix</span>
              </span>
            </Link>
            <p className="mb-5 max-w-xs text-sm leading-7 text-slate-400">
              Dr. Nishmitha R is a Physiotherapist in Sports Science with 5+ years of experience in orthopaedic sports medicine and neurological rehabilitation.
            </p>
            <div className="mb-5 space-y-2 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
                <span>30, Sai Krupa Complex, JP Nagar 8th Phase, Bangalore – 560076</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400" />
                <a href="tel:+918151912525" className="hover:text-teal-300">+91-8151912525</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400" />
                <a href="mailto:physiofix2525@gmail.com" className="hover:text-teal-300">physiofix2525@gmail.com</a>
              </div>
            </div>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400"
                >
                  <Icon className="h-4 w-4 text-slate-300" />
                </span>
              ))}
            </div>
          </ScrollReveal>

          {columns.map((col, i) => (
            <ScrollReveal key={col.title} delay={i * 0.08}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 transition hover:text-teal-300">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} PhysioFix. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
            <Link href="/contact" className="transition hover:text-teal-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
