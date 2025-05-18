import { toast } from "sonner";

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

/**
 * Fetches organizations for the current authenticated user
 * @returns A promise that resolves to an array of organizations or null if an error occurs
 */
export async function getOrganizations(): Promise<Organization[] | null> {
  try {
    const response = await fetch("/api/organizations", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Failed to fetch organizations (${response.status})`;
      toast.error(errorMessage);
      return null;
    }

    const data = await response.json();
    return data as Organization[];
  } catch (error) {
    console.error("[getOrganizations] Network error:", error);
    toast.error("Network error while fetching organizations.");
    return null;
  }
}

/**
 * Fetches a single organization by id
 * @param id The organization id to fetch
 * @returns A promise that resolves to an organization or null if not found or an error occurs
 */
export async function getOrganizationById(
  id: string
): Promise<Organization | null> {
  try {
    const response = await fetch(`/api/organizations/${id}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }

      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Failed to fetch organization (${response.status})`;
      toast.error(errorMessage);
      return null;
    }

    const data = await response.json();
    return data as Organization;
  } catch (error) {
    console.error("[getOrganizationById] Network error:", error);
    toast.error("Network error while fetching organization.");
    return null;
  }
}

/**
 * Fetches organizations that the current user owns
 * @returns A promise that resolves to an array of owned organizations or null if an error occurs
 */
export async function getOwnedOrganizations(): Promise<Organization[] | null> {
  try {
    const response = await fetch("/api/organizations?owned=true", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Failed to fetch owned organizations (${response.status})`;
      toast.error(errorMessage);
      return null;
    }

    const data = await response.json();
    return data as Organization[];
  } catch (error) {
    console.error("[getOwnedOrganizations] Network error:", error);
    toast.error("Network error while fetching owned organizations.");
    return null;
  }
}

/**
 * Creates a new organization
 * @param name The name of the organization
 * @param slug The slug for the organization (optional - will be generated from name if not provided)
 * @returns A promise that resolves to the created organization or null if an error occurs
 */
export async function createOrganization(
  name: string,
  slug?: string
): Promise<Organization | null> {
  try {
    const response = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, slug }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Failed to create organization (${response.status})`;
      toast.error(errorMessage);
      return null;
    }

    const data = await response.json();
    toast.success("Organization created successfully!");
    return data as Organization;
  } catch (error) {
    console.error("[createOrganization] Network error:", error);
    toast.error("Network error while creating organization.");
    return null;
  }
}
