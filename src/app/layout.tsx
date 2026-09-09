import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Signature } from "@/components/site/signature";
import { Footer } from "@/components/site/footer";

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
  title: "Jamora Technologie — Agence créative & digitale",
  description:
    "Du développement web au branding, Jamora Technologie conçoit des stratégies innovantes qui font grandir votre marque.",
  openGraph: {
    title: "Jamora Technologie — Agence créative & digitale",
    description:
      "Du développement web au branding, nous transformons vos idées en expériences digitales remarquables.",
    type: "website",
    locale: "fr_SN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${inter.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        {children}
        <Signature />
        <Footer />
      </body>
    </html>
  );
}
