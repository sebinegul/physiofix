"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Users, Sparkles, ShieldCheck, PlayCircle, ArrowRight, Phone, Stethoscope, FileText, X } from "lucide-react";
import GradientText from "../components/ui/GradientText";
import ScrollReveal from "../components/ui/ScrollReveal";

const quickLinks = ["Back Pain", "Sports Injury", "Knee Rehab", "Shoulder Pain", "Post-Surgery", "Neck Pain"];

interface ContentMap {
  hero_title?: string;
  hero_subtitle?: string;
  contact_phone?: string;
}

interface SearchResult {
  type: "service" | "blog";
  title: string;
  description: string;
  href: string;
}

const DEFAULT_CONTENT = {
  hero_title: "Best Physiotherapy in JP Nagar, Bangalore",
  hero_subtitle: "Your trusted partner in physiotherapy and rehabilitation, expert care for pain relief, mobility, sports recovery and confident movement in JP Nagar, Bangalore.",
  contact_phone: "+91 81519 12525",
} as const;

export default function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [content, setContent] = useState<ContentMap>(DEFAULT_CONTENT);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) setContent((prev) => ({ ...prev, ...d.data }));
      })
      .catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      setSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => {
          setResults(d?.data || []);
          setShowResults(true);
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close results on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuickLink = useCallback((tag: string) => {
    setQuery(tag);
    setShowResults(false);
    // Focus the search input after setting query
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setShowResults(true);
    }
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowResults(false);
    }
  }, []);

  const serviceCount = results.filter((r) => r.type === "service").length;
  const blogCount = results.filter((r) => r.type === "blog").length;

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
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
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            {/* Desktop: static pill. Mobile: marquee */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 hidden md:inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              Sports Rehabilitation • Ortho • Neuro • Home Care
            </motion.div>

            {/* Mobile marquee */}
            <div className="mb-6 md:hidden flex items-center gap-2 overflow-hidden rounded-full border border-blue-200/80 bg-white/70 py-2 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-blue-500 ml-3" />
              <div className="overflow-hidden flex-1 min-w-0">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-6">
                  <span className="text-sm font-medium text-slate-700">Sports Rehabilitation</span>
                  <span className="text-sm font-medium text-slate-700">Ortho</span>
                  <span className="text-sm font-medium text-slate-700">Neuro</span>
                  <span className="text-sm font-medium text-slate-700">Home Care</span>
                  <span className="text-sm font-medium text-slate-700">Sports Rehabilitation</span>
                  <span className="text-sm font-medium text-slate-700">Ortho</span>
                  <span className="text-sm font-medium text-slate-700">Neuro</span>
                  <span className="text-sm font-medium text-slate-700">Home Care</span>
                </div>
              </div>
            </div>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 max-w-2xl text-3xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-[3.45rem]"
            >
              <GradientText>{content.hero_title || DEFAULT_CONTENT.hero_title}</GradientText>
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
            >
              {content.hero_subtitle || DEFAULT_CONTENT.hero_subtitle}
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mb-8 flex flex-wrap gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <Users className="h-3.5 w-3.5 text-blue-600 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Personalised recovery plans</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">5+ years trusted care</span>
              </div>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              id="find"
              ref={searchRef}
              className="relative z-10 gradient-border rounded-2xl bg-white/70 p-2.5 shadow-[0_25px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:rounded-[1.5rem] sm:p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 sm:rounded-2xl sm:px-4">
                  <Search className="h-5 w-5 flex-shrink-0 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Condition, physio or treatment"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && results.length > 0 && setShowResults(true)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(""); setResults([]); setShowResults(false); }}
                      className="flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button onClick={handleSearch} className="btn-primary !rounded-2xl !px-3 !py-2 sm:!px-4">
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute left-0 right-0 sm:left-3 sm:right-3 top-full z-50 mt-2 max-h-[320px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.15)]">
                  {searching ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      Searching...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Search className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No results found for &ldquo;{query}&rdquo;</p>
                      <p className="mt-1 text-xs text-slate-400">Try searching for a treatment, condition or service</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {/* Services */}
                      {serviceCount > 0 && (
                        <div>
                          <div className="flex items-center gap-2 px-4 py-2">
                            <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Services & Treatments</p>
                          </div>
                          {results.filter((r) => r.type === "service").map((result) => (
                            <Link
                              key={result.href}
                              href={result.href}
                              onClick={() => { setShowResults(false); setQuery(""); }}
                              className="flex items-start gap-3 px-4 py-2.5 transition hover:bg-blue-50"
                            >
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Stethoscope className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                                <p className="truncate text-xs text-slate-500">{result.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Divider */}
                      {serviceCount > 0 && blogCount > 0 && (
                        <div className="mx-4 my-1 border-t border-slate-100" />
                      )}

                      {/* Blog Posts */}
                      {blogCount > 0 && (
                        <div>
                          <div className="flex items-center gap-2 px-4 py-2">
                            <FileText className="h-3.5 w-3.5 text-emerald-500" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Blog Posts</p>
                          </div>
                          {results.filter((r) => r.type === "blog").map((result) => (
                            <Link
                              key={result.href}
                              href={result.href}
                              onClick={() => { setShowResults(false); setQuery(""); }}
                              className="flex items-start gap-3 px-4 py-2.5 transition hover:bg-blue-50"
                            >
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                                <p className="truncate text-xs text-slate-500">{result.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Popular Searches */}
              <div className="mt-4 px-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-xs sm:tracking-[0.25em]">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {quickLinks.map((tag, i) => (
                    <motion.button
                      key={tag}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      onClick={() => handleQuickLink(tag)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition hover:shadow-sm sm:px-3 sm:py-1.5 sm:text-xs ${
                        query === tag
                          ? "border-blue-400 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-white/70 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                      }`}
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
              className="mt-5 flex flex-wrap gap-2 sm:gap-3"
            >
              <Link href="/about" className="btn-primary !px-4 !py-2.5 !text-xs sm:!px-5 sm:!py-3 sm:!text-sm">
                Know More <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`tel:${(content.contact_phone ?? DEFAULT_CONTENT.contact_phone).replace(/\s/g, "")}`} className="btn-ghost !px-4 !py-2.5 !text-xs sm:!px-5 sm:!py-3 sm:!text-sm">
                <Phone className="h-4 w-4" />
                {content.contact_phone ?? DEFAULT_CONTENT.contact_phone}
              </a>
            </motion.div>
          </div>

          <ScrollReveal direction="right" className="relative hidden lg:block">
            <div className="absolute inset-y-6 left-8 right-0 rounded-[2rem] bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50" />
            <div className="animate-float relative z-10 w-full rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80"
                  alt="Dr.Nishmitha.R - Physiotherapist"
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
                      <p className="text-sm font-semibold text-white">Dr.Nishmitha.R</p>
                      <p className="text-sm text-slate-300">MPT, Sports Science Physiotherapist</p>
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
