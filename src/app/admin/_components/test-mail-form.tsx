"use client";

import { useActionState } from "react";
import { AlertCircle, Check, Send } from "lucide-react";
import { envoyerTest, type TestMailState } from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/_components/submit-button";

const initial: TestMailState = { status: "idle" };

export function TestMailForm({ disabled }: { disabled: boolean }) {
  const [state, action] = useActionState(envoyerTest, initial);

  return (
    <form action={action} className="space-y-4">
      {disabled ? (
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/40"
        >
          <Send className="h-4 w-4" /> Envoyer un e-mail de test
        </button>
      ) : (
        <SubmitButton>
          <Send className="h-4 w-4" /> Envoyer un e-mail de test
        </SubmitButton>
      )}

      {state.status === "success" && (
        <p role="status" className="flex items-start gap-2 text-sm text-brand">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          E-mail envoyé. Vérifiez votre boîte de réception (et les indésirables).
        </p>
      )}
      {state.status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </p>
      )}
    </form>
  );
}
