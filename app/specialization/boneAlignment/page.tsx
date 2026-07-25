import type { Metadata } from "next";
import SpecializationLayout from "../SpecializationLayout";

export const metadata: Metadata = {
  title: "Bone Alignment Therapy | Joint Correction in JP Nagar",
  description: "Expert bone alignment therapy for joint correction & posture improvement in JP Nagar, Bangalore.",
  alternates: {
    canonical: "https://physiofix.net/specialization/boneAlignment",
  },
  openGraph: {
    title: "Bone Alignment Therapy | Joint Correction in JP Nagar",
    description: "Expert bone alignment therapy for joint correction & posture improvement in JP Nagar, Bangalore.",
    url: "https://physiofix.net/specialization/boneAlignment",
  },
};

export default function BoneAlignmentPage() {
  return (
    <SpecializationLayout
      title="Bone Alignment Therapy"
      subtitle="Structural Balance Restoration"
      description="Bone alignment therapy focuses on correcting skeletal misalignments that cause pain, restricted movement, and postural imbalances. Through precise manual techniques and corrective exercises, it restores proper skeletal alignment, improves body mechanics, and helps prevent recurring injuries."
      heroImage="/backPainTherapy.jpg"
      benefits={[
        {
          title: "Corrects Skeletal Misalignment",
          description: "Targeted techniques address bone and joint misalignments that cause chronic pain, restricted movement, and postural dysfunction.",
        },
        {
          title: "Reduces Joint Stress",
          description: "Proper alignment distributes weight evenly across joints, reducing wear and tear and preventing degenerative conditions.",
        },
        {
          title: "Improves Body Mechanics",
          description: "Corrected alignment enhances the efficiency of movement patterns, making daily activities easier and reducing fatigue.",
        },
        {
          title: "Prevents Recurring Injuries",
          description: "Addressing the root cause of misalignment helps prevent the recurrence of injuries and chronic pain conditions.",
        },
        {
          title: "Enhances Athletic Performance",
          description: "Proper skeletal alignment improves biomechanical efficiency, power transfer, and endurance for sports activities.",
        },
        {
          title: "Long-Term Postural Health",
          description: "Combines manual correction with exercise prescription to maintain proper alignment for lasting postural improvement.",
        },
      ]}
      howItWorks={[
        "Comprehensive postural and skeletal assessment using visual and palpation techniques.",
        "Identification of specific areas of misalignment and their impact on movement.",
        "Application of precise manual correction techniques to restore alignment.",
        "Implementation of corrective exercises to strengthen supporting muscles.",
        "Ongoing monitoring and progressive treatment to maintain optimal alignment.",
      ]}
      conditions={[
        "Postural Misalignment",
        "Scoliosis",
        "Leg Length Discrepancy",
        "Flat Feet & Foot Alignment",
        "Knee Valgus/Varus",
        "Pelvic Tilt",
        "Rib Cage Misalignment",
        "Spinal Curvature Issues",
        "Joint Hypermobility",
        "Chronic Mechanical Back Pain",
      ]}
      faqs={[
        {
          question: "How do I know if I have a bone alignment issue?",
          answer: "Common signs include uneven posture, one shoulder or hip sitting higher than the other, chronic pain in specific areas, and recurring injuries. Dr. Nishmitha performs a thorough assessment to identify any alignment problems.",
        },
        {
          question: "Is bone alignment therapy painful?",
          answer: "The treatment itself may cause mild discomfort during correction, but it should not be painful. Dr. Nishmitha works within your comfort range and adjusts techniques as needed.",
        },
        {
          question: "How long does it take to see results?",
          answer: "Many patients notice improvement within 2–4 sessions. However, complete correction of long-standing misalignments may take 8–12 sessions depending on severity and consistency with home exercises.",
        },
        {
          question: "Can alignment issues come back?",
          answer: "With proper exercise compliance and lifestyle modifications, alignment improvements can be maintained long-term. Dr. Nishmitha provides a comprehensive home program to support lasting results.",
        },
      ]}
    />
  );
}