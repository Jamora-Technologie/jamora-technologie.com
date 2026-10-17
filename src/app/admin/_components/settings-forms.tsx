"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import {
  saveContact,
  saveExperience,
  saveStats,
  type SettingsState,
} from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/_components/submit-button";
import { inputClass, labelClass } from "@/app/admin/_components/ui";
import type {
  ContactSettings,
  ExperienceSetting,
  StatSetting,
} from "@/lib/server/settings";

const initial: SettingsState = { status: "idle" };

function Field({
  label,
  name,
  defaultValue,
  error,
  type = "text",
  inputMode,
  maxLength,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  error?: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        defaultValue={defaultValue}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-err` : undefined}
        className={inputClass}
      />
      {error ? (
        <p id={`${name}-err`} role="alert" className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-white/35">{hint}</p>
      ) : null}
    </div>
  );
}

function Footer({ state }: { state: SettingsState }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <SubmitButton>Enregistrer</SubmitButton>
      {state.status === "success" && (
        <p role="status" className="inline-flex items-center gap-2 text-sm text-brand">
          <Check className="h-4 w-4" /> Enregistré : le site est à jour.
        </p>
      )}
      {state.status === "error" && state.errors?._ && (
        <p role="alert" className="text-sm text-red-300">{state.errors._}</p>
      )}
    </div>
  );
}

/** Valeur à afficher : la saisie renvoyée sur erreur, sinon la valeur courante. */
const pick = (state: SettingsState, key: string, fallback: string | number) =>
  state.values?.[key] ?? fallback;

export function ContactForm({ current }: { current: ContactSettings }) {
  const [state, action] = useActionState(saveContact, initial);
  const e = state.errors ?? {};

  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail public" name="email" type="email" inputMode="email"
          defaultValue={pick(state, "email", current.email)} error={e.email}
          hint="Affiché sur le site. Les alertes, elles, se règlent dans « Alertes e-mail »." />
        <Field label="Téléphone" name="phone" type="tel" inputMode="tel"
          defaultValue={pick(state, "phone", current.phone)} error={e.phone}
          hint="Le lien d'appel est généré automatiquement." />
        <div className="sm:col-span-2">
          <Field label="Localisation" name="location" maxLength={80}
            defaultValue={pick(state, "location", current.location)} error={e.location} />
        </div>
      </div>
      <Footer state={state} />
    </form>
  );
}

export function StatsForm({ current }: { current: StatSetting[] }) {
  const [state, action] = useActionState(saveStats, initial);
  const e = state.errors ?? {};

  return (
    <form action={action}>
      <div className="space-y-5">
        {current.map((stat, i) => (
          <fieldset
            key={i}
            className="grid gap-4 rounded-xl border border-white/8 p-4 sm:grid-cols-[8rem_6rem_1fr]"
          >
            <legend className="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Chiffre {i + 1}
            </legend>
            <Field label="Valeur" name={`value${i}`} inputMode="numeric"
              defaultValue={pick(state, `value${i}`, stat.value)} error={e[`value${i}`]} />
            <Field label="Suffixe" name={`suffix${i}`} maxLength={4}
              defaultValue={pick(state, `suffix${i}`, stat.suffix)} error={e[`suffix${i}`]}
              hint="+, M+…" />
            <Field label="Libellé" name={`label${i}`} maxLength={60}
              defaultValue={pick(state, `label${i}`, stat.label)} error={e[`label${i}`]} />
          </fieldset>
        ))}
      </div>
      <Footer state={state} />
    </form>
  );
}

export function ExperienceForm({ current }: { current: ExperienceSetting }) {
  const [state, action] = useActionState(saveExperience, initial);
  const e = state.errors ?? {};

  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
        <Field label="Valeur" name="value" maxLength={12}
          defaultValue={pick(state, "value", current.value)} error={e.value}
          hint="Par ex. « 4 ans »." />
        <Field label="Libellé" name="label" maxLength={60}
          defaultValue={pick(state, "label", current.label)} error={e.label}
          hint="Par ex. « d'ingénierie cumulée »." />
      </div>
      <Footer state={state} />
    </form>
  );
}
