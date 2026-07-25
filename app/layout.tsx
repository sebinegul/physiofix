import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteShell from "./components/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://physiofix.net"),
  title: "PhysioFix | Physiotherapy, Sports Rehab & Recovery Care",
  description:
    "PhysioFix helps you find expert physiotherapy care for back pain, sports injuries, neck pain, post-surgery rehab, home visits, and neurological recovery in Bangalore.",
  keywords: [
    "physiotherapy",
    "physio",
    "sports rehab",
    "sports rehabilitation",
    "back pain physiotherapy",
    "neck pain treatment",
    "post surgery rehabilitation",
    "home physiotherapy",
    "physiotherapist Bangalore",
  ],
  alternates: {
    canonical: "https://physiofix.net/",
  },
  openGraph: {
    title: "PhysioFix | Physiotherapy, Sports Rehab & Recovery Care",
    description:
      "Trusted physiotherapy and rehabilitation care for pain relief, movement recovery, sports injuries and post-surgery support.",
    url: "https://physiofix.net/",
    siteName: "PhysioFix",
    type: "website",
    images: [{ url: "https://physiofix.net/og-image.svg", width: 1200, height: 630, alt: "PhysioFix physiotherapy and sports rehab care" }],
  },
  twitter: {
    twitter: {
      card: "summary_large_image",
      title: "PhysioFix | Physiotherapy, Sports Rehab & Recovery Care",
      description: "Trusted physiotherapy and rehabilitation care for pain relief, movement recovery, sports injuries and post-surgery support.",
      images: ["https://physiofix.net/og-image.svg"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
        <Script
          id="physiofix-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "PhysioFix",
              "url": "https://physiofix.net",
              "telephone": "+91-8151912525",
              "email": "physiofix2525@gmail.com",
              "description": "PhysioFix provides expert physiotherapy, chiropractic care, sports rehabilitation, neuro rehabilitation, post-surgery rehab and home care services.",
              "medicalSpecialty": ["Physiotherapy", "Sports Medicine", "Orthopedics", "Neurology"],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "30, Sai Krupa Complex, Subba Raju Layout, BK Circle",
                "addressLocality": "JP Nagar 8th Phase",
                "addressRegion": "Bangalore",
                "postalCode": "560076",
                "addressCountry": "IN",
              },
              "areaServed": ["Bangalore", "JP Nagar", "Kothanur", "Bengaluru"],
            }),
          }}
        />
      </body>
    </html>
  );
}
