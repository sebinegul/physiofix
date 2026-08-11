import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Physiotherapy at Home in JP Nagar, Bangalore",
  description:
    "Professional home-based physiotherapy services for elderly patients, post-surgical recovery and mobility limitations in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/homePhysio",
  },
  openGraph: {
    title: "Physiotherapy At Home | Expert Care in Your Comfort Zone",
    description:
      "Professional home-based physiotherapy services for elderly patients, post-surgical recovery and mobility limitations in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/homePhysio",
  },
};

export default function HomePhysioPage() {
  return (
    <SpecializationLayout
      title="Physiotherapy At Home"
      subtitle="Expert Care in Your Comfort Zone"
      description="Home-based physiotherapy brings professional treatment to your doorstep, providing convenient and personalised care without the need to travel. It is ideal for elderly patients, post-surgical recovery, mobility limitations, and those who prefer the comfort and privacy of their own home for rehabilitation."
      heroImage="/homePhysio.jpg"
      benefits={[
        {
          title: "Convenience and Comfort",
          description:
            "Receive professional physiotherapy treatment in the familiar surroundings of your own home, eliminating the need to travel and allowing you to focus entirely on recovery.",
        },
        {
          title: "Personalised Home Setup",
          description:
            "Your physiotherapist assesses your home environment and adapts exercises and recommendations to your specific living space, ensuring practical and effective rehabilitation.",
        },
        {
          title: "No Travel Stress",
          description:
            "Eliminate the physical and emotional stress of travelling to a clinic, especially beneficial for patients with severe pain, mobility restrictions, or post-surgical limitations.",
        },
        {
          title: "Family Involvement",
          description:
            "Family members can be present during sessions to learn how to assist with exercises, understand the recovery process, and provide better support at home.",
        },
        {
          title: "Flexible Scheduling",
          description:
            "Home visits offer greater flexibility in scheduling appointments around your daily routine, making it easier to maintain consistent treatment without disruption.",
        },
        {
          title: "Continued Recovery",
          description:
            "Uninterrupted treatment in your own environment promotes faster and more consistent recovery, as you can immediately apply learned techniques in your daily activities.",
        },
      ]}
      howItWorks={[
        "Initial home assessment evaluating your living environment, mobility needs, and specific rehabilitation requirements.",
        "Treatment plan creation based on the assessment, outlining goals, exercises, and a schedule tailored to your home setting.",
        "Regular home visits where Dr. Nishmitha delivers hands-on therapy, guided exercises, and progressive rehabilitation.",
        "Exercise guidance with clear instructions and demonstrations so you can safely continue your programme between visits.",
        "Ongoing progress tracking with adjustments to the treatment plan as you improve, ensuring optimal recovery outcomes.",
      ]}
      conditions={[
        "Post-Surgery Recovery",
        "Elderly Mobility",
        "Chronic Pain Management",
        "Stroke Rehabilitation",
        "Joint Replacement Rehab",
        "Sports Injury Recovery",
        "Neurological Conditions",
        "Post-Fracture Rehabilitation",
      ]}
      faqs={[
        {
          question: "What is included in home physiotherapy?",
          answer:
            "Home physiotherapy includes the same professional treatment you would receive at a clinic — hands-on therapy, guided exercises, pain management techniques, and personalised rehabilitation — all delivered in the comfort of your own home.",
        },
        {
          question: "Who qualifies for home visits?",
          answer:
            "Home visits are ideal for elderly patients, those recovering from surgery or fractures, individuals with severe mobility limitations, patients with neurological conditions, and anyone who finds it difficult to travel to a clinic. Dr. Nishmitha will assess your suitability during an initial consultation.",
        },
        {
          question: "How long are home physiotherapy sessions?",
          answer:
            "Sessions typically last 45–60 minutes, similar to in-clinic appointments. The duration may be adjusted based on your condition, tolerance level, and specific treatment needs.",
        },
        {
          question: "Is home physiotherapy as effective as clinic-based treatment?",
          answer:
            "Yes, home physiotherapy is equally effective. In many cases, it can be more beneficial because the physiotherapist can assess your actual home environment, adapt exercises to your daily routine, and provide more personalised functional rehabilitation.",
        },
        {
          question: "What equipment is needed for home physiotherapy?",
          answer:
            "Most exercises use minimal or no equipment. Where needed, simple items like resistance bands, exercise balls, or a yoga mat may be recommended. Dr. Nishmitha will guide you on any equipment required during the initial assessment.",
        },
      ]}
    />
  );
}
