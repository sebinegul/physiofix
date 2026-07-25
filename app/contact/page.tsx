'use client';
import { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import { Sparkles, MapPin, Mail, Phone, Send, CheckCircle2 } from "lucide-react";

interface ContactContent {
  contact_address?: string;
  contact_phone?: string;
  contact_email?: string;
}

const DEFAULT_CONTACT = {
  contact_address: '30, Sai Krupa Complex, Subba Raju Layout, BK Circle, Kothanur Dinne Main Road, JP Nagar 8th Phase, Bengaluru – 560076',
  contact_phone: '+91-8151912525',
  contact_email: 'physiofix2525@gmail.com',
} as const;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [contactInfo, setContactInfo] = useState<ContactContent>(DEFAULT_CONTACT);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) setContactInfo((prev) => ({ ...prev, ...d.data }));
      })
      .catch(() => {});
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const phoneRegex = /^[\d\s\-+()]{7,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Please provide a valid phone number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email address.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Please describe your concern in at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setServerMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setServerMessage(data.message);
      setFormData({ name: "", phone: "", email: "", message: "" });
      setErrors({});
    } catch {
      setStatus("error");
      setServerMessage("Network error. Please check your connection and try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen pt-28 pb-20">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Contact</p>
            <h1 className="mb-5 text-4xl font-black leading-[1.15] tracking-tight text-slate-950 md:text-5xl">
              Book your consultation with <GradientText>Dr.Nishmitha</GradientText>.
            </h1>
            <p className="text-lg leading-8 text-slate-600">Whether you are seeking care for pain, mobility, sports recovery, or post-surgery rehabilitation, a prompt response is available for appointment requests and general enquiries.</p>
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <ScrollReveal direction="left">
              <div className="section-shell p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Clinic details</p>
                    <p className="text-sm text-slate-600">Bangalore-based physiotherapy care</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-blue-100/60 bg-blue-50/30 p-4 transition hover:border-blue-300">
                    <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Clinic Address</p>
                      <p className="text-sm leading-7 text-slate-600">{contactInfo.contact_address || DEFAULT_CONTACT.contact_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-blue-100/60 bg-blue-50/30 p-4 transition hover:border-blue-300">
                    <Phone className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <a href={`tel:${(contactInfo.contact_phone ?? DEFAULT_CONTACT.contact_phone).replace(/\D/g, '')}`} className="text-sm leading-7 text-slate-600 hover:text-blue-600">{contactInfo.contact_phone ?? DEFAULT_CONTACT.contact_phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-blue-100/60 bg-blue-50/30 p-4 transition hover:border-blue-300">
                    <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <a href={`mailto:${contactInfo.contact_email || DEFAULT_CONTACT.contact_email}`} className="text-sm leading-7 text-slate-600 hover:text-blue-600">{contactInfo.contact_email || DEFAULT_CONTACT.contact_email}</a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_24px_90px_rgba(2,6,23,0.22)]">
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
                <h2 className="relative mb-2 text-2xl font-semibold">Request an appointment</h2>
                <p className="relative mb-6 text-sm leading-7 text-slate-300">Share your details and a brief summary of your concern. A reply will be shared with the best next step for your care.</p>

                {status === "success" ? (
                  <div className="relative flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-sm text-blue-300">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    {serverMessage}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          required
                          minLength={2}
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                          placeholder="Your name"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                          placeholder="Phone number"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Email address"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>
                    <div>
                      <textarea
                        required
                        minLength={10}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Tell us about your pain, injury, or goal for recovery"
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                    </div>

                    {status === "error" && (
                      <p className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400">{serverMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {status === "loading" ? "Sending..." : "Send enquiry"}
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}