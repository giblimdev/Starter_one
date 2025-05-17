// app/auth/sign-in/page.tsx
"use client"; // This is essential for using hooks like useState and useRouter

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import { signIn } from "@/lib/auth/auth-client"; // Assume signIn is imported from here
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Import useRouter
import { AuthCredentialsSchema } from "@/utils/Auth"; // Import your Zod schema

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password toggle

  const router = useRouter(); // Initialize the router

  // Determine input type based on showPassword state
  const passwordInputType = showPassword ? "text" : "password";

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default browser form submission

    // --- Zod Validation (Client-side) ---
    const validationResult = AuthCredentialsSchema.safeParse({
      email: email,
      password: password,
      // The schema might have more fields, but we only validate the ones used here
    });

    if (!validationResult.success) {
      // Handle validation errors from Zod
      validationResult.error.errors.forEach((err) => {
        // Display validation errors to the user, e.g., using toast
        toast.error(err.message, {
          // Optional: Add a toast ID or other options if needed
        });
      });
      console.error(
        "Client-side validation failed:",
        validationResult.error.errors
      );
      return; // Stop the submission process if validation fails
    }
    // --- End Zod Validation ---

    // If validation succeeds, proceed with authentication
    // Use the validated data from validationResult.data
    const { email: validatedEmail, password: validatedPassword } =
      validationResult.data;

    setLoading(true); // Start loading state

    try {
      // Call the email/password sign-in method
      // Assume signIn.email returns { data: Session | null, error: Error | null }
      const { data, error } = await signIn.email({
        email: validatedEmail, // Use validated email
        password: validatedPassword, // Use validated password
        rememberMe: rememberMe, // Pass rememberMe state if supported by signIn.email
      });

      setLoading(false); // Stop loading state regardless of success/error

      if (error) {
        console.error("Sign in error:", error); // Log the error for debugging

        // --- Display specific error messages based on backend error ---
        // NOTE: The exact error.message strings or error.code values depend on your
        // better-auth backend implementation and how it returns errors.
        // Common secure practice is a generic message for invalid credentials.
        // Adjust the conditions below based on the actual error messages/codes you receive.
        if (
          error.message === "Invalid credentials" ||
          error.message === "Invalid email or password"
        ) {
          toast.error(
            "Invalid email or password. Please check your credentials."
          );
        } else if (error.message === "User not found") {
          // Less common for security, but handle if your backend does this
          toast.error("No user found with this email address.");
        } else {
          // Fallback generic error message for other issues (network, server error, etc.)
          toast.error(
            `Sign in failed: ${error.message || "An unknown error occurred."}`
          );
        }
        // --- End specific error messages ---
      } else {
        // Sign-in successful
        console.log("Sign in successful:", data);
        toast.success("Sign in successful!");
        // Redirect to the user dashboard
        router.push("/user/infoConnect"); // Use router.push for client-side navigation
      }
    } catch (caughtError) {
      setLoading(false); // Ensure loading stops even for unexpected errors
      console.error(
        "An unexpected error occurred during sign in:",
        caughtError
      );
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Function to handle social login clicks
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSocialSignIn = async (provider: string) => {
    // Optional: Add validation here if social sign-in requires email input too
    // For typical social sign-in, this click just initiates the redirect flow
    setLoading(true); // Indicate loading for social login too

    try {
      await signIn.social(
        {
          provider: provider as
            | "github"
            | "apple"
            | "discord"
            | "facebook"
            | "google"
            | "microsoft"
            | "spotify"
            | "twitch"
            | "twitter"
            | "dropbox"
            | "linkedin"
            | "gitlab"
            | "tiktok"
            | "reddit"
            | "roblox"
            | "vk"
            | "kick"
            | "zoom",
          // Ensure callbackURL points to where BetterAuth should redirect after social auth
          callbackURL: "/", // Use /user/dashboard for consistency
        }
        // onRequest/onResponse callbacks can potentially be used here too
      );
      // Note: signIn.social typically causes a page redirect initiated by the library,
      // so the lines after await might not always be reached before the browser navigates.
      // The loading state is ideally turned off by the library's onResponse callback
      // or reset on the new page after the redirect.
      console.log(`Initiating ${provider} sign-in...`);
    } catch (caughtError) {
      // setLoading(false); // Might be needed if onResponse is not reliable
      console.error(`Error initiating ${provider} sign-in:`, caughtError);
      toast.error(`Failed to initiate ${provider} sign-in.`);
    } finally {
      // setLoading(false); // Ensures loading stops if try/catch completes without redirect
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <Card className=" rounded-lg rounded-t-none max-w-md w-full pt-0 pb-4">
        {" "}
        {/* Added w-full for responsiveness */}
        <CardHeader className="p-2 bg-gradient-to-r from-pink-400 to-blue-500 text-white rounded-t-md">
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm  text-white/90">
            Enter your email and password below to login or use your social
            account
          </CardDescription>
        </CardHeader>
        {/* Wrap email/password form fields and button in a <form> element */}
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email" // Use type="email" for semantic HTML
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  autoComplete="email" // Auto-fill for email
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    // Update href to your actual forgot password page or modal trigger
                    href="/auth/forgot-password" // Example link
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                {/* Relative container for password input and toggle icon */}
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordInputType} // Use the state-controlled type (password/text)
                    placeholder="password"
                    autoComplete="current-password" // Auto-fill for login password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10" // Add right padding to make space for the icon button
                  />
                  {/* Password visibility toggle button */}
                  <Button
                    type="button" // Crucial: Prevent this button from submitting the form
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)} // Toggle state
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    } // Accessibility label
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-muted-foreground" /> // Icon when password is shown
                    ) : (
                      <Eye size={16} className="text-muted-foreground" /> // Icon when password is hidden
                    )}
                  </Button>
                </div>{" "}
                {/* End of password input relative container */}
              </div>

              <div className="flex items-center gap-2">
                {/* Use checked and onCheckedChange props for Checkbox */}
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)} // !!checked ensures boolean
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              {/* This button type="submit" will trigger the form's onSubmit */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading} // Disable during any login attempt (email or social)
              >
                {loading ? (
                  // Display loader when loading is true
                  <>
                    {" "}
                    {/* Use fragment if combining icon and text */}
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Login in...
                  </>
                ) : (
                  // Display login text when not loading
                  <span>Login</span>
                )}
              </Button>
            </div>{" "}
            {/* End of grid gap-4 */}
          </CardContent>
        </form>{" "}
        {/* End of email/password form */}
        {/* Social login buttons section (can be outside the main email/password form) */}
        <CardContent className="pt-4">
          {" "}
          {/* Add padding top if needed after form */}
          {/* Separator "Or continue with" */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          {/* Social Login Buttons Grid */}
          <div
            className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-wrap" // Allows buttons to wrap on smaller screens
            )}
          ></div>{" "}
          {/* End Social Login Buttons Grid */}
        </CardContent>
        {/* Signup link footer */}
        <CardFooter className="text-center text-sm mt-4 block">
          {" "}
          {/* Use block to center */}
          Don&apos;t have an account ?{" "}
          <Link href="/auth/sign-up" className="underline">
            &nbsp;Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
