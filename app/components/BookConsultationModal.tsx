"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Loader2, CheckCircle2, CalendarDays } from "lucide-react";

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

interface SuccessData {
  name: string;
  email: string;
  generatedPassword: string;
}

export default function BookConsultationModal({
  isOpen,
  onClose,
  onOpenLogin,
}: BookConsultationModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management: save previous focus, focus first input on open
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Small delay to let the animation start
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Restore focus on close
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
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

  // Prevent body scroll when modal is open
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

  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    return newErrors;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          notes: formData.notes.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccessData(result.data.user);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setFormData({ name: "", phone: "", email: "", notes: "" });
    setErrors({});
    setSubmitError(null);
    setSuccessData(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const animationDuration = prefersReducedMotion ? 0.01 : 0.25;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animationDuration }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Book a consultation"
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
            transition={{ duration: animationDuration, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[1.25rem] border border-white/20 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl max-h-[90vh] modal-scroll"
          >
            {/* Decorative gradient header */}
            {!successData && (
              <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-6 py-5 sm:px-8">
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                      <CalendarDays className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white sm:text-xl">
                        Book a Consultation
                      </h2>
                      <p className="text-sm text-white/80">
                        Free initial assessment
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

            {/* Success state */}
            {successData ? (
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Registration Successful!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Your account has been created. Use the credentials below to
                    log in.
                  </p>
                </div>

                {/* Credentials card */}
                <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Your Login Credentials
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {successData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Password</p>
                      <code className="inline-block rounded-lg bg-indigo-100 px-3 py-1.5 font-mono text-sm font-bold text-indigo-700">
                        {successData.generatedPassword}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <p className="mb-2 text-sm font-semibold text-amber-800">
                    📋 Next Steps:
                  </p>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-amber-700">
                    <li>
                      Go to{" "}
                      <a
                        href="/login"
                        className="font-medium underline hover:text-amber-900"
                      >
                        physiofix.net/login
                      </a>
                    </li>
                    <li>Enter your email and the password above</li>
                    <li>Access your patient dashboard</li>
                  </ol>
                </div>

                <p className="mb-4 text-center text-xs text-gray-400">
                  We&apos;ve also sent these details to your email address.
                </p>

                <button
                  onClick={handleClose}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30"
                >
                  Got it!
                </button>

                {onOpenLogin && (
                  <button
                    onClick={() => {
                      handleClose();
                      onOpenLogin();
                    }}
                    className="mt-3 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    🔑 Login Now
                  </button>
                )}
              </div>
            ) : (
              /* Form state */
              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="bc-name"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id="bc-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
                        errors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-blue-400"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="bc-phone"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="bc-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
                        errors.phone
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-blue-400"
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="bc-email"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="bc-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-blue-400"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Notes / Pain description */}
                  <div>
                    <label
                      htmlFor="bc-notes"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Tell us about your pain, injury, or goal for recovery
                    </label>
                    <p className="mb-1.5 text-xs text-gray-400">Optional</p>
                    <textarea
                      id="bc-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g. I've been having lower back pain for 2 weeks..."
                    />
                  </div>
                </div>

                {/* Submit error */}
                {submitError && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                {/* Already have an account? Login */}
                {onOpenLogin && (
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onOpenLogin();
                      }}
                      className="font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      Login
                    </button>
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register & Book Consultation"
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Your account will be created with an auto-generated password.
                  <br />
                  You&apos;ll receive login details via email.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
