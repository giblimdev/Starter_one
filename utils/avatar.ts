//@/utils/avatar.ts

interface UserForAvatar {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AvatarProps {
  src: string | undefined;
  fallback: string;
  bgColor: string;
}

export function getUserAvatarProps(user?: UserForAvatar | null): AvatarProps {
  const src = user?.image || undefined;
  const fallback = user?.email?.charAt(0).toUpperCase() || "U";
  const bgColor = "#10B981";

  return { src, fallback, bgColor };
}
