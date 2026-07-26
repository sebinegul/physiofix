"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Star, Quote, MapPin, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "../components/ui/ScrollReveal";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "JP Nagar",
    rating: 5,
    text: "I could barely sit at my desk for 20 minutes before the pain kicked in. After six sessions here, I am back to full work days. The exercise plan between visits made a real difference.",
    condition: "Chronic Back Pain",
    duration: "6 weeks",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Anitha Devi",
    location: "BTM Layout",
    rating: 5,
    text: "After my knee replacement I was scared to put weight on it. Dr.Nishmitha.R walked me through every milestone and adjusted the plan when things felt too hard. Three months later I am climbing stairs again.",
    condition: "Post-Knee Surgery",
    duration: "3 months",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Suresh Kumar",
    location: "HSR Layout",
    rating: 5,
    text: "Tore my ACL during a tournament and thought my season was over. The return-to-sport programme here was structured but realistic. I passed every fitness test before going back.",
    condition: "ACL Rehabilitation",
    duration: "5 months",
    img: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    name: "Priya Nair",
    location: "Koramangala",
    rating: 5,
    text: "My mother had a stroke two years ago and we had almost given up on improving her movement. The neurological rehab sessions have brought back movement in her left hand that we did not think was possible.",
    condition: "Post-Stroke Recovery",
    duration: "Ongoing",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Arjun Reddy",
    location: "Electronic City",
    rating: 5,
    text: "Woke up one morning and could not turn my neck. Tried everything for two weeks before coming here. Two sessions of manual therapy and I could move normally again. Wish I had come sooner.",
    condition: "Acute Neck Stiffness",
    duration: "2 weeks",
    img: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Meera Joshi",
    location: "JP Nagar",
    rating: 5,
    text: "The home visit service has been a lifeline for my father. He has trouble travelling but the therapist comes to our house with all the equipment. Consistent, patient, and genuinely caring.",
    condition: "Geriatric Home Care",
    duration: "4 months",
    img: "https://randomuser.me/api/portraits/women/28.jpg",
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)] sm:p-6">
      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Quote icon */}
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110">
        <Quote className="h-4 w-4" />
      </div>

      {/* Review text */}
      <p className="mb-4 flex-1 text-sm leading-7 text-slate-600">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Condition + Duration tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
          <BadgeCheck className="h-3 w-3" />
          {t.condition}
        </span>
        <span className="inline-flex rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
          {t.duration}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
        <Image src={t.img} alt={t.name} width={40} height={40} className="rounded-full border-2 border-white object-cover shadow-sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{t.name}</p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            {t.location}
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(t.rating)].map((_, si) => (
            <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);

  // Responsive items per page
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setItemsPerPage(1);
      else if (w < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const maxPage = totalPages - 1;

  const next = useCallback(() => {
    setPage((p) => (p >= maxPage ? 0 : p + 1));
  }, [maxPage]);

  const prev = useCallback(() => {
    setPage((p) => (p <= 0 ? maxPage : p - 1));
  }, [maxPage]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const startIdx = page * itemsPerPage;
  const visible = testimonials.slice(startIdx, startIdx + itemsPerPage);
  // If last page has fewer items, also show from the beginning to fill
  if (visible.length < itemsPerPage) {
    visible.push(...testimonials.slice(0, itemsPerPage - visible.length));
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-20" id="stories">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50" />
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-400/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-400/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Patient Stories</p>
          <h2 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-4xl">
            Recovery is personal. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Here is what it looks like.</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-8 text-slate-500">
            Every body responds differently. These are real outcomes from real people who walked in with pain and left with progress.
          </p>
        </ScrollReveal>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards grid */}
          <div ref={trackRef} className="grid gap-5" style={{ gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)` }}>
            {visible.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg sm:-left-5 sm:p-3 lg:-left-6"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg sm:-right-5 sm:p-3 lg:-right-6"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="flex h-11 w-11 items-center justify-center p-[13px]"
              aria-label={`Go to page ${i + 1}`}
            >
              <span className={`h-2 rounded-full transition-all duration-300 ${
                i === page
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
