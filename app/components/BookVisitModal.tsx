"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookVisit } from "@/app/contexts/BookVisitContext";

/* ─── constants ─── */

const APPOINTMENT_TYPES = [
  "Initial Assessment",
  "Follow-up Session",
  "Sports Rehabilitation",
  "Post-Surgery Recovery",
  "General Consultation",
];

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
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

/* ─── main component ─── */

export default function BookVisitModal() {
  const { isOpen, closeBookVisit } = useBookVisit();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  // ---- state ----
  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = back

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
  const firstSelectRef = useRef<HTMLSelectElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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
      setMode("register"); // doesn't matter, step 2 doesn't show step 1
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
      }, 100);
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

  const anim = prefersReducedMotion ? 0.01 : 0.25;

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
      // 1) Register
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
        return;
      }

      const generatedPassword: string = data.data.user.generatedPassword;

      // 2) Auto-login to get JWT
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: generatedPassword }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        // Registration succeeded but auto-login failed — still advance,
        // but store the password so user can log in manually later
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
      setIsLoggedIn(true);

      // Store password for confirmation display
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

      // Merge appointment data into confirmation
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
        // Logged-in user who skipped step 1
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
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);

      // Pre-fill confirm data with user info
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
  const effectiveStep = mode === "login" ? step + 1 : step; // login skips visual step 1
  const showIndicator = !confirmData || step !== 3;

  /* ─── input class helper ─── */

  const inputClass = (hasError?: string | boolean) =>
    `w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
      hasError && hasError !== ""
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 focus:border-blue-400"
    }`;

  const selectClass = (hasError?: string | boolean) =>
    `w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
      hasError && hasError !== ""
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 focus:border-blue-500"
    }`;

  /* ─── slide variants ─── */

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  /* ─── render ─── */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: anim }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
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
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            transition={{ duration: anim, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/80 shadow-2xl shadow-blue-500/10 backdrop-blur-xl max-h-[90vh] modal-scroll"
          >
            {/* ─── Header (not on confirmation) ─── */}
            {step !== 3 && (
              <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-6 py-5 sm:px-8">
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                      {mode === "login" ? (
                        <Lock className="h-5 w-5 text-white" />
                      ) : step === 1 ? (
                        <CalendarDays className="h-5 w-5 text-white" />
                      ) : (
                        <CalendarCheck className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white sm:text-xl">
                        {mode === "login"
                          ? "Welcome Back"
                          : step === 1
                            ? "Book a Visit"
                            : "Schedule Your Visit"}
                      </h2>
                      <p className="text-sm text-white/80">
                        {mode === "login"
                          ? "Sign in to your account"
                          : step === 1
                            ? "Tell us about yourself"
                            : "Pick a time that works for you"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 backdrop-blur"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── Step indicator (not on confirmation) ─── */}
            {step !== 3 && (
              <div className="flex items-center justify-center gap-0 px-8 pt-5">
                {[1, 2, 3].map((s, i) => {
                  const visualStep =
                    mode === "login" ? s + 1 : s;
                  const isCompleted = step > s || (mode === "login" && step >= 2 && s <= 2);
                  const isActive =
                    (mode === "register" && step === s) ||
                    (mode === "login" && step === 2 && s === 2) ||
                    (mode === "login" && step === 1 && s === 1 && false); // login step = visual step 2

                  // Simplified: for register mode, step directly maps
                  // For login mode, step 2 maps to visual step 2
                  const effectiveCurrentStep = mode === "login" ? step + 1 : step;

                  const circleCompleted = effectiveCurrentStep > s;
                  const circleActive = effectiveCurrentStep === s;

                  return (
                    <div key={s} className="flex items-center">
                      {/* circle */}
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          circleCompleted
                            ? "bg-green-500 text-white"
                            : circleActive
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {circleCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          s
                        )}
                      </div>
                      {/* connecting line */}
                      {i < 2 && (
                        <div
                          className={`h-0.5 w-10 sm:w-14 ${
                            effectiveCurrentStep > s + 1
                              ? "bg-green-500"
                              : effectiveCurrentStep === s + 1
                                ? "bg-gradient-to-r from-green-500 to-gray-200"
                                : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── Content area with AnimatePresence for step transitions ─── */}
            <div className="relative overflow-hidden">
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
                    className="p-6 sm:p-8"
                  >
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="bv-name"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                            className={`${inputClass(errors.name)} pl-10`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="bv-phone"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            id="bv-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                            }}
                            autoComplete="tel"
                            className={`${inputClass(errors.phone)} pl-10`}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="bv-email"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            id="bv-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                            }}
                            autoComplete="email"
                            className={`${inputClass(errors.email)} pl-10`}
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Pain description */}
                      <div>
                        <label
                          htmlFor="bv-notes"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Pain / injury description
                        </label>
                        <p className="mb-1.5 text-xs text-gray-400">Optional</p>
                        <textarea
                          id="bv-notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                          placeholder="e.g. I've been having lower back pain for 2 weeks..."
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Already have an account? */}
                    <p className="mt-4 text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setError(null);
                          setMode("login");
                        }}
                        className="font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        Login
                      </button>
                    </p>

                    {/* Next button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-xs text-gray-400">
                      Your account will be created with an auto-generated password.
                    </p>
                  </motion.form>
                )}

                {/* ─── Login view (inside the same modal) ─── */}
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
                    className="p-6 sm:p-8"
                  >
                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <label
                          htmlFor="bv-login-email"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                            className={`${inputClass(errors.email)} pl-10`}
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label
                          htmlFor="bv-login-password"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            id="bv-login-password"
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                            }}
                            autoComplete="current-password"
                            className={`${inputClass(errors.password)} pl-10 pr-10`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
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
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Back to registration */}
                    <p className="mt-4 text-center text-sm text-gray-500">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setError(null);
                          setMode("register");
                        }}
                        className="font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        Register
                      </button>
                    </p>

                    {/* Sign In button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
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
                    className="p-6 sm:p-8"
                  >
                    <div className="space-y-4">
                      {/* Appointment Type */}
                      <div>
                        <label
                          htmlFor="bv-type"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Appointment Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            ref={firstSelectRef}
                            id="bv-type"
                            value={type}
                            onChange={(e) => {
                              setType(e.target.value);
                              if (errors.type) setErrors((p) => ({ ...p, type: undefined }));
                            }}
                            className={selectClass(errors.type)}
                          >
                            <option value="">Select appointment type</option>
                            {APPOINTMENT_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                        {errors.type && (
                          <p className="mt-1 text-xs text-red-500">{errors.type}</p>
                        )}
                      </div>

                      {/* Date */}
                      <div>
                        <label
                          htmlFor="bv-date"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
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
                          className={inputClass(errors.date)}
                        />
                        {errors.date && (
                          <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                        )}
                      </div>

                      {/* Time */}
                      <div>
                        <label
                          htmlFor="bv-time"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Preferred Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="bv-time"
                            value={time}
                            onChange={(e) => {
                              setTime(e.target.value);
                              if (errors.time) setErrors((p) => ({ ...p, time: undefined }));
                            }}
                            className={selectClass(errors.time)}
                          >
                            <option value="">Select a time slot</option>
                            <optgroup label="Morning">
                              {TIME_SLOTS.slice(0, 6).map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Afternoon">
                              {TIME_SLOTS.slice(6).map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                        {errors.time && (
                          <p className="mt-1 text-xs text-red-500">{errors.time}</p>
                        )}
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label
                          htmlFor="bv-additional-notes"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Additional Notes
                        </label>
                        <p className="mb-1.5 text-xs text-gray-400">Optional</p>
                        <textarea
                          id="bv-additional-notes"
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          rows={3}
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Any specific concerns or requests..."
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
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
                    className="p-6 sm:p-8"
                  >
                    {/* Close button for step 3 */}
                    <button
                      onClick={handleClose}
                      className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="mb-6 flex flex-col items-center text-center">
                      <motion.div
                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                      >
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Your visit is booked!
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        We&apos;ll confirm your appointment shortly. You&apos;ll receive an email with the details.
                      </p>
                    </div>

                    {/* Password card (new users only) */}
                    {confirmData.generatedPassword && (
                      <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                          Your Login Credentials
                        </p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">
                              {confirmData.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Password</p>
                            <div className="flex items-center gap-2">
                              <code className="inline-block rounded-lg bg-indigo-100 px-3 py-1.5 font-mono text-sm font-bold text-indigo-700">
                                {confirmData.generatedPassword}
                              </code>
                              <button
                                type="button"
                                onClick={handleCopyPassword}
                                className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                              >
                                {copied ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-green-500" />
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
                      </div>
                    )}

                    {/* Appointment summary */}
                    {confirmData.date && (
                      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                          Appointment Details
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CalendarDays className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(confirmData.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Time</p>
                              <p className="font-medium text-gray-900">
                                {confirmData.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <CalendarCheck className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500">Type</p>
                              <p className="font-medium text-gray-900">
                                {confirmData.type}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          handleClose();
                          router.push("/patient");
                        }}
                        className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={handleClose}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        Done
                      </button>
                    </div>

                    {confirmData.generatedPassword && (
                      <p className="mt-4 text-center text-xs text-gray-400">
                        We&apos;ve also sent these details to your email address.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
