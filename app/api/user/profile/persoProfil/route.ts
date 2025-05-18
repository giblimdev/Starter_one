//@/app/api/user/profile/persoProfil

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for profile creation and update
const profileSchema = z.object({
  firstName: z.string().max(100).optional().default(""),
  lastName: z.string().max(100).optional().default(""),
  dateOfBirth: z.string().datetime().optional().nullable(),
  languagePreferred: z.string().min(2).max(5).default("en"),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        languagePreferred: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[GET /api/user/profile/persoProfil] Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Vérifier si le profil existe déjà
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    // Si le profil existe déjà, le retourner au lieu d'erreur 409
    if (existingProfile) {
      return NextResponse.json(existingProfile);
    }

    // Sinon, créer le nouveau profil
    const json = await request.json();
    const validation = profileSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, dateOfBirth, languagePreferred } =
      validation.data;

    const newProfile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        languagePreferred,
        userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        languagePreferred: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("[POST /api/user/profile/persoProfil] Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const validation = profileSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });
    if (!existingProfile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    const { firstName, lastName, dateOfBirth, languagePreferred } =
      validation.data;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        languagePreferred,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        languagePreferred: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PUT /api/user/profile/persoProfil] Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getServerSession(request);
    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });
    if (!existingProfile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    await prisma.profile.delete({
      where: { userId },
    });

    return NextResponse.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/user/profile/persoProfil] Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
