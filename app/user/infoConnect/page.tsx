// File: InfoConnect.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProfessional } from "@/hooks/useProfessional";

interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  languagePreferred: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileProResponse {
  id: string;
  profileId: string;
  updatedAt: string;
  organizations: {
    id: string;
    name: string;
    slug: string;
  }[];
  projects: {
    id: string;
    name: string;
  }[];
}

async function checkProfile(): Promise<ProfileResponse | null> {
  try {
    const response = await fetch("/api/user/profile/persoProfil", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("[InfoConnect] Error checking profile:", error);
    throw error;
  }
}

async function checkProfilePro(): Promise<ProfileProResponse[] | null> {
  try {
    const response = await fetch("/api/user/profile/proProfil", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("[InfoConnect] Error checking professional profile:", error);
    throw error;
  }
}

async function createEmptyProfile(): Promise<ProfileResponse> {
  try {
    const response = await fetch("/api/user/profile/persoProfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        languagePreferred: "en",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("[InfoConnect] Error creating profile:", error);
    throw error;
  }
}

async function createEmptyProfilePro(): Promise<ProfileProResponse> {
  try {
    const response = await fetch("/api/user/profile/proProfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        organizationIds: [],
        projectIds: [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("[InfoConnect] Error creating professional profile:", error);
    throw error;
  }
}

async function manageUserProfile(userId: string): Promise<{
  success: boolean;
  message: string;
  userId: string;
  profileId: string;
  profileProId: string | null;
}> {
  try {
    let profile = await checkProfile();
    if (!profile) {
      profile = await createEmptyProfile();
    }

    const profilePros = await checkProfilePro();
    let profileProId: string | null = null;
    if (!profilePros || profilePros.length === 0) {
      const newProfilePro = await createEmptyProfilePro();
      profileProId = newProfilePro.id;
      return {
        success: true,
        message: "Personal and professional profiles created successfully.",
        userId,
        profileId: profile.id,
        profileProId,
      };
    } else {
      profileProId = profilePros[0].id;
      return {
        success: true,
        message: "Personal and professional profiles already exist.",
        userId,
        profileId: profile.id,
        profileProId,
      };
    }
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message ||
          "Failed to manage profiles."
        : "Failed to manage profiles.";
    return {
      success: false,
      message,
      userId,
      profileId: "",
      profileProId: null,
    };
  }
}

export default function InfoConnect() {
  const { data: session, isPending, error } = useSession();
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const { setUserProfileData } = useProfessional();

  useEffect(() => {
    if (session?.user?.id) {
      manageUserProfile(session.user.id).then(
        ({ success, message, userId, profileId, profileProId }) => {
          if (success) {
            toast.success(message);
            setUserProfileData({ userId, profileId, profileProId });
          } else {
            toast.error(message);
          }
          setProfileStatus(message);
        }
      );
    }
  }, [session, setUserProfileData]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600">Not Signed In</h2>
          <p className="mt-2 text-gray-600">
            You must be signed in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, {session.user?.name?.trim() || "User"}!
        </h1>
        <p className="text-gray-600 mb-6">
          {profileStatus || "Setting up your profile..."}
        </p>
        <Link href="/">
          <Button className="w-full">Continue</Button>
        </Link>
      </div>
    </div>
  );
}
