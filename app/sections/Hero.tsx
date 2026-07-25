"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Search, MapPin, Users, Sparkles, ShieldCheck, PlayCircle, ArrowRight, Phone } from "lucide-react";
import GradientText from "../components/ui/GradientText";
import ScrollReveal from "../components/ui/ScrollReveal";

const quickLinks = ["Back Pain", "Sports Injury", "Knee Rehab", "Shoulder Pain", "Post-Surgery", "Neck Pain"];

export default function Hero() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_35%)]" />

      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl"
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
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
            >
              <Sparkles className="h-4 w-4 text-teal-500" />
              Sports Rehabilitation • Ortho • Neuro • Home Care
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 max-w-2xl text-4xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-5xl lg:text-[3.45rem]"
            >
              Best Physiotherapy in JP Nagar,{" "}
              <GradientText>Bangalore</GradientText>
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-8 max-w-xl text-lg leading-8 text-slate-600"
            >
              Your trusted partner in physiotherapy and rehabilitation — expert care for pain relief, mobility, sports recovery and confident movement in JP Nagar, Bangalore.
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mb-10 flex flex-wrap gap-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <Users className="h-4 w-4 text-teal-600" />
                Personalised recovery plans
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                5+ years trusted care
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              id="find"
              className="gradient-border rounded-[1.5rem] bg-white/70 p-3 shadow-[0_25px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                  <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Condition, physio or treatment"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder="JP Nagar, Bangalore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button className="btn-primary !rounded-2xl">
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>

              <div className="mt-4 px-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {quickLinks.map((tag, i) => (
                    <motion.button
                      key={tag}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-600 hover:shadow-sm"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link href="/about" className="btn-primary">
                Know More <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+918151912525" className="btn-ghost">
                <Phone className="h-4 w-4" />
                +91 81519 12525
              </a>
            </motion.div>
          </div>

          <ScrollReveal direction="right" className="relative hidden lg:block">
            <div className="absolute inset-y-6 left-8 right-0 rounded-[2rem] bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-50" />
            <div className="animate-float relative z-10 w-full rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80"
                  alt="Dr. Nishmitha R - Physiotherapist"
                  className="h-[500px] w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur">
                  <PlayCircle className="h-4 w-4" />
                  Expert physiotherapy care
                </div>
                <div className="animate-float-delayed absolute right-4 top-4 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Next slot</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">Today · 3:00 PM</p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/65 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Dr. Nishmitha R</p>
                      <p className="text-sm text-slate-300">MPT — Sports Science Physiotherapist</p>
                    </div>
                    <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300">
                      Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
