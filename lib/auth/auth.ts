//@/lib/auth.ts

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/auth/resend";

export const auth = betterAuth({
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET!,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await resend.emails.send({
        from: "exemple@exemple.com",
        to: data.user.email,
        subject: "Reset your password",
        text: "Click the link to reset your password:  ${data.url}",
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [nextCookies()],
});

/*
Cannot find module 'better-auth/plugins/next-cookies' or its corresponding type declarations.ts(2307)
*/

// lib/auth.ts
// Ce fichier configure l'instance du serveur BetterAuth.
// Assurez-vous d'avoir installé better-auth: npm install better-auth

//import { betterAuth } from "better-auth";
//import { nextCookies } from "better-auth/plugins/next-cookies"; // Plugin crucial pour la gestion des cookies dans Next.js
// import { emailAndPassword } from "better-auth/strategies/email-and-password"; // Si vous utilisez l'authentification par email/mot de passe
// import { drizzleAdapter } from "better-auth/adapters/drizzle"; // Exemple d'adaptateur de base de données

// Exemple de configuration de base. Adaptez ceci selon vos besoins.
// Consultez la documentation de BetterAuth pour toutes les options : https://www.better-auth.com/docs
//export const auth = betterAuth({
// URL de votre application, nécessaire pour la redirection et la construction d'URL
//appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

// Clé secrète pour signer les cookies et les tokens. Gardez-la en sécurité !
// Générez une chaîne aléatoire forte pour cela.
//secret: process.env.AUTH_SECRET || "votre-super-secret-aleatoire-a-changer",

// Plugins
// plugins: [
//  nextCookies(), // Indispensable pour que BetterAuth fonctionne correctement avec les Server Actions et les cookies dans Next.js
//],

// Stratégies d'authentification (exemple avec email et mot de passe)
// strategies: [
//   emailAndPassword({
//     // Options pour la stratégie email/mot de passe
//     // Par exemple, pour activer l'inscription :
//     // allowSignup: true,
//     // async sendVerificationRequest(params) {
//     //   console.log("Envoyer l'email de vérification à :", params.email, "avec le token:", params.token);
//     //   // Implémentez votre logique d'envoi d'email ici
//     // },
//   }),
// ],

// Adaptateur de base de données (si vous stockez les utilisateurs et les sessions)
// database: {
//   adapter: drizzleAdapter(db, { provider: "pg" }), // Remplacez 'db' par votre instance Drizzle et 'pg' par votre SGBD
//   // Options de session, etc.
//   session: {
//     // Durée de validité de la session
//     maxAge: 30 * 24 * 60 * 60, // 30 jours
//   }
// },

// API Route Handler (si vous utilisez Pages Router, sinon pour App Router, cela se gère différemment)
// Pour App Router, les actions serveur et les gestionnaires de route dédiés sont préférés.
// Cependant, BetterAuth peut nécessiter un gestionnaire de route global pour certaines opérations.
// Reportez-vous à la documentation de BetterAuth pour la configuration avec App Router.
// Par exemple, vous pourriez avoir un fichier app/api/auth/[...betterauth]/route.ts

// Pour simplifier cet exemple, nous nous concentrons sur la protection des pages
// et la récupération de session dans les Server Components.
// Assurez-vous que votre configuration BetterAuth globale est correcte.
//});

// Vous aurez également besoin d'un client BetterAuth pour les interactions côté client (si nécessaire)
// import { createClient } from "better-auth/client";
// export const authClient = createClient({
//   baseUrl: "/api/auth", // ou l'URL de votre API d'authentification
// });

/**
 * Remarques importantes pour la configuration de BetterAuth :
 * 1. Secret : Utilisez une variable d'environnement pour `AUTH_SECRET` en production.
 * 2. appUrl : Définissez `NEXT_PUBLIC_APP_URL` dans vos variables d'environnement.
 * 3. Stratégies et Base de données :
 * - Vous devrez configurer au moins une stratégie d'authentification (par exemple, email/mot de passe, OAuth avec Google, etc.).
 * - Vous aurez probablement besoin d'un adaptateur de base de données pour stocker les utilisateurs et les sessions.
 * BetterAuth fournit des adaptateurs pour divers ORM et bases de données.
 * - L'exemple ci-dessus commente ces sections. Décommentez et configurez-les selon votre stack.
 * 4. Route API d'authentification :
 * - BetterAuth gère généralement les routes d'authentification (comme /api/auth/signin, /api/auth/callback, etc.).
 * - Avec Next.js App Router, vous créerez un gestionnaire de route (par exemple, `app/api/auth/[...betterauth]/route.ts`)
 * en utilisant `auth.toNextJsHandler()` ou une méthode similaire fournie par BetterAuth.
 * Exemple (basé sur la documentation BetterAuth) :
 * // app/api/auth/[...betterauth]/route.ts
 * // import { auth } from "@/lib/auth"; // Votre instance BetterAuth
 * // export const { GET, POST } = auth.toNextJsHandler();
 *
 * Ce fichier `lib/auth.ts` exporte l'instance `auth` configurée,
 * qui sera utilisée dans le middleware et les pages côté serveur.
 */
