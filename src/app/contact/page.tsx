import type { Metadata } from "next";
import { contactPage } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contact — Jamora Technologie",
  description:
    "Parlez-nous de votre projet. Nous revenons vers vous sous 48 heures.",
};

export default function ContactPage() {
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
            {contactPage.infos.map((info) => (
              <div
                key={info.label}
                className="rounded-3xl border border-white/12 bg-white/[0.03] p-7"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                  {info.label}
                </p>
                <p className="mt-2 text-lg text-white/85">{info.value}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}
