import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Cupping Therapy | Pain Relief in JP Nagar",
  description: "Professional cupping therapy for pain relief, muscle tension & recovery in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/cuppingTherapy",
  },
  openGraph: {
    title: "Cupping Therapy | Pain Relief in JP Nagar",
    description: "Professional cupping therapy for pain relief, muscle tension & recovery in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/cuppingTherapy",
  },
};

export default function CuppingTherapyPage() {
  return (
    <SpecializationLayout
      title="Cupping Therapy"
      subtitle="Complementary Pain Relief"
      description="Cupping therapy helps relieve muscle tightness, improve circulation, and support recovery from strain and stiffness. It uses gentle suction to decompress soft tissue, promote blood flow, and reduce tension. Often used alongside physiotherapy for sports injuries, back pain, and postural issues."
      heroImage="/cupping.jpg"
      benefits={[
        {
          title: "Improves Blood Circulation",
          description: "The suction created by cups draws blood to the surface, enhancing circulation and delivering oxygen and nutrients to damaged tissues for faster healing.",
        },
        {
          title: "Relieves Muscle Tension",
          description: "Cupping helps release deep muscle knots and trigger points, reducing chronic tension and improving range of motion in affected areas.",
        },
        {
          title: "Reduces Inflammation",
          description: "By promoting lymphatic drainage, cupping therapy helps reduce swelling and inflammation in joints, muscles, and soft tissues.",
        },
        {
          title: "Accelerates Recovery",
          description: "Athletes and active individuals benefit from faster post-exercise recovery as cupping helps flush out metabolic waste and lactic acid buildup.",
        },
        {
          title: "Alleviates Chronic Pain",
          description: "Regular cupping sessions can provide lasting relief from chronic back pain, neck pain, shoulder tension, and headaches.",
        },
        {
          title: "Promotes Relaxation",
          description: "The gentle pressure and improved blood flow activate the parasympathetic nervous system, reducing stress and promoting overall well-being.",
        },
      ]}
      howItWorks={[
        "Initial assessment to identify areas of tension, pain, and restricted movement.",
        "Strategic placement of cups on specific points along muscles and meridians.",
        "Suction is applied using either a hand pump or flame technique for 5–15 minutes.",
        "Cups are removed and gentle massage is performed to integrate the effects.",
        "Post-session guidance including hydration, stretching, and follow-up schedule.",
      ]}
      conditions={[
        "Chronic Back Pain",
        "Neck & Shoulder Tension",
        "Sports Injuries",
        "Myofascial Pain Syndrome",
        "Tension Headaches",
        "Plantar Fasciitis",
        "Fibromyalgia",
        "Sciatica",
        "Postural Imbalances",
        "Frozen Shoulder",
      ]}
      faqs={[
        {
          question: "Is cupping therapy painful?",
          answer: "Cupping should not be painful. You may feel a tight or warm sensation where the cups are placed. Dr. Nishmitha adjusts the suction pressure to ensure comfort while maintaining effectiveness.",
        },
        {
          question: "How long does a cupping session take?",
          answer: "A typical session lasts 30–45 minutes, including assessment, cupping application, and post-treatment guidance. The cups are usually left in place for 5–15 minutes depending on the condition being treated.",
        },
        {
          question: "Are there marks after cupping?",
          answer: "Cupping may leave circular marks that range from light pink to dark purple. These are not bruises and typically fade within 3–7 days. The marks indicate areas of stagnant blood and toxins being drawn to the surface.",
        },
        {
          question: "How many sessions do I need?",
          answer: "Most patients benefit from 4–6 sessions scheduled weekly. Acute conditions may improve in 2–3 sessions, while chronic issues may require a longer treatment plan. Dr. Nishmitha will create a personalised plan for you.",
        },
        {
          question: "Can cupping be combined with other treatments?",
          answer: "Yes, cupping is often used alongside manual therapy, electrotherapy, and exercise prescription for comprehensive pain management and recovery.",
        },
      ]}
    />
  );
}