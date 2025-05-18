// @/hooks/useProfessional.ts
import { create } from "zustand";

interface ProfilePro {
  id: string;
  profileId: string;
  updatedAt: string;
  organizations: { id: string; name: string; slug: string }[];
  projects: { id: string; name: string; organizationId: string }[];
}

interface ProfessionalState {
  userId: string | null;
  profileId: string | null;
  profileProId: string | null;
  profilePro: ProfilePro | null;
  loading: boolean;
  error: string | null;
  fetchProfilePro: () => Promise<void>;
  setUserProfileData: (data: {
    userId: string;
    profileId: string;
    profileProId: string | null;
  }) => void;
  reset: () => void;
}

export const useProfessional = create<ProfessionalState>((set) => ({
  userId: null,
  profileId: null,
  profileProId: null,
  profilePro: null,
  loading: false,
  error: null,
  fetchProfilePro: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/user/profile/proProfil", {
        credentials: "include",
      });
      if (res.ok) {
        const data: ProfilePro[] = await res.json();
        const profilePro = data.length > 0 ? data[0] : null;
        set({
          profilePro,
          profileProId: profilePro ? profilePro.id : null,
          loading: false,
        });
      } else {
        set({
          error: "Erreur lors du chargement du profil professionnel",
          loading: false,
        });
      }
    } catch {
      set({
        error: "Erreur réseau. Veuillez vérifier votre connexion.",
        loading: false,
      });
    }
  },
  setUserProfileData: (data) =>
    set({
      userId: data.userId,
      profileId: data.profileId,
      profileProId: data.profileProId,
    }),
  reset: () =>
    set({
      userId: null,
      profileId: null,
      profileProId: null,
      profilePro: null,
      loading: false,
      error: null,
    }),
}));
