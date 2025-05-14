"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotAuthenticatedCard() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in to access this page.</p>
          <Button asChild className="mt-4">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
