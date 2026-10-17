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
import { getSiteSettings } from "@/lib/server/settings";

/* Filet de sécurité : si le back-office tourne dans un autre processus que
   le site, sa revalidation à la demande ne l'atteint pas. Le site se
   régénère alors de lui-même, au plus une fois par minute. */
export const revalidate = 60;

export default async function Home() {
  const { stats, experience } = await getSiteSettings();

  return (
    <main className="flex-1">
      <ProductsData />
      <Hero experience={experience} />
      <Stats stats={stats} />
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
