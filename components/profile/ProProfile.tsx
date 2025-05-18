"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CreateOrganization from "@/components/organization/OrgaCreate";
import CreateProject from "@/components/project/ProjectCreate";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  name: string;
  organizationId: string;
}

interface ProfilePro {
  id: string;
  profileId: string;
  updatedAt: string;
  organizations: Organization[];
  projects: Project[];
}

export default function ProProfile() {
  const [profilePros, setProfilePros] = useState<ProfilePro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfilePros = async () => {
      try {
        const res = await fetch("/api/user/profile/proProfil", {
          credentials: "include",
        });
        if (res.ok) {
          const data: ProfilePro[] = await res.json();
          setProfilePros(data);
        } else if (res.status === 401) {
          toast.info("Please sign in.");
          router.push("/auth/sign-in");
        } else {
          toast.error("Failed to load professional profiles.");
        }
      } catch (error) {
        console.error("[ProProfile] Network error:", error);
        toast.error("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfilePros();
  }, [router]);

  const handleOrgCreated = () => {
    setShowCreateOrg(false);
    fetchProfilePros();
  };

  const handleProjectCreated = () => {
    setShowCreateProject(false);
    fetchProfilePros();
  };

  const fetchProfilePros = async () => {
    try {
      const res = await fetch("/api/user/profile/proProfil", {
        credentials: "include",
      });
      if (res.ok) {
        const data: ProfilePro[] = await res.json();
        setProfilePros(data);
      }
    } catch (error) {
      console.error("[ProProfile] Error reloading profiles:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-4 w-full">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // Aggregate all organizations and projects
  const allOrganizations = profilePros.flatMap((p) => p.organizations);
  const allProjects = profilePros.flatMap((p) => p.projects);
  const latestUpdate =
    profilePros.length > 0
      ? profilePros.reduce(
          (latest, p) =>
            new Date(p.updatedAt) > new Date(latest) ? p.updatedAt : latest,
          profilePros[0].updatedAt
        )
      : null;

  if (showCreateOrg) {
    return (
      <CreateOrganization
        onClose={() => setShowCreateOrg(false)}
        onSuccess={handleOrgCreated}
      />
    );
  }

  if (showCreateProject) {
    return (
      <CreateProject
        onClose={() => setShowCreateProject(false)}
        onSuccess={handleProjectCreated}
        organizations={allOrganizations}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="flex items-center space-x-4 mb-4"></div>

        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <div className="flex justify-between items-center mb-1">
              <strong>Organizations:</strong>
              <Button
                onClick={() => setShowCreateOrg(true)}
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
              >
                <Plus className="mr-1 h-3 w-3" /> Add
              </Button>
            </div>
            {allOrganizations.length > 0 ? (
              <ul className="list-disc list-inside pl-2 text-sm">
                {allOrganizations.map((org) => (
                  <li key={org.id}>{org.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-xs italic">
                No organizations yet
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <strong>Projects:</strong>
              <Button
                onClick={() => setShowCreateProject(true)}
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                disabled={allOrganizations.length === 0}
              >
                <Plus className="mr-1 h-3 w-3" /> Add
              </Button>
            </div>
            {allProjects.length > 0 ? (
              <ul className="list-disc list-inside pl-2 text-sm">
                {allProjects.map((project) => (
                  <li key={project.id}>{project.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-xs italic">No projects yet</p>
            )}
          </div>

          <div>
            <strong>Last Updated:</strong>{" "}
            {latestUpdate
              ? new Date(latestUpdate).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "N/A"}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={() => {}}
          className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
          disabled
        >
          <Edit className="mr-2 h-3 w-3" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
