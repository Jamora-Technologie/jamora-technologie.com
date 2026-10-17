import { NextResponse, type NextRequest } from "next/server";
import { adminBase, adminHost } from "@/lib/admin-path";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/server/session-token";

/**
 * Porte d'entrée du back-office.
 *
 * Trois rôles :
 *  1. Traduire l'adresse publique en route interne. Le back-office est écrit
 *     sous `/admin`, mais peut être exposé sous un segment secret
 *     (ADMIN_PATH) et/ou un sous-domaine (ADMIN_HOST).
 *  2. Faire disparaître le reste : hors de la bonne adresse, le back-office
 *     répond 404, comme s'il n'existait pas.
 *  3. Premier tri sur le cookie de session. C'est un contrôle « optimiste » :
 *     la vraie barrière reste `verifySession()`, appelée par chaque page et
 *     chaque action, car un proxy ne doit jamais être l'unique défense.
 */

/** Route inexistante : y réécrire une requête produit la page 404 du site. */
const NOT_FOUND = "/introuvable-404";

function hostOf(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return raw.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

const underPrefix = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const base = adminBase();
  const configuredHost = adminHost();
  const onAdminHost = configuredHost !== null && hostOf(request) === configuredHost;

  const notFound = () => {
    const url = request.nextUrl.clone();
    url.pathname = NOT_FOUND;
    url.search = "";
    return NextResponse.rewrite(url, { status: 404 });
  };

  /* Sur le sous-domaine, robots.txt interdit tout : il n'a aucune page à indexer. */
  if (onAdminHost && pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const isAdminRequest = underPrefix(pathname, base);

  /* Le sous-domaine ne sert que le back-office. */
  if (onAdminHost && !isAdminRequest) return notFound();

  /* Un sous-domaine dédié est configuré : le domaine public ne sert pas le back-office. */
  if (configuredHost && !onAdminHost && isAdminRequest) return notFound();

  /* Le segment secret est actif : la route interne n'est jamais joignable directement. */
  if (base !== "/admin" && underPrefix(pathname, "/admin")) return notFound();

  /* Tout le reste est le site public, que ce proxy n'a pas à toucher. */
  if (!isAdminRequest) return NextResponse.next();

  const rest = pathname.slice(base.length); // "", "/login", "/messages/…"
  const session = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  const redirectTo = (target: string) => {
    /* `nextUrl.clone()` garde l'hôte et le port réellement demandés. */
    const url = request.nextUrl.clone();
    url.pathname = target;
    url.search = "";
    return NextResponse.redirect(url);
  };

  if (rest === "/login") {
    /* Déjà connecté : inutile de revoir le formulaire. */
    if (session) return redirectTo(base);
  } else if (!session) {
    return redirectTo(`${base}/login`);
  }

  let response: NextResponse;
  if (base === "/admin") {
    response = NextResponse.next();
  } else {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${rest}`;
    response = NextResponse.rewrite(url);
  }

  /* Rien de tout cela n'a sa place dans un moteur de recherche ni dans un
     cache partagé. */
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  /* Exclut ce que le proxy n'a aucune raison de voir : le code et les
     fichiers statiques de Next, et les images servies telles quelles. */
  matcher: ["/((?!_next/|.*\\.(?:png|jpe?g|webp|svg|ico|mp4|woff2?)$).*)"],
};
