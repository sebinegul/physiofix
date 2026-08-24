import Link from "next/link";
import { ArrowLeft, Home, Stethoscope } from "lucide-react";
import PageTransition from "./components/PageTransition";

export const metadata = {
  title: "Page Not Found",
};

const POPULAR_LINKS = [
  { href: "/services", label: "Our Services" },
  { href: "/blog", label: "Health Blog" },
  { href: "/about", label: "About Dr.Nishmitha" },
  { href: "/contact", label: "Book Appointment" },
];

export default function NotFound() {
  return (
    <PageTransition>
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-7xl font-black tracking-tight text-blue-600/90 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          This page seems to have stretched a little too far.
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
          The page you are looking for does not exist or may have moved. Let us
          help you find your way back to recovery.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-600 hover:to-blue-700 active:scale-[0.97]"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
          >
            <Stethoscope className="h-4 w-4" />
            Book an Appointment
          </Link>
        </div>

        <div className="mt-12 w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Popular pages
          </p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {POPULAR_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {l.label}
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </PageTransition>
  );
}
