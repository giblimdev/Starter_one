// File: app/api/auth/forgot-password/route.ts

import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Use a consistent naming format for logs
console.log(
  "forgot-password non dynamique Initializing Better Auth route handler"
);

// Re-using the original approach with explicit error handling
const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  console.log("[forgot-password] Processing POST request");
  try {
    return await handler.POST(req);
  } catch (error) {
    console.error("[forgot-password] Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Password reset failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  console.log("[forgot-password] Processing GET request");
  try {
    return await handler.GET(req);
  } catch (error) {
    console.error("[forgot-password] Error in GET handler:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
