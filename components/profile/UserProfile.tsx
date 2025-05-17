"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
          toast.info("Veuillez vous connecter ou créer un compte.");
          router.push("/auth/sign-in");
        } else {
          toast.error("Erreur lors du chargement du profil.");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
        toast.error("Erreur réseau. Veuillez vérifier votre connexion.");
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
        console.error("Erreur lors du rechargement:", error);
      }
    };
    fetchUser();
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-gray-500">
        Aucun profil utilisateur trouvé.
      </div>
    );
  }

  const { src, fallback, bgColor } = getUserAvatarProps(user);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Card className="shadow-xl p-6">
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            {src ? (
              <Image
                src={src}
                alt={`${user.name}'s avatar`}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg text-white"
                style={{ backgroundColor: bgColor }}
              >
                {fallback}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">{user.name || "n/c"}</h2>
              <p className="text-sm text-gray-500">{user.email || "n/c"}</p>
            </div>
          </div>
          <div className="space-y-2 text-gray-700">
            <div>
              <strong>Langue :</strong> {user.lang || "n/c"}
            </div>
            <div>
              <strong>Rôle :</strong> {user.role || "n/c"}
            </div>
            <div>
              <strong>Dernière mise à jour :</strong>{" "}
              {user.updatedAt
                ? new Date(user.updatedAt).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "n/c"}
            </div>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => setShowEdit(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={showEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Éditer le profil
            </Button>
          </div>
        </CardContent>
      </Card>

      {showEdit && (
        <div className="mt-4 transition-opacity duration-300">
          <UserProfileCrud user={user} onClose={handleEditClose} />
        </div>
      )}
    </div>
  );
}
