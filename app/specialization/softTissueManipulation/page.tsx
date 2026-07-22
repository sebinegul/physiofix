import PageTransition from "../../components/PageTransition";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SoftTissueManipulationPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(135deg,_#f8fbff_0%,_#eef7ff_45%,_#ffffff_100%)] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Specialized treatment</p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Soft Tissue Manipulation</h1>
          <p className="text-lg leading-8 text-slate-600">
            Soft tissue manipulation targets tight muscles and connective tissue to improve flexibility, reduce tension and support recovery after strain or overuse.
          </p>
        </div>
      </main>
    </PageTransition>
  );
}
