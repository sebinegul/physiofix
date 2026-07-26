"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/app/contexts/ToastContext";

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("No reset token found. Please request a new reset link.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.trim().length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: newPassword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
      showToast("Password reset successfully!", "success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-[15px] text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10";

  const labelClass = "mb-1.5 block text-[13px] font-medium text-gray-600";

  // No token — show error
  if (!token && mounted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-8">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-indigo-100/30 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-gray-200/60 bg-white p-12 text-center shadow-2xl shadow-slate-200/50"
        >
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="font-serif text-[24px] font-bold text-gray-900">
            Invalid Reset Link
          </h1>
          <p className="mt-3 text-[14px] text-gray-500">
            This password reset link is invalid or missing. Please request a new
            one.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block rounded-2xl bg-blue-600 px-8 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-blue-700"
          >
            Request New Link
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-8">
      {/* ─── Subtle background decorative elements ─── */}
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-indigo-100/30 blur-[100px]" />
      <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-200/20 blur-[60px]" />

      {/* ─── Back to home ─── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link
          href="/"
          className="fixed left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm text-gray-600 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>

      {/* ─── Split-screen card ─── */}
      <motion.div
        initial={mounted ? false : { opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[900px] overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-2xl shadow-slate-200/50 md:h-[500px] md:flex-row"
      >
        <div className="flex w-full flex-col md:flex-row">
          {/* ─── Left Panel (blue gradient branding) ─── */}
          <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-800 to-blue-600 md:flex md:flex-col md:items-center md:justify-center">
            <div className="absolute -left-20 -top-20 h-72 w-72 animate-morph rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-64 w-64 animate-morph rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/3 h-48 w-48 animate-float rounded-full bg-sky-300/10 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow rounded-full border border-white/5" />
            <div
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow rounded-full border border-white/5"
              style={{
                animationDirection: "reverse",
                animationDuration: "30s",
              }}
            />

            <div className="relative z-10 flex flex-col items-center px-8 text-center">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                Welcome to
              </p>
              <div className="mb-5 flex items-center justify-center">
                <Image
                  src="/physiofix.png"
                  alt="PhysioFix"
                  width={220}
                  height={50}
                  className="h-auto w-48 rounded-xl object-contain"
                  priority
                />
              </div>
              <div className="mb-5 h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <p className="mb-2 text-sm leading-relaxed text-white/60">
                Create a strong new password to secure your account
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                <span className="text-xs text-white/70">
                  Your recovery is our priority
                </span>
              </div>
            </div>
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
          <div className="flex w-full flex-col justify-center bg-white px-8 py-10 md:w-[55%] md:px-12">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
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
                <h1 className="font-serif text-[28px] font-bold leading-tight tracking-tight text-gray-900">
                  Password Reset!
                </h1>
                <p className="mt-3 text-[14px] text-gray-500">
                  Your password has been updated successfully.
                </p>
                <p className="mt-1 text-[13px] text-gray-400">
                  Redirecting you to login...
                </p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="font-serif text-[28px] font-bold leading-tight tracking-tight text-gray-900">
                    Reset Password
                  </h1>
                  <p className="mt-2 text-[14px] text-gray-500">
                    Enter your new password below
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="mt-6">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="flex items-center gap-2.5 rounded-2xl border border-red-100 bg-red-50/80 p-3.5 backdrop-blur-sm"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}

                    {/* New Password */}
                    <motion.div variants={staggerItem}>
                      <label htmlFor="new-password" className={labelClass}>
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className={`${inputClass} pl-10 pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-600"
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

                    {/* Confirm Password */}
                    <motion.div variants={staggerItem}>
                      <label
                        htmlFor="confirm-password"
                        className={labelClass}
                      >
                        Confirm Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          id="confirm-password"
                          type={showConfirm ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className={`${inputClass} pl-10 pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-600"
                          aria-label={
                            showConfirm
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>

                    {/* Submit button */}
                    <motion.div variants={staggerItem} className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-blue-600 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="relative flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            <>Reset Password</>
                          )}
                        </span>
                      </button>
                    </motion.div>
                  </motion.div>
                </form>

                {/* Back to login */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-6 border-t border-gray-100 pt-5"
                >
                  <p className="text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Subtle glow behind card ─── */}
      <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-blue-300/20 via-indigo-300/10 to-blue-300/20 blur-xl opacity-50" />
    </div>
  );
}
