"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { setAuthCookie } from "@/lib/auth-client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  User,
  Phone,
  Mail,
  FileText,
  CalendarDays,
  Clock,
  CheckCircle2,
  Check,
  Copy,
  ChevronLeft,
  HeartPulse,
  Activity,
  Stethoscope,
} from "lucide-react";
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

type View = "login" | "register" | "schedule" | "success";

/* ─── helpers ─── */

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/* ─── stagger animation variants ─── */

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};
const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

/* ─── main component ─── */

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  // ---- view state ----
  const [view, setView] = useState<View>("login");
  const [direction, setDirection] = useState(1);

  // ---- login form ----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ---- register form (Step 1) ----
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regNotes, setRegNotes] = useState("");

  // ---- schedule form (Step 2) ----
  const [schedType, setSchedType] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedNotes, setSchedNotes] = useState("");

  // ---- shared ----
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ---- success data ----
  const [successData, setSuccessData] = useState<{
    name: string;
    email: string;
    generatedPassword: string;
    type: string;
    date: string;
    time: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ─── view navigation ─── */

  const goTo = (v: View) => {
    setDirection(1);
    setView(v);
    setError("");
  };

  const goBack = () => {
    setDirection(-1);
    setView("login");
    setError("");
  };

  /* ─── login submit ─── */

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        showToast("Invalid email or password.", "error");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      setAuthCookie(data.token);
      window.dispatchEvent(new Event("auth-changed"));
      showToast("Welcome back!", "success");
      if (data.user.role === "admin") router.push("/dashboard");
      else router.push("/patient");
      // keep loading=true so the button stays as a spinner during redirect
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  /* ─── register submit (Step 1 → book-consultation) ─── */

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!regName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!regPhone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!regEmail.trim()) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/book-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          email: regEmail.trim(),
          notes: regNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        showToast("Registration failed. Please try again.", "error");
        return;
      }

      const generatedPassword: string = data.data.user.generatedPassword;

      // Auto-login
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail.trim(),
          password: generatedPassword,
        }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem("token", loginData.token);
        setAuthCookie(loginData.token);
        window.dispatchEvent(new Event("auth-changed"));
      }

      showToast("Account created! You can now schedule your visit.", "success");

      setSuccessData({
        name: regName.trim(),
        email: regEmail.trim(),
        generatedPassword,
        type: "",
        date: "",
        time: "",
      });

      goTo("schedule");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── schedule submit (Step 2 → appointments) ─── */

  const handleSchedule = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!schedType) {
      setError("Please select an appointment type");
      return;
    }
    if (!schedDate) {
      setError("Please select a date");
      return;
    }
    if (schedDate <= todayStr()) {
      setError("Date must be in the future");
      return;
    }
    if (!schedTime) {
      setError("Please select a time slot");
      return;
    }

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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: schedDate,
          time: schedTime,
          type: schedType,
          notes: schedNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccessData((prev) =>
        prev
          ? { ...prev, type: schedType, date: schedDate, time: schedTime }
          : null
      );

      showToast("Appointment booked successfully!", "success");
      goTo("success");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── render helpers ─── */

  const renderError = () => (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          className="flex items-center gap-2.5 rounded-2xl border border-red-100 bg-red-50/80 p-3.5 backdrop-blur-sm"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10";

  const labelClass =
    "mb-1.5 block text-[13px] font-medium text-slate-600";

  /* ─── right panel content based on view ─── */

  const renderFormContent = () => {
    switch (view) {
      /* ─── LOGIN ─── */
      case "login":
        return (
          <motion.div
            key="login"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Welcome Back
            </h1>
            <p className="mt-2 text-[14px] text-slate-500">
              Sign in to access your PhysioFix account
            </p>

            {/* Step indicator */}
            <div className="mt-6 flex items-center gap-2">
              <div className="h-1.5 w-8 rounded-full bg-blue-600" />
              <div className="h-1.5 w-8 rounded-full bg-slate-200" />
              <div className="h-1.5 w-8 rounded-full bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="mt-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {renderError()}

                {/* Email */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="email" className={labelClass}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="password" className={labelClass}>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Remember me + Forgot */}
                <motion.div
                  variants={staggerItem}
                  className="flex items-center justify-between pt-1"
                >
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/30"
                    />
                    Remember me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Forgot Password?
                  </Link>
                </motion.div>

                {/* Sign In button */}
                <motion.div variants={staggerItem} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>Sign In</>
                      )}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </form>

            {/* Footer toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-6 border-t border-slate-100 pt-5"
            >
              <p className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => goTo("register")}
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Book a consultation
                </button>
              </p>
            </motion.div>
          </motion.div>
        );

      /* ─── REGISTER (Step 1) ─── */
      case "register":
        return (
          <motion.div
            key="register"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Let&apos;s get you started
            </h1>
            <p className="mt-2 text-[14px] text-slate-500">
              Tell us about yourself and your condition
            </p>

            {/* Step indicator */}
            <div className="mt-6 flex items-center gap-2">
              <div className="h-1.5 w-8 rounded-full bg-blue-600" />
              <div className="h-1.5 w-8 rounded-full bg-slate-200" />
              <div className="h-1.5 w-8 rounded-full bg-slate-200" />
            </div>

            <form onSubmit={handleRegister} className="mt-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {renderError()}

                {/* Name */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="reg-name" className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="reg-phone" className={labelClass}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="reg-email" className={labelClass}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </motion.div>

                {/* Pain description */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="reg-notes" className={labelClass}>
                    Pain / Injury Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <textarea
                      id="reg-notes"
                      rows={3}
                      value={regNotes}
                      onChange={(e) => setRegNotes(e.target.value)}
                      placeholder="Describe your pain or injury..."
                      className={`${inputClass} resize-none pl-10`}
                    />
                  </div>
                </motion.div>

                {/* Next button */}
                <motion.div variants={staggerItem} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>Next → Schedule Visit</>
                      )}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </form>

            {/* Footer toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-6 border-t border-slate-100 pt-5"
            >
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => goTo("login")}
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Sign in
                </button>
              </p>
            </motion.div>
          </motion.div>
        );

      /* ─── SCHEDULE (Step 2) ─── */
      case "schedule":
        return (
          <motion.div
            key="schedule"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-slate-200 p-2 transition-colors hover:bg-slate-50"
                aria-label="Back to registration"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>
              <div>
                <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  Schedule Your Visit
                </h1>
                <p className="mt-1 text-[14px] text-slate-500">
                  Choose your preferred appointment time
                </p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="mt-6 flex items-center gap-2">
              <div className="h-1.5 w-8 rounded-full bg-green-500" />
              <div className="h-1.5 w-8 rounded-full bg-blue-600" />
              <div className="h-1.5 w-8 rounded-full bg-slate-200" />
            </div>

            <form onSubmit={handleSchedule} className="mt-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {renderError()}

                {/* Appointment Type */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="sched-type" className={labelClass}>
                    Appointment Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      id="sched-type"
                      required
                      value={schedType}
                      onChange={(e) => setSchedType(e.target.value)}
                      className={`${inputClass} appearance-none pl-10`}
                    >
                      <option value="">Select type...</option>
                      {APPOINTMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Preferred Date */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="sched-date" className={labelClass}>
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sched-date"
                    type="date"
                    required
                    min={new Date(Date.now() + 86400000)
                      .toISOString()
                      .split("T")[0]}
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className={inputClass}
                  />
                </motion.div>

                {/* Preferred Time */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="sched-time" className={labelClass}>
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      id="sched-time"
                      required
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      className={`${inputClass} appearance-none pl-10`}
                    >
                      <option value="">Select time...</option>
                      <optgroup label="Morning">
                        {TIME_SLOTS_MORNING.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Afternoon">
                        {TIME_SLOTS_AFTERNOON.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </motion.div>

                {/* Additional Notes */}
                <motion.div variants={staggerItem}>
                  <label htmlFor="sched-notes" className={labelClass}>
                    Additional Notes
                  </label>
                  <textarea
                    id="sched-notes"
                    rows={3}
                    value={schedNotes}
                    onChange={(e) => setSchedNotes(e.target.value)}
                    placeholder="Any special requests or notes..."
                    className={`${inputClass} resize-none`}
                  />
                </motion.div>

                {/* Book Appointment button */}
                <motion.div variants={staggerItem} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        <>Book Appointment</>
                      )}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        );

      /* ─── SUCCESS ─── */
      case "success":
        return (
          <motion.div
            key="success"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
            >
              <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
            </motion.div>

            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              You&apos;re All Set!
            </h1>
            <p className="mt-2 text-[14px] text-slate-500">
              Your appointment has been booked successfully
            </p>

            {successData?.generatedPassword && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 w-full rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
              >
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Your login credentials:
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Email:</span>{" "}
                  {successData?.email}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Password:</span>{" "}
                    {successData?.generatedPassword}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        successData?.generatedPassword || ""
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
                    title="Copy password"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  You&apos;ve been auto-logged in. A welcome email with your
                  credentials has also been sent.
                </p>
              </motion.div>
            )}

            {successData?.type && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 w-full rounded-2xl border border-green-100 bg-green-50/50 p-4"
              >
                <p className="mb-1 text-sm font-medium text-slate-700">
                  Appointment Details:
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Type:</span>{" "}
                  {successData?.type}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Date:</span>{" "}
                  {successData?.date}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Time:</span>{" "}
                  {successData?.time}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex w-full gap-3"
            >
              <button
                type="button"
                onClick={() => router.push("/patient")}
                className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 py-3 text-[15px] font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </motion.div>
        );
    }
  };

  /* ─── left panel content (tagline changes per view) ─── */

  const leftPanelTagline = () => {
    switch (view) {
      case "register":
        return "Start your recovery journey with expert physiotherapy care";
      case "schedule":
        return "Pick a time that works for you — we'll take care of the rest";
      case "success":
        return "We look forward to seeing you at your appointment!";
      default:
        return "Expert physiotherapy care for your recovery journey";
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-8">
      {/* ─── Animated background blobs ─── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_35%)]" />
      <motion.div
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-[-3rem] h-80 w-80 rounded-full bg-blue-300/25 blur-3xl"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.35] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[20%] top-[35%] h-48 w-48 rounded-full bg-indigo-200/20 blur-2xl"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.1, 1], y: [0, -15, 0] }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute right-[10%] top-[15%] h-56 w-56 rounded-full bg-sky-200/20 blur-2xl"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.12, 1], y: [0, 12, 0] }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* ─── Back to home ─── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link
          href="/"
          className="fixed left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>

      {/* ─── Split-screen card ─── */}
      <motion.div
        initial={
          mounted ? false : { opacity: 0, y: 30, scale: 0.96 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[900px] overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/50 md:h-[580px] md:flex-row"
      >
        <div className="flex w-full flex-col md:flex-row">
          {/* ─── Left Panel (blue gradient branding) ─── */}
          <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-800 to-blue-600 md:flex md:flex-col md:items-center md:justify-center">
            {/* Animated gradient orbs */}
            <div className="absolute -left-20 -top-20 h-72 w-72 animate-morph rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-64 w-64 animate-morph rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/3 h-48 w-48 animate-float rounded-full bg-sky-300/10 blur-2xl" />

            {/* Dot pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Rotating rings */}
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow rounded-full border border-white/5" />
            <div
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow rounded-full border border-white/5"
              style={{
                animationDirection: "reverse",
                animationDuration: "30s",
              }}
            />

            {/* Floating decorative icons */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute left-[12%] top-[18%]"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <HeartPulse className="h-5 w-5 text-white/15" />
                </motion.div>
                <motion.div
                  className="absolute bottom-[22%] right-[15%]"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <Activity className="h-5 w-5 text-white/15" />
                </motion.div>
                <motion.div
                  className="absolute right-[10%] top-[25%]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                >
                  <Stethoscope className="h-5 w-5 text-white/15" />
                </motion.div>
              </>
            )}

            {/* Content */}
            <motion.div
              className="relative z-10 flex flex-col items-center px-8 text-center"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12, delayChildren: 0.3 },
                },
              }}
              initial="hidden"
              animate="show"
            >
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50"
              >
                Welcome to
              </motion.p>
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
                className="mb-5 flex items-center justify-center"
              >
                <Image
                  src="/physiofix.png"
                  alt="PhysioFix"
                  width={220}
                  height={50}
                  className="h-auto w-48 rounded-xl object-contain"
                  priority
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, scaleX: 0 },
                  show: {
                    opacity: 1,
                    scaleX: 1,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="mb-5 h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <AnimatePresence mode="wait">
                <motion.p
                  key={view}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2 text-sm leading-relaxed text-white/60"
                >
                  {leftPanelTagline()}
                </motion.p>
              </AnimatePresence>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                <span className="text-xs text-white/70">
                  Your recovery is our priority
                </span>
              </motion.div>

              {/* Trusted by */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="mt-8 flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-3 w-3 text-yellow-400/80"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[10px] text-white/30">
                  Trusted by 500+ patients
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* ─── Mobile header ─── */}
          <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-800 to-blue-600 md:hidden">
            <div className="absolute -left-10 -top-10 h-40 w-40 animate-morph rounded-full bg-blue-400/20 blur-2xl" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 animate-morph rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="relative z-10">
              <Image
                src="/physiofix.png"
                alt="PhysioFix"
                width={180}
                height={42}
                className="h-auto w-36 rounded-lg object-contain"
                priority
              />
            </div>
          </div>

          {/* ─── Right Panel (form) ─── */}
          <motion.div
            className="flex w-full flex-col justify-center bg-white px-8 py-10 md:w-[55%] md:px-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              {renderFormContent()}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Subtle glow behind card ─── */}
      <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-blue-300/20 via-indigo-300/10 to-blue-300/20 blur-xl opacity-50" />
    </div>
  );
}
