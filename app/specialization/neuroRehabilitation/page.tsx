import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Neuro Rehabilitation in JP Nagar, Bangalore",
  description:
    "Expert neuro rehabilitation for stroke recovery, spinal cord injury & neurological conditions in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/neuroRehabilitation",
  },
  openGraph: {
    title:
      "Neuro Rehabilitation | Movement & Independence Recovery in JP Nagar",
    description:
      "Expert neuro rehabilitation for stroke recovery, spinal cord injury & neurological conditions in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/neuroRehabilitation",
  },
};

export default function NeuroRehabilitationPage() {
  return (
    <SpecializationLayout
      title="Neuro Rehabilitation"
      subtitle="Restoring Movement & Independence"
      description="Neuro rehabilitation provides structured recovery support for individuals with neurological conditions affecting movement, balance, coordination, and function. It uses evidence-based techniques to help patients regain independence and improve their quality of life after stroke, spinal cord injury, or other neurological challenges."
      heroImage="/neuroRehabilitation.jpg"
      benefits={[
        {
          title: "Improved Motor Control",
          description:
            "Targeted therapies help restore voluntary muscle control and improve fine and gross motor skills affected by neurological conditions.",
        },
        {
          title: "Balance Restoration",
          description:
            "Specialised balance training retrains the body's stability systems, reducing fall risk and improving confidence in daily activities.",
        },
        {
          title: "Enhanced Coordination",
          description:
            "Coordinated movement exercises rebuild the brain-body connection, improving hand-eye coordination and overall functional movement.",
        },
        {
          title: "Daily Living Skills",
          description:
            "Practical training focuses on regaining independence in everyday tasks like dressing, eating, and household activities.",
        },
        {
          title: "Strength Rebuilding",
          description:
            "Progressive strengthening programs target weakened muscles, helping patients regain functional strength for daily movement.",
        },
        {
          title: "Independence Support",
          description:
            "Comprehensive rehabilitation empowers patients to regain self-sufficiency and return to meaningful activities they enjoy.",
        },
      ]}
      howItWorks={[
        "Comprehensive neurological assessment to evaluate movement, balance, coordination, and functional abilities.",
        "Goal-oriented rehabilitation planning tailored to individual patient needs and recovery targets.",
        "Targeted movement therapy using evidence-based neurological rehabilitation techniques.",
        "Functional training focused on real-world activities and daily living skills.",
        "Ongoing progress evaluation with treatment plan adjustments to maximise recovery outcomes.",
      ]}
      conditions={[
        "Stroke Recovery",
        "Spinal Cord Injury",
        "Parkinson's Disease",
        "Multiple Sclerosis",
        "Cerebral Palsy",
        "Traumatic Brain Injury",
        "Balance Disorders",
        "Gait Abnormalities",
        "Neuropathy",
        "Bell's Palsy",
      ]}
      faqs={[
        {
          question: "What is neuro rehabilitation?",
          answer:
            "Neuro rehabilitation is a specialised programme designed to help individuals recover from neurological conditions that affect movement, balance, and function. It uses targeted exercises, manual therapy, and functional training to help patients regain independence and improve their quality of life.",
        },
        {
          question: "How long does neuro rehab take?",
          answer:
            "The duration varies depending on the condition, severity, and individual goals. Some patients benefit from a few weeks of intensive therapy, while others may need several months of ongoing rehabilitation. A personalised plan is created to track progress and adjust the timeline accordingly.",
        },
        {
          question: "Can neurological conditions be reversed?",
          answer:
            "While some neurological conditions cannot be fully reversed, neuro rehabilitation can significantly improve function, reduce symptoms, and help patients achieve their maximum potential. The brain's neuroplasticity allows for meaningful recovery even in chronic conditions.",
        },
        {
          question: "Is neuro rehab painful?",
          answer:
            "Neuro rehabilitation is designed to be comfortable and progressive. While some exercises may cause mild discomfort as you work to regain function, therapists adjust the intensity to ensure treatments remain safe and tolerable throughout the recovery process.",
        },
        {
          question: "What improvements can I expect?",
          answer:
            "Patients can expect improvements in movement, balance, coordination, strength, and overall functional independence. Results vary by individual, but consistent therapy combined with home exercise programmes leads to meaningful progress in most cases.",
        },
      ]}
    />
  );
}
