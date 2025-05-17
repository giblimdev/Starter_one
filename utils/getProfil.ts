//@utils/getProfile.ts

import { Prisma } from "@/lib/generated/prisma/client";

type ProfileResponse = {
  user: unknown;
  profile: Prisma.ProfileGetPayload<object> | null;
};

export async function getProfile(): Promise<Prisma.ProfileGetPayload<object> | null> {
  try {
    const response = await fetch("/api/user/profile/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch profile");
    }

    const result: ProfileResponse = await response.json();

    return result.profile;
  } catch (error) {
    throw error;
  }
}
