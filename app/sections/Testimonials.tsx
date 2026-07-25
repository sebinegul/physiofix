"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Bangalore",
    rating: 5,
    text: "Excellent physiotherapy support! My back pain reduced within two weeks. Dr. Nishmitha was professional, attentive and built a plan that actually worked for my lifestyle.",
    condition: "Chronic Back Pain",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Anitha Devi",
    location: "Bangalore",
    rating: 5,
    text: "Very professional and friendly. The treatment helped me recover faster after my knee surgery. I felt supported and informed at every step of the process.",
    condition: "Post-Knee Surgery",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Suresh Kumar",
    location: "Bangalore",
    rating: 5,
    text: "Best physiotherapist in the area. Highly recommend for sports injury. The return-to-sport plan was clear, realistic and got me back on the field safely.",
    condition: "Sports Shoulder Injury",
    img: "https://randomuser.me/api/portraits/men/56.jpg",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const current = testimonials[idx];
  const prefersReducedMotion = useReducedMotion();

  const slideVariants = {
    enter: (direction: number) => ({
      x: prefersReducedMotion ? 0 : direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: prefersReducedMotion ? 0 : direction < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIdx((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20" id="stories">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal direction="left" className="hidden lg:block">
            <div className="section-shell overflow-hidden p-3">
              <div className="relative h-[430px] overflow-hidden rounded-[1.5rem]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={current.img}
                    src={current.img}
                    alt={current.name}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl">
                  <Quote className="mb-2 h-6 w-6 text-blue-300" />
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={current.text}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="text-sm leading-7 text-slate-100"
                    >
                      &ldquo;{current.text}&rdquo;
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="rounded-[2rem] border border-blue-100/60 bg-white/70 p-7 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Patient&apos;s Speak</p>
              <h2 className="mb-3 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900">Recovery journeys shaped by clarity and care.</h2>
              <p className="mb-8 text-lg leading-8 text-slate-600">Real stories from patients who found relief, strength and confidence through personalised physiotherapy care.</p>

              <div className="rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-br from-blue-50/40 via-white to-blue-50/30 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <img src={current.img} alt={current.name} className="h-14 w-14 rounded-full border-2 border-white object-cover shadow" />
                      <div>
                        <p className="font-semibold text-slate-900">{current.name}</p>
                        <p className="text-sm text-slate-500">{current.location}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(current.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <span className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                      {current.condition}
                    </span>
                    <p className="text-base leading-7 text-slate-600">{current.text}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => paginate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-400 hover:text-blue-600" aria-label="Previous testimonial">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex gap-1.5">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setDirection(i > idx ? 1 : -1); setIdx(i); }}
                        className={`rounded-full transition-all duration-300 ${i === idx ? "h-2.5 w-6 bg-gradient-to-r from-blue-500 to-blue-600" : "h-2.5 w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button onClick={() => paginate(1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-400 hover:text-blue-600" aria-label="Next testimonial">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
