import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Geriatric Physiotherapy | Comprehensive Care for Seniors",
  description:
    "Specialised geriatric physiotherapy for elderly patients focusing on mobility, balance, fall prevention and independence in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/geriatricPhysio",
  },
  openGraph: {
    title: "Geriatric Physiotherapy | Comprehensive Care for Seniors",
    description:
      "Specialised geriatric physiotherapy for elderly patients focusing on mobility, balance, fall prevention and independence in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/geriatricPhysio",
  },
};

export default function GeriatricPhysioPage() {
  return (
    <SpecializationLayout
      title="Geriatric Physiotherapy"
      subtitle="Comprehensive Care for Seniors"
      description="Geriatric physiotherapy provides specialised care for elderly patients, focusing on maintaining independence, improving mobility, and managing age-related conditions. It addresses balance disorders, joint stiffness, muscle weakness, fall prevention, and post-hospital recovery to help seniors stay active and safe."
      heroImage="/geriatricPhysio.jpg"
      benefits={[
        {
          title: "Mobility Improvement",
          description:
            "Targeted exercises and hands-on techniques help restore and maintain the ability to move freely, enabling seniors to carry out daily activities with greater ease and confidence.",
        },
        {
          title: "Fall Prevention",
          description:
            "Balance training, gait analysis, and strength-building programmes significantly reduce the risk of falls, keeping seniors safe and independent in their own homes.",
        },
        {
          title: "Pain Management",
          description:
            "Gentle manual therapy, modalities, and therapeutic exercises address chronic aches and pains associated with ageing joints and muscles, improving overall comfort.",
        },
        {
          title: "Strength Maintenance",
          description:
            "Progressive resistance exercises are carefully designed to preserve and build muscle mass, counteracting age-related muscle loss and frailty.",
        },
        {
          title: "Balance Training",
          description:
            "Specialised balance and proprioception exercises improve stability, coordination, and confidence during standing, walking, and transitional movements.",
        },
        {
          title: "Independence Support",
          description:
            "By addressing functional limitations, geriatric physiotherapy empowers seniors to maintain their autonomy and continue living independently for longer.",
        },
      ]}
      howItWorks={[
        "Comprehensive geriatric assessment evaluating mobility, strength, balance, pain levels, and functional goals.",
        "Personalised treatment planning tailored to individual needs, medical history, and lifestyle considerations.",
        "Gentle hands-on therapy including joint mobilisation, soft tissue release, and pain-relief techniques.",
        "Guided exercise programme with safe, progressive strengthening, stretching, and balance activities.",
        "Regular progress monitoring with ongoing adjustments to the treatment plan for optimal outcomes.",
      ]}
      conditions={[
        "Balance Disorders",
        "Arthritis",
        "Osteoporosis",
        "Post-Stroke Recovery",
        "Joint Replacement Rehab",
        "Chronic Pain",
        "Mobility Limitations",
        "Fall Risk",
        "Dementia-Related Mobility",
        "Post-Hospital Recovery",
      ]}
      faqs={[
        {
          question: "Is geriatric physiotherapy different from regular physiotherapy?",
          answer:
            "Yes, geriatric physiotherapy is specifically tailored to the unique needs of elderly patients. It considers age-related changes, multiple chronic conditions, medication effects, and focuses on safe, gentle techniques that prioritise comfort and functional independence.",
        },
        {
          question: "How often should seniors visit for physiotherapy?",
          answer:
            "Frequency depends on the individual's condition and goals. Many seniors benefit from 2–3 sessions per week initially, which can be reduced as improvements are achieved. Dr. Nishmitha creates a personalised schedule after the initial assessment.",
        },
        {
          question: "Can geriatric physiotherapy help with balance issues?",
          answer:
            "Absolutely. Balance training is a core component of geriatric physiotherapy. Through targeted exercises that challenge stability, proprioception, and coordination, seniors can significantly improve their balance and reduce the risk of falls.",
        },
        {
          question: "What conditions does geriatric physiotherapy treat?",
          answer:
            "It treats a wide range of conditions including arthritis, osteoporosis, post-stroke recovery, joint replacement rehabilitation, chronic pain, mobility limitations, balance disorders, fall risk, and dementia-related mobility challenges.",
        },
        {
          question: "Is it safe for elderly patients?",
          answer:
            "Yes, geriatric physiotherapy is designed with safety as the top priority. All techniques are gentle, adapted to individual tolerance levels, and performed by trained professionals who understand the specific needs and limitations of elderly patients.",
        },
      ]}
    />
  );
}
