"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface BetterAuthClientUser {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
}

interface BetterAuthClientSession {
  data: { user: BetterAuthClientUser } | undefined;
  isPending: boolean;
}

export default function UserAuthDisplay() {
  const [isClient, setIsClient] = useState(false);
  const session = authClient.useSession() as BetterAuthClientSession;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Skeleton className="w-24 h-10 rounded-md" />;
  }

  const user = session.data?.user;
  const isLoading = session.isPending;

  if (isLoading) {
    return <Skeleton className="w-24 h-10 rounded-md" />;
  }

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut(); // Better Auth handles everything
      window.location.href = "/auth/goodbye"; // redirect after sign out
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/auth/sign-in?error=logout_failed";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback>
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user.email && (
          <div className="px-2 py-1.5 text-sm font-medium text-foreground/80">
            {user.email}
          </div>
        )}
        {user.email && <DropdownMenuSeparator />}
        <DropdownMenuItem asChild>
          <Link href="/user/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Panel</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownMenuSeparator() {
  return <div className="h-px bg-border my-1" />;
}
