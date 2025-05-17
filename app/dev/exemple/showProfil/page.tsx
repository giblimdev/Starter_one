//@/user/profile/edit/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, CheckIcon, AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/layout/DysplayPath";

// Type pour le formulaire de configuration du profil
type ProfileFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  languagePreferred: string;
};

export default function ProfileSetupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    languagePreferred: "fr", // Valeur par défaut
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/user/profile/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Une erreur est survenue lors de la création du profil"
        );
      }

      setSuccess("Votre profil a été créé avec succès!");

      // Redirection vers la page de profil après un court délai
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur lors de la création du profil:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Utilisation du composant PageHeader */}
      <PageHeader
        title="Configuration du profil"
        backUrl="/profile"
        segmentNames={{
          profile: "Profil",
          "profile/setup": "Configuration",
        }}
      />

      {/* Indicateur de progression */}
      <div className="flex justify-between mb-10 relative">
        <div
          className="absolute top-1/2 w-full h-1 bg-gray-200"
          style={{ transform: "translateY(-50%)" }}
        ></div>
        <div className="flex-1 relative flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center z-10">
            <CheckIcon size={20} />
          </div>
          <div className="mt-2 text-sm font-medium text-blue-600">Compte</div>
        </div>
        <div className="flex-1 relative flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center z-10">
            <span className="font-semibold">2</span>
          </div>
          <div className="mt-2 text-sm font-medium text-blue-600">Profil</div>
        </div>
        <div className="flex-1 relative flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center z-10">
            <span className="font-semibold">3</span>
          </div>
          <div className="mt-2 text-sm font-medium text-gray-500">
            Organisation
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Informations personnelles
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date de naissance
            </label>
            <div className="relative">
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon size={18} className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="languagePreferred"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Langue préférée
            </label>
            <select
              id="languagePreferred"
              name="languagePreferred"
              value={formData.languagePreferred}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">*</span> Champs obligatoires
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t">
            <Link
              href="/profile"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"></span>
                  Création...
                </>
              ) : (
                "Créer mon profil"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
