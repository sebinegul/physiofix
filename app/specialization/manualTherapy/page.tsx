import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Manual Therapy in JP Nagar, Bangalore",
  description: "Hands-on manual therapy for joint mobilisation, soft tissue release & pain relief in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/manualTherapy",
  },
  openGraph: {
    title: "Manual Therapy | Joint Mobilisation in JP Nagar",
    description: "Hands-on manual therapy for joint mobilisation, soft tissue release & pain relief in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/manualTherapy",
    images: ["https://physiofix.net/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://physiofix.net/og-image.png"],
  },
};

export default function ManualTherapyPage() {
  return (
    <SpecializationLayout
      title="Manual Therapy"
      subtitle="Hands-On Treatment"
      description="Manual therapy uses guided hands-on techniques to improve joint movement, ease muscle tension, and reduce pain. It includes joint mobilisation, soft tissue manipulation, and stretching techniques performed by a trained physiotherapist. Especially effective for stiffness, restricted mobility, and musculoskeletal pain."
      heroImage="/manualTherapy.jpg"
      benefits={[
        {
          title: "Restores Joint Mobility",
          description: "Gentle mobilisation techniques help restore normal joint mechanics, reducing stiffness and improving your range of motion for daily activities.",
        },
        {
          title: "Reduces Muscle Tension",
          description: "Targeted soft tissue techniques release tight muscles and fascia, alleviating trigger points and reducing chronic muscle spasm.",
        },
        {
          title: "Pain Relief Without Medication",
          description: "Manual therapy provides a drug-free approach to pain management by addressing the root cause of discomfort through hands-on treatment.",
        },
        {
          title: "Improves Posture",
          description: "By correcting joint restrictions and muscle imbalances, manual therapy helps restore proper alignment and postural balance.",
        },
        {
          title: "Enhances Athletic Performance",
          description: "Athletes benefit from improved flexibility, reduced muscle stiffness, and better movement quality through regular manual therapy sessions.",
        },
        {
          title: "Speeds Up Recovery",
          description: "Post-injury and post-surgical patients experience faster recovery as manual therapy promotes tissue healing and reduces scar tissue formation.",
        },
      ]}
      howItWorks={[
        "Comprehensive assessment of joint range of motion, muscle tone, and movement patterns.",
        "Identification of restricted joints and tight muscle groups requiring treatment.",
        "Application of graded joint mobilisation and soft tissue techniques.",
        "Post-treatment exercises and stretches to maintain improvements.",
        "Progressive treatment plan with regular reassessment of outcomes.",
      ]}
      conditions={[
        "Lower Back Pain",
        "Neck Pain & Stiffness",
        "Shoulder Impingement",
        "Knee Pain",
        "Hip Restriction",
        "TMJ Dysfunction",
        "Whiplash Injuries",
        "Rotator Cuff Issues",
        "Tennis Elbow",
        "Frozen Shoulder",
      ]}
      faqs={[
        {
          question: "What is the difference between manual therapy and massage?",
          answer: "While massage primarily focuses on soft tissue relaxation, manual therapy includes joint mobilisation, manipulation, and specific clinical techniques to restore joint mechanics and address musculoskeletal dysfunction. It is a targeted clinical treatment performed by a trained physiotherapist.",
        },
        {
          question: "Is manual therapy painful?",
          answer: "You may experience mild discomfort during treatment, especially when addressing restricted areas, but it should not be painful. Dr.Nishmitha adjusts the pressure and technique based on your comfort level.",
        },
        {
          question: "How many sessions will I need?",
          answer: "The number of sessions depends on your condition and its severity. Acute issues may resolve in 3–5 sessions, while chronic conditions may require 8–12 sessions. A personalised plan will be created after your initial assessment.",
        },
        {
          question: "Can manual therapy help with chronic pain?",
          answer: "Yes, manual therapy is highly effective for chronic pain conditions. By addressing joint restrictions, muscle imbalances, and tissue restrictions, it helps break the pain cycle and restore normal function.",
        },
      ]}
    />
  );
}