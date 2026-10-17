import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { resetSettings } from "@/app/admin/actions";
import {
  ContactForm,
  ExperienceForm,
  StatsForm,
} from "@/app/admin/_components/settings-forms";
import { SubmitButton } from "@/app/admin/_components/submit-button";
import { Card, PageHeading, Pill } from "@/app/admin/_components/ui";
import { verifySession } from "@/lib/server/dal";
import {
  customizedSections,
  getSiteSettings,
  type SectionKey,
} from "@/lib/server/settings";

export const metadata: Metadata = { title: "Contenu du site" };

/** Bouton « rétablir » + pastille d'état d'une section. */
function SectionState({
  section,
  customized,
}: {
  section: SectionKey;
  customized: boolean;
}) {
  if (!customized) return <Pill>Valeurs d&apos;origine</Pill>;
  return (
    <div className="flex items-center gap-3">
      <Pill tone="brand">Modifié</Pill>
      <form action={resetSettings}>
        <input type="hidden" name="section" value={section} />
        <SubmitButton variant="ghost" className="px-3.5 py-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Rétablir
        </SubmitButton>
      </form>
    </div>
  );
}

export default async function ContenuPage() {
  await verifySession();
  const [settings, customized] = await Promise.all([
    getSiteSettings(),
    customizedSections(),
  ]);
  const has = (key: SectionKey) => customized.includes(key);

  return (
    <>
      <PageHeading
        title="Contenu du site"
        subtitle="Modifiez ici les informations qui changent le plus souvent. L'enregistrement met le site public à jour immédiatement."
      />

      <div className="space-y-6">
        <Card
          title="Coordonnées"
          description="Pied de page, page Contact et données lues par Google."
          aside={<SectionState section="contact" customized={has("contact")} />}
        >
          <ContactForm current={settings.contact} />
        </Card>

        <Card
          title="Chiffres clés"
          description="Les quatre compteurs sous l'en-tête de la page d'accueil."
          aside={<SectionState section="stats" customized={has("stats")} />}
        >
          <StatsForm current={settings.stats} />
        </Card>

        <Card
          title="Expérience (en-tête)"
          description="La mention « 4 ans d'ingénierie cumulée » au-dessus de la page d'accueil."
          aside={<SectionState section="experience" customized={has("experience")} />}
        >
          <ExperienceForm current={settings.experience} />
        </Card>
      </div>
    </>
  );
}
