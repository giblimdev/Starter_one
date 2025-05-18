//@/components/project/ProjectCreate.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface ProfilePro {
  id: string;
  firstName?: string;
  lastName?: string;
}

// Validation schema (matches createProjectSchema in /api/projects)
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
  image: z.string().optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  organizationId: z.string().uuid("Invalid organization ID"),
  memberIds: z.array(z.string()).optional(),
});

interface FormData {
  name: string;
  description: string;
  image: string;
  startDate: Date | null;
  endDate: Date | null;
  organizationId: string;
  memberIds: string[];
}

interface CreateProjectProps {
  onClose: () => void;
  onSuccess: () => void;
  organizations: Organization[];
  availableMembers?: ProfilePro[];
}

export default function ProjectCreate({
  onClose,
  onSuccess,
  organizations,
  availableMembers = [],
}: CreateProjectProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image: "",
    startDate: null,
    endDate: null,
    organizationId: "",
    memberIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handle organization selection
  const handleOrgChange = (value: string) => {
    setFormData((prev) => ({ ...prev, organizationId: value }));
    setErrors((prev) => ({ ...prev, organizationId: undefined }));
  };

  // Handle date selection
  const handleDateChange = (
    date: Date | null,
    field: "startDate" | "endDate"
  ) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleMemberChange = (memberId: string) => {
    setFormData((prev) => {
      const newMemberIds = prev.memberIds.includes(memberId)
        ? prev.memberIds.filter((id) => id !== memberId)
        : [...prev.memberIds, memberId];

      return { ...prev, memberIds: newMemberIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        description: fieldErrors.description?.[0],
        image: fieldErrors.image?.[0],
        organizationId: fieldErrors.organizationId?.[0],
      });
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        image: formData.image || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        organizationId: formData.organizationId,
        memberIds:
          formData.memberIds.length > 0 ? formData.memberIds : undefined,
      };
      console.log("[CreateProject] Sending to /api/projects:", payload);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Project created successfully!");
        setFormData({
          name: "",
          description: "",
          image: "",
          startDate: null,
          endDate: null,
          organizationId: "",
          memberIds: [],
        });
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to create project.";
        if (errorData.errors) {
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
        } else if (
          response.status === 400 &&
          errorMessage.includes("organization")
        ) {
          setErrors({ organizationId: "Invalid organization." });
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("[CreateProject] Network error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (organizations.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-red-500 mb-4">
          No organizations available. Please create an organization first.
        </p>
        <Button onClick={onClose} variant="outline" className="w-full">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project Name"
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
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
            disabled={isSubmitting}
            rows={3}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <p id="description-error" className="text-red-500 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
            aria-invalid={!!errors.image}
            aria-describedby={errors.image ? "image-error" : undefined}
          />
          {errors.image && (
            <p id="image-error" className="text-red-500 text-sm mt-1">
              {errors.image}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? (
                    format(formData.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate || undefined}
                  onSelect={(date) =>
                    handleDateChange(date ?? null, "startDate")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? (
                    format(formData.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate || undefined}
                  onSelect={(date) => handleDateChange(date ?? null, "endDate")}
                  initialFocus
                  disabled={(date) =>
                    formData.startDate ? date < formData.startDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <label
            htmlFor="organizationId"
            className="block text-sm font-medium text-gray-700"
          >
            Organization *
          </label>
          <Select
            onValueChange={handleOrgChange}
            value={formData.organizationId}
            disabled={isSubmitting}
          >
            <SelectTrigger
              id="organizationId"
              aria-invalid={!!errors.organizationId}
              aria-describedby={errors.organizationId ? "org-error" : undefined}
            >
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizationId && (
            <p id="org-error" className="text-red-500 text-sm mt-1">
              {errors.organizationId}
            </p>
          )}
        </div>

        {availableMembers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Members
            </label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {availableMembers.map((member) => (
                <div key={member.id} className="flex items-center py-1">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={formData.memberIds.includes(member.id)}
                    onChange={() => handleMemberChange(member.id)}
                    className="mr-2"
                    disabled={isSubmitting}
                  />
                  <label htmlFor={`member-${member.id}`} className="text-sm">
                    {member.firstName} {member.lastName}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Create"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
