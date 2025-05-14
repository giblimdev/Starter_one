"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import NotAuthenticatedCard from "@/components/layout/NotAuthenticated";

interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified: boolean;
  image?: string | null;
  role: string;
  lang?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  languagePreferred: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  user: UserData;
  profile: ProfileData | null;
}

export default function ProfilePage() {
  const {
    data: session,
    isPending: sessionPending,
    error: sessionError,
  } = useSession();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile/me", {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }

        const result: ProfileResponse = await response.json();
        setData(result);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!sessionPending && !sessionError) {
      fetchProfile();
    } else if (sessionError) {
      setError("Session error");
      setIsLoading(false);
    }
  }, [sessionPending, sessionError]);

  if (sessionPending || isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 my-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionError || error === "Unauthorized" || !session?.user) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <NotAuthenticatedCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button asChild className="mt-4">
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.user) {
    return null;
  }

  const { user, profile } = data;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback>
                  {profile?.firstName?.charAt(0) ||
                    user.name?.charAt(0) ||
                    user.email?.charAt(0) ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {profile?.firstName || "N/A"} {profile?.lastName || ""}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user.email || "N/A"}
                </p>
                <p className="text-sm capitalize">{user.role}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="User ID" value={user.id} />
              <Field label="Name" value={user.name || "N/A"} />
              <Field label="Email" value={user.email || "N/A"} />
              <Field
                label="Email Verified"
                value={user.emailVerified ? "Yes" : "No"}
              />
              <Field label="Role" value={user.role} />
              <Field label="Language" value={user.lang || "en"} />
              <Field
                label="User Created At"
                value={new Date(user.createdAt).toLocaleString("fr-FR")}
              />
              <Field
                label="User Updated At"
                value={new Date(user.updatedAt).toLocaleString("fr-FR")}
              />

              {profile && (
                <>
                  <Field label="Profile ID" value={profile.id} />
                  <Field label="First Name" value={profile.firstName} />
                  <Field label="Last Name" value={profile.lastName} />
                  <Field
                    label="Date of Birth"
                    value={
                      profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString(
                            "fr-FR"
                          )
                        : "N/A"
                    }
                  />
                  <Field
                    label="Preferred Language"
                    value={profile.languagePreferred}
                  />
                  <Field
                    label="Profile Created At"
                    value={new Date(profile.createdAt).toLocaleString("fr-FR")}
                  />
                  <Field
                    label="Profile Updated At"
                    value={new Date(profile.updatedAt).toLocaleString("fr-FR")}
                  />
                </>
              )}
            </div>

            <Button asChild>
              <Link href="/user/profile/edit">Modifier le profil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        readOnly
        aria-readonly="true"
        tabIndex={-1}
        className="bg-muted cursor-not-allowed"
      />
    </div>
  );
}
