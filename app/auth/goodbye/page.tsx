// app/auth/goodbye/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";

export default function GoodbyePage() {
  const router = useRouter();

  const handleReconnect = () => {
    router.push("/auth/sign-in");

    window.location.href = "/auth/sign-in";
  };
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const getMessage = () => {
    switch (reason) {
      case "session_expired":
        return "Votre session a expiré pour des raisons de sécurité";
      case "inactivity":
        return "Déconnexion automatique après inactivité";
      default:
        return "Vous avez été déconnecté avec succès";
    }
  };
  const handleGoHome = () => {
    router.push("/");
    // Alternative avec rechargement complet si nécessaire:
    // window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center space-y-6">
        <div className="animate-bounce">
          <RocketIcon className="w-16 h-16 mx-auto text-indigo-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800">À bientôt !</h1>

        <p className="text-gray-600">
          {getMessage()}. Revenez quand vous voulez !
        </p>

        <div className="pt-6 space-y-4">
          <Button
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleReconnect}
          >
            Se reconnecter
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            onClick={handleGoHome}
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
