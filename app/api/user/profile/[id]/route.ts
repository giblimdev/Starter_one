//@app/api/user/profile/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to resolve the dynamic id
    const { id } = await params;

    // Decode the ID to handle special characters
    const decodedId = decodeURIComponent(id);

    // Validate ID presence
    if (!decodedId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Log the ID being queried for debugging
    console.log("Querying User with ID:", decodedId);

    // Fetch user data from User model with related data
    const user = await prisma.user.findUnique({
      where: { id: decodedId },
      include: {
        sessions: {
          select: {
            id: true,
            token: true,
            expiresAt: true,
            ipAddress: true,
            userAgent: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        accounts: {
          select: {
            id: true,
            providerId: true,
            accountId: true,
            createdAt: true,
          },
        },
        memberships: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true,
              },
            },
            tasks: {
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
              },
            },
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
              },
            },
            activities: {
              select: {
                id: true,
                action: true,
                entityId: true,
                timestamp: true,
              },
            },
          },
        },
      },
    });

    // Log query result
    console.log("Query result:", user ? "User found" : "User not found");

    // Check if user exists
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Construct response to match UserAggregate interface
    const userAggregate = {
      id: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
      userRole: user.role,
      userLang: user.lang,
      userCreatedAt: user.createdAt.toISOString(),
      userUpdatedAt: user.updatedAt.toISOString(),
      sessions: JSON.stringify(user.sessions),
      accounts: JSON.stringify(user.accounts),
      memberProjects: JSON.stringify(user.memberships),
      projects: JSON.stringify(user.memberships.map((m) => m.project)),
      files: JSON.stringify([]), // Placeholder: Fetch from File if needed
      tasks: JSON.stringify(user.memberships.flatMap((m) => m.tasks)),
      subtasks: JSON.stringify([]), // Placeholder: Fetch from Subtask if needed
      comments: JSON.stringify(user.memberships.flatMap((m) => m.comments)),
      timeLogs: JSON.stringify([]), // Placeholder: Fetch from TimeLog if needed
      epics: JSON.stringify([]), // Placeholder: Fetch from Epic if needed
      userStories: JSON.stringify([]), // Placeholder: Fetch from UserStory if needed
      sprints: JSON.stringify([]), // Placeholder: Fetch from Sprint if needed
      themas: JSON.stringify([]), // Placeholder: Fetch from Thema if needed
      activities: JSON.stringify(user.memberships.flatMap((m) => m.activities)),
      fileDependencies: JSON.stringify([]), // Placeholder: Fetch from Dependency if needed
      fileRelations: JSON.stringify([]), // Placeholder: Fetch from FileRelation if needed
    };

    // Return user data
    return NextResponse.json(userAggregate, { status: 200 });
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    let stack = undefined;
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    }
    console.error("Detailed error:", {
      message,
      stack,
      id: (await params).id,
    });
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  } finally {
    // Optional: Remove if singleton Prisma client manages connections
    await prisma.$disconnect();
  }
}
