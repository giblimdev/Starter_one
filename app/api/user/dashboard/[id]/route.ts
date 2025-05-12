import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to resolve the dynamic id
    const { id } = await params;

    // Decode the ID
    const decodedId = decodeURIComponent(id);

    // Validate ID
    if (!decodedId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    console.log("Querying User with ID:", decodedId);

    // Fetch user data with relevant relations
    const user = await prisma.user.findUnique({
      where: { id: decodedId },
      include: {
        sessions: {
          select: {
            id: true,
            expiresAt: true,
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
      },
    });

    // Fetch memberships with relations
    const memberships = await prisma.member.findMany({
      where: { userId: decodedId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            createdAt: true,
            updatedAt: true,
            dueDate: true,
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
        timeLogs: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            createdAt: true,
          },
        },
      },
    });

    console.log("Query result:", user ? "User found" : "User not found");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate duration for timeLogs
    const enhancedTimeLogs = memberships.flatMap((m) =>
      m.timeLogs.map((log) => ({
        ...log,
        duration: log.endTime
          ? Math.round(
              (new Date(log.endTime).getTime() -
                new Date(log.startTime).getTime()) /
                1000
            ) // Seconds
          : null,
      }))
    );

    // Construct UserAggregate-like response
    const userAggregate = {
      id: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
      userRole: user.role,
      userLang: user.lang,
      userCreatedAt: user.createdAt.toISOString(),
      userUpdatedAt: user.updatedAt.toISOString(),
      memberProjects: JSON.stringify(memberships),
      projects: JSON.stringify(memberships.map((m) => m.project)),
      tasks: JSON.stringify(memberships.flatMap((m) => m.tasks)),
      comments: JSON.stringify(memberships.flatMap((m) => m.comments)),
      activities: JSON.stringify(memberships.flatMap((m) => m.activities)),
      timeLogs: JSON.stringify(enhancedTimeLogs),
      sessions: JSON.stringify(user.sessions),
      accounts: JSON.stringify(user.accounts),
      epics: JSON.stringify([]),
      userStories: JSON.stringify([]),
      sprints: JSON.stringify([]),
      themas: JSON.stringify([]),
    };

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
    await prisma.$disconnect();
  }
}
