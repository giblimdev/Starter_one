// @/app/features/page.tsx
"use client";

import Link from "next/link";
import React from "react";

const FeatureSection = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="feature-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Fonctionnalités de Star-One
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Une plateforme complète de gestion de projet agile pour optimiser
          votre workflow et améliorer la collaboration de votre équipe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureSection
          title="Gestion de Projet Agile"
          description="Organisez votre travail avec une structure hiérarchique complète : thèmes, epics, user stories, sprints, tâches et sous-tâches. Suivez l'avancement avec différents statuts (TODO, IN_PROGRESS, REVIEW, DONE, BLOCKED, CANCELLED)."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Gestion des Membres"
          description="Attribuez différents rôles aux membres de votre équipe (USER, READER, AUTHOR, DEV, ADMIN) avec des permissions spécifiques. Suivez qui fait quoi et quand avec un système complet de traçabilité."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Suivi du Temps"
          description="Enregistrez le temps passé sur chaque tâche avec notre système de TimeLog intégré. Analysez la productivité et améliorez vos estimations pour les futurs projets."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Gestion Documentaire"
          description="Organisez vos fichiers dans des dossiers structurés. Gérez différents types de documents (DOCUMENT, IMAGE, SPREADSHEET, PRESENTATION, ARCHIVE, CODE) avec versionnement et relations entre fichiers."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Collaboration en Temps Réel"
          description="Commentez sur les projets, thèmes, epics, user stories et tâches. Suivez toutes les activités avec un journal détaillé des actions (CREATE, UPDATE, DELETE)."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Gestion des Dépendances"
          description="Définissez des dépendances entre tâches pour visualiser le chemin critique. Établissez des relations entre fichiers (IMPORT, REFERENCE) pour maintenir la cohérence de votre documentation."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Authentification Sécurisée"
          description="Système d'authentification robuste avec vérification d'email, connexion par réseaux sociaux et gestion des sessions. Protection des données avec différents niveaux d'accès."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Planification de Sprint"
          description="Planifiez et gérez vos sprints avec des dates de début et de fin. Associez des user stories, tâches et sous-tâches à chaque sprint pour un suivi précis de l'avancement."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <FeatureSection
          title="Suivi d'Activité"
          description="Gardez une trace de toutes les actions effectuées dans le système avec notre journal d'activité détaillé. Identifiez qui a fait quoi et quand pour une transparence totale."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          }
        />
      </div>

      <div className="mt-16 text-center">
        <Link href={"public/newProject"}></Link>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Commencer un projet maintenant
        </button>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Découvrez comment Star-One peut transformer votre façon de gérer vos
          projets
        </p>
      </div>
    </div>
  );
}
