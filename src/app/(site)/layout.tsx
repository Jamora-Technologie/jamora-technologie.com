import { Navbar } from "@/components/site/navbar";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Signature } from "@/components/site/signature";
import { Footer } from "@/components/site/footer";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { StructuredData } from "@/components/site/structured-data";
import { getSiteSettings } from "@/lib/server/settings";

/**
 * Décor du site public. Les coordonnées viennent des réglages du back-office :
 * la page reste statique, et `revalidatePath` la régénère à chaque
 * enregistrement.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { contact } = await getSiteSettings();

  return (
    <>
      {/*
        Les entrées animées sont rendues à opacity:0 côté serveur et ne
        réapparaissent que lorsque Framer Motion démarre. Sans JavaScript,
        la page resterait donc vide : ce filet rétablit la visibilité.
      */}
      <noscript>
        <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <StructuredData contact={contact} />
      <MotionProvider>
        <SmoothScroll />
        <Navbar />
        {children}
        <Signature />
        <Footer contact={contact} />
        <ScrollToTop />
      </MotionProvider>
    </>
  );
}
