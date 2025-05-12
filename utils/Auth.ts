// utils/Auth.ts
import { z } from "zod";

// Zod schema for authentication credentials (used for Sign-in and Sign-up)
export const AuthCredentialsSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" }) // Validates email format
    .min(1, { message: "Email is required" }), // Ensures email is not empty
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }), // Minimum password length
  // Add other fields here if they are common to both sign-in and sign-up (e.g., maybe a name field if required at both steps, though usually name is only on sign-up)
});

// Infer the TypeScript type from the schema
export type AuthCredentials = z.infer<typeof AuthCredentialsSchema>;

// You might export more specific schemas if Sign-up has extra fields or different validation
// export const SignInSchema = AuthCredentialsSchema; // Sign-in uses the base schema
// export const SignUpSchema = AuthCredentialsSchema.extend({
//   name: z.string().min(1, { message: "Name is required" }),
//   confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"], // Associate the error with the confirmPassword field
// });
