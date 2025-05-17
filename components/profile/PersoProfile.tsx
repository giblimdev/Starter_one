"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
          toast.info("Veuillez vous connecter.");
          router.push("/auth/sign-in");
        } else if (res.status === 404) {
          setProfile(null); // Aucun profil trouvé
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
        console.error("Erreur lors du rechargement:", error);
      }
    };
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!profile && !showCreate) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="shadow-lg border-0">
          <CardContent className="text-center space-y-4 pt-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Aucun profil trouvé
            </h2>
            <p className="text-gray-500">
              Vous n&apos;avez pas encore créé de profil. Créez-en un pour
              personnaliser votre expérience.
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Créer un profil
            </Button>
          </CardContent>
        </Card>
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
    <div className="max-w-md mx-auto p-6 space-y-4">
      <Card className="shadow-lg border-0">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 text-gray-700">
            <div>
              <strong>Prénom :</strong> {profile?.firstName || "n/c"}
            </div>
            <div>
              <strong>Nom :</strong> {profile?.lastName || "n/c"}
            </div>
            <div>
              <strong>Date de naissance :</strong>{" "}
              {profile?.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString("fr-FR", {
                    dateStyle: "medium",
                  })
                : "n/c"}
            </div>
            <div>
              <strong>Langue préférée :</strong>{" "}
              {profile?.languagePreferred || "n/c"}
            </div>
            <div>
              <strong>Créé le :</strong>{" "}
              {profile
                ? new Date(profile.createdAt).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "n/c"}
            </div>
            <div>
              <strong>Mis à jour le :</strong>{" "}
              {profile
                ? new Date(profile.updatedAt).toLocaleString("fr-FR", {
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
    </div>
  );
}
