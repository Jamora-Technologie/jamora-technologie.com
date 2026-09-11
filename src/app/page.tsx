import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { FeaturedProjects } from "@/components/site/featured-projects";
import { WordsBand, TagsBand } from "@/components/site/marquee";
import { Team } from "@/components/site/team";
import { Press } from "@/components/site/press";
import { Contact } from "@/components/site/contact";
import { ProductsData } from "@/components/site/products-data";

export default function Home() {
  return (
    <main className="flex-1">
      <ProductsData />
      <Hero />
      <Stats />
      <About />
      <Services />
      <FeaturedProjects />
      <WordsBand />
      <Team />
      <TagsBand />
      <Press />
      <Contact />
    </main>
  );
}
