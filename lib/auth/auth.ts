// File: lib/auth/auth.ts

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/auth/resend";

export const auth = betterAuth({
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      // Default password behavior
    },
    async sendResetPassword(data) {
      console.log("[auth] Sending reset password email to:", data.user.email);
      try {
        const result = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "no-reply@yourdomain.com",
          to: data.user.email,
          subject: "Reset Your Password",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Password Reset</h1>
              <p>You have requested to reset your password.</p>
              <a href="${data.url}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p style="color: #666;">This link will expire in 1 hour.</p>
              <p style="color: #666;">If you did not request this, please ignore this email.</p>
            </div>
          `,
          text: `
            Password Reset

            You have requested to reset your password.
            Click the link below to proceed: ${data.url}
            This link will expire in 1 hour.

            If you did not request this, please ignore this email.
          `,
        });
        console.log("[auth] Reset password email sent successfully", result);
        // No return needed; function should return void
      } catch (error) {
        console.error(
          `[auth] Failed to send reset email to ${data.user.email}:`,
          error
        );
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
    },
  },
  // Ensure routes are correctly defined - use paths that match your app structure
  routes: {
    forgotPassword: {
      path: "/api/auth/forgot-password",
      // Include any additional configuration if needed
    },
    resetPassword: {
      path: "/api/auth/reset-password",
    },
    // Include other routes if needed
  },
  plugins: [nextCookies()],
});

console.log("[auth] Better Auth initialized");

export default auth;
