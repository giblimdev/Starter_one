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
      <Card className="p-10 max-w-md w-full">
        {" "}
        {/* Added w-full for responsiveness */}
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
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
          >
            {/* Google Button */}
            <Button
              variant="outline"
              className={cn("flex-grow")} // Allows buttons to grow/shrink
              disabled={loading}
              onClick={() => handleSocialSignIn("google")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
                className="mr-2"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              Google
            </Button>

            {/* Facebook Button */}
            <Button
              variant="outline"
              className={cn("flex-grow")}
              disabled={loading}
              onClick={() => handleSocialSignIn("facebook")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <path
                  d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
                  fill="currentColor"
                ></path>
              </svg>
              Facebook
            </Button>

            {/* Microsoft Button */}
            <Button
              variant="outline"
              className={cn("flex-grow")}
              disabled={loading}
              onClick={() => handleSocialSignIn("microsoft")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <path
                  fill="currentColor"
                  d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
                ></path>
              </svg>
              Microsoft
            </Button>

            {/* LinkedIn Button */}
            <Button
              variant="outline"
              className={cn("flex-grow")}
              disabled={loading}
              onClick={() => handleSocialSignIn("linkedin")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <path
                  fill="currentColor"
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                ></path>
              </svg>
              LinkedIn
            </Button>
          </div>{" "}
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
