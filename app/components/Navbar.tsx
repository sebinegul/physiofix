"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Menu, X, Sparkles, HeartPulse, MoveRight, Phone } from "lucide-react";
import { useBookVisit } from "@/app/contexts/BookVisitContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { openBookVisit } = useBookVisit();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBookVisit = () => {
    setOpen(false);
    openBookVisit();
  };

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <div
        className={`navbar-shell mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 transition-all duration-500 sm:px-6 ${
          scrolled ? "shadow-[0_24px_90px_rgba(2,6,23,0.45)]" : ""
        }`}
      >
        <Link href="/" className="relative z-10 flex items-center">
          <Image
            src="/physiofix.png"
            alt="PhysioFix Logo"
            width={160}
            height={48}
            className="h-12 w-auto max-w-[160px] object-contain"
          />
        </Link>

        <div className="relative z-10 hidden items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-200 lg:flex" style={{ maxWidth: '340px' }}>
          <span className="relative z-10 flex shrink-0 items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </span>
          <div className="overflow-hidden">
            <div className="animate-marquee whitespace-nowrap font-medium">
              <span className="mr-8">Rehabilitation | Ortho Rehabilitation | Neuro Rehabilitation | Home Care Physiotherapy Services</span>
              <span className="mr-8">Rehabilitation | Ortho Rehabilitation | Neuro Rehabilitation | Home Care Physiotherapy Services</span>
            </div>
          </div>
        </div>

        <nav className="relative z-10 hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="relative z-10 hidden items-center gap-3 md:flex">
          <a
            href="tel:+918****2525"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <Phone className="h-3.5 w-3.5" />
            Call now
          </a>
          <button
            onClick={handleBookVisit}
            className="btn-primary !px-4 !py-2 !text-sm"
          >
            <Sparkles className="h-4 w-4" />
            Book visit
          </button>
        </div>

        <button
          className="relative z-10 rounded-full border border-white/15 p-2 text-slate-200 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
              <HeartPulse className="h-4 w-4" />
              Expert care for pain, recovery & performance
            </div>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="mt-3 flex gap-3 p-1">
              <a href="tel:+918****2525" className="flex-1 rounded-xl border border-white/15 px-3 py-3 text-center text-sm font-semibold text-slate-200">
                Call now
              </a>
              <button
                onClick={handleBookVisit}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Book visit <MoveRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
