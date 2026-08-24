"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Lazy GA4: loads googletagmanager (166KB) only after the page is fully
 * interactive, so it never competes with LCP/TBT. Analytics data from
 * stragglers is still fine - events fire once gtag arrives.
 */
export default function LazyGA() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!gaId) return;
    // warm the dataLayer immediately so early events queue up
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }, [gaId]);

  if (!gaId) return null;

  return (
    <Script
      id="ga-lazy"
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
    />
  );
}
