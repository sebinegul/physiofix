import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Chiropractic Care | Spine & Joint Alignment in JP Nagar",
  description: "Expert chiropractic care for spinal alignment, back pain relief & posture correction in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/chiropracticCare",
  },
  openGraph: {
    title: "Chiropractic Care | Spine & Joint Alignment in JP Nagar",
    description: "Expert chiropractic care for spinal alignment, back pain relief & posture correction in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/chiropracticCare",
  },
};

export default function ChiropracticCarePage() {
  return (
    <SpecializationLayout
      title="Chiropractic Care"
      subtitle="Spine & Joint Alignment"
      description="Chiropractic care focuses on restoring spinal and joint alignment to reduce pain, improve movement, and support better body function. It uses precise, controlled adjustments to correct misalignments, relieve pressure on nerves, and enhance overall musculoskeletal health."
      heroImage="/chiropractic.jpg"
      benefits={[
        {
          title: "Pain-Free Spinal Alignment",
          description: "Precise chiropractic adjustments correct spinal misalignments that cause back pain, neck pain, and headaches, providing lasting relief.",
        },
        {
          title: "Improved Nerve Function",
          description: "By relieving pressure on nerves caused by misaligned vertebrae, chiropractic care restores proper nerve communication throughout the body.",
        },
        {
          title: "Enhanced Mobility",
          description: "Regular adjustments restore joint mobility and flexibility, making everyday movements easier and more comfortable.",
        },
        {
          title: "Better Posture",
          description: "Chiropractic corrections address postural imbalances caused by prolonged sitting, desk work, and repetitive strain patterns.",
        },
        {
          title: "Drug-Free Treatment",
          description: "Chiropractic care provides a natural, non-invasive approach to pain management without the side effects of medication.",
        },
        {
          title: "Preventive Health Care",
          description: "Regular chiropractic maintenance helps prevent future injuries, reduces recurrence of pain, and supports long-term spinal health.",
        },
      ]}
      howItWorks={[
        "Detailed spinal assessment including postural analysis and movement screening.",
        "Identification of vertebral subluxations and areas of joint restriction.",
        "Gentle, controlled adjustments applied to specific vertebrae and joints.",
        "Post-adjustment assessment to verify improved alignment and mobility.",
        "Home exercise program and ergonomic advice to maintain spinal health.",
      ]}
      conditions={[
        "Lower Back Pain",
        "Neck Pain",
        "Sciatica",
        "Migraines & Tension Headaches",
        "Herniated Disc",
        "Scoliosis",
        "Whiplash",
        "TMJ Disorder",
        "Frozen Shoulder",
        "Postural Syndrome",
      ]}
      faqs={[
        {
          question: "Are chiropractic adjustments safe?",
          answer: "Yes, chiropractic adjustments performed by a qualified professional like Dr. Nishmitha R are safe and effective. The techniques used are gentle and tailored to your specific condition and comfort level.",
        },
        {
          question: "How long does a session take?",
          answer: "A typical chiropractic session lasts 20–30 minutes. Initial consultations may take longer as they include a thorough assessment and treatment planning.",
        },
        {
          question: "Will I need ongoing treatment?",
          answer: "The treatment frequency depends on your condition. Some patients benefit from a short course of 6–8 sessions, while others may need periodic maintenance visits. A personalised plan is created based on your needs.",
        },
        {
          question: "Can chiropractic help with headaches?",
          answer: "Yes, chiropractic care is effective for tension headaches and cervicogenic headaches (headaches originating from the neck). By correcting cervical alignment, pressure on nerves and muscles is reduced.",
        },
        {
          question: "What conditions does chiropractic treat?",
          answer: "Chiropractic care treats a wide range of musculoskeletal conditions including back pain, neck pain, sciatica, headaches, sports injuries, and postural issues.",
        },
      ]}
    />
  );
}