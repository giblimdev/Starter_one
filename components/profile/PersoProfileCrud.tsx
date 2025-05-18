"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  languagePreferred: string;
  createdAt: string;
  updatedAt: string;
}

interface PersoProfileCrudProps {
  profile: Profile | null;
  onClose: () => void;
  isCreating: boolean;
}

export default function PersoProfileCrud({
  profile,
  onClose,
  isCreating,
}: PersoProfileCrudProps) {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    dateOfBirth: profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
    languagePreferred: profile?.languagePreferred || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth || null,
        languagePreferred: formData.languagePreferred || "en",
      };

      const res = await fetch("/api/user/profile/persoProfil", {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          isCreating
            ? "Profile created successfully!"
            : "Profile updated successfully!"
        );
        onClose();
      } else if (res.status === 400) {
        const { errors } = await res.json();
        toast.error(
          "Invalid data: " +
            errors
              ?.map((e: unknown) =>
                typeof e === "object" && e !== null && "message" in e
                  ? (e as { message: string }).message
                  : String(e)
              )
              .join(", ")
        );
      } else if (res.status === 401) {
        toast.error("Please sign in.");
        router.push("/auth/sign-in");
      } else if (res.status === 409) {
        toast.error("A profile already exists.");
      } else {
        toast.error(
          isCreating ? "Error creating profile." : "Error updating profile."
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your profile? This action is irreversible."
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/user/profile/persoProfil", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Profile deleted successfully.");
        onClose();
      } else if (res.status === 401) {
        toast.error("Please sign in.");
        router.push("/auth/sign-in");
      } else {
        toast.error("Error deleting profile.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    }
  };

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
          {isCreating ? "Create Profile" : "Edit Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Your first name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Your last name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Date of Birth (optional)</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="Your date of birth"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="languagePreferred">
              Preferred Language (optional)
            </Label>
            <Input
              id="languagePreferred"
              name="languagePreferred"
              value={formData.languagePreferred}
              onChange={handleChange}
              placeholder="e.g., en, fr"
            />
          </div>
          <div className="mt-4 space-y-2">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
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
              Delete My Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
