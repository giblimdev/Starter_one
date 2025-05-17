//@//lib/auth/uth-server.ts

import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { prisma } from "@/lib/prisma";

export async function getServerSession(request: NextRequest) {
  try {
    // Récupérer le cookie de session avec getSessionCookie
    const sessionCookie = getSessionCookie(request, {});
    console.log("[getServerSession] Cookie de session complet:", sessionCookie);
    console.log("[getServerSession] Cookie de session trouvé:", {
      value: sessionCookie,
    });

    if (!sessionCookie || !sessionCookie.valueOf) {
      console.log("[getServerSession] Aucun cookie de session trouvé");
      return null;
    }

    // Extraire la partie du token avant la signature, si nécessaire
    const cookieValue = sessionCookie.valueOf();
    const token =
      typeof cookieValue === "string" && cookieValue.includes(".")
        ? cookieValue.split(".")[0]
        : cookieValue;

    console.log("[getServerSession] Token extrait:", token);

    // Vérifier la session dans la table Session
    const session = await prisma.session.findUnique({
      where: {
        token: token,
      },
      select: {
        id: true,
        expiresAt: true,
        userId: true,
      },
    });

    console.log(
      "[getServerSession] Session trouvée:",
      session
        ? {
            id: session.id,
            expiresAt: session.expiresAt,
            userId: session.userId,
          }
        : "Aucune session"
    );

    if (!session || !session.userId) {
      console.log(
        "[getServerSession] Session non trouvée ou aucun utilisateur associé"
      );
      return null;
    }

    if (new Date() > session.expiresAt) {
      console.log("[getServerSession] Session expirée:", {
        expiresAt: session.expiresAt,
      });
      return null;
    }

    console.log("[getServerSession] Utilisateur authentifié:", {
      userId: session.userId,
    });

    return session.userId;
  } catch (error) {
    console.error(
      "[getServerSession] Erreur lors de la récupération de la session:",
      error
    );
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
