"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedBackground from "./ui/AnimatedBackground";

const HIDE_SHELL_PREFIXES = ["/login", "/dashboard", "/patient"];

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideShell = HIDE_SHELL_PREFIXES.some((p) => pathname.startsWith(p));

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
