// File: /app/api/organizations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schémas de validation Zod
const uuidSchema = z.string().uuid("Format UUID invalide");

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .max(50, "Le slug est trop long")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug doit être en minuscules, alphanumérique ou contenir des tirets"
    ),
  ownerId: z.string().uuid("ID du propriétaire invalide").optional(), // ownerId optionnel
});

const updateOrganizationSchema = z.object({
  id: z.string().uuid("ID d'organisation invalide"),
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom est trop long")
    .optional(),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .max(50, "Le slug est trop long")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug doit être en minuscules, alphanumérique ou contenir des tirets"
    )
    .optional(),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// GET: Récupérer toutes les organisations ou une organisation spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (id) {
      // Valider l'ID
      const parsedId = uuidSchema.safeParse(id);
      if (!parsedId.success) {
        return NextResponse.json(
          { message: "ID d'organisation invalide" },
          { status: 400 }
        );
      }

      const organization = await prisma.organization.findUnique({
        where: { id: parsedId.data },
        include: {
          profilePros: { select: { id: true, profileId: true } },
          owner: { select: { id: true, profileId: true } },
        },
      });

      if (!organization) {
        return NextResponse.json(
          { message: "Organisation non trouvée" },
          { status: 404 }
        );
      }

      return NextResponse.json(organization);
    }

    if (slug) {
      const organization = await prisma.organization.findUnique({
        where: { slug },
        include: {
          profilePros: { select: { id: true, profileId: true } },
          owner: { select: { id: true, profileId: true } },
        },
      });

      if (!organization) {
        return NextResponse.json(
          { message: "Organisation non trouvée" },
          { status: 404 }
        );
      }

      return NextResponse.json(organization);
    }

    // Récupérer toutes les organisations avec pagination
    const parsedPagination = paginationSchema.safeParse({ page, limit });
    if (!parsedPagination.success) {
      return NextResponse.json(
        {
          message: "Paramètres de pagination invalides",
          errors: parsedPagination.error.errors,
        },
        { status: 400 }
      );
    }

    const { page: parsedPage, limit: parsedLimit } = parsedPagination.data;
    const skip = (parsedPage - 1) * parsedLimit;

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        skip,
        take: parsedLimit,
        orderBy: { createdAt: "desc" },
        include: {
          profilePros: { select: { id: true, profileId: true } },
          owner: { select: { id: true, profileId: true } },
        },
      }),
      prisma.organization.count(),
    ]);

    return NextResponse.json({
      data: organizations,
      meta: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    console.error("[GET organizations] Erreur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des organisations" },
      { status: 500 }
    );
  }
}

// POST: Créer une nouvelle organisation
export async function POST(request: NextRequest) {
  try {
    // Valider le corps de la requête
    const body = await request.json();
    const parsed = createOrganizationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, slug, ownerId } = parsed.data;

    // Vérifier si le slug existe déjà
    const existingOrganization = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrganization) {
      return NextResponse.json(
        { message: "Le slug existe déjà" },
        { status: 409 }
      );
    }

    // Utiliser ownerId fourni ou un ID par défaut (ex: premier ProfilePro)
    const fallbackOwnerId =
      ownerId ||
      (await prisma.profilePro.findFirst({ select: { id: true } }))?.id;
    if (!fallbackOwnerId) {
      return NextResponse.json(
        { message: "Aucun propriétaire valide trouvé" },
        { status: 400 }
      );
    }

    // Vérifier si ownerId existe
    const ownerExists = await prisma.profilePro.findUnique({
      where: { id: fallbackOwnerId },
    });
    if (!ownerExists) {
      return NextResponse.json(
        { message: "ID du propriétaire invalide" },
        { status: 400 }
      );
    }

    // Créer l'organisation
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        slug,
        ownerId: fallbackOwnerId,
        profilePros: {
          connect: { id: fallbackOwnerId }, // Ajouter le propriétaire comme membre
        },
      },
      include: {
        profilePros: { select: { id: true, profileId: true } },
        owner: { select: { id: true, profileId: true } },
      },
    });

    console.log("[POST organization] Organisation créée:", newOrganization.id);
    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    console.error("[POST organization] Erreur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création de l'organisation" },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour une organisation
export async function PUT(request: NextRequest) {
  try {
    // Vérifier le corps de la requête
    const body = await request.json();
    const parsed = updateOrganizationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { id, name, slug } = parsed.data;

    // Vérifier si l'organisation existe
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier si le slug existe déjà (pour une autre organisation)
    if (slug) {
      const existingOrganization = await prisma.organization.findUnique({
        where: { slug },
      });
      if (existingOrganization && existingOrganization.id !== id) {
        return NextResponse.json(
          { message: "Le slug existe déjà" },
          { status: 409 }
        );
      }
    }

    // S'assurer qu'au moins un champ est fourni
    if (!name && !slug) {
      return NextResponse.json(
        { message: "Au moins un champ (nom ou slug) doit être fourni" },
        { status: 400 }
      );
    }

    // Mettre à jour l'organisation
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: {
        name: name || undefined,
        slug: slug || undefined,
      },
      include: {
        profilePros: { select: { id: true, profileId: true } },
        owner: { select: { id: true, profileId: true } },
      },
    });

    console.log(
      "[PUT organization] Organisation mise à jour:",
      updatedOrganization.id
    );
    return NextResponse.json(updatedOrganization);
  } catch (error) {
    console.error("[PUT organization] Erreur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de l'organisation" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer une organisation
export async function DELETE(request: NextRequest) {
  try {
    // Récupérer l'ID depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID d'organisation requis" },
        { status: 400 }
      );
    }

    // Valider l'ID
    const parsedId = uuidSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json(
        { message: "ID d'organisation invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'organisation existe
    const organization = await prisma.organization.findUnique({
      where: { id: parsedId.data },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer les projets associés (car pas de onDelete: Cascade dans le schéma)
    await prisma.project.deleteMany({
      where: { organizationId: parsedId.data },
    });

    // Supprimer l'organisation
    await prisma.organization.delete({
      where: { id: parsedId.data },
    });

    console.log("[DELETE organization] Organisation supprimée:", parsedId.data);
    return NextResponse.json({ message: "Organisation supprimée avec succès" });
  } catch (error) {
    console.error("[DELETE organization] Erreur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'organisation" },
      { status: 500 }
    );
  }
}
