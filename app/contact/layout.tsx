import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Book Appointment | PhysioFix",
  description:
    "Book your physiotherapy appointment at PhysioFix, JP Nagar 8th Phase, Bangalore. Call +91-8151912525 or visit 30, Sai Krupa Complex.",
  alternates: {
    canonical: "https://physiofix.net/contact",
  },
  openGraph: {
    title: "Book Appointment | PhysioFix Physiotherapy JP Nagar Bangalore",
    description:
      "Get in touch with PhysioFix for expert physiotherapy consultation in JP Nagar, Bangalore. Book online or call +91-8151912525.",
    url: "https://physiofix.net/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
