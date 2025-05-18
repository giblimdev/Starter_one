// @/app/auth/goodbye/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfessional } from "@/hooks/useProfessional";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";

export default function GoodbyePage() {
  const router = useRouter();
  const { reset } = useProfessional();

  useEffect(() => {
    reset(); // Vider le store useProfessional au chargement
  }, [reset]);

  const handleReconnect = () => {
    router.push("/auth/sign-in");
  };

  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const getMessage = () => {
    switch (reason) {
      case "session_expired":
        return "Your session has expired for security reasons";
      case "inactivity":
        return "Automatic disconnection after inactivity";
      default:
        return "You have been successfully disconnected";
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center space-y-6">
        <div className="animate-bounce">
          <RocketIcon className="w-16 h-16 mx-auto text-indigo-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800">Goodbye!</h1>

        <p className="text-gray-600">{getMessage()}. Come back anytime!</p>

        <div className="pt-6 space-y-4">
          <Button
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleReconnect}
          >
            Sign In Again
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            onClick={handleGoHome}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
