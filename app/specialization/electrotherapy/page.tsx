import SpecializationLayout from "../SpecializationLayout";

export default function ElectrotherapyPage() {
  return (
    <SpecializationLayout
      title="Electrotherapy"
      subtitle="Advanced Pain Relief Technology"
      description="Electrotherapy uses electrical impulses to stimulate nerves and muscles, providing effective pain relief and promoting tissue healing. It includes TENS, EMS, IFT, and other modalities that help reduce pain, improve muscle function, and accelerate the body's natural recovery process."
      heroImage="/electroTherapy.jpeg"
      benefits={[
        {
          title: "Non-Invasive Pain Relief",
          description: "Electrotherapy provides effective pain management without surgery or medication, making it suitable for patients of all ages.",
        },
        {
          title: "Accelerated Tissue Healing",
          description: "Electrical stimulation promotes cellular repair and tissue regeneration, speeding up recovery from injuries and surgeries.",
        },
        {
          title: "Reduced Muscle Spasm",
          description: "Controlled electrical impulses help relax tight muscles, reduce spasms, and restore normal muscle tone.",
        },
        {
          title: "Improved Blood Circulation",
          description: "Electrotherapy enhances local blood flow, delivering essential nutrients and oxygen to damaged tissues for faster healing.",
        },
        {
          title: "Nerve Pain Management",
          description: "TENS (Transcutaneous Electrical Nerve Stimulation) effectively blocks pain signals from reaching the brain, providing immediate relief.",
        },
        {
          title: "Muscle Re-education",
          description: "EMS (Electrical Muscle Stimulation) helps retrain muscles after injury or surgery, preventing muscle wasting and improving strength.",
        },
      ]}
      howItWorks={[
        "Assessment of your condition to determine the most appropriate electrotherapy modality.",
        "Electrodes are placed on the skin over the affected area for targeted treatment.",
        "Precise electrical parameters are set based on your tolerance and therapeutic goals.",
        "Treatment session lasts 15–30 minutes while you relax comfortably.",
        "Post-treatment assessment and home exercise recommendations.",
      ]}
      conditions={[
        "Chronic Pain",
        "Sports Injuries",
        "Post-Surgical Recovery",
        "Frozen Shoulder",
        "Sciatica",
        "Cervical Spondylosis",
        "Carpal Tunnel Syndrome",
        "Arthritis Pain",
        "Muscle Atrophy",
        "Whiplash Injuries",
      ]}
      faqs={[
        {
          question: "Is electrotherapy safe?",
          answer: "Yes, electrotherapy is a safe and well-established treatment modality when administered by a qualified physiotherapist. It is contraindicated only in specific conditions such as presence of pacemakers or certain skin conditions.",
        },
        {
          question: "Does electrotherapy hurt?",
          answer: "Electrotherapy should not be painful. You may feel a tingling or pulsating sensation, which is normal. Dr. Nishmitha adjusts the intensity to ensure comfort while maintaining effectiveness.",
        },
        {
          question: "How long does each session take?",
          answer: "A typical electrotherapy session lasts 15–30 minutes, depending on the modality used and the areas being treated. It is often combined with other physiotherapy treatments.",
        },
        {
          question: "How many sessions do I need?",
          answer: "The number of sessions varies based on your condition. Acute conditions may improve in 5–8 sessions, while chronic conditions may require 10–15 sessions for optimal results.",
        },
      ]}
    />
  );
}