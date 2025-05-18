"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  lang?: string | null;
  role: "USER" | "ADMIN";
  updatedAt: string;
}

interface UserProfileCrudProps {
  user: User;
  onClose: () => void;
}

export default function UserProfileCrud({
  user,
  onClose,
}: UserProfileCrudProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    image: user.image || "",
    lang: user.lang || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.image || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        image: imageFile
          ? await convertImageToBase64(imageFile)
          : formData.image,
      };

      const res = await fetch("/api/user/profile/userProfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
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
      } else if (res.status === 403) {
        toast.error("Not authorized to modify some information.");
      } else {
        toast.error("Error updating profile.");
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
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/user/profile/userProfil", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Account deleted successfully.");
        router.push("/auth/sign-in");
      } else {
        toast.error("Error deleting account.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Card className="relative max-w-md mx-auto shadow-lg border-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Profile Picture (optional)</Label>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Profile picture preview"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 w-full">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  {imagePreview && (
                    <X
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                      size={18}
                      onClick={clearImage}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lang">Language</Label>
              <Input
                id="lang"
                name="lang"
                value={formData.lang}
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
          <div className="mt-6 border-t pt-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
