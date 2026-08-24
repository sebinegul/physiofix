import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock, CheckCircle2, Home as HomeIcon, Accessibility } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import { safeJsonLd } from "@/lib/json-ld";
import { CLINIC_ADDRESS, CLINIC_PHONE, CLINIC_MAPS_LINK, CLINIC_MAPS_EMBED } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Physiotherapy in Kothanur, Bangalore | Home Visits & Clinic Care",
  description:
    "Expert physiotherapy near Kothanur, Bangalore. Sports rehab, neuro rehabilitation, post-surgery recovery, cupping therapy & home visits by Dr.Nishmitha.R (MPT). Book today.",
  alternates: {
    canonical: "https://physiofix.net/physiotherapy-kothanur",
  },
  openGraph: {
    title: "Physiotherapy in Kothanur, Bangalore | PhysioFix",
    description:
      "PhysioFix serves Kothanur and nearby areas with expert physiotherapy, sports injury treatment, neuro rehab and home physiotherapy visits.",
    url: "https://physiofix.net/physiotherapy-kothanur",
    images: ["https://physiofix.net/og-image.png"],
  },
};

const services = [
  { name: "Sports Injury Rehabilitation", href: "/specialization/sportsPhysio" },
  { name: "Neuro Rehabilitation", href: "/specialization/neuroRehabilitation" },
  { name: "Post-Surgery Recovery", href: "/specialization/postSurgeryRehabilitation" },
  { name: "Cupping Therapy", href: "/specialization/cuppingTherapy" },
  { name: "Chiropractic & Bone Alignment", href: "/specialization/boneAlignment" },
  { name: "Home Physiotherapy Visits", href: "/specialization/homePhysio" },
];

const conditions = [
  "Back pain & sciatica",
  "Neck pain from desk work",
  "Frozen shoulder",
  "Knee osteoarthritis",
  "Plantar fasciitis",
  "Sports injuries",
  "Stroke recovery",
  "Post-fracture stiffness",
];

const faqs = [
  {
    question: "Do you provide home physiotherapy visits in Kothanur?",
    answer:
      "Yes. PhysioFix offers home physiotherapy visits across Kothanur and surrounding areas of South Bangalore for elderly patients, post-surgery recovery, and anyone who finds it difficult to travel to our JP Nagar 8th Phase clinic.",
  },
  {
    question: "How far is the PhysioFix clinic from Kothanur?",
    answer:
      "Our clinic at 30, Sai Krupa Complex, Kothanur Dinne Main Road, JP Nagar 8th Phase is right on the Kothanur Dinne road — a short drive from most parts of Kothanur, Subba Raju Layout and BK Circle.",
  },
  {
    question: "What conditions do you treat for patients from Kothanur?",
    answer:
      "We treat back pain, neck pain, knee osteoarthritis, frozen shoulder, sports injuries, sciatica, stroke rehabilitation, post-surgical stiffness and more — with evidence-based physiotherapy led by Dr.Nishmitha.R (MPT Sports Science).",
  },
  {
    question: "How do I book an appointment?",
    answer: `Call ${CLINIC_PHONE} or use the booking form on our contact page. Same-week appointments are usually available, Monday to Saturday, 9 AM to 7 PM.`,
  },
];

export default function PhysiotherapyKothanurPage() {
  return (
    <PageTransition>
      {/* LocalBusiness + Service structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Physiotherapy in Kothanur, Bangalore | PhysioFix",
            url: "https://physiofix.net/physiotherapy-kothanur",
            about: {
              "@id": "https://physiofix.net/#organization",
            },
            mainEntity: {
              "@type": "Service",
              name: "Physiotherapy in Kothanur, Bangalore",
              provider: { "@id": "https://physiofix.net/#organization" },
              areaServed: [
                { "@type": "Neighborhood", name: "Kothanur" },
                { "@type": "Neighborhood", name: "JP Nagar" },
                { "@type": "City", name: "Bangalore" },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_35%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Kothanur · JP Nagar · South Bangalore
              </p>
              <h1 className="text-3xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                Expert <GradientText>physiotherapy</GradientText> for Kothanur residents
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">
                PhysioFix is minutes from Kothanur on Kothanur Dinne Main Road, offering
                sports rehabilitation, neuro rehab, post-surgery recovery and home
                physiotherapy visits — led by Dr.Nishmitha.R (MPT Sports Science).
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40 active:scale-[0.97]"
                >
                  Book an Appointment
                </Link>
                <a
                  href={`tel:${CLINIC_PHONE.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                  aria-label={`Call ${CLINIC_PHONE}`}
                >
                  <Phone className="h-4 w-4" />
                  {CLINIC_PHONE}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-10 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                What We Treat
              </p>
              <h2 className="text-2xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                Physiotherapy services available to <GradientText>Kothanur patients</GradientText>
              </h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <ScrollReveal key={s.name} delay={i * 0.06}>
                  <Link
                    href={s.href}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 hover:shadow-[0_20px_50px_-8px_rgba(59,130,246,0.18)]"
                  >
                    <span className="flex items-center gap-3 text-sm font-bold text-slate-900 group-hover:text-blue-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500" />
                      {s.name}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Conditions + location info */}
        <section className="bg-white/70 py-16 backdrop-blur md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <ScrollReveal>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                  What We Treat
                </p>
                <h2 className="text-2xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                  Conditions we treat <GradientText>every day</GradientText>
                </h2>
                <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {conditions.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_1px_4px_rgba(15,23,42,0.03)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 overflow-hidden rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-6 sm:p-7">
                  <h3 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                      <HomeIcon className="h-4.5 w-4.5" />
                    </span>
                    Coming from Kothanur? We&apos;re just around the corner.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Our clinic sits on Kothanur Dinne Main Road at BK Circle — patients from
                    Kothanur, Subba Raju Layout and JP Nagar 8th Phase reach us within minutes.
                  </p>
                  <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700">
                    <Accessibility className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>
                      <strong className="font-semibold text-slate-900">Elderly or post-surgery?</strong>{" "}
                      Ask about home physiotherapy visits — same hands-on care, zero travel.
                    </span>
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] sm:p-8">
                  <h2 className="text-xl font-black tracking-tight text-slate-950">Clinic details</h2>
                  <dl className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                      <div>
                        <dt className="font-bold text-slate-900">Address</dt>
                        <dd>{CLINIC_ADDRESS}</dd>
                        <a
                          href={CLINIC_MAPS_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                        >
                          Open in Google Maps →
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                      <div>
                        <dt className="font-bold text-slate-900">Hours</dt>
                        <dd>Monday – Saturday, 9:00 AM – 7:00 PM</dd>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <HomeIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                      <div>
                        <dt className="font-bold text-slate-900">Home visits</dt>
                        <dd>Available across Kothanur &amp; nearby layouts</dd>
                      </div>
                    </div>
                  </dl>
                  <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                    <iframe
                      title="PhysioFix clinic location map"
                      src={CLINIC_MAPS_EMBED}
                      width="100%"
                      height="240"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                FAQs
              </p>
              <h2 className="text-2xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
                Common <GradientText>questions</GradientText> from Kothanur patients
              </h2>
            </ScrollReveal>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-2xl border border-slate-100/80 bg-white p-1 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600">
                    {faq.question}
                    <span className="shrink-0 text-lg text-slate-400 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 pt-1 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center shadow-lg shadow-blue-500/25 sm:p-12">
                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Ready to start your recovery?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-blue-50">
                  Book a consultation with Dr.Nishmitha.R today — clinic visits or home
                  physiotherapy anywhere in Kothanur.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-bold text-blue-600 shadow-lg transition hover:bg-blue-50 active:scale-[0.97]"
                >
                  Book a Consultation
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
