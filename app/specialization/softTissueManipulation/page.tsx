import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Soft Tissue Manipulation in JP Nagar",
  description: "Professional soft tissue manipulation for muscle tension & myofascial release in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/softTissueManipulation",
  },
  openGraph: {
    title: "Soft Tissue Manipulation | Myofascial Release in JP Nagar",
    description: "Professional soft tissue manipulation for muscle tension & myofascial release in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/softTissueManipulation",
  },
};

export default function SoftTissueManipulationPage() {
  return (
    <SpecializationLayout
      title="Soft Tissue Manipulation"
      subtitle="Muscle & Fascia Recovery"
      description="Soft tissue manipulation targets the muscles, fascia, tendons, and ligaments to relieve pain, improve flexibility, and restore normal tissue function. Using hands-on techniques such as myofascial release, trigger point therapy, and deep tissue mobilisation, it addresses chronic tightness, scar tissue, and movement restrictions."
      heroImage="/myofascialRelease.jpg"
      benefits={[
        {
          title: "Releases Muscle Tension",
          description: "Targeted techniques break down adhesions and release chronic muscle tightness, restoring normal muscle length and function.",
        },
        {
          title: "Improves Flexibility",
          description: "By addressing fascial restrictions and muscle tightness, soft tissue manipulation significantly improves range of motion and flexibility.",
        },
        {
          title: "Reduces Scar Tissue",
          description: "Manual techniques help remodel scar tissue from injuries and surgeries, improving tissue quality and reducing restriction.",
        },
        {
          title: "Pain Relief",
          description: "Releasing trigger points and tight bands of tissue provides immediate and lasting pain relief for chronic musculoskeletal conditions.",
        },
        {
          title: "Enhances Recovery",
          description: "Improved blood flow and tissue mobility accelerate the natural healing process, helping you recover faster from injuries.",
        },
        {
          title: "Prevents Injuries",
          description: "Regular soft tissue work maintains tissue health and pliability, reducing the risk of strains, sprains, and overuse injuries.",
        },
      ]}
      howItWorks={[
        "Assessment of tissue quality, tightness, and areas of restriction or pain.",
        "Application of targeted techniques including massage, myofascial release, and trigger point therapy.",
        "Progressive pressure and technique adjustment based on tissue response.",
        "Integration of stretching and movement exercises to maintain tissue changes.",
        "Home care recommendations including self-massage techniques and foam rolling.",
      ]}
      conditions={[
        "Myofascial Pain Syndrome",
        "Plantar Fasciitis",
        "Tennis Elbow",
        "Golfer's Elbow",
        "IT Band Syndrome",
        "Shin Splints",
        "Shoulder Impingement",
        "Tension Headaches",
        "Calf & Hamstring Tightness",
        "Post-Surgical Scar Adhesions",
      ]}
      faqs={[
        {
          question: "What is the difference between soft tissue manipulation and massage?",
          answer: "While relaxation massage focuses on general relaxation, soft tissue manipulation is a clinical treatment that targets specific problems such as trigger points, fascial restrictions, and muscle adhesions. It uses specialised techniques and is performed by a trained physiotherapist.",
        },
        {
          question: "Will soft tissue treatment be painful?",
          answer: "You may experience some discomfort during treatment, especially when addressing tight or painful areas. However, Dr.Nishmitha always works within your pain tolerance and adjusts pressure accordingly. Post-treatment soreness is normal and typically resolves within 24–48 hours.",
        },
        {
          question: "How often should I have soft tissue treatment?",
          answer: "For acute conditions, weekly sessions are recommended. For chronic issues or maintenance, sessions every 2–4 weeks are ideal. Dr.Nishmitha will recommend a frequency based on your specific needs.",
        },
        {
          question: "Can I exercise after soft tissue treatment?",
          answer: "Light exercise and stretching are encouraged after treatment as they help maintain the tissue changes. However, intense exercise should be avoided for 24 hours to allow tissues to recover and adapt.",
        },
        {
          question: "How many sessions will I need?",
          answer: "Most conditions improve within 4–8 sessions, though chronic issues may require longer. Acute injuries often resolve faster, while long-standing problems need more time to address accumulated tissue changes.",
        },
      ]}
    />
  );
}