//@/components/organization/create.tsx
"use client";

import React, { useState } from "react";
import { useProfessional } from "@/hooks/useProfessional";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Schéma de validation (correspond à createOrganizationSchema de l'API)
const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .max(50, "Le slug est trop long")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug doit être en minuscules, alphanumérique ou contenir des tirets"
    ),
});

interface FormData {
  name: string;
  slug: string;
}

interface CreateOrganizationProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrgaCreate({
  onClose,
  onSuccess,
}: CreateOrganizationProps) {
  const { userId, profileProId } = useProfessional();
  const [formData, setFormData] = useState<FormData>({ name: "", slug: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  // Gestion du changement des champs avec formatage automatique du slug
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue =
      name === "slug" ? value.toLowerCase().replace(/\s+/g, "-") : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation côté client
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        slug: fieldErrors.slug?.[0],
      });
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    if (!profileProId) {
      toast.error("Profil professionnel requis pour créer une organisation.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
        }),
      });

      if (response.ok) {
        toast.success("Organisation créée avec succès !");
        setFormData({ name: "", slug: "" }); // Réinitialiser le formulaire
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "Erreur lors de la création de l'organisation.";
        if (errorData.errors) {
          // Gérer les erreurs de validation Zod de l'API
          const fieldErrors = errorData.errors.reduce(
            (
              acc: Record<string, string>,
              err: { path: string[]; message: string }
            ) => {
              if (err.path[0]) acc[err.path[0]] = err.message;
              return acc;
            },
            {}
          );
          setErrors(fieldErrors);
        } else if (response.status === 409) {
          setErrors({ slug: "Ce slug est déjà utilisé." });
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erreur réseau ou inattendue:", error);
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer l'état de chargement si useProfessional est asynchrone
  if (!userId && !profileProId && !isSubmitting) {
    return <div className="text-center p-6">Chargement du profil...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Afficher les IDs uniquement en développement */}
      {process.env.NODE_ENV === "development" && (
        <p className="text-gray-700 mb-4">
          Utilisateur: {userId || "N/A"} | Profil Pro: {profileProId || "N/A"}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom de l'organisation"
            required
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="nom-org"
            required
            disabled={isSubmitting}
            aria-invalid={!!errors.slug}
            aria-describedby={errors.slug ? "slug-error" : undefined}
          />
          {errors.slug && (
            <p id="slug-error" className="text-red-500 text-sm mt-1">
              {errors.slug}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Créer"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
