"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

/** Bouton d'envoi qui demande confirmation avant d'exécuter l'action. */
export function ConfirmButton({
  message,
  children,
}: {
  message: string;
  children: ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className="inline-flex items-center gap-2 rounded-full border border-red-400/40 px-5 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
