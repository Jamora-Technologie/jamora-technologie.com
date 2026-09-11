import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { brand, seo } from "@/lib/content";
import { Navbar } from "@/components/site/navbar";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Signature } from "@/components/site/signature";
import { Footer } from "@/components/site/footer";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { StructuredData } from "@/components/site/structured-data";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  /* Base de toutes les URL absolues : canoniques, aperçus sociaux, sitemap. */
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.titre,
    /* Les pages internes complètent ce gabarit au lieu de le répéter. */
    template: "%s - Jamora Technologie",
  },
  description: seo.description,
  keywords: [...seo.motsCles],
  applicationName: brand.fullName,
  authors: [{ name: brand.fullName, url: seo.siteUrl }],
  creator: brand.fullName,
  publisher: brand.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: seo.siteUrl,
    siteName: brand.fullName,
    title: seo.titre,
    description: seo.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${brand.fullName} - ingénierie logicielle et intelligence artificielle`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.titre,
    description: seo.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      /* Autorise les grandes vignettes dans les résultats de recherche. */
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  /* À compléter avec le code fourni par Google Search Console.
     verification: { google: "..." }, */
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${inter.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        {/*
          Les entrées animées sont rendues à opacity:0 côté serveur et ne
          réapparaissent que lorsque Framer Motion démarre. Sans JavaScript,
          la page resterait donc vide : ce filet rétablit la visibilité.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <StructuredData />
        <MotionProvider>
          <SmoothScroll />
          <Navbar />
          {children}
          <Signature />
          <Footer />
          <ScrollToTop />
        </MotionProvider>
      </body>
    </html>
  );
}
