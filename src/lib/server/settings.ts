import "server-only";
import { cache } from "react";
import { brand, hero, stats as defaultStats } from "@/lib/content";
import { readCollection, updateCollection } from "@/lib/server/store";
import { clean, isEmail } from "@/lib/server/validation";

/**
 * Réglages modifiables depuis le back-office.
 *
 * `content.ts` reste la source des valeurs PAR DÉFAUT ; `data/settings.json`
 * ne stocke que les écarts. Conséquence utile : « rétablir » une section
 * revient à supprimer sa clé, et un fichier absent ou vide donne exactement
 * le site actuel.
 */

export type ContactSettings = {
  email: string;
  phone: string;
  location: string;
};

export type StatSetting = { value: number; suffix: string; label: string };

export type ExperienceSetting = { value: string; label: string };

export type SiteSettings = {
  contact: ContactSettings & { phoneHref: string };
  stats: StatSetting[];
  experience: ExperienceSetting;
};

export type SectionKey = "contact" | "stats" | "experience";

type Overrides = {
  contact?: ContactSettings;
  stats?: StatSetting[];
  experience?: ExperienceSetting;
};

const FILE = "settings.json";

/** `tel:` n'accepte ni espaces ni séparateurs : on ne garde que + et chiffres. */
export function toPhoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function defaultSettings(): SiteSettings {
  return {
    contact: {
      email: brand.email,
      phone: brand.phone,
      location: brand.location,
      phoneHref: toPhoneHref(brand.phone),
    },
    stats: defaultStats.map((s) => ({ ...s })),
    experience: {
      value: hero.experienceValue,
      label: hero.experienceLabel,
    },
  };
}

/** Lecture mémoïsée le temps d'un rendu : layout et page partagent l'appel. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const defaults = defaultSettings();
  const overrides = await readCollection<Overrides>(FILE, {});

  /* Chaque section est revalidée à la lecture : un fichier édité à la main
     avec une valeur absurde ne doit jamais casser le rendu du site. */
  const contact = overrides.contact
    ? validateContact(overrides.contact).data
    : null;
  const stats = overrides.stats ? validateStats(overrides.stats).data : null;
  const experience = overrides.experience
    ? validateExperience(overrides.experience).data
    : null;

  return {
    contact: contact
      ? { ...contact, phoneHref: toPhoneHref(contact.phone) }
      : defaults.contact,
    stats: stats ?? defaults.stats,
    experience: experience ?? defaults.experience,
  };
});

/* ------------------------------------------------------------------ */
/* Validation : chaque fonction renvoie soit les données nettoyées, soit */
/* des erreurs par champ, au format attendu par les formulaires.        */
/* ------------------------------------------------------------------ */

export type FieldErrors = Record<string, string>;
type Validation<T> = { data: T | null; errors: FieldErrors };

export function validateContact(input: unknown): Validation<ContactSettings> {
  const raw = (input ?? {}) as Record<string, unknown>;
  const data: ContactSettings = {
    email: clean(raw.email),
    phone: clean(raw.phone),
    location: clean(raw.location),
  };
  const errors: FieldErrors = {};

  if (!isEmail(data.email)) errors.email = "Adresse e-mail invalide.";
  const digits = data.phone.replace(/\D/g, "").length;
  if (!/^[\d\s+().-]+$/.test(data.phone) || digits < 8 || digits > 15) {
    errors.phone = "Numéro invalide (8 à 15 chiffres, par ex. +221 78 000 00 00).";
  }
  if (data.location.length < 2 || data.location.length > 80) {
    errors.location = "Entre 2 et 80 caractères.";
  }
  return { data: Object.keys(errors).length ? null : data, errors };
}

export function validateStats(input: unknown): Validation<StatSetting[]> {
  const list = Array.isArray(input) ? input : [];
  const errors: FieldErrors = {};
  const data: StatSetting[] = [];

  if (list.length !== 4) {
    return { data: null, errors: { _: "Quatre chiffres sont attendus." } };
  }
  list.forEach((item, i) => {
    const raw = (item ?? {}) as Record<string, unknown>;
    const value = Number(clean(raw.value).replace(/\s/g, ""));
    const suffix = clean(raw.suffix);
    const label = clean(raw.label);
    if (!Number.isInteger(value) || value < 0 || value > 999_999_999) {
      errors[`value${i}`] = "Nombre entier positif.";
    }
    if (suffix.length > 4) errors[`suffix${i}`] = "4 caractères maximum.";
    if (label.length < 2 || label.length > 60) {
      errors[`label${i}`] = "Entre 2 et 60 caractères.";
    }
    data.push({ value, suffix, label });
  });
  return { data: Object.keys(errors).length ? null : data, errors };
}

export function validateExperience(
  input: unknown,
): Validation<ExperienceSetting> {
  const raw = (input ?? {}) as Record<string, unknown>;
  const data: ExperienceSetting = {
    value: clean(raw.value),
    label: clean(raw.label),
  };
  const errors: FieldErrors = {};
  if (data.value.length < 1 || data.value.length > 12) {
    errors.value = "Entre 1 et 12 caractères (par ex. « 4 ans »).";
  }
  if (data.label.length < 2 || data.label.length > 60) {
    errors.label = "Entre 2 et 60 caractères.";
  }
  return { data: Object.keys(errors).length ? null : data, errors };
}

/* ------------------------------------------------------------------ */
/* Écriture                                                            */
/* ------------------------------------------------------------------ */

export function saveSection<K extends SectionKey>(
  key: K,
  value: NonNullable<Overrides[K]>,
): Promise<void> {
  return updateCollection<Overrides>(FILE, {}, (current) => ({
    next: { ...current, [key]: value },
    result: undefined,
  }));
}

/** Sections qui s'écartent des valeurs par défaut (pour l'indiquer dans l'écran). */
export async function customizedSections(): Promise<SectionKey[]> {
  const overrides = await readCollection<Overrides>(FILE, {});
  return (["contact", "stats", "experience"] as const).filter(
    (key) => overrides[key] !== undefined,
  );
}

export function resetSection(key: SectionKey): Promise<void> {
  return updateCollection<Overrides>(FILE, {}, (current) => {
    const next = { ...current };
    delete next[key];
    return { next, result: undefined };
  });
}
