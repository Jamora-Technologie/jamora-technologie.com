import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, BellOff, Inbox } from "lucide-react";
import { adminUrl } from "@/lib/admin-path";
import { verifySession } from "@/lib/server/dal";
import { listMessages, type Message } from "@/lib/server/messages";
import { isMailConfigured } from "@/lib/server/mailer";
import {
  Pill,
  PageHeading,
  formatDate,
} from "@/app/admin/_components/ui";

export const metadata: Metadata = { title: "Demandes" };

const FILTERS = [
  { key: "en-cours", label: "En cours" },
  { key: "nouvelles", label: "Nouvelles" },
  { key: "archivees", label: "Archivées" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function matches(filter: FilterKey, m: Message): boolean {
  if (filter === "nouvelles") return m.status === "new";
  if (filter === "archivees") return m.status === "archived";
  return m.status !== "archived";
}

export default async function DemandesPage({
  searchParams,
}: PageProps<"/admin">) {
  await verifySession();

  const { filtre } = await searchParams;
  const filter: FilterKey =
    FILTERS.find((f) => f.key === filtre)?.key ?? "en-cours";

  const all = await listMessages();
  const visible = all.filter((m) => matches(filter, m));
  const counts = Object.fromEntries(
    FILTERS.map((f) => [f.key, all.filter((m) => matches(f.key, m)).length]),
  ) as Record<FilterKey, number>;

  return (
    <>
      <PageHeading
        title="Demandes"
        subtitle="Les messages envoyés depuis le formulaire de la page Contact."
      />

      {!isMailConfigured() && (
        <Link
          href={adminUrl("/alertes")}
          className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100 transition-colors hover:bg-amber-400/15"
        >
          <BellOff className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong className="font-semibold">Alertes e-mail désactivées.</strong>{" "}
            Les demandes sont bien enregistrées ici, mais vous ne recevrez pas
            de notification. Cliquez pour configurer.
          </span>
        </Link>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "en-cours" ? adminUrl() : adminUrl(`?filtre=${f.key}`)}
            aria-current={filter === f.key ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-brand text-brand-foreground"
                : "border border-white/12 text-white/65 hover:border-white/30 hover:text-white"
            }`}
          >
            {f.label}
            <span className="opacity-70">{counts[f.key]}</span>
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#0d0d0d] px-6 py-16 text-center ring-1 ring-white/10">
          <Inbox className="h-8 w-8 text-white/30" />
          <p className="font-heading text-lg font-medium text-white">
            Aucune demande ici
          </p>
          <p className="max-w-sm text-sm text-white/50">
            Les messages envoyés depuis la page Contact du site apparaîtront
            dans cette liste.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-white/8 overflow-hidden rounded-2xl bg-[#0d0d0d] ring-1 ring-white/10">
          {visible.map((m) => (
            <li key={m.id}>
              <Link
                href={adminUrl(`/messages/${m.id}`)}
                className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04] sm:px-6"
              >
                <span
                  aria-label={m.status === "new" ? "Non lue" : undefined}
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                    m.status === "new" ? "bg-brand" : "bg-transparent"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p
                      className={`truncate text-sm ${
                        m.status === "new"
                          ? "font-semibold text-white"
                          : "font-medium text-white/80"
                      }`}
                    >
                      {m.name}
                      {m.company && (
                        <span className="font-normal text-white/40"> · {m.company}</span>
                      )}
                    </p>
                    <time dateTime={m.createdAt} className="shrink-0 text-xs text-white/40">
                      {formatDate(m.createdAt)}
                    </time>
                  </div>
                  <p
                    className={`mt-1 truncate text-sm ${
                      m.status === "new" ? "text-white" : "text-white/65"
                    }`}
                  >
                    {m.subject}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-white/40">
                    {m.message.replace(/\s+/g, " ")}
                  </p>
                  {(m.notified === "failed" || m.status === "archived") && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.notified === "failed" && (
                        <Pill tone="warn">
                          <AlertTriangle className="mr-1 h-3 w-3" /> Alerte e-mail non envoyée
                        </Pill>
                      )}
                      {m.status === "archived" && <Pill>Archivée</Pill>}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
