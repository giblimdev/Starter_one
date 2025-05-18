// File: UserProfileDisplay.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
//import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getUserAvatarProps } from "@/utils/avatar";
import UserProfileCrud from "./UserProfileCrud";
import { Edit } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  lang?: string | null;
  role: "USER" | "ADMIN";
  updatedAt: string;
}

export default function UserProfileDisplay() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile/userProfil", {
          credentials: "include",
        });
        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
        } else if (res.status === 401) {
          toast.info("Please sign in or create an account.");
          router.push("/auth/sign-in");
        } else {
          toast.error("Failed to load profile.");
        }
      } catch (error) {
        console.error("[UserProfileDisplay] Network error:", error);
        toast.error("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleEditClose = () => {
    setShowEdit(false);
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile/userProfil", {
          credentials: "include",
        });
        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("[UserProfileDisplay] Error reloading profile:", error);
      }
    };
    fetchUser();
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

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-center text-gray-500">
        No user profile found.
      </div>
    );
  }

  const { src, fallback, bgColor } = getUserAvatarProps(user);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="flex items-center space-x-4 mb-4">
          {src ? (
            <Image
              src={src}
              alt={`${user.name}'s avatar`}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white"
              style={{ backgroundColor: bgColor }}
            >
              {fallback}
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold">{user.name || "N/A"}</h3>
            <p className="text-xs text-gray-500">{user.email || "N/A"}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <strong>Language:</strong> {user.lang || "N/A"}
          </div>
          <div>
            <strong>Role:</strong> {user.role || "N/A"}
          </div>
          <div>
            <strong>Last Updated:</strong>{" "}
            {user.updatedAt
              ? new Date(user.updatedAt).toLocaleString("en-US", {
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
          <UserProfileCrud user={user} onClose={handleEditClose} />
        </div>
      )}
    </div>
  );
}
