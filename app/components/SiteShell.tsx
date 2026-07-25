import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedBackground from "./ui/AnimatedBackground";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
