"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/_components/submit-button";
import { inputClass, labelClass } from "@/app/admin/_components/ui";

const initial: LoginState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(login, initial);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full py-3">Se connecter</SubmitButton>
    </form>
  );
}
