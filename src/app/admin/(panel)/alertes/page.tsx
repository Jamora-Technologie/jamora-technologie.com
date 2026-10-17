import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { TestMailForm } from "@/app/admin/_components/test-mail-form";
import { Card, PageHeading, Pill } from "@/app/admin/_components/ui";
import { verifySession } from "@/lib/server/dal";
import { mailSummary } from "@/lib/server/mailer";

export const metadata: Metadata = { title: "Alertes e-mail" };

function Row({
  name,
  ok,
  value,
  note,
}: {
  name: string;
  ok: boolean;
  value?: string;
  note: string;
}) {
  return (
    <tr className="border-t border-white/8 align-top">
      <td className="py-3 pr-4">
        <code className="text-xs text-white/80">{name}</code>
        <p className="mt-0.5 text-xs text-white/40">{note}</p>
      </td>
      <td className="py-3 pr-4 text-sm text-white/70">
        <span className="break-all">{value || "—"}</span>
      </td>
      <td className="py-3 text-right">
        {ok ? (
          <Check className="ml-auto h-4 w-4 text-brand" aria-label="Défini" />
        ) : (
          <X className="ml-auto h-4 w-4 text-red-300" aria-label="Manquant" />
        )}
      </td>
    </tr>
  );
}

export default async function AlertesPage() {
  await verifySession();
  const mail = mailSummary();
  /* Le mot de passe SMTP n'est jamais affiché : on indique seulement s'il existe. */
  const hasPassword = Boolean(process.env.SMTP_PASS);

  return (
    <>
      <PageHeading
        title="Alertes e-mail"
        subtitle="À chaque nouvelle demande, un e-mail part vers l'adresse ci-dessous. Répondre à cet e-mail écrit directement au visiteur."
      >
        {mail.configured ? <Pill tone="brand">Actives</Pill> : <Pill tone="warn">Désactivées</Pill>}
      </PageHeading>

      <div className="space-y-6">
        <Card title="Configuration du serveur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left">
              <tbody>
                <Row name="SMTP_HOST" ok={Boolean(mail.host)} value={mail.host}
                  note="Serveur de messagerie sortant." />
                <Row name="SMTP_PORT" ok value={mail.port}
                  note="465 (TLS) par défaut, ou 587." />
                <Row name="SMTP_USER" ok={Boolean(mail.user)} value={mail.user}
                  note="Boîte mail qui envoie les alertes." />
                <Row name="SMTP_PASS" ok={hasPassword} value={hasPassword ? "••••••••" : ""}
                  note="Mot de passe de cette boîte." />
                <Row name="NOTIFY_TO" ok={Boolean(mail.to)} value={mail.to}
                  note="Qui reçoit les alertes (plusieurs adresses : séparez par des virgules)." />
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm text-white/50">
            Ces valeurs se règlent dans cPanel, <em>Setup Node.js App</em>, rubrique
            variables d&apos;environnement, puis <em>Restart</em>. Elles ne sont
            jamais stockées dans le code ni modifiables depuis cette page.
          </p>
        </Card>

        <Card
          title="Tester"
          description={
            mail.configured
              ? `Envoie un message de test à ${mail.to}.`
              : "Définissez d'abord SMTP_HOST et NOTIFY_TO."
          }
        >
          <TestMailForm disabled={!mail.configured} />
        </Card>
      </div>
    </>
  );
}
