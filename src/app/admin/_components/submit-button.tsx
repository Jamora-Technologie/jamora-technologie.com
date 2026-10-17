"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-brand text-brand-foreground hover:brightness-110",
  ghost: "border border-white/15 text-white/80 hover:border-white/35 hover:text-white",
  danger: "border border-red-400/40 text-red-300 hover:bg-red-400/10",
} as const;

/** Bouton d'envoi : se désactive et affiche un indicateur pendant l'action. */
export function SubmitButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
