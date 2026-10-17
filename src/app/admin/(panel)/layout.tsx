import Image from "next/image";
import { ExternalLink, LogOut } from "lucide-react";
import logoMark from "@/assets/img/logo/logo-mark.png";
import { logout } from "@/app/admin/actions";
import { adminHost, adminUrl } from "@/lib/admin-path";
import { seo } from "@/lib/content";
import { AdminNav } from "@/app/admin/_components/admin-nav";
import { countNew } from "@/lib/server/messages";
import { verifySession } from "@/lib/server/dal";

/**
 * Coque du back-office. La vérification de session est refaite ici ET dans
 * chaque page : un layout n'est pas réévalué à chaque navigation, il ne peut
 * donc pas servir de seule barrière.
 */
export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await verifySession();
  const nouvelles = await countNew();
  /* Sur le sous-domaine, « / » est introuvable : le site public a son adresse propre. */
  const siteHref = adminHost() ? seo.siteUrl : "/";

  return (
    <>
      <header className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 pt-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image src={logoMark} alt="" className="h-7 w-auto" />
            <span className="font-heading text-base font-semibold text-white">
              Back-office
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a
              href={siteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/55 transition-colors hover:text-white"
            >
              Voir le site <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <span className="hidden text-white/25 sm:inline">|</span>
            <span className="hidden max-w-[16rem] truncate text-white/40 sm:inline">
              {session.sub}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-white/70 transition-colors hover:border-white/35 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </button>
            </form>
          </div>
          <div className="w-full">
            <AdminNav
              base={adminUrl()}
              items={[
                { href: adminUrl(), label: "Demandes", badge: nouvelles },
                { href: adminUrl("/contenu"), label: "Contenu du site" },
                { href: adminUrl("/alertes"), label: "Alertes e-mail" },
              ]}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>
    </>
  );
}
