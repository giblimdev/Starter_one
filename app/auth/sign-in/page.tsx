// app/auth/sign-in/page.tsx
"use client";

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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthCredentialsSchema } from "@/utils/Auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const passwordInputType = showPassword ? "text" : "password";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = AuthCredentialsSchema.safeParse({
      email: email,
      password: password,
    });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      console.error(
        "Client-side validation failed:",
        validationResult.error.errors
      );
      return;
    }

    const { email: validatedEmail, password: validatedPassword } =
      validationResult.data;
    setLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: validatedEmail,
        password: validatedPassword,
        rememberMe: rememberMe,
      });

      setLoading(false);

      if (error) {
        console.error("Sign in error:", error);

        if (
          error.message === "Invalid credentials" ||
          error.message === "Invalid email or password"
        ) {
          toast.error(
            "Invalid email or password. Please check your credentials."
          );
        } else if (error.message === "User not found") {
          toast.error("No user found with this email address.");
        } else {
          toast.error(
            `Sign in failed: ${error.message || "An unknown error occurred."}`
          );
        }
      } else {
        console.log("Sign in successful:", data);
        toast.success("Sign in successful!");
        router.push("/user/infoConnect");
      }
    } catch (caughtError) {
      setLoading(false);
      console.error(
        "An unexpected error occurred during sign in:",
        caughtError
      );
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setLoading(true);

    try {
      await signIn.social({
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
        callbackURL: "/",
      });
      console.log(`Initiating ${provider} sign-in...`);
    } catch (caughtError) {
      console.error(`Error initiating ${provider} sign-in:`, caughtError);
      toast.error(`Failed to initiate ${provider} sign-in.`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden border-none shadow-xl dark:bg-slate-950/90 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader className="space-y-1 pb-8 pt-6">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  autoComplete="email"
                  className="h-11 rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordInputType}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10 rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-muted-foreground" />
                    ) : (
                      <Eye size={16} className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </Button>
            </CardContent>
          </form>

          <CardContent className="pb-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-slate-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                variant="outline"
                className="h-11 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                disabled={loading}
                onClick={() => handleSocialSignIn("google")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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

              <Button
                variant="outline"
                className="h-11 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                disabled={loading}
                onClick={() => handleSocialSignIn("facebook")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="mr-2 text-blue-600"
                >
                  <path
                    d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
                    fill="currentColor"
                  ></path>
                </svg>
                Facebook
              </Button>

              <Button
                variant="outline"
                className="h-11 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                disabled={loading}
                onClick={() => handleSocialSignIn("microsoft")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="mr-2 text-slate-700"
                >
                  <path
                    fill="currentColor"
                    d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
                  ></path>
                </svg>
                Microsoft
              </Button>

              <Button
                variant="outline"
                className="h-11 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                disabled={loading}
                onClick={() => handleSocialSignIn("linkedin")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="mr-2 text-blue-700"
                >
                  <path
                    fill="currentColor"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                  ></path>
                </svg>
                LinkedIn
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pb-6 pt-0">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
