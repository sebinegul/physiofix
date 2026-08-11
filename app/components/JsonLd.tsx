import { safeJsonLd } from "@/lib/json-ld";

export default function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PhysioFix",
    description: "Best physiotherapy clinic in JP Nagar, Bangalore",
    url: "https://physiofix.net",
    telephone: "+91-8151912525",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.8996,
      longitude: 77.5946,
    },
    medicalSpecialty: "Physiotherapy",
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusiness) }}
    />
  );
}
