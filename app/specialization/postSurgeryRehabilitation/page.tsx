import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Post-Surgery Rehabilitation in JP Nagar",
  description:
    "Expert post-surgery rehabilitation for knee replacement, hip replacement & surgical recovery in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/postSurgeryRehabilitation",
  },
  openGraph: {
    title:
      "Post-Surgery Rehabilitation | Faster Recovery After Surgery in JP Nagar",
    description:
      "Expert post-surgery rehabilitation for knee replacement, hip replacement & surgical recovery in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/postSurgeryRehabilitation",
    images: ["https://physiofix.net/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://physiofix.net/og-image.png"],
  },
};

export default function PostSurgeryRehabilitationPage() {
  return (
    <SpecializationLayout
      title="Post-Surgery Rehabilitation"
      subtitle="Recover Stronger After Surgery"
      description="Post-surgery rehabilitation is a structured recovery program designed to restore mobility, strength, and function after surgical procedures. It provides guided progression from gentle early-stage exercises to full functional recovery, ensuring safe healing and preventing complications."
      heroImage="/postSurgeryRehab.jpeg"
      benefits={[
        {
          title: "Faster Recovery",
          description:
            "Structured rehabilitation accelerates the healing process, helping patients return to their normal activities sooner and more safely.",
        },
        {
          title: "Pain Management",
          description:
            "Therapeutic techniques including manual therapy and targeted exercises help manage post-operative pain and reduce dependence on medication.",
        },
        {
          title: "Mobility Restoration",
          description:
            "Progressive exercise programmes systematically restore range of motion and functional mobility after surgical procedures.",
        },
        {
          title: "Strength Rebuilding",
          description:
            "Gradual strengthening protocols rebuild muscle around the surgical area, ensuring stable and functional movement patterns.",
        },
        {
          title: "Scar Tissue Management",
          description:
            "Specialised techniques address scar tissue formation and adhesions, preventing stiffness and promoting optimal tissue healing.",
        },
        {
          title: "Complication Prevention",
          description:
            "Early intervention and guided exercises prevent common post-surgical complications such as blood clots, stiffness, and muscle atrophy.",
        },
      ]}
      howItWorks={[
        "Thorough post-operative assessment to evaluate surgical site, range of motion, pain levels, and functional limitations.",
        "Phase-based rehabilitation programme aligned with healing stages and surgical recovery milestones.",
        "Progressive exercise programme that gradually increases in intensity and complexity as healing advances.",
        "Manual therapy techniques including soft tissue mobilisation, joint mobilisation, and scar management.",
        "Functional goal achievement focused on returning patients to their desired activities and daily routines.",
      ]}
      conditions={[
        "Knee Replacement Recovery",
        "Hip Replacement Rehab",
        "ACL Reconstruction",
        "Shoulder Surgery",
        "Spinal Surgery",
        "Rotator Cuff Repair",
        "Arthroscopic Surgery",
        "Fracture Fixation",
        "Tendon Repair",
        "Joint Replacement",
      ]}
      faqs={[
        {
          question: "When to start rehab after surgery?",
          answer:
            "Rehabilitation typically begins within days of surgery, guided by your surgeon's protocol. Early mobilisation is crucial for preventing complications and ensuring optimal recovery. Your physiotherapist will coordinate with your surgical team to determine the safest starting point.",
        },
        {
          question: "How long is post-surgery rehab?",
          answer:
            "The duration depends on the type of surgery, individual healing rate, and functional goals. Minor procedures may require 4–6 weeks, while major joint replacements or reconstructive surgeries can take 3–6 months or longer. A personalised timeline is established during your initial assessment.",
        },
        {
          question: "Is post-surgery rehab painful?",
          answer:
            "While some discomfort is normal during recovery, rehabilitation is designed to be progressive and within your comfort zone. Therapists use gentle techniques and adjust intensity to manage pain while ensuring effective recovery. Communication with your therapist helps maintain a comfortable treatment pace.",
        },
        {
          question: "Can I do exercises at home?",
          answer:
            "Yes, home exercises are a vital part of post-surgery recovery. Your physiotherapist will provide a tailored home exercise programme with clear instructions to complement your clinic sessions. Consistent home practice significantly improves recovery outcomes.",
        },
        {
          question: "How soon can I walk after surgery?",
          answer:
            "Walking typically begins very early — often within a day or two of surgery under supervision. Weight-bearing guidelines depend on the specific procedure and your surgeon's recommendations. Your physiotherapist will guide you through each stage safely.",
        },
      ]}
    />
  );
}
