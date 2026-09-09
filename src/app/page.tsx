import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { WordsBand, TagsBand } from "@/components/site/marquee";
import { Team } from "@/components/site/team";
import { Testimonials } from "@/components/site/testimonials";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Stats />
      <About />
      <Services />
      <WordsBand />
      <Team />
      <Testimonials />
      <TagsBand />
      <Contact />
      <Footer />
    </main>
  );
}
