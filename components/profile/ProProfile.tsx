"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProProfileCrud from "./ProProfileCrud";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Team {
  id: string;
  name: string;
  organizationId: string;
}

interface Project {
  id: string;
  name: string;
  organizationId: string;
}

interface ProfilePro {
  id: string;
  profileId: string;
  organizationId: string;
  updatedAt: string;
  organization: Organization;
  teams: Team[];
  projects: Project[];
}

export default function ProProfile() {
  const [profilePros, setProfilePros] = useState<ProfilePro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
          toast.info("Veuillez vous connecter.");
          router.push("/auth/sign-in");
        } else if (res.status === 404) {
          setProfilePros([]);
        } else {
          toast.error("Erreur lors du chargement des profils professionnels.");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
        toast.error("Erreur réseau. Veuillez vérifier votre connexion.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfilePros();
  }, [router]);

  const handleClose = () => {
    setShowCreate(false);
    setEditingId(null);
    // Recharger les données après création/édition
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
        console.error("Erreur lors du rechargement:", error);
      }
    };
    fetchProfilePros();
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (profilePros.length === 0 && !showCreate && !editingId) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="shadow-lg border-0">
          <CardContent className="text-center space-y-4 pt-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Aucun profil professionnel trouvé
            </h2>
            <p className="text-gray-500">
              Vous n&apos;avez pas encore associé de profil professionnel à une
              organisation. Ajoutez-en un pour participer à des équipes et
              projets.
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un profil professionnel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCreate) {
    return (
      <ProProfileCrud
        profilePro={null}
        onClose={handleClose}
        isCreating={true}
      />
    );
  }

  if (editingId) {
    const profilePro = profilePros.find((p) => p.id === editingId) || null;
    if (!profilePro) {
      setEditingId(null);
      toast.error("Profil professionnel non trouvé.");
      return null;
    }
    return (
      <ProProfileCrud
        profilePro={profilePro}
        onClose={handleClose}
        isCreating={false}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Profils professionnels
        </h2>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      {profilePros.map((profilePro) => (
        <Card key={profilePro.id} className="shadow-lg border-0">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2 text-gray-700">
              <div>
                <strong>Organisation :</strong>{" "}
                {profilePro.organization.name || "n/c"}
              </div>
              <div>
                <strong>Équipes :</strong>{" "}
                {profilePro.teams.length > 0
                  ? profilePro.teams.map((t) => t.name).join(", ")
                  : "Aucune"}
              </div>
              <div>
                <strong>Projets :</strong>{" "}
                {profilePro.projects.length > 0
                  ? profilePro.projects.map((p) => p.name).join(", ")
                  : "Aucun"}
              </div>
              <div>
                <strong>Mis à jour le :</strong>{" "}
                {new Date(profilePro.updatedAt).toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
            <div className="pt-2">
              <Button
                onClick={() => setEditingId(profilePro.id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Éditer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
