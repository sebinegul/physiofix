"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  X,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  CalendarDays,
  CalendarCheck,
  AlertCircle,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookVisit } from "@/app/contexts/BookVisitContext";
import { useToast } from "@/app/contexts/ToastContext";

/* ─── constants ─── */

const APPOINTMENT_TYPES = [
  "Initial Assessment",
  "Follow-up Session",
  "Sports Rehabilitation",
  "Post-Surgery Recovery",
  "General Consultation",
];

const TIME_SLOTS_MORNING = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];

const TIME_SLOTS_AFTERNOON = [
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

/* ─── types ─── */

type Mode = "register" | "login";
type Step = 1 | 2 | 3;

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  type?: string;
  date?: string;
  time?: string;
}

interface ConfirmData {
  name: string;
  email: string;
  generatedPassword: string;
  type: string;
  date: string;
  time: string;
}

/* ─── helper: today YYYY-MM-DD ─── */

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ─── stagger animation variants ─── */

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

/* ─── main component ─── */

export default function BookVisitModal() {
  const { isOpen, closeBookVisit } = useBookVisit();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { showToast } = useToast();

  // ---- state ----
  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // register form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // schedule form
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // custom dropdown states
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  // login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // shared
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<ConfirmData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const firstSelectRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /* ─── close custom dropdowns on outside click ─── */

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target as Node)) {
        setTimeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ─── detect login state on open ─── */

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, [isOpen]);

  /* ─── when opened, decide starting step ─── */

  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("token");
    if (token) {
      setMode("register");
      setStep(2);
    } else {
      setMode("register");
      setStep(1);
    }
    setDirection(1);
  }, [isOpen]);

  /* ─── focus management ─── */

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        } else {
          firstSelectRef.current?.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen, mode, step]);

  /* ─── escape key ─── */

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── focus trap ─── */

  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  /* ─── prevent body scroll ─── */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ─── reset on close ─── */

  const handleClose = useCallback(() => {
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setType("");
    setDate("");
    setTime("");
    setAdditionalNotes("");
    setLoginEmail("");
    setLoginPassword("");
    setShowPassword(false);
    setTypeDropdownOpen(false);
    setTimeDropdownOpen(false);
    setErrors({});
    setLoading(false);
    setError(null);
    setConfirmData(null);
    setCopied(false);
    setStep(1);
    setMode("register");
    setDirection(1);
    closeBookVisit();
  }, [closeBookVisit]);

  /* ─── animation duration ─── */

  const anim = prefersReducedMotion ? 0.01 : 0.35;

  /* ─── validation: step 1 (register) ─── */

  const validateStep1 = useCallback((): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    if (!email.trim()) {
      e.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Please enter a valid email address";
    }
    return e;
  }, [name, phone, email]);

  /* ─── validation: step 2 ─── */

  const validateStep2 = useCallback((): FormErrors => {
    const e: FormErrors = {};
    if (!type) e.type = "Please select an appointment type";
    if (!date) {
      e.date = "Please select a date";
    } else if (date <= todayStr()) {
      e.date = "Date must be in the future";
    }
    if (!time) e.time = "Please select a time slot";
    return e;
  }, [type, date, time]);

  /* ─── step 1 submit: register ─── */

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validateStep1();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/book-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        showToast("Registration failed. Please try again.", "error");
        return;
      }

      const generatedPassword: string = data.data.user.generatedPassword;

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: generatedPassword }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setIsLoggedIn(false);
        setConfirmData({
          name: name.trim(),
          email: email.trim(),
          generatedPassword,
          type: "",
          date: "",
          time: "",
        });
        setDirection(1);
        setStep(3);
        return;
      }

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));
      document.cookie = `auth-token=${encodeURIComponent(loginData.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("auth-changed"));
      showToast("Account created! Check your email for credentials.", "success");

      setConfirmData({
        name: name.trim(),
        email: email.trim(),
        generatedPassword,
        type: "",
        date: "",
        time: "",
      });

      setDirection(1);
      setStep(2);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── step 2 submit: book appointment ─── */

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validateStep2();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to book an appointment.");
        return;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          time,
          type,
          notes: additionalNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (confirmData) {
        setConfirmData((prev) =>
          prev
            ? { ...prev, type, date, time }
            : {
                name: "Patient",
                email: loginEmail || email,
                generatedPassword: "",
                type,
                date,
                time,
              }
        );
      } else {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : {};
        setConfirmData({
          name: user.name || "Patient",
          email: user.email || loginEmail,
          generatedPassword: "",
          type,
          date,
          time,
        });
      }

      setDirection(1);
      setStep(3);
      showToast("Appointment booked successfully!", "success");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── login submit ─── */

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const eMap: FormErrors = {};
    if (!loginEmail.trim()) {
      eMap.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      eMap.email = "Please enter a valid email address";
    }
    if (!loginPassword) eMap.password = "Password is required";
    if (Object.keys(eMap).length > 0) {
      setErrors(eMap);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        showToast("Invalid email or password.", "error");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `auth-token=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("auth-changed"));
      showToast("Welcome back! You are now signed in.", "success");

      setConfirmData({
        name: data.user.name || "Patient",
        email: data.user.email || loginEmail.trim(),
        generatedPassword: "",
        type: "",
        date: "",
        time: "",
      });

      setDirection(1);
      setStep(2);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── copy password ─── */

  const handleCopyPassword = () => {
    if (confirmData?.generatedPassword) {
      navigator.clipboard.writeText(confirmData.generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ─── backdrop click ─── */

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  /* ─── navigation helpers ─── */

  const goForward = (to: Step) => {
    setDirection(1);
    setStep(to);
  };

  const goBack = () => {
    if (mode === "register" && step === 2) {
      setDirection(-1);
      setStep(1);
    } else if (mode === "login" && step === 2) {
      setDirection(-1);
      setMode("register");
      setStep(1);
    } else {
      handleClose();
    }
  };

  /* ─── determine visible steps for indicator ─── */

  const totalSteps = 3;
  const effectiveStep = mode === "login" ? step + 1 : step;
  const showIndicator = !confirmData || step !== 3;

  /* ─── slide variants ─── */

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.98 }),
  };

  /* ─── Custom Dropdown for Appointment Type ─── */

  const TypeDropdown = () => (
    <div ref={typeDropdownRef} className="relative">
      <button
        ref={firstSelectRef}
        type="button"
        onClick={() => {
          setTypeDropdownOpen(!typeDropdownOpen);
          if (errors.type) setErrors((p) => ({ ...p, type: undefined }));
        }}
        className={`flex w-full items-center justify-between rounded-2xl glass-input px-4 py-3.5 text-[15px] font-normal text-left outline-none ${
          errors.type ? "glass-input-error" : ""
        } ${type ? "text-gray-900" : "text-gray-400"}`}
      >
        <span>{type || "Select appointment type"}</span>
        <ChevronRight
          className={`h-4 w-4 text-primary-500 transition-transform duration-300 ${
            typeDropdownOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {typeDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-xl shadow-primary-500/5"
          >
            <div className="py-1.5">
              {APPOINTMENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setTypeDropdownOpen(false);
                    if (errors.type) setErrors((p) => ({ ...p, type: undefined }));
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[15px] transition-all duration-200 ${
                    type === t
                      ? "bg-primary-50 font-medium text-primary-600"
                      : "text-gray-700 hover:bg-primary-50/50 hover:text-primary-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {errors.type && (
        <p className="mt-1.5 text-xs text-red-500">{errors.type}</p>
      )}
    </div>
  );

  /* ─── Custom Dropdown for Time Slot ─── */

  const TimeDropdown = () => (
    <div ref={timeDropdownRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setTimeDropdownOpen(!timeDropdownOpen);
          if (errors.time) setErrors((p) => ({ ...p, time: undefined }));
        }}
        className={`flex w-full items-center justify-between rounded-2xl glass-input px-4 py-3.5 text-[15px] font-normal text-left outline-none ${
          errors.time ? "glass-input-error" : ""
        } ${time ? "text-gray-900" : "text-gray-400"}`}
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-500" />
          <span>{time || "Select a time slot"}</span>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-primary-500 transition-transform duration-300 ${
            timeDropdownOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {timeDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-primary-100/60 bg-white shadow-xl shadow-primary-500/5 modal-scroll"
          >
            <div className="p-1.5">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-500/70">
                Morning
              </p>
              {TIME_SLOTS_MORNING.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setTime(slot);
                    setTimeDropdownOpen(false);
                    if (errors.time) setErrors((p) => ({ ...p, time: undefined }));
                  }}
                  className={`w-full rounded-xl px-4 py-2 text-left text-[14px] transition-all duration-200 ${
                    time === slot
                      ? "bg-primary-50 font-medium text-primary-600"
                      : "text-gray-700 hover:bg-primary-50/50 hover:text-primary-600"
                  }`}
                >
                  {slot}
                </button>
              ))}
              <p className="mt-1 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-500/70">
                Afternoon
              </p>
              {TIME_SLOTS_AFTERNOON.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setTime(slot);
                    setTimeDropdownOpen(false);
                    if (errors.time) setErrors((p) => ({ ...p, time: undefined }));
                  }}
                  className={`w-full rounded-xl px-4 py-2 text-left text-[14px] transition-all duration-200 ${
                    time === slot
                      ? "bg-primary-50 font-medium text-primary-600"
                      : "text-gray-700 hover:bg-primary-50/50 hover:text-primary-600"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {errors.time && (
        <p className="mt-1.5 text-xs text-red-500">{errors.time}</p>
      )}
    </div>
  );

  /* ─── render ─── */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: anim }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-950/50 via-slate-900/40 to-indigo-950/40 p-4 backdrop-blur-md"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Book a visit"
        >
          <motion.div
            ref={modalRef}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.94, y: 24 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 24 }
            }
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex w-full max-w-[900px] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-lg shadow-blue-100/30 backdrop-blur-xl md:h-[560px] md:flex-row"
          >
            {/* ─── Left Panel (decorative — animated gradient with glass orbs) ─── */}
            <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 md:flex md:flex-col md:items-center md:justify-center">
              {/* Animated gradient orbs */}
              <div className="absolute -left-20 -top-20 h-72 w-72 animate-morph rounded-full bg-blue-300/20 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 h-64 w-64 animate-morph-reverse rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="absolute left-1/2 top-1/3 h-48 w-48 animate-float rounded-full bg-blue-200/10 blur-2xl" />
              <div className="absolute bottom-1/4 left-1/4 h-32 w-32 animate-float-delayed rounded-full bg-indigo-300/10 blur-2xl" />

              {/* Rotating ring decoration */}
              <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow rounded-full border border-white/5" />
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow rounded-full border border-white/5" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center px-8 text-center">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                  Welcome to
                </p>

                {/* PhysioFix Logo */}
                <div className="mb-5 flex items-center justify-center">
                  <Image
                    src="/physiofix.png"
                    alt="PhysioFix"
                    width={220}
                    height={50}
                    className="h-auto w-48 object-contain brightness-0 invert opacity-90"
                    priority
                  />
                </div>

                <div className="mb-5 h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <p className="mb-2 text-sm leading-relaxed text-white/60">
                  Expert physiotherapy care for your recovery journey
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary-300" />
                  <span className="text-xs text-white/70">Your recovery is our priority</span>
                </div>
              </div>
            </div>

            {/* Mobile header */}
            <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 md:hidden">
              <div className="absolute -left-10 -top-10 h-40 w-40 animate-morph rounded-full bg-blue-300/20 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 h-32 w-32 animate-morph-reverse rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="relative z-10">
                <Image
                  src="/physiofix.png"
                  alt="PhysioFix"
                  width={180}
                  height={42}
                  className="h-auto w-36 object-contain brightness-0 invert opacity-90"
                  priority
                />
              </div>
            </div>

            {/* ─── Right Panel (form) ─── */}
            <div className="relative flex w-full flex-col bg-white/80 backdrop-blur-xl md:w-[55%]">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-all duration-300 hover:bg-blue-50 hover:text-blue-500"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Mobile-only logo at top of form panel */}
              <div className="flex items-center justify-center pt-5 md:hidden">
                <Image
                  src="/physiofix.png"
                  alt="PhysioFix"
                  width={140}
                  height={32}
                  className="h-auto w-28 object-contain"
                  priority
                />
              </div>

              {/* Header area */}
              {step !== 3 && (
                <div className="px-8 pt-6 pb-2 md:px-8">
                  <motion.h2
                    key={`title-${step}-${mode}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="font-heading text-[1.65rem] font-bold text-gray-900"
                  >
                    {mode === "login"
                      ? "Welcome Back"
                      : step === 1
                        ? "Book a Visit"
                        : "Schedule Your Visit"}
                  </motion.h2>
                  <motion.p
                    key={`subtitle-${step}-${mode}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-1 text-[14px] text-gray-500"
                  >
                    {mode === "login"
                      ? "Sign in to your account"
                      : step === 1
                        ? "Tell us about yourself"
                        : "Pick a time that works for you"}
                  </motion.p>

                  {/* Step indicator with progress bar */}
                  {showIndicator && (
                    <div className="mt-4 flex items-center gap-3">
                      {[1, 2, 3].map((s) => {
                        const circleCompleted = effectiveStep > s;
                        const circleActive = effectiveStep === s;
                        return (
                          <div key={s} className="flex items-center gap-1.5">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-400 ${
                                circleCompleted
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25"
                                  : circleActive
                                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/25"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {circleCompleted ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                s
                              )}
                            </div>
                            {s < 3 && (
                              <div
                                className={`h-0.5 w-8 rounded-full transition-all duration-500 ${
                                  effectiveStep > s
                                    ? "bg-gradient-to-r from-blue-500 to-blue-400"
                                    : "bg-slate-100"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ─── Scrollable content area ─── */}
              <div className="flex-1 overflow-y-auto px-8 py-5 md:px-8 md:py-5 modal-scroll">
                <AnimatePresence mode="wait" custom={direction}>
                  {/* ─── STEP 1: Register / Login ─── */}
                  {step === 1 && mode === "register" && (
                    <motion.form
                      key="step1-register"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: anim, ease: [0.22, 1, 0.36, 1] }}
                      onSubmit={handleStep1Submit}
                    >
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-3.5"
                      >
                        {/* Name */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-name"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <User className="h-3.5 w-3.5 text-blue-500" />
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={firstInputRef}
                            id="bv-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                            }}
                            autoComplete="name"
                            className={`w-full rounded-2xl glass-input px-4 py-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400 ${
                              errors.name ? "glass-input-error" : ""
                            }`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                          )}
                        </motion.div>

                        {/* Phone */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-phone"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <Phone className="h-3.5 w-3.5 text-blue-500" />
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="bv-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                            }}
                            autoComplete="tel"
                            className={`w-full rounded-2xl glass-input px-4 py-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400 ${
                              errors.phone ? "glass-input-error" : ""
                            }`}
                            placeholder="+91 98765 43210"
                          />
                          {errors.phone && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
                          )}
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-email"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <Mail className="h-3.5 w-3.5 text-primary-500" />
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="bv-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                            }}
                            autoComplete="email"
                            className={`w-full rounded-2xl glass-input px-4 py-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400 ${
                              errors.email ? "glass-input-error" : ""
                            }`}
                            placeholder="you@example.com"
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                          )}
                        </motion.div>

                        {/* Pain description */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-notes"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <FileText className="h-3.5 w-3.5 text-primary-500" />
                            Pain / injury description
                          </label>
                          <p className="mb-1 text-[11px] text-gray-400">Optional</p>
                          <textarea
                            id="bv-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl glass-input px-4 py-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
                            placeholder="e.g. I've been having lower back pain for 2 weeks..."
                          />
                        </motion.div>

                        {/* Error */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 rounded-2xl border border-red-100 bg-red-50/80 p-3.5 backdrop-blur-sm"
                          >
                            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                            <p className="text-sm text-red-600">{error}</p>
                          </motion.div>
                        )}

                        {/* Already have an account? */}
                        <p className="text-center text-[13px] text-gray-500">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setErrors({});
                              setError(null);
                              setMode("login");
                            }}
                            className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                          >
                            Login
                          </button>
                        </p>

                        {/* Next button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-premium w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              Continue
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-[11px] text-gray-400">
                          Your account will be created with an auto-generated password.
                        </p>
                      </motion.div>
                    </motion.form>
                  )}

                  {/* ─── Login view ─── */}
                  {step === 1 && mode === "login" && (
                    <motion.form
                      key="step1-login"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: anim, ease: [0.22, 1, 0.36, 1] }}
                      onSubmit={handleLoginSubmit}
                    >
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-3.5"
                      >
                        {/* Email */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-login-email"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <Mail className="h-3.5 w-3.5 text-primary-500" />
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={firstInputRef}
                            id="bv-login-email"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => {
                              setLoginEmail(e.target.value);
                              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                            }}
                            autoComplete="email"
                            className={`w-full rounded-2xl glass-input px-4 py-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400 ${
                              errors.email ? "glass-input-error" : ""
                            }`}
                            placeholder="you@example.com"
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                          )}
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-login-password"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <svg className="h-3.5 w-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="bv-login-password"
                              type={showPassword ? "text" : "password"}
                              value={loginPassword}
                              onChange={(e) => {
                                setLoginPassword(e.target.value);
                                if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                              }}
                              autoComplete="current-password"
                              className={`w-full rounded-2xl glass-input px-4 py-3 pr-11 text-[15px] text-gray-900 outline-none placeholder:text-gray-400 ${
                                errors.password ? "glass-input-error" : ""
                              }`}
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-primary-500"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                          )}
                        </motion.div>

                        {/* Error */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 rounded-2xl border border-red-100 bg-red-50/80 p-3.5 backdrop-blur-sm"
                          >
                            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                            <p className="text-sm text-red-600">{error}</p>
                          </motion.div>
                        )}

                        {/* Back to registration */}
                        <p className="text-center text-[13px] text-gray-500">
                          Don&apos;t have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setErrors({});
                              setError(null);
                              setMode("register");
                            }}
                            className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                          >
                            Register
                          </button>
                        </p>

                        {/* Sign In button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-premium w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </motion.div>
                    </motion.form>
                  )}

                  {/* ─── STEP 2: Schedule ─── */}
                  {step === 2 && (
                    <motion.form
                      key="step2"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: anim, ease: [0.22, 1, 0.36, 1] }}
                      onSubmit={handleStep2Submit}
                    >
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-3.5"
                      >
                        {/* Appointment Type — custom dropdown */}
                        <motion.div variants={staggerItem}>
                          <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600">
                            <CalendarCheck className="h-3.5 w-3.5 text-primary-500" />
                            Appointment Type <span className="text-red-500">*</span>
                          </label>
                          <TypeDropdown />
                        </motion.div>

                        {/* Date */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-date"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <CalendarDays className="h-3.5 w-3.5 text-primary-500" />
                            Preferred Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="bv-date"
                            type="date"
                            value={date}
                            onChange={(e) => {
                              setDate(e.target.value);
                              if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
                            }}
                            min={todayStr()}
                            className={`w-full rounded-2xl glass-input px-4 py-3 text-[15px] text-gray-900 outline-none ${
                              errors.date ? "glass-input-error" : ""
                            }`}
                          />
                          {errors.date && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>
                          )}
                        </motion.div>

                        {/* Time — custom dropdown */}
                        <motion.div variants={staggerItem}>
                          <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-primary-500" />
                            Preferred Time <span className="text-red-500">*</span>
                          </label>
                          <TimeDropdown />
                        </motion.div>

                        {/* Additional Notes */}
                        <motion.div variants={staggerItem}>
                          <label
                            htmlFor="bv-additional-notes"
                            className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-gray-600"
                          >
                            <FileText className="h-3.5 w-3.5 text-primary-500" />
                            Additional Notes
                          </label>
                          <p className="mb-1 text-[11px] text-gray-400">Optional</p>
                          <textarea
                            id="bv-additional-notes"
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl glass-input px-4 py-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
                            placeholder="Any specific concerns or requests..."
                          />
                        </motion.div>

                        {/* Error */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 rounded-2xl border border-red-100 bg-red-50/80 p-3.5 backdrop-blur-sm"
                          >
                            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                            <p className="text-sm text-red-600">{error}</p>
                          </motion.div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={goBack}
                            className="btn-ghost-premium"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium flex-1"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Booking...
                              </>
                            ) : (
                              <>
                                Book Appointment
                                <ChevronRight className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </motion.form>
                  )}

                  {/* ─── STEP 3: Confirmation ─── */}
                  {step === 3 && confirmData && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: anim, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col"
                      >
                        {/* Success header */}
                        <motion.div variants={staggerItem} className="flex flex-col items-center text-center">
                          <motion.div
                            initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                              delay: 0.15,
                            }}
                            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-light to-accent shadow-lg shadow-accent/25"
                          >
                            <CheckCircle2 className="h-8 w-8 text-white" />
                          </motion.div>
                          <h3 className="font-heading text-xl font-bold text-gray-900">
                            Your visit is booked!
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            We&apos;ll confirm your appointment shortly. You&apos;ll receive an email with the details.
                          </p>
                        </motion.div>

                        {/* Password card (new users only) */}
                        {confirmData.generatedPassword && (
                          <motion.div variants={staggerItem} className="mt-5 overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/80 to-primary-50/60 p-5 backdrop-blur-sm">
                            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary-600">
                              Your Login Credentials
                            </p>
                            <div className="space-y-3">
                              <div>
                                <p className="text-[11px] text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">
                                  {confirmData.email}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500">Password</p>
                                <div className="flex items-center gap-2">
                                  <code className="inline-block rounded-xl bg-white/80 px-3 py-1.5 font-mono text-sm font-bold text-primary-700 shadow-sm">
                                    {confirmData.generatedPassword}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={handleCopyPassword}
                                    className="flex h-8 items-center gap-1.5 rounded-xl border border-primary-100 bg-white/80 px-2.5 text-xs font-medium text-primary-600 transition-all duration-300 hover:bg-primary-50 hover:border-primary-200"
                                  >
                                    {copied ? (
                                      <>
                                        <Check className="h-3.5 w-3.5 text-accent" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Appointment summary */}
                        {confirmData.date && (
                          <motion.div variants={staggerItem} className="mt-4 overflow-hidden rounded-2xl border border-accent/10 bg-gradient-to-br from-emerald-50/80 to-accent/5 p-5 backdrop-blur-sm">
                            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-accent">
                              Appointment Details
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                                  <CalendarDays className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                  <p className="text-[11px] text-gray-500">Date</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatDate(confirmData.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                                  <Clock className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                  <p className="text-[11px] text-gray-500">Time</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {confirmData.time}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                                  <CalendarCheck className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                  <p className="text-[11px] text-gray-500">Type</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {confirmData.type}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Buttons */}
                        <motion.div variants={staggerItem} className="mt-5 space-y-2.5">
                          <button
                            onClick={() => {
                              handleClose();
                              router.push("/patient");
                            }}
                            className="btn-premium w-full"
                          >
                            Go to Dashboard
                          </button>
                          <button
                            onClick={handleClose}
                            className="btn-ghost-premium w-full"
                          >
                            Done
                          </button>
                        </motion.div>

                        {confirmData.generatedPassword && (
                          <motion.p variants={staggerItem} className="mt-4 text-center text-[11px] text-gray-400">
                            We&apos;ve also sent these details to your email address.
                          </motion.p>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
