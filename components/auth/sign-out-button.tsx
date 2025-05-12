// components/SignOutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      // 1. Déconnexion côté client
      await authClient.signOut();

      // 2. Appel API pour déconnexion côté serveur
      await fetch("/api/auth/sign-out", { method: "POST" });

      // 3. Rechargement complet de la page
      window.location.href = "/auth/goodbye";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/auth/sign-in?error=logout_failed";
    }
  };

  return (
    <Button onClick={handleSignOut} variant="outline">
      Se déconnecter
    </Button>
  );
}
