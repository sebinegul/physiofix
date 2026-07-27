import type { Metadata } from "next";
import Script from "next/script";
import { prisma } from "@/lib/prisma";
import { Inter, Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import SiteShell from "./components/SiteShell";
import WhatsAppButton from "./components/WhatsAppButton";
import JsonLd from "./components/JsonLd";

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
    default: "PhysioFix | Best Physiotherapy in JP Nagar, Bangalore | Dr.Nishmitha.R",
    template: "%s | PhysioFix - Physiotherapy JP Nagar Bangalore",
  },
  description:
    "PhysioFix, expert physiotherapy, sports rehab, neuro rehabilitation & post-surgery care in JP Nagar 8th Phase, Bangalore. Dr.Nishmitha.R (MPT Sports Science) with 5+ years experience. Book your appointment today.",
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
  ],
  alternates: {
    canonical: "https://physiofix.net/",
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
        url: "https://physiofix.net/og-image.svg",
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
  other: {
    "google-site-verification": "",
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
  const phone = content.contact_phone || "+91-8151912525";
  const email = content.contact_email || "physiofix2525@gmail.com";
  const address = content.contact_address || "30, Sai Krupa Complex, Subba Raju Layout, BK Circle, Kothanur Dinne Main Road, JP Nagar 8th Phase, Bengaluru – 560076";
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${dmSans.variable}`}>
      <head>
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Bangalore" />
        <meta name="geo.position" content="12.8924;77.5928" />
        <meta name="ICBM" content="12.8924, 77.5928" />
        <JsonLd />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>

        <WhatsAppButton />

        {/* LocalBusiness + MedicalBusiness structured data */}
        <Script
          id="physiofix-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              image: "https://physiofix.net/logoShort-transparent.png",
              logo: "https://physiofix.net/logoShort-transparent.png",
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
              hasMap: "https://maps.google.com/?q=PhysioFix+JP+Nagar+Bangalore",
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
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "250",
                bestRating: "5",
              },
            }),
          }}
        />

        {/* Website structured data */}
        <Script
          id="physiofix-website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PhysioFix",
              url: "https://physiofix.net",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://physiofix.net/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* BreadcrumbList structured data */}
        <Script
          id="physiofix-breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://physiofix.net/" },
                { "@type": "ListItem", position: 2, name: "About", item: "https://physiofix.net/about" },
                { "@type": "ListItem", position: 3, name: "Services", item: "https://physiofix.net/services" },
                { "@type": "ListItem", position: 4, name: "Contact", item: "https://physiofix.net/contact" },
              ],
            }),
          }}
        />

        {/* FAQ structured data */}
        <Script
          id="physiofix-faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
                    text: "PhysioFix is located at 30, Sai Krupa Complex, Subba Raju Layout, BK Circle, Kothanur Dinne Main Road, JP Nagar 8th Phase, Bangalore – 560076.",
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
                    text: "PhysioFix is open Monday to Saturday from 9:00 AM to 7:00 PM. Contact +91-8151912525 to book an appointment.",
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
