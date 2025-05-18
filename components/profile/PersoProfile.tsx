"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PersoProfileCrud from "./PersoProfileCrud";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  languagePreferred: string;
  createdAt: string;
  updatedAt: string;
}

export default function PersoProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile/persoProfil", {
          credentials: "include",
        });
        if (res.ok) {
          const data: Profile = await res.json();
          setProfile(data);
        } else if (res.status === 401) {
          toast.info("Please sign in.");
          router.push("/auth/sign-in");
        } else if (res.status === 404) {
          setProfile(null); // No profile found
        } else {
          toast.error("Error loading profile.");
        }
      } catch (error) {
        console.error("Network error:", error);
        toast.error("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleEditClose = () => {
    setShowEdit(false);
    setShowCreate(false);
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile/persoProfil", {
          credentials: "include",
        });
        if (res.ok) {
          const data: Profile = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Error reloading:", error);
      }
    };
    fetchProfile();
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

  if (!profile && !showCreate) {
    return (
      <div className="h-full flex items-center justify-center text-center text-gray-500">
        <div className="space-y-4 w-full">
          <p>No personal profile found.</p>
          <Button
            onClick={() => setShowCreate(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
          >
            <UserPlus className="mr-2 h-3 w-3" />
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  if (showCreate) {
    return (
      <PersoProfileCrud
        profile={null}
        onClose={handleEditClose}
        isCreating={true}
      />
    );
  }

  if (showEdit) {
    return (
      <PersoProfileCrud
        profile={profile}
        onClose={handleEditClose}
        isCreating={false}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <strong>First Name:</strong> {profile?.firstName || "N/A"}
          </div>
          <div>
            <strong>Last Name:</strong> {profile?.lastName || "N/A"}
          </div>
          <div>
            <strong>Date of Birth:</strong>{" "}
            {profile?.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })
              : "N/A"}
          </div>
          <div>
            <strong>Preferred Language:</strong>{" "}
            {profile?.languagePreferred || "N/A"}
          </div>
          <div>
            <strong>Last Updated:</strong>{" "}
            {profile?.updatedAt
              ? new Date(profile.updatedAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "N/A"}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={() => setShowEdit(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
          disabled={showEdit}
        >
          <Edit className="mr-2 h-3 w-3" />
          Edit Profile
        </Button>
      </div>

      {showEdit && (
        <div className="mt-4 transition-opacity duration-300">
          <PersoProfileCrud
            profile={profile}
            onClose={handleEditClose}
            isCreating={false}
          />
        </div>
      )}
    </div>
  );
}
