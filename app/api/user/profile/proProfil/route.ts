//@//app/api/user/profile/

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour la création et la mise à jour de ProfilePro
const profileProSchema = z.object({
  organizationId: z
    .string()
    .uuid("L'ID de l'organisation doit être un UUID valide"),
  teamIds: z.array(z.string().uuid()).optional(), // IDs des équipes à connecter
  projectIds: z.array(z.string().uuid()).optional(), // IDs des projets à connecter
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur a un profil
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      return NextResponse.json(
        { message: "Profil non trouvé pour cet utilisateur" },
        { status: 404 }
      );
    }

    const profilePros = await prisma.profilePro.findMany({
      where: { profileId: profile.id },
      select: {
        id: true,
        profileId: true,
        organizationId: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(profilePros);
  } catch (error) {
    console.error("[GET /api/user/profile/profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur a un profil
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      return NextResponse.json(
        { message: "Profil non trouvé pour cet utilisateur" },
        { status: 404 }
      );
    }

    const json = await request.json();
    const validation = profileProSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { organizationId, teamIds, projectIds } = validation.data;

    // Vérifier que l'organisation existe
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier la contrainte unique profileId + organizationId
    const existingProfilePro = await prisma.profilePro.findUnique({
      where: {
        profileId_organizationId: {
          profileId: profile.id,
          organizationId,
        },
      },
    });
    if (existingProfilePro) {
      return NextResponse.json(
        { message: "Ce profil est déjà associé à cette organisation" },
        { status: 409 }
      );
    }

    // Vérifier que les équipes et projets existent (si fournis)
    if (teamIds && teamIds.length > 0) {
      const teamsCount = await prisma.organizationTeam.count({
        where: { id: { in: teamIds }, organizationId },
      });
      if (teamsCount !== teamIds.length) {
        return NextResponse.json(
          {
            message:
              "Une ou plusieurs équipes spécifiées n'existent pas ou ne sont pas dans cette organisation",
          },
          { status: 400 }
        );
      }
    }
    if (projectIds && projectIds.length > 0) {
      const projectsCount = await prisma.project.count({
        where: { id: { in: projectIds }, organizationId },
      });
      if (projectsCount !== projectIds.length) {
        return NextResponse.json(
          {
            message:
              "Un ou plusieurs projets spécifiés n'existent pas ou ne sont pas dans cette organisation",
          },
          { status: 400 }
        );
      }
    }

    const profilePro = await prisma.profilePro.create({
      data: {
        profileId: profile.id,
        organizationId,
        teams: teamIds ? { connect: teamIds.map((id) => ({ id })) } : undefined,
        projects: projectIds
          ? { connect: projectIds.map((id) => ({ id })) }
          : undefined,
      },
      select: {
        id: true,
        profileId: true,
        organizationId: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(profilePro, { status: 201 });
  } catch (error) {
    console.error("[POST /api/user/profile/profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur a un profil
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      return NextResponse.json(
        { message: "Profil non trouvé pour cet utilisateur" },
        { status: 404 }
      );
    }

    const json = await request.json();
    const validation = profileProSchema
      .extend({
        id: z.string().uuid("L'ID du ProfilePro doit être un UUID valide"),
      })
      .safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { id, organizationId, teamIds, projectIds } = validation.data;

    // Vérifier que le ProfilePro existe et appartient au profil de l'utilisateur
    const existingProfilePro = await prisma.profilePro.findUnique({
      where: { id },
      select: { profileId: true, organizationId: true },
    });
    if (!existingProfilePro) {
      return NextResponse.json(
        { message: "ProfilePro non trouvé" },
        { status: 404 }
      );
    }
    if (existingProfilePro.profileId !== profile.id) {
      return NextResponse.json(
        { message: "Non autorisé à modifier ce ProfilePro" },
        { status: 403 }
      );
    }

    // Vérifier que l'organisation existe
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier la contrainte unique si organizationId change
    if (
      existingProfilePro &&
      existingProfilePro.organizationId !== organizationId
    ) {
      const duplicateProfilePro = await prisma.profilePro.findUnique({
        where: {
          profileId_organizationId: {
            profileId: profile.id,
            organizationId,
          },
        },
      });
      if (duplicateProfilePro) {
        return NextResponse.json(
          { message: "Ce profil est déjà associé à cette organisation" },
          { status: 409 }
        );
      }
    }

    // Vérifier que les équipes et projets existent (si fournis)
    if (teamIds && teamIds.length > 0) {
      const teamsCount = await prisma.organizationTeam.count({
        where: { id: { in: teamIds }, organizationId },
      });
      if (teamsCount !== teamIds.length) {
        return NextResponse.json(
          {
            message:
              "Une ou plusieurs équipes spécifiées n'existent pas ou ne sont pas dans cette organisation",
          },
          { status: 400 }
        );
      }
    }
    if (projectIds && projectIds.length > 0) {
      const projectsCount = await prisma.project.count({
        where: { id: { in: projectIds }, organizationId },
      });
      if (projectsCount !== projectIds.length) {
        return NextResponse.json(
          {
            message:
              "Un ou plusieurs projets spécifiés n'existent pas ou ne sont pas dans cette organisation",
          },
          { status: 400 }
        );
      }
    }

    const updatedProfilePro = await prisma.profilePro.update({
      where: { id },
      data: {
        organizationId,
        teams: teamIds
          ? {
              set: teamIds.map((id) => ({ id })),
            }
          : undefined,
        projects: projectIds
          ? {
              set: projectIds.map((id) => ({ id })),
            }
          : undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        profileId: true,
        organizationId: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProfilePro);
  } catch (error) {
    console.error("[PUT /api/user/profile/profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur a un profil
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      return NextResponse.json(
        { message: "Profil non trouvé pour cet utilisateur" },
        { status: 404 }
      );
    }

    const { id } = z
      .object({
        id: z.string().uuid("L'ID du ProfilePro doit être un UUID valide"),
      })
      .parse(await request.json());

    // Vérifier que le ProfilePro existe et appartient au profil de l'utilisateur
    const existingProfilePro = await prisma.profilePro.findUnique({
      where: { id },
      select: { profileId: true },
    });
    if (!existingProfilePro) {
      return NextResponse.json(
        { message: "ProfilePro non trouvé" },
        { status: 404 }
      );
    }
    if (existingProfilePro.profileId !== profile.id) {
      return NextResponse.json(
        { message: "Non autorisé à supprimer ce ProfilePro" },
        { status: 403 }
      );
    }

    await prisma.profilePro.delete({
      where: { id },
    });

    return NextResponse.json({ message: "ProfilePro supprimé avec succès" });
  } catch (error) {
    console.error("[DELETE /api/user/profile/profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
