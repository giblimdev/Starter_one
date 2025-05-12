// middleware.ts
// Ce middleware s'exécute avant le rendu des pages correspondantes.
// Il vérifie si l'utilisateur est authentifié avant d'autoriser l'accès aux routes protégées.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
//import { auth } from '@/lib/auth'; // Si vous avez besoin de la configuration auth complète ici

export async function middleware(request: NextRequest) {
  // Récupère le cookie de session en utilisant l'utilitaire de BetterAuth.
  // Assurez-vous que les options (nom du cookie, préfixe) correspondent à votre configuration BetterAuth.
  const sessionCookie = getSessionCookie(request, {
    // Si vous avez personnalisé le nom du cookie dans votre configuration BetterAuth,
    // spécifiez-le ici. Par exemple :
    // cookieName: "mon_app.session_token",
    // cookiePrefix: "mon_app", // Si vous utilisez un préfixe
  });

  const { pathname } = request.nextUrl;

  // Si l'utilisateur essaie d'accéder à une route protégée (par exemple, /user/dashboard)
  // et qu'il n'y a pas de cookie de session, redirigez-le vers la page de connexion.
  if (!sessionCookie) {
    // L'URL de la page de connexion. Adaptez si nécessaire.
    const loginUrl = new URL("/auth/login", request.url);
    // Vous pouvez ajouter un paramètre `callbackUrl` pour rediriger l'utilisateur après la connexion.
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est authentifié (cookie de session présent),
  // vous pourriez vouloir vérifier la validité de la session en appelant votre API
  // ou en utilisant une fonction de BetterAuth si disponible directement dans le middleware
  // pour les versions plus récentes de Next.js qui supportent le runtime Node.js dans le middleware.
  // Pour l'instant, la présence du cookie est notre première vérification.
  // La validation complète de la session sera faite dans la page elle-même (Server Component).

  // Si le cookie est présent, laissez la requête continuer.
  return NextResponse.next();
}

// Configuration du matcher pour spécifier quelles routes ce middleware doit protéger.
export const config = {
  matcher: [
    "/user/dashboard/:path*", // Protège le tableau de bord et toutes ses sous-routes
    // Ajoutez d'autres routes protégées ici si nécessaire :
    // '/profile',
    // '/settings',
  ],
};

/**
 * Notes sur le middleware :
 * 1. `getSessionCookie`: Cet utilitaire de BetterAuth est conçu pour vérifier rapidement
 * l'existence du cookie de session sans faire d'appel API ou base de données coûteux,
 * ce qui est idéal pour le middleware.
 * 2. Redirection : Si l'utilisateur n'est pas authentifié, il est redirigé vers `/login`.
 * Assurez-vous d'avoir une page de connexion à cette route.
 * 3. `config.matcher`: Définissez ici toutes les routes qui nécessitent une authentification.
 * 4. Validation de session : La page `/user/dashboard` effectuera une validation
 * plus approfondie de la session en utilisant `auth.api.getSession()`.
 * 5. Runtime Node.js dans le middleware (Next.js 15.2.0+) :
 * Si vous utilisez une version récente de Next.js, vous pourriez être en mesure d'utiliser
 * `auth.api.getSession()` directement dans le middleware pour une vérification plus robuste.
 * Consultez la documentation de BetterAuth et Next.js à ce sujet.
 */
