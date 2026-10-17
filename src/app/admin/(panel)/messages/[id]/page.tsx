import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, Archive, ArchiveRestore, ArrowLeft, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { changeStatus, removeMessage } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/_components/confirm-button";
import { MarkAsRead } from "@/app/admin/_components/mark-as-read";
import { SubmitButton } from "@/app/admin/_components/submit-button";
import { Card, Pill, formatDate } from "@/app/admin/_components/ui";
import { adminUrl } from "@/lib/admin-path";
import { verifySession } from "@/lib/server/dal";
import { getMessage } from "@/lib/server/messages";

export const metadata: Metadata = { title: "Demande" };

export default async function MessagePage({
  params,
}: PageProps<"/admin/messages/[id]">) {
  await verifySession();
  const { id } = await params;
  const m = await getMessage(id);
  if (!m) notFound();

  const reply = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`;

  return (
    <>
      {/* À l'ouverture d'une demande neuve, on la marque lue. */}
      {m.status === "new" && <MarkAsRead id={m.id} />}

      <Link
        href={adminUrl()}
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Toutes les demandes
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="max-w-3xl break-words font-heading text-2xl font-semibold text-white sm:text-3xl">
          {m.subject}
        </h1>
        {m.status === "archived" ? (
          <Pill>Archivée</Pill>
        ) : m.status === "new" ? (
          <Pill tone="brand">Nouvelle</Pill>
        ) : (
          <Pill>Lue</Pill>
        )}
      </div>

      {m.notified === "failed" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            L&apos;alerte e-mail de cette demande n&apos;a pas pu partir
            {m.notifyError ? <> : <em>{m.notifyError}</em></> : "."}{" "}
            <Link href={adminUrl("/alertes")} className="underline underline-offset-2">
              Vérifier la configuration
            </Link>
            .
          </span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
        <Card>
          <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-white/85">
            {m.message}
          </p>
        </Card>

        <div className="space-y-6">
          <Card title="Expéditeur">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Nom</dt>
                <dd className="mt-1 break-words text-white">{m.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-white/40">E-mail</dt>
                <dd className="mt-1 break-all">
                  <a href={`mailto:${m.email}`} className="text-brand hover:underline">
                    {m.email}
                  </a>
                </dd>
              </div>
              {m.company && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Entreprise</dt>
                  <dd className="mt-1 break-words text-white">{m.company}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Reçue le</dt>
                <dd className="mt-1 text-white">
                  <time dateTime={m.createdAt}>{formatDate(m.createdAt)}</time>
                </dd>
              </div>
            </dl>
          </Card>

          <div className="flex flex-col gap-3">
            <a
              href={reply}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition hover:brightness-110"
            >
              <Reply className="h-4 w-4" /> Répondre par e-mail
            </a>

            <form action={changeStatus}>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="status" value={m.status === "new" ? "read" : "new"} />
              <SubmitButton variant="ghost" className="w-full">
                {m.status === "new" ? (
                  <><MailOpen className="h-4 w-4" /> Marquer comme lue</>
                ) : (
                  <><Mail className="h-4 w-4" /> Marquer comme non lue</>
                )}
              </SubmitButton>
            </form>

            <form action={changeStatus}>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="status" value={m.status === "archived" ? "read" : "archived"} />
              <SubmitButton variant="ghost" className="w-full">
                {m.status === "archived" ? (
                  <><ArchiveRestore className="h-4 w-4" /> Désarchiver</>
                ) : (
                  <><Archive className="h-4 w-4" /> Archiver</>
                )}
              </SubmitButton>
            </form>

            <form action={removeMessage}>
              <input type="hidden" name="id" value={m.id} />
              <ConfirmButton message="Supprimer définitivement cette demande ? Cette action est irréversible.">
                <Trash2 className="h-4 w-4" /> Supprimer
              </ConfirmButton>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
