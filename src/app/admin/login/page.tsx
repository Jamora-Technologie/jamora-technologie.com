import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import logoMark from "@/assets/img/logo/logo-mark.png";
import { adminUrl } from "@/lib/admin-path";
import { brand } from "@/lib/content";
import { getSession } from "@/lib/server/dal";
import { LoginForm } from "@/app/admin/_components/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  /* Le proxy gère déjà ce cas ; on le double ici car la page doit rester
     correcte même rendue seule. */
  if (await getSession()) redirect(adminUrl());

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image src={logoMark} alt="" className="h-10 w-auto" />
          <div>
            <h1 className="font-heading text-xl font-semibold text-white">
              Back-office
            </h1>
            <p className="mt-1 text-sm text-white/50">{brand.fullName}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-[#0d0d0d] p-7 ring-1 ring-white/10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
