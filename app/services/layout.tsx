import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Physiotherapy, Sports Rehab & Recovery in JP Nagar Bangalore",
  description:
    "Comprehensive physiotherapy services in JP Nagar, Bangalore — sports rehabilitation, orthopaedic care, neuro rehab, post-surgery recovery, manual therapy, cupping, chiropractic & home visits.",
  alternates: {
    canonical: "https://physiofix.net/services",
  },
  openGraph: {
    title: "Physiotherapy Services in JP Nagar, Bangalore | PhysioFix",
    description:
      "Explore our full range of physiotherapy services — sports rehab, spine care, neuro rehabilitation, post-surgery recovery & home physiotherapy in JP Nagar, Bangalore.",
    url: "https://physiofix.net/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
