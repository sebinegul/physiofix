import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Physiotherapy Assessment | Diagnosis in JP Nagar",
  description: "Comprehensive physiotherapy assessment & diagnosis in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/physiotherapyAssessment",
  },
  openGraph: {
    title: "Physiotherapy Assessment | Diagnosis in JP Nagar",
    description: "Comprehensive physiotherapy assessment & diagnosis in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/physiotherapyAssessment",
  },
};

export default function PhysiotherapyAssessmentPage() {
  return (
    <SpecializationLayout
      title="Physiotherapy Assessment"
      subtitle="Comprehensive Evaluation"
      description="A thorough physiotherapy assessment forms the foundation of effective treatment. It involves a detailed evaluation of your condition, movement patterns, posture, and functional abilities to create a personalised recovery plan tailored to your specific needs and goals."
      heroImage="/11.jpeg"
      benefits={[
        {
          title: "Accurate Diagnosis",
          description: "A comprehensive assessment identifies the root cause of your pain or dysfunction, ensuring targeted and effective treatment.",
        },
        {
          title: "Personalised Treatment Plan",
          description: "Based on the assessment findings, a customised treatment program is designed to address your specific condition and recovery goals.",
        },
        {
          title: "Objective Progress Tracking",
          description: "Baseline measurements taken during assessment allow for accurate tracking of your improvement throughout the treatment course.",
        },
        {
          title: "Preventive Insights",
          description: "The assessment identifies risk factors and movement patterns that could lead to future injuries, enabling preventive strategies.",
        },
        {
          title: "Whole-Body Evaluation",
          description: "Beyond the area of complaint, the assessment examines the entire musculoskeletal system to identify contributing factors.",
        },
        {
          title: "Evidence-Based Approach",
          description: "Assessment findings are translated into evidence-based treatment recommendations, ensuring the most effective interventions are used.",
        },
      ]}
      howItWorks={[
        "Detailed discussion about your medical history, symptoms, lifestyle, and treatment goals.",
        "Physical examination including observation, palpation, and movement assessment.",
        "Functional testing to evaluate strength, flexibility, balance, and coordination.",
        "Analysis of posture and movement patterns to identify contributing factors.",
        "Presentation of findings and a comprehensive treatment plan with clear timelines.",
      ]}
      conditions={[
        "Acute Injuries",
        "Chronic Pain Conditions",
        "Post-Surgical Rehabilitation",
        "Sports Injuries",
        "Work-Related Injuries",
        "Age-Related Conditions",
        "Postural Issues",
        "Nerve Compression Syndromes",
        "Joint Disorders",
        "Mobility Limitations",
      ]}
      faqs={[
        {
          question: "How long does an initial assessment take?",
          answer: "An initial physiotherapy assessment typically takes 45–60 minutes. This allows sufficient time for a thorough evaluation of your condition, including history taking, physical examination, and treatment planning.",
        },
        {
          question: "What should I bring to my first appointment?",
          answer: "Bring any relevant medical reports, imaging results (X-rays, MRI), a list of current medications, and comfortable clothing that allows easy access to the area being assessed. Wear shorts if a lower limb issue is being evaluated.",
        },
        {
          question: "Will I receive treatment on the first visit?",
          answer: "In most cases, yes. After completing the assessment, Dr.Nishmitha will discuss the findings with you and begin initial treatment if appropriate. This ensures you start your recovery as soon as possible.",
        },
        {
          question: "How often will I need follow-up visits?",
          answer: "Follow-up frequency depends on your condition and treatment plan. Most patients begin with 2–3 sessions per week, which is gradually reduced as improvement occurs. The goal is always to achieve maximum independence.",
        },
      ]}
    />
  );
}