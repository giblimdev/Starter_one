// File: /lib/auth/get-profilePro.ts
import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation des entrées
const uuidSchema = z.string().uuid("Format UUID invalide");

export async function getProfileProId(
  request: NextRequest
): Promise<string | null> {
  try {
    // Récupérer l'ID utilisateur depuis la session
    const userId = await getServerSession(request);

    if (!userId) {
      console.log("[getProfileProId] Aucun utilisateur authentifié");
      return null;
    }

    // Valider userId comme UUID
    const parsedUserId = uuidSchema.safeParse(userId);
    if (!parsedUserId.success) {
      console.log(
        "[getProfileProId] Format d'ID utilisateur invalide:",
        userId
      );
      return null;
    }

    // Récupérer le profil de l'utilisateur et son ProfilePro associé
    const userProfile = await prisma.profile.findUnique({
      where: {
        userId: parsedUserId.data,
      },
      select: {
        id: true,
        profilePros: {
          select: { id: true },
          take: 1, // S'assurer de ne retourner qu'un seul ProfilePro
        },
      },
    });

    if (!userProfile || userProfile.profilePros.length === 0) {
      console.log(
        "[getProfileProId] Aucun Profile ou ProfilePro trouvé pour l'utilisateur:",
        parsedUserId.data
      );
      return null;
    }

    const profileProId = userProfile.profilePros[0].id;
    console.log("[getProfileProId] ProfilePro trouvé:", profileProId);

    return profileProId;
  } catch (error) {
    console.error(
      "[getProfileProId] Erreur lors de la récupération du ProfilePro:",
      error
    );
    return null;
  }
}

/**
 * Vérifie si un utilisateur a accès à une organisation spécifique
 *
 * @param request - La requête Next.js
 * @param organizationId - L'ID de l'organisation à vérifier
 * @returns Booléen indiquant si l'accès est autorisé
 */
export async function checkOrganizationAccess(
  request: NextRequest,
  organizationId: string
): Promise<boolean> {
  try {
    // Valider organizationId
    const parsedOrgId = uuidSchema.safeParse(organizationId);
    if (!parsedOrgId.success) {
      console.log(
        "[checkOrganizationAccess] ID d'organisation invalide:",
        organizationId
      );
      return false;
    }

    const profileProId = await getProfileProId(request);

    if (!profileProId) {
      console.log("[checkOrganizationAccess] Aucun ID ProfilePro trouvé");
      return false;
    }

    // Vérifier si le ProfilePro est membre ou propriétaire de l'organisation
    const organization = await prisma.organization.findFirst({
      where: {
        id: parsedOrgId.data,
        OR: [
          { ownerId: profileProId },
          { profilePros: { some: { id: profileProId } } },
        ],
      },
      select: { id: true }, // Sélection minimale pour la performance
    });

    const hasAccess = !!organization;
    console.log(
      "[checkOrganizationAccess] Vérification d'accès pour l'organisation",
      parsedOrgId.data,
      "résultat:",
      hasAccess
    );

    return hasAccess;
  } catch (error) {
    console.error("[checkOrganizationAccess] Erreur:", error);
    return false;
  }
}

/**
 * Vérifie si un utilisateur a accès à un projet spécifique
 *
 * @param request - La requête Next.js
 * @param projectId - L'ID du projet à vérifier
 * @returns Booléen indiquant si l'accès est autorisé
 */
export async function checkProjectAccess(
  request: NextRequest,
  projectId: string
): Promise<boolean> {
  try {
    // Valider projectId
    const parsedProjectId = uuidSchema.safeParse(projectId);
    if (!parsedProjectId.success) {
      console.log("[checkProjectAccess] ID de projet invalide:", projectId);
      return false;
    }

    const profileProId = await getProfileProId(request);

    if (!profileProId) {
      console.log("[checkProjectAccess] Aucun ID ProfilePro trouvé");
      return false;
    }

    // Récupérer le projet avec les informations de membre et d'organisation
    const project = await prisma.project.findUnique({
      where: { id: parsedProjectId.data },
      select: {
        id: true,
        organizationId: true,
        members: {
          where: { id: profileProId },
          select: { id: true },
        },
      },
    });

    if (!project) {
      console.log(
        "[checkProjectAccess] Projet non trouvé:",
        parsedProjectId.data
      );
      return false;
    }

    // Vérifier si l'utilisateur est membre direct
    if (project.members.length > 0) {
      console.log(
        "[checkProjectAccess] Accès direct au projet accordé pour le projet:",
        parsedProjectId.data
      );
      return true;
    }

    // Vérifier l'accès à l'organisation
    const hasOrgAccess = await checkOrganizationAccess(
      request,
      project.organizationId
    );
    console.log(
      "[checkProjectAccess] Vérification d'accès à l'organisation pour le projet",
      parsedProjectId.data,
      "résultat:",
      hasOrgAccess
    );

    return hasOrgAccess;
  } catch (error) {
    console.error("[checkProjectAccess] Erreur:", error);
    return false;
  }
}
