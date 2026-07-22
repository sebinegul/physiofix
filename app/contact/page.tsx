import PageTransition from "../components/PageTransition";
import ScrollReveal from "../components/ui/ScrollReveal";
import GradientText from "../components/ui/GradientText";
import { Sparkles, MapPin, Mail, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="min-h-screen pt-28 pb-20">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Contact</p>
            <h1 className="mb-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Book your consultation with <GradientText>Dr. Nishmitha</GradientText>.
            </h1>
            <p className="text-lg leading-8 text-slate-600">Whether you are seeking care for pain, mobility, sports recovery, or post-surgery rehabilitation, a prompt response is available for appointment requests and general enquiries.</p>
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <ScrollReveal direction="left">
              <div className="section-shell p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-teal-500/10 p-3 text-teal-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Clinic details</p>
                    <p className="text-sm text-slate-600">Bangalore-based physiotherapy care</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-teal-100/60 bg-teal-50/30 p-4 transition hover:border-teal-300">
                    <MapPin className="mt-0.5 h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Clinic Address</p>
                      <p className="text-sm leading-7 text-slate-600">30, Sai Krupa Complex, Subba Raju Layout, BK Circle, Kothanur Dinne Main Road, JP Nagar 8th Phase, Bengaluru – 560076</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-teal-100/60 bg-teal-50/30 p-4 transition hover:border-teal-300">
                    <Phone className="mt-0.5 h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <a href="tel:+918151912525" className="text-sm leading-7 text-slate-600 hover:text-teal-600">+91-8151912525</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-teal-100/60 bg-teal-50/30 p-4 transition hover:border-teal-300">
                    <Mail className="mt-0.5 h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <a href="mailto:physiofix2525@gmail.com" className="text-sm leading-7 text-slate-600 hover:text-teal-600">physiofix2525@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <div className="relative overflow-hidden rounded-[2rem] border border-teal-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_24px_90px_rgba(2,6,23,0.22)]">
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-500/15 blur-3xl" />
                <h2 className="relative mb-2 text-2xl font-semibold">Request an appointment</h2>
                <p className="relative mb-6 text-sm leading-7 text-slate-300">Share your details and a brief summary of your concern. A reply will be shared with the best next step for your care.</p>

                <form className="relative space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20" placeholder="Your name" />
                    <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20" placeholder="Phone number" />
                  </div>
                  <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20" placeholder="Email address" />
                  <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20" placeholder="Tell us about your pain, injury, or goal for recovery" />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg">
                    Send enquiry <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
