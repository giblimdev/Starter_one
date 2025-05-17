//@/composant/profile/proProfileCrud.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

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

interface AvailableData {
  organizations: Organization[];
  teams: Team[];
  projects: Project[];
}

interface ProProfileCrudProps {
  profilePro: ProfilePro | null;
  onClose: () => void;
  isCreating: boolean;
}

export default function ProProfileCrud({
  profilePro,
  onClose,
  isCreating,
}: ProProfileCrudProps) {
  const [formData, setFormData] = useState({
    organizationId: profilePro?.organizationId || "",
    teamIds: profilePro?.teams.map((t) => t.id) || [],
    projectIds: profilePro?.projects.map((p) => p.id) || [],
  });
  const [availableData, setAvailableData] = useState<AvailableData>({
    organizations: [],
    teams: [],
    projects: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  // Charger les organisations, équipes et projets disponibles
  useEffect(() => {
    const fetchAvailableData = async () => {
      try {
        const res = await fetch("/api/organizations/available", {
          credentials: "include",
        });
        if (res.ok) {
          const data: AvailableData = await res.json();
          setAvailableData(data);
        } else if (res.status === 401) {
          toast.error("Veuillez vous connecter.");
          router.push("/auth/sign-in");
        } else {
          toast.error("Erreur lors du chargement des données disponibles.");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
        toast.error("Erreur réseau. Veuillez réessayer.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchAvailableData();
  }, [router]);

  const handleOrganizationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationId: value,
      teamIds: [], // Réinitialiser les équipes
      projectIds: [], // Réinitialiser les projets
    }));
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, teamIds: selected }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, projectIds: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        organizationId: formData.organizationId,
        teamIds: formData.teamIds.length > 0 ? formData.teamIds : undefined,
        projectIds:
          formData.projectIds.length > 0 ? formData.projectIds : undefined,
        ...(isCreating ? {} : { id: profilePro?.id }),
      };

      const res = await fetch("/api/user/profile/proProfil", {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          isCreating
            ? "Profil professionnel créé avec succès !"
            : "Profil professionnel mis à jour avec succès !"
        );
        onClose();
      } else if (res.status === 400) {
        const { errors } = await res.json();
        toast.error(
          "Données invalides : " +
            errors
              ?.map((e: unknown) =>
                typeof e === "object" && e !== null && "message" in e
                  ? (e as { message: string }).message
                  : String(e)
              )
              .join(", ")
        );
      } else if (res.status === 401) {
        toast.error("Veuillez vous connecter.");
        router.push("/auth/sign-in");
      } else if (res.status === 403) {
        toast.error("Non autorisé à modifier ce profil professionnel.");
      } else if (res.status === 404) {
        toast.error(
          isCreating
            ? "Organisation non trouvée."
            : "Profil professionnel non trouvé."
        );
      } else if (res.status === 409) {
        toast.error("Ce profil est déjà associé à cette organisation.");
      } else {
        toast.error(
          isCreating
            ? "Erreur lors de la création du profil professionnel."
            : "Erreur lors de la mise à jour du profil professionnel."
        );
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce profil professionnel ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/user/profile/proProfil", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profilePro?.id }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Profil professionnel supprimé avec succès.");
        onClose();
      } else if (res.status === 401) {
        toast.error("Veuillez vous connecter.");
        router.push("/auth/sign-in");
      } else if (res.status === 403) {
        toast.error("Non autorisé à supprimer ce profil professionnel.");
      } else if (res.status === 404) {
        toast.error("Profil professionnel non trouvé.");
      } else {
        toast.error("Erreur lors de la suppression du profil professionnel.");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      toast.error("Erreur réseau. Veuillez réessayer.");
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="relative max-w-md mx-auto shadow-lg border-0">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
        disabled={isSubmitting}
      >
        <X size={20} />
      </Button>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {isCreating
            ? "Créer un profil professionnel"
            : "Modifier le profil professionnel"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="organizationId">Organisation</Label>
            <Select
              value={formData.organizationId}
              onValueChange={handleOrganizationChange}
              required
            >
              <SelectTrigger id="organizationId">
                <SelectValue placeholder="Sélectionnez une organisation" />
              </SelectTrigger>
              <SelectContent>
                {availableData.organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="organisatons/creat">
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer une nouvelle organisation
              </Button>
            </Link>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="teamIds">Équipes (optionnel)</Label>
            <select
              id="teamIds"
              multiple
              value={formData.teamIds}
              onChange={handleTeamChange}
              className="w-full border rounded-md p-2 text-sm"
              disabled={!formData.organizationId}
            >
              {availableData.teams
                .filter(
                  (team) => team.organizationId === formData.organizationId
                )
                .map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="projectIds">Projets (optionnel)</Label>
            <select
              id="projectIds"
              multiple
              value={formData.projectIds}
              onChange={handleProjectChange}
              className="w-full border rounded-md p-2 text-sm"
              disabled={!formData.organizationId}
            >
              {availableData.projects
                .filter(
                  (project) =>
                    project.organizationId === formData.organizationId
                )
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-4 space-y-2">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting || !formData.organizationId}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Enregistrer"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
        {!isCreating && (
          <div className="mt-6 border-t pt-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Supprimer ce profil professionnel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
