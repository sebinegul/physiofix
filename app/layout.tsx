import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/json-ld";
import Script from "next/script";
import { prisma } from "@/lib/prisma";
import { Inter, Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import SiteShell from "./components/SiteShell";
import LazyGA from "./components/LazyGA";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollProgress from "./components/ui/ScrollProgress";
import { CLINIC_ADDRESS, CLINIC_EMAIL, CLINIC_MAPS_LINK, CLINIC_PHONE } from "@/lib/clinic";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://physiofix.net"),
  title: {
    default: "PhysioFix | Best Physiotherapy in JP Nagar, Bangalore",
    template: "%s | PhysioFix",
  },
  description:
    "Expert physiotherapy, sports rehab, neuro rehab & post-surgery care in JP Nagar, Bangalore. Dr.Nishmitha.R (MPT) with 5+ years experience. Book today.",
  keywords: [
    "physiotherapy Bangalore",
    "physiotherapist JP Nagar",
    "physiotherapy JP Nagar Bangalore",
    "sports rehabilitation Bangalore",
    "back pain physiotherapy Bangalore",
    "neck pain treatment Bangalore",
    "post surgery rehabilitation Bangalore",
    "home physiotherapy Bangalore",
    "chiropractic care Bangalore",
    "neuro rehabilitation Bangalore",
    "knee pain physiotherapy",
    "shoulder pain treatment Bangalore",
    "physiotherapist near me Bangalore",
    "best physiotherapist JP Nagar",
    "Dr Nishmitha physiotherapist",
    "physiotherapy Kothanur",
    "physiotherapist Kothanur Bangalore",
    "sports injury treatment Bangalore",
    "cupping therapy JP Nagar",
    "cupping therapy Bangalore",
    "rehabilitation center JP Nagar",
    "physiotherapy clinic near me",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      "y4faTVzIp578_bgNmTiFMLvacqdus5qmOjJ63eLcNdo",
  },
  openGraph: {
    title: "PhysioFix | Best Physiotherapy in JP Nagar, Bangalore",
    description:
      "Expert physiotherapy care for pain relief, sports recovery, post-surgery rehab & neurological rehabilitation in JP Nagar, Bangalore. Book your consultation.",
    url: "https://physiofix.net/",
    siteName: "PhysioFix",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://physiofix.net/og-image.png",
        width: 1200,
        height: 630,
        alt: "PhysioFix, Physiotherapy, Sports Rehab & Recovery Care in JP Nagar, Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhysioFix | Best Physiotherapy in JP Nagar, Bangalore",
    description:
      "Expert physiotherapy care for pain relief, sports recovery, post-surgery rehab & neurological rehabilitation in JP Nagar, Bangalore.",
    images: ["https://physiofix.net/og-image.png"],
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
  other: {
    "format-detection": "telephone=yes",
  },
};

async function getContactContent() {
  try {
    const items = await prisma.siteContent.findMany();
    const map: Record<string, string> = {};
    for (const item of items) map[item.key] = item.value;
    return map;
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContactContent();
  const phone = content.contact_phone || CLINIC_PHONE;
  const email = content.contact_email || CLINIC_EMAIL;
  const address = content.contact_address || CLINIC_ADDRESS;
  return (
    <html lang="en-IN" className={`${inter.variable} ${plusJakarta.variable} ${dmSans.variable}`}>
      <head>
              <link rel="manifest" href="/site.webmanifest" />
              <meta name="theme-color" content="#3b82f6" />
              <meta name="geo.region" content="IN-KA" />
              <meta name="geo.placename" content="Bengaluru" />
              <meta name="geo.position" content="12.8924;77.5928" />
              <meta name="ICBM" content="12.8924, 77.5928" />
              {/* GA4 moved to <LazyGA /> client component (lazyOnload) */}
            </head>
      <body>
        {/* Film grain noise overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />

        <ScrollProgress />
        <LazyGA />

        <SiteShell>{children}</SiteShell>

        <WhatsAppButton />

        {/* LocalBusiness + MedicalBusiness structured data.
            NOTE: plain <script>, NOT next/script <Script> — next/script injects
            after hydration, so crawlers fetching raw HTML see NO structured data. */}
        <script
          id="physiofix-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "@id": "https://physiofix.net/#organization",
              name: "PhysioFix",
              alternateName: "PhysioFix Physiotherapy Clinic",
              url: "https://physiofix.net",
              telephone: phone,
              email: email,
              description:
                "PhysioFix provides expert physiotherapy, chiropractic care, sports rehabilitation, neuro rehabilitation, post-surgery rehab and home care services in JP Nagar, Bangalore.",
              medicalSpecialty: [
                "Physiotherapy",
                "Sports Medicine",
                "Orthopedics",
                "Neurology",
                "Rehabilitation",
              ],
              image: "https://physiofix.net/physiofix.png",
              logo: "https://physiofix.net/physiofix.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: address,
                addressLocality: "JP Nagar 8th Phase",
                addressRegion: "Bangalore, Karnataka",
                postalCode: "560076",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 12.8924,
                longitude: 77.5928,
              },
              areaServed: [
                { "@type": "City", name: "Bangalore", sameAs: "https://en.wikipedia.org/wiki/Bengaluru" },
                { "@type": "Neighborhood", name: "JP Nagar" },
                { "@type": "Neighborhood", name: "Kothanur" },
                { "@type": "Neighborhood", name: "Bommanahalli" },
                { "@type": "Neighborhood", name: "HSR Layout" },
                { "@type": "Neighborhood", name: "BTM Layout" },
              ],
              hasMap: CLINIC_MAPS_LINK,
              priceRange: "$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "09:00",
                  closes: "19:00",
                },
              ],
              sameAs: [
                "https://www.facebook.com/physiofix",
                "https://www.instagram.com/physiofix",
                "https://www.linkedin.com/company/physiofix",
              ],
              employee: {
                "@id": "https://physiofix.net/#physician",
              },
            }),
          }}
        />

        <script
          id="physiofix-website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PhysioFix",
              url: "https://physiofix.net",
              publisher: { "@id": "https://physiofix.net/#organization" },
            }),
          }}
        />

        <script
          id="physiofix-physician-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "Physician",
              "@id": "https://physiofix.net/#physician",
              name: "Dr. Nishmitha R",
              honorificPrefix: "Dr.",
              jobTitle: "Sports Science Physiotherapist",
              description:
                "MPT Sports Science physiotherapist with over 5 years of experience in orthopaedic, sports, and neurological rehabilitation in JP Nagar, Bangalore.",
              image: "https://physiofix.net/physio-fix-dr-nishmitha.jpeg",
              worksFor: { "@id": "https://physiofix.net/#organization" },
              medicalSpecialty: ["Physiotherapy", "Sports Medicine", "Rehabilitation"],
              address: {
                "@type": "PostalAddress",
                streetAddress: address,
                addressLocality: "JP Nagar 8th Phase",
                addressRegion: "Karnataka",
                postalCode: "560076",
                addressCountry: "IN",
              },
            }),
          }}
        />

        {/* FAQ structured data */}
        <script
          id="physiofix-faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What physiotherapy services does PhysioFix offer in Bangalore?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "PhysioFix offers sports rehabilitation, orthopaedic and spine care, neuro rehabilitation, post-surgery rehab, manual therapy, cupping therapy, chiropractic care, electrotherapy, and home physiotherapy services in JP Nagar, Bangalore.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Where is PhysioFix located in Bangalore?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `PhysioFix is located at ${address}.`,
                  },
                },
                {
                  "@type": "Question",
                  name: "Who is the physiotherapist at PhysioFix?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Dr.Nishmitha.R is a Physiotherapist in Sports Science (MPT) with over 5 years of experience in orthopaedic sports medicine and neurological rehabilitation.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does PhysioFix offer home physiotherapy in Bangalore?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, PhysioFix provides convenient home physiotherapy visits in JP Nagar and surrounding areas of Bangalore for elderly patients, post-surgery recovery, and mobility support.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What are the clinic hours at PhysioFix?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `PhysioFix is open Monday to Saturday from 9:00 AM to 7:00 PM. Contact ${phone} to book an appointment.`,
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
