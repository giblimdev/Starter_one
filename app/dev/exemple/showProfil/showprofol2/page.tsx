//@app/user/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
  CheckIcon,
  AlertCircleIcon,
  UserIcon,
  MailIcon,
  GlobeIcon,
  ClockIcon,
  PencilIcon,
  ShieldIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DysplayPath from "@/components/layout/DysplayPath";

// Types pour les données du profil
type UserProfile = {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    role: string;
    lang: string;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    languagePreferred: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile/me");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Erreur lors de la récupération du profil"
          );
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        console.error("Erreur lors de la récupération du profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Format de date pour l'affichage
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'a pas encore configuré son profil
  if (!userProfile?.profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <UserIcon size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profil non configuré
          </h2>
          <p className="text-gray-600 mb-8">
            Vous n&apos;avez pas encore configuré votre profil. Veuillez
            compléter vos informations personnelles pour continuer.
          </p>
          <Link
            href="/user/profile/edit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm inline-block"
          >
            Configurer mon profil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <Link
            href="/user/profile/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm flex items-center"
          >
            <PencilIcon size={16} className="mr-2" />
            Modifier
          </Link>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          <DysplayPath />
        </div>
      </div>

      {/* Section avatar et infos principales */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            {userProfile.user.image ? (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Image
                  src={userProfile.user.image}
                  alt={userProfile.user.name || "Avatar de l'utilisateur"}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon size={40} className="text-gray-500" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              {userProfile.profile.firstName} {userProfile.profile.lastName}
            </h2>
            <div className="flex items-center justify-center md:justify-start mt-2">
              <MailIcon size={16} className="text-gray-500 mr-2" />
              <span className="text-gray-600">{userProfile.user.email}</span>
            </div>
            {userProfile.user.role && (
              <div className="flex items-center justify-center md:justify-start mt-2">
                <ShieldIcon size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-600 capitalize">
                  {userProfile.user.role}
                </span>
              </div>
            )}
            {userProfile.user.emailVerified && (
              <div className="inline-flex items-center mt-3 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <CheckIcon size={14} className="mr-1" />
                <span className="text-xs font-medium">Email vérifié</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Informations personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Prénom</p>
            <p className="text-base text-gray-900">
              {userProfile.profile.firstName}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Nom</p>
            <p className="text-base text-gray-900">
              {userProfile.profile.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Date de naissance
            </p>
            <div className="flex items-center">
              <CalendarIcon size={16} className="text-gray-500 mr-2" />
              <p className="text-base text-gray-900">
                {userProfile.profile.dateOfBirth
                  ? formatDate(userProfile.profile.dateOfBirth)
                  : "Non spécifiée"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Langue préférée
            </p>
            <div className="flex items-center">
              <GlobeIcon size={16} className="text-gray-500 mr-2" />
              <p className="text-base text-gray-900">
                {userProfile.profile.languagePreferred === "fr"
                  ? "Français"
                  : "Anglais"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du compte */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Informations du compte
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Identifiant
            </p>
            <p className="text-base text-gray-900 font-mono bg-gray-100 p-1 rounded">
              {userProfile.user.id}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Nom d&apos;utilisateur
            </p>
            <p className="text-base text-gray-900">
              {userProfile.user.name || "Non défini"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
            <div className="flex items-center">
              <p className="text-base text-gray-900">
                {userProfile.user.email}
              </p>
              {userProfile.user.emailVerified && (
                <span className="ml-2 inline-flex items-center">
                  <CheckIcon size={16} className="text-green-600" />
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Langue de l&apos;interface
            </p>
            <p className="text-base text-gray-900">
              {userProfile.user.lang === "fr" ? "Français" : "Anglais"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Date de création
            </p>
            <div className="flex items-center">
              <ClockIcon size={16} className="text-gray-500 mr-2" />
              <p className="text-base text-gray-900">
                {formatDate(userProfile.user.createdAt)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Dernière mise à jour
            </p>
            <div className="flex items-center">
              <ClockIcon size={16} className="text-gray-500 mr-2" />
              <p className="text-base text-gray-900">
                {formatDate(userProfile.user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
