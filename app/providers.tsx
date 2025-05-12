// app/providers.tsx
"use client";

import { BetterAuthProvider } from "@/better-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <BetterAuthProvider>{children}</BetterAuthProvider>;
}
