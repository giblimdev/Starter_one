"use client";

import { useSession } from "@/lib/auth/auth-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

// Define type for UserAggregate based on schema.prisma
interface UserAggregate {
  id: string;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  userRole?: string | null;
  userLang?: string | null;
  userCreatedAt: string;
  userUpdatedAt: string;
  memberProjects?: string | null; // JSON string of project IDs
  tasks?: string | null; // JSON string of task IDs
  activities?: string | null; // JSON string of activity IDs
  sessions?: string | null; // JSON string of session IDs
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState<UserAggregate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Log useSession response for debugging
    console.log("useSession response:", { session, isPending });

    const fetchUserData = async () => {
      if (!session?.user?.id) {
        console.log("No user ID found in session, redirecting to sign-in");
        redirect("/auth/sign-in");
      }

      try {
        const userId = session.user.id;
        const res = await fetch(
          `/api/user/profile/${encodeURIComponent(userId)}`,
          { next: { revalidate: 60 } } // Cache for 60 seconds
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP Error: ${res.status} - ${errorText}`);
        }

        const data: UserAggregate = await res.json();
        setUser(data);
      } catch (error: unknown) {
        let message = "Unknown error";
        if (error instanceof Error) {
          message = error.message;
        }
        console.error("Error fetching user data:", {
          message,
          id: session?.user?.id || "unknown",
        });
        setError(message); // Store error for UI display
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchUserData();
    }
  }, [session, isPending]);

  if (isPending || loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Error
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
          <a
            href="/auth/sign-in"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    console.log("No session or user data, redirecting to sign-in");
    redirect("/auth/sign-in");
  }

  // Safely parse JSON fields with type safety
  const parseJsonField = (field: string | null | undefined): string[] => {
    try {
      return field ? JSON.parse(field) : [];
    } catch {
      console.warn(`Failed to parse JSON field: ${field}`);
      return [];
    }
  };

  const stats = {
    projects: parseJsonField(user.memberProjects).length,
    tasks: parseJsonField(user.tasks).length,
    activities: parseJsonField(user.activities).length,
    sessions: parseJsonField(user.sessions).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
          {/* Avatar with Next/Image */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            {user.userImage ? (
              <Image
                src={user.userImage}
                alt={user.userName || "Profile photo"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {user.userName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.userName || "User"}
            </h1>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              {user.userRole === "ADMIN" ? "Administrator" : "Member"}
            </div>
          </div>
        </div>

        {/* Information grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Information section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Information
            </h2>
            <div className="space-y-3">
              <InfoField label="Email" value={user.userEmail} />
              <InfoField
                label="Language"
                value={getLanguageName(user.userLang)}
              />
              <InfoField
                label="Member since"
                value={new Date(user.userCreatedAt).toLocaleDateString("en-US")}
              />
              <InfoField
                label="Last login"
                value={new Date(user.userUpdatedAt).toLocaleDateString("en-US")}
              />
            </div>
          </div>

          {/* Statistics section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard value={stats.projects} label="Projects" />
              <StatCard value={stats.tasks} label="Tasks" />
              <StatCard value={stats.activities} label="Activities" />
              <StatCard value={stats.sessions} label="Sessions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility components
function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 dark:text-gray-200">
        {value || (
          <span className="text-gray-400 dark:text-gray-500">
            Not specified
          </span>
        )}
      </p>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
}

function getLanguageName(code?: string | null): string {
  const languages: Record<string, string> = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
  };
  return code ? languages[code] || code : "Not specified";
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
          <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
          <div className="space-y-2 text-center md:text-left">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
