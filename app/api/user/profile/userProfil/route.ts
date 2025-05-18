//@/app/api/user/profile/userProfil/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation des données d'update
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
  lang: z.string().min(2).max(5).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(), // ajuster selon ton enum
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        lang: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET /api/user/profile/] Erreur:", error);
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

    const json = await request.json();
    const validation = updateUserSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher les utilisateurs non admin de modifier leur propre rôle
    if (data.role && existingUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Non autorisé à modifier le rôle" },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        lang: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PUT /api/user/profile/userProfil] Erreur:", error);
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

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const deletedUser = await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({
      message: "Utilisateur supprimé avec succès",
      user: deletedUser,
    });
  } catch (error) {
    console.error("[DELETE /api/user/profile/me] Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
