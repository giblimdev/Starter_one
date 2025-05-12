// utils/avatar.ts

// Définir un type minimal pour les données utilisateur nécessaires à cette fonction
// Cela rend la fonction plus flexible et ne dépend pas directement du type exact de session.user
interface UserForAvatar {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Définir le type de retour de la fonction utilitaire
interface AvatarProps {
  src: string | undefined; // L'URL de l'image, ou undefined si aucune image
  fallback: string; // Le texte à afficher en fallback (les initiales)
}

/**
 * Détermine l'URL de l'image de l'avatar et le texte de fallback (initiales).
 * Utilise l'image fournie, sinon la première lettre du nom, sinon la première lettre de l'email, sinon "U".
 * @param user - L'objet utilisateur contenant name, email et image.
 * @returns Un objet contenant src (pour l'image) et fallback (pour les initiales).
 */
export function getUserAvatarProps(user?: UserForAvatar | null): AvatarProps {
  // Gérer le cas où l'objet user est null ou undefined
  if (!user) {
    return {
      src: undefined,
      fallback: "U", // Fallback par défaut si aucune donnée utilisateur
    };
  }

  // Déterminer la source de l'image (utiliser l'image si elle existe, sinon undefined)
  const src = user.image || undefined;

  // Déterminer le texte de fallback (les initiales)
  let fallbackText = "U"; // Fallback par défaut

  if (user.name) {
    fallbackText = user.name.charAt(0).toUpperCase(); // Première lettre du nom en majuscule
  } else if (user.email) {
    fallbackText = user.email.charAt(0).toUpperCase(); // Sinon, première lettre de l'email en majuscule
  }

  // S'assurer que le fallbackText n'est jamais vide si, par un bug, charAt(0) échoue
  if (!fallbackText) {
    fallbackText = "U";
  }

  return {
    src,
    fallback: fallbackText,
  };
}
