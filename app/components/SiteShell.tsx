"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedBackground from "./ui/AnimatedBackground";
import { BookVisitProvider } from "@/app/contexts/BookVisitContext";
import BookVisitModal from "./BookVisitModal";
import { ToastProvider } from "@/app/contexts/ToastContext";

const HIDE_SHELL_PREFIXES = ["/login", "/dashboard", "/patient"];

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideShell = HIDE_SHELL_PREFIXES.some((p) => pathname.startsWith(p));

  if (hideShell) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <BookVisitProvider>
        <AnimatedBackground />
        <Navbar />
        {children}
        <Footer />
        <BookVisitModal />
      </BookVisitProvider>
    </ToastProvider>
  );
}
