"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Phone, Sparkles, ArrowRight } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import PageTransition from "../components/PageTransition";
import { useBookVisit } from "@/app/contexts/BookVisitContext";
import { safeJsonLd } from "@/lib/json-ld";

interface Benefit {
  title: string;
  description: string;
}

interface SpecializationLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  benefits: Benefit[];
  howItWorks: string[];
  conditions: string[];
  faqs: { question: string; answer: string }[];
  children?: ReactNode;
}

export default function SpecializationLayout({
  title,
  subtitle,
  description,
  heroImage,
  benefits,
  howItWorks,
  conditions,
  faqs,
  children,
}: SpecializationLayoutProps) {
  const prefersReducedMotion = useReducedMotion();
  const { openBookVisit } = useBookVisit();

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
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Link
                    href="/services"
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 backdrop-blur transition hover:bg-white/80 hover:text-blue-600"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Services
                  </Link>
                </motion.div>

                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
                >
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  {subtitle}
                </motion.div>

                <motion.h1
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5 text-4xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-5xl lg:text-[3.45rem]"
                >
                  <GradientText>{title}</GradientText>
                </motion.h1>

                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="mb-8 max-w-xl text-lg leading-8 text-slate-600"
                >
                  {description}
                </motion.p>

                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="flex flex-wrap gap-3"
                >
                  <button onClick={openBookVisit} className="btn-primary">
                    <Phone className="h-4 w-4" />
                    Book Consultation
                  </button>
                  <Link href="/contact" className="btn-ghost">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[260px] sm:h-[360px] lg:h-[460px]"
              >
                <div className="absolute inset-y-6 left-6 right-0 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50 sm:rounded-[2rem]" />
                <Image
                  src={heroImage}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="relative z-10 w-full rounded-2xl border border-white/70 object-cover shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:rounded-[2rem]"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Key Benefits
              </p>
              <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl">
                Why choose <GradientText>{title}</GradientText>?
              </h2>
            </ScrollReveal>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, i) => (
                <ScrollReveal key={benefit.title} delay={i * 0.08}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-blue-100/60 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:rounded-[1.5rem]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition-colors duration-500 group-hover:bg-blue-500 group-hover:text-white">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">{benefit.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{benefit.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        {howItWorks.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="mb-12 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                  The Process
                </p>
                <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl">
                  How it <GradientText>works</GradientText>
                </h2>
              </ScrollReveal>

              <div className="relative">
                <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-blue-200 via-blue-300 to-transparent md:block" />
                <div className="space-y-8 md:space-y-0">
                  {howItWorks.map((step, i) => (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className={`relative flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} md:gap-0`}>
                        <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                          <div className="inline-block rounded-2xl border border-slate-100/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:shadow-[0_16px_50px_rgba(15,23,42,0.12)]">
                            <span className="mb-2 inline-block text-sm font-bold text-blue-500">Step {i + 1}</span>
                            <p className="text-slate-700">{step}</p>
                          </div>
                        </div>
                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-500/25 md:mx-0">
                          {i + 1}
                        </div>
                        <div className="hidden flex-1 md:block" />
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Conditions Treated */}
        {conditions.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="mb-12 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                  Conditions We Treat
                </p>
                <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl">
                  What can this <GradientText>treat</GradientText>?
                </h2>
              </ScrollReveal>

              <div className="flex flex-wrap justify-center gap-3">
                {conditions.map((condition, i) => (
                  <motion.div
                    key={condition}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-full border border-blue-100/60 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                  >
                    {condition}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BreadcrumbList schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://physiofix.net" },
                { "@type": "ListItem", position: 2, name: "Services", item: "https://physiofix.net/services" },
                { "@type": "ListItem", position: 3, name: title, item: `https://physiofix.net/services` },
              ],
            }),
          }}
        />

{faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJsonLd({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        )}

        {/* Service structured data — server-rendered so crawlers see it in raw HTML */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "Service",
              name: title,
              description,
              serviceType: title,
              provider: { "@id": "https://physiofix.net/#organization" },
              areaServed: [
                { "@type": "City", name: "Bangalore" },
                { "@type": "Neighborhood", name: "JP Nagar" },
                { "@type": "Neighborhood", name: "Kothanur" },
              ],
              availableChannel: {
                "@type": "ServiceChannel",
                serviceUrl: "https://physiofix.net/contact",
              },
            }),
          }}
        />

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="mb-12 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                  Frequently Asked Questions
                </p>
                <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl">
                  Common <GradientText>questions</GradientText>
                </h2>
              </ScrollReveal>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <ScrollReveal key={i} delay={i * 0.08}>
                    <details className="group overflow-hidden rounded-2xl border border-slate-100/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)]">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600">
                        {faq.question}
                        <span className="shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <div className="px-6 pb-5 text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </div>
                    </details>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

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
                      Book a consultation for {title.toLowerCase()}.
                    </h2>
                    <p className="text-lg leading-8 text-slate-300">
                      Dr.Nishmitha.R provides personalised {title.toLowerCase()} sessions tailored to your condition and recovery goals.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/35"
                    >
                      Contact Dr.Nishmitha
                      <ArrowRight className="h-4 w-4" />
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