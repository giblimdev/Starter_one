import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileProSchema = z.object({
  organizationIds: z.array(z.string().uuid()).optional(),
  projectIds: z.array(z.string().uuid()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId)
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return NextResponse.json(
        { message: "Profil non trouvé" },
        { status: 404 }
      );

    const profilePros = await prisma.profilePro.findMany({
      where: { profileId: profile.id },
      include: {
        organizations: { select: { id: true, name: true, slug: true } },
        projects: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(profilePros);
  } catch (error) {
    console.error("[GET /profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId)
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return NextResponse.json(
        { message: "Profil non trouvé" },
        { status: 404 }
      );

    const json = await request.json();
    const parsed = profileProSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { organizationIds = [], projectIds = [] } = parsed.data;

    const newProfilePro = await prisma.profilePro.create({
      data: {
        profileId: profile.id,
        organizations: { connect: organizationIds.map((id) => ({ id })) },
        projects: { connect: projectIds.map((id) => ({ id })) },
      },
      include: {
        organizations: { select: { id: true, name: true, slug: true } },
        projects: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(newProfilePro, { status: 201 });
  } catch (error) {
    console.error("[POST /profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId)
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return NextResponse.json(
        { message: "Profil non trouvé" },
        { status: 404 }
      );

    const json = await request.json();
    const schema = profileProSchema.extend({ id: z.string().uuid() });
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { id, organizationIds = [], projectIds = [] } = parsed.data;

    const existing = await prisma.profilePro.findUnique({
      where: { id },
      select: { profileId: true },
    });
    if (!existing)
      return NextResponse.json(
        { message: "ProfilePro non trouvé" },
        { status: 404 }
      );
    if (existing.profileId !== profile.id)
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });

    const updated = await prisma.profilePro.update({
      where: { id },
      data: {
        organizations: { set: organizationIds.map((id) => ({ id })) },
        projects: { set: projectIds.map((id) => ({ id })) },
        updatedAt: new Date(),
      },
      include: {
        organizations: { select: { id: true, name: true, slug: true } },
        projects: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId)
      return NextResponse.json(
        { message: "Utilisateur non authentifié" },
        { status: 401 }
      );

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return NextResponse.json(
        { message: "Profil non trouvé" },
        { status: 404 }
      );

    const { id } = z
      .object({ id: z.string().uuid() })
      .parse(await request.json());

    const existing = await prisma.profilePro.findUnique({
      where: { id },
      select: { profileId: true },
    });
    if (!existing)
      return NextResponse.json(
        { message: "ProfilePro non trouvé" },
        { status: 404 }
      );
    if (existing.profileId !== profile.id)
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });

    await prisma.profilePro.delete({ where: { id } });

    return NextResponse.json({ message: "ProfilePro supprimé" });
  } catch (error) {
    console.error("[DELETE /profilePro] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
