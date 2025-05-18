import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { getServerSession } from "@/lib/auth/auth-server";

const prisma = new PrismaClient();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  organizationId: z.string().uuid("Invalid organization ID"),
});

const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .optional(),
  description: z.string().max(1000, "Description is too long").optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  startDate: z
    .string()
    .datetime({ message: "Invalid start date" })
    .optional()
    .nullable(),
  endDate: z
    .string()
    .datetime({ message: "Invalid end date" })
    .optional()
    .nullable(),
});

// Get authenticated user and their ProfilePro
async function getAuthenticatedProfilePro(req: NextRequest) {
  const userId = await getServerSession(req);
  if (!userId) {
    console.log("[getAuthenticatedProfilePro] No valid user session found");
    return null;
  }

  console.log("[getAuthenticatedProfilePro] User ID from session:", userId);

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { profilePros: true },
  });

  if (!profile) {
    console.log(
      "[getAuthenticatedProfilePro] No profile found for user:",
      userId
    );
    return null;
  }

  if (!profile.profilePros[0]) {
    console.log(
      "[getAuthenticatedProfilePro] No ProfilePro found for user:",
      userId
    );
    return null;
  }

  console.log(
    "[getAuthenticatedProfilePro] ProfilePro found:",
    profile.profilePros[0].id
  );
  return profile.profilePros[0];
}

// POST: Create a new project
export async function POST(req: NextRequest) {
  try {
    const profilePro = await getAuthenticatedProfilePro(req);
    if (!profilePro) {
      return NextResponse.json(
        {
          message:
            "Unauthorized: User not authenticated or no professional profile",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("[POST /api/projects] Request body:", body);
    const result = createProjectSchema.safeParse(body);
    if (!result.success) {
      console.log(
        "[POST /api/projects] Validation errors:",
        result.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, organizationId } = result.data;

    // Create project and add user as a member
    const project = await prisma.project.create({
      data: {
        name,
        organizationId,
        members: {
          connect: { id: profilePro.id },
        },
      },
    });

    console.log("[POST /api/projects] Project created:", project.id);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Retrieve projects for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const profilePro = await getAuthenticatedProfilePro(req);
    if (!profilePro) {
      return NextResponse.json(
        {
          message:
            "Unauthorized: User not authenticated or no professional profile",
        },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { id: profilePro.id },
        },
      },
      include: {
        organization: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    console.log("[GET /api/projects] Retrieved projects:", projects.length);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[GET /api/projects] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update a project
export async function PUT(req: NextRequest) {
  try {
    const profilePro = await getAuthenticatedProfilePro(req);
    if (!profilePro) {
      return NextResponse.json(
        {
          message:
            "Unauthorized: User not authenticated or no professional profile",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("[PUT /api/projects] Request body:", body);
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const result = updateProjectSchema.safeParse(updateData);
    if (!result.success) {
      console.log(
        "[PUT /api/projects] Validation errors:",
        result.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check if project exists and user is a member
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: { where: { id: profilePro.id } },
        organization: { include: { owner: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (
      project.members.length === 0 &&
      project.organization.ownerId !== profilePro.id
    ) {
      return NextResponse.json(
        {
          message: "Forbidden: User not a member or owner of the organization",
        },
        { status: 403 }
      );
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...result.data,
        updatedAt: new Date(),
      },
    });

    console.log("[PUT /api/projects] Project updated:", updatedProject.id);
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("[PUT /api/projects] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete a project
export async function DELETE(req: NextRequest) {
  try {
    const profilePro = await getAuthenticatedProfilePro(req);
    if (!profilePro) {
      return NextResponse.json(
        {
          message:
            "Unauthorized: User not authenticated or no professional profile",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("[DELETE /api/projects] Request body:", body);
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if project exists and user is the organization owner
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        organization: { include: { owner: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.organization.ownerId !== profilePro.id) {
      return NextResponse.json(
        {
          message: "Forbidden: Only the organization owner can delete projects",
        },
        { status: 403 }
      );
    }

    // Delete project
    await prisma.project.delete({
      where: { id },
    });

    console.log("[DELETE /api/projects] Project deleted:", id);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/projects] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
