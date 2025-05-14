// File: app/api/auth/reset-password/route.ts

import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Use a consistent naming format for logs
console.log("[reset-password] Initializing Better Auth route handler");

// Re-using the original approach with explicit error handling
const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  console.log("[reset-password] Processing POST request");
  try {
    return await handler.POST(req);
  } catch (error) {
    console.error("[reset-password] Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Password reset failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  console.log("[reset-password] Processing GET request");
  try {
    return await handler.GET(req);
  } catch (error) {
    console.error("[reset-password] Error in GET handler:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
