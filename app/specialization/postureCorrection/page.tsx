import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Posture Correction in JP Nagar, Bangalore",
  description:
    "Expert posture correction therapy for postural imbalance, back pain & alignment issues in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/postureCorrection",
  },
  openGraph: {
    title:
      "Posture Correction | Align Your Body, Ease Your Pain in JP Nagar",
    description:
      "Expert posture correction therapy for postural imbalance, back pain & alignment issues in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/postureCorrection",
    images: ["https://physiofix.net/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://physiofix.net/og-image.png"],
  },
};

export default function PostureCorrectionPage() {
  return (
    <SpecializationLayout
      title="Posture Correction"
      subtitle="Align Your Body, Ease Your Pain"
      description="Posture correction therapy addresses postural imbalances and alignment issues that cause pain, discomfort, and reduced function. It combines manual techniques, corrective exercises, and ergonomic guidance to restore proper spinal alignment and prevent long-term musculoskeletal problems."
      heroImage="/postureCorrection.jpeg"
      benefits={[
        {
          title: "Pain Reduction",
          description:
            "Correcting postural imbalances relieves chronic pain in the back, neck, shoulders, and head caused by poor alignment.",
        },
        {
          title: "Improved Alignment",
          description:
            "Targeted exercises and manual techniques restore proper spinal curvature and skeletal alignment for optimal body mechanics.",
        },
        {
          title: "Better Breathing",
          description:
            "Correcting rounded shoulders and forward head posture opens the chest cavity, improving lung capacity and breathing efficiency.",
        },
        {
          title: "Enhanced Confidence",
          description:
            "An upright, aligned posture projects confidence and improves self-image, positively impacting mental well-being and social interactions.",
        },
        {
          title: "Reduced Muscle Tension",
          description:
            "Proper alignment eliminates overworked muscles and compensatory patterns, reducing chronic tension and fatigue throughout the body.",
        },
        {
          title: "Injury Prevention",
          description:
            "Good posture distributes forces evenly across joints and muscles, significantly reducing the risk of strains, sprains, and overuse injuries.",
        },
      ]}
      howItWorks={[
        "Comprehensive postural assessment identifying alignment deviations, muscle imbalances, and movement dysfunction.",
        "Identification of specific muscle imbalances including overactive and underactive muscle groups contributing to poor posture.",
        "Customised corrective exercise programme targeting weak muscles and releasing tight structures to restore balance.",
        "Ergonomic recommendations for workstations, sleeping positions, and daily activities to support postural improvements.",
        "Ongoing monitoring and programme adjustments to ensure sustained postural correction and prevent relapse.",
      ]}
      conditions={[
        "Forward Head Posture",
        "Rounded Shoulders",
        "Lower Back Pain from Posture",
        "Text Neck Syndrome",
        "Kyphosis",
        "Lordosis",
        "Scoliosis Management",
        "Desk-Related Pain",
        "Muscle Imbalance",
        "Postural Headaches",
      ]}
      faqs={[
        {
          question: "Can posture be corrected at any age?",
          answer:
            "Yes, posture can be improved at any age. While children and adolescents may respond faster due to growing bodies, adults and seniors also see significant benefits from posture correction therapy. The key is consistent practice and proper guidance from a qualified therapist.",
        },
        {
          question: "How long does posture correction take?",
          answer:
            "Posture correction is a gradual process that typically requires several weeks to months of consistent therapy and home exercises. Most patients notice improvements within 4–6 weeks, with significant lasting changes developing over 3–6 months of dedicated practice.",
        },
        {
          question: "Are posture braces effective?",
          answer:
            "Posture braces can provide temporary support and awareness of postural habits, but they are not a long-term solution on their own. The most effective approach combines manual therapy, corrective exercises, and ergonomic adjustments to build lasting postural strength and awareness.",
        },
        {
          question: "What exercises help posture?",
          answer:
            "Effective posture exercises include chin tucks, chest stretches, scapular retractions, wall angels, and core strengthening movements. However, the best exercises are personalised based on your specific postural assessment. A physiotherapist can identify which exercises target your particular imbalances.",
        },
        {
          question: "Is poor posture causing my pain?",
          answer:
            "Poor posture is a common contributor to chronic pain, especially in the neck, shoulders, and lower back. However, pain can have multiple causes. A thorough assessment by a physiotherapist can determine whether posture is the primary factor and develop an appropriate treatment plan.",
        },
      ]}
    />
  );
}
