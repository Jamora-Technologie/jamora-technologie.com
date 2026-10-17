import type { Metadata } from "next";
import { contactPage, seo } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { getSiteSettings } from "@/lib/server/settings";

export const metadata: Metadata = {
  /* Le gabarit du layout ajoute « - Jamora Technologie ». */
  title: "Contact",
  description: seo.pages.contact.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: seo.pages.contact.titre,
    description: seo.pages.contact.description,
    url: `${seo.siteUrl}/contact`,
  },
};

/* Filet de sécurité : si le back-office tourne dans un autre processus que
   le site, sa revalidation à la demande ne l'atteint pas. Le site se
   régénère alors de lui-même, au plus une fois par minute. */
export const revalidate = 60;

export default async function ContactPage() {
  const { contact } = await getSiteSettings();
  const infos = [
    { label: contactPage.labels.email, value: contact.email, href: `mailto:${contact.email}` },
    { label: contactPage.labels.phone, value: contact.phone, href: contact.phoneHref },
    { label: contactPage.labels.location, value: contact.location, href: null },
    { label: contactPage.delai.label, value: contactPage.delai.value, href: null },
  ];

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow={contactPage.eyebrow}
        titleLead={contactPage.titleLead}
        titleHighlight={contactPage.titleHighlight}
        body={contactPage.body}
      />

      <section className="px-4 pb-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.6fr_1fr]">
          <ContactForm />

          <aside className="flex flex-col gap-4">
            {infos.map((info) => (
              <div
                key={info.label}
                className="rounded-3xl border border-white/12 bg-white/[0.03] p-7"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                  {info.label}
                </p>
                {info.href ? (
                  <a
                    href={info.href}
                    className="mt-2 inline-block text-lg text-white/85 transition-colors hover:text-brand"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="mt-2 text-lg text-white/85">{info.value}</p>
                )}
              </div>
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}
