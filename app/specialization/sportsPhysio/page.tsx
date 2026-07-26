import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Sports Injury Physiotherapy | Return to Peak Performance",
  description:
    "Specialised sports injury physiotherapy for athletes — ACL injuries, sprains, strains and overuse conditions in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/sportsPhysio",
  },
  openGraph: {
    title: "Sports Injury Physiotherapy | Return to Peak Performance",
    description:
      "Specialised sports injury physiotherapy for athletes — ACL injuries, sprains, strains and overuse conditions in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/sportsPhysio",
  },
};

export default function SportsPhysioPage() {
  return (
    <SpecializationLayout
      title="Sports Injury Physiotherapy"
      subtitle="Return to Peak Performance"
      description="Sports physiotherapy specialises in treating athletic injuries and enhancing physical performance. It covers rehabilitation for sprains, strains, ligament tears, tendon injuries, and overuse conditions. The goal is safe return to sport with improved strength, flexibility, and injury prevention strategies."
      heroImage="/sportsPhysio.jpg"
      benefits={[
        {
          title: "Faster Return to Sport",
          description:
            "Evidence-based rehabilitation protocols are designed to accelerate recovery while ensuring your body is fully prepared to handle the demands of your sport safely.",
        },
        {
          title: "Injury Prevention",
          description:
            "Comprehensive screening and corrective exercise programmes identify and address biomechanical risk factors, significantly reducing the likelihood of future injuries.",
        },
        {
          title: "Performance Enhancement",
          description:
            "Beyond injury treatment, sports physiotherapy optimises movement patterns, flexibility, and strength to help you perform at your highest level.",
        },
        {
          title: "Personalised Rehab Plans",
          description:
            "Every athlete receives a tailored rehabilitation programme based on their specific sport, position, injury type, and performance goals for truly individualised care.",
        },
        {
          title: "Strength Restoration",
          description:
            "Progressive strengthening programmes rebuild muscle power, endurance, and stability around injured areas, ensuring a strong and resilient foundation for sport.",
        },
        {
          title: "Movement Optimization",
          description:
            "Advanced movement analysis and corrective techniques improve your biomechanics, helping you move more efficiently and reducing unnecessary stress on joints and tissues.",
        },
      ]}
      howItWorks={[
        "Sports-specific injury assessment evaluating the nature, severity, and sport-related demands of your injury.",
        "Biomechanical analysis of movement patterns, muscle balance, and functional performance to identify underlying issues.",
        "Targeted rehabilitation programme combining manual therapy, therapeutic exercises, and sport-specific training.",
        "Progressive loading protocol with staged return-to-activity milestones guided by objective recovery markers.",
        "Return-to-sport testing confirming strength, flexibility, and functional capacity meet the demands of your sport.",
      ]}
      conditions={[
        "ACL Injuries",
        "Ankle Sprains",
        "Shoulder Injuries",
        "Tennis Elbow",
        "Runner's Knee",
        "Muscle Strains",
        "Tendonitis",
        "Meniscus Tears",
        "Rotator Cuff Injuries",
        "Shin Splints",
      ]}
      faqs={[
        {
          question: "How long does it take to recover from a sports injury?",
          answer:
            "Recovery time varies depending on the type and severity of the injury, as well as individual factors. Minor sprains may heal in 2–4 weeks, while more complex injuries like ACL tears can require 6–9 months. Dr. Nishmitha provides a realistic timeline after your initial assessment.",
        },
        {
          question: "Can I continue exercising during rehabilitation?",
          answer:
            "In most cases, yes. Modified exercise is encouraged to maintain fitness and prevent deconditioning. Your physiotherapist will design a safe exercise programme that works around your injury, gradually progressing as healing allows.",
        },
        {
          question: "When can I return to my sport?",
          answer:
            "Return to sport is determined by objective criteria including strength testing, functional assessments, and sport-specific drills. This ensures you are physically ready and reduces the risk of re-injury. Clear milestones guide your progressive return.",
        },
        {
          question: "Do I need to stop my sport completely during treatment?",
          answer:
            "Not necessarily. Many athletes can continue training with modified programmes that avoid aggravating the injury. The goal is to keep you active and progressing while allowing the injured area to heal properly.",
        },
        {
          question: "How can I prevent sports injuries in the future?",
          answer:
            "A combination of proper warm-up and cool-down routines, strength and flexibility training, correct technique, adequate rest, and regular physiotherapy screening can significantly reduce your risk of sports injuries. Your physiotherapist will provide a personalised prevention plan.",
        },
      ]}
    />
  );
}
