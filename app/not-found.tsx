"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4">
      <div className="relative mx-auto max-w-md text-center">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="relative rounded-[2rem] border border-blue-100/60 bg-white/70 px-8 py-12 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          {/* Large 404 text */}
          <p className="text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500 sm:text-9xl">
            404
          </p>

          <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Page not found
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/35"
            >
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-all duration-300 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
