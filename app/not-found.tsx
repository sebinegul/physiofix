"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        </div>

        {/* 404 */}
        <h1
          className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-8xl font-extrabold text-transparent"
          style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
        >
          404
        </h1>

        {/* Heading */}
        <h2
          className="mt-4 text-2xl font-bold text-slate-900"
          style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
        >
          Page not found
        </h2>

        {/* Subtext */}
        <p className="mt-3 text-slate-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
