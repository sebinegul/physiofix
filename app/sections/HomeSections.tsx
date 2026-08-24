"use client";

import dynamic from "next/dynamic";
import Hero from "./Hero";
import MeetSpecialists from "./MeetSpecialists";
import PopularSearches from "./PopularSearches";
import FindPhysio from "./FindPhysio";
import WhyChooseUs from "./WhyChooseUs";

// Below-the-fold client sections are lazy-loaded so their JS doesn't
// block the main thread during initial page load (LCP/TBT improvement).
const Testimonials = dynamic(() => import("./Testimonials"));
const Newsletter = dynamic(() => import("./Newsletter"));

export default function HomeSections() {
  return (
    <>
      <Hero />
      <MeetSpecialists />
      <PopularSearches />
      <FindPhysio />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
