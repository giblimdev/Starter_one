"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProProfile from "@/components/profile/ProProfile";
import OrgaCreate from "@/components/organization/OrgaCreate";
import { useProfessional } from "@/hooks/useProfessional";
import ProjectCreate from "@/components/project/ProjectCreate";
import { getOrganizations, Organization } from "@/utils/getOrganizations";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { userId, profileProId, loading, error, fetchProfilePro } =
    useProfessional();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isOrgaCreateOpen, setIsOrgaCreateOpen] = useState(false);
  const [isProjectCreateOpen, setIsProjectCreateOpen] = useState(false);
  const [isFetchingOrgs, setIsFetchingOrgs] = useState(false);

  // Fetch organizations for ProjectCreate
  useEffect(() => {
    async function fetchOrgs() {
      if (!session || !profileProId) return;

      setIsFetchingOrgs(true);
      const orgs = await getOrganizations();
      if (orgs) {
        setOrganizations(orgs);
      }
      setIsFetchingOrgs(false);
    }

    fetchOrgs();
  }, [session, profileProId]);

  // Handle authentication and profile fetching
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      toast.info("Please sign in.");
      router.push("/auth/sign-in");
      return;
    }
    fetchProfilePro();
  }, [session, isPending, router, fetchProfilePro]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const refreshOrganizations = async () => {
    if (!session || !profileProId) return;

    setIsFetchingOrgs(true);
    const orgs = await getOrganizations();
    if (orgs) {
      setOrganizations(orgs);
    }
    setIsFetchingOrgs(false);
  };

  const handleOrgaSuccess = () => {
    setIsOrgaCreateOpen(false);
    refreshOrganizations();
  };

  const handleProjectSuccess = () => {
    setIsProjectCreateOpen(false);
    // Optionally refresh projects here if you have a project list
  };

  if (isPending || loading || isFetchingOrgs) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-1/2" />
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!session) {
    return null; // Redirection handled in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome, {session.user?.name?.trim() || "User"}!
      </h1>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700">
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-700">
            <p>
              <strong>User ID:</strong> {userId || "N/A"}
            </p>
            <p>
              <strong>Professional Profile ID:</strong> {profileProId || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Professional Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProProfile />
          <div className="flex space-x-4">
            <Button onClick={() => setIsOrgaCreateOpen(true)}>
              Create Organization
            </Button>
            <Button
              onClick={() => setIsProjectCreateOpen(true)}
              disabled={organizations.length === 0}
            >
              Create Project
            </Button>
          </div>
          {isOrgaCreateOpen && (
            <OrgaCreate
              onClose={() => setIsOrgaCreateOpen(false)}
              onSuccess={handleOrgaSuccess}
            />
          )}
          {isProjectCreateOpen && (
            <ProjectCreate
              onClose={() => setIsProjectCreateOpen(false)}
              onSuccess={handleProjectSuccess}
              organizations={organizations}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
