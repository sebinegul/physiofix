import PageTransition from "./components/PageTransition";
import Hero from "./sections/Hero";
import MeetSpecialists from "./sections/MeetSpecialists";
import PopularSearches from "./sections/PopularSearches";
import FindPhysio from "./sections/FindPhysio";
import WhyChooseUs from "./sections/WhyChooseUs";
import Testimonials from "./sections/Testimonials";
import Gallery from "./sections/Gallery";
import Newsletter from "./sections/Newsletter";

export default function Home() {
  return (
    <PageTransition>
      <main className="overflow-x-hidden bg-transparent">
        <Hero />
        <MeetSpecialists />
        <PopularSearches />
        <FindPhysio />
        <WhyChooseUs />
        <Testimonials />
        <Gallery />
        <Newsletter />
      </main>
    </PageTransition>
  );
}
