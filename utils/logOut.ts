// utils/logOut.ts
"use server";

import { auth } from "@/lib/auth/auth";
import { cookies, headers } from "next/headers";

export async function serverLogOut(redirectPath: string = "/auth/goodbye") {
  try {
    // Invalidation de la session
    await auth.api.signOut({
      headers: Object.fromEntries(Object.entries(await headers())),
    });

    // Nettoyage des cookies
    const cookieStore = cookies();
    (await cookieStore).delete("auth_token");
    (await cookieStore).delete("session_token");

    // Retourne l'URL de redirection sans déclencher la redirection ici
    return redirectPath;
  } catch (error) {
    console.error("Logout failed:", error);
    return `${redirectPath}?error=logout_failed`;
  }
}

export async function getClientLogOutAction() {
  "use server";
  return serverLogOut;
}
