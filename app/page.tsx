import type { Metadata } from "next";
import PageTransition from "./components/PageTransition";
import HomeSections from "./sections/HomeSections";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://physiofix.net/",
  },
};

export default function Home() {
  return (
    <PageTransition>
      <main className="overflow-x-hidden bg-transparent">
        <HomeSections />
      </main>
    </PageTransition>
  );
}
