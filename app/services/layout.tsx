import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physiotherapy Services in JP Nagar, Bangalore",
  description:
    "Physiotherapy services in JP Nagar: sports rehab, orthopaedic care, neuro rehab, post-surgery recovery, manual therapy, cupping & home visits.",
  alternates: {
    canonical: "https://physiofix.net/services",
  },
  openGraph: {
    title: "Physiotherapy Services in JP Nagar, Bangalore | PhysioFix",
    description:
      "Explore our full range of physiotherapy services, sports rehab, spine care, neuro rehabilitation, post-surgery recovery & home physiotherapy in JP Nagar, Bangalore.",
    url: "https://physiofix.net/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
