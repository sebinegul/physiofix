"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-teal-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-12 text-center shadow-[0_25px_80px_rgba(2,6,23,0.3)] sm:px-12 md:py-16">
            <motion.div
              className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-teal-400/25 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-10 right-0 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 mx-auto max-w-2xl">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Get recovery tips and appointment updates from Dr. Nishmitha.
              </h2>
              <p className="mb-8 text-base leading-7 text-slate-300">
                Join our updates for practical movement advice, rehab insights and clinic news tailored to recovery, sports and everyday mobility.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur"
                  >
                    <CheckCircle2 className="h-4 w-4 text-teal-300" />
                    You are subscribed. We will be in touch soon.
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50"
                    />
                    <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg">
                      Subscribe <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
