"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

type PageHeaderProps = {
  /**
   * Titre personnalisé de la page (optionnel, sinon généré à partir du chemin)
   */
  title?: string;
  /**
   * Afficher ou non le bouton de retour
   */
  showBackButton?: boolean;
  /**
   * URL de destination du bouton de retour (optionnel, par défaut remontera d'un niveau)
   */
  backUrl?: string;
  /**
   * Noms personnalisés pour les segments de chemin (optionnel)
   * Exemple: { profile: "Profil", "profile/edit": "Modification" }
   */
  segmentNames?: Record<string, string>;
  /**
   * Classes CSS supplémentaires pour le conteneur
   */
  className?: string;
  /**
   * Segments de chemin à masquer dans le fil d'Ariane
   */
  hideSegments?: string[];
};

/**
 * Composant d'en-tête de page avec fil d'Ariane généré automatiquement
 * à partir de l'URL courante
 */
export default function PageHeader({
  showBackButton = true,
  backUrl,
  segmentNames = {},
  className = "",
  hideSegments = [],
}: PageHeaderProps) {
  const pathname = usePathname();

  // Segmentation du chemin et construction des breadcrumbs
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // URL pour le bouton retour - soit l'URL fournie, soit le niveau supérieur
  const computedBackUrl =
    backUrl ||
    (() => {
      if (pathSegments.length <= 1) return "/";
      return "/" + pathSegments.slice(0, -1).join("/");
    })();

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center">
        {showBackButton && (
          <Link
            href={computedBackUrl}
            className="mr-2 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronLeftIcon size={20} className="text-gray-600" />
          </Link>
        )}
      </div>

      {/* Fil d'Ariane */}
      <div className="text-sm text-gray-500 mt-1">
        <Link href="/" className="hover:text-blue-600">
          Accueil
        </Link>

        {pathSegments.map((segment, index) => {
          // Ignorer les segments qui sont dans la liste à masquer
          if (hideSegments.includes(segment)) return null;

          // Construire le chemin jusqu'à ce segment
          const segmentPath = "/" + pathSegments.slice(0, index + 1).join("/");

          // Déterminer le nom à afficher pour ce segment
          let segmentName;
          const fullPathToHere = pathSegments.slice(0, index + 1).join("/");

          if (segmentNames[fullPathToHere]) {
            // Nom pour le chemin complet jusqu'ici
            segmentName = segmentNames[fullPathToHere];
          } else if (segmentNames[segment]) {
            // Nom pour ce segment spécifique
            segmentName = segmentNames[segment];
          } else {
            // Formater le segment (première lettre en majuscule, remplacer les tirets/underscores par des espaces)
            segmentName =
              segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " ").replace(/_/g, " ");
          }

          return (
            <span key={segment}>
              <span className="mx-2">/</span>
              {index === pathSegments.length - 1 ? (
                // Dernier segment (actuel) - pas de lien
                <span className="font-medium text-gray-700">{segmentName}</span>
              ) : (
                // Segment intermédiaire - avec lien
                <Link href={segmentPath} className="hover:text-blue-600">
                  {segmentName}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
